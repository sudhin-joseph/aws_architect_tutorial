import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "labs/m09/check_plan.py"
SPEC = importlib.util.spec_from_file_location("m09_plan", SCRIPT)
checker = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(checker)
BASE = json.loads((ROOT / "labs/m09/network-plan.json").read_text())


class PlanTests(unittest.TestCase):
    def test_baseline_passes(self):
        self.assertEqual(checker.validate(copy.deepcopy(BASE)), [])

    def test_zonal_extension_and_wrong_az(self):
        plan = copy.deepcopy(BASE)
        plan["egress"] = "zonal"
        for az in ("A", "B"):
            plan["routeTables"]["app-" + az].append({"destination": "0.0.0.0/0", "target": "nat-" + az})
        self.assertEqual(checker.validate(plan), [])
        plan["routeTables"]["app-B"][-1]["target"] = "nat-A"
        self.assertTrue(any("incorrect zonal target" in e for e in checker.validate(plan)))

    def test_address_failures(self):
        for cidr, expected in [("10.90.0.0/24", "overlaps"), ("10.90.10.0/25", "insufficient"),
                               ("10.91.10.0/24", "outside VPC"), ("10.90.10.1/24", "host bits"),
                               ("10.90.10.0/29", "prefix")]:
            with self.subTest(cidr=cidr):
                plan = copy.deepcopy(BASE)
                plan["subnets"][2]["cidr"] = cidr
                self.assertTrue(any(expected in e for e in checker.validate(plan)))

    def test_routing_and_exposure_failures(self):
        cases = []
        p = copy.deepcopy(BASE)
        p["routeTables"]["data"].append({"destination": "0.0.0.0/0", "target": "igw"})
        cases.append(p)
        p = copy.deepcopy(BASE)
        p["subnets"][4]["routeTable"] = "public"
        cases.append(p)
        p = copy.deepcopy(BASE)
        p["subnets"][0]["autoAssignPublicIpv4"] = True
        cases.append(p)
        p = copy.deepcopy(BASE)
        p["subnets"][1]["az"] = "A"
        cases.append(p)
        p = copy.deepcopy(BASE)
        p["subnets"][2]["requiredAddresses"] = True
        cases.append(p)
        for plan in cases:
            self.assertTrue(checker.validate(plan))

    def test_missing_and_malformed_data_fail_closed(self):
        for plan in [None, [], {}, {"vpcCidr": "broken"}, {"vpcCidr": "10.90.0.0/16"}]:
            self.assertTrue(checker.validate(plan))
        p = copy.deepcopy(BASE)
        p["routeTables"]["public"] = None
        self.assertTrue(checker.validate(p))

    def test_cli_success_and_missing_file(self):
        result = subprocess.run([sys.executable, "-B", str(SCRIPT), str(ROOT / "labs/m09/network-plan.json")],
                                capture_output=True, text=True, check=False)
        self.assertEqual(result.returncode, 0)
        self.assertIn("LOCAL PLAN ONLY", result.stdout)
        result = subprocess.run([sys.executable, "-B", str(SCRIPT), str(ROOT / "labs/m09/absent.json")],
                                capture_output=True, text=True, check=False)
        self.assertEqual(result.returncode, 1)
        self.assertIn("FAIL", result.stderr)


if __name__ == "__main__":
    unittest.main()

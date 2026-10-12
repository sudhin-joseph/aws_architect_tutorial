import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

LAB = Path(__file__).resolve().parents[1] / "labs" / "m11"
spec = importlib.util.spec_from_file_location("m11_plan", LAB / "check_plan.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class HybridPlanTests(unittest.TestCase):
    def setUp(self):
        self.plan = json.loads((LAB / "network-plan.json").read_text())

    def test_sample_and_cli_are_explicitly_offline(self):
        self.assertEqual(checker.check(self.plan), [])
        result = subprocess.run([sys.executable, "-B", str(LAB / "check_plan.py")], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        self.assertIn("No AWS state", result.stdout)

    def test_missing_return_route_and_more_specific_wrong_route(self):
        self.plan["aws_routes"].pop()
        self.assertTrue(any("return path" in e for e in checker.check(self.plan)))
        self.setUp()
        self.plan["aws_routes"].append({"destination":"10.60.10.20/32","target":"igw"})
        self.assertTrue(any("longest-prefix" in e for e in checker.check(self.plan)))

    def test_duplicate_routes_are_rejected_instead_of_tie_breaking(self):
        self.plan["aws_routes"].append(copy.deepcopy(self.plan["aws_routes"][-1]))
        self.assertTrue(any("duplicate" in e for e in checker.check(self.plan)))

    def test_overlap_outside_subnets_and_reserved_addresses(self):
        for field, value in [("aws_vpc","10.60.0.0/16"),("customer_subnet","10.61.10.0/24"),("customer_host","10.60.10.3"),("aws_host","10.80.20.255"),("aws_vpc","2001:db8::/32"),("aws_subnet","10.80.20.0/29")]:
            with self.subTest(field=field, value=value):
                p=copy.deepcopy(self.plan);p[field]=value
                self.assertTrue(checker.check(p))

    def test_forwarding_flags_are_strict_booleans(self):
        for field, value in [("ip_forward",False),("source_dest_check",True),("snat_inner_traffic",True),("ip_forward","true"),("source_dest_check",0)]:
            p=copy.deepcopy(self.plan);p["appliance"][field]=value
            self.assertTrue(checker.check(p))

    def test_surviving_capacity_and_shedding(self):
        for update in [{"critical_mbps":650},{"critical_mbps":600},{"backup_mbps":0},{"pause_bulk_on_failover":False},{"critical_mbps":True},{"backup_mbps":float("nan")},{"bulk_mbps":-1},{"pause_bulk_on_failover":"true"}]:
            p=copy.deepcopy(self.plan);p["capacity"].update(update)
            self.assertTrue(checker.check(p),update)

    def test_tunnel_names_and_claimed_test_mode(self):
        for update in [{"tunnels":[]},{"tunnels":[{"name":"same","configured":True}]*2},{"test_mode":"automatic-ha"}]:
            p=copy.deepcopy(self.plan);p.update(update)
            self.assertTrue(checker.check(p))

    def test_malformed_model_and_nested_values_fail_closed(self):
        for p in [None,[],{},dict(self.plan,capacity=[]),dict(self.plan,appliance=None),dict(self.plan,aws_routes=[None]),dict(self.plan,tunnels=[None,None]),dict(self.plan,customer_host=123)]:
            with self.subTest(plan=p):
                self.assertTrue(checker.check(p))
        with tempfile.TemporaryDirectory() as folder:
            target=Path(folder)/"bad.json";target.write_text("{broken")
            result=subprocess.run([sys.executable,"-B",str(LAB/"check_plan.py"),str(target)],capture_output=True,text=True)
            self.assertEqual(result.returncode,1)
            self.assertIn("cannot read JSON",result.stdout)
            self.assertNotIn("Traceback",result.stderr)


if __name__ == "__main__":
    unittest.main()

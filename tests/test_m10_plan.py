import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'labs/m10/check_plan.py'
SPEC = importlib.util.spec_from_file_location('m10_plan', SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
BASE = json.loads((SCRIPT.parent / 'network-plan.json').read_text())


class PlanTests(unittest.TestCase):
    def test_baseline(self):
        self.assertEqual(MODULE.validate(BASE), [])

    def test_missing_return_at_each_routing_layer(self):
        for layer in ['vpc', 'tgw']:
            plan = copy.deepcopy(BASE)
            if layer == 'vpc':
                plan['vpcs']['B']['routes'] = []
            else:
                plan['tgw_tables']['lab'] = [r for r in plan['tgw_tables']['lab'] if r['target'] != 'A']
            self.assertTrue(MODULE.validate(plan))

    def test_ingress_association_not_other_table(self):
        plan = copy.deepcopy(BASE)
        plan['tgw_tables']['empty'] = []
        plan['associations']['B'] = 'empty'
        self.assertTrue(MODULE.validate(plan))

    def test_specific_blackhole_beats_broad_allow(self):
        for routes in [('vpcs', 'A'), ('tgw_tables', 'lab')]:
            plan = copy.deepcopy(BASE)
            target = plan[routes[0]][routes[1]]
            if isinstance(target, dict):
                target = target['routes']
            target.append({'destination': '10.101.10.128/28', 'target': 'blackhole'})
            self.assertTrue(MODULE.validate(plan))

    def test_remote_gateway_does_not_satisfy_local_requirement(self):
        plan = copy.deepcopy(BASE)
        plan['s3_requirements']['B'] = 'local-gateway'
        self.assertTrue(MODULE.validate(plan))
        plan['vpcs']['B']['s3_gateway'] = True
        self.assertEqual(MODULE.validate(plan), [])

    def test_overlapping_vpcs_and_subnets(self):
        plan = copy.deepcopy(BASE)
        plan['vpcs']['B'] = copy.deepcopy(plan['vpcs']['A'])
        self.assertTrue(MODULE.validate(plan))
        plan = copy.deepcopy(BASE)
        plan['vpcs']['A']['attachment_subnet'] = '10.100.10.0/24'
        self.assertTrue(MODULE.validate(plan))

    def test_invalid_shapes_and_values_fail_cleanly(self):
        for data in [None, [], {}, {'vpcs': []}]:
            self.assertTrue(MODULE.validate(data))
        for key, value in [('cidr', 'not-cidr'), ('worker_subnet', '10.100.10.1/24'), ('s3_gateway', 'yes')]:
            plan = copy.deepcopy(BASE)
            plan['vpcs']['A'][key] = value
            self.assertTrue(MODULE.validate(plan))

    def test_cli_status_and_scope(self):
        result = subprocess.run([sys.executable, '-B', str(SCRIPT), str(SCRIPT.parent/'network-plan.json')], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0)
        self.assertIn('NOT validated', result.stdout)
        result = subprocess.run([sys.executable, '-B', str(SCRIPT), '/nonexistent/m10.json'], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)


if __name__ == '__main__':
    unittest.main()

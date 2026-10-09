"""Local fixtures only; no AWS credentials or network calls."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("m08_validator", ROOT / "labs/m08/validate.py")
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)
TEMPLATE = json.loads((ROOT / "labs/m08/template.json").read_text())


def fixture():
    acl = copy.deepcopy(TEMPLATE["Resources"]["WebAcl"]["Properties"])
    acl["ARN"] = "arn:aws:wafv2:us-east-1:123456789012:regional/webacl/test/id"
    acl["Rules"][1]["Action"] = {"Count": {}}
    topic = "arn:aws:sns:us-east-1:123456789012:m08-test"
    event = copy.deepcopy(TEMPLATE["Resources"]["SampleRule"]["Properties"]["EventPattern"])
    event["account"] = ["123456789012"]
    return {
        "outputs": {"SecurityGroupId": "sg-test", "WebAclArn": acl["ARN"], "TopicArn": topic},
        "parameters": {"LearnerCidr": "8.8.8.8/32", "Email": "learner@example.com", "RateAction": "Count"},
        "status": "CREATE_COMPLETE", "account": "123456789012", "acl": {"WebACL": acl},
        "association": {"WebACL": {"ARN": acl["ARN"]}},
        "alb": {"LoadBalancers": [{"State": {"Code": "active"}, "Scheme": "internet-facing",
                "IpAddressType": "ipv4", "Type": "application", "SecurityGroups": ["sg-test"]}]},
        "listeners": {"Listeners": [{"Port": 80, "Protocol": "HTTP", "DefaultActions": [
            {"Type": "fixed-response", "FixedResponseConfig": {"StatusCode": "200"}}]}]},
        "sg": {"SecurityGroups": [{"IpPermissions": [{"IpProtocol": "tcp", "FromPort": 80,
            "ToPort": 80, "IpRanges": [{"CidrIp": "8.8.8.8/32"}]}]}]},
        "detector": {"Status": "ENABLED"}, "rule": {"State": "ENABLED", "EventPattern": json.dumps(event)},
        "targets": {"Targets": [{"Arn": topic}]},
        "topic": {"Attributes": {"Policy": json.dumps({"Statement": [{"Effect": "Allow",
            "Principal": {"Service": "events.amazonaws.com"}, "Action": "sns:Publish", "Resource": topic}]})}},
        "subscriptions": {"Subscriptions": [{"Protocol": "email", "Endpoint": "learner@example.com",
            "TopicArn": topic, "SubscriptionArn": topic + ":subscription-id"}]}
    }


class ValidatorTests(unittest.TestCase):
    def test_count_and_block_snapshots_pass(self):
        for action in ("Count", "Block"):
            s = fixture()
            s["parameters"]["RateAction"] = action
            s["acl"]["WebACL"]["Rules"][1]["Action"] = {action: {}}
            results = validator.evaluate(s)
            self.assertEqual(len(results), 15)
            self.assertTrue(all(ok for _, ok in results), results)

    def test_api_base64_search_string_passes(self):
        import base64
        s = fixture()
        for match in (s["acl"]["WebACL"]["Rules"][0]["Statement"]["ByteMatchStatement"],
                      s["acl"]["WebACL"]["Rules"][1]["Statement"]["RateBasedStatement"]["ScopeDownStatement"]["ByteMatchStatement"]):
            match["SearchString"] = base64.b64encode(match["SearchString"].encode()).decode()
        self.assertTrue(all(ok for _, ok in validator.evaluate(s)))

    def test_unsafe_or_missing_configuration_fails(self):
        def mutate(s, case):
            if case == "broad ingress":
                s["sg"]["SecurityGroups"][0]["IpPermissions"][0]["IpRanges"] = [{"CidrIp": "0.0.0.0/0"}]
            elif case == "extra ingress":
                s["sg"]["SecurityGroups"][0]["IpPermissions"].append({"IpProtocol": "-1"})
            elif case == "wrong acl":
                s["association"]["WebACL"]["ARN"] = "another-acl"
            elif case == "disabled detector":
                s["detector"]["Status"] = "DISABLED"
            elif case == "all findings":
                pattern = json.loads(s["rule"]["EventPattern"])
                del pattern["detail"]
                s["rule"]["EventPattern"] = json.dumps(pattern)
            elif case == "pending email":
                s["subscriptions"]["Subscriptions"][0]["SubscriptionArn"] = "PendingConfirmation"
            elif case == "no publish grant":
                s["topic"]["Attributes"]["Policy"] = '{"Statement": []}'
            elif case == "wrong rate action":
                s["acl"]["WebACL"]["Rules"][1]["Action"] = {"Allow": {}}
            elif case == "wrong rate path":
                s["acl"]["WebACL"]["Rules"][1]["Statement"]["RateBasedStatement"]["ScopeDownStatement"]["ByteMatchStatement"]["SearchString"] = "/"
            elif case == "failed stack":
                s["status"] = "ROLLBACK_COMPLETE"
        for case in ("broad ingress", "extra ingress", "wrong acl", "disabled detector", "all findings",
                     "pending email", "no publish grant", "wrong rate action", "wrong rate path", "failed stack"):
            with self.subTest(case=case):
                s = fixture()
                mutate(s, case)
                self.assertTrue(any(not ok for _, ok in validator.evaluate(s)))

    def test_missing_evidence_is_not_success(self):
        s = fixture()
        del s["acl"]["WebACL"]["Rules"]
        with self.assertRaises(KeyError):
            validator.evaluate(s)

    def test_wrong_account_stops_before_other_calls(self):
        args = ["validate.py", "--profile", "lab", "--region", "us-east-1", "--stack", "m08-security-lab",
                "--expected-account", "123456789012"]
        result = subprocess.CompletedProcess([], 0, '{"Account":"999999999999"}', '')
        with patch.object(sys, "argv", args), patch.object(validator.subprocess, "run", return_value=result) as run:
            self.assertEqual(validator.main(), 1)
            self.assertEqual(run.call_count, 1)
            self.assertIn("get-caller-identity", run.call_args.args[0])

    def test_cli_permission_failure_exits_nonzero(self):
        args = ["validate.py", "--profile", "lab", "--region", "us-east-1", "--stack", "m08-security-lab",
                "--expected-account", "123456789012"]
        with patch.object(sys, "argv", args), patch.object(validator.subprocess, "run",
                side_effect=subprocess.CalledProcessError(254, ["aws"])):
            self.assertEqual(validator.main(), 1)


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""Read-only L08 configuration checks. No HTTP tests or AWS mutations.

Requires Python 3 and AWS CLI v2. API errors and missing evidence fail closed.
Does not verify email receipt, rate enforcement, real detection or cleanup.
"""
import argparse
import ipaddress
import json
import re
import subprocess
import sys


def evaluate(s):
    """Return named checks for an already collected snapshot (also fixture-testable)."""
    outputs, parameters = s["outputs"], s["parameters"]
    acl = s["acl"]["WebACL"]
    rules = {r["Name"]: r for r in acl["Rules"]}
    block, rate = rules["BlockTestPath"], rules["RateTestPath"]
    statement = rate["Statement"]["RateBasedStatement"]
    pattern = json.loads(s["rule"]["EventPattern"])
    policy = json.loads(s["topic"]["Attributes"]["Policy"])
    grants = policy.get("Statement", [])
    if isinstance(grants, dict):
        grants = [grants]
    cidr = ipaddress.ip_network(parameters["LearnerCidr"])
    ingress = s["sg"]["SecurityGroups"][0]["IpPermissions"]
    expected_ingress = len(ingress) == 1 and (
        ingress[0].get("IpProtocol") == "tcp"
        and ingress[0].get("FromPort") == 80 and ingress[0].get("ToPort") == 80
        and [r["CidrIp"] for r in ingress[0].get("IpRanges", [])] == [str(cidr)]
        and not ingress[0].get("Ipv6Ranges") and not ingress[0].get("UserIdGroupPairs")
        and not ingress[0].get("PrefixListIds")
    )
    def exact_path(rule_statement, path):
        match = rule_statement.get("ByteMatchStatement", {})
        # AWS CLI serializes this blob as base64; fixtures may use decoded text.
        import base64
        return (match.get("FieldToMatch") == {"UriPath": {}}
                and match.get("PositionalConstraint") == "EXACTLY"
                and match.get("SearchString") in (path, base64.b64encode(path.encode()).decode())
                and match.get("TextTransformations") == [{"Priority": 0, "Type": "NONE"}])
    listeners = s["listeners"]["Listeners"]
    alb = s["alb"]["LoadBalancers"][0]
    return [
        ("Stack is ready", s["status"] in ("CREATE_COMPLETE", "UPDATE_COMPLETE")),
        ("ALB is active, IPv4 and internet-facing", alb["State"]["Code"] == "active"
         and alb["Scheme"] == "internet-facing" and alb["IpAddressType"] == "ipv4"
         and alb["Type"] == "application" and alb["SecurityGroups"] == [outputs["SecurityGroupId"]]),
        ("Only learner /32 has HTTP ingress", cidr.version == 4 and cidr.prefixlen == 32
         and cidr.network_address.is_global and expected_ingress),
        ("Listener only serves synthetic fixed response", len(listeners) == 1
         and listeners[0]["Port"] == 80 and listeners[0]["Protocol"] == "HTTP"
         and len(listeners[0]["DefaultActions"]) == 1
         and listeners[0]["DefaultActions"][0]["Type"] == "fixed-response"
         and listeners[0]["DefaultActions"][0]["FixedResponseConfig"]["StatusCode"] == "200"),
        ("Expected WAF ACL is associated", s["association"]["WebACL"]["ARN"] == outputs["WebAclArn"] == acl["ARN"]),
        ("Only the two lab rules are present with Allow default", len(rules) == 2 and acl["DefaultAction"] == {"Allow": {}}),
        ("Deterministic path blocks first", block["Priority"] == 0 and block["Action"] == {"Block": {}}
         and exact_path(block["Statement"], "/blocked")),
        ("Rate test is scoped, IP-based, 100/60s", rate["Priority"] == 10
         and statement["Limit"] == 100 and statement["EvaluationWindowSec"] == 60
         and statement["AggregateKeyType"] == "IP"
         and exact_path(statement["ScopeDownStatement"], "/rate-test")),
        ("Rate action matches stack parameter", parameters["RateAction"] in ("Count", "Block")
         and rate["Action"] == {parameters["RateAction"]: {}}),
        ("WAF metric and sample visibility enabled", all(r["VisibilityConfig"]["CloudWatchMetricsEnabled"]
         and r["VisibilityConfig"]["SampledRequestsEnabled"] for r in (acl, block, rate))),
        ("GuardDuty detector is enabled", s["detector"]["Status"] == "ENABLED"),
        ("Rule matches only this account's GuardDuty samples", s["rule"]["State"] == "ENABLED" and pattern == {
            "source": ["aws.guardduty"], "detail-type": ["GuardDuty Finding"], "account": [s["account"]],
            "detail": {"service": {"additionalInfo": {"sample": [True]}}}}),
        ("Rule has only the expected SNS target", len(s["targets"]["Targets"]) == 1
         and s["targets"]["Targets"][0]["Arn"] == outputs["TopicArn"]),
        ("SNS policy permits EventBridge on this topic", any(
            p.get("Effect") == "Allow" and p.get("Principal") == {"Service": "events.amazonaws.com"}
            and p.get("Action") == "sns:Publish" and p.get("Resource") == outputs["TopicArn"]
            and not p.get("Condition") for p in grants)),
        ("Expected email subscription is confirmed", any(
            p.get("Protocol") == "email" and p.get("Endpoint") == parameters["Email"]
            and p.get("TopicArn") == outputs["TopicArn"]
            and p.get("SubscriptionArn", "").startswith(outputs["TopicArn"] + ":")
            for p in s["subscriptions"]["Subscriptions"]))
    ]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for flag in ("profile", "region", "stack", "expected-account"):
        parser.add_argument("--" + flag, required=True)
    args = parser.parse_args()
    if not re.fullmatch(r"[0-9]{12}", args.expected_account):
        parser.error("--expected-account must be a 12-digit account ID")

    def aws(service, operation, *options):
        command = ["aws", "--profile", args.profile, "--region", args.region,
                   "--output", "json", "--no-cli-pager", service, operation, *options]
        result = subprocess.run(command, capture_output=True, text=True, timeout=60, check=True)
        return json.loads(result.stdout)

    try:
        identity = aws("sts", "get-caller-identity")
        if identity["Account"] != args.expected_account:
            raise ValueError("Account mismatch: no lab checks performed")
        stack = aws("cloudformation", "describe-stacks", "--stack-name", args.stack)["Stacks"][0]
        o = {p["OutputKey"]: p["OutputValue"] for p in stack.get("Outputs", [])}
        p = {p["ParameterKey"]: p["ParameterValue"] for p in stack["Parameters"]}
        s = {"outputs": o, "parameters": p, "status": stack["StackStatus"], "account": identity["Account"],
             "acl": aws("wafv2", "get-web-acl", "--scope", "REGIONAL", "--id", o["WebAclId"], "--name", o["WebAclName"]),
             "association": aws("wafv2", "get-web-acl-for-resource", "--resource-arn", o["AlbArn"]),
             "alb": aws("elbv2", "describe-load-balancers", "--load-balancer-arns", o["AlbArn"]),
             "listeners": aws("elbv2", "describe-listeners", "--load-balancer-arn", o["AlbArn"]),
             "sg": aws("ec2", "describe-security-groups", "--group-ids", o["SecurityGroupId"]),
             "rule": aws("events", "describe-rule", "--name", o["RuleName"]),
             "targets": aws("events", "list-targets-by-rule", "--rule", o["RuleName"]),
             "topic": aws("sns", "get-topic-attributes", "--topic-arn", o["TopicArn"]),
             "subscriptions": aws("sns", "list-subscriptions-by-topic", "--topic-arn", o["TopicArn"]),
             "detector": aws("guardduty", "get-detector", "--detector-id", o["DetectorId"])}
        results = evaluate(s)
        for label, ok in results:
            print(("PASS " if ok else "FAIL ") + label)
        print("Configuration only: separately verify HTTP responses, rate observations, email receipt and cleanup.")
        return 0 if all(ok for _, ok in results) else 1
    except (KeyError, IndexError, TypeError, ValueError, OSError, subprocess.SubprocessError) as error:
        # Do not print raw CLI responses that could expose account data.
        print("FAIL: incomplete configuration evidence or AWS CLI error (" + type(error).__name__
              + "). Check identity, permissions, stack status and required outputs.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

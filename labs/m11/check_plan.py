#!/usr/bin/env python3
"""Check a local L11 teaching model. No AWS, network, provisioning or secret access."""
import argparse
import ipaddress
import json
import math
from pathlib import Path


def check(plan):
    """Return modeled errors; malformed inputs fail closed with an explanatory error."""
    errors = []
    try:
        if not isinstance(plan, dict):
            raise ValueError("plan must be an object")
        if plan.get("scope") != "offline-model-only":
            errors.append("scope must explicitly be offline-model-only")
        networks = {}
        for field in ("customer_vpc", "aws_vpc", "customer_subnet", "aws_subnet"):
            value = plan[field]
            if not isinstance(value, str):
                raise ValueError(field + " must be an IPv4 CIDR string")
            networks[field] = ipaddress.IPv4Network(value, strict=True)
        if networks["customer_vpc"].overlaps(networks["aws_vpc"]):
            errors.append("customer and AWS VPC ranges overlap")
        hosts = {}
        for side in ("customer", "aws"):
            vpc, subnet = networks[side + "_vpc"], networks[side + "_subnet"]
            if not 16 <= vpc.prefixlen <= 28 or not 16 <= subnet.prefixlen <= 28:
                errors.append(side + ": use AWS IPv4 VPC/subnet sizes /16 through /28")
            if not subnet.subnet_of(vpc):
                errors.append(side + " subnet is outside its VPC")
            host_value = plan[side + "_host"]
            if not isinstance(host_value, str):
                raise ValueError(side + "_host must be an IPv4 address string")
            host = ipaddress.IPv4Address(host_value)
            hosts[side] = host
            if host not in subnet or int(host) - int(subnet.network_address) < 4 or host == subnet.broadcast_address:
                errors.append(side + " host must be a usable, non-reserved subnet address")
        for side, remote, expected in (("customer", "aws", "appliance"), ("aws", "customer", "vgw")):
            routes = plan[side + "_routes"]
            if not isinstance(routes, list):
                raise ValueError(side + " routes must be a list")
            parsed, seen = [], set()
            for route in routes:
                if not isinstance(route, dict) or not isinstance(route.get("destination"), str) or not isinstance(route.get("target"), str):
                    raise ValueError(side + " route must contain destination and target strings")
                prefix = ipaddress.IPv4Network(route["destination"], strict=True)
                if prefix in seen:
                    errors.append(side + ": duplicate destination " + str(prefix))
                seen.add(prefix)
                parsed.append((prefix, route["target"]))
            if (networks[side + "_vpc"], "local") not in parsed:
                errors.append(side + ": missing local VPC route")
            matching = [(p.prefixlen, target) for p, target in parsed if hosts[remote] in p]
            if not matching:
                errors.append(side + ": no route to test destination (return path required)")
            elif max(matching, key=lambda x: x[0])[1] != expected:
                errors.append(side + ": longest-prefix route selects the wrong target; expected " + expected)
        appliance = plan["appliance"]
        if not isinstance(appliance, dict):
            raise ValueError("appliance must be an object")
        for field, expected in (("ip_forward", True), ("source_dest_check", False), ("snat_inner_traffic", False)):
            if appliance.get(field) is not expected:
                errors.append("appliance " + field + " must be " + str(expected))
        tunnels = plan["tunnels"]
        if not isinstance(tunnels, list) or len(tunnels) != 2:
            errors.append("record both configured tunnels")
        else:
            if any(not isinstance(t, dict) or not isinstance(t.get("name"), str) or not t["name"].strip() or t.get("configured") is not True for t in tunnels):
                errors.append("each tunnel needs a name and configured=true")
            elif len({t["name"] for t in tunnels}) != 2:
                errors.append("tunnel names must be distinct")
        if plan.get("test_mode") != "one-tunnel-at-a-time-manual-recovery":
            errors.append("this model supports one-tunnel-at-a-time-manual-recovery only")
        capacity = plan["capacity"]
        if not isinstance(capacity, dict):
            raise ValueError("capacity must be an object")
        for field in ("critical_mbps", "bulk_mbps", "backup_mbps"):
            value = capacity[field]
            if type(value) not in (int, float) or not math.isfinite(value) or value < 0:
                raise ValueError("capacity " + field + " must be a finite nonnegative number")
        if type(capacity.get("pause_bulk_on_failover")) is not bool:
            raise ValueError("pause_bulk_on_failover must be boolean")
        demand = capacity["critical_mbps"] + (0 if capacity["pause_bulk_on_failover"] else capacity["bulk_mbps"])
        if capacity["backup_mbps"] <= 0 or demand >= capacity["backup_mbps"]:
            errors.append("surviving demand must be below backup capacity; budget additional headroom")
    except (KeyError, ValueError, TypeError) as exc:
        errors.append("invalid model: " + str(exc))
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", nargs="?", type=Path, default=Path(__file__).with_name("network-plan.json"))
    args = parser.parse_args()
    try:
        plan = json.loads(args.plan.read_text(encoding="utf-8"))
        errors = check(plan)
    except (OSError, ValueError) as exc:
        errors = ["cannot read JSON model: " + str(exc)]
    for error in errors:
        print("FAIL: " + error)
    if errors:
        return 1
    print("PASS: offline model checks only. No AWS state, tunnel health, application connectivity, physical diversity or automatic failover verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

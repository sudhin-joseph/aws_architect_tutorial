#!/usr/bin/env python3
"""Validate the L09 IPv4 worksheet locally. No AWS SDK, network or writes.

This is a deliberately narrow teaching checker, NOT a production network
validator. It supports the exact six-tier/AZ layout with no egress or same-AZ
zonal NAT. It does not inspect AWS, IPv6, SGs, NACLs, workloads or live traffic.
"""
import argparse
import ipaddress
import json
import sys


def validate(plan):
    errors = []

    def require(ok, message):
        if not ok:
            errors.append(message)

    try:
        vpc = ipaddress.IPv4Network(plan["vpcCidr"], strict=True)
        require(16 <= vpc.prefixlen <= 28, "VPC must use an IPv4 /16 through /28 for this worksheet")
        private = [ipaddress.IPv4Network(c) for c in ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16")]
        require(any(vpc.subnet_of(n) for n in private), "This worksheet requires RFC1918 space")
        egress = plan["egress"]
        require(egress in ("none", "zonal"), "Supported egress modes are none and zonal only")
        tables, subnets = plan["routeTables"], plan["subnets"]
        require(isinstance(tables, dict), "routeTables must be an object")
        require(isinstance(subnets, list) and len(subnets) == 6, "Exactly six subnets are required")
        expected_tables = {"main", "public", "app-A", "app-B", "data"}
        require(set(tables) == expected_tables, "Use the five documented route tables")
        for name, routes in tables.items():
            expected = [{"destination": str(vpc), "target": "local"}]
            if name == "public":
                expected.append({"destination": "0.0.0.0/0", "target": "igw"})
            elif egress == "zonal" and name in ("app-A", "app-B"):
                expected.append({"destination": "0.0.0.0/0", "target": "nat-" + name[-1]})
            require(isinstance(routes, list), name + ": routes must be a list")
            # Canonical validation catches typos/host bits; exact set guards tier isolation.
            for route in routes:
                ipaddress.IPv4Network(route["destination"], strict=True)
            actual_pairs = sorted((r["destination"], r["target"]) for r in routes)
            expected_pairs = sorted((r["destination"], r["target"]) for r in expected)
            require(actual_pairs == expected_pairs, name + ": unexpected/missing route or incorrect zonal target")
        names, placements, networks = set(), set(), []
        for subnet in subnets:
            name, tier, az = subnet["name"], subnet["tier"], subnet["az"]
            require(isinstance(name, str) and bool(name), "Each subnet needs a nonempty name")
            require(name not in names, "Duplicate subnet name: " + str(name))
            names.add(name)
            require(tier in ("public", "app", "data") and az in ("A", "B"), "Use public/app/data in AZ labels A/B")
            require((tier, az) not in placements, "Duplicate tier/AZ placement")
            placements.add((tier, az))
            network = ipaddress.IPv4Network(subnet["cidr"], strict=True)
            require(16 <= network.prefixlen <= 28, str(name) + ": supported IPv4 subnet prefix is /16 through /28")
            require(network.subnet_of(vpc), str(name) + ": subnet lies outside VPC")
            for previous_name, previous in networks:
                require(not network.overlaps(previous), str(name) + " overlaps " + previous_name)
            networks.append((name, network))
            demand = subnet["requiredAddresses"]
            require(type(demand) is int and demand > 0, str(name) + ": requiredAddresses must be a positive integer")
            if type(demand) is int:
                require(network.num_addresses - 5 >= demand, str(name) + ": insufficient usable addresses")
            expected_table = "app-" + az if tier == "app" else tier
            require(subnet["routeTable"] == expected_table, str(name) + ": incorrect explicit table association")
            require(subnet["autoAssignPublicIpv4"] is False, str(name) + ": automatic public IPv4 must be disabled")
        require(placements == {(t, a) for t in ("public", "app", "data") for a in ("A", "B")},
                "Every tier must appear once in each of two AZ labels")
    except (KeyError, TypeError, ValueError, AttributeError) as error:
        errors.append("Malformed or missing worksheet field: " + str(error))
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", help="Path to network-plan.json; no AWS access is performed")
    args = parser.parse_args()
    try:
        with open(args.plan, encoding="utf-8") as source:
            errors = validate(json.load(source))
    except (OSError, ValueError) as error:
        errors = ["Cannot read valid JSON: " + str(error)]
    for message in errors:
        print("FAIL " + message, file=sys.stderr)
    if errors:
        return 1
    print("PASS: six-subnet IPv4 worksheet, usable capacity, disjoint CIDRs and intended routes.")
    print("LOCAL PLAN ONLY: compare actual AWS inventory separately; no deployed-state or traffic verification.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Check the deliberately narrow L10 worksheet. No AWS calls or credentials."""
import ipaddress
import json
import sys
from pathlib import Path


def network(value):
    result = ipaddress.ip_network(value, strict=True)
    if result.version != 4:
        raise ValueError("L10 worksheet supports IPv4 only")
    return result


def selected(routes, address):
    """Longest-prefix lookup; reject duplicate destinations instead of guessing."""
    candidates, seen = [], set()
    if not isinstance(routes, list):
        raise ValueError("routes must be a list")
    for route in routes:
        prefix = network(route['destination'])
        if str(prefix) in seen:
            raise ValueError("duplicate route destination: " + str(prefix))
        seen.add(str(prefix))
        if not isinstance(route['target'], str) or not route['target']:
            raise ValueError("route target must be a nonempty string")
        if address in prefix:
            candidates.append((prefix.prefixlen, route['target']))
    return max(candidates)[1] if candidates else None


def validate(plan):
    errors = []
    try:
        vpcs = plan['vpcs']
        if set(vpcs) != {'A', 'B'}:
            raise ValueError("worksheet requires exactly VPCs A and B")
        if set(plan['associations']) != {'A', 'B'} or set(plan['s3_requirements']) != {'A', 'B'}:
            raise ValueError("associations and S3 requirements must name A and B")
        cidrs, workers = {}, {}
        for name, vpc in vpcs.items():
            cidrs[name] = network(vpc['cidr'])
            workers[name] = network(vpc['worker_subnet'])
            attachment = network(vpc['attachment_subnet'])
            for subnet in (workers[name], attachment):
                if not 16 <= subnet.prefixlen <= 28 or not subnet.subnet_of(cidrs[name]):
                    raise ValueError(name + ': subnet must be a contained /16 through /28')
            if workers[name].overlaps(attachment):
                raise ValueError(name + ': worker and attachment subnets overlap')
            if type(vpc['s3_gateway']) is not bool:
                raise ValueError(name + ': s3_gateway must be boolean')
            requirement = plan['s3_requirements'][name]
            if requirement not in ('none', 'local-gateway'):
                raise ValueError(name + ': only none/local-gateway S3 requirements are modeled')
            if requirement == 'local-gateway' and not vpc['s3_gateway']:
                errors.append(name + ': missing local S3 gateway; a remote gateway cannot transit TGW')
            table = plan['associations'][name]
            if table not in plan['tgw_tables']:
                raise ValueError(name + ': associated TGW table does not exist')
        if cidrs['A'].overlaps(cidrs['B']):
            errors.append('VPC CIDRs overlap')
        # Probe every IP in each lab /24 or smaller subnet. For larger permitted
        # subnets, check route-boundary addresses as well as first/last usable IPs.
        for source, dest in (('A', 'B'), ('B', 'A')):
            routes = vpcs[source]['routes']
            tgw_routes = plan['tgw_tables'][plan['associations'][source]]
            subnet = workers[dest]
            low, high = int(subnet.network_address) + 4, int(subnet.broadcast_address) - 1
            points = {low, high}
            for route in routes + tgw_routes:
                prefix = network(route['destination'])
                start, end = int(prefix.network_address), int(prefix.broadcast_address)
                points.update(v for v in (start - 1, start, end, end + 1) if low <= v <= high)
            for point in sorted(points):
                address = ipaddress.ip_address(point)
                if selected(routes, address) != 'tgw':
                    errors.append(f'{source} -> {dest}: VPC route fails for {address}')
                    break
                if selected(tgw_routes, address) != dest:
                    errors.append(f'{source} -> {dest}: TGW ingress table fails for {address}')
                    break
    except (KeyError, TypeError, ValueError, AttributeError) as exc:
        errors.append('Invalid worksheet: ' + str(exc))
    return errors


def main(argv):
    if len(argv) != 2:
        print('Usage: python3 check_plan.py network-plan.json', file=sys.stderr)
        return 2
    try:
        plan = json.loads(Path(argv[1]).read_text())
    except (OSError, ValueError) as exc:
        print('Cannot read worksheet: ' + str(exc), file=sys.stderr)
        return 2
    errors = validate(plan)
    if errors:
        print('\n'.join('FAIL: ' + error for error in errors))
        return 1
    print('PASS: offline L10 IPv4 route worksheet only. AWS, AZ coverage, SGs, NACLs, DNS, IAM and actual packets are NOT validated.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))

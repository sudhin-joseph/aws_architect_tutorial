# L09 — VPC design and controlled NACL troubleshooting

Two learner-executed labs accompany M09. The author has not deployed these labs. All examples use a disposable sandbox, one verified AWS account and Region, and synthetic content. Never change a shared/default/production VPC or weaken organizational restrictions to complete training.

L09a creates a six-subnet topology without EC2, NAT, endpoints or logs. L09b is an explicitly paid extension that introduces two private test instances, zonal NAT egress and short-lived Flow Logs. Neither exercise deploys a production application or database. Completion in the LMS is self-reported.

## Prerequisites and safety

- Complete M02 and M09.01–M09.07. M05 identity basics and M03 CLI familiarity are useful for the paid extension.
- Use an approved sandbox role, AWS CLI v2, Python 3 locally, and console access. L09b needs permission for the described EC2/VPC resources, an approved SSM instance role, PassRole scoped to that role, Session Manager, and a Flow Logs destination/delivery role.
- Choose one supported Region with two standard AZs. Map worksheet labels A/B to actual AZ IDs; AZ letter names can differ between accounts.
- Inventory existing/private connected networks before selecting the example 10.90.0.0/16 block. It is a sample, not an assigned organization address range.
- Tag created resources `Project=M09-lab`, owner and expiry. Record physical IDs in a lab inventory. Tags help identify ownership but are not deletion authorization.
- Use no public SSH, credentials in user data, sensitive test files, attack tools or production targets.
- Prices and quotas vary. Check current [VPC/NAT/public IPv4 pricing](https://aws.amazon.com/vpc/pricing/), [EC2 pricing](https://aws.amazon.com/ec2/pricing/on-demand/), [EBS pricing](https://aws.amazon.com/ebs/pricing/) and [CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/). Include paid Reachability Analyzer runs if used. Budget alerts are not spending caps.

Start with explicit identity and scope:

```bash
aws sts get-caller-identity --profile lab --region us-east-1
aws ec2 describe-availability-zones --profile lab --region us-east-1 --filters Name=state,Values=available
```

Replace every uppercase placeholder in later commands with an ID from your verified lab inventory. Do not paste placeholder commands unchanged.

## L09a: plan and hand-build the topology

### 1. Validate the worksheet

Download `network-plan.json` and `check_plan.py` into one local folder. Inspect the files, then run:

```bash
python3 check_plan.py network-plan.json
```

The checker uses Python's standard library only: no AWS calls, external dependencies or writes. It checks the six-subnet IPv4 teaching layout, CIDR canonical form, containment, non-overlap, usable capacity, explicit table selection and baseline/zonal route intent. It does not inspect deployed resources, organization-wide overlaps, SGs, NACLs, IPv6 or real traffic. AZ A/B are worksheet labels, not verified live AZs.

In a separate copy, make app-A overlap public-A; expect a nonzero result. Restore it, then change app-A to /25 while keeping its 140-address demand; expect insufficient capacity. Restore the approved plan. Review each failure's explanation rather than merely editing until the program passes.

### 2. Create VPC-only and subnets

In the VPC console choose **VPC only**, not a wizard that silently adds NAT or endpoints. Use the approved IPv4 block, default tenancy, no IPv6 for this baseline, DNS resolution enabled and DNS hostnames enabled. Leave the main table local-only. Record the VPC ID.

Create the following subnets with explicit AZ placement. Disable auto-assign public IPv4 on every subnet, including public-A/B; public routing and automatic address assignment are separate settings.

| Tier | AZ A | AZ B | Intended association |
|---|---|---|---|
| Public | 10.90.0.0/24 | 10.90.1.0/24 | public |
| Application | 10.90.10.0/24 | 10.90.11.0/24 | app-A / app-B |
| Data | 10.90.20.0/24 | 10.90.21.0/24 | data |

Each ordinary /24 has 251 assignable IPv4 addresses. Check actual available-address counts as resources are added later; this is not a promise that 251 addresses remain unused forever.

### 3. Configure routes explicitly

Create and attach one lab IGW. Create four custom tables alongside the main table:

| Table | Required baseline routes | Explicit subnet associations |
|---|---|---|
| main | VPC CIDR → local | None of the six lab subnets |
| public | VPC CIDR → local; 0.0.0.0/0 → lab IGW | public-A, public-B |
| app-A | VPC CIDR → local | app-A |
| app-B | VPC CIDR → local | app-B |
| data | VPC CIDR → local | data-A, data-B |

The local route is normally created by AWS; verify it rather than attempting to add a duplicate. The app tables deliberately lack internet egress in the baseline. Do not create NAT just to match a production diagram before approving the extension costs.

Read-only inventory commands:

```bash
aws ec2 describe-subnets --profile lab --region us-east-1 --filters Name=vpc-id,Values=YOUR_LAB_VPC_ID
aws ec2 describe-route-tables --profile lab --region us-east-1 --filters Name=vpc-id,Values=YOUR_LAB_VPC_ID
aws ec2 describe-internet-gateways --profile lab --region us-east-1 --filters Name=attachment.vpc-id,Values=YOUR_LAB_VPC_ID
```

Manually compare all six CIDRs, AZ placement and associations against the worksheet. Predict paths for app-A → data-B private IP and app-A → external IPv4. Explain why the first can use local routing while the second has no route in the baseline. No live application success has been proven yet.

### 4. Record the design decision

Write a short ADR: requirements, address-capacity estimate, explicit tier routes, AZ failure boundaries, omitted resources and trade-offs. Compare same-AZ zonal NAT with current regional availability mode using the [official regional NAT guidance](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html). Do not deploy both alternatives for this exercise.

If stopping here, use the networking portion of cleanup below. If continuing immediately, hand the inventory and cleanup responsibility to L09b. Leave no paid resources unattended.

## L09b: a successful path, a narrow deny, and a verified repair

### 1. Review costs and add the zonal NAT extension

Calculate two NAT gateway-hours per elapsed hour, NAT-processed data, two EIP/public IPv4 address-hours, two EC2 instances, their EBS volumes, log ingestion/storage and any applicable transfer/analysis charges. Use current regional rates, not a promised dollar total. Set a same-session cleanup reminder.

Create a **zonal public** NAT gateway in public-A using one new lab EIP, and another in public-B using a second new lab EIP. Wait until both are available. Add app-A 0.0.0.0/0 → NAT A and app-B 0.0.0.0/0 → NAT B. The public table must already point to IGW. Data/main tables remain unchanged. We deliberately use zonal mode for the packet-path exercise; regional mode is a valid alternative to evaluate, not an unsupported feature.

To reflect this in an offline worksheet copy, set `egress` to `zonal` and add app-A/B default routes with symbolic targets `nat-A`/`nat-B`. The checker requires same-AZ intent. Its symbolic IDs are not AWS resource IDs.

### 2. Create roles and private instances

Use an approved EC2 instance role that supports SSM managed-node operations, commonly using the AWS-managed `AmazonSSMManagedInstanceCore` policy for this isolated lab. Do not attach AdministratorAccess. Prefer a lab-specific role/profile when authorized; otherwise reuse an explicitly approved role and record that it must not be deleted during cleanup. Operator StartSession and PassRole permissions are separate from the instance role.

Create two lab security groups in the VPC. Remove the default broad outbound rule before adding the documented rules:

| Group | Inbound | Outbound |
|---|---|---|
| client | None | TCP 443 to 0.0.0.0/0; TCP 8000 to server SG |
| server | TCP 8000 from client SG | TCP 443 to 0.0.0.0/0 |

HTTPS egress is intentionally broad enough for sandbox SSM/package dependencies; it is not a production destination-control policy. Stateful responses to the allowed private HTTP request need no independent server outbound-8000 rule. AmazonProvidedDNS has documented SG/NACL exceptions; do not invent a public DNS allow rule to explain its behavior.

Launch a current supported Amazon Linux 2023 x86_64 AMI into app-A as client and app-B as server. Choose an available small x86_64 instance type, no public IPv4, no SSH key required for Session Manager, encrypted minimal root volume with delete-on-termination, IMDSv2 required, the approved node role, and only the matching lab SG. Use private IPv4 only in this exercise. Record instance, ENI and private IP IDs.

Wait for both nodes to appear online in Systems Manager. If they do not, check SSM Agent, role, DNS, outbound HTTPS, NAT routes and organization controls. Do not solve it by opening public SSH. Use console Session Manager sessions, or the CLI with its required local session-manager plugin.

### 3. Run a bounded synthetic service test

On the server, through Session Manager:

```bash
python3 --version
```

If Python 3 is missing, install it with the approved package workflow (`sudo dnf install -y python3` on AL2023), verifying repository reachability. Do not disable TLS checks or broadly modify firewall rules to force installation.

Create a new empty temporary directory and run a foreground HTTP service from it:

```bash
LAB_DOCROOT=$(mktemp -d /tmp/m09-http.XXXXXX)
python3 -m http.server 8000 --bind 0.0.0.0 --directory "$LAB_DOCROOT"
```

The empty directory listing is synthetic test content. Keep this session open; Ctrl-C stops the process. The server listens on private interfaces and its SG allows only the lab client group. Never serve a home directory or a directory containing secrets. Python's simple server is not a production service.

From the client Session Manager session:

```bash
curl --local-port 40000 --connect-timeout 3 --max-time 8 -sS -o /dev/null -w '%{http_code}\n' http://YOUR_SERVER_PRIVATE_IP:8000/
```

Expect 200. If source port 40000 is temporarily busy/TIME_WAIT, wait for reuse or select another unused ephemeral port and record it consistently for subsequent evidence. A local bind error is not a NACL block. If baseline fails, verify the server listener, target IP, SG rules, OS firewall and local routes before injecting any fault.

### 4. Configure short-lived Flow Logs

Create a dedicated CloudWatch log group such as `/m09-lab/flows` with one-day retention. Create an authorized VPC Flow Logs delivery role scoped to this log group, following [AWS's delivery-role instructions](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-iam-role.html). Do not use an administrator role for log delivery.

Create Flow Logs on the two lab ENIs (or only the two app subnets), selecting ALL traffic, CloudWatch Logs, the default record format, and a one-minute maximum aggregation interval. Verify delivery status and destination permissions. Record UTC test times, ENIs and the actual client/server addresses. Send one additional successful bounded request if needed. Log publication is asynchronous; wait for delivery rather than generating unbounded traffic.

In CloudWatch Logs Insights select only the lab group and the relevant time window. For the default message field order, adapt this query with actual IPs:

```text
fields @timestamp, @message
| parse @message '* * * * * * * * * * * * * *' as version, account, eni, src, dst, sport, dport, proto, packets, bytes, start, finish, action, status
| filter src = 'YOUR_CLIENT_PRIVATE_IP' and dst = 'YOUR_SERVER_PRIVATE_IP' and dport = '8000'
| sort @timestamp desc
| limit 30
```

Confirm the selected log format before interpreting positions. Records are metadata, not HTTP payload. Missing records are not proof of no traffic: check scope, time, flow-log state, role and log-status. For replies, reverse src/dst and use the actual client ephemeral destination port.

### 5. Establish a dedicated NACL baseline

Do not edit the VPC default NACL. Create a new custom NACL in the lab VPC and configure both directions **before** associating it with app-B:

| Direction | Number | Protocol/ports | Peer CIDR | Action |
|---|---|---|---|---|
| Inbound | 100 | All IPv4 traffic | 0.0.0.0/0 | Allow |
| Outbound | 100 | All IPv4 traffic | 0.0.0.0/0 | Allow |

These broad NACL baseline rules isolate the experiment to the injected deny; SGs remain restrictive and no instance has a public IP. They are a teaching baseline, not a recommended production subnet policy. Custom NACLs initially deny traffic, so associating an unconfigured one could disrupt management.

Record app-B's original NACL ID and association. Associate only app-B with the new NACL. Re-run the same bounded HTTP request and confirm 200. Verify both Session Manager sessions remain usable. Save the exact rollback procedure in a separate operator console session.

### 6. Add one deny, observe, and explain

Add the following rule to the new NACL only:

| Direction | Number | Protocol | Destination port | Source | Action |
|---|---|---|---|---|---|
| Inbound | 90 | TCP | 8000 | YOUR_CLIENT_PRIVATE_IP/32 | Deny |

Do not alter outbound HTTPS, public-subnet NACLs, routes or SGs. The controlled deny is narrower than the management path. Repeat one curl request to the same server IP/port. Expect a timeout/non-success rather than HTTP 200. Record the time and return code. Wait for a matching REJECT record and compare rule 90 with rule 100: first matching rule wins.

A Flow Log record alone does not name the precise rule. Your causal evidence combines a known successful baseline, an otherwise unchanged configuration, the specific rule, a repeated request and the correlated flow record. Optionally use paid Reachability Analyzer for the supported client ENI → server ENI TCP 8000 path, then compare its configuration finding. It does not send a request or verify the Python process.

### 7. Restore and validate

Remove only the injected inbound rule 90 through the NACL console. If using the CLI, verify the exact lab NACL ID first:

```bash
aws ec2 delete-network-acl-entry --profile lab --region us-east-1 --network-acl-id YOUR_LAB_CUSTOM_NACL_ID --rule-number 90 --ingress
```

Repeat the same bounded request; expect HTTP 200 and later ACCEPT metadata. If it fails, inspect the actual tuple, listener state, source-port reuse and rules. Do not call the repair complete without restored application evidence. If management was disrupted, use the independent operator console to restore the recorded original association; do not add broad public access.

Write a short incident report: request tuple, baseline, change, failure, why rule 90 wins, exact rollback, restored evidence, and why reply destination port is the client ephemeral port. Explain how the investigation would differ for an application error with ACCEPT metadata.

## Cleanup — mandatory, including after failed tests

Reconfirm account/Region and compare each target with the recorded lab inventory. Do not delete by broad name glob or remove reused roles/resources.

1. Stop the foreground Python process with Ctrl-C and end sessions. Retain sanitized evidence locally, not secrets or unnecessary identifiers.
2. Delete any lab-created Reachability Analyzer analyses and paths. Remove the lab Flow Logs and, after retaining the required evidence, the dedicated log group. Delete only a lab-created delivery role/policy; reused roles stay.
3. Terminate both lab EC2 instances. Wait for termination and release of their ENIs. Verify root EBS volumes were deleted; remove only lab-owned leftover volumes after confirming they are disposable.
4. Delete the two lab NAT gateways and wait until deletion completes. Release the two allocated lab EIPs afterward. NAT deletion alone does not release EIP allocations.
5. Remove lab instance profiles/roles only if you created them and no instance uses them. Detach their policies before deleting. Do not delete AWS-managed policies.
6. Delete the lab security groups after removing mutual references/dependencies as required. Restore/delete only lab NACL associations and custom NACLs. Remove custom routes/associations, six lab subnets and custom tables in the dependency order accepted by the console.
7. Detach and delete the lab IGW, then delete the dedicated VPC. Its default network objects are removed with the VPC; do not attempt to delete another VPC's defaults.
8. Verify the exact instances, NATs, EIPs, ENIs, log groups and VPC are absent. Record any unresolved deletion dependency and finish cleanup before marking L09b complete. Review billing after usage posts; incurred charges remain even after deletion.

L09a-only cleanup starts with its six subnets/custom tables, IGW and VPC; it has no compute/NAT resources if the baseline was followed. If L09b has started, clean its paid extension first.

## Evidence and verification limits

L09a: approved address plan, local checker pass, actual resource inventory/associations and a route-selection explanation. L09b: baseline 200, injected rule details, failed request with REJECT correlation, exact rollback, restored 200/ACCEPT and cleanup confirmation. Neither an offline worksheet nor a checkbox certifies deployed AWS security.

Local tests from the workspace root:

```bash
node lms/tests/m09.test.cjs
python3 -B -m unittest discover -s lms/tests -p 'test_m09*.py'
```

Key official references: [subnet sizing](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html), [NACL evaluation](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html), [Session Manager prerequisites](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-prerequisites.html), [Flow Log records](https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html), [Reachability Analyzer](https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html).

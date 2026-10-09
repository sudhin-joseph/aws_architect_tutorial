# L10 — Transit Gateway and S3 gateway endpoint evidence

This is a learner-executed, paid sandbox lab. It has **not been deployed by the author**. The local checker tests a worksheet, not AWS resources. Do not mark a failed or unobserved cloud experiment as verified because the worksheet passes.

Allow 120–150 minutes plus cleanup. Use a disposable account where you can create VPC/TGW/EC2/IAM/S3/CloudWatch resources. Use one Region and one AZ for this short lab; it is **not a resilient production topology**. Never modify default/shared VPCs, shared IAM roles, existing bucket policies or production route tables.

## 1. Prepare ownership, cost and recovery

Use a named CLI profile with temporary credentials. Confirm the account with `aws sts get-caller-identity --profile PROFILE`; set the intended Region explicitly in commands or your selected profile. Console Region and CLI Region must agree. Record account, Region, physical AZ ID, owner, expiry, and every created resource ID in a local inventory. Tag resources `Project=M10-lab` where supported.

Price two TGW VPC attachments, one NAT gateway, its public IPv4 allocation, two small EC2 instances/EBS volumes, S3 requests/storage and Flow Logs/CloudWatch ingestion/storage. Include any relevant data transfer. Read [VPC pricing](https://aws.amazon.com/vpc/pricing/), [TGW pricing](https://aws.amazon.com/transit-gateway/pricing/) and your Region’s EC2/CloudWatch rates before starting. An S3 gateway endpoint has no additional endpoint charge; the entire lab is not free. Set a deletion time and budget alerts; alerts are delayed and do not cap spend. Use a small object and a few requests, not a bulk transfer.

Keep the operator console/CLI session on your own machine or standard CloudShell **outside these lab VPCs**. Do not perform the route fault injection from the worker session whose network you are altering. The operator must be able to restore route associations and remove the lab-only IAM policy independently.

Download `network-plan.json` and `check_plan.py` together:

```bash
python3 -B check_plan.py network-plan.json
```

Make a copy. Remove B’s route to A, run the checker and expect FAIL; restore it. Then change A’s `s3_gateway` to false while retaining its local-gateway requirement and expect FAIL. Restore the original. The checker models route selection for the two worker subnets and local gateway intent. It does not inspect AWS, AZ placement, DNS, SGs, NACLs, endpoint policies or packets. It is intentionally not a general VPC validator.

## 2. Build isolated networks and explicit tables

Check the suggested ranges against existing connected networks. If they overlap, choose approved disjoint ranges and update the complete plan consistently.

| VPC | CIDR | Subnet | Route table |
|---|---|---|---|
| A | 10.100.0.0/16 | worker-A 10.100.10.0/24 | rt-worker-A |
| A | same | attachment-A 10.100.20.0/24 | rt-attachment-A |
| A | same | public-A 10.100.0.0/24 | rt-public-A |
| B | 10.101.0.0/16 | worker-B 10.101.10.0/24 | rt-worker-B |
| B | same | attachment-B 10.101.20.0/24 | rt-attachment-B |

In the VPC console, create VPC-only resources with DNS resolution and DNS hostnames enabled. Create all subnets in the chosen AZ and disable automatic public IPv4 assignment. Explicitly associate each subnet with its named table. Leave main tables local-only. Default lab NACLs may remain allow-all for this route experiment; they are not the variable under test.

Create an IGW attached only to A. Add `0.0.0.0/0 → IGW` to rt-public-A. Allocate one lab EIP and create a **zonal public NAT gateway** in public-A. Wait for Available, then add `0.0.0.0/0 → NAT` to rt-worker-A. Record the NAT ENI and EIP allocation ID. Do not add an internet default route to B. Leave attachment tables local-only: this lab routes directly to local workloads after TGW arrival, not through a middlebox.

## 3. Create explicit TGW connectivity

In Transit Gateways, create `M10-lab` with default route-table association and default propagation disabled. Keep DNS support enabled. Create A and B VPC attachments using their dedicated attachment subnets in the chosen AZ. Wait until both attachments are Available.

Create one TGW route table `M10-lab-routes`. Associate **both** attachments with it. Add explicit static routes:

| Destination | TGW target |
|---|---|
| 10.100.0.0/16 | attachment-A |
| 10.101.0.0/16 | attachment-B |

Add `10.101.0.0/16 → TGW` to rt-worker-A and `10.100.0.0/16 → TGW` to rt-worker-B. Do not confuse these VPC routes with the TGW routes. The lab deliberately uses static routes for clarity; production designs can use controlled propagation.

Read-only inventory commands (replace placeholders, use your selected profile):

```bash
aws ec2 describe-transit-gateway-attachments --region REGION --filters Name=transit-gateway-id,Values=TGW_ID
aws ec2 get-transit-gateway-route-table-associations --region REGION --transit-gateway-route-table-id TGW_TABLE_ID
aws ec2 search-transit-gateway-routes --region REGION --transit-gateway-route-table-id TGW_TABLE_ID --filters Name=state,Values=active
aws ec2 describe-route-tables --region REGION --route-table-ids RT_WORKER_A RT_WORKER_B
```

Record actual IDs and routes; a desired worksheet is not a deployed snapshot.

## 4. Launch the two disposable workloads

Create a lab-only EC2 role with trust for `ec2.amazonaws.com` and attach `AmazonSSMManagedInstanceCore`. Create its instance profile. This role is for **A only**. Later give it GetObject permission on the one test object. No long-lived access keys go onto either instance.

Create SG-A with no inbound rules. Retain outbound access for this small lab so the routing experiment does not simultaneously test outbound filtering. Create SG-B with inbound TCP 8000 **only from worker-A’s eventual private IPv4 /32**. Initially leave that rule absent, then add it once A’s address is known. No public SSH ingress is needed. B does not need an IAM role, a public IP, an SSH key or an SSM session.

Launch one small x86_64 Amazon Linux 2023 instance in each worker subnet, no public IPs, IMDSv2 required, encrypted EBS, and DeleteOnTermination enabled. Use an official AL2023 AMI with Python 3 present; check the AMI before launching. A gets its instance profile and SG-A. B gets SG-B and this user data, which uses the AMI’s existing Python and does not download packages:

```bash
#!/bin/bash
set -eu
command -v python3
install -d -m 755 /opt/m10
printf '%s\n' 'M10 private server B' > /opt/m10/index.html
cat > /etc/systemd/system/m10-http.service <<'SERVICE'
[Unit]
Description=M10 disposable HTTP test
After=network.target
[Service]
User=nobody
WorkingDirectory=/opt/m10
ExecStart=/usr/bin/python3 -m http.server 8000 --bind 0.0.0.0
Restart=on-failure
[Install]
WantedBy=multi-user.target
SERVICE
systemctl daemon-reload
systemctl enable --now m10-http.service
```

Record both private IPs and ENI IDs. Add SG-B’s narrow source rule using A’s actual /32. Open A through Session Manager. If A is not managed, check agent, instance profile, DNS and NAT connectivity before continuing. Verify `aws --version` and `curl --version` on A; use an AMI providing them or install prerequisites through A’s approved NAT path. B intentionally lacks that path. If B’s boot script fails, inspect EC2 system output/console screenshot from the operator and correct the AMI/user data by recreating the disposable instance; do not add broad internet ingress as a shortcut.

## 5. Observe TGW request, fault and recovery

From A (substitute B’s private IP):

```bash
date -u
curl --connect-timeout 3 --max-time 8 --fail http://B_PRIVATE_IP:8000/
```

Expect `M10 private server B`. If not, diagnose both VPC route tables, TGW associations/routes, attachment AZ, SG-B source rule, NACLs and B’s boot/service health. Stop here until baseline works.

From the **external operator console**, remove only rt-worker-B’s `10.100.0.0/16 → TGW` route. Repeat a new curl from A and record its nonzero exit/timeout. Restore exactly that route and repeat; expect success. Do not change SGs or TGW routes during this trial. A’s SSM path still uses A’s NAT, so it should survive; keep the operator rollback path regardless. A failed request alone does not identify the bad route—your recorded single change and recovery establish the controlled experiment.

## 6. Prepare S3 and Flow Log evidence before the endpoint

Create a unique, disposable **general-purpose S3 bucket in the same Region** with Block Public Access enabled, versioning disabled and SSE-S3 encryption. Upload a small non-sensitive `lab.txt`. From the operator, attach a lab-only inline policy to A’s role allowing only `s3:GetObject` on `arn:aws:s3:::YOUR_BUCKET/lab.txt`. There is no need for ListBucket, write access or KMS permissions for this SSE-S3 object.

Create a CloudWatch log group with short retention (for example one day). In the VPC console, create Flow Logs for A’s worker ENI and NAT ENI, traffic type ALL, one-minute maximum aggregation where offered, destination that log group. Use the console workflow to create a **lab-only** delivery role with the documented `vpc-flow-logs.amazonaws.com` trust and log delivery rights. Record and later delete that role. Use this custom format:

```text
${version} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${bytes} ${start} ${end} ${action} ${log-status} ${flow-direction} ${traffic-path} ${pkt-srcaddr} ${pkt-dstaddr}
```

Wait for log delivery and inspect `log-status`. Delivery is delayed and records can be skipped. These are metadata records, not payload capture, and NAT translation changes tuples. Record both interfaces to correlate the request. Optional `pkt-dst-aws-service` can help classify traffic but is not an endpoint-ID attestation. Interpret `traffic-path` against [the field documentation](https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html); support and code granularity vary, and some values do not uniquely distinguish an IGW from a gateway endpoint.

From A, with the instance role (do not override it with operator credentials):

```bash
aws sts get-caller-identity --region REGION
date -u
aws s3api get-object --bucket YOUR_BUCKET --key lab.txt --region REGION --cli-connect-timeout 5 --cli-read-timeout 10 /tmp/m10-before.txt
cat /tmp/m10-before.txt
```

Record timestamp, caller role, worker/NAT ENIs and successful object content. Resolve the bucket’s regional hostname using `getent ahostsv4 YOUR_BUCKET.s3.REGION.amazonaws.com`; actual SDK connections can use other addresses from that service range, so correlate observed tuples and time rather than assuming one DNS answer is exhaustive. Save route snapshots showing no gateway endpoint association and the NAT default. In the logs, locate the relevant HTTPS flows and note any concurrent SSM traffic. If logs are absent, investigate delivery and repeat a bounded trial rather than declaring success.

## 7. Activate gateway routing and repeat

In VPC Endpoints, create an IPv4 Gateway endpoint for `com.amazonaws.REGION.s3` in A. Associate **rt-worker-A**, not rt-public-A or B’s tables. For this lab, use an endpoint policy allowing only `s3:GetObject` on the test object (`Principal: "*"` in the endpoint policy is a filter, not a grant of missing IAM rights). Record the endpoint ID and the automatically installed S3 prefix-list route. There is no gateway endpoint SG or endpoint ENI.

Repeat the object read into `/tmp/m10-after.txt` with a **new CLI process**. S3 should still succeed. Inspect the matching service route and new Flow Logs for the worker. NAT may still have SSM/other traffic; “NAT bytes are not zero” is not evidence that S3 still uses NAT.

For stronger service-side path evidence, attach the following **additional inline policy on A’s disposable role** from the operator. It denies only this object read when the expected endpoint context is absent or different. Replace bucket and endpoint placeholders before applying. Do not put a broad deny on the whole bucket or administrative actions.

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "M10RequireEndpointForOneRead",
    "Effect": "Deny",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR_BUCKET/lab.txt",
    "Condition": {"StringNotEquals": {"aws:SourceVpce": "YOUR_ENDPOINT_ID"}}
  }]
}
```

Keep the original GetObject Allow policy. After IAM propagation, a fresh read through the endpoint should succeed. From the external operator, temporarily **disassociate rt-worker-A from the gateway endpoint**, keeping the NAT default and restrictive role policy in place. New reads should return AccessDenied through the alternate path, not succeed. Reassociate the table, allow changes to settle, and repeat; expect success. If the result differs, verify instance identity, exact object ARN, policy propagation, associations and fresh requests before drawing conclusions. Remove the extra Deny policy after recording the trial. This scoped condition does not affect operator cleanup or SSM permissions.

B cannot use A’s gateway endpoint through TGW. Its lack of S3 access is not fixed by a route to A’s endpoint. For B-local S3, create its own gateway endpoint; remote service access would require an appropriate interface endpoint/DNS design. Do not create those additional paid resources in this lab.

## 8. Evidence matrix and limits

| Claim | Required evidence | Insufficient on its own |
|---|---|---|
| A can call B through intended TGW path | Successful bounded HTTP call; both VPC tables; ingress TGW associations/routes | Available attachment |
| Removed return route caused the controlled failure | Baseline, one recorded route removal, failure, exact restoration and recovery | An unexplained timeout |
| Local S3 moved off default NAT routing | Effective prefix route and endpoint association; successful new read; scoped SourceVpce positive/negative/recovery trial; tuple/time-correlated Flow Logs | Missing NAT records or public-looking DNS |
| Logs are usable | Correct ENIs, time windows, format and log-status; translated tuple correlation | One ACCEPT line without context |
| Lab is cleaned up | Resource inventory shows deletion complete; EIP released; storage/log/role check | Browser tab closed |

A SourceVpce condition trial supports the endpoint identity for the tested signed request. Flow Logs provide complementary packet metadata; they are not a direct S3 authorization log. Neither trial proves all future traffic paths. Mark missing evidence as **inconclusive**. NAT metrics may support the exercise but are too aggregated to prove a tiny object’s path alone.

## 9. Cleanup in dependency order

Use your inventory and verify account/Region. Delete only lab-owned resources; never bulk-delete by a loose name match.

1. Remove the extra inline endpoint-condition policy if still present. Save only non-sensitive evidence outside the bucket/log group if needed.
2. Terminate both EC2 instances. Confirm their delete-on-termination volumes are gone; remove only remaining lab-owned volumes/snapshots if any.
3. Delete the Flow Logs subscriptions, then the lab log group after collecting evidence. Delete the delivery role’s policies and role only after delivery is no longer needed.
4. Delete the S3 gateway endpoint. Remove worker VPC routes targeting TGW and NAT.
5. Delete the NAT gateway and **wait for Deleted**, then **release its EIP allocation**. Verify no allocated lab EIP remains.
6. Delete the two TGW VPC attachments and wait for deletion. Delete the lab TGW route table and TGW after its dependencies are gone. Poll until no lab-owned available/pending attachment remains.
7. Remove the public default route, detach/delete the IGW, then delete the lab subnets and custom route tables. Delete the lab SGs once ENIs are removed, then delete both VPCs. Main/default resources disappear with the VPC.
8. Delete `lab.txt`, verify the disposable bucket is empty, then delete the bucket. If you deviated and enabled versioning, remove versions and delete markers as well before deleting that lab bucket.
9. Remove A’s lab instance profile and lab-only role: detach the managed policy, delete inline policies, remove the role from the profile, delete profile and role. Do not alter reused roles (the instructions use dedicated ones).
10. Reconcile the inventory, check EC2/EBS, NAT/EIP, TGW, endpoints, S3 and CloudWatch in the correct Region. Review billing when usage posts. Cleanup does not erase incurred charges.

## References

- [TGW VPC attachments](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html)
- [TGW route tables](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-route-tables.html)
- [S3 gateway endpoints and request conditions](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html)
- [Flow Log records](https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html)
- [Endpoint policies](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html)

Source review: 2026-10-09. Recheck current support and pricing before executing. This runbook is original instructional material; links provide authoritative service details.

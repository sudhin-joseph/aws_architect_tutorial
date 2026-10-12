# L11 — Simulated customer site to AWS over Site-to-Site VPN

This is a learner-run networking exercise. A disposable EC2 strongSwan appliance in a **customer-simulation VPC** represents the on-premises router. It connects to a VGW in a second VPC. “Simulated” describes the customer site: the cloud extension creates real, billable AWS resources.

**Author validation:** the content and offline model are locally checked; the cloud topology and strongSwan configuration have **not been deployed by the author**. Record your actual software versions, negotiated settings and observations. Do not treat the template as a tested production appliance.

Allow 150–180 minutes, plus setup if Linux/IPsec is unfamiliar. The offline exercise requires Python 3 and no account. The cloud extension requires an approved disposable sandbox, IAM permissions to manage the listed resources, AWS CLI v2 for optional evidence commands, and Linux administration experience. Read the entire runbook before provisioning.

## What you will learn and what this does not prove

Trace an inner private HTTP request through IPsec, break its return route, restore it and manually switch tunnels. The base configuration uses **one tunnel at a time**, a single pair of subnet selectors and static routing. AWS VPN is route-based; its documented single-SA policy-based interoperability is used here to keep the Linux exercise bounded. Do not add multiple selector pairs or activate both overlapping Linux policies simultaneously.

This is not a resilient production topology. It does not teach automatic tunnel failover, BGP convergence, independent customer routers, DX performance, a production SLA or a real carrier outage. A production route-based appliance would use suitable tunnel interfaces, dynamic routing and independently tested redundancy. No DX, Client VPN, NAT gateway or Resolver endpoint is required for this lab.

## 1. Scope, costs and recovery

Before creating anything:

1. Verify account and Region with your normal sandbox profile: `aws sts get-caller-identity`. Record the exact account, Region, owner and deletion deadline in a private inventory.
2. Estimate the total for one standard Site-to-Site VPN connection, three small Linux EC2 instances and their EBS volumes, **three public IPv4 addresses** (one EIP and two auto-assigned addresses), and transfer. Select current regional rates and instance architecture compatible with your chosen image. Budget notifications do not cap charges, and stopped instances do not remove VPN, EBS or allocated-IP charges.
3. Set a timer for the lab window. Create lab-only tags, for example `Lab=L11`, `Owner=<you>`, `Expires=<UTC timestamp>`. Tag where supported and separately record untaggable dependencies.
4. Keep an **external operator** AWS console/CLI session outside this VPN path. Management SSH will use public addresses restricted to your current public `/32`, so a missing private return route does not remove rollback access. Never use an unrestricted SSH source.
5. Prepare inventory columns: logical name, actual ID, Region, dependent resources, creation time, expected cost and deletion status. Do not store credentials or PSKs in this inventory, screenshots, LMS progress or source control.

Current references: [VPN pricing](https://aws.amazon.com/vpn/pricing/), [EC2 on-demand pricing](https://aws.amazon.com/ec2/pricing/on-demand/), [VPC/public IPv4 pricing](https://aws.amazon.com/vpc/pricing/). Pricing and budget alerts are not a spend ceiling.

## 2. Offline worksheet and deliberate failures

Download [network-plan.json](network-plan.json) and [check_plan.py](check_plan.py) into one local folder:

```bash
python3 check_plan.py network-plan.json
```

Expected: `PASS: offline model checks only...`. The checker reads JSON and contacts no network or AWS API. It checks IPv4 containment, usable host addresses, overlap, longest-prefix selection for the test pair, appliance flags, two configured tunnel names and surviving load. It does not inspect every possible route, firewall, actual resource or physical path.

Save a working copy, then try each mutation separately:

| Mutation | Expected result | Reason |
|---|---|---|
| Remove the AWS route to `10.60.0.0/16` | FAIL | No modeled return path |
| Add `10.60.10.20/32 → igw` to AWS routes | FAIL | A more specific wrong route captures the reply |
| Set `source_dest_check` to true | FAIL | Appliance must forward packets for other hosts |
| Reuse customer VPC range for AWS VPC | FAIL | Overlap undermines intended private routing |
| Set critical demand to 650 with backup 600 | FAIL | Critical load alone exceeds surviving capacity |
| Set `pause_bulk_on_failover` false | FAIL | 900 Mbps demand exceeds 600 Mbps backup |

Restore the supplied plan. Capacity values are invented design inputs; they are **not measured VPN performance**. Passing at 60% utilization is not a recommendation that every workload has enough burst headroom.

## 3. Build the disposable network inventory

Use the VPC and EC2 consoles with explicit route associations. Create only this inventory; do not connect the VPCs with peering, TGW or another shortcut.

| Resource | Address / placement | Purpose |
|---|---|---|
| Customer VPC | `10.60.0.0/16` | Simulated customer site |
| Customer edge subnet | `10.60.0.0/24` | Public management and IPsec underlay |
| Appliance | `10.60.0.10`, EIP, edge subnet | Ubuntu Server 24.04 LTS, strongSwan |
| Customer worker subnet | `10.60.10.0/24` | Inner test source |
| Customer worker | `10.60.10.20`, auto public IP | Ubuntu Server 24.04 LTS, curl |
| Application VPC | `10.80.0.0/16` | AWS-side target network |
| Application subnet | `10.80.20.0/24` | Test target and controlled management |
| Target | `10.80.20.10`, auto public IP | Ubuntu Server 24.04 LTS, Python HTTP |
| Internet gateways | One per VPC | Public management; customer tunnel underlay |
| VGW | Attached only to application VPC | AWS VPN termination |
| Customer gateway | Appliance EIP | AWS description of the customer edge |
| VPN connection | Static IPv4, standard, VGW | Two AWS tunnel endpoints |

The target and worker use public addresses only to make package installation and controlled management independent of the VPN. This is an educational management design, not a private production subnet blueprint. Use official AMI publisher identities, IMDSv2-required instances and encrypted EBS. Do not attach application data or broad instance roles.

Route tables (retain their local VPC routes):

| Explicit subnet association | Additional routes |
|---|---|
| Customer edge | `0.0.0.0/0 → customer IGW` |
| Customer worker | `0.0.0.0/0 → customer IGW`; `10.80.0.0/16 → appliance ENI` |
| Application | `0.0.0.0/0 → application IGW`; `10.60.0.0/16 → VGW` |

The worker's more specific AWS route sends **private test packets** to the appliance while SSH replies to your public address still use the IGW. Do not add the AWS private route to the appliance's own VPC subnet table: that can create a forwarding loop. Disable **source/destination checking** on the appliance instance/ENI only. Keep it enabled on both hosts.

Security groups:

- All three instances: SSH TCP 22 from your operator public `/32` only. Remove stale sources if your address changes.
- Appliance: UDP 500 and 4500 from each actual AWS tunnel public `/32`; TCP 8000 from customer worker `10.60.10.20/32` for the forwarded test. Egress must permit the tunnel endpoint UDP ports, the private test destination TCP 8000, replies, DNS and package downloads. The template forces NAT-T; no broad ESP ingress is required for this configuration.
- Target: TCP 8000 from `10.60.10.20/32` only. Do not expose the HTTP service to the internet or use the appliance EIP as the inner source.
- Worker: no inbound test service is needed. Permit outbound test HTTP, package access and DNS.

For this disposable exercise keep the default allow-all NACL and enforce the intended restrictions with security groups and the appliance forwarding chain. If you deliberately use restrictive NACLs, document both request and ephemeral reply traffic. Do not add SNAT/MASQUERADE for the inner customer-to-AWS flow: the target should observe the original private worker address.

## 4. Prepare the hosts and appliance

Connect to each instance using its public address and your approved key; do not copy private SSH keys onto them. On the worker install `curl` if absent. On the target verify Python 3 is installed. Create a directory containing only a disposable text response:

```bash
mkdir -p "$HOME/l11-http"
printf '%s\n' 'L11 private-path response' > "$HOME/l11-http/index.html"
python3 -m http.server 8000 --bind 10.80.20.10 --directory "$HOME/l11-http"
```

Keep this foreground service in a separate SSH session during the exercise. Its request log provides a second observation of the original source address. No TLS or application authentication is implemented: the harmless HTTP payload exists only to observe the IPsec path. Production applications need their own security controls.

On the appliance, install the swanctl-based daemon (do not mix it with the legacy starter/ipsec.conf service):

```bash
sudo apt-get update
sudo apt-get install -y charon-systemd strongswan-swanctl libstrongswan-standard-plugins iptables
sudo systemctl enable --now strongswan
sudo swanctl --version
uname -r
sudo sysctl -w net.ipv4.ip_forward=1
sudo sysctl -w net.ipv4.conf.all.rp_filter=2
sudo sysctl -w net.ipv4.conf.default.rp_filter=2
```

Record versions. If the package/service names differ for your selected image, stop and resolve the distribution-specific difference; do not run competing IKE daemons. The sysctl changes above are temporary and intentionally reset when this disposable appliance restarts.

Use a dedicated forwarding chain on this otherwise unused appliance. Inspect `sudo iptables -S FORWARD` first; do not reuse a host that already carries other traffic. Create this chain once:

```bash
sudo iptables -N L11_FORWARD
sudo iptables -A L11_FORWARD -s 10.60.10.20/32 -d 10.80.20.10/32 -p tcp --dport 8000 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -A L11_FORWARD -s 10.80.20.10/32 -d 10.60.10.20/32 -p tcp --sport 8000 -m conntrack --ctstate ESTABLISHED -j ACCEPT
sudo iptables -A L11_FORWARD -j DROP
sudo iptables -I FORWARD 1 -j L11_FORWARD
```

This bounds forwarded traffic and leaves the appliance's INPUT management path separate. Do not flush unrelated rules. If you need to remove the chain before terminating the appliance, remove the FORWARD jump, flush only `L11_FORWARD`, then delete only that chain. For a larger transfer exercise, derive MTU/MSS from the actual negotiated algorithms and AWS guidance; the base test uses a small response and does not validate jumbo packets or throughput.

## 5. Create the AWS VPN and configure matching options

Create and attach the VGW to the application VPC. Create a customer gateway using the appliance's EIP and an ASN such as 65010 (the static-routing exercise does not establish BGP). Create a Site-to-Site VPN connection to that VGW with static routing and the customer gateway.

- Add static customer route `10.60.0.0/16` to the VPN connection. Add the explicit application-subnet route `10.60.0.0/16 → VGW`; avoid simultaneously adding propagation for the break/fix exercise, since a propagated duplicate could hide the deleted static route.
- Set the VPN **local IPv4 network CIDR** (customer side) to `10.60.10.0/24` and **remote IPv4 network CIDR** (AWS side) to `10.80.20.0/24` for this bounded selector pair.
- For **both** tunnels choose IKEv2, phase-1 and phase-2 AES256/SHA2-256, phase-1 DH group 14 and phase-2 PFS group 14. Use phase-1 lifetime 28,800 seconds, phase-2 3,600 seconds. Set startup action to **Add**, so the customer initiates; do not use AWS-start behavior for this manual one-at-a-time exercise. Set DPD timeout action Clear.
- Use distinct AWS-generated PSKs. Record each tunnel's endpoint and options securely. Review the downloaded AWS configuration; its actual negotiated values are authoritative if they differ from your intended choices. Correct the mismatch before continuing.
- Add both actual tunnel public addresses to the appliance security group as above. The EIP is translated by the customer IGW to the appliance private address. Use the **private IP for local socket binding** and the **EIP as the IKE identity**.

[Download swanctl.conf.example](swanctl.conf.example). Populate every `REPLACE_*` field in a root-owned, mode-0600 local configuration on the appliance. Include it from `/etc/swanctl/swanctl.conf` or use it as the sole configuration on this disposable host. Do not paste PSKs into shell command arguments/history, user data, shared terminals or the LMS. Keep any downloaded AWS configuration with secrets private and short-lived.

Load and start **only tunnel 1**:

```bash
sudo swanctl --load-all
sudo swanctl --initiate --child aws1-net
sudo swanctl --list-sas
sudo ip xfrm policy
sudo ip route show table 220
```

Require installed child-SA state and the intended selectors. Do not export `ip xfrm state` output: it can contain cryptographic key material. `swanctl --list-sas` and policy output still contain topology information; redact before sharing. If the proposal/authentication fails, compare the configured identities, PSK pairing and negotiated algorithms, then inspect the daemon logs locally. Never “fix” negotiation by publishing a PSK or opening all traffic.

The policy-based example relies on strongSwan's normal policy/route installation. It deliberately creates no BGP session or XFRM interface. If route installation fails on your kernel/package combination, stop and diagnose it before testing; do not infer success from IKE alone.

## 6. Baseline, return-route failure and recovery

On the **customer worker**, use the private target address:

```bash
date -u
curl --noproxy '*' --connect-timeout 3 --max-time 8 --fail http://10.80.20.10:8000/
```

Expected: the response marker, plus a target log entry showing `10.60.10.20`. Inspect tunnel packet/byte counters before and after the request. Public SSH reachability and the target's localhost request are not evidence that the worker request traversed IPsec.

Optional read-only AWS evidence commands from the external operator (replace each placeholder; use your explicit sandbox profile/Region):

```bash
aws ec2 describe-vpn-connections --vpn-connection-ids VPN_ID --query 'VpnConnections[].{Id:VpnConnectionId,Routes:Routes,Tunnels:VgwTelemetry}'
aws ec2 describe-route-tables --route-table-ids CUSTOMER_WORKER_TABLE_ID APPLICATION_TABLE_ID --query 'RouteTables[].{Id:RouteTableId,Associations:Associations,Routes:Routes}'
```

The selective query avoids printing the VPN configuration document that contains secrets. Do not capture unfiltered `describe-vpn-connections` output.

From the **external operator console**, remove only `10.60.0.0/16 → VGW` from the application subnet route table. Do not delete the VPN, security groups, local route or management default route. Repeat the bounded private curl: expect a timeout even if the tunnel remains UP. Restore the exact deleted route immediately, inspect its target and association, and repeat curl until the marker returns. If a response still succeeds during the fault, look for propagation or a more-specific alternate route; do not claim the intended fault was demonstrated.

## 7. Manual recovery through tunnel 2

Keep operator access and the application service alive. On the appliance:

```bash
sudo swanctl --terminate --ike aws1
sudo swanctl --list-sas
```

Verify tunnel 1's child state has gone. From the worker record a bounded failed request. Because startup is manual and no trap/start policy is configured, this should not silently reestablish tunnel 1. If it does, inspect the actual startup actions before proceeding.

Then on the appliance:

```bash
sudo swanctl --initiate --child aws2-net
sudo swanctl --list-sas
```

Repeat curl from the worker and verify the response and target source log. Record elapsed manual recovery time. Before returning to tunnel 1, terminate `aws2` and verify its policies are removed, then initiate `aws1-net`. Never intentionally keep both overlapping selector policies active in this exercise.

The experiment proves only what you observed: a specific request after operator-driven tunnel replacement. It does **not** measure automatic failover, two concurrent tunnels, customer-device redundancy or peak bandwidth. The two tunnel paths share one appliance and one simulated customer VPC.

## 8. Evidence and troubleshooting worksheet

| Stage | Configuration evidence | Observation | Honest conclusion |
|---|---|---|---|
| Offline plan passes | Supplied JSON | Local checker output | Modeled constraints only |
| Tunnel 1 baseline | Routes, selectors, scoped security | Private curl + target log + tunnel counters | This request used the intended working path |
| Return route removed | Changed route-table snapshot | Bounded failure | Observed effect of a controlled routing change |
| Route restored | Restored route target/association | Marker returns | This request recovered after rollback |
| Tunnel 1 terminated | Child SA removed | Bounded failure | Observed interruption with no active test tunnel |
| Tunnel 2 initiated | Tunnel 2 child SA installed | Marker returns and counters change | Manual recovery observed |
| Missing logs or unverified alternate path | Incomplete | Unknown | **Inconclusive**, not a pass |

Troubleshoot layer by layer: underlay endpoint reachability → IKE identity/proposal → child-SA selectors → Linux forwarding/policy → VPC route associations → target security/listener → return path. Do not use a successful tunnel ping as a substitute for the private application request. If collecting packet captures, capture only this disposable flow and keep secrets and unrelated data out of shared artifacts.

DNS extension is **offline**: draw warehouse resolver → inbound endpoint → private hosted zone, and EC2 → VPC Resolver → associated suffix rule → outbound endpoint → customer DNS. Label both TCP/UDP 53 and return routes. The base topology deploys neither DNS endpoints nor a customer DNS server, so report no observed DNS result. Apply the lesson's capacity worksheet separately; do not present its numbers as measured lab throughput.

## 9. Cleanup and verification

Use the recorded inventory and delete **only lab-owned resources**. Keep the external operator session until verification is finished.

1. Stop the test requests and HTTP process. Terminate any active strongSwan test tunnel. Delete the Site-to-Site VPN connection and wait for deletion; tunnel-down alone does not stop provisioned VPN charges.
2. Terminate the three instances. Verify delete-on-termination volumes are gone and delete any lab-owned retained volumes/snapshots explicitly. Do not delete unrelated storage.
3. Disassociate and **release the EIP** after its dependencies are gone. Confirm the two auto-assigned public IPv4 addresses disappeared with their instances.
4. Remove the explicit worker appliance route and application VGW route. Detach/delete the lab VGW after VPN deletion. Delete the lab customer gateway once no connections reference it.
5. Remove lab-only security groups and any remaining lab-owned ENIs after their dependencies clear. Delete subnets, custom route tables, detach/delete IGWs, then delete the two VPCs. Do not alter default resources in unrelated VPCs.
6. Delete any optional lab-only log groups or IAM objects you created. Remove downloaded PSK configuration copies and retain redacted observations only.
7. Recheck the account and Region inventory for VPN connections, EC2, EBS, allocated EIPs and networking dependencies. Asynchronous deletion must finish; a clicked Delete button is not sufficient evidence. Review delayed billing afterward. Charges already incurred remain payable.

## Sources reviewed 2026-10-12

- [AWS VPN customer gateway requirements and single-SA interoperability](https://docs.aws.amazon.com/vpn/latest/s2svpn/CGRequirements.html)
- [AWS tunnel options and selector directions](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNTunnels.html)
- [VPN routing options](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNRoutingTypes.html)
- [strongSwan configuration reference](https://docs.strongswan.org/docs/latest/swanctl/swanctlConf.html)
- [strongSwan site-to-site configuration concepts](https://docs.strongswan.org/docs/latest/config/quickstart.html)
- [strongSwan route-based VPN design for further study](https://docs.strongswan.org/docs/latest/features/routeBasedVpn.html)

Next source review: 2027-01-12. Validate software, service options and prices again before cloud execution.

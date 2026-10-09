# L08 — WAF and GuardDuty sandbox

This lab provisions paid resources. It has been checked locally, not deployed by the content author. Use a dedicated sandbox account with approval to provision networking, ELB, WAF, SNS, EventBridge and (optionally) GuardDuty resources. Never use production or organization-managed detectors without permission. AWS CLI v2, Python 3 and curl are required. Select a supported commercial Region with at least two available Availability Zones; commands below use `us-east-1`.

Download `template.json` and `validate.py` from the LMS into the same directory. Inspect them first. The stack creates a new VPC, two public subnets, an HTTP-only fixed-response ALB restricted to one public IPv4 /32, a regional WAF ACL, a sample-only EventBridge rule, and an SNS email subscription. No EC2 backend, NAT gateway, Lambda, IAM role or real attack traffic is needed. The HTTP endpoint is intentionally for synthetic tests only, not a production design.

## 1. Cost and account guardrails

Estimate costs using current regional pricing: ALB hours and LCUs, two ALB public IPv4 addresses, WAF ACL/rules/requests, GuardDuty analyzed data and enabled protection plans, and SNS/EventBridge usage. Do not assume free-trial eligibility. Do not subscribe to Shield Advanced or provision Network Firewall for this exercise. Configure a budget alert (not a spending cap) and a same-session cleanup reminder. GuardDuty creation can enable service defaults; inspect protection-plan settings and costs after creation. Reusing a detector preserves its existing configuration and costs.

- [ALB pricing](https://aws.amazon.com/elasticloadbalancing/pricing/)
- [VPC public IPv4 pricing](https://aws.amazon.com/vpc/pricing/)
- [WAF pricing](https://aws.amazon.com/waf/pricing/)
- [GuardDuty pricing](https://aws.amazon.com/guardduty/pricing/)
- [SNS pricing](https://aws.amazon.com/sns/pricing/) and [EventBridge pricing](https://aws.amazon.com/eventbridge/pricing/)

Use explicit profile and Region on every AWS command. Replace ALL uppercase placeholders; do not paste them unchanged.

```bash
aws sts get-caller-identity --profile lab --region us-east-1
aws ec2 describe-availability-zones --profile lab --region us-east-1 --filters Name=state,Values=available
aws guardduty list-detectors --profile lab --region us-east-1
```

Record the expected 12-digit account ID. Find your test device's public IPv4 through your approved network tooling; it must be a globally routable address, not `10.x`, `192.168.x`, a documentation address, or a VPN address that changes mid-lab. Use `/32`, never a broad range. If a detector exists, use its ID only with approval and verify it is enabled. If none exists, explicitly opt into creating one below. Do not disable/delete an existing detector to make this exercise work. Stop if an organization policy or delegated administrator prevents the required operation.

## 2. Deploy with the rate rule in Count

Review the stack change set before execution. This command creates it without executing:

```bash
aws cloudformation deploy --profile lab --region us-east-1 --stack-name m08-security-lab --template-file template.json --no-execute-changeset --parameter-overrides LearnerCidr=YOUR_PUBLIC_IPV4/32 Email=YOUR_EMAIL RateAction=Count CreateLabDetector=false ExistingDetectorId=YOUR_APPROVED_DETECTOR_ID
```

For a new detector ONLY when none exists, replace the final two overrides with `CreateLabDetector=true ExistingDetectorId=`. The template enforces exactly one detector choice. Keep this choice unchanged in later updates: changing detector ownership is outside this lab.

Inspect the generated change set in the CloudFormation console for the verified account/Region. It must affect only this new lab stack. Execute the reviewed change set in the console, then wait:

```bash
aws cloudformation wait stack-create-complete --profile lab --region us-east-1 --stack-name m08-security-lab
aws cloudformation describe-stacks --profile lab --region us-east-1 --stack-name m08-security-lab --query 'Stacks[0].Outputs' --output table
```

Record outputs and start time. Confirm the SNS email subscription from your inbox. If creation fails, inspect stack events. WAF associations can briefly fail during propagation; retry only after diagnosing the failure and safely removing a rolled-back disposable stack. An IAM permission or service quota error is not a reason to grant unrestricted access.

## 3. Prove the web control path

Set the URL by copying the ApplicationUrl output. Verify it belongs to this stack before any request:

```bash
LAB_URL='http://YOUR_STACK_ALB_DNS_NAME'
curl --max-time 10 -sS -o /dev/null -w '%{http_code}\n' "$LAB_URL/"
curl --max-time 10 -sS -o /dev/null -w '%{http_code}\n' "$LAB_URL/blocked"
```

Expected: 200, then 403. Retry after propagation if needed. A timeout is not a WAF denial: check the allowed public /32, VPN changes, ALB state and subnet routes. WAF inspects this request before the listener serves its fixed response. Do not send secrets, tokens or personal data to this HTTP endpoint.

## 4. Observe approximate rate enforcement

The rate rule aggregates source IPs only on `/rate-test`, using a limit of 100 requests over 60 seconds. The initial action is Count. Send at most the following bounded burst to YOUR stack; do not use concurrency, load generators or external targets:

```bash
for n in $(seq 1 150); do
  curl --max-time 5 -sS -o /dev/null -w '%{http_code}\n' "$LAB_URL/rate-test" || break
  sleep 0.1
done
```

In the WAF console select the regional ACL and inspect sampled requests and CloudWatch `AWS/WAFV2` metrics for `M08Rate`. Use Sum over a recent interval and distinguish CountedRequests from AllowedRequests. Count is non-blocking. It is possible the bounded sequence ends before the rule reports a rate match.

In the CloudFormation console update this stack using the current template and previous parameter values, changing ONLY `RateAction` to `Block`. Review the change set and wait for UPDATE_COMPLETE. Allow propagation, then repeat the same bounded burst once. Observe BlockedRequests and any 403 responses. Rate enforcement is approximate, not a precise counter/quota. Action/setting updates can interrupt/reset evaluation. A short burst may produce no block; record an inconclusive rate observation rather than increasing traffic indefinitely. The `/blocked` path remains your deterministic enforcement check. Restore `RateAction=Count` with another reviewed update.

## 5. Exercise sample-only notification

Use the DetectorId output. This creates a synthetic finding, not an attack:

```bash
aws guardduty create-sample-findings --profile lab --region us-east-1 --detector-id YOUR_DETECTOR_ID --finding-types Backdoor:EC2/DenialOfService.Tcp
```

The EventBridge rule matches only `aws.guardduty`, `GuardDuty Finding`, the current account, and boolean `detail.service.additionalInfo.sample=true`. Inspect the sample finding, EventBridge rule metrics, and the SNS email. Delivery need not be immediate; updates to existing findings can be aggregated. Do not repeatedly create samples while troubleshooting. If mail is missing, inspect the rule pattern/state, target ARN, SNS topic policy, delivery failures, subscription confirmation and spam folder. The topic policy permits EventBridge's service principal to publish to this specific topic, following the documented SNS target integration. It is not a general-purpose production topic policy. The lab intentionally does NOT alert on real findings or perform remediation.

## 6. Validate configuration and retain evidence

```bash
python3 validate.py --profile lab --region us-east-1 --stack m08-security-lab --expected-account YOUR_12_DIGIT_ACCOUNT
```

The validator invokes read-only AWS CLI operations: STS GetCallerIdentity; CloudFormation DescribeStacks; WAFv2 GetWebACL/GetWebACLForResource; ELBv2 DescribeLoadBalancers/DescribeListeners; EC2 DescribeSecurityGroups; EventBridge DescribeRule/ListTargetsByRule; SNS GetTopicAttributes/ListSubscriptionsByTopic; GuardDuty GetDetector. Its credentials need these permissions. CLI/API errors and incomplete evidence return a nonzero exit code. The script does not deploy, mutate, generate findings, send traffic or inspect your inbox. It is a focused configuration check, not a comprehensive security audit or drift detector.

Record sanitized evidence: configuration-check output; timestamped 200/403 results; rate settings and observed metrics (or the explicit limitation of an inconclusive burst); sample finding ID and delivered email; cleanup result. Do not commit account identifiers, email addresses or credentials. Explain one production change such as HTTPS, real-finding routing, authenticated user limits or an approved containment workflow.

## 7. Cleanup (required even after a failed test)

Reconfirm identity and Region. Save the stack's physical resource IDs/outputs before deleting. Delete ONLY the exact lab stack you created:

```bash
aws sts get-caller-identity --profile lab --region us-east-1
aws cloudformation delete-stack --profile lab --region us-east-1 --stack-name m08-security-lab
aws cloudformation wait stack-delete-complete --profile lab --region us-east-1 --stack-name m08-security-lab
aws guardduty list-detectors --profile lab --region us-east-1
```

Verify in the relevant service consoles that this stack's ALB, ACL/association, VPC/subnets, EventBridge rule, SNS topic/subscription and any stack-created detector are gone. A reused detector must remain unchanged. Do not delete it or its data; sample findings remain under that detector's retention. CloudWatch service metrics can remain visible after resources are deleted. If deletion fails, inspect DELETE_FAILED events, resolve only the lab resource dependencies and retry the exact stack deletion. Do not mark completion until cleanup succeeds. Review billing after usage posts; stack deletion does not erase charges already incurred.

## Official references

- [WAF rate-rule caveats](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-caveats.html)
- [GuardDuty sample findings](https://docs.aws.amazon.com/guardduty/latest/ug/sample_findings.html)
- [GuardDuty EventBridge notifications](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_eventbridge.html)
- [EventBridge target resource policies](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html)

Local-only tests: `node --test lms/tests/*.test.cjs` and `python3 -B -m unittest discover -s lms/tests -p 'test_m08*.py'` from the repository root.

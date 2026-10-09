/* M06 – Multi-account strategy and governance (assembled from per-lesson sections) */
(function () {
  var LESSONS = [], FLASHCARDS = [];

// ================================================================== 00_init.js
var LABS = [];
// ================================================================== 01_why_accounts.js
// ================================================================== 01_why_accounts.js
/* ---------------------------------------------------------------- M06.01 Why multiple accounts */
var DG_0601_BOUNDARY = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0601at m0601ad">
  <title id="m0601at">One account with two VPCs versus two accounts</title>
  <desc id="m0601ad">Left: a single account holds a production VPC and a development VPC. The VPCs separate network traffic, but the identity namespace, service quotas and API rate limits, the bill, the root user and the CloudTrail scope are all shared. Right: production and development live in two separate accounts, each with its own IAM roles, root user, quotas, bill line, CloudTrail and VPCs. Nothing crosses between them unless both sides explicitly allow it.</desc>
  <text class="dg-tb" x="12" y="22">A · One account, two VPCs</text>
  <rect class="dg-region" x="12" y="34" width="360" height="284" rx="10"/>
  <text class="dg-ta" x="24" y="54">Account 111122223333</text>
  <rect class="dg-good" x="24" y="66" width="160" height="70" rx="6"/>
  <text class="dg-tb" x="36" y="88">prod VPC</text>
  <text class="dg-ts" x="36" y="106">10.0.0.0/16</text>
  <text class="dg-ts" x="36" y="124">network-isolated</text>
  <rect class="dg-info" x="200" y="66" width="160" height="70" rx="6"/>
  <text class="dg-tb" x="212" y="88">dev VPC</text>
  <text class="dg-ts" x="212" y="106">10.1.0.0/16</text>
  <text class="dg-ts" x="212" y="124">network-isolated</text>
  <rect class="dg-bad" x="24" y="150" width="336" height="30" rx="6"/>
  <text class="dg-t" x="36" y="170">Shared IAM: one admin reaches both</text>
  <rect class="dg-bad" x="24" y="192" width="336" height="30" rx="6"/>
  <text class="dg-t" x="36" y="212">Shared quotas and API rate limits</text>
  <rect class="dg-bad" x="24" y="234" width="336" height="30" rx="6"/>
  <text class="dg-t" x="36" y="254">One bill: cost split needs tags</text>
  <rect class="dg-bad" x="24" y="276" width="336" height="30" rx="6"/>
  <text class="dg-t" x="36" y="296">One root user, one trail scope</text>

  <text class="dg-tb" x="388" y="22">B · Two accounts</text>
  <rect class="dg-region" x="388" y="34" width="360" height="284" rx="10"/>
  <rect class="dg-good" x="400" y="50" width="164" height="226" rx="8"/>
  <text class="dg-tb" x="412" y="72">Prod account</text>
  <text class="dg-ts" x="412" y="90">444455556666</text>
  <text class="dg-ts" x="412" y="118">own IAM roles</text>
  <text class="dg-ts" x="412" y="140">own root user</text>
  <text class="dg-ts" x="412" y="162">own quotas, API limits</text>
  <text class="dg-ts" x="412" y="184">own bill line</text>
  <text class="dg-ts" x="412" y="206">own CloudTrail events</text>
  <text class="dg-ts" x="412" y="228">own VPCs</text>
  <rect class="dg-info" x="576" y="50" width="164" height="226" rx="8"/>
  <text class="dg-tb" x="588" y="72">Dev account</text>
  <text class="dg-ts" x="588" y="90">777788889999</text>
  <text class="dg-ts" x="588" y="118">own IAM roles</text>
  <text class="dg-ts" x="588" y="140">own root user</text>
  <text class="dg-ts" x="588" y="162">own quotas, API limits</text>
  <text class="dg-ts" x="588" y="184">own bill line</text>
  <text class="dg-ts" x="588" y="206">own CloudTrail events</text>
  <text class="dg-ts" x="588" y="228">own VPCs</text>
  <text class="dg-ts" x="400" y="300">Nothing crosses unless both sides allow it</text>
</svg>
<figcaption>Figure M06-1a. A VPC separates <em>networks</em>; an account separates <em>everything</em>: identities, quotas, the bill, the root user and the audit trail. That is why AWS calls the account the fundamental isolation boundary.</figcaption>
</figure>`;

var DG_0601_BLAST = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0601bt m0601bd">
  <title id="m0601bt">Blast radius of a leaked developer credential</title>
  <desc id="m0601bd">A leaked access key with administrator rights in the development environment. In a single shared account it reaches the development resources, the production data and the audit logs, which the attacker can delete. In a multi-account design the same key reaches only the development account: the production account has no trust relationship with development, and the log archive account is protected by a service control policy that denies deletion.</desc>
  <defs><marker id="m0601b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-bad" x="12" y="114" width="200" height="72" rx="8"/>
  <text class="dg-tb" x="24" y="138">Leaked credential</text>
  <text class="dg-ts" x="24" y="158">dev admin access key</text>
  <text class="dg-ts" x="24" y="176">pushed to a public repo</text>
  <path class="dg-line" d="M212 138 H234 V80 H256" marker-end="url(#m0601b-ar)"/>
  <path class="dg-line" d="M212 162 H234 V220 H256" marker-end="url(#m0601b-ar)"/>

  <rect class="dg-region" x="260" y="16" width="488" height="124" rx="10"/>
  <text class="dg-ta" x="272" y="38">Single account: blast radius = everything</text>
  <rect class="dg-bad" x="272" y="54" width="148" height="70" rx="6"/>
  <text class="dg-tb" x="284" y="80">Dev resources</text>
  <text class="dg-ts" x="284" y="100">compromised</text>
  <rect class="dg-bad" x="432" y="54" width="148" height="70" rx="6"/>
  <text class="dg-tb" x="444" y="80">Prod data</text>
  <text class="dg-ts" x="444" y="100">exposed</text>
  <rect class="dg-bad" x="592" y="54" width="144" height="70" rx="6"/>
  <text class="dg-tb" x="604" y="80">Audit logs</text>
  <text class="dg-ts" x="604" y="100">can be deleted</text>

  <rect class="dg-region" x="260" y="156" width="488" height="128" rx="10"/>
  <text class="dg-ta" x="272" y="178">Multi-account: blast radius = dev account</text>
  <rect class="dg-bad" x="272" y="194" width="148" height="74" rx="6"/>
  <text class="dg-tb" x="284" y="220">Dev account</text>
  <text class="dg-ts" x="284" y="240">compromised</text>
  <rect class="dg-good" x="432" y="194" width="148" height="74" rx="6"/>
  <text class="dg-tb" x="444" y="220">Prod account</text>
  <text class="dg-ts" x="444" y="240">no trust from dev</text>
  <rect class="dg-good" x="592" y="194" width="144" height="74" rx="6"/>
  <text class="dg-tb" x="604" y="220">Log Archive</text>
  <text class="dg-ts" x="604" y="240">SCP denies delete</text>
</svg>
<figcaption>Figure M06-1b. The same mistake, two outcomes. Accounts turn "the attacker has admin" into "the attacker has admin <em>in one account</em>", and organisation guardrails (M06.03) stop even that admin from touching the logs.</figcaption>
</figure>`;

var DG_0601_STARTER = `
<figure>
<svg class="diagram" viewBox="0 0 760 270" role="img" aria-labelledby="m0601ct m0601cd">
  <title id="m0601ct">A typical starter multi-account structure</title>
  <desc id="m0601cd">An organisation root with the management account used only for billing and organisation management. Under it four organisational units: Security with Log Archive and Security Tooling accounts; Infrastructure with Network and Shared Services accounts; Workloads with production and non-production accounts; and Sandbox with developer sandbox accounts.</desc>
  <defs><marker id="m0601c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-edge" x="230" y="12" width="300" height="60" rx="8"/>
  <text class="dg-tb" x="242" y="36">Organization root (r-ab12)</text>
  <text class="dg-ts" x="242" y="56">management account: billing and org only</text>
  <path class="dg-line" d="M380 72 V90 H98 V106" marker-end="url(#m0601c-ar)"/>
  <path class="dg-line" d="M380 72 V90 H286 V106" marker-end="url(#m0601c-ar)"/>
  <path class="dg-line" d="M380 72 V90 H474 V106" marker-end="url(#m0601c-ar)"/>
  <path class="dg-line" d="M380 72 V90 H662 V106" marker-end="url(#m0601c-ar)"/>

  <rect class="dg-region" x="12" y="110" width="172" height="134" rx="8"/>
  <text class="dg-tb" x="24" y="132">Security OU</text>
  <rect class="dg-box" x="24" y="146" width="148" height="38" rx="6"/><text class="dg-t" x="36" y="170">Log Archive</text>
  <rect class="dg-box" x="24" y="194" width="148" height="38" rx="6"/><text class="dg-t" x="36" y="218">Security Tooling</text>

  <rect class="dg-region" x="200" y="110" width="172" height="134" rx="8"/>
  <text class="dg-tb" x="212" y="132">Infrastructure OU</text>
  <rect class="dg-box" x="212" y="146" width="148" height="38" rx="6"/><text class="dg-t" x="224" y="170">Network</text>
  <rect class="dg-box" x="212" y="194" width="148" height="38" rx="6"/><text class="dg-t" x="224" y="218">Shared Services</text>

  <rect class="dg-region" x="388" y="110" width="172" height="134" rx="8"/>
  <text class="dg-tb" x="400" y="132">Workloads OU</text>
  <rect class="dg-good" x="400" y="146" width="148" height="38" rx="6"/><text class="dg-t" x="412" y="170">Prod accounts</text>
  <rect class="dg-info" x="400" y="194" width="148" height="38" rx="6"/><text class="dg-t" x="412" y="218">Non-prod accounts</text>

  <rect class="dg-region" x="576" y="110" width="172" height="134" rx="8"/>
  <text class="dg-tb" x="588" y="132">Sandbox OU</text>
  <rect class="dg-box" x="588" y="146" width="148" height="86" rx="6"/>
  <text class="dg-t" x="600" y="170">Dev sandboxes</text>
  <text class="dg-ts" x="600" y="192">one per developer</text>
  <text class="dg-ts" x="600" y="210">budget-capped</text>
  <text class="dg-ts" x="12" y="262">Every inner box under an OU is a separate AWS account. Details in M06.02 and M06.08.</text>
</svg>
<figcaption>Figure M06-1c. The shape most organisations converge on. You don't need all of it on day one, but knowing the destination stops you from painting yourself into a corner.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.01", title: "Why multiple accounts", level: 200, minutes: 50,
  objectives: [
    "Explain why the AWS account is a hard isolation boundary for identity, quotas, billing, audit and blast radius, and what it does not isolate",
    "Compare account, VPC and tag-based isolation and choose the right one for a given security, compliance or cost requirement",
    "Decide how to split workloads into accounts (by environment, workload, team and function) and estimate how many accounts a design needs",
    "Identify the costs and operational overhead of too many accounts, and the automation that keeps them manageable",
    "Recognise multi-account answers in SAA-C03 scenarios about isolation, compliance scope, quotas and cost allocation"
  ],
  sections: [
    { type: "why", html: `
<p>Picture a company that started on AWS five years ago with one account. Production, staging, the developers' experiments, the data team's notebooks and a forgotten proof of concept all live side by side, separated by VPCs and a naming convention. Then three things happen in the same quarter:</p>
<ul>
  <li>A load test in staging drives Lambda to the account's concurrency limit, and production checkout requests are <strong>throttled</strong> for twenty minutes.</li>
  <li>An engineer with broad permissions runs a clean-up script with the wrong filter and terminates <strong>production</strong> instances, because nothing in IAM really distinguishes "prod" from "dev" except tags someone forgot to apply.</li>
  <li>The company starts taking card payments. The PCI DSS assessor asks which people and systems can reach the cardholder data. The honest answer is "every admin in the account", so the whole account, and everyone in it, is <strong>in audit scope</strong>.</li>
</ul>
<p>None of these is an exotic failure. They are what happens when one container holds things that need different rules. AWS's answer, repeated in the Well-Architected Security pillar ("separate workloads using accounts") and in the whitepaper <em>Organizing Your AWS Environment Using Multiple Accounts</em>, is to use the <strong>AWS account itself</strong> as the unit of isolation, and to manage many accounts centrally with AWS Organizations.</p>
<p>The SAA-C03 exam tests this in Task 1.1 ("designing a security strategy for multiple AWS accounts") and in the cost tasks ("multi-account billing"). Typical stems: "isolate production from development with the LEAST operational overhead", "limit the blast radius", "reduce compliance scope", "allocate costs per business unit". In real work, the account structure is one of the first and hardest-to-reverse decisions you make as an architect: resources such as EC2 instances and RDS databases can't simply be moved between accounts later, so getting the shape roughly right early saves a painful migration.</p>
<p>This lesson builds on M05: you already know that IAM policies live inside an account (M05.01), how cross-account roles and resource policies work (M05.06), and where SCPs and RCPs sit in policy evaluation (M05.03, M05.04). Here we step up a level and ask: <em>how many</em> accounts, split along <em>which</em> lines, and at what cost?</p>` },

    { type: "concept", title: "Concept: the account is a hard boundary", html: DG_0601_BOUNDARY + `
<h3>What an AWS account actually is</h3>
<p>An <strong>AWS account</strong> is a container for resources and identities, identified by a 12-digit account ID, with exactly one <strong>root user</strong> (tied to a unique email address) and one billing relationship. Everything else you create, from IAM roles to S3 buckets to VPCs, belongs to exactly one account. This ownership is what makes the account a <strong>hard boundary</strong>: by default, nothing in one account can see or touch anything in another.</p>
<p>Compare that with a <strong>soft boundary</strong>, such as a tag or a naming convention, which only works if every policy is written correctly and every resource is labelled correctly. Soft boundaries fail open when someone makes a mistake; hard boundaries fail closed.</p>

<h3>The five things an account isolates</h3>
<table>
<thead><tr><th>Dimension</th><th>What the account boundary gives you</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td><strong>Security and identity</strong></td><td>Separate IAM namespace (users, roles, policies), separate root user, default deny across accounts. A principal in account A has no access to account B unless B explicitly trusts it <em>and</em> A allows it (M05.06).</td><td>An over-privileged role in dev can't reach prod. Admin in one account is not admin anywhere else.</td></tr>
<tr><td><strong>Service quotas and API rate limits</strong></td><td>Most quotas are per account per Region: Lambda concurrent executions, EC2 vCPU limits, VPCs per Region, Elastic IPs, API request rates (throttling).</td><td>A noisy dev workload or runaway script can't starve production of capacity or API calls.</td></tr>
<tr><td><strong>Billing and cost</strong></td><td>Every charge is attributed to the account that incurred it. With consolidated billing, the bill is broken down by member (linked) account automatically.</td><td>Cost per team or product without relying on perfect tagging.</td></tr>
<tr><td><strong>Blast radius</strong></td><td>A compromised credential, a bad deployment, a misconfigured script or a deleted resource stays inside one account.</td><td>Incidents are contained; recovery is scoped.</td></tr>
<tr><td><strong>Governance and compliance</strong></td><td>Organisation policies (SCPs, RCPs, declarative policies) attach to accounts and OUs. Audit scope can be drawn around a set of accounts.</td><td>Different rules for regulated and unregulated workloads, enforced centrally and not removable by account admins.</td></tr>
</tbody></table>

<h3>Account vs VPC vs tags: three kinds of isolation</h3>
<p>Architects often ask "can't I just use separate VPCs?" or "can't I just use tags and ABAC?" Each mechanism isolates something different:</p>
<table>
<thead><tr><th>Question</th><th>Separate accounts</th><th>Separate VPCs (same account)</th><th>Tags + IAM conditions (same account)</th></tr></thead>
<tbody>
<tr><td>Network traffic separated?</td><td>Yes (separate VPCs by default)</td><td><strong>Yes</strong>: the VPC's purpose</td><td>No</td></tr>
<tr><td>IAM separated?</td><td><strong>Yes</strong>, by default</td><td>No: any admin reaches both VPCs</td><td>Partly, if every policy checks tags correctly</td></tr>
<tr><td>Quotas / API limits separated?</td><td><strong>Yes</strong></td><td>No</td><td>No</td></tr>
<tr><td>Cost separated?</td><td><strong>Yes</strong>, automatically</td><td>Only with tags</td><td>Only if tags are complete and activated as cost allocation tags</td></tr>
<tr><td>Failure mode when someone makes a mistake</td><td>Fails closed (no access)</td><td>IAM mistakes still cross</td><td>Fails open (missing tag = missing protection)</td></tr>
<tr><td>Overhead</td><td>Highest: needs Organizations, automation, cross-account access</td><td>Low</td><td>Low to set up, high to keep correct</td></tr>
</tbody></table>
<p>These are not either/or. A mature environment uses all three: <strong>accounts</strong> for the big boundaries (environment, workload, regulated data), <strong>VPCs and subnets</strong> for network segmentation inside an account, and <strong>tags</strong> for cost allocation, automation and fine-grained ABAC (M05.08) within an account.</p>

<div class="callout"><strong>Definition: blast radius.</strong> The set of resources, users and business functions that a single failure or compromise can affect. Reducing blast radius is a recurring theme: AZs limit it for infrastructure failures (M04), cells limit it for software failures, and accounts limit it for security and operational mistakes.</div>

<h3>What an account does NOT isolate</h3>
<ul>
  <li><strong>Physical infrastructure.</strong> Accounts share AWS's Regions, AZs and data centres. Separate accounts don't protect you from a Region outage; multi-AZ and multi-Region designs do.</li>
  <li><strong>Things you explicitly connect.</strong> A cross-account role that trusts the dev account, a bucket policy with <code>"Principal": "*"</code>, a peered VPC or a shared Transit Gateway all deliberately cross the boundary. The boundary is only as good as the trusts you create.</li>
  <li><strong>The management account's power.</strong> The organisation's management account can create accounts, move them between OUs and change their policies. It is the one account SCPs can't restrict, so it must be guarded carefully and run no workloads.</li>
  <li><strong>Global names.</strong> S3 bucket names (in the general-purpose namespace) are unique across all accounts, so two accounts still compete for names.</li>
</ul>` },

    { type: "concept", title: "Concept: the reasons to split, and the costs of splitting", html: DG_0601_BLAST + `
<h3>The eight reasons in AWS's guidance</h3>
<p>The multi-account whitepaper lists the business reasons for using multiple accounts. Learn them; exam stems paraphrase them.</p>
<ol>
  <li><strong>Group workloads by business purpose and ownership.</strong> Each product or team owns its accounts and is accountable for what happens in them.</li>
  <li><strong>Apply distinct security controls by environment.</strong> Production gets strict guardrails and change control; development gets freedom to experiment.</li>
  <li><strong>Constrain access to sensitive data.</strong> Put regulated data (card data, health records, personal data) in a small number of accounts that few people can reach.</li>
  <li><strong>Promote innovation and agility.</strong> Sandbox accounts let engineers try services without risk to anything shared.</li>
  <li><strong>Limit the scope of impact from adverse events.</strong> Security incidents, bad deployments and human error stay in one account (Figure M06-1b).</li>
  <li><strong>Support multiple IT operating models.</strong> A central platform team and autonomous product teams can coexist, each in their own accounts.</li>
  <li><strong>Manage costs.</strong> The account is the most reliable cost-allocation unit AWS has.</li>
  <li><strong>Distribute service quotas and API request rate limits.</strong> Each account gets its own allowance.</li>
</ol>

<h3>Common ways to split</h3>
<table>
<thead><tr><th>Split by…</th><th>Example accounts</th><th>Strength</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td><strong>Environment</strong></td><td>app-prod, app-staging, app-dev</td><td>The most important split: prod gets strict controls, dev gets freedom</td><td>Promote code with pipelines, not by copying resources between accounts</td></tr>
<tr><td><strong>Workload / product</strong></td><td>payments-prod, catalogue-prod</td><td>Ownership, cost and blast radius per product</td><td>Shared databases between products become cross-account dependencies</td></tr>
<tr><td><strong>Function (shared platform)</strong></td><td>log-archive, security-tooling, network, shared-services</td><td>Central teams own central capabilities; workload admins can't tamper with logs</td><td>These accounts are high value; protect them most</td></tr>
<tr><td><strong>Data sensitivity / compliance</strong></td><td>pci-cde-prod, phi-processing</td><td>Shrinks audit scope; stricter guardrails only where needed</td><td>Data flows into and out of these accounts must be designed and documented</td></tr>
<tr><td><strong>Team / individual</strong></td><td>sandbox-alice, team-ml-dev</td><td>Autonomy, experimentation, easy clean-up (close the account)</td><td>Needs budgets and automated clean-up to avoid sprawl</td></tr>
</tbody></table>
<p>The usual combination is <strong>workload × environment</strong> for application accounts, plus a small set of <strong>functional</strong> accounts, plus <strong>sandboxes</strong>. Figure M06-1c (in the AWS section) shows the resulting structure.</p>

<h3>Granularity: how small should an account be?</h3>
<p>A good rule: <strong>one account per workload per environment</strong>, where a "workload" is a set of components owned by one team that are deployed and changed together. Too coarse ("all of prod in one account") and you lose ownership, cost clarity and blast-radius control. Too fine ("one account per microservice per environment") and you multiply cross-account networking, IAM trust and operational work for little security gain. If two components always change together, share data heavily and are owned by the same team, they probably belong in the same account.</p>

<h3>The costs of more accounts</h3>
<p>Accounts are free to create, but they aren't free to run. Count these costs honestly:</p>
<ul>
  <li><strong>Per-account baseline services.</strong> Each account needs CloudTrail (an organisation trail covers it), AWS Config recording, GuardDuty, Security Hub and similar. Several of these are priced per account or per resource evaluated, so the security baseline cost grows with the number of accounts.</li>
  <li><strong>Duplicated infrastructure.</strong> If every account has its own VPC with NAT gateways in three AZs, you pay for every NAT gateway every hour. Centralised egress or VPC sharing (M06.07, M10) reduces this, but adds Transit Gateway charges.</li>
  <li><strong>Cross-account plumbing.</strong> Roles, resource policies, KMS key policies, RAM shares and DNS all have to be designed for cross-account use. Each one is a place to make a mistake.</li>
  <li><strong>Operational overhead.</strong> Quotas must be raised per account, patches and baselines rolled out per account, and people need access to the right accounts. Without automation (Control Tower, Account Factory, StackSets, IAM Identity Center), this becomes unmanageable at around a few dozen accounts.</li>
  <li><strong>Cognitive load.</strong> Engineers need to know which account holds what. Naming conventions, an account inventory and consistent tagging of accounts themselves matter.</li>
</ul>
<div class="callout warn"><strong>The trap:</strong> multi-account without central management is worse than one account. Fifty unrelated accounts with their own IAM users, root passwords and credit cards are fifty attack surfaces. The benefits only appear when accounts are created, governed and accessed centrally, which is exactly what the rest of M06 teaches.</div>` },

    { type: "workflow", title: "Workflow: designing an account structure", html: `
<ol class="flow">
  <li><strong>Inventory the workloads.</strong> List applications, data stores and shared platforms. For each, note the owning team, the environments it needs (prod, staging, dev, test) and the data it handles (public, internal, confidential, regulated).</li>
  <li><strong>Identify the hard boundaries.</strong> Production vs non-production is always one. Add regulated data (PCI, HIPAA, government), different legal entities or customers that contractually require isolation, and any workload whose quotas or API usage could starve others.</li>
  <li><strong>Create the functional accounts first.</strong> A management account (billing and organisation only), Log Archive, Security Tooling (audit), and, when needed, Network and Shared Services. These are the foundation that every workload account depends on.</li>
  <li><strong>Choose the workload granularity.</strong> Default to one account per workload per environment. Merge when the components share a team, a lifecycle and heavy data access; split when ownership, compliance or quotas differ.</li>
  <li><strong>Group accounts into OUs by policy, not by org chart.</strong> Accounts that need the same guardrails go in the same OU (Workloads/Prod, Workloads/Non-prod, Sandbox). Reorganisations change org charts; they shouldn't force you to move accounts (M06.02).</li>
  <li><strong>Plan cross-account access and networking.</strong> Who reaches which account (IAM Identity Center permission sets, M06.05)? How do VPCs connect (Transit Gateway, VPC sharing, M06.07 and M10)? Where do logs go?</li>
  <li><strong>Count and cost it.</strong> Number of accounts, NAT gateways, TGW attachments, per-account security services. Check the Organizations account quota and request an increase early if you need it.</li>
  <li><strong>Automate account creation.</strong> Every account must be born with the same baseline: guardrails, logging, security services, access, budget alarms. Use Control Tower Account Factory or AFT (M06.04), never hand-built accounts.</li>
  <li><strong>Review regularly.</strong> Close unused accounts, move accounts whose purpose changed, and adjust OUs as new compliance or business needs appear.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: the multi-account toolkit", html: DG_0601_STARTER + `
<h3>The services that make many accounts manageable</h3>
<table>
<thead><tr><th>Need</th><th>AWS service</th><th>Deep dive</th></tr></thead>
<tbody>
<tr><td>Group accounts, one bill, attach policies to groups of accounts</td><td><strong>AWS Organizations</strong> (management account, OUs, consolidated billing)</td><td>M06.02</td></tr>
<tr><td>Guardrails no account admin can remove</td><td><strong>SCPs</strong>, <strong>RCPs</strong>, declarative policies</td><td>M06.03</td></tr>
<tr><td>Set up a governed landing zone, vend new accounts with a baseline</td><td><strong>AWS Control Tower</strong> (Account Factory, controls)</td><td>M06.04</td></tr>
<tr><td>One sign-in for people across all accounts</td><td><strong>IAM Identity Center</strong> (permission sets, account assignments)</td><td>M06.05</td></tr>
<tr><td>Corporate Active Directory integration</td><td><strong>AWS Directory Service</strong></td><td>M06.06</td></tr>
<tr><td>Share subnets, Transit Gateways, Resolver rules between accounts</td><td><strong>AWS RAM</strong></td><td>M06.07</td></tr>
<tr><td>Central security services across accounts</td><td>GuardDuty, Security Hub, Config, Access Analyzer with a <strong>delegated administrator</strong></td><td>M06.08, M08, M31</td></tr>
<tr><td>Deploy the same stack to many accounts</td><td>CloudFormation <strong>StackSets</strong> (service-managed, by OU)</td><td>M36</td></tr>
</tbody></table>

<h3>Quotas: the per-account facts the exam likes</h3>
<p>Most service quotas apply <strong>per account, per Region</strong>. A few examples of defaults (all adjustable through the Service Quotas console unless noted):</p>
<table>
<thead><tr><th>Quota</th><th>Default</th><th>Multi-account implication</th></tr></thead>
<tbody>
<tr><td>Lambda concurrent executions</td><td>1,000 per Region</td><td>Shared by every function in the account and Region; at least 100 must stay unreserved, so one function can reserve at most 900</td></tr>
<tr><td>VPCs per Region</td><td>5</td><td>Each account gets its own five</td></tr>
<tr><td>Elastic IP addresses per Region</td><td>5</td><td>Same</td></tr>
<tr><td>EC2 On-Demand instances</td><td>vCPU-based limits per instance family group</td><td>Large dev experiments can't use prod's vCPU headroom if they're in another account</td></tr>
<tr><td>API request rates (e.g. EC2, IAM, STS)</td><td>Token-bucket throttling per account (and Region for regional services)</td><td>A chatty automation script in one account can't throttle another account's deployments</td></tr>
<tr><td>IAM roles per account</td><td>1,000 (adjustable)</td><td>Global (not per Region); splitting accounts also splits this</td></tr>
</tbody></table>
<div class="callout tip"><strong>Quota request templates.</strong> Service Quotas has a <em>quota request template</em> feature for organisations: you list quota increases once, and they are requested automatically for every new account created in the organisation. Use it so new prod accounts don't start life with default limits.</div>

<h3>Billing across accounts</h3>
<p>With consolidated billing (on by default in an organisation), the management account pays one bill. Usage from all accounts is <strong>combined for volume pricing tiers</strong> (for example S3 storage tiers and data transfer), and Reserved Instance and Savings Plans discounts are <strong>shared</strong> across accounts by default. So splitting into many accounts does not cost you volume discounts, as long as they're in one organisation. Cost Explorer and the Cost and Usage Report break costs down by <strong>linked account</strong> with no tagging effort; cost allocation tags then refine it within an account. Details in M06.02.</p>

<h3>Availability Zone names differ between accounts</h3>
<p>AWS maps AZ <em>names</em> (us-east-1a) to physical AZs independently for each account, to spread load. So <code>us-east-1a</code> in the prod account may be a different physical AZ from <code>us-east-1a</code> in the network account. The <strong>AZ ID</strong> (for example <code>use1-az1</code>) is the same physical AZ in every account. Always use AZ IDs when coordinating across accounts, for example with VPC sharing (M06.07) or when you want cross-account traffic to stay in one AZ to avoid cross-AZ data transfer charges.</p>

<h3>Account lifecycle facts</h3>
<ul>
  <li>Every account needs a unique root email address. Use a distribution list or plus-addressed aliases owned by the platform team, never a personal mailbox.</li>
  <li>Accounts created from Organizations get an <code>OrganizationAccountAccessRole</code> that the management account can assume; invited existing accounts don't (M06.02).</li>
  <li>With <strong>centralised root access management</strong> (M05.01) you can remove root credentials from member accounts and perform the rare root-only tasks centrally.</li>
  <li>A closed account enters a post-closure period of about 90 days during which it can be reopened; then it is permanently closed. Closure is the cleanest way to delete everything in a sandbox.</li>
  <li>The organisation has a quota on the number of member accounts that starts low and is adjustable. Request an increase before a migration, not during it.</li>
</ul>` },

    { type: "examples", html: `
<h3>Example 1: the quota collision, in numbers</h3>
<p>A single account in eu-west-1 has the default Lambda quota of 1,000 concurrent executions. Production checkout needs a peak of about 600. A staging load test is configured to reach 800.</p>
<ul>
  <li>Combined demand: 600 + 800 = 1,400, which is 400 more than the 1,000 available. Whichever function asks last is throttled (HTTP 429, <code>TooManyRequestsException</code>).</li>
  <li><strong>Single-account fix:</strong> reserve concurrency for checkout (say 650). Staging is then capped at 1,000 − 650 = 350 for <em>all</em> other functions in the account. It works for Lambda, but you need a separate fix for every other shared quota (EC2 vCPUs, API rates, ENIs, Elastic IPs…).</li>
  <li><strong>Multi-account fix:</strong> staging runs in its own account with its own 1,000. Production keeps its full 1,000. Every other quota is separated at the same time.</li>
</ul>

<h3>Example 2: identity really is separate</h3>
<p>A developer in the dev account (777788889999) has <code>AdministratorAccess</code> and tries to read a prod bucket in 444455556666:</p>
<pre><code>$ aws sts get-caller-identity --profile dev-admin
{
    "UserId": "AROAEXAMPLEID1234567:alice",
    "Account": "777788889999",
    "Arn": "arn:aws:sts::777788889999:assumed-role/AWSReservedSSO_AdministratorAccess_1a2b3c4d5e6f7a8b/alice"
}

$ aws s3 ls s3://payments-prod-ledger --profile dev-admin
An error occurred (AccessDenied) when calling the ListObjectsV2 operation: Access Denied</code></pre>
<p><code>AdministratorAccess</code> allows <code>s3:*</code> on <code>*</code>, but "everything" means everything <em>the account can grant</em>. The bucket belongs to another account and its policy doesn't name the dev account, so the cross-account rule (both sides must allow) denies it. In a single account the same role would have read the bucket.</p>

<h3>Example 3: a bucket policy that keeps the dev account out, even by mistake</h3>
<p>Accounts are the first line. For high-value data, add an explicit resource-side guard that names only the accounts that should ever have access. This bucket policy in the prod account denies any principal from outside the prod account itself, except the organisation's security tooling account:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyOutsideProdAndSecurity",
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": [
      "arn:aws:s3:::payments-prod-ledger",
      "arn:aws:s3:::payments-prod-ledger/*"
    ],
    "Condition": {
      "StringNotEquals": {
        "aws:PrincipalAccount": ["444455556666", "111122223333"]
      },
      "Bool": { "aws:PrincipalIsAWSService": "false" }
    }
  }]
}</code></pre>
<p>Even if someone later adds a careless Allow for the dev account, this Deny wins. (At organisation scale you'd use an RCP for the same idea, M06.03.)</p>

<h3>Example 4: counting accounts for a mid-sized company</h3>
<p>Northwind Logistics runs three applications (tracking, billing, partner-API). Each needs prod, staging and dev. Platform needs are a log archive, a security tooling account, a network hub and a shared-services account (CI/CD, artefact repositories).</p>
<table>
<thead><tr><th>Group</th><th>Calculation</th><th>Accounts</th></tr></thead>
<tbody>
<tr><td>Application accounts</td><td>3 workloads × 3 environments</td><td>9</td></tr>
<tr><td>Functional accounts</td><td>Log Archive, Security Tooling, Network, Shared Services</td><td>4</td></tr>
<tr><td>Management account</td><td>billing and organisation only</td><td>1</td></tr>
<tr><td><strong>Total (before sandboxes)</strong></td><td>9 + 4 + 1</td><td><strong>14</strong></td></tr>
</tbody></table>
<p>Add one sandbox per developer who wants one. Fourteen accounts sounds like a lot to a team used to one, but with Control Tower and Identity Center the marginal effort of the fifteenth account is close to zero.</p>

<h3>Example 5: the cost of duplicated NAT gateways</h3>
<p>Twenty workload accounts each have a VPC with one NAT gateway per AZ in three AZs. Using the us-east-1 hourly price of $0.045 per NAT gateway-hour and 730 hours per month (hourly charge only; data processing excluded):</p>
<ul>
  <li>Per NAT gateway: 0.045 × 730 = <strong>$32.85</strong> per month.</li>
  <li>Distributed: 20 accounts × 3 NAT gateways = 60 × $32.85 = <strong>$1,971</strong> per month.</li>
  <li>Centralised egress (M10): one egress VPC with 3 NAT gateways (3 × $32.85 = $98.55) plus Transit Gateway attachments at $0.05 per attachment-hour for 21 VPCs (20 spokes + the egress VPC): 21 × 0.05 × 730 = $766.50. Total <strong>$865.05</strong> per month.</li>
</ul>
<p>Centralisation saves on hourly charges here, but Transit Gateway adds a data-processing charge per GB on top of NAT's own per-GB charge, so a high-egress design can tip the other way. Always run both numbers with your real traffic. The lesson for this module: <strong>more accounts multiply per-account infrastructure</strong>, so shared networking is part of the multi-account design, not an afterthought.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Development experiments must never affect production capacity or data</td><td>Separate prod and non-prod accounts in different OUs</td><td>Separate IAM, quotas and blast radius; stricter guardrails on the prod OU</td></tr>
<tr><td>Card payments service must pass PCI DSS with the smallest audit scope</td><td>Dedicated cardholder-data-environment accounts in their own OU with extra guardrails</td><td>Only those accounts, and the few people with access to them, are in scope</td></tr>
<tr><td>Finance wants cost per product without chasing tags</td><td>One account (or set of accounts) per product under consolidated billing</td><td>Linked-account cost breakdown is automatic and complete; tags refine it</td></tr>
<tr><td>SaaS company with enterprise customers contractually requiring isolation</td><td>Account per large tenant (silo), pooled accounts for small tenants</td><td>Strong isolation and per-tenant cost where it's paid for; efficiency elsewhere</td></tr>
<tr><td>Security team needs logs that workload admins can't delete</td><td>Dedicated Log Archive account receiving the organisation trail</td><td>Workload admins have no access to that account; SCPs protect the bucket</td></tr>
<tr><td>Two microservices, same team, same release, share one database</td><td>Same account (separate per environment)</td><td>Splitting them adds cross-account access and networking without reducing risk</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: see the account boundary for yourself", html: `
<p>Run these in AWS CloudShell or with your <code>academy-admin</code> profile. All are read-only and free, except the last, which costs $0.01 per Cost Explorer API request.</p>
<pre><code># 1. Which account am I in, and as whom?
aws sts get-caller-identity

# 2. Is this account part of an organisation? (error AWSOrganizationsNotInUseException = standalone)
aws organizations describe-organization \\
  --query "Organization.{Id:Id,Mgmt:MasterAccountId,Features:FeatureSet}"

# 3. Per-account Lambda quota and how much is unreserved
aws lambda get-account-settings --query "AccountLimit"

# 4. Per-account EC2 limits for this Region
aws ec2 describe-account-attributes \\
  --attribute-names vpc-max-elastic-ips default-vpc \\
  --query "AccountAttributes[].[AttributeName,AttributeValues[0].AttributeValue]" --output table

# 5. AZ names vs AZ IDs: compare this output between two accounts
aws ec2 describe-availability-zones \\
  --query "AvailabilityZones[].[ZoneName,ZoneId]" --output table

# 6. (management account, $0.01) last month's cost by linked account
aws ce get-cost-and-usage \\
  --time-period Start=2026-09-01,End=2026-10-01 --granularity MONTHLY \\
  --metrics UnblendedCost --group-by Type=DIMENSION,Key=LINKED_ACCOUNT</code></pre>
<p>Sample output from step 3 and step 5:</p>
<pre><code>{
    "TotalCodeSize": 80530636800,
    "CodeSizeUnzipped": 262144000,
    "CodeSizeZipped": 52428800,
    "ConcurrentExecutions": 1000,
    "UnreservedConcurrentExecutions": 1000
}
-----------------------------
| DescribeAvailabilityZones |
+-------------+-------------+
|  eu-west-1a |  euw1-az3   |
|  eu-west-1b |  euw1-az1   |
|  eu-west-1c |  euw1-az2   |
+-------------+-------------+</code></pre>
<p><strong>What to notice:</strong> the Lambda limit is a number that belongs to <em>this</em> account. A brand-new account may show a lower starting value than 1,000 until AWS raises it with usage, which is one reason to request quota increases early for new prod accounts. If you have a second account (Lab L06 creates some), run step 5 there: the name-to-ID mapping will often differ.</p>
<p><strong>Thought exercise.</strong> Write down your current (or a past) employer's AWS setup. For each of the five dimensions in the concept table, ask: is it isolated today? What incident would show the gap?</p>` },

    { type: "casestudy", title: "Case study: Fernhill Health leaves the single account", html: `
<p><strong>Situation.</strong> Fernhill Health, a 120-person digital-health start-up, ran everything in one AWS account for four years: a patient-facing app, a clinician portal, a data-science platform and all their dev and staging copies. Separation was by VPC and a tag <code>env=prod|staging|dev</code>. Over six months they had a staging Lambda load test throttle production, a developer accidentally delete a production DynamoDB table (point-in-time recovery saved them, after four hours of downtime), and a HIPAA-focused customer audit that flagged "38 IAM principals with administrative access to systems storing PHI".</p>
<p><strong>Requirements.</strong> Production isolated from non-production for identity, quotas and data. Protected health information (PHI) reachable by as few people as possible. Logs that no workload admin can alter. Cost per product line for the board. No more than two platform engineers to run it.</p>
<p><strong>Design.</strong> They enabled AWS Organizations with all features and set up AWS Control Tower, which created the Security OU with Log Archive and Audit accounts. They added an Infrastructure OU (Network, Shared Services) and a Workloads OU with Prod and Non-prod child OUs, and created accounts per workload per environment: patient-app, clinician-portal and data-platform, each × prod, staging, dev. PHI-handling prod accounts went into a <em>Prod-PHI</em> OU with extra guardrails (Region restriction, deny disabling encryption). People sign in through IAM Identity Center with the corporate IdP; only an on-call group has write access to prod, and the old IAM users were deleted. A Transit Gateway in the Network account connects VPCs; egress is centralised.</p>
<table>
<thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>Accounts</td><td>1</td><td>16 (13 + management + 2 sandboxes)</td></tr>
<tr><td>Principals with admin access to PHI</td><td>38</td><td>4 (break-glass and on-call)</td></tr>
<tr><td>Cost by product line</td><td>Estimated from incomplete tags</td><td>Exact, by linked account</td></tr>
<tr><td>New environment lead time</td><td>Days (manual)</td><td>Under an hour (Account Factory)</td></tr>
</tbody></table>
<p><strong>Result.</strong> The migration took four months, most of it moving data stores (snapshots shared and restored in the new accounts; S3 replication for buckets) and rewriting hard-coded ARNs. The next customer audit scoped only the three Prod-PHI accounts. Monthly AWS spend rose about 6% from per-account security services and Transit Gateway, which finance accepted as the cost of the audit result.</p>
<p><strong>Lessons learned.</strong> (1) Moving resources between accounts is a migration, not a setting: start multi-account early. (2) The accounts alone didn't fix access; Identity Center and deleting the old IAM users did. (3) They initially created one account per microservice for the data platform (nine accounts) and merged them back to three within a month, because the services shared one team and one data lake.</p>` },

    { type: "exam", html: `
<h3>Keywords → answer</h3>
<table>
<thead><tr><th>Stem says…</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Isolate production from development", "strongest isolation", "limit the blast radius"</td><td><strong>Separate AWS accounts</strong> (per environment) in AWS Organizations</td></tr>
<tr><td>"Reduce the scope of the compliance audit (PCI, HIPAA)"</td><td>Put regulated workloads in <strong>dedicated accounts</strong> in their own OU</td></tr>
<tr><td>"Allocate costs to departments / business units with the LEAST effort"</td><td><strong>Separate accounts per department + consolidated billing</strong>; cost allocation tags for finer detail</td></tr>
<tr><td>"Development workloads exhaust service quotas used by production"</td><td>Separate accounts (quotas are per account per Region)</td></tr>
<tr><td>"Centrally manage and govern many accounts", "apply guardrails to all accounts"</td><td>AWS Organizations + SCPs; AWS Control Tower for a landing zone</td></tr>
<tr><td>"Keep logs where workload administrators can't modify them"</td><td>Dedicated <strong>Log Archive</strong> account with an organisation trail</td></tr>
<tr><td>"Coordinate Availability Zones across accounts"</td><td>Use <strong>AZ IDs</strong>, not AZ names</td></tr>
</tbody></table>

<h3>Common distractors</h3>
<ul>
  <li><strong>"Use separate VPCs for each environment in the same account"</strong> when the requirement is IAM or quota isolation. VPCs separate networks only.</li>
  <li><strong>"Use resource tags and IAM conditions"</strong> as the main isolation boundary for regulated data. Useful inside an account, but fails open if a tag is missing.</li>
  <li><strong>"Use separate Regions"</strong> for environment isolation. Same IAM, same bill, and IAM is global.</li>
  <li><strong>"Create a separate AWS account with its own credit card for each team"</strong> without Organizations. Isolation yes, but no central governance, no consolidated billing, no shared volume discounts.</li>
  <li><strong>"Run production workloads in the management account"</strong>. SCPs don't apply to it; keep it empty.</li>
</ul>

<h3>X vs Y</h3>
<table>
<thead><tr><th></th><th>Separate accounts</th><th>Separate VPCs</th><th>Tags / ABAC</th><th>Permissions boundary</th></tr></thead>
<tbody>
<tr><td>Isolates</td><td>Identity, quotas, billing, blast radius, network</td><td>Network</td><td>Access within an account, cost reports</td><td>The max permissions of specific roles</td></tr>
<tr><td>Fails…</td><td>Closed</td><td>Closed for traffic, open for IAM</td><td>Open (missing tag)</td><td>Closed for that role only</td></tr>
<tr><td>Typical exam use</td><td>Env / compliance / cost separation</td><td>Network segmentation</td><td>Scaling permissions, cost allocation</td><td>Safe delegation of role creation</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Start multi-account on day one, even small.</strong> Management + prod + non-prod is a fine start for a three-person team. Adding accounts later is easy; moving resources out of a crowded account is a migration.</li>
  <li><strong>Never run workloads in the management account.</strong> It can't be restricted by SCPs or RCPs, and anyone with admin there controls the whole organisation.</li>
  <li><strong>Accounts without automation become sprawl.</strong> Vend accounts from a pipeline (Control Tower Account Factory or AFT) with the baseline applied: guardrails, organisation trail, Config, GuardDuty, budgets, Identity Center access. Hand-built accounts drift within weeks.</li>
  <li><strong>Remove IAM users when you go multi-account.</strong> People should reach accounts through IAM Identity Center, not with users in each account. Otherwise you have N times the long-term credentials.</li>
  <li><strong>Raise quotas per account, before you need them.</strong> New accounts start at defaults, some lower than you're used to. Use Service Quotas request templates for the organisation.</li>
  <li><strong>Watch cross-account traffic costs.</strong> Data transfer pricing depends on AZs and Regions, not accounts, but cross-account designs often add Transit Gateway or PrivateLink hops that cost per GB. Use AZ IDs to keep chatty services in the same physical AZ.</li>
  <li><strong>Hard-coded account IDs and ARNs</strong> are the top migration pain. Parameterise them in IaC (SSM parameters, CloudFormation pseudo-parameters such as <code>AWS::AccountId</code>).</li>
  <li><strong>Troubleshooting "AccessDenied" across accounts:</strong> check, in order, the caller's identity policy, the target's trust or resource policy, SCPs/RCPs on both sides, KMS key policies, then VPC endpoint policies (M05.04, M05.06).</li>
  <li><strong>Close sandboxes, don't clean them.</strong> Closing an account is the most reliable way to stop all its charges. Budgets with alerts (and automated actions) on every sandbox prevent bill shock.</li>
  <li><strong>Treat the root emails as critical assets.</strong> Whoever controls the root email of an account can reset its root password. Use group mailboxes the platform team controls, and centralised root access management where possible.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>The AWS account is a <strong>hard isolation boundary</strong>: separate IAM namespace and root user, separate quotas and API limits, separate bill line, separate blast radius, and a unit for organisation policies.</li>
  <li><strong>VPCs</strong> separate networks only; <strong>tags</strong> help inside an account but fail open. Use accounts for the big boundaries and VPCs and tags inside them.</li>
  <li>Split by <strong>environment</strong> first, then by <strong>workload</strong>, plus <strong>functional</strong> accounts (Log Archive, Security Tooling, Network, Shared Services) and <strong>sandboxes</strong>.</li>
  <li>Default granularity: <strong>one account per workload per environment</strong>; don't go to one account per microservice.</li>
  <li>Dedicated accounts for regulated data <strong>shrink compliance scope</strong>.</li>
  <li>Most service quotas are <strong>per account per Region</strong> (e.g. Lambda 1,000 concurrent executions, 5 VPCs, 5 Elastic IPs), so accounts stop noisy neighbours.</li>
  <li>Consolidated billing gives per-account cost visibility while keeping volume tiers and RI/Savings Plans sharing.</li>
  <li>More accounts cost money and effort (baseline security services, duplicated networking, cross-account plumbing); central management and automation (M06.02–M06.05) are what make them worth it.</li>
  <li>The management account runs no workloads; AZ names differ per account, so use <strong>AZ IDs</strong> across accounts.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.01-d1", q: "An account has the default Lambda quota of 1,000 concurrent executions in a Region. At least 100 must remain unreserved. What is the maximum reserved concurrency you can give a single function?", answers: ["900"], hint: "1,000 minus the unreserved minimum.", explain: "1,000 − 100 = 900. A separate account would instead give the other workloads their own full 1,000." },
    { id: "M06.01-d2", q: "20 workload accounts each run 3 NAT gateways. At $0.045 per NAT gateway-hour and 730 hours per month, what is the monthly hourly-charge total in USD? (number only)", answers: ["1971", "1,971", "$1971", "$1,971", "1971.00", "1,971.00"], hint: "0.045 × 730 per gateway, times the number of gateways.", explain: "0.045 × 730 = 32.85 per gateway; 20 × 3 = 60 gateways; 60 × 32.85 = $1,971 per month (before per-GB processing)." },
    { id: "M06.01-d3", q: "Instead, one egress VPC has 3 NAT gateways ($0.045/h each), and 21 VPCs (20 spokes + the egress VPC) attach to a Transit Gateway at $0.05 per attachment-hour. With 730 hours per month, what is the monthly hourly-charge total in USD? (number only)", answers: ["865.05", "$865.05", "865.050", "865"], hint: "3 × 32.85 + 21 × 0.05 × 730.", explain: "NAT: 3 × 32.85 = 98.55. TGW: 21 × 0.05 × 730 = 766.50. Total $865.05 per month, before per-GB charges for both services." },
    { id: "M06.01-d4", q: "Which isolation construct separates IAM principals, service quotas and billing by default: account, VPC or tag?", answers: ["account", "aws account", "an account", "accounts"], explain: "Only the account separates all three. A VPC separates network traffic; tags are a soft boundary." },
    { id: "M06.01-d5", q: "A company has 3 applications, each with prod, staging and dev accounts, plus Log Archive, Security Tooling, Network and Shared Services accounts, plus the management account. How many AWS accounts in total?", answers: ["14", "fourteen"], hint: "3 × 3 + 4 + 1.", explain: "9 application accounts + 4 functional accounts + 1 management account = 14." },
    { id: "M06.01-d6", q: "What is the identifier such as <code>use1-az1</code> called, which refers to the same physical Availability Zone in every account?", answers: ["AZ ID", "az id", "azid", "availability zone id", "zone id", "zoneid"], explain: "AZ names (us-east-1a) are mapped per account; AZ IDs are consistent across accounts." },
    { id: "M06.01-d7", q: "Which account in an organisation should run no workloads because SCPs can't restrict it?", answers: ["management account", "management", "the management account", "payer account", "payer", "master account"], explain: "SCPs and RCPs never apply to the management account, so keep it for billing and organisation administration only." },
    { id: "M06.01-d8", q: "What is the default quota for VPCs per Region in each AWS account?", answers: ["5", "five"], explain: "5 VPCs per Region per account (adjustable). Each new account gets its own allowance." },
    { id: "M06.01-d9", q: "A role with <code>AdministratorAccess</code> in the dev account tries to read a bucket in the prod account. The bucket policy doesn't mention the dev account and there is no cross-account role. Allowed or denied?", answers: ["denied", "deny", "access denied"], explain: "Cross-account access needs an allow in the owning account's resource or trust policy too. AdministratorAccess only covers what the dev account can grant." }
  ],
  check: [
    { id: "M06.01-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company runs development, test and production in one AWS account, separated by VPCs. A developer with broad IAM permissions accidentally deleted production resources. The company wants the STRONGEST isolation between environments with the least ongoing policy maintenance. What should a solutions architect recommend?",
      options: [
        { t: "Move each environment into its own AWS account in AWS Organizations, with production accounts in a separate OU", c: true, why: "The account boundary separates IAM by default, so dev permissions can't reach prod without an explicit cross-account trust, and the prod OU can carry stricter guardrails." },
        { t: "Tag every resource with an environment tag and add IAM conditions that match aws:ResourceTag/env", c: false, why: "Tag-based isolation fails open when a tag is missing and requires every policy to be correct; it is not the strongest isolation." },
        { t: "Add network ACLs between the VPCs to block traffic", c: false, why: "The deletion was an IAM action through the AWS API, not network traffic; NACLs don't affect it." },
        { t: "Move development to a different AWS Region in the same account", c: false, why: "IAM is global in an account, so the same principals still reach production." }
      ] },
    { id: "M06.01-k2", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Load tests in a staging environment repeatedly cause throttling of production Lambda functions and EC2 API calls in the same account. The company must ensure that no non-production activity can ever consume production's service quotas or API request limits. Which solution meets this requirement?",
      options: [
        { t: "Run staging in a separate AWS account", c: true, why: "Service quotas and API rate limits apply per account (per Region), so a separate account gives staging its own allowance for every service at once." },
        { t: "Configure reserved concurrency for the production Lambda functions", c: false, why: "It protects only Lambda concurrency for those functions; EC2 API throttling and other shared quotas remain." },
        { t: "Request a higher Lambda concurrency quota", c: false, why: "A higher shared limit can still be consumed by staging; it doesn't isolate anything." },
        { t: "Move staging to a separate VPC with its own subnets", c: false, why: "Quotas and API limits are account-level, not VPC-level." }
      ] },
    { id: "M06.01-k3", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "Which statements about the AWS account as an isolation boundary are correct?",
      options: [
        { t: "IAM principals in one account have no access to another account's resources unless that account explicitly allows it", c: true, why: "Cross-account access requires the owning account's trust or resource policy to allow it, plus the caller's identity policy." },
        { t: "Most service quotas, such as Lambda concurrent executions, are applied per account per Region", c: true, why: "That's why separate accounts prevent noisy-neighbour quota exhaustion." },
        { t: "Separate accounts protect workloads from an AWS Regional service outage", c: false, why: "Accounts share the same physical infrastructure; multi-AZ or multi-Region design handles that." },
        { t: "The AZ name us-east-1a refers to the same physical AZ in every account", c: false, why: "AZ names are mapped per account; use AZ IDs such as use1-az1 across accounts." },
        { t: "SCPs restrict the organisation's management account as well as member accounts", c: false, why: "SCPs never apply to the management account, which is why it should run no workloads." }
      ] },
    { id: "M06.01-k4", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A retailer will start processing card payments and must comply with PCI DSS. The security team wants to MINIMISE the number of systems and people in the scope of the PCI audit. Most of the retailer's workloads don't handle card data. What should the architect do?",
      options: [
        { t: "Place the payment workload in dedicated accounts in a separate OU with stricter guardrails, and limit access to those accounts", c: true, why: "The account boundary keeps other workloads and their administrators out of the cardholder data environment, shrinking audit scope." },
        { t: "Deploy the payment workload in a separate VPC in the existing shared account", c: false, why: "All IAM administrators of the shared account can still reach it, so they and their systems remain in scope." },
        { t: "Tag payment resources with pci=true and audit those tags", c: false, why: "Tags don't create an access boundary; anyone who can edit tags or has broad permissions remains in scope." },
        { t: "Encrypt all data in every account with the same KMS key", c: false, why: "Encryption is required, but a shared key and shared accounts don't reduce scope." }
      ] },
    { id: "M06.01-k5", type: "single", domain: "D4", task: "4.2", level: 200,
      stem: "Finance needs accurate monthly AWS costs for each of five business units, including resources teams forget to tag, with the LEAST operational effort. Volume discounts must be kept. What should the solutions architect recommend?",
      options: [
        { t: "Give each business unit its own AWS accounts in one AWS Organizations organisation and report costs by linked account", c: true, why: "Every charge is attributed to an account automatically, and consolidated billing keeps combined volume tiers and RI/Savings Plans sharing." },
        { t: "Keep one account and activate cost allocation tags for a business-unit tag", c: false, why: "Untagged resources and untaggable charges are missed, and tags aren't applied retroactively to past costs." },
        { t: "Create a standalone account with its own payment method for each business unit", c: false, why: "Costs are separated, but volume pricing and discount sharing are lost without consolidated billing." },
        { t: "Set an AWS Budget per business unit in the shared account", c: false, why: "Budgets alert on spend; they don't attribute costs to units without tags or accounts." }
      ] },
    { id: "M06.01-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A five-person start-up runs one web application owned by one team and is setting up AWS for the first time. It wants production isolated from development and a structure that can grow, while keeping operational overhead low. Which account design is MOST appropriate?",
      options: [
        { t: "An organisation with a management account that runs no workloads, plus one production and one non-production account", c: true, why: "Gives the key prod/non-prod boundary and room to grow, without the overhead of many accounts." },
        { t: "A single account with production and development in separate VPCs", c: false, why: "No IAM or quota isolation between environments, and it is harder to split later." },
        { t: "One account per microservice per environment from day one", c: false, why: "Too granular for one team and one app: lots of cross-account plumbing for little security gain." },
        { t: "Run production in the management account and development in a member account", c: false, why: "SCPs can't restrict the management account; it should hold no workloads." }
      ] }
  ],
  cards: ["fc-M06-1-01", "fc-M06-1-02", "fc-M06-1-03", "fc-M06-1-04", "fc-M06-1-05", "fc-M06-1-06", "fc-M06-1-07", "fc-M06-1-08", "fc-M06-1-09", "fc-M06-1-10", "fc-M06-1-11"],
  references: [
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em> (benefits of using multiple AWS accounts; recommended OUs)",
    "AWS Well-Architected Framework, Security pillar: <em>SEC01-BP01 Separate workloads using accounts</em>",
    "AWS Organizations User Guide: <em>Best practices for a multi-account environment</em> and <em>Consolidated billing</em>",
    "Service Quotas User Guide: <em>Quota request templates</em>; AWS Lambda Developer Guide: <em>Lambda quotas</em> and <em>Configuring reserved concurrency</em>",
    "Amazon EC2 User Guide: <em>Availability Zone IDs</em>",
    "<em>System Design on AWS</em> ch.9 \"AWS Network Services\" (PDF p412–414): how many AWS accounts to set up; landing zones",
    "AWS Certified Solutions Architect – Associate (SAA-C03) Exam Guide: Task 1.1 and Tasks 4.1–4.4 (multi-account billing)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-1-01", front: "Why is the AWS account called a \"hard\" isolation boundary?", back: "Nothing crosses it by default: separate IAM namespace and root user, quotas, bill and blast radius. Access needs explicit allows on both sides. It fails closed." },
  { id: "fc-M06-1-02", front: "Five things an account isolates", back: "Security/identity, service quotas and API limits, billing, blast radius, governance/compliance scope." },
  { id: "fc-M06-1-03", front: "Separate VPCs vs separate accounts: what does a VPC NOT isolate?", back: "IAM permissions, quotas/API limits, billing and the root user. A VPC only separates network traffic." },
  { id: "fc-M06-1-04", front: "Why are tags a weak isolation boundary?", back: "They fail open: a missing or wrong tag means a missing protection, and anyone who can edit tags can change access." },
  { id: "fc-M06-1-05", front: "Default granularity for application accounts?", back: "One account per workload per environment (e.g. payments-prod, payments-dev). Not one per microservice." },
  { id: "fc-M06-1-06", front: "Functional (foundational) accounts in a typical organisation", back: "Management (billing/org only), Log Archive, Security Tooling (Audit), Network, Shared Services." },
  { id: "fc-M06-1-07", front: "Lambda concurrency: default per account per Region, and max reservable by one function?", back: "1,000 by default; at least 100 must stay unreserved, so max 900 reserved for one function." },
  { id: "fc-M06-1-08", front: "AZ name vs AZ ID across accounts", back: "AZ names (us-east-1a) map to physical AZs differently per account; AZ IDs (use1-az1) are the same everywhere. Use AZ IDs across accounts." },
  { id: "fc-M06-1-09", front: "Does splitting into many accounts lose volume discounts?", back: "Not inside one organisation: consolidated billing combines usage for tiers and shares RI/Savings Plans discounts by default." },
  { id: "fc-M06-1-10", front: "Costs of too many accounts", back: "Per-account baseline security services, duplicated networking (NAT gateways), cross-account plumbing, quota management, operational and cognitive load." },
  { id: "fc-M06-1-11", front: "How do dedicated accounts help PCI DSS / HIPAA?", back: "They shrink audit scope: only the regulated accounts and the few people with access to them are in scope, with stricter guardrails on their OU." }
);
// ================================================================== 02_organizations.js
/* ---------------------------------------------------------------- M06.02 AWS Organizations */
var DG_0602_TREE = `
<figure>
<svg class="diagram" viewBox="0 0 760 366" role="img" aria-labelledby="m0602at m0602ad">
  <title id="m0602at">An AWS organization: root, OUs and accounts</title>
  <desc id="m0602ad">The management account sits beside the organization root and pays the bill. Under the root are five OUs: Security, Infra, Workloads, Sandbox and Suspended. Security holds the Log Archive and Audit accounts, Infra holds Network and Shared Services, Workloads holds two nested OUs, Prod and Non-prod, each with one account. Sandbox holds two personal accounts and Suspended holds one account being closed. Policies attach to the root, an OU or an account and are inherited downwards.</desc>
  <defs><marker id="m0602a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-bad" x="16" y="16" width="230" height="48" rx="8"/>
  <text class="dg-tb" x="28" y="36">Management account</text>
  <text class="dg-ts" x="28" y="54">111122223333 · pays the bill</text>
  <path class="dg-link" d="M246 40 H288" marker-end="url(#m0602a-ar)"/>

  <rect class="dg-edge" x="290" y="16" width="184" height="48" rx="8"/>
  <text class="dg-tb" x="302" y="36">Root  r-ab12</text>
  <text class="dg-ts" x="302" y="54">o-a1b2c3d4e5</text>

  <rect class="dg-info" x="500" y="16" width="244" height="48" rx="8"/>
  <text class="dg-ts" x="512" y="36">Policies attach to the root,</text>
  <text class="dg-ts" x="512" y="54">an OU or one account; they inherit</text>

  <path class="dg-line" d="M382 64 V84 H86 V102" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M382 64 V84 H234 V102" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M382 64 V102" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M382 64 V84 H530 V102" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M382 64 V84 H678 V102" marker-end="url(#m0602a-ar)"/>

  <rect class="dg-region" x="16" y="104" width="140" height="44" rx="8"/><text class="dg-tb" x="28" y="131">Security OU</text>
  <rect class="dg-region" x="164" y="104" width="140" height="44" rx="8"/><text class="dg-tb" x="176" y="131">Infra OU</text>
  <rect class="dg-region" x="312" y="104" width="140" height="44" rx="8"/><text class="dg-tb" x="324" y="131">Workloads OU</text>
  <rect class="dg-region" x="460" y="104" width="140" height="44" rx="8"/><text class="dg-tb" x="472" y="131">Sandbox OU</text>
  <rect class="dg-region" x="608" y="104" width="140" height="44" rx="8"/><text class="dg-tb" x="620" y="131">Suspended OU</text>

  <path class="dg-line" d="M26 148 V195 H34" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M26 148 V233 H34" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-box" x="36" y="180" width="120" height="30" rx="6"/><text class="dg-t" x="46" y="200">Log Archive</text>
  <rect class="dg-box" x="36" y="218" width="120" height="30" rx="6"/><text class="dg-t" x="46" y="238">Audit</text>

  <path class="dg-line" d="M174 148 V195 H182" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M174 148 V233 H182" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-box" x="184" y="180" width="120" height="30" rx="6"/><text class="dg-t" x="194" y="200">Network</text>
  <rect class="dg-box" x="184" y="218" width="120" height="30" rx="6"/><text class="dg-t" x="194" y="238">Shared Svcs</text>

  <path class="dg-line" d="M322 148 V195 H330" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M322 148 V271 H330" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-region" x="332" y="180" width="120" height="30" rx="6"/><text class="dg-tb" x="342" y="200">Prod OU</text>
  <path class="dg-line" d="M341 210 V233 H350" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-box" x="352" y="218" width="100" height="30" rx="6"/><text class="dg-t" x="362" y="238">pay-prod</text>
  <rect class="dg-region" x="332" y="256" width="120" height="30" rx="6"/><text class="dg-tb" x="342" y="276">Non-prod OU</text>
  <path class="dg-line" d="M341 286 V309 H350" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-box" x="352" y="294" width="100" height="30" rx="6"/><text class="dg-t" x="362" y="314">pay-dev</text>

  <path class="dg-line" d="M470 148 V195 H478" marker-end="url(#m0602a-ar)"/>
  <path class="dg-line" d="M470 148 V233 H478" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-box" x="480" y="180" width="120" height="30" rx="6"/><text class="dg-t" x="490" y="200">sbx-alice</text>
  <rect class="dg-box" x="480" y="218" width="120" height="30" rx="6"/><text class="dg-t" x="490" y="238">sbx-bob</text>

  <path class="dg-line" d="M618 148 V195 H626" marker-end="url(#m0602a-ar)"/>
  <rect class="dg-box" x="628" y="180" width="120" height="30" rx="6"/><text class="dg-t" x="638" y="200">old-vendor</text>

  <text class="dg-ts" x="16" y="350">Depth: root, Workloads OU (level 1), Prod OU (level 2) … up to 5 OU levels. Every account has exactly one parent.</text>
</svg>
<figcaption>Figure M06-2a. A typical organization. OUs (dashed boxes) group accounts (solid boxes) by the policies they need; the management account is technically placed in the root but is never restricted by SCPs or RCPs, so it runs no workloads.</figcaption>
</figure>`;

var DG_0602_BILLING = `
<figure>
<svg class="diagram" viewBox="0 0 760 296" role="img" aria-labelledby="m0602bt m0602bd">
  <title id="m0602bt">Consolidated billing: aggregation and discount sharing</title>
  <desc id="m0602bd">Three member accounts send their usage into consolidated billing. Two things happen there: usage is combined so the whole organization climbs volume pricing tiers as one customer, and unused Reserved Instance and Savings Plans discounts from one account are applied to eligible usage in other accounts. The result is one invoice paid by the management account, with per-account detail in Cost Explorer and the Cost and Usage Report.</desc>
  <defs><marker id="m0602b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-box" x="16" y="40" width="210" height="60" rx="8"/>
  <text class="dg-tb" x="28" y="64">Account A (prod)</text>
  <text class="dg-ts" x="28" y="84">S3 300 TB · SP $12/h</text>
  <rect class="dg-box" x="16" y="116" width="210" height="60" rx="8"/>
  <text class="dg-tb" x="28" y="140">Account B (data)</text>
  <text class="dg-ts" x="28" y="160">S3 250 TB · EC2 $9/h OD</text>
  <rect class="dg-box" x="16" y="192" width="210" height="60" rx="8"/>
  <text class="dg-tb" x="28" y="216">Account C (dev)</text>
  <text class="dg-ts" x="28" y="236">S3 50 TB</text>

  <path class="dg-line" d="M226 70 H268" marker-end="url(#m0602b-ar)"/>
  <path class="dg-line" d="M226 146 H268" marker-end="url(#m0602b-ar)"/>
  <path class="dg-line" d="M226 222 H268" marker-end="url(#m0602b-ar)"/>

  <rect class="dg-edge" x="270" y="40" width="230" height="212" rx="10"/>
  <text class="dg-tb" x="286" y="64">Consolidated billing</text>
  <rect class="dg-info" x="286" y="78" width="198" height="74" rx="8"/>
  <text class="dg-t" x="298" y="100">① Usage combined</text>
  <text class="dg-ts" x="298" y="120">600 TB priced as one</text>
  <text class="dg-ts" x="298" y="138">customer → lower tiers</text>
  <rect class="dg-good" x="286" y="164" width="198" height="74" rx="8"/>
  <text class="dg-t" x="298" y="186">② Discounts shared</text>
  <text class="dg-ts" x="298" y="206">A's unused SP covers</text>
  <text class="dg-ts" x="298" y="224">B's eligible usage</text>

  <path class="dg-line" d="M500 146 H542" marker-end="url(#m0602b-ar)"/>
  <rect class="dg-bad" x="544" y="96" width="200" height="100" rx="8"/>
  <text class="dg-tb" x="556" y="120">Management account</text>
  <text class="dg-ts" x="556" y="140">one invoice, pays it all</text>
  <text class="dg-ts" x="556" y="158">Cost Explorer and CUR</text>
  <text class="dg-ts" x="556" y="176">break it down per account</text>

  <text class="dg-ts" x="16" y="280">Consolidated billing is free. Turning sharing off for an account stops it giving AND receiving discounts.</text>
</svg>
<figcaption>Figure M06-2b. The two money mechanisms of consolidated billing. The worked example in this lesson uses exactly these numbers.</figcaption>
</figure>`;

var DG_0602_LIFECYCLE = `
<figure>
<svg class="diagram" viewBox="0 0 760 272" role="img" aria-labelledby="m0602ct m0602cd">
  <title id="m0602ct">Member account lifecycle</title>
  <desc id="m0602cd">An account joins an organization either by being created with CreateAccount, which adds the OrganizationAccountAccessRole automatically, or by being invited, which requires the owner to accept within 15 days and the role to be created by hand. As a member it sits in exactly one OU or the root. From there it can be moved to another OU, removed from the organization (it then needs its own payment method), or closed, which leaves it SUSPENDED and reopenable for 90 days.</desc>
  <defs><marker id="m0602c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-good" x="16" y="30" width="220" height="60" rx="8"/>
  <text class="dg-tb" x="28" y="54">Create (CreateAccount)</text>
  <text class="dg-ts" x="28" y="74">role created automatically</text>
  <rect class="dg-info" x="16" y="110" width="220" height="60" rx="8"/>
  <text class="dg-tb" x="28" y="134">Invite (existing acct)</text>
  <text class="dg-ts" x="28" y="154">accept ≤15 days; create role</text>

  <path class="dg-line" d="M236 60 L288 86" marker-end="url(#m0602c-ar)"/>
  <path class="dg-line" d="M236 140 L288 114" marker-end="url(#m0602c-ar)"/>

  <rect class="dg-box" x="290" y="60" width="200" height="80" rx="8"/>
  <text class="dg-tb" x="302" y="84">Member account</text>
  <text class="dg-ts" x="302" y="104">in exactly one OU (or root)</text>
  <text class="dg-ts" x="302" y="122">policies inherited from above</text>

  <path class="dg-line" d="M490 76 L538 50" marker-end="url(#m0602c-ar)"/>
  <path class="dg-line" d="M490 111 H538" marker-end="url(#m0602c-ar)"/>
  <path class="dg-line" d="M490 130 L538 172" marker-end="url(#m0602c-ar)"/>

  <rect class="dg-region" x="540" y="20" width="204" height="50" rx="8"/>
  <text class="dg-tb" x="552" y="40">Move to another OU</text>
  <text class="dg-ts" x="552" y="58">policies change at once</text>
  <rect class="dg-edge" x="540" y="86" width="204" height="50" rx="8"/>
  <text class="dg-tb" x="552" y="106">Remove (leave org)</text>
  <text class="dg-ts" x="552" y="124">needs standalone billing</text>
  <rect class="dg-bad" x="540" y="152" width="204" height="50" rx="8"/>
  <text class="dg-tb" x="552" y="172">Close account</text>
  <text class="dg-ts" x="552" y="190">SUSPENDED, reopen ≤90 days</text>

  <rect class="dg-info" x="16" y="200" width="474" height="56" rx="8"/>
  <text class="dg-ts" x="28" y="222">Management account: can't leave, and can't be closed while members exist.</text>
  <text class="dg-ts" x="28" y="240">Remove every member, delete the organization, then it is standalone.</text>
</svg>
<figcaption>Figure M06-2c. How an account enters, moves through and leaves an organization. Each arrow is one Organizations API call made from the management account (or an Organizations delegated administrator).</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.02", title: "AWS Organizations", level: 200, minutes: 55,
  objectives: [
    "Describe the building blocks of an organization (management account, member accounts, root, OUs) and design an OU tree within the nesting limit",
    "Choose between the all-features and consolidated-billing-only feature sets and explain what changes when you enable all features",
    "Calculate the savings from consolidated billing volume tiers and Savings Plans / Reserved Instance discount sharing, and control sharing per account",
    "Create, invite, move, remove and close member accounts, and get administrative access to each through OrganizationAccountAccessRole",
    "Use trusted access and delegated administrators to run security and operations services organisation-wide without working in the management account"
  ],
  sections: [
    { type: "why", html: `
<p>Lumen Analytics grew from one AWS account to 23 in two years. Each team signed up with a company credit card, so finance received 23 invoices a month and paid list price for S3 in every one of them. One team bought a three-year Compute Savings Plan for a service that was later moved to another team's account, so the commitment sat 40% unused while the other account paid on-demand rates for the same workload. Security had no single place to say "nobody may disable CloudTrail", and when an engineer left, nobody could be sure which accounts he still had root passwords for.</p>
<p>M06.01 explained <em>why</em> you want many accounts. This lesson is about the service that turns a pile of accounts into one manageable estate: <strong>AWS Organizations</strong>. It gives you a hierarchy to hang policies on, one bill with pooled discounts, an API to create accounts in minutes, and the switch (trusted access and delegated administrators) that lets GuardDuty, Security Hub, Config, IAM Identity Center and a dozen other services work across every account at once.</p>
<p>On the SAA-C03 exam, Organizations is the answer behind phrases such as "centrally manage multiple accounts", "single bill", "share Reserved Instance discounts", "apply guardrails to all accounts in an OU" and "manage GuardDuty from a dedicated security account". In real work, it's the first thing you set up and the last thing you want to redesign, so the OU tree and the operating model deserve care.</p>` },

    { type: "concept", title: "Concept: the organization, its tree and its two feature sets", html: DG_0602_TREE + `
<h3>The building blocks</h3>
<table>
<thead><tr><th>Term</th><th>What it is</th><th>Key rules</th></tr></thead>
<tbody>
<tr><td><strong>Organization</strong></td><td>A set of AWS accounts you manage together. Identified by an org id such as <code>o-a1b2c3d4e5</code>.</td><td>Organizations itself is free. An account belongs to at most one organization at a time.</td></tr>
<tr><td><strong>Management account</strong></td><td>The account that created the organization (formerly "master" or "payer" account).</td><td>Pays every member's bill; is the only account (with an Organizations delegated admin) that can create, invite, move and remove accounts and manage policies. <strong>Can't be changed</strong> to another account, and <strong>isn't restricted by SCPs or RCPs</strong>, so run no workloads in it.</td></tr>
<tr><td><strong>Member account</strong></td><td>Every other account in the organization.</td><td>Still a full, isolated AWS account with its own root user, IAM and resources. Subject to the policies attached above it.</td></tr>
<tr><td><strong>Root</strong></td><td>The top container of the hierarchy, such as <code>r-ab12</code>.</td><td>Exactly one per organization. A policy attached here applies to every member account.</td></tr>
<tr><td><strong>Organizational unit (OU)</strong></td><td>A container for accounts and other OUs, such as <code>ou-ab12-11111111</code>.</td><td>Nest up to <strong>5 levels below the root</strong>. An OU has exactly one parent.</td></tr>
<tr><td><strong>Account placement</strong></td><td>Where an account sits in the tree.</td><td>An account sits in <strong>exactly one OU, or directly in the root</strong>. It can't be in two OUs; if two sets of rules are needed, you need a different tree or a different account.</td></tr>
<tr><td><strong>Policy</strong></td><td>A document of a given policy type attached to the root, an OU or an account.</td><td>A policy type must be <strong>enabled on the root</strong> before you can attach policies of that type. Policies are inherited by everything below the attachment point.</td></tr>
</tbody></table>
<div class="callout"><strong>OUs are for policy, not for org charts.</strong> The question to ask when you design the tree is "which accounts need the same guardrails and the same automation?", not "who reports to whom". A team that owns a dev, a test and a prod account usually has those three accounts in three <em>different</em> OUs (Non-prod and Prod), because dev and prod need different controls. Reorganisations in the business then don't force you to move accounts. M06.08 develops the full AWS-recommended OU set.</div>

<h3>Inheritance in one paragraph</h3>
<p>Every account inherits the policies attached to the root, to every OU on its path, and to itself. How inherited policies combine depends on the type. For <strong>authorization policies</strong> (SCPs and RCPs) each level is a filter: an action must be allowed at every level and an explicit Deny anywhere wins (M06.03 covers this in depth). For <strong>management policies</strong> (tag, backup, AI services opt-out, chat applications policies) the levels are <em>merged</em> into an <strong>effective policy</strong>, and parent policies can use inheritance operators such as <code>@@assign</code>, <code>@@append</code> and <code>@@remove</code> to say whether children may change a value. Declarative policies also produce an effective policy, enforced by the service itself.</p>

<h3>The policy types at a glance</h3>
<table>
<thead><tr><th>Policy type</th><th>Category</th><th>What it controls</th><th>Deep dive</th></tr></thead>
<tbody>
<tr><td><strong>Service control policy (SCP)</strong></td><td>Authorization</td><td>Maximum permissions of IAM users and roles (including the root user) in member accounts</td><td>M05.03, M06.03</td></tr>
<tr><td><strong>Resource control policy (RCP)</strong></td><td>Authorization</td><td>Maximum permissions on resources in member accounts, whoever calls, including outsiders (data perimeter)</td><td>M05.03, M06.03</td></tr>
<tr><td><strong>Declarative policy</strong></td><td>Management</td><td>A durable configuration baseline enforced by the service: for EC2, EBS and VPC, e.g. IMDSv2 defaults, blocking public AMI and EBS snapshot sharing, VPC Block Public Access</td><td>M06.03</td></tr>
<tr><td><strong>Tag policy</strong></td><td>Management</td><td>Standard tag keys, allowed values and capitalisation; can enforce compliance for listed resource types</td><td>M06.08</td></tr>
<tr><td><strong>Backup policy</strong></td><td>Management</td><td>AWS Backup plans deployed to every account in scope</td><td>M06.08, M20</td></tr>
<tr><td><strong>AI services opt-out policy</strong></td><td>Management</td><td>Opts the accounts out of AWS using their content to improve AI services</td><td>here</td></tr>
<tr><td><strong>Chat applications policy</strong></td><td>Management</td><td>Controls access to accounts from chat channels (Amazon Q Developer in chat applications, formerly AWS Chatbot)</td><td>here</td></tr>
</tbody></table>
<p>AWS keeps adding policy types; the pattern stays the same: enable the type on the root, write the policy, attach it to the root, an OU or an account, and check the result.</p>

<h3>Two feature sets</h3>
<table>
<thead><tr><th></th><th>Consolidated billing only</th><th>All features</th></tr></thead>
<tbody>
<tr><td>One bill, volume tiers, RI/SP sharing</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Policy types (SCPs, RCPs, declarative, tag, backup…)</td><td>No</td><td>Yes</td></tr>
<tr><td>Trusted access and delegated administrators for other services</td><td>No</td><td>Yes</td></tr>
<tr><td>Centralised root access management, Control Tower, Identity Center org instance</td><td>No</td><td>Yes</td></tr>
<tr><td>Who must agree</td><td>Members accept the invitation</td><td>Invited members must also approve the switch to all features; accounts created by the organization approve automatically</td></tr>
</tbody></table>
<p>New organizations are created with <strong>all features</strong> by default, and that's what you want. Consolidated-billing-only exists for cases where one company only pays for accounts that it must not govern, such as a reseller paying for customers' accounts. You can move from consolidated billing to all features, but not back. The exam phrasing is: "the company created the organization with consolidated billing only and now wants to apply SCPs" → <strong>enable all features</strong>, and every invited account must accept the request.</p>

<h3>The organization is a trust relationship</h3>
<p>Joining an organization is a big decision for an account owner: the management account will be able to restrict the account with SCPs and RCPs, see its costs, and (for accounts it created) administer it through a role. That's why invited accounts must accept a <strong>handshake</strong>, why switching to all features needs their approval, and why member accounts should be prevented from leaving with an SCP (otherwise any member admin could walk away from your guardrails).</p>` },

    { type: "workflow", title: "Workflow: from a single account to a governed organization", html: `
<p>This is the order a platform team follows to stand up Organizations by hand. Control Tower (M06.04) automates most of it, but you need to know what's under the hood.</p>
<ol class="flow">
  <li><strong>Pick the management account.</strong> Use a fresh, empty account dedicated to the organization, not the account where production already runs. You can never change it later, and nothing in it is constrained by SCPs. Secure its root user with MFA and a shared mailbox address.</li>
  <li><strong>Create the organization</strong> (<code>aws organizations create-organization</code>, feature set ALL). The root and the root's id appear; the management account is placed in the root.</li>
  <li><strong>Create the OU skeleton</strong> before creating accounts: for example Security, Infrastructure, Workloads (with Prod and Non-prod below it), Sandbox, Suspended, Policy Staging. Moving accounts later is easy, but every move changes the guardrails on running workloads.</li>
  <li><strong>Enable the policy types you'll use</strong> on the root (SCPs at least; usually also RCPs, tag, backup and declarative policies). When you enable SCPs, AWS attaches <code>FullAWSAccess</code> to every node so nothing breaks.</li>
  <li><strong>Create or invite accounts.</strong> Created accounts get <code>OrganizationAccountAccessRole</code>; for invited accounts create an equivalent role yourself. Put each account straight into its target OU.</li>
  <li><strong>Turn on organisation-wide services</strong> through each service's own console or API, which enables <strong>trusted access</strong> for you: CloudTrail organization trail, AWS Config, IAM Identity Center, GuardDuty, Security Hub, IAM Access Analyzer, AWS Backup, centralised root access management.</li>
  <li><strong>Register delegated administrators</strong> so each service is operated from a member account: security services from the Security Tooling (Audit) account, Identity Center and StackSets from a shared-services account, IPAM from the Network account.</li>
  <li><strong>Configure billing:</strong> activate cost allocation tags, decide which accounts keep RI/Savings Plans sharing on, set budgets per OU or account, and give finance read access through a billing permission set.</li>
  <li><strong>Attach baseline guardrails</strong>, starting with "deny leaving the organization" and "protect security tooling", tested first in the Policy Staging OU (M06.03).</li>
  <li><strong>Lock the management account down:</strong> only a small group may sign in, every action is logged by the organization trail, and day-to-day work happens in member accounts.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: billing, account operations and service integration", html: `
<h3>Consolidated billing</h3>
<p>Every organization, in either feature set, has <strong>consolidated billing</strong>: AWS treats all member accounts as one customer for pricing and sends one invoice to the management account. It is free and has three effects.</p>
<ul>
  <li><strong>One payer.</strong> The management account is charged for all usage. Members can still see their own charges; the management account sees everyone's in Cost Explorer, the Cost and Usage Report (CUR) and AWS Budgets.</li>
  <li><strong>Usage aggregation for volume tiers.</strong> Services priced in tiers, such as S3 storage, data transfer out, and many request-based prices, are calculated on the combined usage of all accounts. Ten accounts with 50 TB each are priced like one account with 500 TB. The AWS Free Tier is also calculated across the whole organization, not per account.</li>
  <li><strong>Discount sharing.</strong> Reserved Instances (RIs) and Savings Plans (SPs) apply first to usage in the account that bought them. Any unused benefit in that hour then flows to matching usage in other accounts. A <strong>Compute Savings Plan</strong> matches EC2, Fargate and Lambda usage in any Region; an EC2 Instance Savings Plan matches one instance family in one Region; a <strong>Regional RI</strong> matches its instance family (with size flexibility for Linux) in its Region. The capacity reservation of a <strong>zonal RI</strong> only benefits the account that bought it, although its discount can still be shared.</li>
</ul>
<p><strong>Turning sharing off.</strong> In the management account's <em>Billing preferences</em>, you can turn off RI and Savings Plans discount sharing for selected accounts. An account with sharing off <strong>neither shares its own purchases nor receives others'</strong>. Typical reasons: a business unit that bought its own commitments and is charged back for them, a legal entity that must not subsidise another, or an account that is about to leave the organization. Sharing applies only to accounts in the same organization at the time of usage; if an account leaves, its purchases stay with it.</p>
<div class="callout tip"><strong>Showback vs. chargeback.</strong> Consolidated billing gives the <em>money</em> to the organization, but leaves you to decide who "earned" it. Cost Explorer can show amortized and net amortized costs per linked account; cost allocation tags (activated only in the management account) slice it by team or project; AWS Billing Conductor can produce custom pro-forma bills per group of accounts if you need to re-rate charges.</div>

<h3>Account operations</h3>
<table>
<thead><tr><th>Operation</th><th>API</th><th>What to know</th></tr></thead>
<tbody>
<tr><td>Create an account</td><td><code>CreateAccount</code></td><td>Asynchronous: returns a request id, poll <code>DescribeCreateAccountStatus</code>. Needs a unique email address. The new account gets <code>OrganizationAccountAccessRole</code> (name customisable) with <code>AdministratorAccess</code>, trusting the management account. The root user has no password until someone runs password recovery, or none at all with centralised root access management.</td></tr>
<tr><td>Invite an existing account</td><td><code>InviteAccountToOrganization</code> → <code>AcceptHandshake</code></td><td>The invitation expires after <strong>15 days</strong>. The invited account gets <strong>no</strong> admin role: create one yourself (same name is convenient) with a trust policy naming the management account.</td></tr>
<tr><td>Move an account</td><td><code>MoveAccount</code></td><td>Instant. All inherited policies of the old path stop applying and the new ones apply at once, so test the destination OU's guardrails first.</td></tr>
<tr><td>Remove an account</td><td><code>RemoveAccountFromOrganization</code> (or <code>LeaveOrganization</code> from the member)</td><td>The account must be able to stand alone: payment method, contact information, support plan and accepted customer agreement. It loses org-shared discounts and org-level guardrails immediately.</td></tr>
<tr><td>Close an account</td><td><code>CloseAccount</code></td><td>The account shows as <code>SUSPENDED</code> and can be reopened (via AWS Support) during a <strong>90-day post-closure period</strong>; after that it's permanently closed. AWS limits how many accounts you can close within a rolling 30-day period. Change the root email first if you'll want to reuse it.</td></tr>
<tr><td>Delete the organization</td><td><code>DeleteOrganization</code></td><td>Only after every member has been removed. The management account can't leave the organization or be closed while it still has members.</td></tr>
</tbody></table>
<p><strong>Quotas worth knowing.</strong> A new organization starts with a low default quota for the number of member accounts, raised through Service Quotas; there is one root, OUs nest 5 levels deep, and each policy type has its own size and attachment limits (SCPs: 5,120 characters, 5 per node). Closed accounts still count against the account quota during the post-closure period.</p>

<h3>Trusted access and delegated administrators</h3>
<p><strong>Trusted access</strong> means you have allowed an AWS service to work across your organization: to read the account list, create its service-linked roles in member accounts, and act on their behalf. Enable it from <em>the service's</em> console or API whenever possible (for example "Enable organization trail" in CloudTrail), because the service then also performs its own setup; the raw call is <code>organizations:EnableAWSServiceAccess</code>.</p>
<p>A <strong>delegated administrator</strong> is a member account that you register to administer one integrated service for the whole organization. The management account remains the owner, but daily operation moves out of it, which is exactly what least privilege asks for. Services that support it include GuardDuty, Security Hub, AWS Config, IAM Access Analyzer, Firewall Manager, Amazon Detective, Macie, Inspector, IAM Identity Center, CloudFormation StackSets, AWS Backup, VPC IPAM, Systems Manager and others. Registration is <code>organizations:RegisterDelegatedAdministrator</code> or the service's own API (GuardDuty uses <code>EnableOrganizationAdminAccount</code>). Most services allow one delegated admin; check each service.</p>
<p>Organizations itself can have a <strong>delegated administrator</strong> too: a resource-based <em>delegation policy</em> on the organization lets a member account view the structure and manage policies, so the platform team can maintain SCPs without signing in to the management account.</p>
<div class="callout warn"><strong>What still needs the management account.</strong> Creating the organization, enabling all features, changing who is a delegated admin, removing accounts, billing preferences such as discount sharing, and anything assigned to the management account itself. For IAM Identity Center, a delegated admin can't manage permission sets provisioned into the management account (M06.05).</div>` },

    { type: "examples", title: "Worked examples: billing arithmetic and account operations", html: DG_0602_BILLING + `
<h3>Example 1: volume tiers on combined S3 storage</h3>
<p>Lumen's three accounts store data in S3 Standard in one Region. For the arithmetic we use illustrative tiered prices of the shape AWS publishes for S3 Standard: <strong>first 50 TB/month at $0.023 per GB, next 450 TB at $0.022, over 500 TB at $0.021</strong>, and 1 TB = 1,024 GB. Check the current price list for real numbers; the method is what matters.</p>
<table>
<thead><tr><th>Account</th><th>Stored</th><th>Billed separately</th><th>Cost separately</th></tr></thead>
<tbody>
<tr><td>A (prod)</td><td>300 TB</td><td>50 TB × $0.023 + 250 TB × $0.022</td><td>(1.15 + 5.50) × 1,024 = <strong>$6,809.60</strong></td></tr>
<tr><td>B (data)</td><td>250 TB</td><td>50 TB × $0.023 + 200 TB × $0.022</td><td>(1.15 + 4.40) × 1,024 = <strong>$5,683.20</strong></td></tr>
<tr><td>C (dev)</td><td>50 TB</td><td>50 TB × $0.023</td><td>1.15 × 1,024 = <strong>$1,177.60</strong></td></tr>
<tr><td colspan="3"><strong>Total as three customers</strong></td><td><strong>$13,670.40</strong></td></tr>
</tbody></table>
<p><strong>Consolidated:</strong> 600 TB priced as one customer = 50 TB × $0.023 + 450 TB × $0.022 + 100 TB × $0.021 = 1.15 + 9.90 + 2.10 = 13.15 → 13.15 × 1,024 = <strong>$13,465.60</strong>.</p>
<p><strong>Saving:</strong> $13,670.40 − $13,465.60 = <strong>$204.80 per month</strong> (about 1.5%). Two lessons: the first 50 TB tier is paid once instead of three times, and the organization reaches the "over 500 TB" tier that no single account reaches. Also notice the size: aggregation is real money at scale but modest here. The big wins come from commitment sharing.</p>

<h3>Example 2: Savings Plan sharing, hour by hour</h3>
<p>Account A bought a Compute Savings Plan with a commitment of <strong>$12 per hour</strong>. Assume a flat 20% discount, so covered usage costs 0.8 × its on-demand price. After a migration, A's eligible compute is only <strong>$10/h at on-demand rates</strong>. Account B runs <strong>$9/h on-demand</strong> of eligible EC2.</p>
<p><strong>Step 1, A's own usage first.</strong> $10 on-demand × 0.8 = $8 of commitment used. Unused commitment = $12 − $8 = <strong>$4/h</strong>.</p>
<p><strong>Step 2a, sharing OFF for A or B.</strong> The $4 is wasted (you pay the commitment whether or not it's used). B pays $9 on-demand. Hourly total = $12 + $9 = <strong>$21</strong>.</p>
<p><strong>Step 2b, sharing ON (default).</strong> The $4 of commitment covers B's usage at SP rates: $4 ÷ 0.8 = <strong>$5 of B's on-demand usage</strong>. B's remaining on-demand usage = $9 − $5 = $4. Hourly total = $12 (commitment, now fully used) + $4 = <strong>$16</strong>.</p>
<p><strong>Saving:</strong> $21 − $16 = $5 per hour. If the pattern holds all month: $5 × 730 h = <strong>$3,650 per month</strong>, about 18 times the S3 aggregation saving above. That's why the exam associates "multiple accounts, Reserved Instances / Savings Plans not fully used" with <strong>consolidated billing in AWS Organizations</strong>.</p>
<div class="callout"><strong>Order of application.</strong> Within the purchasing account, a Savings Plan is applied first to the usage with the highest discount percentage. Only the leftover moves to other accounts. Real discount rates differ per instance type and Region, so real reports show several rates; the logic is the same.</div>

<h3>Example 3: creating an account and reaching it</h3>
<pre><code>$ aws organizations create-account --email aws+payments-dev@example.com \\
    --account-name payments-dev --role-name OrganizationAccountAccessRole \\
    --tags Key=owner,Value=payments Key=env,Value=dev
{
    "CreateAccountStatus": {
        "Id": "car-0a1b2c3d4e5f60718293a4b5c6d7e8f9",
        "AccountName": "payments-dev",
        "State": "IN_PROGRESS",
        "RequestedTimestamp": "2026-10-07T09:12:44.512000+00:00"
    }
}
$ aws organizations describe-create-account-status \\
    --create-account-request-id car-0a1b2c3d4e5f60718293a4b5c6d7e8f9 \\
    --query "CreateAccountStatus.[State,AccountId]" --output text
SUCCEEDED   777788889999

# new accounts land in the root: move it to its OU straight away
$ aws organizations move-account --account-id 777788889999 \\
    --source-parent-id r-ab12 --destination-parent-id ou-ab12-11111111

# reach it from the management account (or configure a CLI profile with role_arn)
$ aws sts assume-role --role-session-name bootstrap \\
    --role-arn arn:aws:iam::777788889999:role/OrganizationAccountAccessRole</code></pre>
<p>In practice nobody uses <code>OrganizationAccountAccessRole</code> day to day: humans get Identity Center permission sets (M06.05), and the role is kept for bootstrap and break-glass, with its use alarmed.</p>

<h3>Example 4: the admin role for an invited account</h3>
<p>Invited account 444455556666 has no role the management account can use. Its administrator creates one with this trust policy and attaches <code>AdministratorAccess</code>:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::111122223333:root" },
    "Action": "sts:AssumeRole"
  }]
}</code></pre>
<p>Naming <code>111122223333:root</code> delegates the decision to the management account: only its principals whose identity policies allow <code>sts:AssumeRole</code> on this role ARN can use it (M05.06). Name the role <code>OrganizationAccountAccessRole</code> so automation can treat created and invited accounts the same way.</p>

<h3>Example 5: delegating Access Analyzer to the Audit account</h3>
<pre><code>$ aws organizations enable-aws-service-access \\
    --service-principal access-analyzer.amazonaws.com
$ aws organizations register-delegated-administrator \\
    --account-id 444455556666 --service-principal access-analyzer.amazonaws.com
$ aws organizations list-delegated-administrators \\
    --query "DelegatedAdministrators[].[Id,Name]" --output text
444455556666    audit</code></pre>
<p>From now on, the security team creates the organization-wide analyzer in the Audit account and never needs credentials in the management account.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>A company has 15 accounts with separate invoices and wants one bill and lower prices</td><td>AWS Organizations with consolidated billing; invite the accounts</td><td>One payer, aggregated volume tiers and shared RI/SP discounts, at no charge</td></tr>
<tr><td>A business unit buys its own Savings Plans and is charged back for them; other units must not consume them</td><td>Turn off RI/SP discount sharing for that unit's account(s) in the management account's billing preferences</td><td>Sharing off means the account neither gives nor receives discounts</td></tr>
<tr><td>Security wants GuardDuty and Security Hub for all accounts, operated by the security team without management-account access</td><td>Trusted access + register the Security Tooling (Audit) account as delegated administrator</td><td>Org-wide coverage, auto-enable for new accounts, least privilege for the management account</td></tr>
<tr><td>Product teams need a new dev account within an hour, each with standard settings</td><td><code>CreateAccount</code> into the Non-prod OU via a pipeline, or Control Tower Account Factory (M06.04)</td><td>Accounts inherit OU guardrails at once; the admin role exists for bootstrap automation</td></tr>
<tr><td>An acquired company's 8 accounts must come under your guardrails</td><td>Remove them from their old organization (standalone billing info first), invite them, create the admin role, place them in a "Transitional" OU</td><td>An account can only be in one organization; a transitional OU lets you apply guardrails gradually</td></tr>
<tr><td>A project ends and its account must stop costing money but data must be recoverable for a while</td><td>Move it to the Suspended OU (deny-all SCP), then <code>CloseAccount</code></td><td>The SCP freezes activity immediately; closure gives a 90-day window to reopen</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: explore your organization from CloudShell", html: `
<p>Lab L01 created an organization in your training account. Run these in AWS CloudShell (or WSL) with the <code>academy-admin</code> profile. Everything is read-only or free, and the OU you create is deleted at the end. Don't create or close real accounts unless you mean to: account closure has a waiting period.</p>
<pre><code># 1. The organization and its feature set
aws organizations describe-organization \\
  --query "Organization.{Id:Id,FeatureSet:FeatureSet,Mgmt:MasterAccountId}" --profile academy-admin

# 2. The root and which policy types are enabled on it
aws organizations list-roots \\
  --query "Roots[0].{Id:Id,Types:PolicyTypes[].[Type,Status]}" --profile academy-admin
ROOT=$(aws organizations list-roots --query "Roots[0].Id" --output text --profile academy-admin)

# 3. Build a tiny OU tree
SBX=$(aws organizations create-organizational-unit --parent-id "$ROOT" --name Sandbox \\
  --query "OrganizationalUnit.Id" --output text --profile academy-admin)
aws organizations list-organizational-units-for-parent --parent-id "$ROOT" \\
  --query "OrganizationalUnits[].[Id,Name]" --output table --profile academy-admin

# 4. Accounts and where they sit
aws organizations list-accounts --query "Accounts[].[Id,Name,Status]" --output table --profile academy-admin
aws organizations list-accounts-for-parent --parent-id "$ROOT" --query "Accounts[].Name" --profile academy-admin

# 5. Which services have trusted access, and who is a delegated admin
aws organizations list-aws-service-access-for-organization \\
  --query "EnabledServicePrincipals[].ServicePrincipal" --profile academy-admin
aws organizations list-delegated-administrators --profile academy-admin

# 6. Policies attached to the root (FullAWSAccess appears if SCPs are enabled)
aws organizations list-policies-for-target --target-id "$ROOT" \\
  --filter SERVICE_CONTROL_POLICY --query "Policies[].Name" --profile academy-admin

# 7. Clean up the OU (it must be empty)
aws organizations delete-organizational-unit --organizational-unit-id "$SBX" --profile academy-admin</code></pre>
<p><strong>What to notice.</strong> Step 1 shows <code>"FeatureSet": "ALL"</code>; if it showed <code>CONSOLIDATED_BILLING</code> you couldn't enable SCPs. In step 2, any type you haven't enabled is simply missing. In step 4, accounts you closed show <code>SUSPENDED</code> during the post-closure period. Finally, open <em>Billing and Cost Management → Billing preferences</em> in the console and find the <em>Reserved Instances and Savings Plans discount sharing</em> setting; look, but don't change it.</p>` },

    { type: "casestudy", title: "Case study: Halden Retail brings 40 accounts under one roof", html: `
<p><strong>Context.</strong> Halden Retail, a European online retailer, had 40 AWS accounts in three separate organizations (one per country business) plus 9 standalone accounts created by individual teams. Each organization had its own payer, its own SCPs written differently, and its own Savings Plans. Finance spent three days a month reconciling invoices, and an audit found two standalone accounts with no CloudTrail at all.</p>
<p><strong>Requirements.</strong> (1) One invoice and one place to buy commitments. (2) The same baseline guardrails everywhere within six months. (3) The Nordic business, a separate legal entity, must keep paying for its own Savings Plans and not consume others'. (4) Security operates GuardDuty, Security Hub and Config centrally without access to the management account. (5) No production downtime during the migration.</p>
<p><strong>Design decisions.</strong></p>
<table>
<thead><tr><th>Decision</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>A new, empty management account and a new organization (all features), instead of picking one of the three old payers</td><td>The old payers ran workloads, and the management account can't be changed later</td></tr>
<tr><td>OU tree: Security, Infrastructure, Workloads/Prod, Workloads/Non-prod, Sandbox, Suspended, Transitional, Policy Staging</td><td>OUs follow guardrail needs, not countries; country is a tag</td></tr>
<tr><td>Accounts migrated in waves: remove from the old org → invite → create the admin role → land in Transitional → move to the target OU after checks</td><td>Transitional has only "deny leaving the org" so nothing breaks on day one</td></tr>
<tr><td>RI/SP sharing turned off for the four Nordic accounts</td><td>Legal entity separation (requirement 3)</td></tr>
<tr><td>Audit account registered as delegated admin for GuardDuty, Security Hub, Config and Access Analyzer</td><td>Requirement 4 without management-account access</td></tr>
</tbody></table>
<p><strong>What went wrong.</strong> Two old member accounts couldn't be removed from their organization because they had never been given a payment method or accepted the customer agreement: removal requires a standalone-capable account. Adding them took a day each. Later, an existing Savings Plan bought by one old payer stopped benefiting a sister account during the gap between removal and acceptance, because sharing only works inside one organization; the team then scheduled each wave within a single billing day. Finally, one country team's Lambda functions failed after moving to Workloads/Prod because the Prod OU's Region-restriction SCP didn't include eu-north-1; the Policy Staging OU now gets every account for a day before its final move.</p>
<p><strong>Result.</strong> One invoice; Savings Plans utilisation rose from 71% to 96% because unused commitments now covered usage in other accounts; the reconciliation effort dropped to a few hours; and every account had an organization trail and GuardDuty within the first wave.</p>
<p><strong>Lessons.</strong> Start with a clean management account; design OUs around policy; migrate through a transitional OU; and remember that billing benefits, like guardrails, apply only while an account is inside the organization.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"centrally manage billing for multiple accounts", "single invoice", "volume discounts"</td><td><strong>AWS Organizations consolidated billing</strong></td></tr>
<tr><td>"Reserved Instances in one account, usage in another", "maximise RI/SP utilisation across accounts"</td><td>Accounts in the <strong>same organization</strong>; discount sharing is on by default</td></tr>
<tr><td>"one business unit's RIs must benefit only that unit"</td><td><strong>Turn off RI/SP discount sharing</strong> for those accounts (management account billing preferences)</td></tr>
<tr><td>"organization uses consolidated billing only and now needs SCPs"</td><td><strong>Enable all features</strong> (invited members must approve)</td></tr>
<tr><td>"administer an invited account from the management account"</td><td>Create a role (e.g. <code>OrganizationAccountAccessRole</code>) in the member that trusts the management account</td></tr>
<tr><td>"manage GuardDuty / Security Hub / Config for all accounts from a security account"</td><td><strong>Delegated administrator</strong> (with trusted access)</td></tr>
<tr><td>"apply the same restrictions to a group of accounts"</td><td>Put them in an <strong>OU</strong> and attach the policy to the OU</td></tr>
<tr><td>"tags must be consistent across accounts"</td><td><strong>Tag policy</strong> (and activate cost allocation tags in the management account)</td></tr>
</tbody></table>
<h3>Distractors to recognise</h3>
<ul>
  <li><strong>"Use AWS RAM / VPC peering to share Reserved Instances."</strong> Discounts are shared by consolidated billing, not by resource sharing.</li>
  <li><strong>"Attach the account to two OUs."</strong> Impossible: one parent per account.</li>
  <li><strong>"Restrict the management account with an SCP."</strong> SCPs and RCPs don't apply to it.</li>
  <li><strong>"Create IAM users in each account for the central team."</strong> Use the admin role for bootstrap and Identity Center for people.</li>
  <li><strong>"Use Control Tower to share billing discounts."</strong> Control Tower builds on Organizations; the billing comes from Organizations.</li>
</ul>
<h3>Create vs. invite</h3>
<table>
<thead><tr><th></th><th>Created with CreateAccount</th><th>Invited existing account</th></tr></thead>
<tbody>
<tr><td>Admin role for the management account</td><td><code>OrganizationAccountAccessRole</code> created automatically</td><td>None: create it yourself</td></tr>
<tr><td>Consent needed</td><td>No</td><td>Accept the handshake within 15 days</td></tr>
<tr><td>Approval of "enable all features"</td><td>Automatic</td><td>Must approve</td></tr>
<tr><td>Existing resources and history</td><td>None, a blank account</td><td>Keeps everything it had</td></tr>
<tr><td>Root user</td><td>No password set (or no root credentials at all with centralised root access)</td><td>Existing root credentials; secure or remove them</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Keep the management account empty and boring.</strong> No workloads, no CI/CD runners, no S3 data. It can't be constrained by SCPs, it controls every other account, and its compromise is the worst possible event in your estate. A handful of people, MFA everywhere, and alarms on any sign-in.</li>
  <li><strong>Delegate everything that can be delegated.</strong> Security services to the Security Tooling account, Identity Center and StackSets to a shared-services account, IPAM to the Network account, Organizations policy management to the platform account. Then the management account is touched for billing and a few org-level changes only.</li>
  <li><strong>Design OUs for policy, keep the tree shallow.</strong> The limit is 5 levels, but 2 or 3 are easier to reason about. Use tags for business attributes (cost centre, country, data classification) instead of encoding them in OUs.</li>
  <li><strong>Every account move is a change.</strong> <code>MoveAccount</code> swaps guardrails instantly on running workloads. Treat it like a deployment: change ticket, policy staging, rollback by moving back.</li>
  <li><strong>Protect membership.</strong> Deny <code>organizations:LeaveOrganization</code> with an SCP from day one; otherwise a member admin can take an account, its data and its guardrails out of your control.</li>
  <li><strong>Plan account closure.</strong> Closed accounts sit SUSPENDED for 90 days and count toward the quota; there's a rate limit on closures; resources in a suspended account may still incur charges until it's permanently closed or reopened and cleaned. Empty the account (or at least delete expensive resources) before closing it, and move it to a Suspended OU with a deny-all SCP first.</li>
  <li><strong>Watch discount sharing when accounts move between organizations.</strong> RI/SP benefits stop the moment an account leaves. Time migrations, and buy commitments in the organization where the usage will live.</li>
  <li><strong>Cost traps.</strong> Organizations, consolidated billing and delegated admin are free, but the services you switch on org-wide are not: an organization trail is free for the first copy of management events, while Config, GuardDuty, Security Hub and data events are billed per account and Region. Estimate before enabling everywhere.</li>
  <li><strong>Troubleshooting playbook.</strong> "Can't attach policy" → policy type not enabled on the root, or feature set is consolidated billing only. "Can't assume OrganizationAccountAccessRole" → invited account without the role, or an SCP / trust policy edit broke it. "Service not enabled in new accounts" → trusted access off, or auto-enable not configured in the delegated admin. "Can't remove account" → missing standalone billing information or support plan.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>An organization has one management account (payer, unchangeable, not restricted by SCPs/RCPs), one root, OUs up to 5 levels deep, and member accounts each in exactly one OU or the root.</li>
  <li>Use the <strong>all features</strong> set; consolidated-billing-only has no policies or service integrations. Switching to all features needs invited members' approval and can't be reversed.</li>
  <li>Consolidated billing is free: one invoice, combined usage for volume tiers and Free Tier, and RI/Savings Plans discounts shared across accounts by default.</li>
  <li>Turning off discount sharing for an account (management account billing preferences) means it neither gives nor receives discounts.</li>
  <li>Created accounts get <code>OrganizationAccountAccessRole</code>; invited accounts must accept within 15 days and need the role created by hand.</li>
  <li><code>MoveAccount</code> changes inherited policies instantly; removal needs standalone billing details; closure leaves the account SUSPENDED and reopenable for 90 days.</li>
  <li>Trusted access lets a service work across the organization; a delegated administrator lets a member account operate that service, keeping people out of the management account.</li>
  <li>Policy types: SCPs and RCPs (authorization), declarative, tag, backup, AI services opt-out and chat applications policies (management). SCP details are in M06.03.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.02-d1", q: "How many levels of OUs can you nest below the organization root?", answers: ["5", "five"], hint: "Single digit.", explain: "OUs can be nested up to five levels deep below the root. In practice keep it to two or three." },
    { id: "M06.02-d2", q: "What is the default name of the IAM role that AWS Organizations creates in a new member account so the management account can administer it?", answers: ["OrganizationAccountAccessRole"], hint: "Organization + Account + Access + Role.", explain: "<code>OrganizationAccountAccessRole</code> has AdministratorAccess and trusts the management account. Invited accounts don't get it automatically." },
    { id: "M06.02-d3", q: "Which Organizations feature set must be enabled before you can attach SCPs? (two words)", answers: ["all features", "allfeatures", "all"], hint: "The other one is consolidated billing.", explain: "Policies, trusted access and delegated administrators need <strong>all features</strong>." },
    { id: "M06.02-d4", q: "An invitation to join an organization expires after how many days?", answers: ["15", "fifteen"], hint: "About two weeks.", explain: "Invitations (handshakes) expire after 15 days if not accepted." },
    { id: "M06.02-d5", q: "Two accounts store 40 TB and 30 TB in S3 Standard. Tiers: first 50 TB at $0.023/GB, next 450 TB at $0.022/GB; 1 TB = 1,024 GB. How many dollars per month does consolidated billing save? (number only)", answers: ["20.48", "$20.48", "20.5"], hint: "Only the 20 TB that crosses into the second tier is cheaper.", explain: "Separately: 70 TB × 0.023 × 1,024 = $1,648.64. Combined: (50 × 0.023 + 20 × 0.022) × 1,024 = (1.15 + 0.44) × 1,024 = $1,628.16. Saving = 20 × 0.001 × 1,024 = <strong>$20.48</strong>." },
    { id: "M06.02-d6", q: "Account A has a $20/h Compute Savings Plan (flat 20% discount) and $15/h of eligible on-demand usage. Account B has $10/h of eligible on-demand usage. With sharing ON, what is the organization's total compute cost for that hour, in dollars? (number only)", answers: ["20", "$20", "20.00"], hint: "A's usage consumes 15 × 0.8 of the commitment. How much on-demand usage can the rest cover?", explain: "A uses $12 of commitment, leaving $8, which covers $8 ÷ 0.8 = $10 of B's on-demand usage, i.e. all of it. Total = the $20 commitment and nothing on-demand. With sharing off it would be $20 + $10 = $30." },
    { id: "M06.02-d7", q: "Discount sharing is turned OFF for account B. Account A (sharing on) has unused Savings Plan commitment this hour. Does B's eligible usage receive A's discount? (yes/no)", answers: ["no", "n"], hint: "Turning sharing off works in both directions.", explain: "An account with sharing turned off neither shares its own RI/SP benefits nor receives others'." },
    { id: "M06.02-d8", q: "After CloseAccount, for how many days can the account be reopened before it is permanently closed?", answers: ["90", "ninety"], hint: "About three months.", explain: "Closed accounts are SUSPENDED for a 90-day post-closure period and still count toward the organization's account quota." },
    { id: "M06.02-d9", q: "Which Organizations API call registers a member account to administer an integrated service such as IAM Access Analyzer? (API name)", answers: ["RegisterDelegatedAdministrator", "register-delegated-administrator", "organizations:RegisterDelegatedAdministrator"], hint: "Register + the role it gets.", explain: "<code>RegisterDelegatedAdministrator</code> with the service principal; some services, such as GuardDuty, use their own API that calls it for you." },
    { id: "M06.02-d10", q: "How many OUs can a single member account be placed in at the same time?", answers: ["1", "one"], hint: "Every account has exactly one parent.", explain: "An account has exactly one parent: one OU or the root." }
  ],
  check: [
    { id: "M06.02-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company created an AWS organization years ago with the consolidated billing feature set and later invited 12 existing accounts. Security now wants to apply service control policies to all member accounts. What must happen FIRST?",
      options: [
        { t: "Enable all features in the organization and have each invited member account approve the change", c: true, why: "SCPs require all features. Invited accounts must approve the switch; accounts created by the organization approve automatically." },
        { t: "Create a new organization and move the accounts into it", c: false, why: "Unnecessary disruption; an existing organization can be upgraded to all features." },
        { t: "Enable trusted access for IAM in the management account", c: false, why: "Trusted access is for integrating services; SCPs are a policy type that needs all features." },
        { t: "Attach FullAWSAccess to every account manually", c: false, why: "You can't attach any SCP until all features are on and the SCP policy type is enabled; AWS then attaches FullAWSAccess automatically." }
      ] },
    { id: "M06.02-k2", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "An existing standalone AWS account has just accepted an invitation to join a company's organization. Administrators who sign in to the management account must be able to administer the new member account. Which TWO actions are required?",
      options: [
        { t: "In the member account, create an IAM role with administrative permissions whose trust policy allows the management account to assume it", c: true, why: "Invited accounts don't get OrganizationAccountAccessRole; it must be created manually." },
        { t: "In the management account, allow the administrators to call sts:AssumeRole on that role's ARN", c: true, why: "A trust policy naming the account root delegates the decision to the management account's identity policies." },
        { t: "Do nothing: AWS Organizations creates OrganizationAccountAccessRole in every member account", c: false, why: "Only accounts created through Organizations get the role automatically." },
        { t: "Attach an SCP to the member account that grants AdministratorAccess to the management account", c: false, why: "SCPs never grant permissions, and they can't grant cross-account access." },
        { t: "Enable trusted access for AWS Organizations in the member account", c: false, why: "Trusted access is enabled per service from the management account, and doesn't create admin access for humans." }
      ] },
    { id: "M06.02-k3", type: "single", domain: "D4", task: "4.2", level: 200,
      stem: "Subsidiary A runs a single AWS account in a company's organization and has bought Compute Savings Plans that it is billed for internally. Finance requires that A's Savings Plans benefit ONLY A's account, while all the other accounts in the organization keep sharing discounts with each other. What should a solutions architect do?",
      options: [
        { t: "Turn off RI and Savings Plans discount sharing for all accounts except subsidiary A's account", c: false, why: "That would stop the other accounts sharing discounts with each other, which breaks the second requirement." },
        { t: "Turn off RI and Savings Plans discount sharing for subsidiary A's account in the management account's billing preferences", c: true, why: "An account with sharing off neither gives nor receives discounts, so A's purchases benefit only A, and every other account keeps sharing." },
        { t: "Attach an SCP to the other accounts' OU that denies savingsplans:*", c: false, why: "SCPs control API calls, not how billing discounts are applied." },
        { t: "Use AWS RAM to share the Savings Plans only with subsidiary A's account", c: false, why: "Savings Plans aren't shared through RAM; discount sharing is a consolidated billing feature." }
      ] },
    { id: "M06.02-k4", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A security team wants to manage Amazon GuardDuty findings for all 60 accounts in its organization from a dedicated security tooling account, and new accounts must be covered automatically. Nobody on the security team may have access to the management account. Which solution meets these requirements?",
      options: [
        { t: "Designate the security tooling account as the GuardDuty delegated administrator from the management account, and enable auto-enable for organization members", c: true, why: "The delegated admin operates GuardDuty organisation-wide from a member account and can auto-enable new accounts." },
        { t: "Create a cross-account role in each account and run GuardDuty from the management account", c: false, why: "Requires management-account access and manual work for every new account." },
        { t: "Invite each account as a GuardDuty member manually from the security tooling account", c: false, why: "Manual invitations don't cover new accounts automatically and are the legacy approach." },
        { t: "Attach an SCP that enables GuardDuty in every account", c: false, why: "SCPs only restrict; they can't enable services." }
      ] },
    { id: "M06.02-k5", type: "single", domain: "D4", task: "4.1", level: 200,
      stem: "A media company has five AWS accounts, each paid separately, storing between 80 TB and 200 TB in Amazon S3 Standard. The company wants to lower its S3 storage cost with the LEAST operational effort and no changes to the applications. What should it do?",
      options: [
        { t: "Join all five accounts to one AWS organization so consolidated billing prices their combined S3 usage against the volume tiers", c: true, why: "Aggregated usage reaches lower tier prices sooner, with no application changes." },
        { t: "Copy all data into a single account with S3 Cross-Region Replication", c: false, why: "Changes applications, adds replication cost, and isn't needed for volume pricing." },
        { t: "Buy S3 Reserved Capacity in each account", c: false, why: "S3 Standard has no reserved capacity offering." },
        { t: "Enable S3 Transfer Acceleration on every bucket", c: false, why: "Transfer Acceleration speeds up long-distance uploads and costs extra; it doesn't reduce storage price." }
      ] },
    { id: "M06.02-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company acquires a startup whose 6 AWS accounts belong to the startup's own organization. The accounts must join the company's organization and receive its guardrails. What is the correct sequence?",
      options: [
        { t: "Ensure each account has standalone billing details, remove it from the startup's organization, then invite it from the company's management account and accept the invitation", c: true, why: "An account can belong to only one organization, and must be able to stand alone before it is removed." },
        { t: "Move the accounts with MoveAccount from the startup's root to an OU in the company's organization", c: false, why: "MoveAccount only moves accounts within one organization." },
        { t: "Nest the startup's organization as an OU inside the company's organization", c: false, why: "Organizations can't be nested." },
        { t: "Create new accounts with CreateAccount and copy the resources", c: false, why: "Possible but far more effort and risk than inviting the existing accounts." }
      ] }
  ],
  cards: ["fc-M06-2-01", "fc-M06-2-02", "fc-M06-2-03", "fc-M06-2-04", "fc-M06-2-05", "fc-M06-2-06", "fc-M06-2-07", "fc-M06-2-08", "fc-M06-2-09", "fc-M06-2-10", "fc-M06-2-11"],
  references: [
    "AWS Organizations User Guide: <em>Terminology and concepts</em>, <em>Enabling all features</em>, <em>Managing accounts</em> (creating, inviting, accessing member accounts, removing, closing), <em>Managing organizational units</em>, <em>Quotas for AWS Organizations</em>",
    "AWS Organizations User Guide: <em>Managing organization policies</em> (authorization and management policies, inheritance, effective policies), <em>AWS services that you can use with AWS Organizations</em>, <em>Delegated administrator for AWS Organizations</em>",
    "AWS Billing User Guide: <em>Consolidated billing for AWS Organizations</em>, <em>Volume discounts</em>, <em>Reserved Instances and Savings Plans discount sharing</em>, <em>Turning off shared Reserved Instances and Savings Plans discounts</em>",
    "Savings Plans User Guide: <em>Understanding how Savings Plans apply to your usage</em>",
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em>",
    "<em>System Design on AWS</em>, account separation and landing zones (PDF p413–414)",
    "AWS Certified Solutions Architect – Associate (SAA-C03) Exam Guide: Task 1.1 and Tasks 4.1–4.4 (multi-account billing)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-2-01", front: "What can't you do to the management account?", back: "Restrict it with SCPs/RCPs, change which account it is, make it leave, or close it while members exist. So: no workloads in it." },
  { id: "fc-M06-2-02", front: "OU nesting limit and parents per account?", back: "Up to 5 OU levels below the root. Every account and OU has exactly one parent." },
  { id: "fc-M06-2-03", front: "All features vs consolidated billing only?", back: "Both: one bill, volume tiers, RI/SP sharing. Only all features: policies (SCP, RCP, tag…), trusted access, delegated admins. Upgrade needs invited members' approval; no way back." },
  { id: "fc-M06-2-04", front: "Three effects of consolidated billing?", back: "One payer (management account); usage combined for volume tiers (and Free Tier); RI/Savings Plans discounts shared across accounts. Free of charge." },
  { id: "fc-M06-2-05", front: "Discount sharing turned off for an account: what happens?", back: "It neither shares its RI/SP benefits nor receives others'. Set in the management account's billing preferences." },
  { id: "fc-M06-2-06", front: "Created vs invited account: admin access?", back: "Created: OrganizationAccountAccessRole (AdministratorAccess, trusts the management account) is made automatically. Invited: create such a role yourself." },
  { id: "fc-M06-2-07", front: "How long is an invitation valid?", back: "15 days." },
  { id: "fc-M06-2-08", front: "What happens when you close a member account?", back: "Status SUSPENDED; reopenable for 90 days; still counts toward the account quota; then permanently closed." },
  { id: "fc-M06-2-09", front: "Trusted access vs delegated administrator?", back: "Trusted access: a service may work across the organization. Delegated admin: a member account operates that service for the whole organization." },
  { id: "fc-M06-2-10", front: "Organizations policy types?", back: "Authorization: SCPs, RCPs. Management: declarative, tag, backup, AI services opt-out, chat applications policies." },
  { id: "fc-M06-2-11", front: "What does removing a member account require?", back: "The account must be able to stand alone: payment method, contact info, support plan, accepted customer agreement. It loses org discounts and guardrails immediately." }
);
// ================================================================== 03_scps.js
/* ---------------------------------------------------------------- M06.03 Service control policies (SCPs) */
var DG_0603_INHERIT = `
<figure>
<svg class="diagram" viewBox="0 0 760 440" role="img" aria-labelledby="m0603at m0603ad">
  <title id="m0603at">How SCPs are inherited from the root to an account</title>
  <desc id="m0603ad">On the left, a policy path from the organization root (FullAWSAccess) to the Workloads OU (FullAWSAccess plus a Deny outside EU Regions), to the nested Prod OU (an allow-list SCP allowing only ec2, s3 and logs), to member account 111122223333 (FullAWSAccess) where a role has AdministratorAccess. On the right, three requests from that role: ec2:RunInstances in eu-west-1 is allowed because every level allows it and no Deny matches; ec2:RunInstances in us-east-1 is denied by the inherited explicit Deny; dynamodb:PutItem in eu-west-1 is implicitly denied because the Prod OU has no Allow for DynamoDB.</desc>
  <defs><marker id="m0603a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-ta" x="16" y="22">Policy path (root to account)</text>
  <text class="dg-ta" x="300" y="22">Requests from a role with AdministratorAccess</text>

  <rect class="dg-edge" x="16" y="36" width="260" height="70" rx="8"/>
  <text class="dg-tb" x="28" y="60">Organization root r-ab12</text>
  <text class="dg-ts" x="28" y="80">SCP: FullAWSAccess</text>
  <text class="dg-ts" x="28" y="96">applies to every account below</text>
  <path class="dg-line" d="M146 106 V128" marker-end="url(#m0603a-ar)"/>

  <rect class="dg-box" x="16" y="130" width="260" height="70" rx="8"/>
  <text class="dg-tb" x="28" y="154">OU Workloads</text>
  <text class="dg-ts" x="28" y="174">SCPs: FullAWSAccess</text>
  <text class="dg-ts" x="28" y="190">+ DenyOutsideEURegions</text>
  <path class="dg-line" d="M146 200 V222" marker-end="url(#m0603a-ar)"/>

  <rect class="dg-box" x="16" y="224" width="260" height="70" rx="8"/>
  <text class="dg-tb" x="28" y="248">OU Prod (nested)</text>
  <text class="dg-ts" x="28" y="268">SCP: AllowCore only</text>
  <text class="dg-ts" x="28" y="284">allows ec2:*, s3:*, logs:*</text>
  <path class="dg-line" d="M146 294 V316" marker-end="url(#m0603a-ar)"/>

  <rect class="dg-info" x="16" y="318" width="260" height="70" rx="8"/>
  <text class="dg-tb" x="28" y="342">Account 111122223333</text>
  <text class="dg-ts" x="28" y="362">SCP: FullAWSAccess</text>
  <text class="dg-ts" x="28" y="378">role policy: AdministratorAccess</text>

  <rect class="dg-good" x="300" y="36" width="450" height="104" rx="8"/>
  <text class="dg-tb" x="312" y="60">ec2:RunInstances in eu-west-1</text>
  <text class="dg-ts" x="312" y="82">root allows · Workloads allows, its Deny doesn't match</text>
  <text class="dg-ts" x="312" y="100">Prod allows ec2:* · account allows · identity allows</text>
  <text class="dg-t" x="312" y="126">Result: ALLOWED</text>

  <rect class="dg-bad" x="300" y="152" width="450" height="104" rx="8"/>
  <text class="dg-tb" x="312" y="176">ec2:RunInstances in us-east-1</text>
  <text class="dg-ts" x="312" y="198">DenyOutsideEURegions on Workloads matches</text>
  <text class="dg-ts" x="312" y="216">an explicit Deny is inherited by Prod and the account</text>
  <text class="dg-t" x="312" y="242">Result: DENIED (explicit)</text>

  <rect class="dg-bad" x="300" y="268" width="450" height="120" rx="8"/>
  <text class="dg-tb" x="312" y="292">dynamodb:PutItem in eu-west-1</text>
  <text class="dg-ts" x="312" y="314">no Deny matches, root and account allow it,</text>
  <text class="dg-ts" x="312" y="332">but Prod's AllowCore doesn't mention dynamodb</text>
  <text class="dg-ts" x="312" y="350">one level without an Allow is enough to block</text>
  <text class="dg-t" x="312" y="376">Result: DENIED (implicit)</text>

  <text class="dg-ts" x="16" y="416">Effective SCP permission = every level on the path allows the action AND no level explicitly denies it.</text>
  <text class="dg-ts" x="16" y="432">The account's own IAM policies must still grant it: SCPs never grant anything.</text>
</svg>
<figcaption>Figure M06-3a. Allows are checked level by level (an intersection); Denies flow down to everything below. The admin role in the account can't escape either rule.</figcaption>
</figure>`;

var DG_0603_STRATEGY = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0603bt m0603bd">
  <title id="m0603bt">Deny-list versus allow-list SCP strategies</title>
  <desc id="m0603bd">Two panels. Deny-list: FullAWSAccess stays attached at the root, the OU and the account, and the OU adds targeted Deny guardrails; new services work automatically and policies stay small, but anything not denied is possible. Allow-list: FullAWSAccess stays at the root, the OU's FullAWSAccess is replaced by an SCP that allows only approved services, and the account keeps FullAWSAccess; only approved services work, but every new service needs a policy change and the allow must exist at every level.</desc>
  <defs><marker id="m0603b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="16" y="12" width="356" height="306" rx="10"/>
  <text class="dg-ta" x="32" y="38">Deny-list (default, most common)</text>
  <rect class="dg-good" x="32" y="52" width="324" height="36" rx="6"/><text class="dg-t" x="44" y="75">Root: FullAWSAccess</text>
  <path class="dg-line" d="M194 88 V104" marker-end="url(#m0603b-ar)"/>
  <rect class="dg-good" x="32" y="106" width="324" height="36" rx="6"/><text class="dg-t" x="44" y="129">OU: FullAWSAccess + Deny guardrails</text>
  <path class="dg-line" d="M194 142 V158" marker-end="url(#m0603b-ar)"/>
  <rect class="dg-good" x="32" y="160" width="324" height="36" rx="6"/><text class="dg-t" x="44" y="183">Account: FullAWSAccess</text>
  <text class="dg-ts" x="32" y="222">+ new AWS services usable without a policy change</text>
  <text class="dg-ts" x="32" y="240">+ short policies; each Deny states one rule</text>
  <text class="dg-ts" x="32" y="258">+ Denies inherit, so attach once at an OU</text>
  <text class="dg-ts" x="32" y="282">− everything not denied is possible</text>
  <text class="dg-ts" x="32" y="300">− you must anticipate what to forbid</text>

  <rect class="dg-region" x="388" y="12" width="356" height="306" rx="10"/>
  <text class="dg-ta" x="404" y="38">Allow-list (strict)</text>
  <rect class="dg-good" x="404" y="52" width="324" height="36" rx="6"/><text class="dg-t" x="416" y="75">Root: FullAWSAccess</text>
  <path class="dg-line" d="M566 88 V104" marker-end="url(#m0603b-ar)"/>
  <rect class="dg-info" x="404" y="106" width="324" height="36" rx="6"/><text class="dg-t" x="416" y="129">OU: Allow ec2, s3, rds, lambda …</text>
  <path class="dg-line" d="M566 142 V158" marker-end="url(#m0603b-ar)"/>
  <rect class="dg-good" x="404" y="160" width="324" height="36" rx="6"/><text class="dg-t" x="416" y="183">Account: FullAWSAccess</text>
  <text class="dg-ts" x="404" y="222">+ only approved services can ever be used</text>
  <text class="dg-ts" x="404" y="240">+ strong fit for regulated workloads</text>
  <text class="dg-ts" x="404" y="258">+ unknown new services blocked by default</text>
  <text class="dg-ts" x="404" y="282">− every new service needs a policy change</text>
  <text class="dg-ts" x="404" y="300">− Allow must exist at every level; 5,120 chars</text>
</svg>
<figcaption>Figure M06-3b. Both strategies leave <code>FullAWSAccess</code> at the root. The deny-list adds Deny statements below it; the allow-list replaces <code>FullAWSAccess</code> at one level with a narrower Allow, which caps everything beneath that level.</figcaption>
</figure>`;

var DG_0603_ROLLOUT = `
<figure>
<svg class="diagram" viewBox="0 0 760 210" role="img" aria-labelledby="m0603ct m0603cd">
  <title id="m0603ct">Safe SCP rollout pipeline</title>
  <desc id="m0603cd">Five stages from left to right: author the SCP as JSON in Git with a pull request; validate it with IAM Access Analyzer and check its size; attach it to the Policy Staging OU and run tests in its test accounts; attach it to the non-production SDLC OUs and watch denials for one to two weeks; attach it to production OUs in a change window with a rollback ready. Below, a monitoring bar: an EventBridge rule on CloudTrail errors that mention an explicit deny in a service control policy alerts the platform team.</desc>
  <defs><marker id="m0603c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="16" y="20" width="128" height="88" rx="8"/>
  <text class="dg-tb" x="28" y="44">1 Author</text>
  <text class="dg-ts" x="28" y="68">SCP JSON in Git</text>
  <text class="dg-ts" x="28" y="86">PR + review</text>
  <path class="dg-line" d="M144 64 H164" marker-end="url(#m0603c-ar)"/>

  <rect class="dg-box" x="166" y="20" width="128" height="88" rx="8"/>
  <text class="dg-tb" x="178" y="44">2 Validate</text>
  <text class="dg-ts" x="178" y="68">Access Analyzer</text>
  <text class="dg-ts" x="178" y="86">≤ 5,120 chars</text>
  <path class="dg-line" d="M294 64 H314" marker-end="url(#m0603c-ar)"/>

  <rect class="dg-info" x="316" y="20" width="128" height="88" rx="8"/>
  <text class="dg-tb" x="328" y="44">3 Staging OU</text>
  <text class="dg-ts" x="328" y="68">test accounts</text>
  <text class="dg-ts" x="328" y="86">run test suite</text>
  <path class="dg-line" d="M444 64 H464" marker-end="url(#m0603c-ar)"/>

  <rect class="dg-info" x="466" y="20" width="128" height="88" rx="8"/>
  <text class="dg-tb" x="478" y="44">4 SDLC OUs</text>
  <text class="dg-ts" x="478" y="68">watch denials</text>
  <text class="dg-ts" x="478" y="86">for 1–2 weeks</text>
  <path class="dg-line" d="M594 64 H614" marker-end="url(#m0603c-ar)"/>

  <rect class="dg-good" x="616" y="20" width="128" height="88" rx="8"/>
  <text class="dg-tb" x="628" y="44">5 Prod OUs</text>
  <text class="dg-ts" x="628" y="68">change window</text>
  <text class="dg-ts" x="628" y="86">rollback ready</text>

  <rect class="dg-edge" x="16" y="136" width="728" height="56" rx="8"/>
  <text class="dg-t" x="28" y="160">Monitor every stage: EventBridge rule on CloudTrail errors containing</text>
  <text class="dg-ts" x="28" y="180">"explicit deny in a service control policy" → alert the platform team, tag the change that caused it</text>
</svg>
<figcaption>Figure M06-3c. Treat an SCP like a production deployment: version it, validate it, and promote it through OUs from least to most critical. A bad SCP at the root breaks every account at once.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.03", title: "Service control policies (SCPs)", level: 300, minutes: 60,
  objectives: [
    "Predict whether a request is allowed or denied under a given stack of SCPs from the root, through nested OUs, to an account",
    "Choose between a deny-list and an allow-list SCP strategy and implement either correctly, including what happens to FullAWSAccess",
    "Write production SCPs for Region restriction, security-tooling protection, organisation membership, root-user lockdown, IMDSv2 and encryption, with safe exemptions via aws:PrincipalArn",
    "Decide when a requirement needs an SCP, an RCP or a declarative policy, and combine them into one guardrail set",
    "Roll out, test, troubleshoot and operate SCPs safely within their quotas"
  ],
  sections: [
    { type: "why", html: `
<p>It's 9:40 on a Monday. The platform team at a fintech has just attached a new "EU only" SCP to the organization root. By 9:45 the incident channel is full: nobody can sign in to IAM Identity Center's access portal from one business unit, the CI pipeline can't update a CloudFront distribution, the billing team can't open Cost Explorer, and an auditor's role can no longer read IAM. The SCP was eight lines long and logically "correct": deny everything outside <code>eu-west-1</code> and <code>eu-central-1</code>. It forgot that IAM, CloudFront, Route 53, Cost Explorer and other global services are served from <code>us-east-1</code>, and it was attached to every account at once.</p>
<p>Service control policies are the most powerful lever an organisation has. One JSON document can stop a thousand administrators, including every member account's root user, from disabling CloudTrail, leaving the organisation or spinning up GPU instances in a Region you've never heard of. That power cuts both ways: an SCP mistake is an organisation-wide outage. M05.03 introduced SCPs as a policy type and M05.04 placed them in the evaluation algorithm. This lesson is about using them at organisation scale: exactly how inheritance works through nested OUs, which strategy to pick, the half-dozen guardrails nearly every landing zone runs, how to exempt the people and automation that must stay unblocked, and how to ship SCPs without causing the Monday morning above.</p>
<p>The exam tests the same ideas in Task 1.1 ("designing a security strategy for multiple AWS accounts, for example AWS Control Tower, SCPs"). Typical stems: "prevent all accounts from…", "even administrators", "only approved Regions", "a developer with AdministratorAccess can't…", and "which change allows this account while keeping the restriction for others?"</p>` },

    { type: "concept", title: "Concept: what an SCP is, and what it touches", html: `
<p>A <strong>service control policy (SCP)</strong> is an AWS Organizations policy, written in IAM policy JSON, that you attach to the organization <strong>root</strong>, an <strong>organizational unit (OU)</strong> or an individual <strong>member account</strong>. It defines the <strong>maximum permissions</strong> that IAM principals in the affected member accounts can ever have. Think of it as a filter on the account, not on a person: whatever an identity policy grants, the SCP decides how much of it survives.</p>
<h3>Three properties to keep in mind at all times</h3>
<ol>
  <li><strong>SCPs never grant.</strong> A principal still needs an identity-based policy (or a resource-based policy) that allows the action. An account with <code>FullAWSAccess</code> and a role with no policies can do nothing.</li>
  <li><strong>SCPs apply to principals of member accounts</strong>: every IAM user, every IAM role (including <code>AWSReservedSSO_*</code> roles from IAM Identity Center and <code>OrganizationAccountAccessRole</code>) and the <strong>member account's root user</strong>. They apply wherever those principals act, including when they call resources in other accounts.</li>
  <li><strong>SCPs don't apply to</strong>: principals in the <strong>management account</strong>; <strong>service-linked roles</strong> (so AWS services can keep operating on your behalf); <strong>AWS service principals</strong> such as <code>cloudtrail.amazonaws.com</code> writing to a bucket; and <strong>principals from outside your organisation</strong>, even when they access resources in your accounts. That last gap is why resource control policies (RCPs) exist.</li>
</ol>
<div class="callout warn"><strong>The management account is unprotected by design.</strong> No SCP restricts it, so the only defence is to run nothing there except Organizations, billing and (optionally) IAM Identity Center, and to lock it down with MFA, few humans and monitoring. Every "attach an SCP to the management account" answer is wrong.</div>

<h3>Inheritance: two different rules for Allow and Deny</h3>
` + DG_0603_INHERIT + `
<p>An account's effective SCP permissions are computed from every policy on its <strong>path</strong>: the root, each OU from the top of the tree down to the account's parent (OUs nest up to five levels below the root), and the account itself. Two rules combine:</p>
<ul>
  <li><strong>Allows intersect.</strong> At <em>every</em> level on the path, at least one attached SCP must allow the action. If one level has no SCP that allows it, the action is implicitly denied for everything beneath, no matter what lower levels say. A child can never re-grant what a parent left out.</li>
  <li><strong>Denies inherit.</strong> An explicit <code>Deny</code> in any SCP at any level on the path applies to every account beneath that level. A child can't override or exempt itself from a parent's Deny. The only way out is to move the account to a different branch of the tree, or to build the exemption into the Deny's own conditions.</li>
</ul>
<p>"Inheritance" is a slightly misleading word for the Allow side. An Allow at the root doesn't flow down and satisfy the OU level; each level is checked independently. That's why AWS attaches <code>FullAWSAccess</code> (<code>"Effect": "Allow", "Action": "*", "Resource": "*"</code>) to the root, to every OU and to every account when you enable the SCP policy type, and to every new OU and account you create afterwards. Without it at a level, that level allows nothing.</p>
<table>
<thead><tr><th>Level</th><th>Allow side asks…</th><th>Deny side asks…</th></tr></thead>
<tbody>
<tr><td>Root</td><td>Does at least one SCP here allow it?</td><td>Does any SCP here deny it?</td></tr>
<tr><td>Each OU on the path</td><td>Does at least one SCP here allow it?</td><td>Does any SCP here deny it?</td></tr>
<tr><td>The account</td><td>Does at least one SCP here allow it?</td><td>Does any SCP here deny it?</td></tr>
<tr><td><strong>Result</strong></td><td>Every row must say yes</td><td>Any yes → explicit Deny</td></tr>
</tbody></table>
<p>Within a single level, multiple attached SCPs combine as a union for Allows (one is enough) and any Deny counts. Across levels, it's the intersection described above. You can't detach the last SCP from a node: every root, OU and account must always have at least one attached.</p>

<h3>Deny-list vs allow-list</h3>
` + DG_0603_STRATEGY + `
<p>A <strong>deny-list strategy</strong> keeps <code>FullAWSAccess</code> everywhere and adds SCPs containing only <code>Deny</code> statements: "never leave the organisation", "never stop CloudTrail", "never outside these Regions". It's the default AWS recommends for most organisations, and it's what AWS Control Tower's preventive controls use. New AWS services become available automatically, and each guardrail is a short, readable statement.</p>
<p>An <strong>allow-list strategy</strong> detaches <code>FullAWSAccess</code> at one or more levels and attaches an SCP that allows only approved services or actions. Everything else is implicitly denied below that level. It suits regulated environments ("only services that passed our assessment") and sandboxes ("only these 20 services, nothing exotic"). The costs: every new service a team wants needs a policy change; the 5,120-character limit fills quickly; and you must remember that the Allow must also be present at every other level. In practice organisations mix them: deny-list guardrails at the root or Workloads OU, and an allow-list at one OU such as Sandbox or a regulated Prod OU.</p>
<div class="callout tip"><strong>Since September 2025</strong> SCPs support the full IAM policy language, including <code>Condition</code>, specific <code>Resource</code> ARNs and <code>NotResource</code> in <code>Allow</code> statements. Before that, SCP Allow statements could only list actions with <code>"Resource": "*"</code> and no conditions, so every conditional guardrail had to be written as a Deny. Exam answers and most real guardrails still use the <code>Deny</code> + <code>Condition</code> form, and it remains the clearest way to express "never, except…". SCPs still don't support <code>Principal</code> or <code>NotPrincipal</code>: the principals are implicit (everyone in the account), and you exempt them with conditions on <code>aws:PrincipalArn</code>.</div>

<h3>Exemptions: aws:PrincipalArn, not NotPrincipal</h3>
<p>Almost every Deny guardrail needs an escape hatch: the platform team's pipeline role must still manage CloudTrail, the Control Tower execution role must still deploy baselines, a break-glass role must still work during an incident. The pattern is a negated ARN condition on the caller's role ARN:</p>
<pre><code>"Condition": {
  "ArnNotLike": {
    "aws:PrincipalArn": [
      "arn:aws:iam::*:role/OrgPlatformAdmin",
      "arn:aws:iam::*:role/AWSControlTowerExecution"
    ]
  }
}</code></pre>
<p><code>aws:PrincipalArn</code> is the <strong>role</strong> ARN even when the caller is a role session, so one entry covers every session of that role. The <code>*</code> in the account field makes the exemption work in every account the SCP touches. Identity Center roles live under a path, so to exempt a permission set use a pattern such as <code>arn:aws:iam::*:role/aws-reserved/sso.amazonaws.com/*AWSReservedSSO_PlatformAdmin_*</code>. An exemption is only as safe as the role it names: if developers can create a role called <code>OrgPlatformAdmin</code> in their account, they've just exempted themselves. That's why the guardrail roles themselves must be protected (example 2 below).</p>

<h3>Companions: RCPs and declarative policies</h3>
<table>
<thead><tr><th></th><th>SCP</th><th>RCP</th><th>Declarative policy</th></tr></thead>
<tbody>
<tr><td>Limits</td><td>What <em>your principals</em> can do, anywhere</td><td>What <em>any principal</em>, even outsiders, can do to <em>your resources</em></td><td>The <em>configuration</em> of a service in your accounts</td></tr>
<tr><td>Grammar</td><td>IAM policy JSON</td><td>IAM policy JSON, Deny statements with <code>"Principal": "*"</code></td><td>Organizations policy syntax, not IAM</td></tr>
<tr><td>Default attached</td><td><code>FullAWSAccess</code></td><td><code>RCPFullAWSAccess</code> (can't be detached or edited)</td><td>None</td></tr>
<tr><td>Typical use</td><td>Region lock, protect tooling, deny root</td><td>Data perimeter: only org principals, require TLS</td><td>IMDSv2 default, block public AMI/snapshot sharing, VPC Block Public Access</td></tr>
<tr><td>Management account</td><td>Not affected</td><td>Not affected</td><td>See the Organizations docs for scope</td></tr>
</tbody></table>
<p><strong>RCPs</strong> (November 2024) cover a growing list of services, starting with S3, STS, KMS, SQS and Secrets Manager. Because SCPs can't touch external principals, the canonical data-perimeter control "only identities from my organisation may access my data" is an RCP. <strong>Declarative policies</strong> (December 2024) are enforced in the service's control plane rather than at authorisation time, so they hold even for new APIs that an SCP wouldn't know to deny, and users get a clear, configurable error message. A mature guardrail set uses all three. Data perimeters and Control Tower's packaging of these controls come in M06.04 and M06.08.</p>` },

    { type: "workflow", title: "Workflow: evaluating any request against an SCP stack", html: `
<p>Use this procedure in exam questions and when debugging. Before step 1, write down the account's path, for example <code>r-ab12 → ou Workloads → ou Prod → 111122223333</code>, with the SCPs attached at each level.</p>
<ol class="flow">
  <li><strong>Is the principal in scope?</strong> If it's in the management account, is a service-linked role, is an AWS service principal, or belongs to another organisation, SCPs don't apply: skip to normal IAM evaluation.</li>
  <li><strong>Build the request context.</strong> Action (<code>ec2:RunInstances</code>), resource ARN, Region (<code>aws:RequestedRegion</code>: for global services this is <code>us-east-1</code>), the caller's role ARN (<code>aws:PrincipalArn</code>), and any service-specific keys (<code>ec2:MetadataHttpTokens</code>, <code>ec2:Encrypted</code>…).</li>
  <li><strong>Look for an explicit Deny at any level.</strong> For each Deny statement: does the Action (or NotAction) match? Does the Resource match? Do <em>all</em> conditions match (conditions in one block are ANDed; values in one key's list are ORed; missing keys make normal operators false and negated operators true)? If any Deny matches → <strong>explicit Deny</strong>, stop.</li>
  <li><strong>Check Allows level by level.</strong> Root: does at least one SCP allow the action? Then each OU in order, then the account. The first level with no allow → <strong>implicit Deny</strong>, stop.</li>
  <li><strong>SCPs pass.</strong> Continue with the rest of M05.04's algorithm: RCPs on the resource's account, resource policy, identity policy, permissions boundary, session policy.</li>
  <li><strong>Final answer.</strong> Allowed only if every layer allowed and nothing denied. In the real world, confirm with the error text: "explicit deny in a service control policy" means step 3; "no service control policy allows" means step 4.</li>
</ol>
<div class="callout"><strong>Worked micro-example.</strong> Path: root (<code>FullAWSAccess</code>) → OU Sandbox (<code>AllowSandboxServices</code>: ec2, s3, lambda, logs, iam, sts) → account (<code>FullAWSAccess</code>). A user with <code>AdministratorAccess</code> calls <code>sagemaker:CreateNotebookInstance</code>. Step 3: no Deny exists. Step 4: root allows (FullAWSAccess); Sandbox OU: only <code>AllowSandboxServices</code> is attached and it doesn't list SageMaker → <strong>implicit Deny</strong>. The account's <code>FullAWSAccess</code> is irrelevant; it can't add back what the OU withheld.</div>` },

    { type: "aws", title: "How it works on AWS: facts, quotas and gotchas", html: `
<table>
<thead><tr><th>Item</th><th>Value / behaviour</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>Prerequisite</td><td>Organization with <strong>all features</strong> enabled, and the SCP policy type enabled on the root</td><td>"Consolidated billing only" organisations can't use SCPs (M06.02)</td></tr>
<tr><td>Who manages SCPs</td><td>Management account, or a member account registered as a delegated administrator for Organizations policy management through a resource-based delegation policy</td><td>Lets a security account own guardrails without logging in to the management account</td></tr>
<tr><td>Maximum size</td><td>5,120 characters per SCP</td><td>Minify JSON (no indentation) before upload; prefer wildcards such as <code>cloudtrail:Delete*</code> over long lists; split by theme</td></tr>
<tr><td>SCPs attached per node</td><td>Up to 5 per root, per OU, per account (including <code>FullAWSAccess</code>)</td><td>A deny-list with <code>FullAWSAccess</code> leaves 4 slots per level; with 5 levels of OUs you have lots of total room, so place policies at the right level</td></tr>
<tr><td>Minimum per node</td><td>At least 1; you can't detach the last one</td><td>Detaching <code>FullAWSAccess</code> works only when another SCP is attached, and then that SCP becomes the level's allow-list</td></tr>
<tr><td>OU depth</td><td>Up to 5 levels of OUs below the root</td><td>A path has at most 7 levels of SCPs: root, 5 OUs, account</td></tr>
<tr><td>Not affected</td><td>Management account; service-linked roles; AWS service principals; principals outside the org</td><td>Use RCPs for external principals; keep the management account empty</td></tr>
<tr><td>Affected</td><td>All users and roles in member accounts, including the member's root user and Identity Center roles</td><td>Your own admins are restricted too, so plan exemptions</td></tr>
<tr><td>Supported elements</td><td>Effect, Action/NotAction, Resource/NotResource, Condition; no Principal/NotPrincipal</td><td>Exempt callers with <code>aws:PrincipalArn</code> conditions</td></tr>
<tr><td>Effect timing</td><td>Applies to new requests shortly after attachment; existing sessions are affected too</td><td>An SCP is a "live" change to every running workload in scope</td></tr>
<tr><td>Moving an account</td><td>Effective SCPs change immediately to the new path</td><td>Moving accounts between OUs is a security change; restrict <code>organizations:MoveAccount</code> and review it</td></tr>
</tbody></table>
<h3>Gotchas that show up in production</h3>
<ul>
  <li><strong><code>aws:RequestedRegion</code> for global services is <code>us-east-1</code></strong> (IAM, Organizations, Route 53, CloudFront, global STS endpoint, Support, Cost Explorer, Budgets…). A Region deny without a <code>NotAction</code> list for those services breaks them unless <code>us-east-1</code> is approved.</li>
  <li><strong>Some resources must live in <code>us-east-1</code></strong>: ACM certificates for CloudFront, WAF web ACLs for CloudFront, Lambda@Edge functions. If you use CloudFront, either exempt those actions or approve <code>us-east-1</code>.</li>
  <li><strong>IAM Identity Center has a home Region.</strong> If it isn't in your approved list, the access portal and permission-set provisioning in member accounts may fail. Keep the Identity Center Region approved.</li>
  <li><strong>Control Tower owns its own SCPs.</strong> If you use Control Tower (M06.04), add your SCPs alongside its controls rather than editing <code>aws-guardrails-*</code> policies, which causes drift. Control Tower's Region deny control implements the same pattern as example 1.</li>
  <li><strong>Denying actions breaks things you didn't think of.</strong> Denying <code>iam:CreateAccessKey</code> blocks some third-party integrations; denying <code>ec2:CreateVpc</code> blocks some services that create VPC resources on your behalf through your role (not via service-linked roles). Test on the staging OU first.</li>
</ul>` },

    { type: "examples", title: "Worked examples: six production SCPs and one RCP", html: `
<p>All policies use the placeholder organisation <code>o-a1b2c3d4e5</code> and approved Regions <code>eu-west-1</code>/<code>eu-central-1</code>. They assume <code>FullAWSAccess</code> stays attached (deny-list), except example 6. Remove the indentation before uploading to save characters.</p>

<h3>1. Region restriction with global-service exemptions and an admin exemption</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideApprovedRegions",
      "Effect": "Deny",
      "NotAction": [
        "iam:*", "organizations:*", "account:*", "sts:*",
        "route53:*", "route53domains:*", "cloudfront:*", "globalaccelerator:*",
        "waf:*", "wafv2:*", "shield:*", "acm:*",
        "support:*", "trustedadvisor:*", "health:*",
        "budgets:*", "ce:*", "cur:*", "aws-portal:*", "pricing:*",
        "networkmanager:*", "directconnect:*",
        "s3:GetAccountPublic*", "s3:PutAccountPublic*", "s3:ListAllMyBuckets",
        "ec2:DescribeRegions"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": ["eu-west-1", "eu-central-1"]
        },
        "ArnNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::*:role/OrgPlatformAdmin",
            "arn:aws:iam::*:role/AWSControlTowerExecution"
          ]
        }
      }
    }
  ]
}</code></pre>
<p><strong>How to read it.</strong> <code>NotAction</code> + <code>Deny</code> means "deny every action <em>except</em> these". The listed services are global or must be called in <code>us-east-1</code>, so they're never matched. The two conditions are ANDed: the Deny fires only when the Region isn't approved <strong>and</strong> the caller isn't one of the exempt roles. <code>acm:*</code> and <code>wafv2:*</code> are on the list so teams can create CloudFront certificates and web ACLs in <code>us-east-1</code>; the trade-off is that ACM and WAF are usable in any Region. If you don't use CloudFront, remove them. Check the current global-service list in the Organizations docs ("Deny access to AWS based on the requested AWS Region") before deploying, because AWS adjusts it.</p>
<p><strong>Outcomes for an <code>AdministratorAccess</code> role in a member account:</strong> <code>ec2:RunInstances</code> in <code>us-west-2</code> → denied; <code>iam:CreateRole</code> (Region <code>us-east-1</code>) → allowed, because IAM is in <code>NotAction</code>; <code>s3:CreateBucket</code> in <code>eu-west-1</code> → allowed; the same call from <code>OrgPlatformAdmin</code> in <code>ap-south-1</code> → allowed.</p>

<h3>2. Protect security tooling, log buckets and the guardrail roles</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ProtectSecurityServices",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging", "cloudtrail:DeleteTrail", "cloudtrail:UpdateTrail",
        "cloudtrail:PutEventSelectors",
        "config:StopConfigurationRecorder", "config:DeleteConfigurationRecorder",
        "config:DeleteDeliveryChannel",
        "guardduty:DeleteDetector", "guardduty:DisassociateFromAdministratorAccount",
        "securityhub:DisableSecurityHub", "securityhub:DisassociateFromAdministratorAccount",
        "access-analyzer:DeleteAnalyzer"
      ],
      "Resource": "*",
      "Condition": {
        "ArnNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::*:role/SecurityBreakGlass",
            "arn:aws:iam::*:role/AWSControlTowerExecution"
          ]
        }
      }
    },
    {
      "Sid": "ProtectGuardrailRoles",
      "Effect": "Deny",
      "Action": [
        "iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:PutRolePolicy",
        "iam:DeleteRolePolicy", "iam:DeleteRole", "iam:UpdateRole",
        "iam:UpdateAssumeRolePolicy", "iam:PutRolePermissionsBoundary",
        "iam:DeleteRolePermissionsBoundary", "iam:CreateRole"
      ],
      "Resource": [
        "arn:aws:iam::*:role/OrganizationAccountAccessRole",
        "arn:aws:iam::*:role/AWSControlTowerExecution",
        "arn:aws:iam::*:role/SecurityBreakGlass",
        "arn:aws:iam::*:role/OrgPlatformAdmin"
      ],
      "Condition": {
        "ArnNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::*:role/SecurityBreakGlass",
            "arn:aws:iam::*:role/AWSControlTowerExecution"
          ]
        }
      }
    },
    {
      "Sid": "ProtectLogBuckets",
      "Effect": "Deny",
      "Action": [
        "s3:DeleteBucket", "s3:PutBucketPolicy", "s3:DeleteBucketPolicy",
        "s3:PutLifecycleConfiguration", "s3:PutBucketObjectLockConfiguration"
      ],
      "Resource": "arn:aws:s3:::acme-org-logs-*",
      "Condition": {
        "ArnNotLike": {
          "aws:PrincipalArn": "arn:aws:iam::*:role/SecurityBreakGlass"
        }
      }
    }
  ]
}</code></pre>
<p>The second statement closes the exemption loophole: nobody but the exempt roles can create, edit or delete roles named <code>OrgPlatformAdmin</code> or <code>SecurityBreakGlass</code>, so a local admin can't create an exempt role. It also protects <code>OrganizationAccountAccessRole</code>, the role the management account uses to administer member accounts (M06.02). The third statement keeps local admins from tampering with log buckets; in a Control Tower landing zone the Log Archive account holds them and gets this SCP via the Security OU.</p>

<h3>3. Stay in the organisation, don't use the root user, don't touch account settings</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyLeavingOrganization",
      "Effect": "Deny",
      "Action": "organizations:LeaveOrganization",
      "Resource": "*"
    },
    {
      "Sid": "DenyRootUser",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringLike": { "aws:PrincipalArn": "arn:aws:iam::*:root" }
      }
    },
    {
      "Sid": "DenyRegionOptInAndContactChanges",
      "Effect": "Deny",
      "Action": [
        "account:EnableRegion", "account:DisableRegion",
        "account:PutAlternateContact", "account:DeleteAlternateContact"
      ],
      "Resource": "*",
      "Condition": {
        "ArnNotLike": { "aws:PrincipalArn": "arn:aws:iam::*:role/OrgPlatformAdmin" }
      }
    }
  ]
}</code></pre>
<p>A member account's root user can't be given IAM policies, but it is subject to SCPs. <code>aws:PrincipalArn</code> for the root user is <code>arn:aws:iam::&lt;account&gt;:root</code>, so the second statement blocks every API call it makes. A few root-only tasks (for example some account recovery actions) aren't governed by SCPs, and with <strong>centralised root access management</strong> (M05.01) you can delete member-account root credentials altogether and perform the rare root tasks from the management or delegated account. Use both: no root password to steal, and an SCP in case one is ever recovered.</p>

<h3>4. Require IMDSv2 on EC2</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RequireImdsV2OnLaunch",
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "StringNotEquals": { "ec2:MetadataHttpTokens": "required" }
      }
    },
    {
      "Sid": "LimitImdsHopLimit",
      "Effect": "Deny",
      "Action": "ec2:RunInstances",
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "NumericGreaterThan": { "ec2:MetadataHttpPutResponseHopLimit": "2" }
      }
    },
    {
      "Sid": "OnlyAdminsChangeMetadataOptions",
      "Effect": "Deny",
      "Action": "ec2:ModifyInstanceMetadataOptions",
      "Resource": "*",
      "Condition": {
        "ArnNotLike": { "aws:PrincipalArn": "arn:aws:iam::*:role/OrgPlatformAdmin" }
      }
    },
    {
      "Sid": "DenyCredentialsFromImdsV1",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "NumericLessThan": { "ec2:RoleDelivery": "2.0" }
      }
    }
  ]
}</code></pre>
<p>Statement 1 denies launches that don't request <code>HttpTokens=required</code>. Statement 4 is the clever one: <code>ec2:RoleDelivery</code> is present on API calls signed with instance-role credentials and says whether they were fetched with IMDSv1 (<code>1.0</code>) or IMDSv2 (<code>2.0</code>). Calls signed with credentials obtained via IMDSv1 are denied everywhere; calls from humans and other roles don't carry the key, so the condition is false and they're unaffected. <strong>Simpler alternative:</strong> a <em>declarative policy</em> for EC2 that sets IMDSv2 as the account default for new launches. Use it for the default and keep the SCP if you need a hard "never IMDSv1".</p>

<h3>5. Require encryption at rest for new EBS volumes and RDS databases</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedEbsVolumes",
      "Effect": "Deny",
      "Action": ["ec2:CreateVolume", "ec2:RunInstances"],
      "Resource": "arn:aws:ec2:*:*:volume/*",
      "Condition": { "Bool": { "ec2:Encrypted": "false" } }
    },
    {
      "Sid": "KeepEbsDefaultEncryptionOn",
      "Effect": "Deny",
      "Action": "ec2:DisableEbsEncryptionByDefault",
      "Resource": "*"
    },
    {
      "Sid": "DenyUnencryptedRds",
      "Effect": "Deny",
      "Action": ["rds:CreateDBInstance", "rds:CreateDBCluster"],
      "Resource": "*",
      "Condition": { "Bool": { "rds:StorageEncrypted": "false" } }
    }
  ]
}</code></pre>
<p>The pattern is "deny the create call if the service-specific condition key says unencrypted". Turn on EBS encryption by default in every Region (via StackSets or Control Tower) so normal launches pass, and the SCP keeps anyone from turning it off. S3 needs no SCP for this: every new object has been encrypted (SSE-S3 at least) by default since January 2023. Note the <code>Bool</code> operator: if the key is missing (for example an RDS engine path that doesn't send it), the Deny doesn't fire, so pair the SCP with a detective AWS Config rule (M06.04).</p>

<h3>6. Allow-list for a Sandbox OU</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowApprovedSandboxServices",
      "Effect": "Allow",
      "Action": [
        "ec2:*", "elasticloadbalancing:*", "autoscaling:*",
        "s3:*", "dynamodb:*", "lambda:*", "apigateway:*",
        "sqs:*", "sns:*", "events:*", "states:*",
        "logs:*", "cloudwatch:*", "xray:*",
        "cloudformation:*", "ssm:*", "kms:*", "secretsmanager:*",
        "iam:*", "sts:*", "tag:*", "health:*", "support:*"
      ],
      "Resource": "*"
    }
  ]
}</code></pre>
<p>Attach this to the Sandbox OU, then detach <code>FullAWSAccess</code> from that OU (in that order, because a node can't have zero SCPs). The root and the accounts keep <code>FullAWSAccess</code>. Everything not listed (SageMaker, Redshift, Bedrock, Marketplace subscriptions…) is implicitly denied in every sandbox account. Keep <code>iam</code>, <code>sts</code>, <code>cloudformation</code> and <code>logs</code> or basic tooling breaks, and still attach your deny-list guardrails (examples 1–3) at the root or Sandbox OU: an allow-list says which services, the Denies say what must never happen inside them.</p>

<h3>7. Companion RCP: data perimeter and TLS for org resources</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceOrgIdentities",
      "Effect": "Deny",
      "Principal": "*",
      "Action": ["s3:*", "sqs:*", "kms:*", "secretsmanager:*", "sts:AssumeRole"],
      "Resource": "*",
      "Condition": {
        "StringNotEqualsIfExists": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" },
        "BoolIfExists": { "aws:PrincipalIsAWSService": "false" }
      }
    },
    {
      "Sid": "EnforceSecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": ["s3:*", "sqs:*", "kms:*", "secretsmanager:*", "sts:*"],
      "Resource": "*",
      "Condition": { "BoolIfExists": { "aws:SecureTransport": "false" } }
    }
  ]
}</code></pre>
<p>This is an RCP, not an SCP: note <code>"Principal": "*"</code>. It applies to requests made <em>to</em> resources in member accounts, whoever makes them. Statement 1 denies principals from other organisations (AWS services acting for you are exempt); statement 2 denies plain-HTTP requests. Real perimeters add exemptions for trusted partner accounts and for resources tagged as intentionally shared (M06.08).</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>GDPR: all workloads must stay in EU Regions; IAM, CloudFront and billing must keep working</td><td>Deny-list SCP with <code>NotAction</code> for global services + <code>aws:RequestedRegion</code> on the Workloads OU (or Control Tower's Region deny control)</td><td>Covers every principal including member root users; the <code>NotAction</code> list keeps us-east-1 global services working</td></tr>
<tr><td>Security team must be sure CloudTrail, Config and GuardDuty can't be switched off in any account</td><td>SCP "ProtectSecurityServices" at the root with an <code>aws:PrincipalArn</code> exemption for the security automation role, plus protection of that role</td><td>Local admins can't remove an SCP; the exemption keeps the security team operational</td></tr>
<tr><td>Hackathon sandboxes: only ~20 services, no GPU training, no Marketplace</td><td>Allow-list SCP on the Sandbox OU replacing <code>FullAWSAccess</code>, plus a Deny on large instance types via <code>ec2:InstanceType</code></td><td>Unknown or costly services are blocked by default; deny statements cap cost inside allowed services</td></tr>
<tr><td>One team needs <code>us-west-2</code> for a latency-sensitive customer; everyone else stays EU</td><td>Move that account to an <strong>Exceptions OU</strong> with a variant of the Region SCP (or add the account to the Deny's condition via <code>aws:PrincipalAccount</code>)</td><td>A child can't override a parent's Deny; the tree, or the Deny's condition, must express the exception</td></tr>
<tr><td>Data must never be readable by identities outside the organisation, even with a careless bucket policy</td><td>RCP with <code>aws:PrincipalOrgID</code> (example 7)</td><td>SCPs don't affect outside principals; RCPs do</td></tr>
<tr><td>All new EC2 instances should use IMDSv2 without breaking older launch templates' defaults</td><td>Declarative policy setting IMDSv2 defaults; optionally SCP denying credentials delivered via IMDSv1</td><td>The declarative policy fixes the default in the service; the SCP enforces a hard rule</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: validate, size and (optionally) stage an SCP", html: `
<p>Part A is free and works in any account, including a standalone one, from AWS CloudShell or WSL with the <code>academy-admin</code> profile. Part B needs an organisation sandbox where you have management or delegated-admin access; skip it otherwise (you'll build one in this module's lab).</p>
<h3>Part A: lint and measure</h3>
<pre><code># 1. Save example 1 from this lesson as region-deny.json, then check it is valid JSON
jq . region-deny.json &gt; /dev/null &amp;&amp; echo "valid JSON"

# 2. How close to the 5,120-character limit is it? (pretty vs minified)
wc -c &lt; region-deny.json
jq -c . region-deny.json | tr -d '\\n' | wc -c

# 3. Ask IAM Access Analyzer to validate it as an SCP (free)
aws accessanalyzer validate-policy \\
  --policy-type SERVICE_CONTROL_POLICY \\
  --policy-document file://region-deny.json \\
  --query 'findings[].[findingType,issueCode,findingDetails]' \\
  --output table --profile academy-admin</code></pre>
<p><strong>Expected:</strong> step 2 prints roughly 1,300 characters pretty-printed and under 1,000 minified. Step 3 returns an empty table for a clean policy. Now break it on purpose: add <code>"Principal": "*"</code> to the statement and re-run; Access Analyzer reports an error because SCPs don't support <code>Principal</code>. Change <code>ArnNotLike</code> to <code>StringNotLike</code> and you'll typically get a suggestion to use the ARN operator.</p>
<h3>Part B: stage it on a test OU (organisation sandbox only)</h3>
<pre><code># Find where the test account sits and what is attached along its path
aws organizations list-parents --child-id 444455556666
aws organizations list-policies-for-target --target-id ou-ab12-11111111 \\
  --filter SERVICE_CONTROL_POLICY --query 'Policies[].Name'

# Create the policy (minified) and attach it to the Policy Staging OU only
aws organizations create-policy --type SERVICE_CONTROL_POLICY \\
  --name DenyOutsideEU --description "Region guardrail v1" \\
  --content "$(jq -c . region-deny.json)"
aws organizations attach-policy --policy-id p-examplepolicyid --target-id ou-ab12-11111111

# From a role in the test account: predict, then run
aws ec2 describe-vpcs --region us-west-2      # predict: denied
aws ec2 describe-vpcs --region eu-west-1      # predict: allowed
aws iam list-roles --max-items 1              # predict: allowed (IAM in NotAction)</code></pre>
<p>The denied call returns something like:</p>
<pre><code>An error occurred (UnauthorizedOperation) when calling the DescribeVpcs operation:
You are not authorized to perform this operation. User:
arn:aws:sts::444455556666:assumed-role/AWSReservedSSO_Developer_0a1b2c3d4e5f6a7b/dana
is not authorized to perform: ec2:DescribeVpcs with an explicit deny in a service control policy</code></pre>
<p><strong>Building an allow-list from real usage.</strong> IAM can report which services an OU actually used, based on last-accessed data:</p>
<pre><code>aws iam generate-organizations-access-report \\
  --entity-path o-a1b2c3d4e5/r-ab12/ou-ab12-11111111
aws iam get-organizations-access-report --job-id &lt;JobId from the previous call&gt; \\
  --query 'AccessDetails[?TotalAuthenticatedEntities&gt;\`0\`].ServiceNamespace'</code></pre>
<p><strong>Cleanup:</strong> <code>aws organizations detach-policy</code> then <code>delete-policy</code> with the same IDs. Nothing in this demo is billed.</p>` },

    { type: "casestudy", title: "Case study: Kestrel Payments and the Monday-morning SCP", html: `
<p><strong>Context.</strong> Kestrel Payments, a European payments start-up, ran 38 accounts in AWS Organizations: a Security OU (Log Archive, Security Tooling), an Infrastructure OU, Workloads with Prod and SDLC sub-OUs, and a Sandbox OU. Their regulator required that customer data never leave the EU. The platform lead wrote an SCP denying <code>*</code> when <code>aws:RequestedRegion</code> wasn't <code>eu-west-1</code> or <code>eu-central-1</code>, and attached it to the root on a Monday morning.</p>
<p><strong>What broke.</strong> Within minutes: IAM role changes in CI failed; CloudFront invalidations in the release pipeline failed; finance lost Cost Explorer; Route 53 record updates failed; and the security team's automation, which managed GuardDuty from a delegated admin account, couldn't call IAM. Every failure was a global service whose requests are evaluated as <code>us-east-1</code>. Rollback took 25 minutes because the only person with management-account access was in a meeting.</p>
<p><strong>The redesign.</strong></p>
<table>
<thead><tr><th>Decision</th><th>Implementation</th></tr></thead>
<tbody>
<tr><td>Fix the policy</td><td><code>NotAction</code> list of global services; <code>us-east-1</code> exempted only for <code>acm</code>, <code>wafv2</code> and <code>cloudfront</code>; <code>ArnNotLike aws:PrincipalArn</code> exemption for <code>OrgPlatformAdmin</code> and the Control Tower execution role</td></tr>
<tr><td>Attach at the right level</td><td>Workloads and Sandbox OUs, not the root; the Security and Infrastructure OUs got a variant that also allows <code>us-east-1</code> for org-wide tooling</td></tr>
<tr><td>A real exception path</td><td>An Exceptions OU for one analytics account that needed <code>us-east-1</code> for a US partner (data agreement signed), with its own Region SCP</td></tr>
<tr><td>Protect the exemption</td><td>SCP denying creation or modification of the exempt roles except by themselves (example 2)</td></tr>
<tr><td>Safe delivery</td><td>SCPs in Git; CI runs <code>validate-policy</code> and a size check; promotion Policy Staging OU → SDLC (one week) → Prod; EventBridge alert on "explicit deny in a service control policy"</td></tr>
<tr><td>Delegated management</td><td>Security Tooling account registered as delegated administrator for Organizations policies, so the on-call security engineer can roll back without the management account</td></tr>
</tbody></table>
<p><strong>Result.</strong> The corrected guardrail went to production two weeks later with zero incidents. In the first month the denial alert caught two legitimate needs (a team trying Amazon Bedrock in <code>us-east-1</code>, and an old Terraform module hard-coding <code>us-east-1</code> for an S3 bucket) and one attempt by a compromised developer credential to launch instances in <code>sa-east-1</code>, which the SCP blocked.</p>
<p><strong>Lessons.</strong> An SCP is code with an organisation-wide blast radius: stage it. Global services evaluate as <code>us-east-1</code>. Exemptions belong in conditions on <code>aws:PrincipalArn</code>, and exempt roles need their own protection. Exceptions belong in the OU tree, because a child can't undo a parent's Deny.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Keywords in the stem</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"prevent all accounts / any user, even administrators or the root user, from…"</td><td>SCP Deny on the root or OU</td></tr>
<tr><td>"only allow approved Regions"</td><td>SCP Deny with <code>aws:RequestedRegion</code> (+ <code>NotAction</code> for global services), or Control Tower Region deny control</td></tr>
<tr><td>"only allow these services in these accounts"</td><td>Allow-list SCP replacing <code>FullAWSAccess</code> at the OU</td></tr>
<tr><td>"user has AdministratorAccess but gets AccessDenied in one account/Region"</td><td>An SCP on the account's path</td></tr>
<tr><td>"prevent accounts leaving the organisation"</td><td>SCP Deny <code>organizations:LeaveOrganization</code></td></tr>
<tr><td>"except the security team's role"</td><td>Condition <code>ArnNotLike aws:PrincipalArn</code> on the Deny</td></tr>
<tr><td>"outside identities must never access our data"</td><td>RCP (not SCP)</td></tr>
<tr><td>"restrict the management account"</td><td>Not possible with SCPs; keep workloads out of it</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>"Attach an SCP that allows S3 to grant the developers access"</strong>: SCPs never grant; you need an identity policy.</li>
  <li><strong>"Attach FullAWSAccess at the account level to override the OU's restriction"</strong>: allows intersect; a child can't add back what a parent withheld, and can't remove a parent's Deny.</li>
  <li><strong>"Use NotPrincipal in the SCP to exempt the admin role"</strong>: SCPs don't support <code>Principal</code>/<code>NotPrincipal</code>.</li>
  <li><strong>"Use an IAM permissions boundary on every role"</strong>: works per role, can be changed by local admins and doesn't cover the root user; the organisation-wide answer is an SCP.</li>
  <li><strong>"An SCP stops the AWS service from writing logs"</strong>: service principals and service-linked roles aren't affected.</li>
</ul>
<table>
<thead><tr><th></th><th>SCP</th><th>Permissions boundary</th><th>RCP</th></tr></thead>
<tbody>
<tr><td>Attached to</td><td>Root, OU, account</td><td>One IAM user or role</td><td>Root, OU, account</td></tr>
<tr><td>Limits</td><td>All principals in member accounts, incl. root user</td><td>That user or role only</td><td>Access to resources in member accounts, by anyone</td></tr>
<tr><td>Who can change it</td><td>Management account / delegated admin</td><td>Account admins (unless prevented)</td><td>Management account / delegated admin</td></tr>
<tr><td>Grants?</td><td>No</td><td>No</td><td>No</td></tr>
<tr><td>Typical exam use</td><td>Org guardrails</td><td>Safe delegation of role creation</td><td>Data perimeter</td></tr>
</tbody></table>` },

    { type: "architect", title: "Architect's notes: running SCPs in production", html: DG_0603_ROLLOUT + `
<ul>
  <li><strong>Attach guardrails to OUs, not the root, until proven.</strong> The root is the one level you can't route around. Even mature organisations keep "universal" SCPs at the root small (leave org, protect tooling, deny root user) and put Region and service rules on OUs.</li>
  <li><strong>Keep a Policy Staging OU</strong> with representative test accounts (a VPC, a pipeline, a CloudFront distribution, an Identity Center assignment) and an automated smoke test that runs after every SCP change.</li>
  <li><strong>Design the OU tree for policy, not for the org chart.</strong> OUs exist so that accounts with the same guardrails share a parent (M06.08). If you're tempted to write account IDs into SCP conditions, you probably need another OU.</li>
  <li><strong>Plan the 5 × 5,120 budget.</strong> One SCP per theme (Regions, security tooling, identity, data protection, cost) is easier to review than one giant policy, and leaves room for <code>FullAWSAccess</code>. Minify on upload; review the pretty version in Git.</li>
  <li><strong>Every exemption is a target.</strong> Exempt roles (<code>OrgPlatformAdmin</code>, <code>SecurityBreakGlass</code>) must be protected by an SCP, have narrow trust policies (Identity Center group with MFA, or a specific pipeline), and trigger an alert when used.</li>
  <li><strong>Troubleshooting playbook.</strong> Error text says "explicit deny in a service control policy" → find which Deny matched (check Region, role ARN, condition keys in the CloudTrail event). "No service control policy allows" → find the level on the path with no Allow, usually an allow-list missing a service. Use <code>list-parents</code> and <code>list-policies-for-target</code> to walk the path; the IAM policy simulator also accounts for SCPs that affect the account.</li>
  <li><strong>Watch for drift.</strong> Restrict <code>organizations:AttachPolicy</code>, <code>DetachPolicy</code>, <code>UpdatePolicy</code> and <code>MoveAccount</code> to the platform pipeline. In Control Tower, changes outside it show up as drift (M06.04).</li>
  <li><strong>Cost.</strong> SCPs are free, and they're one of the cheapest cost controls you have: deny expensive instance families in sandboxes, deny Regions you don't monitor (where cryptominers like to hide), and deny Marketplace subscriptions outside a procurement role.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>SCPs set the maximum permissions for every principal in member accounts, including the member root user; they never grant.</li>
  <li>They don't affect the management account, service-linked roles, AWS service principals or principals outside the organisation.</li>
  <li>Allows intersect level by level from the root to the account; a level with no Allow implicitly denies everything below it.</li>
  <li>An explicit Deny at any level applies to everything beneath; children can't override it. Use OUs (Exceptions OU) or conditions for exceptions.</li>
  <li>Deny-list keeps <code>FullAWSAccess</code> and adds Denies (common); allow-list replaces <code>FullAWSAccess</code> at a level with approved services.</li>
  <li>Region lock = Deny + <code>NotAction</code> (global services) + <code>StringNotEquals aws:RequestedRegion</code> + <code>ArnNotLike aws:PrincipalArn</code> exemption.</li>
  <li>Protect security tooling, log buckets, <code>OrganizationAccountAccessRole</code> and the exempt roles themselves; deny <code>LeaveOrganization</code> and the root user.</li>
  <li>Quotas: 5,120 characters per SCP, up to 5 SCPs per root/OU/account, at least 1 attached, OUs up to 5 levels deep.</li>
  <li>RCPs limit access to your resources by anyone (data perimeter); declarative policies enforce service configuration baselines.</li>
  <li>Ship SCPs like code: Git, Access Analyzer validation, Policy Staging OU, SDLC, then Prod, with denial alerts.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.03-d1", q: "Path: root (<code>FullAWSAccess</code>) → OU Workloads (<code>FullAWSAccess</code> + example 1's Region deny, approved eu-west-1/eu-central-1) → account (<code>FullAWSAccess</code>). A role with <code>AdministratorAccess</code> (not exempt) calls <code>ec2:RunInstances</code> in <code>us-west-2</code>. Allowed or denied?", answers: ["denied", "deny", "explicit deny"], hint: "Is ec2 in the NotAction list? Is us-west-2 approved? Is the role exempt?", explain: "ec2:RunInstances isn't in NotAction, so it's covered; us-west-2 isn't approved (StringNotEquals true); the role isn't exempt (ArnNotLike true). All conditions match, so the Deny applies." },
    { id: "M06.03-d2", q: "Same stack as d1. The same role calls <code>iam:CreateRole</code> (evaluated as <code>us-east-1</code>). Allowed or denied?", answers: ["allowed", "allow"], hint: "Deny + NotAction denies everything except…", explain: "iam:* is in NotAction, so the Deny statement doesn't match IAM actions at all. Every level has FullAWSAccess and the identity policy allows it." },
    { id: "M06.03-d3", q: "Same stack as d1. The <code>OrgPlatformAdmin</code> role calls <code>ec2:RunInstances</code> in <code>us-west-2</code>. Its identity policy allows EC2. Allowed or denied?", answers: ["allowed", "allow"], hint: "Conditions in one statement are ANDed.", explain: "The Region condition matches but ArnNotLike aws:PrincipalArn is false for the exempt role, so the statement's conditions don't all match and the Deny doesn't apply." },
    { id: "M06.03-d4", q: "Path: root (<code>FullAWSAccess</code>) → OU Sandbox (only an SCP allowing <code>ec2:*</code>, <code>s3:*</code>, <code>lambda:*</code>; <code>FullAWSAccess</code> detached) → account (<code>FullAWSAccess</code>). An admin calls <code>dynamodb:CreateTable</code>. Allowed or denied?", answers: ["denied", "deny", "implicit deny", "implicitly denied"], hint: "Check every level for an Allow.", explain: "The Sandbox OU level has no SCP that allows DynamoDB. Allows intersect, so the account's FullAWSAccess can't add it back: implicit deny." },
    { id: "M06.03-d5", q: "Path: root (<code>FullAWSAccess</code>) → OU A (SCP allowing <code>ec2:*</code> and <code>s3:*</code> only) → OU B nested in A (SCP allowing <code>s3:*</code> and <code>dynamodb:*</code> only) → account (<code>FullAWSAccess</code>). Is <code>s3:GetObject</code> allowed or denied by SCPs?", answers: ["allowed", "allow"], hint: "Which actions appear at every level?", explain: "Root allows all, OU A allows s3, OU B allows s3, account allows all. s3 is in the intersection, and nothing denies it." },
    { id: "M06.03-d6", q: "Same stack as d5. Is <code>dynamodb:GetItem</code> allowed or denied by SCPs?", answers: ["denied", "deny", "implicit deny", "implicitly denied"], hint: "OU B allows it, but what about its parent?", explain: "OU A doesn't allow DynamoDB, so the intersection excludes it. A child OU can't grant what its parent withheld." },
    { id: "M06.03-d7", q: "Every level has <code>FullAWSAccess</code> and nothing else. A new IAM role with no policies attached calls <code>s3:ListAllMyBuckets</code>. Allowed or denied?", answers: ["denied", "deny", "implicit deny", "implicitly denied"], hint: "Do SCPs grant?", explain: "SCPs only set the ceiling. With no identity (or resource) policy granting the action, it's implicitly denied." },
    { id: "M06.03-d8", q: "An SCP denying all EC2 actions is attached to the organization root. A user in the <strong>management account</strong> with EC2 permissions launches an instance. Allowed or denied?", answers: ["allowed", "allow"], hint: "Which account do SCPs never affect?", explain: "SCPs don't apply to the management account, even when attached at the root." },
    { id: "M06.03-d9", q: "Example 3's SCP (DenyRootUser with <code>StringLike aws:PrincipalArn arn:aws:iam::*:root</code>) is attached to the Workloads OU. The <strong>root user</strong> of a member account in that OU calls <code>s3:ListAllMyBuckets</code>. Allowed or denied?", answers: ["denied", "deny", "explicit deny"], hint: "Do SCPs apply to a member account's root user?", explain: "SCPs restrict the member account's root user, and its principal ARN matches arn:aws:iam::*:root, so the Deny applies." },
    { id: "M06.03-d10", q: "An SCP on the account denies <code>iam:CreateRole</code> for everyone. An AWS service creates its <strong>service-linked role</strong> in that account, and that service-linked role then performs actions the SCP denies. Is the service-linked role's activity allowed or denied by the SCP?", answers: ["allowed", "allow", "not affected"], hint: "Which kind of role is outside SCP scope?", explain: "Service-linked roles aren't restricted by SCPs, so AWS services can keep operating. (Creating a service-linked role is a separate API, iam:CreateServiceLinkedRole.)" },
    { id: "M06.03-d11", q: "Your organisation's SCPs deny <code>s3:GetObject</code> unless <code>aws:PrincipalOrgID</code> is yours. A role in an account of a <strong>different</strong> organisation reads an object from your bucket, whose bucket policy grants that role GetObject (and its own account allows it). No RCPs are in use. Allowed or denied?", answers: ["allowed", "allow"], hint: "Whose principals do your SCPs govern?", explain: "SCPs only restrict principals in your member accounts. The outsider is governed by its own organisation's SCPs; to block it on your side you need an RCP or a bucket-policy Deny." },
    { id: "M06.03-d12", q: "Which global condition key holds the Region an API request is sent to, used in Region-restriction SCPs?", answers: ["aws:RequestedRegion", "requestedregion", "aws:requestedregion"], hint: "aws:Requested…", explain: "<code>aws:RequestedRegion</code>. Global services report us-east-1." },
    { id: "M06.03-d13", q: "What is the maximum size of a single SCP document, in characters?", answers: ["5120", "5,120", "5120 characters"], hint: "Same order of magnitude as a managed policy's limit, but smaller.", explain: "5,120 characters. Minify JSON before uploading and split policies by theme." },
    { id: "M06.03-d14", q: "What is the maximum number of SCPs that can be attached directly to one OU?", answers: ["5", "five"], hint: "It includes FullAWSAccess.", explain: "Up to 5 SCPs per root, OU or account, and at least one must stay attached." },
    { id: "M06.03-d15", q: "Which condition key would you use in a Deny's condition to exempt a named role in every account (one key name)?", answers: ["aws:PrincipalArn", "principalarn", "aws:principalarn"], hint: "It's the role ARN even for role sessions.", explain: "<code>aws:PrincipalArn</code> with <code>ArnNotLike</code>. SCPs don't support NotPrincipal, and the session ARN would change per session anyway." }
  ],
  check: [
    { id: "M06.03-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company must restrict all member accounts to eu-west-1 and eu-central-1. Teams must still be able to manage IAM roles, Route 53 records and CloudFront distributions. Which SCP design meets the requirement?",
      options: [
        { t: "A Deny statement with NotAction listing global services such as iam:*, route53:* and cloudfront:*, and a StringNotEquals condition on aws:RequestedRegion for the two approved Regions", c: true, why: "Global services are evaluated as us-east-1; NotAction leaves them out of the Deny while everything else is limited to the approved Regions." },
        { t: "A Deny statement on Action \"*\" with a StringNotEquals condition on aws:RequestedRegion for the two approved Regions", c: false, why: "This also denies IAM, Route 53 and CloudFront, whose requests evaluate as us-east-1." },
        { t: "An Allow statement for the two Regions attached to each account, keeping FullAWSAccess", c: false, why: "With FullAWSAccess still attached at the same level, the union of Allows still allows every Region." },
        { t: "A permissions boundary on every IAM role with an aws:RequestedRegion condition", c: false, why: "Boundaries are per role, can be removed by local admins and don't apply to the root user; an SCP is the organisation-wide control." }
      ] },
    { id: "M06.03-k2", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "An administrator replaces FullAWSAccess on the Regulated OU with an SCP that allows only Amazon EC2, Amazon S3 and Amazon RDS. The root and all accounts keep FullAWSAccess. Which TWO statements are true for accounts in the Regulated OU?",
      options: [
        { t: "An IAM user with AdministratorAccess can't use Amazon DynamoDB", c: true, why: "The OU level doesn't allow DynamoDB, so it's implicitly denied regardless of the identity policy." },
        { t: "Attaching an SCP that allows DynamoDB to one account in the OU makes DynamoDB usable in that account", c: false, why: "Allows must exist at every level; the OU level still doesn't allow DynamoDB." },
        { t: "IAM roles in those accounts still need identity policies that allow EC2, S3 or RDS actions", c: true, why: "SCPs never grant; they only cap what identity and resource policies can grant." },
        { t: "The OU's SCP grants EC2, S3 and RDS to every principal in those accounts", c: false, why: "SCPs don't grant permissions." },
        { t: "Principals in the management account are limited to EC2, S3 and RDS", c: false, why: "The management account isn't in the OU and SCPs never affect it." }
      ] },
    { id: "M06.03-k3", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A Deny-based Region SCP is attached to the Workloads OU. One account in that OU must be allowed to use us-west-2 for a contractual reason; all other accounts must remain restricted. What should a solutions architect do?",
      options: [
        { t: "Move the account to a separate Exceptions OU that has a variant of the Region SCP including us-west-2", c: true, why: "A child can't override a parent's explicit Deny; the account must sit on a path where the Deny doesn't apply to it." },
        { t: "Attach FullAWSAccess directly to the account", c: false, why: "The account already effectively has it; FullAWSAccess can't override an inherited explicit Deny." },
        { t: "Attach an SCP to the account that allows all actions in us-west-2", c: false, why: "An Allow can't override an explicit Deny at a higher level." },
        { t: "Give the account's administrators an identity policy that allows us-west-2", c: false, why: "Identity policies are capped by SCPs; the Deny still wins." }
      ] },
    { id: "M06.03-k4", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "The security team needs to prevent anyone in member accounts from disabling Amazon GuardDuty, except the team's automation role, SecOpsAutomation, which exists in every account. Which approach is MOST effective?",
      options: [
        { t: "An SCP that denies guardduty:DeleteDetector and related actions with an ArnNotLike condition on aws:PrincipalArn for arn:aws:iam::*:role/SecOpsAutomation, plus an SCP that prevents others from modifying that role", c: true, why: "aws:PrincipalArn matches the role for every session; protecting the role stops admins from creating or changing their own exempt role." },
        { t: "An SCP that denies the GuardDuty actions with NotPrincipal set to the SecOpsAutomation role", c: false, why: "SCPs don't support Principal or NotPrincipal." },
        { t: "A Deny in each account administrator's identity policy", c: false, why: "Local admins can edit their own policies, and the root user isn't covered." },
        { t: "An SCP attached to the management account that denies the actions", c: false, why: "SCPs don't affect the management account, and the requirement is about member accounts." }
      ] },
    { id: "M06.03-k5", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A platform team has written a new SCP that denies several IAM and EC2 actions. They want to minimise the risk of breaking production workloads across 200 accounts. What should they do FIRST after validating the JSON?",
      options: [
        { t: "Attach it to a Policy Staging OU containing test accounts, run tests and review denials before attaching it to non-production and then production OUs", c: true, why: "Staged promotion through OUs limits the blast radius of a mistake to test accounts." },
        { t: "Attach it to the organization root during a low-traffic window", c: false, why: "The root affects every member account at once, so a mistake becomes an organisation-wide outage." },
        { t: "Attach it to the management account to test it", c: false, why: "SCPs have no effect on the management account, so this tests nothing." },
        { t: "Use the policy as a permissions boundary on one role first", c: false, why: "Boundary evaluation differs (it's per role and doesn't involve OU inheritance), so it doesn't validate SCP behaviour." }
      ] },
    { id: "M06.03-k6", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "A company wants to guarantee that objects in Amazon S3 buckets across all member accounts can't be read by identities outside its organisation, even if a developer writes a bucket policy that grants access to Principal \"*\". Which control should be used?",
      options: [
        { t: "A resource control policy that denies S3 actions when aws:PrincipalOrgID isn't the organisation's ID, exempting AWS service principals", c: true, why: "RCPs limit access to resources in member accounts by any principal, including outsiders, regardless of bucket policies." },
        { t: "An SCP that denies s3:GetObject when aws:PrincipalOrgID isn't the organisation's ID", c: false, why: "SCPs only govern principals in your own member accounts; external principals aren't affected." },
        { t: "An SCP that denies s3:PutBucketPolicy for everyone", c: false, why: "It blocks all legitimate bucket policies and doesn't address existing ones." },
        { t: "A declarative policy that sets S3 Object Ownership to bucket owner enforced", c: false, why: "That disables ACLs; it doesn't stop a bucket policy from granting outsiders access." }
      ] }
  ],
  cards: ["fc-M06-3-01", "fc-M06-3-02", "fc-M06-3-03", "fc-M06-3-04", "fc-M06-3-05", "fc-M06-3-06", "fc-M06-3-07", "fc-M06-3-08", "fc-M06-3-09", "fc-M06-3-10", "fc-M06-3-11", "fc-M06-3-12"],
  references: [
    "AWS Organizations User Guide: <em>Service control policies (SCPs)</em>, <em>SCP evaluation</em>, <em>SCP syntax</em>, <em>Strategies for using SCPs</em> (deny list / allow list)",
    "AWS Organizations User Guide: <em>Example service control policies</em> (Deny access to AWS based on the requested AWS Region; Require IMDSv2; Prevent member accounts from leaving the organization)",
    "AWS Organizations User Guide: <em>Resource control policies (RCPs)</em>, <em>Declarative policies</em>, <em>Quotas and service limits for AWS Organizations</em>",
    "IAM User Guide: <em>AWS global condition context keys</em> (aws:RequestedRegion, aws:PrincipalArn, aws:PrincipalOrgID); <em>Refining permissions using service last accessed data</em> (Organizations access reports)",
    "IAM Access Analyzer: <em>ValidatePolicy</em> (policy type SERVICE_CONTROL_POLICY)",
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em> (Policy Staging OU, Exceptions OU); AWS Security Reference Architecture (SRA)",
    "AWS sample repository: <em>data-perimeter-policy-examples</em> and <em>service-control-policy-examples</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-3-01", front: "Do SCPs grant permissions?", back: "Never. They set the maximum permissions for principals in member accounts; identity or resource policies must still grant." },
  { id: "fc-M06-3-02", front: "Who is NOT affected by SCPs?", back: "Principals in the management account, service-linked roles, AWS service principals, and principals outside the organisation." },
  { id: "fc-M06-3-03", front: "Is a member account's root user affected by SCPs?", back: "Yes. Deny it with a condition on aws:PrincipalArn like arn:aws:iam::*:root." },
  { id: "fc-M06-3-04", front: "How do SCP Allows combine from root to account?", back: "Intersection: at every level (root, each OU, account) at least one SCP must allow the action. One level without an Allow → implicit deny below it." },
  { id: "fc-M06-3-05", front: "How do SCP Denies combine?", back: "An explicit Deny at any level applies to all accounts beneath it. A child can't override it; move the account or put the exception in the Deny's condition." },
  { id: "fc-M06-3-06", front: "Deny-list vs allow-list SCP strategy?", back: "Deny-list: keep FullAWSAccess everywhere, add Deny statements (default, common). Allow-list: replace FullAWSAccess at a level with an SCP allowing only approved services." },
  { id: "fc-M06-3-07", front: "Region-restriction SCP pattern?", back: "Deny + NotAction (global services: iam, organizations, sts, route53, cloudfront, support, budgets, ce, waf…) + StringNotEquals aws:RequestedRegion [approved] + ArnNotLike aws:PrincipalArn [admin roles]." },
  { id: "fc-M06-3-08", front: "Why do Region SCPs need a NotAction list?", back: "Global services (IAM, Route 53, CloudFront, Organizations, billing…) are evaluated with aws:RequestedRegion = us-east-1." },
  { id: "fc-M06-3-09", front: "How do you exempt a role from an SCP Deny?", back: "Condition ArnNotLike on aws:PrincipalArn (the role ARN, valid for all its sessions). SCPs don't support Principal/NotPrincipal. Protect the exempt role with another SCP." },
  { id: "fc-M06-3-10", front: "SCP quotas?", back: "5,120 characters per SCP; up to 5 SCPs attached per root, OU or account; at least 1 must stay attached; OUs nest up to 5 levels below the root." },
  { id: "fc-M06-3-11", front: "SCP vs RCP vs declarative policy?", back: "SCP: what your principals can do. RCP: what anyone (even outsiders) can do to your resources. Declarative: enforce a service configuration baseline (e.g. IMDSv2 default, block public AMI sharing)." },
  { id: "fc-M06-3-12", front: "Safe SCP rollout?", back: "Git + review → Access Analyzer validate-policy → Policy Staging OU tests → SDLC OUs → Prod OUs; alert on 'explicit deny in a service control policy'." }
);
// ================================================================== 04_control_tower.js
// ================================================================== 04_control_tower.js
/* ---------------------------------------------------------------- M06.04 AWS Control Tower */
var DG_0604_LZ = `
<figure>
<svg class="diagram" viewBox="0 0 760 404" role="img" aria-labelledby="m0604at m0604ad">
  <title id="m0604at">An AWS Control Tower landing zone</title>
  <desc id="m0604ad">The management account runs Control Tower, AWS Organizations, Account Factory and IAM Identity Center and owns the organization trail. Under the organization root, the foundational Security OU holds the Log Archive account, which stores CloudTrail and AWS Config logs in S3, and the Audit account, which holds the Config aggregator, the SNS notification topics and cross-account audit roles. An optional Sandbox OU holds experimentation accounts, and customer-created OUs such as Workloads hold production and test accounts. Logs from every enrolled account flow to the Log Archive account; compliance and drift notifications flow to the Audit account.</desc>
  <defs><marker id="m0604a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-edge" x="190" y="12" width="380" height="72" rx="10"/>
  <text class="dg-tb" x="204" y="34">Management account (payer)</text>
  <text class="dg-ts" x="204" y="54">Control Tower · Organizations · Account Factory</text>
  <text class="dg-ts" x="204" y="72">Identity Center · organization trail · billing</text>
  <path class="dg-line" d="M380 84 V102" marker-end="url(#m0604a-ar)"/>

  <rect class="dg-region" x="12" y="104" width="736" height="290" rx="12"/>
  <text class="dg-ta" x="24" y="124">Organization root (r-ab12) · home Region + governed Regions</text>

  <rect class="dg-az" x="24" y="134" width="340" height="168" rx="10"/>
  <text class="dg-ta" x="36" y="154">Security OU (foundational)</text>
  <rect class="dg-good" x="36" y="166" width="154" height="122" rx="8"/>
  <text class="dg-tb" x="48" y="188">Log Archive</text>
  <text class="dg-ts" x="48" y="210">CloudTrail logs</text>
  <text class="dg-ts" x="48" y="228">Config history</text>
  <text class="dg-ts" x="48" y="246">S3 + access-log</text>
  <text class="dg-ts" x="48" y="264">buckets (opt. KMS)</text>
  <rect class="dg-info" x="200" y="166" width="152" height="122" rx="8"/>
  <text class="dg-tb" x="212" y="188">Audit</text>
  <text class="dg-ts" x="212" y="210">Config aggregator</text>
  <text class="dg-ts" x="212" y="228">SNS notifications</text>
  <text class="dg-ts" x="212" y="246">cross-account</text>
  <text class="dg-ts" x="212" y="264">audit roles</text>

  <rect class="dg-az" x="376" y="134" width="176" height="168" rx="10"/>
  <text class="dg-ta" x="388" y="154">Sandbox OU (opt-in)</text>
  <rect class="dg-box" x="388" y="166" width="152" height="54" rx="8"/>
  <text class="dg-t" x="400" y="188">sandbox-alice</text>
  <text class="dg-ts" x="400" y="206">experiments</text>
  <rect class="dg-box" x="388" y="232" width="152" height="54" rx="8"/>
  <text class="dg-t" x="400" y="254">sandbox-bob</text>
  <text class="dg-ts" x="400" y="272">budget-capped</text>

  <rect class="dg-az" x="564" y="134" width="172" height="168" rx="10"/>
  <text class="dg-ta" x="576" y="154">Workload OUs</text>
  <rect class="dg-box" x="576" y="166" width="148" height="54" rx="8"/>
  <text class="dg-t" x="588" y="188">payments-prod</text>
  <text class="dg-ts" x="588" y="206">enrolled account</text>
  <rect class="dg-box" x="576" y="232" width="148" height="54" rx="8"/>
  <text class="dg-t" x="588" y="254">payments-test</text>
  <text class="dg-ts" x="588" y="272">enrolled account</text>

  <path class="dg-line" d="M650 302 V330 H113 V292" marker-end="url(#m0604a-ar)"/>
  <path class="dg-line" d="M464 302 V330"/>
  <text class="dg-ts" x="130" y="350">CloudTrail and Config logs from every enrolled account → Log Archive S3</text>
  <text class="dg-ts" x="130" y="370">Config compliance and drift notifications → Audit (SNS topics, aggregator)</text>
  <text class="dg-ts" x="130" y="388">Controls are enabled per OU and apply to every enrolled account in it</text>
</svg>
<figcaption>Figure M06-4a. What the landing zone setup builds. Control Tower creates the Security OU with two shared accounts (Log Archive and Audit), optionally a Sandbox OU, and baselines every enrolled account so its logs land in Log Archive and its compliance signals reach Audit. You add your own OUs (Workloads, Infrastructure…) and register them.</figcaption>
</figure>`;

var DG_0604_CONTROLS = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0604bt m0604bd">
  <title id="m0604bt">Control behaviours and guidance levels</title>
  <desc id="m0604bd">A request to create a resource passes three enforcement points. Proactive controls are CloudFormation hooks that check the template before provisioning and fail the stack operation if the resource is non-compliant. Preventive controls are service control policies, resource control policies or declarative policies evaluated on every API call, returning AccessDenied. Detective controls are AWS Config rules that evaluate resources after they exist and report a NONCOMPLIANT finding. Below, the three guidance levels: mandatory controls are always on and protect the landing zone's own resources; strongly recommended controls are AWS best practice and opt-in; elective controls are opt-in for specific needs.</desc>
  <defs><marker id="m0604b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="24">Behaviour: where each control acts in a resource's life</text>
  <rect class="dg-box" x="12" y="38" width="170" height="124" rx="8"/>
  <text class="dg-tb" x="24" y="60">Request</text>
  <text class="dg-ts" x="24" y="82">console, CLI, SDK or</text>
  <text class="dg-ts" x="24" y="100">CloudFormation stack</text>
  <text class="dg-ts" x="24" y="118">wants to create or</text>
  <text class="dg-ts" x="24" y="136">change a resource</text>

  <rect class="dg-info" x="200" y="38" width="170" height="124" rx="8"/>
  <text class="dg-tb" x="212" y="60">Proactive</text>
  <text class="dg-ts" x="212" y="82">CloudFormation hook</text>
  <text class="dg-ts" x="212" y="100">checks the template</text>
  <text class="dg-ts" x="212" y="118">BEFORE provisioning</text>
  <text class="dg-ts" x="212" y="136">FAIL = stack op fails</text>

  <rect class="dg-edge" x="388" y="38" width="170" height="124" rx="8"/>
  <text class="dg-tb" x="400" y="60">Preventive</text>
  <text class="dg-ts" x="400" y="82">SCP · RCP · declarative</text>
  <text class="dg-ts" x="400" y="100">evaluated on every</text>
  <text class="dg-ts" x="400" y="118">API call (any tool)</text>
  <text class="dg-ts" x="400" y="136">deny = AccessDenied</text>

  <rect class="dg-good" x="576" y="38" width="172" height="124" rx="8"/>
  <text class="dg-tb" x="588" y="60">Detective</text>
  <text class="dg-ts" x="588" y="82">AWS Config rule</text>
  <text class="dg-ts" x="588" y="100">evaluates AFTER the</text>
  <text class="dg-ts" x="588" y="118">resource exists</text>
  <text class="dg-ts" x="588" y="136">NONCOMPLIANT finding</text>

  <path class="dg-line" d="M182 100 H196" marker-end="url(#m0604b-ar)"/>
  <path class="dg-line" d="M370 100 H384" marker-end="url(#m0604b-ar)"/>
  <path class="dg-line" d="M558 100 H572" marker-end="url(#m0604b-ar)"/>
  <text class="dg-ts" x="212" y="180">CloudFormation only</text>
  <text class="dg-ts" x="588" y="180">reports, does not block</text>

  <text class="dg-tb" x="12" y="212">Guidance: how strongly AWS recommends it</text>
  <rect class="dg-bad" x="12" y="224" width="236" height="96" rx="8"/>
  <text class="dg-tb" x="24" y="246">Mandatory</text>
  <text class="dg-ts" x="24" y="266">always enabled; cannot be disabled</text>
  <text class="dg-ts" x="24" y="284">protects the landing zone itself</text>
  <text class="dg-ts" x="24" y="302">e.g. log archive bucket, CT roles</text>
  <rect class="dg-info" x="262" y="224" width="236" height="96" rx="8"/>
  <text class="dg-tb" x="274" y="246">Strongly recommended</text>
  <text class="dg-ts" x="274" y="266">AWS best practice; opt-in</text>
  <text class="dg-ts" x="274" y="284">e.g. disallow root access keys,</text>
  <text class="dg-ts" x="274" y="302">detect public S3 read access</text>
  <rect class="dg-box" x="512" y="224" width="236" height="96" rx="8"/>
  <text class="dg-tb" x="524" y="246">Elective</text>
  <text class="dg-ts" x="524" y="266">opt-in for specific needs</text>
  <text class="dg-ts" x="524" y="284">e.g. disallow S3 deletes</text>
  <text class="dg-ts" x="524" y="302">without MFA, data residency</text>
</svg>
<figcaption>Figure M06-4b. Two independent dimensions. Behaviour says <em>how</em> a control works (proactive before provisioning, preventive at the API, detective after the fact); guidance says <em>how strongly</em> AWS recommends it. Defence in depth uses all three behaviours.</figcaption>
</figure>`;

var DG_0604_AFT = `
<figure>
<svg class="diagram" viewBox="0 0 760 270" role="img" aria-labelledby="m0604ct m0604cd">
  <title id="m0604ct">Account Factory for Terraform pipeline</title>
  <desc id="m0604cd">A pull request merged into the aft-account-request Git repository triggers the AFT pipeline in a dedicated AFT management account. AFT calls Control Tower Account Factory in the management account, which creates and enrolls the new account in its target OU. AFT then runs the provisioning customizations, the global customizations applied to every account, and the account-specific customizations selected by name, after which the account is ready.</desc>
  <defs><marker id="m0604c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="12" y="20" width="170" height="78" rx="8"/>
  <text class="dg-tb" x="24" y="42">1 · Git PR</text>
  <text class="dg-ts" x="24" y="64">aft-account-request</text>
  <text class="dg-ts" x="24" y="82">reviewed + merged</text>
  <rect class="dg-edge" x="206" y="20" width="170" height="78" rx="8"/>
  <text class="dg-tb" x="218" y="42">2 · AFT pipeline</text>
  <text class="dg-ts" x="218" y="64">AFT management acct</text>
  <text class="dg-ts" x="218" y="82">queue + Step Functions</text>
  <rect class="dg-edge" x="400" y="20" width="170" height="78" rx="8"/>
  <text class="dg-tb" x="412" y="42">3 · Acct Factory</text>
  <text class="dg-ts" x="412" y="64">Service Catalog in</text>
  <text class="dg-ts" x="412" y="82">management account</text>
  <rect class="dg-good" x="594" y="20" width="154" height="78" rx="8"/>
  <text class="dg-tb" x="606" y="42">4 · New account</text>
  <text class="dg-ts" x="606" y="64">enrolled in the</text>
  <text class="dg-ts" x="606" y="82">target OU</text>
  <path class="dg-line" d="M182 59 H202" marker-end="url(#m0604c-ar)"/>
  <path class="dg-line" d="M376 59 H396" marker-end="url(#m0604c-ar)"/>
  <path class="dg-line" d="M570 59 H590" marker-end="url(#m0604c-ar)"/>
  <path class="dg-line" d="M671 98 V140" marker-end="url(#m0604c-ar)"/>

  <rect class="dg-box" x="594" y="144" width="154" height="78" rx="8"/>
  <text class="dg-tb" x="606" y="166">5 · Provisioning</text>
  <text class="dg-ts" x="606" y="188">customizations</text>
  <text class="dg-ts" x="606" y="206">(Step Functions)</text>
  <rect class="dg-box" x="400" y="144" width="170" height="78" rx="8"/>
  <text class="dg-tb" x="412" y="166">6 · Global</text>
  <text class="dg-ts" x="412" y="188">customizations: run</text>
  <text class="dg-ts" x="412" y="206">in EVERY account</text>
  <rect class="dg-box" x="206" y="144" width="170" height="78" rx="8"/>
  <text class="dg-tb" x="218" y="166">7 · Per-account</text>
  <text class="dg-ts" x="218" y="188">customizations chosen</text>
  <text class="dg-ts" x="218" y="206">by name, e.g. payments</text>
  <rect class="dg-good" x="12" y="144" width="170" height="78" rx="8"/>
  <text class="dg-tb" x="24" y="166">8 · Ready</text>
  <text class="dg-ts" x="24" y="188">baseline + workload</text>
  <text class="dg-ts" x="24" y="206">roles, network, tags</text>
  <path class="dg-line" d="M594 183 H574" marker-end="url(#m0604c-ar)"/>
  <path class="dg-line" d="M400 183 H380" marker-end="url(#m0604c-ar)"/>
  <path class="dg-line" d="M206 183 H186" marker-end="url(#m0604c-ar)"/>
  <text class="dg-ts" x="12" y="250">Customizations are Terraform (or Python/API helpers) stored in Git; re-running the pipeline re-applies them.</text>
</svg>
<figcaption>Figure M06-4c. AFT turns "I need an account" into a pull request. Control Tower still creates and enrolls the account (step 3); AFT wraps it with Git review, Terraform state and three layers of customization.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.04", title: "AWS Control Tower", level: 300, minutes: 60,
  objectives: [
    "Describe what a Control Tower landing zone creates (home Region, governed Regions, Security OU, Log Archive and Audit accounts, baselines) and set one up step by step",
    "Classify any control by behaviour (preventive, detective, proactive) and guidance (mandatory, strongly recommended, elective) and pick the right one for a requirement",
    "Choose between Account Factory, Account Factory Customization (AFC), Account Factory for Terraform (AFT) and Customizations for Control Tower (CfCT)",
    "Enroll existing accounts and OUs, and detect and repair landing zone, account and control drift",
    "Decide when Control Tower is the right answer and when it is not"
  ],
  sections: [
    { type: "why", html: `
<p>In M06.01–M06.03 you learned <em>why</em> to use many accounts, how AWS Organizations arranges them, and how SCPs fence them in. Doing all of that by hand is a project: create a log archive account, build an organization trail with a locked-down bucket, turn on AWS Config in every account and every Region, aggregate it somewhere, write and test a dozen SCPs, wire up IAM Identity Center, and then repeat the baseline for every new account forever. Teams that hand-build this typically spend weeks, and the result decays: someone deletes a Config recorder "to save money", an account gets created outside the process, an SCP is edited in a hurry during an incident.</p>
<p><strong>AWS Control Tower</strong> is AWS's managed answer. It sets up a prescriptive multi-account environment (a <strong>landing zone</strong>) in about an hour, keeps a catalog of ready-made <strong>controls</strong> (formerly called <em>guardrails</em>), vends new accounts that are compliant from minute one (<strong>Account Factory</strong>), and tells you when somebody breaks the setup (<strong>drift detection</strong>). As the <em>System Design on AWS</em> book puts it, a landing zone gives you "a baseline to get started with multi-account architecture, IAM, governance, data security, network design, and logging", and Control Tower is the managed way to get those "initial prescriptive configurations" and then customise them as the organisation scales.</p>
<p>For the exam, Task 1.1 names Control Tower explicitly ("designing a security strategy for multiple AWS accounts, for example AWS Control Tower, SCPs"). Questions describe a company that "wants to set up and govern a secure multi-account environment with the LEAST operational overhead", or "must detect non-compliant resources across all accounts", or "must provision new accounts that automatically meet company standards". For real work, Control Tower is the most common starting point for an enterprise landing zone, so you must also know its limits, its moving parts, and how to recover when it drifts.</p>` },

    { type: "concept", title: "Concept: the landing zone", html: DG_0604_LZ + `
<h3>Vocabulary</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><strong>Landing zone</strong></td><td>A well-architected, multi-account baseline: an organisation structure, shared accounts for logging and security, identity, and controls. The generic idea exists without Control Tower (you can build one with Terraform or the Landing Zone Accelerator); Control Tower <em>manages</em> one for you. Landing zones are versioned (for example 3.3); you update to newer versions from the console or API.</td></tr>
<tr><td><strong>Home Region</strong></td><td>The Region where you set up Control Tower and where its own resources (StackSets, Account Factory product, aggregator) live. You <strong>can't change it</strong> later without decommissioning the landing zone and setting it up again, so choose deliberately (usually your primary operating Region).</td></tr>
<tr><td><strong>Governed Regions</strong></td><td>The Regions where Control Tower deploys its baseline (Config recorder, detective controls) into enrolled accounts. Regions you don't govern get no detective controls; combine with the <strong>Region deny</strong> control so nobody can build there.</td></tr>
<tr><td><strong>Foundational OU</strong></td><td>The OU Control Tower creates for the shared accounts, named <strong>Security</strong> by default (it was called "Core" in early versions).</td></tr>
<tr><td><strong>Log Archive account</strong></td><td>Shared account holding the central S3 bucket for the organization's CloudTrail logs and AWS Config history, plus a separate bucket for S3 access logs. Optional customer managed KMS key for encryption; configurable retention.</td></tr>
<tr><td><strong>Audit account</strong></td><td>Shared account for the security team: the AWS Config <em>aggregator</em> for all enrolled accounts, SNS topics that receive Config compliance and drift notifications, and cross-account roles (read-only and administrative) into every enrolled account. In the SRA/whitepaper (M06.08) this is the <em>Security Tooling</em> account, and it is the natural delegated administrator for GuardDuty and Security Hub.</td></tr>
<tr><td><strong>Additional OU</strong></td><td>An optional second OU created at setup, named <strong>Sandbox</strong> by default, for experimentation accounts.</td></tr>
<tr><td><strong>Registered OU / enrolled account</strong></td><td>An OU that Control Tower governs, and an account that Control Tower has baselined (roles, Config, CloudTrail integration, controls). Organizations can contain unregistered OUs and unenrolled accounts; Control Tower simply doesn't govern them.</td></tr>
<tr><td><strong>Baseline</strong></td><td>The set of resources Control Tower deploys to an OU's accounts when you register it (via CloudFormation StackSets): execution role, Config recorder and delivery channel, notification forwarding, and so on.</td></tr>
<tr><td><strong>Control</strong></td><td>A high-level rule of ongoing governance, implemented as an SCP/RCP/declarative policy, a Config rule, or a CloudFormation hook. Enabled per OU.</td></tr>
</tbody></table>

<h3>What Control Tower builds on</h3>
<p>Control Tower is an <em>orchestration</em> service. It owns very little itself; it configures other services and watches them:</p>
<ul>
  <li><strong>AWS Organizations</strong> (all features): OUs, account creation, SCPs/RCPs/declarative policies for preventive controls (M06.02, M06.03).</li>
  <li><strong>AWS CloudFormation StackSets</strong>: deploys the baseline and detective controls into every enrolled account and governed Region.</li>
  <li><strong>AWS CloudTrail</strong>: an organization trail created from the management account, delivering to the Log Archive bucket.</li>
  <li><strong>AWS Config</strong>: a recorder in every enrolled account and governed Region; Config rules for detective controls; an aggregator in the Audit account.</li>
  <li><strong>AWS Service Catalog</strong>: the Account Factory product and AFC blueprints.</li>
  <li><strong>IAM Identity Center</strong> (optional, recommended): preconfigured groups and permission sets for administrators, auditors and log viewers (M06.05).</li>
  <li><strong>Amazon S3, SNS, Lambda, KMS, Step Functions</strong>: log storage, notifications and internal workflows.</li>
</ul>
<div class="callout tip"><strong>Pricing:</strong> Control Tower itself has <strong>no additional charge</strong>. You pay for the services it turns on: AWS Config configuration items and rule evaluations (usually the biggest line), CloudTrail beyond the free first copy of management events, S3 storage for logs, KMS requests, and so on. A busy account with frequent resource changes can make Config surprisingly expensive.</div>

<h3>Controls: behaviour × guidance</h3>
<p>Every control has <strong>two</strong> independent attributes. Do not confuse them; the exam and the console use both.</p>
` + DG_0604_CONTROLS + `
<table>
<thead><tr><th>Behaviour</th><th>Implemented as</th><th>When it acts</th><th>Result</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Preventive</strong></td><td>SCP (most), RCP or declarative policy in Organizations</td><td>At the API call, for every tool</td><td>Request denied; nothing is created</td><td>Disallow changes to the Control Tower CloudTrail trail; Region deny</td></tr>
<tr><td><strong>Detective</strong></td><td>AWS Config rule deployed by StackSets (some via Security Hub)</td><td>After the resource exists, on change or periodically</td><td>Compliance status COMPLIANT/NONCOMPLIANT; visible in the CT console and the Audit aggregator; does not block</td><td>Detect whether MFA is enabled for the root user; detect public read on S3 buckets</td></tr>
<tr><td><strong>Proactive</strong></td><td>CloudFormation hook (Guard rules) managed by Control Tower</td><td>Before CloudFormation provisions or updates a resource</td><td>Hook FAILs and the stack operation is rolled back</td><td>Require an S3 bucket to have versioning / encryption before it is created</td></tr>
</tbody></table>
<table>
<thead><tr><th>Guidance</th><th>Default state</th><th>Can you turn it off?</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><strong>Mandatory</strong></td><td>Enabled automatically on every registered OU</td><td><strong>No</strong></td><td>Protect the landing zone's own resources (log archive bucket, CT roles, CT's Config and CloudTrail setup, CT-managed SNS and Lambda)</td></tr>
<tr><td><strong>Strongly recommended</strong></td><td>Off; you enable it</td><td>Yes</td><td>Well-Architected best practice for most multi-account environments (root access keys, MFA, public S3, encrypted volumes and similar)</td></tr>
<tr><td><strong>Elective</strong></td><td>Off; you enable it</td><td>Yes</td><td>Commonly needed but environment-specific (for example, disallow S3 deletes without MFA, data residency controls)</td></tr>
</tbody></table>
<p>Controls are listed in the <strong>AWS Control Catalog</strong>, a consolidated catalog (with its own API, <code>controlcatalog</code>) that groups controls by domain, objective and common frameworks. You'll see two identifier styles: legacy names such as <code>AWS-GR_RESTRICT_ROOT_USER_ACCESS_KEYS</code> and newer ones such as <code>CT.S3.PR.1</code> (PR = proactive) or <code>CT.MULTISERVICE.PV.1</code> (PV = preventive). Some controls take <strong>parameters</strong>, for example the OU-level Region deny control accepts the list of allowed Regions and exempted principal ARNs.</p>
<div class="callout warn"><strong>Inherited limits from M06.03 still apply.</strong> Preventive controls are SCPs, so they never affect the management account, never affect service-linked roles, and count against the 5-policies-per-target SCP quota. Control Tower packs several controls into each SCP it creates, but OUs that already carry your own SCPs can hit the quota.</div>` },

    { type: "workflow", title: "Workflow: setting up a landing zone, step by step", html: `
<p>Setup takes place in the console of the <strong>management account</strong> (or through the <code>CreateLandingZone</code> API with a JSON manifest). Prepare first, because some choices are permanent.</p>
<ol class="flow">
  <li><strong>Prepare the management account.</strong> Use a dedicated account that will run no workloads (M06.02). Sign in as an administrator, not the root user. If AWS Organizations already exists, Control Tower uses it; otherwise it creates one with all features. Check that no existing SCP blocks Control Tower, and that you have two unused email addresses (or two existing accounts) for the shared accounts.</li>
  <li><strong>Choose the home Region.</strong> Open Control Tower in the Region you want as home. This choice is permanent for the life of the landing zone.</li>
  <li><strong>Choose governed Regions and the Region deny setting.</strong> Select every Region you operate in (and your DR Region). Decide whether to enable the landing zone-level <strong>Region deny</strong> control, which denies API calls in ungoverned Regions except for global services and Control Tower's own roles. You can also apply a parameterised Region deny per OU later.</li>
  <li><strong>Name the OUs.</strong> Foundational OU (default <em>Security</em>) and, optionally, an additional OU (default <em>Sandbox</em>). Both can be renamed later in Organizations; Control Tower tracks them by ID.</li>
  <li><strong>Configure the shared accounts.</strong> For Log Archive and Audit, either create new accounts (give each a unique email address and name) or <strong>use existing accounts</strong> you already have, which is useful when you already run a log archive account.</li>
  <li><strong>Additional configurations.</strong> Choose whether Control Tower sets up <strong>IAM Identity Center</strong> (or you manage identity yourself), whether it creates the <strong>organization-level CloudTrail trail</strong>, the S3 <strong>log retention</strong> for the logging bucket and the access-logging bucket, and an optional <strong>customer managed KMS key</strong> to encrypt logs (its key policy must allow CloudTrail and Config to use it).</li>
  <li><strong>Review and set up.</strong> Control Tower now creates the OUs and accounts, the service roles in the management account (for example <code>AWSControlTowerAdmin</code>, <code>AWSControlTowerStackSetRole</code>, <code>AWSControlTowerCloudTrailRole</code>), the <code>AWSControlTowerExecution</code> role in every account it manages, the log buckets, the trail, Config recorders, the aggregator, SNS topics, Identity Center groups and all mandatory controls. Typical duration is 30–60 minutes.</li>
  <li><strong>Post-setup hardening.</strong> Confirm the SNS subscriptions in the Audit account (or route them to a SIEM/ChatOps), enable the strongly recommended controls on every OU, add your own OUs (Infrastructure, Workloads/Prod, Workloads/SDLC, Policy Staging, Suspended; see M06.08) and <strong>register</strong> them, configure Account Factory network settings (or switch off its default VPC), and set up delegated administrators for GuardDuty, Security Hub and Config in the Audit account.</li>
  <li><strong>Keep it current.</strong> When AWS releases a new landing zone version, the console shows an update. Update deliberately (it re-runs baselines across accounts), then update or re-register OUs so enrolled accounts pick up the new baseline.</li>
</ol>
<div class="callout"><strong>Using an existing organisation.</strong> Control Tower can be set up on top of an organisation that already has accounts and OUs. Existing OUs are <em>not</em> governed until you register them, and existing accounts are not enrolled until you register their OU or enroll them individually. This lets you adopt Control Tower gradually.</div>` },

    { type: "workflow", title: "Workflow: enrolling existing accounts and repairing drift", html: `
<h3>Enrolling existing accounts</h3>
<p>Most organisations adopt Control Tower after they already have accounts. There are two ways to bring them under governance: <strong>register an OU</strong> (enrolls every account in it, which is the usual path) or <strong>enroll a single account</strong> (from the console or by provisioning the Account Factory product with that account's details, which also moves it into the chosen registered OU).</p>
<ol class="flow">
  <li><strong>Invited accounts need the execution role.</strong> Accounts that were created by Organizations already have <code>OrganizationAccountAccessRole</code>, but Control Tower needs <code>AWSControlTowerExecution</code> with <code>AdministratorAccess</code>, trusting the management account. Create it in each invited account first (one CloudFormation StackSet does it for many accounts).</li>
  <li><strong>Remove conflicts.</strong> The baseline deploys an AWS Config recorder and delivery channel. Accounts with their own existing Config recorder or delivery channel in a governed Region must have them removed or adapted following the Control Tower documentation for existing Config resources. Also check that STS is active in all governed Regions and that no SCP on the OU denies the actions Control Tower needs.</li>
  <li><strong>Move the account into the target OU</strong> (or register the OU it is already in).</li>
  <li><strong>Register the OU</strong> in the Control Tower console (Organization → select OU → Register). Control Tower checks prerequisites for every account, then deploys the baseline and the OU's enabled controls through StackSets. Accounts that fail prerequisites are listed with the reason; fix and re-run.</li>
  <li><strong>Verify.</strong> The account shows <em>Enrolled</em>; its CloudTrail events arrive in the Log Archive bucket; its Config data appears in the Audit aggregator; detective controls show a compliance status.</li>
</ol>
<p>Nested OUs (up to five levels, as in Organizations) are supported: register the parent before the child. SCP-based controls on a parent OU flow down through normal Organizations inheritance, but don't assume detective and proactive controls do: check each child OU's enabled controls in the console and enable what it needs.</p>

<h3>Drift: what it is and how to fix it</h3>
<p><strong>Drift</strong> is a difference between what Control Tower configured and what actually exists, caused by changes made outside Control Tower (usually directly in Organizations). Control Tower detects drift automatically and reports it in the console, on the landing zone settings page, and through SNS notifications to the Audit account. A NONCOMPLIANT detective control is <em>not</em> drift: that is a compliance finding about your workloads, not damage to the landing zone.</p>
<table>
<thead><tr><th>Drift type</th><th>Typical cause</th><th>Repair</th></tr></thead>
<tbody>
<tr><td>Landing zone drift: shared account moved or Security OU deleted</td><td>Someone moves Log Archive out of the Security OU or deletes the foundational OU</td><td><strong>Reset (repair) the landing zone</strong> from Landing zone settings, or the <code>ResetLandingZone</code> API</td></tr>
<tr><td>Account moved between OUs / removed from the organisation</td><td>Account moved in the Organizations console instead of through Account Factory</td><td>Update the account in Account Factory (or re-register the OU) so the baseline matches its new OU; for removals, re-invite and enroll or accept the removal</td></tr>
<tr><td>Managed SCP modified, attached or detached</td><td>An administrator edits an <code>aws-guardrails-…</code> SCP in Organizations</td><td>Reset the landing zone or re-register the OU; for a single control, disable and re-enable it (or <code>ResetEnabledControl</code>)</td></tr>
<tr><td>OU-level drift, for example a baseline StackSet instance deleted</td><td>Someone deletes a stack instance or the Config recorder in an account</td><td>Re-register the OU or reset the enabled baseline</td></tr>
<tr><td>Trusted access disabled</td><td>Trusted access for a service (for example Config or Identity Center) turned off in Organizations</td><td>Reset the landing zone</td></tr>
</tbody></table>
<div class="callout warn"><strong>The golden rule:</strong> manage Control Tower resources through Control Tower. Don't edit or attach to its SCPs, don't move enrolled accounts in the Organizations console, don't touch the <code>aws-controltower-*</code> stacks, buckets, roles or Config recorders. Protect them with your own SCP that denies changes except by the Control Tower roles.</div>` },

    { type: "aws", title: "How it works on AWS: account vending and customisation options", html: `
<p>"Account vending" means creating a new account that is enrolled, baselined and customised. Control Tower offers four tools; they are complementary, not competing.</p>
<table>
<thead><tr><th></th><th>Account Factory</th><th>Account Factory Customization (AFC)</th><th>Account Factory for Terraform (AFT)</th><th>Customizations for Control Tower (CfCT)</th></tr></thead>
<tbody>
<tr><td>What it is</td><td>Built-in console/API/Service Catalog product that creates and enrolls accounts</td><td>Built-in: attach a <strong>blueprint</strong> when creating or updating an account</td><td>Open-source Terraform solution maintained by AWS; GitOps pipeline</td><td>AWS Solutions implementation; pipeline driven by a manifest file</td></tr>
<tr><td>Engine</td><td>AWS Service Catalog product in the management account</td><td>Blueprints = Service Catalog products (CloudFormation templates or Terraform) in a <strong>hub account</strong></td><td>CodePipeline/CodeBuild, Step Functions, Lambda, DynamoDB in a dedicated <strong>AFT management account</strong></td><td>CodePipeline, Step Functions, StackSets in the management account</td></tr>
<tr><td>Creates accounts?</td><td><strong>Yes</strong></td><td>Uses Account Factory</td><td>Yes (calls Account Factory)</td><td><strong>No</strong>; customises accounts</td></tr>
<tr><td>Customisation</td><td>Name, email, OU, initial Identity Center user, VPC settings</td><td>One blueprint per account, deployed to chosen Regions</td><td>Global + account-specific + provisioning customisations in Terraform</td><td>CloudFormation StackSets and SCPs to OUs/accounts, triggered by lifecycle events</td></tr>
<tr><td>Best for</td><td>Small numbers of accounts, console users</td><td>Console-driven teams that want a standard account "flavour" with no pipeline to run</td><td>Terraform shops; many accounts; change review in pull requests</td><td>CloudFormation shops that want to push org-wide stacks and SCPs</td></tr>
</tbody></table>

<h3>Account Factory</h3>
<p>The built-in Service Catalog product <em>AWS Control Tower Account Factory</em> takes: account email, account name, target (registered) OU, and the Identity Center user who gets access. You can also call it via the Service Catalog API (<code>provision-product</code>), which is what AFT and many custom scripts do. Account Factory's <strong>network configuration</strong> controls whether it creates a VPC in new accounts (CIDR range, number of private subnets, internet access, Regions). Many enterprises switch this off and connect accounts to a central network through RAM and Transit Gateway instead (M06.07, M10). Control Tower processes account operations with limited concurrency, so bulk vending of hundreds of accounts should be queued.</p>

<h3>Account Factory Customization (AFC)</h3>
<p>A <strong>blueprint</strong> is a CloudFormation template (or Terraform configuration) published as a Service Catalog product in a member <strong>hub account</strong> that holds a role named <code>AWSControlTowerBlueprintAccess</code>. When you create, update or enroll an account in the console, you pick the blueprint and the Regions; Control Tower deploys it into the new account. Use it for "every data-science account gets a SageMaker domain and a VPC endpoint set" with no pipeline to maintain. Partners also publish ready-made blueprints.</p>

<h3>Account Factory for Terraform (AFT)</h3>
` + DG_0604_AFT + `
<p>You deploy AFT once with the <code>aws-ia/control_tower_account_factory</code> Terraform module into a dedicated <strong>AFT management account</strong> (not the org management account). AFT uses four Git repositories (CodeCommit, GitHub, GitHub Enterprise, Bitbucket or GitLab): <code>aft-account-request</code> (one Terraform module call per account), <code>aft-global-customizations</code> (applied to every account), <code>aft-account-customizations</code> (folders selected by name per account) and <code>aft-account-provisioning-customizations</code> (Step Functions for integrations such as ITSM). It can use Terraform Community Edition, Terraform Cloud or Terraform Enterprise, and has feature flags such as deleting default VPCs and enabling CloudTrail data events. AFT is the most common choice when the platform team already writes Terraform (M39).</p>

<h3>Customizations for Control Tower (CfCT)</h3>
<p>CfCT is deployed from a CloudFormation template into the management account. You store a <code>manifest.yaml</code> plus CloudFormation templates and SCP JSON files in an S3 configuration bucket (or a Git source). Each manifest entry has a <code>deploy_method</code> of <code>stack_set</code> or <code>scp</code> and deployment targets (OUs or accounts). The pipeline runs when the configuration changes <strong>and</strong> when a Control Tower <strong>lifecycle event</strong> fires (for example <code>CreateManagedAccount</code>), so a new account automatically receives the org-wide stacks. It is the CloudFormation counterpart of AFT's global customizations (M36).</p>

<h3>Lifecycle events and APIs</h3>
<p>Control Tower emits lifecycle events through CloudTrail and Amazon EventBridge when long operations finish: <code>SetupLandingZone</code>, <code>UpdateLandingZone</code>, <code>CreateManagedAccount</code>, <code>UpdateManagedAccount</code>, <code>RegisterOrganizationalUnit</code>, <code>EnableGuardrail</code>, <code>DisableGuardrail</code> and others. Build automation on these events rather than polling. The <code>controltower</code> API lets you manage the landing zone (<code>CreateLandingZone</code>, <code>UpdateLandingZone</code>, <code>ResetLandingZone</code>), controls (<code>EnableControl</code>, <code>DisableControl</code>, <code>ListEnabledControls</code>) and baselines/OU registration (<code>EnableBaseline</code>, <code>ResetEnabledBaseline</code>), so the whole landing zone can be expressed as code in CloudFormation or Terraform.</p>` },

    { type: "examples", html: `
<h3>Example 1: create a landing zone with the API (manifest)</h3>
<p>A landing zone 3.x-style manifest. The Log Archive account is 444455556666 and the Audit account 777788889999; they already exist and are referenced by ID.</p>
<pre><code>{
  "governedRegions": ["eu-west-1", "eu-central-1"],
  "organizationStructure": {
    "security": { "name": "Security" },
    "sandbox":  { "name": "Sandbox" }
  },
  "centralizedLogging": {
    "accountId": "444455556666",
    "configurations": {
      "loggingBucket":       { "retentionDays": 365 },
      "accessLoggingBucket": { "retentionDays": 3650 },
      "kmsKeyArn": "arn:aws:kms:eu-west-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
    },
    "enabled": true
  },
  "securityRoles": { "accountId": "777788889999" },
  "accessManagement": { "enabled": true }
}</code></pre>
<pre><code>$ aws controltower create-landing-zone --landing-zone-version 3.3 --manifest file://manifest.json
{
    "arn": "arn:aws:controltower:eu-west-1:111122223333:landingzone/1A2B3C4D5E6F7G8H",
    "operationIdentifier": "55XXXXXX-e2XX-41XX-a7XX-446XXXXXXXXX"
}
$ aws controltower get-landing-zone-operation --operation-identifier 55XXXXXX-e2XX-41XX-a7XX-446XXXXXXXXX
{ "operationDetails": { "operationType": "CREATE", "status": "IN_PROGRESS", "startTime": "2026-10-07T09:12:44Z" } }</code></pre>
<p>Annotations: the call runs in the home Region (eu-west-1 here, so that becomes the home Region); <code>retentionDays</code> sets S3 lifecycle expiry for log objects; <code>accessManagement</code> lets Control Tower configure IAM Identity Center. Manifest fields evolve between landing zone versions, so always check the schema for the version you deploy.</p>

<h3>Example 2: enable a strongly recommended control on an OU</h3>
<pre><code>$ aws controltower enable-control --control-identifier arn:aws:controltower:eu-west-1::control/AWS-GR_RESTRICT_ROOT_USER_ACCESS_KEYS --target-identifier arn:aws:organizations::111122223333:ou/o-a1b2c3d4e5/ou-ab12-11111111
{
    "arn": "arn:aws:controltower:eu-west-1:111122223333:enabledcontrol/0ABCDEFGHIJKLMNO",
    "operationIdentifier": "8a1fXXXX-XXXX-XXXX-XXXX-XXXXXXXX3c2e"
}</code></pre>
<p>The target is an <strong>OU</strong>, not an account. Control Tower attaches (or updates) an <code>aws-guardrails-…</code> SCP on that OU. Running <code>aws controltower list-enabled-controls --target-identifier &lt;ou-arn&gt;</code> afterwards lists it with status <code>SUCCEEDED</code> and drift status <code>IN_SYNC</code>.</p>

<h3>Example 3: OU-level Region deny with parameters</h3>
<pre><code>$ aws controltower enable-control --control-identifier arn:aws:controltower:eu-west-1::control/CT.MULTISERVICE.PV.1 --target-identifier arn:aws:organizations::111122223333:ou/o-a1b2c3d4e5/ou-ab12-11111111 --parameters '[{"key":"AllowedRegions","value":["eu-west-1","eu-central-1"]},{"key":"ExemptedPrincipalArns","value":["arn:aws:iam::*:role/PlatformBreakGlass"]}]'</code></pre>
<p>Effect: principals in that OU's accounts get AccessDenied for regional API calls outside eu-west-1 and eu-central-1; global services (IAM, Organizations, CloudFront, Route 53 and the others in the control's exemption list) keep working; the break-glass role is exempt. This is the managed version of the hand-written SCP from M06.03.</p>

<h3>Example 4: an AFT account request</h3>
<pre><code>module "payments_prod" {
  source = "./modules/aft-account-request"

  control_tower_parameters = {
    AccountEmail              = "aws+payments-prod@example.com"
    AccountName               = "payments-prod"
    ManagedOrganizationalUnit = "Prod (ou-ab12-11111111)"
    SSOUserEmail              = "platform-team@example.com"
    SSOUserFirstName          = "Platform"
    SSOUserLastName           = "Team"
  }

  account_tags = {
    "cost-center" = "cc-4410"
    "data-class"  = "pci"
  }

  change_management_parameters = {
    change_requested_by = "Priya N."
    change_reason       = "New PCI workload account for payments service"
  }

  custom_fields = { "backup-tier" = "gold" }

  account_customizations_name = "payments"
}</code></pre>
<p>Merging this file triggers the pipeline in Figure M06-4c. <code>ManagedOrganizationalUnit</code> uses the "Name (ou-id)" form for nested OUs. <code>account_customizations_name</code> selects the <code>payments/</code> folder in the account-customizations repository.</p>

<h3>Example 5: a CfCT manifest</h3>
<pre><code>region: eu-west-1
version: 2021-03-15
resources:
  - name: deny-leave-org
    resource_file: policies/deny-leave-org.json
    deploy_method: scp
    deployment_targets:
      organizational_units:
        - Workloads
  - name: baseline-iam-roles
    resource_file: templates/baseline-iam-roles.yaml
    deploy_method: stack_set
    deployment_targets:
      organizational_units:
        - Workloads
        - Sandbox
    regions:
      - eu-west-1</code></pre>
<p>The SCP lands on the Workloads OU (as a separate policy, not inside Control Tower's managed SCPs), and the StackSet deploys the role template to every account in Workloads and Sandbox, including accounts created later, because CfCT re-runs on <code>CreateManagedAccount</code>.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Start-up growing from 1 to 15 accounts, small platform team, wants best practice quickly</td><td>Control Tower landing zone + Account Factory + strongly recommended controls</td><td>Managed baseline in an hour; no pipeline to operate</td></tr>
<tr><td>Bank with 400 accounts, all infrastructure in Terraform, change approval required</td><td>Control Tower + <strong>AFT</strong></td><td>Accounts requested by pull request; Terraform customisations; audit trail in Git</td></tr>
<tr><td>Every new account must get a standard set of IAM roles, a Config conformance pack and an SCP, written in CloudFormation</td><td><strong>CfCT</strong> (or AFT global customizations)</td><td>Lifecycle-event-triggered StackSets and SCPs reach new accounts automatically</td></tr>
<tr><td>Analytics team vends "data science" accounts from the console, each with the same VPC endpoints and SageMaker domain</td><td><strong>AFC blueprint</strong></td><td>Built-in, no pipeline; one blueprint per account flavour</td></tr>
<tr><td>Must stop anyone creating unencrypted S3 buckets through CloudFormation, and report any that exist</td><td>Proactive control (CloudFormation hook) + detective control (Config rule)</td><td>Proactive catches IaC before deployment; detective covers console-created and legacy buckets</td></tr>
<tr><td>Company adopting Control Tower on an existing organisation with 60 accounts</td><td>Set up the landing zone, then register OUs one at a time after creating <code>AWSControlTowerExecution</code> in invited accounts</td><td>Gradual adoption; failures are isolated to one OU</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: inspect a Control Tower environment", html: `
<p>Setting up a landing zone creates accounts and starts billing for Config and CloudTrail, so don't do it in a personal free-tier account just to try it (the M06 lab uses a controlled walkthrough). If your organisation already has Control Tower, these read-only commands are free and safe; run them in AWS CloudShell in the <strong>home Region</strong> of the management account (or with a read-only role there).</p>
<pre><code># 1. Is there a landing zone, and which version?
aws controltower list-landing-zones
aws controltower get-landing-zone --landing-zone-identifier &lt;arn-from-step-1&gt; --query "landingZone.{version:version,status:status,drift:driftStatus.status,regions:manifest.governedRegions}"

# 2. Which OUs exist, and which controls are enabled on one of them?
aws organizations list-organizational-units-for-parent --parent-id r-ab12 --query "OrganizationalUnits[].[Name,Id]" --output table
aws controltower list-enabled-controls --target-identifier arn:aws:organizations::111122223333:ou/o-a1b2c3d4e5/ou-ab12-11111111 --query "enabledControls[].{control:controlIdentifier,status:statusSummary.status,drift:driftStatusSummary.driftStatus}" --output table

# 3. Browse the Control Catalog (all behaviours)
aws controlcatalog list-controls --max-results 20 --query "Controls[].{name:Name,behavior:Behavior}" --output table

# 4. The SCPs Control Tower manages (names start with aws-guardrails-)
aws organizations list-policies --filter SERVICE_CONTROL_POLICY --query "Policies[?starts_with(Name,'aws-guardrails')].[Name,Id]" --output table

# 5. Recent lifecycle events (CloudTrail, home Region)
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreateManagedAccount --max-results 5 --query "Events[].[EventTime,EventName]" --output table</code></pre>
<p>What to look for: <code>driftStatus</code> should be <code>IN_SYNC</code>; every workload OU should have the strongly recommended controls; the <code>aws-guardrails-*</code> SCPs should be attached only to registered OUs. In the console, open <em>Controls</em>, filter by <em>Behavior = Detective</em> and look at the compliance status per OU.</p>` },

    { type: "casestudy", title: "Case study: Northwind Freight adopts Control Tower on a messy organisation", html: `
<p><strong>Situation.</strong> Northwind Freight, a logistics company, had 47 accounts in AWS Organizations, grown over five years. Some were created by Organizations, a dozen were invited, three teams ran their own CloudTrail trails, and AWS Config was enabled in about half the accounts in only one Region. A PCI audit found no central, tamper-resistant log store and no evidence that root user access keys were absent everywhere. Leadership wanted "AWS best practice governance" within a quarter, with a platform team of three.</p>
<p><strong>Requirements.</strong> Central immutable logs; Config everywhere in the two operating Regions (eu-west-1, eu-central-1); deny everything elsewhere; new accounts compliant on day one; Terraform as the standard IaC; no outage to production workloads.</p>
<p><strong>Design and execution.</strong></p>
<ol>
  <li>Set up Control Tower in eu-west-1 (home Region) on the existing organisation, governing both Regions, with Region deny enabled. The existing "logging" account was used as Log Archive; a new Audit account was created.</li>
  <li>Built new OUs (Infrastructure, Workloads/Prod, Workloads/SDLC, Policy Staging) and registered Policy Staging first, with two test accounts, to rehearse.</li>
  <li>A StackSet created <code>AWSControlTowerExecution</code> in the 12 invited accounts. A script removed team-owned Config recorders and delivery channels in governed Regions (their history was exported first).</li>
  <li>Moved accounts into the new OUs and registered one OU per week, SDLC before Prod. Two accounts failed: one had an SCP denying <code>config:*</code>, one had STS disabled in eu-central-1. Both were fixed and re-registered.</li>
  <li>Enabled all strongly recommended controls, plus proactive controls for S3 encryption and versioning on Prod. Deployed AFT for new accounts; the team's existing Terraform baseline became AFT global customizations.</li>
</ol>
<table>
<thead><tr><th>Metric</th><th>Before</th><th>After 10 weeks</th></tr></thead>
<tbody>
<tr><td>Accounts with Config in both Regions</td><td>~45% in one Region</td><td>100% of enrolled accounts</td></tr>
<tr><td>Time to vend a compliant account</td><td>3–5 days (ticket)</td><td>about 40 minutes (pull request)</td></tr>
<tr><td>Root access keys found</td><td>unknown</td><td>3 found by detective control, deleted</td></tr>
</tbody></table>
<p><strong>Incident.</strong> In week 8 an engineer "fixed" a deployment by detaching an <code>aws-guardrails</code> SCP in the Organizations console. Control Tower reported drift within the day through the Audit SNS topic; the team re-registered the OU, then added their own SCP that denies <code>organizations:DetachPolicy</code> and <code>organizations:UpdatePolicy</code> except for the Control Tower and platform roles.</p>
<p><strong>Lessons learned.</strong> Rehearse in a Policy Staging OU; clean up Config conflicts before registering; budget for Config costs (their bill rose noticeably in two chatty CI accounts until they excluded ephemeral resource types); and lock down Organizations so drift can't happen casually.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Set up a secure, well-architected multi-account environment quickly / with LEAST operational overhead"</td><td><strong>AWS Control Tower</strong> landing zone</td></tr>
<tr><td>"Centralise logs from all accounts in a dedicated account"</td><td>Control Tower <strong>Log Archive</strong> account (organization trail)</td></tr>
<tr><td>"Security team needs read access and notifications for all accounts"</td><td>Control Tower <strong>Audit</strong> account</td></tr>
<tr><td>"Prevent users from …" across accounts</td><td><strong>Preventive</strong> control (SCP) / SCP directly</td></tr>
<tr><td>"Detect / identify / report non-compliant resources"</td><td><strong>Detective</strong> control (AWS Config rule)</td></tr>
<tr><td>"Block non-compliant resources BEFORE they are provisioned by CloudFormation"</td><td><strong>Proactive</strong> control (CloudFormation hook)</td></tr>
<tr><td>"Automatically provision new accounts that meet company standards"</td><td><strong>Account Factory</strong> (Terraform → AFT)</td></tr>
<tr><td>"Bring existing accounts under governance"</td><td>Register the OU / enroll the account (needs <code>AWSControlTowerExecution</code>)</td></tr>
<tr><td>"Restrict usage to approved Regions" in a Control Tower environment</td><td>Region deny control</td></tr>
</tbody></table>
<table>
<thead><tr><th>Control Tower vs…</th><th>Difference</th></tr></thead>
<tbody>
<tr><td>AWS Organizations</td><td>Organizations is the account/OU/policy engine; Control Tower <em>orchestrates</em> Organizations, Config, CloudTrail, Identity Center and StackSets into a governed landing zone</td></tr>
<tr><td>AWS Config (alone)</td><td>Config records and evaluates; Control Tower deploys Config rules as detective controls across all accounts and aggregates them</td></tr>
<tr><td>Security Hub</td><td>Security Hub aggregates security findings and runs standards checks; Control Tower governs account setup and controls (they integrate: some detective controls are Security Hub controls)</td></tr>
<tr><td>Service Catalog</td><td>Service Catalog offers approved products; Account Factory is a Service Catalog product</td></tr>
<tr><td>Landing Zone Accelerator on AWS</td><td>An AWS solution that deploys a broader, highly configurable baseline (often for regulated industries) <em>on top of</em> Control Tower</td></tr>
</tbody></table>
<p><strong>Distractors:</strong> "Create IAM users in each account" for central administration; "Use AWS Config alone" when the stem asks to <em>prevent</em>; "Use an SCP" when the stem asks to <em>detect</em> or <em>report</em>; "Trusted Advisor" for governance of new accounts; "detective controls stop the resource from being created" (they don't); "mandatory controls can be disabled to save cost" (they can't); "SCPs from Control Tower also restrict the management account" (SCPs never do).</p>` },

    { type: "architect", title: "Architect's notes: operations, cost and when NOT to use Control Tower", html: `
<h3>Production gotchas</h3>
<ul>
  <li><strong>Home Region is forever.</strong> Pick it before setup; changing it means decommissioning and rebuilding the landing zone.</li>
  <li><strong>Ungoverned Regions are blind spots.</strong> No Config, no detective controls. Either govern a Region or deny it.</li>
  <li><strong>Manage through Control Tower only.</strong> Moving accounts, editing <code>aws-guardrails</code> SCPs or deleting baseline stacks outside Control Tower causes drift. Add your own SCP that protects Control Tower resources (roles <code>AWSControlTowerExecution</code>, <code>aws-controltower-*</code>, buckets, trails, Config recorders) from everyone except the Control Tower and platform roles.</li>
  <li><strong>SCP quota collisions.</strong> Five SCPs per OU includes Control Tower's. Consolidate your own deny statements into few SCPs.</li>
  <li><strong>Landing zone updates touch every account.</strong> Schedule them, read the release notes, test in a Policy Staging OU, then update OUs.</li>
  <li><strong>Account closure.</strong> Unmanage and close accounts through Control Tower or Account Factory (or move them to a Suspended OU first) so it doesn't report drift.</li>
</ul>
<h3>Troubleshooting playbook</h3>
<ol>
  <li><em>OU registration fails for one account:</em> check <code>AWSControlTowerExecution</code> exists and trusts the management account; check for an existing Config recorder/delivery channel; check SCPs on the OU; check STS Regions.</li>
  <li><em>Drift banner:</em> open Landing zone settings, read the drift type, use Reset / re-register / update account as in the drift table.</li>
  <li><em>Control stuck "Failed":</em> look at the StackSet operation in the management account for the failing account and Region; fix the cause (often a conflicting SCP or a stack instance someone deleted) and retry.</li>
  <li><em>Logs missing in Log Archive:</em> check the organization trail status and the KMS key policy if you used a customer managed key.</li>
</ol>
<h3>Cost traps</h3>
<ul>
  <li><strong>AWS Config</strong> charges per configuration item recorded and per rule evaluation. Accounts with high churn (CI runners, autoscaling, containers) generate many items. Use periodic recording or exclusions where your landing zone version supports it, and monitor Config spend per account.</li>
  <li>Log Archive S3 storage grows forever if you set very long retention; use lifecycle transitions to cheaper storage classes (M18).</li>
  <li>Duplicate trails: team-owned trails that copy the same management events are billed as additional copies. Remove them after enrollment.</li>
</ul>
<h3>When NOT to use Control Tower (or not yet)</h3>
<ul>
  <li><strong>A single account or a tiny, short-lived project.</strong> The overhead and Config cost outweigh the benefit; use Organizations plus a few SCPs, or nothing.</li>
  <li><strong>A mature, heavily customised landing zone already exists</strong> (Terraform-built org trail, Config, custom account vending) and the team doesn't want Control Tower to own those resources. Migration is possible but is a project; evaluate the value first.</li>
  <li><strong>You need full control of the baseline</strong> (for example a different log architecture or a different Config design) that Control Tower's managed resources would conflict with.</li>
  <li><strong>Required Regions aren't supported</strong> by Control Tower, or your organisation's management account is shared with another purpose that can't accept Control Tower's roles and stacks.</li>
  <li><strong>Very regulated environments needing a broader baseline</strong>: use Landing Zone Accelerator on AWS <em>with</em> Control Tower rather than Control Tower alone.</li>
</ul>
<p>Even in these cases, AWS keeps adding ways to use parts of Control Tower (for example, the Control Catalog and enabling controls programmatically), so re-evaluate periodically rather than deciding once.</p>` },

    { type: "summary", html: `
<ul>
  <li>Control Tower <strong>orchestrates</strong> Organizations, CloudTrail, Config, StackSets, Service Catalog and Identity Center into a governed <strong>landing zone</strong>; it has no charge of its own.</li>
  <li>Setup creates the <strong>Security OU</strong> with <strong>Log Archive</strong> (central logs) and <strong>Audit</strong> (aggregator, notifications, audit roles) accounts, an optional <strong>Sandbox OU</strong>, and mandatory controls. The <strong>home Region</strong> can't be changed; <strong>governed Regions</strong> get the baseline; Region deny blocks the rest.</li>
  <li>Controls have a <strong>behaviour</strong> (preventive = SCP/RCP/declarative, detective = Config rule, proactive = CloudFormation hook) and a <strong>guidance</strong> level (mandatory, strongly recommended, elective). Controls are enabled per OU.</li>
  <li>Prevent → preventive; detect/report → detective; block IaC before provisioning → proactive.</li>
  <li><strong>Account Factory</strong> (Service Catalog) creates and enrolls accounts; <strong>AFC</strong> adds a blueprint; <strong>AFT</strong> is the Terraform GitOps pipeline; <strong>CfCT</strong> pushes StackSets and SCPs on lifecycle events but doesn't create accounts.</li>
  <li>Enroll existing accounts by <strong>registering their OU</strong>; invited accounts need the <code>AWSControlTowerExecution</code> role, and conflicting Config resources must be handled first.</li>
  <li><strong>Drift</strong> comes from changes made outside Control Tower; repair by resetting the landing zone, re-registering the OU or updating the account. Non-compliance is not drift.</li>
  <li>Skip or postpone Control Tower for single-account setups or mature custom landing zones that would conflict; pair it with Landing Zone Accelerator for heavily regulated estates.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.04-d1", q: "Which AWS service evaluates Control Tower <em>detective</em> controls?", answers: ["AWS Config", "Config", "aws config rules", "config rules"], hint: "It records configuration items and evaluates rules.", explain: "Detective controls are AWS Config rules deployed by StackSets to every enrolled account in every governed Region." },
    { id: "M06.04-d2", q: "A control must stop a CloudFormation stack from creating an S3 bucket without versioning, before the bucket exists. Which control behaviour is it? (one word)", answers: ["proactive"], hint: "Not after the fact, and not at the raw API.", explain: "Proactive controls are CloudFormation hooks evaluated before provisioning; a FAIL rolls back the stack operation." },
    { id: "M06.04-d3", q: "Which IAM role must you create in an <em>invited</em> account before Control Tower can enroll it? (exact role name)", answers: ["AWSControlTowerExecution"], hint: "AWSControlTower…", explain: "AWSControlTowerExecution with AdministratorAccess, trusting the management account. Accounts created by Control Tower get it automatically." },
    { id: "M06.04-d4", q: "What is the default name of the foundational OU that contains the Log Archive and Audit accounts?", answers: ["Security", "security ou", "the security ou"], hint: "Early versions called it Core.", explain: "Control Tower names it Security by default (it was Core in early versions)." },
    { id: "M06.04-d5", q: "A platform team writes all infrastructure in Terraform and wants accounts requested by pull request. Which Control Tower tool fits? (abbreviation)", answers: ["AFT", "Account Factory for Terraform"], explain: "AFT runs a GitOps pipeline in a dedicated AFT management account and calls Account Factory." },
    { id: "M06.04-d6", q: "Can a <em>mandatory</em> Control Tower control be disabled? (yes/no)", answers: ["no", "n"], explain: "Mandatory controls are always on; they protect the landing zone's own resources." },
    { id: "M06.04-d7", q: "Which AWS service hosts the Account Factory product that creates new accounts? (service name)", answers: ["Service Catalog", "AWS Service Catalog", "servicecatalog"], explain: "Account Factory is a Service Catalog product in the management account; AFC blueprints are Service Catalog products too." },
    { id: "M06.04-d8", q: "Which shared account holds the AWS Config aggregator and receives the Control Tower SNS notifications? (one word)", answers: ["Audit", "audit account", "the audit account"], explain: "The Audit account (the Security Tooling account in SRA terms)." },
    { id: "M06.04-d9", q: "How much does AWS charge for Control Tower itself, in USD per month, excluding the services it uses?", answers: ["0", "$0", "0 usd", "zero", "nothing", "free"], explain: "Control Tower has no additional charge; you pay for Config, CloudTrail, S3, KMS and the other underlying services." },
    { id: "M06.04-d10", q: "In a Customizations for Control Tower (CfCT) manifest, <code>deploy_method: scp</code> creates SCPs. Which <code>deploy_method</code> value deploys CloudFormation templates to accounts?", answers: ["stack_set", "stackset", "stack set"], explain: "<code>stack_set</code> deploys CloudFormation templates as StackSets; <code>scp</code> creates and attaches SCPs." }
  ],
  check: [
    { id: "M06.04-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company is moving to AWS and wants a multi-account environment with centralised logging, a dedicated security account, guardrails and automated account provisioning. The cloud team is small and wants the LEAST operational overhead. What should a solutions architect recommend?",
      options: [
        { t: "Set up an AWS Control Tower landing zone and provision accounts with Account Factory", c: true, why: "Control Tower creates the Log Archive and Audit accounts, the organization trail, Config and controls, and vends compliant accounts, all as a managed service." },
        { t: "Create the organisation in AWS Organizations and write CloudFormation templates and SCPs for logging and guardrails", c: false, why: "Works, but the team must build and maintain everything itself: much more operational overhead." },
        { t: "Use one AWS account with separate VPCs and IAM groups per team", c: false, why: "Doesn't provide account isolation or organisation-level guardrails." },
        { t: "Enable AWS Trusted Advisor in every account", c: false, why: "Trusted Advisor gives recommendations; it doesn't build or govern a multi-account environment." }
      ] },
    { id: "M06.04-k2", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "Developers deploy everything with AWS CloudFormation. Security wants non-encrypted Amazon RDS instances to be rejected BEFORE they are created, and wants a report of any non-encrypted instances that were created by other means. Which combination of Control Tower controls meets this?",
      options: [
        { t: "A proactive control for RDS encryption plus a detective control for RDS encryption", c: true, why: "The proactive hook rejects non-compliant templates before provisioning; the detective Config rule reports instances created in other ways or before the control." },
        { t: "A detective control only", c: false, why: "Detective controls report after creation; they don't reject anything." },
        { t: "A mandatory control for RDS encryption", c: false, why: "Mandatory controls protect Control Tower's own resources; they are not workload rules like RDS encryption." },
        { t: "An elective Region deny control", c: false, why: "Region deny restricts Regions, not encryption settings." }
      ] },
    { id: "M06.04-k3", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "Which TWO accounts does AWS Control Tower place in the foundational (Security) OU when it sets up a landing zone?",
      options: [
        { t: "Log Archive account", c: true, why: "Holds the central buckets for CloudTrail and Config logs." },
        { t: "Audit account", c: true, why: "Holds the Config aggregator, SNS notifications and cross-account audit roles." },
        { t: "Network account", c: false, why: "Recommended by the SRA (Infrastructure OU), but Control Tower doesn't create it." },
        { t: "AFT management account", c: false, why: "You create it yourself if you deploy AFT; it is not part of the landing zone setup." },
        { t: "Management account", c: false, why: "The management account sits at the organisation root and can't be placed in an OU." }
      ] },
    { id: "M06.04-k4", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company with an existing organisation sets up Control Tower. Registering an OU fails for several accounts that were originally invited into the organisation; accounts that were created through Organizations in the same OU succeed. What is the MOST likely fix?",
      options: [
        { t: "Create the AWSControlTowerExecution role, trusting the management account, in each invited account and register the OU again", c: true, why: "Invited accounts don't have the role Control Tower needs to deploy its baseline." },
        { t: "Change the Control Tower home Region", c: false, why: "The home Region can't be changed and is unrelated to per-account prerequisites." },
        { t: "Remove all SCPs from the organisation root", c: false, why: "Too broad, and the successful accounts show SCPs on the path aren't the problem." },
        { t: "Close the invited accounts and recreate them", c: false, why: "Unnecessary and destructive; enrollment supports invited accounts once the role exists." }
      ] },
    { id: "M06.04-k5", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "During an incident, an administrator detached a Control Tower-managed SCP from a registered OU using the AWS Organizations console. What happens, and what should the team do?",
      options: [
        { t: "Control Tower reports drift; repair it through Control Tower (re-register the OU or reset the landing zone) and restrict who can change Organizations policies", c: true, why: "Changes made outside Control Tower are detected as drift and repaired from Control Tower; an SCP protecting Organizations actions prevents a repeat." },
        { t: "Nothing; Control Tower ignores changes made in Organizations", c: false, why: "Control Tower detects drift in the resources it manages, including its SCPs." },
        { t: "Control Tower immediately deletes the landing zone", c: false, why: "Drift is reported, not punished with deletion." },
        { t: "Re-attach the policy manually and disable drift detection", c: false, why: "Manual fixes leave Control Tower's record out of step; repairs should go through Control Tower, and hiding drift doesn't fix the cause." }
      ] },
    { id: "M06.04-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A platform team uses AWS CloudFormation and wants every new account vended by Control Tower to automatically receive a set of IAM roles (as StackSets) and two extra SCPs, managed from a single manifest file. Which solution fits BEST?",
      options: [
        { t: "Customizations for AWS Control Tower (CfCT)", c: true, why: "CfCT deploys StackSets and SCPs from a manifest and re-runs on the CreateManagedAccount lifecycle event." },
        { t: "Account Factory for Terraform (AFT)", c: false, why: "Possible, but the team uses CloudFormation and wants a manifest-driven StackSet/SCP tool; AFT is Terraform-centric." },
        { t: "AWS Trusted Advisor", c: false, why: "Not a deployment tool." },
        { t: "A detective control", c: false, why: "Detective controls report non-compliance; they don't deploy roles or SCPs." }
      ] }
  ],
  cards: ["fc-M06-4-01", "fc-M06-4-02", "fc-M06-4-03", "fc-M06-4-04", "fc-M06-4-05", "fc-M06-4-06", "fc-M06-4-07", "fc-M06-4-08", "fc-M06-4-09", "fc-M06-4-10", "fc-M06-4-11", "fc-M06-4-12"],
  references: [
    "<em>System Design on AWS</em> ch.8 (PDF p413–414): multi-account separation, AWS Landing Zone and AWS Control Tower",
    "AWS Control Tower User Guide: <em>What is AWS Control Tower?</em>, <em>Plan your landing zone</em>, <em>Getting started</em>",
    "AWS Control Tower User Guide: <em>About controls</em> (behaviour and guidance), <em>Proactive controls</em>, <em>Region deny control</em>",
    "AWS Control Tower User Guide: <em>Detect and resolve drift</em>, <em>Enroll an existing AWS account</em>, <em>Register an existing organizational unit</em>, <em>Lifecycle events</em>",
    "AWS Control Tower User Guide: <em>Provision accounts with AWS Control Tower Account Factory</em>, <em>Customize accounts with Account Factory Customization (AFC)</em>, <em>Provision accounts with AWS Control Tower Account Factory for Terraform (AFT)</em>",
    "AWS Solutions: <em>Customizations for AWS Control Tower</em> implementation guide",
    "AWS Control Catalog API Reference; AWS Control Tower API Reference (<code>CreateLandingZone</code>, <code>EnableControl</code>, <code>EnableBaseline</code>)",
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-4-01", front: "What does a Control Tower landing zone setup create?", back: "Security OU with Log Archive + Audit accounts, optional Sandbox OU, organization CloudTrail trail, Config in every enrolled account/governed Region with an aggregator in Audit, optional Identity Center setup, mandatory controls." },
  { id: "fc-M06-4-02", front: "Home Region vs governed Regions?", back: "Home Region: where Control Tower is set up; can't be changed. Governed Regions: where the baseline and detective controls are deployed. Use Region deny for the rest." },
  { id: "fc-M06-4-03", front: "Log Archive vs Audit account?", back: "Log Archive: central S3 buckets for CloudTrail and Config logs. Audit: Config aggregator, SNS compliance/drift notifications, cross-account audit roles (security tooling)." },
  { id: "fc-M06-4-04", front: "Three control behaviours and how each is implemented?", back: "Preventive = SCP/RCP/declarative policy (blocks at API). Detective = AWS Config rule (reports after). Proactive = CloudFormation hook (blocks IaC before provisioning)." },
  { id: "fc-M06-4-05", front: "Three control guidance levels?", back: "Mandatory (always on, can't disable, protects the landing zone) · Strongly recommended (best practice, opt-in) · Elective (specific needs, opt-in)." },
  { id: "fc-M06-4-06", front: "Account Factory vs AFC vs AFT vs CfCT?", back: "Account Factory: Service Catalog product that creates/enrolls accounts. AFC: blueprint applied at vending. AFT: Terraform GitOps pipeline. CfCT: manifest-driven StackSets + SCPs on lifecycle events (doesn't create accounts)." },
  { id: "fc-M06-4-07", front: "How do you bring existing accounts under Control Tower?", back: "Register their OU (or enroll the account). Invited accounts first need AWSControlTowerExecution (AdministratorAccess, trusts management account); handle existing Config recorders." },
  { id: "fc-M06-4-08", front: "What is Control Tower drift? Give examples.", back: "Changes made outside Control Tower to resources it manages: account moved/removed in Organizations, managed SCP edited/detached, Security OU deleted, baseline stack deleted. Repair: reset landing zone, re-register OU, update account." },
  { id: "fc-M06-4-09", front: "Is a NONCOMPLIANT detective control drift?", back: "No. It's a compliance finding about workloads. Drift is damage to Control Tower's own configuration." },
  { id: "fc-M06-4-10", front: "What does Control Tower cost?", back: "Nothing itself. You pay for underlying services: AWS Config (often the largest), CloudTrail extra copies, S3 log storage, KMS, etc." },
  { id: "fc-M06-4-11", front: "Which Control Tower lifecycle event fires when Account Factory finishes creating an account?", back: "CreateManagedAccount (via CloudTrail/EventBridge). CfCT and custom automation trigger on it." },
  { id: "fc-M06-4-12", front: "When would you NOT use Control Tower?", back: "Single account/tiny project; mature custom landing zone whose org trail/Config would conflict; need full control of the baseline; unsupported Regions. Heavily regulated → Landing Zone Accelerator on top of CT." }
);
// ================================================================== 05_identity_center.js
/* ---------------------------------------------------------------- M06.05 IAM Identity Center at scale */
var DG_0605_MODEL = `
<figure>
<svg class="diagram" viewBox="0 0 760 420" role="img" aria-labelledby="m0605at m0605ad">
  <title id="m0605at">IAM Identity Center object model at organisation scale</title>
  <desc id="m0605ad">An external identity provider such as Entra ID or Okta authenticates users with SAML 2.0 and provisions users and groups into IAM Identity Center with SCIM. Identity Center is an organization instance in one Region, administered from a delegated administrator account. It holds permission sets and account assignments. For every pair of permission set and account that has at least one assignment, Identity Center provisions one IAM role named AWSReservedSSO_PermissionSetName_suffix, trusted through a SAML provider it also creates in that account. Three groups assigned the Developer permission set in four accounts produce twelve assignments but only four roles.</desc>
  <defs><marker id="m0605a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-info" x="10" y="20" width="180" height="150" rx="10"/>
  <text class="dg-tb" x="22" y="44">External IdP</text>
  <text class="dg-ts" x="22" y="66">Entra ID, Okta, Ping,</text>
  <text class="dg-ts" x="22" y="82">Google Workspace</text>
  <text class="dg-ts" x="22" y="106">users, groups, MFA,</text>
  <text class="dg-ts" x="22" y="122">conditional access,</text>
  <text class="dg-ts" x="22" y="138">attributes (dept, cc)</text>

  <text class="dg-ts" x="198" y="62">SAML 2.0 · sign-in</text>
  <path class="dg-line" d="M190 72 H318" marker-end="url(#m0605a-ar)"/>
  <text class="dg-ts" x="198" y="112">SCIM · provisioning</text>
  <path class="dg-line" d="M190 122 H318" marker-end="url(#m0605a-ar)"/>

  <rect class="dg-edge" x="320" y="20" width="220" height="250" rx="10"/>
  <text class="dg-tb" x="334" y="44">IAM Identity Center</text>
  <text class="dg-ts" x="334" y="64">organization instance</text>
  <text class="dg-ts" x="334" y="80">one Region, e.g. eu-west-1</text>
  <text class="dg-ts" x="334" y="96">admin: Identity account</text>
  <rect class="dg-good" x="334" y="110" width="192" height="64" rx="8"/>
  <text class="dg-t" x="346" y="130">Permission set</text>
  <text class="dg-ts" x="346" y="148">Developer, PT4H</text>
  <text class="dg-ts" x="346" y="164">AWS + CMP + inline + PB</text>
  <rect class="dg-box" x="334" y="186" width="192" height="72" rx="8"/>
  <text class="dg-t" x="346" y="206">Account assignments</text>
  <text class="dg-ts" x="346" y="224">group + permission set</text>
  <text class="dg-ts" x="346" y="240">+ account = 1 assignment</text>

  <path class="dg-line" d="M540 52 L562 40" marker-end="url(#m0605a-ar)"/>
  <path class="dg-line" d="M540 110 H562" marker-end="url(#m0605a-ar)"/>
  <path class="dg-line" d="M540 170 H562" marker-end="url(#m0605a-ar)"/>
  <path class="dg-line" d="M540 230 L562 240" marker-end="url(#m0605a-ar)"/>

  <rect class="dg-box" x="564" y="16" width="186" height="52" rx="8"/>
  <text class="dg-t" x="576" y="36">payments-dev</text>
  <text class="dg-ts" x="571" y="56">AWSReservedSSO_Developer…</text>
  <rect class="dg-box" x="564" y="80" width="186" height="52" rx="8"/>
  <text class="dg-t" x="576" y="100">payments-test</text>
  <text class="dg-ts" x="571" y="120">AWSReservedSSO_Developer…</text>
  <rect class="dg-box" x="564" y="144" width="186" height="52" rx="8"/>
  <text class="dg-t" x="576" y="164">orders-dev</text>
  <text class="dg-ts" x="571" y="184">AWSReservedSSO_Developer…</text>
  <rect class="dg-box" x="564" y="208" width="186" height="52" rx="8"/>
  <text class="dg-t" x="576" y="228">orders-test</text>
  <text class="dg-ts" x="571" y="248">AWSReservedSSO_Developer…</text>

  <rect class="dg-good" x="10" y="200" width="180" height="70" rx="10"/>
  <text class="dg-tb" x="22" y="224">Groups</text>
  <text class="dg-ts" x="22" y="244">Payments-Devs,</text>
  <text class="dg-ts" x="22" y="260">Orders-Devs, Platform-Devs</text>
  <path class="dg-line" d="M190 236 H318" marker-end="url(#m0605a-ar)"/>
  <text class="dg-ts" x="198" y="228">all 3 → Developer</text>

  <rect class="dg-info" x="10" y="292" width="740" height="62" rx="8"/>
  <text class="dg-tb" x="22" y="314">Counting rule</text>
  <text class="dg-ts" x="22" y="334">3 groups × 4 accounts = 12 assignments, but roles = 1 per (permission set, account) = 4 roles.</text>
  <text class="dg-ts" x="22" y="348">Each account also gets one IAM SAML provider AWSSSO_…_DO_NOT_DELETE that the roles trust.</text>
  <text class="dg-ts" x="16" y="378">Roles live under the IAM path /aws-reserved/sso.amazonaws.com/ (often plus a Region). Do not edit them in IAM:</text>
  <text class="dg-ts" x="16" y="396">Identity Center owns them and re-applies the permission set whenever it is provisioned again.</text>
</svg>
<figcaption>Figure M06-5a. From IdP to roles. People and groups come in through SCIM, sign-in comes through SAML, and permission sets are stamped out as one AWSReservedSSO role per (permission set, account) pair, no matter how many groups share it.</figcaption>
</figure>`;

var DG_0605_SIGNIN = `
<figure>
<svg class="diagram" viewBox="0 0 760 450" role="img" aria-labelledby="m0605bt m0605bd">
  <title id="m0605bt">Sign-in flow through the AWS access portal</title>
  <desc id="m0605bd">Four lanes: the user's browser or CLI, the external identity provider, IAM Identity Center and the AWS access portal, and the member account with AWS sign-in and STS. The user opens the access portal, is redirected to the identity provider, authenticates with password and MFA, and the identity provider returns a SAML assertion to Identity Center through the browser. The portal lists the accounts and permission sets assigned to the user. When the user chooses one, Identity Center federates into the member account, where AssumeRoleWithSAML is recorded for the AWSReservedSSO role, and the browser receives a console session or the CLI receives temporary credentials.</desc>
  <defs><marker id="m0605b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="10" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="24" y="33">Browser or CLI</text><text class="dg-ts" x="24" y="51">workforce user</text>
  <rect class="dg-info" x="200" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="214" y="33">External IdP</text><text class="dg-ts" x="214" y="51">Entra ID, Okta</text>
  <rect class="dg-edge" x="390" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="404" y="33">Identity Center</text><text class="dg-ts" x="404" y="51">AWS access portal</text>
  <rect class="dg-good" x="580" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="594" y="33">Member account</text><text class="dg-ts" x="594" y="51">AWS sign-in + STS</text>
  <path class="dg-line" d="M95 60 V370" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M285 60 V370" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M475 60 V370" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M665 60 V370" stroke-dasharray="3 4"/>

  <path class="dg-line" d="M95 92 H473" marker-end="url(#m0605b-ar)"/><text class="dg-ts" x="105" y="85">1 · open access portal URL</text>
  <path class="dg-line" d="M475 122 H287" marker-end="url(#m0605b-ar)"/><text class="dg-ts" x="295" y="115">2 · SAML request</text>
  <rect class="dg-info" x="200" y="134" width="170" height="40" rx="6"/><text class="dg-ts" x="210" y="150">3 · password + MFA</text><text class="dg-ts" x="210" y="166">+ conditional access</text>
  <path class="dg-line" d="M285 196 H473" marker-end="url(#m0605b-ar)"/><text class="dg-ts" x="295" y="189">4 · SAML assertion</text>
  <rect class="dg-edge" x="390" y="208" width="170" height="40" rx="6"/><text class="dg-ts" x="400" y="224">5 · list your accounts</text><text class="dg-ts" x="400" y="240">and permission sets</text>
  <path class="dg-line" d="M95 272 H473" marker-end="url(#m0605b-ar)"/><text class="dg-ts" x="105" y="265">6 · pick account + role</text>
  <path class="dg-line" d="M475 302 H663" marker-end="url(#m0605b-ar)"/><text class="dg-ts" x="485" y="295">7 · AssumeRoleWithSAML</text>
  <path class="dg-line" d="M665 340 H97" marker-end="url(#m0605b-ar)"/><text class="dg-ts" x="490" y="333">8 · console or CLI keys</text>

  <text class="dg-ts" x="16" y="398">The portal session (default 8 h) decides how long you can keep opening accounts without signing in again;</text>
  <text class="dg-ts" x="16" y="414">the permission set's session duration (1–12 h, default 1 h) decides how long each console or CLI role session lasts.</text>
  <text class="dg-ts" x="16" y="436">CLI: aws sso login replaces step 1; the cached token is then exchanged via GetRoleCredentials for keys.</text>
</svg>
<figcaption>Figure M06-5b. One sign-in, two clocks. Authentication happens at the IdP; authorisation (which accounts, which permission sets) happens in Identity Center; the member account only ever sees a SAML federation into its AWSReservedSSO role.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.05", title: "IAM Identity Center at scale", level: 300, minutes: 55,
  objectives: [
    "Choose between an organization instance and an account instance, and pick and operate an identity source (Identity Center directory, external IdP with SAML + SCIM, or Active Directory)",
    "Design a small set of job-function permission sets for a multi-account organisation, using AWS managed, customer managed, inline and permissions-boundary policies and risk-based session durations",
    "Predict how many account assignments and AWSReservedSSO roles a set of group assignments creates, and automate them with sso-admin and CloudFormation",
    "Run Identity Center from a delegated administrator account and implement temporary elevated access and fast revocation",
    "Troubleshoot SCIM provisioning failures, missing customer managed policies, unexpected session lengths and MFA problems"
  ],
  sections: [
    { type: "why", html: `
<p>M05.07 showed how IAM Identity Center turns one corporate sign-in into roles in several accounts. That is the easy part. The hard part starts when the organisation grows: 120 accounts, 3,000 people, 40 teams, auditors who ask "who can change production?", and new accounts arriving every week from Account Factory (M06.04).</p>
<p>At that scale the problems are operational, and every one of them has bitten real companies:</p>
<ul>
  <li><strong>Permission set sprawl.</strong> Each team asks for "its own" permission set. A year later there are 90, nobody knows which ones are still used, and half of them include <code>AdministratorAccess</code>.</li>
  <li><strong>Silent provisioning failures.</strong> The SCIM token expires and new joiners quietly never appear in AWS. Or a permission set references a customer managed policy that doesn't exist in a new account, so the assignment fails while the request ticket says "done".</li>
  <li><strong>The management account trap.</strong> Engineers get admin access to the management account "temporarily". SCPs don't apply there (M06.03), so that access is truly unlimited.</li>
  <li><strong>Leaver and emergency gaps.</strong> Removing an assignment doesn't end a session that is already running, and when the IdP is down nobody can get in at all.</li>
</ul>
<p>The SAA-C03 exam (Task 1.1) tests the design decisions: "centrally manage access to multiple AWS accounts", "use existing corporate identities", "least privilege per job function", "delegate administration". A working architect must also <em>run</em> it: automation, counting, troubleshooting. This lesson covers both.</p>` },

    { type: "concept", title: "Instances, identity sources and the object model", html: DG_0605_MODEL + `
<h3>Organization instance vs account instance</h3>
<p>An <strong>instance</strong> is one deployment of Identity Center, with its own identity store (the users and groups) and its own settings. There are two kinds:</p>
<table>
<thead><tr><th></th><th>Organization instance</th><th>Account instance</th></tr></thead>
<tbody>
<tr><td>Enabled from</td><td>The management account of an AWS Organization (all features)</td><td>Any standalone account, or a member account if the organisation allows it</td></tr>
<tr><td>How many</td><td>One per organisation, in one Region</td><td>One per account</td></tr>
<tr><td>Access to AWS accounts (permission sets)</td><td><strong>Yes</strong>: the only way to get multi-account access</td><td><strong>No</strong>: no permission sets, no account assignments</td></tr>
<tr><td>Applications</td><td>AWS managed applications and customer SAML/OAuth applications across the organisation</td><td>Only supported AWS managed applications in that one account</td></tr>
<tr><td>Delegated administration</td><td>Yes, one member account</td><td>Not applicable</td></tr>
<tr><td>Typical use</td><td>Workforce access for the whole company</td><td>A team trying an AWS managed application in isolation, or a standalone account outside any organisation</td></tr>
</tbody></table>
<p>Account instances are useful but can fragment identity: each has its own users and its own IdP connection. Many organisations block them with an SCP that denies <code>sso:CreateInstance</code> in member accounts, and allow exceptions only through the Exceptions OU (M06.08).</p>

<h3>Region</h3>
<p>Identity Center is a <strong>Regional</strong> service. The identity store, the configuration and the SCIM endpoint live in the Region where you enabled the instance. The roles it creates are global IAM roles, so users can still work in every Region of every account. Choose the Region deliberately (data residency, closeness to your IdP, the Control Tower home Region): changing it later means deleting the instance and rebuilding the configuration. AWS has been adding multi-Region capabilities, so check the current documentation before you design a disaster-recovery plan around it, and always keep a break-glass path that doesn't depend on Identity Center at all.</p>

<h3>Delegated administrator</h3>
<p>You enable the organization instance in the management account, then <strong>register one member account as delegated administrator</strong> (usually a dedicated Identity or Shared Services account in the Infrastructure OU). Administrators work there, so they don't need any access to the management account. The rules to remember:</p>
<ul>
  <li>Only one delegated administrator for Identity Center at a time.</li>
  <li>The delegated administrator <strong>cannot manage access to the management account</strong>: it can't create or change assignments there, and it can't edit permission sets that are provisioned in the management account.</li>
  <li>Therefore keep a <em>separate</em> small set of permission sets (for example <code>MgmtBillingAdmin</code>, <code>MgmtOrgAdmin</code>) that are used only in the management account and managed only from it. If you reuse <code>AdministratorAccess</code> in both places, the delegated administrator loses the ability to edit it.</li>
  <li>Enabling or deleting the instance is a management-account action.</li>
</ul>

<h3>Identity sources at scale</h3>
<p>An instance has <strong>exactly one</strong> identity source at a time. M05.07 introduced the three options; here is how they behave when you operate them.</p>
<table>
<thead><tr><th></th><th>Identity Center directory</th><th>External IdP (SAML 2.0 + SCIM)</th><th>Active Directory (Managed Microsoft AD or AD Connector)</th></tr></thead>
<tbody>
<tr><td>Who authenticates</td><td>Identity Center</td><td>The IdP</td><td>Identity Center checks the password against AD</td></tr>
<tr><td>How users and groups arrive</td><td>Created in Identity Center (console, API, IaC)</td><td>SCIM push from the IdP; can also be created by API, but then the IdP doesn't own them</td><td>AD sync: you choose which users and groups to synchronise</td></tr>
<tr><td>MFA</td><td>Identity Center MFA settings</td><td>Enforced by the IdP (Identity Center MFA settings don't apply)</td><td>Identity Center MFA, or RADIUS MFA configured on the directory</td></tr>
<tr><td>Main failure mode</td><td>Forgotten offboarding (no HR link)</td><td>SCIM token expiry, attribute errors, IdP outage</td><td>Network path to domain controllers (AD Connector), sync scope mistakes</td></tr>
<tr><td>Good fit</td><td>Start-ups, labs, small teams</td><td>Most enterprises (Entra ID, Okta, Ping, Google Workspace)</td><td>AD-centric estates without a cloud IdP</td></tr>
</tbody></table>
<div class="callout warn"><strong>Changing the identity source is disruptive.</strong> Depending on the from/to combination, Identity Center may delete users, groups and their assignments, or require that usernames match exactly. Plan a migration like a cut-over: export assignments, test with a pilot, and schedule it.</div>

<h3>The object model, and how to count it</h3>
<ul>
  <li><strong>Users and groups</strong> live in the <strong>identity store</strong> (ID <code>d-xxxxxxxxxx</code>) and are referenced by opaque IDs (UUIDs), not by name.</li>
  <li>A <strong>permission set</strong> (<code>ps-…</code>) is a template stored in the instance. It does nothing until it is assigned.</li>
  <li>An <strong>account assignment</strong> is the triple (principal, permission set, account). The principal is a group or user.</li>
  <li><strong>Provisioning</strong> turns a permission set into a real IAM role in an account. There is <strong>one role per (permission set, account) pair</strong> that has at least one assignment, regardless of how many groups or users are assigned. Each provisioned account also gets one IAM SAML provider (<code>AWSSSO_…_DO_NOT_DELETE</code>) that those roles trust.</li>
</ul>
<p>So in Figure M06-5a, three groups assigned <code>Developer</code> in four accounts means 3 × 4 = <strong>12 assignments</strong> but only <strong>4 roles</strong>. When the last assignment of a permission set in an account is deleted, Identity Center removes that role.</p>` },

    { type: "concept", title: "Designing permission sets for an organisation", html: `
<h3>Anatomy of a permission set</h3>
<table>
<thead><tr><th>Component</th><th>What it is</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><strong>AWS managed policies</strong></td><td>ARNs such as <code>arn:aws:iam::aws:policy/ReadOnlyAccess</code></td><td>Broad job functions (ReadOnlyAccess, ViewOnlyAccess, SecurityAudit, PowerUserAccess, AdministratorAccess, Billing)</td></tr>
<tr><td><strong>Customer managed policy references</strong></td><td>A policy <em>name</em> and <em>path</em>; the policy must already exist with that name in every account where the permission set is provisioned</td><td>Account-specific content: the same name <code>AppData</code> can point at a different bucket in each account</td></tr>
<tr><td><strong>Inline policy</strong></td><td>One JSON policy stored in the permission set and copied into each role</td><td>Small, organisation-wide additions or explicit denies (for example deny <code>iam:CreateUser</code>)</td></tr>
<tr><td><strong>Permissions boundary</strong></td><td>An AWS managed policy or a customer managed policy reference set as the role's boundary</td><td>Capping a powerful set, especially when developers may create roles (M05.03)</td></tr>
<tr><td><strong>Session duration</strong></td><td>1 to 12 hours, default 1 hour (ISO 8601, for example <code>PT4H</code>)</td><td>Shorter for powerful sets, longer for read-only</td></tr>
<tr><td><strong>Relay state</strong></td><td>The console URL users land on</td><td>Sending billing users straight to Billing, for example</td></tr>
</tbody></table>
<p>The provisioned role is a normal IAM role, so the usual quotas apply in each target account: the number of managed policies attached to one role (10 by default, raisable to 20) and the inline policy size. Permission set names are limited to 32 characters and become part of the role name, so choose short, stable names.</p>
<p>Remember that the role's permissions are still filtered by SCPs, RCPs and any resource policies (M05.04). A permission set with <code>AdministratorAccess</code> in an account under a Region-deny SCP can't launch anything outside the approved Regions.</p>

<h3>A design matrix for a realistic organisation</h3>
<p>Fictional <strong>Kestrel Health</strong> has 85 accounts: management, the Security OU (Log Archive, Security Tooling), the Infrastructure OU (Network, Shared Services, Identity), and Workloads with Prod and SDLC sub-OUs for nine product teams, plus Sandbox. The architecture team designed nine permission sets and assigned them to OUs' accounts through group naming conventions:</p>
<table>
<thead><tr><th>Permission set</th><th>Policies</th><th>Session</th><th>Assigned to (group → accounts)</th></tr></thead>
<tbody>
<tr><td><code>ReadOnly</code></td><td>AWS <code>ReadOnlyAccess</code> + inline deny on <code>s3:GetObject</code> and <code>secretsmanager:GetSecretValue</code> for data accounts</td><td>8 h</td><td>All-Engineers → every Workloads account</td></tr>
<tr><td><code>Developer</code></td><td>AWS <code>PowerUserAccess</code> + CMP <code>DevIamSelfService</code> + boundary CMP <code>DevBoundary</code></td><td>4 h</td><td><code>&lt;team&gt;-Devs</code> → that team's SDLC accounts</td></tr>
<tr><td><code>ProdOperator</code></td><td>AWS <code>ReadOnlyAccess</code> + CMP <code>ProdRunbookActions</code> (restart, scale, SSM run approved documents)</td><td>2 h</td><td><code>&lt;team&gt;-OnCall</code> → that team's prod accounts</td></tr>
<tr><td><code>ProdAdmin</code></td><td>AWS <code>AdministratorAccess</code></td><td>1 h</td><td>No standing assignment; granted temporarily through an approval workflow</td></tr>
<tr><td><code>PlatformAdmin</code></td><td>AWS <code>AdministratorAccess</code> + inline deny on changing Control Tower and security tooling resources</td><td>2 h</td><td>Platform-Team → Infrastructure and SDLC accounts</td></tr>
<tr><td><code>NetworkAdmin</code></td><td>AWS <code>NetworkAdministrator</code> job function policy + CMP <code>TgwAndRam</code></td><td>2 h</td><td>Network-Team → Network account</td></tr>
<tr><td><code>SecurityAuditor</code></td><td>AWS <code>SecurityAudit</code> + <code>ViewOnlyAccess</code></td><td>8 h</td><td>Security-Team → every account except management</td></tr>
<tr><td><code>IncidentResponder</code></td><td>AWS <code>AdministratorAccess</code> with an inline deny on deleting logs and trails</td><td>1 h</td><td>Security-IR → all accounts, on-demand only</td></tr>
<tr><td><code>BillingViewer</code></td><td>AWS <code>AWSBillingReadOnlyAccess</code></td><td>8 h</td><td>Finance → management account (managed from the management account)</td></tr>
</tbody></table>
<p>Design principles behind the matrix:</p>
<ul>
  <li><strong>Job functions, not teams.</strong> Teams are expressed by <em>which accounts</em> a group is assigned to, not by separate permission sets. Nine sets serve 40 teams.</li>
  <li><strong>Account-specific detail goes into customer managed policies.</strong> <code>ProdRunbookActions</code> exists in every prod account with that account's resource ARNs, deployed by StackSets. The permission set only references the name.</li>
  <li><strong>Risk sets the clock.</strong> Read-only sessions can last a working day; admin sessions are short so that revocation and leaver latency stay small.</li>
  <li><strong>No standing production admin.</strong> Powerful sets exist but are assigned only for the duration of an approved change or incident.</li>
  <li><strong>Attributes instead of more sets.</strong> When access must vary by project or cost centre <em>inside</em> an account, use attributes for access control (below) rather than cloning permission sets.</li>
</ul>

<h3>Attributes for access control at scale</h3>
<p>M05.08 explained ABAC with session tags. In Identity Center you enable <strong>attributes for access control</strong> once per instance and map user attributes to tag keys. With an external IdP you can either send SAML attributes named <code>https://aws.amazon.com/SAML/Attributes/AccessControl:CostCenter</code>, or map attributes that SCIM has already synchronised, such as <code>\${path:enterprise.costCenter}</code> or <code>\${path:enterprise.department}</code>. Every role session then carries those values as principal tags, and one permission set with an <code>aws:PrincipalTag/CostCenter</code> condition serves every cost centre. The attributes are evaluated at sign-in, so a user who moves department gets new access at their next session without any AWS change.</p>

<h3>Temporary elevated access</h3>
<p>Identity Center gives you the building blocks for just-in-time access, but the workflow is yours to build or adopt:</p>
<ol>
  <li>A user requests "ProdAdmin on orders-prod for 2 hours, ticket CHG-4411".</li>
  <li>An approver (not the requester) approves in a workflow tool.</li>
  <li>Automation calls <code>CreateAccountAssignment</code> for that user, and schedules <code>DeleteAccountAssignment</code> at the end of the window.</li>
  <li>The permission set's short session duration bounds how long a session can outlive the window.</li>
  <li>CloudTrail records every action of the session; the request ID links it to the approval.</li>
</ol>
<p>AWS publishes an open-source reference solution for this, <strong>Temporary Elevated Access Management (TEAM)</strong>, and several partners offer similar products. A simpler alternative is group-based: the workflow adds the user to an IdP group that is assigned <code>ProdAdmin</code>, and removes them afterwards; the delay is then the SCIM sync interval.</p>` },

    { type: "workflow", title: "Sign-in, provisioning and the joiner-mover-leaver loop", html: DG_0605_SIGNIN + `
<h3>What happens when a user signs in</h3>
<ol class="flow">
  <li><strong>Portal.</strong> The user opens the AWS access portal URL (for example <code>https://d-1234567890.awsapps.com/start</code>, or a custom subdomain such as <code>https://kestrel.awsapps.com/start</code>).</li>
  <li><strong>Authentication.</strong> With an external IdP, Identity Center sends a SAML request through the browser; the IdP checks password, MFA and conditional access and returns a signed assertion. The assertion's NameID must match the user's <em>username</em> in Identity Center, which SCIM created earlier.</li>
  <li><strong>Authorisation.</strong> Identity Center looks up the user's group memberships and every assignment for the user and their groups, and the portal shows a tile per account with the available permission sets.</li>
  <li><strong>Federation into the account.</strong> When the user picks <em>payments-dev → Developer</em>, Identity Center federates into that account's <code>AWSReservedSSO_Developer…</code> role. The member account's CloudTrail records <code>AssumeRoleWithSAML</code>, and the session name is the user's username, so actions trace back to a person.</li>
  <li><strong>CLI.</strong> <code>aws sso login</code> opens a browser to approve the request (or prints a device code), caches an access token under <code>~/.aws/sso/cache/</code>, and the CLI calls <code>GetRoleCredentials</code> for the profile's account and permission set whenever it needs fresh keys.</li>
</ol>

<h3>What happens when you change a permission set</h3>
<ol class="flow">
  <li><strong>Edit</strong> the permission set (policies, boundary, session duration). The change is stored in Identity Center only.</li>
  <li><strong>Provision</strong> it: in the console you are prompted to update the accounts; via the API you call <code>ProvisionPermissionSet</code> with <code>ALL_PROVISIONED_ACCOUNTS</code>. Identity Center then updates the role in every account where the set is provisioned.</li>
  <li><strong>Check the status.</strong> Provisioning is asynchronous; a failure in one account (for example a missing customer managed policy) doesn't roll back the others. Poll <code>DescribePermissionSetProvisioningStatus</code>.</li>
  <li><strong>Active sessions</strong> keep the permissions they started with until they expire; new sessions get the new permissions.</li>
</ol>

<h3>Joiner, mover, leaver with SCIM</h3>
<ol class="flow">
  <li><strong>Joiner:</strong> HR creates the person; the IdP adds them to <code>Orders-Devs</code>; SCIM creates the user and membership in Identity Center; the user sees the orders SDLC accounts. No AWS change.</li>
  <li><strong>Mover:</strong> the IdP moves them from <code>Orders-Devs</code> to <code>Payments-Devs</code>; SCIM updates membership; the next sign-in shows the new accounts. Attribute changes (cost centre) apply at the next session.</li>
  <li><strong>Leaver:</strong> the IdP disables the user; SCIM marks the user inactive in Identity Center, and the IdP itself refuses new sign-ins. Existing role sessions continue until they expire, so the worst-case leaver latency is the SCIM sync interval plus the longest session duration the user could hold.</li>
  <li><strong>Immediate cut-off</strong> (a compromised laptop, a hostile leaver): disable the user in the IdP and in Identity Center, then deny the user's active sessions, for example with a deny statement keyed on <code>aws:userid</code> or <code>aws:TokenIssueTime</code> added to the permission set's inline policy or to an SCP.</li>
</ol>` },

    { type: "aws", title: "Identity Center facts, limits and service boundaries", html: `
<table>
<thead><tr><th>Topic</th><th>Fact to remember</th></tr></thead>
<tbody>
<tr><td>Cost</td><td>No additional charge for Identity Center itself</td></tr>
<tr><td>Instances</td><td>One organization instance per organisation; account instances are for AWS managed applications only</td></tr>
<tr><td>Identity source</td><td>Exactly one: Identity Center directory, external IdP (SAML 2.0 + optional SCIM), or Active Directory (AWS Managed Microsoft AD, or self-managed AD through AD Connector). Simple AD is not supported</td></tr>
<tr><td>Permission set session duration</td><td>1–12 hours, default 1 hour</td></tr>
<tr><td>Access portal session</td><td>Default 8 hours, configurable; separate from the permission set session</td></tr>
<tr><td>Provisioned role name</td><td><code>AWSReservedSSO_&lt;PermissionSetName&gt;_&lt;16 hex characters&gt;</code> under path <code>/aws-reserved/sso.amazonaws.com/</code></td></tr>
<tr><td>Trust</td><td>The roles trust the account's IAM SAML provider <code>AWSSSO_&lt;id&gt;_DO_NOT_DELETE</code>; deleting it breaks sign-in to that account</td></tr>
<tr><td>Customer managed policy references</td><td>Name + path; the policy must exist in each target account before provisioning</td></tr>
<tr><td>Delegated administrator</td><td>One member account; can't manage assignments or permission sets in the management account</td></tr>
<tr><td>SCIM</td><td>Bearer-token authenticated endpoint per instance; tokens expire after one year and must be rotated (two can exist at a time for overlap)</td></tr>
<tr><td>APIs</td><td><code>sso-admin</code> (instance, permission sets, assignments), <code>identitystore</code> (users, groups, memberships), <code>sso</code> and <code>sso-oidc</code> (portal and CLI sign-in)</td></tr>
<tr><td>IaC</td><td>CloudFormation <code>AWS::SSO::PermissionSet</code>, <code>AWS::SSO::Assignment</code>, <code>AWS::SSO::InstanceAccessControlAttributeConfiguration</code>; Terraform <code>aws_ssoadmin_*</code> resources</td></tr>
<tr><td>Logging</td><td>Sign-in and admin events in CloudTrail of the Identity Center account (event sources such as <code>sso.amazonaws.com</code>, <code>signin.amazonaws.com</code>, <code>identitystore.amazonaws.com</code>); role use as <code>AssumeRoleWithSAML</code> in each member account</td></tr>
</tbody></table>

<h3>Where Identity Center sits among the other M06 services</h3>
<ul>
  <li><strong>Organizations (M06.02)</strong> supplies the account list and the delegated administrator registration.</li>
  <li><strong>SCPs (M06.03)</strong> still cap every AWSReservedSSO role. A common pattern is an SCP that denies IAM changes to <code>arn:aws:iam::*:role/aws-reserved/sso.amazonaws.com/*</code> and to the <code>AWSSSO_*</code> SAML provider for everyone except Identity Center itself, so account admins can't tamper with central access.</li>
  <li><strong>Control Tower (M06.04)</strong> can set up Identity Center with default groups and permission sets, and Account Factory can assign an initial owner. Many teams later switch to managing access themselves in IaC.</li>
  <li><strong>Directory Service (M06.06)</strong> provides the AD identity source.</li>
</ul>
<div class="callout tip"><strong>IAM SAML federation per account</strong> (M05.07) still exists for single accounts and special applications. With Organizations, the exam answer for "central workforce access to many accounts" is IAM Identity Center.</div>` },

    { type: "examples", html: `
<h3>Example 1: permission set and assignments in CloudFormation</h3>
<p>Deployed in the delegated administrator account. The <code>DevBoundary</code> and <code>DevIamSelfService</code> policies must already exist in the target accounts (Example 3).</p>
<pre><code>AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  InstanceArn:
    Type: String
    Default: arn:aws:sso:::instance/ssoins-72231a1b2c3d4e5f
  PaymentsDevsGroupId:
    Type: String          # identity store group ID (a UUID), not the display name
Resources:
  DeveloperPS:
    Type: AWS::SSO::PermissionSet
    Properties:
      InstanceArn: !Ref InstanceArn
      Name: Developer
      Description: Build and run workloads in SDLC accounts
      SessionDuration: PT4H
      ManagedPolicies:
        - arn:aws:iam::aws:policy/PowerUserAccess
      CustomerManagedPolicyReferences:
        - Name: DevIamSelfService
          Path: /
      PermissionsBoundary:
        CustomerManagedPolicyReference:
          Name: DevBoundary
          Path: /
      InlinePolicy:
        Version: "2012-10-17"
        Statement:
          - Sid: NoIamUsers
            Effect: Deny
            Action: ["iam:CreateUser", "iam:CreateAccessKey", "iam:CreateLoginProfile"]
            Resource: "*"
  PaymentsDevsInDev:
    Type: AWS::SSO::Assignment
    Properties:
      InstanceArn: !Ref InstanceArn
      PermissionSetArn: !GetAtt DeveloperPS.PermissionSetArn
      PrincipalType: GROUP
      PrincipalId: !Ref PaymentsDevsGroupId
      TargetType: AWS_ACCOUNT
      TargetId: "444455556666"
  PaymentsDevsInTest:
    Type: AWS::SSO::Assignment
    Properties:
      InstanceArn: !Ref InstanceArn
      PermissionSetArn: !GetAtt DeveloperPS.PermissionSetArn
      PrincipalType: GROUP
      PrincipalId: !Ref PaymentsDevsGroupId
      TargetType: AWS_ACCOUNT
      TargetId: "777788889999"</code></pre>
<p>Notes: <code>TargetId</code> is a quoted string, because an unquoted account ID that starts with 0 would lose its leading zero. Each assignment is one account; for "every account in an OU" you generate the list (from <code>organizations list-accounts-for-parent</code>) in your pipeline, or use a framework that does it for you. Test that updates to the permission set reach all accounts after deployment (see Example 2's status check).</p>

<h3>Example 2: the same with the CLI, including provisioning and status</h3>
<pre><code>INSTANCE=arn:aws:sso:::instance/ssoins-72231a1b2c3d4e5f
STORE=d-1234567890

PS=$(aws sso-admin create-permission-set --instance-arn "$INSTANCE" \\
      --name Developer --session-duration PT4H \\
      --query PermissionSet.PermissionSetArn --output text)

aws sso-admin attach-managed-policy-to-permission-set --instance-arn "$INSTANCE" \\
  --permission-set-arn "$PS" --managed-policy-arn arn:aws:iam::aws:policy/PowerUserAccess
aws sso-admin attach-customer-managed-policy-reference-to-permission-set --instance-arn "$INSTANCE" \\
  --permission-set-arn "$PS" --customer-managed-policy-reference Name=DevIamSelfService,Path=/
aws sso-admin put-permissions-boundary-to-permission-set --instance-arn "$INSTANCE" \\
  --permission-set-arn "$PS" \\
  --permissions-boundary '{"CustomerManagedPolicyReference":{"Name":"DevBoundary","Path":"/"}}'

GROUP=$(aws identitystore get-group-id --identity-store-id "$STORE" \\
  --alternate-identifier '{"UniqueAttribute":{"AttributePath":"displayName","AttributeValue":"Payments-Devs"}}' \\
  --query GroupId --output text)

aws sso-admin create-account-assignment --instance-arn "$INSTANCE" \\
  --permission-set-arn "$PS" --principal-type GROUP --principal-id "$GROUP" \\
  --target-type AWS_ACCOUNT --target-id 444455556666
# {"AccountAssignmentCreationStatus": {"Status": "IN_PROGRESS", "RequestId": "6f1c…", ...}}

aws sso-admin describe-account-assignment-creation-status --instance-arn "$INSTANCE" \\
  --account-assignment-creation-request-id 6f1c…
# "Status": "SUCCEEDED"   (or "FAILED" with a FailureReason)

# Later, after editing the permission set: push the change to every account that has it
aws sso-admin provision-permission-set --instance-arn "$INSTANCE" \\
  --permission-set-arn "$PS" --target-type ALL_PROVISIONED_ACCOUNTS</code></pre>
<p>The pattern to internalise: <strong>every write is asynchronous</strong>, returns a request ID, and must be checked. Pipelines that "fire and forget" assignments are how organisations end up with access that silently never arrived.</p>

<h3>Example 3: pre-creating customer managed policies with StackSets</h3>
<p>A service-managed StackSet targeted at the Workloads OU, with automatic deployment on, creates the referenced policies in every existing account and in every new account that joins the OU:</p>
<pre><code>Resources:
  DevBoundary:
    Type: AWS::IAM::ManagedPolicy
    Properties:
      ManagedPolicyName: DevBoundary
      Path: /
      PolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Sid: AllowMostServices
            Effect: Allow
            NotAction: ["organizations:*", "account:*"]
            Resource: "*"
          - Sid: ProtectCentralAccess
            Effect: Deny
            Action: "iam:*"
            Resource:
              - arn:aws:iam::*:role/aws-reserved/*
              - arn:aws:iam::*:saml-provider/AWSSSO_*</code></pre>
<p>Order matters: the StackSet must have succeeded in an account before the permission set is provisioned there. In Control Tower landing zones, put the StackSet into the account baseline (CfCT or AFT, M06.04) so that a brand-new account has the policies before the first assignment.</p>

<h3>Example 4: CLI profiles for many accounts</h3>
<pre><code># ~/.aws/config
[sso-session kestrel]
sso_start_url = https://kestrel.awsapps.com/start
sso_region = eu-west-1
sso_registration_scopes = sso:account:access

[profile payments-dev]
sso_session = kestrel
sso_account_id = 444455556666
sso_role_name = Developer          # the permission set name
region = eu-west-1

[profile payments-test]
sso_session = kestrel
sso_account_id = 777788889999
sso_role_name = Developer
region = eu-west-1</code></pre>
<p>One <code>aws sso login --sso-session kestrel</code> covers every profile that uses the session; the CLI refreshes role credentials automatically until the portal session ends.</p>

<h3>Example 5: counting assignments and roles</h3>
<p>Kestrel assigns <code>ReadOnly</code> to <em>All-Engineers</em> in all 72 Workloads accounts, <code>SecurityAuditor</code> to <em>Security-Team</em> in all 84 non-management accounts, and <code>Developer</code> to three team groups in 8, 10 and 6 SDLC accounts respectively (no overlaps).</p>
<ul>
  <li>Assignments: 72 + 84 + (8 + 10 + 6) = <strong>180</strong>.</li>
  <li>Roles: ReadOnly 72 + SecurityAuditor 84 + Developer 24 = <strong>180</strong> as well, because each (permission set, account) pair here has exactly one group.</li>
  <li>Now the platform group is <em>also</em> given <code>Developer</code> in the same 24 SDLC accounts: assignments rise to 204, but roles stay at 180, because the <code>AWSReservedSSO_Developer…</code> role already exists in those accounts.</li>
</ul>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>150 accounts, Okta as corporate IdP, access must follow HR changes automatically</td><td>Organization instance, Okta via SAML + SCIM, group-based assignments in IaC</td><td>SCIM makes joiners and leavers automatic; IaC makes access reviewable</td></tr>
<tr><td>Identity team must administer access without touching the management account</td><td>Register an Identity account as delegated administrator; separate permission sets for the management account</td><td>The delegated administrator can't manage the management account, so keep those sets apart</td></tr>
<tr><td>Same "read the app's data bucket" access in 30 accounts, different bucket in each</td><td>Customer managed policy reference (same name, per-account content via StackSets)</td><td>One permission set; account-specific ARNs live in the account</td></tr>
<tr><td>Production admin only during approved changes</td><td>Short-session <code>ProdAdmin</code> set + approval workflow that creates and deletes assignments (e.g. TEAM)</td><td>No standing privilege; auditable; time-bound</td></tr>
<tr><td>A data team wants to try an AWS managed application in its own account without central involvement</td><td>Account instance (if the organisation allows it)</td><td>Applications only; it can't grant access to AWS accounts</td></tr>
<tr><td>Access to datasets must depend on the user's cost centre in 20 shared accounts</td><td>Attributes for access control + ABAC policy in one permission set</td><td>One set instead of one per cost centre; changes follow the directory</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: map your own Identity Center", html: `
<p>Run these read-only commands in CloudShell in your lab organisation (Lab L01), with the <code>academy-admin</code> profile that has Identity Center admin rights in the management or delegated administrator account.</p>
<pre><code># 1. The instance and identity store
aws sso-admin list-instances --profile academy-admin
INSTANCE=$(aws sso-admin list-instances --query "Instances[0].InstanceArn" --output text --profile academy-admin)

# 2. Every permission set with its name and session duration
for ps in $(aws sso-admin list-permission-sets --instance-arn "$INSTANCE" --query PermissionSets --output text --profile academy-admin); do
  aws sso-admin describe-permission-set --instance-arn "$INSTANCE" --permission-set-arn "$ps" \\
    --query "PermissionSet.[Name,SessionDuration]" --output text --profile academy-admin
done

# 3. Where is one permission set provisioned? (pick an ARN from step 2)
aws sso-admin list-accounts-for-provisioned-permission-set --instance-arn "$INSTANCE" \\
  --permission-set-arn arn:aws:sso:::permissionSet/ssoins-72231a1b2c3d4e5f/ps-0123456789abcdef --profile academy-admin

# 4. The roles it created in the current account
aws iam list-roles --path-prefix /aws-reserved/sso.amazonaws.com/ \\
  --query "Roles[].[RoleName,MaxSessionDuration]" --output table --profile academy-admin

# 5. When does your CLI token expire?
grep -h expiresAt ~/.aws/sso/cache/*.json</code></pre>
<p>Things to notice:</p>
<ul>
  <li>The role's <code>MaxSessionDuration</code> in step 4 equals the permission set's session duration in seconds (PT4H = 14,400).</li>
  <li>The role name ends in a suffix generated by Identity Center, and it changes if the permission set is deleted and recreated. Never hard-code full role ARNs in resource policies; match on <code>aws:PrincipalArn</code> with a wildcard such as <code>arn:aws:iam::*:role/aws-reserved/sso.amazonaws.com/*/AWSReservedSSO_Developer_*</code>.</li>
  <li>Count your own assignments and roles, and check that the counting rule from the concept section holds.</li>
</ul>
<div class="callout tip"><strong>Optional write exercise</strong> (free, reversible): create a <code>LabReadOnly</code> permission set with <code>ViewOnlyAccess</code> and a session duration of PT2H, assign it to your own user in one member account, sign in through the portal, then delete the assignment and confirm the role disappears from that account.</div>` },

    { type: "casestudy", title: "Case study: Brightwater Retail grows from 12 to 140 accounts", html: `
<p><strong>Situation.</strong> Brightwater Retail, a fictional retailer, adopted Identity Center when it had 12 accounts. Two years later it has 140, created through Control Tower Account Factory. The identity team spends half its week on access tickets. Recent problems: 64 permission sets (17 of them unused for six months), new joiners who "can't see AWS" for days, a failed audit finding because 23 engineers held standing <code>AdministratorAccess</code> in production, and eight engineers with admin in the management account.</p>
<p><strong>Root causes found.</strong></p>
<table>
<thead><tr><th>Symptom</th><th>Cause</th></tr></thead>
<tbody>
<tr><td>Joiners missing for days</td><td>The SCIM access token had expired; Entra ID's provisioning log showed 401 errors nobody watched</td></tr>
<tr><td>Assignments "done" but users see nothing</td><td>New accounts lacked the customer managed policy <code>AppReadData</code>; assignment status was FAILED but the ticket script never checked</td></tr>
<tr><td>Permission set sprawl</td><td>One set per team request, copy-pasted with small edits</td></tr>
<tr><td>Admins in the management account</td><td>Identity Center administered from the management account, with <code>AdministratorAccess</code> shared across all accounts</td></tr>
</tbody></table>
<p><strong>Design changes.</strong></p>
<ol>
  <li>Registered a dedicated Identity account as delegated administrator. Created two management-only permission sets, assigned to four named people, administered from the management account only.</li>
  <li>Collapsed 64 permission sets into 10 job-function sets, based on 90 days of CloudTrail and IAM last-accessed data. Account-specific access moved to customer managed policies deployed by a StackSet in the AFT account baseline.</li>
  <li>Moved all permission sets and assignments into a Git repository deployed by a pipeline that waits for every provisioning and assignment request to reach <code>SUCCEEDED</code> and fails the build otherwise.</li>
  <li>Adopted a just-in-time workflow for <code>ProdAdmin</code> (1-hour session, maximum 4-hour window, peer approval).</li>
  <li>Added monitoring: a calendar reminder and an EventBridge rule on the provisioning errors, plus a weekly report comparing IdP group counts with Identity Center group counts.</li>
</ol>
<p><strong>Outcome.</strong> Access tickets fell by about 80% because most access now follows group membership. Joiners appear within one SCIM cycle. Standing production admin dropped from 23 people to zero, and the average elevated session lasted 47 minutes. The management account has four identities with access instead of eight engineers plus everyone with the shared admin set.</p>
<p><strong>Lessons learned.</strong> (1) Treat SCIM as production infrastructure with monitoring and a token rotation date. (2) Asynchronous APIs need status checks, not hope. (3) Keep management-account access separate from day one; untangling it later is painful. (4) A small number of job-function sets plus account placement scales far better than per-team sets.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>If the question says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"Centrally manage workforce access to multiple AWS accounts in AWS Organizations"</td><td>IAM Identity Center organization instance with permission sets</td></tr>
<tr><td>"Users and groups should be created and removed automatically from the corporate IdP"</td><td>External IdP with SCIM automatic provisioning</td></tr>
<tr><td>"Use the existing on-premises Active Directory without replicating it"</td><td>Identity Center with AD Connector as the identity source</td></tr>
<tr><td>"Administer Identity Center without using the management account"</td><td>Register a delegated administrator member account</td></tr>
<tr><td>"Same permission set, but each account needs its own resource ARNs"</td><td>Customer managed policy reference (policy created in each account)</td></tr>
<tr><td>"Engineers are signed out of the console after one hour"</td><td>Increase the permission set session duration (max 12 h)</td></tr>
<tr><td>"Grant access based on the user's department from the IdP"</td><td>Attributes for access control (session tags) + ABAC conditions</td></tr>
<tr><td>"Time-bound, approved production access"</td><td>Temporary assignment workflow with a short-session permission set</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>"Edit the AWSReservedSSO role in IAM"</strong>: the role is managed by Identity Center; change the permission set and reprovision.</li>
  <li><strong>"Create a permission set per team"</strong>: valid but doesn't scale; the better answer uses groups and account placement.</li>
  <li><strong>"Use an account instance to give access to member accounts"</strong>: account instances can't do account access.</li>
  <li><strong>"Use Simple AD as the identity source"</strong>: not supported.</li>
  <li><strong>"Create IAM users in each account and sync passwords"</strong>: never the right answer for workforce access at scale.</li>
  <li><strong>"Removing the assignment immediately ends the user's console session"</strong>: false; sessions run until they expire unless you revoke them.</li>
</ul>
<h3>Permission set vs IAM role</h3>
<table>
<thead><tr><th></th><th>Permission set</th><th>Provisioned IAM role</th></tr></thead>
<tbody>
<tr><td>Lives in</td><td>Identity Center instance (one copy)</td><td>Each assigned account (one copy per account)</td></tr>
<tr><td>Edited by</td><td>Identity Center administrators</td><td>Nobody directly; Identity Center overwrites it</td></tr>
<tr><td>Session duration</td><td>1–12 h setting</td><td>MaxSessionDuration copied from the set</td></tr>
<tr><td>Name</td><td><code>Developer</code></td><td><code>AWSReservedSSO_Developer_&lt;suffix&gt;</code></td></tr>
</tbody></table>` },

    { type: "architect", title: "Operating Identity Center: troubleshooting playbook and gotchas", html: `
<h3>Troubleshooting playbook</h3>
<table>
<thead><tr><th>Symptom</th><th>Likely cause</th><th>Check and fix</th></tr></thead>
<tbody>
<tr><td>New joiners don't exist in Identity Center; IdP provisioning log shows 401/403</td><td>SCIM access token expired or revoked</td><td>Generate a new token in Identity Center (Settings → Automatic provisioning), update it in the IdP, delete the old one. Put the expiry date in your calendar and monitoring.</td></tr>
<tr><td>Some users fail to provision, others succeed</td><td>Missing required attributes (first name, last name, display name), duplicate usernames or emails, or multi-valued attributes Identity Center doesn't support</td><td>Read the per-user error in the IdP's provisioning log; fix the source attributes or the attribute mapping.</td></tr>
<tr><td>A group exists but has no members in AWS</td><td>Nested groups (members of a child group are not provisioned), or the group was assigned for provisioning but its users weren't in scope</td><td>Use flat groups for AWS access; check the provisioning scope in the IdP.</td></tr>
<tr><td>IdP sign-in works, then "no access" or an error at Identity Center</td><td>The SAML NameID doesn't match the username created by SCIM, or the user isn't provisioned yet</td><td>Align NameID (usually the UPN or email) with the SCIM <code>userName</code>.</td></tr>
<tr><td>Assignment or provisioning status FAILED for one account</td><td>A customer managed policy or boundary policy referenced by the set is missing (wrong name or path) in that account, or a quota such as managed policies per role is exceeded</td><td>Create the policy in that account (StackSet), then reprovision. Make the pipeline fail on any FAILED status.</td></tr>
<tr><td>Permission set edits have no effect in an account</td><td>The set was not reprovisioned, or the user's session started before the change</td><td><code>provision-permission-set --target-type ALL_PROVISIONED_ACCOUNTS</code>; sign out and in again.</td></tr>
<tr><td>Users logged out of the console every hour</td><td>Permission set session duration left at the 1-hour default</td><td>Raise it per set (for example 4–8 h for read-only), keeping admin sets short.</td></tr>
<tr><td>CLI asks to log in again constantly, or "token has expired"</td><td>Portal session expired, or legacy profile configuration without <code>sso-session</code> (no token refresh)</td><td>Migrate profiles to an <code>sso-session</code> block; review the portal session length.</td></tr>
<tr><td>Calls fail with "1 hour maximum" when tools assume further roles</td><td>Role chaining from the SSO role caps the next session at 1 hour</td><td>Expected behaviour (M05.05); design tools to refresh credentials.</td></tr>
<tr><td>Users aren't prompted for MFA</td><td>External IdP is the source, so Identity Center MFA settings don't apply; or "Never" / context-aware prompting is set for the Identity Center directory</td><td>Enforce MFA at the IdP (conditional access); for the internal directory or AD, set prompting to every sign-in if policy requires it.</td></tr>
<tr><td>A user without a registered MFA device can't sign in</td><td>The "no registered device" behaviour is set to block sign-in</td><td>Choose "require registration at sign-in" or email one-time password for onboarding, then require MFA.</td></tr>
<tr><td>Delegated administrator can't edit a permission set</td><td>The set is provisioned in the management account</td><td>Use separate permission sets for the management account; manage those from the management account.</td></tr>
<tr><td>Sign-in to one account broken after a "cleanup"</td><td>Someone deleted the <code>AWSSSO_…_DO_NOT_DELETE</code> SAML provider or an AWSReservedSSO role</td><td>Reprovision the permission sets to that account; add an SCP that protects these resources.</td></tr>
</tbody></table>

<h3>Production gotchas</h3>
<ul>
  <li><strong>Break-glass.</strong> If the IdP or Identity Center Region is unavailable, nobody can sign in. Keep two emergency IAM users (or the root user with centralised root access management) in a dedicated account, hardware MFA, credentials sealed, and an alarm on every use. Test them twice a year.</li>
  <li><strong>Assignments to users, not groups,</strong> are invisible in the IdP and survive mover events. Allow them only for break-glass and temporary elevation, and report on them.</li>
  <li><strong>Resource policies and ARNs.</strong> Never put a full <code>AWSReservedSSO_…</code> role ARN in a bucket or key policy: the suffix changes if the set is deleted and recreated. Use <code>aws:PrincipalArn</code> with wildcards, or better, ABAC tags.</li>
  <li><strong>Reviews.</strong> Export assignments regularly (<code>list-account-assignments-for-principal</code>, <code>list-account-assignments</code>) and combine them with IdP group membership for quarterly access reviews. Use IAM Access Analyzer unused-access findings on the provisioned roles to shrink sets.</li>
  <li><strong>Quotas and throttling.</strong> Bulk changes (hundreds of assignments) can hit API rate limits; batch them and retry with backoff in your pipeline.</li>
  <li><strong>Cost.</strong> Identity Center is free, but the AD identity source isn't: AD Connector and Managed Microsoft AD are billed per hour, plus the VPN or Direct Connect path.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Use one <strong>organization instance</strong> for workforce access; account instances serve only AWS managed applications and can't grant account access.</li>
  <li>Administer from a <strong>delegated administrator</strong> account; it can't manage access to the management account, so keep separate permission sets there.</li>
  <li>An instance has exactly one identity source; with an external IdP, <strong>SAML</strong> signs users in and <strong>SCIM</strong> keeps users and groups in sync. Monitor the SCIM token's one-year expiry.</li>
  <li>Permission sets combine AWS managed policies, customer managed policy references, an inline policy and a permissions boundary, with a session duration of 1–12 h (default 1 h).</li>
  <li>Assignments = (group or user, permission set, account); roles = one <code>AWSReservedSSO_…</code> per (permission set, account) pair.</li>
  <li>Customer managed policies must exist in every target account before provisioning; deploy them with StackSets in the account baseline.</li>
  <li>Design a few job-function sets, assign groups to accounts, use ABAC attributes for finer scope, and grant production admin only temporarily.</li>
  <li>Every sso-admin write is asynchronous: check status, and reprovision after editing a set.</li>
  <li>Removing access doesn't end running sessions: keep powerful sessions short and know how to revoke.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.05-d1", q: "Groups Payments-Devs, Orders-Devs and Platform-Devs are each assigned the <code>Developer</code> permission set in the same 8 accounts. How many account assignments exist?", answers: ["24"], hint: "One assignment per (group, permission set, account).", explain: "3 groups × 8 accounts = 24 assignments.", placeholder: "number" },
    { id: "M06.05-d2", q: "Same scenario. How many <code>AWSReservedSSO_Developer_*</code> roles does Identity Center provision in total across the organisation?", answers: ["8", "eight"], hint: "Roles are per (permission set, account), not per group.", explain: "One role per account for the Developer set: 8 roles, shared by all three groups.", placeholder: "number" },
    { id: "M06.05-d3", q: "<code>ReadOnly</code> is assigned to group All-Engineers in 40 accounts, <code>PlatformAdmin</code> to group Platform in the same 40 accounts, and <code>Developer</code> to group Devs in 12 of them. How many provisioned roles exist in total?", answers: ["92"], hint: "Count (permission set, account) pairs.", explain: "40 + 40 + 12 = 92 roles (and 92 assignments, since each pair has one group).", placeholder: "number" },
    { id: "M06.05-d4", q: "What is the maximum session duration, in hours, that you can set on a permission set?", answers: ["12", "12h", "12 hours", "twelve"], explain: "1 to 12 hours; the default is 1 hour.", placeholder: "hours" },
    { id: "M06.05-d5", q: "A permission set references the customer managed policy <code>DevBoundary</code> (path /). Account 777788889999 doesn't have that policy. What is the status of the assignment request for that account? (one word)", answers: ["FAILED", "failed", "fail", "fails"], hint: "Identity Center doesn't create referenced policies for you.", explain: "Provisioning fails in that account; create the policy (for example with a StackSet) and reprovision.", placeholder: "status" },
    { id: "M06.05-d6", q: "Which <code>aws sso-admin</code> subcommand pushes an edited permission set to every account where it is already provisioned?", answers: ["provision-permission-set", "aws sso-admin provision-permission-set", "sso-admin provision-permission-set"], hint: "Use it with --target-type ALL_PROVISIONED_ACCOUNTS.", explain: "<code>provision-permission-set --target-type ALL_PROVISIONED_ACCOUNTS</code> updates every provisioned copy of the role.", placeholder: "subcommand" },
    { id: "M06.05-d7", q: "Which CloudFormation resource type defines an IAM Identity Center permission set?", answers: ["AWS::SSO::PermissionSet", "aws::sso::permissionset"], hint: "The service namespace is the old name of Identity Center.", explain: "<code>AWS::SSO::PermissionSet</code>; assignments use <code>AWS::SSO::Assignment</code>.", placeholder: "AWS::…" },
    { id: "M06.05-d8", q: "Access to which account can the Identity Center delegated administrator NOT manage? (two words)", answers: ["management account", "the management account", "management", "payer account"], hint: "The account that owns the organisation.", explain: "The delegated administrator can't create assignments in, or edit permission sets provisioned to, the management account.", placeholder: "account" },
    { id: "M06.05-d9", q: "In <code>~/.aws/config</code>, which setting in a profile holds the permission set name to use? (setting name)", answers: ["sso_role_name"], hint: "It's named after the role that gets provisioned.", explain: "<code>sso_role_name = Developer</code>, together with <code>sso_account_id</code> and <code>sso_session</code>.", placeholder: "setting" },
    { id: "M06.05-d10", q: "For how long is an IAM Identity Center SCIM access token valid before it must be rotated? (years)", answers: ["1", "one", "1 year", "one year"], hint: "Put the date in a calendar.", explain: "SCIM tokens expire after one year; when one expires, provisioning stops until the IdP is given a new token.", placeholder: "years" }
  ],
  check: [
    { id: "M06.05-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company administers IAM Identity Center from a member account registered as the delegated administrator. Administrators can assign the AdministratorAccess permission set in every account except the management account, and they can no longer edit that permission set. What is the MOST appropriate fix?",
      options: [
        { t: "Create separate permission sets for the management account and manage those assignments from the management account; stop assigning shared sets there", c: true, why: "The delegated administrator can't manage permission sets provisioned to the management account. Separating them restores the delegated administrator's control over the shared sets." },
        { t: "Attach an SCP to the management account that allows sso:* for the delegated administrator", c: false, why: "SCPs don't apply to the management account and never grant permissions." },
        { t: "Register the management account as a second delegated administrator", c: false, why: "The management account can't be its own delegated administrator, and Identity Center supports only one delegated administrator." },
        { t: "Edit the AWSReservedSSO_AdministratorAccess role in the management account directly in IAM", c: false, why: "Provisioned roles are owned by Identity Center; direct edits are blocked or overwritten." }
      ] },
    { id: "M06.05-k2", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A permission set references a customer managed policy named AppData. New accounts created by Account Factory each week fail to get the assignment, and the provisioning status shows FAILED. Which solution prevents this with the LEAST ongoing effort?",
      options: [
        { t: "Deploy the AppData policy with a service-managed CloudFormation StackSet targeting the OU with automatic deployment, before assignments are created", c: true, why: "Every existing and new account in the OU receives the policy automatically, so provisioning finds it." },
        { t: "Replace the customer managed policy reference with an AWS managed policy", c: false, why: "AWS managed policies can't contain account-specific resource ARNs, which is why the reference was used." },
        { t: "Ask account owners to create the policy manually after each account is vended", c: false, why: "Manual and error-prone; it is exactly the operational burden to avoid." },
        { t: "Increase the permission set session duration", c: false, why: "Session duration has nothing to do with whether a referenced policy exists." }
      ] },
    { id: "M06.05-k3", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "Security requires that a leaver's AWS access ends as quickly as possible. The company uses IAM Identity Center with Entra ID as the identity source. Which TWO measures reduce leaver latency?",
      options: [
        { t: "Enable SCIM automatic provisioning so that disabling the user in Entra ID disables them in Identity Center", c: true, why: "SCIM propagates the disabled state and group removals without manual AWS work." },
        { t: "Use short session durations (1–2 hours) for powerful permission sets", c: true, why: "Existing sessions aren't ended by deprovisioning, so the session length bounds how long access can continue." },
        { t: "Create IAM users for each employee so they can be deleted individually", c: false, why: "IAM users add long-term credentials and more places to forget; the opposite of the goal." },
        { t: "Set every permission set to 12 hours to reduce sign-in prompts", c: false, why: "Longer sessions increase how long a leaver keeps access." },
        { t: "Rely on AWS Config to delete the user's AWSReservedSSO role", c: false, why: "The role is shared by everyone with that permission set in the account; deleting it isn't per-user revocation." }
      ] },
    { id: "M06.05-k4", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A business unit enabled IAM Identity Center in its own member account and wants to use it to give its engineers access to five other accounts in the organisation. What should the architect tell them?",
      options: [
        { t: "That is an account instance; it supports only AWS managed applications. Access to AWS accounts requires the organization instance, administered by the management account or delegated administrator", c: true, why: "Account instances have no permission sets or account assignments." },
        { t: "Create permission sets in the account instance and assign them to the five accounts", c: false, why: "Account instances can't create account assignments." },
        { t: "Register the member account as delegated administrator for its account instance", c: false, why: "Delegated administration applies to the organization instance, not account instances." },
        { t: "Configure SCIM from the account instance to the organization instance", c: false, why: "SCIM is between an IdP and an instance; instances don't sync with each other this way." }
      ] },
    { id: "M06.05-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Engineers using the ReadOnly permission set complain that their AWS console sessions end after exactly one hour, although the access portal still shows them signed in. What should the administrator change?",
      options: [
        { t: "Increase the session duration of the ReadOnly permission set (for example to 8 hours) and reprovision it", c: true, why: "The default permission set session is 1 hour; the portal session is a separate, longer clock." },
        { t: "Increase MaxSessionDuration on the AWSReservedSSO_ReadOnly role in each account in IAM", c: false, why: "The role is managed by Identity Center; the value comes from the permission set and direct edits are overwritten." },
        { t: "Increase the access portal session duration only", c: false, why: "That controls re-authentication to the portal, not the length of each role session." },
        { t: "Add an SCP that allows 8-hour sessions", c: false, why: "SCPs don't set session durations." }
      ] },
    { id: "M06.05-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "Auditors require that nobody holds standing administrator access to production accounts. Engineers occasionally need admin access during approved changes, for at most a few hours. The company uses IAM Identity Center. Which approach meets the requirement?",
      options: [
        { t: "Keep a short-session ProdAdmin permission set with no standing assignments, and use an approval workflow that creates the assignment for the change window and deletes it afterwards", c: true, why: "Access exists only while approved, the short session bounds overrun, and every step is logged in CloudTrail (the TEAM pattern)." },
        { t: "Assign AdministratorAccess to all engineers in production with a 12-hour session and review CloudTrail weekly", c: false, why: "That is standing access, exactly what auditors forbid." },
        { t: "Share the management account root credentials with the change approver", c: false, why: "Root use for routine changes violates least privilege and is untraceable to individuals." },
        { t: "Create an IAM user with admin rights in each production account and disable it between changes", c: false, why: "Long-term credentials and manual toggling are error-prone and not federated." }
      ] }
  ],
  cards: ["fc-M06-5-01", "fc-M06-5-02", "fc-M06-5-03", "fc-M06-5-04", "fc-M06-5-05", "fc-M06-5-06", "fc-M06-5-07", "fc-M06-5-08", "fc-M06-5-09", "fc-M06-5-10", "fc-M06-5-11"],
  references: [
    "IAM Identity Center User Guide: <em>Organization and account instances of IAM Identity Center</em>",
    "IAM Identity Center User Guide: <em>Manage your identity source</em>, <em>Automatic provisioning (SCIM)</em> and <em>Considerations for changing your identity source</em>",
    "IAM Identity Center User Guide: <em>Permission sets</em>, <em>Customer managed policies</em>, <em>Set session duration</em> and <em>Delegated administration</em>",
    "IAM Identity Center User Guide: <em>Attributes for access control</em> and <em>Multi-factor authentication</em>",
    "IAM Identity Center API Reference (sso-admin, identitystore) and AWS CLI Command Reference: <em>aws configure sso</em>",
    "AWS CloudFormation User Guide: <em>AWS::SSO::PermissionSet</em>, <em>AWS::SSO::Assignment</em>",
    "AWS Security Blog / aws-samples: <em>Temporary Elevated Access Management (TEAM) for IAM Identity Center</em>",
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em> (Identity management and access)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-5-01", front: "Organization instance vs account instance of Identity Center?", back: "Organization instance: one per org, permission sets + account access + apps. Account instance: one account, AWS managed applications only, no AWS account access." },
  { id: "fc-M06-5-02", front: "What can't the Identity Center delegated administrator do?", back: "Manage assignments in, or permission sets provisioned to, the management account (and enable/delete the instance). Keep separate sets for the management account." },
  { id: "fc-M06-5-03", front: "How many identity sources can an Identity Center instance have?", back: "Exactly one: Identity Center directory, external IdP (SAML 2.0 + SCIM) or Active Directory (Managed Microsoft AD / AD Connector)." },
  { id: "fc-M06-5-04", front: "Four policy slots of a permission set?", back: "AWS managed policies, customer managed policy references (name + path), one inline policy, and a permissions boundary." },
  { id: "fc-M06-5-05", front: "Permission set session duration range and default?", back: "1–12 hours, default 1 hour. Separate from the access portal session (default 8 hours)." },
  { id: "fc-M06-5-06", front: "Assignments vs provisioned roles: how to count?", back: "Assignments = (principal, permission set, account) triples. Roles = one AWSReservedSSO_<Set>_<suffix> per (permission set, account) pair." },
  { id: "fc-M06-5-07", front: "Customer managed policy reference gotcha?", back: "The policy must already exist with that name and path in every target account, or provisioning FAILS. Deploy it with StackSets in the account baseline." },
  { id: "fc-M06-5-08", front: "After editing a permission set, what must happen?", back: "Reprovision it (ProvisionPermissionSet, ALL_PROVISIONED_ACCOUNTS) and check the async status. Running sessions keep old permissions until they expire." },
  { id: "fc-M06-5-09", front: "SCIM token lifetime and the failure it causes?", back: "One year. When it expires, the IdP gets 401s and joiners, movers and leavers stop syncing silently. Rotate (two tokens can overlap) and monitor." },
  { id: "fc-M06-5-10", front: "Temporary elevated access with Identity Center?", back: "Short-session powerful permission set, no standing assignment; an approval workflow creates and later deletes the assignment (e.g. AWS TEAM solution)." },
  { id: "fc-M06-5-11", front: "Identity Center CloudFormation resource types?", back: "AWS::SSO::PermissionSet, AWS::SSO::Assignment, AWS::SSO::InstanceAccessControlAttributeConfiguration (ABAC attributes)." }
);
// ================================================================== 06_directory_service.js
/* ---------------------------------------------------------------- M06.06 AWS Directory Service */
var DG_0606_TYPES = `
<figure>
<svg class="diagram" viewBox="0 0 760 424" role="img" aria-labelledby="m0606at m0606ad">
  <title id="m0606at">The three AWS Directory Service options side by side</title>
  <desc id="m0606ad">Three columns inside a VPC. AWS Managed Microsoft AD runs two Windows domain controllers in two Availability Zones and can form an optional forest trust with the on-premises Active Directory over VPN or Direct Connect. AD Connector runs two connector endpoints in two Availability Zones that hold no directory data and proxy every authentication request to the on-premises domain controllers over VPN or Direct Connect. Simple AD runs two Samba 4 based domain controllers and is standalone, with no link to on-premises.</desc>
  <defs><marker id="m0606a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-region" x="10" y="10" width="236" height="252" rx="10"/>
  <text class="dg-tb" x="22" y="34">Managed Microsoft AD</text>
  <text class="dg-ts" x="22" y="52">real Windows Server AD</text>
  <rect class="dg-az" x="22" y="64" width="100" height="56" rx="6"/><text class="dg-ts" x="32" y="82">AZ a</text><text class="dg-t" x="32" y="104">DC 1</text>
  <rect class="dg-az" x="134" y="64" width="100" height="56" rx="6"/><text class="dg-ts" x="144" y="82">AZ b</text><text class="dg-t" x="144" y="104">DC 2</text>
  <text class="dg-ts" x="22" y="146">Standard: up to ~30,000 objects</text>
  <text class="dg-ts" x="22" y="164">Enterprise: up to ~500,000</text>
  <text class="dg-ts" x="22" y="182">trusts, MFA via RADIUS</text>
  <text class="dg-ts" x="22" y="200">schema extensions, LDAPS</text>
  <text class="dg-ts" x="22" y="218">share with other accounts</text>
  <text class="dg-ts" x="22" y="236">multi-Region (Enterprise)</text>

  <rect class="dg-region" x="262" y="10" width="236" height="252" rx="10"/>
  <text class="dg-tb" x="274" y="34">AD Connector</text>
  <text class="dg-ts" x="274" y="52">proxy, caches nothing</text>
  <rect class="dg-az" x="274" y="64" width="100" height="56" rx="6"/><text class="dg-ts" x="284" y="82">AZ a</text><text class="dg-t" x="284" y="104">endpoint</text>
  <rect class="dg-az" x="386" y="64" width="100" height="56" rx="6"/><text class="dg-ts" x="396" y="82">AZ b</text><text class="dg-t" x="396" y="104">endpoint</text>
  <text class="dg-ts" x="274" y="146">Small ~500 / Large ~5,000 users</text>
  <text class="dg-ts" x="274" y="164">MFA via RADIUS</text>
  <text class="dg-ts" x="274" y="182">no trusts, no sharing</text>
  <text class="dg-ts" x="274" y="200">no schema changes</text>
  <text class="dg-ts" x="274" y="218">service account in your AD</text>
  <text class="dg-ts" x="274" y="236">down if the link is down</text>

  <rect class="dg-region" x="514" y="10" width="236" height="252" rx="10"/>
  <text class="dg-tb" x="526" y="34">Simple AD</text>
  <text class="dg-ts" x="526" y="52">Samba 4, AD-compatible</text>
  <rect class="dg-az" x="526" y="64" width="100" height="56" rx="6"/><text class="dg-ts" x="536" y="82">AZ a</text><text class="dg-t" x="536" y="104">DC 1</text>
  <rect class="dg-az" x="638" y="64" width="100" height="56" rx="6"/><text class="dg-ts" x="648" y="82">AZ b</text><text class="dg-t" x="648" y="104">DC 2</text>
  <text class="dg-ts" x="526" y="146">Small ~500 / Large ~5,000 users</text>
  <text class="dg-ts" x="526" y="164">no trusts, no MFA</text>
  <text class="dg-ts" x="526" y="182">no schema changes, no LDAPS</text>
  <text class="dg-ts" x="526" y="200">no RDS for SQL Server</text>
  <text class="dg-ts" x="526" y="218">not an Identity Center source</text>
  <text class="dg-ts" x="526" y="236">lowest cost, standalone</text>

  <path class="dg-line" d="M128 264 V326" stroke-dasharray="6 4" marker-start="url(#m0606a-ar)" marker-end="url(#m0606a-ar)"/>
  <text class="dg-ts" x="138" y="290">optional forest trust</text>
  <text class="dg-ts" x="138" y="306">over VPN / DX</text>
  <path class="dg-line" d="M380 264 V326" marker-end="url(#m0606a-ar)"/>
  <text class="dg-ts" x="388" y="290">every auth request</text>
  <text class="dg-ts" x="388" y="306">proxied (VPN / DX)</text>

  <rect class="dg-dc" x="10" y="330" width="488" height="76" rx="10"/>
  <text class="dg-tb" x="24" y="354">On-premises data centre</text>
  <text class="dg-ts" x="24" y="374">forest corp.example.com · domain controllers · users and groups</text>
  <text class="dg-ts" x="24" y="392">remains the source of truth for identities</text>

  <rect class="dg-info" x="514" y="330" width="236" height="76" rx="10"/>
  <text class="dg-tb" x="526" y="354">No on-premises link</text>
  <text class="dg-ts" x="526" y="374">its own users and groups,</text>
  <text class="dg-ts" x="526" y="392">managed with AD tools</text>
</svg>
<figcaption>Figure M06-6a. Same service family, three very different things. Managed Microsoft AD is a full directory that can trust yours; AD Connector is only a doorway to yours; Simple AD is a small standalone directory.</figcaption>
</figure>`;

var DG_0606_TRUST = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0606bt m0606bd">
  <title id="m0606bt">Forest trust: trust direction versus access direction</title>
  <desc id="m0606bd">On the left, the forest aws.example.com hosted in AWS Managed Microsoft AD holds resources such as FSx file shares, RDS for SQL Server and domain-joined EC2 instances, and is the trusting domain. On the right, the on-premises forest corp.example.com holds the users and groups and is the trusted domain. The trust arrow points from the trusting AWS forest to the trusted on-premises forest. The access arrow points the other way: users in corp.example.com reach resources in aws.example.com.</desc>
  <defs><marker id="m0606b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-region" x="10" y="16" width="270" height="200" rx="10"/>
  <text class="dg-tb" x="24" y="40">Forest: aws.example.com</text>
  <text class="dg-ts" x="24" y="58">AWS Managed Microsoft AD</text>
  <rect class="dg-box" x="24" y="70" width="242" height="132" rx="8"/>
  <text class="dg-t" x="36" y="92">Domain aws.example.com</text>
  <text class="dg-ts" x="36" y="114">2 DCs in AZ a and AZ b</text>
  <text class="dg-ts" x="36" y="132">resources: FSx, RDS, EC2</text>
  <text class="dg-ts" x="36" y="150">security groups grant access</text>
  <text class="dg-tb" x="36" y="186">TRUSTING side</text>

  <rect class="dg-dc" x="480" y="16" width="270" height="200" rx="10"/>
  <text class="dg-tb" x="494" y="40">Forest: corp.example.com</text>
  <text class="dg-ts" x="494" y="58">on-premises Active Directory</text>
  <rect class="dg-box" x="494" y="70" width="242" height="132" rx="8"/>
  <text class="dg-t" x="506" y="92">Domain corp.example.com</text>
  <text class="dg-ts" x="506" y="114">users: alice, bob, svc-app</text>
  <text class="dg-ts" x="506" y="132">groups: Finance, DBAs</text>
  <text class="dg-ts" x="506" y="150">child: emea.corp.example.com</text>
  <text class="dg-tb" x="506" y="186">TRUSTED side</text>

  <text class="dg-ts" x="300" y="80">trust direction</text>
  <path class="dg-line" d="M282 92 H476" marker-end="url(#m0606b-ar)"/>
  <text class="dg-ts" x="300" y="112">aws trusts corp</text>
  <text class="dg-ts" x="300" y="152">access direction</text>
  <path class="dg-line" d="M478 164 H284" marker-end="url(#m0606b-ar)"/>
  <text class="dg-ts" x="300" y="184">corp users use aws</text>
  <text class="dg-ts" x="300" y="200">resources</text>

  <text class="dg-ts" x="16" y="248">One-way outgoing trust (AWS side): corp users can use AWS resources; aws accounts get nothing on premises.</text>
  <text class="dg-ts" x="16" y="268">Two-way trust: access works in both directions, so both sides must accept the other's identities.</text>
  <text class="dg-ts" x="16" y="288">Forest trust: transitive to every domain in both forests (emea included), uses Kerberos.</text>
  <text class="dg-ts" x="16" y="308">External trust: one specific domain only, non-transitive, uses NTLM. Prefer forest trusts.</text>
</svg>
<figcaption>Figure M06-6b. The arrow of trust points from the trusting domain to the trusted domain; access flows the opposite way. "AWS trusts corp" means corp's users can use AWS-side resources.</figcaption>
</figure>`;

var DG_0606_TREE = `
<figure>
<svg class="diagram" viewBox="0 0 760 420" role="img" aria-labelledby="m0606ct m0606cd">
  <title id="m0606ct">Decision tree for choosing a directory option</title>
  <desc id="m0606cd">Question 1: is the goal only workforce sign-in to AWS accounts? If yes, use IAM Identity Center with a corporate identity provider or with Active Directory through AD Connector. If no, question 2: is there an existing on-premises Active Directory? If yes, question 3: are AD-aware workloads, a trust, or survival of a network link failure needed? If yes, AWS Managed Microsoft AD with a trust; if no, AD Connector. If there is no existing AD, question 4: are trusts, MFA, RDS for SQL Server, schema changes or more than 5,000 users needed? If yes, AWS Managed Microsoft AD; if no, Simple AD. Whatever directory is chosen, its users reach AWS through IAM roles, preferably via IAM Identity Center.</desc>
  <defs><marker id="m0606c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-info" x="10" y="10" width="330" height="54" rx="8"/>
  <text class="dg-tb" x="24" y="32">1 · Only workforce sign-in to AWS?</text>
  <text class="dg-ts" x="24" y="52">console and CLI access to accounts</text>
  <path class="dg-line" d="M340 37 H418" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="364" y="30">yes</text>
  <rect class="dg-good" x="420" y="10" width="330" height="54" rx="8"/>
  <text class="dg-tb" x="434" y="32">IAM Identity Center</text>
  <text class="dg-ts" x="434" y="52">IdP (SAML + SCIM) or AD via AD Connector</text>

  <path class="dg-line" d="M175 64 V98" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="183" y="86">no</text>
  <rect class="dg-info" x="10" y="100" width="330" height="54" rx="8"/>
  <text class="dg-tb" x="24" y="122">2 · Existing on-premises AD?</text>
  <text class="dg-ts" x="24" y="142">identities stay mastered on premises</text>
  <path class="dg-line" d="M340 127 H418" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="364" y="120">yes</text>
  <rect class="dg-info" x="420" y="100" width="330" height="54" rx="8"/>
  <text class="dg-tb" x="434" y="122">3 · AD-aware apps or a trust, or</text>
  <text class="dg-ts" x="434" y="142">must survive loss of the VPN / DX link?</text>

  <path class="dg-line" d="M500 154 V198" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="508" y="180">yes</text>
  <path class="dg-line" d="M670 154 V198" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="678" y="180">no</text>
  <rect class="dg-good" x="420" y="200" width="160" height="54" rx="8"/>
  <text class="dg-tb" x="432" y="222">Managed AD</text>
  <text class="dg-ts" x="432" y="242">+ forest trust</text>
  <rect class="dg-good" x="590" y="200" width="160" height="54" rx="8"/>
  <text class="dg-tb" x="602" y="222">AD Connector</text>
  <text class="dg-ts" x="602" y="242">proxy, no cache</text>

  <path class="dg-line" d="M175 154 V198" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="183" y="180">no</text>
  <rect class="dg-info" x="10" y="200" width="330" height="54" rx="8"/>
  <text class="dg-tb" x="24" y="222">4 · Trusts, MFA, RDS SQL Server,</text>
  <text class="dg-ts" x="24" y="242">schema changes or &gt; 5,000 users?</text>

  <path class="dg-line" d="M90 254 V298" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="98" y="280">yes</text>
  <path class="dg-line" d="M260 254 V298" marker-end="url(#m0606c-ar)"/>
  <text class="dg-ts" x="268" y="280">no</text>
  <rect class="dg-good" x="10" y="300" width="160" height="54" rx="8"/>
  <text class="dg-tb" x="22" y="322">Managed AD</text>
  <text class="dg-ts" x="22" y="342">Standard / Enterprise</text>
  <rect class="dg-good" x="180" y="300" width="160" height="54" rx="8"/>
  <text class="dg-tb" x="192" y="322">Simple AD</text>
  <text class="dg-ts" x="192" y="342">small, low cost</text>

  <rect class="dg-edge" x="420" y="282" width="330" height="72" rx="8"/>
  <text class="dg-tb" x="434" y="304">Then federate AD users to AWS</text>
  <text class="dg-ts" x="434" y="324">Identity Center permission sets (preferred)</text>
  <text class="dg-ts" x="434" y="342">or Directory Service console access + roles</text>

  <text class="dg-ts" x="16" y="388">Edition: Standard up to ~30,000 directory objects; Enterprise up to ~500,000 objects or multi-Region replication.</text>
  <text class="dg-ts" x="16" y="406">Self-managed AD on EC2 is the fallback only when you need Domain Admin control the managed service withholds.</text>
</svg>
<figcaption>Figure M06-6c. Four questions pick the directory. The last box is exam Task 1.1: a directory decides who people are; IAM roles decide what they may do in AWS.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.06", title: "AWS Directory Service", level: 200, minutes: 50,
  objectives: [
    "Explain Active Directory building blocks (domain, forest, domain controller, OU, Kerberos, LDAP, DNS, trusts) well enough to design with them, even with no Windows background",
    "Compare AWS Managed Microsoft AD (Standard and Enterprise), AD Connector and Simple AD on capacity, trusts, MFA, integrations and failure behaviour",
    "Predict who can access what from a trust's type and direction, and configure a forest trust between AWS Managed Microsoft AD and on-premises AD",
    "Choose a directory option for a scenario with a four-question decision tree, and decide when and how to federate directory users into AWS through IAM roles"
  ],
  sections: [
    { type: "why", html: `
<p>A manufacturer is moving 400 Windows servers to AWS. Its SQL Server databases use <em>Windows authentication</em> (no passwords in connection strings), its file shares are permissioned with AD groups, and 1,500 call-centre agents will move to Amazon WorkSpaces. All 6,000 employees sign in with accounts that live in an on-premises Active Directory, which HR and the service desk maintain every day. The CIO asks three questions in the first architecture meeting:</p>
<ul>
  <li>Do we need Active Directory <em>in</em> AWS, or can AWS just talk to the one we have?</li>
  <li>If the Direct Connect link goes down, does the call centre stop working?</li>
  <li>How do the same people get into the AWS console without creating IAM users?</li>
</ul>
<p><strong>AWS Directory Service</strong> is the answer to the first two questions, and "federating a directory service with IAM roles" is the answer to the third. It is an explicit SAA-C03 skill (Task 1.1: <em>"Determining when to federate a directory service with IAM roles"</em>), and it turns up in every enterprise migration. M05.07 introduced the three directory options in one table. This lesson goes underneath that table: how AD actually works, what each option does on the wire, how trusts behave, and how to choose with confidence.</p>` },

    { type: "concept", title: "Active Directory in plain terms (for non-Windows people)", html: `
<p>If you come from Linux or web development, Active Directory (AD) can look like a black box. It is really four familiar ideas bundled together: a database of users and computers, a login protocol, a lookup protocol, and DNS.</p>
<table>
<thead><tr><th>Term</th><th>What it is</th><th>Linux / web analogy</th></tr></thead>
<tbody>
<tr><td><strong>Directory</strong></td><td>A hierarchical database of <em>objects</em>: users, groups, computers, printers, service accounts. Each object has attributes (name, email, manager, group membership).</td><td>An LDAP server such as OpenLDAP, or a users table</td></tr>
<tr><td><strong>Domain</strong></td><td>An administrative and security boundary with a DNS name, for example <code>corp.example.com</code>, plus a short NetBIOS name such as <code>CORP</code>. Users sign in as <code>CORP\\alice</code> or <code>alice@corp.example.com</code>.</td><td>A tenant or realm</td></tr>
<tr><td><strong>Domain controller (DC)</strong></td><td>A server that holds a full copy of the domain database and answers sign-in and lookup requests. DCs replicate changes to each other (multi-master), so you always run at least two.</td><td>A replicated database node plus an auth server</td></tr>
<tr><td><strong>Organizational unit (OU)</strong></td><td>A folder inside a domain for grouping objects, delegating admin rights and linking policies. (Not the same as an AWS Organizations OU, despite the name.)</td><td>A directory in a file tree</td></tr>
<tr><td><strong>Group Policy (GPO)</strong></td><td>Settings pushed to domain-joined computers and users: password rules, screen locks, software, firewall rules.</td><td>Configuration management (Ansible, Puppet)</td></tr>
<tr><td><strong>Tree / forest</strong></td><td>Domains with a contiguous DNS namespace form a tree (<code>corp.example.com</code> and <code>emea.corp.example.com</code>). One or more trees sharing one <em>schema</em> and one <em>global catalog</em> form a forest. <strong>The forest is the real security boundary of AD.</strong></td><td>An organisation with several tenants that share one data model</td></tr>
<tr><td><strong>Schema</strong></td><td>The definition of which object classes and attributes exist. Some applications extend it (adding attributes); extensions are forest-wide and cannot be removed.</td><td>A database schema</td></tr>
<tr><td><strong>Domain join</strong></td><td>Registering a computer in the domain so it trusts the DCs and lets domain users sign in to it.</td><td>Enrolling a host in SSSD / FreeIPA</td></tr>
</tbody></table>

<h3>The protocols underneath</h3>
<ul>
  <li><strong>DNS</strong> (port 53): clients find domain controllers by looking up SRV records such as <code>_ldap._tcp.dc._msdcs.corp.example.com</code>. If DNS is wrong, nothing else works. This is the number one cause of failed domain joins and trusts.</li>
  <li><strong>Kerberos</strong> (port 88): the sign-in protocol. A user proves their password once to the DC's Key Distribution Center and receives a <em>ticket-granting ticket</em>; they then request <em>service tickets</em> for each server (file share, SQL Server) without sending the password again. That is why Windows authentication to SQL Server needs no password in the connection string. Kerberos tolerates only a small clock difference (5 minutes by default), so time sync matters.</li>
  <li><strong>LDAP</strong> (port 389, or 636 for LDAPS over TLS): the lookup protocol. Applications use it to search for users and read their group memberships. The <em>global catalog</em> (ports 3268/3269) answers forest-wide searches.</li>
  <li><strong>NTLM</strong>: an older challenge-response protocol, still used as a fallback and over external trusts.</li>
  <li>Plus SMB (445) for policy files, RPC (135 and a dynamic high range) for replication and management, and NTP (123) for time.</li>
</ul>

<h3>Trusts: the part everyone gets backwards</h3>
<p>A <strong>trust</strong> lets users from one domain be recognised by another. Each trust has a <em>trusting</em> side (it owns resources and accepts the other's sign-ins) and a <em>trusted</em> side (it owns the accounts). The trust "arrow" is drawn from trusting to trusted, and <strong>access flows the opposite way</strong>:</p>
<div class="callout tip"><strong>Memory hook:</strong> "I trust you" means "<em>your</em> people may come into <em>my</em> house". If the AWS directory trusts the corporate directory, corporate users can use AWS-side resources. Trust direction and access direction are always opposite.</div>
` + DG_0606_TRUST + `
<table>
<thead><tr><th>Trust property</th><th>Options</th><th>What it means</th></tr></thead>
<tbody>
<tr><td>Direction</td><td>One-way incoming, one-way outgoing, two-way</td><td>Outgoing from domain A = A trusts the other side (the other side's users can access A). Incoming to A = the other side trusts A (A's users can access the other side). Two-way = both.</td></tr>
<tr><td>Type</td><td>Forest or external</td><td><strong>Forest trust:</strong> between the root domains of two forests, transitive to every domain in both forests, Kerberos-based. <strong>External trust:</strong> to one specific domain, non-transitive, NTLM-based. AWS recommends forest trusts.</td></tr>
<tr><td>Authentication scope</td><td>Forest-wide or selective</td><td>Selective authentication allows only explicitly permitted users to authenticate to specific computers. More secure, more admin work.</td></tr>
</tbody></table>
<p>A trust does not grant any permissions by itself. It only lets the trusting side <em>recognise</em> the other side's users. You still have to add <code>CORP\\DBAs</code> to a SQL Server login or a file-share ACL before anyone can do anything.</p>` },

    { type: "concept", title: "The three AWS Directory Service options in depth", html: DG_0606_TYPES + `
<h3>AWS Managed Microsoft AD</h3>
<p>A genuine Windows Server Active Directory that AWS deploys, patches, monitors, backs up and repairs for you. You choose a VPC and two subnets in different AZs; AWS places one domain controller in each (you can add more DCs for load or resilience). AWS also creates a security group for the DCs and sets them up as DNS servers for the domain.</p>
<ul>
  <li><strong>Editions:</strong> <em>Standard</em> for small and midsize organisations (up to about 30,000 directory objects, roughly 5,000 employees once you count their computers and groups) and <em>Enterprise</em> (up to about 500,000 objects), which also supports <strong>multi-Region replication</strong>: the directory is extended to additional Regions with their own DCs, so workloads there authenticate locally and keep working if the primary Region is impaired.</li>
  <li><strong>Your admin rights are delegated, not total.</strong> You get an <code>Admin</code> account in the <em>AWS Delegated Administrators</em> group with full control of an OU named after your NetBIOS name, plus delegated groups for things like fine-grained password policies and DNS. You do <em>not</em> get Domain Admins or Enterprise Admins and you cannot RDP to the DCs. Most real-world friction comes from scripts that assume Domain Admin.</li>
  <li><strong>Trusts</strong> with your own AD (on-premises or on EC2): forest or external, one-way or two-way.</li>
  <li><strong>MFA</strong> by pointing the directory at your RADIUS server (for example an MFA product's RADIUS proxy), used by WorkSpaces and console sign-in through the directory.</li>
  <li><strong>Schema extensions</strong> by uploading an LDIF file (forest-wide and irreversible, so test in a copy first).</li>
  <li><strong>LDAPS</strong> (server-side, for applications that bind to the directory, and client-side to your own DCs), automatic daily snapshots plus manual snapshots for restore, and log forwarding of security events to CloudWatch Logs.</li>
  <li><strong>Directory sharing:</strong> one directory can be shared with other AWS accounts (through Organizations or by invitation), so workload accounts can seamlessly domain-join EC2 instances without running their own directory.</li>
</ul>

<h3>AD Connector</h3>
<p>A <strong>directory gateway</strong>. It is not a directory at all: it holds no users, no passwords and no cache. When an AWS service asks "is this alice's password?" or "which groups is alice in?", AD Connector forwards the question to your on-premises DCs and relays the answer.</p>
<ul>
  <li><strong>Sizes:</strong> Small (designed for up to about 500 users) and Large (up to about 5,000 users). These are guidance on connection load; you can deploy several connectors to spread load.</li>
  <li><strong>Requirements:</strong> network connectivity from two subnets (in different AZs) to your DCs over VPN or Direct Connect, the DCs' DNS IP addresses, and a <em>service account</em> in your AD with delegated rights to read users and groups (and to join computers if you use seamless domain join).</li>
  <li><strong>Works with:</strong> IAM Identity Center, WorkSpaces, Amazon QuickSight, Amazon Connect, AWS Management Console access through the directory, and seamless domain join of EC2 instances to your on-premises domain. MFA through your RADIUS server; client-side LDAPS to your DCs.</li>
  <li><strong>Does not:</strong> form trusts, extend the schema, take snapshots or get shared with other accounts. It cannot serve RDS for SQL Server or FSx for Windows File Server, which need a real domain.</li>
  <li><strong>Failure mode:</strong> if the network path or your DCs are unavailable, sign-in through AD Connector fails. There is nothing to fall back on.</li>
</ul>

<h3>Simple AD</h3>
<p>A standalone, Samba 4 based directory that is compatible with many AD tools: user and group management with the usual Windows admin tools, Group Policy, Kerberos sign-in and domain join for Windows and Linux EC2 instances. Sizes: Small (about 500 users, around 2,000 objects) and Large (about 5,000 users, around 20,000 objects). It is the cheapest option and has no link to anything else.</p>
<p>Its limits are the exam's favourite distractor: <strong>no trusts, no MFA, no schema extensions, no LDAPS, no RDS for SQL Server, no directory sharing, and it cannot be an IAM Identity Center identity source.</strong> It is also not offered in every Region.</p>

<h3>And the fourth option: run AD yourself</h3>
<p>You can always install Windows Server DCs on EC2 and extend your on-premises forest into AWS as another site. You keep full Domain Admin control and any customisation, but you own patching, backups, monitoring, DC sizing and recovery. Choose it when a requirement explicitly needs control the managed service withholds (for example Enterprise Admin-level operations or unsupported third-party agents on DCs). Several services, such as FSx for Windows File Server and RDS for SQL Server, can also join a <em>self-managed</em> AD directly.</p>

<h3>Side-by-side</h3>
<table>
<thead><tr><th></th><th>Managed Microsoft AD</th><th>AD Connector</th><th>Simple AD</th></tr></thead>
<tbody>
<tr><td>What it is</td><td>Real Windows AD, run by AWS</td><td>Proxy to your AD</td><td>Samba 4 directory</td></tr>
<tr><td>Where identities live</td><td>In AWS (plus trusted forests)</td><td>On premises only</td><td>In AWS</td></tr>
<tr><td>Capacity</td><td>~30,000 objects (Std) / ~500,000 (Ent)</td><td>~500 / ~5,000 users per connector</td><td>~500 / ~5,000 users</td></tr>
<tr><td>Trusts</td><td>Yes, forest or external, one- or two-way</td><td>No</td><td>No</td></tr>
<tr><td>MFA (RADIUS)</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Schema extensions</td><td>Yes (LDIF)</td><td>No</td><td>No</td></tr>
<tr><td>Share with other accounts</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>Multi-Region</td><td>Yes (Enterprise)</td><td>No (one connector per Region)</td><td>No</td></tr>
<tr><td>RDS for SQL Server, FSx for Windows</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>Identity Center source</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Survives loss of the on-prem link</td><td>Yes</td><td>No</td><td>Yes (no link to lose)</td></tr>
</tbody></table>` },

    { type: "workflow", title: "Two workflows: building a forest trust, and an AD Connector sign-in", html: `
<h3>A. Create AWS Managed Microsoft AD and a trust with on-premises AD</h3>
<ol class="flow">
  <li><strong>Network first.</strong> VPN or Direct Connect between the VPC and the data centre, with routes both ways. Allow the AD ports in both directions between the Managed AD security group and the on-premises DCs (DNS 53, Kerberos 88, kpasswd 464, LDAP 389, LDAPS 636, global catalog 3268–3269, SMB 445, RPC 135 plus the dynamic range 49152–65535, NTP 123).</li>
  <li><strong>Create the directory</strong> with a DNS name that differs from the on-premises forest (for example <code>aws.example.com</code>, not a duplicate of <code>corp.example.com</code>), a NetBIOS name, the Admin password, the edition and two subnets in different AZs. Creation takes tens of minutes; note the two DNS IP addresses it returns.</li>
  <li><strong>DNS both ways.</strong> On premises, add a <em>conditional forwarder</em> for <code>aws.example.com</code> pointing at the Managed AD DNS IPs. On the AWS side, the trust settings include conditional forwarder IPs for <code>corp.example.com</code> (your on-premises DNS servers). For other VPC resources, forward the domain with Route 53 Resolver outbound rules or a DHCP options set.</li>
  <li><strong>Create the on-premises half</strong> of the trust in <em>Active Directory Domains and Trusts</em>: forest trust, direction chosen to match the access you need, and a trust password.</li>
  <li><strong>Create the AWS half</strong> in the Directory Service console or with <code>aws ds create-trust</code>: same type, the matching direction from AWS's point of view, the same trust password, the remote domain name and the conditional forwarder IPs.</li>
  <li><strong>Verify</strong>: the trust state moves from <em>Creating</em> to <em>Verified</em>. A failure almost always means DNS resolution or a blocked port.</li>
  <li><strong>Grant access</strong> on the trusting side: add <code>CORP\\DBAs</code> to a group in the AWS domain, map it to SQL Server logins, file-share ACLs or WorkSpaces assignments. The trust made the users visible; groups make them authorised.</li>
</ol>

<h3>B. What happens when a WorkSpaces user signs in through AD Connector</h3>
<ol class="flow">
  <li>Alice opens the WorkSpaces client and types <code>alice</code> and her corporate password (plus an MFA code if RADIUS is enabled).</li>
  <li>WorkSpaces hands the credentials to the AD Connector endpoint in the VPC.</li>
  <li>AD Connector sends a Kerberos/LDAP request over the VPN or Direct Connect link to an on-premises DC that it found through the DNS IPs you configured, using its service account for lookups.</li>
  <li>If RADIUS MFA is enabled, AD Connector also sends the one-time code to your RADIUS server and requires both answers to succeed.</li>
  <li>The DC validates the password and returns the result and group memberships; AD Connector relays them and caches nothing.</li>
  <li>WorkSpaces starts Alice's desktop, which is joined to the on-premises domain and receives its Group Policy over the same link.</li>
</ol>
<div class="callout warn"><strong>Every step from 3 onward crosses your hybrid link.</strong> AD Connector adds no resilience: link latency becomes sign-in latency, and a link outage is a sign-in outage. Two VPN tunnels or redundant Direct Connect connections (M11) are part of the AD Connector design.</div>` },

    { type: "aws", title: "On AWS: integrations, networking, and federating a directory with IAM roles", html: `
<h3>Which AWS services use which directory</h3>
<table>
<thead><tr><th>Service</th><th>Managed Microsoft AD</th><th>AD Connector</th><th>Simple AD</th></tr></thead>
<tbody>
<tr><td>Amazon RDS for SQL Server (Windows authentication)</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>Amazon FSx for Windows File Server</td><td>Yes</td><td>No (join your own AD directly instead)</td><td>No</td></tr>
<tr><td>Amazon WorkSpaces</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>IAM Identity Center identity source</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Seamless EC2 domain join</td><td>Yes (also across shared accounts)</td><td>Yes (to your on-prem domain)</td><td>Yes</td></tr>
<tr><td>AWS Management Console access via the directory</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Amazon QuickSight (AD sign-in)</td><td>Yes</td><td>Yes</td><td>No</td></tr>
</tbody></table>
<p>Kerberos authentication for RDS and Aurora engines other than SQL Server (for example MySQL, PostgreSQL and Oracle) also relies on AWS Managed Microsoft AD. When a question lists RDS for SQL Server or FSx for Windows alongside "AWS", the managed answer is almost always Managed Microsoft AD.</p>

<h3>Networking facts that bite</h3>
<ul>
  <li>Every option needs <strong>two subnets in two different AZs</strong> in one VPC. The directory lives in one Region (Enterprise can add Regions).</li>
  <li>Managed AD and Simple AD expose two DNS IP addresses. Domain-joined instances must use them (or forward to them) for the domain name; the usual pattern is a <strong>Route 53 Resolver outbound endpoint</strong> with a forwarding rule for the AD domain, shared to other accounts with AWS RAM (M06.07, M12).</li>
  <li>The DCs' security group is created by AWS. Tighten it only if you know every port the workloads need.</li>
</ul>

<h3>When to federate a directory service with IAM roles (Task 1.1)</h3>
<p>A directory answers <em>who you are</em>. AWS APIs and the console only understand <em>IAM principals</em>. Federating a directory with IAM roles means: users authenticate against the directory, and AWS gives them a <strong>role session</strong> with temporary credentials. You do this whenever <strong>the people who need AWS access already exist in a directory</strong>, because the alternative (an IAM user per person) duplicates identities, adds passwords and long-lived keys, and breaks the leaver process.</p>
<table>
<thead><tr><th>Mechanism</th><th>How it works</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><strong>IAM Identity Center with AD as identity source</strong> (preferred)</td><td>Identity Center syncs users and groups from Managed AD or through AD Connector; group + permission set + account = a provisioned role (M06.05)</td><td>Any multi-account organisation; also recommended for single accounts</td></tr>
<tr><td><strong>Directory Service "AWS Management Console access"</strong></td><td>Enable an access URL (<code>https://&lt;alias&gt;.awsapps.com/console</code>) on the directory and assign AD users or groups to IAM roles. Those roles trust the service principal <code>ds.amazonaws.com</code>.</td><td>One account, a directory already exists, and Identity Center is not an option. Exam questions phrased as "allow AD users to sign in to the console with IAM roles" describe this</td></tr>
<tr><td><strong>SAML through AD FS (or another IdP in front of AD)</strong></td><td>The IdP authenticates against AD and posts a SAML assertion; STS <code>AssumeRoleWithSAML</code> (M05.07)</td><td>Legacy designs, or applications that need SAML directly</td></tr>
</tbody></table>
<p>The counter-case: <strong>do not stand up a directory only to federate.</strong> If people already sign in through Entra ID, Okta or Google Workspace, connect that IdP to Identity Center with SAML and SCIM. Directory Service earns its place when something needs <em>AD itself</em>: Windows workloads, Kerberos, domain join, Group Policy, or a hard requirement to authenticate against on-premises AD.</p>
` + DG_0606_TREE + `
<div class="callout"><strong>Pricing shape (no numbers to memorise):</strong> Managed AD and Simple AD are billed per directory-hour by edition or size, with extra charges for additional domain controllers, for each account a directory is shared with, and for data transfer across Regions. AD Connector is billed per connector-hour by size. Directory Service has a limited free trial for new customers; check the pricing page before experimenting.</div>` },

    { type: "examples", html: `
<h3>Example 1: create the three directory types with the CLI</h3>
<pre><code># AWS Managed Microsoft AD, Standard edition
aws ds create-microsoft-ad --name aws.example.com --short-name AWSCORP --password 'Ex4mple-Adm1n-Pw!' --edition Standard --vpc-settings VpcId=vpc-0a1b2c3d4e5f60718,SubnetIds=subnet-0aa11bb22cc33dd44,subnet-0ee55ff66aa77bb88

# AD Connector, Small, pointing at two on-premises DCs
aws ds connect-directory --name corp.example.com --short-name CORP --password 'svc-account-password' --size Small --connect-settings VpcId=vpc-0a1b2c3d4e5f60718,SubnetIds=subnet-0aa11bb22cc33dd44,subnet-0ee55ff66aa77bb88,CustomerDnsIps=10.10.0.10,10.10.0.11,CustomerUserName=svc-adconnector

# Simple AD, Small
aws ds create-directory --name lab.example.com --short-name LAB --password 'Ex4mple-Adm1n-Pw!' --size Small --vpc-settings VpcId=vpc-0a1b2c3d4e5f60718,SubnetIds=subnet-0aa11bb22cc33dd44,subnet-0ee55ff66aa77bb88</code></pre>
<p>Each call returns only a directory ID such as <code>d-9067a1b2c3</code>. In practice you would pass the password from AWS Secrets Manager rather than type it, and define the directory in CloudFormation or Terraform.</p>

<h3>Example 2: read the result</h3>
<pre><code>aws ds describe-directories --query "DirectoryDescriptions[].{Id:DirectoryId,Name:Name,Type:Type,Edition:Edition,Size:Size,Stage:Stage,Dns:DnsIpAddrs}" --output json</code></pre>
<pre><code>[
  { "Id": "d-9067a1b2c3", "Name": "aws.example.com", "Type": "MicrosoftAD",
    "Edition": "Standard", "Size": null, "Stage": "Active", "Dns": ["10.20.1.84", "10.20.2.117"] },
  { "Id": "d-9067d4e5f6", "Name": "corp.example.com", "Type": "ADConnector",
    "Edition": null, "Size": "Small", "Stage": "Active", "Dns": ["10.10.0.10", "10.10.0.11"] }
]</code></pre>
<p>Notice that the AD Connector's "DNS" addresses are <em>your</em> on-premises DCs: it has no DNS of its own. <code>Type</code> can also be <code>SimpleAD</code> or <code>SharedMicrosoftAD</code> (a directory another account shared with you).</p>

<h3>Example 3: a one-way forest trust, and what it means</h3>
<pre><code>aws ds create-trust --directory-id d-9067a1b2c3 --remote-domain-name corp.example.com --trust-password 'Same-As-On-Prem-Side-1!' --trust-direction "One-Way: Outgoing" --trust-type Forest --conditional-forwarder-ip-addrs 10.10.0.10 10.10.0.11</code></pre>
<p>Read it from the AWS directory's point of view: <em>outgoing</em> means <code>aws.example.com</code> trusts <code>corp.example.com</code>. So corporate users (alice in <code>CORP</code>) can be granted access to SQL Server and file shares in the AWS domain, while accounts that exist only in the AWS domain cannot access anything on premises. The on-premises admin must create the matching <em>incoming</em> trust on their side. For access in both directions use <code>"Two-Way"</code>.</p>

<h3>Example 4: federate directory users into the console with an IAM role</h3>
<p>Trust policy of a role that Directory Service console access can hand to AD users or groups:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ds.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}</code></pre>
<p>Attach a permissions policy (for example <code>ReadOnlyAccess</code>), then in the directory's <em>Application management</em> settings enable AWS Management Console access and assign the AD group <code>CORP\\CloudReaders</code> to the role. Users browse to <code>https://corp-example.awsapps.com/console</code>, sign in with AD credentials and land in the console as <code>assumed-role/CloudReaders/alice</code>. In an organisation, do the equivalent with Identity Center: AD group + <code>ReadOnly</code> permission set + accounts.</p>

<h3>Example 5: sizing an edition</h3>
<p>Count directory objects, not just people. A company with 4,000 employees has roughly:</p>
<table>
<thead><tr><th>Object type</th><th>Count</th></tr></thead>
<tbody>
<tr><td>User accounts</td><td>4,000</td></tr>
<tr><td>Computer accounts (laptops + servers)</td><td>4,600</td></tr>
<tr><td>Groups</td><td>1,200</td></tr>
<tr><td>Service accounts, contacts, GPOs, other</td><td>1,400</td></tr>
<tr><td><strong>Total</strong></td><td><strong>11,200</strong></td></tr>
</tbody></table>
<p>11,200 is well inside Standard's ~30,000. Plan for growth: after a planned acquisition that triples the estate, 3 × 11,200 = 33,600 objects exceeds Standard, so choose Enterprise up front or plan the move. Enterprise is also mandatory as soon as a requirement says "replicate the directory to a second Region".</p>
` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Migrating SQL Server with Windows authentication to RDS, file shares to FSx for Windows; on-premises AD stays the master</td><td>Managed Microsoft AD + forest trust (AWS trusts corp)</td><td>RDS for SQL Server and FSx need a real domain; the trust lets corporate users and groups be granted access</td></tr>
<tr><td>800 WorkSpaces for staff who already have on-premises AD accounts; no Windows servers in AWS; reliable redundant DX</td><td>AD Connector (Large)</td><td>Nothing to replicate or run; users keep one password; the DX redundancy covers the dependency</td></tr>
<tr><td>Research lab: 120 Linux and Windows EC2 instances need central logins and domain join; no on-premises AD; tight budget</td><td>Simple AD (Small)</td><td>Cheapest AD-compatible directory; no trusts or MFA needed</td></tr>
<tr><td>Same lab, but auditors now require MFA for remote desktops</td><td>Managed Microsoft AD (Standard) with RADIUS</td><td>Simple AD has no MFA; Managed AD supports RADIUS MFA</td></tr>
<tr><td>Global retailer: Windows workloads in Ireland and Virginia must authenticate locally during a Regional outage</td><td>Managed Microsoft AD Enterprise with multi-Region replication</td><td>Each Region gets its own DCs of the same directory</td></tr>
<tr><td>30 workload accounts must domain-join EC2 instances to one directory</td><td>Managed Microsoft AD in a shared-services account, shared to the workload accounts</td><td>Directory sharing avoids 30 directories and keeps one domain</td></tr>
<tr><td>Employees use Entra ID and need SSO to 40 AWS accounts; no Windows workloads</td><td>IAM Identity Center + Entra ID (SAML + SCIM); no Directory Service</td><td>Nothing needs AD itself; a directory would add cost and a dependency</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: inspect, reason about, and (optionally) build a directory", html: `
<p><strong>Part 1: read-only, free (CloudShell with your <code>academy-admin</code> profile).</strong> Even with no directory, these commands show the API surface and current account limits:</p>
<pre><code>aws ds describe-directories --profile academy-admin
aws ds get-directory-limits --profile academy-admin --query DirectoryLimits
#  "CloudOnlyDirectoriesLimit": 10, "ConnectedDirectoriesLimit": 10, "CloudOnlyMicrosoftADLimit": 20 ...
#  (values vary by account; these are per-Region soft limits)</code></pre>

<p><strong>Part 2: AD's DNS from Linux, free.</strong> Any AD domain publishes SRV records. If your workplace has AD, run this from a machine on that network (replace the domain):</p>
<pre><code>dig +short _ldap._tcp.dc._msdcs.corp.example.com SRV
#   0 100 389 dc01.corp.example.com.
#   0 100 389 dc02.corp.example.com.
dig +short _kerberos._tcp.corp.example.com SRV
#   0 100 88 dc01.corp.example.com.</code></pre>
<p>The fields are priority, weight, port and target. You have just found the domain controllers the same way a Windows client, AD Connector and a trust verification do.</p>

<p><strong>Part 3: trust-direction drill (paper exercise).</strong> For each statement, write who can access what: (a) "aws.example.com has a one-way outgoing trust to corp.example.com"; (b) "corp.example.com has a one-way outgoing trust to aws.example.com"; (c) a two-way forest trust where corp has a child domain emea. Answers: (a) corp users access AWS-side resources; (b) AWS-domain users access corp resources; (c) users of aws, corp <em>and</em> emea can be granted access across the trust, because forest trusts are transitive within each forest.</p>

<p><strong>Part 4: optional, costs a little.</strong> In a sandbox account with a VPC that has two subnets in different AZs, create a Small Simple AD (Example 1), wait until <code>Stage</code> is <code>Active</code>, note its DNS IPs, then delete it within the hour:</p>
<pre><code>aws ds delete-directory --directory-id d-xxxxxxxxxx --profile academy-admin</code></pre>
<div class="callout warn">Directory Service is billed by the hour while the directory exists. Check the free-trial terms on the pricing page, set a budget alarm, and always delete lab directories.</div>` },

    { type: "casestudy", title: "Case study: Larkspur Mutual brings its Windows estate to AWS", html: `
<p><strong>Situation.</strong> Larkspur Mutual, a fictional insurer with 5,200 employees, is closing one of two data centres. It runs 380 Windows servers, 60 SQL Server instances using Windows authentication, 40 TB of AD-permissioned file shares, and a 1,400-seat call centre on ageing VDI. The on-premises forest <code>corp.larkspur.example</code> (with a child domain for its Irish subsidiary) stays the master for identities. AWS accounts are managed with Organizations and Control Tower; Identity Center already uses Entra ID.</p>
<p><strong>Requirements.</strong> RDS for SQL Server and FSx for Windows File Server with existing AD groups; WorkSpaces for the call centre; call-centre sign-in must survive a Direct Connect outage; a DR copy in a second Region; no Domain Admin work for the small infrastructure team.</p>
<p><strong>Options evaluated.</strong></p>
<table>
<thead><tr><th>Option</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>AD Connector only</td><td>Rejected: no RDS/FSx support, and every WorkSpaces sign-in depends on DX</td></tr>
<tr><td>Self-managed DCs on EC2 extending the forest</td><td>Rejected: full control was not needed, and patching and backup would land on a stretched team</td></tr>
<tr><td><strong>Managed Microsoft AD Enterprise + forest trust</strong></td><td>Chosen: real domain for RDS/FSx/WorkSpaces, local authentication in AWS, multi-Region replication for DR</td></tr>
</tbody></table>
<p><strong>Design.</strong> Directory <code>aws.larkspur.example</code> (Enterprise, because the object count was 41,000 and a second Region was required) in a shared-services account, shared with eight workload accounts for seamless domain join. A two-way forest trust was configured, because some on-premises applications also needed to authenticate service accounts created in the AWS domain. Selective authentication restricted which corporate groups could reach the AWS-side servers. Route 53 Resolver outbound rules for both domains were shared through RAM to every workload VPC. Call-centre agents' WorkSpaces were placed in the AWS domain, with RADIUS MFA against the existing MFA appliance replicated to AWS. Human access to the AWS console stayed on Identity Center with Entra ID: the new directory was for workloads, not for console federation.</p>
<p><strong>Result.</strong> During a planned 4-hour DX maintenance window in month three, WorkSpaces and RDS sign-ins continued normally, because authentication happened inside AWS; only on-premises resource access paused. The infrastructure team spent no time on DC patching, and the Region replica passed its first DR test.</p>
<p><strong>Lessons learned.</strong> (1) The trust failed to verify for two days because a firewall blocked the dynamic RPC range; test ports before the change window. (2) Twelve legacy scripts assumed Domain Admin and had to be rewritten for the delegated OU. (3) Users of a trusted forest are only <em>visible</em> to WorkSpaces when the trust and service configuration allow it, so validate each integration's trust requirements early. (4) Keep console federation and workload directories as separate decisions.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>If the question says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"Use existing on-premises AD credentials", "do not replicate or cache directory data in AWS", "least infrastructure"</td><td>AD Connector</td></tr>
<tr><td>"SQL Server Windows authentication on RDS", "FSx for Windows", "trust relationship with on-premises AD", "AD-aware applications"</td><td>AWS Managed Microsoft AD</td></tr>
<tr><td>"Authentication must continue if the VPN / Direct Connect connection fails"</td><td>Managed Microsoft AD (with a trust); not AD Connector</td></tr>
<tr><td>"Directory in multiple Regions", "more than ~30,000 objects"</td><td>Managed Microsoft AD <strong>Enterprise</strong></td></tr>
<tr><td>"Low cost", "basic AD-compatible", "small number of users", "Samba", no trusts or MFA mentioned</td><td>Simple AD</td></tr>
<tr><td>"MFA for directory users"</td><td>RADIUS with Managed AD or AD Connector (never Simple AD)</td></tr>
<tr><td>"Many accounts need to domain-join to the same directory"</td><td>Share the Managed AD directory with those accounts</td></tr>
<tr><td>"AD users need access to the AWS console / multiple accounts without IAM users"</td><td>Federate: IAM Identity Center with AD as identity source (or directory console access mapped to IAM roles)</td></tr>
<tr><td>"Full control including Domain Admin / Enterprise Admin"</td><td>Self-managed AD on EC2</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>AD Connector for RDS for SQL Server or FSx</strong>: not supported. Both need a real domain.</li>
  <li><strong>AD Connector "with a trust"</strong>: AD Connector never forms trusts; it <em>is</em> the on-premises directory, seen through a proxy.</li>
  <li><strong>Simple AD as an Identity Center identity source, or with MFA</strong>: neither is supported.</li>
  <li><strong>"Create IAM users that match the AD user names"</strong>: duplicate identities; always federate instead.</li>
  <li><strong>Trust direction reversed</strong>: if AWS-side resources must be used by on-premises users, the <em>AWS</em> directory must trust the on-premises one (one-way outgoing from AWS, incoming on premises).</li>
  <li><strong>"Standard edition with multi-Region replication"</strong>: multi-Region is Enterprise only.</li>
</ul>
` },

    { type: "architect", html: `
<ul>
  <li><strong>DNS is the first thing to design.</strong> Decide which resolvers answer for each AD domain from every VPC and from on premises. Use Route 53 Resolver inbound and outbound endpoints with forwarding rules, shared via RAM. Most "the domain join failed" tickets are DNS.</li>
  <li><strong>Firewalls between sites.</strong> Trusts and domain join need far more than ports 88 and 389: allow the dynamic RPC range, SMB and the global catalog, and test with <code>Test-NetConnection</code> or <code>nc -zv</code> from both sides before the change window.</li>
  <li><strong>Time.</strong> Kerberos fails beyond about 5 minutes of skew. EC2 instances use the Amazon Time Sync Service by default; make sure on-premises DCs are also correctly synced.</li>
  <li><strong>AD Connector service account hygiene.</strong> If its password expires or the account locks out (for example after someone types it wrongly in a script), every sign-in through the connector fails. Exclude it from expiry policies, monitor it, and rotate its password with <code>aws ds update-directory-setup</code> or the console update flow rather than ad hoc.</li>
  <li><strong>Capacity.</strong> Add domain controllers to Managed AD when CPU or authentication latency grows (CloudWatch metrics are available for DCs); deploy additional AD Connectors to spread load. Do not size only for users: computers, groups and service accounts are objects too.</li>
  <li><strong>Schema extensions are permanent.</strong> Test them in a restored copy or a separate directory, and keep the LDIF files in version control.</li>
  <li><strong>Recovery.</strong> Managed AD and Simple AD take automatic daily snapshots; take a manual snapshot before risky changes. Snapshot restore rolls the whole directory back, including password changes, so it is a last resort.</li>
  <li><strong>Security monitoring.</strong> Forward Managed AD security event logs to CloudWatch Logs and on to your SIEM; alert on changes to privileged groups and on trust changes (CloudTrail records <code>ds:CreateTrust</code>, <code>ds:DeleteTrust</code>).</li>
  <li><strong>Cost traps.</strong> Every extra DC, every account the directory is shared with, and every replicated Region adds hourly charges. A forgotten lab directory bills all month. One shared directory is usually cheaper than one per account.</li>
  <li><strong>Separate concerns.</strong> Workload authentication (Kerberos for SQL Server, file shares, WorkSpaces) and human console federation (Identity Center) are different decisions. Many good designs use Managed AD for the first and Entra ID or Okta for the second.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>AD = directory database + Kerberos sign-in + LDAP lookup + DNS. Domains hold objects, DCs serve them, the forest is the true security boundary.</li>
  <li>Trust direction is opposite to access direction: if the AWS directory trusts corp, corp users can use AWS-side resources. Forest trusts are transitive and Kerberos-based; external trusts are single-domain and NTLM.</li>
  <li>AWS Managed Microsoft AD is a real AD (two DCs in two AZs, delegated admin, not Domain Admin): trusts, RADIUS MFA, schema extensions, sharing, RDS for SQL Server and FSx support. Standard ~30,000 objects; Enterprise ~500,000 and multi-Region.</li>
  <li>AD Connector is a proxy with no cache: Small ~500 / Large ~5,000 users, RADIUS MFA, no trusts, no RDS/FSx, and it fails when the hybrid link fails.</li>
  <li>Simple AD is a small Samba 4 directory: cheap, standalone, no trusts, no MFA, not an Identity Center source.</li>
  <li>Choose with four questions: only console SSO? existing AD? AD-aware workloads, trust or link resilience? trusts, MFA, SQL Server or scale?</li>
  <li>Federate directory users into AWS through IAM roles (preferably Identity Center permission sets) instead of creating IAM users; the directory says who, IAM says what.</li>
  <li>Design DNS forwarding, firewall ports, time sync and service-account hygiene before go-live; they cause most failures.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.06-d1", q: "Staff with on-premises AD accounts need WorkSpaces and AWS console sign-in with their existing passwords. Nothing may be stored or cached in AWS. Which directory option?", answers: ["AD Connector", "ADConnector", "AWS AD Connector"], hint: "It forwards rather than stores.", explain: "AD Connector proxies every request to the on-premises DCs and caches nothing." },
    { id: "M06.06-d2", q: "RDS for SQL Server must use Windows authentication for users from a trusted on-premises forest, using a directory service in AWS. Which directory option?", answers: ["AWS Managed Microsoft AD", "Managed Microsoft AD", "Microsoft AD", "Managed AD", "AWS Managed AD"], hint: "It must be a real domain that can trust another forest.", explain: "RDS for SQL Server joins AWS Managed Microsoft AD, which can trust the on-premises forest. AD Connector and Simple AD are not supported." },
    { id: "M06.06-d3", q: "A 200-user lab needs a cheap AD-compatible directory for Linux and Windows EC2 domain join. No trusts, no MFA, no on-premises AD. Which directory option?", answers: ["Simple AD", "SimpleAD"], hint: "Samba 4.", explain: "Simple AD (Small) is the lowest-cost AD-compatible directory for basic needs without trusts or MFA." },
    { id: "M06.06-d4", q: "Domain A has a one-way trust to domain B (A trusts B). Users from which domain can be granted access to resources in the other? (A or B)", answers: ["B", "domain B"], hint: "\"I trust you\" means your people may come into my house.", explain: "A is the trusting domain and owns the resources; B is trusted and owns the accounts. Access flows from B's users into A." },
    { id: "M06.06-d5", q: "A directory must hold about 120,000 objects. Which AWS Managed Microsoft AD edition? (Standard / Enterprise)", answers: ["Enterprise", "enterprise edition"], hint: "Standard tops out around 30,000 objects.", explain: "Enterprise supports up to about 500,000 objects; Standard about 30,000." },
    { id: "M06.06-d6", q: "How many domain controllers does AWS Managed Microsoft AD deploy by default?", answers: ["2", "two"], hint: "One per AZ, in two AZs.", explain: "Two DCs in two subnets in different AZs. You can add more." },
    { id: "M06.06-d7", q: "Which TCP/UDP port number does Kerberos use?", answers: ["88"], hint: "Two digits, both the same.", explain: "Kerberos uses port 88 (kpasswd uses 464). LDAP uses 389, LDAPS 636, DNS 53." },
    { id: "M06.06-d8", q: "Which protocol do AWS Managed Microsoft AD and AD Connector use to integrate with an existing MFA server? (acronym)", answers: ["RADIUS"], hint: "Remote Authentication Dial-In User Service.", explain: "You configure RADIUS server IPs, port (usually 1812), shared secret and protocol. Simple AD has no MFA support." },
    { id: "M06.06-d9", q: "An IAM role is assigned to AD users through Directory Service \"AWS Management Console access\". Which service principal must its trust policy allow?", answers: ["ds.amazonaws.com"], hint: "ds is the Directory Service API prefix.", explain: "\"Principal\": {\"Service\": \"ds.amazonaws.com\"} with sts:AssumeRole lets Directory Service hand the role to signed-in directory users." },
    { id: "M06.06-d10", q: "Which trust type is transitive across all domains in both forests and uses Kerberos? (forest / external)", answers: ["forest", "forest trust"], hint: "The other type reaches one domain only.", explain: "Forest trusts are transitive between the two forests and use Kerberos; external trusts are non-transitive and use NTLM." },
    { id: "M06.06-d11", q: "An AD Connector must serve about 3,000 users. Which size? (Small / Large)", answers: ["Large"], hint: "Small is designed for about 500 users.", explain: "Large is designed for up to about 5,000 users; Small for about 500." },
    { id: "M06.06-d12", q: "A company of 4,000 staff has 11,200 directory objects and expects the estate to triple after an acquisition. How many objects is that, and does it still fit Standard? Answer with the number of objects.", answers: ["33600", "33,600"], hint: "3 × 11,200.", explain: "33,600 objects exceeds Standard's ~30,000, so Enterprise is the safe choice." }
  ],
  check: [
    { id: "M06.06-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company runs Windows workloads in us-east-1 and eu-west-1 that authenticate against an AWS Managed Microsoft AD directory. Workloads in each Region must keep authenticating locally if the other Region is impaired, with the least operational overhead. What should the architect do?",
      options: [
        { t: "Use the Enterprise edition and add eu-west-1 to the directory with multi-Region replication", c: true, why: "Multi-Region replication (Enterprise only) deploys DCs of the same directory in the additional Region, managed by AWS." },
        { t: "Use the Standard edition and enable multi-Region replication", c: false, why: "Multi-Region replication is an Enterprise edition feature." },
        { t: "Deploy an AD Connector in eu-west-1 pointing to the us-east-1 directory", c: false, why: "AD Connector proxies to another directory, so eu-west-1 would still depend on us-east-1." },
        { t: "Create a separate Simple AD in each Region and copy users nightly", c: false, why: "Two unrelated directories with custom sync is high overhead, and Simple AD lacks the enterprise features these workloads need." }
      ] },
    { id: "M06.06-k2", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "An architect is deploying AD Connector so that Amazon WorkSpaces users can sign in with their on-premises Active Directory credentials. Which TWO prerequisites must be in place?",
      options: [
        { t: "Network connectivity (VPN or Direct Connect) from the connector's two subnets to the on-premises domain controllers, including DNS", c: true, why: "AD Connector forwards every request to the on-premises DCs, which it locates through the DNS IPs you provide." },
        { t: "A service account in the on-premises AD with delegated permissions to read users and groups", c: true, why: "AD Connector uses this account for directory lookups (and computer joins if seamless join is used)." },
        { t: "A two-way forest trust between AD Connector and the on-premises domain", c: false, why: "AD Connector cannot form trusts; it is a proxy, not a domain." },
        { t: "The Enterprise edition of AWS Managed Microsoft AD", c: false, why: "AD Connector is a separate option with Small and Large sizes; editions apply to Managed AD." },
        { t: "A nightly export of on-premises users to Amazon S3", c: false, why: "AD Connector stores and caches nothing; there is nothing to import." }
      ] },
    { id: "M06.06-k3", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company created AWS Managed Microsoft AD (aws.example.com) for its FSx for Windows file shares. Users in the on-premises domain corp.example.com must access those shares. AWS-domain accounts must NOT get access to on-premises resources. Which trust should be configured?",
      options: [
        { t: "A one-way trust in which aws.example.com trusts corp.example.com (outgoing from the AWS directory, incoming on premises)", c: true, why: "The trusting side owns the resources; corp's users can then be granted access to the AWS-side shares, and nothing flows the other way." },
        { t: "A one-way trust in which corp.example.com trusts aws.example.com", c: false, why: "This lets AWS-domain users into on-premises resources: the opposite of the requirement." },
        { t: "A two-way forest trust", c: false, why: "It would also let AWS-domain accounts be granted access on premises, which is explicitly not wanted." },
        { t: "No trust; configure AD Connector for FSx", c: false, why: "FSx for Windows does not use AD Connector, and the users still need to be recognised by the AWS domain." }
      ] },
    { id: "M06.06-k4", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company has 25 AWS accounts in AWS Organizations and an AWS Managed Microsoft AD directory that already holds all employees (synchronised through a trust). Employees must access the accounts with their AD credentials, with permissions based on AD group membership and no IAM users. Which solution is MOST operationally efficient?",
      options: [
        { t: "Enable IAM Identity Center with the Managed AD directory as its identity source, and assign AD groups to accounts with permission sets", c: true, why: "This federates the directory with IAM roles across all accounts: Identity Center provisions a role per permission set in each account and maps AD groups to them." },
        { t: "Create IAM users in each account with names matching AD users and enforce MFA", c: false, why: "Duplicates identities and passwords in 25 accounts and breaks the leaver process." },
        { t: "Enable AWS Management Console access on the directory in every account and maintain role mappings per account", c: false, why: "It can work per account, but repeating it in 25 accounts is far less efficient than Identity Center." },
        { t: "Deploy Simple AD in each account and replicate groups into it", c: false, why: "Simple AD can't trust or replicate from Managed AD and isn't an Identity Center source." }
      ] },
    { id: "M06.06-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A small company uses Simple AD for 300 users who sign in to Amazon WorkSpaces. A new compliance rule requires multi-factor authentication for every WorkSpaces sign-in. What is the most appropriate change?",
      options: [
        { t: "Migrate to AWS Managed Microsoft AD (Standard) and configure RADIUS-based MFA", c: true, why: "Simple AD has no MFA support; Managed AD integrates with a RADIUS MFA server and supports WorkSpaces." },
        { t: "Enable RADIUS MFA on the Simple AD directory", c: false, why: "Simple AD does not support MFA." },
        { t: "Attach an IAM policy requiring aws:MultiFactorAuthPresent to the WorkSpaces users", c: false, why: "WorkSpaces sign-in is directory authentication, not IAM; the condition key doesn't apply to these users." },
        { t: "Switch Simple AD from Small to Large", c: false, why: "Size changes capacity, not features." }
      ] },
    { id: "M06.06-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A shared-services account runs AWS Managed Microsoft AD. Twelve workload accounts in the same organisation must seamlessly join their EC2 instances to this domain, at the lowest cost and administrative effort. What should the architect do?",
      options: [
        { t: "Share the directory with the workload accounts using AWS Directory Service directory sharing", c: true, why: "Directory sharing lets other accounts use the same Managed AD for seamless domain join without running their own directories." },
        { t: "Create an AWS Managed Microsoft AD in each workload account with a trust to the shared-services directory", c: false, why: "Twelve directories and twelve trusts cost far more and add administration." },
        { t: "Create an AD Connector in each account pointing at the shared-services DCs", c: false, why: "Possible in principle, but it adds twelve connectors to pay for and operate; sharing is the built-in mechanism." },
        { t: "Copy the directory snapshot into each account", c: false, why: "Snapshots restore the same directory; they can't be shared as independent copies." }
      ] }
  ],
  cards: ["fc-M06-6-01", "fc-M06-6-02", "fc-M06-6-03", "fc-M06-6-04", "fc-M06-6-05", "fc-M06-6-06", "fc-M06-6-07", "fc-M06-6-08", "fc-M06-6-09", "fc-M06-6-10", "fc-M06-6-11", "fc-M06-6-12"],
  references: [
    "AWS Directory Service Administration Guide: <em>Which to choose</em>, <em>AWS Managed Microsoft AD</em>, <em>AD Connector</em>, <em>Simple AD</em>",
    "AWS Directory Service Administration Guide: <em>Creating a trust relationship</em> and <em>Multi-Region replication</em>",
    "AWS Directory Service Administration Guide: <em>Enable access to the AWS Management Console with AD credentials</em> and <em>Share your directory</em>",
    "IAM Identity Center User Guide: <em>Connect to a Microsoft AD directory</em>",
    "Microsoft Learn: <em>How trust relationships work for forests in Active Directory</em>",
    "AWS Certified Solutions Architect – Associate (SAA-C03) Exam Guide, Task 1.1"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-6-01", front: "AD in four ideas?", back: "Directory database (users, groups, computers) + Kerberos sign-in (88) + LDAP lookup (389/636) + DNS SRV records to find DCs (53)." },
  { id: "fc-M06-6-02", front: "Domain vs forest: which is the real AD security boundary?", back: "The forest: one schema, one global catalog, one or more domain trees." },
  { id: "fc-M06-6-03", front: "Trust direction vs access direction?", back: "Opposite. If A trusts B (A trusting, B trusted), B's users can be granted access to A's resources." },
  { id: "fc-M06-6-04", front: "Forest trust vs external trust?", back: "Forest: between forest roots, transitive to all domains in both forests, Kerberos. External: one domain, non-transitive, NTLM." },
  { id: "fc-M06-6-05", front: "AWS Managed Microsoft AD: editions and capacity?", back: "Standard ~30,000 objects; Enterprise ~500,000 objects + multi-Region replication. 2 DCs in 2 AZs by default." },
  { id: "fc-M06-6-06", front: "What admin rights do you get in Managed Microsoft AD?", back: "Delegated: Admin user in AWS Delegated Administrators, full control of your OU. No Domain Admins / Enterprise Admins, no RDP to DCs." },
  { id: "fc-M06-6-07", front: "AD Connector: what it is and its sizes?", back: "A proxy to on-prem AD; caches nothing. Small ~500 users, Large ~5,000 users. Needs VPN/DX + a service account." },
  { id: "fc-M06-6-08", front: "What can AD Connector NOT do?", back: "No trusts, no schema extensions, no directory sharing, no RDS for SQL Server / FSx; fails if the hybrid link is down." },
  { id: "fc-M06-6-09", front: "Simple AD limits?", back: "Samba 4; Small ~500 / Large ~5,000 users; no trusts, no MFA, no LDAPS, no schema extensions, no RDS SQL Server, not an Identity Center source." },
  { id: "fc-M06-6-10", front: "How do directory users get MFA?", back: "RADIUS server integration on Managed Microsoft AD or AD Connector. Not available on Simple AD." },
  { id: "fc-M06-6-11", front: "When to federate a directory service with IAM roles?", back: "Whenever people who need AWS access already exist in a directory: map directory groups to roles (Identity Center permission sets, or DS console access roles trusting ds.amazonaws.com) instead of IAM users." },
  { id: "fc-M06-6-12", front: "Many accounts need to domain-join to one Managed AD?", back: "Share the directory with those accounts (directory sharing via Organizations or handshake)." }
);
// ================================================================== 07_resource_sharing.js
/* ---------------------------------------------------------------- M06.07 Resource sharing */
var DG_0607_SHARE = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0607at m0607ad">
  <title id="m0607at">Anatomy of an AWS RAM resource share</title>
  <desc id="m0607ad">The owner account, a central network account, holds a subnet, a transit gateway and a Route 53 Resolver rule. A resource share groups those resource ARNs together with a managed permission and the setting that blocks external principals. The share is associated with principals: the whole organisation, an organisational unit or a single account. Inside the organisation, with sharing enabled, principals get access immediately; principals outside the organisation must accept an invitation.</desc>
  <defs><marker id="m0607a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="12" y="12" width="236" height="200" rx="10"/>
  <text class="dg-ta" x="24" y="34">Owner account</text>
  <text class="dg-ts" x="24" y="52">111122223333 (Network)</text>
  <rect class="dg-box" x="24" y="64" width="212" height="40" rx="6"/><text class="dg-t" x="36" y="82">subnet-0a1b…</text><text class="dg-ts" x="36" y="97">VPC subnet</text>
  <rect class="dg-box" x="24" y="112" width="212" height="40" rx="6"/><text class="dg-t" x="36" y="130">tgw-0c2d…</text><text class="dg-ts" x="36" y="145">Transit Gateway</text>
  <rect class="dg-box" x="24" y="160" width="212" height="40" rx="6"/><text class="dg-t" x="36" y="178">rslvr-rr-5e6f…</text><text class="dg-ts" x="36" y="193">Resolver forwarding rule</text>

  <path class="dg-line" d="M248 112 H284" marker-end="url(#m0607a-ar)"/>

  <rect class="dg-edge" x="288" y="12" width="210" height="200" rx="10"/>
  <text class="dg-tb" x="300" y="36">Resource share</text>
  <text class="dg-ts" x="300" y="56">Regional object in the owner</text>
  <text class="dg-t" x="300" y="84">resources: ARNs</text>
  <text class="dg-t" x="300" y="108">principals: org / OU /</text>
  <text class="dg-t" x="300" y="126">account / some roles</text>
  <text class="dg-t" x="300" y="150">managed permission</text>
  <text class="dg-ts" x="300" y="166">e.g. AWSRAMDefaultPermission…</text>
  <text class="dg-t" x="300" y="192">allow external: false</text>

  <path class="dg-line" d="M498 50 H534" marker-end="url(#m0607a-ar)"/>
  <path class="dg-line" d="M498 112 H534" marker-end="url(#m0607a-ar)"/>
  <path class="dg-line" d="M498 174 H534" marker-end="url(#m0607a-ar)"/>
  <rect class="dg-good" x="538" y="26" width="210" height="48" rx="6"/><text class="dg-t" x="550" y="46">Organization</text><text class="dg-ts" x="550" y="64">o-a1b2c3d4e5 (all accounts)</text>
  <rect class="dg-good" x="538" y="88" width="210" height="48" rx="6"/><text class="dg-t" x="550" y="108">OU Workloads</text><text class="dg-ts" x="550" y="126">ou-ab12-11111111</text>
  <rect class="dg-good" x="538" y="150" width="210" height="48" rx="6"/><text class="dg-t" x="550" y="170">Account</text><text class="dg-ts" x="550" y="188">444455556666</text>

  <rect class="dg-info" x="12" y="228" width="736" height="60" rx="8"/>
  <text class="dg-t" x="24" y="250">Inside the organisation (sharing enabled): access is immediate, no invitation.</text>
  <text class="dg-t" x="24" y="272">Outside the organisation: an invitation the other account must accept.</text>
</svg>
<figcaption>Figure M06-7a. A resource share is a container: resources plus principals plus a permission. The owner keeps the resource; RAM makes it visible and usable in the principals' accounts.</figcaption>
</figure>`;

var DG_0607_VPCSHARE = `
<figure>
<svg class="diagram" viewBox="0 0 760 420" role="img" aria-labelledby="m0607bt m0607bd">
  <title id="m0607bt">VPC sharing: owner and participant responsibilities</title>
  <desc id="m0607bd">A network account owns a VPC with three subnets in different Availability Zones identified by AZ ID. The subnets are shared with two participant accounts, payments and analytics, which launch their own EC2 instances, RDS databases and load balancers into the shared subnets. Below, two panels list responsibilities: the owner manages the VPC, subnets, route tables, network ACLs, gateways, endpoints and VPC flow logs; each participant manages its own resources and security groups, cannot change the network and cannot see the other participant's resources.</desc>
  <rect class="dg-region" x="12" y="12" width="736" height="214" rx="10"/>
  <text class="dg-ta" x="24" y="34">Network account 111122223333 owns VPC 10.20.0.0/16 (eu-west-1)</text>

  <rect class="dg-az" x="28" y="48" width="228" height="164" rx="8"/>
  <text class="dg-tb" x="40" y="70">app subnet A</text>
  <text class="dg-ts" x="40" y="88">10.20.1.0/24 · euw1-az1</text>
  <rect class="dg-good" x="40" y="100" width="204" height="48" rx="6"/><text class="dg-t" x="52" y="120">EC2 · payments</text><text class="dg-ts" x="52" y="138">owner: 444455556666</text>
  <rect class="dg-info" x="40" y="154" width="204" height="48" rx="6"/><text class="dg-t" x="52" y="174">EC2 · analytics</text><text class="dg-ts" x="52" y="192">owner: 777788889999</text>

  <rect class="dg-az" x="266" y="48" width="228" height="164" rx="8"/>
  <text class="dg-tb" x="278" y="70">app subnet B</text>
  <text class="dg-ts" x="278" y="88">10.20.2.0/24 · euw1-az2</text>
  <rect class="dg-good" x="278" y="100" width="204" height="48" rx="6"/><text class="dg-t" x="290" y="120">ALB node · payments</text><text class="dg-ts" x="290" y="138">owner: 444455556666</text>
  <rect class="dg-info" x="278" y="154" width="204" height="48" rx="6"/><text class="dg-t" x="290" y="174">Lambda ENI · analytics</text><text class="dg-ts" x="290" y="192">owner: 777788889999</text>

  <rect class="dg-az" x="504" y="48" width="228" height="164" rx="8"/>
  <text class="dg-tb" x="516" y="70">data subnet C</text>
  <text class="dg-ts" x="516" y="88">10.20.3.0/24 · euw1-az3</text>
  <rect class="dg-good" x="516" y="100" width="204" height="48" rx="6"/><text class="dg-t" x="528" y="120">RDS · payments</text><text class="dg-ts" x="528" y="138">owner: 444455556666</text>
  <rect class="dg-box" x="516" y="154" width="204" height="48" rx="6"/><text class="dg-t" x="528" y="174">NAT gateway</text><text class="dg-ts" x="528" y="192">owner: 111122223333</text>

  <rect class="dg-edge" x="12" y="242" width="362" height="166" rx="10"/>
  <text class="dg-tb" x="24" y="266">VPC owner (network account)</text>
  <text class="dg-ts" x="24" y="288">• creates the VPC, subnets, CIDRs (IPAM)</text>
  <text class="dg-ts" x="24" y="306">• route tables, network ACLs</text>
  <text class="dg-ts" x="24" y="324">• IGW, NAT gateways, TGW attachment</text>
  <text class="dg-ts" x="24" y="342">• gateway / interface endpoints, DHCP options</text>
  <text class="dg-ts" x="24" y="360">• VPC-level flow logs; pays NAT/endpoint hours</text>
  <text class="dg-ts" x="24" y="378">• sees all ENIs, can't modify participants' ones</text>
  <text class="dg-ts" x="24" y="396">• can't share default VPC subnets</text>

  <rect class="dg-good" x="386" y="242" width="362" height="166" rx="10"/>
  <text class="dg-tb" x="398" y="266">Participant (workload account)</text>
  <text class="dg-ts" x="398" y="288">• launches EC2, RDS, ELB, Lambda, EKS nodes</text>
  <text class="dg-ts" x="398" y="306">• creates and owns its own security groups</text>
  <text class="dg-ts" x="398" y="324">• pays for its resources and inter-AZ transfer</text>
  <text class="dg-ts" x="398" y="342">• flow logs on its own ENIs only</text>
  <text class="dg-ts" x="398" y="360">• can't modify subnets, routes or NACLs</text>
  <text class="dg-ts" x="398" y="378">• can't see other participants' resources</text>
  <text class="dg-ts" x="398" y="396">• must be in the same organization</text>
</svg>
<figcaption>Figure M06-7b. One VPC, many owners of what runs inside it. The network team owns the plumbing; application accounts own their workloads, IAM and security groups, and their bills.</figcaption>
</figure>`;

var DG_0607_HUB = `
<figure>
<svg class="diagram" viewBox="0 0 760 410" role="img" aria-labelledby="m0607ct m0607cd">
  <title id="m0607ct">Centralised network account with a Transit Gateway shared by RAM</title>
  <desc id="m0607cd">The network account in the Infrastructure OU owns a transit gateway, an egress VPC with NAT gateways, an inspection VPC with AWS Network Firewall, a shared services VPC with interface endpoints and Route 53 Resolver endpoints, and a hybrid attachment to on premises through Direct Connect or VPN. A RAM resource share shares the transit gateway with the Workloads OU. Three spoke accounts, payments, analytics and a sandbox, each create a transit gateway attachment from their own VPC; the network account accepts the attachments and controls the transit gateway route tables.</desc>
  <defs><marker id="m0607c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="12" y="12" width="736" height="200" rx="10"/>
  <text class="dg-ta" x="24" y="32">Network account 111122223333 (Infrastructure OU)</text>

  <rect class="dg-box" x="28" y="44" width="220" height="60" rx="8"/><text class="dg-tb" x="40" y="68">Egress VPC</text><text class="dg-ts" x="40" y="88">NAT gateways → internet</text>
  <rect class="dg-bad" x="270" y="44" width="220" height="60" rx="8"/><text class="dg-tb" x="282" y="68">Inspection VPC</text><text class="dg-ts" x="282" y="88">AWS Network Firewall</text>
  <rect class="dg-box" x="512" y="44" width="220" height="60" rx="8"/><text class="dg-tb" x="524" y="68">Shared services VPC</text><text class="dg-ts" x="524" y="88">interface endpoints, Resolver</text>

  <rect class="dg-edge" x="300" y="136" width="160" height="60" rx="8"/><text class="dg-tb" x="312" y="160">Transit Gateway</text><text class="dg-ts" x="312" y="180">routes: owner only</text>
  <path class="dg-link" d="M340 136 L160 104"/>
  <path class="dg-link" d="M380 136 V104"/>
  <path class="dg-link" d="M420 136 L600 104"/>

  <rect class="dg-info" x="28" y="136" width="220" height="60" rx="8"/><text class="dg-tb" x="40" y="160">RAM resource share</text><text class="dg-ts" x="40" y="180">TGW → OU Workloads</text>
  <path class="dg-line" d="M296 166 H252" marker-end="url(#m0607c-ar)"/>

  <rect class="dg-box" x="512" y="136" width="220" height="60" rx="8"/><text class="dg-tb" x="524" y="160">Hybrid attachment</text><text class="dg-ts" x="524" y="180">DX gateway / VPN → on-prem</text>
  <path class="dg-link" d="M460 166 H512"/>

  <rect class="dg-region" x="12" y="232" width="736" height="132" rx="10"/>
  <text class="dg-ta" x="24" y="252">Workloads OU</text>
  <rect class="dg-good" x="28" y="268" width="220" height="80" rx="8"/><text class="dg-t" x="40" y="290">Spoke VPC · payments</text><text class="dg-ts" x="40" y="310">acct 444455556666</text><text class="dg-ts" x="40" y="328">creates its own attachment</text>
  <rect class="dg-good" x="270" y="268" width="220" height="80" rx="8"/><text class="dg-t" x="282" y="290">Spoke VPC · analytics</text><text class="dg-ts" x="282" y="310">acct 777788889999</text><text class="dg-ts" x="282" y="328">creates its own attachment</text>
  <rect class="dg-good" x="512" y="268" width="220" height="80" rx="8"/><text class="dg-t" x="524" y="290">Spoke VPC · sandbox</text><text class="dg-ts" x="524" y="310">isolated TGW route table</text><text class="dg-ts" x="524" y="328">internet via egress only</text>
  <path class="dg-line" d="M138 268 L340 200" marker-end="url(#m0607c-ar)"/>
  <path class="dg-line" d="M380 268 V200" marker-end="url(#m0607c-ar)"/>
  <path class="dg-line" d="M622 268 L420 200" marker-end="url(#m0607c-ar)"/>

  <text class="dg-ts" x="12" y="386">Arrows: TGW attachments requested by spoke accounts and accepted by the owner (auto-accept off by default).</text>
  <text class="dg-ts" x="12" y="402">Spokes never touch TGW route tables; the network team decides who can reach whom.</text>
</svg>
<figcaption>Figure M06-7c. The hub-and-spoke landing-zone network. One account owns the shared plumbing (TGW, egress, inspection, endpoints, hybrid links); RAM lets every workload account plug in without peering meshes or duplicated NAT gateways. Internals in M10 and M11.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.07", title: "Resource sharing", level: 300, minutes: 55,
  objectives: [
    "Explain how an AWS RAM resource share works (resources, principals, managed permissions, external principals) and enable sharing with AWS Organizations",
    "Divide responsibilities correctly between the VPC owner and participants in VPC sharing, and align placement across accounts using AZ IDs",
    "Design a centralised network account that shares a Transit Gateway, Resolver rules, prefix lists and IPAM pools with workload accounts",
    "Choose between RAM, a resource-based policy and a cross-account role for a given sharing requirement",
    "Create, inspect and govern resource shares with the AWS CLI and SCPs (ram:RequestedAllowsExternalPrincipals)"
  ],
  sections: [
    { type: "why", html: `
<p>You have just split your estate into dozens of accounts (M06.01–M06.04). Each application team now has a production, a staging and a development account, which is exactly what AWS recommends. Then the network team asks the uncomfortable questions. Does every one of these 60 accounts get its own VPC, its own NAT gateways in three AZs, its own interface endpoints for 15 services, its own Direct Connect virtual interface and its own copy of the on-premises DNS forwarding rules? Do we peer 60 VPCs with each other? Who makes sure no two teams pick overlapping CIDR ranges?</p>
<p>If the answer is "yes, each account builds its own", you pay for roughly 180 NAT gateways, hundreds of endpoint ENIs and a peering mesh nobody can reason about. Worse, every application team now needs network-admin skills and permissions, which is precisely what the security team wanted to take away from them.</p>
<p>The answer AWS gives, both in the exam and in the Security Reference Architecture, is to <strong>keep accounts separate but share the infrastructure</strong>. A dedicated network account owns the VPCs, Transit Gateway, egress and inspection paths, and <strong>AWS Resource Access Manager (RAM)</strong> shares them into the workload accounts. Teams keep their own account boundary for IAM, quotas and billing, yet launch into subnets they don't own and attach to a Transit Gateway they can't misconfigure.</p>
<p>M05.06 showed RAM as one of the cross-account patterns. This lesson goes deeper: how resource shares behave at organisation scale, what exactly a VPC participant can and cannot do, the AZ-name trap, and how to build the central network account that M06.08 places in the Infrastructure OU.</p>` },

    { type: "concept", title: "Concept: AWS RAM and the resource share", html: DG_0607_SHARE + `
<h3>Why a separate sharing service exists</h3>
<p>For S3 buckets, KMS keys, SQS queues and Lambda functions, cross-account access is granted by a <strong>resource-based policy</strong> and the caller makes API calls against the resource in the other account (M05.06). That model breaks down for infrastructure that must <em>appear inside</em> the consumer's account. A subnet is not something you call; it is somewhere you <em>launch</em>. When the payments account runs <code>ec2:RunInstances</code>, the instance belongs to payments, but its network interface must be placed in a subnet owned by the network account. A Transit Gateway attachment is created by the spoke account against a gateway owned by someone else. There is no "subnet policy" to write. <strong>AWS Resource Access Manager (RAM)</strong> fills this gap: it makes a resource owned by one account usable by other accounts, as if it were a local resource with limited rights.</p>

<h3>Vocabulary</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><strong>Owner</strong></td><td>The account that created the resource. It keeps full control, pays for the resource itself, and can stop sharing at any time.</td></tr>
<tr><td><strong>Consumer / participant</strong></td><td>An account (or principal) the resource is shared with. "Participant" is the VPC-sharing term.</td></tr>
<tr><td><strong>Resource share</strong></td><td>A Regional RAM object in the owner account that groups <em>resources</em> (ARNs), <em>principals</em> and a <em>managed permission</em> per resource type. One share can hold several resources and several principals.</td></tr>
<tr><td><strong>Principal</strong></td><td>Who the share is for: an AWS account ID, the whole organisation (<code>arn:aws:organizations::…:organization/o-…</code>), an OU (<code>…:ou/o-…/ou-…</code>), or, for some resource types only, an IAM role or user. A few resource types can also be shared with service principals.</td></tr>
<tr><td><strong>Managed permission</strong></td><td>Defines which actions consumers can perform on the shared resource. Every shareable type has an AWS managed default (for example <code>AWSRAMDefaultPermissionSubnet</code>); some types offer alternatives, and you can create <strong>customer managed permissions</strong> to narrow them further.</td></tr>
<tr><td><strong>Allow external principals</strong></td><td>A per-share flag. When false, the share can only be associated with principals inside your organisation. Set it to false for every internal share.</td></tr>
<tr><td><strong>Invitation</strong></td><td>Sent when you share with an account outside your organisation (or inside it before sharing with Organizations was enabled). The consumer must accept it before the resource becomes visible.</td></tr>
</tbody></table>

<h3>Sharing with AWS Organizations</h3>
<p>By default RAM treats every other account as a stranger: it sends an invitation and waits. To use the organisation itself as a principal, and to skip invitations inside it, an administrator in the <strong>management account</strong> runs <code>aws ram enable-sharing-with-aws-organization</code> once (or toggles it in the RAM console settings). Under the hood this enables <strong>trusted access</strong> for RAM in AWS Organizations (M06.02). After that:</p>
<ul>
  <li>You can name the organisation or an OU as a principal, and <strong>accounts that join that OU later receive the share automatically</strong>; accounts that leave lose it.</li>
  <li>Accounts in the organisation receive shares <strong>without invitations</strong>.</li>
  <li><strong>VPC subnet sharing requires it</strong>: owner and participants must be in the same organisation, with sharing enabled.</li>
</ul>
<p>Sharing a resource does not move ownership, does not copy data and is free: <strong>RAM itself has no charge</strong>. You pay only for the underlying resources and their usage, according to each service's billing rules for shared resources.</p>

<h3>What can be shared</h3>
<p>The list grows every year; <code>aws ram list-resource-types</code> prints the current one for your Region. The types an architect meets most often:</p>
<table>
<thead><tr><th>Area</th><th>Shareable resource</th><th>What the consumer can do</th></tr></thead>
<tbody>
<tr><td>Networking</td><td><strong>VPC subnets</strong> (VPC sharing)</td><td>Launch its own resources into the owner's subnets</td></tr>
<tr><td>Networking</td><td><strong>Transit Gateways</strong></td><td>Create attachments from its own VPCs (M10)</td></tr>
<tr><td>Networking</td><td><strong>Customer managed prefix lists</strong></td><td>Reference the list in its security groups and route tables</td></tr>
<tr><td>Networking</td><td><strong>IPAM pools</strong></td><td>Allocate non-overlapping CIDRs for its VPCs from a central plan</td></tr>
<tr><td>DNS</td><td><strong>Route 53 Resolver rules</strong>, DNS Firewall rule groups, query log configs, Route 53 Profiles</td><td>Associate the forwarding rules or DNS settings with its VPCs (M11, M12)</td></tr>
<tr><td>Security</td><td><strong>AWS Network Firewall</strong> policies and rule groups</td><td>Use centrally managed rules in its own firewalls (M08)</td></tr>
<tr><td>Security</td><td><strong>AWS Private CA</strong> certificate authorities</td><td>Issue private certificates from the central CA (M07)</td></tr>
<tr><td>Compute</td><td><strong>EC2 Capacity Reservations</strong>, Dedicated Hosts, Outposts</td><td>Launch instances into reserved capacity owned centrally</td></tr>
<tr><td>Licensing</td><td><strong>License Manager configurations</strong></td><td>Have license rules enforced on its launches</td></tr>
<tr><td>Databases</td><td><strong>Aurora DB clusters</strong></td><td>Create a fast copy-on-write <em>clone</em> in its own account</td></tr>
<tr><td>Analytics</td><td><strong>Glue Data Catalog</strong> databases and tables (via Lake Formation)</td><td>Query shared tables with Athena or EMR (M28)</td></tr>
</tbody></table>
<div class="callout warn"><strong>Not RAM.</strong> Several "sharing" features are separate mechanisms, and exam distractors love them: AMIs and EBS snapshots (launch / create-volume permissions), RDS snapshots (snapshot attribute), S3 buckets, KMS keys, SQS, SNS, Secrets Manager, ECR (resource-based policies), and Route 53 <strong>private hosted zone</strong> association with a VPC in another account (an authorisation by the zone owner, then the VPC owner associates; see examples).</div>

<h3>Decision table: RAM vs resource-based policy vs cross-account role</h3>
<table>
<thead><tr><th>Question</th><th>AWS RAM</th><th>Resource-based policy</th><th>Cross-account role</th></tr></thead>
<tbody>
<tr><td>What is shared?</td><td>The resource itself appears in the consumer's account</td><td>Permission to call APIs on a resource in the owner's account</td><td>A whole identity in the target account</td></tr>
<tr><td>Caller identity</td><td>Consumer's own principals, in their own account</td><td>Caller keeps its identity and permissions</td><td>Caller becomes the role and gives up its own permissions</td></tr>
<tr><td>Typical resources</td><td>Subnets, TGW, Resolver rules, prefix lists, IPAM pools, Private CA, capacity reservations</td><td>S3, KMS, SQS, SNS, Lambda, ECR, Secrets Manager, EventBridge buses</td><td>Anything: every service, every API</td></tr>
<tr><td>Scale to an OU / the org</td><td>Yes: org/OU principals, new accounts included automatically</td><td>Yes, with <code>aws:PrincipalOrgID</code> / <code>aws:PrincipalOrgPaths</code></td><td>Needs a role in every account (StackSets, Identity Center)</td></tr>
<tr><td>Who owns what the consumer creates?</td><td>The consumer (e.g. its EC2 in a shared subnet)</td><td>Depends on the service (S3 objects: bucket owner with "Bucket owner enforced")</td><td>The target account</td></tr>
<tr><td>Governance</td><td>SCP condition keys <code>ram:*</code>; Access Analyzer doesn't cover all types</td><td>IAM Access Analyzer external access findings</td><td>Trust policies; Access Analyzer</td></tr>
<tr><td>Pick it when…</td><td>The consumer must <em>place or attach</em> something into an owner's resource</td><td>The consumer must <em>read or write data</em> in an owner's resource</td><td>A human or pipeline must <em>operate inside</em> the other account</td></tr>
</tbody></table>` },

    { type: "concept", title: "Concept: VPC sharing in depth", html: DG_0607_VPCSHARE + `
<h3>The model</h3>
<p><strong>VPC sharing</strong> is RAM applied to subnets. The <strong>VPC owner</strong> (usually the network account) shares one or more subnets with <strong>participant</strong> accounts in the same organisation. Participants then launch their own resources into those subnets: EC2 instances, RDS and Aurora databases, Lambda functions attached to the VPC, load balancers, ECS tasks, EKS nodes, ElastiCache clusters and so on. Every resource still belongs to, and is billed to, the account that created it; only the network is shared.</p>
<p>Because everything lives in one VPC, traffic between participants in the same VPC goes through the VPC's local route, with no peering, no Transit Gateway and no extra processing charge. You also get far fewer VPCs, NAT gateways and endpoints to run.</p>

<h3>Who can do what</h3>
<table>
<thead><tr><th>Action</th><th>Owner</th><th>Participant</th></tr></thead>
<tbody>
<tr><td>Create/delete the VPC and subnets, change CIDRs</td><td>Yes</td><td>No</td></tr>
<tr><td>Route tables, network ACLs, IGW, NAT gateways, VPN/TGW attachments, DHCP options</td><td>Yes</td><td>No</td></tr>
<tr><td>Gateway endpoints (route-table based)</td><td>Yes</td><td>No</td></tr>
<tr><td>Launch resources into the shared subnets</td><td>Yes (into its own subnets)</td><td>Yes</td></tr>
<tr><td>Create security groups in the VPC</td><td>Yes</td><td>Yes: each participant owns its own SGs</td></tr>
<tr><td>Use the VPC's default security group</td><td>Yes</td><td>No: it belongs to the owner</td></tr>
<tr><td>Reference another account's SG in an SG rule (same VPC)</td><td>Yes</td><td>Yes, by security group ID</td></tr>
<tr><td>See or modify another account's instances, databases, SGs</td><td>Sees ENIs in its subnets but can't modify participant resources</td><td>No: participants see only their own resources</td></tr>
<tr><td>Flow logs</td><td>For the VPC, subnets and its own ENIs</td><td>Only for its own ENIs</td></tr>
<tr><td>Stop sharing a subnet</td><td>Yes, any time</td><td>No</td></tr>
</tbody></table>
<p>Since late 2024 an owner can also share specific <strong>security groups</strong> with participants through RAM, so a common "allow-from-corporate" group can be centrally maintained. By default, though, each participant builds its own SGs, which keeps workload security in the workload team's hands (and their IaC).</p>

<h3>Rules and limits you must know</h3>
<ul>
  <li><strong>Same organisation only</strong>, with RAM sharing with AWS Organizations enabled. You can't share subnets with accounts outside the organisation.</li>
  <li><strong>Default VPC subnets can't be shared.</strong> Build a purpose-made VPC.</li>
  <li><strong>The owner can't delete</strong> a subnet or VPC while participant resources are still in it.</li>
  <li><strong>Unsharing</strong> doesn't terminate anything: participant resources keep running, but participants can't create new resources in that subnet. Managed services that replace nodes (load balancers, Auto Scaling) may then fail to scale or heal, so treat unsharing as a migration, not a switch.</li>
  <li><strong>Tags</strong> the owner puts on subnets (including <code>Name</code>) are not shared, so participants see bare subnet IDs. Publish subnet IDs to participants another way (SSM parameters, IaC outputs, a naming service).</li>
  <li><strong>Quotas</strong>: there is a quota on participant accounts per VPC (on the order of 100 by default, adjustable). Very large estates use several shared VPCs (for example one per environment per business unit) rather than one giant one.</li>
  <li><strong>Billing</strong>: participants pay for their own resources and their data transfer (including inter-AZ). The owner pays hourly and data-processing charges for the shared plumbing it created, such as NAT gateways, interface endpoints, VPN/TGW attachments. Use cost allocation tags or the CUR to charge them back.</li>
</ul>

<h3>AZ names vs AZ IDs</h3>
<p>An <strong>Availability Zone name</strong> such as <code>eu-west-1a</code> is a per-account label. AWS maps names to physical AZs independently for each account in many Regions, so that not every customer piles into "a". The <strong>AZ ID</strong> (for example <code>euw1-az1</code>, <code>use1-az4</code>) identifies the same physical AZ in every account. In a single account you rarely notice. In a shared VPC you must notice, because two accounts look at the same subnets with different names. Rule: <strong>design, document and automate placement using AZ IDs</strong>; resolve them to names only inside each account. The examples section works through a full case.</p>` },

    { type: "workflow", title: "Workflow: setting up VPC sharing in an organisation", html: `
<ol class="flow">
  <li><strong>Enable sharing with Organizations (management account, once).</strong> <code>aws ram enable-sharing-with-aws-organization</code>. Verify in Organizations that RAM shows as a service with trusted access. Without this, VPC sharing can't be configured and org/OU principals aren't available.</li>
  <li><strong>Plan the network centrally.</strong> Allocate the VPC CIDR from an IPAM pool (so nothing overlaps with on-premises or other VPCs), decide one shared VPC per environment (prod, non-prod) or per business unit, and lay out subnet tiers (public, app, data) across three AZ <em>IDs</em>.</li>
  <li><strong>Build the VPC in the network account.</strong> Create subnets with <code>--availability-zone-id</code>, route tables, NACLs, NAT gateways, gateway endpoints for S3 and DynamoDB, the TGW attachment, flow logs. Everything here is the network team's IaC, deployed by its pipeline.</li>
  <li><strong>Create the resource share.</strong> Add the subnet ARNs that participants should use (often only app and data tiers; public subnets only to teams that run internet-facing load balancers). Principal: the OU (e.g. Workloads/Prod). Set <code>--no-allow-external-principals</code>.</li>
  <li><strong>Verify associations.</strong> <code>aws ram get-resource-share-associations</code> for both <code>RESOURCE</code> and <code>PRINCIPAL</code>: each should be <code>ASSOCIATED</code>. In a participant account, <code>aws ec2 describe-subnets</code> now lists the subnets with the network account as <code>OwnerId</code>.</li>
  <li><strong>Publish discovery data.</strong> Because tags don't flow to participants, write subnet IDs and AZ IDs to SSM Parameter Store (shared or replicated per account), or expose them as module outputs that application IaC reads.</li>
  <li><strong>Participants deploy.</strong> Each team creates its own security groups and launches resources into the shared subnets with its own roles. Their SCPs and IAM still apply in their account.</li>
  <li><strong>Operate.</strong> Owner monitors IP consumption per subnet (IPAM, CloudWatch), keeps VPC flow logs to the Log Archive account, and handles new subnets by adding them to the existing share. Changes to routing go through the network team's change process, not through each application team.</li>
  <li><strong>Govern.</strong> SCPs deny creation of IGWs, NAT gateways, VPC peering and new VPCs in workload accounts (so the shared network can't be bypassed), and deny RAM shares with external principals everywhere.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: the centralised network account", html: DG_0607_HUB + `
<p>The AWS multi-account guidance puts a <strong>Network account</strong> in the <strong>Infrastructure OU</strong> (M06.08). It owns the shared network, and RAM is how every other account consumes it. The building blocks below are covered in detail in M09 (VPC core), M10 (VPC connectivity and endpoints) and M11 (hybrid); here we focus on who owns what and how it is shared.</p>

<h3>1. Transit Gateway hub shared via RAM</h3>
<p>The network account creates the Transit Gateway and shares it with the Workloads OU. Each spoke account then creates a <strong>TGW attachment</strong> from its own VPC (or the network account creates it for shared VPCs). Key behaviours:</p>
<ul>
  <li>The attachment is created by the spoke, but <strong>TGW route tables, associations and propagations belong to the TGW owner only</strong>. This is the separation you want: a spoke can plug in but can't decide what it can reach.</li>
  <li>The TGW setting <strong>Auto accept shared attachments</strong> is off by default, so the owner must accept each new attachment. Turn it on only if attachments are automatically associated to a safe default route table (for example an isolated "quarantine" table).</li>
  <li>A TGW and its share are <strong>Regional</strong>. Multi-Region designs use one TGW per Region plus TGW peering (M10).</li>
</ul>

<h3>2. Shared VPCs, or VPC per account, or both</h3>
<p>Two valid models coexist:</p>
<ul>
  <li><strong>Shared VPC (VPC sharing):</strong> fewer VPCs, no per-account NAT/endpoints, simplest east-west traffic. Best for many small teams with similar trust levels in the same environment.</li>
  <li><strong>VPC per account attached to TGW:</strong> each account owns its VPC (often allocated from a shared IPAM pool), giving stronger network isolation and team autonomy. Best for regulated workloads, very large teams or workloads needing their own routing.</li>
</ul>
<p>Most landing zones mix them: shared VPCs per environment for the long tail of applications, dedicated VPCs for a few special ones, all joined by the TGW.</p>

<h3>3. Centralised egress and inspection</h3>
<p>Instead of NAT gateways in every VPC, spokes send <code>0.0.0.0/0</code> to the TGW, which routes to an <strong>egress VPC</strong> with NAT gateways in each AZ. An <strong>inspection VPC</strong> running AWS Network Firewall (or third-party appliances behind a Gateway Load Balancer) can sit in that path for north-south and east-west traffic; its TGW attachment needs appliance mode for symmetric routing (M10, M08). Firewall policies and rule groups can themselves be shared with RAM, or managed by AWS Firewall Manager across the organisation.</p>

<h3>4. Centralised endpoints and DNS</h3>
<ul>
  <li><strong>Interface endpoints</strong> (PrivateLink) for services like STS, SSM, ECR and KMS can live in a shared services VPC. Spokes reach them via the TGW, and DNS works because a private hosted zone for each endpoint name is associated with the spoke VPCs. That association is a <strong>Route 53 cross-account authorisation, not RAM</strong> (or, more recently, a Route 53 Profile shared through RAM that carries the hosted-zone associations).</li>
  <li><strong>Route 53 Resolver endpoints</strong> (inbound and outbound) live in the network account. <strong>Resolver forwarding rules</strong> (e.g. "corp.example.com → 10.0.0.10, 10.0.0.11") are shared via RAM; each spoke associates the rules with its VPCs. One set of rules, maintained once, used everywhere. In a shared VPC, the owner associates them once for all participants.</li>
</ul>

<h3>5. Shared IP plan and building blocks</h3>
<ul>
  <li><strong>IPAM pools</strong> shared via RAM let workload accounts allocate VPC CIDRs only from approved, non-overlapping ranges. The IPAM itself is typically run from a delegated administrator account (the network account).</li>
  <li><strong>Customer managed prefix lists</strong> (e.g. "corporate egress IPs", "on-prem ranges") are shared so teams reference one maintained list in SG rules and routes instead of copying CIDRs.</li>
</ul>

<h3>Controlling RAM with SCPs</h3>
<p>RAM exposes condition keys that make it easy to keep sharing internal: <code>ram:RequestedAllowsExternalPrincipals</code> (is the share open to outsiders?), <code>ram:RequestedResourceType</code>, <code>ram:ResourceShareName</code> and <code>ram:Principal</code>. The most common guardrail denies <code>ram:CreateResourceShare</code> and <code>ram:UpdateResourceShare</code> when external principals are requested (see examples). A second common one lets only the network account (or a specific pipeline role) share network resource types.</p>` },

    { type: "examples", html: `
<h3>Example 1: enable sharing with Organizations (management account 999988887777)</h3>
<pre><code>$ aws ram enable-sharing-with-aws-organization --profile org-mgmt
{
    "returnValue": true
}

# Confirm trusted access is on for RAM
$ aws organizations list-aws-service-access-for-organization \\
    --query "EnabledServicePrincipals[?ServicePrincipal=='ram.amazonaws.com']" --profile org-mgmt
[
    {
        "ServicePrincipal": "ram.amazonaws.com",
        "DateEnabled": "2026-09-14T09:12:41.512000+00:00"
    }
]</code></pre>

<h3>Example 2: share two subnets with the Workloads/Prod OU (network account 111122223333)</h3>
<pre><code>$ aws ram create-resource-share --profile network --region eu-west-1 \\
    --name prod-shared-vpc-app-tier \\
    --resource-arns \\
      arn:aws:ec2:eu-west-1:111122223333:subnet/subnet-0a1b2c3d4e5f60001 \\
      arn:aws:ec2:eu-west-1:111122223333:subnet/subnet-0a1b2c3d4e5f60002 \\
    --principals arn:aws:organizations::999988887777:ou/o-a1b2c3d4e5/ou-ab12-11111111 \\
    --no-allow-external-principals \\
    --tags key=owner,value=network-team
{
    "resourceShare": {
        "resourceShareArn": "arn:aws:ram:eu-west-1:111122223333:resource-share/7ab63972-b505-7e2a-420d-6f5d3EXAMPLE",
        "name": "prod-shared-vpc-app-tier",
        "owningAccountId": "111122223333",
        "allowExternalPrincipals": false,
        "status": "ACTIVE",
        "tags": [ { "key": "owner", "value": "network-team" } ],
        "creationTime": "2026-09-14T09:20:03.118000+00:00",
        "lastUpdatedTime": "2026-09-14T09:20:03.118000+00:00",
        "featureSet": "STANDARD"
    }
}</code></pre>
<p>Notes: the OU ARN contains the <strong>management account's</strong> ID (999988887777), not the network account's. No <code>--permission-arns</code> was passed, so the default AWS managed permission for subnets applies. The share is created in eu-west-1 only; subnets in another Region need a share in that Region.</p>

<h3>Example 3: check the associations</h3>
<pre><code>$ aws ram get-resource-share-associations --profile network --region eu-west-1 \\
    --association-type PRINCIPAL \\
    --resource-share-arns arn:aws:ram:eu-west-1:111122223333:resource-share/7ab63972-b505-7e2a-420d-6f5d3EXAMPLE
{
    "resourceShareAssociations": [
        {
            "resourceShareArn": "arn:aws:ram:eu-west-1:111122223333:resource-share/7ab63972-b505-7e2a-420d-6f5d3EXAMPLE",
            "resourceShareName": "prod-shared-vpc-app-tier",
            "associatedEntity": "arn:aws:organizations::999988887777:ou/o-a1b2c3d4e5/ou-ab12-11111111",
            "associationType": "PRINCIPAL",
            "status": "ASSOCIATED",
            "creationTime": "2026-09-14T09:20:04.207000+00:00",
            "lastUpdatedTime": "2026-09-14T09:20:06.991000+00:00",
            "external": false
        }
    ]
}

# Same call with --association-type RESOURCE lists each subnet ARN and its status.
# Status FAILED usually means: sharing with Organizations not enabled, a default-VPC subnet,
# or an SCP denying the share. statusMessage explains which.</code></pre>

<h3>Example 4: what the participant (444455556666) sees</h3>
<pre><code>$ aws ram list-resources --resource-owner OTHER-ACCOUNTS --profile payments-prod --region eu-west-1 \\
    --query "resources[].{Arn:arn,Type:type,Share:resourceShareArn}" --output table
-----------------------------------------------------------------------------------------------
|                                        ListResources                                        |
+--------------------------------------------------------------------+-------+---------------+
|                                Arn                                 | Share |     Type      |
+--------------------------------------------------------------------+-------+---------------+
|  arn:aws:ec2:eu-west-1:111122223333:subnet/subnet-0a1b2c3d4e5f60001 |  …    |  ec2:Subnet   |
|  arn:aws:ec2:eu-west-1:111122223333:subnet/subnet-0a1b2c3d4e5f60002 |  …    |  ec2:Subnet   |
+--------------------------------------------------------------------+-------+---------------+

$ aws ec2 describe-subnets --profile payments-prod --region eu-west-1 \\
    --query "Subnets[].[SubnetId,OwnerId,AvailabilityZone,AvailabilityZoneId,CidrBlock]" --output text
subnet-0a1b2c3d4e5f60001  111122223333  eu-west-1c  euw1-az1  10.20.1.0/24
subnet-0a1b2c3d4e5f60002  111122223333  eu-west-1a  euw1-az2  10.20.2.0/24</code></pre>
<p>The <code>OwnerId</code> column shows the subnets belong to the network account. Notice the AZ names: that is the next example.</p>

<h3>Example 5: AZ name vs AZ ID, worked through</h3>
<p>Run <code>aws ec2 describe-availability-zones --query "AvailabilityZones[].[ZoneName,ZoneId]" --output text</code> in each account. Suppose the mappings are:</p>
<table>
<thead><tr><th>AZ ID (physical)</th><th>Network account sees</th><th>Payments account sees</th><th>Analytics account sees</th></tr></thead>
<tbody>
<tr><td><code>euw1-az1</code></td><td>eu-west-1a</td><td>eu-west-1c</td><td>eu-west-1b</td></tr>
<tr><td><code>euw1-az2</code></td><td>eu-west-1b</td><td>eu-west-1a</td><td>eu-west-1c</td></tr>
<tr><td><code>euw1-az3</code></td><td>eu-west-1c</td><td>eu-west-1b</td><td>eu-west-1a</td></tr>
</tbody></table>
<ol>
  <li>The network team creates "app subnet A" with <code>--availability-zone-id euw1-az1</code>. In the network account it shows as eu-west-1a.</li>
  <li>The payments team reads a wiki page saying "app subnet A is in eu-west-1a". In its own account, eu-west-1a is <strong>euw1-az2</strong>. It deploys an ElastiCache node in its own (non-shared) VPC in "eu-west-1a" to sit next to its app servers. They are actually in different physical AZs: every cache call crosses AZs, adding latency and inter-AZ data transfer charges, and an outage of euw1-az1 and one of euw1-az2 now both hurt the service.</li>
  <li>Worse, the analytics team is told "use eu-west-1a and eu-west-1b for HA, next to the network team's subnets A and B". In analytics, eu-west-1a is euw1-az3 and eu-west-1b is euw1-az1. One of its two AZs (euw1-az3) holds neither of the shared app subnets, so half its traffic to the app tier crosses AZs. The names "matched" on paper and meant nothing.</li>
  <li><strong>Fix:</strong> the network team documents and exports subnets by AZ ID (<code>prod-app-euw1-az1</code>), application IaC filters subnets by <code>AvailabilityZoneId</code>, and capacity reservations, cache nodes and replicas are placed by AZ ID too.</li>
</ol>
<div class="callout tip">Quick check for a learner: the analytics account wants a reader instance in the same physical AZ as the network team's "eu-west-1c" subnet. Network eu-west-1c = euw1-az3; analytics sees euw1-az3 as <strong>eu-west-1a</strong>.</div>

<h3>Example 6: share the Transit Gateway and accept a spoke attachment</h3>
<pre><code># Network account: share the TGW with the whole Workloads OU
$ aws ram create-resource-share --profile network --region eu-west-1 \\
    --name tgw-euw1 \\
    --resource-arns arn:aws:ec2:eu-west-1:111122223333:transit-gateway/tgw-0c2d3e4f5a6b70001 \\
    --principals arn:aws:organizations::999988887777:ou/o-a1b2c3d4e5/ou-ab12-11111111 \\
    --no-allow-external-principals

# Spoke account 777788889999: attach its own VPC
$ aws ec2 create-transit-gateway-vpc-attachment --profile analytics-prod --region eu-west-1 \\
    --transit-gateway-id tgw-0c2d3e4f5a6b70001 --vpc-id vpc-0f9e8d7c6b5a40001 \\
    --subnet-ids subnet-0aa1 subnet-0bb2 subnet-0cc3
# → State: pendingAcceptance (auto-accept is off)

# Network account: accept, then associate with the right TGW route table
$ aws ec2 accept-transit-gateway-vpc-attachment --profile network --region eu-west-1 \\
    --transit-gateway-attachment-id tgw-attach-0123456789abcdef0</code></pre>

<h3>Example 7: SCP that blocks sharing outside the organisation</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyExternalResourceShares",
      "Effect": "Deny",
      "Action": ["ram:CreateResourceShare", "ram:UpdateResourceShare"],
      "Resource": "*",
      "Condition": {
        "Bool": { "ram:RequestedAllowsExternalPrincipals": "true" }
      }
    },
    {
      "Sid": "DenyAcceptingExternalInvitations",
      "Effect": "Deny",
      "Action": "ram:AcceptResourceShareInvitation",
      "Resource": "*"
    }
  ]
}</code></pre>
<p>Attach at the root (M06.03). The first statement stops anyone from creating a share that is open to outsiders. The second stops member accounts accepting invitations, which only ever arrive from outside the organisation once sharing with Organizations is enabled. Add an <code>aws:PrincipalArn</code> exception if a specific integration genuinely needs external sharing.</p>

<h3>Example 8: private hosted zone across accounts (not RAM)</h3>
<pre><code># Zone owner (network account): authorise the spoke's VPC
$ aws route53 create-vpc-association-authorization --profile network \\
    --hosted-zone-id Z0123456789ABCDEFGHIJ --vpc VPCRegion=eu-west-1,VPCId=vpc-0f9e8d7c6b5a40001

# VPC owner (spoke account): perform the association
$ aws route53 associate-vpc-with-hosted-zone --profile analytics-prod \\
    --hosted-zone-id Z0123456789ABCDEFGHIJ --vpc VPCRegion=eu-west-1,VPCId=vpc-0f9e8d7c6b5a40001

# Zone owner: clean up the authorisation (the association stays)
$ aws route53 delete-vpc-association-authorization --profile network \\
    --hosted-zone-id Z0123456789ABCDEFGHIJ --vpc VPCRegion=eu-west-1,VPCId=vpc-0f9e8d7c6b5a40001</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>40 small application teams need networking in prod but must not manage routes, NAT or firewalls</td><td>Shared VPC per environment, subnets shared via RAM to the Prod OU</td><td>Teams keep account isolation for IAM and billing; network team keeps control; no per-account NAT/endpoints</td></tr>
<tr><td>Every account's VPC must reach on-premises and each other, with segmentation</td><td>TGW in the network account shared via RAM; spokes create attachments; owner controls TGW route tables</td><td>Hub-and-spoke scales where peering meshes don't, and spokes can't change routing</td></tr>
<tr><td>All VPCs must resolve <code>corp.example.com</code> from on-premises DNS</td><td>Outbound Resolver endpoint + forwarding rules in the network account, rules shared via RAM</td><td>One set of rules maintained once; each VPC just associates them</td></tr>
<tr><td>Prevent overlapping CIDRs as accounts create their own VPCs</td><td>IPAM pools shared via RAM to the OU; SCP requiring IPAM allocation</td><td>Central IP plan enforced at allocation time, not by spreadsheet</td></tr>
<tr><td>A reporting account needs a copy of production Aurora data daily, quickly and cheaply</td><td>Share the Aurora cluster via RAM; the reporting account creates a clone</td><td>Copy-on-write clone is fast and only stores changed pages; no snapshot copy</td></tr>
<tr><td>Teams in many accounts need private TLS certificates from one corporate CA</td><td>AWS Private CA in the security account shared via RAM</td><td>One CA hierarchy and audit trail; teams issue certificates in their own accounts</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: explore RAM safely (CloudShell)", html: `
<p>Everything below is free: RAM has no charge and customer managed prefix lists cost nothing. Run it in AWS CloudShell with your <code>academy-admin</code> profile. If you have a second account (e.g. from Lab L06), use its ID as the principal; otherwise read the outputs and skip step 4.</p>
<pre><code># 1. What can be shared in this Region, and with which permissions?
aws ram list-resource-types --query "resourceTypes[].resourceType" --output text | tr '\\t' '\\n' | sort | head -40
aws ram list-permissions --resource-type ec2:Subnet \\
  --query "permissions[].{Name:name,Default:defaultVersion,Type:permissionType}" --output table

# 2. Your AZ name → AZ ID mapping (compare with a colleague's account!)
aws ec2 describe-availability-zones \\
  --query "AvailabilityZones[].[ZoneName,ZoneId]" --output table

# 3. Is sharing with Organizations enabled? (works in a member account too)
aws ram get-resource-shares --resource-owner SELF --query "resourceShares[].[name,status,allowExternalPrincipals]" --output table
aws ram get-resource-shares --resource-owner OTHER-ACCOUNTS --query "resourceShares[].[name,owningAccountId]" --output table

# 4. Share a free resource: a customer managed prefix list
PL_ARN=$(aws ec2 create-managed-prefix-list --prefix-list-name academy-office \\
  --address-family IPv4 --max-entries 5 \\
  --entries Cidr=203.0.113.0/24,Description=office \\
  --query "PrefixList.PrefixListArn" --output text)
SHARE_ARN=$(aws ram create-resource-share --name academy-pl-share \\
  --resource-arns "$PL_ARN" --principals 444455556666 \\
  --query "resourceShare.resourceShareArn" --output text)
aws ram get-resource-share-associations --association-type PRINCIPAL \\
  --resource-share-arns "$SHARE_ARN" --query "resourceShareAssociations[].[associatedEntity,status,external]"
# Outside an organisation the second account must accept:
#   aws ram get-resource-share-invitations ; aws ram accept-resource-share-invitation --resource-share-invitation-arn …

# 5. Clean up
aws ram delete-resource-share --resource-share-arn "$SHARE_ARN"
aws ec2 delete-managed-prefix-list --prefix-list-id "$(basename "$PL_ARN")"</code></pre>
<p>Replace 444455556666 with your second account's ID. In step 2, note which AZ ID your "a" is; your colleague's "a" is very possibly a different one.</p>` },

    { type: "casestudy", title: "Case study: Kestrel Logistics replaces a peering mesh", html: `
<p><strong>Situation.</strong> Kestrel Logistics, a freight company, had grown to 46 AWS accounts. Each account had its own VPC with NAT gateways in two or three AZs, and VPCs that needed to talk were connected by 70+ VPC peering connections. Three teams had picked overlapping <code>10.0.0.0/16</code> ranges, so they could never be connected. Each account also had its own copy of the on-premises DNS forwarding configuration, and two were out of date. NAT gateway hours alone cost more than the company's entire monitoring bill.</p>
<p><strong>Requirements.</strong> Keep the account-per-team model (security had just finished moving to it). Remove network administration from application teams. Central inspection of internet egress. One IP plan. Migrate without a big-bang outage.</p>
<p><strong>Design.</strong></p>
<ol>
  <li>A Network account in the Infrastructure OU, with RAM sharing with Organizations enabled from the management account and an SCP denying external shares.</li>
  <li>An IPAM with a top-level pool and per-environment pools, shared via RAM to the matching OUs.</li>
  <li>One Transit Gateway in eu-west-1, shared to the Workloads OU; separate TGW route tables for prod, non-prod and sandbox; auto-accept off.</li>
  <li>Two shared VPCs (prod and non-prod) for the 30 small services; subnets created by AZ ID and shared to the Prod and NonProd OUs.</li>
  <li>An egress VPC with NAT gateways and AWS Network Firewall; Resolver endpoints and forwarding rules shared via RAM.</li>
  <li>The 8 large or regulated workloads kept their own VPCs (re-addressed from IPAM pools where they overlapped) and attached to the TGW.</li>
</ol>
<table>
<thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>VPCs</td><td>46</td><td>13 (2 shared, 8 dedicated, 3 central)</td></tr>
<tr><td>NAT gateways</td><td>~110</td><td>3 (one per AZ in the egress VPC)</td></tr>
<tr><td>Peering connections</td><td>70+</td><td>0</td></tr>
<tr><td>Places DNS rules are maintained</td><td>46</td><td>1</td></tr>
</tbody></table>
<p><strong>Result.</strong> Monthly networking spend fell by roughly half even after adding the TGW and firewall charges, and a new team's account had working networking on the day it was vended by Account Factory (M06.04), because the OU-level shares applied automatically.</p>
<p><strong>Lessons learned.</strong> The first migrated team placed its cache by AZ <em>name</em> from a wiki page and saw cross-AZ charges spike; all docs were rewritten in AZ IDs. Participants couldn't see subnet Name tags, so the network team published subnet IDs to SSM parameters that application CDK code reads. And a planned "unshare the old subnet" step was replaced by a proper migration after load balancers in that subnet couldn't replace nodes.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Share subnets with other accounts in the organization", "central network team manages the VPC, application teams deploy resources"</td><td><strong>VPC sharing with AWS RAM</strong></td></tr>
<tr><td>"Many accounts must connect VPCs to a central hub / on-premises"</td><td>Transit Gateway in a network account, <strong>shared with RAM</strong></td></tr>
<tr><td>"Share without accepting invitations", "new accounts automatically get access"</td><td>Enable <strong>sharing with AWS Organizations</strong>; share with the org or an OU</td></tr>
<tr><td>"Forward DNS queries for on-prem domains from VPCs in many accounts"</td><td>Route 53 Resolver outbound endpoint + <strong>rules shared via RAM</strong></td></tr>
<tr><td>"Ensure resources are in the same physical AZ across accounts"</td><td>Use <strong>AZ IDs</strong> (e.g. use1-az1), not AZ names</td></tr>
<tr><td>"Prevent resources from being shared outside the organization"</td><td>SCP denying RAM actions when <code>ram:RequestedAllowsExternalPrincipals</code> is true (and/or shares created with external principals disabled)</td></tr>
<tr><td>"Reuse licences / Dedicated Hosts / Capacity Reservations across accounts"</td><td>Share License Manager configurations, hosts or reservations with RAM</td></tr>
<tr><td>"Clone a production Aurora database into another account"</td><td>Share the cluster with RAM, then clone in the other account</td></tr>
</tbody></table>
<h3>X vs Y</h3>
<table>
<thead><tr><th>VPC sharing</th><th>VPC peering / TGW</th></tr></thead>
<tbody>
<tr><td>One VPC, many accounts launch into it</td><td>Many VPCs, connected by routing</td></tr>
<tr><td>Same organisation only</td><td>Peering works across organisations; TGW shares can include external accounts</td></tr>
<tr><td>Owner controls routing; participants can't</td><td>Each VPC owner controls its own routes (TGW route tables by the TGW owner)</td></tr>
<tr><td>No overlap issue: one CIDR plan</td><td>CIDRs must not overlap</td></tr>
</tbody></table>
<p><strong>Distractors:</strong> "VPC peering to share subnets" (peering connects VPCs; it doesn't let you launch into another account's subnet); "a resource-based policy on the subnet" (subnets have none); "share the default VPC" (not allowed); "participants modify the route table to add a route" (owner only); "use RAM to share an AMI / EBS snapshot / S3 bucket / KMS key" (other mechanisms); "AZ names are the same in every account".</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Treat shared infrastructure as a product.</strong> The network account needs a backlog, change windows, SLOs and a request process (new subnet, new route, new endpoint). Without it, teams bypass the shared VPC and the estate fragments again. Make the paved road easier than the bypass.</li>
  <li><strong>Guardrails that keep the model intact:</strong> SCPs in workload OUs deny <code>ec2:CreateVpc</code>, <code>ec2:CreateInternetGateway</code>, <code>ec2:CreateNatGateway</code>, <code>ec2:CreateVpcPeeringConnection</code> and <code>ec2:AttachInternetGateway</code> (with exceptions for the Sandbox OU), plus the external-sharing deny on RAM at the root.</li>
  <li><strong>Blast radius moves to the shared VPC.</strong> A bad NACL change or route in a shared VPC affects every participant. Deploy network changes through a pipeline with peer review, small change sets and quick rollback, and keep prod and non-prod in different shared VPCs.</li>
  <li><strong>IP exhaustion is the classic failure.</strong> Many teams' Lambda ENIs, EKS pods and load balancers draw from the same subnets. Size subnets generously (/20 or larger for busy app tiers), alarm on available IPs, and add secondary CIDRs before you run out.</li>
  <li><strong>Troubleshooting playbook.</strong> Participant can't see a subnet: is sharing with Organizations enabled, is the account in the OU, is the share in the same Region, is the association ASSOCIATED or FAILED (read <code>statusMessage</code>)? Launch fails in a shared subnet: does the participant use its own security group (not the owner's default SG), and is the subnet out of IPs? Spoke can't reach anything through the TGW: is the attachment pendingAcceptance, associated with a route table, and do both the TGW route table and the VPC route table have routes?</li>
  <li><strong>Visibility.</strong> Participants can't see each other, but the owner's VPC flow logs see everything: send them to the Log Archive account. IAM Access Analyzer doesn't cover every RAM type, so also inventory shares with <code>aws ram get-resource-shares</code> in each Region (or AWS Config).</li>
  <li><strong>Cost allocation.</strong> NAT, endpoint, firewall and TGW charges land in the network account. Decide up front how to charge back (flat fee per account, or by bytes using flow logs and TGW metrics) and use cost allocation tags (M06.08).</li>
  <li><strong>Regions.</strong> Shares are Regional. Your IaC for a new Region must create the TGW, VPCs and the RAM shares there too; forgetting the share is the most common "works in Ireland, not in Frankfurt" bug.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li><strong>AWS RAM</strong> shares resources that must appear inside other accounts: subnets, Transit Gateways, Resolver rules, prefix lists, IPAM pools, Network Firewall policies, Private CA, capacity reservations, License Manager configurations, Aurora clusters and more. RAM is free.</li>
  <li>A <strong>resource share</strong> = resources + principals (org, OU, account, sometimes IAM roles/users) + managed permission, and it is Regional.</li>
  <li>Run <code>enable-sharing-with-aws-organization</code> once in the management account: shares inside the org need no invitation and OU shares follow accounts as they move. Outside the org, invitations must be accepted.</li>
  <li><strong>VPC sharing:</strong> owner manages VPC, subnets, routes, NACLs, gateways and endpoints; participants manage their own resources and security groups, can't change the network and can't see each other. Same organisation only; no default VPC.</li>
  <li>Use <strong>AZ IDs</strong> (euw1-az1) across accounts; AZ names differ per account.</li>
  <li>A <strong>centralised network account</strong> shares a TGW (owner controls route tables, accepts attachments), runs egress/inspection and central endpoints, and shares Resolver rules and IPAM pools.</li>
  <li>Private hosted zone association across accounts uses Route 53 authorisation, not RAM; AMIs, snapshots, S3, KMS use their own sharing mechanisms.</li>
  <li>Choose <strong>RAM</strong> to place/attach into someone's resource, a <strong>resource-based policy</strong> to read/write data in it, a <strong>cross-account role</strong> to operate inside another account.</li>
  <li>Guard it with SCPs: deny shares when <code>ram:RequestedAllowsExternalPrincipals</code> is true, and deny workload accounts the ability to build their own internet paths.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.07-d1", q: "Which AWS CLI command, run once from the management account, lets RAM share with the organisation and OUs without invitations? (the <code>aws ram</code> subcommand)", answers: ["enable-sharing-with-aws-organization", "aws ram enable-sharing-with-aws-organization", "ram enable-sharing-with-aws-organization"], hint: "enable-…-with-aws-organization", explain: "<code>aws ram enable-sharing-with-aws-organization</code> enables trusted access for RAM in AWS Organizations." },
    { id: "M06.07-d2", q: "Can subnets of a default VPC be shared with VPC sharing? (yes/no)", answers: ["no", "n"], explain: "Default VPC subnets can't be shared. Create a purpose-built VPC in the network account." },
    { id: "M06.07-d3", q: "In a shared VPC, who adds a route to the subnet's route table: the owner or the participant?", answers: ["owner", "the owner", "vpc owner", "the vpc owner"], explain: "Route tables, NACLs, gateways and endpoints are owner-only. Participants can't modify them." },
    { id: "M06.07-d4", q: "In a shared VPC, which account creates and owns the security groups attached to a participant's EC2 instances: owner or participant?", answers: ["participant", "the participant"], explain: "Participants create their own SGs and can't use the owner's default SG (unless the owner explicitly shares SGs)." },
    { id: "M06.07-d5", q: "The network account created a subnet in its <code>eu-west-1c</code>. Its mapping is a=euw1-az1, b=euw1-az2, c=euw1-az3. The analytics account's mapping is a=euw1-az3, b=euw1-az1, c=euw1-az2. Which AZ name will the analytics account see for that subnet?", answers: ["eu-west-1a", "euw1-1a", "1a", "a"], hint: "Translate name → ID in the owner account, then ID → name in the participant.", explain: "Network eu-west-1c = euw1-az3. In analytics, euw1-az3 is eu-west-1a." },
    { id: "M06.07-d6", q: "Which RAM condition key do you test in an SCP to deny creating resource shares that allow principals outside the organisation? (format service:Key)", answers: ["ram:RequestedAllowsExternalPrincipals", "RequestedAllowsExternalPrincipals"], explain: "Deny ram:CreateResourceShare and ram:UpdateResourceShare when <code>ram:RequestedAllowsExternalPrincipals</code> is true." },
    { id: "M06.07-d7", q: "Is AWS RAM used to associate a Route 53 private hosted zone with a VPC in another account? (yes/no)", answers: ["no", "n"], explain: "The zone owner runs <code>create-vpc-association-authorization</code>; the VPC owner runs <code>associate-vpc-with-hosted-zone</code>." },
    { id: "M06.07-d8", q: "In a shared VPC, which account pays the hourly charge for the NAT gateway the network team created: owner or participant?", answers: ["owner", "the owner", "vpc owner", "network account"], explain: "The owner pays hourly and processing charges for gateways and endpoints it creates; participants pay for their own resources and their data transfer." },
    { id: "M06.07-d9", q: "A spoke account creates a TGW attachment to a shared Transit Gateway that has auto-accept turned off. What state is the attachment in until the owner acts? (one word, as the API shows it)", answers: ["pendingAcceptance", "pending acceptance", "pending-acceptance", "pendingacceptance"], explain: "The TGW owner must run <code>accept-transit-gateway-vpc-attachment</code>, then associate it with a TGW route table." },
    { id: "M06.07-d10", q: "Which <code>--association-type</code> value of <code>aws ram get-resource-share-associations</code> lists the accounts/OUs a share is associated with? (PRINCIPAL / RESOURCE)", answers: ["PRINCIPAL", "principal"], explain: "PRINCIPAL lists who the share is for; RESOURCE lists the shared resource ARNs." }
  ],
  check: [
    { id: "M06.07-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company has 35 application accounts in AWS Organizations. A central network team must control all routing, NAT and firewalling, while application teams launch EC2 instances and RDS databases in their own accounts. The company wants the LEAST operational overhead and no duplicated NAT gateways. What should the architect do?",
      options: [
        { t: "Create VPCs in a network account and share their subnets with the application accounts' OU using AWS RAM", c: true, why: "VPC sharing keeps routing and gateways in the network account while each team's resources and bills stay in their own accounts." },
        { t: "Create a VPC in each application account and connect them with VPC peering", c: false, why: "Duplicates NAT and endpoints in every VPC and creates an unmanageable peering mesh; teams would control their own routes." },
        { t: "Create IAM roles in the network account that application teams assume to launch resources there", c: false, why: "Resources would belong to the network account, losing per-team account isolation, quotas and billing." },
        { t: "Add a resource-based policy to each subnet that allows the application accounts", c: false, why: "Subnets don't support resource-based policies; RAM is the sharing mechanism." }
      ] },
    { id: "M06.07-k2", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "Which statements about VPC sharing with AWS RAM are correct?",
      options: [
        { t: "Participants create and manage their own security groups for the resources they launch", c: true, why: "Each participant owns its SGs; it can't use the owner's default SG." },
        { t: "The VPC owner and participants must belong to the same AWS organisation", c: true, why: "Subnets can only be shared within the organisation, with sharing with Organizations enabled." },
        { t: "Participants can edit the network ACL of a shared subnet to open a port", c: false, why: "NACLs and route tables are owner-only." },
        { t: "Subnets of the default VPC can be shared to save setup time", c: false, why: "Default VPC subnets can't be shared." },
        { t: "A participant can list the EC2 instances other participants run in the same subnet", c: false, why: "Participants can see only their own resources." }
      ] },
    { id: "M06.07-k3", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A network account owns a Transit Gateway. Every account created in the Workloads OU in the future must be able to attach its VPC to the Transit Gateway without anyone accepting a resource share invitation. What should the architect do?",
      options: [
        { t: "Enable resource sharing with AWS Organizations from the management account, and share the Transit Gateway with the Workloads OU using AWS RAM", c: true, why: "OU principals include future accounts automatically, and inside the org no invitation is needed." },
        { t: "Share the Transit Gateway with each account ID as it is created, and accept each invitation", c: false, why: "Works but requires manual steps for every new account." },
        { t: "Create VPC peering from every new VPC to the network account's VPC", c: false, why: "Peering doesn't share the Transit Gateway and doesn't scale." },
        { t: "Attach an SCP to the Workloads OU that allows ec2:CreateTransitGatewayVpcAttachment", c: false, why: "SCPs never grant access, and they can't make another account's TGW visible." }
      ] },
    { id: "M06.07-k4", type: "single", domain: "D4", task: "4.4", level: 300,
      stem: "A participant account runs application servers in a shared subnet in the network account's eu-west-1a. To avoid inter-AZ data transfer charges, it must place an ElastiCache node in the same physical Availability Zone in its own VPC. How should it choose the AZ?",
      options: [
        { t: "Look up the shared subnet's AZ ID and place the node in the subnet with that AZ ID in its own account", c: true, why: "AZ IDs identify the same physical AZ in every account; AZ names can map differently per account." },
        { t: "Use eu-west-1a, because AZ names are the same in all accounts", c: false, why: "AZ names are mapped per account; eu-west-1a may be a different physical AZ in the participant account." },
        { t: "Use a placement group spanning both accounts", c: false, why: "Placement groups are per account and don't solve AZ name mapping." },
        { t: "Ask AWS Support to align the AZ names of the two accounts", c: false, why: "You don't change mappings; you use AZ IDs." }
      ] },
    { id: "M06.07-k5", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "VPCs in 50 accounts must resolve the on-premises domain corp.example.com through a Direct Connect link. The network team wants to maintain the forwarding configuration in one place. What is the MOST operationally efficient design?",
      options: [
        { t: "Create a Route 53 Resolver outbound endpoint and forwarding rules in the network account, share the rules with AWS RAM, and associate them with each VPC", c: true, why: "Rules are defined once and shared; each VPC just associates them." },
        { t: "Run DNS forwarder EC2 instances in each account", c: false, why: "50 sets of servers to patch and keep consistent." },
        { t: "Create a private hosted zone for corp.example.com in each account with copies of the on-premises records", c: false, why: "Duplicates records and drifts from the on-premises source of truth." },
        { t: "Share the on-premises DNS servers with AWS RAM", c: false, why: "RAM shares AWS resources, not on-premises servers." }
      ] },
    { id: "M06.07-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A security team must ensure that no account in the organisation can share AWS resources with AWS accounts outside the organisation, including in accounts created later. Which control meets this requirement?",
      options: [
        { t: "An SCP at the organisation root that denies ram:CreateResourceShare and ram:UpdateResourceShare when ram:RequestedAllowsExternalPrincipals is true", c: true, why: "Preventive, applies to every current and future member account, and targets exactly the risky setting." },
        { t: "An IAM policy in the management account that denies ram:*", c: false, why: "Identity policies in one account don't affect principals in member accounts." },
        { t: "Disable trusted access for AWS RAM in AWS Organizations", c: false, why: "That stops org-wide sharing (and VPC sharing) but doesn't prevent sharing with external account IDs via invitations." },
        { t: "A weekly report of resource shares reviewed by the security team", c: false, why: "Detective and delayed; the requirement is to prevent it." }
      ] }
  ],
  cards: ["fc-M06-7-01", "fc-M06-7-02", "fc-M06-7-03", "fc-M06-7-04", "fc-M06-7-05", "fc-M06-7-06", "fc-M06-7-07", "fc-M06-7-08", "fc-M06-7-09", "fc-M06-7-10", "fc-M06-7-11"],
  references: [
    "AWS RAM User Guide: <em>What is AWS Resource Access Manager?</em>, <em>Enable resource sharing within AWS Organizations</em>, <em>Shareable AWS resources</em>, <em>Managing permissions in AWS RAM</em>",
    "AWS RAM API Reference / AWS CLI Command Reference: <code>create-resource-share</code>, <code>enable-sharing-with-aws-organization</code>, <code>get-resource-share-associations</code>, <code>list-resources</code>",
    "Amazon VPC User Guide: <em>Share your VPC with other accounts</em> (VPC sharing prerequisites, limitations and billing)",
    "AWS RAM User Guide: <em>Availability Zone IDs for your AWS resources</em>",
    "Amazon VPC Transit Gateways Guide: <em>Sharing a transit gateway</em>",
    "Amazon Route 53 Developer Guide: <em>Sharing forwarding rules with other AWS accounts</em> and <em>Associating an Amazon VPC and a private hosted zone that you created with different AWS accounts</em>",
    "AWS whitepaper: <em>Building a Scalable and Secure Multi-VPC AWS Network Infrastructure</em>",
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em> (Infrastructure OU, Network account)",
    "AWS Organizations User Guide: <em>Example SCPs</em> (preventing external sharing with AWS RAM)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-7-01", front: "What is an AWS RAM resource share?", back: "A Regional object in the owner account: resources (ARNs) + principals (org, OU, account, some IAM roles/users) + a managed permission per type. RAM is free." },
  { id: "fc-M06-7-02", front: "What does enable-sharing-with-aws-organization do?", back: "Run once in the management account: enables trusted access for RAM, allows org/OU principals, removes invitations inside the org; required for VPC sharing." },
  { id: "fc-M06-7-03", front: "Sharing with an account outside your organisation?", back: "The account receives an invitation it must accept (and the share must allow external principals)." },
  { id: "fc-M06-7-04", front: "VPC sharing: what does the owner manage?", back: "VPC, subnets, CIDRs, route tables, NACLs, IGW/NAT, TGW/VPN attachments, gateway endpoints, DHCP options, VPC flow logs. Pays for those." },
  { id: "fc-M06-7-05", front: "VPC sharing: what does a participant manage?", back: "Its own resources (EC2, RDS, ELB, Lambda ENIs…) and its own security groups; pays for them. Can't change the network or see other participants." },
  { id: "fc-M06-7-06", front: "Three VPC sharing restrictions?", back: "Same organisation only; default VPC subnets can't be shared; owner can't delete subnets with participant resources (unsharing leaves them running)." },
  { id: "fc-M06-7-07", front: "AZ name vs AZ ID?", back: "Names (eu-west-1a) map to physical AZs per account; IDs (euw1-az1) are the same everywhere. Use IDs to align placement across accounts." },
  { id: "fc-M06-7-08", front: "Shared Transit Gateway: who controls what?", back: "Spokes create attachments from their VPCs; the TGW owner accepts them (auto-accept off by default) and owns TGW route tables, associations and propagations." },
  { id: "fc-M06-7-09", front: "Hybrid DNS for VPCs in many accounts?", back: "Resolver outbound endpoint + forwarding rules in the network account; share the rules via RAM; each VPC associates them." },
  { id: "fc-M06-7-10", front: "Common things NOT shared with RAM?", back: "AMIs, EBS/RDS snapshots (permissions/attributes), S3, KMS, SQS, SNS, ECR, Secrets Manager (resource policies), private hosted zone ↔ VPC (Route 53 authorisation)." },
  { id: "fc-M06-7-11", front: "RAM vs resource policy vs cross-account role?", back: "RAM: place/attach into an owner's resource (subnet, TGW). Resource policy: read/write data in it (S3, KMS). Role: operate inside another account." }
);
// ================================================================== 08_reference_arch.js
/* ---------------------------------------------------------------- M06.08 Reference multi-account architecture */
var DG_0608_TREE = `
<figure>
<svg class="diagram" viewBox="0 0 760 448" role="img" aria-labelledby="m0608at m0608ad">
  <title id="m0608at">Reference OU and account tree</title>
  <desc id="m0608ad">The organization root has a management account used only for billing, Organizations and Control Tower. Below the root are three foundational and workload OUs: the Security OU with the Log Archive and Security Tooling accounts, the Infrastructure OU with the Network and Shared Services accounts, and the Workloads OU split into a Prod OU and an SDLC OU that hold one account per workload and environment. Below them are additional OUs added only when needed: Sandbox, Deployments, Policy Staging, Suspended, Exceptions, Transitional and Individual Business Users.</desc>
  <rect class="dg-box" x="300" y="14" width="160" height="40" rx="8"/>
  <text class="dg-tb" x="326" y="39">Root (r-ab12)</text>
  <rect class="dg-bad" x="520" y="12" width="228" height="46" rx="8"/>
  <text class="dg-tb" x="532" y="31">Management account</text>
  <text class="dg-ts" x="532" y="49">billing, Organizations, CT</text>
  <path class="dg-link" d="M460 34 H520" stroke-dasharray="4 4"/>

  <path class="dg-line" d="M380 54 V72"/>
  <path class="dg-line" d="M127 72 H622"/>
  <path class="dg-line" d="M127 72 V88"/>
  <path class="dg-line" d="M369 72 V88"/>
  <path class="dg-line" d="M622 72 V88"/>

  <rect class="dg-region" x="12" y="88" width="230" height="150" rx="10"/>
  <text class="dg-ta" x="24" y="108">Security OU</text>
  <rect class="dg-good" x="24" y="118" width="206" height="48" rx="6"/>
  <text class="dg-tb" x="36" y="138">Log Archive</text>
  <text class="dg-ts" x="36" y="156">org trail, Config, flow logs</text>
  <rect class="dg-good" x="24" y="176" width="206" height="50" rx="6"/>
  <text class="dg-tb" x="36" y="196">Security Tooling</text>
  <text class="dg-ts" x="36" y="214">Audit · delegated admins</text>

  <rect class="dg-region" x="254" y="88" width="230" height="150" rx="10"/>
  <text class="dg-ta" x="266" y="108">Infrastructure OU</text>
  <rect class="dg-edge" x="266" y="118" width="206" height="48" rx="6"/>
  <text class="dg-tb" x="278" y="138">Network</text>
  <text class="dg-ts" x="278" y="156">TGW, IPAM, egress, DX/VPN</text>
  <rect class="dg-edge" x="266" y="176" width="206" height="50" rx="6"/>
  <text class="dg-tb" x="278" y="196">Shared Services</text>
  <text class="dg-ts" x="278" y="214">AD, image factory, tooling</text>

  <rect class="dg-region" x="496" y="88" width="252" height="150" rx="10"/>
  <text class="dg-ta" x="508" y="108">Workloads OU</text>
  <rect class="dg-az" x="508" y="116" width="112" height="112" rx="8"/>
  <text class="dg-ta" x="518" y="134">Prod OU</text>
  <rect class="dg-box" x="516" y="142" width="96" height="34" rx="5"/>
  <text class="dg-ts" x="526" y="163">shop-prod</text>
  <rect class="dg-box" x="516" y="184" width="96" height="34" rx="5"/>
  <text class="dg-ts" x="526" y="205">pay-prod</text>
  <rect class="dg-az" x="628" y="116" width="110" height="112" rx="8"/>
  <text class="dg-ta" x="638" y="134">SDLC OU</text>
  <rect class="dg-box" x="635" y="142" width="96" height="34" rx="5"/>
  <text class="dg-ts" x="645" y="163">shop-dev</text>
  <rect class="dg-box" x="635" y="184" width="96" height="34" rx="5"/>
  <text class="dg-ts" x="645" y="205">pay-test</text>

  <text class="dg-ta" x="12" y="266">Additional OUs (also children of the root; add each one when the need appears)</text>
  <rect class="dg-box" x="12" y="278" width="176" height="56" rx="8"/>
  <text class="dg-tb" x="24" y="300">Sandbox OU</text>
  <text class="dg-ts" x="24" y="320">isolated, budget-capped</text>
  <rect class="dg-box" x="198" y="278" width="176" height="56" rx="8"/>
  <text class="dg-tb" x="210" y="300">Deployments OU</text>
  <text class="dg-ts" x="210" y="320">CI/CD pipelines</text>
  <rect class="dg-box" x="384" y="278" width="176" height="56" rx="8"/>
  <text class="dg-tb" x="396" y="300">Policy Staging OU</text>
  <text class="dg-ts" x="396" y="320">test SCP/RCP changes</text>
  <rect class="dg-bad" x="570" y="278" width="178" height="56" rx="8"/>
  <text class="dg-tb" x="582" y="300">Suspended OU</text>
  <text class="dg-ts" x="582" y="320">deny-all SCP, closing</text>

  <rect class="dg-box" x="12" y="344" width="176" height="56" rx="8"/>
  <text class="dg-tb" x="24" y="366">Exceptions OU</text>
  <text class="dg-ts" x="24" y="386">approved guardrail gaps</text>
  <rect class="dg-box" x="198" y="344" width="176" height="56" rx="8"/>
  <text class="dg-tb" x="210" y="366">Transitional OU</text>
  <text class="dg-ts" x="210" y="386">acquired / migrating</text>
  <rect class="dg-box" x="384" y="344" width="364" height="56" rx="8"/>
  <text class="dg-tb" x="396" y="366">Individual Business Users OU</text>
  <text class="dg-ts" x="396" y="386">non-IT teams with a few approved services</text>

  <text class="dg-ts" x="12" y="428">Guardrails attach to OUs, not to single accounts. Split prod and non-prod inside an OU when their controls differ.</text>
</svg>
<figcaption>Figure M06-8a. The reference organization from the AWS whitepaper "Organizing your AWS environment using multiple accounts" and the AWS Security Reference Architecture. Foundational OUs first (Security, Infrastructure), then Workloads; every other OU is optional.</figcaption>
</figure>`;

var DG_0608_FLOWS = `
<figure>
<svg class="diagram" viewBox="0 0 760 410" role="img" aria-labelledby="m0608bt m0608bd">
  <title id="m0608bt">Security and log data flows</title>
  <desc id="m0608bd">Every member account produces CloudTrail events through the organization trail, AWS Config history, and VPC Flow Logs and load balancer logs. These flow into a write-once S3 bucket in the Log Archive account that is encrypted with KMS, versioned and protected by Object Lock. Findings from GuardDuty detectors, Security Hub and Inspector, and analysis of resource policies flow to the delegated administrators in the Security Tooling account, which also aggregates Config data and queries the log bucket read-only with Athena. Security Hub sends findings through EventBridge to SNS and ticketing.</desc>
  <defs><marker id="m0608b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-region" x="12" y="36" width="220" height="300" rx="10"/>
  <text class="dg-ta" x="24" y="56">Every member account</text>
  <rect class="dg-box" x="24" y="68" width="196" height="36" rx="6"/><text class="dg-t" x="36" y="91">CloudTrail (org trail)</text>
  <rect class="dg-box" x="24" y="112" width="196" height="36" rx="6"/><text class="dg-t" x="36" y="135">AWS Config recorder</text>
  <rect class="dg-box" x="24" y="156" width="196" height="36" rx="6"/><text class="dg-t" x="36" y="179">VPC Flow Logs, ELB logs</text>
  <rect class="dg-box" x="24" y="200" width="196" height="36" rx="6"/><text class="dg-t" x="36" y="223">GuardDuty detector</text>
  <rect class="dg-box" x="24" y="244" width="196" height="36" rx="6"/><text class="dg-t" x="36" y="267">Security Hub, Inspector</text>
  <rect class="dg-box" x="24" y="288" width="196" height="36" rx="6"/><text class="dg-t" x="36" y="311">Resource policies</text>

  <rect class="dg-region" x="290" y="36" width="200" height="150" rx="10"/>
  <text class="dg-ta" x="302" y="56">Log Archive account</text>
  <rect class="dg-good" x="302" y="68" width="176" height="106" rx="6"/>
  <text class="dg-tb" x="314" y="88">S3 log bucket</text>
  <text class="dg-ts" x="314" y="108">SSE-KMS, versioning</text>
  <text class="dg-ts" x="314" y="126">Object Lock, no deletes</text>
  <text class="dg-ts" x="314" y="144">Bucket owner enforced</text>
  <text class="dg-ts" x="314" y="162">lifecycle to Glacier</text>

  <path class="dg-line" d="M220 86 H288" marker-end="url(#m0608b-ar)"/>
  <path class="dg-line" d="M220 130 H288" marker-end="url(#m0608b-ar)"/>
  <path class="dg-line" d="M220 174 H288" marker-end="url(#m0608b-ar)"/>

  <rect class="dg-region" x="540" y="36" width="208" height="300" rx="10"/>
  <text class="dg-ta" x="552" y="56">Security Tooling account</text>
  <rect class="dg-good" x="552" y="68" width="184" height="36" rx="6"/><text class="dg-t" x="564" y="91">Config aggregator</text>
  <rect class="dg-good" x="552" y="112" width="184" height="36" rx="6"/><text class="dg-t" x="564" y="135">Detective, Macie admin</text>
  <rect class="dg-good" x="552" y="156" width="184" height="36" rx="6"/><text class="dg-t" x="564" y="179">Athena (read-only)</text>
  <rect class="dg-good" x="552" y="200" width="184" height="36" rx="6"/><text class="dg-t" x="564" y="223">GuardDuty admin</text>
  <rect class="dg-good" x="552" y="244" width="184" height="36" rx="6"/><text class="dg-t" x="564" y="267">Security Hub admin</text>
  <rect class="dg-good" x="552" y="288" width="184" height="36" rx="6"/><text class="dg-t" x="564" y="311">Access Analyzer (org)</text>

  <path class="dg-line" d="M490 174 H550" marker-end="url(#m0608b-ar)"/>
  <path class="dg-line" d="M220 218 H550" marker-end="url(#m0608b-ar)"/>
  <path class="dg-line" d="M220 262 H550" marker-end="url(#m0608b-ar)"/>
  <path class="dg-line" d="M220 306 H550" marker-end="url(#m0608b-ar)"/>
  <text class="dg-ts" x="300" y="211">findings, per Region</text>

  <rect class="dg-edge" x="280" y="356" width="220" height="36" rx="6"/>
  <text class="dg-t" x="292" y="379">EventBridge to SNS, SOAR</text>
  <path class="dg-line" d="M644 336 V374 H502" marker-end="url(#m0608b-ar)"/>
</svg>
<figcaption>Figure M06-8b. Two destinations, two jobs. Raw evidence (logs) flows to the Log Archive account, where nobody can change it. Findings flow to the Security Tooling account, where analysts act on them. Security Tooling reads logs; it never owns them.</figcaption>
</figure>`;

var DG_0608_NETWORK = `
<figure>
<svg class="diagram" viewBox="0 0 760 340" role="img" aria-labelledby="m0608ct m0608cd">
  <title id="m0608ct">Network account as the connectivity hub</title>
  <desc id="m0608cd">Spoke VPCs in workload accounts attach to a Transit Gateway owned by the Network account and shared through AWS RAM. The Transit Gateway connects to an inspection VPC running AWS Network Firewall, which leads to an egress VPC with NAT gateways to the internet; to a central endpoints VPC with interface endpoints; and through a Direct Connect gateway or VPN to the on-premises data centre. IPAM pools and Route 53 Resolver rules are also shared from the Network account.</desc>
  <defs><marker id="m0608c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-box" x="12" y="40" width="170" height="50" rx="8"/>
  <text class="dg-tb" x="24" y="61">shop-prod VPC</text><text class="dg-ts" x="24" y="79">TGW attachment</text>
  <rect class="dg-box" x="12" y="110" width="170" height="50" rx="8"/>
  <text class="dg-tb" x="24" y="131">pay-prod VPC (PCI)</text><text class="dg-ts" x="24" y="149">TGW attachment</text>
  <rect class="dg-box" x="12" y="180" width="170" height="50" rx="8"/>
  <text class="dg-tb" x="24" y="201">data-prod VPC</text><text class="dg-ts" x="24" y="219">TGW attachment</text>
  <text class="dg-ta" x="12" y="26">Workload accounts</text>

  <path class="dg-line" d="M182 65 H196 V145"/>
  <path class="dg-line" d="M182 135 H196"/>
  <path class="dg-line" d="M182 205 H196 V145"/>
  <path class="dg-line" d="M196 145 H298" marker-end="url(#m0608c-ar)"/>

  <rect class="dg-region" x="200" y="20" width="360" height="260" rx="10"/>
  <text class="dg-ta" x="212" y="40">Network account (Infrastructure OU)</text>
  <rect class="dg-box" x="212" y="48" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="224" y="69">Inspection VPC</text><text class="dg-ts" x="224" y="87">Network Firewall</text>
  <rect class="dg-box" x="388" y="48" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="400" y="69">Egress VPC</text><text class="dg-ts" x="400" y="87">NAT gateways</text>
  <rect class="dg-edge" x="300" y="120" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="312" y="141">Transit Gateway</text><text class="dg-ts" x="312" y="159">shared via RAM</text>
  <rect class="dg-box" x="212" y="200" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="224" y="221">Endpoints VPC</text><text class="dg-ts" x="224" y="239">central endpoints</text>
  <rect class="dg-box" x="388" y="200" width="160" height="50" rx="6"/>
  <text class="dg-tb" x="400" y="221">IPAM + Resolver</text><text class="dg-ts" x="400" y="239">pools, rules via RAM</text>

  <path class="dg-link" d="M330 120 V98"/>
  <path class="dg-link" d="M372 73 H388"/>
  <path class="dg-link" d="M330 170 V200"/>

  <rect class="dg-edge" x="590" y="40" width="158" height="60" rx="8"/>
  <text class="dg-tb" x="602" y="64">Internet</text><text class="dg-ts" x="602" y="84">via NAT, inspected</text>
  <path class="dg-line" d="M548 73 H588" marker-end="url(#m0608c-ar)"/>

  <rect class="dg-dc" x="590" y="200" width="158" height="60" rx="8"/>
  <text class="dg-tb" x="602" y="224">On-premises DC</text><text class="dg-ts" x="602" y="244">DX / Site-to-Site VPN</text>
  <path class="dg-line" d="M460 150 H572 V230 H588" marker-end="url(#m0608c-ar)"/>
  <text class="dg-ts" x="468" y="142">DX / VPN</text>

  <text class="dg-ts" x="12" y="304">Spoke accounts own their VPCs and attach them to the shared TGW; RAM shares the TGW, IPAM pools and Resolver rules.</text>
  <text class="dg-ts" x="12" y="322">Alternative: VPC sharing, where the Network account shares subnets and workload accounts launch into them (M06.07).</text>
</svg>
<figcaption>Figure M06-8c. The Network account owns everything that connects: the Transit Gateway, the inspection and egress VPCs, central interface endpoints, IPAM and hybrid links. Workload teams own their VPCs and their resources, never the routes to the outside world.</figcaption>
</figure>`;

LESSONS.push({
  id: "M06.08", title: "Reference multi-account architecture", level: 400, minutes: 60,
  objectives: [
    "Lay out a complete OU and account structure based on the AWS whitepaper and the AWS Security Reference Architecture (SRA), and justify each OU",
    "Decide which account or OU a given capability belongs in (logs, findings, networking, directory, pipelines, experiments, suspended accounts)",
    "Design the organization-wide security and logging flows: organization trail, Config, delegated administrators and the log archive bucket",
    "Design cost allocation (tags, tag policies, Cost Categories, budgets) and organization-wide backup and tagging policies",
    "Plan a phased landing-zone adoption, a break-glass procedure and day-2 operations for an end-to-end multi-account design"
  ],
  sections: [
    { type: "why", html: `
<p>The previous seven lessons each gave you one building block. M06.01 explained why accounts are the strongest isolation boundary. M06.02 showed how AWS Organizations groups them. M06.03 added guardrails with SCPs, M06.04 automated the landing zone with Control Tower, M06.05 gave people one sign-in with IAM Identity Center, M06.06 connected Active Directory, and M06.07 shared networks and other resources with AWS RAM. A real company does not ask for any one of these. It asks: <em>"We have 40 engineers today and 300 next year, a payments product in PCI scope, an on-premises data centre and an auditor arriving in six months. What do we build?"</em></p>
<p>Without a reference design, teams make the same expensive mistakes. They run workloads in the management account, where no SCP can restrict them. They send CloudTrail logs to a bucket that the people being audited can delete. They build a different VPC layout in every account and later discover overlapping CIDR ranges that can't be routed. They create an OU per department, so the next reorganisation forces a guardrail redesign. Each mistake can be undone, but undoing it at 200 accounts is a project, not a ticket.</p>
<p>AWS publishes a reference: the whitepaper <em>Organizing Your AWS Environment Using Multiple Accounts</em> (the OU structure) and the <em>AWS Security Reference Architecture</em> (SRA), which says which security service runs in which account. On the exam, this appears as "which account should centralise X", "how do you prevent member accounts from disabling Y" and "how do you allocate costs across business units". At work, it is the blueprint you defend in an architecture review. This lesson is the capstone: it assembles every M06 block into one design and walks a fictional company through it end to end.</p>` },

    { type: "concept", title: "Concept: the reference OU structure", html: DG_0608_TREE + `
<h3>Design principles behind the tree</h3>
<p>The whitepaper's structure follows a few principles. Learn them, because they let you reason about cases the diagram doesn't show.</p>
<ul>
  <li><strong>Group by function and controls, not by org chart.</strong> An OU exists because its accounts need the <em>same policies</em> (SCPs, RCPs, tag and backup policies, Control Tower controls). Departments change every year; the security needs of "production workloads" don't.</li>
  <li><strong>Apply policies to OUs, not to individual accounts.</strong> An account that needs special treatment moves to an OU that has it, which keeps the policy model reviewable.</li>
  <li><strong>Keep the management account empty.</strong> SCPs and RCPs never apply to it (M06.03), and it can do anything in the organization. Use it only for Organizations, consolidated billing, Control Tower and (unless delegated) IAM Identity Center.</li>
  <li><strong>Separate production from non-production.</strong> Different guardrails, different people, different blast radius.</li>
  <li><strong>Keep the tree shallow.</strong> Organizations allows 5 levels of OUs below the root, but two levels (for example Workloads → Prod) are enough for most companies. Every extra level is another place for a policy to hide.</li>
  <li><strong>Small number of workloads per account.</strong> One workload and one environment per account (shop-prod, shop-dev) gives clean cost, quota and blast-radius boundaries (M06.01).</li>
</ul>

<h3>Foundational OUs</h3>
<table>
<thead><tr><th>OU</th><th>Accounts</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><strong>Security</strong></td><td><strong>Log Archive</strong>; <strong>Security Tooling</strong> (Control Tower calls it <em>Audit</em>)</td><td>Log Archive holds the immutable copy of organization-wide logs. Security Tooling is the delegated administrator for security services and the place security engineers work. Workload teams have no access to either.</td></tr>
<tr><td><strong>Infrastructure</strong></td><td><strong>Network</strong>; <strong>Shared Services</strong>; optionally a central backup account</td><td>Shared platforms that many workloads consume: the Transit Gateway, IPAM, egress and inspection, hybrid links (Network); directory services, image pipelines, monitoring tools (Shared Services).</td></tr>
</tbody></table>
<p>The whitepaper also recommends a prod/non-prod split <em>inside</em> foundational OUs when it helps, for example a test Network account in Infrastructure/SDLC where network changes are rehearsed before they touch the production Transit Gateway.</p>

<h3>Workloads OU</h3>
<p>Workloads holds the accounts that run your business applications, split into <strong>Prod</strong> and <strong>SDLC</strong> (software development life cycle: dev, test, staging) sub-OUs. Prod gets the strictest guardrails: deny disabling encryption, deny deleting backups, deny public S3, change only through pipelines. SDLC is looser so engineers can experiment, but it is still connected to internal networks and still logged.</p>

<h3>Additional OUs (create when needed)</h3>
<table>
<thead><tr><th>OU</th><th>When you need it</th><th>Typical policies</th></tr></thead>
<tbody>
<tr><td><strong>Sandbox</strong></td><td>Engineers want to try services freely</td><td>Not connected to the corporate network; budget alarms or automatic clean-up; deny expensive instance families</td></tr>
<tr><td><strong>Deployments</strong></td><td>CI/CD pipelines that deploy into many accounts</td><td>Protect pipeline roles; only pipeline engineers have write access; target accounts trust these pipeline roles</td></tr>
<tr><td><strong>Policy Staging</strong></td><td>You change SCPs, RCPs or controls</td><td>Test accounts receive the new policy first; promote it to real OUs after it passes</td></tr>
<tr><td><strong>Suspended</strong></td><td>Accounts that are being decommissioned or closed</td><td>Deny-all SCP (with an exception for the security/automation role) so nothing runs while the closure finishes</td></tr>
<tr><td><strong>Exceptions</strong></td><td>A workload legitimately needs something a guardrail blocks</td><td>Copy of the parent policies minus the one approved exception; time-boxed and reviewed</td></tr>
<tr><td><strong>Transitional</strong></td><td>Accounts arriving from an acquisition or an older organization</td><td>Light guardrails while they are assessed and remediated, then moved to their target OU</td></tr>
<tr><td><strong>Individual Business Users</strong></td><td>Non-IT teams (marketing, finance analysts) need a few AWS services</td><td>Allow-list of approved services only</td></tr>
</tbody></table>

<h3>Where does each capability live?</h3>
<table>
<thead><tr><th>Capability</th><th>Account (OU)</th><th>Why there</th></tr></thead>
<tbody>
<tr><td>Organizations, consolidated billing, Control Tower, Account Factory</td><td>Management (root)</td><td>Only the management account can run them; Control Tower can't be delegated</td></tr>
<tr><td>Organization CloudTrail bucket, Config snapshots and history, central VPC Flow Logs, ELB and S3 access logs</td><td>Log Archive (Security)</td><td>Tamper-resistant evidence, separate from those being audited</td></tr>
<tr><td>GuardDuty, Security Hub, Detective, Inspector, Macie, Config aggregator, IAM Access Analyzer org analyzer, Firewall Manager</td><td>Security Tooling (Security)</td><td>Delegated administrator: one pane of glass, no use of the management account</td></tr>
<tr><td>Transit Gateway, Direct Connect gateway, VPN, IPAM, egress and inspection VPCs, Route 53 Resolver endpoints and rules, central interface endpoints</td><td>Network (Infrastructure)</td><td>One owner for routing, IP space and the paths to the internet and on premises</td></tr>
<tr><td>AWS Managed Microsoft AD, golden AMI pipeline, shared monitoring, artifact repositories, IAM Identity Center delegated admin (SRA)</td><td>Shared Services (Infrastructure)</td><td>Platforms consumed by many workloads but owned by a platform team</td></tr>
<tr><td>Cross-account backup vault for copies</td><td>Dedicated backup account (Infrastructure or Security)</td><td>A copy that a compromised workload account can't delete</td></tr>
<tr><td>CodePipeline / GitHub Actions runners / deployment roles</td><td>Deployments OU</td><td>Pipelines hold powerful deploy rights; isolate them from workloads</td></tr>
</tbody></table>` },

    { type: "concept", title: "Concept: centralised security, logging and delegated administrators", html: DG_0608_FLOWS + `
<h3>Two accounts, two jobs</h3>
<p>The most-tested idea in this lesson: <strong>logs and findings go to different accounts</strong>. The <strong>Log Archive</strong> account is a vault. It receives raw evidence (API activity, configuration history, network flows) and keeps it unchanged for years. Almost nobody signs into it; read access is granted to specific security roles, and the bucket policy denies deletes. The <strong>Security Tooling</strong> account is an operations room. It is the delegated administrator for the detection services, sees every finding from every account and Region, and is where analysts and automation respond.</p>
<p>Keeping them apart means that a compromise of the security operations account (the one people log into every day) can't erase the evidence, and a log-bucket mistake can't disable detection.</p>

<h3>The organization trail</h3>
<p>An <strong>organization trail</strong> is a CloudTrail trail created in the management account (or in a CloudTrail delegated administrator account) with <code>--is-organization-trail</code>. It automatically logs every member account, including accounts that join later. Member accounts can see the trail but <strong>cannot stop, modify or delete it</strong>. Deliver it to an S3 bucket in Log Archive, make it multi-Region, enable log file validation (SHA-256 digest files that prove logs weren't altered), and encrypt with a KMS key. Control Tower creates this for you (M06.04).</p>

<h3>Delegated administrators</h3>
<p>For each security service, the management account enables <strong>trusted access</strong> (the service may work across the organization) and registers a <strong>delegated administrator</strong> (a member account that manages the service for all accounts; see M06.02). Then the service is configured from that account, not from the management account.</p>
<table>
<thead><tr><th>Service</th><th>Delegated admin (SRA)</th><th>What central admin gives you</th></tr></thead>
<tbody>
<tr><td>Amazon GuardDuty</td><td>Security Tooling</td><td>Auto-enable detectors in every new account; all findings in one place (per Region)</td></tr>
<tr><td>AWS Security Hub</td><td>Security Tooling</td><td>Central configuration of standards and controls; cross-Region aggregation of findings</td></tr>
<tr><td>AWS Config</td><td>Security Tooling (aggregator, org rules, conformance packs)</td><td>One view of resource compliance across accounts and Regions</td></tr>
<tr><td>IAM Access Analyzer</td><td>Security Tooling</td><td>Organization as the zone of trust: find anything shared outside it</td></tr>
<tr><td>AWS Firewall Manager</td><td>Security Tooling</td><td>Push WAF rules, security groups and Network Firewall policies to many accounts</td></tr>
<tr><td>Amazon Detective, Inspector, Macie</td><td>Security Tooling</td><td>Investigation, vulnerability scanning, sensitive-data discovery org-wide</td></tr>
<tr><td>IAM Identity Center</td><td>Shared Services (or kept in management)</td><td>Day-to-day permission-set work without management-account access (it still can't manage assignments to the management account, M06.05)</td></tr>
<tr><td>Amazon VPC IPAM</td><td>Network</td><td>Organization-wide IP pools, no overlapping CIDRs</td></tr>
<tr><td>AWS Backup</td><td>Backup or Shared Services</td><td>Manage backup policies and monitor jobs across accounts</td></tr>
<tr><td>CloudFormation StackSets</td><td>Deployments or Shared Services</td><td>Roll out baseline stacks to OUs automatically</td></tr>
</tbody></table>

<h3>Protecting the security baseline</h3>
<p>Centralisation is only useful if workload accounts can't switch it off. An SCP on the root (or on every OU except Security) denies <code>cloudtrail:StopLogging</code>, <code>cloudtrail:DeleteTrail</code>, <code>guardduty:DeleteDetector</code>, <code>guardduty:DisassociateFromAdministratorAccount</code>, <code>config:StopConfigurationRecorder</code>, <code>securityhub:DisableSecurityHub</code>, <code>access-analyzer:DeleteAnalyzer</code> and <code>organizations:LeaveOrganization</code>, with an <code>aws:PrincipalArn</code> exception for the automation role that manages them (M06.03). Control Tower's mandatory controls already protect its own resources. Add an RCP data perimeter on the Log Archive bucket's service family so that only principals in your organization can read logs (M06.03).</p>` },

    { type: "workflow", title: "Workflow: a phased adoption roadmap", html: `
<p>Nobody builds the whole tree on day one. Start with the minimum that is hard to change later (management account hygiene, the Security OU, identity) and grow the rest as needs appear. Each phase below is safe to stop at.</p>
<ol class="flow">
  <li><strong>Phase 0: foundation (weeks 1–2).</strong> Secure the management account: hardware MFA on root, alternate contacts, billing alarms. Enable Organizations with all features. Deploy the Control Tower landing zone in your home Region, which creates the Security OU with Log Archive and Audit (Security Tooling), the organization trail and Config. Connect IAM Identity Center to your IdP with SAML 2.0 + SCIM (M06.05). Set up break-glass access and test it.</li>
  <li><strong>Phase 1: first workloads (weeks 2–6).</strong> Create Workloads/Prod and Workloads/SDLC and a Sandbox OU. Attach baseline SCPs: deny leaving the organization, deny unapproved Regions (Control Tower's Region deny control), protect the security baseline, deny root user actions in member accounts. Vend accounts through Account Factory, one per workload and environment. Define four or five permission sets (Admin, Developer, ReadOnly, Billing, SecurityAudit).</li>
  <li><strong>Phase 2: shared infrastructure (months 2–4).</strong> Create the Infrastructure OU with the Network and Shared Services accounts. Build the Transit Gateway, IPAM pools, egress and inspection VPCs and hybrid links; share them with RAM (M06.07). Register delegated administrators for GuardDuty, Security Hub, Config, Access Analyzer, Firewall Manager (Security Tooling) and IPAM (Network). Connect directory services if Windows workloads need them (M06.06).</li>
  <li><strong>Phase 3: governance at scale (months 4–9).</strong> Add tag policies and an SCP that requires cost tags; activate cost allocation tags; build Cost Categories and per-OU budgets. Add backup policies and a central backup account. Create Policy Staging, Suspended and Deployments OUs. Move account vending to code (AFT or Account Factory Customization). Add RCPs for the data perimeter.</li>
  <li><strong>Phase 4: optimise and keep it healthy (ongoing).</strong> Add Exceptions and Transitional OUs when a real case appears. Add declarative policies for EC2/VPC baselines (IMDSv2, block public AMI sharing, VPC Block Public Access). Review SCP exceptions quarterly, close idle accounts, rehearse break-glass twice a year and track Security Hub scores per OU.</li>
</ol>

<h3>Phase summary</h3>
<table>
<thead><tr><th>Phase</th><th>OUs added</th><th>Accounts added</th><th>Governance added</th></tr></thead>
<tbody>
<tr><td>0 Foundation</td><td>Security</td><td>Management, Log Archive, Security Tooling</td><td>Org trail, Config, Identity Center, break-glass</td></tr>
<tr><td>1 First workloads</td><td>Workloads/Prod, Workloads/SDLC, Sandbox</td><td>One per workload and environment</td><td>Baseline SCPs, Region deny, permission sets</td></tr>
<tr><td>2 Shared infrastructure</td><td>Infrastructure</td><td>Network, Shared Services</td><td>TGW/IPAM via RAM, delegated admins</td></tr>
<tr><td>3 Scale</td><td>Policy Staging, Suspended, Deployments</td><td>Backup, pipeline accounts</td><td>Tag/backup policies, cost categories, RCPs, AFT</td></tr>
<tr><td>4 Optimise</td><td>Exceptions, Transitional (as needed)</td><td>As needed</td><td>Declarative policies, reviews, drills</td></tr>
</tbody></table>
<div class="callout tip">Do the expensive-to-change things first: management account hygiene, the Security OU, the IP address plan and identity. Moving accounts between OUs later is a single API call; re-addressing 50 VPCs is a year.</div>` },

    { type: "aws", title: "How it works on AWS: networking, identity, tagging, backup and cost", html: DG_0608_NETWORK + `
<h3>The Network account</h3>
<p>The Network account owns every path that leaves a VPC. It shares the <strong>Transit Gateway</strong> with workload accounts through RAM; each workload account creates its own VPC (with a CIDR allocated from an <strong>IPAM pool</strong> the Network account shares) and attaches it. TGW route tables send traffic for 0.0.0.0/0 to the <strong>inspection VPC</strong> (AWS Network Firewall) and on to the <strong>egress VPC</strong> with NAT gateways, so workload VPCs need no internet gateways or NAT of their own. One set of <strong>interface endpoints</strong> in a central VPC, with private hosted zones associated to spoke VPCs, avoids paying for the same endpoints in 50 VPCs. <strong>Route 53 Resolver</strong> inbound and outbound endpoints live here too, and forwarding rules are shared with RAM for hybrid DNS. Deep dives: M10 (TGW, endpoints) and M11 (DX, VPN).</p>
<p>The alternative is <strong>VPC sharing</strong> (M06.07): the Network account owns the VPCs and shares subnets, and workload accounts only launch resources. It is simpler and uses fewer TGW attachments, but workload teams can't change routing or NACLs. Many companies use both: shared VPCs for small teams, own VPCs plus TGW for teams that need control.</p>

<h3>Identity at organization scale</h3>
<ul>
  <li><strong>One identity source:</strong> the corporate IdP connected to IAM Identity Center with SAML 2.0 and SCIM (M06.05); Active Directory via AD Connector or AWS Managed Microsoft AD if that is the source of truth (M06.06).</li>
  <li><strong>Assign groups, not users.</strong> Assignments are (IdP group, permission set, account). A new engineer joins the <code>shop-developers</code> group in the IdP and gets access within minutes; leaving the company removes it everywhere.</li>
  <li><strong>Permission sets by role, not by account:</strong> PlatformAdmin, Developer (write in SDLC, read in Prod), ReadOnly, SecurityAudit, BillingViewer, NetworkAdmin (Network account only).</li>
  <li><strong>Workload identities</strong> use roles in their own account; pipelines in the Deployments OU assume deploy roles in target accounts (M05.06).</li>
  <li><strong>Root users:</strong> enable centralised root access management so member accounts have no root credentials at all (M05.01).</li>
</ul>

<h3>Tag policies, required tags and cost allocation</h3>
<p>Three different tools are often confused:</p>
<table>
<thead><tr><th>Tool</th><th>What it does</th><th>What it does NOT do</th></tr></thead>
<tbody>
<tr><td><strong>Tag policy</strong> (Organizations)</td><td>Standardises tag keys (capitalisation) and allowed values; with <code>enforced_for</code>, blocks <em>noncompliant</em> tagging operations on listed resource types; reports compliance</td><td>Doesn't force a tag to be present; a resource with no tag at all is not blocked</td></tr>
<tr><td><strong>SCP with <code>aws:RequestTag</code></strong></td><td>Denies creating a resource when a required tag is missing (<code>Null</code> condition)</td><td>Doesn't check value spelling across services as neatly as tag policies</td></tr>
<tr><td><strong>AWS Config rule</strong> <code>required-tags</code></td><td>Detects existing untagged resources (detective)</td><td>Doesn't prevent anything</td></tr>
</tbody></table>
<p>For <strong>cost allocation</strong>, the <em>account</em> is already the strongest cost dimension: Cost Explorer and the Cost and Usage Report (Data Exports) break costs down by linked account with no tagging at all, which is one more reason for one workload per account. On top of that:</p>
<ul>
  <li><strong>Cost allocation tags</strong> (user-defined such as <code>CostCenter</code>, and AWS-generated such as <code>aws:createdBy</code>) must be <strong>activated in the management (payer) account</strong> before they appear in billing data. They aren't applied retroactively.</li>
  <li><strong>AWS Cost Categories</strong> group costs by rules (account, OU-based account lists, tag, service) into business units, for example "Payments = pay-prod + pay-test + 40% of Network".</li>
  <li><strong>AWS Budgets</strong> per account, per Cost Category or per tag, with alerts or budget actions (for example applying a deny SCP to a Sandbox account that overspends).</li>
  <li><strong>RI and Savings Plans sharing</strong> is on by default across the organization (M06.02); keep it on unless a business unit must keep its own discounts.</li>
  <li><strong>Shared costs</strong> (Network account TGW and NAT, Security Tooling) are split back to business units using Cost Categories' split charge rules.</li>
</ul>

<h3>Backup policies</h3>
<p>An Organizations <strong>backup policy</strong> deploys AWS Backup plans to every account in an OU: schedule, retention, which resources (selected by tag) and copy actions. Combine it with a <strong>central backup account</strong> whose vault receives cross-account copies, protected by a vault access policy and AWS Backup Vault Lock, so that ransomware in a workload account can't delete every copy. Cross-account backup must be enabled in the AWS Backup settings of the management account.</p>` },

    { type: "examples", html: `
<h3>Example 1: register delegated administrators (from the management account)</h3>
<pre><code># Management account 111122223333; Security Tooling account 444455556666
aws organizations enable-aws-service-access --service-principal guardduty.amazonaws.com
aws guardduty enable-organization-admin-account --admin-account-id 444455556666 --region eu-west-1

aws organizations enable-aws-service-access --service-principal securityhub.amazonaws.com
aws securityhub enable-organization-admin-account --admin-account-id 444455556666 --region eu-west-1

aws organizations enable-aws-service-access --service-principal access-analyzer.amazonaws.com
aws organizations register-delegated-administrator \\
    --account-id 444455556666 --service-principal access-analyzer.amazonaws.com

aws organizations list-delegated-administrators \\
    --query "DelegatedAdministrators[].{Id:Id,Name:Name}" --output table
-----------------------------------------
|      ListDelegatedAdministrators      |
+---------------+-----------------------+
|      Id       |         Name          |
+---------------+-----------------------+
|  444455556666 |  Security Tooling     |
+---------------+-----------------------+</code></pre>
<p>GuardDuty and Security Hub are <strong>Regional</strong>: repeat the admin call in every Region you use. Then, from the Security Tooling account, turn on auto-enable so new accounts are covered:</p>
<pre><code>aws guardduty update-organization-configuration --region eu-west-1 \\
    --detector-id 12abc34d567e8fa901bc2d34e56789f0 \\
    --auto-enable-organization-members ALL</code></pre>

<h3>Example 2: the organization trail into Log Archive</h3>
<pre><code>aws cloudtrail create-trail --name org-trail \\
    --s3-bucket-name brightwave-org-logs-eu-west-1 \\
    --is-organization-trail --is-multi-region-trail \\
    --enable-log-file-validation \\
    --kms-key-id arn:aws:kms:eu-west-1:111122223333:alias/org-trail
aws cloudtrail start-logging --name org-trail</code></pre>
<p>The bucket lives in the Log Archive account; its bucket policy allows <code>cloudtrail.amazonaws.com</code> to write under <code>AWSLogs/o-a1b2c3d4e5/</code> with an <code>aws:SourceArn</code> condition naming the trail. Objects land at <code>AWSLogs/o-a1b2c3d4e5/&lt;account-id&gt;/CloudTrail/&lt;region&gt;/YYYY/MM/DD/</code>.</p>

<h3>Example 3: SCP protecting the security baseline</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ProtectSecurityBaseline",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "cloudtrail:UpdateTrail",
        "guardduty:DeleteDetector",
        "guardduty:DisassociateFromAdministratorAccount",
        "securityhub:DisableSecurityHub",
        "config:StopConfigurationRecorder",
        "config:DeleteConfigurationRecorder",
        "config:DeleteDeliveryChannel",
        "access-analyzer:DeleteAnalyzer"
      ],
      "Resource": "*",
      "Condition": {
        "ArnNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::*:role/AWSControlTowerExecution",
            "arn:aws:iam::*:role/SecurityBaselineAutomation"
          ]
        }
      }
    },
    {
      "Sid": "DenyLeavingOrg",
      "Effect": "Deny",
      "Action": "organizations:LeaveOrganization",
      "Resource": "*"
    }
  ]
}</code></pre>
<p>Attach to the root (it never affects the management account) after testing it in Policy Staging. Without the exception, Control Tower itself would be blocked when it updates the baseline.</p>

<h3>Example 4: tag policy plus an SCP that requires the tag</h3>
<pre><code>{
  "tags": {
    "costcenter": {
      "tag_key": { "@@assign": "CostCenter" },
      "tag_value": { "@@assign": ["CC-SHOP", "CC-PAY", "CC-DATA", "CC-PLATFORM"] },
      "enforced_for": { "@@assign": ["ec2:instance", "ec2:volume", "rds:db"] }
    }
  }
}</code></pre>
<p>This fixes the spelling (<code>CostCenter</code>, not <code>costcenter</code>) and the allowed values. To make the tag <em>mandatory</em>, add an SCP to the Workloads OU:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RequireCostCenterOnInstances",
    "Effect": "Deny",
    "Action": "ec2:RunInstances",
    "Resource": "arn:aws:ec2:*:*:instance/*",
    "Condition": { "Null": { "aws:RequestTag/CostCenter": "true" } }
  }]
}</code></pre>

<h3>Example 5: backup policy with a cross-account copy</h3>
<pre><code>{
  "plans": {
    "org-daily": {
      "regions": { "@@assign": ["eu-west-1"] },
      "rules": {
        "daily-35d": {
          "schedule_expression": { "@@assign": "cron(0 3 ? * * *)" },
          "start_backup_window_minutes": { "@@assign": "60" },
          "target_backup_vault_name": { "@@assign": "org-vault" },
          "lifecycle": { "delete_after_days": { "@@assign": "35" } },
          "copy_actions": {
            "arn:aws:backup:eu-central-1:777788889999:backup-vault:central-vault": {
              "target_backup_vault_arn": { "@@assign": "arn:aws:backup:eu-central-1:777788889999:backup-vault:central-vault" },
              "lifecycle": { "delete_after_days": { "@@assign": "90" } }
            }
          }
        }
      },
      "selections": {
        "tags": {
          "gold-tier": {
            "iam_role_arn": { "@@assign": "arn:aws:iam::$account:role/OrgBackupRole" },
            "tag_key": { "@@assign": "BackupTier" },
            "tag_value": { "@@assign": ["gold"] }
          }
        }
      }
    }
  }
}</code></pre>
<p>Account 777788889999 is the central backup account. <code>$account</code> is replaced by each member account's id when the plan is deployed. Every resource tagged <code>BackupTier=gold</code> is backed up daily, kept 35 days locally and 90 days in the other Region and account.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Placement / design</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Auditors need 7 years of tamper-proof API history for every account</td><td>Organization trail to the Log Archive bucket with Object Lock (compliance mode), log file validation and lifecycle to Glacier</td><td>Member accounts can't stop or delete it; the evidence is outside their reach</td></tr>
<tr><td>Security team wants every GuardDuty finding from 120 accounts in one console</td><td>GuardDuty delegated admin = Security Tooling, auto-enable ALL, Security Hub cross-Region aggregation</td><td>No use of the management account; new accounts covered automatically</td></tr>
<tr><td>Payments product must be in PCI scope, nothing else should be</td><td>Dedicated pay-prod account in Workloads/Prod (or a PCI sub-OU) with stricter SCPs and its own VPC behind the inspection VPC</td><td>The account boundary shrinks the cardholder data environment and the audit</td></tr>
<tr><td>A newly acquired company brings 15 accounts with unknown hygiene</td><td>Invite them into a Transitional OU with light guardrails, assess, remediate, then move to Workloads</td><td>Applying production SCPs on day one could break their workloads</td></tr>
<tr><td>Finance wants monthly chargeback per business unit</td><td>One workload per account + activated cost allocation tags + Cost Categories with split charges for shared accounts</td><td>Accounts give clean cost lines; categories turn them into business units</td></tr>
<tr><td>A team must use a Region outside the approved list for a pilot</td><td>Move its account to the Exceptions OU whose Region SCP adds that Region, with an expiry date</td><td>Policies stay attached to OUs; the exception is visible and reviewable</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: map your own organization", html: `
<p>These commands are read-only and free. Run them in CloudShell with credentials for the management account (or a delegated administrator for Organizations). In a standalone account you'll get <code>AWSOrganizationsNotInUseException</code>, which is itself the answer: you have no organization yet.</p>
<pre><code># 1. Feature set and management account
aws organizations describe-organization \\
    --query "Organization.{Id:Id,FeatureSet:FeatureSet,Mgmt:MasterAccountId}"

# 2. Print the OU tree with accounts
print_ou() {
  local parent="$1" indent="$2"
  while IFS= read -r acct; do echo "$indent  - $acct"; done &lt; &lt;(
    aws organizations list-accounts-for-parent --parent-id "$parent" \\
      --query "Accounts[].[Name]" --output text)
  for ou in $(aws organizations list-organizational-units-for-parent \\
                --parent-id "$parent" --query "OrganizationalUnits[].Id" --output text); do
    name=$(aws organizations describe-organizational-unit --organizational-unit-id "$ou" \\
             --query "OrganizationalUnit.Name" --output text)
    echo "$indent[$name]"
    print_ou "$ou" "$indent    "
  done
}
ROOT=$(aws organizations list-roots --query "Roots[0].Id" --output text)
echo "[Root $ROOT]"; print_ou "$ROOT" ""

# 3. Which services have trusted access, and who are the delegated admins?
aws organizations list-aws-service-access-for-organization \\
    --query "EnabledServicePrincipals[].ServicePrincipal" --output text
aws organizations list-delegated-administrators --query "DelegatedAdministrators[].[Id,Name]" --output text

# 4. Is there an organization trail, and where does it deliver?
aws cloudtrail describe-trails \\
    --query "trailList[?IsOrganizationTrail].[Name,S3BucketName,IsMultiRegionTrail]" --output table

# 5. Which policy types are enabled on the root?
aws organizations list-roots --query "Roots[0].PolicyTypes[].[Type,Status]" --output table</code></pre>
<p>Sample output of step 2 for a young organization:</p>
<pre><code>[Root r-ab12]
  - Brightwave Management
[Security]
    - Log Archive
    - Audit
[Sandbox]
    - sandbox-alex</code></pre>
<p>Compare it with Figure M06-8a. Write down which foundational OU or account is missing, which services have trusted access but no delegated admin (a sign that someone is working from the management account), and whether every account sits in an OU with a clear purpose. Lab L06 builds a small landing zone end to end.</p>` },

    { type: "casestudy", title: "Case study: Brightwave Retail designs its landing zone end to end", html: `
<p><strong>Situation.</strong> Brightwave Retail (fictional) sells home goods online in eight European countries. It has three product teams (Storefront, Payments, Data), a platform team of six and a security team of three. Today it has four AWS accounts created years apart, one of which runs production, CI/CD and the company's billing all at once. An acquisition (a small marketplace start-up, "Nookly", with five accounts) closes next quarter, and a PCI DSS assessment is booked for month nine.</p>
<p><strong>Requirements.</strong> (1) PCI scope limited to payments. (2) Customer data processed only in EU Regions (eu-west-1 primary, eu-central-1 for DR). (3) Workforce sign-in with the existing Microsoft Entra ID, MFA everywhere. (4) Seven-year tamper-proof audit logs. (5) Connectivity to the Dublin data centre over Direct Connect. (6) Monthly chargeback per product team. (7) Ransomware-resilient backups. (8) New accounts in under an hour without a ticket queue.</p>

<p><strong>OU tree and accounts.</strong></p>
<table>
<thead><tr><th>OU</th><th>Accounts</th><th>Key guardrails and services</th><th>Owner</th></tr></thead>
<tbody>
<tr><td>Root</td><td>Management (the old billing account, emptied of workloads)</td><td>Organizations, Control Tower, billing, cost tag activation</td><td>Platform (2 people)</td></tr>
<tr><td>Security</td><td>Log Archive, Security Tooling (Audit)</td><td>Org trail + Config to Log Archive (Object Lock, 7 years); GuardDuty, Security Hub, Access Analyzer, Firewall Manager, Inspector delegated to Security Tooling</td><td>Security</td></tr>
<tr><td>Infrastructure/Prod</td><td>Network, Shared Services, Backup</td><td>TGW, IPAM, inspection + egress VPCs, DX gateway; Identity Center delegated admin and Entra ID integration in Shared Services; central backup vault with Vault Lock</td><td>Platform</td></tr>
<tr><td>Infrastructure/SDLC</td><td>Network-test</td><td>Rehearse TGW and firewall changes</td><td>Platform</td></tr>
<tr><td>Workloads/Prod</td><td>shop-prod, data-prod</td><td>EU Region deny, deny public S3, require CostCenter tag, backup policy (gold)</td><td>Product teams</td></tr>
<tr><td>Workloads/Prod/PCI</td><td>pay-prod</td><td>All of Prod plus: deny non-approved services (allow-list), deny console write access except break-glass, Firewall Manager policies</td><td>Payments</td></tr>
<tr><td>Workloads/SDLC</td><td>shop-dev, shop-test, pay-test, data-dev</td><td>EU Region deny, cost tags, no production data</td><td>Product teams</td></tr>
<tr><td>Deployments</td><td>cicd</td><td>Pipeline roles assume deploy roles in workload accounts</td><td>Platform</td></tr>
<tr><td>Sandbox</td><td>One per engineer on request</td><td>No TGW attachment, 200 USD budget action, deny large instance families</td><td>Each engineer</td></tr>
<tr><td>Policy Staging, Suspended, Transitional</td><td>policy-test; closing accounts; Nookly's five accounts</td><td>Test SCPs; deny-all; light guardrails during assessment</td><td>Platform</td></tr>
</tbody></table>

<p><strong>Identity.</strong> Identity Center uses Entra ID as the identity source (SAML 2.0 + SCIM). Six permission sets are assigned to Entra groups: <code>Developer</code> in SDLC accounts, <code>ReadOnly</code> in Prod, <code>PlatformAdmin</code> in Infrastructure, <code>SecurityAudit</code> everywhere, <code>BillingViewer</code> in the management account and <code>IncidentResponder</code> (time-boxed, approved via a ticket). Prod changes go only through the pipeline. Root credentials of member accounts are removed with centralised root access management.</p>
<p><strong>Networking.</strong> IPAM allocates a /16 per environment from 10.0.0.0/8, so no VPC can overlap. Each workload account owns its VPC and attaches it to the shared TGW. Prod and SDLC TGW route tables are separate, so dev can't reach prod. All internet egress passes the inspection VPC.</p>
<p><strong>Logging and security.</strong> Exactly as Figure M06-8b. Security Hub findings with severity HIGH or CRITICAL go through EventBridge to the on-call tool. The baseline-protection SCP (Example 3) is attached to the root.</p>
<p><strong>Cost allocation.</strong> Activated tags <code>CostCenter</code> and <code>Environment</code>; Cost Categories map accounts to Storefront, Payments, Data and Platform, and split the Network and Security accounts' costs by each team's share of usage. Each OU has a monthly budget with alerts at 80% and 100%.</p>
<p><strong>Day-2 operations.</strong> New accounts are requested by pull request to the AFT repository; the pipeline creates the account, places it in its OU, attaches the VPC to the TGW and adds the Identity Center assignments within 40 minutes. SCP changes go to Policy Staging for a week first. Closing an account means moving it to Suspended, waiting for the data-retention review, then closing it. Break-glass is rehearsed every six months.</p>
<p><strong>Result.</strong> The PCI assessment covered 1 account and its pipeline instead of the whole estate. Nookly's accounts moved from Transitional to Workloads within ten weeks. Chargeback reports replaced a spreadsheet that took finance three days a month.</p>
<p><strong>Lessons learned.</strong> Emptying the old billing account of workloads took longer than anything else, so don't let workloads get into the management account in the first place. Designing the IP plan before the first VPC was the best early decision. And the first version of the Region-deny SCP broke Identity Center sign-in in one account because a global service was missing from <code>NotAction</code>; Policy Staging caught it.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Centralise logs from all accounts; member accounts must not be able to delete them"</td><td>Organization trail (and Config) to an S3 bucket in a dedicated <strong>Log Archive</strong> account; SCP deny on stopping/deleting</td></tr>
<tr><td>"Manage GuardDuty / Security Hub for all accounts without using the management account"</td><td>Register the <strong>Security Tooling (Audit)</strong> account as <strong>delegated administrator</strong></td></tr>
<tr><td>"Automatically enable the service in new accounts"</td><td>Organization-level auto-enable from the delegated admin (or Control Tower / StackSets with automatic deployment)</td></tr>
<tr><td>"Standardise tag keys and values across the organization"</td><td><strong>Tag policy</strong></td></tr>
<tr><td>"Prevent creation of resources without a cost-center tag"</td><td><strong>SCP</strong> with <code>aws:RequestTag</code> + <code>Null</code> condition</td></tr>
<tr><td>"Allocate costs per department across many accounts"</td><td>Activate <strong>cost allocation tags</strong> in the management account; <strong>Cost Categories</strong>; account-per-workload</td></tr>
<tr><td>"Backups in every account, copies the account owner can't delete"</td><td>Organizations <strong>backup policy</strong> + cross-account copy to a central backup account with Vault Lock</td></tr>
<tr><td>"Test new SCPs before applying them broadly"</td><td>Policy Staging OU</td></tr>
<tr><td>"Shared networking for many accounts, central egress"</td><td>Network account: TGW shared via RAM (or VPC sharing), egress VPC with NAT</td></tr>
</tbody></table>

<h3>Log Archive vs Security Tooling</h3>
<table>
<thead><tr><th></th><th>Log Archive</th><th>Security Tooling (Audit)</th></tr></thead>
<tbody>
<tr><td>Holds</td><td>Raw logs (CloudTrail, Config, flow logs)</td><td>Findings and security service administration</td></tr>
<tr><td>Who signs in</td><td>Almost nobody</td><td>Security analysts, automation</td></tr>
<tr><td>Key control</td><td>Immutability: Object Lock, deny delete</td><td>Delegated admin for GuardDuty, Security Hub, Config aggregator, Access Analyzer, Firewall Manager</td></tr>
</tbody></table>
<p><strong>Distractors:</strong> "Store the organization's logs in the management account" (it's the account you most want empty); "attach an SCP to the management account to restrict it" (SCPs don't apply there); "create an IAM user per engineer in every account"; "one OU per department"; "use a tag policy to make a tag mandatory"; "enable GuardDuty separately in each account by hand"; "put the Transit Gateway in a workload account".</p>` },

    { type: "architect", html: `
<h3>Break-glass design</h3>
<p>Normal access depends on IAM Identity Center and your IdP. If the IdP is down, misconfigured or locked out, or Identity Center is unavailable in its Region, you need a path that doesn't depend on them.</p>
<ol class="flow">
  <li><strong>Two break-glass IAM users in the management account</strong> (not one: a lost key would lock you out), each with a long random password and a hardware FIDO2 security key. No access keys.</li>
  <li><strong>Minimal permissions:</strong> they can assume <code>OrganizationAccountAccessRole</code> (or a dedicated <code>BreakGlassRole</code> in every member account, deployed by StackSets) and nothing else directly.</li>
  <li><strong>SCP exemptions</strong> reference the break-glass role with <code>aws:PrincipalArn</code> so it can fix a broken guardrail, but keep this exemption out of the baseline-protection SCP if you don't need it there.</li>
  <li><strong>Sealed credentials:</strong> password and security key stored separately (for example the password in a vault requiring two approvers, the key in a safe), so one person can't use them alone.</li>
  <li><strong>Alarm on use:</strong> an EventBridge rule or CloudWatch metric filter on the organization trail for any <code>ConsoleLogin</code> or <code>AssumeRole</code> by the break-glass principals, sending to the security on-call and opening an incident.</li>
  <li><strong>Rehearse</strong> every six months; afterwards, rotate the password and review CloudTrail for every action taken.</li>
</ol>
<p>The management account's <strong>root user</strong> is the last resort: hardware MFA, alternate contacts set, not used for break-glass. Member account roots are removed with centralised root access management.</p>

<h3>Day-2 operations playbook</h3>
<ul>
  <li><strong>Account vending as code:</strong> Account Factory or AFT; an account request includes the OU, owner, cost centre, VPC size and Identity Center assignments.</li>
  <li><strong>Policy changes:</strong> pull request → Policy Staging OU → one low-risk OU → everywhere. Watch CloudTrail for new <code>AccessDenied</code> errors after each step.</li>
  <li><strong>Drift:</strong> Control Tower reports drift if someone moves accounts or edits its SCPs outside it (M06.04); re-register the OU or repair the landing zone.</li>
  <li><strong>Moving accounts between OUs</strong> changes inherited policies immediately. Check the target OU's SCPs, backup and tag policies before moving a production account.</li>
  <li><strong>Closing accounts:</strong> move to Suspended, export what must be kept, close. A closed account can be reopened within the post-closure period (about 90 days).</li>
  <li><strong>Quotas:</strong> the number of accounts per organization has a default quota; request an increase before a big migration wave.</li>
</ul>

<h3>Troubleshooting and cost traps</h3>
<ul>
  <li><strong>"AccessDenied" right after an account move</strong>: an SCP in the new OU path, or a missing allow in an allow-list SCP at one level (M06.03).</li>
  <li><strong>GuardDuty missing in one Region:</strong> delegated admin and auto-enable are per Region; check each Region you allow.</li>
  <li><strong>Config cost:</strong> recording every resource type in every account and Region is a real line item; use periodic recording for noisy types and exclude Regions denied by SCP.</li>
  <li><strong>Duplicate trails:</strong> the first copy of management events per account is free; extra trails that log the same management events are charged. Remove old per-account trails after the organization trail is live. Data events are always charged.</li>
  <li><strong>Centralised NAT and inspection</strong> cut NAT gateway count, but add TGW per-GB processing charges; model both before deciding.</li>
  <li><strong>Too many OUs</strong> is a smell: if two OUs have identical policies, merge them.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Group accounts into OUs by <strong>function and required controls</strong>, not by org chart; attach policies to OUs; keep the tree shallow.</li>
  <li>Foundational OUs: <strong>Security</strong> (Log Archive, Security Tooling/Audit) and <strong>Infrastructure</strong> (Network, Shared Services). Then <strong>Workloads</strong> with Prod and SDLC.</li>
  <li>Optional OUs as needs appear: Sandbox, Deployments, Policy Staging, Suspended, Exceptions, Transitional, Individual Business Users.</li>
  <li>The <strong>management account runs no workloads</strong>: SCPs can't restrict it. Delegate service administration to member accounts.</li>
  <li><strong>Logs → Log Archive</strong> (immutable, org trail, Config); <strong>findings → Security Tooling</strong> (delegated admin for GuardDuty, Security Hub, Config aggregator, Access Analyzer, Firewall Manager).</li>
  <li>The <strong>Network account</strong> owns TGW, IPAM, inspection/egress, endpoints and hybrid links, shared through RAM.</li>
  <li><strong>Tag policies</strong> standardise tags; an <strong>SCP with aws:RequestTag</strong> makes them mandatory; cost allocation tags are activated in the management account; Cost Categories build business-unit views.</li>
  <li><strong>Backup policies</strong> plus a central backup account with Vault Lock give copies a compromised account can't delete.</li>
  <li>Adopt in phases: foundation and identity first, shared infrastructure next, governance at scale later; design break-glass and rehearse it.</li>
</ul>` }
  ],
  drills: [
    { id: "M06.08-d1", q: "Which account in the reference architecture should be the GuardDuty and Security Hub delegated administrator?", answers: ["security tooling", "security tooling account", "audit", "audit account", "security tooling (audit)"], hint: "Findings, not raw logs.", explain: "Security Tooling (called Audit by Control Tower) administers detection services. Log Archive only stores logs." },
    { id: "M06.08-d2", q: "Which account holds the S3 bucket that receives the organization CloudTrail trail?", answers: ["log archive", "log archive account", "logarchive", "log-archive"], explain: "Log Archive, in the Security OU: immutable evidence kept away from the accounts being audited." },
    { id: "M06.08-d3", q: "Which account should own the Transit Gateway and the IPAM delegated administration?", answers: ["network", "network account", "networking account", "networking"], explain: "The Network account in the Infrastructure OU owns shared connectivity and shares it through AWS RAM." },
    { id: "M06.08-d4", q: "An account is being decommissioned and must not run anything while its data-retention review finishes. Which OU does it go into?", answers: ["suspended", "suspended ou"], explain: "The Suspended OU has a deny-all SCP (with an exception for the security/automation role)." },
    { id: "M06.08-d5", q: "You want to try a new SCP on a couple of test accounts before attaching it to Workloads. Which OU?", answers: ["policy staging", "policy staging ou", "policystaging", "policy-staging"], explain: "The Policy Staging OU exists to test SCP, RCP and control changes safely." },
    { id: "M06.08-d6", q: "Five accounts from an acquired company join the organization but don't meet your guardrails yet. Which OU do they go into first?", answers: ["transitional", "transitional ou"], explain: "Transitional: light guardrails while the accounts are assessed and remediated, then moved to their target OU." },
    { id: "M06.08-d7", q: "Which accounts host the CI/CD pipelines that deploy into many workload accounts? (OU name)", answers: ["deployments", "deployments ou", "deployment", "deployment ou"], explain: "The Deployments OU isolates powerful pipeline roles from the workloads they deploy." },
    { id: "M06.08-d8", q: "Which Organizations policy type standardises tag key capitalisation and allowed tag values?", answers: ["tag policy", "tag policies", "tag"], explain: "Tag policies standardise tags; to make a tag mandatory you need an SCP with aws:RequestTag or a Config rule to detect it." },
    { id: "M06.08-d9", q: "In which account must cost allocation tags be activated before they appear in billing data? (one word)", answers: ["management", "management account", "payer", "payer account"], explain: "Cost allocation tags are activated in the management (payer) account's Billing console." },
    { id: "M06.08-d10", q: "An SCP denies <code>cloudtrail:StopLogging</code> and is attached to the root. Can a principal in the management account still stop the organization trail? (yes/no)", answers: ["yes", "y"], explain: "SCPs never apply to the management account, which is why it must be tightly controlled and run no workloads." }
  ],
  check: [
    { id: "M06.08-k1", type: "single", domain: "D1", task: "1.1", level: 400,
      stem: "A company with 80 accounts must keep CloudTrail logs from every account for seven years. Administrators of workload accounts, including those with AdministratorAccess, must not be able to stop logging or delete the logs. What is the MOST effective design?",
      options: [
        { t: "An organization trail delivering to an S3 bucket with Object Lock in a dedicated Log Archive account, plus an SCP that denies stopping or deleting trails", c: true, why: "Member accounts can't modify an organization trail; the bucket is outside their account; Object Lock and the SCP close the remaining gaps." },
        { t: "A trail in each account writing to a bucket in the same account, with MFA Delete enabled", c: false, why: "Account administrators own both the trail and the bucket, so they can still stop logging." },
        { t: "An organization trail delivering to a bucket in the management account", c: false, why: "Logs centralise but land in the account you most want to keep empty and tightly restricted; the reference design uses a Log Archive account." },
        { t: "CloudTrail Lake event data stores in each workload account", c: false, why: "Stored per account, so each account's administrators still control them." }
      ] },
    { id: "M06.08-k2", type: "multi", domain: "D1", task: "1.1", level: 400,
      stem: "A solutions architect is reviewing a new AWS Organizations design. Which TWO practices align with AWS multi-account best practices for the management account?",
      options: [
        { t: "Run no workloads in the management account", c: true, why: "SCPs and RCPs don't apply to the management account, so workloads there can't be guardrailed and get organization-wide power." },
        { t: "Register member accounts as delegated administrators for services such as GuardDuty and Security Hub", c: true, why: "Delegation keeps day-to-day security work out of the management account." },
        { t: "Attach a restrictive SCP to the management account to limit its administrators", c: false, why: "SCPs have no effect on the management account." },
        { t: "Host the Transit Gateway in the management account so every account can attach to it", c: false, why: "Shared networking belongs in a Network account in the Infrastructure OU." },
        { t: "Store the organization's CloudTrail logs in the management account for easy access", c: false, why: "Logs go to a dedicated Log Archive account." }
      ] },
    { id: "M06.08-k3", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company acquires a start-up with 12 AWS accounts. The accounts must join the company's organization quickly, but their workloads would break under the company's production SCPs. What should the architect do?",
      options: [
        { t: "Invite the accounts into a Transitional OU with lighter guardrails, remediate them, then move each account to its target OU", c: true, why: "This is the purpose of the Transitional OU: governance and billing immediately, strict guardrails once the accounts are ready." },
        { t: "Invite the accounts directly into Workloads/Prod and fix whatever breaks", c: false, why: "Applying production SCPs on day one risks outages in the acquired workloads." },
        { t: "Keep the accounts in a separate organization indefinitely", c: false, why: "Loses consolidated billing, central logging and governance." },
        { t: "Attach FullAWSAccess directly to each account to override the inherited OU SCPs", c: false, why: "An allow on the account can't override a Deny inherited from the OU path." }
      ] },
    { id: "M06.08-k4", type: "single", domain: "D4", task: "4.1", level: 300,
      stem: "A company has 60 accounts in AWS Organizations, one workload per account. Finance needs monthly cost reports per business unit, where each business unit owns several accounts and shares the costs of a central networking account. Which approach requires the LEAST ongoing effort?",
      options: [
        { t: "Define AWS Cost Categories that map accounts to business units and use split charge rules for the networking account", c: true, why: "Account-based Cost Categories need no per-resource tagging, and split charges allocate shared costs automatically." },
        { t: "Enable a separate organization for each business unit", c: false, why: "Loses volume discounts and central governance; far more effort." },
        { t: "Ask each team to export Cost Explorer data from their own accounts every month", c: false, why: "Manual and error-prone." },
        { t: "Create a tag policy for a BusinessUnit tag", c: false, why: "A tag policy standardises tags but doesn't produce reports or split shared costs, and the tags would also need activating." }
      ] },
    { id: "M06.08-k5", type: "single", domain: "D1", task: "1.1", level: 400,
      stem: "Every new EC2 instance in the Workloads OU must carry a CostCenter tag. Instances without the tag must not be created. What should the architect implement?",
      options: [
        { t: "An SCP on the Workloads OU that denies ec2:RunInstances when aws:RequestTag/CostCenter is null", c: true, why: "Preventive, applies to every principal in the OU, blocks creation without the tag." },
        { t: "A tag policy defining the CostCenter key with enforced_for ec2:instance", c: false, why: "A tag policy blocks noncompliant values or capitalisation, but doesn't require the tag to exist." },
        { t: "The AWS Config managed rule required-tags", c: false, why: "Detective only: it reports untagged instances after they exist." },
        { t: "Activate CostCenter as a cost allocation tag", c: false, why: "Activation only makes the tag usable in billing data." }
      ] },
    { id: "M06.08-k6", type: "single", domain: "D1", task: "1.1", level: 400,
      stem: "All workforce access to 150 accounts goes through IAM Identity Center federated with an external IdP. The company needs a way to reach any account if the IdP is unavailable, with strong controls. What should the architect design?",
      options: [
        { t: "Two break-glass IAM users in the management account with hardware MFA and no access keys, able to assume a break-glass role in member accounts, with sealed credentials and an alarm on every sign-in", c: true, why: "Independent of the IdP, minimal, auditable and alarmed: the standard break-glass pattern." },
        { t: "Share the management account root password with the on-call team", c: false, why: "Shared root credentials remove accountability and expose the most powerful identity." },
        { t: "Create an IAM user with AdministratorAccess and access keys in every member account", c: false, why: "150 long-term credentials to protect; a huge attack surface." },
        { t: "Wait for the IdP to recover, because Identity Center has no failure modes", c: false, why: "Any dependency can fail; regulated companies must show an emergency procedure." }
      ] }
  ],
  cards: ["fc-M06-8-01", "fc-M06-8-02", "fc-M06-8-03", "fc-M06-8-04", "fc-M06-8-05", "fc-M06-8-06", "fc-M06-8-07", "fc-M06-8-08", "fc-M06-8-09", "fc-M06-8-10", "fc-M06-8-11", "fc-M06-8-12"],
  references: [
    "AWS whitepaper: <em>Organizing Your AWS Environment Using Multiple Accounts</em> (recommended OUs and accounts, design principles)",
    "AWS Prescriptive Guidance: <em>AWS Security Reference Architecture (AWS SRA)</em> (Security Tooling, Log Archive, delegated administrators)",
    "AWS Organizations User Guide: <em>AWS services that you can use with AWS Organizations</em>, <em>Tag policies</em>, <em>Backup policies</em>",
    "AWS CloudTrail User Guide: <em>Creating a trail for an organization</em>",
    "AWS Control Tower User Guide: <em>What is AWS Control Tower?</em> and <em>Shared accounts</em>",
    "AWS Billing User Guide: <em>Using cost allocation tags</em> and <em>AWS Cost Categories</em>",
    "<em>System Design on AWS</em>: landing zone and Control Tower pages (PDF p413–414)",
    "Lessons M06.01–M06.07 of this module; M05.01 (centralised root access), M05.06 (cross-account patterns)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M06-8-01", front: "What are the two foundational OUs and their accounts?", back: "Security OU: Log Archive + Security Tooling (Audit). Infrastructure OU: Network + Shared Services." },
  { id: "fc-M06-8-02", front: "Log Archive vs Security Tooling?", back: "Log Archive stores raw, immutable logs (org trail, Config, flow logs); almost nobody signs in. Security Tooling is the delegated admin for detection services where analysts work on findings." },
  { id: "fc-M06-8-03", front: "Why run no workloads in the management account?", back: "SCPs and RCPs never apply to it, and it controls the whole organization. Use it only for Organizations, billing, Control Tower (and Identity Center unless delegated)." },
  { id: "fc-M06-8-04", front: "Organization trail: key properties?", back: "Created in the management (or CloudTrail delegated admin) account; logs all member accounts incl. future ones; members can't stop or delete it; deliver to the Log Archive bucket." },
  { id: "fc-M06-8-05", front: "Policy Staging, Suspended, Exceptions, Transitional OUs: purpose?", back: "Staging: test policy changes. Suspended: deny-all before closure. Exceptions: approved guardrail gaps. Transitional: acquired or migrating accounts before they're compliant." },
  { id: "fc-M06-8-06", front: "Which services are typically delegated to Security Tooling?", back: "GuardDuty, Security Hub, Config aggregator/rules, IAM Access Analyzer, Firewall Manager, Detective, Inspector, Macie." },
  { id: "fc-M06-8-07", front: "What does the Network account own?", back: "Transit Gateway, IPAM, inspection and egress VPCs, central interface endpoints, Route 53 Resolver endpoints/rules, DX/VPN; shared via RAM." },
  { id: "fc-M06-8-08", front: "Tag policy vs SCP for tags?", back: "Tag policy standardises keys/values and blocks noncompliant values on enforced types, but doesn't require the tag. SCP with aws:RequestTag + Null makes the tag mandatory." },
  { id: "fc-M06-8-09", front: "Where are cost allocation tags activated, and are they retroactive?", back: "In the management (payer) account's Billing console. Not retroactive: they apply from activation onward." },
  { id: "fc-M06-8-10", front: "Organizations backup policy?", back: "Deploys AWS Backup plans (schedule, retention, tag-based selection, cross-account/Region copies) to all accounts in an OU; pair with a central backup account and Vault Lock." },
  { id: "fc-M06-8-11", front: "Break-glass pattern for an org using Identity Center?", back: "2 IAM users in the management account, hardware MFA, no access keys, only able to assume a break-glass role in members; sealed credentials; alarm on use; rehearse." },
  { id: "fc-M06-8-12", front: "Phased landing-zone adoption order?", back: "0 foundation (mgmt hygiene, Security OU, identity, break-glass) → 1 workloads + baseline SCPs → 2 Network/Shared Services + delegated admins → 3 tag/backup policies, cost, AFT → 4 optimise." }
);
// ================================================================== 80_lab.js
/* ================================================================== LAB L06 */
var DG_L06_ORG = `
<figure>
<svg class="diagram" viewBox="0 0 760 340" role="img" aria-labelledby="l06at l06ad">
  <title id="l06at">What you build in Lab L06</title>
  <desc id="l06ad">Your management account, reached with the academy-admin SSO profile, manages the organization root. Under the root are two OUs: Sandbox, which has only FullAWSAccess, and Workloads, which has FullAWSAccess plus the L06RegionDeny SCP. One new member account sits in Workloads. You assume its OrganizationAccountAccessRole from the management account. In the member account, requests to approved Regions are allowed and requests to ap-southeast-2 get an explicit deny from the SCP. The management account itself is never restricted by SCPs.</desc>
  <defs><marker id="l06a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="12" y="20" width="220" height="110" rx="8"/>
  <text class="dg-tb" x="24" y="44">Management account</text>
  <text class="dg-ts" x="24" y="64">111122223333</text>
  <text class="dg-ts" x="24" y="82">profile academy-admin (SSO)</text>
  <text class="dg-ts" x="24" y="100">pays the bill, runs no workloads</text>
  <text class="dg-ts" x="24" y="118">SCPs never apply here</text>
  <path class="dg-line" d="M232 48 H288" marker-end="url(#l06a-ar)"/>
  <text class="dg-ts" x="236" y="40">manages</text>
  <rect class="dg-box" x="290" y="20" width="200" height="56" rx="8"/>
  <text class="dg-tb" x="302" y="44">Root r-ab12</text>
  <text class="dg-ts" x="302" y="64">FullAWSAccess</text>
  <path class="dg-line" d="M345 76 V118" marker-end="url(#l06a-ar)"/>
  <path class="dg-line" d="M470 76 V118" marker-end="url(#l06a-ar)"/>
  <rect class="dg-box" x="260" y="120" width="170" height="70" rx="8"/>
  <text class="dg-tb" x="272" y="144">OU Sandbox</text>
  <text class="dg-ts" x="272" y="164">FullAWSAccess only</text>
  <text class="dg-ts" x="272" y="180">(empty at first)</text>
  <rect class="dg-edge" x="450" y="120" width="298" height="70" rx="8"/>
  <text class="dg-tb" x="462" y="144">OU Workloads</text>
  <text class="dg-ts" x="462" y="164">FullAWSAccess</text>
  <text class="dg-ts" x="462" y="180">+ L06RegionDeny (Deny, NotAction)</text>
  <path class="dg-line" d="M604 190 V218" marker-end="url(#l06a-ar)"/>
  <rect class="dg-box" x="450" y="220" width="298" height="108" rx="8"/>
  <text class="dg-tb" x="462" y="244">Member "L06 Workloads Dev"</text>
  <text class="dg-ts" x="462" y="262">444455556666 · OrganizationAccountAccessRole</text>
  <rect class="dg-good" x="462" y="272" width="274" height="22" rx="4"/>
  <text class="dg-ts" x="472" y="287">eu-west-1, us-east-1, global: allowed</text>
  <rect class="dg-bad" x="462" y="298" width="274" height="22" rx="4"/>
  <text class="dg-ts" x="472" y="313">ap-southeast-2: explicit deny in SCP</text>
  <path class="dg-line" d="M122 130 V270 H448" marker-end="url(#l06a-ar)"/>
  <text class="dg-ts" x="140" y="262">sts:AssumeRole, profile l06-member</text>
  <text class="dg-ts" x="140" y="290">all tests run here, never in</text>
  <text class="dg-ts" x="140" y="306">the management account</text>
</svg>
<figcaption>Figure L06-1. Two OUs, one member account, one Region-deny SCP on the Workloads OU. You administer from the management account but prove every guardrail from inside the member account.</figcaption>
</figure>`;

LABS.push({
  id: "L06", title: "AWS Organizations with two OUs and a Region-deny SCP", level: 300, duration: "90–120 min (including a few minutes of waiting for the new account)",
  cost: "≈ $0 (AWS Organizations, OUs, SCPs, IAM and STS are free; the new member account is empty and only receives default VPCs, which cost nothing)",
  objective: `
<p>Build the smallest real multi-account setup and prove a guardrail works: <em>"Workload accounts may only use our approved Regions. Global services must keep working, and our platform automation role must be able to act anywhere."</em></p>
<p>You will:</p>
<ul>
<li>check (or create) an organization with <strong>all features</strong> from your own learning account, which becomes the <strong>management account</strong></li>
<li>enable the <strong>SCP policy type</strong> and see the AWS managed <code>FullAWSAccess</code> policy appear on every node</li>
<li>create two OUs, <code>Sandbox</code> and <code>Workloads</code>, and one new <strong>member account</strong> with <code>aws organizations create-account</code></li>
<li>reach the member account through its <code>OrganizationAccountAccessRole</code> with a chained CLI profile</li>
<li>write a <strong>Region-deny SCP</strong> (Deny + <code>NotAction</code> for global services + <code>aws:RequestedRegion</code> + an <code>aws:PrincipalArn</code> exemption), validate it, attach it to <code>Workloads</code>, and read the <em>"explicit deny in a service control policy"</em> error</li>
<li>prove that the management account is <strong>not</strong> affected, that the exempt role is, that policies follow the OU, and that detaching restores access</li>
<li>clean up, including what <strong>closing a member account</strong> really involves</li>
</ul>
<p>This lab puts M06.02 (AWS Organizations) and M06.03 (Service control policies) into your hands; it builds on the cross-account roles of M05.06 and Lab L05b.</p>`,
  warning: `⚠️ <strong>Read before you start.</strong> (1) Run every Organizations command from your <strong>management account</strong> with the <code>academy-admin</code> profile from Lab L01; if your learning account is already a <em>member</em> of someone else's organization (for example a company or training org), stop: you cannot create an organization there. (2) <strong>SCPs never restrict the management account</strong>, not even when attached to the root. A test run as <code>academy-admin</code> will always succeed and prove nothing; every guardrail test in this lab is run <strong>inside the member account</strong>. (3) <code>create-account</code> creates a real AWS account billed to you. It is free while empty, and the clean-up shows how to close it (or keep it for later M06 labs). (4) You need an email address that supports <strong>plus addressing</strong> (Gmail, Outlook.com, most corporate mail) or a spare address never used for an AWS account. Everything you create is named <code>L06…</code>, <code>Sandbox</code> or <code>Workloads</code>.`,
  diagram: DG_L06_ORG,
  steps: [
    { id: "s1", title: "Sign in and check (or create) the organization", html: `
<pre><code>aws sso login --profile academy-admin
export AWS_PROFILE=academy-admin
export REGION=$(aws configure get region)        # your home Region, e.g. eu-west-1
export MGMT=$(aws sts get-caller-identity --query Account --output text)
export DENIED=ap-southeast-2                      # a Region you will NOT approve
[ "$REGION" = "ap-southeast-2" ] &amp;&amp; export DENIED=sa-east-1
echo "home=$REGION mgmt=$MGMT denied=$DENIED"
mkdir -p ~/l06 &amp;&amp; cd ~/l06

aws organizations describe-organization \\
  --query 'Organization.{Id:Id,FeatureSet:FeatureSet,Mgmt:MasterAccountId}' --output table</code></pre>
<p><strong>Expected</strong> (Lab L01 step 4 enabled IAM Identity Center "with AWS Organizations", so an organization normally exists already):</p>
<pre><code>---------------------------------------------------
|              DescribeOrganization               |
+--------------+-----------------+----------------+
|  FeatureSet  |       Id        |     Mgmt       |
+--------------+-----------------+----------------+
|  ALL         |  o-a1b2c3d4e5   |  111122223333  |
+--------------+-----------------+----------------+</code></pre>
<p>Check three things:</p>
<ul>
<li><strong><code>Mgmt</code> equals <code>$MGMT</code>.</strong> If it is a different account ID, your account is a <em>member</em> of another organization. Stop here and use a standalone learning account.</li>
<li><strong>Error <code>AWSOrganizationsNotInUseException</code></strong> means there is no organization yet. Create one with all features:
<pre><code>aws organizations create-organization --feature-set ALL \\
  --query 'Organization.[Id,FeatureSet]' --output text
#   o-a1b2c3d4e5    ALL</code></pre>
AWS sends a verification email to the management account's address; verify it (it is required before you can <em>invite</em> accounts, and good hygiene anyway).</li>
<li><strong><code>FeatureSet</code> = <code>CONSOLIDATED_BILLING</code></strong> means SCPs are unavailable. Run <code>aws organizations enable-all-features</code>; with no invited members it completes almost immediately, while in a real organization every invited member must accept a handshake first (M06.02).</li>
</ul>
<div class="callout"><strong>Your learning account just changed role.</strong> It is now the management account: it pays for every member, owns the organization and cannot be restricted by SCPs or RCPs. That is exactly why the multi-account guidance says "run no workloads in the management account" (M06.01, M06.08).</div>` },

    { id: "s2", title: "Enable the SCP policy type and meet FullAWSAccess", html: `
<pre><code>export ROOT=$(aws organizations list-roots --query 'Roots[0].Id' --output text)
echo "$ROOT"                                            # r-ab12
aws organizations list-roots --query 'Roots[0].PolicyTypes' --output json
#   []   (nothing enabled yet)  or  [{"Type": "SERVICE_CONTROL_POLICY", "Status": "ENABLED"}]

aws organizations enable-policy-type --root-id "$ROOT" \\
  --policy-type SERVICE_CONTROL_POLICY \\
  --query 'Root.PolicyTypes' --output json</code></pre>
<p><strong>Expected:</strong></p>
<pre><code>[
    {
        "Type": "SERVICE_CONTROL_POLICY",
        "Status": "ENABLED"
    }
]</code></pre>
<p class="muted small">If it was already on you get <code>PolicyTypeAlreadyEnabledException</code>: fine, carry on. The status can show <code>PENDING_ENABLE</code> for a few seconds.</p>
<p>Now look at what enabling did:</p>
<pre><code>aws organizations list-policies --filter SERVICE_CONTROL_POLICY \\
  --query 'Policies[].[Name,Id,AwsManaged]' --output table
#   |  FullAWSAccess |  p-FullAWSAccess  |  True  |

aws organizations describe-policy --policy-id p-FullAWSAccess \\
  --query 'Policy.Content' --output text | python3 -m json.tool</code></pre>
<pre><code>{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}</code></pre>
<div class="callout"><strong>Why an "Allow *" policy exists at all.</strong> An SCP never <em>grants</em> anything; it sets the <strong>maximum</strong> available permissions. For an action to be available in an account, an SCP must allow it at <strong>every level</strong> from the root down to the account. AWS therefore attaches <code>FullAWSAccess</code> to the root, every OU and every account the moment SCPs are enabled, so nothing breaks. A <strong>deny-list strategy</strong> (this lab) keeps <code>FullAWSAccess</code> everywhere and adds Deny statements; an <strong>allow-list strategy</strong> replaces it with narrower Allows at each level (M06.03).</div>` },

    { id: "s3", title: "Create the Sandbox and Workloads OUs", html: `
<pre><code>export OU_SANDBOX=$(aws organizations create-organizational-unit \\
  --parent-id "$ROOT" --name Sandbox \\
  --tags Key=lab,Value=L06 \\
  --query 'OrganizationalUnit.Id' --output text)

export OU_WORKLOADS=$(aws organizations create-organizational-unit \\
  --parent-id "$ROOT" --name Workloads \\
  --tags Key=lab,Value=L06 \\
  --query 'OrganizationalUnit.Id' --output text)

echo "Sandbox=$OU_SANDBOX Workloads=$OU_WORKLOADS"
aws organizations list-organizational-units-for-parent --parent-id "$ROOT" \\
  --query 'OrganizationalUnits[].[Name,Id]' --output table</code></pre>
<p><strong>Expected:</strong> two rows, for example <code>Sandbox ou-ab12-11111111</code> and <code>Workloads ou-ab12-22222222</code>. The OU ID embeds the root ID (<code>ab12</code>).</p>
<p class="muted small">If an OU with that name already exists you get <code>DuplicateOrganizationalUnitException</code>. Reuse it: <code>aws organizations list-organizational-units-for-parent --parent-id "$ROOT" --query "OrganizationalUnits[?Name=='Workloads'].Id" --output text</code>.</p>
<p>Confirm that each new OU inherited the default SCP:</p>
<pre><code>aws organizations list-policies-for-target --target-id "$OU_WORKLOADS" \\
  --filter SERVICE_CONTROL_POLICY --query 'Policies[].Name' --output text
#   FullAWSAccess</code></pre>
<div class="callout tip"><strong>OUs are for policy, not for org charts.</strong> Group accounts by the guardrails they need (workloads, sandbox, security, infrastructure), not by department. OUs can nest up to five levels below the root, but most well-run organizations stay at two or three (M06.08).</div>` },

    { id: "s4", title: "Create a member account (and wait for it)", html: `
<p>Every AWS account needs an email address that has <strong>never been used by any other AWS account</strong>. Plus addressing gives you unlimited unique addresses that all land in your inbox: <code>you+l06-workloads@gmail.com</code> is delivered to <code>you@gmail.com</code>, but AWS treats it as a different address.</p>
<pre><code>export MEMBER_EMAIL="you+l06-workloads@example.com"     # ← change to YOUR address with a +tag

export CAR=$(aws organizations create-account \\
  --email "$MEMBER_EMAIL" \\
  --account-name "L06 Workloads Dev" \\
  --role-name OrganizationAccountAccessRole \\
  --iam-user-access-to-billing DENY \\
  --tags Key=lab,Value=L06 \\
  --query 'CreateAccountStatus.Id' --output text)
echo "$CAR"                                              # car-1a2b3c4d5e6f...</code></pre>
<p><code>create-account</code> is <strong>asynchronous</strong>: it returns a request ID (<code>car-…</code>), not an account. Poll it:</p>
<pre><code>while true; do
  read STATE MEMBER REASON &lt;&lt;&lt; "$(aws organizations describe-create-account-status \\
    --create-account-request-id "$CAR" \\
    --query 'CreateAccountStatus.[State,AccountId,FailureReason]' --output text)"
  echo "$(date +%T) $STATE $MEMBER $REASON"
  [ "$STATE" != "IN_PROGRESS" ] &amp;&amp; break
  sleep 15
done
export MEMBER</code></pre>
<p><strong>Expected</strong> after one to a few minutes:</p>
<pre><code>10:02:11 IN_PROGRESS None None
10:02:26 IN_PROGRESS None None
10:03:12 SUCCEEDED 444455556666 None</code></pre>
<table>
<thead><tr><th>If you see</th><th>Meaning</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>FAILED EMAIL_ALREADY_EXISTS</code></td><td>The address belongs to another AWS account</td><td>Use another <code>+tag</code>; run the command again</td></tr>
<tr><td><code>FAILED ACCOUNT_LIMIT_EXCEEDED</code></td><td>The organization reached its account quota (new organizations start with a small default)</td><td>Request an increase in <strong>Service Quotas → AWS Organizations</strong>, or reuse an existing member</td></tr>
<tr><td><code>FAILED INVALID_IDENTITY_FOR_BUSINESS_VALIDATION</code> or similar</td><td>The management account is not fully verified yet</td><td>Finish account verification / contact Support, then retry</td></tr>
<tr><td><code>ConcurrentModificationException</code></td><td>Another account operation is running</td><td>Wait a minute and retry</td></tr>
</tbody></table>
<p>What AWS did for you:</p>
<ul>
<li>created the account <strong>in the root</strong> of the organization (you move it next), with consolidated billing to your management account;</li>
<li>created the IAM role <strong><code>OrganizationAccountAccessRole</code></strong> in it, with the <code>AdministratorAccess</code> managed policy and a trust policy that trusts <code>arn:aws:iam::&lt;management-account&gt;:root</code>. Accounts you <em>invite</em> do <strong>not</strong> get this role; you create it yourself (M06.02);</li>
<li>created a root user with <strong>no password</strong>. Nobody can sign in as root until someone uses "Forgot password" with that email. In a real organization, use <strong>centralised root access management</strong> to remove member root credentials entirely (M05.01).</li>
</ul>
<pre><code>aws organizations describe-account --account-id "$MEMBER" \\
  --query 'Account.{Name:Name,Email:Email,Status:Status,State:State,Method:JoinedMethod}' --output table
#   Name "L06 Workloads Dev", Status ACTIVE, Method CREATED
#   (newer CLI versions also show State ACTIVE; Status is the older field)</code></pre>` },

    { id: "s5", title: "Move the account to Workloads and reach it with a CLI profile", html: `
<pre><code>aws organizations move-account --account-id "$MEMBER" \\
  --source-parent-id "$ROOT" --destination-parent-id "$OU_WORKLOADS"

aws organizations list-parents --child-id "$MEMBER" \\
  --query 'Parents[0].[Type,Id]' --output text
#   ORGANIZATIONAL_UNIT    ou-ab12-22222222</code></pre>
<p>An account belongs to <strong>exactly one</strong> parent (the root or one OU), so a move always names the source and destination. Now add a CLI profile that assumes the member's admin role using your SSO session as the source credentials:</p>
<pre><code>aws configure set profile.l06-member.role_arn \\
  "arn:aws:iam::$MEMBER:role/OrganizationAccountAccessRole"
aws configure set profile.l06-member.source_profile academy-admin
aws configure set profile.l06-member.region "$REGION"
aws configure set profile.l06-member.role_session_name l06-tester

aws sts get-caller-identity --profile l06-member</code></pre>
<p><strong>Expected:</strong></p>
<pre><code>{
    "UserId": "AROA...:l06-tester",
    "Account": "444455556666",
    "Arn": "arn:aws:sts::444455556666:assumed-role/OrganizationAccountAccessRole/l06-tester"
}</code></pre>
<p>The resulting block in <code>~/.aws/config</code> looks like this:</p>
<pre><code>[profile l06-member]
role_arn = arn:aws:iam::444455556666:role/OrganizationAccountAccessRole
source_profile = academy-admin
region = eu-west-1
role_session_name = l06-tester</code></pre>
<p><strong>Baseline before any guardrail</strong>: the member can use the "forbidden" Region today.</p>
<pre><code>aws ec2 describe-vpcs --profile l06-member --region "$DENIED" \\
  --query 'Vpcs[].[VpcId,CidrBlock,IsDefault]' --output text
#   vpc-0a1b2c3d4e5f60789   172.31.0.0/16   True</code></pre>
<p class="muted small">A brand-new account can return <code>OptInRequired</code>, <code>PendingVerification</code> or <code>AuthFailure</code> from EC2 for the first few minutes while services are activated. Wait 5–10 minutes and retry. Every new account gets a default VPC in each default-enabled Region.</p>` },

    { id: "s6", title: "Write and validate the Region-deny SCP", html: `
<p>Approved Regions: your home Region and <code>us-east-1</code> (many global-service control planes live there). The template uses placeholders; the shell fills them in.</p>
<pre><code>cat &gt; scp.template.json &lt;&lt;'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideApprovedRegions",
      "Effect": "Deny",
      "NotAction": [
        "account:*",
        "aws-portal:*",
        "budgets:*",
        "ce:*",
        "cloudfront:*",
        "cur:*",
        "ec2:DescribeRegions",
        "globalaccelerator:*",
        "health:*",
        "iam:*",
        "organizations:*",
        "pricing:*",
        "route53:*",
        "route53domains:*",
        "s3:GetAccountPublicAccessBlock",
        "s3:ListAllMyBuckets",
        "s3:PutAccountPublicAccessBlock",
        "shield:*",
        "sts:*",
        "support:*",
        "trustedadvisor:*",
        "waf:*",
        "wafv2:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": ["HOME_REGION", "us-east-1"]
        },
        "ArnNotLike": {
          "aws:PrincipalArn": ["arn:aws:iam::*:role/L06PlatformAdmin"]
        }
      }
    }
  ]
}
EOF
sed "s/HOME_REGION/$REGION/" scp.template.json &gt; scp.json
python3 -m json.tool scp.json &gt; /dev/null &amp;&amp; echo "valid JSON"
wc -c &lt; scp.json                                   # must be ≤ 5120 characters</code></pre>
<p>Read it line by line:</p>
<table>
<thead><tr><th>Element</th><th>What it does</th><th>What goes wrong without it</th></tr></thead>
<tbody>
<tr><td><code>"Effect": "Deny"</code></td><td>Removes actions from the account's maximum permissions. Combined with <code>FullAWSAccess</code> this is a deny-list SCP.</td><td>An SCP "Allow" here would grant nothing new and remove nothing.</td></tr>
<tr><td><code>NotAction</code> list</td><td>The Deny applies to <strong>every action except</strong> these global or billing services, whose requests are signed for <code>us-east-1</code> (or another fixed Region) regardless of where you are.</td><td>With <code>"Action": "*"</code>, IAM, Organizations, Route 53, CloudFront, Support and billing would break whenever <code>us-east-1</code> is not approved.</td></tr>
<tr><td><code>StringNotEquals aws:RequestedRegion</code></td><td>Matches requests whose target Region is <em>not</em> in the approved list.</td><td>Without a condition the Deny would block everything not in <code>NotAction</code>, everywhere.</td></tr>
<tr><td><code>ArnNotLike aws:PrincipalArn</code></td><td>Exempts the platform role in any member account. For a role session, <code>aws:PrincipalArn</code> is the <strong>role</strong> ARN (<code>arn:aws:iam::…:role/…</code>), not the <code>sts</code> assumed-role ARN.</td><td>Your automation pipeline or break-glass role could not repair anything outside the approved Regions.</td></tr>
</tbody></table>
<p>Two condition operators in one <code>Condition</code> block are ANDed: the Deny fires only when the Region is unapproved <strong>and</strong> the caller is not the exempt role.</p>
<div class="callout warn"><strong>Why we do not exempt <code>OrganizationAccountAccessRole</code> here.</strong> In production you often do exempt your administration or pipeline role, exactly as the template exempts <code>L06PlatformAdmin</code>. In this lab, <code>OrganizationAccountAccessRole</code> is your <em>test</em> identity, so it must stay subject to the guardrail. Because SCPs never affect the management account, you can never lock yourself out of the organization with an SCP: you can always detach it from <code>academy-admin</code>.</div>
<p>Now let IAM Access Analyzer check it as an SCP (not as an identity policy):</p>
<pre><code>aws accessanalyzer validate-policy \\
  --policy-type SERVICE_CONTROL_POLICY \\
  --policy-document file://scp.json \\
  --query 'findings[].[findingType,issueCode]' --output table</code></pre>
<p><strong>Expected:</strong> no <code>ERROR</code> or <code>SECURITY_WARNING</code> rows. (If your home Region <em>is</em> <code>us-east-1</code>, a <code>SUGGESTION</code> about a duplicate value is harmless; remove the duplicate if you like.)</p>
<p class="muted small">This list is a trimmed version of AWS's published example. Before production use, compare it with the current example in the Organizations User Guide and with the Control Tower Region deny control, which maintain the full exemption list.</p>` },

    { id: "s7", title: "Create the SCP and attach it to the Workloads OU", html: `
<pre><code>export SCP_ID=$(aws organizations create-policy \\
  --name L06RegionDeny \\
  --description "Deny requests outside approved Regions (Lab L06)" \\
  --type SERVICE_CONTROL_POLICY \\
  --content file://scp.json \\
  --tags Key=lab,Value=L06 \\
  --query 'Policy.PolicySummary.Id' --output text)
echo "$SCP_ID"                                           # p-a1b2c3d4

aws organizations attach-policy --policy-id "$SCP_ID" --target-id "$OU_WORKLOADS"</code></pre>
<p>Inspect the inheritance chain from the root down to the account:</p>
<pre><code>for T in "$ROOT" "$OU_WORKLOADS" "$MEMBER"; do
  printf '%-20s ' "$T"
  aws organizations list-policies-for-target --target-id "$T" \\
    --filter SERVICE_CONTROL_POLICY --query 'Policies[].Name' --output text
done

aws organizations list-targets-for-policy --policy-id "$SCP_ID" \\
  --query 'Targets[].[Type,Name]' --output text</code></pre>
<p><strong>Expected:</strong></p>
<pre><code>r-ab12               FullAWSAccess
ou-ab12-22222222     FullAWSAccess   L06RegionDeny
444455556666         FullAWSAccess
ORGANIZATIONAL_UNIT  Workloads</code></pre>
<p>Notice that <code>list-policies-for-target</code> on the account shows only what is attached <strong>directly</strong>. The effective guardrail is the combination of every level: root (allows all) ∩ Workloads (allows all, minus the Deny) ∩ account (allows all). Nothing is shown "inherited" in the output; you have to walk the tree yourself, which is why the M06.03 troubleshooting playbook starts with <code>list-parents</code>.</p>
<div class="callout"><strong>Quotas to remember:</strong> an SCP document can be at most <strong>5,120 characters</strong>, and at most <strong>5 SCPs</strong> can be attached to the root, any OU or any account. Large organizations hit these limits, which is why they consolidate statements and minify JSON (whitespace counts when created through the console).</div>` },

    { id: "s8", title: "Prove the guardrail from inside the member account", html: `
<p><strong>Predict each outcome first</strong> (allowed or denied), then run the commands. SCP changes are eventually consistent, so give it a short pause.</p>
<pre><code>sleep 30

# A. Unapproved Region, regional service → ✘
aws ec2 describe-vpcs --profile l06-member --region "$DENIED"
aws sqs list-queues   --profile l06-member --region "$DENIED"

# B. Approved Regions → ✔
aws ec2 describe-vpcs --profile l06-member --region "$REGION" \\
  --query 'Vpcs[].VpcId' --output text
aws ec2 describe-vpcs --profile l06-member --region us-east-1 \\
  --query 'Vpcs[].VpcId' --output text

# C. Global services and exempt actions, even with the unapproved Region → ✔
aws iam list-roles --profile l06-member --region "$DENIED" \\
  --query 'length(Roles)'
aws s3 ls --profile l06-member --region "$DENIED"; echo "exit=$?"
aws ec2 describe-regions --profile l06-member --region "$DENIED" \\
  --query 'length(Regions)'

# D. The management account is never restricted by SCPs → ✔
aws ec2 describe-vpcs --profile academy-admin --region "$DENIED" \\
  --query 'Vpcs[].VpcId' --output text</code></pre>
<p><strong>Expected for A:</strong></p>
<pre><code>An error occurred (UnauthorizedOperation) when calling the DescribeVpcs operation:
You are not authorized to perform this operation. User:
arn:aws:sts::444455556666:assumed-role/OrganizationAccountAccessRole/l06-tester
is not authorized to perform: ec2:DescribeVpcs with an explicit deny in a service control policy

An error occurred (AccessDenied) when calling the ListQueues operation: User:
arn:aws:sts::444455556666:assumed-role/OrganizationAccountAccessRole/l06-tester
is not authorized to perform: sqs:listqueues ... with an explicit deny in a service control policy</code></pre>
<table>
<thead><tr><th>Test</th><th>Result</th><th>Why</th></tr></thead>
<tbody>
<tr><td>A: EC2 / SQS in <code>$DENIED</code></td><td>✘ explicit deny in an SCP</td><td>Not in <code>NotAction</code>, Region not approved, caller not exempt: all three conditions of the Deny are true</td></tr>
<tr><td>B: EC2 in home Region / <code>us-east-1</code></td><td>✔ VPC IDs</td><td><code>StringNotEquals</code> is false, so the Deny does not apply; <code>AdministratorAccess</code> grants</td></tr>
<tr><td>C: <code>iam:ListRoles</code></td><td>✔ a number</td><td><code>iam:*</code> is in <code>NotAction</code>; IAM is global (its requests are signed for <code>us-east-1</code> anyway)</td></tr>
<tr><td>C: <code>aws s3 ls</code></td><td>✔ empty list, <code>exit=0</code></td><td><code>s3:ListAllMyBuckets</code> is in <code>NotAction</code>. Creating a bucket in <code>$DENIED</code> would be denied</td></tr>
<tr><td>C: <code>ec2:DescribeRegions</code></td><td>✔ a number</td><td>Exempted on purpose so consoles and tools can list Regions</td></tr>
<tr><td>D: management account in <code>$DENIED</code></td><td>✔ VPC IDs</td><td>SCPs never apply to the management account, even if attached to the root</td></tr>
</tbody></table>
<div class="callout tip"><strong>Reading denials.</strong> "<em>with an explicit deny in a service control policy</em>" tells you exactly which layer said no; the alternatives are "…in an identity-based policy", "…in a resource control policy", "…because no identity-based policy allows…", and so on (M05.04). The exact wording and error code (<code>UnauthorizedOperation</code>, <code>AccessDenied</code>, <code>AccessDeniedException</code>) vary by service; the "explicit deny in a service control policy" phrase is the clue. Some EC2 write actions return an <em>encoded authorization message</em> instead; decode it with <code>aws sts decode-authorization-message</code> (needs <code>sts:DecodeAuthorizationMessage</code>).</div>` },

    { id: "s9", title: "Prove the exemption with the platform role", html: `
<p>Create the exempt role <strong>inside the member account</strong>. IAM is global and exempt, so <code>l06-member</code> can do it. The role trusts only <code>OrganizationAccountAccessRole</code> and gets read-only rights.</p>
<pre><code>cat &gt; platform-trust.json &lt;&lt;EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::$MEMBER:role/OrganizationAccountAccessRole" },
    "Action": "sts:AssumeRole"
  }]
}
EOF
python3 -m json.tool platform-trust.json &gt; /dev/null &amp;&amp; echo "valid trust JSON"

aws iam create-role --profile l06-member --role-name L06PlatformAdmin \\
  --assume-role-policy-document file://platform-trust.json \\
  --query Role.Arn --output text
aws iam attach-role-policy --profile l06-member --role-name L06PlatformAdmin \\
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess

# Chained profile: academy-admin → OrganizationAccountAccessRole → L06PlatformAdmin
aws configure set profile.l06-platform.role_arn "arn:aws:iam::$MEMBER:role/L06PlatformAdmin"
aws configure set profile.l06-platform.source_profile l06-member
aws configure set profile.l06-platform.region "$REGION"

sleep 10    # new IAM roles take a few seconds to become assumable
aws sts get-caller-identity --profile l06-platform --query Arn --output text
aws ec2 describe-vpcs --profile l06-platform --region "$DENIED" \\
  --query 'Vpcs[].VpcId' --output text</code></pre>
<p><strong>Expected:</strong> <code>arn:aws:sts::444455556666:assumed-role/L06PlatformAdmin/botocore-session-…</code>, then the VPC ID in <code>$DENIED</code>. Same account, same Region, same SCP: the only difference is <code>aws:PrincipalArn</code> = <code>arn:aws:iam::444455556666:role/L06PlatformAdmin</code>, which matches the <code>ArnNotLike</code> pattern, so the Deny does not apply.</p>
<div class="callout warn"><strong>An exemption is a privilege: protect it.</strong> Anyone who can create or edit a role named <code>L06PlatformAdmin</code> in a member account has escaped the Region guardrail. Production SCPs add a second statement that denies <code>iam:CreateRole</code>, <code>iam:UpdateAssumeRolePolicy</code>, <code>iam:AttachRolePolicy</code>, <code>iam:PutRolePolicy</code> and <code>iam:DeleteRole</code> on <code>arn:aws:iam::*:role/L06PlatformAdmin</code> unless the caller is itself the platform pipeline role (M06.03). Use a distinctive path or name, and create such roles only through StackSets or Account Factory.</div>
<p class="muted small">Role chaining limits the second session to one hour; that is fine for a test. Real pipelines assume the platform role directly from a tooling account.</p>` },

    { id: "s10", title: "Policies follow the OU: move the account to Sandbox and back", html: `
<pre><code>aws organizations move-account --account-id "$MEMBER" \\
  --source-parent-id "$OU_WORKLOADS" --destination-parent-id "$OU_SANDBOX"
sleep 30
aws ec2 describe-vpcs --profile l06-member --region "$DENIED" \\
  --query 'Vpcs[].VpcId' --output text            # ✔ now allowed

aws organizations move-account --account-id "$MEMBER" \\
  --source-parent-id "$OU_SANDBOX" --destination-parent-id "$OU_WORKLOADS"
sleep 30
aws ec2 describe-vpcs --profile l06-member --region "$DENIED" \\
  --query 'Vpcs[].VpcId' --output text            # ✘ explicit deny again</code></pre>
<p>The SCP is attached to the <strong>OU</strong>, not the account. Moving an account changes its guardrails immediately (give or take propagation), without touching any policy. That is both the power of OUs and a risk: in production, restrict <code>organizations:MoveAccount</code> to the platform team and use a <strong>Policy Staging OU</strong> to test new SCPs on a disposable account before attaching them to <code>Workloads</code> (M06.03, M06.08).</p>
<div class="callout">In a real <code>Sandbox</code> OU you would attach different guardrails (for example deny expensive instance families, deny leaving the organization, and a budget action), not "no guardrails". It is empty here only so the contrast is obvious.</div>` },

    { id: "s11", title: "Run the validation checks", html: `<p>While the SCP is still attached, run every command in <strong>Validate your work</strong> below and compare with the expected results. Then complete the auto-graded worksheet; several questions are about the next step, so predict before you run it.</p>` },

    { id: "s12", title: "Detach the SCP, re-test, and try to remove the last SCP", html: `
<pre><code>aws organizations detach-policy --policy-id "$SCP_ID" --target-id "$OU_WORKLOADS"
sleep 30
aws ec2 describe-vpcs --profile l06-member --region "$DENIED" \\
  --query 'Vpcs[].VpcId' --output text            # ✔ allowed again</code></pre>
<p>Now try to strip the default allow from the member account, where <code>FullAWSAccess</code> is the only SCP attached directly:</p>
<pre><code>aws organizations detach-policy --policy-id p-FullAWSAccess --target-id "$MEMBER"</code></pre>
<p><strong>Expected:</strong></p>
<pre><code>An error occurred (ConstraintViolationException) when calling the DetachPolicy operation:
... MIN_POLICY_TYPE_ATTACHMENT_LIMIT_EXCEEDED ...</code></pre>
<p>Every root, OU and account must have <strong>at least one SCP</strong> attached while the policy type is enabled. If you attached a narrower Allow SCP first and then detached <code>FullAWSAccess</code>, the account would be limited to that Allow list: that is the <strong>allow-list strategy</strong>. Had you detached <code>FullAWSAccess</code> from the <code>Workloads</code> OU while <code>L06RegionDeny</code> stayed attached, <em>every</em> action in the member account would be denied, even in approved Regions, because nothing at the OU level would allow it any more (a Deny-only SCP grants nothing).</p>` }
  ],
  drillsTitle: "Guardrail prediction worksheet (auto-graded)",
  drills: [
    { id: "L06-d01", q: "Which <code>--feature-set</code> value must an organization use before you can enable SCPs? (CLI value)", answers: ["ALL", "all features"], explain: "Only an organization with all features supports SCPs, RCPs, declarative and management policies. <code>CONSOLIDATED_BILLING</code> gives billing only; <code>enable-all-features</code> upgrades it." },
    { id: "L06-d02", q: "Which <code>--policy-type</code> value did you pass to <code>enable-policy-type</code>?", answers: ["SERVICE_CONTROL_POLICY"], explain: "Policy types are enabled per root: <code>SERVICE_CONTROL_POLICY</code>, <code>RESOURCE_CONTROL_POLICY</code>, <code>DECLARATIVE_POLICY_EC2</code>, <code>TAG_POLICY</code>, <code>BACKUP_POLICY</code>, <code>AISERVICES_OPT_OUT_POLICY</code>, …" },
    { id: "L06-d03", q: "<code>create-account</code> returns a <code>car-…</code> ID. Which CLI operation do you poll until <code>State</code> is <code>SUCCEEDED</code>?", answers: ["describe-create-account-status", "aws organizations describe-create-account-status", "organizations describe-create-account-status"], explain: "Account creation is asynchronous. <code>describe-create-account-status --create-account-request-id car-…</code> returns <code>IN_PROGRESS</code>, <code>SUCCEEDED</code> (with <code>AccountId</code>) or <code>FAILED</code> (with <code>FailureReason</code>)." },
    { id: "L06-d04", q: "Your colleague's <code>create-account</code> fails with <code>FailureReason</code> = ? when the email address already belongs to another AWS account.", answers: ["EMAIL_ALREADY_EXISTS"], explain: "Every AWS account needs a globally unique email. Plus addressing (<code>you+tag@domain</code>) makes new unique addresses that still reach your inbox." },
    { id: "L06-d05", q: "Name of the admin role that Organizations creates in a new member account by default.", answers: ["OrganizationAccountAccessRole"], explain: "It has <code>AdministratorAccess</code> and trusts the management account. Invited accounts don't get it automatically; you create it yourself." },
    { id: "L06-d06", q: "With <code>L06RegionDeny</code> on Workloads: <code>aws ec2 describe-vpcs --region ap-southeast-2 --profile l06-member</code>. allowed or denied?", answers: ["denied", "deny", "explicit deny"], explain: "<code>ec2:DescribeVpcs</code> is not in <code>NotAction</code>, the Region is not approved, and <code>OrganizationAccountAccessRole</code> is not exempt, so the SCP Deny applies." },
    { id: "L06-d07", q: "Same SCP, same account: <code>aws ec2 describe-vpcs --region us-east-1 --profile l06-member</code>. allowed or denied?", answers: ["allowed", "allow"], explain: "<code>us-east-1</code> is in the approved list, so <code>StringNotEquals</code> is false and the Deny doesn't match. <code>FullAWSAccess</code> and <code>AdministratorAccess</code> do the rest." },
    { id: "L06-d08", q: "Same SCP: <code>aws ec2 describe-vpcs --region ap-southeast-2 --profile academy-admin</code> (management account). allowed or denied?", answers: ["allowed", "allow"], explain: "SCPs never affect the management account, even when attached to the root. That's why every test runs in the member account." },
    { id: "L06-d09", q: "Same SCP, member account: <code>aws iam list-roles --region ap-southeast-2</code>. allowed or denied?", answers: ["allowed", "allow"], explain: "<code>iam:*</code> is in <code>NotAction</code>, so the Deny never covers IAM actions, whatever Region the CLI is set to." },
    { id: "L06-d10", q: "Same SCP, member account: <code>aws ec2 describe-regions --region ap-southeast-2</code>. allowed or denied?", answers: ["allowed", "allow"], hint: "Read the NotAction list carefully.", explain: "<code>ec2:DescribeRegions</code> is explicitly listed in <code>NotAction</code>; every other EC2 action in that Region is denied." },
    { id: "L06-d11", q: "Same SCP: <code>aws ec2 describe-vpcs --region ap-southeast-2 --profile l06-platform</code> (role <code>L06PlatformAdmin</code>). allowed or denied?", answers: ["allowed", "allow"], explain: "<code>aws:PrincipalArn</code> matches <code>arn:aws:iam::*:role/L06PlatformAdmin</code>, so the <code>ArnNotLike</code> condition is false and the Deny doesn't apply. <code>ReadOnlyAccess</code> grants the call." },
    { id: "L06-d12", q: "For a role session, does <code>aws:PrincipalArn</code> contain the IAM role ARN or the STS assumed-role ARN? Answer <em>iam</em> or <em>sts</em>.", answers: ["iam", "role", "iam role arn", "role arn"], explain: "<code>aws:PrincipalArn</code> is <code>arn:aws:iam::ACCOUNT:role/NAME</code> (path included), which is why exemptions are written against the role ARN. <code>aws:userid</code> and the error message show the <code>sts</code> session ARN." },
    { id: "L06-d13", q: "You move the member account to the <code>Sandbox</code> OU (only <code>FullAWSAccess</code>). <code>describe-vpcs</code> in ap-southeast-2 with <code>l06-member</code>: allowed or denied?", answers: ["allowed", "allow"], explain: "The SCP is attached to Workloads, not to the account. Guardrails follow the OU an account sits in." },
    { id: "L06-d14", q: "Hypothetical: you detach <code>FullAWSAccess</code> from Workloads but leave <code>L06RegionDeny</code> attached. <code>describe-vpcs</code> in your <strong>approved</strong> home Region from the member account: allowed or denied?", answers: ["denied", "deny", "implicit deny"], explain: "An action must be allowed by an SCP at every level. With only a Deny-only SCP on the OU, nothing at that level allows anything, so everything is (implicitly) denied." },
    { id: "L06-d15", q: "Detaching the only SCP from an account fails with which constraint reason? (the UPPER_CASE reason)", answers: ["MIN_POLICY_TYPE_ATTACHMENT_LIMIT_EXCEEDED"], explain: "While SCPs are enabled, every root, OU and account needs at least one SCP attached." },
    { id: "L06-d16", q: "Maximum size of one SCP document, in characters?", answers: ["5120", "5,120"], explain: "5,120 characters per SCP, and at most 5 SCPs attached per root, OU or account." },
    { id: "L06-d17", q: "Maximum number of SCPs that can be attached directly to one OU?", answers: ["5", "five"], explain: "Five per entity (root, OU or account). Consolidate statements when you approach the limit." },
    { id: "L06-d18", q: "After <code>close-account</code>, how many days is the post-closure period during which the account can still be reopened (through AWS Support)?", answers: ["90", "ninety", "90 days"], explain: "About 90 days. The account shows as <code>SUSPENDED</code> in the organization meanwhile; afterwards it is permanently closed." }
  ],
  validate: `
<pre><code>export AWS_PROFILE=academy-admin
# (re-export ROOT, OU_WORKLOADS, OU_SANDBOX, MEMBER, SCP_ID, REGION, DENIED if you opened a new shell)

# 1. Organization has all features and SCPs are enabled on the root
aws organizations describe-organization --query 'Organization.FeatureSet' --output text
#   expect ALL
aws organizations list-roots --query "Roots[0].PolicyTypes[?Type=='SERVICE_CONTROL_POLICY'].Status" --output text
#   expect ENABLED

# 2. Both OUs exist under the root
aws organizations list-organizational-units-for-parent --parent-id "$ROOT" \\
  --query "OrganizationalUnits[?Name=='Sandbox' || Name=='Workloads'].Name" --output text
#   expect Sandbox   Workloads   (any order)

# 3. The member account is ACTIVE and sits in Workloads
aws organizations describe-account --account-id "$MEMBER" --query 'Account.Status' --output text
#   expect ACTIVE
aws organizations list-accounts-for-parent --parent-id "$OU_WORKLOADS" \\
  --query 'Accounts[].Name' --output text
#   expect L06 Workloads Dev

# 4. The SCP is attached to Workloads only, and FullAWSAccess is still there
aws organizations list-targets-for-policy --policy-id "$SCP_ID" --query 'Targets[].Name' --output text
#   expect Workloads
aws organizations list-policies-for-target --target-id "$OU_WORKLOADS" \\
  --filter SERVICE_CONTROL_POLICY --query 'sort(Policies[].Name)' --output text
#   expect FullAWSAccess   L06RegionDeny

# 5. The SCP content is valid and has no errors or security warnings
aws organizations describe-policy --policy-id "$SCP_ID" --query 'Policy.Content' --output text &gt; live-scp.json
python3 -m json.tool live-scp.json &gt; /dev/null &amp;&amp; echo "valid JSON"
aws accessanalyzer validate-policy --policy-type SERVICE_CONTROL_POLICY \\
  --policy-document file://live-scp.json \\
  --query "length(findings[?findingType=='ERROR' || findingType=='SECURITY_WARNING'])"
#   expect valid JSON, then 0

# 6. The guardrail works in both directions
aws ec2 describe-vpcs --profile l06-member --region "$DENIED" &gt; /dev/null 2&gt;&amp;1; echo "denied-region exit=$?"
#   expect a non-zero exit (254 for a service error)
aws ec2 describe-vpcs --profile l06-member --region "$REGION" &gt; /dev/null 2&gt;&amp;1; echo "home-region exit=$?"
#   expect 0
aws ec2 describe-vpcs --profile l06-platform --region "$DENIED" &gt; /dev/null 2&gt;&amp;1; echo "exempt-role exit=$?"
#   expect 0</code></pre>
<p>All six pass? Continue with step 12, then the clean-up, and mark the lab complete.</p>`,
  cleanup: `
<p><strong>1. Remove the SCP and lab roles</strong> (always do this):</p>
<pre><code>export AWS_PROFILE=academy-admin
# Detach (ignore "PolicyNotAttachedException" if step 12 already did it), then delete
aws organizations detach-policy --policy-id "$SCP_ID" --target-id "$OU_WORKLOADS" 2&gt;/dev/null
aws organizations delete-policy --policy-id "$SCP_ID"

# The exempt role in the member account
aws iam detach-role-policy --profile l06-member --role-name L06PlatformAdmin \\
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
aws iam delete-role --profile l06-member --role-name L06PlatformAdmin

rm -rf ~/l06</code></pre>
<p><strong>2. Decide what to do with the member account.</strong></p>
<table>
<thead><tr><th>Option</th><th>When</th><th>What it costs you</th></tr></thead>
<tbody>
<tr><td><strong>Keep it</strong> (recommended if you continue with M06)</td><td>You want a real member account for later labs (Identity Center assignments, RAM sharing, Control Tower enrolment)</td><td>Nothing while empty. Leave it in <code>Workloads</code>; keep the <code>l06-member</code> profile.</td></tr>
<tr><td><strong>Close it</strong></td><td>You are done with multi-account labs</td><td>Irreversible after the post-closure period; uses one of your limited closures</td></tr>
<tr><td>Remove it from the organization (<code>remove-account-from-organization</code>)</td><td>Rarely, for a lab account</td><td>The account must first become standalone-ready: root sign-in, contact details, payment method, support plan and phone verification. Closing is far simpler.</td></tr>
</tbody></table>
<p><strong>To close it</strong>, first move it back to the root (or to a <code>Suspended</code> OU in a real organization) so the lab OUs can be deleted, then close it from the management account:</p>
<pre><code>aws organizations move-account --account-id "$MEMBER" \\
  --source-parent-id "$OU_WORKLOADS" --destination-parent-id "$ROOT"

aws organizations close-account --account-id "$MEMBER"

aws organizations describe-account --account-id "$MEMBER" \\
  --query 'Account.{Status:Status,State:State}' --output table
#   PENDING_CLOSURE at first, then SUSPENDED</code></pre>
<p>What closing really means:</p>
<ul>
<li><strong>Post-closure period (~90 days).</strong> The account is suspended: nobody can use its resources, but AWS keeps them. Within these 90 days you can ask AWS Support to <strong>reopen</strong> it. After that it is permanently closed and its content is deleted.</li>
<li>During the post-closure period the account remains visible in the organization with status <code>SUSPENDED</code> and still counts toward your organization's account quota, until AWS removes it.</li>
<li><strong>Closure quota.</strong> Through Organizations you can close only about <strong>10% of your member accounts within a rolling 30-day period</strong> (with a minimum of 10 and a maximum of 1,000). Large clean-ups therefore take weeks; plan them, and use a <code>Suspended</code> OU with a deny-all SCP to "park" accounts in the meantime.</li>
<li>Usage up to the moment of closure is still billed to the management account. Delete resources first in a real account; here there are none.</li>
<li>The email address stays tied to that account, so do not reuse it; plus addressing makes a new unique address easy.</li>
<li>The <strong>management account</strong> cannot be closed while the organization still has member accounts.</li>
</ul>
<p><strong>3. Remove the lab OUs and profiles</strong> (only once the OUs are empty):</p>
<pre><code>aws organizations delete-organizational-unit --organizational-unit-id "$OU_SANDBOX"
aws organizations delete-organizational-unit --organizational-unit-id "$OU_WORKLOADS"   # only if you closed or moved the account
# Delete the [profile l06-member] and [profile l06-platform] blocks from ~/.aws/config
# (keep l06-member if you kept the account)</code></pre>
<p><strong>4. Optional: disable SCPs.</strong> <code>aws organizations disable-policy-type --root-id "$ROOT" --policy-type SERVICE_CONTROL_POLICY</code> detaches every SCP in the organization. Leaving the type enabled with only <code>FullAWSAccess</code> attached is harmless and is what later M06 labs expect. <strong>Do not delete the organization</strong>: IAM Identity Center from Lab L01 depends on it.</p>
<p class="muted small">Nothing in this lab has an hourly cost. The only lasting artefacts are the organization (free) and, if you kept it, an empty member account (free).</p>`
});
// ================================================================== 95_quiz.js
var QUIZ = {
  passMark: 70,
  questions: [
    // ---------------------------------------------------------------- M06.01 Why multiple accounts
    {"id": "M06-Q01", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A company runs development, test and production workloads in a single AWS account, separated into three VPCs. Last month a developer's clean-up script terminated production instances, and a load test in the test VPC consumed the account's EC2 On-Demand vCPU quota so production could not scale out. The company wants an isolation boundary that separates <strong>both</strong> IAM permissions and service quotas between environments. What should a solutions architect recommend?", "options": [
      {"t": "Move each environment into its own AWS account, managed under AWS Organizations", "c": true, "why": "An account is the hard boundary in AWS: IAM principals in one account have no access to another account unless explicitly granted, and service quotas are tracked per account (per Region). Both incidents would have been contained."},
      {"t": "Keep the single account and deploy each environment into a different AWS Region", "c": false, "why": "Most quotas are per Region, so this would separate the vCPU quota, but IAM is global to the account: the developer's credentials could still terminate production resources in any Region."},
      {"t": "Tag every resource with an <code>Environment</code> tag and add tag-based conditions to the developers' IAM policies", "c": false, "why": "ABAC can reduce the permission risk if every resource is tagged correctly, but it does nothing for the shared service quotas and one missing or wrong tag reopens the gap."},
      {"t": "Attach a permissions boundary to every developer role that denies actions on the production VPC", "c": false, "why": "Boundaries limit what developer roles can do, but the account's quotas remain shared and anyone who can edit the boundaries can remove the control. It is a soft boundary inside one account."}
    ]},
    {"id": "M06-Q02", "type": "multi", "domain": "D1", "task": "1.1", "level": 200, "stem": "An online retailer processes card payments on AWS and must comply with PCI DSS. Today every workload, including the payment service, runs in one AWS account, so the auditors treat the whole account and every engineer with access to it as in scope. The company wants to <strong>reduce the PCI DSS audit scope</strong>. Which TWO actions should a solutions architect take?", "options": [
      {"t": "Move the cardholder-data workloads into dedicated AWS accounts placed in their own OU with stricter SCPs", "c": true, "why": "A separate account gives a clean, auditable boundary: only the resources and principals of those accounts are in scope, and the OU lets the company apply PCI-specific guardrails without affecting other workloads."},
      {"t": "Grant access to the PCI accounts only to the payments team, through IAM Identity Center assignments for those accounts", "c": true, "why": "Scope includes the people who can reach cardholder data. Assigning permission sets for the PCI accounts only to the payments group keeps every other engineer out of scope."},
      {"t": "Move the payment service into a separate VPC in the existing account and restrict it with security groups", "c": false, "why": "Network isolation does not separate the IAM control plane. Any principal in the account with sufficient IAM permissions can still reach the resources, so the whole account stays in scope."},
      {"t": "Tag the payment resources with <code>pci=true</code> and report on them with AWS Cost Explorer", "c": false, "why": "Tags help reporting and ABAC but are not an isolation boundary, and Cost Explorer has nothing to do with audit scope."},
      {"t": "Enable consolidated billing so the payment service has its own invoice", "c": false, "why": "Consolidated billing combines bills under one payer; it creates no security boundary and does not change audit scope."}
    ]},

    // ---------------------------------------------------------------- M06.02 AWS Organizations
    {"id": "M06-Q03", "type": "single", "domain": "D4", "task": "4.2", "level": 200, "stem": "A company has 12 standalone AWS accounts, each with its own payment method. The platform team bought a Compute Savings Plan in one account, but EC2 and Fargate usage in the other 11 accounts is still billed at On-Demand rates, and S3 usage in each account is priced in the most expensive volume tier. The company wants the Savings Plan to benefit every account and the S3 usage to be priced as one total, with the LEAST operational overhead. What should a solutions architect do?", "options": [
      {"t": "Buy a separate, smaller Savings Plan in each of the other 11 accounts", "c": false, "why": "This adds purchasing work and commitment risk in every account and still leaves S3 volume tiers calculated per account."},
      {"t": "Share the Savings Plan with the other accounts by using AWS Resource Access Manager", "c": false, "why": "Savings Plans are not a RAM-shareable resource type. Discount sharing is a feature of consolidated billing in AWS Organizations."},
      {"t": "Create an organization in AWS Organizations, invite the 11 accounts, and leave RI and Savings Plans discount sharing turned on", "c": true, "why": "Consolidated billing (free) makes the management account the single payer, combines usage across accounts for volume pricing tiers, and shares Savings Plans and RI discounts with all member accounts by default."},
      {"t": "Use AWS Cost Explorer to allocate the Savings Plan cost to each account with cost categories", "c": false, "why": "Cost categories only change how costs are grouped in reports. They do not apply the discount to other accounts' usage or combine usage tiers."}
    ]},
    {"id": "M06-Q04", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A company invited an existing standalone account (444455556666) into its organization. Administrators in the management account can switch into accounts that were created through AWS Organizations by assuming <code>OrganizationAccountAccessRole</code>, but the same switch into 444455556666 fails. What should the solutions architect do so the administrators can use the same access pattern?", "options": [
      {"t": "Enable all features in the organization, because invited accounts need all features for cross-account access", "c": false, "why": "The feature set controls policy types and integrations; it does not create roles in member accounts."},
      {"t": "Attach the <code>FullAWSAccess</code> SCP directly to account 444455556666", "c": false, "why": "SCPs never grant access, and FullAWSAccess is already inherited by default. The problem is that the role does not exist."},
      {"t": "Move account 444455556666 into the same OU as the accounts that were created through Organizations", "c": false, "why": "OU membership changes which policies apply; it does not create the missing IAM role."},
      {"t": "Sign in to account 444455556666, create a role named <code>OrganizationAccountAccessRole</code> with <code>AdministratorAccess</code>, and trust the management account in its trust policy", "c": true, "why": "Organizations creates this role automatically only for accounts it creates. Invited accounts don't get it, so an administrator of that account must create it, with a trust policy that allows the management account to assume it."}
    ]},
    {"id": "M06-Q05", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company with 120 member accounts wants Amazon GuardDuty enabled in every existing and future account. The security team must operate GuardDuty from its Security Tooling account and must NOT need to sign in to the management account for day-to-day work. Which TWO steps meet these requirements with the LEAST operational overhead?", "options": [
      {"t": "From the management account, designate the Security Tooling account as the GuardDuty delegated administrator for the organization", "c": true, "why": "Delegated administration (which also enables trusted access for GuardDuty) lets a member account manage the service for the whole organization, so day-to-day work stays out of the management account."},
      {"t": "In the Security Tooling account, configure GuardDuty to auto-enable for all organization member accounts, including new ones", "c": true, "why": "Auto-enable covers existing members and any account created or invited later, so no per-account work is needed."},
      {"t": "Send GuardDuty member invitations from the Security Tooling account to each of the 120 accounts and accept them in each account", "c": false, "why": "The invitation method is for accounts outside an organization. It needs action in every account and does not cover future accounts automatically."},
      {"t": "Attach an SCP to the Security Tooling account that allows <code>guardduty:*</code> across the organization", "c": false, "why": "SCPs never grant permissions, let alone cross-account administration. They only limit what principals in member accounts can do."},
      {"t": "Create an IAM user in every member account for the security team to enable GuardDuty manually", "c": false, "why": "This adds 120 sets of long-term credentials and manual steps, and it doesn't cover new accounts."}
    ]},

    // ---------------------------------------------------------------- M06.03 Service control policies
    {"id": "M06-Q06", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "An organization uses an allow-list SCP strategy. The root has <code>FullAWSAccess</code>. The <code>Workloads</code> OU has <code>FullAWSAccess</code> detached and an SCP that allows only <code>ec2:*</code>, <code>s3:*</code>, <code>cloudwatch:*</code> and <code>logs:*</code>. Its child OU <code>Prod</code> and the account 777788889999 inside <code>Prod</code> both have <code>FullAWSAccess</code> attached. A developer in 777788889999 whose role has <code>AdministratorAccess</code> calls <code>dynamodb:CreateTable</code>. What happens?", "options": [
      {"t": "The call is allowed, because <code>FullAWSAccess</code> is attached directly to the account", "c": false, "why": "An SCP attached to the account doesn't override its parents. For an action to be available it must be allowed at every level from the root down to the account."},
      {"t": "The call is denied, because no SCP at the <code>Workloads</code> level allows <code>dynamodb:CreateTable</code>", "c": true, "why": "With an allow-list strategy, missing an Allow at any level (here the Workloads OU) is an implicit deny that the lower levels can't re-grant. The developer's IAM policy is irrelevant once the SCP filter blocks the action."},
      {"t": "The call is allowed, because <code>AdministratorAccess</code> grants <code>dynamodb:*</code>", "c": false, "why": "IAM policies grant permissions only within the maximum set by SCPs. An action outside the SCP filter is denied regardless of the identity policy."},
      {"t": "The call is denied, because the <code>Workloads</code> SCP contains an explicit Deny for DynamoDB", "c": false, "why": "The Workloads SCP contains only Allow statements. The denial is implicit (no Allow), not an explicit Deny."}
    ]},
    {"id": "M06-Q07", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A security team wants to stop anyone in member accounts, including account administrators, from disabling GuardDuty, stopping or deleting the organization's CloudTrail trail, or deleting the AWS Config recorder. A security automation role named <code>SecurityAutomation</code>, which exists in every member account, must still be able to change these settings. Which solution is MOST effective?", "options": [
      {"t": "An SCP attached to the root that denies those actions with a condition <code>ArnNotLike</code> <code>aws:PrincipalArn</code> <code>arn:aws:iam::*:role/SecurityAutomation</code>", "c": true, "why": "A Deny in an SCP applies to every principal in member accounts, including administrators and the root user, and an aws:PrincipalArn exception is the documented way to exempt the guardrail's own automation role."},
      {"t": "An SCP attached to the root that allows those actions only for the <code>SecurityAutomation</code> role", "c": false, "why": "SCPs can't name principals, and an Allow in an SCP never grants or restricts by itself. With FullAWSAccess still attached, every administrator keeps the ability to disable the services."},
      {"t": "A permissions boundary that denies those actions, attached to every IAM role in each member account", "c": false, "why": "Boundaries must be attached role by role, don't apply to the member account's root user, and an account administrator could remove them. An SCP is the central control that account admins can't change."},
      {"t": "An SCP that denies those actions with a condition <code>StringNotEquals</code> <code>aws:PrincipalAccount</code> equal to the management account ID", "c": false, "why": "The SecurityAutomation role lives in each member account, so its aws:PrincipalAccount is the member account, and it would be denied too. SCPs don't affect the management account anyway."}
    ]},
    {"id": "M06-Q08", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company wants two guardrails for all member accounts: (1) no member account can remove itself from the organization, and (2) the root user of a member account cannot perform any actions. Which TWO SCP statements, attached to the root of the organization, meet these requirements?", "options": [
      {"t": "Deny <code>organizations:LeaveOrganization</code> on all resources", "c": true, "why": "Without this, an administrator (or the root user) of a member account could call LeaveOrganization and escape every guardrail. It is one of the most common baseline SCPs."},
      {"t": "Deny <code>*</code> on all resources with a condition <code>StringLike</code> <code>aws:PrincipalArn</code> <code>arn:aws:iam::*:root</code>", "c": true, "why": "This is AWS's documented pattern to block the root user in member accounts. SCPs are the only policy type that can restrict a member account's root user."},
      {"t": "Deny <code>iam:*</code> on the resource <code>arn:aws:iam::*:root</code>", "c": false, "why": "The Resource element names what is acted on, not who acts. This only blocks IAM actions against that ARN; the root user could still run any other action."},
      {"t": "Allow <code>organizations:LeaveOrganization</code> only for the management account", "c": false, "why": "SCPs don't apply to the management account, and an Allow in an SCP never restricts anything while FullAWSAccess is attached."},
      {"t": "Deny <code>sts:AssumeRole</code> for all principals in member accounts", "c": false, "why": "This would break almost every cross-account and service workflow and still does nothing against the root user signing in with a password."}
    ]},
    {"id": "M06-Q09", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company has hundreds of S3 buckets across 60 member accounts. Developers sometimes write bucket policies that grant access to external AWS accounts. Security requires that no principal outside the company's organization (o-a1b2c3d4e5) can access any bucket, even if a bucket policy allows it, while AWS services acting on the company's behalf keep working. Which solution meets this requirement with the LEAST operational overhead?", "options": [
      {"t": "Attach an SCP to the root that denies <code>s3:*</code> when <code>aws:PrincipalOrgID</code> is not o-a1b2c3d4e5", "c": false, "why": "SCPs only limit principals inside the organization's member accounts. A principal from an external account is not subject to the company's SCPs, so the external access would still work."},
      {"t": "Enable S3 Block Public Access at the account level in every member account", "c": false, "why": "Block Public Access stops public (anonymous or everyone) grants, but a bucket policy that names a specific external account is not public and would still be allowed."},
      {"t": "Use IAM Access Analyzer to find buckets shared outside the organization and fix them every week", "c": false, "why": "Access Analyzer detects external access but doesn't prevent it, and the weekly manual fix leaves a window of exposure and adds work."},
      {"t": "Attach a resource control policy (RCP) to the root that denies <code>s3:*</code> when <code>aws:PrincipalOrgID</code> is not o-a1b2c3d4e5, with an exception for AWS service principals", "c": true, "why": "RCPs set the maximum permissions on resources in member accounts regardless of who the caller is, so they are the organization-wide way to enforce an identity data perimeter that bucket policies can't override."}
    ]},

    // ---------------------------------------------------------------- M06.04 AWS Control Tower
    {"id": "M06-Q10", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company already uses AWS Organizations with 40 member accounts in several OUs. It now wants centralized logging in a dedicated log archive account, an audit account for the security team, preventive and detective controls, and a standard way to vend new accounts, with the LEAST operational overhead. The existing accounts must stay in the same organization. What should a solutions architect do?", "options": [
      {"t": "Create a new organization with AWS Control Tower and move all 40 accounts into it", "c": false, "why": "Control Tower can be set up in an existing organization, so a migration is unnecessary. Moving accounts between organizations is disruptive and violates the requirement."},
      {"t": "Set up an AWS Control Tower landing zone in the existing organization's management account, then register the existing OUs so their accounts are enrolled", "c": true, "why": "Control Tower creates the Security OU with Log Archive and Audit accounts, org-level CloudTrail and Config, controls and Account Factory. Registering an existing OU extends governance to its accounts without leaving the organization."},
      {"t": "Write CloudFormation StackSets for CloudTrail, Config and log buckets, plus a set of SCPs, and deploy them from the management account", "c": false, "why": "This can work, but the company would build and maintain its own landing zone, drift detection and account vending: far more operational overhead than Control Tower."},
      {"t": "Enable AWS Security Hub in every account and use its findings as the controls", "c": false, "why": "Security Hub aggregates detective findings. It doesn't create log archive or audit accounts, provide preventive controls or vend accounts."}
    ]},
    {"id": "M06-Q11", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A platform team uses AWS Control Tower. It must (1) stop CloudFormation stacks from creating Amazon RDS DB instances without encryption, before anything is provisioned, and (2) report the unencrypted Amazon EBS volumes that already exist in enrolled accounts. Which TWO Control Tower control types should the team enable?", "options": [
      {"t": "A proactive control for requirement (1)", "c": true, "why": "Proactive controls are implemented as CloudFormation hooks that check resource configurations before provisioning and fail the operation if they are non-compliant."},
      {"t": "A detective control for requirement (2)", "c": true, "why": "Detective controls are AWS Config rules that evaluate existing resources and report non-compliance, which is what is needed for volumes that already exist."},
      {"t": "A preventive control for requirement (2)", "c": false, "why": "Preventive controls (SCPs, RCPs, declarative policies) block future API calls. They can't find or report resources that already exist."},
      {"t": "A detective control for requirement (1)", "c": false, "why": "A Config rule evaluates a resource after it is created. Requirement (1) is to stop the stack before provisioning."},
      {"t": "A mandatory control for requirement (1), because only mandatory controls can block CloudFormation stacks", "c": false, "why": "Mandatory, strongly recommended and elective describe guidance (how strongly AWS recommends a control), not how it is enforced. Proactive controls are optional and are what block stacks."}
    ]},
    {"id": "M06-Q12", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company governs its organization with AWS Control Tower. Its platform team manages all infrastructure with Terraform and wants application teams to request new accounts through pull requests in a Git repository. Each new account must automatically receive the team's Terraform baseline (VPC, IAM roles, budgets) after it is created. Which solution meets these requirements with the LEAST custom development?", "options": [
      {"t": "Have application teams request accounts through the Account Factory page in the Control Tower console, then run Terraform manually", "c": false, "why": "Console requests aren't pull requests in Git, and the manual Terraform step is exactly the work the company wants to remove."},
      {"t": "Deploy Customizations for Control Tower (CfCT) and store the account requests in its configuration repository", "c": false, "why": "CfCT deploys CloudFormation templates and SCPs to accounts in response to lifecycle events. It doesn't take account requests as code and doesn't run Terraform."},
      {"t": "Deploy Account Factory for Terraform (AFT) and manage account requests and account customizations as Terraform in Git repositories", "c": true, "why": "AFT is AWS's GitOps pipeline for Control Tower: an account request committed to the repository vends an enrolled account and then applies the global and account-specific Terraform customizations automatically."},
      {"t": "Write a Lambda function that calls the Organizations <code>CreateAccount</code> API when a pull request is merged, then runs Terraform", "c": false, "why": "This is custom code to build and maintain, and accounts created directly through Organizations aren't enrolled in Control Tower, so they miss its controls."}
    ]},

    // ---------------------------------------------------------------- M06.05 IAM Identity Center at scale
    {"id": "M06-Q13", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A permission set named <code>DataReader</code> references a customer managed policy named <code>DataReadOnly</code> instead of an inline policy, because each account's version must list that account's own S3 bucket ARNs. Assigning <code>DataReader</code> to a group for 30 new accounts fails with a provisioning error. What should the solutions architect do to resolve the error and keep per-account policies?", "options": [
      {"t": "Create the <code>DataReadOnly</code> policy, with the same name and path, in each of the 30 accounts (for example with CloudFormation StackSets) and retry the provisioning", "c": true, "why": "A customer managed policy reference only stores the policy's name and path. The policy must already exist in every account the permission set is provisioned to, which lets each account's copy contain its own ARNs."},
      {"t": "Replace the reference with an inline policy in the permission set that lists all 30 buckets", "c": false, "why": "This would fix the error, but the same inline policy is copied to every account, so each account would get access to all 30 buckets and the per-account policy requirement is lost."},
      {"t": "Share the <code>DataReadOnly</code> policy from the management account with the 30 accounts through AWS RAM", "c": false, "why": "IAM policies aren't a resource type that AWS RAM can share; each account needs its own policy."},
      {"t": "Increase the permission set's session duration so that provisioning has more time to complete", "c": false, "why": "Session duration (1 to 12 hours) controls how long a user's session lasts. It has no effect on provisioning the role."}
    ]},
    {"id": "M06-Q14", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "To keep people out of the management account, a company registered its Shared Services account as the delegated administrator for IAM Identity Center. Administrators in Shared Services can create permission sets and assign them to every member account, but they cannot assign the <code>BillingAdmin</code> permission set to the finance group for the management account. What is the reason?", "options": [
      {"t": "An SCP attached to the root denies Identity Center actions that target the management account", "c": false, "why": "SCPs can't affect the management account and nothing in the scenario mentions such a policy. The limitation is built into delegated administration."},
      {"t": "The organization uses the consolidated billing feature set only", "c": false, "why": "Identity Center delegated administration already requires all features, so this isn't the cause."},
      {"t": "The organization must use an account instance of Identity Center for the management account", "c": false, "why": "Account instances are for application access only and can't grant access to AWS accounts."},
      {"t": "A delegated administrator can't manage permission sets provisioned to the management account; that assignment must be made from the management account", "c": true, "why": "To protect the management account, AWS limits the delegated administrator to member accounts. Assignments for the management account stay with administrators of the management account."}
    ]},
    {"id": "M06-Q15", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "Engineers sign in through IAM Identity Center. They need read-only access to production for a full working day, and on-call engineers occasionally need administrator access that must expire after 1 hour. Engineers also use the AWS CLI, and the company forbids long-term access keys. Which TWO actions meet these requirements?", "options": [
      {"t": "Create a <code>ProdReadOnly</code> permission set with an 8-hour session duration and a separate <code>ProdAdmin</code> permission set with a 1-hour session duration, and assign each to the right group", "c": true, "why": "Session duration is set per permission set (1 to 12 hours), so separate permission sets give each level of access its own lifetime and its own group assignment."},
      {"t": "Have engineers configure CLI profiles with <code>aws configure sso</code> and sign in with <code>aws sso login</code>", "c": true, "why": "The CLI then gets temporary credentials for the chosen account and permission set from Identity Center; nothing long-lived is stored."},
      {"t": "Set one permission set's session duration to 24 hours and revoke administrator sessions manually", "c": false, "why": "The maximum permission set session duration is 12 hours, and manual revocation doesn't meet an automatic 1-hour expiry."},
      {"t": "Edit the maximum session duration directly on the <code>AWSReservedSSO_ProdAdmin_*</code> IAM roles in each account", "c": false, "why": "Those roles are created and managed by Identity Center. Change the session duration on the permission set instead; direct edits to these roles aren't the supported way and can be overwritten when the permission set is re-provisioned."},
      {"t": "Create IAM users for on-call engineers with access keys that are rotated every 24 hours", "c": false, "why": "Access keys are long-term credentials, which the company forbids, and rotation doesn't make them expire after 1 hour."}
    ]},

    // ---------------------------------------------------------------- M06.06 AWS Directory Service
    {"id": "M06-Q16", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A company is migrating .NET applications to AWS. The applications use Amazon RDS for SQL Server with Windows Authentication and Amazon FSx for Windows File Server. Employees' accounts must stay in the on-premises Active Directory, and they must reach these AWS resources with those accounts. The company doesn't want to manage domain controllers on EC2. Which solution meets these requirements with the LEAST operational overhead?", "options": [
      {"t": "Deploy an AD Connector that points to the on-premises domain controllers and join RDS and FSx to it", "c": false, "why": "AD Connector is a proxy for authentication requests. It isn't a domain that services can join and isn't supported for RDS for SQL Server, and it can't hold trusts."},
      {"t": "Deploy AWS Managed Microsoft AD, join RDS and FSx to it, and create a trust in which the AWS Managed Microsoft AD domain trusts the on-premises domain", "c": true, "why": "AWS Managed Microsoft AD is a real AD (two domain controllers in two AZs, managed by AWS) that RDS for SQL Server and FSx for Windows can join. The trust lets on-premises users authenticate to those resources without copying accounts."},
      {"t": "Deploy Simple AD and synchronize users from the on-premises directory every night", "c": false, "why": "Simple AD doesn't support trusts or RDS for SQL Server, and a nightly copy of identities is extra work the requirement doesn't want."},
      {"t": "Install Active Directory domain controllers on EC2 instances in two AZs and join them to the on-premises forest", "c": false, "why": "This works technically, but the company must patch, back up and monitor the domain controllers itself, which is what it wants to avoid."}
    ]},
    {"id": "M06-Q17", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A small company with about 150 employees and no existing directory runs Windows and Linux EC2 instances that must be joined to a domain so users can sign in with one set of credentials. It needs no trust relationships, no MFA and no integration with RDS for SQL Server. Which solution is the MOST cost-effective?", "options": [
      {"t": "AWS Managed Microsoft AD (Enterprise Edition)", "c": false, "why": "Enterprise Edition is sized for very large directories and multi-Region replication. It works, but it is the most expensive option for 150 users."},
      {"t": "AD Connector (Small)", "c": false, "why": "AD Connector only forwards requests to an existing directory. The company has no directory for it to connect to."},
      {"t": "Simple AD (Small)", "c": true, "why": "Simple AD is a low-cost, Samba 4 based directory that supports domain join for Windows and Linux instances. The features it lacks (trusts, MFA, RDS for SQL Server) aren't needed here."},
      {"t": "Amazon Cognito user pool", "c": false, "why": "Cognito user pools manage application users. They aren't an Active Directory-compatible directory and can't domain-join instances."}
    ]},
    {"id": "M06-Q18", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company will use AD Connector so that 3,000 employees can sign in to Amazon WorkSpaces with their existing on-premises Active Directory credentials. No user data may be stored or cached in AWS. Which TWO requirements must the solutions architect plan for?", "options": [
      {"t": "Network connectivity (Site-to-Site VPN or Direct Connect) from the AD Connector VPC to the on-premises domain controllers and DNS servers", "c": true, "why": "AD Connector forwards every authentication request to the on-premises directory in real time, so it must be able to reach the domain controllers and DNS servers over a private connection."},
      {"t": "The Large AD Connector size", "c": true, "why": "The Small size is intended for up to about 500 users and Large for up to about 5,000. 3,000 users need Large."},
      {"t": "A two-way forest trust between AD Connector and the on-premises domain", "c": false, "why": "AD Connector doesn't support trusts. It is a proxy, not a domain."},
      {"t": "Nightly synchronization of password hashes from on-premises AD into AD Connector", "c": false, "why": "AD Connector stores and caches nothing, which is exactly why it fits the requirement. No synchronization is needed."},
      {"t": "A Simple AD directory between AD Connector and the on-premises domain to cache credentials", "c": false, "why": "Simple AD can't trust or proxy to another directory, and caching credentials would break the 'nothing stored in AWS' requirement."}
    ]},

    // ---------------------------------------------------------------- M06.07 Resource sharing
    {"id": "M06-Q19", "type": "single", "domain": "D4", "task": "4.4", "level": 300, "stem": "A company has 25 application accounts in its organization, and each one runs its own VPC with its own NAT gateways. The network team wants to own and control all VPCs, subnets and routing from a central Network account, while application teams keep launching and paying for their own EC2 instances, RDS databases and load balancers in their own accounts. The company also wants to reduce the number of NAT gateways. Which solution meets these requirements with the LEAST operational overhead?", "options": [
      {"t": "Peer each application VPC with a central VPC in the Network account and route outbound traffic through the central NAT gateways", "c": false, "why": "VPC peering isn't transitive, so a peered VPC can't use another VPC's NAT gateway for internet access. The 25 VPCs would also stay under the application teams' control."},
      {"t": "Create shared VPCs in the Network account and share their subnets with the application accounts through AWS RAM", "c": true, "why": "With VPC sharing, the owner (Network account) manages the VPC, subnets, route tables and gateways, while participants launch their own resources into the shared subnets and are billed for them. Fewer VPCs means far fewer NAT gateways."},
      {"t": "Give application teams an IAM role in the Network account and have them launch their resources there", "c": false, "why": "All resources would then live and be billed in the Network account, losing per-team account isolation and cost ownership."},
      {"t": "Expose a central NAT service in the Network account through AWS PrivateLink endpoints in each application VPC", "c": false, "why": "PrivateLink exposes a service behind an NLB; it isn't a way to share NAT gateways or routing, and each VPC would still be owned and run by its application team."}
    ]},
    {"id": "M06-Q20", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "The Network account (111122223333) shares two private subnets of a VPC with an application account (444455556666) through AWS RAM. Which TWO tasks can the application team perform from its own account?", "options": [
      {"t": "Launch EC2 instances and an Application Load Balancer into the shared subnets", "c": true, "why": "Participants can create their own resources in shared subnets; those resources belong to, and are billed to, the participant account."},
      {"t": "Create and manage security groups for its own resources in the shared VPC", "c": true, "why": "Participants own their security groups. They can also reference other security groups in the same shared VPC."},
      {"t": "Add a route to the shared subnets' route table that points to a new NAT gateway", "c": false, "why": "Route tables, NACLs, gateways and the subnets themselves remain under the VPC owner's control. Participants can't modify them."},
      {"t": "View and stop EC2 instances that another participant account launched in the same subnets", "c": false, "why": "Participants can't see or modify resources owned by other participants, even in the same subnet."},
      {"t": "Re-share the subnets with a partner account outside the organization", "c": false, "why": "Only the owner can share a subnet, and VPC sharing works only between accounts in the same organization."}
    ]},
    {"id": "M06-Q21", "type": "multi", "domain": "D3", "task": "3.4", "level": 300, "stem": "A central Network account owns a transit gateway that connects to the on-premises data center, and a Route 53 Resolver outbound endpoint that forwards queries for <code>corp.example.com</code> to on-premises DNS servers. Spoke VPCs in 50 workload accounts must (1) attach to the transit gateway and (2) resolve <code>corp.example.com</code>. Which TWO resources should the Network account share with the organization through AWS RAM?", "options": [
      {"t": "The transit gateway", "c": true, "why": "Sharing the transit gateway lets each spoke account create its own VPC attachment. Within an organization with RAM sharing enabled, no invitation acceptance is needed."},
      {"t": "The Route 53 Resolver forwarding rule for <code>corp.example.com</code>", "c": true, "why": "Resolver rules are RAM-shareable. Each spoke account associates the shared rule with its VPCs, and queries are sent through the Network account's outbound endpoint."},
      {"t": "The Route 53 Resolver outbound endpoint", "c": false, "why": "Endpoints aren't shared; the forwarding rule that references the endpoint is the resource that is shared and associated with the spoke VPCs."},
      {"t": "The VPC peering connections between the Network VPC and each spoke VPC", "c": false, "why": "Peering connections aren't a RAM resource type, and a transit gateway hub replaces the need for 50 peering connections."},
      {"t": "The NAT gateways in the Network account's egress VPC", "c": false, "why": "NAT gateways can't be shared through RAM. Spokes reach a central egress VPC through the transit gateway route tables."}
    ]},

    // ---------------------------------------------------------------- M06.08 Reference multi-account architecture
    {"id": "M06-Q22", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company is designing its multi-account logging. CloudTrail logs for all accounts must be collected centrally, and no administrator of a workload account or of the security tooling account may be able to delete or modify them. Which design is the MOST secure?", "options": [
      {"t": "Create an organization trail that delivers to an S3 bucket in a dedicated Log Archive account in the Security OU, with a restrictive bucket policy and SCPs that protect the trail and bucket", "c": true, "why": "This follows the AWS Security Reference Architecture: one organization trail, logs in an account that only a few people can access, and guardrails that stop member accounts from stopping the trail or tampering with the bucket."},
      {"t": "Create an organization trail that delivers to an S3 bucket in the management account", "c": false, "why": "The management account should hold as little as possible, and its administrators can't be restricted by SCPs. SRA keeps logs in a dedicated Log Archive account."},
      {"t": "Create a trail in each account that delivers to a bucket in the same account", "c": false, "why": "Each account's administrators could delete their own logs, and there is no central view."},
      {"t": "Create an organization trail that delivers to an S3 bucket in the Security Tooling account so analysts can query it directly", "c": false, "why": "The requirement excludes Security Tooling administrators. SRA separates log storage (Log Archive) from the security tools that read the logs (Security Tooling), which get read access only."}
    ]},
    {"id": "M06-Q23", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company is designing its OU structure following the AWS whitepaper <em>Organizing Your AWS Environment Using Multiple Accounts</em>. It needs (1) a place for accounts that are waiting to be closed, with all access denied, and (2) a place to test new SCPs on a few accounts before attaching them to production OUs. Which TWO OUs should it create?", "options": [
      {"t": "Suspended OU", "c": true, "why": "The Suspended OU holds accounts that are being decommissioned. A deny-all SCP attached to it stops any use while the account is closed or kept for evidence."},
      {"t": "Policy Staging OU", "c": true, "why": "The Policy Staging OU is where new or changed policies are tested on representative accounts before being applied to OUs that contain production accounts."},
      {"t": "Sandbox OU", "c": false, "why": "Sandbox accounts are for individual experimentation with relaxed controls, not for testing guardrails or holding closed accounts."},
      {"t": "Exceptions OU", "c": false, "why": "The Exceptions OU holds accounts that need a long-term exception to a security policy. It isn't a test area for new policies."},
      {"t": "Transitional OU", "c": false, "why": "The Transitional OU temporarily holds accounts that are being moved in, for example after an acquisition, until they are placed in their proper OU."}
    ]},
    {"id": "M06-Q24", "type": "single", "domain": "D4", "task": "4.1", "level": 300, "stem": "Finance needs monthly cost reports by cost center across 80 accounts in an organization. Teams tag resources inconsistently: <code>CostCenter</code>, <code>costcenter</code> and <code>cost-center</code> all appear, with free-text values. Which solution standardizes the tag and makes it available in billing reports with the LEAST operational overhead?", "options": [
      {"t": "Deploy the AWS Config <code>required-tags</code> rule in each account and ask teams to fix findings", "c": false, "why": "The rule can check keys and values, but it only detects non-compliance after resources exist, every finding across 80 accounts must be fixed by hand, and it doesn't make the tag available in billing reports."},
      {"t": "Create an AWS Cost Categories rule that groups the three tag spellings together", "c": false, "why": "Cost categories can tidy reports, but they don't stop teams creating more variants and don't validate values, so the problem keeps growing."},
      {"t": "Activate the <code>CostCenter</code> cost allocation tag in each member account's Billing console", "c": false, "why": "In an organization, user-defined cost allocation tags are activated in the management (payer) account. Activation alone also doesn't fix the inconsistent keys."},
      {"t": "Attach a tag policy to the root that defines the <code>CostCenter</code> key capitalization and allowed values, and activate <code>CostCenter</code> as a cost allocation tag in the management account", "c": true, "why": "Tag policies standardize tag keys and values across the organization, report non-compliance and can enforce compliance for chosen resource types. Activating the tag in the management account makes it a column in Cost Explorer and the Cost and Usage Report for every account."}
    ]},
    {"id": "M06-Q25", "type": "single", "domain": "D1", "task": "1.1", "level": 400, "stem": "In a company's organization, the management account runs a customer-facing application, is the GuardDuty and Security Hub administrator, and is where engineers administer IAM Identity Center every day. A security review asks to align with the AWS Security Reference Architecture. Which change is the MOST secure?", "options": [
      {"t": "Attach a restrictive SCP to the management account that allows only the services the application needs", "c": false, "why": "SCPs don't affect the management account at all, so this would change nothing."},
      {"t": "Move the application to a workload account, register the Security Tooling account as delegated administrator for GuardDuty and Security Hub, and delegate Identity Center administration to a dedicated member account", "c": true, "why": "SRA keeps the management account limited to organization and billing tasks, because it can't be governed by SCPs. Delegated administrators move daily security and identity work into member accounts that guardrails can protect."},
      {"t": "Keep everything in place but require MFA for all IAM users in the management account", "c": false, "why": "MFA is necessary but leaves an application and daily administration in the one account that no SCP can restrict, so the blast radius stays the same."},
      {"t": "Create a second management account for security services and keep the first for the application", "c": false, "why": "An organization has exactly one management account. Security services belong in a member account registered as delegated administrator."}
    ]}
  ]
};

  window.LMS_MODULES["M06"] = {
    summary: "One AWS account is a single blast radius, a single bill and a single set of quotas. This module teaches how real organisations run hundreds of accounts safely: why to split workloads into accounts, AWS Organizations and consolidated billing, service control policies and other organisation policies as guardrails, AWS Control Tower landing zones, IAM Identity Center for workforce access at scale, AWS Directory Service for Active Directory integration, AWS RAM for sharing networks and other resources, and the AWS Security Reference Architecture that ties it all together. It covers Exam Task 1.1 (Domain 1, Secure Architectures, 30%) and the multi-account billing parts of Domain 4.",
    objectives: [
      "Justify a multi-account strategy in terms of blast radius, isolation, quotas, billing and compliance scope",
      "Design an AWS Organizations OU structure and use consolidated billing, delegated administrators and trusted access",
      "Write and reason about service control policies (and RCPs) as guardrails, including Region restriction and protecting security tooling",
      "Build and operate a landing zone with AWS Control Tower, Account Factory and preventive, detective and proactive controls",
      "Run workforce access across many accounts with IAM Identity Center permission sets and an external identity provider",
      "Choose between AWS Managed Microsoft AD, AD Connector and Simple AD, and decide when to federate a directory with IAM roles",
      "Share VPC subnets, Transit Gateways and other resources across accounts with AWS RAM",
      "Apply the AWS Security Reference Architecture to design a complete multi-account environment"
    ],
    lessons: LESSONS,
    labs: typeof LABS !== "undefined" ? LABS : [LAB],
    quiz: QUIZ,
    flashcards: FLASHCARDS
  };
})();

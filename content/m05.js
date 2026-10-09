/* M05 – Identity and Access Management (IAM) (assembled from per-lesson sections) */
(function () {
  var LESSONS = [], FLASHCARDS = [];

// ================================================================== 00_init.js
// Module-level containers for multiple labs
var LABS = [];
// ================================================================== 01_fundamentals.js
/* ---------------------------------------------------------------- M05.01 IAM fundamentals */
var DG_0501_LANDSCAPE = `
<figure>
<svg class="diagram" viewBox="0 0 760 392" role="img" aria-labelledby="m0501at m0501ad">
  <title id="m0501at">The IAM principal landscape</title>
  <desc id="m0501ad">Five kinds of caller on the left: workforce humans, workloads running on AWS, workloads outside AWS such as CI/CD pipelines, third parties, and emergency access. Each maps to a recommended mechanism in the middle: IAM Identity Center with permission sets, IAM roles attached to the compute, OIDC federation or IAM Roles Anywhere, a cross-account role with an external ID, and a break-glass IAM user or the root user. All except the last end as temporary role sessions in AWS accounts on the right.</desc>
  <defs><marker id="m0501a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-ta" x="16" y="22">Who is calling?</text>
  <text class="dg-ta" x="238" y="22">Recommended mechanism</text>
  <text class="dg-ta" x="582" y="22">What AWS sees</text>

  <rect class="dg-info" x="16" y="36" width="190" height="52" rx="6"/><text class="dg-t" x="28" y="58">Workforce humans</text><text class="dg-ts" x="28" y="76">engineers, analysts, ops</text>
  <rect class="dg-info" x="16" y="100" width="190" height="52" rx="6"/><text class="dg-t" x="28" y="122">Workloads on AWS</text><text class="dg-ts" x="28" y="140">EC2, ECS, Lambda, EKS pods</text>
  <rect class="dg-info" x="16" y="164" width="190" height="52" rx="6"/><text class="dg-t" x="28" y="186">Workloads outside AWS</text><text class="dg-ts" x="28" y="204">CI/CD, on-premises servers</text>
  <rect class="dg-info" x="16" y="228" width="190" height="52" rx="6"/><text class="dg-t" x="28" y="250">Third parties</text><text class="dg-ts" x="28" y="268">SaaS monitoring, auditors</text>
  <rect class="dg-bad" x="16" y="292" width="190" height="52" rx="6"/><text class="dg-t" x="28" y="314">Emergency only</text><text class="dg-ts" x="28" y="332">IdP down, account lock-out</text>

  <rect class="dg-good" x="238" y="36" width="310" height="52" rx="6"/><text class="dg-t" x="250" y="58">IAM Identity Center</text><text class="dg-ts" x="250" y="76">permission sets, MFA, one sign-in</text>
  <rect class="dg-good" x="238" y="100" width="310" height="52" rx="6"/><text class="dg-t" x="250" y="122">IAM role attached to the compute</text><text class="dg-ts" x="250" y="140">instance profile, task role, execution role</text>
  <rect class="dg-good" x="238" y="164" width="310" height="52" rx="6"/><text class="dg-t" x="250" y="186">OIDC federation or IAM Roles Anywhere</text><text class="dg-ts" x="250" y="204">GitHub Actions OIDC, X.509 certificates</text>
  <rect class="dg-good" x="238" y="228" width="310" height="52" rx="6"/><text class="dg-t" x="250" y="250">Cross-account role + external ID</text><text class="dg-ts" x="250" y="268">trust policy names their account</text>
  <rect class="dg-bad" x="238" y="292" width="310" height="52" rx="6"/><text class="dg-t" x="250" y="314">Break-glass IAM user or root user</text><text class="dg-ts" x="250" y="332">long-term password + MFA, sealed, alarmed</text>

  <path class="dg-line" d="M206 62 H236" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M206 126 H236" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M206 190 H236" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M206 254 H236" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M206 318 H236" marker-end="url(#m0501a-ar)"/>

  <rect class="dg-edge" x="582" y="36" width="168" height="244" rx="8"/>
  <text class="dg-tb" x="594" y="60">Role sessions</text>
  <text class="dg-ts" x="594" y="80">temporary credentials</text>
  <text class="dg-ts" x="594" y="96">issued by AWS STS</text>
  <text class="dg-ts" x="594" y="120">expire automatically</text>
  <text class="dg-ts" x="594" y="136">(15 min to 12 h)</text>
  <text class="dg-ts" x="594" y="160">ARN looks like</text>
  <text class="dg-ts" x="594" y="176">assumed-role/Role/name</text>
  <text class="dg-ts" x="594" y="200">nothing long-lived</text>
  <text class="dg-ts" x="594" y="216">to leak or rotate</text>
  <rect class="dg-box" x="582" y="292" width="168" height="52" rx="6"/><text class="dg-t" x="594" y="314">Long-term secret</text><text class="dg-ts" x="594" y="332">must be protected</text>

  <path class="dg-line" d="M548 62 H580" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M548 126 H580" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M548 190 H580" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M548 254 H580" marker-end="url(#m0501a-ar)"/>
  <path class="dg-line" d="M548 318 H580" marker-end="url(#m0501a-ar)"/>
  <text class="dg-ts" x="16" y="370">Rule of thumb: every path should end in a role session. Long-term IAM user keys are the exception, never the default.</text>
</svg>
<figcaption>Figure M05-1a. Match each kind of caller to a mechanism that hands out temporary credentials. Only emergency access keeps a long-term secret, and it is locked away and monitored.</figcaption>
</figure>`;

var DG_0501_ARN = `
<figure>
<svg class="diagram" viewBox="0 0 760 214" role="img" aria-labelledby="m0501bt m0501bd">
  <title id="m0501bt">Anatomy of an Amazon Resource Name</title>
  <desc id="m0501bd">The ARN arn:aws:iam::111122223333:role/app/OrdersApi split into its six parts: the arn prefix, the partition aws, the service iam, an empty Region because IAM is global, the 12-digit account ID, and the resource part role/app/OrdersApi, which includes a path.</desc>
  <rect class="dg-box" x="16" y="30" width="56" height="40" rx="6"/><text class="dg-tb" x="28" y="56">arn</text>
  <rect class="dg-edge" x="88" y="30" width="64" height="40" rx="6"/><text class="dg-tb" x="102" y="56">aws</text>
  <rect class="dg-info" x="168" y="30" width="64" height="40" rx="6"/><text class="dg-tb" x="186" y="56">iam</text>
  <rect class="dg-bad" x="248" y="30" width="56" height="40" rx="6"/><text class="dg-tb" x="262" y="56">(  )</text>
  <rect class="dg-good" x="320" y="30" width="150" height="40" rx="6"/><text class="dg-tb" x="334" y="56">111122223333</text>
  <rect class="dg-info" x="486" y="30" width="258" height="40" rx="6"/><text class="dg-tb" x="500" y="56">role/app/OrdersApi</text>
  <text class="dg-tb" x="76" y="56">:</text><text class="dg-tb" x="156" y="56">:</text><text class="dg-tb" x="236" y="56">:</text><text class="dg-tb" x="308" y="56">:</text><text class="dg-tb" x="474" y="56">:</text>
  <text class="dg-ts" x="16" y="92">prefix</text>
  <text class="dg-ts" x="88" y="92">partition</text>
  <text class="dg-ts" x="168" y="92">service</text>
  <text class="dg-ts" x="248" y="92">Region</text>
  <text class="dg-ts" x="320" y="92">account ID (12 digits)</text>
  <text class="dg-ts" x="486" y="92">resource type / path / name</text>
  <text class="dg-ts" x="88" y="110">aws, aws-cn,</text><text class="dg-ts" x="88" y="124">aws-us-gov</text>
  <text class="dg-ts" x="248" y="110">empty: IAM</text><text class="dg-ts" x="248" y="124">is global</text>
  <text class="dg-ts" x="320" y="110">empty for S3 bucket ARNs,</text><text class="dg-ts" x="320" y="124">which are globally unique</text>
  <text class="dg-ts" x="486" y="110">the path /app/ groups roles; you can</text><text class="dg-ts" x="486" y="124">grant on role/app/* in one statement</text>
  <text class="dg-t" x="16" y="160">The same role, as two ARNs you will meet:</text>
  <text class="dg-ts" x="16" y="180">role        arn:aws:iam::111122223333:role/app/OrdersApi             (in policies and trust relationships)</text>
  <text class="dg-ts" x="16" y="198">session     arn:aws:sts::111122223333:assumed-role/OrdersApi/i-0abc123   (in CloudTrail and get-caller-identity)</text>
</svg>
<figcaption>Figure M05-1b. Read an ARN left to right. Empty fields are meaningful: IAM ARNs have no Region and S3 bucket ARNs have neither Region nor account ID. A role session ARN uses the <code>sts</code> service and drops the path.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.01", title: "IAM fundamentals", level: 100, minutes: 50,
  objectives: [
    "Explain what IAM authenticates and authorises, and what is in the request context it evaluates",
    "Distinguish the root user, IAM users, groups, roles, federated users, service principals and anonymous callers, and read their ARNs",
    "Apply root user and MFA best practices, including centralised root access management in AWS Organizations",
    "Choose the right identity type for humans, workloads on and off AWS, CI/CD pipelines, third parties and emergencies",
    "Audit and rotate long-term credentials using the credential report and access-key last-used data"
  ],
  sections: [
    { type: "why", html: `
<p>Most serious AWS security incidents do not start with an exotic exploit. They start with an <strong>identity</strong>: an access key pasted into a public repository, an over-privileged role on a compromised web server, a root user without MFA, or a former contractor whose IAM user still works. Firewalls and encryption do not help once an attacker holds valid credentials, because every AWS API call is authorised on <em>who</em> is calling. That is why architects say <strong>identity is the new perimeter</strong>.</p>
<p>For the exam, Domain 1 (Design Secure Architectures) is <strong>30% of the score</strong>, and its first task statement is "Design secure access to AWS resources". Almost every security question either is an IAM question or has an IAM answer hidden in it: "use an IAM role instead of access keys", "enable MFA on the root user", "use IAM Identity Center for workforce access", "grant cross-account access with a role". This lesson builds the vocabulary; the rest of M05 builds the precision.</p>
<p>You met IAM briefly already: M01.04 showed how every API call is signed and evaluated, M03.02 showed how the CLI finds credentials, and M03.03 introduced policy JSON. Here we step back and look at the <em>actors</em>: who can call AWS, how each is identified, and which kind of identity you should create for each situation.</p>` },

    { type: "concept", title: "Concept 1: what IAM is and who can call AWS", html: DG_0501_LANDSCAPE + `
<h3>IAM in one paragraph</h3>
<p><strong>AWS Identity and Access Management (IAM)</strong> is the service that decides, for every request to AWS, two things:</p>
<ul>
  <li><strong>Authentication (AuthN): who are you?</strong> AWS checks the request's signature (SigV4) against credentials it knows: a password plus MFA in the console, an access key pair for the API, or temporary credentials issued by AWS Security Token Service (STS).</li>
  <li><strong>Authorisation (AuthZ): are you allowed to do this?</strong> AWS evaluates every policy that applies to the request and returns Allow or Deny. By default, everything is denied.</li>
</ul>
<p>IAM is a <strong>global</strong> service: users, roles and policies are not tied to a Region. It is <strong>free</strong>; you pay only for the resources your identities use. It is also <strong>eventually consistent</strong>: a change you make (a new role, an edited policy) is replicated worldwide and can take a few seconds to take effect everywhere. Automation that creates a role and uses it on the next line sometimes fails for this reason and needs a short retry.</p>

<h3>The request context</h3>
<p>When a request arrives, AWS assembles a <strong>request context</strong> and evaluates policies against it. It contains:</p>
<table>
<thead><tr><th>Part</th><th>Example</th><th>Used by policy element</th></tr></thead>
<tbody>
<tr><td><strong>Principal</strong>: who is calling, plus their tags and account</td><td><code>arn:aws:sts::111122223333:assumed-role/OrdersApi/i-0abc123</code></td><td><code>Principal</code>, <code>aws:PrincipalTag/…</code>, <code>aws:PrincipalAccount</code></td></tr>
<tr><td><strong>Action</strong>: the API operation</td><td><code>s3:GetObject</code></td><td><code>Action</code> / <code>NotAction</code></td></tr>
<tr><td><strong>Resource</strong>: what is being acted on</td><td><code>arn:aws:s3:::orders-archive/2025/10/07.json</code></td><td><code>Resource</code> / <code>NotResource</code>, <code>aws:ResourceTag/…</code></td></tr>
<tr><td><strong>Environment</strong>: how and when</td><td>source IP, time, TLS or not, MFA used, VPC endpoint ID, Region</td><td><code>Condition</code> (<code>aws:SourceIp</code>, <code>aws:SecureTransport</code>…)</td></tr>
<tr><td><strong>Request data</strong>: what the call is trying to set</td><td>tags being created, encryption header</td><td><code>aws:RequestTag/…</code>, <code>s3:x-amz-server-side-encryption</code></td></tr>
</tbody></table>
<p>Keep this table in mind: every policy element you will learn in M05.02 is just a test against one part of the request context.</p>

<h3>The kinds of principal</h3>
<p>A <strong>principal</strong> is an entity that can make a request. An <strong>identity</strong> is something you create in IAM and attach policies to. They overlap but are not the same: a <em>group</em> is an identity (you attach policies to it) but not a principal (it can never make a request, and you cannot name it in a <code>Principal</code> element).</p>
<table>
<thead><tr><th>Principal</th><th>What it is</th><th>Credentials</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><strong>Root user</strong></td><td>The identity created with the account, signed in with the account's email address. Has complete, unrestrictable access to its own account (only an SCP can limit a member account's root).</td><td>Password + MFA (access keys possible but must not exist)</td><td>Only the handful of root-only tasks</td></tr>
<tr><td><strong>IAM user</strong></td><td>A named identity in one account with <em>long-term</em> credentials</td><td>Console password and/or up to 2 access keys</td><td>Break-glass, or a workload that truly cannot use roles</td></tr>
<tr><td><strong>IAM role</strong></td><td>An identity with permissions but <em>no</em> credentials of its own. Trusted principals <em>assume</em> it and get a <strong>role session</strong>.</td><td>Temporary credentials from STS</td><td>Everything else: workloads, humans via federation, cross-account access</td></tr>
<tr><td><strong>Federated user</strong></td><td>A person authenticated by an external identity provider (Entra ID, Okta, Google) or by IAM Identity Center, who then acts through a role</td><td>Temporary credentials</td><td>All workforce access</td></tr>
<tr><td><strong>AWS service principal</strong></td><td>An AWS service acting on your behalf, e.g. <code>ec2.amazonaws.com</code>, <code>lambda.amazonaws.com</code>, <code>cloudtrail.amazonaws.com</code></td><td>Managed by AWS</td><td>Named in role trust policies and resource policies</td></tr>
<tr><td><strong>Anonymous</strong></td><td>An unauthenticated caller (<code>"Principal": "*"</code> with no conditions)</td><td>None</td><td>Almost never. Public websites belong behind CloudFront, not in a public bucket.</td></tr>
</tbody></table>

<h3>ARNs: how AWS names everything</h3>
` + DG_0501_ARN + `
<p>An <strong>Amazon Resource Name (ARN)</strong> uniquely identifies a resource or principal: <code>arn:partition:service:region:account-id:resource</code>. You will write ARNs in every policy, so learn to read them at a glance:</p>
<table>
<thead><tr><th>ARN</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>arn:aws:iam::111122223333:root</code></td><td>The <em>account</em> 111122223333 as a whole (not just the root user). In a trust or resource policy it means "any principal in that account whose own IAM policies allow it".</td></tr>
<tr><td><code>arn:aws:iam::111122223333:user/ops/alice</code></td><td>IAM user <code>alice</code> with path <code>/ops/</code></td></tr>
<tr><td><code>arn:aws:iam::111122223333:role/app/OrdersApi</code></td><td>IAM role <code>OrdersApi</code> with path <code>/app/</code></td></tr>
<tr><td><code>arn:aws:sts::111122223333:assumed-role/OrdersApi/i-0abc123</code></td><td>A <em>session</em> of that role, named after the EC2 instance that assumed it. This is what CloudTrail records.</td></tr>
<tr><td><code>arn:aws:s3:::orders-archive</code> and <code>arn:aws:s3:::orders-archive/*</code></td><td>A bucket, and all objects in it. They are different resources: bucket actions use the first, object actions the second.</td></tr>
<tr><td><code>arn:aws:ec2:eu-west-1:111122223333:instance/i-0abc123</code></td><td>A Regional resource: Region and account are both filled in.</td></tr>
</tbody></table>
<p>Every IAM entity also has a <strong>unique ID</strong> whose prefix tells you what it is. You will see these in CloudTrail and in policies after a principal is deleted:</p>
<table>
<thead><tr><th>Prefix</th><th>Entity</th><th>Prefix</th><th>Entity</th></tr></thead>
<tbody>
<tr><td><code>AIDA</code></td><td>IAM user</td><td><code>AKIA</code></td><td>Long-term access key (IAM user or root)</td></tr>
<tr><td><code>AROA</code></td><td>IAM role</td><td><code>ASIA</code></td><td>Temporary access key (STS session)</td></tr>
<tr><td><code>AGPA</code></td><td>IAM group</td><td><code>ANPA</code></td><td>Customer managed policy</td></tr>
</tbody></table>
<div class="callout tip"><strong>Reading a leaked key report:</strong> a key starting with <code>AKIA</code> is long-term and stays valid until someone deactivates it. A key starting with <code>ASIA</code> is temporary and expires on its own, though you should still revoke the role's active sessions.</div>` },

    { type: "concept", title: "Concept 2: root, MFA, users, groups and access keys", html: `
<h3>The root user</h3>
<p>The root user can do anything in its account, and IAM policies cannot restrict it there. In an AWS Organizations <em>member</em> account, a <strong>service control policy (SCP)</strong> can restrict even the root user; nothing can restrict the root user of the management account. Treat root as a sealed emergency key:</p>
<ol>
  <li><strong>Enable MFA</strong> (AWS now enforces this for most accounts). Prefer a passkey or FIDO2 security key, and register a second device.</li>
  <li><strong>Delete root access keys</strong> and never create them.</li>
  <li><strong>Use a strong, unique password</strong>, and an email address that is a team distribution list you control, not one person's mailbox.</li>
  <li><strong>Alarm on use</strong>: an EventBridge rule on <code>ConsoleLogin</code> events where <code>userIdentity.type</code> is <code>Root</code>, sending to SNS.</li>
  <li><strong>Set alternate contacts</strong> (billing, operations, security) so AWS can reach the right people.</li>
</ol>
<p><strong>Tasks that require the root user</strong> (the exam likes this list):</p>
<ul>
  <li>Change some account settings: the account's root email address and root password, and manage root access keys.</li>
  <li>Close the AWS account.</li>
  <li>Restore IAM permissions when the only administrator has locked themselves out.</li>
  <li>Activate IAM user and role access to the Billing and Cost Management console.</li>
  <li>Configure <strong>MFA Delete</strong> on an S3 bucket.</li>
  <li>Edit or delete an S3 bucket policy (or SQS queue policy) that denies all principals, including administrators.</li>
  <li>Register as a seller in the Reserved Instance Marketplace, and view certain tax invoices.</li>
  <li>Sign up for AWS GovCloud (US).</li>
</ul>
<p><strong>Centralised root access management (2024).</strong> In AWS Organizations you can enable central management of root access. The management account (or a delegated administrator) can then <strong>remove root credentials</strong> (password, access keys, MFA) from member accounts entirely, and perform the few root-only tasks, such as unlocking a bucket policy, through short-lived privileged sessions instead of signing in as root. New member accounts can be created without root credentials at all. For an organisation with hundreds of accounts, this removes hundreds of sealed passwords to guard.</p>

<h3>Multi-factor authentication</h3>
<table>
<thead><tr><th>MFA type</th><th>How it works</th><th>Phishing-resistant?</th></tr></thead>
<tbody>
<tr><td><strong>Passkeys and FIDO2 security keys</strong></td><td>Public-key challenge bound to the real AWS sign-in domain (hardware key, or a passkey in a password manager or phone)</td><td><strong>Yes</strong>: a fake sign-in page can't use the response</td></tr>
<tr><td><strong>Virtual authenticator app</strong></td><td>Time-based one-time password (TOTP) from an app</td><td>No: a user can be tricked into typing the code</td></tr>
<tr><td><strong>Hardware TOTP token</strong></td><td>A key-fob that displays TOTP codes</td><td>No</td></tr>
</tbody></table>
<p>The root user and each IAM user can register <strong>up to 8 MFA devices</strong> of any mix. SMS-based MFA is not supported for IAM users. For API calls, MFA shows up in the request context as <code>aws:MultiFactorAuthPresent</code> and <code>aws:MultiFactorAuthAge</code>: an IAM user calls <code>sts:GetSessionToken</code> with an MFA code and uses the resulting temporary credentials. You will use these keys to <em>require</em> MFA in policies in M05.02.</p>

<h3>IAM users and why they are now the exception</h3>
<p>An IAM user has <strong>long-term credentials</strong>: a password that does not expire unless a password policy says so, and access keys that never expire. Long-term secrets get copied into scripts, laptops, CI variables and chat messages, and they keep working after the person has left. AWS's current guidance is:</p>
<ul>
  <li><strong>Humans</strong> sign in through <strong>IAM Identity Center</strong> (or direct federation) and receive temporary role credentials. Identity Center users are <em>not</em> IAM users: they live in Identity Center's directory or in your corporate IdP, and one sign-in gives them access to many accounts.</li>
  <li><strong>Workloads</strong> use roles: an instance profile on EC2, a task role on ECS, an execution role on Lambda, IAM Roles for Service Accounts or EKS Pod Identity on Kubernetes, OIDC federation for GitHub Actions and other CI systems, and <strong>IAM Roles Anywhere</strong> (X.509 certificates) for servers outside AWS.</li>
  <li><strong>IAM users remain</strong> for break-glass access when the IdP is unavailable, and for the rare third-party product that can only accept an access key. Even then: MFA, least privilege, rotation, monitoring.</li>
</ul>

<h3>Groups</h3>
<p>A group is a collection of IAM users that share policies. Facts the exam tests:</p>
<ul>
  <li>Groups contain <strong>users only</strong>: not roles, and not other groups (<strong>no nesting</strong>).</li>
  <li>A user can be in <strong>at most 10 groups</strong>.</li>
  <li>A group is <strong>not a principal</strong>: you cannot name it in a bucket policy or trust policy.</li>
  <li>Group permissions are additive with the user's own policies.</li>
</ul>
<p>In Identity Center the equivalent idea is a <em>group of users</em> assigned to a <em>permission set</em> in specific accounts, usually synchronised from your corporate directory.</p>

<h3>Access keys and their lifecycle</h3>
<p>An access key is a pair: an <strong>access key ID</strong> (<code>AKIA…</code>, not secret) and a <strong>secret access key</strong> (shown once at creation). Each IAM user can have <strong>two</strong> keys, precisely so you can rotate without downtime. AWS records when each key was last used and for which service and Region. Two account-wide tools help you audit:</p>
<ul>
  <li>The <strong>credential report</strong>: a CSV listing every IAM user with password and key ages, last-used dates and MFA status.</li>
  <li><strong>Last-accessed information</strong>: for users, roles and policies, which services they actually used and when. M05.09 uses it to trim permissions.</li>
</ul>
<p>An account <strong>password policy</strong> applies to IAM users (not Identity Center users): minimum length, character classes, expiry, reuse prevention, and whether users can change their own password.</p>

<h3>Quotas worth knowing</h3>
<table>
<thead><tr><th>Item</th><th>Default quota</th></tr></thead>
<tbody>
<tr><td>IAM users per account</td><td>5,000 (use federation beyond this)</td></tr>
<tr><td>Groups a user can belong to</td><td>10</td></tr>
<tr><td>Access keys per IAM user</td><td>2</td></tr>
<tr><td>MFA devices per user (root or IAM)</td><td>8</td></tr>
<tr><td>Managed policies attached to a user, group or role</td><td>10 (can be raised to 20)</td></tr>
<tr><td>Customer managed policy size</td><td>6,144 characters (whitespace excluded)</td></tr>
<tr><td>Inline policy size, total per identity</td><td>user 2,048 · group 5,120 · role 10,240 characters</td></tr>
</tbody></table>` },

    { type: "workflow", title: "Workflow: which identity should this be?", html: `
<p>Run this decision every time someone asks for "an AWS user". The answer is rarely an IAM user.</p>
<ol class="flow">
  <li><strong>Is it a person?</strong> Use <strong>IAM Identity Center</strong>. Connect it to the corporate IdP (Entra ID, Okta, Google Workspace) or Active Directory, assign groups to <em>permission sets</em> in the accounts they need, and enforce MFA. People get a portal and short-lived credentials for the console and CLI (<code>aws sso login</code>, M03.02).</li>
  <li><strong>Is it code running on AWS compute?</strong> Attach a <strong>role</strong> to the compute: an instance profile (EC2), a task role (ECS), an execution role (Lambda), a pod identity (EKS). The SDK finds the credentials automatically and they rotate themselves. Never bake keys into an AMI, container image or environment variable.</li>
  <li><strong>Is it code running outside AWS?</strong> CI/CD systems that issue OIDC tokens (GitHub Actions, GitLab, Bitbucket) use <strong>OIDC federation</strong> to assume a role with no stored secret. On-premises servers use <strong>IAM Roles Anywhere</strong> with certificates from your private CA. Only if neither is possible, use an IAM user with a narrowly scoped policy and rotated keys.</li>
  <li><strong>Is it another company?</strong> Create a <strong>cross-account role</strong> that trusts <em>their</em> AWS account and requires an <strong>external ID</strong> (M05.06). Never create IAM users for vendors.</li>
  <li><strong>Is it for emergencies?</strong> Create one or two <strong>break-glass</strong> IAM users (or rely on centrally managed root access) with hardware MFA, credentials in a sealed vault, and an alarm on every use. Test the procedure twice a year.</li>
  <li><strong>Record the decision</strong> in your access standard so the next request follows the same path.</li>
</ol>
<h3>Rotating an access key without downtime</h3>
<ol class="flow">
  <li><strong>Create the second key</strong> (<code>aws iam create-access-key</code>). The user now has two active keys.</li>
  <li><strong>Deploy the new key</strong> to wherever the old one is configured (ideally a secrets manager, not a file).</li>
  <li><strong>Verify</strong> the old key is no longer used: <code>aws iam get-access-key-last-used</code> stops advancing.</li>
  <li><strong>Deactivate</strong> the old key (<code>update-access-key --status Inactive</code>). If something breaks, reactivate it: that is the safety net.</li>
  <li><strong>Delete</strong> the old key after a quiet period.</li>
  <li><strong>Ask why a key exists at all</strong>: every rotation is a chance to replace the user with a role.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS", html: `
<table>
<thead><tr><th>Service / feature</th><th>Role in identity</th><th>Covered in</th></tr></thead>
<tbody>
<tr><td><strong>IAM</strong></td><td>Users, groups, roles, policies, identity providers (SAML/OIDC) for one account</td><td>M05</td></tr>
<tr><td><strong>AWS STS</strong></td><td>Issues temporary credentials: <code>AssumeRole</code>, <code>AssumeRoleWithSAML</code>, <code>AssumeRoleWithWebIdentity</code>, <code>GetSessionToken</code></td><td>M05.05</td></tr>
<tr><td><strong>IAM Identity Center</strong></td><td>Workforce sign-in and permission sets across all accounts in an organisation</td><td>M05.07, M06</td></tr>
<tr><td><strong>AWS Organizations</strong></td><td>SCPs and RCPs as guardrails, centralised root access management</td><td>M05.03, M06</td></tr>
<tr><td><strong>IAM Access Analyzer</strong></td><td>External and unused access findings, policy validation and generation</td><td>M05.09</td></tr>
<tr><td><strong>AWS CloudTrail</strong></td><td>Records every API call with the principal's ARN, source IP and user agent</td><td>M30</td></tr>
<tr><td><strong>Amazon Cognito</strong></td><td>Identity for your <em>application's</em> customers, not your staff</td><td>M05.10</td></tr>
</tbody></table>
<h3>Behaviours that surprise people</h3>
<ul>
  <li><strong>IAM is global, but IAM Identity Center is configured in one home Region</strong>, and STS has Regional endpoints (prefer them for latency and resilience).</li>
  <li><strong>New identities have no permissions.</strong> A freshly created user or role can do nothing until a policy allows it.</li>
  <li><strong>Deleting and recreating a principal does not restore access</strong> granted to the old one in resource policies: AWS stores the old principal's unique ID, and the policy then shows an <code>AIDA…</code> or <code>AROA…</code> string instead of the ARN.</li>
  <li><strong>The AWS managed policies</strong> (e.g. <code>ReadOnlyAccess</code>, <code>PowerUserAccess</code>, <code>AdministratorAccess</code>) are convenient starting points but broad. AWS updates them as services launch, so their scope grows over time.</li>
</ul>` },

    { type: "examples", title: "Worked examples: inspecting identities from the CLI", html: `
<h3>Example 1: who am I, and what kind of principal is that?</h3>
<pre><code>$ aws sts get-caller-identity --profile academy-admin
{
    "UserId": "AROA3XFRBF23EXAMPLE:alice@example.com",
    "Account": "111122223333",
    "Arn": "arn:aws:sts::111122223333:assumed-role/AWSReservedSSO_AdministratorAccess_1a2b3c4d5e6f7a8b/alice@example.com"
}</code></pre>
<ul>
  <li><code>AROA…</code> is the <strong>role's</strong> unique ID; after the colon comes the <strong>session name</strong>.</li>
  <li>The ARN uses <code>sts</code> and <code>assumed-role</code>: this is a <strong>role session</strong>, the healthy pattern.</li>
  <li><code>AWSReservedSSO_…</code> tells you IAM Identity Center created the role from a permission set.</li>
</ul>
<p>Compare with an IAM user, which shows <code>"UserId": "AIDA…"</code> and <code>"Arn": "arn:aws:iam::111122223333:user/ci-legacy"</code>. Seeing <code>:user/</code> in production automation is a finding.</p>

<h3>Example 2: account summary in one call</h3>
<pre><code>$ aws iam get-account-summary --query "SummaryMap.{Users:Users,Groups:Groups,Roles:Roles,RootMFA:AccountMFAEnabled,RootKeys:AccountAccessKeysPresent}" --output table
-------------------------------------------------------
|                 GetAccountSummary                   |
+--------+---------+-----------+-----------+----------+
| Groups | RootKeys|  RootMFA  |   Roles   |  Users   |
+--------+---------+-----------+-----------+----------+
|  4     |  0      |  1        |  63       |  41      |
+--------+---------+-----------+-----------+----------+</code></pre>
<p>Root has MFA and no keys: good. But 41 IAM users in an organisation that has Identity Center is a smell worth investigating (see the case study).</p>

<h3>Example 3: the credential report</h3>
<pre><code>$ aws iam generate-credential-report
{ "State": "STARTED", "Description": "No report exists. Starting a new report generation task" }

$ aws iam get-credential-report --query Content --output text | base64 -d | cut -d, -f1,4,8,9,10,11 | column -s, -t | head -5
user                 password_enabled  mfa_active  access_key_1_active  access_key_1_last_rotated   access_key_1_last_used_date
&lt;root_account&gt;       not_supported     true        false                N/A                         N/A
alice                false             false       true                 2022-03-14T09:12:00+00:00   2025-10-06T22:41:00+00:00
build-bot            false             false       true                 2021-11-02T15:30:00+00:00   N/A
mark                 true              false       false                N/A                         N/A</code></pre>
<p>How an architect reads this:</p>
<ul>
  <li><strong>alice</strong>: a human with a 3½-year-old key in daily use and no MFA. Move her to Identity Center and delete the key.</li>
  <li><strong>build-bot</strong>: a key that has <em>never</em> been used. Delete it: unused keys are pure risk.</li>
  <li><strong>mark</strong>: a console password without MFA. Enforce MFA or remove the password.</li>
</ul>
<p>The report is regenerated at most every 4 hours; the columns above are a subset (the full report has more than 20).</p>

<h3>Example 4: when was this key last used, and for what?</h3>
<pre><code>$ aws iam get-access-key-last-used --access-key-id AKIAIOSFODNN7EXAMPLE
{
    "UserName": "alice",
    "AccessKeyLastUsed": {
        "LastUsedDate": "2025-10-06T22:41:00+00:00",
        "ServiceName": "s3",
        "Region": "eu-west-1"
    }
}</code></pre>
<p>This is the first command in a leaked-key investigation: it tells you whether the key is live and which service to search in CloudTrail.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Identity to use</th><th>Why</th></tr></thead>
<tbody>
<tr><td>200 engineers across 30 AWS accounts, already in Entra ID</td><td>IAM Identity Center with Entra ID as identity source (SAML + SCIM), permission sets per job function</td><td>One sign-in, MFA from the IdP, joiners and leavers handled in one place, temporary credentials</td></tr>
<tr><td>A Spring Boot app on EC2 reads from S3 and DynamoDB</td><td>IAM role via instance profile</td><td>Credentials delivered by IMDS (v2), rotated automatically, never on disk</td></tr>
<tr><td>GitHub Actions deploys CloudFormation</td><td>OIDC identity provider in IAM plus a role whose trust policy pins the repository and branch</td><td>No stored AWS secret in GitHub at all</td></tr>
<tr><td>A backup appliance in the data centre writes to S3</td><td>IAM Roles Anywhere with the company's private CA</td><td>Short-lived credentials from an X.509 certificate instead of a static key</td></tr>
<tr><td>A SaaS cost-monitoring vendor needs read-only billing data</td><td>Cross-account role trusting the vendor's account, with an external ID</td><td>No credentials leave your account; you can revoke trust instantly</td></tr>
<tr><td>The IdP is down during an outage and you must reach the console</td><td>Break-glass IAM user with hardware MFA, sealed credentials, EventBridge alarm</td><td>Independent of the IdP, auditable, used only in emergencies</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: audit your own account (read-only, free)", html: `
<p>Run these in AWS CloudShell or with the <code>academy-admin</code> profile from Lab L01. They only read data.</p>
<pre><code># 1. Confirm you are a role session, not an IAM user or root
aws sts get-caller-identity

# 2. Root hygiene: expect AccountMFAEnabled = 1 and AccountAccessKeysPresent = 0
aws iam get-account-summary --query "SummaryMap.[AccountMFAEnabled,AccountAccessKeysPresent]"

# 3. List IAM users with their creation date (ideally a very short list)
aws iam list-users --query "Users[].[UserName,CreateDate]" --output table

# 4. Generate and read the credential report
aws iam generate-credential-report &gt;/dev/null; sleep 5
aws iam get-credential-report --query Content --output text | base64 -d | cut -d, -f1,4,8,9,10 | column -s, -t

# 5. Which roles exist, and which were created by Identity Center?
aws iam list-roles --query "Roles[?starts_with(RoleName,'AWSReservedSSO')].RoleName" --output text

# 6. Password policy for any IAM users (an error means none is set)
aws iam get-account-password-policy</code></pre>
<p>Write down three findings, even if they are "none". In M05.09 you will turn findings like these into an automated least-privilege process.</p>` },

    { type: "casestudy", title: "Case study: Fernway Analytics retires 40 IAM users", html: `
<p><strong>Context.</strong> Fernway Analytics (fictional) is a 60-person data startup. It began with one AWS account and created an IAM user for each engineer, plus users for its CI server and two SaaS tools. Three years later it has four accounts (dev, staging, prod, data), each with its own copies of those users. A customer's security questionnaire asks, "How do you revoke access when an employee leaves?" Nobody can answer with confidence.</p>
<p><strong>Audit findings</strong> (credential reports from all four accounts):</p>
<table>
<thead><tr><th>Finding</th><th>Count</th></tr></thead>
<tbody>
<tr><td>IAM users in total</td><td>162 (about 40 distinct people and systems, duplicated per account)</td></tr>
<tr><td>Access keys older than 1 year</td><td>71</td></tr>
<tr><td>Users belonging to people who had left</td><td>9, three with keys used in the last month (shared scripts)</td></tr>
<tr><td>Console users without MFA</td><td>23</td></tr>
<tr><td>Users with <code>AdministratorAccess</code></td><td>31</td></tr>
</tbody></table>
<p><strong>Decision.</strong> The architect proposes, and records in an ADR, a move to "no long-term credentials by default":</p>
<ol>
  <li>Create an AWS Organization and enable <strong>IAM Identity Center</strong> with Google Workspace (the company's existing IdP) as the identity source. Define four permission sets (ReadOnly, Developer, DataEngineer, Admin) and assign Google groups to them per account. Admin is assigned only in non-prod by default.</li>
  <li>Replace the CI server's keys with <strong>GitHub Actions OIDC</strong> roles, one per account, with trust policies pinned to the repository and the <code>main</code> branch.</li>
  <li>Replace the two SaaS tools' IAM users with <strong>cross-account roles with external IDs</strong>.</li>
  <li>Keep <strong>one break-glass IAM user</strong> in the management account, with a hardware key, and enable <strong>centralised root access management</strong> to remove root passwords from the member accounts.</li>
  <li>For four weeks, deactivate (not delete) old keys in batches and watch CloudTrail for <code>InvalidClientTokenId</code> errors to find forgotten scripts.</li>
</ol>
<p><strong>Result.</strong> After six weeks: 1 IAM user across the organisation instead of 162, zero access keys older than 90 days, MFA enforced by the IdP for everyone, and offboarding reduced to "disable the Google account". The questionnaire answer became one sentence. Two scripts broke during the deactivation window; both were found within an hour thanks to the CloudTrail errors and moved to roles.</p>
<p><strong>Lessons learned.</strong> Deactivate before you delete. Inventory consumers of each key with <code>get-access-key-last-used</code> and CloudTrail before you touch it. Most importantly, the root cause was not careless engineers but a missing default: once Identity Center existed, nobody asked for an IAM user again.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Scenario keywords</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Application on EC2 needs to access S3/DynamoDB"</td><td>IAM <strong>role</strong> with an instance profile. Never access keys on the instance.</td></tr>
<tr><td>"Many employees, existing corporate directory, many accounts"</td><td><strong>IAM Identity Center</strong> federated with the IdP or AD</td></tr>
<tr><td>"Secure the root user"</td><td>Enable <strong>MFA</strong>, delete root access keys, don't use it for daily tasks</td></tr>
<tr><td>"Grant the same permissions to a team of IAM users"</td><td>Put them in a <strong>group</strong> and attach the policy to the group</td></tr>
<tr><td>"Third-party company needs access to our account"</td><td><strong>Cross-account role</strong> with external ID, not IAM users</td></tr>
<tr><td>"Find users with old or unused credentials"</td><td>IAM <strong>credential report</strong> (and Access Analyzer unused access)</td></tr>
<tr><td>"Only the root user can…"</td><td>Close account, MFA Delete on S3, restore locked-out admin, unlock a deny-all bucket policy</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li>"Store the access keys in the instance user data / AMI / environment variables": always wrong when a role is possible.</li>
  <li>"Add the group to the bucket policy's Principal": groups cannot be principals.</li>
  <li>"Create a nested group for each department": groups can't be nested.</li>
  <li>"Share the root credentials with the operations team": never.</li>
</ul>
<table>
<thead><tr><th></th><th>IAM user</th><th>IAM role</th><th>Group</th></tr></thead>
<tbody>
<tr><td>Credentials</td><td>Long-term password and keys</td><td>Temporary, via STS</td><td>None</td></tr>
<tr><td>Can be a principal</td><td>Yes</td><td>Yes (as a session)</td><td>No</td></tr>
<tr><td>Who uses it</td><td>One person or system</td><td>Anyone it trusts</td><td>Container for users</td></tr>
<tr><td>Exam default</td><td>Avoid</td><td><strong>Prefer</strong></td><td>To manage users' permissions</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Make roles the path of least resistance.</strong> If creating a role takes a ticket and three days but an IAM user takes five minutes, you will get IAM users. Provide templates (CloudFormation, CDK constructs) for the common role patterns.</li>
  <li><strong>Break-glass is a process, not just a user.</strong> Two people to unseal the credentials, an alarm to the security team, automatic ticket creation, and a post-use review. Test it, or it won't work during the outage that needs it.</li>
  <li><strong>Naming and paths.</strong> Use role paths (<code>/app/</code>, <code>/ci/</code>, <code>/vendor/</code>) and consistent names. You can then write policies such as "may pass roles under <code>role/app/*</code> only" and spot strays easily.</li>
  <li><strong>Plan for IAM's eventual consistency</strong> in pipelines: after creating a role, wait or retry before the first <code>AssumeRole</code>.</li>
  <li><strong>Detect long-term key use in production.</strong> A CloudTrail query or Config rule for requests signed with <code>AKIA</code> keys in prod accounts finds forgotten integrations early.</li>
  <li><strong>Cost: IAM is free; incidents are not.</strong> A leaked key used to mine cryptocurrency on GPU instances can cost tens of thousands of dollars in a weekend. Budgets with alerts (Lab L01) and SCPs that deny unused Regions limit the blast radius.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>IAM authenticates (who are you?) and authorises (may you?) every AWS request against a request context: principal, action, resource, environment and request data.</li>
  <li>Principals: root user, IAM users, role sessions, federated users, AWS service principals and anonymous callers. Groups are identities, not principals.</li>
  <li>ARN format: <code>arn:partition:service:region:account:resource</code>. IAM ARNs have no Region; S3 bucket ARNs have no Region or account.</li>
  <li>Root: MFA, no access keys, alarm on use, only for root-only tasks. Organizations can remove member-account root credentials centrally.</li>
  <li>Prefer phishing-resistant MFA (passkeys, FIDO2 keys). Up to 8 MFA devices per user.</li>
  <li>Humans → IAM Identity Center. Workloads → roles (instance profile, task role, OIDC, Roles Anywhere). Third parties → cross-account roles with external IDs. IAM users only for break-glass or unavoidable legacy.</li>
  <li>Groups: users only, no nesting, max 10 per user, never a principal.</li>
  <li>Two access keys per user enable zero-downtime rotation: create, deploy, verify, deactivate, delete. Audit with the credential report and last-used data.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.01-d1", q: "A leaked access key ID begins with <code>ASIA</code>. Is it a long-term or a temporary key? (long-term / temporary)", answers: ["temporary", "temp"], hint: "AKIA vs ASIA.", explain: "<code>ASIA</code> keys come from STS sessions and expire on their own. <code>AKIA</code> keys are long-term." },
    { id: "M05.01-d2", q: "What is the maximum number of access keys an IAM user can have at the same time?", answers: ["2", "two"], explain: "Two, so you can rotate: create the new key, switch over, then deactivate and delete the old one." },
    { id: "M05.01-d3", q: "What is the maximum number of IAM groups a single IAM user can belong to?", answers: ["10", "ten"], explain: "10 groups per user. Groups cannot be nested." },
    { id: "M05.01-d4", q: "Can an IAM group be named as the <code>Principal</code> in an S3 bucket policy? (yes/no)", answers: ["no", "n"], explain: "No. Groups are identities you attach policies to, but they are not principals." },
    { id: "M05.01-d5", q: "Which ARN partition is used for the AWS China Regions?", answers: ["aws-cn"], explain: "Partitions: <code>aws</code> (standard), <code>aws-cn</code> (China), <code>aws-us-gov</code> (GovCloud US)." },
    { id: "M05.01-d6", q: "How many MFA devices can the root user or an IAM user register?", answers: ["8", "eight"], explain: "Up to 8, of any mix of passkeys/security keys, authenticator apps and hardware TOTP tokens." },
    { id: "M05.01-d7", q: "What does the unique-ID prefix <code>AROA</code> identify? (one word)", answers: ["role", "iam role", "a role"], explain: "AROA = role, AIDA = user, AGPA = group, AKIA = long-term key, ASIA = temporary key." },
    { id: "M05.01-d8", q: "Which IAM command generates the CSV that lists every IAM user's password, MFA and access-key status? (the operation name, e.g. get-xyz)", answers: ["generate-credential-report", "aws iam generate-credential-report"], hint: "Two steps: generate, then get.", explain: "<code>aws iam generate-credential-report</code>, then <code>aws iam get-credential-report</code> to download it (base64-encoded)." }
  ],
  check: [
    { id: "M05.01-k1", type: "single", domain: "D1", task: "1.1", level: 100,
      stem: "A Java application running on Amazon EC2 must read objects from an S3 bucket. What is the MOST secure way to give it credentials?",
      options: [
        { t: "Create an IAM role with a least-privilege S3 policy and attach it to the instance through an instance profile", c: true, why: "The SDK retrieves temporary, automatically rotated credentials from the instance metadata service. Nothing is stored on disk." },
        { t: "Create an IAM user, and store its access keys in the application's configuration file", c: false, why: "Long-term keys on disk can leak through backups, images or source control, and never expire." },
        { t: "Store the root user's access keys in AWS Secrets Manager and read them at start-up", c: false, why: "Root keys should not exist at all, and they would grant unrestricted access." },
        { t: "Pass an IAM user's access keys in the EC2 user data", c: false, why: "User data is readable by anyone who can describe the instance or reach IMDS, and the keys are long-term." }
      ] },
    { id: "M05.01-k2", type: "single", domain: "D1", task: "1.1", level: 100,
      stem: "A company has 300 employees in Microsoft Entra ID who need access to 25 AWS accounts. Joiners and leavers must be handled in one place. What should the solutions architect recommend?",
      options: [
        { t: "Enable IAM Identity Center with Entra ID as the external identity provider and assign groups to permission sets", c: true, why: "Identity Center federates with the IdP, provisions users and groups via SCIM, and gives temporary access to many accounts. Disabling the user in Entra ID removes access everywhere." },
        { t: "Create IAM users in each account and add them to groups", c: false, why: "7,500 long-term identities to manage, and offboarding means touching 25 accounts." },
        { t: "Create one shared IAM user per team and distribute the password", c: false, why: "Shared credentials destroy accountability and can't be revoked per person." },
        { t: "Use Amazon Cognito user pools for the employees", c: false, why: "Cognito is for customers of your applications, not for workforce access to AWS accounts." }
      ] },
    { id: "M05.01-k3", type: "multi", domain: "D1", task: "1.1", level: 100,
      stem: "Which actions are AWS best practices for the root user? (Select TWO.)",
      options: [
        { t: "Enable MFA, ideally with a passkey or FIDO2 security key", c: true, why: "MFA protects the most powerful identity in the account; phishing-resistant MFA is strongest." },
        { t: "Delete any root user access keys", c: true, why: "Root access keys give unrestricted programmatic access and should not exist." },
        { t: "Use the root user for daily administration so that actions are never blocked by policies", c: false, why: "Daily work should use federated roles with least privilege; root use should be rare and alarmed." },
        { t: "Create a second set of root access keys for automation", c: false, why: "Automation should use roles. Root keys are never appropriate." },
        { t: "Share the root password with the operations team so they can respond quickly", c: false, why: "Shared root credentials remove accountability; use break-glass procedures instead." }
      ] },
    { id: "M05.01-k4", type: "single", domain: "D1", task: "1.1", level: 100,
      stem: "An administrator wants to grant five IAM users in the same team identical permissions and update them in one place. What should they do?",
      options: [
        { t: "Create an IAM group, attach the policy to the group, and add the five users", c: true, why: "Groups exist exactly for this: one policy attachment applies to all members." },
        { t: "Attach the same inline policy to each user", c: false, why: "Five copies drift over time and must be changed five times." },
        { t: "Name the group as the Principal in each resource policy", c: false, why: "Groups can't be principals in resource policies." },
        { t: "Create a role per user", c: false, why: "Possible, but it doesn't help manage IAM users' permissions in one place, which is what groups are for." }
      ] },
    { id: "M05.01-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A bucket policy accidentally denies all principals, including administrators, for every S3 action. How can the policy be removed?",
      options: [
        { t: "Sign in as the account's root user (or use a centralised root access session from the Organizations management account) and delete the bucket policy", c: true, why: "Removing a bucket policy that denies all principals is one of the tasks that requires root user privileges." },
        { t: "Attach AdministratorAccess to an IAM role and delete the policy", c: false, why: "An explicit Deny in the bucket policy overrides the administrator's Allow." },
        { t: "Open a support case and ask AWS to delete it", c: false, why: "AWS support can't modify your resources; the root user can." },
        { t: "Wait for the policy to expire after 24 hours", c: false, why: "Bucket policies don't expire." }
      ] },
    { id: "M05.01-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A security team must find IAM users whose access keys have not been rotated in 90 days and users without MFA, across the account, with the LEAST effort. What should they use?",
      options: [
        { t: "The IAM credential report", c: true, why: "It lists every IAM user with password and access-key ages, last-used dates and MFA status in one CSV." },
        { t: "AWS CloudTrail Lake queries over 90 days of events", c: false, why: "CloudTrail shows usage, not key age or MFA configuration." },
        { t: "Amazon Inspector", c: false, why: "Inspector scans workloads for vulnerabilities, not IAM credentials." },
        { t: "AWS Trusted Advisor cost checks", c: false, why: "Cost checks don't report credential age or MFA status." }
      ] }
  ],
  cards: ["fc-M05-1-01", "fc-M05-1-02", "fc-M05-1-03", "fc-M05-1-04", "fc-M05-1-05", "fc-M05-1-06", "fc-M05-1-07", "fc-M05-1-08", "fc-M05-1-09", "fc-M05-1-10", "fc-M05-1-11", "fc-M05-1-12"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"AWS Identity and Access Management\" (PDF p603–608)",
    "IAM User Guide: <em>Security best practices in IAM</em>, <em>Tasks that require root user credentials</em>, <em>IAM identifiers</em>, <em>IAM and AWS STS quotas</em>",
    "IAM User Guide: <em>Centrally manage root access for member accounts</em>",
    "AWS Well-Architected Security Pillar: SEC02 (manage identities for people and machines)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-1-01", front: "Authentication vs authorisation in IAM?", back: "Authentication: who are you (signature, password + MFA, temporary credentials). Authorisation: are you allowed (policy evaluation; default deny)." },
  { id: "fc-M05-1-02", front: "Five parts of the request context?", back: "Principal · action · resource · environment (IP, time, TLS, MFA, VPC endpoint) · request data (tags being set, headers)." },
  { id: "fc-M05-1-03", front: "Is an IAM group a principal?", back: "No. It's an identity you attach policies to. It can't make requests or appear in a Principal element. No nesting; max 10 groups per user." },
  { id: "fc-M05-1-04", front: "ARN format?", back: "arn:partition:service:region:account-id:resource. IAM ARNs have an empty Region; S3 bucket ARNs have empty Region and account." },
  { id: "fc-M05-1-05", front: "What does arn:aws:iam::111122223333:root mean in a policy?", back: "The whole account 111122223333: any principal in it whose own IAM policies also allow the action. Not just the root user." },
  { id: "fc-M05-1-06", front: "Unique ID prefixes AKIA, ASIA, AIDA, AROA?", back: "AKIA long-term access key · ASIA temporary (STS) key · AIDA IAM user · AROA IAM role." },
  { id: "fc-M05-1-07", front: "Name four root-only tasks.", back: "Close the account · configure S3 MFA Delete · restore a locked-out admin's permissions · edit a bucket/queue policy that denies everyone (also root email/password, RI Marketplace seller, GovCloud sign-up)." },
  { id: "fc-M05-1-08", front: "Centralised root access management?", back: "Organizations feature (2024): remove root credentials from member accounts and do root-only tasks through short-lived privileged sessions from the management or delegated admin account." },
  { id: "fc-M05-1-09", front: "Which MFA types are phishing-resistant?", back: "Passkeys and FIDO2 security keys. TOTP apps and hardware TOTP tokens are not. Up to 8 MFA devices per user." },
  { id: "fc-M05-1-10", front: "Identity choice: humans, code on AWS, code outside AWS, vendors?", back: "Humans → IAM Identity Center · on AWS → role on the compute · outside AWS → OIDC federation or IAM Roles Anywhere · vendors → cross-account role + external ID." },
  { id: "fc-M05-1-11", front: "Zero-downtime access key rotation steps?", back: "Create second key → deploy it → verify old key unused (last-used) → deactivate old → delete old. Better: replace the user with a role." },
  { id: "fc-M05-1-12", front: "IAM credential report?", back: "Account-wide CSV of IAM users: password/key ages, last used, MFA active. Generate then download (base64). Regenerated at most every 4 h." }
);
// ================================================================== 02_policy_language.js
/* ---------------------------------------------------------------- M05.02 The policy language */
var DG_0502_ANATOMY = `
<figure>
<svg class="diagram" viewBox="0 0 760 372" role="img" aria-labelledby="m0502at m0502ad">
  <title id="m0502at">How a policy statement is matched against the request context</title>
  <desc id="m0502ad">On the left, a statement's elements: Effect, Principal, Action, Resource and Condition. On the right, the parts of the request context: the caller, the API action, the resource ARN, and the environment and request data. Each context part is matched by one element. The statement applies only if principal, action and resource match and every condition is true; then its Effect, Allow or Deny, is applied.</desc>
  <defs><marker id="m0502a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-ta" x="16" y="22">Policy statement</text>
  <text class="dg-ta" x="470" y="22">Request context (from the API call)</text>

  <rect class="dg-edge" x="16" y="34" width="290" height="44" rx="6"/><text class="dg-tb" x="28" y="54">Effect</text><text class="dg-ts" x="28" y="70">Allow or Deny, if everything below matches</text>
  <rect class="dg-box" x="16" y="88" width="290" height="44" rx="6"/><text class="dg-tb" x="28" y="108">Principal</text><text class="dg-ts" x="28" y="124">resource/trust policies only</text>
  <rect class="dg-box" x="16" y="142" width="290" height="44" rx="6"/><text class="dg-tb" x="28" y="162">Action / NotAction</text><text class="dg-ts" x="28" y="178">"s3:GetObject", "ec2:Describe*"</text>
  <rect class="dg-box" x="16" y="196" width="290" height="44" rx="6"/><text class="dg-tb" x="28" y="216">Resource / NotResource</text><text class="dg-ts" x="28" y="232">ARNs, wildcards * and ?</text>
  <rect class="dg-box" x="16" y="250" width="290" height="58" rx="6"/><text class="dg-tb" x="28" y="270">Condition</text><text class="dg-ts" x="28" y="286">operator → key → values</text><text class="dg-ts" x="28" y="300">all blocks must be true</text>

  <rect class="dg-info" x="470" y="88" width="274" height="44" rx="6"/><text class="dg-t" x="482" y="108">Who is calling</text><text class="dg-ts" x="482" y="124">principal ARN, account, tags</text>
  <rect class="dg-info" x="470" y="142" width="274" height="44" rx="6"/><text class="dg-t" x="482" y="162">Which API</text><text class="dg-ts" x="482" y="178">s3:GetObject</text>
  <rect class="dg-info" x="470" y="196" width="274" height="44" rx="6"/><text class="dg-t" x="482" y="216">On which resource</text><text class="dg-ts" x="482" y="232">arn:aws:s3:::reports/q3.csv</text>
  <rect class="dg-info" x="470" y="250" width="274" height="58" rx="6"/><text class="dg-t" x="482" y="270">Environment and request data</text><text class="dg-ts" x="482" y="286">IP, time, MFA, TLS, VPC endpoint,</text><text class="dg-ts" x="482" y="300">Region, tags being set, headers</text>

  <path class="dg-line" d="M468 110 H308" marker-end="url(#m0502a-ar)"/>
  <path class="dg-line" d="M468 164 H308" marker-end="url(#m0502a-ar)"/>
  <path class="dg-line" d="M468 218 H308" marker-end="url(#m0502a-ar)"/>
  <path class="dg-line" d="M468 279 H308" marker-end="url(#m0502a-ar)"/>
  <text class="dg-ts" x="350" y="104">matches?</text>
  <text class="dg-ts" x="350" y="158">matches?</text>
  <text class="dg-ts" x="350" y="212">matches?</text>
  <text class="dg-ts" x="350" y="273">all true?</text>

  <rect class="dg-good" x="16" y="322" width="728" height="40" rx="6"/>
  <text class="dg-t" x="28" y="340">All match → the statement applies and its Effect counts. Any mismatch → it is ignored.</text>
  <text class="dg-ts" x="28" y="355">A statement never "denies by not matching": that is the default implicit deny, which any Allow can override.</text>
</svg>
<figcaption>Figure M05-2a. A statement is a filter over the request context. Principal, Action and Resource select which requests it is about; Condition narrows it further; Effect says what to do with the requests that pass.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.02", title: "The policy language", level: 200, minutes: 55,
  objectives: [
    "Explain the semantics and pitfalls of every policy element, including NotAction, NotResource and NotPrincipal",
    "Combine condition operators, set operators (ForAllValues, ForAnyValue), IfExists and Null correctly, and predict how missing keys behave",
    "Use policy variables and global condition keys to write one policy that scales across users, teams and accounts",
    "Write, validate and test real-world policies: per-team S3 prefixes, Region guardrails, MFA, IP and VPC endpoint restrictions, tag-based EC2 control and iam:PassRole"
  ],
  sections: [
    { type: "why", html: `
<p>In M03.03 you learned to <em>read</em> a policy: Version, Statement, Effect, Action, Resource, Condition. That is enough to recognise a read-only bucket policy. It is not enough to write the policies an architect is actually asked for: "developers may manage only their own team's instances", "nothing may run outside our two Regions", "this bucket may only be reached through our VPC endpoint", "the CI role may pass only application roles to EC2".</p>
<p>Those policies live or die on details. A single <code>NotAction</code> where <code>Action</code> was meant can grant full IAM access. <code>ForAllValues</code> on a request with no tags evaluates to <em>true</em>. <code>aws:username</code> is empty for role sessions. A bucket ARN without <code>/*</code> silently fails to grant object access. Each of these has caused real incidents, and each appears in exam distractors.</p>
<p>This lesson goes element by element, then operator by operator, then through eight production policies with annotations. M05.03 adds the policy <em>types</em> and M05.04 the full evaluation logic.</p>` },

    { type: "concept", title: "Concept 1: every element, precisely", html: DG_0502_ANATOMY + `
<table>
<thead><tr><th>Element</th><th>Required?</th><th>Meaning</th><th>Pitfalls</th></tr></thead>
<tbody>
<tr><td><code>Version</code></td><td>Yes in practice</td><td>Language version. Always <code>"2012-10-17"</code>.</td><td>With the old <code>2008-10-17</code> (or none), policy variables such as <code>\${aws:username}</code> are treated as literal text.</td></tr>
<tr><td><code>Id</code></td><td>No</td><td>Optional policy identifier; some services (SQS, SNS) use it.</td><td>–</td></tr>
<tr><td><code>Statement</code></td><td>Yes</td><td>One statement object, or an array of them.</td><td>Statements are independent: there is no "if-else" between them.</td></tr>
<tr><td><code>Sid</code></td><td>No</td><td>Statement label, unique within the policy.</td><td>Use it: findings and reviews refer to Sids. Alphanumeric only in identity policies.</td></tr>
<tr><td><code>Effect</code></td><td>Yes</td><td><code>Allow</code> or <code>Deny</code>.</td><td>An explicit Deny anywhere beats every Allow (M05.04).</td></tr>
<tr><td><code>Principal</code> / <code>NotPrincipal</code></td><td>Resource-based and trust policies only</td><td>Who the statement is about.</td><td>Not allowed in identity policies (the principal is whoever has the policy attached). Avoid <code>NotPrincipal</code>; use <code>aws:PrincipalArn</code> conditions instead.</td></tr>
<tr><td><code>Action</code> / <code>NotAction</code></td><td>One of them</td><td>API operations, <code>service:Operation</code>. Case-insensitive. Wildcards allowed.</td><td><code>NotAction</code> with Allow grants everything else, including future services.</td></tr>
<tr><td><code>Resource</code> / <code>NotResource</code></td><td>One of them (except trust policies)</td><td>Resource ARNs. Wildcards <code>*</code> (any characters) and <code>?</code> (one character).</td><td>Some actions don't support resource-level permissions and need <code>"*"</code>. ARNs are case-sensitive.</td></tr>
<tr><td><code>Condition</code></td><td>No</td><td>Extra tests against the request context.</td><td>Missing keys and negated operators behave counter-intuitively (Concept 2).</td></tr>
</tbody></table>

<h3>Principal: the forms you will write</h3>
<pre><code>"Principal": { "AWS": "arn:aws:iam::444455556666:root" }                  // a whole account (its admins decide who)
"Principal": { "AWS": "arn:aws:iam::444455556666:role/app/ReportReader" } // one role in that account
"Principal": { "Service": "lambda.amazonaws.com" }                         // an AWS service (trust policies)
"Principal": { "Federated": "arn:aws:iam::111122223333:oidc-provider/token.actions.githubusercontent.com" }
"Principal": "*"                                                           // everyone: only with strong conditions</code></pre>
<p><code>"Principal": "*"</code> plus <code>"Condition": {"StringEquals": {"aws:PrincipalOrgID": "o-a1b2c3d4e5"}}</code> is a powerful pattern: "any principal in my AWS Organization", without listing hundreds of account IDs.</p>

<h3>Action and NotAction</h3>
<ul>
  <li>Exact: <code>"s3:GetObject"</code>. Prefix wildcard: <code>"s3:Get*"</code> (GetObject, GetBucketPolicy, GetObjectTagging…). All: <code>"*"</code>.</li>
  <li>Wildcards are convenient but grow silently: <code>"s3:Get*"</code> today includes actions that did not exist when you wrote it.</li>
  <li><strong>Allow + NotAction</strong> = "allow every action in every service except these". The AWS managed <code>PowerUserAccess</code> policy is built this way (everything except most of IAM and Organizations). Anyone writing <code>Allow NotAction s3:DeleteBucket</code> to mean "S3 except delete" has in fact granted IAM, KMS and everything else (see the case study).</li>
  <li><strong>Deny + NotAction</strong> = "deny everything except these". Excellent for guardrails, for example "deny all actions outside eu-west-1 except global services" (Policy 2 below).</li>
</ul>

<h3>Resource and NotResource</h3>
<ul>
  <li><strong>Bucket vs object ARN</strong> is the classic bug: <code>s3:ListBucket</code> needs <code>arn:aws:s3:::reports</code>; <code>s3:GetObject</code> needs <code>arn:aws:s3:::reports/*</code>. Grant only one and half the application fails with AccessDenied.</li>
  <li><strong>Resource-level permissions vary by action.</strong> Many <code>Describe*</code> and <code>List*</code> actions (e.g. <code>ec2:DescribeInstances</code>, <code>s3:ListAllMyBuckets</code>) can't be scoped to a resource and require <code>"Resource": "*"</code>. The <strong>Service Authorization Reference</strong> lists, for every action, the resource types and condition keys it supports. Check it instead of guessing.</li>
  <li><code>NotResource</code> with Allow grants access to every resource except those listed, including resources in other accounts. Use it mainly in Deny statements.</li>
</ul>` },

    { type: "concept", title: "Concept 2: conditions, variables and global keys", html: `
<h3>Structure and AND/OR rules</h3>
<pre><code>"Condition": {
  "StringEquals": { "aws:RequestedRegion": ["eu-west-1", "eu-central-1"],   // values → OR
                    "aws:PrincipalTag/team": "payments" },                  // keys   → AND
  "Bool":         { "aws:SecureTransport": "true" }                          // operators → AND
}</code></pre>
<ul>
  <li><strong>Different operators</strong> in one Condition block: all must be true (AND).</li>
  <li><strong>Different keys</strong> under one operator: all must be true (AND).</li>
  <li><strong>Several values</strong> for one key: any one may match (OR).</li>
</ul>

<h3>Condition operators</h3>
<table>
<thead><tr><th>Family</th><th>Operators</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td>String</td><td><code>StringEquals</code>, <code>StringNotEquals</code>, <code>StringEqualsIgnoreCase</code>, <code>StringLike</code>, <code>StringNotLike</code></td><td>Tags, Regions, org ID; <code>StringLike</code> allows <code>*</code> and <code>?</code></td></tr>
<tr><td>Numeric</td><td><code>NumericEquals</code>, <code>NumericLessThan</code>, <code>NumericGreaterThanEquals</code>…</td><td><code>aws:MultiFactorAuthAge</code>, <code>s3:max-keys</code></td></tr>
<tr><td>Date</td><td><code>DateLessThan</code>, <code>DateGreaterThan</code>…</td><td><code>aws:CurrentTime</code> for time-boxed access</td></tr>
<tr><td>Boolean</td><td><code>Bool</code></td><td><code>aws:SecureTransport</code>, <code>aws:MultiFactorAuthPresent</code>, <code>aws:ViaAWSService</code></td></tr>
<tr><td>IP address</td><td><code>IpAddress</code>, <code>NotIpAddress</code></td><td><code>aws:SourceIp</code> with CIDRs (public IPs only)</td></tr>
<tr><td>ARN</td><td><code>ArnEquals</code>, <code>ArnLike</code>, <code>ArnNotLike</code></td><td><code>aws:SourceArn</code>, <code>aws:PrincipalArn</code></td></tr>
<tr><td>Existence</td><td><code>Null</code></td><td><code>"Null": {"aws:RequestTag/team": "false"}</code> = "the key must be present"</td></tr>
<tr><td>Modifiers</td><td><code>…IfExists</code> suffix; <code>ForAllValues:</code> / <code>ForAnyValue:</code> prefixes</td><td>Missing keys; multi-valued keys</td></tr>
</tbody></table>

<h3>Missing keys: the three rules that cause incidents</h3>
<ol>
  <li><strong>A positive operator with a missing key is false.</strong> <code>"StringEquals": {"aws:ResourceTag/team": "web"}</code> doesn't match an untagged resource.</li>
  <li><strong>A negated operator with a missing key is true.</strong> <code>"StringNotEquals": {"s3:x-amz-server-side-encryption": "aws:kms"}</code> matches a request that sends no encryption header at all. In a Deny statement this is often what you want; in an Allow it can be a hole.</li>
  <li><strong><code>…IfExists</code></strong> means "if the key is present, test it; if absent, treat the condition as true". <code>"BoolIfExists": {"aws:MultiFactorAuthPresent": "false"}</code> in a Deny catches both "MFA not used" and "key not present at all" (long-term access keys don't send it).</li>
</ol>

<h3>Set operators for multi-valued keys</h3>
<p>Some keys carry a <em>list</em>: <code>aws:TagKeys</code> (all tag keys in the request), <code>aws:CalledVia</code>, some service keys. For them use a set operator:</p>
<ul>
  <li><strong><code>ForAnyValue:</code></strong> true if <em>at least one</em> request value matches one policy value. Empty or missing set → <strong>false</strong>.</li>
  <li><strong><code>ForAllValues:</code></strong> true if <em>every</em> request value matches a policy value. Empty or missing set → <strong>true</strong> (vacuous truth).</li>
</ul>
<p>Worked truth table for an Allow on <code>ec2:CreateTags</code> with <code>"ForAllValues:StringEquals": {"aws:TagKeys": ["team", "env"]}</code>:</p>
<table>
<thead><tr><th>Request tag keys</th><th>ForAllValues result</th><th>ForAnyValue result (same values)</th></tr></thead>
<tbody>
<tr><td><code>team</code></td><td>true</td><td>true</td></tr>
<tr><td><code>team, env</code></td><td>true</td><td>true</td></tr>
<tr><td><code>team, owner</code></td><td><strong>false</strong> (owner not allowed)</td><td>true</td></tr>
<tr><td><code>owner</code></td><td>false</td><td>false</td></tr>
<tr><td>(no tags)</td><td><strong>true</strong></td><td>false</td></tr>
</tbody></table>
<p>"Only these tag keys may be used" is <code>ForAllValues</code>. To also require that some tags <em>are</em> sent, add <code>"Null": {"aws:TagKeys": "false"}</code> or a <code>ForAnyValue</code> on the mandatory key.</p>

<h3>Policy variables</h3>
<p>A variable is replaced with a value from the request context at evaluation time, so one policy can serve many principals. Variables work in <code>Resource</code> and in condition values (and need <code>"Version": "2012-10-17"</code>):</p>
<table>
<thead><tr><th>Variable</th><th>Value</th><th>Caveat</th></tr></thead>
<tbody>
<tr><td><code>\${aws:username}</code></td><td>IAM user name</td><td><strong>Not present for role sessions</strong>, so useless for federated users</td></tr>
<tr><td><code>\${aws:userid}</code></td><td>Unique ID; for roles <code>AROA…:session-name</code></td><td>Works for role sessions; session name often an email</td></tr>
<tr><td><code>\${aws:PrincipalTag/team}</code></td><td>Tag on the user/role, or a session tag from the IdP</td><td>The basis of ABAC (M05.08)</td></tr>
<tr><td><code>\${aws:PrincipalAccount}</code></td><td>Caller's account ID</td><td>Handy in shared templates</td></tr>
<tr><td><code>\${aws:SourceIdentity}</code></td><td>Identity set when the role was first assumed</td><td>Survives role chaining; good for audit</td></tr>
</tbody></table>

<h3>Global condition keys you will use</h3>
<table>
<thead><tr><th>Key</th><th>Tests</th><th>Typical policy</th></tr></thead>
<tbody>
<tr><td><code>aws:PrincipalOrgID</code></td><td>Caller's AWS Organization</td><td>Bucket/KMS policy: "only principals in my org"</td></tr>
<tr><td><code>aws:PrincipalAccount</code>, <code>aws:PrincipalArn</code></td><td>Caller's account / exact ARN</td><td>Exceptions in Deny statements ("except the break-glass role")</td></tr>
<tr><td><code>aws:SourceIp</code></td><td>Public source IP</td><td>Corporate network only (not valid for VPC-endpoint traffic)</td></tr>
<tr><td><code>aws:SourceVpce</code>, <code>aws:SourceVpc</code>, <code>aws:VpcSourceIp</code></td><td>VPC endpoint / VPC / private IP</td><td>"Only via our endpoint" data perimeters</td></tr>
<tr><td><code>aws:RequestedRegion</code></td><td>Region the call targets</td><td>Region guardrails</td></tr>
<tr><td><code>aws:MultiFactorAuthPresent</code>, <code>aws:MultiFactorAuthAge</code></td><td>MFA used / seconds since MFA</td><td>Protect destructive actions</td></tr>
<tr><td><code>aws:SecureTransport</code></td><td>TLS used</td><td>Deny plain HTTP to S3</td></tr>
<tr><td><code>aws:ResourceTag/k</code>, <code>aws:RequestTag/k</code>, <code>aws:TagKeys</code></td><td>Tags on the resource / in the request</td><td>ABAC, mandatory tagging</td></tr>
<tr><td><code>aws:ViaAWSService</code>, <code>aws:CalledVia</code></td><td>Request made by an AWS service on the caller's behalf</td><td>Exempt CloudFormation, Athena etc. from IP rules</td></tr>
<tr><td><code>aws:SourceArn</code>, <code>aws:SourceAccount</code></td><td>Which resource made a service call</td><td>Confused-deputy protection for service principals (M05.06)</td></tr>
<tr><td><code>aws:CurrentTime</code></td><td>Request time</td><td>Temporary access windows</td></tr>
</tbody></table>
<p>Services add their own keys too: <code>s3:prefix</code>, <code>s3:x-amz-server-side-encryption</code>, <code>ec2:InstanceType</code>, <code>iam:PassedToService</code>, <code>kms:ViaService</code>. The Service Authorization Reference lists them per action.</p>` },

    { type: "workflow", title: "Workflow: writing a policy step by step", html: `
<ol class="flow">
  <li><strong>State the requirement as a sentence.</strong> "CI may deploy Lambda functions named <code>orders-*</code> in eu-west-1 and pass only the <code>orders-exec</code> role to them."</li>
  <li><strong>List the API actions.</strong> Find them in the Service Authorization Reference, or let IAM Access Analyzer <em>generate</em> a policy from CloudTrail activity (M05.09). Include supporting actions (here <code>lambda:GetFunction</code>, <code>iam:PassRole</code>).</li>
  <li><strong>Scope resources per action.</strong> Use the resource types the reference lists for each action. Use <code>"*"</code> only for actions with no resource-level support, in a separate statement.</li>
  <li><strong>Add conditions.</strong> Region, tags, MFA, network origin, <code>iam:PassedToService</code>. Decide for each key what should happen if it is missing.</li>
  <li><strong>Split by purpose</strong> into statements with clear <code>Sid</code>s: read, write, pass-role, guardrail Deny.</li>
  <li><strong>Validate</strong> with IAM Access Analyzer policy validation (grammar errors, security warnings such as "PassRole with star", suggestions).</li>
  <li><strong>Test</strong> with the IAM Policy Simulator or <code>aws iam simulate-custom-policy</code> for both allowed and denied cases, including the edge cases (missing tag, wrong Region).</li>
  <li><strong>Deploy through IaC and review</strong> in a pull request (M03.03), then watch CloudTrail for <code>AccessDenied</code> in the first days.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: where policies live", html: `
<table>
<thead><tr><th>Form</th><th>What it is</th><th>When to use</th></tr></thead>
<tbody>
<tr><td><strong>AWS managed policy</strong></td><td>Created and updated by AWS (e.g. <code>ReadOnlyAccess</code>, <code>AmazonS3ReadOnlyAccess</code>, job-function policies)</td><td>Quick start, sandbox accounts. Broad; changes when AWS adds actions.</td></tr>
<tr><td><strong>Customer managed policy</strong></td><td>Your standalone policy, attachable to many identities, versioned (up to 5 versions, one default)</td><td>The normal choice: reusable, reviewable, rollback by switching versions</td></tr>
<tr><td><strong>Inline policy</strong></td><td>Embedded in one user, group or role, deleted with it</td><td>Strict one-to-one relationships; otherwise avoid</td></tr>
<tr><td><strong>Resource-based policy</strong></td><td>Attached to a resource: bucket, key, queue, topic, function, secret, repository</td><td>Cross-account access and data perimeters (M05.03)</td></tr>
</tbody></table>
<h3>Tools</h3>
<ul>
  <li><strong>Visual editor</strong> in the IAM console: builds policies from service, action and resource pickers, showing which actions lack resource-level support.</li>
  <li><strong>IAM Access Analyzer policy validation</strong>: over 100 checks; runs in the console editor and via <code>aws accessanalyzer validate-policy</code>, so you can run it in CI.</li>
  <li><strong>IAM Policy Simulator</strong>: evaluate attached or draft policies against specific actions, resources and context keys.</li>
  <li><strong>Size limits</strong>: managed policy 6,144 characters; inline totals per user 2,048, group 5,120, role 10,240. Large policies usually signal that wildcards, variables or ABAC tags would be better.</li>
</ul>` },

    { type: "examples", title: "Worked examples: eight production policies", html: `
<p>All examples use account <code>111122223333</code>. M03.03 covered simple read-only, TLS-only and policy-variable examples; these go further.</p>

<h3>Policy 1: each team sees only its own S3 prefix (works for federated users)</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListOwnTeamPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::shared-data",
      "Condition": { "StringLike": { "s3:prefix": ["teams/\${aws:PrincipalTag/team}/*", "teams/\${aws:PrincipalTag/team}"] } }
    },
    {
      "Sid": "ReadWriteOwnTeamObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::shared-data/teams/\${aws:PrincipalTag/team}/*"
    }
  ]
}</code></pre>
<ul>
  <li>Uses <code>aws:PrincipalTag/team</code>, set as a <strong>session tag</strong> by the IdP, because <code>aws:username</code> is empty for Identity Center and other role sessions.</li>
  <li>Listing is a <em>bucket</em> action scoped with <code>s3:prefix</code>; object actions use the <em>object</em> ARN.</li>
  <li>If the tag is missing, the variable can't be resolved and the statements don't match: deny by default. Safe failure.</li>
</ul>

<h3>Policy 2: deny everything outside approved Regions (guardrail)</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideApprovedRegions",
      "Effect": "Deny",
      "NotAction": ["iam:*", "organizations:*", "sts:*", "route53:*", "cloudfront:*", "support:*", "budgets:*", "ce:*", "health:*", "waf:*", "globalaccelerator:*"],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": { "aws:RequestedRegion": ["eu-west-1", "eu-central-1"] },
        "ArnNotLike": { "aws:PrincipalArn": "arn:aws:iam::*:role/BreakGlassAdmin" }
      }
    }
  ]
}</code></pre>
<ul>
  <li><strong>Deny + NotAction</strong>: "deny every action except these global services" when the Region is not approved. Global services sign requests for <code>us-east-1</code>, so without the exemptions IAM and CloudFront would break.</li>
  <li>The <code>ArnNotLike</code> exception keeps a break-glass role working. Both conditions must be true for the Deny to apply.</li>
  <li>Usually deployed as an <strong>SCP</strong> (M05.03, M06), so it applies to every principal in the account. The exemption list is illustrative: start from AWS's published example and test.</li>
</ul>

<h3>Policy 3: require recent MFA for destructive actions</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDestructiveWithoutMFA",
      "Effect": "Deny",
      "Action": ["ec2:TerminateInstances", "rds:DeleteDBInstance", "s3:DeleteBucket"],
      "Resource": "*",
      "Condition": { "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" } }
    },
    {
      "Sid": "DenyIfMFAOlderThanOneHour",
      "Effect": "Deny",
      "Action": ["ec2:TerminateInstances", "rds:DeleteDBInstance", "s3:DeleteBucket"],
      "Resource": "*",
      "Condition": { "NumericGreaterThanIfExists": { "aws:MultiFactorAuthAge": "3600" } }
    }
  ]
}</code></pre>
<ul>
  <li><code>BoolIfExists</code>, not <code>Bool</code>: requests signed with long-term access keys don't include the MFA key at all. With plain <code>Bool</code>, the condition would be false for them and the Deny wouldn't apply.</li>
  <li>For Identity Center users MFA happens at the IdP; whether the key is present depends on the federation set-up, so test it.</li>
</ul>

<h3>Policy 4: only from the corporate network, unless an AWS service is acting for you</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideCorporateNetwork",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "NotIpAddress": { "aws:SourceIp": ["203.0.113.0/24", "198.51.100.0/24"] },
        "Bool": { "aws:ViaAWSService": "false" }
      }
    }
  ]
}</code></pre>
<ul>
  <li>Without <code>aws:ViaAWSService</code>, CloudFormation, Athena or Glue calling S3 <em>on your behalf</em> come from AWS IP addresses and would be denied.</li>
  <li><code>aws:SourceIp</code> is only the public IP. Traffic through a VPC endpoint carries <code>aws:VpcSourceIp</code> and <code>aws:SourceVpce</code> instead, so this policy also blocks calls from your own VPCs through endpoints. Add a <code>aws:SourceVpc</code> exception if needed.</li>
</ul>

<h3>Policy 5: start and stop only your team's EC2 instances</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DescribeNeedsStar",
      "Effect": "Allow",
      "Action": ["ec2:DescribeInstances", "ec2:DescribeInstanceStatus"],
      "Resource": "*"
    },
    {
      "Sid": "StartStopOwnTeam",
      "Effect": "Allow",
      "Action": ["ec2:StartInstances", "ec2:StopInstances", "ec2:RebootInstances"],
      "Resource": "arn:aws:ec2:*:111122223333:instance/*",
      "Condition": { "StringEquals": { "aws:ResourceTag/team": "\${aws:PrincipalTag/team}" } }
    }
  ]
}</code></pre>
<ul>
  <li>Describe actions don't support resource-level permissions, so they get their own <code>"*"</code> statement.</li>
  <li>The condition compares a resource tag with a principal tag: the essence of ABAC (M05.08). Pair it with a Deny on <code>ec2:CreateTags</code>/<code>DeleteTags</code> for the <code>team</code> key, or people can re-tag instances into their team.</li>
</ul>

<h3>Policy 6: bucket policy requiring TLS and SSE-KMS on upload</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::finance-records", "arn:aws:s3:::finance-records/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    },
    {
      "Sid": "DenyNonKmsUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::finance-records/*",
      "Condition": { "StringNotEquals": { "s3:x-amz-server-side-encryption": "aws:kms" } }
    }
  ]
}</code></pre>
<ul>
  <li><code>StringNotEquals</code> with a missing header is <strong>true</strong>, so uploads that send no header are denied, even if the bucket's default encryption is SSE-KMS.</li>
  <li>Since January 2023 all new objects are encrypted (SSE-S3 by default). Often a simpler design is: set default encryption to SSE-KMS and drop the second statement, so clients needn't send the header. Choose deliberately.</li>
</ul>

<h3>Policy 7: bucket reachable only through one VPC endpoint</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnlessFromOurEndpoint",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::payroll-exports", "arn:aws:s3:::payroll-exports/*"],
      "Condition": {
        "StringNotEquals": { "aws:SourceVpce": "vpce-0a1b2c3d4e5f67890" },
        "ArnNotLike": { "aws:PrincipalArn": "arn:aws:iam::111122223333:role/BreakGlassAdmin" }
      }
    }
  ]
}</code></pre>
<ul>
  <li>This also blocks the S3 console for administrators, because console requests don't come through your endpoint. The break-glass exception keeps a way to fix the policy without the root user.</li>
  <li>The exam phrase is "access to the bucket must only come from the VPC": bucket policy with <code>aws:SourceVpce</code> (or <code>aws:SourceVpc</code>) plus a gateway endpoint (M10).</li>
</ul>

<h3>Policy 8: iam:PassRole, scoped</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LaunchInstances",
      "Effect": "Allow",
      "Action": ["ec2:RunInstances", "ec2:DescribeInstances"],
      "Resource": "*"
    },
    {
      "Sid": "PassOnlyAppRolesToEc2",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::111122223333:role/app/*",
      "Condition": { "StringEquals": { "iam:PassedToService": "ec2.amazonaws.com" } }
    }
  ]
}</code></pre>
<ul>
  <li>Passing a role to a service is how a principal gives that service permissions. <code>iam:PassRole</code> on <code>"*"</code> lets someone launch an instance with an <em>admin</em> role and then use it: a classic privilege escalation.</li>
  <li>Scope by role path (<code>role/app/*</code>) and by <code>iam:PassedToService</code>. Access Analyzer flags <code>PassRole</code> with a wildcard resource.</li>
  <li><code>ec2:RunInstances</code> is shown with <code>"*"</code> for brevity; in production scope it with resource ARNs and conditions such as allowed instance types.</li>
</ul>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Requirement</th><th>Policy technique</th><th>Key detail</th></tr></thead>
<tbody>
<tr><td>Shared bucket, one folder per team, users come from an IdP</td><td>Policy variable <code>\${aws:PrincipalTag/team}</code> in Resource and <code>s3:prefix</code></td><td><code>aws:username</code> doesn't exist for role sessions</td></tr>
<tr><td>Data must never be processed outside the EU</td><td>Deny + NotAction with <code>aws:RequestedRegion</code>, as an SCP</td><td>Exempt global services; keep a break-glass exception</td></tr>
<tr><td>Only org members may read the shared artefacts bucket</td><td><code>"Principal": "*"</code> + <code>aws:PrincipalOrgID</code></td><td>No account list to maintain</td></tr>
<tr><td>Contractors get access for two weeks only</td><td><code>DateLessThan</code> on <code>aws:CurrentTime</code></td><td>Still remove the assignment afterwards; time conditions are a backstop</td></tr>
<tr><td>Only approved tag keys, and <code>cost-center</code> is mandatory</td><td><code>ForAllValues:StringEquals</code> on <code>aws:TagKeys</code> + <code>Null</code> check on <code>aws:RequestTag/cost-center</code></td><td>ForAllValues alone is true for untagged requests</td></tr>
<tr><td>Platform team may let developers create roles, safely</td><td>Allow <code>iam:CreateRole</code> only with a required permissions boundary (<code>iam:PermissionsBoundary</code>)</td><td>Covered in M05.03</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: test policies without deploying them (free)", html: `
<p><code>simulate-custom-policy</code> evaluates a policy you pass on the command line against actions, resources and context keys. Nothing is created in your account.</p>
<pre><code># Save Policy 5 (team EC2 control) as team-ec2.json, then:
aws iam simulate-custom-policy \\
  --policy-input-list file://team-ec2.json \\
  --action-names ec2:StopInstances \\
  --resource-arns arn:aws:ec2:eu-west-1:111122223333:instance/i-0abc1234567890def \\
  --context-entries \\
    "ContextKeyName=aws:ResourceTag/team,ContextKeyValues=payments,ContextKeyType=string" \\
    "ContextKeyName=aws:PrincipalTag/team,ContextKeyValues=payments,ContextKeyType=string" \\
  --query "EvaluationResults[].[EvalActionName,EvalDecision]" --output text
# ec2:StopInstances   allowed

# Same call, but the instance belongs to another team:
#   ContextKeyValues=search for aws:ResourceTag/team
# ec2:StopInstances   implicitDeny</code></pre>
<p>Then validate the grammar and look for security warnings:</p>
<pre><code>aws accessanalyzer validate-policy --policy-type IDENTITY_POLICY \\
  --policy-document file://team-ec2.json \\
  --query "findings[].[findingType,issueCode]" --output table
# An empty table means no findings. Try changing "Resource" in the PassRole policy to "*"
# and validating again: you'll get a SECURITY_WARNING about PassRole with a wildcard.</code></pre>
<p>Exercise: write Policy 2 to a file and simulate <code>ec2:RunInstances</code> with <code>aws:RequestedRegion</code> set to <code>us-west-2</code> (expect <code>explicitDeny</code>) and to <code>eu-west-1</code> (expect <code>implicitDeny</code>, because the policy only denies; nothing allows).</p>` },

    { type: "casestudy", title: "Case study: Quarry Lane Media and the one-word mistake", html: `
<p><strong>Context.</strong> Quarry Lane Media (fictional) runs video archives in S3. After an engineer accidentally deleted a test bucket, the platform lead asked for the content team's policy to "allow everything we need in S3, except deleting buckets". A junior engineer wrote:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "EverythingButDeleteBucket", "Effect": "Allow", "NotAction": "s3:DeleteBucket", "Resource": "*" }
  ]
}</code></pre>
<p>It passed review because it "looked like" the requirement, and it worked: the team could do everything in S3 and couldn't delete buckets.</p>
<p><strong>What actually happened.</strong> <code>Allow</code> + <code>NotAction</code> grants <em>every action in every service</em> except <code>s3:DeleteBucket</code>. That included <code>iam:AttachRolePolicy</code>, <code>iam:CreateAccessKey</code>, <code>kms:ScheduleKeyDeletion</code> and <code>organizations:LeaveOrganization</code>. Four months later, a content-team role used by a third-party transcoding tool was compromised through the tool's leaked credentials. The attacker attached <code>AdministratorAccess</code> to the role, created a new IAM user with keys for persistence, and started GPU instances in three Regions. Detection came from the AWS Budget alert two days later.</p>
<p><strong>Fix.</strong></p>
<ol>
  <li>Replace the policy with an <strong>allow-list</strong>: <code>s3:Get*</code>, <code>s3:List*</code>, <code>s3:PutObject*</code>, <code>s3:DeleteObject*</code> on the content buckets only, plus a separate <strong>explicit Deny</strong> for <code>s3:DeleteBucket</code>.</li>
  <li>Add <strong>IAM Access Analyzer policy validation</strong> to the pipeline. It reports <code>Allow</code> with <code>NotAction</code> as a security warning, so the pull request would have failed.</li>
  <li>Attach a <strong>permissions boundary</strong> to all team and vendor roles that excludes IAM, Organizations and KMS key administration (M05.03).</li>
  <li>Add an <strong>SCP</strong> denying unused Regions (Policy 2) and GPU instance types outside the ML account.</li>
  <li>Move the transcoding vendor to a cross-account role with an external ID (M05.06), removing its stored credentials.</li>
</ol>
<p><strong>Lessons learned.</strong> Express "everything except X" as <em>Allow the needed set + Deny X</em>, never as <em>Allow NotAction X</em>. Policies must be tested for what they <em>deny</em> as well as what they allow, by tools rather than by eye. And guardrails (boundaries, SCPs) exist so that one mistaken policy is not the only line of defence.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Scenario keywords</th><th>Policy answer</th></tr></thead>
<tbody>
<tr><td>"Users may only access their own folder in a bucket"</td><td>Policy variable in Resource and <code>s3:prefix</code> condition</td></tr>
<tr><td>"Deny all actions outside specific Regions"</td><td>Deny with <code>aws:RequestedRegion</code> (usually in an SCP)</td></tr>
<tr><td>"Only allow access from the corporate IP range"</td><td>Deny with <code>NotIpAddress</code> on <code>aws:SourceIp</code></td></tr>
<tr><td>"Bucket accessible only from a specific VPC / VPC endpoint"</td><td>Bucket policy Deny with <code>aws:SourceVpce</code> / <code>aws:SourceVpc</code></td></tr>
<tr><td>"Allow only principals from our organization"</td><td><code>aws:PrincipalOrgID</code> condition</td></tr>
<tr><td>"Require MFA to delete…"</td><td><code>aws:MultiFactorAuthPresent</code> (use <code>BoolIfExists</code> in a Deny)</td></tr>
<tr><td>"Require encryption in transit to S3"</td><td>Deny when <code>aws:SecureTransport</code> is false</td></tr>
</tbody></table>
<h3>Distractors and traps</h3>
<ul>
  <li>Object actions granted on the bucket ARN (missing <code>/*</code>), or <code>s3:ListBucket</code> granted on <code>bucket/*</code>.</li>
  <li><code>Principal</code> in an identity-based policy: invalid.</li>
  <li>"Allow + NotAction" offered as least privilege: it is the opposite.</li>
  <li><code>aws:SourceIp</code> to restrict traffic arriving through a VPC endpoint: it doesn't apply; use <code>aws:SourceVpce</code>.</li>
</ul>
<table>
<thead><tr><th></th><th>Action</th><th>NotAction</th></tr></thead>
<tbody>
<tr><td>With Allow</td><td>Allow exactly these</td><td><strong>Allow everything else</strong> (dangerous)</td></tr>
<tr><td>With Deny</td><td>Deny exactly these</td><td>Deny everything else (guardrail)</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Case sensitivity</strong>: action names and condition key names are case-insensitive; ARNs and most condition <em>values</em> (with <code>StringEquals</code>) are case-sensitive. A tag value of <code>Payments</code> doesn't equal <code>payments</code>. Standardise tag values in lowercase.</li>
  <li><strong>Prefer org-level conditions to account lists.</strong> <code>aws:PrincipalOrgID</code> and <code>aws:ResourceOrgID</code> survive account creation; lists of account IDs rot.</li>
  <li><strong>Deleted-and-recreated roles break resource policies</strong> silently, because the stored unique ID no longer exists. Use <code>aws:PrincipalArn</code> conditions with <code>"Principal": "*"</code> when roles are recreated often (for example by IaC replacements).</li>
  <li><strong>Avoid NotPrincipal.</strong> Its interaction with role sessions and account principals is error-prone; AWS recommends <code>aws:PrincipalArn</code> conditions instead.</li>
  <li><strong>Size pressure is a design signal.</strong> If a policy approaches 6,144 characters, switch to ABAC tags, role paths or wildcards with conditions rather than splitting into many policies.</li>
  <li><strong>Managed policy versions</strong> give you rollback: keep the previous version for a few days after a change, then prune (5 versions maximum).</li>
  <li><strong>Lint in CI</strong>: <code>aws accessanalyzer validate-policy</code> and the custom policy checks (<code>check-no-new-access</code>) can block a pull request that widens access.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>A statement applies only if principal, action, resource and every condition match. Then its Effect counts; otherwise it is ignored.</li>
  <li><code>Principal</code> appears only in resource-based and trust policies. <code>"*"</code> + <code>aws:PrincipalOrgID</code> means "anyone in my organization".</li>
  <li>Allow + NotAction grants everything else (dangerous). Deny + NotAction is a guardrail pattern.</li>
  <li>Bucket actions use <code>arn:aws:s3:::bucket</code>, object actions <code>arn:aws:s3:::bucket/*</code>. Some actions need <code>"*"</code>: check the Service Authorization Reference.</li>
  <li>Within Condition: operators AND, keys AND, values OR. Positive operator + missing key = false; negated operator + missing key = true; IfExists treats missing as true.</li>
  <li>ForAnyValue: at least one matches (empty → false). ForAllValues: all match (empty → true).</li>
  <li>Policy variables need Version 2012-10-17. <code>aws:username</code> is empty for role sessions; use <code>aws:PrincipalTag/…</code> or <code>aws:userid</code>.</li>
  <li>Scope <code>iam:PassRole</code> by role ARN and <code>iam:PassedToService</code>. Validate with Access Analyzer and test with the Policy Simulator before deploying.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.02-d1", q: "Within one Condition operator, two different keys are listed. Must both match, or only one? (both / one)", answers: ["both", "and"], explain: "Different keys (and different operators) are combined with AND. Multiple values for one key are OR." },
    { id: "M05.02-d2", q: "An identity policy has one statement: <code>Allow</code>, <code>NotAction: iam:*</code>, <code>Resource: *</code>. Is <code>s3:DeleteBucket</code> allowed or denied by it? (allowed / denied)", answers: ["allowed", "allow"], explain: "Allow + NotAction grants every action except those listed, so S3 deletion is allowed." },
    { id: "M05.02-d3", q: "An Allow statement grants <code>s3:GetObject</code> on <code>arn:aws:s3:::reports</code> only. Can the user download <code>reports/q3.csv</code>? (allowed / denied)", answers: ["denied", "deny", "no"], hint: "Bucket ARN vs object ARN.", explain: "Objects need <code>arn:aws:s3:::reports/*</code>. The bucket ARN matches no object, so the request is implicitly denied." },
    { id: "M05.02-d4", q: "A condition uses <code>ForAllValues:StringEquals</code> on <code>aws:TagKeys</code> with values team and env. The request sends no tags. Does the condition evaluate to true or false?", answers: ["true"], explain: "ForAllValues is vacuously true for an empty or missing set. Add a Null check if tags are mandatory." },
    { id: "M05.02-d5", q: "A Deny statement uses <code>StringNotEquals</code> on <code>s3:x-amz-server-side-encryption</code> = aws:kms. An upload sends no encryption header. Is the upload denied by it? (yes / no)", answers: ["yes", "y"], explain: "A negated operator with a missing key evaluates to true, so the Deny applies." },
    { id: "M05.02-d6", q: "Which global condition key restricts a bucket policy to requests arriving through a specific VPC endpoint?", answers: ["aws:SourceVpce", "SourceVpce", "aws:sourcevpce"], explain: "<code>aws:SourceVpce</code> holds the endpoint ID (vpce-…). <code>aws:SourceVpc</code> holds the VPC ID." },
    { id: "M05.02-d7", q: "Which IAM condition key limits the service to which a role may be passed with iam:PassRole?", answers: ["iam:PassedToService", "PassedToService"], explain: "For example <code>\"iam:PassedToService\": \"ec2.amazonaws.com\"</code>." },
    { id: "M05.02-d8", q: "Which Version value must a policy have for policy variables such as <code>\${aws:username}</code> to be substituted?", answers: ["2012-10-17"], explain: "With 2008-10-17 or no Version, variables are treated as literal strings." },
    { id: "M05.02-d9", q: "An Identity Center user's policy uses <code>\${aws:username}</code> in a Resource ARN. Does the variable resolve to their name? (yes / no)", answers: ["no", "n"], explain: "aws:username exists only for IAM users. Role sessions (including Identity Center) need aws:PrincipalTag/… or aws:userid." }
  ],
  check: [
    { id: "M05.02-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company wants to prevent any resources from being created outside eu-west-1 and eu-central-1 in all its member accounts, while IAM, Route 53 and CloudFront keep working. Which policy statement achieves this?",
      options: [
        { t: "Deny with NotAction listing the global services, Resource \"*\", and a StringNotEquals condition on aws:RequestedRegion for the two Regions, applied as an SCP", c: true, why: "Deny + NotAction denies everything except the global services when the requested Region is not approved. As an SCP it applies to every principal in the member accounts." },
        { t: "Allow with Action \"*\" and a StringEquals condition on aws:RequestedRegion, attached to every IAM role", c: false, why: "Allows don't restrict anything another policy allows, and roles can be created without it. It also breaks global services." },
        { t: "Deny with Action \"*\" and StringNotEquals on aws:RequestedRegion, applied as an SCP", c: false, why: "This denies global services too, because they sign requests for us-east-1." },
        { t: "Allow with NotAction listing the global services and a Region condition", c: false, why: "Allow + NotAction grants everything else; it restricts nothing." }
      ] },
    { id: "M05.02-k2", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Users federated through IAM Identity Center must each access only their team's prefix in a shared bucket. Each user's session carries a 'team' tag from the identity provider. Which Resource should the policy use?",
      options: [
        { t: "arn:aws:s3:::shared-data/teams/${aws:PrincipalTag/team}/*", c: true, why: "The principal tag is available for role sessions and is substituted at evaluation time." },
        { t: "arn:aws:s3:::shared-data/teams/${aws:username}/*", c: false, why: "aws:username exists only for IAM users, not for federated role sessions." },
        { t: "arn:aws:s3:::shared-data/teams/*", c: false, why: "That grants every team's prefix to everyone." },
        { t: "arn:aws:s3:::shared-data", c: false, why: "That's the bucket ARN: it matches no objects." }
      ] },
    { id: "M05.02-k3", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "A bucket policy must deny uploads unless they are sent over HTTPS, and must allow access only from principals in the company's AWS Organization. Which condition keys are needed? (Select TWO.)",
      options: [
        { t: "aws:SecureTransport", c: true, why: "False when the request isn't using TLS; deny in that case." },
        { t: "aws:PrincipalOrgID", c: true, why: "Restricts principals to the organization without listing accounts." },
        { t: "aws:SourceIp", c: false, why: "Tests the caller's public IP, not TLS or organization membership." },
        { t: "aws:RequestedRegion", c: false, why: "Tests the target Region." },
        { t: "aws:MultiFactorAuthPresent", c: false, why: "Tests MFA, not transport or organization." }
      ] },
    { id: "M05.02-k4", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A policy should deny ec2:TerminateInstances unless the caller signed in with MFA. Some automation still uses IAM user access keys. Which condition makes the Deny apply to those long-term keys too?",
      options: [
        { t: "\"BoolIfExists\": { \"aws:MultiFactorAuthPresent\": \"false\" }", c: true, why: "Long-term key requests don't include the key at all. IfExists treats the missing key as true, so the Deny applies." },
        { t: "\"Bool\": { \"aws:MultiFactorAuthPresent\": \"false\" }", c: false, why: "With the key missing, plain Bool evaluates to false, so the Deny doesn't apply to long-term keys." },
        { t: "\"Null\": { \"aws:MultiFactorAuthPresent\": \"false\" }", c: false, why: "That matches only when the key IS present, which is the opposite of what's needed." },
        { t: "\"NumericLessThan\": { \"aws:MultiFactorAuthAge\": \"3600\" }", c: false, why: "In a Deny, this would deny callers who used MFA recently." }
      ] },
    { id: "M05.02-k5", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A DevOps engineer can launch EC2 instances and has iam:PassRole on Resource \"*\". Why is this a risk, and what is the BEST fix?",
      options: [
        { t: "They can launch an instance with an administrator role and act as that role; scope PassRole to specific role ARNs and add iam:PassedToService ec2.amazonaws.com", c: true, why: "PassRole on * is a privilege-escalation path. Restricting which roles can be passed, and to which service, closes it." },
        { t: "PassRole lets them change their own password; remove iam:ChangePassword", c: false, why: "PassRole has nothing to do with passwords." },
        { t: "There is no risk, because PassRole only works with service-linked roles", c: false, why: "PassRole applies to any role a service can use." },
        { t: "Require MFA for ec2:RunInstances", c: false, why: "MFA doesn't limit which role is passed." }
      ] },
    { id: "M05.02-k6", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "An S3 bucket must accept requests only through the VPC gateway endpoint vpce-1a2b3c4d. Which bucket policy statement achieves this?",
      options: [
        { t: "Deny s3:* for Principal \"*\" when StringNotEquals aws:SourceVpce = vpce-1a2b3c4d", c: true, why: "Any request not arriving through that endpoint is explicitly denied." },
        { t: "Deny s3:* when NotIpAddress aws:SourceIp is the VPC CIDR", c: false, why: "Requests through VPC endpoints don't carry a public aws:SourceIp, so this denies the endpoint traffic too." },
        { t: "Allow s3:* for Principal \"*\" when aws:SourceVpce = vpce-1a2b3c4d", c: false, why: "An Allow doesn't stop other principals whose IAM policies allow S3 from outside the endpoint, and it would grant anonymous access through it." },
        { t: "Attach a security group to the bucket", c: false, why: "S3 buckets don't have security groups." }
      ] }
  ],
  cards: ["fc-M05-2-01", "fc-M05-2-02", "fc-M05-2-03", "fc-M05-2-04", "fc-M05-2-05", "fc-M05-2-06", "fc-M05-2-07", "fc-M05-2-08", "fc-M05-2-09", "fc-M05-2-10", "fc-M05-2-11", "fc-M05-2-12"],
  references: [
    "IAM User Guide: <em>IAM JSON policy element reference</em>, <em>Condition operators</em>, <em>Policy variables</em>, <em>Single-valued vs multivalued context keys</em>",
    "IAM User Guide: <em>AWS global condition context keys</em>",
    "<em>Service Authorization Reference</em> (actions, resources and condition keys for AWS services)",
    "IAM Access Analyzer: <em>Policy validation check reference</em>",
    "<em>System Design on AWS</em> ch.12 \"IAM policy\" (PDF p606–607)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-2-01", front: "When does a policy statement apply?", back: "When principal (if present), action, resource and every condition match the request context. Then its Effect counts; otherwise it's ignored." },
  { id: "fc-M05-2-02", front: "Allow + NotAction vs Deny + NotAction?", back: "Allow + NotAction: allows everything else (dangerous, includes future services). Deny + NotAction: denies everything else (guardrail pattern)." },
  { id: "fc-M05-2-03", front: "Where is the Principal element allowed?", back: "Only in resource-based policies and role trust policies. Never in identity-based policies." },
  { id: "fc-M05-2-04", front: "Bucket vs object ARN for S3 actions?", back: "Bucket actions (ListBucket, GetBucketPolicy): arn:aws:s3:::bucket. Object actions (GetObject, PutObject): arn:aws:s3:::bucket/*." },
  { id: "fc-M05-2-05", front: "Condition AND/OR rules?", back: "Operators AND, keys AND, multiple values for one key OR." },
  { id: "fc-M05-2-06", front: "Missing key with StringEquals vs StringNotEquals?", back: "StringEquals → false. StringNotEquals → true. …IfExists → treat missing as true." },
  { id: "fc-M05-2-07", front: "ForAllValues vs ForAnyValue on an empty set?", back: "ForAllValues → true (vacuous). ForAnyValue → false." },
  { id: "fc-M05-2-08", front: "Why is aws:username useless for Identity Center users?", back: "It exists only for IAM users. Role sessions need aws:PrincipalTag/… (session tags) or aws:userid." },
  { id: "fc-M05-2-09", front: "\"Principal\": \"*\" restricted to my organization?", back: "Add condition StringEquals aws:PrincipalOrgID = o-xxxxxxxxxx." },
  { id: "fc-M05-2-10", front: "Restrict a bucket to one VPC endpoint?", back: "Bucket policy: Deny s3:* when StringNotEquals aws:SourceVpce = vpce-… (aws:SourceIp doesn't apply to endpoint traffic)." },
  { id: "fc-M05-2-11", front: "How do you scope iam:PassRole?", back: "Resource = specific role ARNs or a path (role/app/*), plus condition iam:PassedToService (e.g. ec2.amazonaws.com)." },
  { id: "fc-M05-2-12", front: "Why add aws:ViaAWSService to an IP-restriction Deny?", back: "So AWS services calling on your behalf (CloudFormation, Athena, Glue) from AWS IPs aren't blocked." }
);
// ================================================================== 03_policy_types.js
/* ---------------------------------------------------------------- M05.03 Policy types */
var DG_0503_LAYERS = `
<figure>
<svg class="diagram" viewBox="0 0 760 380" role="img" aria-labelledby="m0503at m0503ad">
  <title id="m0503at">The policy types that surround one request</title>
  <desc id="m0503ad">On the principal side, an Organizations service control policy, a permissions boundary and a session policy only limit access, while identity-based policies grant it. On the resource side, a resource control policy only limits access, while the resource-based policy can grant it. The request passes through both sides.</desc>
  <defs><marker id="m0503a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="20" y="26">Principal side (who is asking)</text>
  <text class="dg-tb" x="452" y="26">Resource side (what is touched)</text>

  <rect class="dg-region" x="12" y="38" width="330" height="290" rx="12"/>
  <text class="dg-ta" x="26" y="60">Organization: SCP</text>
  <text class="dg-ts" x="26" y="76">limits every principal in the member account</text>

  <rect class="dg-az" x="30" y="88" width="294" height="226" rx="10"/>
  <text class="dg-tb" x="44" y="110">Permissions boundary</text>
  <text class="dg-ts" x="44" y="126">limits this user or role (optional)</text>

  <rect class="dg-info" x="48" y="138" width="258" height="70" rx="8"/>
  <text class="dg-tb" x="60" y="160">Session policy</text>
  <text class="dg-ts" x="60" y="176">passed when a role session starts;</text>
  <text class="dg-ts" x="60" y="192">limits that one session (optional)</text>

  <rect class="dg-good" x="48" y="220" width="258" height="80" rx="8"/>
  <text class="dg-tb" x="60" y="242">Identity-based policies</text>
  <text class="dg-ts" x="60" y="258">AWS managed · customer managed · inline</text>
  <text class="dg-ts" x="60" y="274">attached to user, group or role</text>
  <text class="dg-ta" x="60" y="292">GRANTS</text>

  <rect class="dg-region" x="440" y="38" width="310" height="290" rx="12"/>
  <text class="dg-ta" x="454" y="60">Organization: RCP</text>
  <text class="dg-ts" x="454" y="76">limits access to resources in member accounts</text>

  <rect class="dg-good" x="460" y="120" width="270" height="94" rx="8"/>
  <text class="dg-tb" x="472" y="142">Resource-based policy</text>
  <text class="dg-ts" x="472" y="158">bucket policy, key policy, queue policy,</text>
  <text class="dg-ts" x="472" y="174">role trust policy … names a Principal</text>
  <text class="dg-ta" x="472" y="200">GRANTS (also cross-account)</text>

  <rect class="dg-box" x="460" y="230" width="270" height="70" rx="8"/>
  <text class="dg-tb" x="472" y="252">The resource</text>
  <text class="dg-ts" x="472" y="268">S3 bucket, KMS key, SQS queue,</text>
  <text class="dg-ts" x="472" y="284">Lambda function, IAM role …</text>

  <path class="dg-line" d="M306 260 H458" marker-end="url(#m0503a-ar)"/>
  <text class="dg-ts" x="352" y="252">request</text>
  <text class="dg-ts" x="20" y="350">Green boxes can grant permissions. Every other layer can only take permissions away.</text>
  <text class="dg-ts" x="20" y="368">An explicit Deny in ANY layer ends the evaluation: the request is denied.</text>
</svg>
<figcaption>Figure M05-3a. Six policy types can apply to one API call. Only identity-based and resource-based policies grant access; SCPs, RCPs, permissions boundaries and session policies set the outer limits.</figcaption>
</figure>`;

var DG_0503_DELEGATE = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0503bt m0503bd">
  <title id="m0503bt">Delegating role creation with a permissions boundary</title>
  <desc id="m0503bd">A developer may create roles only if each new role has the platform team's boundary attached. The new role's effective permissions are the intersection of the policies the developer attaches and the boundary, so the developer cannot create a role more powerful than the boundary.</desc>
  <defs><marker id="m0503b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="12" y="20" width="220" height="96" rx="8"/>
  <text class="dg-tb" x="24" y="42">Developer role</text>
  <text class="dg-ts" x="24" y="60">iam:CreateRole allowed ONLY IF</text>
  <text class="dg-ts" x="24" y="76">iam:PermissionsBoundary =</text>
  <text class="dg-ts" x="24" y="92">AppBoundary; cannot edit or</text>
  <text class="dg-ts" x="24" y="108">remove the boundary</text>
  <path class="dg-line" d="M232 68 H296" marker-end="url(#m0503b-ar)"/>
  <text class="dg-ts" x="240" y="60">creates</text>

  <rect class="dg-good" x="298" y="20" width="210" height="96" rx="8"/>
  <text class="dg-tb" x="310" y="42">New app role</text>
  <text class="dg-ts" x="310" y="60">permissions policy: written</text>
  <text class="dg-ts" x="310" y="76">by the developer (any content)</text>
  <text class="dg-ts" x="310" y="92">boundary: AppBoundary</text>
  <text class="dg-ts" x="310" y="108">(forced by the condition)</text>

  <rect class="dg-edge" x="540" y="20" width="208" height="96" rx="8"/>
  <text class="dg-tb" x="552" y="42">AppBoundary</text>
  <text class="dg-ts" x="552" y="60">owned by the platform team</text>
  <text class="dg-ts" x="552" y="76">allows s3, dynamodb, sqs,</text>
  <text class="dg-ts" x="552" y="92">logs; denies iam:*,</text>
  <text class="dg-ts" x="552" y="108">organizations:*</text>
  <path class="dg-line" d="M540 68 H510" marker-end="url(#m0503b-ar)"/>

  <text class="dg-tb" x="20" y="152">Effective permissions of the new role</text>
  <circle class="dg-good" cx="300" cy="200" r="40" fill-opacity="0.55"/>
  <circle class="dg-edge" cx="350" cy="200" r="40" fill-opacity="0.55"/>
  <text class="dg-ts" x="196" y="204">role policy</text>
  <text class="dg-ts" x="396" y="204">boundary</text>
  <text class="dg-tb" x="316" y="204">∩</text>
  <text class="dg-ts" x="470" y="180">Only the overlap works. Even if the developer</text>
  <text class="dg-ts" x="470" y="196">attaches AdministratorAccess, the role can</text>
  <text class="dg-ts" x="470" y="212">never exceed AppBoundary, so it can't create</text>
  <text class="dg-ts" x="470" y="228">admins or escape the guardrails.</text>
</svg>
<figcaption>Figure M05-3b. The delegated-administrator pattern: developers can create roles for their applications, but every role they create carries the boundary, so privilege can't escalate.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.03", title: "Policy types", level: 200, minutes: 55,
  objectives: [
    "Distinguish the six IAM policy types (identity-based, resource-based, permissions boundaries, SCPs, RCPs, session policies) plus ACLs, by what each is attached to and whether it grants or only limits",
    "Choose between AWS managed, customer managed and inline identity policies",
    "Write a resource-based policy for cross-account access and name the services that support one",
    "Use permissions boundaries to delegate role creation safely, and SCPs and RCPs to set organisation-wide guardrails",
    "Pick the right policy type for a requirement and explain why the others don't fit"
  ],
  sections: [
    { type: "why", html: `
<p>A platform team at a 400-developer company faces a familiar dilemma. If developers can't create IAM roles, every new Lambda function waits days for a ticket. If developers <em>can</em> create roles, one of them will eventually create a role with <code>AdministratorAccess</code> "just to get it working", and that role becomes the path to owning the whole account.</p>
<p>The answer is not one bigger or smaller policy. It's choosing the <strong>right type</strong> of policy for each job: identity policies to grant, a <strong>permissions boundary</strong> so delegated roles can't escalate, <strong>SCPs</strong> so nobody in any account can switch off CloudTrail or leave the organisation, an <strong>RCP</strong> so data never leaves the organisation, and <strong>resource-based policies</strong> for controlled cross-account sharing.</p>
<p>The SAA-C03 exam tests exactly this distinction. Phrases such as "prevent all accounts in the organization from…", "allow another account to read the bucket", or "developers must not be able to create roles with more permissions than…" each point to one policy type. In M03.03 you learned to read a policy document; this lesson is about <strong>where</strong> that document is attached and what power it has there.</p>` },

    { type: "concept", title: "Concept: six policy types, two jobs", html: DG_0503_LAYERS + `
<p>Every IAM policy is a JSON document with the same grammar (Effect, Action, Resource, Condition…). What makes the types different is <strong>what the document is attached to</strong>, and therefore <strong>which requests it applies to</strong> and <strong>whether it can grant access or only restrict it</strong>.</p>
<table>
<thead><tr><th>Policy type</th><th>Attached to</th><th>Can grant?</th><th>Can limit?</th><th>Has <code>Principal</code>?</th><th>Typical job</th></tr></thead>
<tbody>
<tr><td><strong>Identity-based</strong></td><td>IAM user, group or role</td><td>Yes</td><td>Yes (explicit Deny)</td><td>No (the principal is whoever it's attached to)</td><td>"What can this identity do?"</td></tr>
<tr><td><strong>Resource-based</strong></td><td>A resource: S3 bucket, KMS key, SQS queue, SNS topic, Lambda function, IAM role (trust policy)…</td><td>Yes, including to other accounts</td><td>Yes (explicit Deny)</td><td>Yes, required</td><td>"Who can use this resource?" and cross-account sharing</td></tr>
<tr><td><strong>Permissions boundary</strong></td><td>An IAM user or role (a managed policy set as its boundary)</td><td>No</td><td>Yes: sets the maximum</td><td>No</td><td>Safe delegation: cap what a created role can ever do</td></tr>
<tr><td><strong>Service control policy (SCP)</strong></td><td>Organization root, OU or member account (AWS Organizations)</td><td>No</td><td>Yes: maximum for all principals in the account(s)</td><td>No</td><td>Organisation guardrails on what <em>principals</em> may do</td></tr>
<tr><td><strong>Resource control policy (RCP)</strong></td><td>Organization root, OU or member account</td><td>No</td><td>Yes: maximum for access to resources in the account(s)</td><td>Yes (it's resource-centric)</td><td>Data perimeter: who may touch <em>resources</em>, e.g. only org principals</td></tr>
<tr><td><strong>Session policy</strong></td><td>One temporary session (passed to <code>AssumeRole</code>, <code>AssumeRoleWithSAML/WebIdentity</code> or <code>GetFederationToken</code>)</td><td>No</td><td>Yes: maximum for that session</td><td>No</td><td>Scope down a broad role for one task or one tenant</td></tr>
<tr><td><em>Access control lists (ACLs)</em></td><td>Some resources (S3 buckets/objects, legacy)</td><td>Yes (to accounts or groups)</td><td>No</td><td>Grantee instead of Principal; XML, not JSON</td><td>Legacy cross-account grants; disable them in S3</td></tr>
</tbody></table>
<div class="callout"><strong>The one rule to remember:</strong> only <strong>identity-based</strong> and <strong>resource-based</strong> policies (and legacy ACLs) can <em>grant</em>. Permissions boundaries, SCPs, RCPs and session policies are <em>filters</em>: a request must pass all of the filters that apply, and still needs at least one grant. An explicit <code>Deny</code> in any policy of any type ends the evaluation. M05.04 turns this into a precise algorithm.</div>

<h3>1. Identity-based policies: managed or inline?</h3>
<p>An identity-based policy answers "what can <em>this</em> principal do?". It comes in three flavours:</p>
<table>
<thead><tr><th></th><th>AWS managed</th><th>Customer managed</th><th>Inline</th></tr></thead>
<tbody>
<tr><td>Who writes and updates it</td><td>AWS (it can change when services add actions)</td><td>You</td><td>You</td></tr>
<tr><td>Reusable across identities</td><td>Yes</td><td>Yes</td><td>No: embedded in exactly one user, group or role</td></tr>
<tr><td>Versioning</td><td>AWS versions</td><td>Up to 5 versions; roll back by setting a default version</td><td>None</td></tr>
<tr><td>Size limit</td><td colspan="2">6,144 characters per managed policy; up to 10 managed policies per identity by default (raisable to 20)</td><td>Total inline size per user 2,048, group 5,120, role 10,240 characters</td></tr>
<tr><td>Good for</td><td>Getting started; <strong>job-function policies</strong> (<code>ReadOnlyAccess</code>, <code>ViewOnlyAccess</code>, <code>SecurityAudit</code>, <code>PowerUserAccess</code>, <code>Billing</code>, <code>DatabaseAdministrator</code>…)</td><td>Least privilege for your own resources; the <strong>default choice</strong> in production</td><td>A strict one-to-one relationship that must be deleted with the identity</td></tr>
<tr><td>Risk</td><td>Usually broader than you need (<code>AmazonS3FullAccess</code> covers every bucket)</td><td>You must maintain it</td><td>Hard to audit at scale; easy to forget</td></tr>
</tbody></table>
<p>Practical guidance: start from an AWS managed policy to learn which actions a job needs, then replace it with a customer managed policy scoped to your resources (M05.09 shows how IAM Access Analyzer can <em>generate</em> that policy from CloudTrail activity). Attach policies to <strong>groups</strong> or <strong>roles</strong>, not to individual users. In IAM Identity Center, a <strong>permission set</strong> is a bundle of these same policy kinds that Identity Center turns into a role in each account.</p>

<h3>2. Resource-based policies</h3>
<p>A resource-based policy is attached to a resource and must name a <code>Principal</code>: an account, a user, a role, a role session, a federated user, or an AWS service (for example <code>"Service": "sns.amazonaws.com"</code>). Its two superpowers:</p>
<ul>
  <li><strong>Cross-account access without switching roles.</strong> A bucket policy can let account B read objects directly. The caller keeps its own identity and permissions, which matters when it needs to read from one account and write to another in the same call (for example, an S3 copy).</li>
  <li><strong>Letting AWS services act on the resource.</strong> An SQS queue policy allows an SNS topic to send messages; a Lambda function policy allows S3 or API Gateway to invoke the function.</li>
</ul>
<p>Services that support them include S3 (bucket policies, access point policies), <strong>KMS key policies</strong> (required: every key has one), SQS, SNS, Lambda, ECR repositories, Secrets Manager secrets, API Gateway REST APIs, EventBridge event buses, CloudWatch Logs destinations, AWS Backup vaults, OpenSearch domains, Glue Data Catalog, and the most important one of all: the <strong>role trust policy</strong>, which is the resource-based policy on an IAM role that says who may assume it.</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PartnerAccountReadsReports",
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::444455556666:role/ReportReader" },
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::acme-reports/*"
  }]
}</code></pre>
<p>Note <code>Principal</code> (who), and no identity to attach it to: the bucket <em>is</em> the subject. For cross-account access this policy alone is not enough: account 444455556666 must <em>also</em> allow its role to call <code>s3:GetObject</code> on that ARN in an identity policy. Both sides must agree (M05.04).</p>

<h3>3. Permissions boundaries</h3>
<p>A <strong>permissions boundary</strong> is a managed policy that you set on a user or role as its <em>maximum</em> permissions. It never grants anything by itself. Effective permissions are the <strong>intersection</strong> of the identity policies and the boundary. Its classic purpose is delegation, shown in Figure M05-3b and in the examples below.</p>

<h3>4. Service control policies (SCPs)</h3>
<p>SCPs are AWS Organizations policies attached to the organization root, an organizational unit (OU) or an account. They set the maximum permissions for <strong>every IAM user and role in the affected member accounts, including the member account's root user</strong>. Facts the exam likes:</p>
<ul>
  <li>SCPs <strong>never grant</strong>. A user still needs an identity policy.</li>
  <li>They <strong>don't affect the management account</strong> (so keep workloads out of it), and they <strong>don't restrict service-linked roles</strong>.</li>
  <li>When SCPs are enabled, AWS attaches <code>FullAWSAccess</code> to every node. Removing it without adding another Allow blocks everything.</li>
  <li><strong>Deny-list strategy</strong> (common): keep <code>FullAWSAccess</code> and add targeted Deny statements. <strong>Allow-list strategy</strong>: replace <code>FullAWSAccess</code> with SCPs that allow only approved services. An account's permissions are what <em>every</em> level from the root down to the account allows.</li>
  <li>Typical guardrails: deny <code>organizations:LeaveOrganization</code>; deny actions outside approved Regions (with exemptions for global services); deny stopping CloudTrail, GuardDuty or AWS Config; deny creating IAM users' access keys; require IMDSv2; deny using the root user.</li>
</ul>

<h3>5. Resource control policies (RCPs)</h3>
<p>RCPs (launched in late 2024) are the resource-side twin of SCPs. They're attached in AWS Organizations, but they limit what <strong>any principal, including principals from outside your organisation</strong>, can do to <strong>resources in your accounts</strong>. An SCP can't stop an external account from reading your bucket if a developer writes a careless bucket policy, because the external principal isn't in your organisation. An RCP can. They initially support S3, STS, KMS, SQS and Secrets Manager, with more services being added; like SCPs, they don't apply to the management account and start with an <code>RCPFullAWSAccess</code> policy.</p>

<h3>6. Session policies</h3>
<p>When code calls <code>AssumeRole</code> (or a federation API), it can pass an inline policy and/or up to 10 managed policy ARNs. The session's permissions become the intersection of the role's permissions and the session policy. Use it to hand out a <em>narrower</em> credential than the role itself: one tenant's S3 prefix in a SaaS application, or a short-lived read-only copy of an admin role for a script.</p>

<h3>7. ACLs and other things called "policies"</h3>
<ul>
  <li><strong>S3 ACLs</strong> are the original, pre-IAM grant mechanism (XML, grants to accounts or predefined groups). New buckets have <strong>Object Ownership = Bucket owner enforced</strong> by default, which <strong>disables ACLs</strong> so that only policies control access. Keep it that way unless a legacy integration needs ACLs.</li>
  <li><strong>VPC network ACLs</strong> are firewall rules (M02.06, M09), not IAM policies. The exam sometimes puts them in the same answer list to confuse you.</li>
  <li><strong>Declarative policies</strong> (AWS Organizations, late 2024) enforce a desired <em>configuration</em> of a service, for example "block public sharing of AMIs and EBS snapshots" or "IMDSv2 by default", directly in the service, even for future APIs. They complement SCPs but don't use the IAM grammar.</li>
  <li><strong>VPC endpoint policies</strong> are resource-based policies on an interface or gateway endpoint that limit what can be done <em>through</em> that endpoint (M10). They only limit; they never grant.</li>
</ul>` },

    { type: "workflow", title: "Workflow: which policy type solves this requirement?", html: `
<p>Work through these questions in order. The first "yes" usually tells you the policy type; a real design often uses several.</p>
<ol class="flow">
  <li><strong>Must it apply to many accounts at once, and must nobody, not even account admins or the root user, be able to override it?</strong> If it restricts what <em>your principals</em> do → <strong>SCP</strong>. If it restricts who can access <em>your resources</em>, including outsiders → <strong>RCP</strong>. If it enforces a service configuration baseline → consider a <strong>declarative policy</strong>.</li>
  <li><strong>Is another account, an AWS service or an anonymous/federated caller accessing one specific resource?</strong> → a <strong>resource-based policy</strong> on that resource (bucket, key, queue, topic, function, trust policy). For cross-account, add the matching identity policy on the caller's side, or use a role (M05.06).</li>
  <li><strong>Are you letting someone create or modify IAM roles or users, and must those identities never exceed a ceiling?</strong> → <strong>permissions boundary</strong>, enforced with an <code>iam:PermissionsBoundary</code> condition on the creator.</li>
  <li><strong>Is a broad role being used for a narrower purpose for a short time (one tenant, one job)?</strong> → <strong>session policy</strong> passed to <code>AssumeRole</code>.</li>
  <li><strong>Is it simply "what does this team or workload need to do"?</strong> → an <strong>identity-based</strong> policy: customer managed (reusable, versioned) on a group, a role or an Identity Center permission set; AWS managed for job functions; inline only for strict one-to-one.</li>
  <li><strong>Is an ACL involved?</strong> → prefer removing it: set S3 Object Ownership to <em>Bucket owner enforced</em> and move the grant into a bucket policy.</li>
  <li><strong>Finally, test it:</strong> run the IAM Policy Simulator for identity policies, review IAM Access Analyzer findings for anything shared outside your zone of trust, and roll SCPs/RCPs out to a test OU before the root (M05.09).</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: where each policy type lives", html: `
<table>
<thead><tr><th>Policy type</th><th>Where you manage it</th><th>Key API / console path</th><th>Limits and defaults worth knowing</th></tr></thead>
<tbody>
<tr><td>AWS managed policy</td><td>IAM (read-only to you)</td><td><code>iam:AttachRolePolicy</code> with an <code>arn:aws:iam::aws:policy/…</code> ARN</td><td>Can be updated by AWS at any time; job-function policies under <code>…/job-function/…</code></td></tr>
<tr><td>Customer managed policy</td><td>IAM</td><td><code>iam:CreatePolicy</code>, <code>iam:CreatePolicyVersion</code></td><td>6,144 characters (whitespace not counted); 5 versions; 10 attached per identity by default (max 20)</td></tr>
<tr><td>Inline policy</td><td>IAM, on the identity</td><td><code>iam:PutRolePolicy</code> / <code>PutUserPolicy</code> / <code>PutGroupPolicy</code></td><td>Aggregate size: user 2,048 · group 5,120 · role 10,240 characters</td></tr>
<tr><td>Resource-based policy</td><td>The resource's own service</td><td><code>s3:PutBucketPolicy</code>, <code>kms:PutKeyPolicy</code>, <code>sqs:SetQueueAttributes</code>, <code>lambda:AddPermission</code>, <code>iam:UpdateAssumeRolePolicy</code></td><td>Size limits are per service (an S3 bucket policy can be 20 KB)</td></tr>
<tr><td>Permissions boundary</td><td>IAM, on a user or role</td><td><code>iam:PutRolePermissionsBoundary</code>; or <code>--permissions-boundary</code> on create</td><td>Must be a managed policy (AWS or customer managed); one per identity</td></tr>
<tr><td>SCP</td><td>AWS Organizations (management account or delegated admin)</td><td><code>organizations:CreatePolicy</code> type <code>SERVICE_CONTROL_POLICY</code>, <code>AttachPolicy</code></td><td>Requires "all features"; 5,120 characters per SCP; up to 5 SCPs attached per root, OU or account</td></tr>
<tr><td>RCP</td><td>AWS Organizations</td><td>Policy type <code>RESOURCE_CONTROL_POLICY</code></td><td>Requires "all features"; supported services listed in the docs; doesn't affect the management account</td></tr>
<tr><td>Session policy</td><td>Your code / IdP at session start</td><td><code>sts:AssumeRole --policy … --policy-arns …</code></td><td>Up to 10 managed policy ARNs plus one inline JSON policy</td></tr>
<tr><td>S3 ACL</td><td>S3</td><td><code>s3:PutBucketOwnershipControls</code> (to disable)</td><td>Disabled by default on new buckets (Bucket owner enforced)</td></tr>
</tbody></table>
<div class="callout tip"><strong>Identity Center and policy types.</strong> A permission set can contain AWS managed policies, customer managed policy <em>references</em> (the policy must exist with the same name in each target account), an inline policy and a permissions boundary. Identity Center provisions them into an <code>AWSReservedSSO_…</code> role in every assigned account.</div>
<h3>The KMS key policy is special</h3>
<p>For most services, a same-account identity policy is enough because the resource policy is optional. A <strong>KMS key policy is mandatory and authoritative</strong>: if the key policy doesn't allow access, either directly or through the standard statement that delegates to IAM (<code>"Principal": {"AWS": "arn:aws:iam::111122223333:root"}</code> with <code>"kms:*"</code>), no identity policy can grant it. The same is true for an IAM role's trust policy: to assume a role, the trust policy must allow you. Expect both in M05.04 and M07.</p>` },

    { type: "examples", title: "Worked examples: one requirement, one policy type", html: DG_0503_DELEGATE + `
<h3>Example 1: a permissions boundary for delegated role creation</h3>
<p><strong>Requirement:</strong> application developers may create IAM roles for their Lambda functions, but no role they create may touch IAM, Organizations or billing, and they must not be able to remove that restriction.</p>
<p><strong>Step 1, the boundary</strong> (customer managed policy <code>AppBoundary</code>, owned by the platform team):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "WorkloadServices", "Effect": "Allow",
      "Action": ["s3:*", "dynamodb:*", "sqs:*", "sns:*", "logs:*", "xray:*", "kms:Decrypt", "kms:GenerateDataKey"],
      "Resource": "*" },
    { "Sid": "NeverIdentityOrOrg", "Effect": "Deny",
      "Action": ["iam:*", "organizations:*", "account:*", "sts:AssumeRole"],
      "Resource": "*" }
  ]
}</code></pre>
<p><strong>Step 2, the developer's identity policy</strong> (attached to the developers' Identity Center permission set):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "CreateRolesOnlyWithBoundary", "Effect": "Allow",
      "Action": ["iam:CreateRole", "iam:PutRolePermissionsBoundary"],
      "Resource": "arn:aws:iam::111122223333:role/app/*",
      "Condition": { "StringEquals": {
        "iam:PermissionsBoundary": "arn:aws:iam::111122223333:policy/AppBoundary" } } },
    { "Sid": "ManageAppRolePolicies", "Effect": "Allow",
      "Action": ["iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:PutRolePolicy",
                 "iam:DeleteRolePolicy", "iam:DeleteRole", "iam:GetRole", "iam:ListRoles"],
      "Resource": "arn:aws:iam::111122223333:role/app/*" },
    { "Sid": "PassOnlyAppRoles", "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::111122223333:role/app/*" },
    { "Sid": "ProtectTheBoundary", "Effect": "Deny",
      "Action": ["iam:CreatePolicyVersion", "iam:DeletePolicy", "iam:DeletePolicyVersion",
                 "iam:SetDefaultPolicyVersion", "iam:DeleteRolePermissionsBoundary"],
      "Resource": ["arn:aws:iam::111122223333:policy/AppBoundary",
                   "arn:aws:iam::111122223333:role/*"] }
  ]
}</code></pre>
<p><strong>Why it holds:</strong> (1) <code>CreateRole</code> only succeeds if the request sets exactly this boundary; (2) roles live under the <code>/app/</code> path, so developers can't modify platform roles; (3) they can't edit or delete the boundary policy or detach it from a role; (4) <code>iam:PassRole</code> is limited to <code>/app/</code> roles, so they can't hand an existing admin role to a Lambda function they control. Even if a developer attaches <code>AdministratorAccess</code> to an app role, the role's effective permissions are only the overlap with <code>AppBoundary</code>.</p>

<h3>Example 2: SCP guardrails for every workload account</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "DenyLeavingOrg", "Effect": "Deny",
      "Action": "organizations:LeaveOrganization", "Resource": "*" },
    { "Sid": "ProtectSecurityTooling", "Effect": "Deny",
      "Action": ["cloudtrail:StopLogging", "cloudtrail:DeleteTrail",
                 "guardduty:DeleteDetector", "config:StopConfigurationRecorder"],
      "Resource": "*",
      "Condition": { "ArnNotLike": {
        "aws:PrincipalArn": "arn:aws:iam::*:role/SecurityBreakGlass" } } },
    { "Sid": "OnlyApprovedRegions", "Effect": "Deny",
      "NotAction": ["iam:*", "organizations:*", "sts:*", "cloudfront:*", "route53:*",
                    "support:*", "budgets:*", "waf:*", "health:*"],
      "Resource": "*",
      "Condition": { "StringNotEquals": {
        "aws:RequestedRegion": ["eu-west-1", "eu-central-1"] } } }
  ]
}</code></pre>
<p>Three patterns in one SCP: a plain Deny; a Deny with an exemption for a named break-glass role (via <code>aws:PrincipalArn</code>); and a Region restriction that uses <code>NotAction</code> to exempt <strong>global services</strong>, whose API calls are made to us-east-1 regardless of where you work. Attach it to the Workloads OU, not the organization root, until it has been tested.</p>

<h3>Example 3: an RCP data perimeter for S3</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "OnlyOrgPrincipalsOrAwsServices", "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "*",
    "Condition": {
      "StringNotEqualsIfExists": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" },
      "BoolIfExists": { "aws:PrincipalIsAWSService": "false" }
    }
  }]
}</code></pre>
<p>Attached to the organization root, it means that even if someone writes a bucket policy granting <code>"Principal": "*"</code>, principals from outside organisation <code>o-a1b2c3d4e5</code> are denied (AWS services acting on your behalf are exempt). Before RCPs, you had to put a statement like this into every bucket policy and hope nobody removed it.</p>

<h3>Example 4: a session policy for a multi-tenant SaaS</h3>
<pre><code>aws sts assume-role \\
  --role-arn arn:aws:iam::111122223333:role/TenantDataAccess \\
  --role-session-name tenant-42 \\
  --policy '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject","s3:PutObject"],"Resource":"arn:aws:s3:::saas-data/tenant-42/*"}]}'</code></pre>
<p>The role can access all tenants' prefixes. The credentials returned for this session can only touch <code>tenant-42/</code>, because session permissions are the intersection of the role's policy and the session policy. The application assumes the role per request or per tenant, so a bug in one tenant's request path can't read another tenant's data.</p>

<h3>Example 5: the same need, solved with the wrong type</h3>
<table>
<thead><tr><th>Requirement</th><th>Wrong choice</th><th>Why it fails</th><th>Right choice</th></tr></thead>
<tbody>
<tr><td>"No one in any account may disable CloudTrail"</td><td>Deny in each account's admin identity policy</td><td>An admin can edit their own policies; the root user isn't covered</td><td>SCP at the OU or root</td></tr>
<tr><td>"Account B may read our bucket"</td><td>SCP in our organisation allowing account B</td><td>SCPs never grant, and account B isn't governed by our SCPs</td><td>Bucket policy naming B + identity policy in B</td></tr>
<tr><td>"Developers can create roles but not admins"</td><td>SCP denying <code>iam:CreateRole</code></td><td>Blocks the legitimate need too</td><td>Permissions boundary + <code>iam:PermissionsBoundary</code> condition</td></tr>
<tr><td>"Outsiders must never read our data, whatever bucket policies say"</td><td>SCP with <code>aws:PrincipalOrgID</code></td><td>SCPs only govern your own principals, not outsiders</td><td>RCP (or a Deny in every bucket policy)</td></tr>
</tbody></table>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Policy type(s)</th><th>Why</th></tr></thead>
<tbody>
<tr><td>A support team needs read-only console access to all services in production</td><td>AWS managed job-function policy <code>ReadOnlyAccess</code> (or <code>ViewOnlyAccess</code>) in an Identity Center permission set</td><td>Maintained by AWS as services evolve; low risk because it's read-only. <code>ViewOnlyAccess</code> even hides data contents.</td></tr>
<tr><td>An Amazon SNS topic must deliver to an SQS queue</td><td>SQS queue policy allowing <code>sqs:SendMessage</code> from <code>sns.amazonaws.com</code> with <code>aws:SourceArn</code> = the topic ARN</td><td>Resource-based policy for a service principal; the SourceArn condition prevents the confused-deputy problem (M05.06)</td></tr>
<tr><td>A central logging account must receive CloudTrail logs from 60 accounts</td><td>Bucket policy in the log archive account allowing <code>cloudtrail.amazonaws.com</code>, conditioned on the organisation trail's ARN</td><td>Cross-account delivery by an AWS service is exactly what resource-based policies are for</td></tr>
<tr><td>Restrict all accounts to two EU Regions for GDPR</td><td>SCP with <code>aws:RequestedRegion</code> + <code>NotAction</code> for global services</td><td>Applies to everyone in member accounts, including root, and can't be removed locally</td></tr>
<tr><td>A CI pipeline role creates per-environment roles from CloudFormation</td><td>Permissions boundary required on all roles it creates</td><td>The pipeline can't be used to mint an admin role even if its templates are tampered with</td></tr>
<tr><td>A reporting job should temporarily use the admin role but only read one bucket</td><td>Session policy on <code>AssumeRole</code></td><td>Narrows the credential without creating another role</td></tr>
<tr><td>Make sure no S3 bucket in the organisation is readable by external accounts</td><td>RCP data perimeter + S3 Block Public Access at the account level + Access Analyzer</td><td>Defence in depth: the RCP blocks outsiders, BPA blocks public, Access Analyzer reports what's shared</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: see policy types in your own account", html: `
<p>Use your <code>academy-admin</code> profile from Lab L01. Everything below is read-only or free, and the last block cleans up after itself.</p>
<pre><code># 1. AWS managed job-function policies (note the /job-function/ path)
aws iam list-policies --scope AWS --path-prefix /job-function/ \\
  --query "Policies[].PolicyName" --output table --profile academy-admin

# 2. Which managed and inline policies does a role have, and does it have a boundary?
ROLE=$(aws iam list-roles --query "Roles[?starts_with(RoleName,'AWSReservedSSO_AdministratorAccess')].RoleName | [0]" \\
  --output text --profile academy-admin)
aws iam list-attached-role-policies --role-name "$ROLE" --profile academy-admin
aws iam list-role-policies --role-name "$ROLE" --profile academy-admin
aws iam get-role --role-name "$ROLE" --query "Role.{Boundary:PermissionsBoundary,Trust:AssumeRolePolicyDocument}" \\
  --profile academy-admin

# 3. Organizations policy types enabled on your root (Lab L01 created an organization)
aws organizations list-roots --query "Roots[0].PolicyTypes" --profile academy-admin
aws organizations list-policies --filter SERVICE_CONTROL_POLICY \\
  --query "Policies[].{Name:Name,AwsManaged:AwsManaged}" --profile academy-admin

# 4. Try a boundary: create a role with a boundary, then ask the simulator
cat &gt; trust.json &lt;&lt;'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}
EOF
aws iam create-role --role-name demo-bounded --path /app/ \\
  --assume-role-policy-document file://trust.json \\
  --permissions-boundary arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess --profile academy-admin
aws iam attach-role-policy --role-name demo-bounded \\
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess --profile academy-admin
ARN=$(aws iam get-role --role-name demo-bounded --query Role.Arn --output text --profile academy-admin)
aws iam simulate-principal-policy --policy-source-arn "$ARN" \\
  --action-names s3:GetObject s3:PutObject ec2:RunInstances iam:CreateUser \\
  --query "EvaluationResults[].{Action:EvalActionName,Decision:EvalDecision}" --output table --profile academy-admin

# 5. Clean up
aws iam detach-role-policy --role-name demo-bounded --policy-arn arn:aws:iam::aws:policy/AdministratorAccess --profile academy-admin
aws iam delete-role --role-name demo-bounded --profile academy-admin</code></pre>
<p><strong>What to notice in step 4:</strong> the role has <code>AdministratorAccess</code>, yet only <code>s3:GetObject</code> is <code>allowed</code>. <code>s3:PutObject</code>, <code>ec2:RunInstances</code> and <code>iam:CreateUser</code> show <code>implicitDeny</code>, because the boundary (S3 read-only) doesn't allow them. The boundary limited an administrator policy without a single Deny statement.</p>` },

    { type: "casestudy", title: "Case study: Corvid Freight lets 300 developers create roles", html: `
<p><strong>Context.</strong> Corvid Freight, a logistics company, runs 45 AWS accounts in AWS Organizations: a Security OU, an Infrastructure OU, and a Workloads OU split into dev, test and prod. Until last year, only the 6-person platform team could create IAM roles. Developers opened a ticket for every new Lambda function, ECS task or Step Functions state machine; median wait was 3 working days, and teams began "reusing" an over-privileged role across unrelated services to avoid the queue.</p>
<p><strong>Requirements.</strong> (1) Developers self-serve roles for their workloads in dev and test, and via pipelines in prod. (2) No created role may manage IAM, Organizations, billing or security tooling. (3) Nothing anyone does in a workload account may disable CloudTrail, GuardDuty or Config, or leave the organisation. (4) Data in production buckets must never be readable outside the organisation. (5) Auditors need read-only access everywhere.</p>
<table>
<thead><tr><th>Requirement</th><th>Policy type chosen</th><th>Implementation</th></tr></thead>
<tbody>
<tr><td>1 + 2</td><td>Permissions boundary + identity policy with <code>iam:PermissionsBoundary</code> condition</td><td><code>WorkloadBoundary</code> deployed to every account with CloudFormation StackSets; the developer permission set may only create <code>/app/</code> roles carrying it</td></tr>
<tr><td>3</td><td>SCP on the Workloads OU</td><td>Deny-list SCP: leave org, stop/delete trails, detectors and recorders, with a break-glass role exemption</td></tr>
<tr><td>4</td><td>RCP on the prod OU</td><td>Deny S3 and KMS access unless <code>aws:PrincipalOrgID</code> matches or an AWS service is acting</td></tr>
<tr><td>5</td><td>AWS managed job-function policy</td><td><code>SecurityAudit</code> + <code>ViewOnlyAccess</code> permission set for the audit group</td></tr>
</tbody></table>
<p><strong>What went wrong first.</strong> The first boundary allowed <code>iam:PassRole</code> on <code>*</code>. A developer test showed that a bounded role could pass the platform team's deployment role to a new Lambda function and run code as that role, escaping the boundary entirely. The fix was to restrict <code>iam:PassRole</code> to <code>/app/*</code> roles in both the boundary and the developer policy. The second surprise: the Region-restriction SCP broke the Billing console and Route 53, because global services are served from us-east-1. Adding a <code>NotAction</code> exemption list fixed it; the team now pilots every SCP in a "policy-staging" OU for a week.</p>
<p><strong>Outcome.</strong> Role creation time fell from 3 days to minutes, the shared over-privileged role was retired, and IAM Access Analyzer's external-access findings for production buckets dropped to zero once the RCP was in place. The platform team now spends its time on the boundary and guardrails rather than on tickets.</p>
<p><strong>Lessons.</strong> Grant with identity and resource policies; limit with boundaries, SCPs and RCPs. Always pair a boundary with <code>iam:PassRole</code> restrictions and protection of the boundary policy itself. Test guardrails on a non-production OU first.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"all accounts in the organization", "even administrators", "even the root user of member accounts", "prevent any account from…"</td><td><strong>SCP</strong> (on an OU or the root)</td></tr>
<tr><td>"only principals from our organization may access our resources", "data perimeter", "external accounts"</td><td><strong>RCP</strong>, or <code>aws:PrincipalOrgID</code> in resource policies</td></tr>
<tr><td>"grant another AWS account access to the bucket/queue/topic/key"</td><td><strong>Resource-based policy</strong> (+ identity policy in the other account), or a cross-account role</td></tr>
<tr><td>"allow S3/SNS/EventBridge/API Gateway to invoke or write to…"</td><td>Resource-based policy with a <strong>service principal</strong> (and <code>aws:SourceArn</code>)</td></tr>
<tr><td>"developers can create roles but must not exceed…", "delegate permission management"</td><td><strong>Permissions boundary</strong></td></tr>
<tr><td>"temporarily restrict the credentials from AssumeRole"</td><td><strong>Session policy</strong></td></tr>
<tr><td>"least operational overhead to give a job function access"</td><td><strong>AWS managed</strong> (job-function) policy</td></tr>
<tr><td>"reusable, versioned, least-privilege policy for our resources"</td><td><strong>Customer managed</strong> policy</td></tr>
</tbody></table>
<h3>Distractors to recognise</h3>
<ul>
  <li><strong>"Use an SCP to grant…"</strong>: SCPs never grant. Any answer relying on an SCP to give access is wrong.</li>
  <li><strong>"Attach an SCP to the management account"</strong> to restrict it: SCPs don't affect the management account.</li>
  <li><strong>"Use an IAM group as the Principal"</strong> in a bucket policy: groups are not principals.</li>
  <li><strong>"Network ACL"</strong> in an IAM question: NACLs filter packets, not API permissions.</li>
  <li><strong>"Use S3 ACLs"</strong> for new designs: prefer bucket policies with ACLs disabled.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Layer guardrails, don't stack them in one place.</strong> SCPs for "never" rules about your principals, RCPs for the data perimeter, boundaries for delegation, identity policies for day-to-day least privilege. Each layer is owned by a different team and changes at a different speed.</li>
  <li><strong>SCP size and count are real limits.</strong> 5,120 characters and 5 policies per node fill up fast. Use wildcards in action names carefully, group statements, and put guardrails at the OU level where they belong.</li>
  <li><strong>Every Deny-list SCP needs an escape hatch.</strong> Exempt a tightly controlled break-glass role via <code>aws:PrincipalArn</code>, monitored by an EventBridge rule that pages the security team when it's used.</li>
  <li><strong><code>iam:PassRole</code> is the classic escalation path.</strong> A user who can pass an admin role to EC2, Lambda or CloudFormation effectively <em>is</em> an admin. Scope it by role path or ARN and with the <code>iam:PassedToService</code> condition.</li>
  <li><strong>AWS managed policies change.</strong> When a service adds an action, broad AWS managed policies may gain it automatically. That's convenient for read-only job functions but risky for write access in regulated workloads.</li>
  <li><strong>Treat policies as code.</strong> Store SCPs, RCPs, boundaries and permission sets in Git, validate them in CI with IAM Access Analyzer policy validation and custom policy checks, and deploy them with CloudFormation StackSets, Terraform or the Landing Zone Accelerator (M06, M36).</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Six JSON policy types: identity-based, resource-based, permissions boundary, SCP, RCP, session policy (plus legacy ACLs).</li>
  <li>Only identity-based and resource-based policies (and ACLs) <strong>grant</strong>. Boundaries, SCPs, RCPs and session policies only <strong>limit</strong>.</li>
  <li>Identity policies: AWS managed (job functions, convenience), customer managed (default for least privilege), inline (strict one-to-one).</li>
  <li>Resource-based policies name a <code>Principal</code> and enable cross-account and service-to-resource access. KMS key policies and role trust policies are mandatory gatekeepers.</li>
  <li>Permissions boundaries make delegation safe; enforce them with <code>iam:PermissionsBoundary</code> and restrict <code>iam:PassRole</code>.</li>
  <li>SCPs limit every principal in member accounts, including root, but not the management account or service-linked roles.</li>
  <li>RCPs limit access to your resources even by outsiders: the basis of an organisation-wide data perimeter.</li>
  <li>Session policies narrow a role's credentials for one session.</li>
  <li>Disable S3 ACLs with Object Ownership "Bucket owner enforced"; NACLs aren't IAM policies at all.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.03-d1", q: "Which policy type would you use so that NO principal in any member account, including its root user, can call <code>organizations:LeaveOrganization</code>? (abbreviation)", answers: ["SCP", "service control policy", "scps"], hint: "An Organizations policy that limits principals.", explain: "A service control policy (SCP) attached to the root or an OU applies to every principal in the member accounts, including the root user." },
    { id: "M05.03-d2", q: "Which condition key must the developer's <code>iam:CreateRole</code> permission require so that every new role gets a specific boundary? (format service:Key)", answers: ["iam:PermissionsBoundary"], hint: "It's an IAM-service condition key named after the feature.", explain: "<code>\"Condition\": {\"StringEquals\": {\"iam:PermissionsBoundary\": \"arn:…:policy/AppBoundary\"}}</code> makes CreateRole fail unless that boundary is set." },
    { id: "M05.03-d3", q: "What is the maximum size, in characters, of a customer managed IAM policy?", answers: ["6144", "6,144"], hint: "A little over 6,000.", explain: "Managed policies are limited to 6,144 characters (whitespace isn't counted)." },
    { id: "M05.03-d4", q: "By default, how many managed policies can be attached to one IAM role?", answers: ["10", "ten"], hint: "It can be raised to 20 with a quota increase.", explain: "10 by default; you can request up to 20." },
    { id: "M05.03-d5", q: "Can an SCP grant permissions? (yes/no)", answers: ["no", "n"], hint: "Think filter, not grant.", explain: "SCPs only set the maximum available permissions. Principals still need identity or resource policies that allow the action." },
    { id: "M05.03-d6", q: "Which Organizations policy type limits what principals OUTSIDE your organisation can do to resources inside it? (abbreviation)", answers: ["RCP", "resource control policy", "rcps"], hint: "The resource-side twin of SCPs.", explain: "Resource control policies (RCPs) apply to requests to your resources regardless of who makes them, so they can enforce a data perimeter." },
    { id: "M05.03-d7", q: "Which S3 Object Ownership setting disables ACLs on a bucket? (three words)", answers: ["bucket owner enforced", "bucketownerenforced", "BucketOwnerEnforced"], hint: "It's the default for new buckets.", explain: "With <em>Bucket owner enforced</em>, ACLs are disabled and the bucket owner owns every object; only policies control access." },
    { id: "M05.03-d8", q: "A role has AdministratorAccess attached and a permissions boundary of AmazonS3ReadOnlyAccess. Is <code>ec2:RunInstances</code> allowed or denied?", answers: ["denied", "deny", "implicitdeny", "implicit deny"], hint: "Effective permissions are the intersection.", explain: "The boundary doesn't allow ec2:RunInstances, so it's an implicit deny even though the identity policy allows it." }
  ],
  check: [
    { id: "M05.03-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company uses AWS Organizations with 30 member accounts. Security requires that no user or role in any member account, including administrators and the root user, can disable AWS CloudTrail. What should a solutions architect do?",
      options: [
        { t: "Create an SCP that denies cloudtrail:StopLogging and cloudtrail:DeleteTrail and attach it to the organization root or the relevant OUs", c: true, why: "SCPs set the maximum permissions for every principal in member accounts, including the root user, and local admins can't remove them." },
        { t: "Attach an IAM policy with an explicit Deny to every administrator group in each account", c: false, why: "Account administrators can edit or detach their own policies, and the root user isn't covered." },
        { t: "Use a permissions boundary on every IAM role in every account", c: false, why: "Boundaries are per identity, admins could change them, and they don't apply to the root user." },
        { t: "Add a bucket policy to the CloudTrail bucket that denies deletes", c: false, why: "Protects the log objects, not the trail configuration (StopLogging)." }
      ] },
    { id: "M05.03-k2", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Developers must be able to create IAM roles for their Lambda functions. The roles must never have permissions beyond a set approved by the security team. Which approach meets this with the LEAST ongoing effort?",
      options: [
        { t: "Allow iam:CreateRole only when the iam:PermissionsBoundary condition equals the security team's boundary policy, and deny changes to that boundary", c: true, why: "This is the delegated-administrator pattern: every created role is capped by the boundary automatically." },
        { t: "Require the security team to review every role in a weekly meeting", c: false, why: "Manual, slow and error-prone; it doesn't prevent escalation between reviews." },
        { t: "Attach an SCP that denies iam:CreateRole", c: false, why: "That blocks the legitimate requirement." },
        { t: "Give developers the AWS managed IAMFullAccess policy and monitor CloudTrail", c: false, why: "Detection after the fact; developers could create admin roles." }
      ] },
    { id: "M05.03-k3", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "Which TWO policy types can GRANT permissions to a principal?",
      options: [
        { t: "Identity-based policies", c: true, why: "They grant permissions to the user, group or role they're attached to." },
        { t: "Resource-based policies", c: true, why: "They grant permissions to the principals they name, including other accounts." },
        { t: "Service control policies", c: false, why: "SCPs only limit the maximum permissions." },
        { t: "Permissions boundaries", c: false, why: "Boundaries only cap permissions." },
        { t: "Session policies", c: false, why: "Session policies only narrow a session's permissions." }
      ] },
    { id: "M05.03-k4", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "An Amazon SNS topic in the same account must deliver messages to an Amazon SQS queue. What must be configured on the queue?",
      options: [
        { t: "A queue policy allowing the sns.amazonaws.com service principal to call sqs:SendMessage, with an aws:SourceArn condition for the topic", c: true, why: "Services acting on resources are authorised by resource-based policies; SourceArn ensures only your topic can use the permission." },
        { t: "An IAM role for SNS with sqs:SendMessage attached to the queue", c: false, why: "Queues don't have roles attached; SNS delivery to SQS is authorised by the queue policy." },
        { t: "An SCP that allows SNS to write to SQS", c: false, why: "SCPs can't grant." },
        { t: "A NACL rule allowing traffic from SNS", c: false, why: "SNS-to-SQS delivery is an API call authorised by IAM, not network traffic in your VPC." }
      ] },
    { id: "M05.03-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company wants to guarantee that principals from outside its AWS organization can never read objects in any of its S3 buckets, even if a team writes a bucket policy that allows public or cross-organization access. Which control fits BEST?",
      options: [
        { t: "A resource control policy (RCP) that denies S3 access unless aws:PrincipalOrgID matches the organization (exempting AWS service principals)", c: true, why: "RCPs limit access to resources in member accounts regardless of who calls, so a careless bucket policy can't open data to outsiders." },
        { t: "An SCP that denies s3:GetObject unless aws:PrincipalOrgID matches", c: false, why: "SCPs only govern principals inside your organization; outsiders aren't affected." },
        { t: "A permissions boundary on every IAM role", c: false, why: "Boundaries limit your own roles, not external principals." },
        { t: "Enable S3 Versioning on all buckets", c: false, why: "Versioning protects against overwrites and deletes, not unauthorised reads." }
      ] },
    { id: "M05.03-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "An SCP denying ec2:RunInstances outside eu-west-1 is attached to the organization root. A user in the MANAGEMENT account launches an instance in us-east-1. What happens?",
      options: [
        { t: "The launch succeeds, because SCPs don't affect the management account", c: true, why: "SCPs never restrict the management account. That's why workloads shouldn't run there." },
        { t: "The launch fails, because SCPs at the root apply to every account", c: false, why: "The management account is the exception." },
        { t: "The launch fails only for the management account's root user", c: false, why: "No principal in the management account is affected by SCPs." },
        { t: "The launch succeeds only if the user has a permissions boundary", c: false, why: "Boundaries are unrelated to SCP applicability." }
      ] }
  ],
  cards: ["fc-M05-3-01", "fc-M05-3-02", "fc-M05-3-03", "fc-M05-3-04", "fc-M05-3-05", "fc-M05-3-06", "fc-M05-3-07", "fc-M05-3-08", "fc-M05-3-09", "fc-M05-3-10", "fc-M05-3-11"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"AWS Identity and Access Management\" (PDF p603–608)",
    "IAM User Guide: <em>Policies and permissions</em>, <em>Managed policies and inline policies</em>, <em>Permissions boundaries for IAM entities</em>, <em>IAM and AWS STS quotas</em>",
    "AWS Organizations User Guide: <em>Service control policies</em>, <em>Resource control policies</em>, <em>Declarative policies</em>",
    "Amazon S3 User Guide: <em>Controlling ownership of objects and disabling ACLs</em>",
    "AWS whitepaper: <em>Building a data perimeter on AWS</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-3-01", front: "Which IAM policy types can grant permissions?", back: "Identity-based and resource-based policies (plus legacy ACLs). Boundaries, SCPs, RCPs and session policies only limit." },
  { id: "fc-M05-3-02", front: "AWS managed vs customer managed vs inline policy?", back: "AWS managed: written/updated by AWS (job functions). Customer managed: yours, reusable, 5 versions, 6,144 chars. Inline: embedded in one identity, deleted with it." },
  { id: "fc-M05-3-03", front: "What must a resource-based policy contain that an identity policy doesn't?", back: "A <code>Principal</code> element (account, user, role, session, federated user or service)." },
  { id: "fc-M05-3-04", front: "Name 6 resources with resource-based policies.", back: "S3 buckets, KMS keys, SQS queues, SNS topics, Lambda functions, IAM role trust policies (also ECR, Secrets Manager, API Gateway, EventBridge buses, Backup vaults)." },
  { id: "fc-M05-3-05", front: "What is a permissions boundary for?", back: "A managed policy setting the MAXIMUM permissions of a user or role. Classic use: let developers create roles that can never exceed the boundary." },
  { id: "fc-M05-3-06", front: "What don't SCPs affect?", back: "The management account and service-linked roles. They DO affect the root user of member accounts." },
  { id: "fc-M05-3-07", front: "SCP vs RCP?", back: "SCP: limits what YOUR principals can do. RCP: limits what ANY principal (even outsiders) can do to YOUR resources (data perimeter)." },
  { id: "fc-M05-3-08", front: "What is a session policy?", back: "A policy passed when a session starts (AssumeRole, federation). Session permissions = role permissions ∩ session policy." },
  { id: "fc-M05-3-09", front: "Deny-list vs allow-list SCP strategy?", back: "Deny-list: keep FullAWSAccess and add targeted Denies (common). Allow-list: replace FullAWSAccess with explicit Allows for approved services only." },
  { id: "fc-M05-3-10", front: "How do you disable S3 ACLs?", back: "Set Object Ownership to <em>Bucket owner enforced</em> (the default for new buckets)." },
  { id: "fc-M05-3-11", front: "Why restrict iam:PassRole?", back: "Passing an admin role to EC2, Lambda or CloudFormation lets the passer run code with that role: a privilege escalation path. Scope it by ARN/path and iam:PassedToService." }
);
// ================================================================== 04_evaluation.js
/* ---------------------------------------------------------------- M05.04 Policy evaluation logic */
var DG_0504_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 520" role="img" aria-labelledby="m0504at m0504ad">
  <title id="m0504at">IAM policy evaluation flow for a request within one account</title>
  <desc id="m0504ad">A request starts as implicitly denied. Any explicit deny ends in deny. Then resource control policies and service control policies must allow. If a resource-based policy allows and names the user or role session, the request is allowed. Otherwise an identity-based policy must allow, and any permissions boundary and session policy must also allow, for the request to be allowed.</desc>
  <defs><marker id="m0504a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-box" x="20" y="16" width="300" height="40" rx="8"/><text class="dg-tb" x="32" y="41">Request (starts as implicit deny)</text>
  <rect class="dg-info" x="20" y="72" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="97">Explicit Deny in any applicable policy?</text>
  <rect class="dg-info" x="20" y="128" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="153">RCPs (if any) allow it?</text>
  <rect class="dg-info" x="20" y="184" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="209">SCPs (if any) allow it?</text>
  <rect class="dg-info" x="20" y="240" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="265">Resource-based policy allows it?</text>
  <rect class="dg-info" x="20" y="296" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="321">Identity-based policy allows it?</text>
  <rect class="dg-info" x="20" y="352" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="377">Permissions boundary (if set) allows?</text>
  <rect class="dg-info" x="20" y="408" width="300" height="40" rx="8"/><text class="dg-t" x="32" y="433">Session policy (if passed) allows?</text>
  <rect class="dg-good" x="20" y="464" width="300" height="40" rx="8"/><text class="dg-tb" x="32" y="489">ALLOW</text>

  <path class="dg-line" d="M170 56 V70" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 112 V126" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 168 V182" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 224 V238" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 280 V294" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 336 V350" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 392 V406" marker-end="url(#m0504a-ar)"/>
  <path class="dg-line" d="M170 448 V462" marker-end="url(#m0504a-ar)"/>
  <text class="dg-ts" x="178" y="124">no</text><text class="dg-ts" x="178" y="180">yes</text><text class="dg-ts" x="178" y="236">yes</text>
  <text class="dg-ts" x="178" y="292">no</text><text class="dg-ts" x="178" y="348">yes</text><text class="dg-ts" x="178" y="404">yes</text><text class="dg-ts" x="178" y="460">yes</text>

  <path class="dg-line" d="M320 92 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="86">yes</text>
  <rect class="dg-bad" x="420" y="72" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="97">DENY: an explicit Deny always wins</text>
  <path class="dg-line" d="M320 148 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="142">no</text>
  <rect class="dg-bad" x="420" y="128" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="153">DENY: outside the resource perimeter</text>
  <path class="dg-line" d="M320 204 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="198">no</text>
  <rect class="dg-bad" x="420" y="184" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="209">DENY: blocked by the organisation</text>
  <path class="dg-line" d="M320 260 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="254">yes</text>
  <rect class="dg-good" x="420" y="240" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="257">ALLOW (same account, when it names</text><text class="dg-ts" x="432" y="273">the user or role session; see the nuance below)</text>
  <path class="dg-line" d="M320 316 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="310">no</text>
  <rect class="dg-bad" x="420" y="296" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="321">DENY: implicit (nothing allows it)</text>
  <path class="dg-line" d="M320 372 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="366">no</text>
  <rect class="dg-bad" x="420" y="352" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="377">DENY: outside the boundary</text>
  <path class="dg-line" d="M320 428 H418" marker-end="url(#m0504a-ar)"/><text class="dg-ts" x="336" y="422">no</text>
  <rect class="dg-bad" x="420" y="408" width="320" height="40" rx="8"/><text class="dg-t" x="432" y="433">DENY: outside the session policy</text>
  <text class="dg-ts" x="420" y="480">Cross-account: the resource side AND the</text>
  <text class="dg-ts" x="420" y="496">caller's identity side must both allow (Fig. 4b).</text>
</svg>
<figcaption>Figure M05-4a. The evaluation order AWS documents for a request inside one account. Every request starts denied; an explicit Deny anywhere ends it; every limiting layer that applies must allow; and at least one granting policy must allow.</figcaption>
</figure>`;

var DG_0504_CROSS = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0504bt m0504bd">
  <title id="m0504bt">Cross-account access needs both sides to allow</title>
  <desc id="m0504bd">A role in account B calls s3:GetObject on a bucket in account A. Account B's identity policy must allow the call on that bucket, and account A's bucket policy must allow account B's role. If the objects are encrypted with a KMS key, the key policy in account A must also allow account B.</desc>
  <defs><marker id="m0504b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="12" y="14" width="300" height="200" rx="12"/>
  <text class="dg-ta" x="26" y="36">Account B 444455556666 (caller)</text>
  <rect class="dg-box" x="30" y="52" width="264" height="56" rx="8"/>
  <text class="dg-tb" x="42" y="74">Role: Analytics</text>
  <text class="dg-ts" x="42" y="94">SCPs of B's organisation must allow too</text>
  <rect class="dg-good" x="30" y="124" width="264" height="74" rx="8"/>
  <text class="dg-tb" x="42" y="146">① Identity policy (in B)</text>
  <text class="dg-ts" x="42" y="164">Allow s3:GetObject on</text>
  <text class="dg-ts" x="42" y="180">arn:aws:s3:::acme-data/*</text>

  <rect class="dg-region" x="448" y="14" width="300" height="200" rx="12"/>
  <text class="dg-ta" x="462" y="36">Account A 111122223333 (owner)</text>
  <rect class="dg-good" x="466" y="52" width="264" height="74" rx="8"/>
  <text class="dg-tb" x="478" y="74">② Bucket policy (in A)</text>
  <text class="dg-ts" x="478" y="92">Allow Principal role/Analytics</text>
  <text class="dg-ts" x="478" y="108">s3:GetObject on acme-data/*</text>
  <rect class="dg-edge" x="466" y="138" width="264" height="60" rx="8"/>
  <text class="dg-tb" x="478" y="160">③ KMS key policy (in A)</text>
  <text class="dg-ts" x="478" y="178">if SSE-KMS: allow B kms:Decrypt</text>

  <path class="dg-line" d="M294 80 H464" marker-end="url(#m0504b-ar)"/>
  <text class="dg-ts" x="330" y="72">s3:GetObject</text>
  <text class="dg-tb" x="20" y="238">① AND ② (AND ③ for encrypted objects) must allow. Missing any one → AccessDenied.</text>
</svg>
<figcaption>Figure M05-4b. Across accounts, each account controls its own side: the caller's account decides what its principal may attempt, and the resource owner decides who may touch the resource.</figcaption>
</figure>`;

var DG_0504_VENN = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0504ct m0504cd">
  <title id="m0504ct">Effective permissions as an intersection</title>
  <desc id="m0504cd">Three overlapping circles: identity-based policy, permissions boundary and SCP. Only the area where all three overlap is effective permission. A session policy, if present, narrows it further.</desc>
  <circle class="dg-good" cx="200" cy="105" r="78" fill-opacity="0.45"/>
  <circle class="dg-info" cx="290" cy="105" r="78" fill-opacity="0.45"/>
  <circle class="dg-edge" cx="245" cy="170" r="70" fill-opacity="0.45"/>
  <text class="dg-tb" x="114" y="80" text-anchor="end">Identity</text>
  <text class="dg-ts" x="114" y="96" text-anchor="end">policy</text>
  <text class="dg-tb" x="290" y="20" text-anchor="middle">Boundary</text>
  <text class="dg-tb" x="226" y="222">SCP</text>
  <text class="dg-tb" x="238" y="136">✓</text>
  <text class="dg-tb" x="420" y="60">Effective permissions</text>
  <text class="dg-ts" x="420" y="82">= identity ∩ boundary ∩ SCP (∩ RCP for the resource)</text>
  <text class="dg-ts" x="420" y="100">  ∩ session policy, if one was passed</text>
  <text class="dg-ts" x="420" y="124">Only the centre (✓) works. An action that one</text>
  <text class="dg-ts" x="420" y="140">layer allows but another doesn't is implicitly</text>
  <text class="dg-ts" x="420" y="156">denied; no Deny statement is needed.</text>
  <text class="dg-ts" x="420" y="180">Same-account resource-policy grants can add</text>
  <text class="dg-ts" x="420" y="196">to the identity grant, but never escape an</text>
  <text class="dg-ts" x="420" y="212">explicit Deny, SCP or RCP.</text>
</svg>
<figcaption>Figure M05-4c. Granting policies are combined with a union; limiting policies with an intersection. Most "why is this denied?" puzzles are a missing overlap.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.04", title: "Policy evaluation logic", level: 300, minutes: 60,
  objectives: [
    "Apply AWS's documented evaluation order to predict whether any request is allowed or denied",
    "Explain how identity-based and resource-based grants combine within one account, including the role ARN vs role session nuance and the KMS and trust-policy exceptions",
    "Evaluate cross-account requests, where both the caller's account and the resource owner must allow",
    "Predict the effect of condition keys that are missing from the request, IfExists operators and set operators",
    "Troubleshoot AccessDenied errors systematically with error messages, CloudTrail, the Policy Simulator and IAM Access Analyzer"
  ],
  sections: [
    { type: "why", html: `
<p>"AccessDenied" is the error architects and developers see most on AWS, and the most expensive one to guess at. A data engineer in account B can read a bucket's object list but gets AccessDenied on every <code>GetObject</code>. An admin with <code>AdministratorAccess</code> can't launch an instance in Ohio. A Lambda function works in dev and fails in prod with the same code and the same role policy. Each has a precise cause, and each cause is a step in one algorithm.</p>
<p>The exam asks the same thing from the other direction: given these policies, will the request succeed? Which single change makes it succeed? Once you can run the algorithm in your head, these questions become mechanical. M03.03 gave you the one-line version ("explicit deny wins, otherwise an allow is needed"). This lesson gives you the full version: where SCPs, RCPs, boundaries, session policies and resource policies fit, how cross-account differs, and the condition-key traps that catch experienced engineers.</p>` },

    { type: "concept", title: "Concept: the evaluation algorithm", html: DG_0504_FLOW + `
<p>When a principal makes a request, AWS builds a <strong>request context</strong>: the action (<code>s3:GetObject</code>), the resource ARN, the principal (user, role session, federated user), and environment data (source IP, VPC endpoint, time, MFA status, tags, whether TLS was used…). It then collects every policy that applies: the principal's identity policies, its permissions boundary, the session policy, the SCPs on the principal's account path, the RCPs on the resource's account path, and the resource's own policy. Then it evaluates in this order:</p>
<ol>
  <li><strong>Default: implicit deny.</strong> Nothing is allowed unless something allows it.</li>
  <li><strong>Explicit deny check.</strong> If <em>any</em> applicable policy of <em>any</em> type contains a matching <code>Deny</code> (Action, Resource and Condition all match), the decision is <strong>Deny</strong>. Nothing can override it.</li>
  <li><strong>Resource control policies.</strong> If the resource's account is governed by RCPs, they must allow the request (the default <code>RCPFullAWSAccess</code> allows everything).</li>
  <li><strong>Service control policies.</strong> If the principal's account is a member of an organization, every SCP from the root down to the account must allow the action.</li>
  <li><strong>Resource-based policy.</strong> If the resource has a policy that allows this principal, then within the same account the request can be allowed here, even if the identity has no policy for it (with the nuance below).</li>
  <li><strong>Identity-based policies.</strong> Otherwise, at least one identity policy (managed or inline, on the user, the user's groups, or the role) must allow it. If none does: implicit deny.</li>
  <li><strong>Permissions boundary.</strong> If the user or role has a boundary, it must also allow the action.</li>
  <li><strong>Session policy.</strong> If the session was created with a session policy, it must also allow the action.</li>
  <li><strong>Allow.</strong></li>
</ol>
<div class="callout"><strong>Two combining rules.</strong> Granting policies (identity + resource) combine as a <em>union</em>: an allow in either can be enough within one account. Limiting policies (SCP, RCP, boundary, session) combine as an <em>intersection</em>: every one that applies must allow. Deny beats everything.</div>

<h3>Same account: identity OR resource policy</h3>
<p>When the principal and the resource are in the <strong>same account</strong>, an allow in either the identity policy or the resource-based policy is sufficient. A bucket policy that names <code>arn:aws:iam::111122223333:user/maria</code> lets Maria read the bucket even if she has no S3 identity policy at all.</p>
<p><strong>The nuance: who the resource policy names.</strong> If the resource policy names the <strong>IAM user</strong> or a specific <strong>role session</strong> ARN (<code>arn:aws:sts::111122223333:assumed-role/App/session-1</code>), its allow stands even if a permissions boundary or session policy doesn't include the action (an implicit deny in those layers doesn't block it). If the resource policy names the <strong>role</strong> ARN (<code>arn:aws:iam::111122223333:role/App</code>) or the account, the session's boundary and session policy still apply and can implicitly deny it. Explicit Deny statements, SCPs and RCPs apply in every case.</p>

<h3>Two resources that don't follow the union rule</h3>
<ul>
  <li><strong>AWS KMS keys.</strong> The key policy is the primary authority. An identity policy can only grant access to a key if the key policy delegates to IAM, using the standard statement that allows <code>"Principal": {"AWS": "arn:aws:iam::111122223333:root"}</code> to perform <code>kms:*</code>. Without it, even an administrator with <code>kms:*</code> on <code>*</code> is denied.</li>
  <li><strong>IAM role trust policies.</strong> To assume a role, the role's trust policy must allow your principal (or your account). In the same account, it's enough for the trust policy to name your user or role specifically; if it names only the account (<code>…:root</code>), your identity policy must also allow <code>sts:AssumeRole</code>. Cross-account, both are always needed.</li>
</ul>

<h3>Cross-account: both sides must allow</h3>
` + DG_0504_CROSS + `
<p>When the principal is in account B and the resource is in account A, <strong>each account controls its own side</strong>. Account B's policies (identity, boundary, session, B's SCPs) must allow the principal to attempt the action, and account A's resource policy (and A's RCPs) must allow that principal to perform it on the resource. Either side missing means AccessDenied. That's why "the bucket policy allows them" is never the whole answer.</p>
<p>The alternative is <strong>role assumption</strong> (M05.05–M05.06): the caller assumes a role <em>in account A</em>, so the subsequent call is a same-account request evaluated against A's policies only. The trust policy and the caller's <code>sts:AssumeRole</code> permission are the cross-account handshake instead.</p>
` + DG_0504_VENN },

    { type: "concept", title: "Concept: conditions, missing keys and set operators", html: `
<p>Most surprising results come from <code>Condition</code> blocks. A statement applies only when its Action, Resource and <em>every</em> condition match. Three rules decide edge cases:</p>
<ol>
  <li><strong>Missing key, normal operator → condition is false.</strong> If the request context doesn't contain the key (for example <code>aws:MultiFactorAuthPresent</code> is absent when you sign requests with long-term access keys), a <code>Bool</code>, <code>StringEquals</code> or <code>IpAddress</code> condition doesn't match. For an <code>Allow</code>, that means no grant; for a <code>Deny</code>, that means <strong>the Deny doesn't apply</strong>.</li>
  <li><strong>Missing key, negated operator → condition is true.</strong> <code>StringNotEquals</code>, <code>NotIpAddress</code>, <code>ArnNotLike</code> and friends match when the key is absent. For example, requests that arrive through a VPC endpoint don't carry <code>aws:SourceIp</code>, so a <code>Deny … NotIpAddress</code> statement matches them.</li>
  <li><strong><code>…IfExists</code> makes absence count as a match.</strong> <code>BoolIfExists</code>, <code>StringEqualsIfExists</code> and so on evaluate to true when the key is missing, and compare normally when it's present.</li>
</ol>
<h3>The MFA trap</h3>
<pre><code>{ "Effect": "Deny", "Action": "*", "Resource": "*",
  "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "false" } } }</code></pre>
<p>This looks like "deny without MFA", but a CLI call signed with an IAM user's long-term access key has <em>no</em> <code>aws:MultiFactorAuthPresent</code> key at all. The condition is false, the Deny doesn't apply, and the call succeeds without MFA. The correct form is <code>"BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }</code>, which also matches when the key is absent.</p>
<h3>Set operators on multi-valued keys</h3>
<p>Keys such as <code>aws:TagKeys</code> carry a <em>set</em> of values. Use the qualifiers:</p>
<ul>
  <li><code>ForAnyValue:StringEquals</code>: true if at least one value in the request matches the list.</li>
  <li><code>ForAllValues:StringEquals</code>: true if every value in the request is in the list, <strong>and also true when the request has no values at all</strong> (an empty set trivially satisfies "all").</li>
</ul>
<p>So an Allow with <code>"ForAllValues:StringEquals": {"aws:TagKeys": ["env","team"]}</code> also allows requests that send <em>no</em> tags. Add <code>"Null": {"aws:TagKeys": "false"}</code> to require that tags are present.</p>
<h3><code>NotPrincipal</code>, <code>NotAction</code>, <code>NotResource</code></h3>
<ul>
  <li><code>NotAction</code> with Allow grants everything except the listed actions (risky); with Deny, it denies everything except the listed actions (the Region-restriction SCP pattern in M05.03).</li>
  <li><code>NotPrincipal</code> with Deny denies everyone except the listed principals. For roles you'd have to list the role <em>and</em> each assumed-role session ARN, which is fragile. AWS recommends <code>"Principal": "*"</code> with an <code>ArnNotEquals</code>/<code>ArnNotLike</code> condition on <code>aws:PrincipalArn</code> instead; <code>aws:PrincipalArn</code> is the role ARN even for sessions.</li>
</ul>` },

    { type: "workflow", title: "Workflow: troubleshooting AccessDenied", html: `
<ol class="flow">
  <li><strong>Read the full error message.</strong> Most services now say which policy type caused the denial and whether it was explicit or implicit, for example: <code>…is not authorized to perform: s3:GetObject on resource: … because no identity-based policy allows the s3:GetObject action</code>, or <code>… with an explicit deny in a service control policy</code>. That one sentence usually points straight at the layer to fix.</li>
  <li><strong>Confirm who you really are.</strong> <code>aws sts get-caller-identity</code>. Half of all "policy" problems are the wrong profile, role or account (M03.02's credential chain).</li>
  <li><strong>Find the event in CloudTrail.</strong> Look up the <code>errorCode</code> (<code>AccessDenied</code>, <code>UnauthorizedOperation</code>, <code>Client.UnauthorizedOperation</code>), the exact action, the resource ARN, <code>userIdentity.arn</code>, <code>sourceIPAddress</code> and <code>vpcEndpointId</code>. The context values explain condition failures. For EC2, decode the encoded message with <code>aws sts decode-authorization-message</code>.</li>
  <li><strong>Walk the algorithm.</strong> Explicit Deny anywhere (identity, resource, SCP, RCP, boundary, session, VPC endpoint policy)? Do SCPs/RCPs allow? Is there a grant (identity or resource)? Do the boundary and session policy allow? Cross-account: do <em>both</em> sides allow? Encrypted: does the KMS key policy allow?</li>
  <li><strong>Simulate.</strong> The IAM Policy Simulator (<code>aws iam simulate-principal-policy</code>) evaluates a principal's identity policies with its boundary and the SCPs that apply, and lets you supply context keys such as <code>aws:SourceIp</code> or <code>aws:MultiFactorAuthPresent</code>. It's the fastest way to test a condition.</li>
  <li><strong>Check what's shared and what's unused.</strong> IAM Access Analyzer shows resources shared outside the account or organisation and validates policies for errors; last-accessed data shows whether a permission was ever used (M05.09).</li>
  <li><strong>Fix the smallest layer that's wrong</strong>, never by attaching <code>AdministratorAccess</code> "to test". Re-run the call, then record the fix (and why) in the policy's version history or the repo.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: evaluation details by context", html: `
<table>
<thead><tr><th>Situation</th><th>What must allow</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>IAM user or role, same account, no resource policy</td><td>Identity policy (+ boundary, session policy, SCPs)</td><td>The common case</td></tr>
<tr><td>Same account, resource policy names the user or role session</td><td>Resource policy is enough (+ SCPs/RCPs; no explicit Deny)</td><td>An implicit deny in a boundary/session policy doesn't block it</td></tr>
<tr><td>Same account, resource policy names the role ARN</td><td>Resource policy, and the session's boundary and session policy</td><td>Implicit denies in those layers still apply</td></tr>
<tr><td>Cross-account, direct (resource policy)</td><td>Caller's identity policy AND resource policy (+ both sides' SCP/RCP)</td><td>Caller keeps its own identity</td></tr>
<tr><td>Cross-account via AssumeRole</td><td>Caller: <code>sts:AssumeRole</code> on the role ARN; role: trust policy naming the caller; then the role's own policies</td><td>After assuming, it's a same-account request</td></tr>
<tr><td>KMS key</td><td>Key policy (directly, or delegating to IAM) + identity policy as applicable; cross-account both</td><td>AWS managed keys (<code>aws/s3</code>, <code>aws/ebs</code>…) can't be shared across accounts because you can't edit their key policies</td></tr>
<tr><td>Request through a VPC endpoint</td><td>All of the above AND the endpoint policy</td><td>Endpoint policies only limit; <code>aws:SourceIp</code> is absent, use <code>aws:SourceVpce</code>/<code>aws:SourceVpc</code></td></tr>
<tr><td>AWS service acting for you (forward access)</td><td>Your permissions for the original call; the service calls downstream with your identity</td><td><code>aws:ViaAWSService</code> is true and <code>aws:CalledVia</code> lists the service; the source IP is the service's</td></tr>
<tr><td>Management account principals</td><td>Same as above, but SCPs/RCPs don't apply</td><td>Another reason to keep workloads out of the management account</td></tr>
<tr><td>Root user of a member account</td><td>Not limited by identity policies, but SCPs (and RCPs) still apply</td><td>The root user can't be given a boundary</td></tr>
</tbody></table>` },

    { type: "examples", title: "Worked examples: 12 scenarios", html: `
<p>Each row lists the relevant policies; anything not mentioned allows everything (default SCP/RCP) or doesn't exist. Work out the answer before reading the result column.</p>
<table>
<thead><tr><th>#</th><th>Policies present</th><th>Result</th><th>Why</th></tr></thead>
<tbody>
<tr><td>1</td><td>User has <code>AdministratorAccess</code>. SCP on the account: Deny <code>ec2:*</code> when <code>aws:RequestedRegion</code> ≠ eu-west-1. User launches in us-east-2.</td><td><strong>Denied</strong></td><td>Explicit Deny in an SCP beats any Allow. Admin rights inside an account can't override the organisation.</td></tr>
<tr><td>2</td><td>Role allows <code>ec2:RunInstances</code>; its boundary allows only <code>s3:*</code>.</td><td><strong>Denied</strong> (implicit)</td><td>The boundary doesn't allow the action, so the intersection is empty.</td></tr>
<tr><td>3</td><td>Account A bucket policy allows <code>arn:aws:iam::444455556666:root</code> to <code>s3:GetObject</code>. A role in account B has no S3 permissions in its identity policies.</td><td><strong>Denied</strong></td><td>Cross-account needs both sides. Naming B's root in the bucket policy delegates to B's administrators; they must still grant it.</td></tr>
<tr><td>4</td><td>Same as #3, plus B's role has Allow <code>s3:GetObject</code> on <code>arn:aws:s3:::acme-data/*</code>. Objects use SSE-S3.</td><td><strong>Allowed</strong></td><td>Both sides allow and SSE-S3 needs no key policy.</td></tr>
<tr><td>5</td><td>Same as #4, but objects are encrypted with a customer managed KMS key in A whose key policy mentions only account A.</td><td><strong>Denied</strong></td><td>Decrypting requires <code>kms:Decrypt</code>, and the key policy doesn't allow account B. The error names KMS.</td></tr>
<tr><td>6</td><td>Same account: bucket policy allows <code>user/maria</code> <code>s3:GetObject</code>. Maria has no identity policies.</td><td><strong>Allowed</strong></td><td>Within one account, the resource policy's allow is enough.</td></tr>
<tr><td>7</td><td>Same account: user has <code>kms:*</code> on <code>*</code>. The key policy has no statement for the account or the user.</td><td><strong>Denied</strong></td><td>KMS requires the key policy to allow (or to delegate to IAM via the <code>:root</code> statement).</td></tr>
<tr><td>8</td><td>Identity policy: Deny <code>*</code> if <code>Bool aws:MultiFactorAuthPresent = false</code>. User calls the CLI with long-term access keys.</td><td><strong>Allowed</strong> (if another policy allows)</td><td>The MFA key is absent, so <code>Bool</code> doesn't match and the Deny doesn't apply. Use <code>BoolIfExists</code>.</td></tr>
<tr><td>9</td><td>Same as #8 but with <code>BoolIfExists</code>.</td><td><strong>Denied</strong></td><td>Absent key counts as a match, so the Deny applies.</td></tr>
<tr><td>10</td><td>Allow <code>ec2:CreateTags</code> with <code>ForAllValues:StringEquals aws:TagKeys [env, team]</code>. Request sends no tags.</td><td><strong>Allowed</strong></td><td><code>ForAllValues</code> is true for an empty set. Add <code>Null aws:TagKeys = false</code> to close the gap.</td></tr>
<tr><td>11</td><td>Bucket policy: Deny <code>s3:*</code> with <code>NotPrincipal</code> = <code>arn:aws:iam::111122223333:role/Etl</code>. The Etl role's session calls GetObject.</td><td><strong>Denied</strong></td><td>The caller is the session <code>assumed-role/Etl/…</code>, which isn't listed, so the Deny applies. Use <code>ArnNotLike aws:PrincipalArn</code> instead.</td></tr>
<tr><td>12</td><td>Bucket policy: Deny <code>s3:*</code> if <code>NotIpAddress aws:SourceIp 203.0.113.0/24</code>. An EC2 instance reads through an S3 gateway endpoint.</td><td><strong>Denied</strong></td><td>Through a VPC endpoint the source-IP key is absent; a negated operator matches; the Deny applies. Condition on <code>aws:SourceVpce</code> instead.</td></tr>
</tbody></table>
<h3>Reading a real error message</h3>
<pre><code>An error occurred (AccessDenied) when calling the GetObject operation:
User: arn:aws:sts::444455556666:assumed-role/Analytics/dana is not authorized to perform:
kms:Decrypt on resource: arn:aws:kms:eu-west-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab
because no resource-based policy allows the kms:Decrypt action</code></pre>
<p>Decode it field by field: the <strong>principal</strong> is a role session in account B; the failing <strong>action</strong> is <code>kms:Decrypt</code>, not the S3 action you called (S3 asks KMS to decrypt on your behalf); the <strong>resource</strong> is a key in account A; and the <strong>reason</strong> is "no resource-based policy allows", i.e. the key policy. Scenario #5, solved from the message alone.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Evaluation principle at work</th><th>Design response</th></tr></thead>
<tbody>
<tr><td>Prevent anyone deleting backups, even admins</td><td>Explicit Deny beats Allow</td><td>Deny in an SCP (and AWS Backup Vault Lock), with a break-glass exemption via <code>aws:PrincipalArn</code></td></tr>
<tr><td>Partner account must read one prefix</td><td>Cross-account needs both sides</td><td>Bucket policy naming the partner's role ARN; ask the partner to grant their role the same actions</td></tr>
<tr><td>Allow access only from your corporate network and your VPC</td><td>Missing keys and negated operators</td><td>Deny unless <code>aws:SourceIp</code> is corporate <em>or</em> <code>aws:SourceVpce</code> matches, and exempt <code>aws:ViaAWSService</code></td></tr>
<tr><td>Delegated admins must not create admins</td><td>Boundary intersection</td><td>Permissions boundary enforced at creation (M05.03)</td></tr>
<tr><td>Share an encrypted snapshot or bucket with another account</td><td>KMS key policy is authoritative</td><td>Customer managed key whose key policy allows the other account; AWS managed keys can't be shared</td></tr>
<tr><td>Require MFA for sensitive actions</td><td>IfExists semantics</td><td><code>BoolIfExists aws:MultiFactorAuthPresent = false</code> → Deny, or <code>NumericGreaterThanIfExists aws:MultiFactorAuthAge</code></td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: predict, then simulate", html: `
<p>The IAM Policy Simulator can evaluate policies you haven't attached yet. Predict each result first, then check. Everything here is free and creates nothing.</p>
<pre><code># Scenario A: an Allow plus a Deny-without-MFA (Bool vs BoolIfExists)
cat &gt; allow.json &lt;&lt;'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:ListAllMyBuckets","Resource":"*"}]}
EOF
cat &gt; deny-bool.json &lt;&lt;'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*",
 "Condition":{"Bool":{"aws:MultiFactorAuthPresent":"false"}}}]}
EOF
sed 's/"Bool"/"BoolIfExists"/' deny-bool.json &gt; deny-ifexists.json

# No MFA context key supplied (like long-term access keys)
aws iam simulate-custom-policy --action-names s3:ListAllMyBuckets \\
  --policy-input-list file://allow.json file://deny-bool.json \\
  --query "EvaluationResults[0].EvalDecision" --profile academy-admin      # predict!
aws iam simulate-custom-policy --action-names s3:ListAllMyBuckets \\
  --policy-input-list file://allow.json file://deny-ifexists.json \\
  --query "EvaluationResults[0].EvalDecision" --profile academy-admin      # predict!

# Now supply the key as false, as a console session without MFA would
aws iam simulate-custom-policy --action-names s3:ListAllMyBuckets \\
  --policy-input-list file://allow.json file://deny-bool.json \\
  --context-entries ContextKeyName=aws:MultiFactorAuthPresent,ContextKeyValues=false,ContextKeyType=boolean \\
  --query "EvaluationResults[0].EvalDecision" --profile academy-admin

# Scenario B: a permissions boundary that doesn't include the action
cat &gt; boundary.json &lt;&lt;'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:*","Resource":"*"}]}
EOF
cat &gt; admin.json &lt;&lt;'EOF'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}
EOF
aws iam simulate-custom-policy --action-names ec2:RunInstances s3:GetObject \\
  --policy-input-list file://admin.json \\
  --permissions-boundary-policy-input-list file://boundary.json \\
  --query "EvaluationResults[].{Action:EvalActionName,Decision:EvalDecision}" --output table --profile academy-admin</code></pre>
<p><strong>Expected:</strong> scenario A gives <code>allowed</code> (Bool, key absent), <code>explicitDeny</code> (BoolIfExists) and <code>explicitDeny</code> (Bool with the key supplied as false). Scenario B gives <code>implicitDeny</code> for <code>ec2:RunInstances</code> and <code>allowed</code> for <code>s3:GetObject</code>. If your results differ, re-read the missing-key rules above.</p>` },

    { type: "casestudy", title: "Case study: Helix Analytics and the half-working data share", html: `
<p><strong>Context.</strong> Helix Analytics (account B, 444455556666) licenses retail sales data from a partner, Brightmart, whose data lake lives in account A (111122223333). Brightmart's platform team writes a bucket policy granting Helix's <code>Analytics</code> role <code>s3:ListBucket</code> and <code>s3:GetObject</code> on <code>brightmart-sales</code>, and tells Helix "you're good to go".</p>
<p><strong>Symptom.</strong> Helix's Glue job can list the bucket and sees thousands of Parquet files, but every read fails with AccessDenied. Helix's engineers spend a day adding broader S3 permissions to their role, including <code>s3:*</code> on <code>*</code>, without any change.</p>
<p><strong>Diagnosis, following the workflow.</strong></p>
<ol>
  <li>The full error (from the Glue logs) said: <em>not authorized to perform: kms:Decrypt on resource: arn:aws:kms:eu-west-1:111122223333:key/… because no resource-based policy allows the kms:Decrypt action</em>. The failing action was KMS, not S3, and the missing layer was a resource-based policy.</li>
  <li><code>ListBucket</code> worked because listing doesn't decrypt objects. <code>GetObject</code> on an SSE-KMS object needs <code>kms:Decrypt</code> on the key.</li>
  <li>Brightmart's bucket used SSE-KMS with a customer managed key whose key policy only allowed account A. Cross-account, the key policy (A's side) and Helix's identity policy (B's side) must both allow <code>kms:Decrypt</code>.</li>
  <li>A second, latent problem: an older prefix was encrypted with the AWS managed key <code>aws/s3</code>, whose key policy can't be edited. Those objects could never be shared cross-account as-is.</li>
</ol>
<table>
<thead><tr><th>Side</th><th>Change</th></tr></thead>
<tbody>
<tr><td>Account A, key policy</td><td>Allow <code>arn:aws:iam::444455556666:role/Analytics</code> <code>kms:Decrypt</code>, with condition <code>kms:ViaService = s3.eu-west-1.amazonaws.com</code> so the key can only be used through S3</td></tr>
<tr><td>Account B, identity policy</td><td>Allow <code>kms:Decrypt</code> on that key ARN (and revert the <code>s3:*</code> on <code>*</code> experiment to <code>s3:GetObject</code>/<code>s3:ListBucket</code> on the bucket)</td></tr>
<tr><td>Account A, legacy prefix</td><td>Re-encrypt with the customer managed key using S3 Batch Operations (copy in place)</td></tr>
</tbody></table>
<p><strong>Outcome.</strong> Reads succeeded immediately after both changes. Brightmart added the key policy statement to its onboarding runbook, and Helix added an IAM Access Analyzer custom policy check to its CI pipeline that rejects <code>"Resource": "*"</code> for S3 write actions, removing the over-broad policy the incident had produced.</p>
<p><strong>Lessons.</strong> Read the whole error message: it names the action and the policy type. Cross-account access to encrypted data is three permissions, not one. "Add more permissions until it works" on the caller's side can never fix a missing permission on the owner's side; it only makes the caller less secure.</p>` },

    { type: "exam", html: `
<ul>
  <li><strong>"Explicit deny"</strong> anywhere → denied. No Allow, admin policy or resource policy can override it.</li>
  <li><strong>"User has AdministratorAccess but can't…"</strong> → look for an SCP, a permissions boundary, a session policy, a resource policy Deny, a KMS key policy, or a VPC endpoint policy.</li>
  <li><strong>Cross-account</strong> → both the identity policy in the caller's account and the resource policy (or trust policy) in the owner's account. Encrypted data → the key policy too.</li>
  <li><strong>"Share encrypted snapshots/objects with another account"</strong> → a customer managed KMS key; AWS managed keys can't be shared.</li>
  <li><strong>"Require MFA"</strong> → <code>aws:MultiFactorAuthPresent</code> with <code>BoolIfExists</code> in a Deny, or a condition in the trust policy for role assumption.</li>
  <li><strong>"Restrict access to requests from our VPC"</strong> → <code>aws:SourceVpce</code>/<code>aws:SourceVpc</code>, not <code>aws:SourceIp</code> (private IPs and endpoints don't populate it).</li>
</ul>
<table>
<thead><tr><th>Layer</th><th>Grants?</th><th>Can deny explicitly?</th><th>Implicitly limits?</th></tr></thead>
<tbody>
<tr><td>Identity-based</td><td>Yes</td><td>Yes</td><td>—</td></tr>
<tr><td>Resource-based</td><td>Yes</td><td>Yes</td><td>—</td></tr>
<tr><td>SCP / RCP</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Permissions boundary</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Session policy</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>VPC endpoint policy</td><td>No</td><td>Yes</td><td>Yes</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Prefer roles for cross-account access you control, resource policies for data sharing.</strong> Roles centralise permissions in the resource account and give one clean CloudTrail identity; resource policies avoid role switching and let a caller combine permissions across accounts in one call.</li>
  <li><strong>Use <code>aws:PrincipalOrgID</code> and <code>aws:PrincipalArn</code>, not long lists of account IDs and <code>NotPrincipal</code>.</strong> They survive new accounts and new sessions.</li>
  <li><strong>Every IP-based Deny needs exemptions</strong> for VPC endpoints (<code>aws:SourceVpce</code>) and for AWS services calling on your behalf (<code>aws:ViaAWSService</code>), or you'll break Athena, Glue, CloudFormation and private workloads.</li>
  <li><strong>Lint conditions in CI.</strong> IAM Access Analyzer policy validation flags <code>ForAllValues</code> with Allow, <code>Bool</code> on MFA in Deny statements, and missing <code>Null</code> checks. Add custom policy checks (<code>CheckNoNewAccess</code>, <code>CheckAccessNotGranted</code>) to block regressions.</li>
  <li><strong>Make denials observable.</strong> An EventBridge rule or CloudWatch Logs metric filter on CloudTrail <code>AccessDenied</code> errors by principal surfaces broken deployments and probing attempts long before a user files a ticket.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Start from implicit deny; an explicit Deny in any policy ends evaluation.</li>
  <li>Limiting layers (RCP, SCP, boundary, session policy, VPC endpoint policy) must all allow; they intersect.</li>
  <li>Granting layers (identity, resource) combine as a union in one account: either can grant.</li>
  <li>A resource policy naming the user or role session isn't limited by implicit denies in a boundary or session policy; naming the role ARN is.</li>
  <li>KMS key policies and role trust policies must explicitly allow; identity policies alone aren't enough.</li>
  <li>Cross-account: the caller's account and the owner's account must both allow (plus the key policy for encrypted data).</li>
  <li>Missing condition keys: normal operators → false; negated operators → true; <code>…IfExists</code> → true.</li>
  <li><code>ForAllValues</code> is true for an empty set; use <code>Null</code> to require values.</li>
  <li>Troubleshoot with the full error message, <code>sts get-caller-identity</code>, CloudTrail, the Policy Simulator and Access Analyzer.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.04-d1", q: "A user has <code>AdministratorAccess</code>. An SCP on the account explicitly denies <code>s3:DeleteBucket</code>. Is DeleteBucket allowed or denied?", answers: ["denied", "deny"], hint: "Which wins, any Allow or an explicit Deny?", explain: "An explicit Deny in an SCP overrides every Allow." },
    { id: "M05.04-d2", q: "Same account. A bucket policy allows <code>arn:aws:iam::111122223333:user/maria</code> to GetObject. Maria has no identity policies. Allowed or denied?", answers: ["allowed", "allow"], hint: "Within one account, is a resource policy grant enough?", explain: "In the same account, an allow in the resource-based policy is sufficient." },
    { id: "M05.04-d3", q: "A bucket in account A allows account B's role to GetObject. The role's identity policy in account B doesn't mention S3. Allowed or denied?", answers: ["denied", "deny"], hint: "Cross-account needs both sides.", explain: "Account B must also allow its principal to make the call." },
    { id: "M05.04-d4", q: "A role's identity policy allows <code>dynamodb:PutItem</code>; its permissions boundary allows only <code>s3:*</code>. Allowed or denied?", answers: ["denied", "deny"], hint: "Intersection.", explain: "The boundary doesn't allow the action, so it's implicitly denied." },
    { id: "M05.04-d5", q: "A Deny statement uses <code>\"Bool\": {\"aws:MultiFactorAuthPresent\": \"false\"}</code>. A call made with long-term access keys (no MFA key in the request) is otherwise allowed. Allowed or denied?", answers: ["allowed", "allow"], hint: "What does a missing key do to a normal operator?", explain: "The key is absent, so the Bool condition is false and the Deny doesn't apply. Use BoolIfExists." },
    { id: "M05.04-d6", q: "An Allow uses <code>ForAllValues:StringEquals</code> on <code>aws:TagKeys</code> = [env, team]. The request sends no tags. Allowed or denied?", answers: ["allowed", "allow"], hint: "Is 'all of nothing' true?", explain: "ForAllValues evaluates to true for an empty set, so the Allow applies. Add a Null check to require tags." },
    { id: "M05.04-d7", q: "A user in the same account has <code>kms:*</code> on <code>*</code>. The key policy has no statement for the account root or the user. Allowed or denied?", answers: ["denied", "deny"], hint: "Which resource's policy is authoritative?", explain: "KMS requires the key policy to allow access directly or by delegating to IAM." },
    { id: "M05.04-d8", q: "A bucket policy denies all access if <code>NotIpAddress aws:SourceIp</code> isn't the office range. An EC2 instance reads via an S3 gateway endpoint. Allowed or denied?", answers: ["denied", "deny"], hint: "Is aws:SourceIp present for endpoint traffic? What do negated operators do with a missing key?", explain: "The key is absent; NotIpAddress evaluates true; the Deny applies. Use aws:SourceVpce." },
    { id: "M05.04-d9", q: "Which STS command decodes the encoded authorization failure message returned by some EC2 API errors? (CLI subcommand)", answers: ["decode-authorization-message", "aws sts decode-authorization-message", "sts decode-authorization-message"], hint: "aws sts …", explain: "<code>aws sts decode-authorization-message --encoded-message …</code> shows the request context and the reason." }
  ],
  check: [
    { id: "M05.04-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "An IAM user in a member account has the AdministratorAccess policy attached but receives AccessDenied when launching EC2 instances in ap-southeast-2. Instances launch successfully in eu-west-1. What is the MOST likely cause?",
      options: [
        { t: "A service control policy denies actions outside approved Regions", c: true, why: "An SCP Deny using aws:RequestedRegion is the classic cause; it overrides any Allow in the account." },
        { t: "The user's password has expired", c: false, why: "The user is signed in and can launch in eu-west-1." },
        { t: "ap-southeast-2 has no Availability Zones for the instance type", c: false, why: "That produces a capacity or unsupported-type error, not AccessDenied." },
        { t: "AdministratorAccess only applies to the Region where the user was created", c: false, why: "IAM is global; policies aren't Region-scoped unless a condition says so." }
      ] },
    { id: "M05.04-k2", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "Account A's S3 bucket policy grants a role in account B s3:GetObject. Objects are encrypted with a customer managed KMS key in account A. Account B's role policy allows s3:GetObject and kms:Decrypt on the key. Reads still fail with AccessDenied. What should be changed?",
      options: [
        { t: "Add a statement to the KMS key policy in account A that allows account B's role to use kms:Decrypt", c: true, why: "Cross-account KMS needs the key policy (owner side) and the identity policy (caller side) to allow." },
        { t: "Add s3:* on * to the role in account B", c: false, why: "The missing permission is on the owner's side; widening the caller's policy can't fix it." },
        { t: "Switch the objects to the AWS managed key aws/s3", c: false, why: "AWS managed keys can't be shared cross-account because their key policies can't be edited." },
        { t: "Add an SCP in account A allowing account B", c: false, why: "SCPs never grant and don't govern account B's principals." }
      ] },
    { id: "M05.04-k3", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "A role's identity policy allows s3:* on all resources. Which TWO of the following can still cause an s3:PutObject request by that role to be DENIED?",
      options: [
        { t: "A permissions boundary on the role that allows only s3:GetObject", c: true, why: "The boundary caps the role; PutObject is outside the intersection." },
        { t: "A bucket policy with an explicit Deny for PutObject unless the request uses aws:SecureTransport", c: true, why: "Explicit Deny in a resource policy beats the identity Allow for non-TLS requests." },
        { t: "An S3 bucket policy that doesn't mention the role, in the same account", c: false, why: "In the same account the identity policy's Allow is enough; silence in the bucket policy isn't a deny." },
        { t: "An AWS managed policy attached to another role", c: false, why: "Policies on other identities don't affect this role." },
        { t: "A NACL on the subnet allowing port 443 outbound", c: false, why: "That allows traffic; NACLs don't take part in IAM evaluation anyway." }
      ] },
    { id: "M05.04-k4", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A security team wants to deny every API action for IAM users who haven't authenticated with MFA, including users calling the CLI with long-term access keys. Which condition should the Deny statement use?",
      options: [
        { t: "\"BoolIfExists\": {\"aws:MultiFactorAuthPresent\": \"false\"}", c: true, why: "IfExists makes a missing key (long-term keys) count as a match, so the Deny applies to them as well as to console sessions without MFA." },
        { t: "\"Bool\": {\"aws:MultiFactorAuthPresent\": \"false\"}", c: false, why: "With long-term access keys the key is absent, so this condition is false and the Deny never applies." },
        { t: "\"Bool\": {\"aws:SecureTransport\": \"false\"}", c: false, why: "That checks TLS, not MFA." },
        { t: "\"StringEquals\": {\"aws:MultiFactorAuthAge\": \"0\"}", c: false, why: "Wrong operator and logic; MultiFactorAuthAge is numeric seconds since MFA authentication." }
      ] },
    { id: "M05.04-k5", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "A bucket policy denies all requests unless they come from the corporate IP range. After the company moves its ETL instances to private subnets that use an S3 gateway endpoint, all ETL reads fail. Which change keeps the restriction while allowing the ETL traffic?",
      options: [
        { t: "Change the Deny condition to also exempt requests whose aws:SourceVpce equals the gateway endpoint ID", c: true, why: "Through a VPC endpoint aws:SourceIp is absent, so the negated IP condition matched; aws:SourceVpce identifies the endpoint path." },
        { t: "Add the private subnet CIDR to the aws:SourceIp list", c: false, why: "aws:SourceIp doesn't carry private VPC addresses for endpoint traffic." },
        { t: "Remove the gateway endpoint and route through a NAT gateway", c: false, why: "That might match a NAT public IP but adds cost and moves traffic to the internet path." },
        { t: "Attach AmazonS3FullAccess to the ETL role", c: false, why: "An explicit Deny in the bucket policy still wins." }
      ] },
    { id: "M05.04-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "Within one account, an S3 bucket policy names an IAM role ARN as principal and allows s3:GetObject. The role has no S3 permissions in its identity policies and has a permissions boundary that allows only DynamoDB actions. A session of that role calls GetObject. What happens?",
      options: [
        { t: "Denied, because when the resource policy names the role ARN, the session's permissions boundary still applies and doesn't allow S3", c: true, why: "Implicit denies in a boundary or session policy limit grants made to the role ARN. Naming the role session ARN would behave differently." },
        { t: "Allowed, because a same-account resource policy always overrides every other layer", c: false, why: "It never overrides explicit Denies, SCPs or RCPs, and grants to the role ARN are still limited by the boundary." },
        { t: "Allowed, because boundaries only apply to IAM users", c: false, why: "Boundaries apply to users and roles." },
        { t: "Denied, because S3 bucket policies can't name roles", c: false, why: "Bucket policies commonly name role ARNs." }
      ] }
  ],
  cards: ["fc-M05-4-01", "fc-M05-4-02", "fc-M05-4-03", "fc-M05-4-04", "fc-M05-4-05", "fc-M05-4-06", "fc-M05-4-07", "fc-M05-4-08", "fc-M05-4-09", "fc-M05-4-10", "fc-M05-4-11"],
  references: [
    "IAM User Guide: <em>Policy evaluation logic</em>, <em>Cross-account policy evaluation logic</em>, <em>Determining whether a request is allowed or denied within an account</em>",
    "IAM User Guide: <em>IAM JSON policy elements: Condition operators</em> (…IfExists, Null), <em>Multivalued context keys</em> (ForAllValues/ForAnyValue)",
    "IAM User Guide: <em>Troubleshoot access denied error messages</em>; <em>Testing IAM policies with the IAM policy simulator</em>",
    "AWS KMS Developer Guide: <em>Key policies</em>, <em>Allowing users in other accounts to use a KMS key</em>",
    "<em>System Design on AWS</em> ch.12 \"AWS Identity and Access Management\" (PDF p603–608)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-4-01", front: "IAM evaluation order (one account)?", back: "Implicit deny → explicit Deny anywhere? → RCPs allow? → SCPs allow? → resource policy allows? → identity policy allows? → boundary allows? → session policy allows? → Allow." },
  { id: "fc-M05-4-02", front: "How do granting vs limiting policies combine?", back: "Granting (identity, resource): union. Limiting (SCP, RCP, boundary, session, VPC endpoint policy): intersection. Explicit Deny beats all." },
  { id: "fc-M05-4-03", front: "Same-account: is a resource policy Allow enough on its own?", back: "Yes. If it names the user or role session, implicit denies in a boundary/session policy don't block it; if it names the role ARN, they still apply." },
  { id: "fc-M05-4-04", front: "Cross-account rule?", back: "Both sides must allow: the caller's identity policy (and its SCPs) AND the resource/trust policy (and the owner's RCPs). Encrypted data: the KMS key policy too." },
  { id: "fc-M05-4-05", front: "Which two resources require their own policy to allow, even in the same account?", back: "KMS keys (key policy, or delegation to IAM via the :root statement) and IAM roles (trust policy for AssumeRole)." },
  { id: "fc-M05-4-06", front: "Missing context key: what does the condition return?", back: "Normal operators → false. Negated operators (StringNotEquals, NotIpAddress…) → true. …IfExists → true." },
  { id: "fc-M05-4-07", front: "Why use BoolIfExists for an MFA Deny?", back: "Calls with long-term access keys have no aws:MultiFactorAuthPresent key; plain Bool wouldn't match, so the Deny wouldn't apply." },
  { id: "fc-M05-4-08", front: "ForAllValues pitfall?", back: "It's true when the request has no values (empty set). Add \"Null\": {\"aws:TagKeys\": \"false\"} to require values." },
  { id: "fc-M05-4-09", front: "Why avoid NotPrincipal for roles?", back: "Callers are role sessions (assumed-role/…), which you'd have to list too. Use Principal \"*\" + ArnNotLike on aws:PrincipalArn." },
  { id: "fc-M05-4-10", front: "Restrict access to traffic from your VPC: which keys?", back: "aws:SourceVpce or aws:SourceVpc. aws:SourceIp is absent for VPC endpoint traffic." },
  { id: "fc-M05-4-11", front: "Can AWS managed KMS keys (aws/s3) be shared cross-account?", back: "No: you can't edit their key policies. Use a customer managed key." }
);
// ================================================================== 05_roles_sts.js
/* ---------------------------------------------------------------- M05.05 Roles and STS */
var DG_0505_SEQ = `
<figure>
<svg class="diagram" viewBox="0 0 760 400" role="img" aria-labelledby="m0505at m0505ad">
  <title id="m0505at">The AssumeRole sequence</title>
  <desc id="m0505ad">Three lifelines: the caller, AWS STS and the target service such as S3. The caller sends AssumeRole with a role ARN and session name. STS checks that the caller's own permissions allow sts:AssumeRole on that role and that the role's trust policy trusts the caller. STS returns temporary credentials: an access key ID starting with ASIA, a secret key, a session token and an expiry time. The caller signs the next API call to S3 with these credentials, and S3 evaluates the role's permissions policy.</desc>
  <defs><marker id="m0505a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="20" y="14" width="190" height="44" rx="8"/><text class="dg-tb" x="34" y="34">Caller</text><text class="dg-ts" x="34" y="50">user, role, app, CI job</text>
  <rect class="dg-edge" x="285" y="14" width="190" height="44" rx="8"/><text class="dg-tb" x="299" y="34">AWS STS</text><text class="dg-ts" x="299" y="50">sts.eu-west-1.amazonaws.com</text>
  <rect class="dg-good" x="550" y="14" width="190" height="44" rx="8"/><text class="dg-tb" x="564" y="34">Target service</text><text class="dg-ts" x="564" y="50">e.g. Amazon S3</text>
  <path class="dg-line" d="M115 58 V384" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M380 58 V384" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M645 58 V384" stroke-dasharray="3 4"/>

  <path class="dg-line" d="M115 92 H376" marker-end="url(#m0505a-ar)"/>
  <text class="dg-t" x="126" y="86">1 AssumeRole(RoleArn, SessionName)</text>

  <rect class="dg-box" x="392" y="104" width="356" height="62" rx="6"/>
  <text class="dg-t" x="404" y="124">2 Is the caller allowed sts:AssumeRole?</text>
  <text class="dg-t" x="404" y="142">3 Does the role's TRUST policy trust it?</text>
  <text class="dg-ts" x="404" y="158">both must say yes (cross-account: two accounts)</text>

  <path class="dg-line" d="M380 196 H119" marker-end="url(#m0505a-ar)"/>
  <text class="dg-t" x="126" y="190">4 Temporary credentials</text>
  <rect class="dg-box" x="20" y="206" width="330" height="62" rx="6"/>
  <text class="dg-ts" x="32" y="224">AccessKeyId ASIA… · SecretAccessKey</text>
  <text class="dg-ts" x="32" y="240">SessionToken · Expiration (default 1 h)</text>
  <text class="dg-ts" x="32" y="256">AssumedRoleUser arn:…:assumed-role/Role/session</text>

  <path class="dg-line" d="M115 300 H641" marker-end="url(#m0505a-ar)"/>
  <text class="dg-t" x="126" y="294">5 GetObject, signed with the temporary keys + token</text>
  <rect class="dg-box" x="420" y="312" width="328" height="44" rx="6"/>
  <text class="dg-t" x="432" y="331">6 Evaluate the ROLE's permissions</text>
  <text class="dg-ts" x="432" y="347">(+ bucket policy, SCPs, boundary, session policy)</text>
  <path class="dg-line" d="M645 370 H119" marker-end="url(#m0505a-ar)"/>
  <text class="dg-t" x="300" y="364">7 Object (or AccessDenied)</text>
</svg>
<figcaption>Figure M05-5a. AssumeRole is a two-sided check: the caller must be allowed to ask, and the role must trust the caller. After that, the caller acts with the role's permissions only, not its own.</figcaption>
</figure>`;

var DG_0505_WORKLOADS = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0505bt m0505bd">
  <title id="m0505bt">How each compute service delivers role credentials</title>
  <desc id="m0505bd">Four columns: EC2 gets credentials from the instance metadata service through an instance profile; ECS tasks get them from the container credentials endpoint for the task role, while the task execution role is used by the ECS agent to pull images and write logs; Lambda receives the execution role credentials as environment variables; EKS pods get credentials through IRSA web identity tokens or EKS Pod Identity. In every case the SDK finds them automatically and they rotate before expiry.</desc>
  <rect class="dg-info" x="12" y="14" width="176" height="166" rx="8"/>
  <text class="dg-tb" x="24" y="36">EC2</text>
  <text class="dg-ts" x="24" y="58">role inside an</text>
  <text class="dg-ts" x="24" y="72">instance profile</text>
  <text class="dg-ts" x="24" y="96">SDK reads IMDSv2</text>
  <text class="dg-ts" x="24" y="110">169.254.169.254</text>
  <text class="dg-ts" x="24" y="124">…/security-credentials/</text>
  <text class="dg-ts" x="24" y="148">rotated automatically</text>
  <text class="dg-ts" x="24" y="162">before expiry</text>

  <rect class="dg-edge" x="200" y="14" width="176" height="166" rx="8"/>
  <text class="dg-tb" x="212" y="36">ECS / Fargate</text>
  <text class="dg-ts" x="212" y="58">task role → your code</text>
  <text class="dg-ts" x="212" y="72">(container creds endpoint</text>
  <text class="dg-ts" x="212" y="86">169.254.170.2)</text>
  <text class="dg-ts" x="212" y="110">task EXECUTION role →</text>
  <text class="dg-ts" x="212" y="124">the agent: pull image</text>
  <text class="dg-ts" x="212" y="138">from ECR, write logs,</text>
  <text class="dg-ts" x="212" y="152">read secrets for env</text>

  <rect class="dg-good" x="388" y="14" width="176" height="166" rx="8"/>
  <text class="dg-tb" x="400" y="36">Lambda</text>
  <text class="dg-ts" x="400" y="58">execution role</text>
  <text class="dg-ts" x="400" y="82">credentials injected as</text>
  <text class="dg-ts" x="400" y="96">env vars:</text>
  <text class="dg-ts" x="400" y="110">AWS_ACCESS_KEY_ID,</text>
  <text class="dg-ts" x="400" y="124">AWS_SECRET_ACCESS_KEY,</text>
  <text class="dg-ts" x="400" y="138">AWS_SESSION_TOKEN</text>

  <rect class="dg-box" x="576" y="14" width="172" height="166" rx="8"/>
  <text class="dg-tb" x="588" y="36">EKS pods</text>
  <text class="dg-ts" x="588" y="58">IRSA: service account</text>
  <text class="dg-ts" x="588" y="72">→ OIDC token →</text>
  <text class="dg-ts" x="588" y="86">AssumeRoleWith-</text>
  <text class="dg-ts" x="588" y="100">WebIdentity</text>
  <text class="dg-ts" x="588" y="124">or EKS Pod Identity</text>
  <text class="dg-ts" x="588" y="138">(agent on the node)</text>

  <text class="dg-t" x="12" y="210">Same rule everywhere: attach a role, let the SDK find the credentials, never bake keys</text>
  <text class="dg-t" x="12" y="228">into an AMI, image, environment file or source code.</text>
</svg>
<figcaption>Figure M05-5b. Every AWS compute service has a built-in way to hand a role's temporary credentials to your code. Your job is to choose the role and keep its permissions narrow.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.05", title: "Roles and STS", level: 200, minutes: 55,
  objectives: [
    "Explain how a role differs from a user, and the separate jobs of its trust policy and its permissions policy",
    "Choose the right STS API for a scenario and state its credential lifetime",
    "Walk through the AssumeRole workflow and read temporary credentials and an assumed-role ARN",
    "Give EC2, ECS, Lambda, EKS and CI/CD pipelines role credentials without long-term keys",
    "Explain why iam:PassRole is a privilege-escalation risk and how to scope it, and how to revoke active role sessions"
  ],
  sections: [
    { type: "why", html: `
<p>Count the long-term access keys in a typical company that "uses AWS". There are keys in CI/CD variables, in <code>.env</code> files on laptops, in a config file baked into an AMI five years ago, and in a partner's monitoring tool. Each one is a password that never expires, can be copied anywhere, and works from anywhere on the internet. Most real AWS breaches start with exactly such a key.</p>
<p><strong>Roles</strong> remove the problem at its root. A role has no password and no keys. Something trusted <em>assumes</em> it and receives credentials that expire on their own, usually within an hour. On the SAA-C03 exam, "an application on EC2 needs to access S3" has one correct answer, an IAM role through an instance profile, and the distractors are all variations of "store access keys". In real projects, roles are how humans reach production, how pipelines deploy, how services call each other and how accounts trust each other. This lesson is the mechanics behind all of that.</p>` },

    { type: "concept", title: "Concept: what a role is", html: DG_0505_SEQ + `
<h3>A role is an identity with two policies and no credentials</h3>
<p>An <strong>IAM role</strong> is an IAM identity, like a user, with permissions attached. Unlike a user it is not tied to one person and it has <strong>no long-term credentials</strong>: no password, no access keys. Instead, a trusted principal <em>assumes</em> the role and AWS Security Token Service (<strong>STS</strong>) issues <strong>temporary security credentials</strong> for a session.</p>
<p>Every role carries two different kinds of policy. Mixing them up is the most common mistake people make with roles:</p>
<table>
<thead><tr><th></th><th>Trust policy</th><th>Permissions policy (or policies)</th></tr></thead>
<tbody>
<tr><td>Question it answers</td><td><strong>Who</strong> may assume this role?</td><td><strong>What</strong> may the session do once assumed?</td></tr>
<tr><td>Policy type</td><td>A resource-based policy attached to the role (the role is the resource)</td><td>Identity-based policies: AWS managed, customer managed or inline</td></tr>
<tr><td>Has a <code>Principal</code> element?</td><td>Yes: an account, user, role, AWS service or federated provider</td><td>No</td></tr>
<tr><td>Typical action</td><td><code>sts:AssumeRole</code>, <code>sts:AssumeRoleWithWebIdentity</code>, <code>sts:AssumeRoleWithSAML</code>, <code>sts:TagSession</code></td><td><code>s3:GetObject</code>, <code>dynamodb:PutItem</code>…</td></tr>
<tr><td>Every role has</td><td>Exactly one</td><td>Zero or more (up to 10 managed by default, plus inline)</td></tr>
</tbody></table>

<h3>Who can assume a role?</h3>
<ul>
  <li><strong>IAM users and roles</strong> in the same account or another account. Humans "switch role" in the console; scripts call <code>sts:AssumeRole</code>.</li>
  <li><strong>AWS services</strong> acting for you: EC2, Lambda, ECS tasks, CloudFormation, CodeBuild, Glue and many more. The trust policy names a <em>service principal</em> such as <code>ec2.amazonaws.com</code>.</li>
  <li><strong>Federated identities</strong>: workforce users from a SAML 2.0 identity provider (Entra ID, Okta, ADFS), or workloads with an OIDC token (GitHub Actions, GitLab, Kubernetes service accounts, Cognito identity pools).</li>
  <li><strong>IAM Identity Center</strong> users. Each permission set becomes a role named <code>AWSReservedSSO_…</code> in every account it is assigned to (covered in M05.07).</li>
</ul>

<h3>Temporary credentials: what you actually receive</h3>
<p>A successful assume call returns four things. The SDKs and CLI handle them automatically, but you should recognise them in logs and incident response:</p>
<ul>
  <li><strong>AccessKeyId</strong> starting with <code>ASIA</code>. Long-term user keys start with <code>AKIA</code>, so the prefix tells you instantly which kind leaked.</li>
  <li><strong>SecretAccessKey</strong>, used to compute the SigV4 signature (M01.04).</li>
  <li><strong>SessionToken</strong>, which must be sent with every request as <code>X-Amz-Security-Token</code>. Keys without the token are useless.</li>
  <li><strong>Expiration</strong>. After it, the credentials stop working. Nothing needs to be revoked or rotated.</li>
</ul>
<p>The caller's identity during the session is an <strong>assumed-role ARN</strong>: <code>arn:aws:sts::111122223333:assumed-role/DeployRole/github-run-8812</code>. The last part is the <em>role session name</em> chosen by the caller. It appears in CloudTrail, so set it to something meaningful (the user's name, the pipeline run ID).</p>
<div class="callout"><strong>You give up your own permissions.</strong> While you use a role's credentials you have <em>only</em> the role's permissions, not the union of yours and the role's. This matters when comparing cross-account roles with resource-based policies (M05.06).</div>` },

    { type: "concept", title: "Concept: the STS API family", html: `
<table>
<thead><tr><th>STS API</th><th>Who calls it</th><th>Typical use</th><th>Session duration</th></tr></thead>
<tbody>
<tr><td><code>AssumeRole</code></td><td>An IAM user or role (any account), or an AWS service</td><td>Cross-account access, switching role, services acting for you</td><td>Default 1 h; 15 min up to the role's <code>MaxSessionDuration</code> (max 12 h). <strong>Role chaining: max 1 h.</strong></td></tr>
<tr><td><code>AssumeRoleWithSAML</code></td><td>A user who authenticated to a SAML 2.0 IdP (no AWS credentials needed)</td><td>Workforce federation with ADFS, Entra ID, Okta (legacy pattern; Identity Center is preferred)</td><td>Default 1 h, up to <code>MaxSessionDuration</code> (12 h)</td></tr>
<tr><td><code>AssumeRoleWithWebIdentity</code></td><td>A workload holding an OIDC token (no AWS credentials needed)</td><td>GitHub Actions/GitLab OIDC, EKS IRSA, Cognito identity pools, mobile apps (via Cognito)</td><td>Default 1 h, up to <code>MaxSessionDuration</code> (12 h)</td></tr>
<tr><td><code>GetSessionToken</code></td><td>An IAM user (or root)</td><td>Get MFA-authenticated temporary credentials, so policies requiring <code>aws:MultiFactorAuthPresent</code> are satisfied in the CLI</td><td>15 min to 36 h (default 12 h); 1 h max for root</td></tr>
<tr><td><code>GetFederationToken</code></td><td>An IAM user (long-term credentials)</td><td>Old custom identity broker pattern; results are limited by a session policy you pass</td><td>15 min to 36 h (default 12 h)</td></tr>
<tr><td><code>GetCallerIdentity</code></td><td>Anyone with credentials; needs no permission</td><td>"Who am I?" (account, ARN, user ID)</td><td>–</td></tr>
<tr><td><code>DecodeAuthorizationMessage</code></td><td>A principal with <code>sts:DecodeAuthorizationMessage</code></td><td>Decode the encoded failure message some services (EC2) return with AccessDenied</td><td>–</td></tr>
</tbody></table>
<h3>Session policies, session tags and source identity</h3>
<ul>
  <li><strong>Session policy:</strong> an optional inline policy (or up to 10 managed policy ARNs) passed with the assume call. The session's permissions become the <em>intersection</em> of the role's permissions and the session policy. It can only reduce, never add (M05.03, M05.04).</li>
  <li><strong>Session tags:</strong> key/value tags passed in the call (or by a SAML/OIDC IdP) that appear as <code>aws:PrincipalTag/…</code> during the session. They are the basis of ABAC (M05.08). Passing them needs <code>sts:TagSession</code> in the trust policy. Tags can be marked <em>transitive</em> so they survive role chaining.</li>
  <li><strong>Source identity:</strong> a value (for example the human's username) set once on the first assume call. It cannot be changed in chained sessions and is logged in CloudTrail, so you can trace "who really did this" through several role hops. It needs <code>sts:SetSourceIdentity</code>.</li>
</ul>
<h3>Role chaining</h3>
<p><strong>Role chaining</strong> means using a role's credentials to assume another role (for example, SSO role → audit role in another account). It is allowed, but each chained session is limited to <strong>1 hour</strong> regardless of the target role's <code>MaxSessionDuration</code>. If a script fails with "the requested DurationSeconds exceeds the 1 hour session limit for roles assumed by role chaining", that is why.</p>
<h3>Regional STS endpoints</h3>
<p>STS has a global endpoint (<code>sts.amazonaws.com</code>, served from us-east-1) and Regional endpoints (<code>sts.eu-west-1.amazonaws.com</code>). Prefer Regional endpoints: lower latency, no dependency on another Region, and they work with VPC interface endpoints for STS. Current SDKs and CLI v2 use Regional endpoints by default in most configurations; tokens from Regional endpoints are valid in all Regions that are enabled for your account.</p>` },

    { type: "workflow", title: "Workflow: from \"I need access\" to a working session", html: `
<h3>A. A human switches into a role in another account</h3>
<ol class="flow">
  <li><strong>Set-up (once):</strong> the target account (444455556666) creates <code>ReadOnlyAudit</code> with a trust policy naming account 111122223333 as principal (optionally with an MFA condition). The source account grants its auditors <code>sts:AssumeRole</code> on that role ARN.</li>
  <li><strong>Request:</strong> the user picks <em>Switch role</em> in the console (or runs a CLI command with a profile that has <code>role_arn</code> and <code>source_profile</code>, M03.02). The client calls <code>AssumeRole</code> with the role ARN and a session name.</li>
  <li><strong>STS checks the caller:</strong> does an identity policy in account 111122223333 allow <code>sts:AssumeRole</code> on that ARN, and do the source account's SCPs allow it?</li>
  <li><strong>STS checks the role:</strong> does the trust policy allow this principal, and are its conditions met (MFA present, External ID, source IP, organisation)? Target-account SCPs and RCPs must also allow it.</li>
  <li><strong>Credentials issued:</strong> STS returns the four values. CloudTrail in <em>both</em> accounts logs the <code>AssumeRole</code> event.</li>
  <li><strong>Work:</strong> the user calls APIs. Each request is evaluated against the <em>role's</em> permissions in the target account, plus any session policy, SCPs and resource policies.</li>
  <li><strong>Expiry:</strong> after the duration ends the credentials stop working. The console prompts the user to switch again.</li>
</ol>
<h3>B. Code on EC2 gets credentials with no keys at all</h3>
<ol class="flow">
  <li>You create a role whose trust policy allows <code>ec2.amazonaws.com</code>, attach a narrow permissions policy, and wrap it in an <strong>instance profile</strong>. The console creates one automatically with the same name; with the CLI or IaC you create it explicitly.</li>
  <li>You launch (or modify) the instance with that instance profile. This requires <code>iam:PassRole</code> on the role (see below).</li>
  <li>EC2 assumes the role on the instance's behalf and places the credentials in the instance metadata service.</li>
  <li>The SDK's credential chain (M03.02) reaches its last step, gets an IMDSv2 token with a <code>PUT</code>, then reads <code>/latest/meta-data/iam/security-credentials/&lt;role-name&gt;</code>.</li>
  <li>The SDK refreshes the credentials before they expire. Your code never sees a key.</li>
</ol>
<h3>C. Revoking a compromised role session</h3>
<ol class="flow">
  <li>You cannot "delete" temporary credentials, and deleting the role would break every legitimate user.</li>
  <li>Instead, in the console choose the role → <strong>Revoke active sessions</strong>. IAM attaches an inline policy <code>AWSRevokeOlderSessions</code> that denies everything when <code>aws:TokenIssueTime</code> is earlier than now.</li>
  <li>Existing sessions fail at once. New sessions (assumed after the revocation time) work normally, so legitimate users simply re-assume the role.</li>
  <li>For EC2 instance credentials, also find out how they leaked (SSRF to IMDSv1 is the classic cause) and enforce IMDSv2.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: roles for every workload", html: DG_0505_WORKLOADS + `
<h3>Service roles vs service-linked roles</h3>
<table>
<thead><tr><th></th><th>Service role</th><th>Service-linked role</th></tr></thead>
<tbody>
<tr><td>Created by</td><td>You</td><td>The AWS service (or you, from a predefined template)</td></tr>
<tr><td>Permissions</td><td>You choose and can edit them</td><td>Predefined by the service; you can't edit them</td></tr>
<tr><td>Name / path</td><td>Your choice</td><td><code>AWSServiceRoleFor…</code> under <code>/aws-service-role/</code></td></tr>
<tr><td>Deletion</td><td>Any time</td><td>Only when the service no longer uses it</td></tr>
<tr><td>Examples</td><td>Lambda execution role, ECS task role, CodeBuild service role</td><td><code>AWSServiceRoleForAutoScaling</code>, <code>AWSServiceRoleForElasticLoadBalancing</code>, <code>AWSServiceRoleForOrganizations</code></td></tr>
<tr><td>Affected by SCPs?</td><td>Yes</td><td><strong>No</strong>: SCPs don't restrict service-linked roles</td></tr>
</tbody></table>

<h3>ECS: task role vs task execution role (exam favourite)</h3>
<ul>
  <li><strong>Task role:</strong> what <em>your application code</em> inside the container may do (read an S3 bucket, write to DynamoDB).</li>
  <li><strong>Task execution role:</strong> what the <em>ECS agent / Fargate</em> needs to start the task: pull the image from ECR, send logs to CloudWatch Logs, fetch Secrets Manager or Parameter Store values referenced in the task definition.</li>
</ul>
<p>"The container can't start because it can't pull its image" → fix the execution role. "The app gets AccessDenied writing to DynamoDB" → fix the task role.</p>

<h3>iam:PassRole: the quiet privilege escalation</h3>
<p>When you launch an instance with an instance profile, create a Lambda function, or start a CloudFormation stack with a service role, you are <em>passing</em> a role to a service, which will then act with that role's permissions. AWS checks that you have <code>iam:PassRole</code> on that role.</p>
<p>Why it matters: if a developer can create Lambda functions and pass <em>any</em> role, they can pass an administrator role to a function they wrote, invoke it, and gain admin rights they were never given. Always scope PassRole to specific role ARNs (or a path such as <code>role/app/*</code>) and, ideally, to the service that may receive it:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PassOnlyAppRolesToLambda",
    "Effect": "Allow",
    "Action": "iam:PassRole",
    "Resource": "arn:aws:iam::111122223333:role/app/*",
    "Condition": { "StringEquals": { "iam:PassedToService": "lambda.amazonaws.com" } }
  }]
}</code></pre>

<h3>MaxSessionDuration and other role settings</h3>
<ul>
  <li><code>MaxSessionDuration</code>: 1 to 12 hours (default 1 h). It caps how long a caller may request with <code>DurationSeconds</code>. It doesn't apply to chained sessions (1 h) or to service-assumed roles, which the service manages.</li>
  <li><strong>Permissions boundary</strong> on a role caps what its permissions policies can grant (M05.03).</li>
  <li><strong>Path</strong> (for example <code>/app/</code>) groups roles so policies can target <code>role/app/*</code>.</li>
  <li><strong>Tags</strong> on the role become <code>aws:PrincipalTag</code> values for its sessions (ABAC, M05.08).</li>
</ul>` },

    { type: "examples", html: `
<h3>Example 1: assume a role with the CLI and read the output</h3>
<pre><code>$ aws sts assume-role \\
    --role-arn arn:aws:iam::444455556666:role/ReadOnlyAudit \\
    --role-session-name priya-audit-2025-10 \\
    --duration-seconds 3600 --profile academy-admin
{
    "Credentials": {
        "AccessKeyId": "ASIAXAMPLE7EXAMPLE2X",          &lt;- ASIA = temporary
        "SecretAccessKey": "wJalr…EXAMPLEKEY",
        "SessionToken": "IQoJb3JpZ2luX2Vj…very long…",  &lt;- must be sent with every call
        "Expiration": "2025-10-07T11:42:10+00:00"        &lt;- 1 hour from now
    },
    "AssumedRoleUser": {
        "AssumedRoleId": "AROAEXAMPLEID123:priya-audit-2025-10",
        "Arn": "arn:aws:sts::444455556666:assumed-role/ReadOnlyAudit/priya-audit-2025-10"
    }
}</code></pre>
<p>In practice you rarely copy these values by hand. A CLI profile with <code>role_arn</code> + <code>source_profile</code> does it for you and caches the credentials. The raw call is useful for understanding and debugging.</p>

<h3>Example 2: four trust policies you will write again and again</h3>
<p><strong>(a) EC2 instances may assume the role</strong> (attach it through an instance profile):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}</code></pre>
<p><strong>(b) Lambda execution role</strong>, restricted to functions in this account (protects against the confused deputy, M05.06):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "lambda.amazonaws.com" },
    "Action": "sts:AssumeRole",
    "Condition": { "StringEquals": { "aws:SourceAccount": "111122223333" } }
  }]
}</code></pre>
<p><strong>(c) Another account may assume the role, only with MFA:</strong></p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::111122223333:root" },
    "Action": "sts:AssumeRole",
    "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }
  }]
}</code></pre>
<p><code>arn:aws:iam::111122223333:root</code> means "the account 111122223333", not its root user: the account's administrators then decide which of their users and roles may assume it with their own identity policies.</p>
<p><strong>(d) GitHub Actions via OIDC</strong>, limited to one repository's <code>main</code> branch:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::111122223333:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike":   { "token.actions.githubusercontent.com:sub": "repo:acme/payments-api:ref:refs/heads/main" }
    }
  }]
}</code></pre>
<div class="callout warn">The <code>sub</code> condition is the security boundary. A trust policy that checks only <code>aud</code> lets <em>any</em> GitHub repository in the world assume your role. AWS now rejects new OIDC trust policies for GitHub that lack a <code>sub</code> condition, but older roles may still be exposed: audit them.</div>

<h3>Example 3: decode an EC2 authorization failure</h3>
<pre><code>$ aws ec2 run-instances …
An error occurred (UnauthorizedOperation): You are not authorized to perform this operation.
Encoded authorization failure message: 4dJx…long…

$ aws sts decode-authorization-message --encoded-message 4dJx… \\
    --query DecodedMessage --output text | jq '.context.action, .matchedStatements'
"iam:PassRole"
{ "items": [] }          &lt;- no statement allowed PassRole on the instance profile's role</code></pre>
<p>The decoded message names the exact action that failed, which here was not <code>ec2:RunInstances</code> but <code>iam:PassRole</code>.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Mechanism</th><th>Why</th></tr></thead>
<tbody>
<tr><td>App on EC2 reads from S3</td><td>Role + instance profile</td><td>Temporary, auto-rotated credentials via IMDSv2; nothing stored on disk</td></tr>
<tr><td>ECS service writes to DynamoDB and pulls a private ECR image</td><td>Task role (DynamoDB) + task execution role (ECR, logs)</td><td>Separates what the app may do from what the platform needs</td></tr>
<tr><td>GitHub Actions deploys with CDK</td><td>OIDC provider + role with <code>sub</code> condition; <code>AssumeRoleWithWebIdentity</code></td><td>No secrets in the CI system at all</td></tr>
<tr><td>Engineer needs prod access for an incident</td><td>IAM Identity Center permission set (a role) with MFA and a short session</td><td>Access is temporary, logged with the person's identity</td></tr>
<tr><td>Kubernetes pod reads Secrets Manager</td><td>EKS Pod Identity or IRSA</td><td>Per-pod least privilege instead of the node's role</td></tr>
<tr><td>Allow developers to create Lambda functions safely</td><td><code>iam:PassRole</code> scoped to <code>role/app/*</code> + <code>iam:PassedToService</code>; permissions boundary on roles they create</td><td>Prevents passing an admin role to their own code</td></tr>
<tr><td>Leaked session credentials from a misused instance</td><td>Revoke active sessions (<code>aws:TokenIssueTime</code> deny) + enforce IMDSv2</td><td>Kills stolen sessions without breaking legitimate users</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: create, assume and inspect a role", html: `
<p>Run in AWS CloudShell or with your <code>academy-admin</code> profile. Everything is free; delete the role at the end.</p>
<pre><code># 1. Who am I now?
aws sts get-caller-identity

# 2. A role your own account may assume (trust = this account), read-only on S3
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
cat &gt; trust.json &lt;&lt;EOF
{"Version":"2012-10-17","Statement":[{"Effect":"Allow",
 "Principal":{"AWS":"arn:aws:iam::$ACCOUNT:root"},"Action":"sts:AssumeRole"}]}
EOF
aws iam create-role --role-name academy-s3-reader \\
  --assume-role-policy-document file://trust.json --max-session-duration 3600
aws iam attach-role-policy --role-name academy-s3-reader \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
sleep 10   # IAM is eventually consistent: give the new role a few seconds

# 3. Assume it and export the credentials into this shell
CREDS=$(aws sts assume-role --role-arn arn:aws:iam::$ACCOUNT:role/academy-s3-reader \\
  --role-session-name demo-$(whoami) --query Credentials --output json)
export AWS_ACCESS_KEY_ID=$(echo "$CREDS" | jq -r .AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo "$CREDS" | jq -r .SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo "$CREDS" | jq -r .SessionToken)

# 4. Observe: the identity changed, S3 reads work, writes fail
aws sts get-caller-identity          # arn:aws:sts::…:assumed-role/academy-s3-reader/demo-…
aws s3 ls                            # works
aws iam list-users                   # AccessDenied: you gave up your own permissions

# 5. Back to yourself, then clean up
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
aws iam detach-role-policy --role-name academy-s3-reader \\
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
aws iam delete-role --role-name academy-s3-reader</code></pre>
<p>Notice the <code>sleep 10</code>: IAM changes are eventually consistent and can take a few seconds to be usable everywhere. Scripts that create a role and use it immediately are a classic source of flaky failures.</p>` },

    { type: "casestudy", title: "Case study: Fernway Retail removes keys from CI/CD", html: `
<p><strong>Situation.</strong> Fernway Retail runs 40 repositories on GitHub. Each deploys to AWS from GitHub Actions using an IAM user's access keys stored as repository secrets. There were 23 such users, most with <code>AdministratorAccess</code> "because deployments touch everything". A security review found three keys older than four years, one key still active for a contractor who had left, and no way to tell which pipeline made which change: every deployment appeared in CloudTrail as the same user, <code>ci-deployer</code>.</p>
<p><strong>Requirements.</strong> No long-term AWS secrets in GitHub. Each repository may deploy only its own stacks, only from <code>main</code> (production) or from any branch (sandbox). CloudTrail must show which repository and run made a change. The migration must not stop deliveries.</p>
<p><strong>Design.</strong></p>
<ol>
  <li>Create an IAM OIDC identity provider for <code>token.actions.githubusercontent.com</code> in each workload account (with CloudFormation StackSets).</li>
  <li>For each repository create a role <code>gha-&lt;repo&gt;-deploy</code>. The trust policy allows <code>sts:AssumeRoleWithWebIdentity</code> with <code>aud = sts.amazonaws.com</code> and <code>sub</code> limited to <code>repo:fernway/&lt;repo&gt;:ref:refs/heads/main</code> in production, or <code>repo:fernway/&lt;repo&gt;:*</code> in sandbox.</li>
  <li>Permissions: the pipeline role may only call CloudFormation and assume the CDK bootstrap roles (<code>cdk-*-deploy-role-*</code>). The CloudFormation execution role does the actual resource changes, and it has a permissions boundary.</li>
  <li>The workflow uses <code>aws-actions/configure-aws-credentials</code> with <code>role-to-assume</code> and a session name containing the run ID, so CloudTrail shows <code>assumed-role/gha-checkout-deploy/run-77812</code>.</li>
  <li>Old IAM users were deactivated (not deleted) for two weeks, then deleted once the new path had worked for every repository.</li>
</ol>
<table>
<thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>Long-term AWS keys in CI</td><td>23</td><td>0</td></tr>
<tr><td>Credential lifetime</td><td>Unlimited</td><td>1 hour</td></tr>
<tr><td>Blast radius of one compromised repo</td><td>Admin in every account</td><td>That repo's stacks in one account</td></tr>
<tr><td>Traceability in CloudTrail</td><td>One shared user</td><td>Repo + run ID per change</td></tr>
</tbody></table>
<p><strong>What went wrong on the way.</strong> The first sandbox trust policy used <code>"sub": "repo:fernway/*"</code>, which also matched pull requests from forks of public repositories. A review caught it, and the policy now restricts to branches of private repositories. Lesson: <strong>the trust policy's conditions are the real access control</strong>. Write them as carefully as permissions policies, and test them with a deliberately unauthorised repository.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Application on EC2 needs access to S3/DynamoDB"</td><td>IAM role attached via an <strong>instance profile</strong> (never access keys on the instance)</td></tr>
<tr><td>"ECS task needs to access…" / "can't pull image"</td><td>Task role / task execution role</td></tr>
<tr><td>"Grant temporary access", "credentials must expire automatically"</td><td>Role + STS</td></tr>
<tr><td>"Mobile app users need AWS credentials"</td><td>Cognito identity pool → <code>AssumeRoleWithWebIdentity</code> (M05.10)</td></tr>
<tr><td>"Users authenticate with corporate SAML IdP"</td><td>IAM Identity Center (or <code>AssumeRoleWithSAML</code>)</td></tr>
<tr><td>"CLI user must use MFA for sensitive actions"</td><td><code>GetSessionToken</code> with MFA, policy condition <code>aws:MultiFactorAuthPresent</code></td></tr>
<tr><td>"Developers may create Lambda functions but must not escalate privileges"</td><td>Scope <code>iam:PassRole</code> + permissions boundary</td></tr>
<tr><td>"Credentials of a role were compromised"</td><td>Revoke active sessions (<code>aws:TokenIssueTime</code>), then fix the root cause</td></tr>
</tbody></table>
<p><strong>Distractors:</strong> "Store access keys in the AMI / user data / environment variables / Secrets Manager for the app to read" (a role is always better for AWS API access); "Create an IAM user for the EC2 instance"; "Use the root user's keys". Note that Secrets Manager <em>is</em> right for non-AWS secrets such as database passwords (M07).</p>
<table>
<thead><tr><th>IAM user</th><th>IAM role</th></tr></thead>
<tbody>
<tr><td>One person or legacy app</td><td>Anyone or anything trusted</td></tr>
<tr><td>Long-term password and/or access keys (AKIA…)</td><td>Temporary credentials only (ASIA…)</td></tr>
<tr><td>Rotate manually</td><td>Expire automatically</td></tr>
<tr><td>Avoid for humans (use Identity Center) and workloads (use roles)</td><td>Default choice</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>IAM is eventually consistent.</strong> Newly created roles and policy changes can take seconds to take effect. Automation should retry on AccessDenied immediately after creating IAM resources, and IaC tools do this for you.</li>
  <li><strong>Session names are your audit trail.</strong> Enforce them with the trust condition <code>sts:RoleSessionName</code> (for example, must equal <code>\${aws:username}</code>) or use <code>sts:SourceIdentity</code> for humans hopping through several roles.</li>
  <li><strong>Watch PassRole and trust policies as closely as admin policies.</strong> Privilege-escalation paths almost always involve one of: <code>iam:PassRole</code> on <code>*</code>, the ability to edit a trust policy (<code>iam:UpdateAssumeRolePolicy</code>), or creating policy versions (<code>iam:CreatePolicyVersion</code>).</li>
  <li><strong>Prefer one role per workload,</strong> not one shared "app-role" for the whole account. Shared roles make least privilege impossible and incidents hard to scope.</li>
  <li><strong>Long sessions are a trade-off.</strong> 12-hour console sessions are convenient but a stolen session cookie lives longer. For production admin roles, 1–2 hours plus re-authentication is a common balance.</li>
  <li><strong>Troubleshooting checklist for "can't assume role":</strong> (1) caller lacks <code>sts:AssumeRole</code> on the ARN; (2) trust policy doesn't name the caller or a condition fails (MFA, External ID, tag); (3) an SCP in either account denies it; (4) <code>DurationSeconds</code> exceeds <code>MaxSessionDuration</code> or the 1 h chaining limit; (5) the Region's STS endpoint is disabled; (6) the role was just created (consistency delay).</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>A role has no long-term credentials; trusted principals assume it and STS issues temporary credentials (ASIA… key, secret, session token, expiry).</li>
  <li>The <strong>trust policy</strong> says who may assume the role; the <strong>permissions policies</strong> say what the session may do. Both must be right.</li>
  <li>When you use a role you have only its permissions, not yours plus its.</li>
  <li>AssumeRole defaults to 1 h and is capped by <code>MaxSessionDuration</code> (up to 12 h); role chaining is capped at 1 h.</li>
  <li>Use <code>AssumeRoleWithWebIdentity</code> for OIDC (GitHub Actions, EKS IRSA, Cognito) and <code>AssumeRoleWithSAML</code> or Identity Center for SAML; <code>GetSessionToken</code> adds MFA for IAM users.</li>
  <li>EC2 uses instance profiles via IMDSv2; ECS separates the task role (app) from the execution role (agent); Lambda has an execution role; EKS uses IRSA or Pod Identity.</li>
  <li><code>iam:PassRole</code> controls who can hand a role to a service: scope it, or it becomes a privilege-escalation path.</li>
  <li>Revoke stolen role sessions with "Revoke active sessions" (a deny on <code>aws:TokenIssueTime</code>), not by deleting the role.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.05-d1", q: "Long-term IAM user access keys start with <code>AKIA</code>. Which four-letter prefix do temporary STS access keys start with?", answers: ["ASIA"], hint: "Look at the AccessKeyId in an assume-role response.", explain: "ASIA = temporary credentials from STS; AKIA = long-term keys of an IAM user (or root)." },
    { id: "M05.05-d2", q: "What is the maximum session duration, in hours, when you assume a role using credentials obtained from another role (role chaining)?", answers: ["1", "1h", "one"], explain: "Role chaining is capped at 1 hour regardless of the target role's MaxSessionDuration." },
    { id: "M05.05-d3", q: "What is the largest value, in hours, that a role's <code>MaxSessionDuration</code> can be set to?", answers: ["12", "12h"], explain: "MaxSessionDuration ranges from 1 to 12 hours; the default is 1 hour." },
    { id: "M05.05-d4", q: "Which STS API does a GitHub Actions workflow call to exchange its OIDC token for AWS credentials? (API name)", answers: ["AssumeRoleWithWebIdentity", "sts:AssumeRoleWithWebIdentity"], explain: "OIDC tokens (GitHub, GitLab, EKS service accounts, Cognito) use AssumeRoleWithWebIdentity." },
    { id: "M05.05-d5", q: "Which IAM action must a developer have to launch an EC2 instance with an instance profile, or to create a Lambda function with an execution role? (format service:Action)", answers: ["iam:PassRole"], explain: "Handing a role to a service requires iam:PassRole on that role." },
    { id: "M05.05-d6", q: "An ECS task fails to start with <em>CannotPullContainerError: access denied</em> on a private ECR repository. Which role needs fixing: task role or task execution role?", answers: ["task execution role", "execution role", "execution"], explain: "The execution role is used by the ECS agent/Fargate to pull images and send logs; the task role is for application code." },
    { id: "M05.05-d7", q: "Which global condition key does the \"Revoke active sessions\" policy compare against the revocation time?", answers: ["aws:TokenIssueTime", "TokenIssueTime"], explain: "AWSRevokeOlderSessions denies all actions when aws:TokenIssueTime is earlier than the revocation timestamp." },
    { id: "M05.05-d8", q: "Which STS API returns MFA-authenticated temporary credentials for an IAM user so that CLI calls satisfy <code>aws:MultiFactorAuthPresent</code>?", answers: ["GetSessionToken", "sts:GetSessionToken"], explain: "GetSessionToken with --serial-number and --token-code." }
  ],
  check: [
    { id: "M05.05-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "An application running on Amazon EC2 must read objects from an S3 bucket in the same account. What is the MOST secure way to provide credentials?",
      options: [
        { t: "Create an IAM role with read access to the bucket and attach it to the instance through an instance profile", c: true, why: "The SDK gets temporary, automatically rotated credentials from IMDS. Nothing long-lived is stored on the instance." },
        { t: "Create an IAM user, and store its access keys in the application's configuration file", c: false, why: "Long-term keys on disk can be copied and never expire." },
        { t: "Store an IAM user's access keys in AWS Secrets Manager and read them at startup", c: false, why: "Better than a file, but still long-term AWS keys. Roles remove the need for them entirely." },
        { t: "Pass the access keys in the instance's user data", c: false, why: "User data is readable from IMDS by anyone on the instance and visible in the console." }
      ] },
    { id: "M05.05-k2", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A role's permissions policy allows <code>s3:*</code>. A user in the same account has <code>sts:AssumeRole</code> permission on the role, but every AssumeRole call fails with AccessDenied. What is the MOST likely cause?",
      options: [
        { t: "The role's trust policy does not allow the user (or the user's account) as a principal", c: true, why: "Both sides must agree: the caller's permission AND the role's trust policy." },
        { t: "The role's permissions policy is too broad", c: false, why: "Permissions policies don't affect whether the role can be assumed." },
        { t: "The user needs s3:* in their own policy", c: false, why: "The session uses the role's permissions, not the user's." },
        { t: "STS must be enabled in the IAM console first", c: false, why: "STS is always available (Regional endpoints may be deactivated, but the global one works); the error points to the trust policy." }
      ] },
    { id: "M05.05-k3", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Developers must be able to create Lambda functions, but security wants to stop them from giving a function more permissions than the developers themselves have. Which control addresses this MOST directly?",
      options: [
        { t: "Restrict <code>iam:PassRole</code> to approved roles (for example <code>role/app/*</code>) with the condition <code>iam:PassedToService = lambda.amazonaws.com</code>", c: true, why: "PassRole decides which roles a developer can hand to a service; scoping it closes the escalation path." },
        { t: "Remove <code>lambda:CreateFunction</code> from all developers", c: false, why: "That blocks the requirement instead of securing it." },
        { t: "Enable AWS CloudTrail", c: false, why: "CloudTrail records the escalation but doesn't prevent it." },
        { t: "Use a service-linked role for Lambda", c: false, why: "Lambda execution roles are service roles you define; service-linked roles don't solve PassRole scoping." }
      ] },
    { id: "M05.05-k4", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "Which TWO statements about temporary security credentials issued by STS are correct?",
      options: [
        { t: "They include a session token that must be sent with each request", c: true, why: "Without the token, the access key and secret are rejected." },
        { t: "They expire automatically and don't need to be rotated", c: true, why: "Expiry is built in; there is nothing to rotate or delete." },
        { t: "Their access key IDs start with AKIA", c: false, why: "AKIA is long-term; temporary keys start with ASIA." },
        { t: "They grant the union of the caller's permissions and the role's permissions", c: false, why: "The session has only the role's permissions (further limited by any session policy)." },
        { t: "They can be revoked individually by deleting them in the IAM console", c: false, why: "You revoke role sessions with an aws:TokenIssueTime deny (Revoke active sessions)." }
      ] },
    { id: "M05.05-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A GitHub Actions workflow must deploy to AWS without storing any AWS secrets in GitHub. What should the architect configure?",
      options: [
        { t: "An IAM OIDC identity provider for GitHub and a role whose trust policy allows <code>sts:AssumeRoleWithWebIdentity</code> with <code>aud</code> and <code>sub</code> conditions for the repository", c: true, why: "The workflow exchanges its short-lived OIDC token for 1-hour role credentials; the sub condition limits it to the right repo and branch." },
        { t: "An IAM user whose access keys are stored as encrypted GitHub secrets", c: false, why: "Still long-term AWS secrets, which is exactly what the requirement forbids." },
        { t: "A SAML 2.0 identity provider for GitHub", c: false, why: "GitHub Actions issues OIDC tokens, not SAML assertions." },
        { t: "A Cognito user pool for the workflow", c: false, why: "User pools authenticate app users; they are not the mechanism for CI federation." }
      ] },
    { id: "M05.05-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "An admin script assumes role A (MaxSessionDuration 12 h) using credentials from an Identity Center session, then uses role A's credentials to assume role B in another account with <code>--duration-seconds 14400</code>. The second call fails. Why?",
      options: [
        { t: "Role chaining limits the session to 1 hour", c: true, why: "Credentials obtained from a role used to assume another role are capped at 3,600 seconds." },
        { t: "Role B's trust policy must list role A by name only", c: false, why: "Trust policies can name the role ARN or the account; this is not the cause of a duration error." },
        { t: "Cross-account roles can't be assumed from Identity Center sessions", c: false, why: "They can; that is a common pattern." },
        { t: "DurationSeconds must be a multiple of 3,600", c: false, why: "Any value from 900 up to the allowed maximum is accepted." }
      ] }
  ],
  cards: ["fc-M05-5-01", "fc-M05-5-02", "fc-M05-5-03", "fc-M05-5-04", "fc-M05-5-05", "fc-M05-5-06", "fc-M05-5-07", "fc-M05-5-08", "fc-M05-5-09", "fc-M05-5-10", "fc-M05-5-11"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"AWS Identity and Access Management\" (PDF p603–607): users, groups, roles and temporary access",
    "IAM User Guide: <em>IAM roles</em>, <em>Roles terms and concepts</em>, <em>Revoking IAM role temporary security credentials</em>",
    "IAM User Guide: <em>Granting a user permissions to pass a role to an AWS service</em> (iam:PassRole)",
    "AWS STS API Reference and <em>Comparing the AWS STS API operations</em>",
    "Amazon ECS Developer Guide: <em>Task IAM role</em> and <em>Task execution IAM role</em>",
    "GitHub Docs: <em>Configuring OpenID Connect in Amazon Web Services</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-5-01", front: "Trust policy vs permissions policy of a role?", back: "Trust policy (resource policy on the role, has Principal): WHO may assume it. Permissions policies (identity policies): WHAT the session may do." },
  { id: "fc-M05-5-02", front: "AKIA vs ASIA access keys?", back: "AKIA = long-term (IAM user/root). ASIA = temporary from STS; always comes with a session token and an expiry." },
  { id: "fc-M05-5-03", front: "AssumeRole session duration limits?", back: "Default 1 h; 15 min up to the role's MaxSessionDuration (1–12 h). Role chaining: max 1 h." },
  { id: "fc-M05-5-04", front: "Which STS API for: OIDC token? SAML assertion? MFA for an IAM user?", back: "AssumeRoleWithWebIdentity · AssumeRoleWithSAML · GetSessionToken." },
  { id: "fc-M05-5-05", front: "What is an instance profile?", back: "A container for one IAM role that EC2 can use; the SDK on the instance gets the role's credentials from IMDS (use IMDSv2)." },
  { id: "fc-M05-5-06", front: "ECS task role vs task execution role?", back: "Task role: permissions for your app code. Execution role: for the ECS agent/Fargate to pull ECR images, write logs and fetch secrets for the task definition." },
  { id: "fc-M05-5-07", front: "Why is iam:PassRole dangerous?", back: "Whoever can pass any role to a service (Lambda, EC2, CloudFormation) can run code with that role's permissions → privilege escalation. Scope it to specific roles + iam:PassedToService." },
  { id: "fc-M05-5-08", front: "Service role vs service-linked role?", back: "Service role: you create and edit it. Service-linked role: predefined by the service (AWSServiceRoleFor…), not editable, not restricted by SCPs." },
  { id: "fc-M05-5-09", front: "How do you revoke stolen role session credentials?", back: "Role → Revoke active sessions: inline deny when aws:TokenIssueTime is before now. Old sessions fail; new ones work." },
  { id: "fc-M05-5-10", front: "When you assume a role, what permissions do you have?", back: "Only the role's (intersected with any session policy, SCPs, boundary). You give up your own permissions for that session." },
  { id: "fc-M05-5-11", front: "What must a GitHub OIDC trust policy always check?", back: "aud = sts.amazonaws.com AND sub = repo:&lt;org&gt;/&lt;repo&gt;:… (repository and branch/environment). Without sub, any repo could assume it." }
);
// ================================================================== 06_cross_account.js
/* ---------------------------------------------------------------- M05.06 Cross-account access patterns */
var DG_0506_PATTERNS = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0506at m0506ad">
  <title id="m0506at">Role assumption versus resource-based policy</title>
  <desc id="m0506ad">Top: a principal in account A assumes a role in account B and then acts inside account B with only that role's permissions. Bottom: a principal in account A calls a bucket in account B directly; the bucket policy in B allows account A, and the principal's own identity policy in A must also allow the action, so the principal keeps its own permissions in A at the same time.</desc>
  <defs><marker id="m0506a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="22">Pattern 1 · Role assumption (switch identity)</text>
  <rect class="dg-region" x="12" y="34" width="250" height="100" rx="10"/>
  <text class="dg-ta" x="24" y="54">Account A (111122223333)</text>
  <rect class="dg-info" x="24" y="66" width="180" height="52" rx="6"/><text class="dg-t" x="36" y="88">App role in A</text><text class="dg-ts" x="36" y="106">allowed sts:AssumeRole on B</text>
  <rect class="dg-region" x="350" y="34" width="398" height="100" rx="10"/>
  <text class="dg-ta" x="362" y="54">Account B (444455556666)</text>
  <rect class="dg-edge" x="362" y="66" width="170" height="52" rx="6"/><text class="dg-t" x="374" y="88">Role in B</text><text class="dg-ts" x="374" y="106">trust: account A</text>
  <rect class="dg-good" x="590" y="66" width="146" height="52" rx="6"/><text class="dg-t" x="602" y="88">Resources</text><text class="dg-ts" x="602" y="106">in B</text>
  <path class="dg-line" d="M204 92 H358" marker-end="url(#m0506a-ar)"/>
  <text class="dg-ts" x="226" y="84">AssumeRole</text>
  <path class="dg-line" d="M532 92 H586" marker-end="url(#m0506a-ar)"/>
  <text class="dg-ts" x="24" y="152">While using the role: only the role's permissions in B; nothing from A.</text>

  <text class="dg-tb" x="12" y="186">Pattern 2 · Resource-based policy (keep identity)</text>
  <rect class="dg-region" x="12" y="198" width="250" height="90" rx="10"/>
  <text class="dg-ta" x="24" y="218">Account A</text>
  <rect class="dg-info" x="24" y="228" width="180" height="48" rx="6"/><text class="dg-t" x="36" y="248">App role in A</text><text class="dg-ts" x="36" y="266">identity policy allows</text>
  <rect class="dg-region" x="350" y="198" width="398" height="90" rx="10"/>
  <text class="dg-ta" x="362" y="218">Account B</text>
  <rect class="dg-good" x="362" y="228" width="374" height="48" rx="6"/><text class="dg-t" x="374" y="248">S3 bucket / KMS key / SQS queue in B</text><text class="dg-ts" x="374" y="266">resource policy: Principal = account A (or the role)</text>
  <path class="dg-line" d="M204 252 H358" marker-end="url(#m0506a-ar)"/>
  <text class="dg-ts" x="226" y="244">direct call</text>
</svg>
<figcaption>Figure M05-6a. The two core cross-account patterns. With a role the caller changes identity; with a resource-based policy the caller keeps its own identity and permissions, but BOTH accounts must allow the call.</figcaption>
</figure>`;

var DG_0506_DEPUTY = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0506bt m0506bd">
  <title id="m0506bt">The confused deputy problem and the External ID fix</title>
  <desc id="m0506bd">A SaaS vendor account assumes roles in customer accounts. An attacker who is also a customer of the vendor enters the victim's role ARN into the vendor's console. Without an External ID the vendor, acting as a trusted deputy, assumes the victim's role on the attacker's behalf. With an External ID that the vendor generates per customer and the victim's trust policy requires, the vendor sends the attacker's External ID, the condition fails and the call is denied.</desc>
  <defs><marker id="m0506b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-bad" x="12" y="20" width="200" height="66" rx="8"/>
  <text class="dg-tb" x="24" y="42">Attacker</text>
  <text class="dg-ts" x="24" y="60">also a customer of the vendor</text>
  <text class="dg-ts" x="24" y="76">enters the VICTIM's role ARN</text>

  <rect class="dg-edge" x="280" y="20" width="200" height="66" rx="8"/>
  <text class="dg-tb" x="292" y="42">SaaS vendor (deputy)</text>
  <text class="dg-ts" x="292" y="60">trusted by many customers</text>
  <text class="dg-ts" x="292" y="76">calls sts:AssumeRole</text>

  <rect class="dg-good" x="548" y="20" width="200" height="66" rx="8"/>
  <text class="dg-tb" x="560" y="42">Victim's account</text>
  <text class="dg-ts" x="560" y="60">role trusts the vendor's</text>
  <text class="dg-ts" x="560" y="76">account</text>

  <path class="dg-line" d="M212 52 H276" marker-end="url(#m0506b-ar)"/>
  <path class="dg-line" d="M480 52 H544" marker-end="url(#m0506b-ar)"/>

  <rect class="dg-bad" x="12" y="104" width="736" height="48" rx="8"/>
  <text class="dg-t" x="24" y="124">Without External ID: the trust policy only checks "is it the vendor's account?" → yes → the</text>
  <text class="dg-t" x="24" y="142">vendor reads the victim's data and shows it to the attacker. The deputy was confused.</text>

  <rect class="dg-good" x="12" y="166" width="736" height="120" rx="8"/>
  <text class="dg-tb" x="24" y="188">With External ID</text>
  <text class="dg-t" x="24" y="210">1. The vendor generates a unique External ID per customer and shows it in that customer's console.</text>
  <text class="dg-t" x="24" y="230">2. The customer's trust policy requires Condition sts:ExternalId = their value.</text>
  <text class="dg-t" x="24" y="250">3. The vendor always sends the External ID of the customer who is logged in.</text>
  <text class="dg-t" x="24" y="270">4. The attacker's session carries the attacker's ID → condition fails → AccessDenied.</text>
</svg>
<figcaption>Figure M05-6b. The confused deputy: a trusted intermediary is tricked into using its access for someone else. The External ID binds each role to one customer relationship. It is not a secret; it only has to be unique and controlled by the vendor.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.06", title: "Cross-account access patterns", level: 300, minutes: 55,
  objectives: [
    "Choose between role assumption, resource-based policies and AWS RAM sharing for a cross-account requirement",
    "Write both sides of a cross-account grant (identity policy plus trust or resource policy), including cross-account KMS",
    "Explain the confused-deputy problem and prevent it with sts:ExternalId for third parties and aws:SourceArn / aws:SourceAccount for AWS services",
    "Use organisation-wide conditions such as aws:PrincipalOrgID to build simple data perimeters",
    "Design hub-and-spoke security, audit and central-logging access across many accounts"
  ],
  sections: [
    { type: "why", html: `
<p>Real AWS estates are not one account. AWS's own guidance (M06) is to separate workloads, environments and functions into many accounts: production, staging, a log archive, a security tooling account, shared networking, a data lake. The moment you do that, you need controlled ways for identities in one account to reach resources in another. A pipeline in a tooling account deploys to prod. Every account sends logs to one bucket. The security team audits all accounts. An analytics account reads a data-lake bucket. A third-party monitoring vendor reads your CloudWatch metrics.</p>
<p>Each of these can be built in two or three different ways, and the differences matter: who keeps which permissions, who owns uploaded objects, how much you trust the other side, and how a mistake could expose data. The exam tests this repeatedly with "another AWS account", "a third-party company" and "across the organization" scenarios. In real work, cross-account access is where most accidental data exposure happens, so getting the patterns right is a core architect skill.</p>` },

    { type: "concept", title: "Concept: the cross-account rule and the core patterns", html: DG_0506_PATTERNS + `
<h3>The rule: both accounts must agree</h3>
<p>Inside one account, a resource-based policy <em>or</em> an identity-based policy can grant access (M05.04). <strong>Across accounts, both sides must allow the request</strong>:</p>
<ul>
  <li>The <strong>trusting</strong> account (which owns the role or resource) must allow the other account or principal, in a trust policy or resource policy.</li>
  <li>The <strong>trusted</strong> account (where the caller lives) must allow its own principal to make the call, in an identity policy.</li>
</ul>
<p>Naming account A in B's policy delegates the decision to A's administrators: B says "I trust account A", and A decides which of its principals may use that trust. You can be more specific by naming the role ARN in A instead of the account.</p>

<h3>Pattern 1: role assumption</h3>
<p>The caller assumes a role in the target account (M05.05) and works there with that role's permissions. Humans switch role in the console; software uses STS or CLI profiles.</p>
<ul>
  <li><strong>Works for every service and API</strong>, because the caller simply becomes a principal of the target account.</li>
  <li>The target account fully controls what the role can do, and CloudTrail in the target account records the assumed-role session.</li>
  <li>The caller <strong>gives up its own permissions</strong> while using the role, so it can't read from account A and write to account B with one set of credentials.</li>
</ul>

<h3>Pattern 2: resource-based policies</h3>
<p>The resource itself (bucket, key, queue, topic, function, repository, secret) has a policy that names the other account or principal. The caller keeps its own identity.</p>
<table>
<thead><tr><th>Service</th><th>Resource policy</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Amazon S3</td><td>Bucket policy</td><td>Object Ownership "Bucket owner enforced" (the default for new buckets) makes the bucket owner own all objects and disables ACLs</td></tr>
<tr><td>AWS KMS</td><td>Key policy (+ grants)</td><td>Key policy must allow the other account <em>and</em> the other account's identity policy must allow the role; AWS managed keys can't be shared cross-account, so use a customer managed key</td></tr>
<tr><td>Amazon SQS / SNS</td><td>Queue / topic policy</td><td>Typical for SNS → SQS fan-out across accounts</td></tr>
<tr><td>AWS Lambda</td><td>Function policy (<code>lambda:AddPermission</code>)</td><td>Lets another account, or a service like S3 or EventBridge, invoke the function</td></tr>
<tr><td>Amazon ECR</td><td>Repository policy</td><td>Lets other accounts pull images</td></tr>
<tr><td>Secrets Manager</td><td>Resource policy</td><td>Secret must use a customer managed KMS key shared to the other account</td></tr>
<tr><td>EventBridge</td><td>Event bus policy</td><td>Central event bus receiving events from many accounts</td></tr>
</tbody></table>

<h3>Role vs resource policy: how to choose</h3>
<table>
<thead><tr><th>Question</th><th>Role assumption</th><th>Resource-based policy</th></tr></thead>
<tbody>
<tr><td>Does the caller keep its own permissions?</td><td>No</td><td><strong>Yes</strong>: useful for "read from A, write to B"</td></tr>
<tr><td>Does the service support it?</td><td>Always</td><td>Only services with resource policies</td></tr>
<tr><td>Who controls the permissions?</td><td>The target account (the role's policies)</td><td>Both: resource policy in B, identity policy in A</td></tr>
<tr><td>Object ownership (S3)</td><td>Objects written by the role belong to B</td><td>With ACLs enabled, uploads could belong to the writer's account; use "Bucket owner enforced"</td></tr>
<tr><td>Good for</td><td>Humans, broad admin/audit access, many APIs</td><td>Data sharing, cross-account pipelines, central log/event targets</td></tr>
</tbody></table>

<h3>Pattern 3: AWS Resource Access Manager (RAM)</h3>
<p>Some resources can't be accessed by policy at all; instead they are <strong>shared</strong> so they appear inside the other account. AWS RAM shares resources with specific accounts, OUs or the whole organisation: VPC subnets (VPC sharing), Transit Gateways, Route 53 Resolver rules, License Manager configurations, Aurora DB clusters (for cloning), AWS Network Firewall policies, IPAM pools and more. With sharing inside AWS Organizations enabled, invitations are accepted automatically.</p>

<h3>Pattern 4: organisation-wide conditions</h3>
<p>Instead of listing 200 account IDs in a bucket policy, use <code>aws:PrincipalOrgID</code> ("any principal from my organisation") or <code>aws:PrincipalOrgPaths</code> ("any principal from this OU"). New accounts are covered automatically and departing accounts lose access the moment they leave the organisation.</p>` },

    { type: "concept", title: "Concept: the confused deputy and data perimeters", html: DG_0506_DEPUTY + `
<h3>The confused deputy, step by step</h3>
<p>A <strong>deputy</strong> is a program that has permission to act on behalf of others: a SaaS vendor, or an AWS service. It becomes <em>confused</em> when an attacker tricks it into using that authority for the attacker's benefit.</p>
<ol>
  <li>A monitoring vendor asks each customer to create a role that trusts the vendor's AWS account, and to paste the role ARN into the vendor's web console.</li>
  <li>The attacker signs up as a customer and pastes the <em>victim's</em> role ARN (ARNs are not secret: they leak in screenshots, docs and support tickets).</li>
  <li>The vendor calls <code>sts:AssumeRole</code> on that ARN. The victim's trust policy checks only "is this the vendor's account?", so the call succeeds.</li>
  <li>The vendor now displays the victim's data in the attacker's dashboard.</li>
</ol>
<p><strong>Fix for third parties: External ID.</strong> The vendor generates a unique ID per customer, shows it in that customer's console, and always passes the logged-in customer's ID in <code>AssumeRole</code>. The customer adds <code>"Condition": {"StringEquals": {"sts:ExternalId": "&lt;their-id&gt;"}}</code>. The attacker can't make the vendor send the victim's ID, so the attack fails. Key facts:</p>
<ul>
  <li>The <strong>vendor</strong> generates it, not the customer, so that a customer can't choose another customer's ID.</li>
  <li>It is <strong>not a secret</strong>; it doesn't need to be protected like a password. It needs to be unique and controlled by the vendor.</li>
  <li>It is only for third parties assuming roles in your account, not for your own accounts.</li>
</ul>
<p><strong>Fix for AWS services: aws:SourceArn and aws:SourceAccount.</strong> When you allow a service principal such as <code>sns.amazonaws.com</code> or <code>s3.amazonaws.com</code> to write to your queue or invoke your function, every customer's resources use the same service principal. Add conditions so only <em>your</em> resource can use the permission:</p>
<pre><code>"Condition": {
  "ArnEquals":    { "aws:SourceArn": "arn:aws:sns:eu-west-1:111122223333:orders" },
  "StringEquals": { "aws:SourceAccount": "111122223333" }
}</code></pre>

<h3>Data perimeters (introduction)</h3>
<p>A <strong>data perimeter</strong> is a set of preventive guardrails ensuring that only <em>trusted identities</em> access <em>trusted resources</em> from <em>expected networks</em>. It is built from the policy types you already know:</p>
<table>
<thead><tr><th>Perimeter</th><th>Question</th><th>Typical control</th></tr></thead>
<tbody>
<tr><td>Identity perimeter</td><td>Only my organisation's principals can access my resources</td><td>Resource policies / RCPs with <code>aws:PrincipalOrgID</code> (with exceptions for AWS services: <code>aws:PrincipalIsAWSService</code>)</td></tr>
<tr><td>Resource perimeter</td><td>My identities can only access my organisation's resources</td><td>SCPs with <code>aws:ResourceOrgID</code> (stops copying data to a personal bucket)</td></tr>
<tr><td>Network perimeter</td><td>Access only from my networks</td><td>Policies with <code>aws:SourceVpc</code>, <code>aws:SourceVpce</code>, <code>aws:SourceIp</code>; VPC endpoint policies</td></tr>
</tbody></table>
<p>You'll build these in M06 (SCPs/RCPs) and M10 (VPC endpoint policies). For now, know that <code>aws:PrincipalOrgID</code> in a bucket policy is the simplest and highest-value step.</p>` },

    { type: "workflow", title: "Workflow: designing a cross-account access path", html: `
<ol class="flow">
  <li><strong>Name the parties.</strong> Who is the caller (human, workload, AWS service, third party)? Which account owns the resource? Are both in your organisation?</li>
  <li><strong>Pick the pattern.</strong> Does the caller need to keep its own permissions (copy data from A to B)? Does the resource type support a resource policy? Does the resource need to appear inside the other account (subnet, TGW → RAM)? Is it a human (→ Identity Center permission set, M05.07)?</li>
  <li><strong>Write the trusting side</strong> (trust policy or resource policy) with the narrowest principal: a specific role ARN, or an account plus <code>aws:PrincipalOrgID</code>.</li>
  <li><strong>Add confused-deputy protection</strong> where relevant: <code>sts:ExternalId</code> for third parties; <code>aws:SourceArn</code>/<code>aws:SourceAccount</code> for service principals.</li>
  <li><strong>Write the trusted side:</strong> the caller's identity policy allowing the specific action on the specific ARN in the other account.</li>
  <li><strong>Check the extra layers:</strong> KMS key policies for encrypted data, SCPs/RCPs in both accounts, VPC endpoint policies on the network path, S3 Block Public Access and Object Ownership.</li>
  <li><strong>Test and verify:</strong> test with the real principal (or the IAM policy simulator), then confirm with IAM Access Analyzer that the resource is shared only with the intended accounts (M05.09).</li>
  <li><strong>Codify:</strong> deploy both sides with IaC (CloudFormation StackSets across accounts) so access is reviewed in pull requests and reproducible.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: hub-and-spoke patterns", html: `
<h3>Security / audit hub</h3>
<p>The security tooling account holds an <code>Auditor</code> role (humans, via Identity Center) and automation. Every workload account has a <code>SecurityAudit</code> role (read-only, AWS managed policy <code>SecurityAudit</code>) trusting the security account's specific role ARNs. Security tools (GuardDuty, Security Hub, Config aggregators) use <strong>delegated administrator</strong> features of AWS Organizations instead of hand-made roles wherever possible.</p>

<h3>Central log archive</h3>
<p>CloudTrail organisation trails, VPC Flow Logs, ALB access logs and Config snapshots go to a bucket in a dedicated log-archive account. The bucket policy allows the <em>services</em> to write (with <code>aws:SourceArn</code>/<code>aws:SourceAccount</code> or <code>aws:SourceOrgID</code> conditions), uses "Bucket owner enforced", requires TLS, and denies deletes. Readers (security analysts, Athena in the security account) get read-only access.</p>

<h3>Deployment hub</h3>
<p>A tooling/CI account's pipeline role assumes a <code>Deploy</code> role in each target account (or uses CDK bootstrap roles that trust the tooling account). Artifacts in the tooling account's S3 bucket and KMS key are shared to target accounts by resource policy.</p>

<h3>Cross-account KMS: the three-part check</h3>
<p>Encrypted data is where cross-account designs most often fail. For a role in account A to decrypt with a key in account B:</p>
<ol>
  <li><strong>Key policy in B</strong> allows account A (or the role ARN) the needed actions (<code>kms:Decrypt</code>, <code>kms:GenerateDataKey</code>…).</li>
  <li><strong>Identity policy in A</strong> allows the role those KMS actions on the key's ARN in B.</li>
  <li>The data service also authorises the request: for example, the bucket policy for <code>s3:GetObject</code>.</li>
</ol>
<p>Alternatively, B can create a <strong>grant</strong> for the principal, which is useful for temporary or programmatic delegation. Remember: AWS managed keys (<code>aws/s3</code>) can't be used cross-account, so shared data must use a customer managed key.</p>` },

    { type: "examples", html: `
<h3>Example 1: cross-account S3 read (both sides)</h3>
<p>Account B (444455556666) owns <code>datalake-curated</code>. The analytics role in account A (111122223333) must read it.</p>
<p><strong>Bucket policy in B:</strong></p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AnalyticsReadFromAccountA",
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::111122223333:role/analytics-reader" },
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::datalake-curated",
      "arn:aws:s3:::datalake-curated/*"
    ]
  }]
}</code></pre>
<p><strong>Identity policy on the role in A:</strong></p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::datalake-curated",
      "arn:aws:s3:::datalake-curated/*"
    ]
  }]
}</code></pre>
<p>If either side is missing, the request is denied. If the bucket uses SSE-KMS, add the key-policy and identity-policy KMS permissions as well.</p>

<h3>Example 2: a third-party role with External ID</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::999988887777:root" },
    "Action": "sts:AssumeRole",
    "Condition": { "StringEquals": { "sts:ExternalId": "acme-7f3c2a91-4d" } }
  }]
}</code></pre>
<p>Account 999988887777 is the vendor's. The permissions policy attached to this role should be the vendor's documented minimum (for example <code>CloudWatchReadOnlyAccess</code>), never <code>AdministratorAccess</code>.</p>

<h3>Example 3: SNS topic in A fans out to an SQS queue in B</h3>
<p><strong>Queue policy in B</strong> (protects against any other topic using the SNS service principal):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "sns.amazonaws.com" },
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:eu-west-1:444455556666:orders-intake",
    "Condition": { "ArnEquals": { "aws:SourceArn": "arn:aws:sns:eu-west-1:111122223333:orders" } }
  }]
}</code></pre>
<p>Then subscribe the queue to the topic. The subscription must be confirmed by the queue owner, or created by the queue owner's account.</p>

<h3>Example 4: one bucket for the whole organisation</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "OrgReadOnly",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::acme-shared-artifacts/*",
    "Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" } }
  }]
}</code></pre>
<p><code>"Principal": "*"</code> looks alarming, but the condition limits it to principals from your organisation. Block Public Access does not treat this as public, and IAM Access Analyzer won't flag it as external access when your organisation is the zone of trust. Each account's principals still need identity permissions to read.</p>

<h3>Example 5: cross-account KMS key policy statement (in B)</h3>
<pre><code>{
  "Sid": "AllowAccountADecrypt",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::111122223333:role/analytics-reader" },
  "Action": ["kms:Decrypt", "kms:DescribeKey"],
  "Resource": "*"
}</code></pre>
<p>In a key policy, <code>"Resource": "*"</code> means "this key". The role in A also needs <code>kms:Decrypt</code> on <code>arn:aws:kms:eu-west-1:444455556666:key/&lt;key-id&gt;</code> in its identity policy.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Pattern</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Engineers need read-only access to 30 accounts</td><td>IAM Identity Center permission set assigned to all accounts (roles)</td><td>Central, temporary, MFA-protected; no per-account users</td></tr>
<tr><td>A Glue job in the analytics account copies data from the data-lake account to its own bucket</td><td>Resource policies (bucket + KMS key) in the data-lake account</td><td>The job keeps its own permissions to write in its own account</td></tr>
<tr><td>Third-party monitoring/FinOps tool</td><td>Role with External ID + minimal read-only policy</td><td>Prevents the confused deputy; access is revocable by deleting one role</td></tr>
<tr><td>All accounts send CloudTrail and Flow Logs to one place</td><td>Log-archive bucket policy for service principals with source conditions</td><td>Tamper-resistant, central, owned by the log account</td></tr>
<tr><td>Workload accounts need subnets in a central VPC</td><td>AWS RAM (VPC sharing)</td><td>Subnets can't be shared by policy; RAM makes them appear in the participant account</td></tr>
<tr><td>Shared artefacts bucket for every account in the organisation</td><td>Bucket policy with <code>aws:PrincipalOrgID</code></td><td>Scales automatically as accounts join or leave</td></tr>
<tr><td>S3 event in account A must trigger Lambda in account B</td><td>Lambda function policy for <code>s3.amazonaws.com</code> with <code>aws:SourceArn</code> = the bucket and <code>aws:SourceAccount</code></td><td>Only that bucket can invoke the function</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: inspect cross-account exposure", html: `
<p>These read-only commands work in any account (free). They show which of your resources already trust other accounts.</p>
<pre><code># Roles whose trust policy allows another account (prints role name and principals)
for r in $(aws iam list-roles --query "Roles[].RoleName" --output text); do
  aws iam get-role --role-name "$r" \\
    --query "Role.AssumeRolePolicyDocument.Statement[].Principal.AWS" --output text 2&gt;/dev/null \\
  | grep -q 'arn:aws:iam::' &amp;&amp; echo "$r"
done

# Does a role require an External ID?
aws iam get-role --role-name &lt;role&gt; \\
  --query "Role.AssumeRolePolicyDocument.Statement[].Condition"

# Bucket policies that mention other principals (look for Principal and Condition)
aws s3api get-bucket-policy --bucket &lt;bucket&gt; --query Policy --output text | jq .

# Let IAM Access Analyzer do it for the whole account (M05.09):
aws accessanalyzer create-analyzer --analyzer-name academy-account --type ACCOUNT
aws accessanalyzer list-findings --analyzer-arn &lt;arn-from-previous-output&gt; \\
  --query "findings[].{Resource:resource,Principal:principal,Status:status}" --output table</code></pre>
<p>Lab L05b walks you through building a cross-account role with an External ID end to end.</p>` },

    { type: "casestudy", title: "Case study: Lumen Metrics onboards 200 customer accounts", html: `
<p><strong>Situation.</strong> Lumen Metrics sells a SaaS cost and performance dashboard. It needs read access to each customer's CloudWatch metrics, Cost Explorer data and EC2/RDS inventory. Version 1 asked customers to create an IAM user and paste its access keys into the Lumen web app. Enterprise security reviews rejected it: long-term keys held by a third party, no expiry, and no way for the customer to see what Lumen did.</p>
<p><strong>Requirements.</strong> No customer secrets stored by Lumen. The customer can revoke access instantly. Least privilege, published and auditable. Protection against one Lumen customer reading another's data. Onboarding in under five minutes, including for customers with 50+ accounts.</p>
<p><strong>Design.</strong></p>
<ol>
  <li>Lumen generates a random <strong>External ID per customer tenant</strong> and shows it with a "Launch stack" button.</li>
  <li>The button opens a CloudFormation template (hosted by Lumen) that creates <code>LumenReadOnly</code>. The trust policy names Lumen's single "connector" role ARN (not just the account) and requires <code>sts:ExternalId</code>. The permissions are a customer managed policy listing only the read actions Lumen uses.</li>
  <li>Customers with AWS Organizations deploy the same template as a <strong>service-managed StackSet</strong> to an OU, so new accounts are onboarded automatically.</li>
  <li>Lumen's connector assumes the role with the tenant's External ID and a session name of <code>lumen-&lt;tenant-id&gt;</code>, so customers can find every Lumen call in their CloudTrail.</li>
  <li>Lumen's own connector role may assume only roles named <code>LumenReadOnly</code> (<code>arn:aws:iam::*:role/LumenReadOnly</code>), limiting what a bug in Lumen's code could do.</li>
</ol>
<p><strong>Outcome.</strong> Security-review time for enterprise deals fell from weeks to days, because the template is short and reviewable. Average onboarding was four minutes. Offboarding is "delete the stack". In a later penetration test, a tester registered a second tenant and submitted another tenant's role ARN; the External ID check returned AccessDenied, as designed.</p>
<p><strong>Lessons learned.</strong> The External ID must be <em>generated and enforced by the vendor</em>. An early prototype let customers type their own External ID, which defeated the purpose. And publishing the exact permissions list turned security from a sales blocker into a selling point.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says…</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Third party needs access to our account"</td><td>Cross-account role with <strong>External ID</strong> (never IAM user keys)</td></tr>
<tr><td>"Users in account A need to manage resources in account B"</td><td>Role in B trusting A; users in A get <code>sts:AssumeRole</code> (or Identity Center)</td></tr>
<tr><td>"Restrict bucket access to accounts in our organization"</td><td><code>aws:PrincipalOrgID</code> condition</td></tr>
<tr><td>"Share subnets / Transit Gateway with other accounts"</td><td>AWS RAM</td></tr>
<tr><td>"Objects uploaded by another account can't be read by the bucket owner"</td><td>S3 Object Ownership: <strong>Bucket owner enforced</strong> (disables ACLs)</td></tr>
<tr><td>"Cross-account access to SSE-KMS encrypted objects fails"</td><td>Customer managed key; key policy must allow the other account, plus its identity policy</td></tr>
<tr><td>"Ensure only our SNS topic can write to the queue"</td><td><code>aws:SourceArn</code> condition in the queue policy</td></tr>
</tbody></table>
<p><strong>Distractors:</strong> "Create IAM users in the other account and share the keys"; "Use the External ID as a password and store it in Secrets Manager" (it isn't secret); "Share the AWS managed key aws/s3" (impossible); "VPC peering" for an IAM problem; "Make the bucket public and rely on obscure names".</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Name roles, not just accounts, when you can.</strong> Trusting <code>arn:aws:iam::111122223333:root</code> delegates the decision to every admin of that account. Trusting a specific role ARN is narrower. Note that if that role is deleted and recreated, the trust policy must be updated, because IAM stores the role's unique ID behind the ARN.</li>
  <li><strong>Resource policies are invisible from the caller's side.</strong> The caller's account can't list which external buckets it can reach. Use IAM Access Analyzer at the organisation level to see every resource shared outside your zone of trust.</li>
  <li><strong>KMS is the usual hidden failure.</strong> Bucket policy correct, identity policy correct, still AccessDenied? Check the key policy and whether the bucket uses an AWS managed key.</li>
  <li><strong>Prefer delegated administrator</strong> features (GuardDuty, Security Hub, Config, Firewall Manager, IAM Access Analyzer) over custom cross-account roles for security tooling.</li>
  <li><strong>Trust policies drift.</strong> Old vendors and test accounts stay trusted for years. Review roles with external trust quarterly, and use last-used data (<code>RoleLastUsed</code>) to remove dead ones.</li>
  <li><strong>Cost:</strong> cross-account access itself is free, but cross-Region and cross-AZ data transfer still apply, and requester-pays buckets shift S3 request and transfer charges to the caller.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Across accounts, <strong>both</strong> the resource or trust policy in the owning account and the identity policy in the caller's account must allow the request.</li>
  <li><strong>Role assumption</strong> works for everything, but the caller gives up its own permissions. <strong>Resource-based policies</strong> let the caller keep its identity, which suits data sharing and pipelines.</li>
  <li><strong>AWS RAM</strong> shares resources that can't be granted by policy: subnets, Transit Gateways, Resolver rules and more.</li>
  <li><code>aws:PrincipalOrgID</code> / <code>aws:PrincipalOrgPaths</code> restrict access to your organisation or an OU without listing account IDs.</li>
  <li>The <strong>confused deputy</strong> is prevented with <code>sts:ExternalId</code> (third parties; vendor-generated, unique, not secret) and <code>aws:SourceArn</code>/<code>aws:SourceAccount</code> (AWS service principals).</li>
  <li>Cross-account encrypted data needs a <strong>customer managed KMS key</strong> whose key policy allows the other account.</li>
  <li>Data perimeters combine identity, resource and network controls so only trusted identities reach trusted resources from expected networks.</li>
  <li>Use IAM Access Analyzer to find everything shared outside your zone of trust.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.06-d1", q: "A role in account A has an identity policy allowing <code>s3:GetObject</code> on a bucket in account B, but the bucket policy in B doesn't mention account A. Is the request allowed or denied?", answers: ["denied", "deny"], explain: "Cross-account requests need an allow on both sides; the bucket policy in B is missing." },
    { id: "M05.06-d2", q: "Which condition key, used in a role's trust policy, protects against the confused-deputy problem when a third-party vendor assumes the role? (format service:Key)", answers: ["sts:ExternalId", "sts:externalid"], explain: "The vendor passes a per-customer External ID; the trust policy requires it." },
    { id: "M05.06-d3", q: "Which global condition key lets a bucket policy allow every principal in your AWS organisation without listing account IDs?", answers: ["aws:PrincipalOrgID", "PrincipalOrgID"], explain: "aws:PrincipalOrgID compares the caller's organisation ID (o-…) with the value in the policy." },
    { id: "M05.06-d4", q: "Which AWS service shares VPC subnets and Transit Gateways with other accounts? (abbreviation)", answers: ["RAM", "AWS RAM", "Resource Access Manager", "AWS Resource Access Manager"], explain: "AWS Resource Access Manager." },
    { id: "M05.06-d5", q: "An SQS queue policy allows the service principal <code>sns.amazonaws.com</code>. Which condition key restricts it to your one topic? (format aws:Key)", answers: ["aws:SourceArn", "SourceArn"], explain: "aws:SourceArn must equal the topic's ARN (add aws:SourceAccount for defence in depth)." },
    { id: "M05.06-d6", q: "Who should generate the External ID: the customer or the third-party vendor?", answers: ["vendor", "the vendor", "third-party vendor", "third party"], explain: "The vendor generates a unique ID per customer, so no customer can pick another customer's value." }
  ],
  check: [
    { id: "M05.06-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company engages a third-party auditing firm that needs read-only access to its AWS account. The firm uses the same tool for many clients. What is the MOST secure approach?",
      options: [
        { t: "Create a role that trusts the firm's AWS account, require an External ID provided by the firm, and attach a read-only policy", c: true, why: "Temporary credentials, revocable, least privilege, and External ID prevents the confused deputy." },
        { t: "Create an IAM user with read-only access and send its access keys to the firm", c: false, why: "Long-term keys held by a third party are the riskiest option." },
        { t: "Create a role that trusts the firm's account with no conditions", c: false, why: "Vulnerable to the confused deputy: another client of the firm could make it assume your role." },
        { t: "Add the firm's account to your AWS Organization", c: false, why: "Inappropriate and unnecessary for a third party." }
      ] },
    { id: "M05.06-k2", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A Glue job in the analytics account must read a bucket in the data-lake account and write the results to a bucket in the analytics account, using one set of credentials. Which approach works?",
      options: [
        { t: "Add a bucket policy in the data-lake account that allows the Glue job's role, and give the role identity permissions for both buckets", c: true, why: "A resource-based policy lets the role keep its own identity and permissions, so it can read in one account and write in the other." },
        { t: "Have the job assume a role in the data-lake account and write the results with that role", c: false, why: "While using the assumed role, it has only the data-lake role's permissions, which don't include writing in the analytics account." },
        { t: "Use VPC peering between the accounts", c: false, why: "Peering is network connectivity; it doesn't grant IAM permissions to S3." },
        { t: "Copy the data-lake account's access keys into the Glue job", c: false, why: "Long-term keys are insecure and unnecessary." }
      ] },
    { id: "M05.06-k3", type: "single", domain: "D1", task: "1.3", level: 300,
      stem: "Objects in a bucket in account B are encrypted with SSE-KMS using the AWS managed key <code>aws/s3</code>. A role in account A has correct bucket and identity policy permissions but gets AccessDenied. What must change?",
      options: [
        { t: "Re-encrypt with a customer managed KMS key whose key policy allows account A, and grant the role kms:Decrypt on that key", c: true, why: "AWS managed keys can't be used cross-account; a customer managed key with a cross-account key policy is required." },
        { t: "Enable S3 Transfer Acceleration", c: false, why: "Unrelated to authorisation." },
        { t: "Add kms:* to the bucket policy", c: false, why: "Bucket policies don't control KMS keys; key policies do." },
        { t: "Switch the bucket to SSE-C", c: false, why: "SSE-C requires the caller to supply the key on every request; it is not the way to share encrypted data across accounts." }
      ] },
    { id: "M05.06-k4", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "An S3 bucket in account B must allow its own event notifications to invoke a Lambda function in account B, and nothing else may invoke it through the S3 service principal. Which TWO conditions belong in the function's resource policy statement?",
      options: [
        { t: "<code>aws:SourceArn</code> equals the bucket's ARN", c: true, why: "Ties the S3 service principal to that specific bucket." },
        { t: "<code>aws:SourceAccount</code> equals account B's ID", c: true, why: "Ensures the bucket belongs to your account (bucket ARNs don't include an account ID)." },
        { t: "<code>sts:ExternalId</code> equals a random value", c: false, why: "External ID is for third parties assuming roles, not service invocations." },
        { t: "<code>aws:MultiFactorAuthPresent</code> is true", c: false, why: "Service principals don't authenticate with MFA." },
        { t: "<code>aws:SecureTransport</code> is false", c: false, why: "That would only match non-TLS requests; it is irrelevant here." }
      ] },
    { id: "M05.06-k5", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company with 120 accounts in AWS Organizations wants a shared artefacts bucket readable by every account, including accounts created in the future, with the LEAST operational overhead. What should the bucket policy use?",
      options: [
        { t: "<code>\"Principal\": \"*\"</code> with the condition <code>aws:PrincipalOrgID</code> equal to the organisation ID", c: true, why: "Covers all current and future accounts in the organisation, with no list to maintain." },
        { t: "A list of all 120 account IDs as principals", c: false, why: "Works today, but must be updated for every new or closed account." },
        { t: "A role in each account that the bucket trusts", c: false, why: "Much more overhead than one condition." },
        { t: "Make the bucket public", c: false, why: "Exposes the artefacts to the internet." }
      ] },
    { id: "M05.06-k6", type: "single", domain: "D2", task: "2.2", level: 300,
      stem: "Workload accounts must launch EC2 instances into subnets of a VPC owned by a central networking account, without VPC peering. What enables this?",
      options: [
        { t: "Share the subnets with AWS Resource Access Manager (VPC sharing)", c: true, why: "RAM makes the subnets usable in participant accounts while the networking account keeps ownership of the VPC." },
        { t: "A bucket policy on the VPC", c: false, why: "VPCs don't have resource policies." },
        { t: "A cross-account role for each EC2 instance", c: false, why: "Roles give API permissions, not placement in another account's subnets." },
        { t: "AWS Direct Connect", c: false, why: "Direct Connect is on-premises connectivity." }
      ] }
  ],
  cards: ["fc-M05-6-01", "fc-M05-6-02", "fc-M05-6-03", "fc-M05-6-04", "fc-M05-6-05", "fc-M05-6-06", "fc-M05-6-07", "fc-M05-6-08", "fc-M05-6-09", "fc-M05-6-10"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"AWS Identity and Access Management\" (PDF p603–607): trusting accounts and resource policies",
    "IAM User Guide: <em>Cross account resource access in IAM</em> and <em>How IAM roles differ from resource-based policies</em>",
    "IAM User Guide: <em>The confused deputy problem</em> and <em>Access to AWS accounts owned by third parties</em> (External ID)",
    "AWS KMS Developer Guide: <em>Allowing users in other accounts to use a KMS key</em>",
    "AWS whitepaper: <em>Building a data perimeter on AWS</em>",
    "AWS RAM User Guide: <em>Shareable AWS resources</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-6-01", front: "Cross-account request: whose policies must allow it?", back: "BOTH: the owning account's resource or trust policy AND the caller's identity policy in its own account." },
  { id: "fc-M05-6-02", front: "Role assumption vs resource-based policy: key difference?", back: "Assuming a role, you give up your own permissions. With a resource policy, you keep your identity (e.g. read in B, write in A)." },
  { id: "fc-M05-6-03", front: "What is the confused deputy problem?", back: "A trusted intermediary (vendor or AWS service) is tricked into using its access on behalf of someone who shouldn't have it." },
  { id: "fc-M05-6-04", front: "External ID: who creates it, is it secret, where is it checked?", back: "The third-party vendor generates a unique one per customer; not a secret; customer's trust policy requires sts:ExternalId." },
  { id: "fc-M05-6-05", front: "Confused-deputy protection for AWS service principals?", back: "Conditions aws:SourceArn (the specific source resource) and aws:SourceAccount (your account)." },
  { id: "fc-M05-6-06", front: "How to allow all accounts in your organisation in a bucket policy?", back: "Principal \"*\" + Condition StringEquals aws:PrincipalOrgID = o-… (or aws:PrincipalOrgPaths for an OU)." },
  { id: "fc-M05-6-07", front: "What does AWS RAM share? Examples.", back: "Resources that can't be granted by policy: VPC subnets, Transit Gateways, Route 53 Resolver rules, IPAM pools, Network Firewall policies…" },
  { id: "fc-M05-6-08", front: "Cross-account SSE-KMS access needs…?", back: "A customer managed key (not aws/s3) whose key policy allows the other account, plus kms permissions in the caller's identity policy." },
  { id: "fc-M05-6-09", front: "S3 Object Ownership \"Bucket owner enforced\"?", back: "ACLs disabled; the bucket owner owns every object, including those uploaded by other accounts. Default for new buckets." },
  { id: "fc-M05-6-10", front: "Three data perimeters?", back: "Identity (only my org's principals → aws:PrincipalOrgID), resource (only my org's resources → aws:ResourceOrgID), network (expected networks → aws:SourceVpc/Vpce/Ip)." }
);
// ================================================================== 07_federation.js
/* ---------------------------------------------------------------- M05.07 Federation */
var DG_0507_SAML = `
<figure>
<svg class="diagram" viewBox="0 0 760 372" role="img" aria-labelledby="m0507at m0507ad">
  <title id="m0507at">SAML 2.0 federated sign-in to the AWS Management Console</title>
  <desc id="m0507ad">Four participants: the user's browser, the corporate identity provider, the AWS sign-in SAML endpoint and AWS STS. The user signs in at the identity provider, which checks the password and MFA against the directory and returns a signed SAML assertion to the browser. The browser posts the assertion to the AWS sign-in endpoint, which calls AssumeRoleWithSAML on STS, receives temporary credentials and redirects the browser to the console.</desc>
  <defs><marker id="m0507a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="10" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="24" y="33">User's browser</text><text class="dg-ts" x="24" y="51">employee</text>
  <rect class="dg-info" x="200" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="214" y="33">Corporate IdP</text><text class="dg-ts" x="214" y="51">AD FS, Entra ID, Okta</text>
  <rect class="dg-edge" x="390" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="404" y="33">AWS sign-in</text><text class="dg-ts" x="404" y="51">SAML endpoint</text>
  <rect class="dg-good" x="580" y="12" width="170" height="48" rx="8"/><text class="dg-tb" x="594" y="33">AWS STS</text><text class="dg-ts" x="594" y="51">security token service</text>
  <path class="dg-line" d="M95 60 V316" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M285 60 V316" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M475 60 V316" stroke-dasharray="3 4"/>
  <path class="dg-line" d="M665 60 V316" stroke-dasharray="3 4"/>

  <path class="dg-line" d="M95 92 H283" marker-end="url(#m0507a-ar)"/><text class="dg-ts" x="105" y="85">1 · open the IdP portal</text>
  <rect class="dg-info" x="295" y="104" width="170" height="40" rx="6"/><text class="dg-ts" x="305" y="120">2 · check password + MFA</text><text class="dg-ts" x="305" y="136">against AD / directory</text>
  <path class="dg-line" d="M285 170 H97" marker-end="url(#m0507a-ar)"/><text class="dg-ts" x="105" y="163">3 · signed SAML assertion</text>
  <path class="dg-line" d="M95 204 H473" marker-end="url(#m0507a-ar)"/><text class="dg-ts" x="295" y="197">4 · browser POSTs assertion</text>
  <path class="dg-line" d="M475 236 H663" marker-end="url(#m0507a-ar)"/><text class="dg-ts" x="485" y="229">5 · AssumeRoleWithSAML</text>
  <path class="dg-line" d="M665 266 H477" marker-end="url(#m0507a-ar)"/><text class="dg-ts" x="485" y="259">6 · temporary credentials</text>
  <path class="dg-line" d="M475 298 H97" marker-end="url(#m0507a-ar)"/><text class="dg-ts" x="295" y="291">7 · console sign-in URL</text>

  <text class="dg-ts" x="16" y="340">The Role attribute in the assertion names the role ARN and the SAML provider ARN; the session lasts at most the role's maximum.</text>
  <text class="dg-ts" x="16" y="358">No IAM users and no AWS passwords: the IdP is the single source of truth for who people are and whether they still work here.</text>
</svg>
<figcaption>Figure M05-7a. IdP-initiated SAML 2.0 sign-in. AWS never sees the user's password: it trusts the IdP's signature on the assertion, checked against the metadata in the IAM SAML identity provider.</figcaption>
</figure>`;

var DG_0507_IDC = `
<figure>
<svg class="diagram" viewBox="0 0 760 296" role="img" aria-labelledby="m0507bt m0507bd">
  <title id="m0507bt">IAM Identity Center architecture</title>
  <desc id="m0507bd">An identity source, either an external identity provider connected with SAML 2.0 and SCIM, Active Directory or the Identity Center directory, feeds IAM Identity Center in the management or delegated administrator account. Identity Center holds permission sets and account assignments and provisions a role per permission set in each assigned member account. Workforce users sign in once through the access portal or the CLI.</desc>
  <defs><marker id="m0507b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="10" y="20" width="220" height="124" rx="10"/>
  <text class="dg-tb" x="24" y="44">Identity source</text>
  <text class="dg-ts" x="24" y="66">External IdP: SAML 2.0</text>
  <text class="dg-ts" x="24" y="82">+ SCIM user/group sync</text>
  <text class="dg-ts" x="24" y="104">or Active Directory</text>
  <text class="dg-ts" x="24" y="120">(Managed AD / AD Connector)</text>
  <text class="dg-ts" x="24" y="136">or Identity Center directory</text>
  <path class="dg-line" d="M230 82 H268" marker-end="url(#m0507b-ar)"/>

  <rect class="dg-edge" x="270" y="20" width="220" height="124" rx="10"/>
  <text class="dg-tb" x="284" y="44">IAM Identity Center</text>
  <text class="dg-ts" x="284" y="66">in the management or</text>
  <text class="dg-ts" x="284" y="82">delegated admin account</text>
  <text class="dg-ts" x="284" y="104">permission sets</text>
  <text class="dg-ts" x="284" y="120">account assignments</text>
  <text class="dg-ts" x="284" y="136">MFA, session length</text>

  <path class="dg-line" d="M490 60 L528 40" marker-end="url(#m0507b-ar)"/>
  <path class="dg-line" d="M490 82 H528" marker-end="url(#m0507b-ar)"/>
  <path class="dg-line" d="M490 104 L528 124" marker-end="url(#m0507b-ar)"/>
  <rect class="dg-box" x="530" y="18" width="220" height="44" rx="8"/><text class="dg-t" x="542" y="36">Account: prod</text><text class="dg-ts" x="542" y="53">role AWSReservedSSO_ReadOnly_…</text>
  <rect class="dg-box" x="530" y="68" width="220" height="44" rx="8"/><text class="dg-t" x="542" y="86">Account: dev</text><text class="dg-ts" x="542" y="103">role AWSReservedSSO_Developer_…</text>
  <rect class="dg-box" x="530" y="118" width="220" height="44" rx="8"/><text class="dg-t" x="542" y="136">Account: security</text><text class="dg-ts" x="542" y="153">role AWSReservedSSO_Auditor_…</text>

  <rect class="dg-good" x="270" y="190" width="220" height="56" rx="10"/>
  <text class="dg-tb" x="284" y="212">Workforce users</text>
  <text class="dg-ts" x="284" y="232">access portal · aws sso login</text>
  <path class="dg-line" d="M380 190 V146" marker-end="url(#m0507b-ar)"/>
  <text class="dg-ts" x="10" y="170">SCIM creates, updates and disables</text>
  <text class="dg-ts" x="10" y="186">users and groups automatically</text>

  <text class="dg-ts" x="10" y="272">Each assignment = (user or group, permission set, account). Identity Center creates and maintains the matching role in that account.</text>
</svg>
<figcaption>Figure M05-7b. One sign-in, many accounts. Permission sets are templates; account assignments turn them into roles in each member account, and SCIM keeps people and groups in step with the corporate directory.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.07", title: "Federation", level: 300, minutes: 55,
  objectives: [
    "Explain identity federation and walk through a SAML 2.0 sign-in to the AWS console, including the STS call it makes",
    "Distinguish OIDC ID tokens from OAuth access tokens, read a JWT, and use web identity federation for CI/CD pipelines",
    "Design workforce access with IAM Identity Center: identity sources, SCIM, permission sets and account assignments",
    "Choose between AWS Managed Microsoft AD, AD Connector and Simple AD, and between Identity Center, IAM SAML federation and Amazon Cognito"
  ],
  sections: [
    { type: "why", html: `
<p>A company with 4,000 employees and 50 AWS accounts could, in theory, create an IAM user for every person in every account. That is 200,000 users, 200,000 passwords and countless long-lived access keys. When someone leaves, a person has to remember to delete them all. Nobody can do that reliably, and the leftover credentials are exactly what attackers look for.</p>
<p><strong>Federation</strong> solves this. People keep the one identity they already have (their corporate login), and AWS <em>trusts</em> the system that manages it. AWS issues short-lived credentials for each session. When HR disables the account in the directory, AWS access ends with it. On the SAA-C03 exam, any scenario with "existing corporate identities", "single sign-on", "many accounts" or "do not create IAM users" points at federation. In real projects, workforce access is one of the first things an architect designs in a landing zone (M06).</p>` },

    { type: "concept", title: "Federation fundamentals: SAML 2.0 and OIDC", html: DG_0507_SAML + `
<h3>The vocabulary</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th><th>AWS example</th></tr></thead>
<tbody>
<tr><td><strong>Identity provider (IdP)</strong></td><td>The system that knows who users are and authenticates them (password, MFA, device checks)</td><td>Microsoft Entra ID, Okta, Ping, Google Workspace, AD FS, the Identity Center directory, a Cognito user pool</td></tr>
<tr><td><strong>Service provider (SP)</strong> / relying party</td><td>The system that trusts the IdP's statement and grants access</td><td>AWS sign-in, IAM Identity Center, your application</td></tr>
<tr><td><strong>Assertion / token</strong></td><td>A signed statement from the IdP: "this is alice@corp, authenticated with MFA at 09:02, member of these groups"</td><td>SAML assertion (XML), OIDC ID token (JWT)</td></tr>
<tr><td><strong>Trust</strong></td><td>The SP holds the IdP's public signing key (metadata) and accepts only assertions signed with it</td><td>An IAM SAML or OIDC identity provider entity; the federation settings in Identity Center</td></tr>
<tr><td><strong>Federated principal</strong></td><td>A user who has no IAM user; they act through a role session</td><td><code>arn:aws:sts::111122223333:assumed-role/CorpReadOnly/alice@corp.example</code></td></tr>
</tbody></table>
<p>Federation always ends in the same place: <strong>STS issues temporary credentials for a role</strong> (M05.05). What differs is how the user proves who they are, and which STS API is called.</p>

<h3>SAML 2.0</h3>
<p><strong>Security Assertion Markup Language 2.0</strong> is an XML-based standard from 2005 and is still the workhorse of enterprise single sign-on. The IdP signs an XML <em>assertion</em> and the browser carries it to the service provider in an HTTP POST. For AWS console federation (Figure M05-7a):</p>
<ul>
  <li>In each AWS account you create an <strong>IAM SAML identity provider</strong> by uploading the IdP's metadata XML (its signing certificate and endpoints).</li>
  <li>You create roles whose <strong>trust policy</strong> allows <code>sts:AssumeRoleWithSAML</code> for that provider, with the condition <code>SAML:aud = https://signin.aws.amazon.com/saml</code>.</li>
  <li>The IdP is configured with AWS as a relying party and sends these <strong>SAML attributes</strong>:
    <ul>
      <li><code>https://aws.amazon.com/SAML/Attributes/Role</code>: one or more pairs "role ARN, provider ARN". If the user maps to several roles, AWS shows a role picker.</li>
      <li><code>https://aws.amazon.com/SAML/Attributes/RoleSessionName</code>: usually the user's email or UPN, so CloudTrail shows who acted.</li>
      <li><code>https://aws.amazon.com/SAML/Attributes/SessionDuration</code> (optional): 900–43,200 seconds, capped by the role's maximum session duration.</li>
      <li><code>https://aws.amazon.com/SAML/Attributes/PrincipalTag:<em>key</em></code> (optional): session tags for ABAC (M05.08).</li>
    </ul></li>
</ul>
<p>Flows can be <strong>IdP-initiated</strong> (the user starts in the corporate portal, as in the figure) or <strong>SP-initiated</strong> (the user starts at the application, which redirects to the IdP). Applications can also call <code>AssumeRoleWithSAML</code> themselves with an assertion to get API credentials.</p>

<h3>OAuth 2.0 and OpenID Connect (OIDC)</h3>
<p><strong>OAuth 2.0</strong> is an <em>authorisation</em> framework: it lets a client obtain an <strong>access token</strong> to call an API on a user's behalf. <strong>OIDC</strong> is a thin <em>authentication</em> layer on top of OAuth 2.0: it adds an <strong>ID token</strong> that says who the user is. Both are JSON-based and suit web, mobile and machine-to-machine use far better than SAML's XML.</p>
<table>
<thead><tr><th></th><th>ID token (OIDC)</th><th>Access token (OAuth 2.0)</th><th>Refresh token</th></tr></thead>
<tbody>
<tr><td>Answers</td><td>Who is the user?</td><td>What may this client call?</td><td>How do I get new tokens without re-login?</td></tr>
<tr><td>Audience</td><td>The client application</td><td>The API (resource server)</td><td>The authorisation server only</td></tr>
<tr><td>Format</td><td>Always a JWT</td><td>Often a JWT; may be opaque</td><td>Opaque; keep secret</td></tr>
<tr><td>Lifetime</td><td>Short (minutes to an hour)</td><td>Short</td><td>Long (hours to days)</td></tr>
</tbody></table>
<p>A <strong>JSON Web Token (JWT)</strong> has three Base64URL-encoded parts separated by dots: <code>header.payload.signature</code>. The header names the signing algorithm and key ID (<code>kid</code>); the payload carries <strong>claims</strong> such as <code>iss</code> (issuer), <code>sub</code> (subject), <code>aud</code> (audience), <code>exp</code> (expiry) and custom claims such as groups. The verifier fetches the issuer's public keys from its <strong>JWKS</strong> (JSON Web Key Set) URL and checks the signature, expiry, issuer and audience. A JWT is <em>signed, not encrypted</em>: anyone can read the payload, so never put secrets in it.</p>

<h3>Web identity federation</h3>
<p>AWS STS accepts OIDC tokens through <code>AssumeRoleWithWebIdentity</code>. You create an <strong>IAM OIDC identity provider</strong> for the issuer URL, and a role whose trust policy checks the token's <code>aud</code> and <code>sub</code> claims. Today the main users are <strong>machines</strong>:</p>
<ul>
  <li><strong>CI/CD:</strong> GitHub Actions, GitLab and other pipelines get short-lived AWS credentials with no stored access keys.</li>
  <li><strong>Kubernetes:</strong> EKS IAM Roles for Service Accounts (IRSA) uses the cluster's OIDC issuer (EKS Pod Identity is the newer alternative, M15).</li>
</ul>
<div class="callout warn"><strong>Mobile and web apps:</strong> calling <code>AssumeRoleWithWebIdentity</code> directly with Google or Facebook tokens still works, but AWS recommends <strong>Amazon Cognito</strong> for application users (M05.10). Cognito identity pools handle the token exchange, guest access and role selection for you.</div>` },

    { type: "concept", title: "Workforce identity: IAM Identity Center and Directory Service", html: DG_0507_IDC + `
<h3>IAM Identity Center</h3>
<p><strong>AWS IAM Identity Center</strong> (formerly AWS SSO) is AWS's recommended way to give <em>people</em> access to <em>many accounts</em> and to business applications. You enable it once for an AWS Organization, in one Region, ideally administered from a <strong>delegated administrator</strong> member account rather than the management account.</p>
<ul>
  <li><strong>Identity source</strong> (exactly one at a time):
    <ul>
      <li><strong>Identity Center directory:</strong> users and groups created in Identity Center itself. Good for small organisations with no corporate IdP.</li>
      <li><strong>External IdP:</strong> Entra ID, Okta, Ping, Google Workspace and others via <strong>SAML 2.0</strong> for sign-in, plus <strong>SCIM</strong> (System for Cross-domain Identity Management) for automatic provisioning. With SCIM, a new hire's account and group memberships appear in AWS automatically, and a disabled user loses access without anyone touching AWS.</li>
      <li><strong>Active Directory:</strong> an AWS Managed Microsoft AD directory, or your on-premises AD through AD Connector. Users and groups are synchronised into Identity Center.</li>
    </ul></li>
  <li><strong>Permission set:</strong> a template of permissions (AWS managed policies, customer managed policies referenced by name, an inline policy, an optional permissions boundary) plus a session duration of 1–12 hours.</li>
  <li><strong>Account assignment:</strong> (user or group) + (permission set) + (AWS account). For each assignment, Identity Center provisions a role named <code>AWSReservedSSO_&lt;PermissionSetName&gt;_&lt;id&gt;</code> in that account, with a trust policy for Identity Center's SAML provider. If you change the permission set, Identity Center updates every provisioned copy.</li>
  <li><strong>Access portal:</strong> a single URL where users see every account and role they can use and open the console, or copy short-term CLI credentials. The CLI uses <code>aws configure sso</code> / <code>aws sso login</code> (M03.02).</li>
  <li><strong>Applications:</strong> SAML 2.0 and OAuth applications (including AWS managed applications such as Amazon Q, QuickSight and SageMaker Studio) can be assigned to users too. <strong>Trusted identity propagation</strong> passes the signed-in user's identity through to services such as Amazon Redshift, Athena or S3 Access Grants, so data access can be decided and audited per person rather than per shared role.</li>
  <li><strong>Attributes for access control:</strong> user attributes (department, cost centre, project) can be passed as session tags for ABAC (M05.08).</li>
</ul>

<h3>IAM SAML federation vs IAM Identity Center</h3>
<table>
<thead><tr><th></th><th>IAM SAML federation (per account)</th><th>IAM Identity Center</th></tr></thead>
<tbody>
<tr><td>Set-up per account</td><td>SAML provider + roles + IdP rules in <em>every</em> account</td><td>Once per organisation; roles are provisioned for you</td></tr>
<tr><td>Multi-account experience</td><td>Role picker per account; awkward across 50 accounts</td><td>One portal for all accounts and roles</td></tr>
<tr><td>CLI access</td><td>Third-party tools or custom scripts</td><td>Built in (<code>aws sso login</code>)</td></tr>
<tr><td>Provisioning</td><td>Group-to-role mapping in the IdP</td><td>SCIM sync of users and groups</td></tr>
<tr><td>Still a good fit when</td><td>A single standalone account, or an application that needs <code>AssumeRoleWithSAML</code> directly</td><td>Almost every workforce scenario with AWS Organizations</td></tr>
</tbody></table>

<h3>AWS Directory Service options</h3>
<table>
<thead><tr><th>Option</th><th>What it is</th><th>Choose it when</th><th>Limits</th></tr></thead>
<tbody>
<tr><td><strong>AWS Managed Microsoft AD</strong></td><td>A real Microsoft AD run by AWS: domain controllers in two AZs, patched and backed up for you</td><td>AD-aware workloads in AWS (RDS for SQL Server Windows authentication, FSx for Windows File Server, WorkSpaces, EC2 domain join); a forest <strong>trust</strong> with on-premises AD; AD that must keep working if the on-premises link fails</td><td>You pay for directory hours; schema/admin rights are delegated, not full Domain Admin</td></tr>
<tr><td><strong>AD Connector</strong></td><td>A proxy that forwards authentication requests to your <em>existing</em> on-premises AD; it caches no directory data</td><td>"Use existing on-premises AD credentials" for Identity Center, WorkSpaces or console access, with the least footprint in AWS</td><td>Needs reliable VPN or Direct Connect to the domain controllers; no trusts; if the link is down, sign-in fails</td></tr>
<tr><td><strong>Simple AD</strong></td><td>A small Samba-based, AD-compatible directory</td><td>Basic LDAP / domain join for small, low-cost needs</td><td>No trusts, no MFA, limited features; not an Identity Center identity source</td></tr>
</tbody></table>
<div class="callout tip"><strong>Many enterprises already sync on-premises AD to Entra ID</strong> for Microsoft 365. In that case the simplest Identity Center design is often Entra ID as an external IdP (SAML + SCIM). AWS then relies on the IdP that already enforces MFA and conditional access, and has no dependency on a network path to the domain controllers.</div>` },

    { type: "workflow", title: "Setting up workforce access with IAM Identity Center", html: `
<ol class="flow">
  <li><strong>Prerequisites:</strong> an AWS Organization with all features enabled. Choose the Identity Center Region (where its data lives) deliberately; changing it later means re-creating the instance.</li>
  <li><strong>Enable Identity Center</strong> in the management account, then <strong>register a delegated administrator</strong> (for example a shared-services or identity account) so day-to-day administration doesn't need the management account.</li>
  <li><strong>Choose the identity source.</strong> For an external IdP: exchange SAML metadata in both directions, then enable automatic provisioning and paste the SCIM endpoint and access token into the IdP. For AD: create AD Connector or AWS Managed Microsoft AD and configure which users and groups to sync.</li>
  <li><strong>Design permission sets</strong> from job functions, not individuals: for example <code>ReadOnly</code>, <code>Developer</code>, <code>PlatformAdmin</code>, <code>SecurityAuditor</code>, <code>BillingViewer</code>, <code>BreakGlass</code>. Set session durations (shorter for powerful sets) and attach permissions boundaries where teams create roles.</li>
  <li><strong>Assign groups, not users,</strong> to accounts with permission sets: "Payments-Developers → Developer → payments-dev and payments-test". Group membership in the IdP now drives AWS access.</li>
  <li><strong>Require MFA</strong> (in the IdP, or in Identity Center for its own directory) and test sign-in through the portal and with <code>aws sso login</code>.</li>
  <li><strong>Plan for IdP failure:</strong> keep a documented break-glass path (for example two hardware-MFA-protected emergency roles or IAM users in a dedicated account, monitored with alarms on use).</li>
  <li><strong>Retire legacy access:</strong> remove per-account SAML providers and IAM users once everyone is migrated; use credential reports and last-used data (M05.09) to find stragglers.</li>
  <li><strong>Monitor:</strong> sign-ins and role usage appear in CloudTrail (as <code>AssumeRoleWithSAML</code> events for the provisioned roles, plus Identity Center sign-in events). Alert on break-glass use and on changes to permission sets.</li>
</ol>` },

    { type: "aws", title: "Federation on AWS: which mechanism for which identity", html: `
<table>
<thead><tr><th>Who needs access?</th><th>Recommended mechanism</th><th>STS API underneath</th></tr></thead>
<tbody>
<tr><td>Employees and contractors, many accounts</td><td>IAM Identity Center (+ external IdP or AD)</td><td>AssumeRoleWithSAML (managed for you)</td></tr>
<tr><td>Employees, one standalone account with a SAML IdP</td><td>IAM SAML identity provider + roles</td><td>AssumeRoleWithSAML</td></tr>
<tr><td>CI/CD pipeline (GitHub Actions, GitLab)</td><td>IAM OIDC identity provider + role with <code>sub</code> condition</td><td>AssumeRoleWithWebIdentity</td></tr>
<tr><td>Kubernetes pods on EKS</td><td>EKS Pod Identity or IRSA</td><td>AssumeRoleWithWebIdentity (IRSA) / Pod Identity agent</td></tr>
<tr><td>Customers of your web or mobile app</td><td>Amazon Cognito user pools (+ identity pools for AWS credentials)</td><td>AssumeRoleWithWebIdentity (via Cognito)</td></tr>
<tr><td>Workloads on EC2, ECS, Lambda</td><td>IAM roles (instance profile, task role, execution role), not federation</td><td>AssumeRole (by the service)</td></tr>
<tr><td>Servers outside AWS (on-premises, other clouds)</td><td>IAM Roles Anywhere (X.509 certificates from your PKI)</td><td>Roles Anywhere CreateSession</td></tr>
</tbody></table>
<h3>Facts the exam and real projects rely on</h3>
<ul>
  <li><strong>Temporary credentials only.</strong> Every federated session is a role session with an expiry. There is nothing to rotate and nothing to leak for long.</li>
  <li><strong>Session duration</strong> for SAML ranges 15 minutes to 12 hours, limited by the role's <code>MaxSessionDuration</code>. Identity Center permission sets allow 1–12 hours.</li>
  <li><strong>Auditing:</strong> set <code>RoleSessionName</code> to the user's identity. CloudTrail then records <code>assumed-role/RoleName/alice@corp.example</code>, so you can trace actions to a person even though many people share the role.</li>
  <li><strong>Trust policies</strong> for federation use <code>"Principal": {"Federated": "arn:aws:iam::…:saml-provider/…"}</code> or <code>…:oidc-provider/…</code>, and conditions on the token's claims (<code>SAML:aud</code>, <code>token.actions.githubusercontent.com:sub</code>).</li>
  <li><strong>IAM users for humans are an anti-pattern</strong> in every current AWS best-practice guide. They remain for rare cases: break-glass, or tools that genuinely cannot use roles.</li>
</ul>` },

    { type: "examples", html: `
<h3>Example 1: trust policy for a SAML-federated role</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::111122223333:saml-provider/CorpADFS" },
      "Action": ["sts:AssumeRoleWithSAML", "sts:TagSession"],
      "Condition": {
        "StringEquals": { "SAML:aud": "https://signin.aws.amazon.com/saml" }
      }
    }
  ]
}</code></pre>
<p><code>sts:TagSession</code> is needed only if the IdP sends <code>PrincipalTag</code> attributes. The matching SAML attribute from the IdP looks like this (two values per role, comma-separated):</p>
<pre><code>&lt;Attribute Name="https://aws.amazon.com/SAML/Attributes/Role"&gt;
  &lt;AttributeValue&gt;arn:aws:iam::111122223333:role/CorpReadOnly,arn:aws:iam::111122223333:saml-provider/CorpADFS&lt;/AttributeValue&gt;
&lt;/Attribute&gt;
&lt;Attribute Name="https://aws.amazon.com/SAML/Attributes/RoleSessionName"&gt;
  &lt;AttributeValue&gt;alice@corp.example&lt;/AttributeValue&gt;
&lt;/Attribute&gt;
&lt;Attribute Name="https://aws.amazon.com/SAML/Attributes/SessionDuration"&gt;
  &lt;AttributeValue&gt;14400&lt;/AttributeValue&gt;
&lt;/Attribute&gt;</code></pre>

<h3>Example 2: GitHub Actions deploying without access keys</h3>
<p>Trust policy for the deployment role. Only the <code>main</code> branch of one repository can assume it:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Federated": "arn:aws:iam::111122223333:oidc-provider/token.actions.githubusercontent.com" },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
        "StringLike": { "token.actions.githubusercontent.com:sub": "repo:example-org/payments-api:ref:refs/heads/main" }
      }
    }
  ]
}</code></pre>
<div class="callout warn"><strong>The <code>sub</code> condition is the security control.</strong> A trust policy that checks only <code>aud</code> lets <em>any</em> GitHub repository in the world assume your role. Always pin the organisation, repository and branch or environment.</div>
<p>The workflow then uses the official action to exchange its OIDC token:</p>
<pre><code>permissions:
  id-token: write      # allow the job to request an OIDC token
  contents: read
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::111122223333:role/payments-deploy
      aws-region: eu-west-1
  - run: aws sts get-caller-identity   # assumed-role/payments-deploy/GitHubActions</code></pre>

<h3>Example 3: reading a JWT</h3>
<p>A decoded OIDC ID token (header and payload; the signature is binary):</p>
<pre><code>{ "alg": "RS256", "kid": "a1b2c3", "typ": "JWT" }
{
  "iss": "https://login.example-idp.com/tenant-42/v2.0",
  "sub": "00u8f3k2",
  "aud": "my-web-app-client-id",
  "exp": 1791360000,
  "iat": 1791356400,
  "email": "alice@corp.example",
  "groups": ["payments-developers"]
}</code></pre>
<p>A verifier must check: signature against the JWKS key with <code>kid</code> a1b2c3, <code>iss</code> is the expected issuer, <code>aud</code> is its own client ID, and <code>exp</code> is in the future (here <code>exp − iat</code> = 3,600 s, a one-hour token).</p>

<h3>Example 4: Identity Center from the CLI</h3>
<p>Create a permission set and assign a group to an account (run with an admin profile in the delegated administrator account):</p>
<pre><code>INSTANCE=$(aws sso-admin list-instances --query "Instances[0].InstanceArn" --output text)
STORE=$(aws sso-admin list-instances --query "Instances[0].IdentityStoreId" --output text)

PS=$(aws sso-admin create-permission-set --instance-arn "$INSTANCE" --name ReadOnly --session-duration PT4H --query "PermissionSet.PermissionSetArn" --output text)
aws sso-admin attach-managed-policy-to-permission-set --instance-arn "$INSTANCE" --permission-set-arn "$PS" --managed-policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess

GROUP=$(aws identitystore get-group-id --identity-store-id "$STORE" --alternate-identifier '{"UniqueAttribute":{"AttributePath":"displayName","AttributeValue":"Payments-Developers"}}' --query GroupId --output text)
aws sso-admin create-account-assignment --instance-arn "$INSTANCE" --target-id 444455556666 --target-type AWS_ACCOUNT --permission-set-arn "$PS" --principal-type GROUP --principal-id "$GROUP"</code></pre>
<p>In real organisations these assignments live in infrastructure as code (CloudFormation, CDK or Terraform) so that access changes are reviewed like any other change.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>3,000 staff in on-premises AD, 40 accounts, want SSO with existing passwords, minimal AWS footprint</td><td>IAM Identity Center + AD Connector</td><td>Uses the existing AD directly, no directory to run in AWS. Needs VPN/DX to the domain controllers.</td></tr>
<tr><td>Company already uses Entra ID for Microsoft 365 with conditional access</td><td>IAM Identity Center + Entra ID (SAML + SCIM)</td><td>Reuses existing MFA and policies; joiners and leavers flow automatically.</td></tr>
<tr><td>Windows workloads in AWS need AD (SQL Server, FSx, WorkSpaces) and a trust with on-premises AD</td><td>AWS Managed Microsoft AD with a forest trust</td><td>A real AD in AWS keeps working even if the on-premises link fails.</td></tr>
<tr><td>Start-up with 15 engineers and no corporate IdP</td><td>IAM Identity Center with its own directory + MFA</td><td>Free, multi-account, no IAM users; can switch to an external IdP later.</td></tr>
<tr><td>GitHub Actions must deploy to three accounts</td><td>IAM OIDC provider + one deploy role per account with <code>sub</code> conditions</td><td>No stored keys; credentials last one job.</td></tr>
<tr><td>Consumer mobile app with "Sign in with Google" uploading photos to S3</td><td>Cognito user pool + identity pool</td><td>Designed for millions of external users; per-user S3 prefixes with policy variables (M05.10).</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: inspect your own federated session", html: `
<p>If you completed Lab L01, you already sign in through IAM Identity Center. These read-only commands (CloudShell or your SSO profile) show federation at work:</p>
<pre><code># 1. Your identity is a role session, not a user
aws sts get-caller-identity --profile academy-admin
#   "Arn": "arn:aws:sts::111122223333:assumed-role/AWSReservedSSO_AdministratorAccess_1a2b3c4d5e6f7a8b/you@example.com"

# 2. The role Identity Center provisioned, and its trust policy (the SAML provider it trusts)
aws iam list-roles --path-prefix /aws-reserved/sso.amazonaws.com/ --query "Roles[].RoleName" --profile academy-admin
aws iam list-saml-providers --profile academy-admin

# 3. Recent federated sign-ins recorded by CloudTrail
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRoleWithSAML --max-results 5 --query "Events[].{Time:EventTime,User:Username}" --output table --profile academy-admin</code></pre>
<p>Then decode a JWT locally to see claims for yourself. Paste any test token (never a production one) into this snippet:</p>
<pre><code>python3 - &lt;&lt;'EOF'
import base64, json, sys
token = input("JWT: ").strip()
for part in token.split(".")[:2]:
    part += "=" * (-len(part) % 4)          # restore Base64 padding
    print(json.dumps(json.loads(base64.urlsafe_b64decode(part)), indent=2))
EOF</code></pre>
<p>Notice that decoding needs no key: a JWT's content is only <em>signed</em>, not secret.</p>` },

    { type: "casestudy", title: "Case study: Halvorsen Group moves 60 accounts to IAM Identity Center", html: `
<p><strong>Situation.</strong> Halvorsen Group, a fictional logistics company with 4,500 employees, runs 60 AWS accounts. Each account has its own IAM SAML provider pointing at an on-premises AD FS farm, and about 300 roles mapped from AD groups through hand-written AD FS claim rules. Engineers use a home-grown script to get CLI credentials. An audit finds 41 IAM users with access keys older than a year, 9 of them belonging to people who have left.</p>
<p><strong>Requirements.</strong> One sign-in for all accounts and the CLI; MFA everywhere; leavers lose access within an hour; no long-lived keys for people; access changes reviewed as code; no new single point of failure.</p>
<p><strong>Options considered.</strong></p>
<table>
<thead><tr><th>Identity source</th><th>For</th><th>Against</th></tr></thead>
<tbody>
<tr><td>AD Connector to on-premises AD</td><td>Uses AD directly; nothing new for users</td><td>Sign-in depends on the Direct Connect path to the domain controllers; MFA would need a separate RADIUS solution</td></tr>
<tr><td>AWS Managed Microsoft AD with a trust</td><td>Resilient in AWS</td><td>A second directory to pay for and operate; no workloads needed it</td></tr>
<tr><td><strong>Entra ID (already synced from AD for Microsoft 365)</strong></td><td>Existing MFA and conditional access; SCIM provisioning; no network dependency on AD</td><td>Group sync scope must be planned; Entra becomes critical for AWS access</td></tr>
</tbody></table>
<p><strong>Decision.</strong> IAM Identity Center with Entra ID as the external IdP, administered from a dedicated identity account (delegated administrator). It was recorded as an ADR (M04.09).</p>
<p><strong>Rollout.</strong></p>
<ol>
  <li>Analysed CloudTrail for 90 days and found that the 300 roles collapsed into 9 job functions. These became 9 permission sets (ReadOnly, Developer, DataEngineer, PlatformAdmin, NetworkAdmin, SecurityAuditor, BillingViewer, SupportOps, BreakGlass), defined in Terraform.</li>
  <li>Created dedicated Entra groups per (team, environment) and scoped SCIM provisioning to them, rather than syncing all 4,500 users.</li>
  <li>Piloted with the platform team for two weeks, then migrated one organisational unit (OU) per week. AD FS roles were left in place but alarmed for use.</li>
  <li>After 30 quiet days per account, deleted the per-account SAML providers and the IAM users, after checking last-used data.</li>
  <li>Kept two break-glass IAM users with hardware MFA in a locked-down account, with an EventBridge rule paging security on any sign-in.</li>
</ol>
<p><strong>Outcome.</strong> 300 roles became 9 permission sets and about 140 group assignments. Onboarding to AWS went from a 3-day ticket to automatic. A leaver disabled in AD loses AWS access at the next SCIM sync and when their current session (at most 4 hours for most permission sets) expires. Zero long-lived human access keys remained.</p>
<p><strong>Lessons learned.</strong> (1) Design permission sets from <em>observed</em> usage, not wish lists. (2) Plan how your IdP provisions nested or very large groups before migrating. (3) Session length is part of your leaver process: shorter sessions for powerful permission sets. (4) Always keep, test and monitor a break-glass path, because the IdP is now a dependency.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>If the question says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"Employees should use existing corporate (AD) credentials", "single sign-on to multiple AWS accounts"</td><td>IAM Identity Center (+ AD Connector, Managed AD or the corporate IdP)</td></tr>
<tr><td>"AD-aware applications in AWS", "trust relationship with on-premises AD", "SQL Server Windows authentication", "FSx for Windows"</td><td>AWS Managed Microsoft AD</td></tr>
<tr><td>"Use on-premises AD without replicating or caching it in AWS"</td><td>AD Connector</td></tr>
<tr><td>"SAML 2.0 IdP", single account, console access</td><td>IAM SAML identity provider + role; AssumeRoleWithSAML</td></tr>
<tr><td>"Mobile app users", "social identity providers", "millions of users"</td><td>Amazon Cognito, not IAM users and not Identity Center</td></tr>
<tr><td>"Pipeline must not store AWS access keys"</td><td>OIDC federation (AssumeRoleWithWebIdentity)</td></tr>
<tr><td>"On-premises servers need AWS credentials without long-term keys"</td><td>IAM Roles Anywhere</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>"Create an IAM user for each employee"</strong> is almost never right when federation is possible.</li>
  <li><strong>Simple AD</strong> appears as a cheap option, but it has no trusts and isn't an Identity Center identity source.</li>
  <li><strong>"Use Cognito for employees"</strong>: Cognito is for customers of your applications; workforce access to AWS accounts is Identity Center.</li>
  <li><strong>"Replicate AD into AWS"</strong> when the requirement is only console SSO: AD Connector is less effort than running Managed AD.</li>
</ul>
<h3>SAML vs OIDC at a glance</h3>
<table>
<thead><tr><th></th><th>SAML 2.0</th><th>OIDC</th></tr></thead>
<tbody>
<tr><td>Format</td><td>Signed XML assertion</td><td>Signed JSON (JWT)</td></tr>
<tr><td>Typical use</td><td>Enterprise browser SSO</td><td>Web, mobile, APIs, machines (CI/CD, Kubernetes)</td></tr>
<tr><td>STS API</td><td>AssumeRoleWithSAML</td><td>AssumeRoleWithWebIdentity</td></tr>
<tr><td>IAM entity</td><td>SAML identity provider</td><td>OIDC identity provider</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Your IdP is now tier 0.</strong> If it's down, nobody can operate AWS. Check the IdP's SLA, keep break-glass access, and rehearse using it.</li>
  <li><strong>Leaver latency</strong> = SCIM sync delay + remaining session lifetime. For production admin permission sets, keep sessions short (1–2 hours). If you need to cut someone off immediately, revoke active sessions (for example with a deny policy on <code>aws:TokenIssueTime</code>, which the console's "Revoke active sessions" does for a role).</li>
  <li><strong>Don't assign individuals.</strong> Group-based assignments keep access reviewable and make the IdP the place where access is requested and approved.</li>
  <li><strong>Permission sets drift into admin.</strong> Review them quarterly with IAM Access Analyzer unused-access findings (M05.09); use customer managed policies and permissions boundaries in permission sets to keep teams within guardrails.</li>
  <li><strong>OIDC trust policies are easy to get dangerously wrong.</strong> Use Access Analyzer policy validation and custom policy checks in CI to reject trust policies without a <code>sub</code> condition.</li>
  <li><strong>Region choice for Identity Center</strong> matters for data residency and for availability. AWS has added multi-Region support for parts of Identity Center; check current capabilities before you rely on them for DR.</li>
  <li><strong>Troubleshooting SAML:</strong> capture the assertion with the browser's developer tools (or a SAML tracer extension) and check the Role attribute pairs, the audience and the clock skew. Most failures are a wrong ARN pair or an expired or mismatched certificate after the IdP rotated its signing key.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Federation lets AWS trust an external IdP, so people never need IAM users; every session ends as temporary role credentials from STS.</li>
  <li>SAML 2.0 uses signed XML assertions and <code>AssumeRoleWithSAML</code>; OIDC uses JWTs and <code>AssumeRoleWithWebIdentity</code>.</li>
  <li>A JWT is header.payload.signature: signed, readable by anyone, verified with the issuer's JWKS keys and the iss, aud and exp claims.</li>
  <li>IAM Identity Center is the default for workforce access: one identity source, permission sets, group assignments to accounts, one portal and CLI SSO.</li>
  <li>SCIM provisions users and groups from an external IdP automatically; it is what makes joiners and leavers reliable.</li>
  <li>AWS Managed Microsoft AD = real AD in AWS with trusts; AD Connector = proxy to on-premises AD; Simple AD = small, basic, no trusts.</li>
  <li>CI/CD and Kubernetes use OIDC federation; always restrict the token's <code>sub</code>. Customer-facing apps use Cognito.</li>
  <li>Design for IdP outages (break-glass) and for leaver latency (short sessions for powerful roles).</li>
</ul>` }
  ],
  drills: [
    { id: "M05.07-d1", q: "Which STS API does the AWS sign-in endpoint call when a browser posts a SAML assertion?", answers: ["AssumeRoleWithSAML", "sts:AssumeRoleWithSAML"], hint: "It is named after the assertion format.", explain: "AssumeRoleWithSAML exchanges a signed SAML assertion for temporary credentials of the role named in the Role attribute." },
    { id: "M05.07-d2", q: "Which protocol does IAM Identity Center use to provision users and groups automatically from an external IdP such as Entra ID or Okta? (acronym)", answers: ["SCIM"], hint: "System for Cross-domain Identity Management.", explain: "SAML handles sign-in; SCIM keeps users and group memberships in sync, including disabling leavers." },
    { id: "M05.07-d3", q: "The SAML <code>Role</code> attribute contains a pair of ARNs: the role ARN and which other ARN? (two words, e.g. \"X ARN\")", answers: ["provider ARN", "saml provider ARN", "identity provider ARN", "saml-provider ARN", "providerarn"], hint: "It's the IAM entity that holds the IdP's metadata.", explain: "Each value is \"role ARN,SAML provider ARN\", for example arn:aws:iam::111122223333:role/CorpReadOnly,arn:aws:iam::111122223333:saml-provider/CorpADFS." },
    { id: "M05.07-d4", q: "What is the maximum value, in seconds, of the SAML <code>SessionDuration</code> attribute?", answers: ["43200", "43,200"], hint: "12 hours.", explain: "12 h × 3,600 s = 43,200 s. The session is still capped by the role's MaxSessionDuration." },
    { id: "M05.07-d5", q: "Which AWS Directory Service option forwards authentication to your on-premises AD without caching any directory data in AWS?", answers: ["AD Connector", "ADConnector", "AWS AD Connector"], hint: "Its name says it connects, rather than hosts.", explain: "AD Connector is a proxy. It needs network connectivity (VPN/DX) to the domain controllers and supports no trusts." },
    { id: "M05.07-d6", q: "How many dot-separated parts does a signed JWT have?", answers: ["3", "three"], hint: "header . payload . ?", explain: "header.payload.signature, each Base64URL-encoded." },
    { id: "M05.07-d7", q: "A decoded ID token has <code>iat</code> = 1791356400 and <code>exp</code> = 1791360000. How many minutes is the token valid?", answers: ["60", "60 minutes", "60min"], hint: "Subtract, then divide by 60.", explain: "1791360000 − 1791356400 = 3,600 s = 60 minutes." },
    { id: "M05.07-d8", q: "Which STS API does a GitHub Actions workflow use (through configure-aws-credentials) to get AWS credentials from its OIDC token?", answers: ["AssumeRoleWithWebIdentity", "sts:AssumeRoleWithWebIdentity"], hint: "OIDC tokens are 'web identity' tokens to STS.", explain: "AssumeRoleWithWebIdentity validates the JWT against the IAM OIDC identity provider and the role's trust policy conditions (aud, sub)." }
  ],
  check: [
    { id: "M05.07-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company has 3,000 employees in an on-premises Active Directory and 40 AWS accounts in AWS Organizations, connected through Direct Connect. Employees must sign in to all accounts with their existing AD credentials. The company does not want to run or replicate a directory in AWS. Which solution meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Enable IAM Identity Center with AD Connector as the identity source, and assign AD groups to accounts with permission sets", c: true, why: "AD Connector proxies authentication to the existing AD with nothing to replicate, and Identity Center provides SSO and role provisioning across all 40 accounts." },
        { t: "Deploy AWS Managed Microsoft AD, create a two-way forest trust, and configure IAM Identity Center to use it", c: false, why: "This works, but it runs a second directory in AWS, which the company explicitly does not want, and adds operational overhead." },
        { t: "Create IAM users in each account with the same user names as in AD, and enforce MFA", c: false, why: "Separate passwords in 40 accounts: not the existing credentials, and a huge operational and security burden." },
        { t: "Create an Amazon Cognito user pool federated with AD FS and use it to sign in to the AWS console", c: false, why: "Cognito is for application end users; it doesn't provide multi-account workforce access to the AWS console." }
      ] },
    { id: "M05.07-k2", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "A team deploys from GitHub Actions to AWS using an IAM user's access keys stored as repository secrets. The security team wants no long-lived credentials and wants only the main branch of one repository to deploy. Which TWO steps should the architect take?",
      options: [
        { t: "Create an IAM OIDC identity provider for token.actions.githubusercontent.com", c: true, why: "The OIDC provider lets STS validate GitHub's tokens, which the workflow exchanges with AssumeRoleWithWebIdentity." },
        { t: "Create a deployment role whose trust policy checks the token's aud and restricts sub to repo:org/repo:ref:refs/heads/main", c: true, why: "The sub condition limits which repository and branch can assume the role; without it any repository could." },
        { t: "Rotate the IAM user's access keys every 7 days with a Lambda function", c: false, why: "Rotation shortens exposure but the credentials are still long-lived secrets stored outside AWS." },
        { t: "Configure the workflow to call AssumeRoleWithSAML", c: false, why: "GitHub issues OIDC tokens, not SAML assertions." },
        { t: "Create an Amazon Cognito identity pool for GitHub", c: false, why: "Cognito targets end users of applications; the direct IAM OIDC provider is the standard pattern for CI/CD." }
      ] },
    { id: "M05.07-k3", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company runs Amazon RDS for SQL Server with Windows authentication, Amazon FSx for Windows File Server and Amazon WorkSpaces. Users and groups are in an on-premises AD, and the workloads must keep authenticating users even if the on-premises connection fails. Which directory solution should the architect choose?",
      options: [
        { t: "AWS Managed Microsoft AD with a trust relationship to the on-premises domain", c: true, why: "A real AD in AWS supports these AD-aware services and keeps working during a connectivity failure, while the trust lets on-premises identities be used." },
        { t: "AD Connector", c: false, why: "AD Connector forwards every authentication to on-premises AD, so it fails when the connection fails, and it can't form trusts." },
        { t: "Simple AD", c: false, why: "Simple AD has no trusts with on-premises AD and isn't suited to these enterprise integrations." },
        { t: "IAM Identity Center with its own directory", c: false, why: "Identity Center manages AWS access; it isn't an AD domain for SQL Server, FSx or WorkSpaces authentication." }
      ] },
    { id: "M05.07-k4", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company uses Okta as its identity provider and IAM Identity Center for access to 25 AWS accounts. When HR disables an employee in Okta, the employee must lose AWS access without any manual steps in AWS. What should the architect configure?",
      options: [
        { t: "Automatic provisioning with SCIM between Okta and IAM Identity Center", c: true, why: "SCIM synchronises user status and group membership, so disabling a user in Okta disables them in Identity Center automatically." },
        { t: "A nightly Lambda function that deletes IAM users whose names match disabled Okta users", c: false, why: "Federated users have no IAM users; this is custom code for a problem SCIM solves natively." },
        { t: "A shorter SAML SessionDuration of 15 minutes", c: false, why: "Short sessions limit how long an existing session lasts, but they don't stop the user from signing in again if they are still provisioned." },
        { t: "An SCP that denies access to users not listed in a DynamoDB table", c: false, why: "SCPs can't read external tables, and this would be complex and fragile." }
      ] },
    { id: "M05.07-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A consumer mobile app must let users sign in with Google or Apple and then upload photos directly to Amazon S3. Which approach does AWS recommend?",
      options: [
        { t: "Amazon Cognito user pools for sign-in and Cognito identity pools to obtain temporary AWS credentials", c: true, why: "Cognito is designed for application end users at scale, including social sign-in and exchanging tokens for scoped AWS credentials." },
        { t: "IAM Identity Center with Google as the external IdP", c: false, why: "Identity Center is for workforce access to AWS accounts and applications, not millions of consumers." },
        { t: "An IAM user per app user, with access keys embedded in the app", c: false, why: "Never embed long-term credentials in an app; IAM users don't scale to consumer numbers." },
        { t: "An IAM SAML identity provider for Google", c: false, why: "Consumer social sign-in is OIDC/OAuth-based, and the per-account SAML pattern is for enterprise SSO." }
      ] },
    { id: "M05.07-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "Users federate into an AWS account through AD FS with SAML. Security auditors need CloudTrail to show which employee performed each action, even though 200 employees share the same role. What should be configured?",
      options: [
        { t: "Have the IdP send the user's UPN or email in the RoleSessionName SAML attribute", c: true, why: "The role session name appears in the assumed-role ARN in CloudTrail, identifying the person behind each action." },
        { t: "Create one role per employee", c: false, why: "This defeats the purpose of group-based roles and doesn't scale; the session name already provides attribution." },
        { t: "Enable S3 server access logging", c: false, why: "That logs S3 requests only and still shows the shared role." },
        { t: "Set the SessionDuration attribute to 1 hour", c: false, why: "Session length doesn't identify the user." }
      ] }
  ],
  cards: ["fc-M05-7-01", "fc-M05-7-02", "fc-M05-7-03", "fc-M05-7-04", "fc-M05-7-05", "fc-M05-7-06", "fc-M05-7-07", "fc-M05-7-08", "fc-M05-7-09", "fc-M05-7-10", "fc-M05-7-11"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"AWS IAM\" and \"Amazon Cognito\" (PDF p603–610): federation and identity providers",
    "IAM User Guide: <em>Identity providers and federation</em>, <em>SAML 2.0 federation</em>, <em>OIDC federation</em>",
    "IAM Identity Center User Guide: <em>Identity sources</em>, <em>Permission sets</em>, <em>Automatic provisioning (SCIM)</em>",
    "AWS Directory Service Administration Guide: <em>Which to choose</em>",
    "GitHub Docs: <em>Configuring OpenID Connect in Amazon Web Services</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-7-01", front: "What is identity federation?", back: "AWS trusts an external identity provider (IdP) to authenticate users; users get temporary role credentials from STS instead of IAM users." },
  { id: "fc-M05-7-02", front: "SAML 2.0 vs OIDC: format and STS API?", back: "SAML: signed XML assertion → AssumeRoleWithSAML. OIDC: signed JWT → AssumeRoleWithWebIdentity." },
  { id: "fc-M05-7-03", front: "The three SAML attributes AWS console federation uses?", back: "Role (role ARN + provider ARN pairs), RoleSessionName (who), SessionDuration (900–43,200 s, optional). Optional PrincipalTag:* for ABAC." },
  { id: "fc-M05-7-04", front: "ID token vs access token?", back: "ID token (OIDC): who the user is, for the client app. Access token (OAuth 2.0): what the client may call, for the API." },
  { id: "fc-M05-7-05", front: "Parts of a JWT and what a verifier checks?", back: "header.payload.signature. Check the signature with the issuer's JWKS key (kid), plus iss, aud and exp." },
  { id: "fc-M05-7-06", front: "IAM Identity Center: permission set vs account assignment?", back: "Permission set = permissions template (policies, boundary, session length). Assignment = user/group + permission set + account → a provisioned AWSReservedSSO_ role." },
  { id: "fc-M05-7-07", front: "What does SCIM add to SAML in Identity Center?", back: "Automatic provisioning: users and groups are created, updated and disabled from the IdP, so joiners and leavers flow without manual steps." },
  { id: "fc-M05-7-08", front: "Managed Microsoft AD vs AD Connector vs Simple AD?", back: "Managed AD: real AD in AWS, trusts, AD-aware apps. AD Connector: proxy to on-prem AD, no caching, no trusts. Simple AD: small Samba-based, no trusts." },
  { id: "fc-M05-7-09", front: "How should GitHub Actions authenticate to AWS?", back: "IAM OIDC provider + role trusting token.actions.githubusercontent.com, with aud = sts.amazonaws.com and a sub condition pinning repo and branch." },
  { id: "fc-M05-7-10", front: "Workforce vs customer identity on AWS?", back: "Workforce (employees) → IAM Identity Center. Customers of your apps → Amazon Cognito." },
  { id: "fc-M05-7-11", front: "How do you attribute actions to people who share a federated role?", back: "Set RoleSessionName to the user's identity; CloudTrail shows assumed-role/RoleName/&lt;session name&gt;." }
);
// ================================================================== 08_abac.js
/* ---------------------------------------------------------------- M05.08 Attribute-based access control (ABAC) */
var DG_0508_MATCH = `
<figure>
<svg class="diagram" viewBox="0 0 760 292" role="img" aria-labelledby="m0508at m0508ad">
  <title id="m0508at">ABAC: matching principal tags to resource tags</title>
  <desc id="m0508ad">A role session tagged project equals atlas is evaluated against one ABAC policy that allows reading a secret only when the secret's project tag equals the principal's project tag. The secret tagged atlas is allowed; the secret tagged zephyr and an untagged secret are denied.</desc>
  <defs><marker id="m0508a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="10" y="40" width="210" height="100" rx="10"/>
  <text class="dg-tb" x="24" y="64">Role session: alice</text>
  <text class="dg-ts" x="24" y="88">PrincipalTag project = atlas</text>
  <text class="dg-ts" x="24" y="106">PrincipalTag env = dev</text>
  <text class="dg-ts" x="24" y="126">(from the IdP or the role)</text>
  <path class="dg-line" d="M220 90 H268" marker-end="url(#m0508a-ar)"/>

  <rect class="dg-edge" x="270" y="30" width="220" height="120" rx="10"/>
  <text class="dg-tb" x="284" y="54">One ABAC policy</text>
  <text class="dg-ts" x="284" y="78">Allow GetSecretValue when</text>
  <text class="dg-ts" x="284" y="96">ResourceTag/project</text>
  <text class="dg-ts" x="284" y="114">= PrincipalTag/project</text>
  <text class="dg-ts" x="284" y="136">same policy for every team</text>

  <path class="dg-line" d="M490 70 L538 48" marker-end="url(#m0508a-ar)"/>
  <path class="dg-line" d="M490 90 L538 118" marker-end="url(#m0508a-ar)"/>
  <path class="dg-line" d="M490 110 L538 188" marker-end="url(#m0508a-ar)"/>
  <rect class="dg-good" x="540" y="20" width="210" height="56" rx="8"/><text class="dg-t" x="552" y="42">secret: atlas-db</text><text class="dg-ts" x="552" y="62">project = atlas · ✔ allowed</text>
  <rect class="dg-bad" x="540" y="90" width="210" height="56" rx="8"/><text class="dg-t" x="552" y="112">secret: zephyr-db</text><text class="dg-ts" x="552" y="132">project = zephyr · ✘ denied</text>
  <rect class="dg-bad" x="540" y="160" width="210" height="56" rx="8"/><text class="dg-t" x="552" y="182">secret: legacy-db</text><text class="dg-ts" x="552" y="202">no project tag · ✘ denied</text>

  <text class="dg-ts" x="10" y="250">Add a new team: tag its people and its resources. No new role, no policy change.</text>
  <text class="dg-ts" x="10" y="270">Whoever can change tags controls access, so protect the tag keys you authorise on.</text>
</svg>
<figcaption>Figure M05-8a. ABAC compares attributes at request time. The policy never names a project: it says "same project as you", so it works unchanged for every team.</figcaption>
</figure>`;

var DG_0508_GROWTH = `
<figure>
<svg class="diagram" viewBox="0 0 760 236" role="img" aria-labelledby="m0508bt m0508bd">
  <title id="m0508bt">RBAC role count versus ABAC policy count</title>
  <desc id="m0508bd">With three environments, RBAC needs one role per team and environment: 30 roles for 10 teams, 90 for 30 teams and 180 for 60 teams. ABAC needs one policy per job function, here 3, regardless of the number of teams.</desc>
  <text class="dg-tb" x="16" y="24">Roles or policies needed (3 environments, 3 job functions)</text>
  <rect class="dg-edge" x="520" y="34" width="14" height="12" rx="2"/><text class="dg-ts" x="540" y="45">RBAC: one role per team × env</text>
  <rect class="dg-good" x="520" y="52" width="14" height="12" rx="2"/><text class="dg-ts" x="540" y="63">ABAC: one policy per job function</text>

  <text class="dg-t" x="16" y="96">10 teams</text>
  <rect class="dg-edge" x="110" y="80" width="90" height="16" rx="3"/><text class="dg-ts" x="208" y="92">30 roles</text>
  <rect class="dg-good" x="110" y="100" width="9" height="16" rx="3"/><text class="dg-ts" x="126" y="112">3 policies</text>

  <text class="dg-t" x="16" y="152">30 teams</text>
  <rect class="dg-edge" x="110" y="136" width="270" height="16" rx="3"/><text class="dg-ts" x="388" y="148">90 roles</text>
  <rect class="dg-good" x="110" y="156" width="9" height="16" rx="3"/><text class="dg-ts" x="126" y="168">3 policies</text>

  <text class="dg-t" x="16" y="208">60 teams</text>
  <rect class="dg-edge" x="110" y="192" width="540" height="16" rx="3"/><text class="dg-ts" x="658" y="204">180 roles</text>
  <rect class="dg-good" x="110" y="212" width="9" height="16" rx="3"/><text class="dg-ts" x="126" y="224">3 policies</text>
</svg>
<figcaption>Figure M05-8b. RBAC grows with teams × environments; ABAC stays flat because the team and environment become attributes instead of new roles.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.08", title: "Attribute-based access control (ABAC)", level: 400, minutes: 55,
  objectives: [
    "Explain the role-explosion problem of RBAC and how ABAC solves it with attributes",
    "Use aws:PrincipalTag, aws:ResourceTag, aws:RequestTag and aws:TagKeys to write a complete ABAC policy set",
    "Prevent tag tampering and enforce tagging with policies, SCPs and tag policies",
    "Pass session tags from an IdP or IAM Identity Center and roll ABAC out safely, knowing which services support it"
  ],
  sections: [
    { type: "why", html: `
<p>A data platform has 30 project teams and three environments (dev, test, prod). With classic role-based access control, each (team, environment) pair gets its own role and its own policy listing that team's resources: 90 roles, 90 policies, and a ticket every time a project starts. Six months later, someone copies a policy to save time and forgets to change one ARN. Team Zephyr can now read Team Atlas's production database secrets.</p>
<p><strong>Attribute-based access control (ABAC)</strong> replaces "this role may use these named resources" with a rule: <em>"you may use resources whose project tag matches your project tag"</em>. One policy serves all 30 teams, new projects need no IAM change, and copy-paste mistakes disappear. It is AWS's recommended way to scale permissions, it appears in SAA-C03 scenarios as "grant access based on tags" or "minimise the number of policies as teams grow", and it is a core skill for anyone designing a multi-team platform.</p>` },

    { type: "concept", title: "From RBAC to ABAC", html: DG_0508_GROWTH + `
<h3>RBAC: permissions follow the job role</h3>
<p>In <strong>role-based access control (RBAC)</strong>, you create a role for each job function and list the resources it may use. It is simple and easy to audit while the organisation is small. It breaks down when the <em>scope</em> of access (which project, which environment, which customer) multiplies the number of roles: <strong>roles = functions × scopes</strong>. With 3 functions, 30 teams and 3 environments, a strict RBAC design needs up to 270 roles. Every new team means new roles and policy edits, and IAM quotas (for example 10 managed policies per role by default, 6,144 characters per managed policy) start to bite.</p>

<h3>ABAC: permissions follow attributes</h3>
<p>In <strong>ABAC</strong>, the decision compares <em>attributes</em> of the principal, the resource and the request at the moment of the call. On AWS, attributes are <strong>tags</strong> (key–value pairs). A single policy says, in effect, "Allow these actions when the resource's <code>project</code> tag equals the caller's <code>project</code> tag". You still have a few roles (per job function), but you no longer need one per scope.</p>
<table>
<thead><tr><th></th><th>RBAC</th><th>ABAC</th></tr></thead>
<tbody>
<tr><td>Policy says</td><td>"Role X may use resources A, B, C"</td><td>"Anyone may use resources with the same project tag as them"</td></tr>
<tr><td>New team or project</td><td>New roles and policy edits</td><td>Tag the people and the resources; no IAM change</td></tr>
<tr><td>New resource</td><td>Update the policy's resource list (or use broad wildcards)</td><td>Tag it at creation; access follows automatically</td></tr>
<tr><td>Granularity</td><td>Coarse, unless policies become very long</td><td>Fine-grained by any combination of attributes</td></tr>
<tr><td>Main risk</td><td>Role sprawl, copy-paste errors</td><td>Tag tampering, untagged resources, inconsistent tag values</td></tr>
<tr><td>Audit question "who can access X?"</td><td>Read the policies</td><td>Read the policies <em>and</em> the tags (harder)</td></tr>
</tbody></table>
<p>Most real designs are <strong>hybrid</strong>: RBAC for the job function (what <em>kind</em> of actions: developer, data engineer, read-only) and ABAC for the scope (which project and environment).</p>

<h3>The three kinds of tags in a request</h3>
<table>
<thead><tr><th>Condition key</th><th>Whose tag</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><code>aws:PrincipalTag/<em>key</em></code></td><td>The caller: tags on the IAM role or user, or <strong>session tags</strong> passed when the role was assumed</td><td>The attribute to match against: the user's project, team, cost centre or clearance</td></tr>
<tr><td><code>aws:ResourceTag/<em>key</em></code></td><td>The existing resource being acted on</td><td>Allow actions on resources that belong to the caller's project</td></tr>
<tr><td><code>aws:RequestTag/<em>key</em></code></td><td>Tags supplied <em>in this request</em> (for example on create, or in a TagResource call)</td><td>Force new resources to be tagged with the caller's own project</td></tr>
<tr><td><code>aws:TagKeys</code></td><td>The list of tag <em>keys</em> in the request</td><td>Allow only approved keys, or detect attempts to change a protected key</td></tr>
</tbody></table>
<p>The link between principal and resource is a <strong>policy variable</strong>: <code>"aws:ResourceTag/project": "\${aws:PrincipalTag/project}"</code>. At evaluation time IAM replaces the variable with the caller's own tag value. If the caller has no <code>project</code> tag, the variable can't be resolved, the condition is false, and nothing is allowed by that statement: ABAC fails closed.</p>

<h3>Where principal tags come from</h3>
<ul>
  <li><strong>Tags on the IAM role or user</strong> (for example a workload role tagged <code>project=atlas</code>).</li>
  <li><strong>Session tags</strong> passed when assuming a role: in <code>AssumeRole</code> calls (<code>--tags</code>), in SAML assertions (<code>https://aws.amazon.com/SAML/Attributes/PrincipalTag:project</code>), in OIDC tokens, or from IAM Identity Center's <strong>attributes for access control</strong>, which map user attributes from the identity source (department, cost centre, a custom "project" attribute) to session tags. The role's trust policy must allow <code>sts:TagSession</code>.</li>
  <li>If a session tag and a role tag have the same key, the <strong>session tag wins</strong>. Session tags can be marked <strong>transitive</strong> so they persist through role chaining.</li>
</ul>
<p>Because the IdP becomes the source of attributes, ABAC + federation (M05.07) means HR moving someone to another project in the directory changes their AWS access at their next sign-in, with no AWS change at all.</p>` },

    { type: "workflow", title: "Rolling out ABAC step by step", html: DG_0508_MATCH + `
<ol class="flow">
  <li><strong>Define the attribute model.</strong> Pick a small set of authorisation tag keys (for example <code>project</code>, <code>env</code>), their allowed values and their spelling. Write it down; this is now part of your security model, not just cost reporting.</li>
  <li><strong>Standardise with tag policies.</strong> AWS Organizations tag policies enforce key capitalisation and allowed values for chosen resource types, and report non-compliant resources.</li>
  <li><strong>Get attributes onto principals.</strong> For people: map IdP attributes to session tags (Identity Center attributes for access control, or SAML <code>PrincipalTag</code> attributes). For workloads: tag the workload roles.</li>
  <li><strong>Tag resources at creation.</strong> Infrastructure as code applies tags; ABAC policies require the caller's own project in <code>aws:RequestTag</code> on create, and an SCP denies creating untagged resources.</li>
  <li><strong>Write the ABAC policies</strong> per job function: allow actions where <code>aws:ResourceTag/project</code> equals <code>\${aws:PrincipalTag/project}</code>; allow create only with matching request tags; deny changes to the authorisation tag keys.</li>
  <li><strong>Check service support.</strong> In the Service Authorization Reference, confirm each action supports <code>aws:ResourceTag</code> (resource-level permissions and condition keys). Write separate, explicit statements for actions that don't (often <code>List*</code> and some <code>Describe*</code> calls).</li>
  <li><strong>Backfill legacy resources.</strong> Untagged resources become inaccessible under ABAC (fail closed). Find them with Resource Groups Tag Editor or AWS Config and tag them before switching over.</li>
  <li><strong>Test</strong> with the IAM policy simulator and real sessions for each (team, environment) pair, including negative tests (other team, missing tag, attempted re-tag).</li>
  <li><strong>Monitor:</strong> alert on <code>TagResource</code>/<code>CreateTags</code>/<code>UntagResource</code> events touching authorisation keys, and on AccessDenied spikes after rollout.</li>
</ol>` },

    { type: "aws", title: "ABAC on AWS: building blocks and limits", html: `
<table>
<thead><tr><th>Building block</th><th>Role in ABAC</th></tr></thead>
<tbody>
<tr><td>IAM policies with tag condition keys</td><td>The rules: match principal tags to resource and request tags</td></tr>
<tr><td>Session tags (<code>sts:TagSession</code>)</td><td>Carry user attributes from the IdP into each session</td></tr>
<tr><td>IAM Identity Center attributes for access control</td><td>Map identity-source attributes to session tags for all permission sets</td></tr>
<tr><td>Organizations tag policies</td><td>Standardise tag keys and values; report non-compliance</td></tr>
<tr><td>SCPs</td><td>Guardrails across accounts: deny untagged creation, deny changes to protected tag keys</td></tr>
<tr><td>Resource Groups Tag Editor, AWS Config rules (for example <code>required-tags</code>)</td><td>Find and fix untagged resources</td></tr>
<tr><td>IAM policy simulator, Access Analyzer</td><td>Test decisions; validate policy grammar</td></tr>
</tbody></table>
<h3>Things to know</h3>
<ul>
  <li><strong>Service support varies.</strong> Many services support <code>aws:ResourceTag</code> on most actions (EC2, Secrets Manager, SSM, RDS, DynamoDB tables, KMS, Lambda, S3 buckets and objects with their own tag keys…), but not every action of every service. "AWS services that work with IAM" lists an <em>ABAC</em> column; the Service Authorization Reference lists condition keys per action.</li>
  <li><strong>Creation actions</strong> have no existing resource, so they use <code>aws:RequestTag</code> and <code>aws:TagKeys</code>, not <code>aws:ResourceTag</code>. Some services also need the tagging permission (for example <code>secretsmanager:TagResource</code> or <code>ec2:CreateTags</code>) for tag-on-create.</li>
  <li><strong>A principal tag has one value per key.</strong> Someone working on two projects needs either two sessions (two permission sets or roles) or a different attribute design.</li>
  <li><strong>Comparisons:</strong> <code>StringEquals</code> compares tag <em>values</em> case-sensitively, so <code>Atlas</code> ≠ <code>atlas</code>. Standardise values with tag policies.</li>
  <li><strong>Session tag limits</strong> exist (a maximum number of session tags and a packed size limit for the session); keep authorisation attributes few and short.</li>
  <li>ABAC is evaluated within the normal logic (M05.04): an explicit deny still wins, and SCPs and boundaries still limit the result.</li>
</ul>` },

    { type: "examples", html: `
<h3>Example 1: a complete EC2 ABAC policy set</h3>
<p>Attach this to the <code>Developer</code> role or permission set. Developers can launch instances only tagged with their own project, manage only their project's instances, and can't re-label anything.</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LaunchOnlyWithOwnProjectTag",
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
        "arn:aws:ec2:*:111122223333:instance/*",
        "arn:aws:ec2:*:111122223333:volume/*"
      ],
      "Condition": {
        "StringEquals": { "aws:RequestTag/project": "\${aws:PrincipalTag/project}" },
        "ForAllValues:StringEquals": { "aws:TagKeys": ["project", "env", "Name"] }
      }
    },
    {
      "Sid": "LaunchUsingSharedResources",
      "Effect": "Allow",
      "Action": "ec2:RunInstances",
      "Resource": [
        "arn:aws:ec2:*::image/*",
        "arn:aws:ec2:*:111122223333:subnet/*",
        "arn:aws:ec2:*:111122223333:network-interface/*",
        "arn:aws:ec2:*:111122223333:security-group/*",
        "arn:aws:ec2:*:111122223333:key-pair/*"
      ]
    },
    {
      "Sid": "TagOnlyDuringLaunch",
      "Effect": "Allow",
      "Action": "ec2:CreateTags",
      "Resource": [
        "arn:aws:ec2:*:111122223333:instance/*",
        "arn:aws:ec2:*:111122223333:volume/*"
      ],
      "Condition": { "StringEquals": { "ec2:CreateAction": "RunInstances" } }
    },
    {
      "Sid": "ManageOwnProjectInstances",
      "Effect": "Allow",
      "Action": ["ec2:StartInstances", "ec2:StopInstances", "ec2:RebootInstances", "ec2:TerminateInstances"],
      "Resource": "arn:aws:ec2:*:111122223333:instance/*",
      "Condition": { "StringEquals": { "aws:ResourceTag/project": "\${aws:PrincipalTag/project}" } }
    },
    {
      "Sid": "ReadOnlyDescribe",
      "Effect": "Allow",
      "Action": "ec2:Describe*",
      "Resource": "*"
    },
    {
      "Sid": "NeverChangeTheProjectTagAfterLaunch",
      "Effect": "Deny",
      "Action": ["ec2:CreateTags", "ec2:DeleteTags"],
      "Resource": "*",
      "Condition": {
        "ForAnyValue:StringEquals": { "aws:TagKeys": ["project"] },
        "StringNotEquals": { "ec2:CreateAction": "RunInstances" }
      }
    }
  ]
}</code></pre>
<p>How each statement works:</p>
<ul>
  <li><strong>Statement 1</strong> uses <code>aws:RequestTag</code> because the instance doesn't exist yet. The set operator <code>ForAllValues:StringEquals</code> on <code>aws:TagKeys</code> means "every key in the request must be in this list", which blocks surprise keys.</li>
  <li><strong>Statement 2</strong> is needed because <code>RunInstances</code> also authorises against the AMI, subnet, security group and so on, which aren't tagged per project.</li>
  <li><strong>Statement 3</strong> allows tagging only as part of the launch (<code>ec2:CreateAction</code>).</li>
  <li><strong>Statement 4</strong> is the core ABAC rule for existing resources.</li>
  <li><strong>Statement 5</strong> exists because most <code>Describe*</code> actions don't support resource-level permissions, so they can't be scoped by tag.</li>
  <li><strong>Statement 6</strong> is the tamper guard. Outside a launch, any request that touches the <code>project</code> key is denied. In a standalone <code>CreateTags</code> call the <code>ec2:CreateAction</code> key is absent, and a negated operator such as <code>StringNotEquals</code> evaluates to true for a missing key, so the deny applies.</li>
</ul>

<h3>Example 2: Secrets Manager, read your own project's secrets</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadSameProjectAndEnvSecrets",
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/project": "\${aws:PrincipalTag/project}",
          "aws:ResourceTag/env": "\${aws:PrincipalTag/env}"
        }
      }
    },
    {
      "Sid": "ListIsNotTagScoped",
      "Effect": "Allow",
      "Action": "secretsmanager:ListSecrets",
      "Resource": "*"
    }
  ]
}</code></pre>
<p>Two keys inside one <code>StringEquals</code> block are combined with AND: the secret must match both the caller's project and the caller's environment. A developer whose session carries <code>project=atlas, env=dev</code> reads only Atlas dev secrets; the same policy gives Zephyr's prod engineers only Zephyr prod secrets.</p>

<h3>Example 3: an SCP guardrail across accounts</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUntaggedSecrets",
      "Effect": "Deny",
      "Action": "secretsmanager:CreateSecret",
      "Resource": "*",
      "Condition": { "Null": { "aws:RequestTag/project": "true" } }
    },
    {
      "Sid": "OnlyPlatformMayRelabelProject",
      "Effect": "Deny",
      "Action": ["secretsmanager:TagResource", "secretsmanager:UntagResource"],
      "Resource": "*",
      "Condition": {
        "ForAnyValue:StringEquals": { "aws:TagKeys": ["project"] },
        "ArnNotLike": { "aws:PrincipalArn": "arn:aws:iam::*:role/PlatformTagAdmin" }
      }
    }
  ]
}</code></pre>
<p>The <code>Null</code> operator tests whether a key is present: <code>"true"</code> means "the request has no project tag". The second statement lets only a dedicated platform role change the authorisation key.</p>

<h3>Example 4: evaluating requests by hand</h3>
<table>
<thead><tr><th>Caller (session tags)</th><th>Action and resource tags</th><th>Result (Example 2 policy)</th></tr></thead>
<tbody>
<tr><td>project=atlas, env=dev</td><td>GetSecretValue on secret project=atlas, env=dev</td><td>Allowed</td></tr>
<tr><td>project=atlas, env=dev</td><td>GetSecretValue on secret project=atlas, env=prod</td><td>Denied (env doesn't match)</td></tr>
<tr><td>project=atlas, env=dev</td><td>GetSecretValue on secret project=Atlas, env=dev</td><td>Denied (values are case-sensitive)</td></tr>
<tr><td>no project tag</td><td>GetSecretValue on secret project=atlas, env=dev</td><td>Denied (variable can't resolve; fails closed)</td></tr>
<tr><td>project=atlas, env=dev</td><td>GetSecretValue on an untagged secret</td><td>Denied (resource tag missing)</td></tr>
</tbody></table>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>ABAC design</th><th>Why it fits</th></tr></thead>
<tbody>
<tr><td>Many project teams share an account; each may touch only its own resources</td><td>Match <code>project</code> principal tag to resource tag</td><td>One policy for all teams; new projects need no IAM change</td></tr>
<tr><td>Developers may change dev but only read prod</td><td>Write actions conditioned on <code>aws:ResourceTag/env = dev</code>; read actions unrestricted by env</td><td>Environment becomes an attribute, not a separate role</td></tr>
<tr><td>Multi-tenant SaaS storing tenant data in DynamoDB or S3</td><td>Tenant ID as a session tag; DynamoDB <code>dynamodb:LeadingKeys</code> or S3 prefixes using <code>\${aws:PrincipalTag/tenant}</code></td><td>Tenant isolation enforced by IAM, not just application code</td></tr>
<tr><td>Data platform where cost centre decides which datasets are visible</td><td>IdP attribute <code>costcenter</code> → session tag via Identity Center attributes for access control</td><td>Access follows HR data automatically</td></tr>
<tr><td>Contractors must only use resources they created</td><td>Tag <code>owner = \${aws:username}</code> or the session name on create; allow actions where owner matches</td><td>Per-person scope without per-person policies</td></tr>
<tr><td>Small team, three resources, rarely changes</td><td>Plain RBAC with resource ARNs</td><td>ABAC's tagging discipline isn't worth it at this scale</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: test ABAC decisions with the policy simulator (free, read-only)", html: `
<p>Save Example 2 as <code>abac-secrets.json</code>, then ask the IAM policy simulator for decisions. Context entries supply the tag values that a real request would carry:</p>
<pre><code>ARN=arn:aws:secretsmanager:eu-west-1:111122223333:secret:atlas-db-AbCdEf

# Same project and environment: expect "allowed"
aws iam simulate-custom-policy --policy-input-list file://abac-secrets.json --action-names secretsmanager:GetSecretValue --resource-arns "$ARN" --context-entries "ContextKeyName=aws:PrincipalTag/project,ContextKeyValues=atlas,ContextKeyType=string" "ContextKeyName=aws:PrincipalTag/env,ContextKeyValues=dev,ContextKeyType=string" "ContextKeyName=aws:ResourceTag/project,ContextKeyValues=atlas,ContextKeyType=string" "ContextKeyName=aws:ResourceTag/env,ContextKeyValues=dev,ContextKeyType=string" --query "EvaluationResults[].{Action:EvalActionName,Decision:EvalDecision}" --output table --profile academy-admin

# Change the resource's project to zephyr: expect "implicitDeny"
aws iam simulate-custom-policy --policy-input-list file://abac-secrets.json --action-names secretsmanager:GetSecretValue --resource-arns "$ARN" --context-entries "ContextKeyName=aws:PrincipalTag/project,ContextKeyValues=atlas,ContextKeyType=string" "ContextKeyName=aws:PrincipalTag/env,ContextKeyValues=dev,ContextKeyType=string" "ContextKeyName=aws:ResourceTag/project,ContextKeyValues=zephyr,ContextKeyType=string" "ContextKeyName=aws:ResourceTag/env,ContextKeyValues=dev,ContextKeyType=string" --query "EvaluationResults[].{Action:EvalActionName,Decision:EvalDecision}" --output table --profile academy-admin</code></pre>
<p>Try more variations: <code>Atlas</code> with a capital letter, or leave out the principal's project entry. Predict each result before you run it. <code>implicitDeny</code> means no statement allowed the request; <code>explicitDeny</code> would mean a Deny statement matched.</p>
<p>Then find what in your account would break under ABAC (resources without a <code>project</code> tag):</p>
<pre><code>aws resourcegroupstaggingapi get-resources --query "ResourceTagMappingList[?!not_null(Tags[?Key=='project'] | [0])].ResourceARN" --profile academy-admin</code></pre>
<p class="muted small">The tagging API lists only resources that have, or once had, tags; use AWS Config or Tag Editor for a complete inventory.</p>` },

    { type: "casestudy", title: "Case study: Corvid Analytics collapses 90 roles into 3", html: `
<p><strong>Situation.</strong> Corvid Analytics, a fictional data company, runs a shared data platform in three accounts (dev, test, prod). 30 project teams each had a role per environment: 90 roles, each with a hand-maintained policy listing that team's S3 prefixes, Glue databases, secrets and EC2 instances. Starting a project took two days of IAM tickets. A quarterly review found 11 policies granting access to another team's resources, all from copy-paste edits.</p>
<p><strong>Requirements.</strong> Isolation between projects in every environment; read-only prod for developers; new projects onboarded with no IAM change; access driven by the corporate directory; no reduction in auditability.</p>
<p><strong>Design.</strong></p>
<ul>
  <li><strong>Attributes:</strong> two authorisation keys, <code>project</code> and <code>env</code>, with allowed values enforced by an Organizations tag policy.</li>
  <li><strong>Principals:</strong> three permission sets in IAM Identity Center (Developer, DataEngineer, ReadOnly). "Attributes for access control" map the Entra ID attribute <code>extensionAttribute5</code> (project) to the <code>project</code> session tag; <code>env</code> is fixed per account through a tag on each account's provisioned role, combined in policies with <code>aws:ResourceTag/env</code>.</li>
  <li><strong>Resources:</strong> Terraform modules tag everything at creation. An SCP denies creating secrets, instances, buckets and Glue databases without a <code>project</code> tag, and denies tag changes to <code>project</code>/<code>env</code> except by the platform pipeline role.</li>
  <li><strong>Policies:</strong> ABAC statements like the examples above, plus explicit statements for non-tag-scoped actions (List/Describe). S3 data access used prefixes named after the project (<code>s3://corvid-lake/\${aws:PrincipalTag/project}/*</code>).</li>
</ul>
<p><strong>Rollout.</strong> Backfilled tags on 14,000 existing resources (Tag Editor plus a script driven by the old policies' resource lists). Ran old and new access side by side for a month with the policy simulator and CloudTrail AccessDenied monitoring. Then deleted the 90 roles.</p>
<p><strong>Outcome.</strong> 90 roles became 3 permission sets; onboarding a project became "create a directory group and set the attribute". The cross-team access findings went to zero, and IAM Access Analyzer reported no new external access.</p>
<p><strong>What went wrong and the fixes.</strong></p>
<ul>
  <li>About 300 legacy resources were missed in the backfill and became inaccessible on day one. That is ABAC failing closed: inconvenient but safe. They were tagged within hours.</li>
  <li>Eight people genuinely worked on two projects. A principal tag holds one value, so they received a second permission set assignment and sign into one project at a time.</li>
  <li>Two services in use didn't support tag-based conditions for some actions; those got narrow RBAC statements with explicit ARNs.</li>
</ul>
<p><strong>Lesson.</strong> ABAC moves the security boundary from policy documents to <em>tags</em>. The project succeeded because tag governance (tag policies, SCP guardrails, pipeline-only re-tagging) was designed first.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>If the question says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"Grant access based on tags", "the number of teams keeps growing", "minimise the number of IAM policies"</td><td>ABAC: <code>aws:ResourceTag</code> = <code>\${aws:PrincipalTag/…}</code></td></tr>
<tr><td>"Users may only create resources tagged with their own department"</td><td><code>aws:RequestTag</code> condition on the create action</td></tr>
<tr><td>"Prevent users from removing or changing a tag"</td><td>Deny <code>TagResource</code>/<code>UntagResource</code> (or <code>ec2:CreateTags</code>/<code>DeleteTags</code>) with <code>aws:TagKeys</code>; enforce org-wide with an SCP</td></tr>
<tr><td>"Pass user attributes from the corporate IdP to AWS"</td><td>Session tags (SAML <code>PrincipalTag</code> attributes, Identity Center attributes for access control)</td></tr>
<tr><td>"Enforce consistent tag keys and values across accounts"</td><td>Organizations tag policies</td></tr>
<tr><td>"Deny creating resources without a tag"</td><td>SCP or IAM Deny with <code>Null</code> on <code>aws:RequestTag/key</code></td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>Cost allocation tags</strong> activate tags for billing reports; they don't control access.</li>
  <li><strong>Resource groups</strong> organise resources; they don't grant permissions.</li>
  <li><strong>"Create a role per team"</strong> works but is the RBAC answer when the question asks for scale or fewer policies.</li>
  <li><strong>Tag policies</strong> standardise tags; they don't block API calls by themselves (that is the job of SCPs and IAM policies).</li>
</ul>
<h3>The four keys, one line each</h3>
<ul>
  <li><code>aws:PrincipalTag</code>: tags on the caller (role, user or session).</li>
  <li><code>aws:ResourceTag</code>: tags already on the target resource.</li>
  <li><code>aws:RequestTag</code>: tags sent in this request.</li>
  <li><code>aws:TagKeys</code>: the list of tag keys in this request.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Tags are now security-critical data.</strong> Treat the authorisation tag keys like IAM policy: change them only through pipelines, alert on manual changes, and keep them separate from free-form cost tags.</li>
  <li><strong>Who can tag controls access.</strong> A user who can set <code>project=atlas</code> on their own role, or on someone else's resource, can grant themselves access. Never let principals tag themselves (deny <code>iam:TagRole</code>/<code>iam:TagUser</code>) and deny resource re-tagging of authorisation keys.</li>
  <li><strong>Design for failure closed.</strong> Missing tags deny access. That's safe, but plan the backfill and communication, or day one becomes an outage for legacy resources.</li>
  <li><strong>Auditing is harder.</strong> "Who can read secret X?" now depends on tag values in the directory. Export Identity Center attribute mappings and resource tags into your access reviews; use Access Analyzer for external access.</li>
  <li><strong>Combine with account boundaries.</strong> ABAC is excellent inside an account; accounts remain the strongest isolation boundary for production vs non-production and for regulated workloads (M06).</li>
  <li><strong>Keep attributes few and stable.</strong> Session tag limits, single values per key and reviewability all argue for 2–4 authorisation attributes, not dozens.</li>
  <li><strong>Test negative cases in CI:</strong> run simulator checks or Access Analyzer custom policy checks for "other project", "missing tag" and "re-tag attempt" on every policy change.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>RBAC role counts grow with functions × scopes; ABAC keeps one policy per function and turns scope (project, environment, tenant) into tags.</li>
  <li>Core rule: allow when <code>aws:ResourceTag/key</code> equals <code>\${aws:PrincipalTag/key}</code>.</li>
  <li>Use <code>aws:RequestTag</code> and <code>aws:TagKeys</code> to force correct tags on create; deny changes to authorisation keys afterwards.</li>
  <li>Principal tags come from role or user tags or from session tags (SAML, OIDC, Identity Center attributes for access control); session tags override role tags.</li>
  <li>ABAC fails closed: missing principal or resource tags mean no access.</li>
  <li>Not every action supports tag conditions; check the Service Authorization Reference and handle exceptions explicitly.</li>
  <li>Govern tags with tag policies (consistency), SCPs (enforcement) and pipelines (who may change them).</li>
  <li>Tag values compare case-sensitively with <code>StringEquals</code>; standardise them.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.08-d1", q: "Policy: Allow <code>secretsmanager:GetSecretValue</code> when <code>aws:ResourceTag/project</code> = <code>\${aws:PrincipalTag/project}</code>. The caller's session has <code>project=atlas</code>; the secret is tagged <code>project=atlas</code>. Allowed or denied?", answers: ["allowed", "allow"], hint: "Do the values match exactly?", explain: "Both values are atlas, so the condition is true and the statement allows the request (assuming no explicit deny elsewhere)." },
    { id: "M05.08-d2", q: "Same policy. The caller has <code>project=atlas</code>; the secret is tagged <code>project=Atlas</code>. Allowed or denied?", answers: ["denied", "deny"], hint: "StringEquals compares values case-sensitively.", explain: "atlas ≠ Atlas under StringEquals, so nothing allows the request: implicit deny." },
    { id: "M05.08-d3", q: "Same policy. The caller's session has NO <code>project</code> tag; the secret is tagged <code>project=atlas</code>. Allowed or denied?", answers: ["denied", "deny"], hint: "What happens when a policy variable can't be resolved?", explain: "The variable can't be resolved, the condition is false and the statement doesn't apply. ABAC fails closed." },
    { id: "M05.08-d4", q: "Strict RBAC with one role per team per environment: how many roles do 30 teams in 3 environments need?", answers: ["90"], hint: "Multiply.", explain: "30 × 3 = 90 roles, versus a handful of ABAC policies (one per job function)." },
    { id: "M05.08-d5", q: "Which condition key holds the tags supplied in a create request, for example on <code>ec2:RunInstances</code>? (format aws:Xxx)", answers: ["aws:RequestTag", "aws:RequestTag/key", "RequestTag"], hint: "The resource doesn't exist yet, so it can't be ResourceTag.", explain: "aws:RequestTag/key checks tag values sent in the request; aws:TagKeys checks the list of keys." },
    { id: "M05.08-d6", q: "Which condition key contains the list of tag keys in a request, used to allow only approved keys or to protect a key?", answers: ["aws:TagKeys", "TagKeys"], hint: "It's about keys, not values.", explain: "aws:TagKeys is multivalued, so use it with ForAllValues: (all keys must be approved) or ForAnyValue: (any key matches a protected one)." },
    { id: "M05.08-d7", q: "A role is tagged <code>project=atlas</code> and the IdP passes a session tag <code>project=zephyr</code> when the user assumes it. Which value does <code>aws:PrincipalTag/project</code> have in that session?", answers: ["zephyr"], hint: "Which wins: role tag or session tag?", explain: "Session tags override principal (role or user) tags with the same key." },
    { id: "M05.08-d8", q: "Which permission must a role's trust policy allow (in addition to the AssumeRole action) so that session tags can be passed? (format service:Action)", answers: ["sts:TagSession", "TagSession"], hint: "STS action for tags on a session.", explain: "Without sts:TagSession in the trust policy, an assume-role request that includes session tags is denied." }
  ],
  check: [
    { id: "M05.08-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A company has 40 development teams sharing one AWS account. Each team must be able to start and stop only its own EC2 instances. New teams are added every month, and the security team wants to avoid creating new IAM policies for each team. What should the architect do?",
      options: [
        { t: "Tag each team's roles and instances with a team tag, and use one policy that allows the actions when aws:ResourceTag/team equals \${aws:PrincipalTag/team}", c: true, why: "This is ABAC: one policy for all teams, and new teams only need tags." },
        { t: "Create one IAM role per team with a policy listing that team's instance ARNs", c: false, why: "Works, but needs a new role and policy for every team and every new instance, which is what the company wants to avoid." },
        { t: "Put each team's instances in a separate resource group and grant access to the group", c: false, why: "Resource groups organise resources; IAM can't grant permissions on a resource group as such." },
        { t: "Activate the team tag as a cost allocation tag", c: false, why: "Cost allocation tags affect billing reports only, not access." }
      ] },
    { id: "M05.08-k2", type: "single", domain: "D1", task: "1.1", level: 400,
      stem: "An ABAC policy lets developers manage EC2 instances whose project tag matches their own. An auditor notices that a developer could gain access to another team's instances. What is the MOST likely gap?",
      options: [
        { t: "Developers are allowed to call ec2:CreateTags on existing instances, so they can change an instance's project tag", c: true, why: "If people can re-tag resources (or tag themselves), they control the attribute the policy trusts. Deny changes to authorisation tag keys." },
        { t: "The policy uses StringEquals instead of StringLike", c: false, why: "StringEquals is the stricter choice; it doesn't create this gap." },
        { t: "The instances use EBS volumes without tags", c: false, why: "Volume tags don't affect start/stop permissions on instances." },
        { t: "The account doesn't have a cost allocation tag for project", c: false, why: "Billing activation of tags has no effect on authorisation." }
      ] },
    { id: "M05.08-k3", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "A security team wants every new Secrets Manager secret in all member accounts to carry a project tag, and only the platform pipeline role may change that tag afterwards. Which TWO controls achieve this most effectively across the organisation?",
      options: [
        { t: "An SCP that denies secretsmanager:CreateSecret when aws:RequestTag/project is Null", c: true, why: "An SCP applies to every principal in member accounts and blocks untagged creation." },
        { t: "An SCP that denies secretsmanager:TagResource and UntagResource for the project key unless aws:PrincipalArn is the pipeline role", c: true, why: "This protects the authorisation attribute from tampering everywhere." },
        { t: "An Organizations tag policy that defines allowed values for project", c: false, why: "Tag policies standardise and report; on their own they don't stop untagged creation or tag changes by every principal." },
        { t: "Activate project as a cost allocation tag in the management account", c: false, why: "Billing only." },
        { t: "A CloudWatch dashboard of untagged secrets", c: false, why: "Detective visibility, not prevention." }
      ] },
    { id: "M05.08-k4", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "Employees sign in through IAM Identity Center with Okta as the identity source. Access to Secrets Manager secrets must depend on each user's cost centre stored in Okta, without creating a permission set per cost centre. What should the architect configure?",
      options: [
        { t: "Enable attributes for access control in IAM Identity Center to pass costcenter as a session tag, and use aws:PrincipalTag/costcenter in an ABAC policy", c: true, why: "Identity Center maps IdP attributes to session tags, which ABAC policies compare with resource tags." },
        { t: "Create one permission set per cost centre", c: false, why: "That is the role explosion the requirement rules out." },
        { t: "Store each user's cost centre in an IAM user tag", c: false, why: "Federated users have no IAM users; attributes come from the IdP." },
        { t: "Use an SCP per cost centre", c: false, why: "SCPs apply to accounts or OUs, not to individual users' attributes, and never grant access." }
      ] },
    { id: "M05.08-k5", type: "single", domain: "D1", task: "1.1", level: 400,
      stem: "A team moves to ABAC for Secrets Manager. On the first day, engineers cannot read several older secrets, even though their own project tags are correct. What is the most likely reason?",
      options: [
        { t: "The older secrets have no project tag, so the ResourceTag condition can't match and access is implicitly denied", c: true, why: "ABAC fails closed: untagged legacy resources need to be backfilled before switching over." },
        { t: "ABAC policies only work for resources created after the policy", c: false, why: "ABAC evaluates current tags at request time, regardless of when the resource was created." },
        { t: "Secrets Manager doesn't support tag-based authorisation", c: false, why: "GetSecretValue supports aws:ResourceTag conditions." },
        { t: "Session tags expire after one hour", c: false, why: "Session tags last for the session; they don't explain access failing only on older secrets." }
      ] },
    { id: "M05.08-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A policy must allow ec2:RunInstances only if the new instance is tagged with the caller's own department, and only with the tag keys department, env and Name. Which condition block is correct for the instance resource?",
      options: [
        { t: "StringEquals aws:RequestTag/department = \${aws:PrincipalTag/department} AND ForAllValues:StringEquals aws:TagKeys = [department, env, Name]", c: true, why: "RequestTag checks the value being set on create, and ForAllValues requires every key in the request to be in the approved list." },
        { t: "StringEquals aws:ResourceTag/department = \${aws:PrincipalTag/department}", c: false, why: "The instance doesn't exist yet during RunInstances, so its tags arrive as request tags." },
        { t: "ForAnyValue:StringEquals aws:TagKeys = [department, env, Name]", c: false, why: "ForAnyValue passes if at least one key is approved, so extra unapproved keys would be allowed, and the department value isn't checked." },
        { t: "Null aws:RequestTag/department = false", c: false, why: "That only checks that a department tag exists, not that it equals the caller's department." }
      ] }
  ],
  cards: ["fc-M05-8-01", "fc-M05-8-02", "fc-M05-8-03", "fc-M05-8-04", "fc-M05-8-05", "fc-M05-8-06", "fc-M05-8-07", "fc-M05-8-08", "fc-M05-8-09", "fc-M05-8-10", "fc-M05-8-11"],
  references: [
    "IAM User Guide: <em>What is ABAC for AWS?</em> and <em>IAM tutorial: Define permissions to access AWS resources based on tags</em>",
    "IAM User Guide: <em>Passing session tags in AWS STS</em>; IAM Identity Center: <em>Attributes for access control</em>",
    "IAM User Guide: <em>AWS global condition context keys</em> (aws:PrincipalTag, aws:ResourceTag, aws:RequestTag, aws:TagKeys)",
    "Service Authorization Reference (per-service actions, resources and condition keys); <em>AWS services that work with IAM</em> (ABAC column)",
    "AWS Organizations User Guide: <em>Tag policies</em>; <em>System Design on AWS</em> ch.12 \"AWS IAM\" (PDF p603–608)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-8-01", front: "RBAC vs ABAC in one line each?", back: "RBAC: permissions per role listing resources. ABAC: permissions by matching attributes (tags) of principal, resource and request." },
  { id: "fc-M05-8-02", front: "The core ABAC condition?", back: "\"aws:ResourceTag/project\": \"${aws:PrincipalTag/project}\" — allow only when the resource's tag equals the caller's tag." },
  { id: "fc-M05-8-03", front: "aws:PrincipalTag vs aws:ResourceTag vs aws:RequestTag?", back: "PrincipalTag: tags on the caller (role/user/session). ResourceTag: tags on the existing target. RequestTag: tags sent in this request (e.g. on create)." },
  { id: "fc-M05-8-04", front: "What is aws:TagKeys for?", back: "The list of tag keys in the request: ForAllValues to allow only approved keys; ForAnyValue to catch changes to a protected key." },
  { id: "fc-M05-8-05", front: "Where do principal tags come from?", back: "Role or user tags, or session tags passed at AssumeRole / SAML / OIDC / Identity Center attributes for access control. Session tags win on conflict." },
  { id: "fc-M05-8-06", front: "What must a trust policy allow for session tags?", back: "sts:TagSession (in addition to sts:AssumeRole / AssumeRoleWithSAML / AssumeRoleWithWebIdentity)." },
  { id: "fc-M05-8-07", front: "What happens in ABAC when a tag is missing?", back: "Fails closed: the condition can't match, so no access is allowed by that statement. Backfill legacy resources first." },
  { id: "fc-M05-8-08", front: "How do you stop tag tampering?", back: "Deny TagResource/UntagResource (ec2:CreateTags/DeleteTags) on authorisation keys via aws:TagKeys, except for a pipeline role; enforce with SCPs; never let principals tag themselves." },
  { id: "fc-M05-8-09", front: "Tag policies vs SCPs for tagging?", back: "Tag policies standardise keys/values and report non-compliance. SCPs (and IAM denies) actually block untagged creation or tag changes." },
  { id: "fc-M05-8-10", front: "Why still write some non-ABAC statements?", back: "Not every action supports tag conditions (e.g. many List/Describe calls). Check the Service Authorization Reference and handle them explicitly." },
  { id: "fc-M05-8-11", front: "Are ABAC tag value comparisons case-sensitive?", back: "Yes with StringEquals: atlas ≠ Atlas. Standardise values with tag policies (or use StringEqualsIgnoreCase deliberately)." }
);
// ================================================================== 09_least_privilege.js
/* ---------------------------------------------------------------- M05.09 Least privilege in practice */
var DG_0509_LOOP = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0509at m0509ad">
  <title id="m0509at">The least-privilege lifecycle</title>
  <desc id="m0509ad">Six stages in a loop: start broad in a sandbox, observe real usage in CloudTrail, generate a policy from that activity, refine it by scoping resources and adding conditions, enforce guardrails such as SCPs and permissions boundaries, and review continuously with unused-access findings, which feeds back into refinement.</desc>
  <defs><marker id="m0509a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="20" y="30" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="34" y="54">1 Start broad</text>
  <text class="dg-ts" x="34" y="74">sandbox account only,</text>
  <text class="dg-ts" x="34" y="90">AWS managed policies</text>
  <rect class="dg-info" x="280" y="30" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="294" y="54">2 Observe</text>
  <text class="dg-ts" x="294" y="74">CloudTrail records every</text>
  <text class="dg-ts" x="294" y="90">call the workload makes</text>
  <rect class="dg-edge" x="540" y="30" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="554" y="54">3 Generate</text>
  <text class="dg-ts" x="554" y="74">Access Analyzer policy</text>
  <text class="dg-ts" x="554" y="90">generation (≤ 90 days)</text>
  <rect class="dg-edge" x="540" y="196" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="554" y="220">4 Refine</text>
  <text class="dg-ts" x="554" y="240">scope ARNs, add conditions,</text>
  <text class="dg-ts" x="554" y="256">validate + CI policy checks</text>
  <rect class="dg-good" x="280" y="196" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="294" y="220">5 Guardrail</text>
  <text class="dg-ts" x="294" y="240">SCPs, RCPs, permissions</text>
  <text class="dg-ts" x="294" y="256">boundaries cap the maximum</text>
  <rect class="dg-good" x="20" y="196" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="34" y="220">6 Review</text>
  <text class="dg-ts" x="34" y="240">unused access findings,</text>
  <text class="dg-ts" x="34" y="256">last accessed, reviews</text>
  <path class="dg-line" d="M220 67 H276" marker-end="url(#m0509a-ar)"/>
  <path class="dg-line" d="M480 67 H536" marker-end="url(#m0509a-ar)"/>
  <path class="dg-line" d="M640 104 V192" marker-end="url(#m0509a-ar)"/>
  <path class="dg-line" d="M540 233 H484" marker-end="url(#m0509a-ar)"/>
  <path class="dg-line" d="M280 233 H224" marker-end="url(#m0509a-ar)"/>
  <path class="dg-line" d="M120 196 V150 H600 V196" marker-end="url(#m0509a-ar)"/>
  <text class="dg-ts" x="250" y="144">findings feed the next refinement (the loop never ends)</text>
  <text class="dg-ts" x="20" y="300">Steps 1–3 happen once per workload. Steps 4–6 repeat for as long as the workload runs,</text>
  <text class="dg-ts" x="20" y="316">because code changes, new features need new actions, and old permissions become unused.</text>
</svg>
<figcaption>Figure M05-9a. Least privilege is a loop, not a one-off task. You start broad only where it is safe, let real usage tell you what is needed, and keep removing what is no longer used.</figcaption>
</figure>`;

var DG_0509_ZONE = `
<figure>
<svg class="diagram" viewBox="0 0 760 290" role="img" aria-labelledby="m0509bt m0509bd">
  <title id="m0509bt">IAM Access Analyzer zone of trust</title>
  <desc id="m0509bd">An organization-level analyzer treats every account in the organization as the zone of trust. A bucket policy granting access to another account inside the organization produces no finding. A role trust policy allowing an external account, and a bucket policy allowing public access, both produce external access findings.</desc>
  <defs><marker id="m0509b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="16" y="20" width="470" height="250" rx="12"/>
  <text class="dg-ta" x="30" y="44">Zone of trust: your organization</text>
  <rect class="dg-box" x="34" y="62" width="200" height="86" rx="8"/>
  <text class="dg-tb" x="46" y="84">Account A (prod)</text>
  <text class="dg-ts" x="46" y="104">S3 bucket orders-data</text>
  <text class="dg-ts" x="46" y="120">IAM role vendor-audit</text>
  <text class="dg-ts" x="46" y="136">KMS key, SQS queue …</text>
  <rect class="dg-box" x="268" y="62" width="200" height="86" rx="8"/>
  <text class="dg-tb" x="280" y="84">Account B (analytics)</text>
  <text class="dg-ts" x="280" y="104">reads orders-data</text>
  <text class="dg-ts" x="280" y="120">through the bucket policy</text>
  <path class="dg-line" d="M268 112 H238" marker-end="url(#m0509b-ar)"/>
  <rect class="dg-good" x="34" y="170" width="434" height="84" rx="8"/>
  <text class="dg-tb" x="46" y="194">Analyzer (zone of trust = organization)</text>
  <text class="dg-ts" x="46" y="214">B → A access stays inside the zone: no finding</text>
  <text class="dg-ts" x="46" y="232">Reasons over policies with automated reasoning (Zelkova),</text>
  <text class="dg-ts" x="46" y="248">not over logs, so it finds access that is possible, not just used</text>
  <rect class="dg-bad" x="530" y="40" width="214" height="74" rx="8"/>
  <text class="dg-tb" x="544" y="64">External account</text>
  <text class="dg-ts" x="544" y="84">444455556666 can assume</text>
  <text class="dg-ts" x="544" y="100">vendor-audit → FINDING</text>
  <rect class="dg-bad" x="530" y="150" width="214" height="74" rx="8"/>
  <text class="dg-tb" x="544" y="174">Anyone (public)</text>
  <text class="dg-ts" x="544" y="194">"Principal": "*" on a</text>
  <text class="dg-ts" x="544" y="210">bucket → FINDING</text>
  <path class="dg-line" d="M530 77 H506 V54 H136 V58" marker-end="url(#m0509b-ar)"/>
  <path class="dg-line" d="M530 187 H506 V160 H136 V152" marker-end="url(#m0509b-ar)"/>
</svg>
<figcaption>Figure M05-9b. External access findings answer one question: "which of my resources can be reached by a principal outside my zone of trust?" Access between accounts inside the zone is expected and is not reported.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.09", title: "Least privilege in practice", level: 300, minutes: 55,
  objectives: [
    "Explain why least privilege is hard and apply it as a continuous lifecycle rather than a one-off task",
    "Use IAM Access Analyzer for external access, unused access, policy validation, policy generation and custom policy checks",
    "Use last accessed information, the credential report and the IAM Policy Simulator to find and remove excess permissions",
    "Combine coarse guardrails (SCPs, RCPs, permissions boundaries) with fine-grained policies, break-glass access and access reviews"
  ],
  sections: [
    { type: "why", html: `
<p>Most cloud breaches are not clever exploits of AWS. They are an attacker using permissions that were never needed. A leaked access key that only allowed <code>s3:PutObject</code> on one prefix is an inconvenience; the same key with <code>AdministratorAccess</code> is a company-ending event. Permissions accumulate quietly: a developer adds <code>"Action": "*"</code> to unblock a deadline, a contractor's role is never removed, an access key from 2019 still works. Nobody notices until an incident report asks <em>why did that role have that permission?</em></p>
<p>On the SAA-C03 exam, least privilege is behind a large share of Domain 1 answers. Look for phrases such as "grant only the permissions required", "identify unused permissions", "detect resources shared with external accounts", "validate policies before deployment" and "with the LEAST operational overhead". The answer is usually a <strong>managed AWS capability</strong> (IAM Access Analyzer, last accessed information, SCPs) rather than a custom script. This lesson builds on the policy language and evaluation logic from M05.02–M05.04 and shows how to make them stay tight in practice.</p>` },

    { type: "concept", title: "The principle, and why it is hard", html: DG_0509_LOOP + `
<h3>What least privilege means</h3>
<p><strong>Least privilege</strong> means every principal (person, workload or service) has <em>only</em> the permissions it needs to do its job, <em>only</em> on the resources it needs, and ideally <em>only</em> under the conditions and for the time it needs them. It narrows five dimensions at once:</p>
<table>
<thead><tr><th>Dimension</th><th>Too broad</th><th>Least privilege</th><th>Policy element</th></tr></thead>
<tbody>
<tr><td>Actions</td><td><code>s3:*</code></td><td><code>s3:GetObject</code>, <code>s3:PutObject</code></td><td><code>Action</code></td></tr>
<tr><td>Resources</td><td><code>"Resource": "*"</code></td><td><code>arn:aws:s3:::exports-prod/orders/*</code></td><td><code>Resource</code></td></tr>
<tr><td>Conditions</td><td>From anywhere</td><td>Only through the VPC endpoint, only with TLS, only with MFA</td><td><code>Condition</code></td></tr>
<tr><td>Principals</td><td>Every developer in one group</td><td>Only the on-call role, only the pipeline role</td><td>Who gets the policy / trust policy</td></tr>
<tr><td>Time</td><td>Long-term access keys</td><td>Temporary credentials (1 h sessions), just-in-time elevation</td><td>Roles, STS session duration</td></tr>
</tbody></table>

<h3>Why it is hard in practice</h3>
<ul>
  <li><strong>The action space is enormous.</strong> AWS has more than 400 services and many thousands of IAM actions. Nobody knows by heart which actions an SDK call chain needs (writing to an SSE-KMS bucket, for example, also needs <code>kms:GenerateDataKey</code>).</li>
  <li><strong>Requirements are unknown at design time.</strong> A new service is still evolving, so a perfect policy written on day one is wrong by day thirty.</li>
  <li><strong>Permissions creep.</strong> People change teams and keep old access; features are removed but their permissions stay. Access is rarely removed because removing it is risky and nobody owns the clean-up.</li>
  <li><strong>Friction pushes people to wildcards.</strong> Every <code>AccessDenied</code> costs a developer time, so they reach for <code>*</code>. A least-privilege programme that slows delivery will be bypassed.</li>
</ul>
<div class="callout">The practical answer is not "write perfect policies". It is a <strong>loop</strong> (Figure M05-9a): use tooling to discover what is actually used, generate and tighten policies from evidence, put guardrails around everything so a mistake can't become a disaster, and keep reviewing.</div>

<h3>Two layers: guardrails and fine-grained permissions</h3>
<table>
<thead><tr><th></th><th>Coarse-grained guardrails</th><th>Fine-grained permissions</th></tr></thead>
<tbody>
<tr><td>Purpose</td><td>Set the outer boundary that must <em>never</em> be crossed</td><td>Grant exactly what one workload or job needs</td></tr>
<tr><td>Owned by</td><td>Central security / platform team</td><td>Workload team (with review)</td></tr>
<tr><td>Tools</td><td>SCPs, RCPs, permissions boundaries, data perimeters</td><td>Identity-based and resource-based policies</td></tr>
<tr><td>Examples</td><td>"No one may disable CloudTrail", "Only these Regions", "No access from outside the organization"</td><td>"This Lambda function may write to this one table"</td></tr>
<tr><td>Change rate</td><td>Rare, carefully tested</td><td>Frequent, with every release</td></tr>
</tbody></table>
<p>Guardrails let you accept imperfect fine-grained policies safely: even if a developer grants too much, the SCP still blocks the dangerous actions. That is <strong>defence in depth</strong> applied to permissions.</p>` },

    { type: "concept", title: "The least-privilege toolbox", html: DG_0509_ZONE + `
<h3>IAM Access Analyzer</h3>
<p>IAM Access Analyzer is a set of capabilities, not one feature. It uses <strong>automated reasoning</strong> (the Zelkova engine) to prove what a policy allows, plus CloudTrail data for usage-based features.</p>
<table>
<thead><tr><th>Capability</th><th>Question it answers</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>External access analyzer</strong></td><td>Which of my resources can be accessed from <em>outside</em> my zone of trust?</td><td>Zone of trust = the account or the organization. Covers resource types with resource policies, such as S3 buckets, IAM role trust policies, KMS keys, Lambda functions, SQS queues, Secrets Manager secrets, SNS topics, EBS and RDS snapshots, ECR repositories, EFS file systems, DynamoDB tables and streams. Free.</td></tr>
<tr><td><strong>Internal access analyzer</strong> (newer)</td><td>Which principals <em>inside</em> my organization can reach critical resources?</td><td>Helps you check that only intended teams reach sensitive data.</td></tr>
<tr><td><strong>Unused access analyzer</strong></td><td>Which roles, access keys, passwords and permissions are not being used?</td><td>Findings for unused roles, unused IAM user access keys and passwords, and unused service- and action-level permissions over a tracking period you set (90 days by default). Charged per IAM role and user analysed each month.</td></tr>
<tr><td><strong>Policy validation</strong></td><td>Is this policy correct and safe?</td><td>Over 100 checks: errors (invalid JSON, unknown actions), security warnings (for example <code>iam:PassRole</code> with <code>"Resource": "*"</code>), suggestions and general warnings. Free; built into the console policy editor.</td></tr>
<tr><td><strong>Policy generation</strong></td><td>What policy does this role actually need?</td><td>Reads CloudTrail activity for a user or role over a period of up to <strong>90 days</strong> and produces a policy template with the services and actions used. You still fill in resource ARNs.</td></tr>
<tr><td><strong>Custom policy checks</strong></td><td>Does this change grant new or forbidden access?</td><td><code>CheckNoNewAccess</code> (no more access than a reference policy), <code>CheckAccessNotGranted</code> (never grants listed actions or resources), <code>CheckNoPublicAccess</code> (resource policy doesn't make a resource public). Designed for CI/CD; charged per check.</td></tr>
</tbody></table>
<p><strong>Archive rules</strong> automatically archive findings you have decided are intended (for example, access from a known partner account), so the active list only contains things that need action.</p>

<h3>Last accessed information</h3>
<p>For every user, group, role and policy, IAM records <strong>when each service was last accessed</strong> (and, for a growing list of services such as S3, EC2, IAM and Lambda, <strong>which actions</strong> were last used). The tracking period goes back up to 400 days. If a role has permissions for 30 services but has only used 3 in a year, the other 27 are candidates for removal. In AWS Organizations you can also see last accessed data for an OU or account, which is how you test whether an SCP that blocks a service would break anyone.</p>

<h3>Credential report</h3>
<p>An account-wide CSV listing every IAM user and the root user with password status, password last used, MFA status, and each access key's age and last use. You can generate it at most once every four hours. It is the fastest way to answer "which IAM users have no MFA?" or "which access keys are older than 90 days?".</p>

<h3>IAM Policy Simulator</h3>
<p>Tests whether a principal's policies would allow specific actions on specific resources, including condition context keys you supply. Use it to debug <code>AccessDenied</code> and to test a policy change before attaching it. For a precise answer to "why was this request denied?", also read the error message: many services now include the policy type that caused the denial (for example "…with an explicit deny in a service control policy").</p>

<h3>CloudTrail as the ground truth</h3>
<p>Every authenticated API call is in CloudTrail. Querying it with <strong>CloudTrail Lake</strong> or <strong>Amazon Athena</strong> over the S3 trail answers questions the console can't, such as "which principals called <code>kms:Decrypt</code> on this key last month?".</p>` },

    { type: "workflow", title: "Taking a workload from broad to least privilege", html: `
<ol class="flow">
  <li><strong>Start broad, but only in a safe place.</strong> In a sandbox or development account, give the new role an AWS managed policy (for example <code>AmazonDynamoDBFullAccess</code>), never <code>AdministratorAccess</code> in production. The account boundary and SCPs keep the blast radius small.</li>
  <li><strong>Exercise the workload.</strong> Run the integration tests and a realistic load so every code path makes its AWS calls. Policy generation only sees what was actually called.</li>
  <li><strong>Generate a policy from CloudTrail.</strong>
<pre><code>aws accessanalyzer start-policy-generation \\
  --policy-generation-details principalArn=arn:aws:iam::111122223333:role/order-export \\
  --cloud-trail-details '{"trails":[{"cloudTrailArn":"arn:aws:cloudtrail:eu-west-1:111122223333:trail/org-trail","allRegions":true}],"accessRole":"arn:aws:iam::111122223333:role/AccessAnalyzerMonitorServiceRole","startTime":"2026-09-01T00:00:00Z","endTime":"2026-09-30T00:00:00Z"}'
# -> {"jobId": "a1b2c3d4-..."}

aws accessanalyzer get-generated-policy --job-id a1b2c3d4-... \\
  --include-resource-placeholders --query "generatedPolicyResult.generatedPolicies[0].policy" --output text</code></pre></li>
  <li><strong>Refine.</strong> Replace resource placeholders with exact ARNs, add conditions (<code>aws:SourceVpce</code>, <code>aws:ResourceTag</code>), split read and write statements, and remove anything the tests used but production must not.</li>
  <li><strong>Validate.</strong> <code>aws accessanalyzer validate-policy --policy-type IDENTITY_POLICY --policy-document file://policy.json</code> must return no errors or security warnings.</li>
  <li><strong>Gate changes in CI.</strong> In the pipeline, run <code>check-no-new-access</code> against the currently deployed policy and <code>check-access-not-granted</code> against a list of forbidden actions (such as <code>iam:*</code> or <code>kms:ScheduleKeyDeletion</code>). A pull request that widens access then needs an explicit security approval.</li>
  <li><strong>Deploy behind guardrails.</strong> The account's SCPs and the role's permissions boundary still cap what the role could ever do.</li>
  <li><strong>Review continuously.</strong> The unused access analyzer flags permissions that stop being used; last accessed data shows dead services; quarterly access reviews confirm humans still need their access. Each finding becomes the next refinement.</li>
</ol>` },

    { type: "aws", title: "Guardrails, break-glass and operating model", html: `
<h3>Where each control fits</h3>
<table>
<thead><tr><th>Control</th><th>Scope</th><th>Typical least-privilege use</th></tr></thead>
<tbody>
<tr><td>SCPs (M06)</td><td>Every principal in member accounts</td><td>Deny leaving the organization, disabling CloudTrail/GuardDuty, unapproved Regions, root user actions</td></tr>
<tr><td>RCPs</td><td>Resources in member accounts</td><td>Deny access to S3, KMS, SQS, Secrets Manager and STS resources from identities outside the organization (a data perimeter)</td></tr>
<tr><td>Permissions boundaries (M05.03)</td><td>One user or role</td><td>Let developers create roles for their Lambda functions, but never with more than the boundary allows</td></tr>
<tr><td>Identity-based policies</td><td>One principal</td><td>The fine-grained, generated and refined policy</td></tr>
<tr><td>Resource-based policies</td><td>One resource</td><td>Restrict a bucket or key to named roles, the organization (<code>aws:PrincipalOrgID</code>) or a VPC endpoint</td></tr>
<tr><td>IAM Identity Center permission sets (M05.07)</td><td>Workforce across accounts</td><td>Job-function access (ReadOnly, Developer, Admin) per account, short sessions</td></tr>
</tbody></table>

<h3>Separation of duties</h3>
<p>No single person should be able to both make and approve a sensitive change. In IAM terms: the people who write application code shouldn't be able to edit the SCPs or the CI policy checks that govern them; production deployments go through a pipeline role, not a human's credentials; key administrators (who manage a KMS key) are different from key users (who encrypt and decrypt with it).</p>

<h3>Break-glass access</h3>
<p>Least privilege must not block incident response. A <strong>break-glass</strong> role provides emergency administrator access when normal paths fail (for example, if the identity provider behind IAM Identity Center is down). Good break-glass design:</p>
<ul>
  <li>Exists in each account (or is reachable through a dedicated emergency path), with credentials held under dual control in a safe.</li>
  <li>Requires MFA, and its use triggers an immediate alert (an EventBridge rule on the role's <code>AssumeRole</code> or console sign-in events in CloudTrail).</li>
  <li>Is tested regularly, and every use is followed by a review and credential rotation.</li>
</ul>

<h3>Access reviews</h3>
<p>Schedule reviews (often quarterly for privileged access) where owners confirm who still needs what. Feed them with evidence: the credential report, unused access findings, and IAM Identity Center assignments. AWS Security Hub adds automated checks for IAM best practices, such as no root access keys, MFA on the root user, no policies granting full <code>"*:*"</code> administrator access, and rotation of IAM user keys.</p>

<h3>Cost of the tooling</h3>
<ul>
  <li>Free: external access analyzer, policy validation, policy generation, last accessed data, credential report, Policy Simulator.</li>
  <li>Paid: unused access analyzer (per role/user analysed per month) and custom policy checks (per check). Both are cheap compared with an incident, but enable them deliberately, usually from a delegated administrator account for the whole organization.</li>
</ul>` },

    { type: "examples", html: `
<h3>Example 1: policy validation catches a dangerous pattern</h3>
<p>A developer submits this policy for a deployment role:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["lambda:CreateFunction", "lambda:UpdateFunctionCode"], "Resource": "*" },
    { "Effect": "Allow", "Action": "iam:PassRole", "Resource": "*" }
  ]
}</code></pre>
<pre><code>$ aws accessanalyzer validate-policy --policy-type IDENTITY_POLICY --policy-document file://deploy.json \\
    --query "findings[].{Type:findingType,Issue:issueCode}" --output table
-----------------------------------------------------
|                  ValidatePolicy                   |
+------------------------------+--------------------+
|            Issue             |       Type         |
+------------------------------+--------------------+
|  PASS_ROLE_WITH_STAR_IN_RESOURCE |  SECURITY_WARNING |
+------------------------------+--------------------+</code></pre>
<p><strong>Why it matters:</strong> <code>iam:PassRole</code> on <code>*</code> lets the role hand <em>any</em> role in the account (including an admin role) to a new Lambda function, then run code with that role's permissions: a classic privilege-escalation path. Fix it by scoping the resource to the execution roles the pipeline should use and adding <code>"Condition": {"StringEquals": {"iam:PassedToService": "lambda.amazonaws.com"}}</code>.</p>

<h3>Example 2: a generated policy and its refinement</h3>
<p>Policy generation for the <code>order-export</code> role returns (abbreviated):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["dynamodb:Query"], "Resource": "arn:aws:dynamodb:\${Region}:\${Account}:table/\${TableName}" },
    { "Effect": "Allow", "Action": ["s3:PutObject"], "Resource": "arn:aws:s3:::\${BucketName}/\${ObjectName}" },
    { "Effect": "Allow", "Action": ["kms:GenerateDataKey"], "Resource": "arn:aws:kms:\${Region}:\${Account}:key/\${KeyId}" }
  ]
}</code></pre>
<p>The <code>\${...}</code> placeholders are deliberate: CloudTrail records the action but you decide the exact resources. The refined statement for S3 becomes <code>"Resource": "arn:aws:s3:::exports-prod-111122223333/orders/*"</code>, so even a compromised function can't overwrite other prefixes.</p>

<h3>Example 3: finding unused services with last accessed data</h3>
<pre><code>$ JOB=$(aws iam generate-service-last-accessed-details \\
    --arn arn:aws:iam::111122223333:role/legacy-batch --query JobId --output text)
$ aws iam get-service-last-accessed-details --job-id "$JOB" \\
    --query "ServicesLastAccessed[].[ServiceNamespace,LastAuthenticated]" --output text
dynamodb   2026-09-28T03:12:44+00:00
s3         2026-09-30T02:58:01+00:00
sqs        None
sns        None
ec2        2025-11-02T10:04:19+00:00</code></pre>
<p><code>None</code> means the role has permissions for the service but has <em>never</em> used them in the tracking period. SQS and SNS can go now; EC2 hasn't been used for 11 months and should be confirmed with the owner, then removed.</p>

<h3>Example 4: the credential report in one command</h3>
<pre><code>$ aws iam generate-credential-report >/dev/null
$ aws iam get-credential-report --query Content --output text | base64 -d \\
    | awk -F, 'NR==1 || ($4=="true" && $8=="false")' | cut -d, -f1,4,8
user,password_enabled,mfa_active
alice,true,false
build-legacy,true,false</code></pre>
<p>Columns 4 and 8 are <code>password_enabled</code> and <code>mfa_active</code>. Two users can sign in to the console without MFA, so both are findings. Better still: move people to IAM Identity Center and delete the IAM users.</p>

<h3>Example 5: a CI gate that blocks privilege expansion</h3>
<pre><code># In the pipeline, compare the proposed policy with the one in production
aws accessanalyzer check-no-new-access --policy-type IDENTITY_POLICY \\
  --existing-policy-document file://deployed.json --new-policy-document file://proposed.json \\
  --query result --output text
# PASS  -> merge allowed
# FAIL  -> the change grants new access; require a security reviewer's approval

# Never allow these, whatever the reference policy says
aws accessanalyzer check-access-not-granted --policy-type IDENTITY_POLICY \\
  --policy-document file://proposed.json \\
  --access '[{"actions":["iam:CreateUser","iam:AttachRolePolicy","kms:ScheduleKeyDeletion"]}]' \\
  --query result --output text</code></pre>

<h3>Example 6: who actually used a key? (Athena over CloudTrail)</h3>
<pre><code>SELECT useridentity.arn, count(*) AS calls
FROM cloudtrail_logs
WHERE eventsource = 'kms.amazonaws.com'
  AND eventname = 'Decrypt'
  AND requestparameters LIKE '%1234abcd-12ab-34cd-56ef-1234567890ab%'
  AND eventtime &gt;= '2026-09-01'
GROUP BY useridentity.arn
ORDER BY calls DESC;</code></pre>
<p>If the key policy grants <code>kms:Decrypt</code> to six roles but only two appear here after 90 days, the other four are candidates for removal.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you would use</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Detect any S3 bucket, KMS key or role that is shared with an account outside the organization</td><td>IAM Access Analyzer external access analyzer with the organization as zone of trust</td><td>Continuous, automated, free, proves possible access from policies</td></tr>
<tr><td>Find roles nobody has used for 90 days across 200 accounts</td><td>Unused access analyzer from a delegated administrator account</td><td>Organization-wide findings without scripts</td></tr>
<tr><td>A new microservice needs a policy, and nobody knows exactly which actions it calls</td><td>Run it in dev with a broad policy, then policy generation from CloudTrail</td><td>Evidence-based policy instead of guesswork</td></tr>
<tr><td>Stop pull requests that widen production permissions without review</td><td>Custom policy checks (<code>CheckNoNewAccess</code>, <code>CheckAccessNotGranted</code>) in the pipeline</td><td>Shifts the review left; blocks risky diffs automatically</td></tr>
<tr><td>An auditor asks for all IAM users without MFA and old access keys</td><td>Credential report</td><td>One CSV, generated on demand</td></tr>
<tr><td>Before blocking a service with an SCP, check whether anyone uses it</td><td>Organizations last accessed data for the OU</td><td>Avoids breaking workloads with a guardrail</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice (free, read-only or local)", html: `
<p>Use your <code>academy-admin</code> profile from Lab L01. Nothing here creates billable resources.</p>
<ol>
  <li>Save the risky policy from Example 1 as <code>deploy.json</code> and run <code>aws accessanalyzer validate-policy</code> on it. Then scope <code>iam:PassRole</code> to one role ARN, add the <code>iam:PassedToService</code> condition and run it again until the security warning disappears.</li>
  <li>Create an account-level external access analyzer (free): <code>aws accessanalyzer create-analyzer --analyzer-name academy --type ACCOUNT</code>. After a few minutes, run <code>aws accessanalyzer list-findings --analyzer-arn &lt;arn&gt; --query "findings[].{Res:resource,Type:resourceType,Status:status}"</code>. An empty list in a fresh account is the expected (good) result.</li>
  <li>Generate and read your credential report (Example 4). Check that the root user line shows <code>mfa_active = true</code> and no active access keys.</li>
  <li>Pick the IAM Identity Center role you use day to day (its name starts with <code>AWSReservedSSO_</code>) and run the last accessed commands from Example 3 against its ARN. Notice how few of AdministratorAccess's services you have actually used.</li>
  <li>Clean up: <code>aws accessanalyzer delete-analyzer --analyzer-name academy</code> (or keep it; it's free).</li>
</ol>` },

    { type: "casestudy", title: "Case study: from AdministratorAccess to six actions", html: `
<p><strong>Company:</strong> Tidewater Retail, an online retailer with about 40 engineers and 15 AWS accounts.</p>
<p><strong>Situation:</strong> During a security review, the team found that the <code>order-export</code> Lambda function (which nightly exports the day's orders from DynamoDB to an SSE-KMS encrypted S3 bucket and notifies a downstream queue) ran with <code>AdministratorAccess</code>. It had been "temporary" since launch two years earlier. A dependency vulnerability in that function would have given an attacker full control of the production account.</p>
<p><strong>Requirements:</strong> no change to function behaviour, no outage, and a process that stops the same thing happening again for the other 120 roles.</p>
<p><strong>What they did:</strong></p>
<ol>
  <li>Confirmed CloudTrail had 30 days of management and data events for the role (the S3 data events were needed to see <code>PutObject</code>).</li>
  <li>Ran Access Analyzer policy generation over those 30 days. It found calls to four services: DynamoDB, S3, KMS, SQS, plus CloudWatch Logs used by the Lambda runtime.</li>
  <li>Refined the result into six actions on exact resources:</li>
</ol>
<table>
<thead><tr><th>Action</th><th>Resource</th><th>Why it's needed</th></tr></thead>
<tbody>
<tr><td><code>dynamodb:Query</code></td><td><code>table/orders/index/by-date</code></td><td>Read the day's orders</td></tr>
<tr><td><code>s3:PutObject</code></td><td><code>exports-prod-111122223333/orders/*</code></td><td>Write the export file</td></tr>
<tr><td><code>kms:GenerateDataKey</code></td><td>The bucket's customer managed key</td><td>SSE-KMS encryption of the new object</td></tr>
<tr><td><code>sqs:SendMessage</code></td><td><code>queue/export-ready</code></td><td>Notify the downstream consumer</td></tr>
<tr><td><code>logs:CreateLogStream</code>, <code>logs:PutLogEvents</code></td><td>The function's log group only</td><td>Runtime logging</td></tr>
</tbody></table>
<ol start="4">
  <li>Validated the policy (no findings), deployed it to staging, ran a full export, then production.</li>
  <li>Added two pipeline gates for all IAM changes: <code>check-access-not-granted</code> for a deny-list (<code>iam:*</code>, <code>organizations:*</code>, <code>kms:ScheduleKeyDeletion</code>, <code>*:*</code>) and <code>check-no-new-access</code> requiring security approval for any expansion.</li>
  <li>Enabled the unused access analyzer organization-wide and an SCP preventing <code>AdministratorAccess</code> from being attached to roles whose name starts with <code>app-</code>.</li>
</ol>
<p><strong>Outcome:</strong> the function's permissions went from every action on every resource to six actions on five resources. Over the next quarter the same process removed 31 unused roles and 9 IAM users, and reduced 64 policies; pipeline gates blocked 7 pull requests that would have widened access, 5 of which turned out to be mistakes.</p>
<p><strong>Lessons learned:</strong> (1) policy generation only sees what happened in the window, so the team ran it over a month-end to catch rare code paths; (2) a monthly export would need a longer window or a manual review; (3) guardrails plus CI checks mattered more than the one-off clean-up, because they stopped the drift from coming back.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Identify resources shared with an external entity / outside the organization"</td><td>IAM Access Analyzer (external access findings)</td></tr>
<tr><td>"Generate a least-privilege policy based on access activity"</td><td>IAM Access Analyzer policy generation (from CloudTrail)</td></tr>
<tr><td>"Identify unused permissions / roles / access keys"</td><td>IAM Access Analyzer unused access, or IAM last accessed information</td></tr>
<tr><td>"Validate policies against best practices before deployment"</td><td>Access Analyzer policy validation; custom policy checks in CI</td></tr>
<tr><td>"List all users and the status of their MFA and access keys"</td><td>IAM credential report</td></tr>
<tr><td>"Test whether a policy allows an action without making the call"</td><td>IAM Policy Simulator</td></tr>
<tr><td>"Prevent any account in the organization from doing X"</td><td>SCP (not a better-written identity policy)</td></tr>
<tr><td>"Allow developers to create roles but not escalate privileges"</td><td>Permissions boundary required through a condition on <code>iam:CreateRole</code></td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> "write a Lambda function that scans all policies" (operational overhead, when a managed feature exists); "use AWS Config" for <em>external access</em> questions (Config records configuration; Access Analyzer reasons about access); "Trusted Advisor" (it has a few IAM checks, but it isn't the tool for policy generation or unused access); "Amazon Inspector" (vulnerabilities in workloads, not IAM permissions); "GuardDuty" (threat detection from activity, not least-privilege analysis).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Run analyzers centrally.</strong> Register a delegated administrator for Access Analyzer (usually the security tooling account) and create organization-level analyzers in each Region you use; analyzers are Regional.</li>
  <li><strong>Policy generation needs good CloudTrail.</strong> Management events are on by default, but data events (S3 object, Lambda invoke, DynamoDB item-level) cost money and must be enabled for the resources you care about. No events, no generated actions.</li>
  <li><strong>Rare paths bite.</strong> Quarterly jobs, disaster recovery runbooks and error handlers may never run in your observation window. Document them and add their permissions deliberately, or test them in the window.</li>
  <li><strong>Don't over-optimise human access.</strong> For people, job-function permission sets plus short sessions and strong guardrails usually beat hand-crafted per-person policies, which nobody can maintain.</li>
  <li><strong>Prefer conditions to more statements.</strong> One statement with <code>aws:ResourceTag/team</code> conditions (ABAC, M05.08) scales better than one statement per resource.</li>
  <li><strong>Watch policy size quotas.</strong> Very granular policies can hit the managed policy limit of 6,144 characters; group resources with prefixes and tags rather than listing hundreds of ARNs.</li>
  <li><strong>Measure it.</strong> Track the number of roles with admin access, findings older than 30 days, and the percentage of roles with generated policies. What gets measured gets fixed.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Least privilege narrows actions, resources, conditions, principals and time, and it is a continuous loop, not a one-off project.</li>
  <li>Combine coarse guardrails (SCPs, RCPs, permissions boundaries) owned centrally with fine-grained, evidence-based policies owned by workload teams.</li>
  <li>IAM Access Analyzer: external access (free, automated reasoning), unused access (paid), policy validation (free), policy generation from up to 90 days of CloudTrail (free), custom policy checks for CI (paid).</li>
  <li>Last accessed data shows unused services (and actions for some services); the credential report lists users' passwords, MFA and keys.</li>
  <li>The Policy Simulator tests policies without calling the API; CloudTrail with Athena or CloudTrail Lake is the ground truth for who did what.</li>
  <li><code>iam:PassRole</code> with <code>"Resource": "*"</code> is a privilege-escalation path; scope it and add <code>iam:PassedToService</code>.</li>
  <li>Design break-glass access with MFA, dual control and alerting, and keep separation of duties between those who build and those who approve.</li>
  <li>On the exam, prefer the managed feature (Access Analyzer, SCP, credential report) over a custom script.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.09-d1", q: "IAM Access Analyzer policy generation can analyse CloudTrail activity for at most how many days per request?", answers: ["90", "90 days", "90days"], hint: "The same number as the default unused-access tracking period.", explain: "You choose a period of up to 90 days of CloudTrail activity." },
    { id: "M05.09-d2", q: "Which IAM report lists every IAM user with password, MFA and access-key status as a CSV?", answers: ["credential report", "credentialreport", "iam credential report"], hint: "You generate it with <code>aws iam generate-...-report</code>.", explain: "The credential report covers all IAM users plus the root user." },
    { id: "M05.09-d3", q: "Which Access Analyzer custom policy check verifies that a new policy grants no more access than an existing reference policy? (API name)", answers: ["CheckNoNewAccess", "check-no-new-access"], explain: "<code>CheckNoNewAccess</code> compares two policies; <code>CheckAccessNotGranted</code> checks against a list of forbidden actions." },
    { id: "M05.09-d4", q: "An organization-level external access analyzer sees a bucket policy that grants access to another account in the same organization. Does it create a finding? (yes/no)", answers: ["no", "n"], hint: "Think about the zone of trust.", explain: "Accounts inside the organization are inside the zone of trust, so the access is expected and not reported." },
    { id: "M05.09-d5", q: "How often, at most, can you generate a new IAM credential report? (hours)", answers: ["4", "4h", "4 hours", "every 4 hours"], explain: "If the existing report is less than four hours old, IAM returns it instead of generating a new one." },
    { id: "M05.09-d6", q: "Which IAM condition key restricts <code>iam:PassRole</code> so a role can only be passed to a specific AWS service? (full key)", answers: ["iam:PassedToService", "passedtoservice"], explain: "For example <code>\"iam:PassedToService\": \"lambda.amazonaws.com\"</code>." },
    { id: "M05.09-d7", q: "In last accessed data, a service shows <code>None</code> for LastAuthenticated. Has the principal used that service during the tracking period? (yes/no)", answers: ["no", "n"], explain: "<code>None</code> means never used in the tracking period, so the permission is a removal candidate." }
  ],
  check: [
    { id: "M05.09-k1", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A security team must continuously identify any S3 bucket, KMS key or IAM role in the organization that can be accessed by a principal outside the organization, with the LEAST operational overhead. What should they do?",
      options: [
        { t: "Create an organization-level IAM Access Analyzer external access analyzer from a delegated administrator account", c: true, why: "It reasons over resource policies continuously, uses the organization as the zone of trust and produces findings for external access, with no code to maintain." },
        { t: "Schedule a Lambda function that downloads every resource policy and searches for foreign account IDs", c: false, why: "It could work but is custom code to maintain, misses complex conditions and wildcards, and is high operational overhead." },
        { t: "Enable Amazon GuardDuty in every account", c: false, why: "GuardDuty detects threats from activity and logs; it doesn't analyse which resources policies expose." },
        { t: "Run IAM credential reports weekly", c: false, why: "The credential report covers IAM users' credentials, not resource policies." }
      ] },
    { id: "M05.09-k2", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A team built a new service in a development account using a broad AWS managed policy. They now need a least-privilege policy based on what the service actually called during a month of testing. Which approach requires the LEAST effort?",
      options: [
        { t: "Use IAM Access Analyzer policy generation for the role, using the CloudTrail trail for that month, then refine the resource ARNs", c: true, why: "Policy generation turns real CloudTrail activity into a policy template; you only fill in and tighten resources." },
        { t: "Read the SDK source code to list every API the service could call", c: false, why: "Slow, error-prone, and lists possible calls rather than actual ones." },
        { t: "Attach AdministratorAccess in production and remove permissions when something breaks", c: false, why: "That is the opposite of least privilege and creates a large blast radius." },
        { t: "Use AWS Trusted Advisor to recommend a policy", c: false, why: "Trusted Advisor doesn't generate IAM policies from activity." }
      ] },
    { id: "M05.09-k3", type: "multi", domain: "D1", task: "1.1", level: 300,
      stem: "Which TWO are capabilities of IAM Access Analyzer?",
      options: [
        { t: "Validating policies against grammar and security best practices before you attach them", c: true, why: "Policy validation returns errors, security warnings and suggestions." },
        { t: "Finding IAM roles and access keys that have not been used for a configurable period", c: true, why: "The unused access analyzer produces findings for unused roles, keys, passwords and permissions." },
        { t: "Scanning EC2 instances for software vulnerabilities", c: false, why: "That is Amazon Inspector." },
        { t: "Rotating IAM user access keys automatically", c: false, why: "IAM doesn't rotate user access keys for you; you remove the need for them with roles and Identity Center." },
        { t: "Blocking API calls that violate a policy in real time", c: false, why: "Access Analyzer analyses and reports; enforcement is done by policies such as SCPs." }
      ] },
    { id: "M05.09-k4", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A platform team wants every pull request that changes an IAM policy to fail the pipeline automatically if it would grant any access the currently deployed policy does not. Which feature fits BEST?",
      options: [
        { t: "IAM Access Analyzer custom policy check <code>CheckNoNewAccess</code> in the CI pipeline", c: true, why: "It compares the proposed policy with the reference policy and returns FAIL if new access is granted." },
        { t: "The IAM Policy Simulator run manually by a reviewer", c: false, why: "Manual and per-action; it doesn't prove that nothing new is granted." },
        { t: "An SCP that denies <code>iam:PutRolePolicy</code>", c: false, why: "That would block all policy changes, not just widening ones, and doesn't integrate with code review." },
        { t: "AWS Config rule <code>iam-policy-no-statements-with-admin-access</code>", c: false, why: "It detects one pattern after deployment; it doesn't compare policy versions before merge." }
      ] },
    { id: "M05.09-k5", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A deployment role has <code>iam:PassRole</code> with <code>\"Resource\": \"*\"</code> and permission to create Lambda functions. Why is this a security risk?",
      options: [
        { t: "The role can attach any role in the account, including an administrator role, to a new function and run code with those permissions", c: true, why: "PassRole on any role is a privilege-escalation path; scope it to specific execution roles and use <code>iam:PassedToService</code>." },
        { t: "It lets the role assume every role in the account directly", c: false, why: "PassRole hands a role to a service; assuming roles needs <code>sts:AssumeRole</code> and a trust policy." },
        { t: "It makes every Lambda function public", c: false, why: "Public access to a function is controlled by its resource-based policy, not by PassRole." },
        { t: "It disables CloudTrail logging for the functions", c: false, why: "PassRole has no effect on CloudTrail." }
      ] },
    { id: "M05.09-k6", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Before attaching an SCP that denies Amazon SageMaker to an OU, an administrator wants to know whether any account in that OU has used SageMaker recently. What should they check?",
      options: [
        { t: "Last accessed information for the OU in AWS Organizations (IAM service last accessed data)", c: true, why: "Organizations shows when each service was last accessed by principals in an OU or account, which is exactly how you test an SCP's impact." },
        { t: "The IAM credential report of the management account", c: false, why: "It lists IAM users' credentials in one account, not service usage across an OU." },
        { t: "AWS Cost Explorer", c: false, why: "Cost data can hint at usage but misses free-tier or low-cost use and isn't designed for access analysis." },
        { t: "The IAM Policy Simulator", c: false, why: "It tests what is allowed, not what was used." }
      ] }
  ],
  cards: ["fc-M05-9-01", "fc-M05-9-02", "fc-M05-9-03", "fc-M05-9-04", "fc-M05-9-05", "fc-M05-9-06", "fc-M05-9-07", "fc-M05-9-08", "fc-M05-9-09", "fc-M05-9-10", "fc-M05-9-11"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"AWS Identity and Access Management\" (PDF p603–608)",
    "IAM User Guide: <em>Security best practices in IAM</em>, <em>Refining permissions using last accessed information</em>, <em>Getting credential reports</em>",
    "IAM Access Analyzer User Guide: <em>External access</em>, <em>Unused access</em>, <em>Policy validation</em>, <em>Policy generation</em>, <em>Custom policy checks</em>",
    "AWS Security Blog: \"Techniques for writing least privilege IAM policies\""
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-9-01", front: "Five dimensions least privilege narrows?", back: "Actions · resources · conditions · principals · time (temporary credentials, just-in-time access)." },
  { id: "fc-M05-9-02", front: "Guardrails vs fine-grained permissions?", back: "Guardrails (SCPs, RCPs, permissions boundaries) cap the maximum and are owned centrally. Fine-grained identity/resource policies grant exactly what a workload needs." },
  { id: "fc-M05-9-03", front: "Access Analyzer external access: what is the zone of trust?", back: "The account or the organization you choose. Access from inside the zone is not reported; access from outside it (or public) creates a finding." },
  { id: "fc-M05-9-04", front: "Access Analyzer policy generation: input and limit?", back: "CloudTrail activity of a user or role over up to 90 days → a policy template with the actions used; you fill in resource ARNs." },
  { id: "fc-M05-9-05", front: "Unused access analyzer finds…?", back: "Unused roles, unused IAM user access keys and passwords, and unused service- and action-level permissions. It is a paid feature." },
  { id: "fc-M05-9-06", front: "Three Access Analyzer custom policy checks?", back: "CheckNoNewAccess (vs a reference policy) · CheckAccessNotGranted (forbidden actions/resources) · CheckNoPublicAccess (resource policy not public)." },
  { id: "fc-M05-9-07", front: "Last accessed information shows…?", back: "When each service (and, for some services, each action) was last used by a user, group, role, policy, or OU/account; up to 400 days." },
  { id: "fc-M05-9-08", front: "Credential report: what and how often?", back: "CSV of all IAM users + root: password, MFA, access-key age and last use. Generated at most once every 4 hours." },
  { id: "fc-M05-9-09", front: "Why is <code>iam:PassRole</code> on <code>*</code> dangerous?", back: "It lets the caller hand any role (even admin) to a service like Lambda or EC2 and run code with it: privilege escalation. Scope it and use <code>iam:PassedToService</code>." },
  { id: "fc-M05-9-10", front: "Break-glass access essentials?", back: "Emergency admin path for when normal access fails: MFA, dual control of credentials, alert on every use, regular testing, review and rotate after use." },
  { id: "fc-M05-9-11", front: "Exam: \"identify resources shared outside the organization\"?", back: "IAM Access Analyzer (external access). Not GuardDuty, not Inspector, not a custom script." }
);
// ================================================================== 10_cognito.js
/* ---------------------------------------------------------------- M05.10 Application identity: Amazon Cognito */
var DG_0510_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0510at m0510ad">
  <title id="m0510at">Cognito user pool and identity pool flow</title>
  <desc id="m0510ad">A mobile app signs the user in with a Cognito user pool, which may federate to Google, and receives JWT tokens. Path A: the app sends the access token to API Gateway, whose Cognito authorizer validates it before calling Lambda. Path B: the app exchanges the ID token with a Cognito identity pool, which calls STS to get temporary AWS credentials for an IAM role, and the app uses them to upload directly to its own prefix in S3.</desc>
  <defs><marker id="m0510a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="16" y="120" width="160" height="70" rx="8"/>
  <text class="dg-tb" x="30" y="146">Mobile / web app</text>
  <text class="dg-ts" x="30" y="166">Amplify or OAuth</text>
  <text class="dg-ts" x="30" y="180">library</text>
  <rect class="dg-edge" x="226" y="20" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="240" y="44">Cognito user pool</text>
  <text class="dg-ts" x="240" y="64">authentication (who are you?)</text>
  <text class="dg-ts" x="240" y="80">→ ID, access, refresh JWTs</text>
  <rect class="dg-box" x="530" y="20" width="214" height="74" rx="8"/>
  <text class="dg-tb" x="544" y="44">Google / SAML / OIDC</text>
  <text class="dg-ts" x="544" y="64">optional external IdP,</text>
  <text class="dg-ts" x="544" y="80">federated by the user pool</text>
  <path class="dg-line" d="M426 57 H526" marker-end="url(#m0510a-ar)"/>
  <path class="dg-line" d="M120 120 V57 H222" marker-end="url(#m0510a-ar)"/>
  <text class="dg-ts" x="30" y="104">1 sign in</text>
  <rect class="dg-good" x="226" y="128" width="200" height="56" rx="8"/>
  <text class="dg-tb" x="240" y="150">A · API Gateway</text>
  <text class="dg-ts" x="240" y="170">authorizer checks the JWT</text>
  <path class="dg-line" d="M176 156 H222" marker-end="url(#m0510a-ar)"/>
  <text class="dg-ts" x="180" y="148">2a</text>
  <rect class="dg-box" x="530" y="128" width="214" height="56" rx="8"/>
  <text class="dg-tb" x="544" y="150">Lambda / backend</text>
  <text class="dg-ts" x="544" y="170">sees the user's claims</text>
  <path class="dg-line" d="M426 156 H526" marker-end="url(#m0510a-ar)"/>
  <rect class="dg-edge" x="226" y="226" width="200" height="74" rx="8"/>
  <text class="dg-tb" x="240" y="250">B · Identity pool</text>
  <text class="dg-ts" x="240" y="270">authorization to AWS</text>
  <text class="dg-ts" x="240" y="286">STS → temporary credentials</text>
  <path class="dg-line" d="M86 190 V263 H222" marker-end="url(#m0510a-ar)"/>
  <text class="dg-ts" x="96" y="254">2b ID token</text>
  <rect class="dg-good" x="530" y="226" width="214" height="74" rx="8"/>
  <text class="dg-tb" x="544" y="250">Amazon S3</text>
  <text class="dg-ts" x="544" y="270">PutObject only to</text>
  <text class="dg-ts" x="544" y="286">uploads/&lt;identity id&gt;/*</text>
  <path class="dg-line" d="M426 263 H526" marker-end="url(#m0510a-ar)"/>
  <text class="dg-ts" x="440" y="254">3 SigV4 call</text>
  <text class="dg-ts" x="16" y="322">User pools authenticate users and issue JWTs. Identity pools turn a token (or a guest) into IAM role credentials.</text>
</svg>
<figcaption>Figure M05-10a. The two halves of Cognito. Path A protects your own API with tokens; path B lets the app call AWS services directly with tightly scoped temporary credentials.</figcaption>
</figure>`;

var DG_0510_JWT = `
<figure>
<svg class="diagram" viewBox="0 0 760 210" role="img" aria-labelledby="m0510bt m0510bd">
  <title id="m0510bt">Anatomy of a JSON Web Token</title>
  <desc id="m0510bd">A JWT has three base64url-encoded parts separated by dots: a header naming the algorithm and key ID, a payload of claims such as sub, iss, aud or client_id, exp and cognito:groups, and a signature made with the user pool's private key and checked with the public keys published at the JWKS URL.</desc>
  <rect class="dg-info" x="16" y="20" width="230" height="140" rx="8"/>
  <text class="dg-tb" x="30" y="44">Header</text>
  <text class="dg-ts" x="30" y="66">"alg": "RS256"</text>
  <text class="dg-ts" x="30" y="84">"kid": key id → pick the</text>
  <text class="dg-ts" x="30" y="100">public key from JWKS</text>
  <rect class="dg-edge" x="264" y="20" width="230" height="140" rx="8"/>
  <text class="dg-tb" x="278" y="44">Payload (claims)</text>
  <text class="dg-ts" x="278" y="66">sub: stable user id</text>
  <text class="dg-ts" x="278" y="82">iss: user pool URL</text>
  <text class="dg-ts" x="278" y="98">aud (ID) / client_id (access)</text>
  <text class="dg-ts" x="278" y="114">token_use: id | access</text>
  <text class="dg-ts" x="278" y="130">exp, iat · cognito:groups</text>
  <text class="dg-ts" x="278" y="146">scope (access token)</text>
  <rect class="dg-good" x="512" y="20" width="232" height="140" rx="8"/>
  <text class="dg-tb" x="526" y="44">Signature</text>
  <text class="dg-ts" x="526" y="66">signed with the user pool's</text>
  <text class="dg-ts" x="526" y="82">private key; anyone verifies</text>
  <text class="dg-ts" x="526" y="98">it with the public keys at</text>
  <text class="dg-ts" x="526" y="114">…/.well-known/jwks.json</text>
  <text class="dg-ta" x="250" y="94">.</text>
  <text class="dg-ta" x="498" y="94">.</text>
  <text class="dg-ts" x="16" y="186">On the wire: eyJhbGciOi… . eyJzdWIiOi… . kB2xQ… (three base64url parts joined by dots)</text>
  <text class="dg-ts" x="16" y="202">Base64url is encoding, not encryption: never put secrets in claims.</text>
</svg>
<figcaption>Figure M05-10b. A JWT is a signed, self-contained statement about a user. Your API trusts it after checking the signature, issuer, audience/client, token use and expiry, without calling Cognito on every request.</figcaption>
</figure>`;

LESSONS.push({
  id: "M05.10", title: "Application identity: Amazon Cognito", level: 200, minutes: 55,
  objectives: [
    "Distinguish workforce identity (IAM Identity Center) from customer identity (Amazon Cognito)",
    "Explain user pools, their tokens (ID, access, refresh) and how an API validates a JWT",
    "Explain identity pools and how they exchange a token or guest identity for temporary AWS credentials",
    "Choose the right integration: API Gateway Cognito or JWT authorizer, Lambda authorizer, IAM authorization, or ALB authentication"
  ],
  sections: [
    { type: "why", html: `
<p>Everything in M05.01–M05.09 is about <em>your</em> people and workloads reaching AWS. But most applications also have <strong>end users</strong>: shoppers, patients, players, drivers. You will not create an IAM user for each of ten million customers, and you should never ship AWS access keys inside a mobile app. Yet those users need to sign up, sign in with Google, reset passwords, use MFA, call your API, and sometimes upload a photo straight to S3.</p>
<p>That is <strong>customer identity and access management (CIAM)</strong>, and on AWS it is <strong>Amazon Cognito</strong>. The SAA-C03 exam tests it with a few recurring scenarios: "add sign-up and sign-in to a web/mobile app", "let users sign in with social identity providers", "secure an API Gateway API with user authentication", and "give mobile users temporary, limited access to S3 or DynamoDB". The key skill is knowing which half of Cognito does what: <strong>user pools authenticate</strong>, <strong>identity pools authorise access to AWS</strong>.</p>` },

    { type: "concept", title: "Workforce vs customer identity, and user pools", html: DG_0510_FLOW + `
<h3>Two different identity problems</h3>
<table>
<thead><tr><th></th><th>Workforce identity</th><th>Customer identity (CIAM)</th></tr></thead>
<tbody>
<tr><td>Who</td><td>Employees, contractors, administrators</td><td>Your application's end users</td></tr>
<tr><td>Scale</td><td>Tens to thousands</td><td>Thousands to millions</td></tr>
<tr><td>Access to</td><td>AWS accounts and the console, internal apps</td><td>Your web/mobile app and its APIs</td></tr>
<tr><td>AWS service</td><td>IAM Identity Center (M05.07)</td><td>Amazon Cognito</td></tr>
<tr><td>Typical features</td><td>SSO to accounts, permission sets, corporate IdP</td><td>Self sign-up, social login, password reset, branding, MFA, bot/fraud protection</td></tr>
</tbody></table>

<h3>Cognito user pools</h3>
<p>A <strong>user pool</strong> is a managed user directory and OpenID Connect (OIDC) identity provider. It handles:</p>
<ul>
  <li><strong>Sign-up and sign-in</strong>: username, email or phone; email/phone verification; password policies; account recovery. Passwordless options (passkeys, one-time codes by email or SMS) are available on the higher feature plans.</li>
  <li><strong>Managed login</strong> (formerly the hosted UI): AWS-hosted, brandable sign-in and sign-up pages on your own domain, implementing the OAuth 2.0 flows for you.</li>
  <li><strong>MFA</strong>: TOTP authenticator apps, SMS, and email codes; optional or required.</li>
  <li><strong>Federation</strong>: users can sign in with Google, Facebook, Apple, Amazon, or any SAML 2.0 or OIDC provider (for example a business customer's Entra ID). The user pool normalises them and always issues <em>its own</em> tokens, so your app handles one token format.</li>
  <li><strong>Threat protection</strong> (formerly "advanced security features"): compromised-credential detection and adaptive authentication that can require MFA or block risky sign-ins. Available on the Plus feature plan.</li>
  <li><strong>Groups</strong>: for example <code>admins</code> and <code>customers</code>. Group membership appears in the <code>cognito:groups</code> claim, and a group can be linked to an IAM role used by identity pools.</li>
  <li><strong>App clients</strong>: each application (web SPA, mobile app, back-end service) gets an app client with its own allowed flows, scopes, callback URLs and token lifetimes. Public clients (SPA, mobile) have no client secret; confidential server-side clients do.</li>
  <li><strong>Lambda triggers</strong>: hooks to customise the flow, for example <em>pre sign-up</em> (auto-confirm or block domains), <em>post confirmation</em> (create a profile record in DynamoDB), <em>pre token generation</em> (add or remove claims), <em>user migration</em> (move users from a legacy database on their first sign-in), and <em>custom authentication challenges</em>.</li>
</ul>

<h3>The three tokens</h3>
<table>
<thead><tr><th>Token</th><th>Purpose</th><th>Default lifetime</th><th>Send it to</th></tr></thead>
<tbody>
<tr><td><strong>ID token</strong></td><td>Who the user is: identity claims (sub, email, name, groups). OIDC standard.</td><td>1 hour (configurable from 5 minutes to 1 day)</td><td>Your app's front end; an identity pool</td></tr>
<tr><td><strong>Access token</strong></td><td>What the bearer may do: OAuth 2.0 scopes and groups. Has <code>client_id</code>, not <code>aud</code>.</td><td>1 hour (configurable from 5 minutes to 1 day)</td><td>Your APIs (API Gateway, ALB-protected services)</td></tr>
<tr><td><strong>Refresh token</strong></td><td>Get new ID and access tokens without signing in again</td><td>30 days (configurable from 60 minutes to 10 years)</td><td>Only back to Cognito's token endpoint; store it securely</td></tr>
</tbody></table>` },

    { type: "concept", title: "JWTs, OAuth flows and identity pools", html: DG_0510_JWT + `
<h3>How an API validates a Cognito JWT</h3>
<ol>
  <li>Split the token into header, payload and signature (base64url).</li>
  <li>Use the header's <code>kid</code> to pick the right public key from <code>https://cognito-idp.&lt;region&gt;.amazonaws.com/&lt;userPoolId&gt;/.well-known/jwks.json</code> (cache it).</li>
  <li>Verify the RS256 signature.</li>
  <li>Check <code>iss</code> equals your user pool URL, <code>exp</code> is in the future, <code>token_use</code> is what you expect (<code>access</code> for APIs), and the audience matches your app client (<code>aud</code> in ID tokens, <code>client_id</code> in access tokens).</li>
  <li>Authorise using claims: scopes, <code>cognito:groups</code>, or custom attributes.</li>
</ol>
<p>API Gateway authorizers and ALB do all of this for you. If you validate tokens in your own code, use a maintained library (for example <code>aws-jwt-verify</code>), never a hand-written parser.</p>

<h3>OAuth 2.0 flows you will meet</h3>
<table>
<thead><tr><th>Flow</th><th>Who uses it</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>Authorization code + PKCE</strong></td><td>Single-page apps, mobile apps, server-rendered web apps</td><td>The recommended user sign-in flow. PKCE (Proof Key for Code Exchange) protects public clients that can't hold a secret.</td></tr>
<tr><td><strong>Client credentials</strong></td><td>Machine-to-machine (a partner's back end calling your API)</td><td>Needs an app client with a secret and a <strong>resource server</strong> with custom scopes (for example <code>orders/read</code>). Returns only an access token, no user.</td></tr>
<tr><td>Implicit</td><td>Legacy SPAs</td><td>Returns tokens in the URL fragment. Avoid; use code + PKCE.</td></tr>
<tr><td>Native SDK flows (SRP, USER_PASSWORD_AUTH, custom auth)</td><td>Apps with their own sign-in UI, using Amplify or the SDK</td><td>No managed login pages; your app collects credentials and calls Cognito's API.</td></tr>
</tbody></table>

<h3>Cognito identity pools</h3>
<p>An <strong>identity pool</strong> (federated identities) answers a different question: <em>"this user is authenticated by someone; what AWS credentials should they get?"</em></p>
<ul>
  <li>Input: a token from a user pool, a social provider (Google, Facebook, Apple, Amazon), a SAML or OIDC provider, a custom developer-authenticated identity, or <strong>no token at all</strong> (guest / unauthenticated access, if enabled).</li>
  <li>Output: temporary AWS credentials (access key, secret key, session token) from STS for an IAM role. Each user gets a stable <strong>identity ID</strong> such as <code>eu-west-1:7f3c…</code>.</li>
  <li>Roles: one <strong>authenticated role</strong> and one <strong>unauthenticated (guest) role</strong> by default. <strong>Role-based access control</strong> can choose a role per user from token claims (for example from <code>cognito:groups</code> or rules such as "if <code>custom:tier</code> = premium, use the premium role").</li>
  <li><strong>Attributes for access control</strong>: map token claims to <strong>principal tags</strong> so one role's policy can use <code>aws:PrincipalTag/…</code> conditions (ABAC, M05.08).</li>
  <li>The role's <strong>trust policy</strong> trusts <code>cognito-identity.amazonaws.com</code> with conditions on <code>cognito-identity.amazonaws.com:aud</code> (your identity pool ID) and <code>cognito-identity.amazonaws.com:amr</code> (<code>authenticated</code> or <code>unauthenticated</code>). Under the hood this is <code>sts:AssumeRoleWithWebIdentity</code> (M05.05).</li>
</ul>
<div class="callout warn"><strong>Two different "sub" values.</strong> The user pool's <code>sub</code> claim is the user's ID in the user pool. The policy variable <code>\${cognito-identity.amazonaws.com:sub}</code> is the <strong>identity pool's identity ID</strong> (for example <code>eu-west-1:7f3c…</code>). Per-user S3 prefixes built from that variable must use the identity ID.</div>` },

    { type: "workflow", title: "A user signs in with Google and uploads a photo", html: `
<ol class="flow">
  <li><strong>Sign-in starts.</strong> The app opens managed login (authorization code flow with PKCE). The user chooses "Continue with Google".</li>
  <li><strong>Federation.</strong> The user pool redirects to Google; the user authenticates there. Google returns an authorization code to the user pool, which exchanges it, reads the profile and creates (or links) a user pool user such as <code>Google_1098…</code>.</li>
  <li><strong>Tokens issued.</strong> The user pool redirects back to the app with its own authorization code; the app exchanges it (with the PKCE verifier) at the token endpoint for an ID token, an access token and a refresh token. All are issued by <em>Cognito</em>, not Google.</li>
  <li><strong>Calling the API (path A).</strong> The app sends <code>Authorization: Bearer &lt;access token&gt;</code> to API Gateway. The Cognito authorizer validates signature, issuer, expiry and required scope, then passes the claims to Lambda. Invalid or expired tokens get <code>401 Unauthorized</code> without ever invoking your code.</li>
  <li><strong>Getting AWS credentials (path B).</strong> The app calls the identity pool (<code>GetId</code>, then <code>GetCredentialsForIdentity</code>) with the ID token. The identity pool verifies it and obtains temporary credentials for the authenticated role from STS (valid for one hour).</li>
  <li><strong>Direct upload.</strong> The app signs a <code>PutObject</code> request with those credentials. The role's policy only allows <code>uploads/\${cognito-identity.amazonaws.com:sub}/*</code>, so the user can write only to their own prefix. The photo never passes through your servers.</li>
  <li><strong>Refresh.</strong> When the access token expires after an hour, the SDK uses the refresh token to get new tokens silently. Signing out (or revoking the refresh token) ends the session.</li>
</ol>` },

    { type: "aws", title: "Integration patterns and choosing between them", html: `
<h3>User pool vs identity pool (exam favourite)</h3>
<table>
<thead><tr><th></th><th>User pool</th><th>Identity pool</th></tr></thead>
<tbody>
<tr><td>Main job</td><td><strong>Authentication</strong>: user directory, sign-up/sign-in, MFA, federation</td><td><strong>Authorization to AWS</strong>: temporary IAM credentials</td></tr>
<tr><td>Output</td><td>JWTs (ID, access, refresh)</td><td>STS credentials for an IAM role</td></tr>
<tr><td>Stores users?</td><td>Yes</td><td>No: only identity IDs mapped to external identities</td></tr>
<tr><td>Guest access</td><td>No</td><td>Yes (unauthenticated role)</td></tr>
<tr><td>Use it to</td><td>Protect your own APIs and apps</td><td>Call AWS services (S3, DynamoDB, IoT, Kinesis…) directly from the client</td></tr>
<tr><td>Exam keywords</td><td>"sign-up and sign-in", "social login", "user directory", "JWT"</td><td>"temporary AWS credentials for mobile users", "guest users", "direct access to S3/DynamoDB"</td></tr>
</tbody></table>
<p>They are often used <strong>together</strong>: the user pool authenticates, the identity pool trades the user pool's ID token for AWS credentials.</p>

<h3>Protecting APIs and apps</h3>
<table>
<thead><tr><th>Option</th><th>How it works</th><th>Choose it when</th></tr></thead>
<tbody>
<tr><td>API Gateway <strong>Cognito user pool authorizer</strong> (REST API)</td><td>Validates a user pool ID or access token; with OAuth scopes configured on the method, it requires an access token with that scope</td><td>Your users are in a Cognito user pool and you want zero auth code</td></tr>
<tr><td>API Gateway <strong>JWT authorizer</strong> (HTTP API)</td><td>Validates any OIDC/OAuth 2.0 JWT (issuer, audience, scopes), including Cognito's</td><td>HTTP APIs; any standards-based IdP</td></tr>
<tr><td>API Gateway <strong>Lambda authorizer</strong></td><td>Your function inspects a token or request and returns an IAM policy</td><td>Custom logic, non-JWT tokens, calls to a permissions service</td></tr>
<tr><td>API Gateway <strong>IAM authorization</strong></td><td>Requests are SigV4-signed with AWS credentials (for example from an identity pool)</td><td>Callers already have AWS credentials; fine-grained IAM control</td></tr>
<tr><td><strong>ALB</strong> <code>authenticate-cognito</code> / <code>authenticate-oidc</code> action</td><td>The HTTPS listener runs the sign-in flow, keeps a session cookie, and forwards user claims in <code>x-amzn-oidc-*</code> headers</td><td>Traditional web apps on EC2/ECS behind an ALB, with no code changes</td></tr>
<tr><td><strong>AWS AppSync</strong></td><td>GraphQL API with built-in Cognito user pool authorization (and group-based rules)</td><td>GraphQL back ends</td></tr>
</tbody></table>

<h3>Things to know about Cognito</h3>
<ul>
  <li>Cognito is <strong>Regional</strong>. A user pool lives in one Region; plan for that in multi-Region designs.</li>
  <li><strong>Feature plans</strong> (Lite, Essentials, Plus) determine features such as managed login branding, passwordless sign-in and threat protection. Pricing is per monthly active user (MAU), with a free tier; machine-to-machine client credentials are priced separately.</li>
  <li>Some settings are fixed after creation, such as which attributes are required and whether users sign in with username or email. Design them carefully; changing them later means a new pool and a migration (the user migration Lambda trigger helps).</li>
  <li>Identity pool credentials are standard STS credentials, so every call appears in CloudTrail with the identity ID, and every permission is a normal IAM policy that M05.02–M05.09 apply to.</li>
</ul>` },

    { type: "examples", html: `
<h3>Example 1: a decoded ID token payload</h3>
<pre><code>{
  "sub": "5f2b8e4a-1c3d-4e5f-9a7b-0c1d2e3f4a5b",
  "cognito:groups": ["customers"],
  "email_verified": true,
  "iss": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_Ab12Cd34E",
  "cognito:username": "Google_109876543210",
  "aud": "3n4b5c6d7e8f9g0h1i2j3k4l5m",
  "token_use": "id",
  "auth_time": 1791360000,
  "exp": 1791363600,
  "iat": 1791360000,
  "email": "maria@example.com"
}</code></pre>
<p><code>exp − iat = 3,600</code> seconds: the default one-hour lifetime. <code>aud</code> is the app client ID; an access token would carry <code>client_id</code> and <code>scope</code> instead, and <code>"token_use": "access"</code>.</p>

<h3>Example 2: identity pool authenticated role, scoped to the user's own prefix</h3>
<p>Trust policy (who can assume the role):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "cognito-identity.amazonaws.com" },
    "Action": ["sts:AssumeRoleWithWebIdentity", "sts:TagSession"],
    "Condition": {
      "StringEquals": { "cognito-identity.amazonaws.com:aud": "eu-west-1:0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d" },
      "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" }
    }
  }]
}</code></pre>
<p>Permissions policy (what the user can do):</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject", "s3:GetObject"],
    "Resource": "arn:aws:s3:::photoshare-uploads-111122223333/uploads/\${cognito-identity.amazonaws.com:sub}/*"
  }]
}</code></pre>
<p>Without the <code>aud</code> condition, <em>any</em> identity pool in any account could obtain credentials for this role. Without the policy variable, every user could overwrite every other user's photos.</p>

<h3>Example 3: client credentials for a partner back end</h3>
<pre><code>$ curl -s -X POST https://auth.example.com/oauth2/token \\
    -H "Content-Type: application/x-www-form-urlencoded" \\
    -u "$CLIENT_ID:$CLIENT_SECRET" \\
    -d "grant_type=client_credentials&amp;scope=orders/read"
{"access_token":"eyJraWQiOi...","expires_in":3600,"token_type":"Bearer"}</code></pre>
<p>No user is involved and there is no refresh token: the partner simply requests a new token before this one expires. On the API, require the <code>orders/read</code> scope on the GET methods only.</p>

<h3>Example 4: protecting an API Gateway REST method</h3>
<pre><code>aws apigateway create-authorizer --rest-api-id a1b2c3d4e5 --name photos-users \\
  --type COGNITO_USER_POOLS \\
  --provider-arns arn:aws:cognito-idp:eu-west-1:111122223333:userpool/eu-west-1_Ab12Cd34E \\
  --identity-source method.request.header.Authorization</code></pre>
<p>Attach the authorizer to each method and (optionally) list the OAuth scopes it requires. Requests with a missing, expired or forged token are rejected with <code>401</code> before Lambda runs, so you don't pay for invocations from unauthenticated callers.</p>

<h3>Example 5: ALB authentication in front of a legacy web app</h3>
<pre><code>"Actions": [
  { "Type": "authenticate-cognito", "Order": 1,
    "AuthenticateCognitoConfig": {
      "UserPoolArn": "arn:aws:cognito-idp:eu-west-1:111122223333:userpool/eu-west-1_Ab12Cd34E",
      "UserPoolClientId": "3n4b5c6d7e8f9g0h1i2j3k4l5m",
      "UserPoolDomain": "auth-example",
      "OnUnauthenticatedRequest": "authenticate" } },
  { "Type": "forward", "Order": 2, "TargetGroupArn": "arn:aws:elasticloadbalancing:eu-west-1:111122223333:targetgroup/legacy-web/0123456789abcdef" }
]</code></pre>
<p>The application receives the user's claims in the <code>x-amzn-oidc-data</code> header (a JWT signed by the ALB), without any sign-in code of its own. ALB authentication requires an HTTPS listener.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you would choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Consumer mobile app needs sign-up, sign-in with Google and Apple, and MFA</td><td>Cognito user pool with social IdPs and managed login</td><td>Managed CIAM; one token format whatever the provider</td></tr>
<tr><td>Mobile users upload videos directly to S3 without going through servers</td><td>User pool + identity pool; role scoped with <code>\${cognito-identity.amazonaws.com:sub}</code></td><td>Temporary, per-user credentials; no keys in the app</td></tr>
<tr><td>A game lets players try it before registering, saving progress to DynamoDB</td><td>Identity pool with unauthenticated (guest) access, then link the identity when they sign up</td><td>Guest credentials with a very narrow role</td></tr>
<tr><td>Serverless REST API for signed-in customers, admins get extra endpoints</td><td>API Gateway Cognito authorizer; check <code>cognito:groups</code> or scopes</td><td>No custom auth code, rejection before Lambda</td></tr>
<tr><td>Business customers want to sign in with their own Entra ID / Okta</td><td>User pool SAML or OIDC federation per customer</td><td>Each enterprise uses its own IdP; your app still gets Cognito tokens</td></tr>
<tr><td>Internal staff need SSO into AWS accounts</td><td><strong>Not Cognito</strong>: IAM Identity Center (M05.07)</td><td>Workforce identity is a different problem</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: create a user pool and read its tokens (free tier)", html: `
<p>Cognito has a free tier for monthly active users, so this costs nothing for a test user. Use the <code>academy-admin</code> profile; replace the Region if you use another.</p>
<pre><code>REGION=eu-west-1
POOL=$(aws cognito-idp create-user-pool --pool-name academy-demo --region $REGION \\
  --auto-verified-attributes email --username-attributes email \\
  --query UserPool.Id --output text)
CLIENT=$(aws cognito-idp create-user-pool-client --user-pool-id $POOL --region $REGION \\
  --client-name cli-demo --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \\
  --query UserPoolClient.ClientId --output text)

aws cognito-idp admin-create-user --user-pool-id $POOL --region $REGION \\
  --username demo@example.com --message-action SUPPRESS
aws cognito-idp admin-set-user-password --user-pool-id $POOL --region $REGION \\
  --username demo@example.com --password 'Academy-Demo-2026!' --permanent

TOKENS=$(aws cognito-idp initiate-auth --region $REGION --client-id $CLIENT \\
  --auth-flow USER_PASSWORD_AUTH \\
  --auth-parameters USERNAME=demo@example.com,PASSWORD='Academy-Demo-2026!')
echo "$TOKENS" | python3 -c 'import sys,json,base64;t=json.load(sys.stdin)["AuthenticationResult"]["IdToken"].split(".")[1];print(json.dumps(json.loads(base64.urlsafe_b64decode(t+"=="*2)),indent=2))'</code></pre>
<p>Notice <code>token_use</code>, <code>iss</code>, <code>aud</code> and <code>exp − iat</code>. Then decode the <code>AccessToken</code> the same way and compare: <code>client_id</code> instead of <code>aud</code>, and a <code>scope</code> claim.</p>
<p><strong>Note:</strong> <code>USER_PASSWORD_AUTH</code> sends the password to Cognito over TLS and is fine for this CLI demo. Real apps should use managed login (code + PKCE) or the SRP flow that Amplify uses.</p>
<p><strong>Clean-up:</strong> <code>aws cognito-idp delete-user-pool --user-pool-id $POOL --region $REGION</code>.</p>` },

    { type: "casestudy", title: "Case study: PicNest, a photo-sharing app", html: `
<p><strong>Company:</strong> PicNest, a start-up building a photo-sharing mobile app (iOS and Android) with a small web dashboard.</p>
<p><strong>Requirements:</strong></p>
<ul>
  <li>Sign-up with email, or sign-in with Google and Apple; optional MFA for users who want it.</li>
  <li>Users upload full-resolution photos (up to 50 MB) without the company paying for servers to proxy uploads.</li>
  <li>A REST API for albums, likes and comments; moderators get extra endpoints.</li>
  <li>No AWS credentials embedded in the apps; the security review must show users can't touch each other's photos.</li>
  <li>Expected scale: 200,000 monthly active users in year one.</li>
</ul>
<p><strong>Design:</strong></p>
<table>
<thead><tr><th>Need</th><th>Decision</th></tr></thead>
<tbody>
<tr><td>Sign-in</td><td>One Cognito user pool, managed login on <code>auth.picnest.app</code>, Google and Apple as federated IdPs, email as username, optional TOTP MFA</td></tr>
<tr><td>Profile records</td><td>A post-confirmation Lambda trigger creates the user's profile item in DynamoDB</td></tr>
<tr><td>Uploads</td><td>Identity pool trusting the user pool; authenticated role allows <code>s3:PutObject</code> only on <code>uploads/\${cognito-identity.amazonaws.com:sub}/*</code>; multipart upload from the app SDK</td></tr>
<tr><td>API</td><td>API Gateway REST API with a Cognito user pool authorizer; moderator methods require membership of the <code>moderators</code> group, checked in Lambda from <code>cognito:groups</code></td></tr>
<tr><td>Processing</td><td>S3 event → Lambda creates thumbnails into a separate bucket served by CloudFront</td></tr>
</tbody></table>
<p><strong>What went wrong first:</strong> the first version of the S3 policy used the <em>user pool</em> <code>sub</code> as the folder name in the app, while the IAM policy used the <em>identity pool</em> variable. Every upload failed with <code>AccessDenied</code>. The fix was to use the identity ID returned by <code>GetId</code> as the prefix in the app as well, and to store a mapping (user pool <code>sub</code> → identity ID) in the profile item.</p>
<p><strong>Outcome:</strong> no upload servers, so the company paid only for S3 storage and requests plus Cognito MAUs. A penetration test confirmed that a user's temporary credentials couldn't read or write other users' prefixes, couldn't list the bucket, and expired after an hour. API calls with forged or expired tokens never reached Lambda.</p>
<p><strong>Lessons learned:</strong> (1) know which "sub" you are using; (2) always put the identity pool ID in the role's trust condition; (3) keep the guest role disabled unless there is a real product need; (4) decide user pool sign-in attributes before launch, because some can't be changed later.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Stem says</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>"Add user sign-up and sign-in to a web or mobile app", "user directory"</td><td>Cognito <strong>user pool</strong></td></tr>
<tr><td>"Allow users to sign in with Google/Facebook/Apple" (to your app)</td><td>User pool with social identity providers</td></tr>
<tr><td>"Mobile app needs temporary AWS credentials to access S3 or DynamoDB directly"</td><td>Cognito <strong>identity pool</strong></td></tr>
<tr><td>"Guest / unauthenticated users need limited AWS access"</td><td>Identity pool with an unauthenticated role</td></tr>
<tr><td>"Secure API Gateway so only signed-in users can call it, with minimal code"</td><td>Cognito user pool authorizer (REST) or JWT authorizer (HTTP API)</td></tr>
<tr><td>"Authenticate users at the load balancer before they reach the app"</td><td>ALB <code>authenticate-cognito</code> or <code>authenticate-oidc</code> listener rule (HTTPS)</td></tr>
<tr><td>"Employees need single sign-on to AWS accounts"</td><td>IAM Identity Center, <strong>not</strong> Cognito</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> creating IAM users per customer (doesn't scale; long-term keys); embedding an access key in the app (never); using an identity pool alone to "manage sign-up and passwords" (identity pools don't store users); using a Lambda authorizer when a Cognito authorizer meets the requirement with less code (more operational overhead); STS <code>GetFederationToken</code> called from the app (needs long-term credentials on the client).</p>` },

    { type: "architect", html: `
<ul>
  <li><strong>Design the user pool schema up front.</strong> Sign-in attributes and required attributes are largely fixed after creation; plan custom attributes and the username strategy (email vs opaque username) before launch.</li>
  <li><strong>Keep tokens short-lived and refresh tokens safe.</strong> In browsers, prefer the code + PKCE flow and store tokens in memory or secure HTTP-only cookies via a back end; avoid long-lived tokens in local storage, which is exposed to XSS.</li>
  <li><strong>Authorisation belongs in your API, too.</strong> A valid token proves identity, not that this user may edit <em>that</em> album. Check ownership in your service (or with Amazon Verified Permissions for policy-based authorisation).</li>
  <li><strong>Scope identity pool roles tightly.</strong> Use policy variables and conditions; never give the unauthenticated role write access to anything important; monitor role usage in CloudTrail.</li>
  <li><strong>Plan for scale and quotas.</strong> Cognito has request-rate quotas per API category (for example user authentication and token requests). For very large launches, review the quotas and request increases ahead of time, and cache JWKS keys in your validators.</li>
  <li><strong>Multi-Region.</strong> A user pool is Regional. For Regional resilience, design how users re-authenticate if the Region is unavailable (for example a secondary pool with user migration, or an external IdP), and document the trade-off.</li>
  <li><strong>Pre token generation</strong> lets you add authorisation claims (tenant ID, plan) to tokens, which keeps APIs stateless; keep tokens small because they travel with every request.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Workforce identity → IAM Identity Center; customer identity (CIAM) → Amazon Cognito.</li>
  <li><strong>User pools authenticate</strong>: user directory, sign-up/sign-in, MFA, social and SAML/OIDC federation, managed login, Lambda triggers, groups. They issue JWTs.</li>
  <li>ID token = who the user is (<code>aud</code>); access token = what the bearer may do (<code>client_id</code>, <code>scope</code>); both 1 hour by default. Refresh token 30 days by default.</li>
  <li>Validate JWTs by signature (JWKS), issuer, expiry, token use and audience/client; let API Gateway or ALB do it when possible.</li>
  <li>Use authorization code + PKCE for apps, client credentials with resource-server scopes for machine-to-machine.</li>
  <li><strong>Identity pools authorise access to AWS</strong>: they exchange a token (or a guest identity) for temporary STS credentials for an IAM role.</li>
  <li><code>\${cognito-identity.amazonaws.com:sub}</code> is the identity pool identity ID; use it to scope per-user S3 prefixes or DynamoDB keys.</li>
  <li>Protect APIs with a Cognito user pool authorizer (REST), JWT authorizer (HTTP API), Lambda authorizer (custom) or IAM auth; protect web apps with ALB authentication.</li>
</ul>` }
  ],
  drills: [
    { id: "M05.10-d1", q: "Which Cognito component stores users and issues JWTs? (two words)", answers: ["user pool", "userpool", "user pools", "cognito user pool"], explain: "User pools authenticate; identity pools hand out AWS credentials." },
    { id: "M05.10-d2", q: "Which Cognito component exchanges a token, or a guest identity, for temporary AWS credentials? (two words)", answers: ["identity pool", "identitypool", "identity pools", "cognito identity pool"], explain: "Identity pools call STS (AssumeRoleWithWebIdentity) for an authenticated or unauthenticated role." },
    { id: "M05.10-d3", q: "What is the default lifetime of a Cognito access token, in minutes?", answers: ["60", "60 minutes", "60min"], hint: "The same as the ID token.", explain: "ID and access tokens default to 1 hour (configurable from 5 minutes to 1 day)." },
    { id: "M05.10-d4", q: "What is the default lifetime of a Cognito refresh token, in days?", answers: ["30", "30 days", "30days"], explain: "Configurable from 60 minutes to 10 years." },
    { id: "M05.10-d5", q: "Which claim tells you whether a Cognito JWT is an ID token or an access token?", answers: ["token_use", "tokenuse"], explain: "<code>token_use</code> is <code>id</code> or <code>access</code>." },
    { id: "M05.10-d6", q: "Which OAuth 2.0 grant type should a partner's back-end service (no user involved) use to get an access token from Cognito? (two words, e.g. x y)", answers: ["client credentials", "clientcredentials", "client_credentials"], explain: "Client credentials with a confidential app client and resource-server scopes." },
    { id: "M05.10-d7", q: "Which STS API does an identity pool use under the hood to obtain credentials for the user's role?", answers: ["AssumeRoleWithWebIdentity", "sts:AssumeRoleWithWebIdentity"], explain: "The role's trust policy allows <code>sts:AssumeRoleWithWebIdentity</code> for <code>cognito-identity.amazonaws.com</code>." },
    { id: "M05.10-d8", q: "An ID token has <code>iat</code> = 1791360000 and <code>exp</code> = 1791363600. How many minutes is it valid for?", answers: ["60", "60 minutes", "60min"], explain: "3,600 seconds = 60 minutes, the default." }
  ],
  check: [
    { id: "M05.10-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company is building a mobile app. Users must be able to sign up, sign in with their Google accounts, and use MFA. The company wants a managed solution with the LEAST development effort. What should a solutions architect recommend?",
      options: [
        { t: "An Amazon Cognito user pool with Google as a federated identity provider and MFA enabled", c: true, why: "User pools provide sign-up, sign-in, social federation and MFA as a managed service." },
        { t: "An Amazon Cognito identity pool with Google as an identity provider", c: false, why: "Identity pools issue AWS credentials; they don't provide a user directory, sign-up or MFA." },
        { t: "IAM users created for each app user, with MFA devices", c: false, why: "IAM users are for workforce/workloads, don't scale to app users and would require long-term credentials." },
        { t: "IAM Identity Center with Google Workspace as the identity source", c: false, why: "Identity Center is for workforce access to AWS accounts and apps, not consumer app sign-up." }
      ] },
    { id: "M05.10-k2", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Authenticated users of a mobile app must upload images directly to an S3 bucket. Each user may write only to their own folder. AWS credentials must not be stored in the app. Which solution meets these requirements?",
      options: [
        { t: "A Cognito identity pool that gives authenticated users an IAM role whose policy allows <code>s3:PutObject</code> on <code>uploads/\${cognito-identity.amazonaws.com:sub}/*</code>", c: true, why: "The identity pool issues short-lived credentials, and the policy variable restricts each user to their own prefix." },
        { t: "Embed an IAM user's access keys in the app and use a bucket policy that checks the user's email", c: false, why: "Never embed long-term credentials in an app; anyone can extract them." },
        { t: "A Cognito user pool authorizer on the S3 bucket", c: false, why: "Authorizers are an API Gateway feature; S3 needs AWS credentials (or presigned URLs)." },
        { t: "Make the bucket public for writes and use object names that include the user ID", c: false, why: "Public write access lets anyone write anything; naming is not access control." }
      ] },
    { id: "M05.10-k3", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "Which TWO statements about Cognito user pools and identity pools are correct?",
      options: [
        { t: "User pools issue JSON Web Tokens (ID, access and refresh tokens)", c: true, why: "User pools are an OIDC provider and issue JWTs." },
        { t: "Identity pools can provide limited AWS credentials to unauthenticated (guest) users", c: true, why: "The unauthenticated role gives guests narrowly scoped temporary credentials." },
        { t: "Identity pools store usernames and passwords", c: false, why: "Identity pools don't store users; they map external identities to identity IDs." },
        { t: "User pools return temporary AWS access keys directly to the app", c: false, why: "AWS credentials come from identity pools (via STS), not user pools." },
        { t: "A user pool can be used only with Cognito's own users, not with social providers", c: false, why: "User pools federate to social, SAML and OIDC providers." }
      ] },
    { id: "M05.10-k4", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A serverless REST API in Amazon API Gateway must accept requests only from users signed in through an existing Cognito user pool. Invalid requests must not invoke the Lambda functions. The team wants to write as little code as possible. What should they use?",
      options: [
        { t: "A Cognito user pool authorizer on the API Gateway methods", c: true, why: "API Gateway validates the token and rejects unauthorised requests before invoking Lambda, with no custom code." },
        { t: "A Lambda authorizer that downloads the JWKS and validates tokens", c: false, why: "It works but adds code to maintain when a built-in authorizer exists." },
        { t: "Validate the JWT inside each Lambda function", c: false, why: "Unauthorised requests would still invoke (and bill) the functions, and every function needs auth code." },
        { t: "An AWS WAF rule that checks for an Authorization header", c: false, why: "WAF can check that a header exists but cannot verify the token's signature or claims." }
      ] },
    { id: "M05.10-k5", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company runs a legacy web application on EC2 instances behind an Application Load Balancer. It must require users to sign in through the company's Cognito user pool without changing the application code. What should a solutions architect do?",
      options: [
        { t: "Add an <code>authenticate-cognito</code> action to the ALB's HTTPS listener rule before forwarding to the target group", c: true, why: "The ALB handles the sign-in flow and session and passes user claims in headers; the app needs no changes." },
        { t: "Put API Gateway in front of the ALB with a Lambda authorizer", c: false, why: "More components and code than needed; the ALB supports authentication natively." },
        { t: "Configure a Cognito identity pool and attach its role to the EC2 instances", c: false, why: "That gives instances AWS credentials; it doesn't authenticate end users." },
        { t: "Enable ALB sticky sessions", c: false, why: "Stickiness routes a client to the same target; it doesn't authenticate anyone." }
      ] },
    { id: "M05.10-k6", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "A trust policy for a Cognito identity pool's authenticated role allows <code>sts:AssumeRoleWithWebIdentity</code> for the principal <code>cognito-identity.amazonaws.com</code> but has no conditions. What is the risk?",
      options: [
        { t: "Identities from any identity pool, in any AWS account, could obtain credentials for the role", c: true, why: "The <code>cognito-identity.amazonaws.com:aud</code> condition pins the role to your identity pool ID; <code>amr</code> should require <code>authenticated</code>." },
        { t: "The role can be assumed only by guest users", c: false, why: "Without the amr condition, both authenticated and unauthenticated identities could use it, among others." },
        { t: "The role can no longer be used by your identity pool", c: false, why: "It still works for your pool; the problem is that it also works for others." },
        { t: "STS will reject the trust policy as invalid", c: false, why: "The policy is valid; it's just dangerously broad." }
      ] }
  ],
  cards: ["fc-M05-10-01", "fc-M05-10-02", "fc-M05-10-03", "fc-M05-10-04", "fc-M05-10-05", "fc-M05-10-06", "fc-M05-10-07", "fc-M05-10-08", "fc-M05-10-09", "fc-M05-10-10", "fc-M05-10-11"],
  references: [
    "<em>System Design on AWS</em> ch.12 \"Amazon Cognito\" (PDF p608–613)",
    "Amazon Cognito Developer Guide: <em>User pools</em>, <em>Identity pools</em>, <em>Understanding user pool JSON web tokens</em>, <em>Verifying a JSON web token</em>",
    "Amazon API Gateway Developer Guide: <em>Control access to a REST API using Amazon Cognito user pools as authorizer</em>; <em>JWT authorizers for HTTP APIs</em>",
    "Elastic Load Balancing User Guide: <em>Authenticate users using an Application Load Balancer</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M05-10-01", front: "User pool vs identity pool in one line each?", back: "User pool: <strong>authentication</strong>, user directory, issues JWTs. Identity pool: <strong>authorization to AWS</strong>, exchanges a token (or guest) for temporary STS credentials." },
  { id: "fc-M05-10-02", front: "Workforce vs customer identity on AWS?", back: "Workforce (employees → AWS accounts): IAM Identity Center. Customers (app users): Amazon Cognito." },
  { id: "fc-M05-10-03", front: "ID token vs access token?", back: "ID token: who the user is (identity claims, <code>aud</code>). Access token: what the bearer may do (<code>scope</code>, <code>client_id</code>); send it to APIs." },
  { id: "fc-M05-10-04", front: "Default Cognito token lifetimes?", back: "ID and access: 1 hour (5 min – 1 day). Refresh: 30 days (60 min – 10 years)." },
  { id: "fc-M05-10-05", front: "How do you validate a Cognito JWT?", back: "Verify the signature with the key from JWKS (by <code>kid</code>), then check <code>iss</code>, <code>exp</code>, <code>token_use</code> and <code>aud</code>/<code>client_id</code>." },
  { id: "fc-M05-10-06", front: "OAuth flow for SPAs and mobile apps? For machine-to-machine?", back: "Authorization code + PKCE. Client credentials with a resource server and custom scopes." },
  { id: "fc-M05-10-07", front: "<code>\${cognito-identity.amazonaws.com:sub}</code> is…?", back: "The identity pool identity ID (e.g. <code>eu-west-1:7f3c…</code>), not the user pool <code>sub</code>. Use it for per-user S3 prefixes." },
  { id: "fc-M05-10-08", front: "Two trust-policy conditions every identity pool role needs?", back: "<code>cognito-identity.amazonaws.com:aud</code> = your identity pool ID; <code>cognito-identity.amazonaws.com:amr</code> = authenticated (or unauthenticated for the guest role)." },
  { id: "fc-M05-10-09", front: "Four ways to protect an API Gateway API?", back: "Cognito user pool authorizer (REST) · JWT authorizer (HTTP API) · Lambda authorizer (custom) · IAM authorization (SigV4)." },
  { id: "fc-M05-10-10", front: "Authenticate users of a legacy app behind an ALB without code changes?", back: "ALB HTTPS listener rule with <code>authenticate-cognito</code> or <code>authenticate-oidc</code>, then forward." },
  { id: "fc-M05-10-11", front: "Name four Cognito Lambda triggers.", back: "Pre sign-up · post confirmation · pre token generation · user migration (also pre/post authentication, custom message, custom auth challenges)." }
);
// ================================================================== 80_lab_a.js
/* ================================================================== LAB L05a */
var DG_L05A_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 270" role="img" aria-labelledby="l05at l05ad">
  <title id="l05at">What you build in Lab L05a</title>
  <desc id="l05ad">Your IAM Identity Center admin session assumes a lab role. The role has one customer managed policy that allows listing and reading or writing the reports prefix of a test bucket and explicitly denies everything on the private prefix. You test the policy first with the IAM Policy Simulator and IAM Access Analyzer policy validation, then with real CLI calls.</desc>
  <defs><marker id="l05a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="12" y="40" width="170" height="74" rx="8"/>
  <text class="dg-tb" x="24" y="64">Your SSO session</text>
  <text class="dg-ts" x="24" y="84">profile academy-admin</text>
  <text class="dg-ts" x="24" y="100">AdministratorAccess</text>
  <path class="dg-line" d="M182 77 H246" marker-end="url(#l05a-ar)"/>
  <text class="dg-ts" x="196" y="68">assume</text>
  <rect class="dg-edge" x="248" y="22" width="232" height="110" rx="8"/>
  <text class="dg-tb" x="260" y="46">L05aReportsRole</text>
  <text class="dg-ts" x="260" y="66">trust: SSO admin role only</text>
  <text class="dg-ts" x="260" y="86">policy L05aReportsAccess:</text>
  <text class="dg-ts" x="260" y="102">Allow List (prefix reports/), Get, Put</text>
  <text class="dg-ts" x="260" y="118">Deny s3:* on private/*</text>
  <path class="dg-line" d="M480 60 H544" marker-end="url(#l05a-ar)"/>
  <path class="dg-line" d="M480 104 H544" marker-end="url(#l05a-ar)"/>
  <rect class="dg-good" x="546" y="30" width="202" height="50" rx="8"/>
  <text class="dg-t" x="558" y="52">reports/  ✔ list, get, put</text>
  <text class="dg-ts" x="558" y="70">identity policy allows</text>
  <rect class="dg-bad" x="546" y="86" width="202" height="50" rx="8"/>
  <text class="dg-t" x="558" y="108">private/  ✘ explicit deny</text>
  <text class="dg-ts" x="558" y="126">wins over any Allow</text>
  <text class="dg-ts" x="560" y="152">bucket academy-l05a-&lt;account&gt;</text>
  <rect class="dg-box" x="248" y="176" width="500" height="78" rx="8"/>
  <text class="dg-tb" x="260" y="200">Test before you trust</text>
  <text class="dg-ts" x="260" y="220">1. accessanalyzer validate-policy: grammar and security warnings</text>
  <text class="dg-ts" x="260" y="238">2. Policy Simulator: allowed / implicitDeny / explicitDeny for each action</text>
  <path class="dg-line" d="M364 174 V134" marker-end="url(#l05a-ar)"/>
  <text class="dg-ts" x="12" y="200">3. Then real calls with</text>
  <text class="dg-ts" x="12" y="216">profile l05a, reading the</text>
  <text class="dg-ts" x="12" y="232">AccessDenied messages</text>
</svg>
<figcaption>Figure L05a-1. One role, one customer managed policy, one bucket with two prefixes. You prove the policy with tools before you prove it with real requests.</figcaption>
</figure>`;

LABS.push({
  id: "L05a", title: "Least-privilege S3 policy with the IAM Policy Simulator", level: 200, duration: "60–90 min",
  cost: "≈ $0 (one test bucket and a few objects, deleted at the end; IAM, the simulator and policy validation are free)",
  objective: `
<p>Write a <strong>least-privilege identity-based policy</strong> for a realistic request: <em>"The reporting job must read and write files under <code>reports/</code> in one bucket, must be able to list only that folder, and must never touch <code>private/</code>, even if someone later gives it broader rights."</em></p>
<p>You will:</p>
<ul>
<li>express "only this folder" with the <code>s3:prefix</code> condition key, which is the part most people get wrong</li>
<li>use an <strong>explicit Deny</strong> as a guardrail that survives future over-broad Allows</li>
<li>check grammar and security warnings with <strong>IAM Access Analyzer policy validation</strong></li>
<li>predict and confirm every decision with the <strong>IAM Policy Simulator</strong> (<code>allowed</code>, <code>implicitDeny</code>, <code>explicitDeny</code>)</li>
<li>assume the role from your SSO session through a CLI profile and read real <code>AccessDenied</code> messages</li>
<li>change a managed policy safely with <strong>policy versions</strong></li>
</ul>
<p>This lab puts M05.02 (policy language), M05.04 (evaluation logic) and M05.09 (least privilege in practice) into your hands.</p>`,
  warning: `⚠️ Use your own learning account and the <code>academy-admin</code> profile from Lab L01. Everything you create is prefixed <code>L05a</code> or <code>academy-l05a</code>, so the clean-up cannot touch anything else. Run the commands in a bash shell (WSL, Linux, macOS or AWS CloudShell).`,
  diagram: DG_L05A_FLOW,
  steps: [
    { id: "s1", title: "Sign in and set shell variables", html: `
<pre><code>aws sso login --profile academy-admin
export AWS_PROFILE=academy-admin
export REGION=$(aws configure get region)            # e.g. eu-west-1
export ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export BUCKET=academy-l05a-$ACCOUNT
echo "$REGION $ACCOUNT $BUCKET"
mkdir -p ~/l05a &amp;&amp; cd ~/l05a</code></pre>
<p><strong>Expected:</strong> something like <code>eu-west-1 111122223333 academy-l05a-111122223333</code>.</p>
<p class="muted small">Using the account ID in the bucket name makes it globally unique without guesswork. If <code>REGION</code> is empty, set it yourself: <code>export REGION=eu-west-1</code>.</p>` },

    { id: "s2", title: "Create the test bucket and objects", html: `
<pre><code># us-east-1 must NOT be given a LocationConstraint; every other Region must
if [ "$REGION" = "us-east-1" ]; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION"
else
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \\
    --create-bucket-configuration LocationConstraint="$REGION"
fi

echo "q1,1200"      &gt; q1.csv
echo "alice,99000"  &gt; salaries.csv
aws s3 cp q1.csv       "s3://$BUCKET/reports/q1.csv"
aws s3 cp salaries.csv "s3://$BUCKET/private/salaries.csv"
aws s3 ls "s3://$BUCKET" --recursive</code></pre>
<p><strong>Expected:</strong> two keys, <code>private/salaries.csv</code> and <code>reports/q1.csv</code>.</p>
<div class="callout"><strong>Folders are an illusion.</strong> S3 has a flat namespace: <code>reports/q1.csv</code> is one key that happens to contain a slash. The console shows "folders" by listing with a <em>prefix</em> and a <em>delimiter</em>. That is why "access to a folder" in IAM is really two different things: <strong>object actions</strong> on <code>arn:aws:s3:::bucket/reports/*</code>, and <strong>listing</strong> the bucket with the <code>s3:prefix</code> condition.</div>` },

    { id: "s3", title: "Write the least-privilege policy", html: `
<p>Create <code>policy.json</code> with a placeholder, then substitute your bucket name:</p>
<pre><code>cat &gt; policy.template.json &lt;&lt;'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListOnlyTheReportsPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::BUCKET_NAME",
      "Condition": {
        "StringLike": { "s3:prefix": ["reports/", "reports/*"] }
      }
    },
    {
      "Sid": "ReadWriteReportObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::BUCKET_NAME/reports/*"
    },
    {
      "Sid": "NeverTouchPrivate",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::BUCKET_NAME/private/*"
    }
  ]
}
EOF
sed "s/BUCKET_NAME/$BUCKET/g" policy.template.json &gt; policy.json
python3 -m json.tool policy.json &gt; /dev/null &amp;&amp; echo "valid JSON"</code></pre>
<p>Read it statement by statement:</p>
<table>
<thead><tr><th>Sid</th><th>Resource type</th><th>Why it looks like this</th></tr></thead>
<tbody>
<tr><td><code>ListOnlyTheReportsPrefix</code></td><td>The <strong>bucket</strong> ARN (no <code>/*</code>)</td><td><code>s3:ListBucket</code> is a bucket-level action. Putting <code>bucket/reports/*</code> here would never match. The <code>s3:prefix</code> condition limits which "folder" can be listed.</td></tr>
<tr><td><code>ReadWriteReportObjects</code></td><td><strong>Object</strong> ARNs under <code>reports/</code></td><td>Get/Put are object-level actions, so the resource is <code>bucket/key</code>.</td></tr>
<tr><td><code>NeverTouchPrivate</code></td><td>Object ARNs under <code>private/</code></td><td>An explicit Deny is a guardrail: if someone later attaches <code>AmazonS3FullAccess</code> to this role, <code>private/</code> stays protected.</td></tr>
</tbody></table>
<p class="muted small">The Deny does not cover <em>listing</em> <code>private/</code>: listing is a bucket action. Listing <code>private/</code> is still refused, but by <em>implicit</em> deny, because no Allow matches that prefix. You will see the difference in the simulator.</p>` },

    { id: "s4", title: "Validate the policy with IAM Access Analyzer", html: `
<pre><code>aws accessanalyzer validate-policy \\
  --policy-type IDENTITY_POLICY \\
  --policy-document file://policy.json \\
  --query 'findings[].[findingType,issueCode]' --output table</code></pre>
<p><strong>Expected:</strong> no <code>ERROR</code> or <code>SECURITY_WARNING</code> rows (an empty result is ideal).</p>
<p>Now break it on purpose to see what validation catches. Change <code>"s3:prefix"</code> to <code>"s3:prefx"</code> in <code>policy.json</code> and run the command again: you get a finding about an unknown or unsupported condition key. Put it back afterwards:</p>
<pre><code>sed "s/BUCKET_NAME/$BUCKET/g" policy.template.json &gt; policy.json</code></pre>
<div class="callout tip"><strong>Habit to keep:</strong> run <code>validate-policy</code> on every policy before it reaches a pull request. In CI it turns "typo silently grants nothing" or "wildcard silently grants everything" into a failed build (see M05.09 and M38).</div>` },

    { id: "s5", title: "Predict, then simulate (custom policy)", html: `
<p><strong>Before running anything, write down your prediction</strong> for each row in the table below. Then run the simulator.</p>
<pre><code># Object actions on reports/
aws iam simulate-custom-policy \\
  --policy-input-list file://policy.json \\
  --action-names s3:GetObject s3:PutObject s3:DeleteObject \\
  --resource-arns "arn:aws:s3:::$BUCKET/reports/q1.csv" \\
  --query 'EvaluationResults[].[EvalActionName,EvalDecision]' --output table

# Object actions on private/
aws iam simulate-custom-policy \\
  --policy-input-list file://policy.json \\
  --action-names s3:GetObject s3:PutObject \\
  --resource-arns "arn:aws:s3:::$BUCKET/private/salaries.csv" \\
  --query 'EvaluationResults[].[EvalActionName,EvalDecision]' --output table

# Listing: the s3:prefix condition key must be supplied as context
for P in "reports/" "" "private/"; do
  echo "prefix='$P'"
  aws iam simulate-custom-policy \\
    --policy-input-list file://policy.json \\
    --action-names s3:ListBucket \\
    --resource-arns "arn:aws:s3:::$BUCKET" \\
    --context-entries "ContextKeyName=s3:prefix,ContextKeyValues=$P,ContextKeyType=string" \\
    --query 'EvaluationResults[0].EvalDecision' --output text
done</code></pre>
<p><strong>Expected results:</strong></p>
<table>
<thead><tr><th>Action</th><th>Resource / context</th><th>EvalDecision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>s3:GetObject</td><td>reports/q1.csv</td><td><code>allowed</code></td><td>Matches <code>ReadWriteReportObjects</code></td></tr>
<tr><td>s3:PutObject</td><td>reports/q1.csv</td><td><code>allowed</code></td><td>Same statement</td></tr>
<tr><td>s3:DeleteObject</td><td>reports/q1.csv</td><td><code>implicitDeny</code></td><td>Nothing allows Delete</td></tr>
<tr><td>s3:GetObject</td><td>private/salaries.csv</td><td><code>explicitDeny</code></td><td><code>NeverTouchPrivate</code> matches</td></tr>
<tr><td>s3:PutObject</td><td>private/salaries.csv</td><td><code>explicitDeny</code></td><td>Same</td></tr>
<tr><td>s3:ListBucket</td><td>prefix <code>reports/</code></td><td><code>allowed</code></td><td>Condition matches</td></tr>
<tr><td>s3:ListBucket</td><td>prefix empty (bucket root)</td><td><code>implicitDeny</code></td><td>"" doesn't match <code>reports/*</code></td></tr>
<tr><td>s3:ListBucket</td><td>prefix <code>private/</code></td><td><code>implicitDeny</code></td><td>No Allow matches; the Deny only covers objects</td></tr>
</tbody></table>
<p>Also try the console version: <strong>IAM → Policies → Policy simulator</strong> (or <code>https://policysim.aws.amazon.com</code>). Paste <code>policy.json</code> as a new policy, choose <strong>S3</strong>, pick actions, expand <em>Simulation settings</em> to set the resource ARN and the <code>s3:prefix</code> key, and run. The console shows which statement matched, which is useful when a decision surprises you.</p>` },

    { id: "s6", title: "Create the managed policy and the role", html: `
<pre><code># 1. Customer managed policy
POLICY_ARN=$(aws iam create-policy --policy-name L05aReportsAccess \\
  --policy-document file://policy.json --query Policy.Arn --output text)
echo "$POLICY_ARN"

# 2. Trust policy: only the IAM Identity Center admin role of THIS account may assume it
cat &gt; trust.json &lt;&lt;EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::$ACCOUNT:root" },
    "Action": "sts:AssumeRole",
    "Condition": {
      "ArnLike": {
        "aws:PrincipalArn": "arn:aws:iam::$ACCOUNT:role/aws-reserved/sso.amazonaws.com/*AWSReservedSSO_AdministratorAccess_*"
      }
    }
  }]
}
EOF
python3 -m json.tool trust.json &gt; /dev/null &amp;&amp; echo "valid trust JSON"

# 3. Role + attachment
aws iam create-role --role-name L05aReportsRole \\
  --assume-role-policy-document file://trust.json --max-session-duration 3600 \\
  --query Role.Arn --output text
aws iam attach-role-policy --role-name L05aReportsRole --policy-arn "$POLICY_ARN"</code></pre>
<p>Two things to notice:</p>
<ul>
<li><strong><code>"AWS": "arn:aws:iam::ACCOUNT:root"</code> does not mean the root user.</strong> It means "the account": any principal in it whose own identity policy allows <code>sts:AssumeRole</code> on this role. The <code>aws:PrincipalArn</code> condition then narrows it to your SSO admin role. Your admin session already has <code>sts:AssumeRole</code> through <code>AdministratorAccess</code>, so both sides of the handshake allow it (M05.05).</li>
<li>The heredoc this time is <code>&lt;&lt;EOF</code> without quotes, so the shell substitutes <code>$ACCOUNT</code>. In step 3 it was <code>&lt;&lt;'EOF'</code> (quoted), which keeps text literal.</li>
</ul>` },

    { id: "s7", title: "Simulate the real principal", html: `
<p><code>simulate-custom-policy</code> tests a policy document. <code>simulate-principal-policy</code> tests <strong>everything attached to a real user or role</strong>, including any policies you forgot about:</p>
<pre><code>ROLE_ARN=arn:aws:iam::$ACCOUNT:role/L05aReportsRole
aws iam simulate-principal-policy --policy-source-arn "$ROLE_ARN" \\
  --action-names s3:GetObject s3:DeleteObject \\
  --resource-arns "arn:aws:s3:::$BUCKET/reports/q1.csv" "arn:aws:s3:::$BUCKET/private/salaries.csv" \\
  --query 'EvaluationResults[].[EvalActionName,EvalResourceName,EvalDecision]' --output table</code></pre>
<p><strong>Expected:</strong> GetObject on reports = <code>allowed</code>; GetObject on private = <code>explicitDeny</code>; DeleteObject on reports = <code>implicitDeny</code>; DeleteObject on private = <code>explicitDeny</code>.</p>
<div class="callout warn"><strong>Simulator limits.</strong> The simulator evaluates identity-based policies, permissions boundaries and (optionally) a resource policy you supply. It does not know about every live condition (for example the real source IP of a request), and SCPs are reflected only in some cases. It is a design-time tool: always confirm with a real call.</div>` },

    { id: "s8", title: "Assume the role and make real calls", html: `
<p>Add a profile that chains from your SSO profile:</p>
<pre><code>aws configure set profile.l05a.role_arn "$ROLE_ARN"
aws configure set profile.l05a.source_profile academy-admin
aws configure set profile.l05a.region "$REGION"

aws sts get-caller-identity --profile l05a
#   "Arn": "arn:aws:sts::111122223333:assumed-role/L05aReportsRole/botocore-session-1728..."</code></pre>
<p>Now run each command and compare with the expected result:</p>
<pre><code>aws s3 ls "s3://$BUCKET/reports/" --profile l05a            # ✔ lists q1.csv
aws s3 cp "s3://$BUCKET/reports/q1.csv" - --profile l05a     # ✔ prints q1,1200
echo "q2,1500" | aws s3 cp - "s3://$BUCKET/reports/q2.csv" --profile l05a   # ✔ upload

aws s3 ls "s3://$BUCKET/" --profile l05a                     # ✘ AccessDenied (ListObjectsV2)
aws s3 cp "s3://$BUCKET/private/salaries.csv" - --profile l05a   # ✘ AccessDenied (explicit deny)
aws s3 rm "s3://$BUCKET/reports/q2.csv" --profile l05a       # ✘ AccessDenied (no Allow)
echo $?                                                       # 1 for a failed high-level s3 command</code></pre>
<p>Read the error messages carefully. For many services, including S3, the message now says <em>why</em>, for example:</p>
<pre><code>An error occurred (AccessDenied) when calling the GetObject operation: User:
arn:aws:sts::111122223333:assumed-role/L05aReportsRole/botocore-session-1728... is not authorized
to perform: s3:GetObject on resource: "arn:aws:s3:::academy-l05a-111122223333/private/salaries.csv"
with an explicit deny in an identity-based policy</code></pre>
<p>versus, for the delete, <em>"because no identity-based policy allows the s3:DeleteObject action"</em>. "Explicit deny" means a Deny statement matched: look for it. "No policy allows" means you are missing an Allow. The exact wording varies by service; the distinction is what matters.</p>` },

    { id: "s9", title: "Change the policy safely with a new version", html: `
<p>The business now wants the job to delete old reports. Managed policies are <strong>versioned</strong> (up to 5 versions; one is the default), so you can change and roll back without detaching anything.</p>
<pre><code>python3 - "$BUCKET" &lt;&lt;'PY'
import json, sys
p = json.load(open("policy.json"))
for s in p["Statement"]:
    if s["Sid"] == "ReadWriteReportObjects":
        s["Action"] = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
json.dump(p, open("policy-v2.json", "w"), indent=2)
PY
aws accessanalyzer validate-policy --policy-type IDENTITY_POLICY \\
  --policy-document file://policy-v2.json --query 'length(findings)'
aws iam create-policy-version --policy-arn "$POLICY_ARN" \\
  --policy-document file://policy-v2.json --set-as-default
aws iam list-policy-versions --policy-arn "$POLICY_ARN" \\
  --query 'Versions[].[VersionId,IsDefaultVersion]' --output table

sleep 10   # IAM changes are eventually consistent; give them a few seconds
aws s3 rm "s3://$BUCKET/reports/q2.csv" --profile l05a      # ✔ now allowed
aws s3 rm "s3://$BUCKET/private/salaries.csv" --profile l05a   # ✘ still explicit deny</code></pre>
<p>Rollback is one call: <code>aws iam set-default-policy-version --policy-arn "$POLICY_ARN" --version-id v1</code>.</p>
<div class="callout"><strong>Why the role's session still works.</strong> Permissions are evaluated on every request against the <em>current</em> policies, so a policy change applies to existing sessions within seconds. Revoking a <em>session</em> itself is different: you add a Deny with an <code>aws:TokenIssueTime</code> condition (the console's "Revoke active sessions" does this for you).</div>` },

    { id: "s10", title: "Run the validation checks", html: `<p>Run every command in <strong>Validate your work</strong> below and compare with the expected results, then complete the auto-graded worksheet.</p>` }
  ],
  drillsTitle: "Policy Simulator worksheet (auto-graded)",
  drills: [
    { id: "L05a-d01", q: "Using <strong>policy v1</strong> (step 3): what is the <code>EvalDecision</code> for <code>s3:GetObject</code> on <code>reports/q1.csv</code>?", answers: ["allowed"], explain: "The <code>ReadWriteReportObjects</code> statement allows it, and no Deny matches." },
    { id: "L05a-d02", q: "Policy v1: decision for <code>s3:DeleteObject</code> on <code>reports/q1.csv</code>? (allowed / implicitDeny / explicitDeny)", answers: ["implicitDeny", "implicit deny"], explain: "No statement allows Delete and none denies it, so the default implicit deny applies." },
    { id: "L05a-d03", q: "Policy v1: decision for <code>s3:GetObject</code> on <code>private/salaries.csv</code>?", answers: ["explicitDeny", "explicit deny"], explain: "<code>NeverTouchPrivate</code> denies <code>s3:*</code> on <code>private/*</code>." },
    { id: "L05a-d04", q: "Policy v1: decision for <code>s3:ListBucket</code> on the bucket with <code>s3:prefix</code> = <code>reports/</code>?", answers: ["allowed"], explain: "<code>StringLike</code> matches <code>reports/</code> exactly." },
    { id: "L05a-d05", q: "Policy v1: decision for <code>s3:ListBucket</code> with an <strong>empty</strong> prefix (listing the bucket root)?", answers: ["implicitDeny", "implicit deny"], explain: "The empty string matches neither <code>reports/</code> nor <code>reports/*</code>." },
    { id: "L05a-d06", q: "Policy v1: decision for <code>s3:ListBucket</code> with prefix <code>private/</code>? (careful)", answers: ["implicitDeny", "implicit deny"], hint: "Which resource does the Deny statement name, and is ListBucket an object action?", explain: "The Deny names object ARNs (<code>private/*</code>); ListBucket acts on the <em>bucket</em> ARN, so the Deny doesn't match. No Allow matches either, so it's an implicit deny." },
    { id: "L05a-d07", q: "Someone also attaches <code>AmazonS3FullAccess</code> to the role. What is the decision for <code>s3:GetObject</code> on <code>private/salaries.csv</code> now?", answers: ["explicitDeny", "explicit deny"], explain: "An explicit Deny beats any Allow, from any policy. That's exactly why the guardrail statement exists." },
    { id: "L05a-d08", q: "With <code>AmazonS3FullAccess</code> also attached, what is the decision for <code>s3:DeleteObject</code> on <code>reports/q1.csv</code>?", answers: ["allowed"], explain: "The extra policy adds an Allow for every S3 action, and no Deny covers <code>reports/</code>. Least privilege is lost; only the guardrail survives." },
    { id: "L05a-d09", q: "To make a bucket ARN cover the objects inside it, what do you append? (the characters only)", answers: ["/*"], explain: "<code>arn:aws:s3:::bucket</code> is the bucket; <code>arn:aws:s3:::bucket/*</code> is every object in it." },
    { id: "L05a-d10", q: "What is the maximum number of versions a customer managed policy can keep?", answers: ["5", "five"], explain: "Five versions; delete an old one before creating a sixth. One version is the default (the one in effect)." },
    { id: "L05a-d11", q: "Which condition key restricts <code>s3:ListBucket</code> to a \"folder\"?", answers: ["s3:prefix"], explain: "<code>s3:prefix</code> is the <code>prefix</code> parameter of the list request." },
    { id: "L05a-d12", q: "Which AWS CLI command checks a policy for grammar errors and security warnings? (full command, e.g. aws service operation)", answers: ["aws accessanalyzer validate-policy", "accessanalyzer validate-policy"], explain: "IAM Access Analyzer policy validation. It is free and also runs in the console's policy editor." }
  ],
  validate: `
<pre><code># 1. The policy exists, v2 is the default, and it validates cleanly
aws iam get-policy --policy-arn "$POLICY_ARN" --query 'Policy.DefaultVersionId' --output text
#   expect v2
aws accessanalyzer validate-policy --policy-type IDENTITY_POLICY \\
  --policy-document file://policy-v2.json \\
  --query "length(findings[?findingType=='ERROR' || findingType=='SECURITY_WARNING'])"
#   expect 0

# 2. The role has exactly one attached policy
aws iam list-attached-role-policies --role-name L05aReportsRole \\
  --query 'AttachedPolicies[].PolicyName' --output text
#   expect L05aReportsAccess

# 3. The guardrail holds and least privilege is real
aws iam simulate-principal-policy --policy-source-arn "$ROLE_ARN" \\
  --action-names s3:GetObject s3:DeleteObject \\
  --resource-arns "arn:aws:s3:::$BUCKET/private/salaries.csv" \\
  --query 'EvaluationResults[].EvalDecision' --output text
#   expect explicitDeny   explicitDeny

# 4. A real call proves it
aws s3 cp "s3://$BUCKET/private/salaries.csv" - --profile l05a; echo "exit=$?"
#   expect AccessDenied ... explicit deny ... and exit=1</code></pre>
<p>All four pass? Run the clean-up, tick the last step and mark the lab complete.</p>`,
  cleanup: `
<pre><code>export AWS_PROFILE=academy-admin
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET=academy-l05a-$ACCOUNT
POLICY_ARN=arn:aws:iam::$ACCOUNT:policy/L05aReportsAccess

# Role: detach, then delete
aws iam detach-role-policy --role-name L05aReportsRole --policy-arn "$POLICY_ARN"
aws iam delete-role --role-name L05aReportsRole

# Policy: non-default versions must be deleted before the policy itself
for V in $(aws iam list-policy-versions --policy-arn "$POLICY_ARN" \\
            --query 'Versions[?IsDefaultVersion==\`false\`].VersionId' --output text); do
  aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$V"
done
aws iam delete-policy --policy-arn "$POLICY_ARN"

# Bucket and local files
aws s3 rb "s3://$BUCKET" --force
aws configure set profile.l05a.role_arn ""   # or delete the [profile l05a] block in ~/.aws/config
rm -rf ~/l05a</code></pre>
<p class="muted small">Nothing in this lab has an hourly cost. Deleting the role and policy matters anyway: unused identities are exactly what M05.09's least-privilege reviews hunt for.</p>`
});
// ================================================================== 81_lab_b.js
/* ================================================================== LAB L05b */
var DG_L05B_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="l05bt l05bd">
  <title id="l05bt">Cross-account access with an External ID</title>
  <desc id="l05bd">A vendor role calls sts:AssumeRole on customer A's audit role, passing customer A's unique External ID, and receives temporary credentials. If the vendor is tricked into using customer B's role ARN while acting for customer A, it passes customer A's External ID, B's trust policy condition does not match, and the call is denied.</desc>
  <defs><marker id="l05b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="10" y="24" width="250" height="250" rx="12"/>
  <text class="dg-ta" x="22" y="46">"Vendor account"</text>
  <text class="dg-ts" x="22" y="62">(in this lab: your account)</text>
  <rect class="dg-info" x="26" y="90" width="218" height="96" rx="8"/>
  <text class="dg-tb" x="38" y="114">L05bVendorRole</text>
  <text class="dg-ts" x="38" y="134">may call sts:AssumeRole on</text>
  <text class="dg-ts" x="38" y="150">L05bCustomer*AuditRole</text>
  <text class="dg-ts" x="38" y="170">stores one External ID per customer</text>
  <text class="dg-ts" x="26" y="214">The vendor generates each External ID</text>
  <text class="dg-ts" x="26" y="230">and always passes the one that belongs</text>
  <text class="dg-ts" x="26" y="246">to the customer it is working for.</text>
  <rect class="dg-region" x="400" y="24" width="350" height="250" rx="12"/>
  <text class="dg-ta" x="412" y="46">"Customer accounts"</text>
  <rect class="dg-good" x="420" y="66" width="310" height="80" rx="8"/>
  <text class="dg-tb" x="432" y="90">A: L05bCustomerAAuditRole</text>
  <text class="dg-ts" x="432" y="110">trust: vendor role, if sts:ExternalId =</text>
  <text class="dg-ts" x="432" y="126">"cust-a-7f3a9c" · permissions: SecurityAudit</text>
  <rect class="dg-bad" x="420" y="172" width="310" height="80" rx="8"/>
  <text class="dg-tb" x="432" y="196">B: L05bCustomerBAuditRole</text>
  <text class="dg-ts" x="432" y="216">trust: vendor role, if sts:ExternalId =</text>
  <text class="dg-ts" x="432" y="232">"cust-b-91d2e4"</text>
  <path class="dg-line" d="M244 116 H418" marker-end="url(#l05b-ar)"/>
  <text class="dg-ts" x="264" y="106">AssumeRole + ID a</text>
  <text class="dg-ts" x="300" y="132">✔ credentials</text>
  <path class="dg-line" d="M244 162 L418 206" stroke-dasharray="5 4" marker-end="url(#l05b-ar)"/>
  <text class="dg-ts" x="262" y="214">B's ARN + ID a</text>
  <text class="dg-ts" x="262" y="230">✘ AccessDenied</text>
</svg>
<figcaption>Figure L05b-1. The External ID ties each trust relationship to one customer, so a vendor can't be tricked into using its access to customer B on customer A's behalf (the confused-deputy problem).</figcaption>
</figure>`;

LABS.push({
  id: "L05b", title: "Cross-account role with External ID", level: 300, duration: "60–90 min",
  cost: "$0 (IAM, STS and CloudTrail event history are free)",
  objective: `
<p>Build the access pattern every SaaS security, monitoring or cost tool uses: a <strong>third party</strong> reaches into a customer's account by assuming a role, and an <strong>External ID</strong> prevents the <strong>confused-deputy</strong> problem.</p>
<p>You will play both sides:</p>
<ul>
<li><strong>The vendor:</strong> a role (<code>L05bVendorRole</code>) that is only allowed to assume customer audit roles.</li>
<li><strong>Two customers, A and B:</strong> each owns an audit role with read-only <code>SecurityAudit</code> permissions and a trust policy that requires its own External ID.</li>
</ul>
<p>Then you prove four things with real calls: no External ID → denied; the right one → temporary credentials; the wrong customer's role → denied; and the session is short, read-only and visible in CloudTrail.</p>
<p><strong>One account is enough.</strong> Real vendors and customers live in different accounts. Here the "accounts" are simulated by separate roles in your single learning account. The trust policies, the STS calls and the failure modes are identical; step 8 shows exactly what changes with two real accounts.</p>`,
  warning: `⚠️ Use your learning account and the <code>academy-admin</code> profile. Every resource is named <code>L05b…</code>. The customer roles get the AWS managed <code>SecurityAudit</code> policy, which is read-only, so nothing you do with them can change the account.`,
  diagram: DG_L05B_FLOW,
  steps: [
    { id: "s1", title: "Set up variables and the External IDs", html: `
<pre><code>aws sso login --profile academy-admin
export AWS_PROFILE=academy-admin
export ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export REGION=$(aws configure get region)
mkdir -p ~/l05b &amp;&amp; cd ~/l05b

# The VENDOR generates one unguessable External ID per customer and stores it with that customer's record
export EXT_A=cust-a-$(python3 -c 'import secrets; print(secrets.token_hex(3))')
export EXT_B=cust-b-$(python3 -c 'import secrets; print(secrets.token_hex(3))')
echo "$EXT_A $EXT_B" | tee ext-ids.txt</code></pre>
<p><strong>Expected:</strong> two values such as <code>cust-a-7f3a9c cust-b-91d2e4</code>.</p>
<div class="callout"><strong>Who creates the External ID matters.</strong> It must be <em>generated by the vendor</em> and be unique per customer. If customers could choose it, an attacker could simply choose the same value as their victim. It is not a password (it appears in the customer's trust policy and in logs); its job is to bind a trust relationship to one customer.</div>` },

    { id: "s2", title: "Create the vendor role", html: `
<p>The vendor role is assumable by your SSO admin role (standing in for the vendor's own platform) and may do exactly one thing: assume customer audit roles.</p>
<pre><code>cat &gt; vendor-trust.json &lt;&lt;EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::$ACCOUNT:root" },
    "Action": "sts:AssumeRole",
    "Condition": { "ArnLike": {
      "aws:PrincipalArn": "arn:aws:iam::$ACCOUNT:role/aws-reserved/sso.amazonaws.com/*AWSReservedSSO_AdministratorAccess_*" } }
  }]
}
EOF
cat &gt; vendor-perms.json &lt;&lt;EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AssumeCustomerAuditRolesOnly",
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::*:role/L05bCustomer*AuditRole"
  }]
}
EOF
aws iam create-role --role-name L05bVendorRole \\
  --assume-role-policy-document file://vendor-trust.json --query Role.Arn --output text
aws iam put-role-policy --role-name L05bVendorRole \\
  --policy-name AssumeCustomerAuditRoles --policy-document file://vendor-perms.json

aws configure set profile.l05b-vendor.role_arn "arn:aws:iam::$ACCOUNT:role/L05bVendorRole"
aws configure set profile.l05b-vendor.source_profile academy-admin
aws configure set profile.l05b-vendor.region "$REGION"
sleep 10
aws sts get-caller-identity --profile l05b-vendor --query Arn --output text</code></pre>
<p><strong>Expected:</strong> <code>arn:aws:sts::111122223333:assumed-role/L05bVendorRole/botocore-session-…</code></p>
<p class="muted small">The account wildcard (<code>arn:aws:iam::*:role/…</code>) is how a real vendor writes this: it must reach roles in thousands of customer accounts. The role-name pattern still keeps it from assuming anything else.</p>` },

    { id: "s3", title: "Create the two customer audit roles", html: `
<pre><code>VENDOR_ROLE_ARN=arn:aws:iam::$ACCOUNT:role/L05bVendorRole

for C in A B; do
  if [ "$C" = "A" ]; then EXT=$EXT_A; else EXT=$EXT_B; fi
  cat &gt; customer-$C-trust.json &lt;&lt;EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "TrustTheVendorOnlyWithMyExternalId",
    "Effect": "Allow",
    "Principal": { "AWS": "$VENDOR_ROLE_ARN" },
    "Action": "sts:AssumeRole",
    "Condition": { "StringEquals": { "sts:ExternalId": "$EXT" } }
  }]
}
EOF
  aws iam create-role --role-name L05bCustomer\${C}AuditRole \\
    --assume-role-policy-document file://customer-$C-trust.json \\
    --max-session-duration 3600 --query Role.Arn --output text
  aws iam attach-role-policy --role-name L05bCustomer\${C}AuditRole \\
    --policy-arn arn:aws:iam::aws:policy/SecurityAudit
done</code></pre>
<p><strong>Expected:</strong> two role ARNs, <code>…:role/L05bCustomerAAuditRole</code> and <code>…:role/L05bCustomerBAuditRole</code>.</p>
<p>In a real onboarding flow, the vendor's sign-up page shows the customer its <em>vendor account ID</em> and <em>External ID</em>, often as a one-click CloudFormation template that creates exactly this role. The customer then pastes the new role ARN back into the vendor's console.</p>
<div class="callout tip"><strong>Principal choice.</strong> Naming the vendor's <em>specific role ARN</em> is tighter than <code>arn:aws:iam::VENDOR_ACCOUNT:root</code>. With <code>:root</code>, any principal in the vendor account that the vendor's admins allow could assume it. Many vendors document <code>:root</code> plus the External ID; both work, the specific role is better.</div>` },

    { id: "s4", title: "Try without the External ID (expect a denial)", html: `
<pre><code>ROLE_A=arn:aws:iam::$ACCOUNT:role/L05bCustomerAAuditRole
aws sts assume-role --role-arn "$ROLE_A" --role-session-name audit-a \\
  --profile l05b-vendor; echo "exit=$?"</code></pre>
<p><strong>Expected:</strong></p>
<pre><code>An error occurred (AccessDenied) when calling the AssumeRole operation: User:
arn:aws:sts::111122223333:assumed-role/L05bVendorRole/botocore-session-... is not authorized
to perform: sts:AssumeRole on resource: arn:aws:iam::111122223333:role/L05bCustomerAAuditRole
exit=254</code></pre>
<p>Both sides of the handshake must allow the call. The vendor's identity policy does (step 2). The customer's <strong>trust policy</strong> does not, because its condition requires a matching <code>sts:ExternalId</code> and none was sent. Exit code 254 means "the service returned an error" (M03.02).</p>` },

    { id: "s5", title: "Assume the role with the correct External ID", html: `
<pre><code>aws sts assume-role --role-arn "$ROLE_A" --role-session-name audit-a \\
  --external-id "$EXT_A" --duration-seconds 900 --profile l05b-vendor \\
  --query 'Credentials.[AccessKeyId,Expiration]' --output text</code></pre>
<p><strong>Expected:</strong> an access key ID starting with <code>ASIA</code> (temporary credentials always do; long-term IAM user keys start with <code>AKIA</code>) and an expiry 15 minutes from now.</p>
<p>Rather than copying keys around, let the CLI do it with a profile. The CLI passes <code>external_id</code> for you:</p>
<pre><code>aws configure set profile.l05b-cust-a.role_arn "$ROLE_A"
aws configure set profile.l05b-cust-a.source_profile l05b-vendor
aws configure set profile.l05b-cust-a.external_id "$EXT_A"
aws configure set profile.l05b-cust-a.role_session_name vendor-audit-a
aws configure set profile.l05b-cust-a.region "$REGION"

aws sts get-caller-identity --profile l05b-cust-a --query Arn --output text
#   arn:aws:sts::111122223333:assumed-role/L05bCustomerAAuditRole/vendor-audit-a

aws iam get-account-summary --profile l05b-cust-a --query 'SummaryMap.Roles'   # ✔ read works
aws s3 ls --profile l05b-cust-a | head -3                                     # ✔ read works
aws s3 mb "s3://l05b-should-fail-$ACCOUNT" --profile l05b-cust-a              # ✘ AccessDenied: read-only</code></pre>
<p>This is a <strong>role chain</strong>: SSO admin → vendor role → customer role. Try a longer session:</p>
<pre><code>aws sts assume-role --role-arn "$ROLE_A" --role-session-name long \\
  --external-id "$EXT_A" --duration-seconds 7200 --profile l05b-vendor</code></pre>
<p><strong>Expected:</strong> a <code>ValidationError</code> saying the requested duration exceeds the <strong>1-hour limit for role chaining</strong>, even though the role's <code>MaxSessionDuration</code> allows up to 12 hours. Vendors whose platform itself runs on an assumed role live with this limit and refresh sessions every hour.</p>` },

    { id: "s6", title: "Run the confused-deputy test", html: `
<p>The attack: customer B (malicious) tells the vendor "my role ARN is <code>…L05bCustomerAAuditRole</code>". The vendor's software, working for customer B, assumes that ARN. Without External IDs it would succeed, and B could read A's account through the vendor's reports. With External IDs, the vendor always sends <em>B's</em> External ID when working for B:</p>
<pre><code># Vendor acting for customer B, but given customer A's role ARN
aws sts assume-role --role-arn "$ROLE_A" --role-session-name working-for-b \\
  --external-id "$EXT_B" --profile l05b-vendor; echo "exit=$?"
#   ✘ AccessDenied, exit=254: A's trust policy expects EXT_A

# And the legitimate request for customer B still works
ROLE_B=arn:aws:iam::$ACCOUNT:role/L05bCustomerBAuditRole
aws sts assume-role --role-arn "$ROLE_B" --role-session-name audit-b \\
  --external-id "$EXT_B" --profile l05b-vendor --query 'AssumedRoleUser.Arn' --output text
#   ✔ arn:aws:sts::111122223333:assumed-role/L05bCustomerBAuditRole/audit-b</code></pre>
<div class="callout"><strong>The same idea for AWS services.</strong> When an AWS <em>service</em> acts for you (SNS publishing to your SQS queue, S3 invoking your Lambda function, CloudTrail writing to your bucket), there is no External ID. You protect yourself with <code>aws:SourceArn</code> and <code>aws:SourceAccount</code> conditions in the resource or trust policy, so the service can only act for <em>your</em> resource (M05.06).</div>` },

    { id: "s7", title: "Optional: carry a source identity, then audit in CloudTrail", html: `
<p><strong>Source identity</strong> records <em>who</em> is behind a session, and it persists across role chaining. Allow it in customer A's trust policy and require it:</p>
<pre><code>python3 - "$EXT_A" "$VENDOR_ROLE_ARN" &lt;&lt;'PY'
import json, sys
ext, vendor = sys.argv[1], sys.argv[2]
doc = {"Version": "2012-10-17", "Statement": [{
  "Sid": "TrustTheVendorWithExternalIdAndSourceIdentity",
  "Effect": "Allow",
  "Principal": {"AWS": vendor},
  "Action": ["sts:AssumeRole", "sts:SetSourceIdentity"],
  "Condition": {"StringEquals": {"sts:ExternalId": ext},
                "StringLike": {"sts:SourceIdentity": "*@vendor.example"}}}]}
json.dump(doc, open("customer-A-trust-v2.json", "w"), indent=2)
PY
aws iam update-assume-role-policy --role-name L05bCustomerAAuditRole \\
  --policy-document file://customer-A-trust-v2.json
sleep 10
aws sts assume-role --role-arn "$ROLE_A" --role-session-name audit-a \\
  --external-id "$EXT_A" --source-identity analyst@vendor.example \\
  --profile l05b-vendor --query 'SourceIdentity' --output text
#   analyst@vendor.example</code></pre>
<p>Now look at the evidence. CloudTrail event history takes a few minutes (typically up to about 15) to show new events:</p>
<pre><code>aws cloudtrail lookup-events --region "$REGION" --max-results 10 \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRole \\
  --query 'Events[].CloudTrailEvent' --output text \\
| python3 -c '
import sys, json
for line in sys.stdin:
    for raw in line.split("\\t"):
        e = json.loads(raw)
        p = e.get("requestParameters") or {}
        print(e["eventTime"], e.get("errorCode", "OK"), p.get("roleSessionName"), p.get("sourceIdentity"))'</code></pre>
<p><strong>Expected:</strong> your successful sessions (<code>OK</code>, <code>audit-a</code>, <code>audit-b</code>) and the failed attempts (<code>AccessDenied</code>). STS is a Regional service by default, so look in the Region where the calls were made. Inspect one event's full JSON too: the <code>requestParameters</code> show the role ARN, the session name and, in the events we have seen, the External ID. That's another reason it's not a secret.</p>` },

    { id: "s8", title: "Understand the two-account version", html: `
<p>Everything above works the same across accounts. With a vendor account <code>444455556666</code> and a customer account <code>111122223333</code>:</p>
<table>
<thead><tr><th>Piece</th><th>Lives in</th><th>Looks like</th></tr></thead>
<tbody>
<tr><td>Vendor role and its identity policy</td><td>Vendor account</td><td><code>Allow sts:AssumeRole</code> on <code>arn:aws:iam::*:role/VendorAuditRole</code></td></tr>
<tr><td>Customer role trust policy</td><td>Customer account</td><td><code>Principal: arn:aws:iam::444455556666:role/VendorPlatform</code> + <code>sts:ExternalId</code> condition</td></tr>
<tr><td>Customer role permissions</td><td>Customer account</td><td>Read-only, scoped to what the product needs</td></tr>
<tr><td>CloudTrail <code>AssumeRole</code> events</td><td>Both accounts</td><td>The customer sees who assumed its role; the vendor sees its own outbound calls</td></tr>
</tbody></table>
<p>Cross-account, <strong>both</strong> policies are required: the vendor's identity policy must allow <code>sts:AssumeRole</code> on the customer role, <em>and</em> the customer's trust policy must allow the vendor. Within one account, a trust policy that names a specific role ARN would be enough on its own. Here the vendor role also needed its identity policy, so the lab behaves like the real cross-account case.</p>
<p><strong>Optional, with AWS Organizations:</strong> create a real member account (free) with <code>aws organizations create-account --email you+l05b@example.com --account-name l05b-customer</code>, reach it through the automatically created <code>OrganizationAccountAccessRole</code>, and repeat steps 3–6 there. Closing an account later takes a few clicks but has a waiting period before it disappears, so only do this if you're happy to keep or close a second account.</p>` },

    { id: "s9", title: "Run the validation checks", html: `<p>Run every command in <strong>Validate your work</strong> below, then complete the worksheet.</p>` }
  ],
  drillsTitle: "Cross-account and External ID worksheet (auto-graded)",
  drills: [
    { id: "L05b-d01", q: "The vendor calls <code>sts:AssumeRole</code> on customer A's role <strong>without</strong> <code>--external-id</code>. Is the call allowed or denied?", answers: ["denied", "deny", "accessdenied"], explain: "The trust policy's <code>StringEquals sts:ExternalId</code> condition can't match a missing value, so the trust policy doesn't allow the call." },
    { id: "L05b-d02", q: "Which condition key carries the External ID in a trust policy?", answers: ["sts:ExternalId"], explain: "<code>sts:ExternalId</code>, sent by the caller with <code>--external-id</code> (CLI) or <code>ExternalId</code> (API)." },
    { id: "L05b-d03", q: "Working for customer B, the vendor uses customer A's role ARN with B's External ID. Allowed or denied?", answers: ["denied", "deny", "accessdenied"], explain: "That's the confused-deputy attack, and the External ID is what stops it: A's role only accepts A's ID." },
    { id: "L05b-d04", q: "Who should generate the External ID: the vendor or the customer?", answers: ["vendor", "the vendor", "third party", "the third party"], explain: "The vendor generates a unique value per customer. If customers chose it, a malicious customer could choose the victim's value." },
    { id: "L05b-d05", q: "The vendor's platform itself runs on an assumed role. What is the maximum session duration, in seconds, it can request for the customer role?", answers: ["3600"], explain: "Role chaining limits the session to 1 hour (3,600 s), whatever the role's MaxSessionDuration says." },
    { id: "L05b-d06", q: "If <code>--duration-seconds</code> is omitted, how many seconds does an AssumeRole session last?", answers: ["3600"], explain: "The default is 1 hour. You can request from 900 s up to the role's MaxSessionDuration (maximum 12 hours) when not chaining." },
    { id: "L05b-d07", q: "Which extra action must a trust policy allow so the caller can pass <code>--source-identity</code>?", answers: ["sts:SetSourceIdentity"], explain: "Without <code>sts:SetSourceIdentity</code> in the trust policy, AssumeRole with a source identity is denied." },
    { id: "L05b-d08", q: "Temporary credentials from STS have access key IDs that start with which four letters?", answers: ["ASIA"], explain: "<code>ASIA…</code> = temporary (always with a session token). <code>AKIA…</code> = long-term IAM user or root keys." },
    { id: "L05b-d09", q: "An AWS <em>service</em> (not a vendor) acts on your resource. Which global condition key, holding the source resource ARN, prevents the confused-deputy problem?", answers: ["aws:SourceArn"], explain: "<code>aws:SourceArn</code> (and/or <code>aws:SourceAccount</code>) ties the service's access to your specific resource or account." }
  ],
  validate: `
<pre><code># 1. The customer A trust policy requires an External ID
aws iam get-role --role-name L05bCustomerAAuditRole \\
  --query 'Role.AssumeRolePolicyDocument.Statement[0].Condition.StringEquals' --output json
#   expect {"sts:ExternalId": "cust-a-..."}

# 2. Without the ID: denied
aws sts assume-role --role-arn "arn:aws:iam::$ACCOUNT:role/L05bCustomerAAuditRole" \\
  --role-session-name check --profile l05b-vendor &gt; /dev/null 2&gt;&amp;1; echo "exit=$?"
#   expect exit=254

# 3. With the ID (profile): works and is read-only
aws sts get-caller-identity --profile l05b-cust-a --query Arn --output text
#   expect ...assumed-role/L05bCustomerAAuditRole/vendor-audit-a
aws iam create-user --user-name l05b-nope --profile l05b-cust-a &gt; /dev/null 2&gt;&amp;1; echo "exit=$?"
#   expect exit=254 (SecurityAudit can't write)

# 4. The confused-deputy attempt fails
aws sts assume-role --role-arn "arn:aws:iam::$ACCOUNT:role/L05bCustomerAAuditRole" \\
  --role-session-name check --external-id "$EXT_B" --profile l05b-vendor &gt; /dev/null 2&gt;&amp;1; echo "exit=$?"
#   expect exit=254</code></pre>
<p>All four pass? Clean up, tick the last step and mark the lab complete.</p>`,
  cleanup: `
<pre><code>export AWS_PROFILE=academy-admin
for C in A B; do
  aws iam detach-role-policy --role-name L05bCustomer\${C}AuditRole \\
    --policy-arn arn:aws:iam::aws:policy/SecurityAudit
  aws iam delete-role --role-name L05bCustomer\${C}AuditRole
done
aws iam delete-role-policy --role-name L05bVendorRole --policy-name AssumeCustomerAuditRoles
aws iam delete-role --role-name L05bVendorRole

# Remove the three lab profiles from ~/.aws/config (edit the file, or blank them):
#   [profile l05b-vendor]  [profile l05b-cust-a]
rm -rf ~/l05b

aws iam list-roles --query "Roles[?starts_with(RoleName, 'L05b')].RoleName"
#   expect []</code></pre>
<p class="muted small">If you created an Organizations member account in step 8, keep it for later modules (M06 uses multiple accounts) or close it from the Organizations console.</p>`
});
// ================================================================== 82_lab_c.js
/* ================================================================== LAB L05c */
var DG_L05C_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="l05ct l05cd">
  <title id="l05ct">Cognito user pool protecting an HTTP API route</title>
  <desc id="l05cd">The client signs in to a Cognito user pool and receives an ID token, an access token and a refresh token. It calls the HTTP API with the token in the Authorization header. The JWT authorizer validates the signature with the user pool's public keys, the issuer, the audience or client ID, expiry and scopes. Valid requests reach the Lambda function with the token claims; invalid ones get 401 or 403 without invoking Lambda.</desc>
  <defs><marker id="l05c-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="12" y="110" width="150" height="74" rx="8"/>
  <text class="dg-tb" x="24" y="134">Client</text>
  <text class="dg-ts" x="24" y="154">curl / web / mobile</text>
  <text class="dg-ts" x="24" y="170">user alice</text>
  <rect class="dg-edge" x="250" y="14" width="250" height="84" rx="8"/>
  <text class="dg-tb" x="262" y="38">Cognito user pool</text>
  <text class="dg-ts" x="262" y="58">initiate-auth (USER_PASSWORD_AUTH)</text>
  <text class="dg-ts" x="262" y="74">returns ID, access, refresh tokens</text>
  <text class="dg-ts" x="262" y="90">publishes signing keys (JWKS)</text>
  <path class="dg-line" d="M120 110 L248 66" marker-end="url(#l05c-ar)"/>
  <text class="dg-ts" x="96" y="74">1 sign in</text>
  <path class="dg-line" d="M248 86 L162 122" marker-end="url(#l05c-ar)"/>
  <text class="dg-ts" x="182" y="118">2 JWTs</text>
  <rect class="dg-info" x="250" y="176" width="250" height="100" rx="8"/>
  <text class="dg-tb" x="262" y="200">HTTP API · JWT authorizer</text>
  <text class="dg-ts" x="262" y="220">checks signature (JWKS), iss,</text>
  <text class="dg-ts" x="262" y="236">aud or client_id, exp, scopes</text>
  <text class="dg-ts" x="262" y="256">fails: 401 / 403, Lambda not called</text>
  <path class="dg-line" d="M162 166 L248 214" marker-end="url(#l05c-ar)"/>
  <text class="dg-ts" x="96" y="222">3 GET /hello</text>
  <text class="dg-ts" x="96" y="238">Authorization: token</text>
  <path class="dg-line" d="M375 174 V100" stroke-dasharray="4 3" marker-end="url(#l05c-ar)"/>
  <text class="dg-ts" x="382" y="140">fetch keys (cached)</text>
  <rect class="dg-good" x="580" y="186" width="168" height="80" rx="8"/>
  <text class="dg-tb" x="592" y="210">Lambda</text>
  <text class="dg-ts" x="592" y="230">l05c-claims</text>
  <text class="dg-ts" x="592" y="246">echoes the claims</text>
  <path class="dg-line" d="M500 226 H578" marker-end="url(#l05c-ar)"/>
  <text class="dg-ts" x="506" y="216">4 valid</text>
</svg>
<figcaption>Figure L05c-1. The user pool authenticates; the API's JWT authorizer authorises each request locally from the token, and your function only ever sees requests that passed.</figcaption>
</figure>`;

LABS.push({
  id: "L05c", title: "Cognito user pool protecting an API Gateway route", level: 300, duration: "90–120 min",
  cost: "≈ $0 (Cognito, HTTP API and Lambda requests in this lab fall within free tiers or cost fractions of a cent; delete everything at the end)",
  objective: `
<p>Protect an API with <strong>application identity</strong> instead of IAM: end users sign in to an <strong>Amazon Cognito user pool</strong>, get <strong>JSON Web Tokens (JWTs)</strong>, and an <strong>API Gateway HTTP API</strong> with a <strong>JWT authorizer</strong> lets only valid tokens through.</p>
<p>You will:</p>
<ul>
<li>create a user pool, an app client and a user from the CLI</li>
<li>build a small Lambda function and an HTTP API with a public and a protected route</li>
<li>see <code>401 Unauthorized</code> without a token, then sign in and see <code>200</code> with the token</li>
<li>decode the ID and access tokens and compare their claims</li>
<li>require an OAuth scope on the route and watch the ID token stop working</li>
<li>read the user's <code>cognito:groups</code> claim and discuss where authorisation decisions belong</li>
</ul>
<p>This is the hands-on side of M05.10. It also reuses the confused-deputy idea from M05.06: the Lambda permission you add is scoped with a source ARN.</p>`,
  warning: `⚠️ For a CLI-only lab, the app client enables <code>USER_PASSWORD_AUTH</code>, which sends the password to Cognito over TLS. Production web and mobile apps should use <strong>managed login</strong> (the hosted sign-in pages) with the authorization code flow and PKCE, or the SRP flow in the Amplify libraries, so passwords never pass through your code. All resources are named <code>l05c…</code>; delete them at the end.`,
  diagram: DG_L05C_FLOW,
  steps: [
    { id: "s1", title: "Set up variables", html: `
<pre><code>aws sso login --profile academy-admin
export AWS_PROFILE=academy-admin
export REGION=$(aws configure get region)
export ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
mkdir -p ~/l05c &amp;&amp; cd ~/l05c
echo "$REGION $ACCOUNT"</code></pre>
<p>Keep this shell open: later steps reuse the variables. If you lose them, each step shows how to look the IDs up again.</p>` },

    { id: "s2", title: "Create the user pool and app client", html: `
<pre><code>POOL_ID=$(aws cognito-idp create-user-pool --pool-name l05c-pool \\
  --policies 'PasswordPolicy={MinimumLength=12,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}' \\
  --username-configuration CaseSensitive=false \\
  --query UserPool.Id --output text)

CLIENT_ID=$(aws cognito-idp create-user-pool-client --user-pool-id "$POOL_ID" \\
  --client-name l05c-cli --no-generate-secret \\
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH \\
  --query UserPoolClient.ClientId --output text)

echo "POOL_ID=$POOL_ID CLIENT_ID=$CLIENT_ID" | tee ids.txt</code></pre>
<p><strong>Expected:</strong> a pool ID such as <code>eu-west-1_AbC123xyz</code> (always prefixed with its Region) and a 26-character client ID.</p>
<table>
<thead><tr><th>Setting</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>--no-generate-secret</code></td><td>Public clients (browsers, mobile apps, a CLI) can't keep a secret, so they must not have one. Confidential server-side clients get a secret.</td></tr>
<tr><td><code>ALLOW_USER_PASSWORD_AUTH</code></td><td>Lets the CLI send username and password directly. Lab only.</td></tr>
<tr><td><code>ALLOW_REFRESH_TOKEN_AUTH</code></td><td>Lets clients swap the long-lived refresh token for new short-lived tokens.</td></tr>
</tbody></table>` },

    { id: "s3", title: "Create a user and a group", html: `
<pre><code>aws cognito-idp admin-create-user --user-pool-id "$POOL_ID" --username alice \\
  --user-attributes Name=email,Value=alice@example.com Name=email_verified,Value=true \\
  --message-action SUPPRESS --query 'User.UserStatus' --output text
#   FORCE_CHANGE_PASSWORD

aws cognito-idp admin-set-user-password --user-pool-id "$POOL_ID" --username alice \\
  --password 'AcademyLab2026pass' --permanent

aws cognito-idp create-group --user-pool-id "$POOL_ID" --group-name reporting \\
  --description "Can read reports" --query Group.GroupName --output text
aws cognito-idp admin-add-user-to-group --user-pool-id "$POOL_ID" --username alice --group-name reporting

aws cognito-idp admin-get-user --user-pool-id "$POOL_ID" --username alice --query UserStatus --output text
#   CONFIRMED</code></pre>
<p><code>--message-action SUPPRESS</code> stops Cognito from emailing a temporary password to the made-up address. <code>admin-set-user-password --permanent</code> skips the "change your password at first sign-in" challenge, which is useful for a lab and for migrations, but real users should set their own.</p>` },

    { id: "s4", title: "Create the Lambda function", html: `
<pre><code>cat &gt; app.py &lt;&lt;'PY'
import json

def handler(event, context):
    # HTTP API payload format 2.0: validated JWT claims are here
    claims = (event.get("requestContext", {})
                   .get("authorizer", {})
                   .get("jwt", {})
                   .get("claims", {}))
    body = {
        "route": event.get("routeKey"),
        "authenticated": bool(claims),
        "sub": claims.get("sub"),
        "username": claims.get("username") or claims.get("cognito:username"),
        "token_use": claims.get("token_use"),
        "groups": claims.get("cognito:groups"),
        "scope": claims.get("scope"),
    }
    return {"statusCode": 200,
            "headers": {"content-type": "application/json"},
            "body": json.dumps(body)}
PY
python3 -m zipfile -c function.zip app.py

cat &gt; lambda-trust.json &lt;&lt;'EOF'
{ "Version": "2012-10-17",
  "Statement": [{ "Effect": "Allow",
    "Principal": { "Service": "lambda.amazonaws.com" },
    "Action": "sts:AssumeRole" }] }
EOF
FN_ROLE_ARN=$(aws iam create-role --role-name l05c-lambda-role \\
  --assume-role-policy-document file://lambda-trust.json --query Role.Arn --output text)
aws iam attach-role-policy --role-name l05c-lambda-role \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
sleep 10   # a new role takes a few seconds before Lambda can assume it

FN_ARN=$(aws lambda create-function --function-name l05c-claims \\
  --runtime python3.12 --handler app.handler --role "$FN_ROLE_ARN" \\
  --zip-file fileb://function.zip --query FunctionArn --output text)
echo "$FN_ARN"</code></pre>
<p class="muted small">If <code>create-function</code> fails with "The role defined for the function cannot be assumed by Lambda", wait another 10 seconds and run it again: IAM is eventually consistent. Python 3.12 is used here; any currently supported Python runtime works.</p>` },

    { id: "s5", title: "Create the HTTP API, JWT authorizer and routes", html: `
<pre><code>API_ID=$(aws apigatewayv2 create-api --name l05c-api --protocol-type HTTP \\
  --query ApiId --output text)

INTEG_ID=$(aws apigatewayv2 create-integration --api-id "$API_ID" \\
  --integration-type AWS_PROXY --integration-uri "$FN_ARN" \\
  --payload-format-version 2.0 --query IntegrationId --output text)

AUTH_ID=$(aws apigatewayv2 create-authorizer --api-id "$API_ID" --name cognito-jwt \\
  --authorizer-type JWT --identity-source '$request.header.Authorization' \\
  --jwt-configuration Audience=$CLIENT_ID,Issuer=https://cognito-idp.$REGION.amazonaws.com/$POOL_ID \\
  --query AuthorizerId --output text)

# Public route (no authorizer) and protected route (JWT)
aws apigatewayv2 create-route --api-id "$API_ID" --route-key 'GET /public' \\
  --target "integrations/$INTEG_ID" --query RouteId --output text
HELLO_ROUTE_ID=$(aws apigatewayv2 create-route --api-id "$API_ID" --route-key 'GET /hello' \\
  --target "integrations/$INTEG_ID" --authorization-type JWT --authorizer-id "$AUTH_ID" \\
  --query RouteId --output text)

aws apigatewayv2 create-stage --api-id "$API_ID" --stage-name '$default' --auto-deploy

# Let API Gateway invoke the function, but only from THIS API (confused-deputy protection)
aws lambda add-permission --function-name l05c-claims --statement-id apigw-l05c \\
  --action lambda:InvokeFunction --principal apigateway.amazonaws.com \\
  --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT:$API_ID/*/*" &gt; /dev/null

export API=https://$API_ID.execute-api.$REGION.amazonaws.com
echo "API=$API" | tee -a ids.txt</code></pre>
<p>Key settings:</p>
<ul>
<li><strong>Issuer</strong> is the user pool's URL. API Gateway fetches the pool's public signing keys from <code>&lt;issuer&gt;/.well-known/jwks.json</code> and verifies each token's signature locally; it doesn't call Cognito per request.</li>
<li><strong>Audience</strong> is the app client ID. ID tokens carry it in <code>aud</code>; access tokens carry it in <code>client_id</code>. The HTTP API JWT authorizer accepts a match on either.</li>
<li><strong>Identity source</strong> <code>$request.header.Authorization</code>: the token goes in the <code>Authorization</code> header (with or without the <code>Bearer</code> prefix).</li>
<li>The single quotes around <code>'$request.header.Authorization'</code> and <code>'$default'</code> stop bash from treating them as variables.</li>
</ul>` },

    { id: "s6", title: "Call the API without a token", html: `
<pre><code>curl -s "$API/public"; echo
#   {"route": "GET /public", "authenticated": false, "sub": null, ...}

curl -s -i "$API/hello" | sed -n '1p;$p'
#   HTTP/2 401
#   {"message":"Unauthorized"}</code></pre>
<p>The 401 comes from API Gateway itself: the authorizer rejected the request and <strong>Lambda was never invoked</strong> (you pay nothing for it, and your code never sees unauthenticated traffic). Check it: <code>aws logs tail /aws/lambda/l05c-claims --since 5m</code> shows only the <code>/public</code> invocation.</p>` },

    { id: "s7", title: "Sign in and decode the tokens", html: `
<pre><code>aws cognito-idp initiate-auth --client-id "$CLIENT_ID" --auth-flow USER_PASSWORD_AUTH \\
  --auth-parameters USERNAME=alice,PASSWORD=AcademyLab2026pass \\
  --query AuthenticationResult &gt; tokens.json
python3 -c 'import json; t=json.load(open("tokens.json")); print(t["ExpiresIn"], t["TokenType"], sorted(t))'
#   3600 Bearer ['AccessToken', 'ExpiresIn', 'IdToken', 'RefreshToken', 'TokenType']

ID_TOKEN=$(python3 -c 'import json; print(json.load(open("tokens.json"))["IdToken"])')
ACCESS_TOKEN=$(python3 -c 'import json; print(json.load(open("tokens.json"))["AccessToken"])')

# A JWT is header.payload.signature, each part base64url-encoded. Decode the payload:
cat &gt; jwtdump.py &lt;&lt;'PY'
import sys, json, base64
p = sys.argv[1].split(".")[1]
p += "=" * (-len(p) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(p)), indent=2))
PY
python3 jwtdump.py "$ID_TOKEN"
python3 jwtdump.py "$ACCESS_TOKEN"</code></pre>
<p>Compare the two payloads (values abbreviated):</p>
<table>
<thead><tr><th>Claim</th><th>ID token</th><th>Access token</th></tr></thead>
<tbody>
<tr><td><code>token_use</code></td><td><code>id</code></td><td><code>access</code></td></tr>
<tr><td>Client</td><td><code>aud</code> = your client ID</td><td><code>client_id</code> = your client ID (no <code>aud</code>)</td></tr>
<tr><td>User</td><td><code>sub</code>, <code>cognito:username</code>, <code>email</code>, <code>email_verified</code></td><td><code>sub</code>, <code>username</code></td></tr>
<tr><td>Groups</td><td><code>cognito:groups: ["reporting"]</code></td><td><code>cognito:groups: ["reporting"]</code></td></tr>
<tr><td>Scopes</td><td>none</td><td><code>scope: "aws.cognito.signin.user.admin"</code></td></tr>
<tr><td>Issuer, times</td><td><code>iss</code>, <code>iat</code>, <code>exp</code> (1 hour later), <code>auth_time</code></td><td>same</td></tr>
</tbody></table>
<div class="callout"><strong>Rule of thumb:</strong> the <strong>ID token</strong> tells the <em>client app</em> who the user is (profile claims). The <strong>access token</strong> is what you send to <em>APIs</em> (scopes). The <strong>refresh token</strong> stays on the client and gets new tokens without asking for the password again. Decoding is not verifying: anyone can read a JWT, only the signature check proves it's genuine.</div>` },

    { id: "s8", title: "Call the protected route with a token", html: `
<pre><code>curl -s "$API/hello" -H "Authorization: Bearer $ID_TOKEN"; echo
#   {"route": "GET /hello", "authenticated": true, "sub": "…", "username": "alice",
#    "token_use": "id", "groups": "[reporting]", "scope": null}

curl -s "$API/hello" -H "Authorization: Bearer $ACCESS_TOKEN"; echo
#   {... "token_use": "access", "groups": "[reporting]", "scope": "aws.cognito.signin.user.admin"}

# Tamper with one character of the signature and try again
BAD=$(python3 -c 'import sys; t=sys.argv[1]; print(t[:-2] + ("A" if t[-2] != "A" else "B") + t[-1])' "$ACCESS_TOKEN")
curl -s -o /dev/null -w "%{http_code}\\n" "$API/hello" -H "Authorization: Bearer $BAD"
#   401</code></pre>
<p>Notice how the HTTP API passes array claims to Lambda: <code>cognito:groups</code> arrives as a string like <code>"[reporting]"</code>, not a JSON list. Parse it accordingly if you make decisions on it.</p>` },

    { id: "s9", title: "Require a scope on the route", html: `
<p>Routes can demand OAuth scopes. Require the scope that access tokens from this sign-in flow carry:</p>
<pre><code>aws apigatewayv2 update-route --api-id "$API_ID" --route-id "$HELLO_ROUTE_ID" \\
  --authorization-scopes aws.cognito.signin.user.admin &gt; /dev/null
sleep 5

curl -s -o /dev/null -w "access token: %{http_code}\\n" "$API/hello" -H "Authorization: Bearer $ACCESS_TOKEN"
#   access token: 200
curl -s -o /dev/null -w "id token:     %{http_code}\\n" "$API/hello" -H "Authorization: Bearer $ID_TOKEN"
#   id token:     403</code></pre>
<p>The ID token is still valid (signature, issuer, audience and expiry all pass), but it has <strong>no <code>scope</code> claim</strong>, so API Gateway answers <strong>403 Forbidden</strong> rather than 401. <em>401 = we don't know who you are; 403 = we know, and the answer is no.</em></p>
<p class="muted small">In a real design you would create a <strong>resource server</strong> in the user pool with custom scopes such as <code>reports/read</code>, request them through managed login (authorization code flow), and require <code>reports/read</code> on the route. The mechanism is exactly what you just saw.</p>` },

    { id: "s10", title: "Think about groups and fine-grained authorisation", html: `
<p>The JWT authorizer answers "is this a valid token with the right scopes?". It does <strong>not</strong> check groups or business rules. Options, from simplest to most powerful:</p>
<table>
<thead><tr><th>Need</th><th>Where to enforce it</th></tr></thead>
<tbody>
<tr><td>Only signed-in users</td><td>JWT authorizer (what you built)</td></tr>
<tr><td>Coarse permissions per route</td><td>Scopes on routes (step 9), issued per app client or resource server</td></tr>
<tr><td>Rules on groups or attributes</td><td>Check <code>cognito:groups</code> in the function, or a <strong>Lambda authorizer</strong> that returns allow/deny for the route</td></tr>
<tr><td>Fine-grained, auditable policies ("can alice read report 42?")</td><td><strong>Amazon Verified Permissions</strong> (Cedar policies) called from a Lambda authorizer or the app</td></tr>
<tr><td>Users calling AWS services directly (S3, DynamoDB)</td><td>A Cognito <strong>identity pool</strong>: swap the token for temporary AWS credentials and map groups to IAM roles (M05.10)</td></tr>
</tbody></table>
<p><strong>Optional:</strong> in the console, open the user pool → <strong>App integration → Domain</strong>, create a Cognito domain and enable <strong>managed login</strong> for the app client with a callback URL such as <code>http://localhost:8080/callback</code>. Open the login page, sign in as alice, and you'll see the authorization code in the redirect URL: that's the production-grade flow.</p>` },

    { id: "s11", title: "Run the validation checks", html: `<p>Run every command in <strong>Validate your work</strong> below, then complete the worksheet.</p>` }
  ],
  drillsTitle: "Tokens and authorizer worksheet (auto-graded)",
  drills: [
    { id: "L05c-d01", q: "<code>curl $API/hello</code> with no <code>Authorization</code> header. Which HTTP status code comes back?", answers: ["401"], explain: "The JWT authorizer rejects the request before Lambda runs: <code>401 Unauthorized</code>." },
    { id: "L05c-d02", q: "Which token type carries the app client ID in an <code>aud</code> claim? (id / access / refresh)", answers: ["id", "id token", "idtoken"], explain: "ID tokens have <code>aud</code>. Access tokens carry the client ID in <code>client_id</code> instead." },
    { id: "L05c-d03", q: "Which claim in a Cognito <strong>access</strong> token does the HTTP API JWT authorizer match against the configured audience?", answers: ["client_id"], explain: "Access tokens have no <code>aud</code>; API Gateway accepts a match on <code>client_id</code>." },
    { id: "L05c-d04", q: "The route requires a scope. You call it with a valid <strong>ID</strong> token. Which status code?", answers: ["403"], explain: "The token is valid, but ID tokens carry no <code>scope</code> claim, so the request is authenticated yet forbidden: 403." },
    { id: "L05c-d05", q: "Region <code>eu-west-1</code>, user pool ID <code>eu-west-1_AbC123</code>. What is the issuer URL for the JWT authorizer?", answers: ["https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_AbC123"], explain: "<code>https://cognito-idp.&lt;region&gt;.amazonaws.com/&lt;userPoolId&gt;</code>; the signing keys are at <code>/.well-known/jwks.json</code> under it." },
    { id: "L05c-d06", q: "What is the <code>token_use</code> claim value in a Cognito access token?", answers: ["access"], explain: "<code>access</code> for access tokens, <code>id</code> for ID tokens. Validators should check it to stop token-type confusion." },
    { id: "L05c-d07", q: "Which Cognito component exchanges a user's token for temporary <strong>AWS credentials</strong>? (two words)", answers: ["identity pool", "identity pools", "identitypool"], explain: "Identity pools (federated identities) call STS for you and map users to IAM roles. User pools authenticate; identity pools authorise access to AWS services." },
    { id: "L05c-d08", q: "In the Lambda event (HTTP API payload 2.0), what is the path to the validated claims? (dot notation)", answers: ["requestContext.authorizer.jwt.claims", "event.requestContext.authorizer.jwt.claims"], explain: "<code>event.requestContext.authorizer.jwt.claims</code>, with the scopes in <code>…jwt.scopes</code>." },
    { id: "L05c-d09", q: "Which global condition key in the Lambda permission's resource policy restricts invocation to one specific API? (it's set by <code>--source-arn</code>)", answers: ["aws:SourceArn"], explain: "<code>--source-arn</code> adds an <code>aws:SourceArn</code> condition: API Gateway may invoke the function only on behalf of that API." }
  ],
  validate: `
<pre><code># If you opened a new shell: source the saved IDs
#   eval "$(sed 's/ /\\n/g' ~/l05c/ids.txt)"; export REGION=$(aws configure get region)

# 1. The authorizer points at your pool and client
aws apigatewayv2 get-authorizers --api-id "$API_ID" \\
  --query 'Items[0].JwtConfiguration' --output json
#   expect Audience [CLIENT_ID] and Issuer https://cognito-idp.REGION.amazonaws.com/POOL_ID

# 2. No token → 401; access token → 200; ID token on the scoped route → 403
curl -s -o /dev/null -w "%{http_code}\\n" "$API/hello"
curl -s -o /dev/null -w "%{http_code}\\n" "$API/hello" -H "Authorization: Bearer $ACCESS_TOKEN"
curl -s -o /dev/null -w "%{http_code}\\n" "$API/hello" -H "Authorization: Bearer $ID_TOKEN"
#   expect 401, 200, 403 (tokens expire after 1 hour: repeat step 7 if you get 401s)

# 3. The Lambda permission is scoped to this API
aws lambda get-policy --function-name l05c-claims --query Policy --output text \\
  | python3 -c 'import sys, json; s=json.load(sys.stdin)["Statement"][0]; print(s["Condition"])'
#   expect {'ArnLike': {'AWS:SourceArn': 'arn:aws:execute-api:REGION:ACCOUNT:API_ID/*/*'}}</code></pre>
<p>All checks pass? Clean up, tick the last step and mark the lab complete.</p>`,
  cleanup: `
<pre><code># Reverse order of creation
aws apigatewayv2 delete-api --api-id "$API_ID"
aws lambda delete-function --function-name l05c-claims
aws logs delete-log-group --log-group-name /aws/lambda/l05c-claims 2&gt;/dev/null
aws iam detach-role-policy --role-name l05c-lambda-role \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam delete-role --role-name l05c-lambda-role

# If you created a Cognito domain in step 10, delete it first:
#   aws cognito-idp delete-user-pool-domain --user-pool-id "$POOL_ID" --domain &lt;your-domain&gt;
aws cognito-idp delete-user-pool --user-pool-id "$POOL_ID"

rm -rf ~/l05c
aws apigatewayv2 get-apis --query "Items[?Name=='l05c-api'].ApiId"     # expect []
aws cognito-idp list-user-pools --max-results 20 --query "UserPools[?Name=='l05c-pool'].Id"   # expect []</code></pre>
<p class="muted small">If <code>delete-user-pool</code> reports that deletion protection is active, turn it off first with <code>aws cognito-idp update-user-pool --user-pool-id "$POOL_ID" --deletion-protection INACTIVE</code> (pools created from the console may have it enabled).</p>`
});
// ================================================================== 95_quiz.js
/* M05 module quiz: 25 questions across the ten lessons (M05.01–M05.10), mostly SAA-C03 scenario style */
var QUIZ = {
  passMark: 70,
  questions: [
    // ---------------------------------------------------------------- M05.01 IAM fundamentals
    {"id": "M05-Q01", "type": "multi", "domain": "D1", "task": "1.1", "level": 100, "stem": "A start-up's founders still sign in to the AWS Management Console as the <strong>root user</strong> every day. The root user has no MFA and has an active access key that a build script uses. Which TWO actions should the company take FIRST to protect the root user?", "options": [{"t": "Enable MFA on the root user (preferably a passkey or hardware security key)", "c": true, "why": "A stolen root password alone then can't sign in. MFA on root is the first control in every AWS security checklist."}, {"t": "Delete the root user's access keys and move the build script to an IAM role", "c": true, "why": "Root access keys give unrestricted, unscopable API access. AWS recommends the root user has no access keys at all; workloads should use roles with temporary credentials."}, {"t": "Attach a service control policy (SCP) to the management account that denies all actions to the root user", "c": false, "why": "SCPs never affect the management account, so this would do nothing there. Even in member accounts, an SCP is not a substitute for MFA and removing keys."}, {"t": "Create an IAM user called root-admin with AdministratorAccess and share its password between the founders", "c": false, "why": "Shared credentials destroy accountability and are still long-term secrets. Each person should have their own identity, ideally through IAM Identity Center."}, {"t": "Rotate the root password every 30 days and email it to the founders", "c": false, "why": "Emailing a password exposes it, and rotation without MFA doesn't stop phishing. It also leaves the access key in place."}]},
    {"id": "M05-Q02", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A company with 200 employees uses <strong>Okta</strong> as its identity provider. It is moving to 15 AWS accounts in AWS Organizations. Employees need console and CLI access to different accounts based on their Okta group, and leavers must lose access as soon as they are disabled in Okta. Which solution meets these requirements with the LEAST operational overhead?", "options": [{"t": "Enable IAM Identity Center, connect Okta as an external identity provider with SAML 2.0 and SCIM provisioning, and assign permission sets to Okta groups per account", "c": true, "why": "Identity Center gives single sign-on to every account, short-lived credentials for console and CLI (<code>aws sso login</code>), and SCIM keeps users and groups in sync, so disabling someone in Okta removes their access."}, {"t": "Create an IAM user for each employee in every account and add them to IAM groups", "c": false, "why": "3,000 user records to create, rotate and deprovision by hand. Long-term passwords and keys in 15 places is the opposite of least overhead."}, {"t": "Create IAM users in one central account and let them switch roles into the other accounts", "c": false, "why": "Better than users everywhere, but users and passwords are still managed separately from Okta, and leavers must be removed manually."}, {"t": "Create an Amazon Cognito user pool federated with Okta and give employees its sign-in URL", "c": false, "why": "Cognito authenticates users of your <em>applications</em>. It doesn't provide workforce access to the AWS console or CLI across accounts."}]},
    // ---------------------------------------------------------------- M05.02 Policy language
    {"id": "M05-Q03", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A security team wants to deny every API call made by the developers' IAM roles unless it comes from the corporate network <code>203.0.113.0/24</code>. Developers use AWS CloudFormation, which makes further calls to other services on their behalf, and those calls must keep working. Which policy statement should the team add?", "options": [{"t": "A <code>Deny</code> on <code>*</code> with <code>NotIpAddress</code> on <code>aws:SourceIp</code> = 203.0.113.0/24 AND <code>Bool</code> <code>aws:ViaAWSService</code> = false", "c": true, "why": "Calls CloudFormation makes on the user's behalf come from AWS's network, not the office. <code>aws:ViaAWSService</code> = false limits the deny to requests the developer makes directly, so service-made calls still work."}, {"t": "A <code>Deny</code> on <code>*</code> with <code>NotIpAddress</code> on <code>aws:SourceIp</code> = 203.0.113.0/24 only", "c": false, "why": "This also denies the follow-on calls CloudFormation makes for the user, because their source IP belongs to AWS. Stacks would fail."}, {"t": "An <code>Allow</code> on <code>*</code> with <code>IpAddress</code> on <code>aws:SourceIp</code> = 203.0.113.0/24", "c": false, "why": "An Allow with a condition doesn't block anything another policy allows. Only an explicit Deny enforces the restriction."}, {"t": "A <code>Deny</code> on <code>*</code> with <code>StringNotEquals</code> on <code>aws:SourceVpc</code>", "c": false, "why": "<code>aws:SourceVpc</code> is only present on requests that arrive through a VPC endpoint. It can't describe the office network on the internet."}]},
    {"id": "M05-Q04", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company in AWS Organizations must prevent workloads from being created outside <code>eu-west-1</code> and <code>eu-central-1</code> in all member accounts. Global services such as IAM, CloudFront, Route 53 and AWS Support must keep working. What should a solutions architect do?", "options": [{"t": "Attach an SCP to the root OU that denies all actions using <code>NotAction</code> for the global services, with a <code>StringNotEquals</code> condition on <code>aws:RequestedRegion</code> for the two allowed Regions", "c": true, "why": "This is AWS's documented Region-restriction pattern. Global services are exempted with NotAction because their API calls are made in us-east-1, and the SCP applies to every principal, including member-account root users."}, {"t": "Attach an IAM policy to every user and role that denies other Regions", "c": false, "why": "New roles and the member-account root users would not be covered, and it must be maintained in every account. An SCP is the central guardrail."}, {"t": "Disable all other Regions in each account's settings", "c": false, "why": "Only opt-in Regions can be disabled. Default Regions such as us-east-1 or eu-west-2 are always enabled."}, {"t": "Deploy an AWS Config rule that reports resources created in other Regions", "c": false, "why": "AWS Config detects after the fact. The requirement is to prevent creation."}]},
    {"id": "M05-Q05", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "Engineers use both the console and long-term access keys with the CLI. Terminating EC2 instances must require MFA in every case. Which statement enforces this?", "options": [{"t": "<code>Deny</code> <code>ec2:TerminateInstances</code> with <code>BoolIfExists</code> <code>aws:MultiFactorAuthPresent</code> = false", "c": true, "why": "Requests signed with long-term access keys don't contain the MFA key at all. <code>BoolIfExists</code> denies when the key is false <em>or</em> missing, closing the CLI loophole."}, {"t": "<code>Deny</code> <code>ec2:TerminateInstances</code> with <code>Bool</code> <code>aws:MultiFactorAuthPresent</code> = false", "c": false, "why": "When the key is absent (long-term access keys), a plain <code>Bool</code> condition doesn't match, so the deny doesn't apply and CLI users can terminate without MFA."}, {"t": "<code>Allow</code> <code>ec2:TerminateInstances</code> with <code>Bool</code> <code>aws:MultiFactorAuthPresent</code> = true", "c": false, "why": "Any other policy that allows the action without the condition still grants it. Requirements like this need a Deny."}, {"t": "Enable MFA Delete on the account", "c": false, "why": "MFA Delete is an S3 bucket versioning feature. It has nothing to do with EC2."}]},
    // ---------------------------------------------------------------- M05.03 Policy types
    {"id": "M05-Q06", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "Developers must be able to create IAM roles for their Lambda functions without waiting for the security team, but must never be able to create a role with more permissions than the security team allows. Which solution meets this requirement?", "options": [{"t": "Let developers call <code>iam:CreateRole</code> only with a condition requiring <code>iam:PermissionsBoundary</code> to equal an approved boundary policy, and deny removing or changing that boundary", "c": true, "why": "A permissions boundary caps whatever permissions are later attached to the role. Requiring it at creation (and denying its removal) is the standard delegated-administration pattern."}, {"t": "Attach an SCP that denies <code>iam:CreateRole</code> to the account", "c": false, "why": "That blocks role creation completely, which defeats the goal of self-service."}, {"t": "Add a resource-based policy to each Lambda function that limits its permissions", "c": false, "why": "A function's resource policy controls who may <em>invoke</em> the function, not what its execution role can do."}, {"t": "Have developers pass a session policy when they create roles", "c": false, "why": "Session policies limit a temporary session created with AssumeRole or federation. They don't constrain roles created during that session."}]},
    {"id": "M05-Q07", "type": "multi", "domain": "D1", "task": "1.1", "level": 200, "stem": "Which TWO statements about AWS Organizations service control policies (SCPs) are correct?", "options": [{"t": "An SCP never grants permissions; principals still need identity-based or resource-based policies that allow the action", "c": true, "why": "SCPs only set the maximum available permissions in member accounts."}, {"t": "An SCP restricts the root user of a member account", "c": true, "why": "This is one of the main reasons to use SCPs: they apply to every principal in member accounts, including root."}, {"t": "An SCP restricts principals in the organization's management account", "c": false, "why": "SCPs never affect the management account, which is why workloads shouldn't run there."}, {"t": "An SCP restricts service-linked roles", "c": false, "why": "Service-linked roles are exempt from SCPs so that AWS services keep working."}, {"t": "Attaching an SCP that allows <code>s3:*</code> gives every user in the account full S3 access", "c": false, "why": "An Allow in an SCP only means 'not blocked here'. Users still need an IAM policy that grants the access."}]},
    {"id": "M05-Q08", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A developer's role has the <code>AdministratorAccess</code> managed policy, no permissions boundary and no session policy. The account is in an organizational unit (OU) in AWS Organizations. The developer gets <code>AccessDenied</code> when creating an S3 bucket in ap-southeast-1, but can create one in eu-west-1. What is the MOST likely cause?", "options": [{"t": "An SCP on the OU (or a parent) denies actions outside approved Regions", "c": true, "why": "With identity permissions unlimited and no boundary or session policy, the only remaining layer that can block a request is an Organizations policy such as an SCP."}, {"t": "The bucket policy of the new bucket denies the developer", "c": false, "why": "The bucket doesn't exist yet, so it can't have a bucket policy."}, {"t": "S3 bucket ACLs are disabled in that Region", "c": false, "why": "ACL settings affect object and bucket access, not whether a bucket can be created."}, {"t": "IAM Access Analyzer blocked the request", "c": false, "why": "Access Analyzer reports and validates. It never denies requests."}]},
    // ---------------------------------------------------------------- M05.04 Policy evaluation logic
    {"id": "M05-Q09", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "In account 111122223333, IAM user <code>alice</code> has NO identity-based policies. A bucket in the same account has a bucket policy that allows <code>s3:GetObject</code> for the principal <code>arn:aws:iam::111122223333:user/alice</code>. There are no SCPs, RCPs or boundaries restricting S3. What happens when Alice calls GetObject on that bucket?", "options": [{"t": "It is allowed, because in the same account a resource-based policy that names the user can grant access on its own", "c": true, "why": "Within one account, an allow in <em>either</em> the identity policy or the resource policy is enough (unless a Deny or limiting policy applies)."}, {"t": "It is denied, because every request needs an identity-based policy allow", "c": false, "why": "That is true across accounts, not within the same account for a resource policy that names the principal."}, {"t": "It is denied, because users can't be named in bucket policies", "c": false, "why": "IAM users and roles can be named as principals by ARN in resource-based policies."}, {"t": "It is allowed only if the object's ACL also grants Alice READ", "c": false, "why": "With the bucket policy allowing the request, no ACL is needed. Modern buckets have ACLs disabled anyway."}]},
    {"id": "M05-Q10", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A role <code>Reporting</code> in account 111122223333 must read objects from a bucket in account 444455556666. The bucket policy allows <code>s3:GetObject</code> for that role's ARN. Calls from the role still fail with <code>AccessDenied</code>. What must the solutions architect do?", "options": [{"t": "Attach an identity-based policy to the <code>Reporting</code> role that allows <code>s3:GetObject</code> on the bucket's objects", "c": true, "why": "Cross-account access needs an allow on BOTH sides: the resource policy in the owning account and the caller's identity policy in its own account."}, {"t": "Add account 444455556666 to the <code>Reporting</code> role's trust policy", "c": false, "why": "A trust policy controls who may assume the role. It doesn't give the role permissions."}, {"t": "Grant the role READ through an object ACL", "c": false, "why": "The bucket policy already grants the access on the resource side. The missing piece is the caller's own permission."}, {"t": "Enable S3 Object Ownership on the bucket", "c": false, "why": "Object Ownership controls who owns uploaded objects and disables ACLs. It doesn't grant cross-account reads."}]},
    {"id": "M05-Q11", "type": "single", "domain": "D1", "task": "1.3", "level": 300, "stem": "An administrator role with <code>kms:*</code> in its identity policy gets <code>AccessDenied</code> when calling <code>kms:Decrypt</code> on a customer managed key in the same account. The key policy lists only a separate key-administrator role as principal. Why is the call denied?", "options": [{"t": "KMS key policies must allow access; identity policies only work for a key if its key policy delegates to IAM (for example by allowing the account principal)", "c": true, "why": "KMS is an exception to the usual same-account rule. Without a key policy statement for the role or for <code>arn:aws:iam::111122223333:root</code>, IAM policies are ignored for that key."}, {"t": "An identity policy can't contain <code>kms:*</code>", "c": false, "why": "Wildcards are valid in IAM policies, even though they are poor practice."}, {"t": "Decrypt requires the key to be in another Region", "c": false, "why": "Keys are used in their own Region; this isn't a requirement."}, {"t": "The key must first be shared with AWS RAM", "c": false, "why": "KMS keys are shared through key policies and grants, not RAM."}]},
    {"id": "M05-Q12", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "An IAM role has an identity policy that allows <code>s3:*</code> on all resources. A permissions boundary attached to the same role allows only <code>s3:GetObject</code> and <code>s3:ListBucket</code>. There are no other policies. Which TWO statements are correct?", "options": [{"t": "<code>s3:GetObject</code> requests are allowed", "c": true, "why": "The action is allowed by both the identity policy and the boundary, so it falls in the intersection."}, {"t": "<code>s3:PutObject</code> requests are denied", "c": true, "why": "The boundary doesn't allow PutObject, so it is outside the role's maximum permissions, whatever the identity policy says."}, {"t": "<code>s3:PutObject</code> requests are allowed, because the identity policy is broader than the boundary", "c": false, "why": "Effective permissions are the intersection of identity policy and boundary, not the union."}, {"t": "If the identity policy were removed, the boundary alone would still allow GetObject", "c": false, "why": "A boundary never grants. With no identity allow, every request is implicitly denied."}, {"t": "<code>s3:DeleteObject</code> requests are allowed", "c": false, "why": "DeleteObject isn't in the boundary, so it is denied."}]},
    // ---------------------------------------------------------------- M05.05 Roles and STS
    {"id": "M05-Q13", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "An application on Amazon EC2 reads from DynamoDB using an access key and secret stored in a configuration file on the instance. A security review requires removing long-term credentials. What should the solutions architect do?", "options": [{"t": "Create an IAM role with the required DynamoDB permissions, attach it to the instance through an instance profile, and remove the keys so the SDK uses the role's temporary credentials", "c": true, "why": "The SDK automatically fetches and refreshes the role's credentials from the instance metadata service. Nothing secret is stored on disk."}, {"t": "Move the keys into AWS Secrets Manager and read them at start-up", "c": false, "why": "The keys are still long-term credentials; this only changes where they are stored."}, {"t": "Encrypt the configuration file with KMS", "c": false, "why": "The keys still exist and can still leak once decrypted."}, {"t": "Create a new IAM user for each instance and rotate its keys every 90 days", "c": false, "why": "More long-term keys to manage. Rotation reduces risk but roles remove it."}]},
    {"id": "M05-Q14", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "Several Amazon ECS services run on AWS Fargate. Each service must access a different S3 bucket, and no service may read another service's bucket. How should permissions be granted?", "options": [{"t": "Give each task definition its own <strong>task role</strong> that allows access only to that service's bucket", "c": true, "why": "The task role supplies credentials to the application code in the containers, so each service gets its own least-privilege identity."}, {"t": "Grant all buckets to the shared <strong>task execution role</strong>", "c": false, "why": "The execution role is used by the ECS agent to pull images from ECR and write logs, not by your application. Sharing it would also break isolation."}, {"t": "Attach an instance profile to the Fargate hosts", "c": false, "why": "With Fargate there are no EC2 instances you manage, and instance-level roles couldn't separate services anyway."}, {"t": "Store an IAM user's keys for each service in Secrets Manager", "c": false, "why": "Roles provide temporary credentials without any long-term keys to manage."}]},
    {"id": "M05-Q15", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A developer can create Lambda functions but gets <code>User is not authorized to perform: iam:PassRole</code> when choosing an existing execution role. What is the LEAST-privilege fix?", "options": [{"t": "Allow <code>iam:PassRole</code> on that role's ARN, with the condition <code>iam:PassedToService</code> = <code>lambda.amazonaws.com</code>", "c": true, "why": "Passing a role to a service requires PassRole. Scoping it to the specific role and service stops the developer handing powerful roles to other services."}, {"t": "Attach <code>IAMFullAccess</code> to the developer", "c": false, "why": "Far broader than needed: it would let the developer create and change any IAM entity, a privilege-escalation path."}, {"t": "Add the developer to the role's trust policy", "c": false, "why": "The trust policy decides who may assume the role. Lambda, not the developer, assumes the execution role."}, {"t": "Allow <code>sts:AssumeRole</code> on the role for the developer", "c": false, "why": "The developer isn't assuming the role; Lambda is. PassRole is the permission being checked."}]},
    {"id": "M05-Q16", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A team deploys to AWS from GitHub Actions using an IAM user's access keys stored as repository secrets. The security team wants no long-term AWS credentials in GitHub and access limited to the <code>main</code> branch of one repository. Which TWO steps should the team take?", "options": [{"t": "Create an IAM OIDC identity provider for <code>token.actions.githubusercontent.com</code> in the AWS account", "c": true, "why": "This lets AWS STS trust tokens issued by GitHub."}, {"t": "Create a deployment role whose trust policy allows <code>sts:AssumeRoleWithWebIdentity</code> from that provider, with conditions on the token's <code>aud</code> and <code>sub</code> (for example <code>repo:org/app:ref:refs/heads/main</code>)", "c": true, "why": "The workflow exchanges its short-lived OIDC token for temporary role credentials. The <code>sub</code> condition limits it to that repository and branch."}, {"t": "Rotate the IAM user's access keys every 7 days with a Lambda function", "c": false, "why": "Keys would still be long-term secrets stored in GitHub, which the requirement forbids."}, {"t": "Create an IAM Identity Center permission set for the GitHub Actions runner", "c": false, "why": "Identity Center is for human workforce sign-in, not machine identities in CI."}, {"t": "Create an Amazon Cognito identity pool for the repository", "c": false, "why": "Cognito is for application end users; the native pattern for CI is an IAM OIDC provider."}]},
    // ---------------------------------------------------------------- M05.06 Cross-account access patterns
    {"id": "M05-Q17", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "A third-party monitoring SaaS needs read-only access to a company's AWS account. The vendor serves thousands of customers from its own AWS account. How should access be granted while preventing the confused-deputy problem?", "options": [{"t": "Create a cross-account role that trusts the vendor's account and requires a unique <code>sts:ExternalId</code> value supplied by the vendor for this customer", "c": true, "why": "The External ID ensures the vendor only assumes your role when acting for you, so another customer can't trick the vendor into using your role ARN."}, {"t": "Create an IAM user with read-only access and give its access keys to the vendor", "c": false, "why": "Long-term keys held by a third party are hard to rotate and audit; roles provide temporary credentials."}, {"t": "Create a role that trusts the vendor's account and add a condition on <code>aws:SourceArn</code>", "c": false, "why": "<code>aws:SourceArn</code> protects against the confused deputy when an AWS <em>service</em> acts on your behalf. Third parties use External ID."}, {"t": "Create a role whose trust policy allows <code>\"Principal\": \"*\"</code> with read-only permissions", "c": false, "why": "Anyone in any account could assume it. Never trust <code>*</code> without strong conditions."}]},
    {"id": "M05-Q18", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A bucket of shared reference data must be readable by every account in the company's AWS organization. New accounts are created every week. Which solution has the LEAST operational overhead?", "options": [{"t": "Add a bucket policy that allows <code>s3:GetObject</code> to <code>\"Principal\": \"*\"</code> with the condition <code>aws:PrincipalOrgID</code> equal to the organization ID", "c": true, "why": "Any principal in any current or future account of the organization qualifies automatically. Nothing changes when accounts are added. (Each caller still needs an identity policy allow, since this is cross-account.)"}, {"t": "List every account ID as a principal in the bucket policy and update it when accounts are created", "c": false, "why": "It works but needs a change for every new account, and policies have size limits."}, {"t": "Create a cross-account role in the bucket's account for each member account", "c": false, "why": "One role per account is significant ongoing work compared with a single condition."}, {"t": "Share the bucket with AWS Resource Access Manager (RAM)", "c": false, "why": "Standard S3 buckets aren't a RAM-shareable resource type. Use a bucket policy."}]},
    {"id": "M05-Q19", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "Partner accounts upload files into a company's S3 bucket using a bucket policy that allows <code>s3:PutObject</code>. The company can't read some of the uploaded objects because they are owned by the uploading accounts. What is the MOST operationally efficient fix?", "options": [{"t": "Set S3 Object Ownership on the bucket to <strong>Bucket owner enforced</strong>", "c": true, "why": "ACLs are disabled and the bucket owner automatically owns every object, whoever uploads it. This is the default for new buckets."}, {"t": "Require every uploader to send the <code>bucket-owner-full-control</code> canned ACL and deny uploads without it", "c": false, "why": "This older pattern works, but it relies on ACLs and on every partner sending the header. Bucket owner enforced removes the problem."}, {"t": "Run a nightly job that copies each object onto itself to take ownership", "c": false, "why": "Extra cost and moving parts, and objects are unreadable until the job runs."}, {"t": "Grant each partner account a role in the company account and ask them to upload by assuming it", "c": false, "why": "That would also make the company the owner, but it's more work for every partner than one bucket setting."}]},
    // ---------------------------------------------------------------- M05.07 Federation
    {"id": "M05-Q20", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A company has on-premises Microsoft Active Directory. Employees must sign in to the console of several AWS accounts with their existing AD credentials. The company doesn't want to synchronise passwords or run a separate directory in AWS. Which solution meets these requirements with the LEAST operational overhead?", "options": [{"t": "Use IAM Identity Center with AWS Directory Service AD Connector as its identity source, and assign permission sets to AD groups", "c": true, "why": "AD Connector is a proxy: authentication requests go to the on-premises AD, so there is no second directory and no password sync."}, {"t": "Create IAM users matching every AD user and ask employees to keep the same passwords", "c": false, "why": "Duplicated identities, manual deprovisioning and no single sign-on."}, {"t": "Deploy Simple AD and recreate the users in it", "c": false, "why": "Simple AD is a separate Samba-based directory, which the company explicitly doesn't want, and it isn't an Identity Center identity source."}, {"t": "Use an Amazon Cognito user pool with a SAML connection to AD", "c": false, "why": "Cognito is for application users, not workforce access to AWS accounts."}]},
    {"id": "M05-Q21", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A company federates its corporate IdP with AWS IAM using SAML 2.0 (without IAM Identity Center). Which TWO statements about this setup are correct?", "options": [{"t": "The IdP's SAML assertion names the IAM role (and SAML provider) the user may assume", "c": true, "why": "Role mapping is done with SAML attributes in the assertion."}, {"t": "AWS STS returns temporary credentials through <code>AssumeRoleWithSAML</code>", "c": true, "why": "No IAM users are involved; each session is a temporary role session."}, {"t": "An IAM user is created automatically for each federated employee", "c": false, "why": "Federated users never become IAM users; that is the point of federation."}, {"t": "Each employee needs a long-term access key to sign SAML requests", "c": false, "why": "SAML federation is authenticated by the IdP's signed assertion, not by AWS access keys."}, {"t": "SAML federation works only through Amazon Cognito", "c": false, "why": "IAM supports SAML 2.0 identity providers directly; Cognito is one option for application users."}]},
    // ---------------------------------------------------------------- M05.08 ABAC
    {"id": "M05-Q22", "type": "single", "domain": "D1", "task": "1.1", "level": 400, "stem": "A company has 60 project teams and adds new ones every month. Developers must be able to start, stop and modify only the EC2 instances that belong to their project. Developers sign in through IAM Identity Center, and the IdP passes each user's project as an attribute. Which approach scales with the LEAST policy maintenance?", "options": [{"t": "Attribute-based access control: one permission set whose policy allows the EC2 actions when <code>aws:ResourceTag/project</code> equals <code>${aws:PrincipalTag/project}</code>, plus a rule that instances are tagged with their project at creation", "c": true, "why": "One policy serves every team, present and future. New teams need only correct tags and user attributes, not new policies."}, {"t": "One IAM policy per team listing that team's instance ARNs", "c": false, "why": "60+ policies that must change whenever instances are launched or replaced."}, {"t": "Resource-based policies on each EC2 instance", "c": false, "why": "EC2 instances don't support resource-based policies."}, {"t": "A separate AWS account per instance", "c": false, "why": "Accounts are a strong isolation boundary for workloads or teams, but one per instance is absurd overhead."}]},
    // ---------------------------------------------------------------- M05.09 Least privilege in practice
    {"id": "M05-Q23", "type": "multi", "domain": "D1", "task": "1.1", "level": 300, "stem": "A security team must (1) find S3 buckets, KMS keys and IAM roles that are accessible from outside the company's AWS organization and (2) replace a broad developer policy with one based on the actions actually used in the last 90 days. Which TWO IAM Access Analyzer features meet these needs?", "options": [{"t": "An external access analyzer with the organization as the zone of trust", "c": true, "why": "It analyses resource policies and reports resources that principals outside the organization can access."}, {"t": "Policy generation from AWS CloudTrail activity for the developer role", "c": true, "why": "Access Analyzer reads the role's CloudTrail history and drafts a policy containing only the actions and services used."}, {"t": "Amazon GuardDuty findings", "c": false, "why": "GuardDuty detects threats from logs and network activity; it doesn't analyse resource policies or generate least-privilege policies."}, {"t": "Amazon Macie sensitive-data discovery", "c": false, "why": "Macie finds sensitive data in S3, not external access paths or policy changes."}, {"t": "Amazon Inspector findings", "c": false, "why": "Inspector scans workloads for software vulnerabilities and network reachability."}]},
    // ---------------------------------------------------------------- M05.10 Amazon Cognito
    {"id": "M05-Q24", "type": "single", "domain": "D1", "task": "1.1", "level": 200, "stem": "A mobile app needs user sign-up and sign-in with email or Google. The app calls an Amazon API Gateway REST API, which must accept only requests from signed-in users. Which solution meets these requirements with the LEAST custom code?", "options": [{"t": "Create an Amazon Cognito user pool with Google as a federated identity provider, and configure a Cognito user pool authorizer on the API", "c": true, "why": "The user pool handles sign-up, sign-in and social federation and issues JWTs. API Gateway validates the tokens natively."}, {"t": "Create an Amazon Cognito identity pool only and require IAM authorization on the API", "c": false, "why": "An identity pool exchanges tokens for AWS credentials but doesn't provide a user directory, sign-up or email sign-in."}, {"t": "Create an IAM user for each app user and sign requests with SigV4", "c": false, "why": "IAM users are not meant for millions of end users, and keys would be embedded in the app."}, {"t": "Use IAM Identity Center for the app's users", "c": false, "why": "Identity Center is for workforce access to AWS accounts and business apps, not customer sign-in for a mobile app."}]},
    {"id": "M05-Q25", "type": "single", "domain": "D1", "task": "1.1", "level": 300, "stem": "Signed-in users of a mobile app must upload photos directly to Amazon S3, and each user must only be able to write under their own prefix. Users already sign in with a Cognito user pool. What should the solutions architect add?", "options": [{"t": "A Cognito identity pool that issues temporary credentials for an authenticated IAM role whose policy allows <code>s3:PutObject</code> on <code>arn:aws:s3:::photos-bucket/${cognito-identity.amazonaws.com:sub}/*</code>", "c": true, "why": "The identity pool exchanges the user pool token for STS credentials. The policy variable resolves to each user's unique identity ID, so one policy confines every user to their own prefix."}, {"t": "A Cognito user pool group with an S3 bucket policy that allows the group", "c": false, "why": "Bucket policies can't name user pool groups as principals. Users need AWS credentials, which come from an identity pool."}, {"t": "An IAM user whose access keys are compiled into the app", "c": false, "why": "Anyone can extract embedded keys, and all users would share the same permissions."}, {"t": "Make the bucket public for writes and validate uploads with a Lambda function", "c": false, "why": "Public write access is a serious security risk, and the Lambda can't stop overwrites of other users' objects."}]}
  ]
};

  window.LMS_MODULES["M05"] = {
    summary: "Identity is the new perimeter. This module takes IAM from first principles to production: principals, the policy language, every policy type and how AWS evaluates them together, roles and STS, cross-account access and the confused-deputy problem, federation with IAM Identity Center and external identity providers, attribute-based access control, least privilege with IAM Access Analyzer, and application identity with Amazon Cognito. It covers Domain 1 (Secure Architectures), the largest exam domain at 30%.",
    objectives: [
      "Secure the root user and choose between IAM users, groups, roles and IAM Identity Center for every kind of principal",
      "Read and write identity-based, resource-based and trust policies using conditions, variables and tags",
      "Predict the outcome of any request by applying the policy evaluation logic, including SCPs, RCPs, permissions boundaries and session policies, within one account and across accounts",
      "Use STS and roles for workloads, cross-account access and third parties, avoiding the confused-deputy problem",
      "Design workforce federation (SAML 2.0, OIDC, IAM Identity Center, Active Directory) and scale permissions with ABAC",
      "Drive towards least privilege with IAM Access Analyzer, last-accessed data and policy generation",
      "Choose between Cognito user pools and identity pools to authenticate application users and authorise API calls"
    ],
    lessons: LESSONS,
    labs: typeof LABS !== "undefined" ? LABS : [LAB],
    quiz: QUIZ,
    flashcards: FLASHCARDS
  };
})();

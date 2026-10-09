/* M03 – Linux, CLI and tooling essentials (assembled from per-lesson sections) */
(function () {
  var LESSONS = [], FLASHCARDS = [];

// ================================================================== 01_linux.js
/* ---------------------------------------------------------------- M03.01 Linux essentials for cloud */
var DG_0301_ACCESS = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0301at m0301ad">
  <title id="m0301at">Bastion host versus Systems Manager Session Manager</title>
  <desc id="m0301ad">Top: an administrator with a private key connects over SSH port 22 to a bastion host in a public subnet, then hops over SSH to a private instance. Inbound port 22 is open and keys must be distributed. Bottom: the administrator authenticates to AWS Systems Manager over HTTPS with IAM; the SSM Agent on the private instance dials out on port 443 to Systems Manager, so the instance has no inbound ports and every session is logged.</desc>
  <defs><marker id="m0301a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <text class="dg-tb" x="12" y="22">Traditional: SSH through a bastion host</text>
  <rect class="dg-box" x="12" y="36" width="150" height="62" rx="6"/>
  <text class="dg-t" x="26" y="58">Admin laptop</text><text class="dg-ts" x="26" y="76">holds private key</text><text class="dg-ts" x="26" y="90">.pem file</text>
  <rect class="dg-bad" x="300" y="36" width="170" height="62" rx="6"/>
  <text class="dg-t" x="314" y="58">Bastion host</text><text class="dg-ts" x="314" y="76">public subnet</text><text class="dg-ts" x="314" y="90">SG in: 22 from office</text>
  <rect class="dg-box" x="590" y="36" width="158" height="62" rx="6"/>
  <text class="dg-t" x="604" y="58">Private EC2</text><text class="dg-ts" x="604" y="76">private subnet</text><text class="dg-ts" x="604" y="90">SG in: 22 from bastion</text>
  <path class="dg-line" d="M162 67 H298" marker-end="url(#m0301a-ar)"/><text class="dg-ts" x="200" y="60">SSH :22</text>
  <path class="dg-line" d="M470 67 H588" marker-end="url(#m0301a-ar)"/><text class="dg-ts" x="500" y="60">SSH :22</text>
  <text class="dg-ts" x="12" y="122">Inbound port 22 exposed · keys to copy, rotate and revoke · a server to patch and pay for · weak per-user audit trail</text>

  <text class="dg-tb" x="12" y="168">Modern: AWS Systems Manager Session Manager</text>
  <rect class="dg-box" x="12" y="182" width="150" height="62" rx="6"/>
  <text class="dg-t" x="26" y="204">Admin</text><text class="dg-ts" x="26" y="222">console or CLI</text><text class="dg-ts" x="26" y="236">IAM Identity Center</text>
  <rect class="dg-good" x="300" y="182" width="170" height="62" rx="6"/>
  <text class="dg-t" x="314" y="204">Systems Manager</text><text class="dg-ts" x="314" y="222">AWS-managed endpoint</text><text class="dg-ts" x="314" y="236">checks ssm:StartSession</text>
  <rect class="dg-good" x="590" y="182" width="158" height="62" rx="6"/>
  <text class="dg-t" x="604" y="204">Private EC2</text><text class="dg-ts" x="604" y="222">SSM Agent + role</text><text class="dg-ts" x="604" y="236">SG in: nothing</text>
  <path class="dg-line" d="M162 213 H298" marker-end="url(#m0301a-ar)"/><text class="dg-ts" x="182" y="206">HTTPS + IAM</text>
  <path class="dg-line" d="M590 213 H472" marker-end="url(#m0301a-ar)"/><text class="dg-ts" x="490" y="206">outbound :443</text>
  <text class="dg-ts" x="12" y="270">No inbound ports · no SSH keys · IAM policies decide who may connect to which instances</text>
  <text class="dg-ts" x="12" y="288">Session output logged to CloudWatch Logs or S3 · CloudTrail records every StartSession call</text>
  <text class="dg-ts" x="12" y="306">The agent needs an outbound path: a NAT gateway, or VPC interface endpoints for ssm, ssmmessages, ec2messages</text>
</svg>
<figcaption>Figure M03-1a. The connection direction is the key difference: SSH needs an inbound path to the instance, Session Manager only needs the instance to reach AWS outbound.</figcaption>
</figure>`;

var DG_0301_BOOT = `
<figure>
<svg class="diagram" viewBox="0 0 760 236" role="img" aria-labelledby="m0301bt m0301bd">
  <title id="m0301bt">What happens when an EC2 Linux instance boots for the first time</title>
  <desc id="m0301bd">Five stages left to right: the RunInstances API call with the AMI, instance type, role and user data; boot of the kernel and systemd with networking; cloud-init reading instance metadata, setting the hostname and installing the SSH key; the user data script running once as root with output logged to cloud-init-output.log; and finally your services running and health checks passing.</desc>
  <defs><marker id="m0301b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="12" y="14" width="136" height="120" rx="8"/>
  <text class="dg-tb" x="24" y="36">1 Launch</text><text class="dg-ts" x="24" y="58">RunInstances</text><text class="dg-ts" x="24" y="74">AMI + type + role</text><text class="dg-ts" x="24" y="90">key pair, SGs</text><text class="dg-ts" x="24" y="106">user data ≤ 16 KB</text>
  <rect class="dg-box" x="162" y="14" width="136" height="120" rx="8"/>
  <text class="dg-tb" x="174" y="36">2 Boot</text><text class="dg-ts" x="174" y="58">Nitro hypervisor</text><text class="dg-ts" x="174" y="74">kernel + systemd</text><text class="dg-ts" x="174" y="90">network via DHCP</text><text class="dg-ts" x="174" y="106">EBS root mounted</text>
  <rect class="dg-edge" x="312" y="14" width="136" height="120" rx="8"/>
  <text class="dg-tb" x="324" y="36">3 cloud-init</text><text class="dg-ts" x="324" y="58">reads IMDS</text><text class="dg-ts" x="324" y="74">sets hostname</text><text class="dg-ts" x="324" y="90">installs SSH key</text><text class="dg-ts" x="324" y="106">grows root disk</text>
  <rect class="dg-edge" x="462" y="14" width="136" height="120" rx="8"/>
  <text class="dg-tb" x="474" y="36">4 User data</text><text class="dg-ts" x="474" y="58">runs as root</text><text class="dg-ts" x="474" y="74">first boot only*</text><text class="dg-ts" x="474" y="90">output logged to</text><text class="dg-ts" x="474" y="106">cloud-init-output</text>
  <rect class="dg-good" x="612" y="14" width="136" height="120" rx="8"/>
  <text class="dg-tb" x="624" y="36">5 Ready</text><text class="dg-ts" x="624" y="58">services started</text><text class="dg-ts" x="624" y="74">health checks OK</text><text class="dg-ts" x="624" y="90">ASG: InService</text><text class="dg-ts" x="624" y="106">ALB sends traffic</text>
  <path class="dg-line" d="M12 160 H746" marker-end="url(#m0301b-ar)"/>
  <text class="dg-ts" x="12" y="180">time → (seconds for stages 1–3; user data can take seconds or many minutes, depending on what it installs)</text>
  <text class="dg-ts" x="12" y="204">* Default behaviour. A cloud-config directive or a script in /var/lib/cloud/scripts/per-boot/ can run on every boot.</text>
  <text class="dg-ts" x="12" y="222">Long installs in stage 4 slow scale-out: bake software into a golden AMI so stage 4 only configures.</text>
</svg>
<figcaption>Figure M03-1b. The first-boot timeline. Knowing which stage failed tells you which log to read.</figcaption>
</figure>`;

LESSONS.push({
  id: "M03.01", title: "Linux essentials for cloud", level: 100, minutes: 55,
  objectives: [
    "Navigate the Linux filesystem, manage users, permissions, packages, processes and systemd services on an EC2 instance",
    "Connect to instances securely with SSH keys, EC2 Instance Connect or Session Manager, and choose between them",
    "Bootstrap an instance with user data and cloud-init, and read the right log when it fails",
    "Query the instance metadata service with IMDSv2 and explain why it defeats SSRF credential theft",
    "Write small, safe bash scripts and use grep, awk, sed and jq to troubleshoot"
  ],
  sections: [
    { type: "why", html: `
<p>It is 02:00 and an alarm says the checkout service is returning errors. The instances are healthy according to EC2, yet the application is down. Someone has to get onto a box, find out that <code>/var</code> is 100% full because logs were never rotated, free space safely, restart the service and make sure it never happens again. That person needs Linux.</p>
<p>Most of what runs on AWS runs on Linux: the majority of EC2 instances, every container on Fargate and EKS, and the execution environment behind AWS Lambda. Even when you never log in (the goal for production), you still write <strong>user data scripts</strong>, <strong>Dockerfiles</strong>, <strong>systemd units</strong> and <strong>CI/CD steps</strong> that are Linux shell underneath.</p>
<p>The SAA-C03 exam doesn't test shell syntax, but it repeatedly tests decisions that only make sense if you understand Linux on EC2: <em>Session Manager instead of a bastion</em>, <em>IMDSv2</em>, <em>user data for bootstrapping</em>, <em>instance roles instead of keys on disk</em>, and <em>the CloudWatch agent for memory and disk metrics</em>.</p>` },

    { type: "concept", title: "Concept: the Linux you need as an architect", html: DG_0301_BOOT + `
<h3>Distributions and AMIs</h3>
<p>A <strong>distribution</strong> (distro) is the Linux kernel plus a package manager, tools and defaults. On AWS you pick one by choosing an <strong>Amazon Machine Image (AMI)</strong>:</p>
<table>
<thead><tr><th>AMI family</th><th>Package manager</th><th>Default SSH user</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>Amazon Linux 2023</strong> (AL2023)</td><td><code>dnf</code></td><td><code>ec2-user</code></td><td>AWS-tuned, long-term supported, SSM Agent preinstalled, IMDSv2 required by default, logs in journald (no rsyslog by default)</td></tr>
<tr><td>Amazon Linux 2</td><td><code>yum</code></td><td><code>ec2-user</code></td><td>Older generation, approaching end of support: plan migrations to AL2023</td></tr>
<tr><td>Ubuntu</td><td><code>apt</code></td><td><code>ubuntu</code></td><td>Popular for developer tooling and ML; SSM Agent preinstalled (snap)</td></tr>
<tr><td>Red Hat Enterprise Linux</td><td><code>dnf</code></td><td><code>ec2-user</code></td><td>Enterprise support; licence included in the hourly price or BYOL</td></tr>
<tr><td>Debian</td><td><code>apt</code></td><td><code>admin</code></td><td>Minimal and stable</td></tr>
</tbody></table>

<h3>The filesystem hierarchy</h3>
<p>Everything in Linux is a file under a single tree that starts at <code>/</code>. Extra disks are <em>mounted</em> into that tree; there are no drive letters.</p>
<table>
<thead><tr><th>Path</th><th>Contains</th><th>Why an architect cares</th></tr></thead>
<tbody>
<tr><td><code>/etc</code></td><td>System configuration (<code>/etc/fstab</code>, <code>/etc/ssh/sshd_config</code>, <code>/etc/systemd/system</code>)</td><td>What config management and golden AMIs change</td></tr>
<tr><td><code>/var/log</code></td><td>Log files (<code>cloud-init-output.log</code>, <code>nginx/</code>, <code>secure</code> or <code>auth.log</code>)</td><td>Fills up the disk if not rotated or shipped</td></tr>
<tr><td><code>/home</code></td><td>User home directories, including <code>~/.ssh/authorized_keys</code></td><td>Where SSH public keys live</td></tr>
<tr><td><code>/opt</code>, <code>/usr/local</code></td><td>Third-party and locally installed software</td><td>Typical install location for your app</td></tr>
<tr><td><code>/tmp</code></td><td>Temporary files, often cleared on reboot</td><td>Never store state here</td></tr>
<tr><td><code>/proc</code>, <code>/sys</code></td><td>Virtual files exposing kernel and process information</td><td><code>/proc/meminfo</code>, <code>/proc/cpuinfo</code> for quick checks</td></tr>
<tr><td><code>/dev</code></td><td>Device files: <code>/dev/nvme0n1</code> is the root EBS volume on Nitro instances</td><td>EBS volumes appear here before you format and mount them</td></tr>
</tbody></table>
<div class="callout"><strong>EBS on Nitro instances:</strong> you attach a volume as <code>/dev/sdf</code> in the console, but the OS sees an NVMe device such as <code>/dev/nvme1n1</code>, and the numbering can change between boots. Always mount by <strong>UUID</strong> in <code>/etc/fstab</code> and add <code>nofail</code> so the instance still boots if the volume is missing.</div>

<h3>Users, groups and sudo</h3>
<p>Every process runs as a <strong>user</strong>; users belong to <strong>groups</strong>. <code>root</code> (UID 0) can do anything. On EC2 you log in as the default user (<code>ec2-user</code>, <code>ubuntu</code>) and use <code>sudo</code> to run individual commands as root. Applications should run as their own unprivileged user (for example <code>nginx</code> or <code>appuser</code>), so a compromise of the app doesn't hand over the whole machine. This is <strong>least privilege</strong> at the OS level, the same principle IAM applies to AWS APIs (M05).</p>

<h3>Permissions: rwx and octal</h3>
<p>Each file has an <strong>owner</strong>, a <strong>group</strong> and permissions for three classes: <strong>u</strong>ser (owner), <strong>g</strong>roup and <strong>o</strong>thers. Each class gets <strong>r</strong>ead (4), <strong>w</strong>rite (2) and e<strong>x</strong>ecute (1). Add the numbers per class to get the octal form.</p>
<table>
<thead><tr><th>Symbolic</th><th>Octal</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><code>-rw-r--r--</code></td><td>644</td><td>Normal files and config: owner writes, everyone reads</td></tr>
<tr><td><code>-rwxr-xr-x</code></td><td>755</td><td>Scripts, programs and directories</td></tr>
<tr><td><code>-rw-------</code></td><td>600</td><td>Secrets readable and writable only by the owner (<code>~/.ssh/config</code>, <code>authorized_keys</code>)</td></tr>
<tr><td><code>-r--------</code></td><td>400</td><td>SSH private keys (<code>key.pem</code>): owner read only</td></tr>
<tr><td><code>-rw-r-----</code></td><td>640</td><td>Log or config files readable by a group (for example a log-shipping agent)</td></tr>
</tbody></table>
<p>For directories, <code>x</code> means "may enter". <strong>umask</strong> removes permissions from new files: with the common <code>umask 022</code>, new files get 644 and new directories 755. SSH deliberately refuses to use a private key that others can read and prints <code>WARNING: UNPROTECTED PRIVATE KEY FILE!</code>. That is why every EC2 tutorial starts with <code>chmod 400 key.pem</code>.</p>

<h3>Processes, signals and services</h3>
<p>A <strong>process</strong> is a running program with a PID, an owner and resource usage. You inspect them with <code>ps aux</code>, <code>top</code> or <code>htop</code>, and send them <strong>signals</strong>:</p>
<ul>
<li><code>SIGTERM</code> (15, the default of <code>kill</code>): "please shut down cleanly". Well-written apps finish in-flight requests. ECS, Kubernetes and systemd send this first on shutdown.</li>
<li><code>SIGKILL</code> (9): immediate, cannot be caught. A last resort; the kernel's out-of-memory (OOM) killer also uses it.</li>
<li><code>SIGHUP</code> (1): conventionally "reload your configuration" (nginx, many daemons).</li>
</ul>
<p><strong>systemd</strong> is the init system (PID 1) on all modern distros. It starts services in dependency order at boot, restarts them if they crash and collects their logs in the <strong>journal</strong>. Each service is described by a <strong>unit file</strong>. You control units with <code>systemctl</code> and read their logs with <code>journalctl</code>.</p>

<h3>Packages</h3>
<p>Software comes from signed <strong>repositories</strong> through a package manager: <code>dnf</code> on AL2023 and RHEL, <code>apt</code> on Ubuntu and Debian. Packages bring dependency resolution, updates and clean removal. In a private subnet, the instance needs a path to the repository: a NAT gateway, a proxy, or (for AL2023, whose repositories are hosted in S3) an S3 gateway endpoint.</p>

<h3>Logs</h3>
<p>Two logging systems coexist. <strong>journald</strong> (part of systemd) stores structured logs for every unit: read them with <code>journalctl</code>. <strong>Text log files</strong> under <code>/var/log</code> are written by rsyslog (<code>/var/log/messages</code> on RHEL-family, <code>/var/log/syslog</code> on Ubuntu) or by applications directly. AL2023 ships without rsyslog, so its system logs are in the journal only. Logs on a single instance disappear when the instance is terminated, which is why production fleets <strong>ship logs off the box</strong> with the CloudWatch agent (M30).</p>

<h3>The instance metadata service (IMDS)</h3>
<p>Every EC2 instance can query a link-local HTTP endpoint at <code>169.254.169.254</code> (and <code>fd00:ec2::254</code> over IPv6 on Nitro) to learn about itself: instance ID, AZ, private IP, user data and, most importantly, the <strong>temporary credentials of its IAM role</strong>. The AWS SDKs and CLI read those credentials automatically. Only the instance itself can reach this address.</p>
<p><strong>IMDSv2</strong> adds a session token: a client must first send a <code>PUT</code> request with a TTL header to get a token, then send that token as a header on every <code>GET</code>. This defeats most <strong>server-side request forgery (SSRF)</strong> attacks, where an attacker tricks a vulnerable web app into fetching a URL for them: such bugs usually allow only simple GETs without custom headers. IMDSv2 also refuses token requests that carry an <code>X-Forwarded-For</code> header (so open proxies can't fetch tokens) and, by default, tokens can't travel more than one network hop (the <strong>hop limit</strong>), which stops containers from using the host's token unless you raise it to 2.</p>

<h3>User data and cloud-init</h3>
<p><strong>User data</strong> is up to 16 KB of text you supply at launch. <strong>cloud-init</strong>, preinstalled in the AWS Linux AMIs, reads it from IMDS during the first boot. If it starts with <code>#!</code> it runs as a script, <strong>as root</strong>, <strong>once</strong>; if it starts with <code>#cloud-config</code> it is declarative YAML (packages, files, users). Its output goes to <code>/var/log/cloud-init-output.log</code>. User data is <strong>not secret</strong>: anyone who can reach IMDS on the instance, or who has <code>ec2:DescribeInstanceAttribute</code>, can read it.</p>` },

    { type: "concept", title: "Concept: SSH and the keyless alternatives", html: DG_0301_ACCESS + `
<h3>How SSH key authentication works</h3>
<p>SSH (Secure Shell, TCP 22) gives you an encrypted remote shell. With key authentication you hold a <strong>private key</strong>; the server holds the matching <strong>public key</strong> in <code>~/.ssh/authorized_keys</code>. During login the server sends a challenge that only the private key can sign, so the private key never crosses the network. When you create an EC2 key pair, AWS keeps only the public key; cloud-init writes it into the default user's <code>authorized_keys</code> on first boot. Lose the private key and AWS can't give it back.</p>
<ul>
<li><strong>Key types:</strong> EC2 supports RSA and ED25519 for Linux (ED25519 is shorter and modern; Windows instances need RSA). Generate your own with <code>ssh-keygen -t ed25519</code> and import the public half if you prefer.</li>
<li><strong>known_hosts:</strong> on first connection SSH records the server's host key. A later mismatch triggers a loud warning, which can mean a man-in-the-middle, or simply that a new instance reused an IP. Verify, don't blindly delete.</li>
<li><strong>~/.ssh/config:</strong> saves typing (host aliases, users, key files, <code>ProxyJump</code> through a bastion).</li>
<li><strong>Agent forwarding (<code>ssh -A</code>):</strong> lets you hop onward with keys from your laptop, but anyone with root on the intermediate host can use your agent while you're connected. Prefer <code>ProxyJump</code> (<code>ssh -J</code>), which keeps keys local.</li>
</ul>

<h3>Three ways in, compared</h3>
<table>
<thead><tr><th></th><th>SSH with key pair</th><th>EC2 Instance Connect</th><th>Session Manager (Systems Manager)</th></tr></thead>
<tbody>
<tr><td>Inbound port needed</td><td>22</td><td>22 (from the EIC service range, or via an EC2 Instance Connect Endpoint for private instances)</td><td><strong>None</strong></td></tr>
<tr><td>Long-lived keys</td><td>Yes, you distribute and rotate them</td><td>No: a one-time public key is pushed via the API and valid for 60 seconds</td><td>No keys at all</td></tr>
<tr><td>Who may connect</td><td>Whoever holds the key</td><td>IAM (<code>ec2-instance-connect:SendSSHPublicKey</code>)</td><td>IAM (<code>ssm:StartSession</code>, can be scoped by tags)</td></tr>
<tr><td>Audit</td><td>Server logs only</td><td>CloudTrail records the key push</td><td>CloudTrail plus full session logs to CloudWatch Logs or S3</td></tr>
<tr><td>Requirements</td><td>Network path and SG rule</td><td>EIC package on the AMI (AL2023, Ubuntu)</td><td>SSM Agent, instance profile with <code>AmazonSSMManagedInstanceCore</code>, outbound 443 (NAT or VPC endpoints)</td></tr>
<tr><td>Extras</td><td>Port forwarding, SCP</td><td>Browser-based shell in the console</td><td>Port forwarding (for example to an RDS database), Run Command, works for Windows too</td></tr>
</tbody></table>

<h3>Shell scripting essentials</h3>
<p>Bash scripts automate everything from user data to CI steps. The minimum safe skeleton:</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail          # -e: stop on error  -u: undefined vars are errors  pipefail: a failing pipe stage fails the pipe
IFS=$'\\n\\t'

REGION="eu-west-1"
for bucket in $(aws s3api list-buckets --query 'Buckets[].Name' --output text | tr '\\t' '\\n'); do
  echo "checking $bucket"
done

if ! command -v jq &gt;/dev/null; then
  echo "jq is required" &gt;&amp;2
  exit 1                   # non-zero exit = failure; CI systems and systemd act on this
fi</code></pre>
<p><strong>Exit codes</strong> are how programs report success: <code>0</code> means success, anything else is failure. Some you'll meet constantly: <code>1</code> general error, <code>126</code> not executable, <code>127</code> command not found, <code>130</code> interrupted with Ctrl-C (128 + signal 2), <code>137</code> killed with SIGKILL (128 + 9, typically the OOM killer in a container), <code>143</code> terminated with SIGTERM (128 + 15). <code>echo $?</code> prints the last exit code.</p>
<p><strong>Scheduling:</strong> <code>cron</code> (<code>crontab -e</code>, five time fields) is universal; <strong>systemd timers</strong> add logging in the journal, dependency handling and catch-up after downtime. AL2023 doesn't install cron by default. On AWS, prefer <strong>EventBridge Scheduler</strong> plus Lambda or SSM Run Command for fleet-wide jobs, so a schedule doesn't depend on one server staying alive.</p>

<h3>Text-processing toolkit</h3>
<table>
<thead><tr><th>Tool</th><th>Does</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>grep</code></td><td>Find lines matching a pattern</td><td><code>grep -i " 5[0-9][0-9] " access.log | wc -l</code> (count 5xx responses)</td></tr>
<tr><td><code>awk</code></td><td>Split lines into fields and compute</td><td><code>awk '{print $1}' access.log | sort | uniq -c | sort -rn | head</code> (top client IPs)</td></tr>
<tr><td><code>sed</code></td><td>Stream edit / substitute</td><td><code>sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config</code></td></tr>
<tr><td><code>jq</code></td><td>Query and reshape JSON</td><td><code>aws ec2 describe-instances | jq -r '.Reservations[].Instances[].InstanceId'</code></td></tr>
<tr><td><code>less</code>, <code>tail -f</code></td><td>Page through or follow a file</td><td><code>tail -f /var/log/nginx/error.log</code></td></tr>
</tbody></table>` },

    { type: "workflow", title: "Workflows: first ten minutes on an instance, and bootstrapping with user data", html: `
<h3>A. Your first ten minutes on a new EC2 Linux instance</h3>
<ol class="flow">
<li><strong>Connect without opening port 22.</strong> In the console choose <em>Connect → Session Manager</em>, or from the CLI run <code>aws ssm start-session --target i-0abc...</code>. If the instance doesn't appear in Fleet Manager, check the three prerequisites: SSM Agent running, an instance profile with <code>AmazonSSMManagedInstanceCore</code>, and an outbound path on 443.</li>
<li><strong>Orient yourself.</strong> <code>whoami</code>, <code>hostnamectl</code>, <code>cat /etc/os-release</code>, <code>uptime</code>. Session Manager logs you in as <code>ssm-user</code>; use <code>sudo -i</code> only when needed.</li>
<li><strong>Check resources.</strong> <code>nproc</code> and <code>free -h</code> (CPU and memory), <code>df -h</code> (disk space per mount), <code>df -i</code> (inodes: millions of tiny files can exhaust them while space remains), <code>lsblk</code> (block devices and mounts).</li>
<li><strong>Check identity and metadata.</strong> Get an IMDSv2 token and read the instance ID, AZ and role name (see Worked examples). <code>aws sts get-caller-identity</code> confirms which role the CLI is using.</li>
<li><strong>Check services.</strong> <code>systemctl --failed</code> lists crashed units; <code>systemctl status nginx</code> shows state plus recent log lines.</li>
<li><strong>Check the network.</strong> <code>ip -br addr</code> and <code>ip route</code> (private IP, default gateway = subnet base + 1), <code>ss -tlnp</code> (which ports are listening, and on which address: <code>127.0.0.1</code> means local only), <code>curl -sI https://aws.amazon.com</code> (is there outbound internet?).</li>
<li><strong>Check logs.</strong> <code>journalctl -p err -b</code> (errors since boot), <code>sudo tail -n 50 /var/log/cloud-init-output.log</code> (did user data succeed?).</li>
<li><strong>Write down what you changed</strong> and turn it into code (user data, AMI, SSM document). A manual fix on one instance disappears when Auto Scaling replaces it.</li>
</ol>

<h3>B. Bootstrapping an instance with user data</h3>
<ol class="flow">
<li><strong>Write the script</strong> (or cloud-config) and test it on a throwaway instance or container first. Make it <strong>idempotent</strong> (safe to run twice) and start it with <code>set -euo pipefail</code> so it fails loudly.</li>
<li><strong>Keep secrets out.</strong> Fetch them at runtime from Secrets Manager or Parameter Store using the instance role, never embed them.</li>
<li><strong>Launch</strong> with <code>--user-data file://bootstrap.sh</code>, or put it in a <strong>launch template</strong> so every Auto Scaling instance gets it. The CLI base64-encodes it for you.</li>
<li><strong>cloud-init runs it</strong> on first boot, as root, after networking is up. The instance can be "running" (and even pass EC2 status checks) while user data is still installing software.</li>
<li><strong>Signal readiness.</strong> Your load balancer health check, not the EC2 state, should decide when traffic arrives. For CloudFormation, use <code>cfn-signal</code> with a creation policy; for Auto Scaling, a lifecycle hook or a sufficient health-check grace period.</li>
<li><strong>Verify</strong> with <code>/var/log/cloud-init-output.log</code> and <code>cloud-init status --long</code>. Debug failures from there.</li>
<li><strong>Graduate</strong> to a golden AMI (EC2 Image Builder) when the script grows long or slow: bake the software in, keep only environment-specific configuration in user data.</li>
</ol>` },

    { type: "aws", html: `
<table>
<thead><tr><th>Linux concept</th><th>AWS feature</th><th>Exam-relevant detail</th></tr></thead>
<tbody>
<tr><td>OS image</td><td>AMI (Amazon Linux 2023, Ubuntu, RHEL, Marketplace, your own)</td><td>AMIs are Regional; copy them to other Regions for DR. Golden AMIs are built with EC2 Image Builder.</td></tr>
<tr><td>Bootstrap script</td><td>User data + cloud-init, launch templates</td><td>Runs as root on first boot; max 16 KB; visible via IMDS, so no secrets</td></tr>
<tr><td>Machine credentials</td><td>IAM role via instance profile, delivered through IMDS</td><td>Temporary, rotated automatically. Never put access keys in <code>~/.aws/credentials</code> on an instance.</td></tr>
<tr><td>Metadata endpoint</td><td>IMDSv2 (<code>HttpTokens=required</code>)</td><td>Defeats SSRF credential theft; enforce with launch templates, account-level defaults, the <code>ec2:MetadataHttpTokens</code> condition key or an SCP</td></tr>
<tr><td>Remote shell</td><td>Session Manager, EC2 Instance Connect (and its Endpoint), SSH key pairs</td><td>"No inbound ports / no bastion / audit every session" → Session Manager</td></tr>
<tr><td>Patching</td><td>Systems Manager Patch Manager, maintenance windows</td><td>Patch baselines per OS; patch groups by tag; compliance reporting (M31)</td></tr>
<tr><td>Fleet commands</td><td>Systems Manager Run Command</td><td>Run a script on hundreds of instances without SSH, with output to S3</td></tr>
<tr><td>Logs and OS metrics</td><td>CloudWatch agent</td><td>Default EC2 metrics include CPU, network and disk I/O, but <strong>not memory or disk-space utilisation</strong>: install the agent (M30)</td></tr>
<tr><td>Disks</td><td>EBS volumes (NVMe on Nitro), instance store</td><td>Instance store is ephemeral: data is lost on stop or termination (M19)</td></tr>
<tr><td>Containers</td><td>ECS, EKS, Fargate (Linux kernels underneath)</td><td>Exit code 137 in a task = killed, usually out of memory (M15)</td></tr>
</tbody></table>
<div class="callout warn"><strong>Instance profile vs keys on disk.</strong> If an exam option says "store the access key ID and secret access key in a configuration file on the instance" or "in user data", it is wrong. The right answer is an IAM role attached through an instance profile.</div>` },

    { type: "examples", html: `
<h3>Example 1: a production-style user data script (nginx)</h3>
<pre><code>#!/bin/bash
set -euo pipefail
exec &gt; &gt;(tee /var/log/user-data.log) 2&gt;&amp;1   # also keep our own copy of the output

dnf -y install nginx
TOKEN=$(curl -sS -X PUT "http://169.254.169.254/latest/api/token" \\
  -H "X-aws-ec2-metadata-token-ttl-seconds: 300")
AZ=$(curl -sS -H "X-aws-ec2-metadata-token: $TOKEN" \\
  http://169.254.169.254/latest/meta-data/placement/availability-zone)
IID=$(curl -sS -H "X-aws-ec2-metadata-token: $TOKEN" \\
  http://169.254.169.254/latest/meta-data/instance-id)

cat &gt; /usr/share/nginx/html/index.html &lt;&lt;EOF
&lt;h1&gt;Hello from $IID in $AZ&lt;/h1&gt;
EOF

systemctl enable --now nginx</code></pre>
<p>Expected tail of <code>/var/log/cloud-init-output.log</code>:</p>
<pre><code>Installed:
  nginx-1:1.24.0-1.amzn2023.0.2.x86_64   nginx-core-1:1.24.0-1.amzn2023.0.2.x86_64 ...
Complete!
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /usr/lib/systemd/system/nginx.service.
Cloud-init v. 22.2.2 finished at Tue, 07 Oct 2025 09:14:31 +0000. Datasource DataSourceEc2.  Up 38.21 seconds</code></pre>
<p>Notice: <code>set -euo pipefail</code> makes a failed install stop the script (and shows in the log) instead of silently starting a broken server; the heredoc writes a file; the metadata calls use IMDSv2.</p>

<h3>Example 2: an IMDSv2 session, step by step</h3>
<pre><code>$ TOKEN=$(curl -s -X PUT http://169.254.169.254/latest/api/token \\
    -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")      # 1. PUT → token valid 6 h
$ curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
ami-id
hostname
iam/
instance-id
instance-type
local-ipv4
placement/
...
$ curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \\
    http://169.254.169.254/latest/meta-data/iam/security-credentials/
app-server-role                                            # 2. the role name
$ curl -s http://169.254.169.254/latest/meta-data/instance-id
                                                            # 3. no token → HTTP 401 when IMDSv2 is required</code></pre>
<p>The credentials under <code>iam/security-credentials/app-server-role</code> are temporary (they include a session token and an expiry) and are refreshed automatically before they expire. That's the whole reason instance roles beat static keys.</p>

<h3>Example 3: a systemd unit for your own application</h3>
<pre><code># /etc/systemd/system/orders-api.service
[Unit]
Description=Orders API
After=network-online.target
Wants=network-online.target

[Service]
User=appuser
WorkingDirectory=/opt/orders-api
EnvironmentFile=/etc/orders-api.env
ExecStart=/opt/orders-api/bin/server --port 8080
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target</code></pre>
<pre><code>$ sudo systemctl daemon-reload            # pick up the new unit file
$ sudo systemctl enable --now orders-api  # start now and at every boot
$ systemctl status orders-api
● orders-api.service - Orders API
     Loaded: loaded (/etc/systemd/system/orders-api.service; enabled)
     Active: active (running) since Tue 2025-10-07 09:20:02 UTC; 4s ago
   Main PID: 2741 (server)
$ journalctl -u orders-api -f             # follow its logs live</code></pre>
<p>Running as <code>appuser</code> (not root), restarting on failure, and logging to the journal give you least privilege, self-healing and observability with eleven lines.</p>

<h3>Example 4: troubleshooting a full disk</h3>
<pre><code>$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  8.0G  8.0G     0 100% /                 # root volume is full
$ sudo du -xh / --max-depth=2 2&gt;/dev/null | sort -h | tail -5
1.1G    /usr/lib
1.3G    /usr
5.6G    /var/log/orders-api                              # the culprit
5.9G    /var
8.0G    /
$ sudo ls -lh /var/log/orders-api | head -3
-rw-r--r-- 1 appuser appuser 5.6G Oct  7 09:41 app.log  # one file, never rotated
$ sudo truncate -s 0 /var/log/orders-api/app.log         # free space without breaking the open file handle
$ sudo journalctl --vacuum-size=200M                     # also cap the journal</code></pre>
<p>Why <code>truncate</code> and not <code>rm</code>? If you delete a file a process still has open, the space isn't freed until the process closes it (<code>lsof +L1</code> shows such files). The permanent fixes: log rotation (<code>logrotate</code>), shipping logs to CloudWatch Logs, a disk-space alarm from the CloudWatch agent, and, if needed, growing the EBS volume online (<code>aws ec2 modify-volume</code>, then <code>growpart</code> and <code>xfs_growfs</code>).</p>

<h3>Example 5: attaching and mounting a new EBS volume</h3>
<pre><code>$ lsblk
NAME          SIZE TYPE MOUNTPOINTS
nvme0n1         8G disk
└─nvme0n1p1     8G part /
nvme1n1        20G disk                       # new, empty volume
$ sudo mkfs -t xfs /dev/nvme1n1               # format ONLY a new volume: this erases data
$ sudo mkdir /data &amp;&amp; sudo mount /dev/nvme1n1 /data
$ sudo blkid /dev/nvme1n1
/dev/nvme1n1: UUID="5c1e...a9" TYPE="xfs"
$ echo 'UUID=5c1e...a9  /data  xfs  defaults,nofail  0  2' | sudo tee -a /etc/fstab
$ sudo umount /data &amp;&amp; sudo mount -a &amp;&amp; df -h /data   # prove fstab works before you reboot</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd use</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Engineers need shell access to private instances; security forbids inbound ports and wants every command logged</td><td>Session Manager with logging to S3/CloudWatch Logs, IAM policies by tag</td><td>No port 22, no keys, IAM-controlled and fully audited</td></tr>
<tr><td>A web fleet in an Auto Scaling group must install the app and register itself at launch</td><td>Launch template with user data (or a golden AMI plus short user data)</td><td>Every new instance configures itself identically, with no human involved</td></tr>
<tr><td>Scale-out is too slow because user data compiles and installs for 10 minutes</td><td>Golden AMI built by EC2 Image Builder; optionally ASG warm pools</td><td>Moves slow work out of the launch path</td></tr>
<tr><td>Patch 400 Linux instances monthly with a compliance report</td><td>Systems Manager Patch Manager + maintenance windows</td><td>Fleet-wide, scheduled and reported, no SSH loops</td></tr>
<tr><td>Alarm when memory or disk space runs low</td><td>CloudWatch agent publishing custom metrics</td><td>The hypervisor can't see inside the guest OS; the agent can</td></tr>
<tr><td>A web app on EC2 must stop SSRF bugs from leaking role credentials</td><td>Require IMDSv2 (<code>HttpTokens=required</code>, hop limit 1)</td><td>Token-based metadata access blocks simple GET-based SSRF</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice (WSL, any Linux, or AWS CloudShell)", html: `
<p>All of this is free. CloudShell runs Amazon Linux 2023 in your browser: open it from the console toolbar.</p>
<pre><code># 1. Where am I, what is this?
cat /etc/os-release | head -3; whoami; id; uname -r

# 2. Permissions in practice
touch secret.pem; ls -l secret.pem          # note the default (umask) permissions
chmod 400 secret.pem; ls -l secret.pem      # -r-------- : owner read only
umask                                        # e.g. 0022

# 3. Processes and signals
sleep 300 &amp;                                 # start a background process
ps -o pid,user,stat,cmd -C sleep
kill %1; echo "exit code of kill: $?"

# 4. Exit codes
ls /nope; echo "ls exit code: $?"            # 2: file not found
notacommand; echo "exit code: $?"            # 127: command not found

# 5. Text tools on a fake access log
printf '10.0.1.5 GET /a 200\\n10.0.1.9 GET /b 500\\n10.0.1.5 GET /c 503\\n' &gt; access.log
grep -c ' 5[0-9][0-9]$' access.log           # how many 5xx?
awk '{print $1}' access.log | sort | uniq -c | sort -rn

# 6. JSON with jq (CloudShell has the AWS CLI configured as you)
aws ec2 describe-regions --output json | jq -r '.Regions[].RegionName' | head -5

# 7. A bash script that fails safely
cat &gt; safe.sh &lt;&lt;'EOF'
#!/usr/bin/env bash
set -euo pipefail
echo "step 1"
false                                         # simulated failure
echo "never printed"
EOF
chmod +x safe.sh; ./safe.sh; echo "script exit code: $?"</code></pre>
<p>Optional (costs cents, delete afterwards): launch a <code>t3.micro</code> Amazon Linux 2023 instance <strong>with no key pair and no inbound rules</strong>, attach a role with <code>AmazonSSMManagedInstanceCore</code>, and connect with Session Manager. Then read <code>/var/log/cloud-init-output.log</code> and try the IMDSv2 commands from Example 2. Terminate it when you're done.</p>` },

    { type: "casestudy", title: "Case study: Brightlane Logistics retires its bastions", html: `
<p><strong>Context.</strong> Brightlane Logistics runs about 300 Linux instances across 12 AWS accounts. Each team had built its own bastion host, so there were 14 bastions with port 22 open to "the office" (in practice, several home IP ranges too). Access used a handful of shared <code>.pem</code> files passed around in chat. An audit found that a contractor who had left eight months earlier still had a working key, and nobody could say which commands had been run on production database hosts.</p>
<p><strong>Requirements.</strong> (1) No inbound administrative ports anywhere. (2) Individual, revocable access tied to the corporate identity provider. (3) A record of every session and command, kept for one year. (4) Engineers must still reach private RDS databases for occasional investigations. (5) Private subnets in two accounts have no NAT gateway.</p>
<p><strong>Design.</strong></p>
<ul>
<li>Every instance gets an instance profile with <code>AmazonSSMManagedInstanceCore</code> (AL2023 and Ubuntu AMIs already include the SSM Agent).</li>
<li>In the accounts without NAT, VPC interface endpoints for <code>ssm</code>, <code>ssmmessages</code> and <code>ec2messages</code> give the agent a private outbound path (M10).</li>
<li>Access is through IAM Identity Center permission sets. An IAM policy allows <code>ssm:StartSession</code> only on instances whose <code>Team</code> tag matches the engineer's team, and only production-support engineers may start sessions on <code>Env=prod</code>.</li>
<li>Session Manager preferences stream session output to an encrypted S3 bucket with a one-year lifecycle and to CloudWatch Logs; CloudTrail records who started which session.</li>
<li>Database access uses Session Manager <strong>port forwarding to a remote host</strong>: an engineer's local port 5432 is tunnelled through an instance to the RDS endpoint, so no database port is exposed beyond the VPC.</li>
<li>All security group rules for port 22 are removed, and an AWS Config rule flags any that reappear (M31).</li>
</ul>
<table>
<thead><tr><th>Measure</th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>Inbound port 22 rules</td><td>41</td><td>0</td></tr>
<tr><td>Bastion instances to patch and pay for</td><td>14</td><td>0</td></tr>
<tr><td>Offboarding an engineer</td><td>Rotate shared keys on hundreds of hosts (rarely done)</td><td>Disable the user in the identity provider: access ends immediately</td></tr>
<tr><td>Audit question "who ran what on prod-db-03?"</td><td>Unanswerable</td><td>Answered from S3 session logs in minutes</td></tr>
</tbody></table>
<p><strong>Lessons learned.</strong> The agent's outbound path was the most common rollout failure: instances in subnets without NAT or endpoints simply didn't appear in Fleet Manager. Interface endpoints are billed per AZ per hour, so the team centralised them in a shared networking VPC. And engineers adopted the change quickly once a two-line <code>~/.ssh/config</code> entry let them keep using <code>ssh</code> and <code>scp</code> through Session Manager.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>If the question says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"Secure shell access without opening inbound ports / without a bastion / with session auditing"</td><td><strong>Systems Manager Session Manager</strong></td></tr>
<tr><td>"Protect instance credentials from SSRF" or "metadata service hardening"</td><td><strong>Require IMDSv2</strong> (<code>HttpTokens=required</code>)</td></tr>
<tr><td>"Install software / configure instances automatically at launch"</td><td><strong>User data</strong> (in a launch template)</td></tr>
<tr><td>"Reduce instance launch time" or "standardised, hardened OS image"</td><td><strong>Golden AMI</strong> (EC2 Image Builder)</td></tr>
<tr><td>"Application on EC2 needs to access S3/DynamoDB"</td><td><strong>IAM role via instance profile</strong>, never stored access keys</td></tr>
<tr><td>"Monitor memory utilisation" or "disk space used"</td><td><strong>CloudWatch agent</strong> (not available as default EC2 metrics)</td></tr>
<tr><td>"Patch a fleet and report compliance"</td><td><strong>Systems Manager Patch Manager</strong></td></tr>
<tr><td>"Run a command on many instances"</td><td><strong>Systems Manager Run Command</strong></td></tr>
</tbody></table>
<p><strong>Common distractors:</strong> "store credentials in user data" (readable via IMDS); "open port 22 to 0.0.0.0/0 and rely on keys"; "use a NAT gateway for inbound access" (NAT is outbound-only); "CloudWatch default metrics show memory" (they don't).</p>` },

    { type: "architect", html: `
<ul>
<li><strong>Treat servers as cattle, not pets.</strong> If you SSH in to fix something, the fix lives on one instance until Auto Scaling replaces it. Put every change in code: user data, an Image Builder recipe, an SSM document or IaC (M36). In mature teams, interactive access to production is an alarm-worthy event.</li>
<li><strong>Immutable vs mutable.</strong> Mutable fleets are patched in place (Patch Manager); immutable fleets are replaced with a new AMI version through a rolling or blue/green deployment. Immutable is easier to reason about and roll back, at the cost of an image pipeline.</li>
<li><strong>Enforce IMDSv2 everywhere.</strong> Set the account-level default for new launches, require it in launch templates and deny <code>ec2:RunInstances</code> without it using the <code>ec2:MetadataHttpTokens</code> condition key in an SCP. Raise the hop limit to 2 only where containers on the host genuinely need IMDS.</li>
<li><strong>Logs must leave the box.</strong> An instance's local logs die with it, and a terminated Spot instance gives you two minutes' notice. Ship to CloudWatch Logs (or a central logging account) and set retention so costs don't grow forever.</li>
<li><strong>Disk-full is the most common self-inflicted outage.</strong> Rotate logs, alarm on disk usage, and size EBS volumes with headroom. gp3 volumes can be grown online without downtime.</li>
<li><strong>Troubleshooting order on a sick instance:</strong> EC2 status checks (hardware/OS reachability) → <code>systemctl --failed</code> → <code>journalctl -p err -b</code> → app logs → <code>df -h</code> / <code>free -h</code> / <code>top</code> → <code>ss -tlnp</code> and security groups. If the instance won't boot at all, use the EC2 serial console or <em>Get system log</em> in the console.</li>
</ul>` },

    { type: "summary", html: `
<ul>
<li>Most AWS compute is Linux: AL2023 uses <code>dnf</code> and <code>ec2-user</code>; Ubuntu uses <code>apt</code> and <code>ubuntu</code>.</li>
<li>Permissions are rwx for user/group/others; octal 644 for files, 755 for scripts, 400 for SSH private keys.</li>
<li>systemd starts, restarts and logs services: <code>systemctl</code> to control, <code>journalctl -u</code> to read logs.</li>
<li>Mount EBS volumes by UUID with <code>nofail</code>; NVMe device names can change.</li>
<li>User data runs once, as root, on first boot via cloud-init; output in <code>/var/log/cloud-init-output.log</code>; never put secrets in it.</li>
<li>IMDS at 169.254.169.254 serves metadata and role credentials; IMDSv2 (PUT for a token, then GET with it) defeats SSRF.</li>
<li>Session Manager gives shell access with no inbound ports, no keys, IAM authorisation and full session logging.</li>
<li>Memory and disk-space metrics need the CloudWatch agent.</li>
<li>Start scripts with <code>set -euo pipefail</code>; exit code 0 = success, 127 = not found, 137 = killed (often OOM).</li>
<li>Prefer golden AMIs and code over hand-fixed servers.</li>
</ul>` }
  ],
  drills: [
    { id: "M03.01-d1", q: "What is the octal form of the permissions <code>-rw-r--r--</code>?", answers: ["644", "0644"], hint: "r=4, w=2, x=1. Add per class: user, group, others.", explain: "User rw- = 4+2 = 6, group r-- = 4, others r-- = 4 → 644." },
    { id: "M03.01-d2", q: "Which octal permission should an SSH private key file have so that only its owner can read it (and nobody can write)?", answers: ["400", "0400"], hint: "Owner gets r only; group and others get nothing.", explain: "400 = r-------- . 600 also works with SSH, but 400 is the strict, conventional choice." },
    { id: "M03.01-d3", q: "With <code>umask 027</code>, what permissions (octal) does a newly created regular file get? (Files start from 666.)", answers: ["640", "0640"], hint: "Remove the umask bits from 666.", explain: "666 minus 027 per digit: 6−0 = 6, 6−2 = 4, 6−7 → 0. Result 640 (rw-r-----)." },
    { id: "M03.01-d4", q: "What IPv4 address does the EC2 instance metadata service listen on?", answers: ["169.254.169.254"], explain: "A link-local address reachable only from the instance itself." },
    { id: "M03.01-d5", q: "A shell prints <code>bash: terraform: command not found</code>. What exit code does <code>echo $?</code> show?", answers: ["127"], explain: "127 = command not found. 126 = found but not executable." },
    { id: "M03.01-d6", q: "An ECS task stops with exit code 137. Which signal number killed it? (137 = 128 + signal)", answers: ["9", "sigkill", "kill"], explain: "137 − 128 = 9 = SIGKILL, most often the out-of-memory killer when a container exceeds its memory limit." },
    { id: "M03.01-d7", q: "Which log file shows the output of a user data script on Amazon Linux? (full path)", answers: ["/var/log/cloud-init-output.log"], explain: "cloud-init writes the stdout/stderr of user data scripts there. <code>/var/log/cloud-init.log</code> has cloud-init's own debug log." },
    { id: "M03.01-d8", q: "Write the command that follows (live) the journal logs of the systemd unit <code>nginx</code>.", answers: ["journalctl -u nginx -f", "journalctl -fu nginx", "journalctl -f -u nginx", "journalctl -u nginx.service -f", "journalctl -f -u nginx.service", "sudo journalctl -u nginx -f", "sudo journalctl -fu nginx"], hint: "journalctl, a unit flag and a follow flag.", explain: "<code>-u</code> selects the unit, <code>-f</code> follows like <code>tail -f</code>." },
    { id: "M03.01-d9", q: "What is the default SSH user name on an Amazon Linux 2023 instance?", answers: ["ec2-user"], explain: "Ubuntu uses <code>ubuntu</code>, Debian <code>admin</code>." }
  ],
  check: [
    { id: "M03.01-k1", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A security team requires that administrators can open interactive shells on Linux instances in private subnets. No inbound ports may be opened, no SSH keys may be distributed, and every session must be logged. Which solution meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Use AWS Systems Manager Session Manager with an instance profile that includes AmazonSSMManagedInstanceCore, and configure session logging to Amazon S3", c: true, why: "The SSM Agent connects outbound, IAM controls access, there are no keys, and session output can be logged to S3 or CloudWatch Logs." },
        { t: "Deploy a hardened bastion host in a public subnet and allow port 22 only from the corporate IP range", c: false, why: "That opens an inbound port, still requires keys and adds a server to patch." },
        { t: "Use EC2 Instance Connect from the console", c: false, why: "It removes long-lived keys but still needs port 22 reachable on the instance (directly or via an EIC Endpoint) and doesn't log session content." },
        { t: "Store a shared SSH key in AWS Secrets Manager and rotate it weekly", c: false, why: "Keys are still distributed, port 22 must be open, and there is no per-user session audit." }
      ] },
    { id: "M03.01-k2", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A penetration test shows that a server-side request forgery (SSRF) flaw in a web application on EC2 can be used to read the instance's IAM role credentials. What is the MOST effective mitigation at the instance level?",
      options: [
        { t: "Configure the instances to require IMDSv2 (HttpTokens = required) with a hop limit of 1", c: true, why: "IMDSv2 requires a PUT to obtain a session token and a custom header on every request, which simple SSRF GET requests can't supply." },
        { t: "Remove the IAM role and store access keys in the application's configuration file", c: false, why: "Static keys on disk are worse: they never expire and can be stolen through the same vulnerability." },
        { t: "Block port 80 in the instance's security group", c: false, why: "IMDS traffic doesn't pass through security groups, and blocking the web port breaks the application." },
        { t: "Move the instance to a private subnet", c: false, why: "The SSRF is triggered through the application itself; subnet placement doesn't affect access to 169.254.169.254." }
      ] },
    { id: "M03.01-k3", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "An operations team wants to scale an Auto Scaling group based on the memory utilisation of its Linux instances. The metric isn't available in CloudWatch. What should they do?",
      options: [
        { t: "Install and configure the CloudWatch agent on the instances to publish memory metrics", c: true, why: "The hypervisor can't see guest memory usage; the CloudWatch agent reads it inside the OS and publishes a custom metric that a scaling policy can use." },
        { t: "Enable detailed monitoring on the instances", c: false, why: "Detailed monitoring increases the frequency of default metrics to 1 minute but doesn't add memory." },
        { t: "Enable VPC Flow Logs", c: false, why: "Flow Logs capture network traffic metadata, not memory." },
        { t: "Use the EC2 status check metrics", c: false, why: "Status checks report reachability and hardware/OS health, not memory usage." }
      ] },
    { id: "M03.01-k4", type: "single", domain: "D1", task: "1.2", level: 100,
      stem: "An application running on EC2 must upload files to an S3 bucket. How should the application obtain AWS credentials?",
      options: [
        { t: "Attach an IAM role to the instance through an instance profile and let the SDK obtain temporary credentials from the instance metadata service", c: true, why: "Temporary credentials are rotated automatically and never stored on disk; the SDK finds them through the default credential chain." },
        { t: "Create an IAM user and store its access keys in ~/.aws/credentials on the instance", c: false, why: "Long-lived keys on disk can leak and must be rotated manually." },
        { t: "Pass the access keys in the instance's user data", c: false, why: "User data is readable by anyone with access to the instance metadata or DescribeInstanceAttribute." },
        { t: "Use the root user's access keys", c: false, why: "Never use root credentials for applications." }
      ] },
    { id: "M03.01-k5", type: "multi", domain: "D2", task: "2.1", level: 300,
      stem: "New instances in an Auto Scaling group take 12 minutes to become healthy because the user data script downloads and compiles dependencies. Traffic spikes are being dropped while instances launch. Which actions will MOST reduce the time for new capacity to serve traffic?",
      options: [
        { t: "Build a golden AMI with the dependencies preinstalled (for example with EC2 Image Builder) and keep only configuration in user data", c: true, why: "Moving the slow work into the image removes it from the launch path." },
        { t: "Configure a warm pool for the Auto Scaling group", c: true, why: "Warm pools keep pre-initialised instances stopped or running, so scale-out uses instances that have already finished bootstrapping." },
        { t: "Reduce the health check grace period to 0 seconds", c: false, why: "Instances would be judged unhealthy before they are ready and replaced in a loop." },
        { t: "Move the user data script into a cron job that runs every minute", c: false, why: "The work still has to happen on each new instance; cron doesn't make it faster." },
        { t: "Use a larger instance type with more network bandwidth", c: false, why: "It may shave a little time but doesn't address the root cause, and it increases cost." }
      ] },
    { id: "M03.01-k6", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "A developer put a database password in an EC2 launch template's user data so the application can read it at boot. Why is this a security problem, and what is the better approach?",
      options: [
        { t: "User data is retrievable from the instance metadata service and through the EC2 API; store the password in AWS Secrets Manager and retrieve it at boot with the instance role", c: true, why: "User data isn't a secret store. Secrets Manager (or Parameter Store SecureString) keeps it encrypted and access-controlled by IAM." },
        { t: "User data is limited to 16 KB, so long passwords are truncated; use a shorter password", c: false, why: "The size limit is real but irrelevant; the problem is exposure." },
        { t: "User data is sent in plain text over the internet to the instance; enable TLS on the launch template", c: false, why: "User data is delivered through IMDS inside AWS; there is no TLS option, and transport isn't the main risk." },
        { t: "User data only runs on the first boot, so the password will be lost after a reboot; store it in /etc/fstab instead", c: false, why: "fstab is for filesystem mounts and is world-readable; that would make things worse." }
      ] }
  ],
  cards: ["fc-M03-1-01", "fc-M03-1-02", "fc-M03-1-03", "fc-M03-1-04", "fc-M03-1-05", "fc-M03-1-06", "fc-M03-1-07", "fc-M03-1-08", "fc-M03-1-09", "fc-M03-1-10", "fc-M03-1-11", "fc-M03-1-12"],
  references: [
    "<em>Hands-On AWS CDK</em> ch.1 \"Set Up Your Local Development Environment\" (PDF p32)",
    "Amazon EC2 User Guide: <em>Run commands on your Linux instance at launch</em> (user data), <em>Use IMDSv2</em>, <em>Make an Amazon EBS volume available for use</em>",
    "AWS Systems Manager User Guide: <em>Session Manager</em>, <em>Patch Manager</em>",
    "Amazon Linux 2023 User Guide: <em>Comparing AL2 and AL2023</em> (dnf, journald)",
    "Amazon CloudWatch User Guide: <em>Collect metrics and logs with the CloudWatch agent</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M03-1-01", front: "Package manager and default user: Amazon Linux 2023 vs Ubuntu?", back: "AL2023: <code>dnf</code>, <code>ec2-user</code>. Ubuntu: <code>apt</code>, <code>ubuntu</code>." },
  { id: "fc-M03-1-02", front: "Octal 644, 755, 600, 400?", back: "644 rw-r--r-- (files) · 755 rwxr-xr-x (scripts, dirs) · 600 rw------- (private config) · 400 r-------- (SSH private keys)." },
  { id: "fc-M03-1-03", front: "How do you mount an EBS volume so it survives reboots safely?", back: "Add it to <code>/etc/fstab</code> by <strong>UUID</strong> (NVMe names can change) with the <code>nofail</code> option, then test with <code>mount -a</code>." },
  { id: "fc-M03-1-04", front: "SIGTERM vs SIGKILL?", back: "SIGTERM (15): polite request to shut down; can be handled. SIGKILL (9): immediate, can't be caught. Exit code 137 = 128 + 9." },
  { id: "fc-M03-1-05", front: "systemctl vs journalctl?", back: "<code>systemctl</code> controls units (start/stop/enable/status). <code>journalctl -u unit -f</code> reads and follows their logs." },
  { id: "fc-M03-1-06", front: "User data: when, as whom, where logged?", back: "On first boot (by default), as root, via cloud-init. Output in <code>/var/log/cloud-init-output.log</code>. Max 16 KB. Not secret." },
  { id: "fc-M03-1-07", front: "IMDSv2 in two steps?", back: "1) <code>PUT /latest/api/token</code> with a TTL header → token. 2) <code>GET</code> metadata with header <code>X-aws-ec2-metadata-token</code>. Defeats SSRF." },
  { id: "fc-M03-1-08", front: "Session Manager prerequisites?", back: "SSM Agent on the instance, an instance profile with <code>AmazonSSMManagedInstanceCore</code>, and outbound HTTPS to Systems Manager (NAT or VPC interface endpoints). No inbound ports." },
  { id: "fc-M03-1-09", front: "EC2 Instance Connect: how does it work?", back: "Pushes a one-time SSH public key via the API, valid 60 seconds. IAM controls who can push. Port 22 must still be reachable (or use an EIC Endpoint)." },
  { id: "fc-M03-1-10", front: "Which EC2 metrics need the CloudWatch agent?", back: "Memory utilisation and disk-space (filesystem) utilisation, plus OS/app logs. Default metrics: CPU, network, disk I/O, status checks." },
  { id: "fc-M03-1-11", front: "What does <code>set -euo pipefail</code> do?", back: "-e exit on error · -u error on undefined variables · pipefail a failure anywhere in a pipe fails the pipe. Makes scripts fail loudly." },
  { id: "fc-M03-1-12", front: "Golden AMI vs long user data?", back: "Golden AMI (EC2 Image Builder): software baked in, fast and consistent launches. User data: flexible but slows scale-out if it installs a lot." }
);
// ================================================================== 02_cli.js
/* ---------------------------------------------------------------- M03.02 AWS CLI in depth */
var DG_0302_CHAIN = `
<figure>
<svg class="diagram" viewBox="0 0 760 440" role="img" aria-labelledby="m0302at m0302ad">
  <title id="m0302at">AWS CLI credential provider chain</title>
  <desc id="m0302ad">The CLI checks credential sources in a fixed order and stops at the first one that supplies credentials: command-line options, environment variables, web identity token, IAM Identity Center (SSO) profile, shared credentials file, credential_process, config file role or keys, container credentials, and finally the EC2 instance profile through the instance metadata service. If none supplies credentials, the command fails with "Unable to locate credentials".</desc>
  <defs><marker id="m0302a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <text class="dg-ta" x="20" y="22">Checked top to bottom · the FIRST source that returns credentials wins</text>

  <rect class="dg-edge" x="20" y="34" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="56">1 · Command-line options (--profile)</text>
  <rect class="dg-edge" x="20" y="78" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="100">2 · Environment variables</text>
  <rect class="dg-box" x="20" y="122" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="144">3 · Assume role / web identity</text>
  <rect class="dg-good" x="20" y="166" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="188">4 · IAM Identity Center (SSO) profile</text>
  <rect class="dg-box" x="20" y="210" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="232">5 · Shared credentials file</text>
  <rect class="dg-box" x="20" y="254" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="276">6 · credential_process</text>
  <rect class="dg-box" x="20" y="298" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="320">7 · Config file (static keys)</text>
  <rect class="dg-info" x="20" y="342" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="364">8 · Container credentials (ECS)</text>
  <rect class="dg-info" x="20" y="386" width="300" height="34" rx="6"/><text class="dg-t" x="32" y="408">9 · EC2 instance profile (IMDS)</text>

  <text class="dg-ts" x="340" y="48">e.g. --profile prod overrides AWS_PROFILE</text>
  <text class="dg-ts" x="340" y="62">and env-var keys</text>
  <text class="dg-ts" x="340" y="92">AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY</text>
  <text class="dg-ts" x="340" y="106">(+ AWS_SESSION_TOKEN), or AWS_PROFILE</text>
  <text class="dg-ts" x="340" y="144">role_arn + source_profile, or web identity (EKS, CI)</text>
  <text class="dg-ts" x="340" y="182">sso_session + sso_account_id + sso_role_name</text>
  <text class="dg-ts" x="340" y="196">→ recommended for humans</text>
  <text class="dg-ts" x="340" y="232">~/.aws/credentials (long-lived keys: avoid)</text>
  <text class="dg-ts" x="340" y="276">external program prints temporary credentials</text>
  <text class="dg-ts" x="340" y="320">aws_access_key_id in ~/.aws/config (avoid)</text>
  <text class="dg-ts" x="340" y="358">task role via AWS_CONTAINER_CREDENTIALS_*</text>
  <text class="dg-ts" x="340" y="372">→ recommended for ECS workloads</text>
  <text class="dg-ts" x="340" y="402">169.254.169.254 (IMDSv2 token first)</text>
  <text class="dg-ts" x="340" y="416">→ recommended for EC2 workloads</text>

  <text class="dg-ts" x="20" y="436">Nothing found → "Unable to locate credentials. You can configure credentials by running aws configure."</text>
</svg>
<figcaption>Figure M03-2a. The credential provider chain (simplified; the SDKs use the same idea). Most "wrong account" and "works on my machine" bugs come from a source higher in the chain silently winning.</figcaption>
</figure>`;

var DG_0302_SSO = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0302bt m0302bd">
  <title id="m0302bt">IAM Identity Center sign-in and an API call from the CLI</title>
  <desc id="m0302bd">The CLI starts aws sso login, which opens a browser to IAM Identity Center. After sign-in and MFA, the CLI caches an SSO access token. On each command the CLI exchanges the token for short-lived role credentials for the chosen account and permission set, signs the API request with SigV4, and the service checks IAM and logs the call in CloudTrail.</desc>
  <defs><marker id="m0302b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-info" x="10" y="30" width="150" height="76" rx="8"/>
  <text class="dg-tb" x="22" y="54">Your CLI</text>
  <text class="dg-ts" x="22" y="74">aws sso login</text>
  <text class="dg-ts" x="22" y="90">--profile dev</text>

  <rect class="dg-edge" x="220" y="30" width="200" height="76" rx="8"/>
  <text class="dg-tb" x="232" y="54">IAM Identity Center</text>
  <text class="dg-ts" x="232" y="74">browser sign-in + MFA</text>
  <text class="dg-ts" x="232" y="90">issues an SSO access token</text>

  <rect class="dg-good" x="480" y="30" width="270" height="76" rx="8"/>
  <text class="dg-tb" x="492" y="54">Token cache</text>
  <text class="dg-ts" x="492" y="74">~/.aws/sso/cache/*.json</text>
  <text class="dg-ts" x="492" y="90">valid for the portal session (hours)</text>

  <path class="dg-line" d="M160 56 H218" marker-end="url(#m0302b-ar)"/>
  <text class="dg-ts" x="166" y="48">1 login</text>
  <path class="dg-line" d="M420 68 H478" marker-end="url(#m0302b-ar)"/>
  <text class="dg-ts" x="426" y="60">2 token</text>

  <rect class="dg-box" x="10" y="150" width="200" height="76" rx="8"/>
  <text class="dg-tb" x="22" y="174">Role credentials</text>
  <text class="dg-ts" x="22" y="194">GetRoleCredentials for account</text>
  <text class="dg-ts" x="22" y="210">+ permission set (1–12 h)</text>

  <rect class="dg-box" x="270" y="150" width="200" height="76" rx="8"/>
  <text class="dg-tb" x="282" y="174">Service endpoint</text>
  <text class="dg-ts" x="282" y="194">SigV4-signed HTTPS request</text>
  <text class="dg-ts" x="282" y="210">IAM evaluates the policies</text>

  <rect class="dg-info" x="530" y="150" width="220" height="76" rx="8"/>
  <text class="dg-tb" x="542" y="174">CloudTrail</text>
  <text class="dg-ts" x="542" y="194">records who, what, when, where</text>
  <text class="dg-ts" x="542" y="210">userAgent: aws-cli/2.x …</text>

  <path class="dg-line" d="M560 106 V128 H110 V148" marker-end="url(#m0302b-ar)"/>
  <text class="dg-ts" x="240" y="122">3 each command: exchange token for role credentials</text>
  <path class="dg-line" d="M210 188 H268" marker-end="url(#m0302b-ar)"/>
  <text class="dg-ts" x="216" y="242">4 call API</text>
  <path class="dg-line" d="M470 188 H528" marker-end="url(#m0302b-ar)"/>
  <text class="dg-ts" x="478" y="242">5 audit</text>
</svg>
<figcaption>Figure M03-2b. With IAM Identity Center no long-lived secret is ever stored on the laptop: only a token that expires and role credentials that expire faster.</figcaption>
</figure>`;

LESSONS.push({
  id: "M03.02", title: "AWS CLI in depth", level: 200, minutes: 60,
  objectives: [
    "Configure named profiles for IAM Identity Center, cross-account role assumption and multiple Regions, and predict which credentials the CLI will use",
    "Write JMESPath <code>--query</code> expressions with projections, filters, multi-select and functions, and choose server-side <code>--filters</code> when they exist",
    "Control output formats, pagination, waiters, dry runs and input skeletons for reliable scripts",
    "Interpret CLI exit codes, throttling and retry behaviour, and debug failures with <code>--debug</code>",
    "Apply security practices for CLI use: short-lived credentials, least privilege and auditability"
  ],
  sections: [
    { type: "why", html: `
<p>In M01.04 you learned that every AWS action is a signed API call, and you set up one CLI profile in Lab L01. That is enough to <em>run</em> a command. Real architect work needs much more: an inventory of every instance across 17 Regions and 12 accounts before a migration workshop, a nightly check that no S3 bucket lacks encryption, a quick answer to "which security groups allow 0.0.0.0/0 on port 22?" during an incident call, or a one-line fix applied consistently to 300 resources.</p>
<p>The console can't do any of that quickly or repeatably. The AWS CLI can, but only if you can control <strong>which identity</strong> it uses, <strong>which Region</strong> it targets, <strong>how much data</strong> it pulls back and <strong>how it fails</strong>. Get these wrong and scripts quietly run against the wrong account, return half the results, or get throttled in the middle of an incident.</p>
<div class="callout"><strong>Exam relevance.</strong> SAA-C03 rarely asks about CLI syntax, but it constantly tests the ideas underneath: temporary credentials instead of access keys (Task 1.1), roles for workloads and cross-account access (1.2), least privilege, and automation over manual work (2.1). The CLI is where you live those ideas every day.</div>` },

    { type: "concept", html: `
<h3>Anatomy of a command</h3>
<pre><code>aws  ec2  describe-instances  --region eu-west-1  --filters Name=instance-state-name,Values=running  --query "…"  --output table  --profile prod
│    │    │                   └──────────────────────── parameters (operation-specific + global options) ───────────────────────────┘
│    │    └─ operation  = an API action (DescribeInstances), in kebab-case
│    └─ service         = the service's API namespace (ec2, s3api, iam, sts, …)
└─ the CLI</code></pre>
<ul>
  <li><strong>Every operation maps to one API action.</strong> <code>describe-instances</code> calls <code>DescribeInstances</code>; IAM policies and CloudTrail use the API name (<code>ec2:DescribeInstances</code>), not the CLI name.</li>
  <li><strong>Global options</strong> work on every command: <code>--profile</code>, <code>--region</code>, <code>--output</code>, <code>--query</code>, <code>--debug</code>, <code>--no-cli-pager</code>, <code>--endpoint-url</code>, <code>--cli-read-timeout</code>, <code>--cli-connect-timeout</code>.</li>
  <li><strong>High-level vs API-level commands.</strong> A few services have convenience commands on top of the raw API. The classic pair is <code>aws s3</code> (high level: <code>ls</code>, <code>cp</code>, <code>sync</code>, <code>mv</code>, <code>rm</code>, with multipart uploads and parallel transfers handled for you) versus <code>aws s3api</code> (one-to-one with the S3 API: <code>get-bucket-encryption</code>, <code>put-bucket-policy</code>, <code>list-objects-v2</code>). Use <code>s3</code> to move data, <code>s3api</code> to read or change configuration.</li>
  <li><strong>Help is built in:</strong> <code>aws ec2 help</code>, <code>aws ec2 describe-instances help</code>. With <code>--cli-auto-prompt</code> (or <code>AWS_CLI_AUTO_PROMPT=on-partial</code>) the CLI completes services, operations, parameters and even resource names interactively.</li>
</ul>

<h3>The two configuration files</h3>
<table>
<thead><tr><th>File</th><th>Holds</th><th>Section header</th><th>Guidance</th></tr></thead>
<tbody>
<tr><td><code>~/.aws/config</code></td><td>Profiles: Region, output, retry settings, SSO settings, role assumption</td><td><code>[default]</code>, <code>[profile dev]</code>, <code>[sso-session corp]</code></td><td>This is where almost everything should live</td></tr>
<tr><td><code>~/.aws/credentials</code></td><td>Static secrets: access key ID, secret key, (session token)</td><td><code>[default]</code>, <code>[dev]</code> (no "profile" prefix)</td><td>Avoid. Long-lived keys on laptops are the #1 source of leaked credentials</td></tr>
</tbody></table>
<p>On Windows the folder is <code>%USERPROFILE%\\.aws\\</code>. You can move the files with <code>AWS_CONFIG_FILE</code> and <code>AWS_SHARED_CREDENTIALS_FILE</code>.</p>

<h3>Profiles: one name per identity + account + Region combination</h3>
<pre><code># ~/.aws/config
[sso-session corp]
sso_start_url = https://d-1234567890.awsapps.com/start
sso_region = eu-west-1
sso_registration_scopes = sso:account:access

[profile dev]                      # human access to the dev account through IAM Identity Center
sso_session = corp
sso_account_id = 111111111111
sso_role_name = PowerUserAccess
region = eu-west-1
output = json

[profile prod-readonly]            # same login, different account and permission set
sso_session = corp
sso_account_id = 222222222222
sso_role_name = ReadOnlyAccess
region = eu-west-1

[profile audit]                    # role chaining: start from dev, assume a role in the audit account
role_arn = arn:aws:iam::333333333333:role/SecurityAuditor
source_profile = dev
role_session_name = priya-audit
duration_seconds = 3600
region = us-east-1

[profile legacy-tool]              # a third-party tool that prints temporary credentials as JSON
credential_process = /usr/local/bin/get-creds --account 444444444444</code></pre>
<ul>
  <li><strong><code>[sso-session]</code></strong> holds the IAM Identity Center portal once; many profiles reuse it, and one <code>aws sso login</code> serves all of them.</li>
  <li><strong><code>role_arn</code> + <code>source_profile</code></strong>: the CLI takes the source profile's credentials and calls <code>sts:AssumeRole</code> for you, caching the temporary credentials in <code>~/.aws/cli/cache/</code>. Add <code>mfa_serial</code> to require an MFA code, or <code>external_id</code> for third-party access. Instead of <code>source_profile</code>, workloads use <code>credential_source = Ec2InstanceMetadata | EcsContainer | Environment</code>.</li>
  <li><strong>Role chaining</strong> (assuming a role from credentials that are themselves from an assumed role) caps the session at <strong>1 hour</strong>, whatever the role's maximum session duration.</li>
  <li>The target role's <strong>trust policy</strong> must allow the source principal. That is the most common cause of <code>AccessDenied ... sts:AssumeRole</code>.</li>
</ul>

<h3>The credential provider chain</h3>
` + DG_0302_CHAIN + `
<p>The diagram merges two providers in step 3. The full documented order is: command-line options → environment variables → <strong>assume role</strong> (a profile with <code>role_arn</code>) → <strong>assume role with web identity</strong> → IAM Identity Center → shared credentials file → <code>credential_process</code> → config file → container credentials → EC2 instance profile.</p>
<p>Two subtleties cause most confusion:</p>
<ol>
  <li><strong>Environment-variable keys beat <code>AWS_PROFILE</code>.</strong> If an old <code>AWS_ACCESS_KEY_ID</code> is still exported in your shell, setting <code>AWS_PROFILE=prod</code> does nothing: the keys win. An explicit <code>--profile prod</code> on the command line, however, overrides both.</li>
  <li><strong>Workloads should never reach the files at all.</strong> On EC2, ECS, Lambda and EKS the right credentials come from the bottom of the chain (instance profile, task role, execution role) or from web identity (EKS IRSA / Pod Identity, CI OIDC). If you find <code>~/.aws/credentials</code> on a server, treat it as a finding.</li>
</ol>

<h3>Region resolution</h3>
<p><code>--region</code> → <code>AWS_REGION</code> → <code>AWS_DEFAULT_REGION</code> → the profile's <code>region</code>. If nothing sets it, Regional commands fail with <em>"You must specify a region"</em>. Global services still have a home: IAM and Organizations calls go to their global endpoint, and some (for example, ACM certificates for CloudFront, billing metrics) must be called in <code>us-east-1</code>.</p>` },

    { type: "workflow", title: "Signing in with IAM Identity Center and running a command", html: DG_0302_SSO + `
<ol class="flow">
  <li><strong>One-time set-up:</strong> <code>aws configure sso</code> asks for the start URL and SSO Region, opens the browser so you can pick an account and permission set, and writes the <code>[sso-session]</code> and <code>[profile]</code> blocks shown above.</li>
  <li><strong>Log in:</strong> <code>aws sso login --profile dev</code> (or <code>--sso-session corp</code>). Recent CLI versions use the browser-based authorization-code flow with PKCE; on a machine with no browser, add <code>--use-device-code</code> and type the short code shown on any other device.</li>
  <li><strong>Authenticate:</strong> you sign in to IAM Identity Center (its own directory, or an external IdP such as Entra ID or Okta) and complete MFA.</li>
  <li><strong>Token cached:</strong> the CLI stores an SSO access token (with a refresh token for <code>sso-session</code> profiles) in <code>~/.aws/sso/cache/</code>. Its lifetime follows the Identity Center session settings, typically hours.</li>
  <li><strong>Each command:</strong> the CLI resolves the profile, exchanges the token for <em>role credentials</em> for that account and permission set (the portal's <code>GetRoleCredentials</code> call), and caches them until they expire (the permission set's session duration, 1–12 hours).</li>
  <li><strong>Assume further roles if configured:</strong> for <code>[profile audit]</code> the CLI uses the <code>dev</code> credentials to call <code>sts:AssumeRole</code> into the audit account.</li>
  <li><strong>Sign and send:</strong> the request is signed with SigV4 and sent over TLS to the Regional endpoint; IAM evaluates SCPs, resource policies, identity policies and boundaries.</li>
  <li><strong>Audit:</strong> CloudTrail records the call. <code>userIdentity.arn</code> shows <code>assumed-role/AWSReservedSSO_PowerUserAccess_…/priya</code>, and <code>userAgent</code> shows <code>aws-cli/2.x</code>, so you can tell CLI activity from console activity.</li>
  <li><strong>Expiry:</strong> when the token expires, commands fail with <em>"Error when retrieving token from sso: Token has expired and refresh failed"</em>. Run <code>aws sso login</code> again; nothing else changes.</li>
</ol>
<div class="callout tip"><strong>First command when anything looks odd:</strong> <code>aws sts get-caller-identity</code> (who and which account) and <code>aws configure list</code> (which profile, Region and credential <em>source</em> the CLI resolved, such as <code>env</code>, <code>sso</code> or <code>iam-role</code>).</div>` },

    { type: "aws", title: "Output, filtering, pagination and reliability features", html: `
<h3>Output formats</h3>
<table>
<thead><tr><th><code>--output</code></th><th>Looks like</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><code>json</code> (default)</td><td>Full JSON document</td><td>Piping to <code>jq</code> or programs; saving evidence</td></tr>
<tr><td><code>yaml</code> / <code>yaml-stream</code></td><td>YAML (stream = emitted page by page)</td><td>Human reading of big nested responses; very large result sets</td></tr>
<tr><td><code>text</code></td><td>Tab-separated values, one row per item</td><td>Shell loops: <code>for id in $(aws … --output text)</code></td></tr>
<tr><td><code>table</code></td><td>ASCII table</td><td>Humans only. Never parse it.</td></tr>
</tbody></table>
<p>Set a default per profile (<code>output = json</code>) or with <code>AWS_DEFAULT_OUTPUT</code>. In scripts always state <code>--output</code> explicitly so a teammate's config can't break the parsing.</p>

<h3>Server-side <code>--filters</code> vs client-side <code>--query</code></h3>
<table>
<thead><tr><th></th><th><code>--filters</code> / <code>--filter</code> / <code>--prefix</code> (server-side)</th><th><code>--query</code> (client-side JMESPath)</th></tr></thead>
<tbody>
<tr><td>Where it runs</td><td>In the AWS service, before the response is sent</td><td>On your machine, after the CLI has received (and paginated) everything</td></tr>
<tr><td>Data transferred</td><td>Only matching items</td><td>All items</td></tr>
<tr><td>Speed and API calls</td><td>Fewer pages, fewer calls, less throttling</td><td>Every page still fetched</td></tr>
<tr><td>Availability</td><td>Only the fields the API supports (e.g. EC2 <code>instance-state-name</code>, <code>tag:env</code>)</td><td>Any field, any reshaping, functions, sorting</td></tr>
</tbody></table>
<p><strong>Rule:</strong> filter on the server when you can, then use <code>--query</code> to shape the output.</p>
<pre><code>aws ec2 describe-instances \\
  --filters Name=instance-state-name,Values=running Name=tag:env,Values=prod \\
  --query "Reservations[].Instances[].{Id:InstanceId,Type:InstanceType,AZ:Placement.AvailabilityZone}" \\
  --output table</code></pre>

<h3>JMESPath essentials</h3>
<table>
<thead><tr><th>Construct</th><th>Syntax</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Field / sub-field</td><td><code>State.Name</code></td><td>Navigate objects</td></tr>
<tr><td>Index, slice</td><td><code>[0]</code>, <code>[-1]</code>, <code>[:5]</code></td><td>Pick elements of a list</td></tr>
<tr><td>List projection</td><td><code>Instances[*].InstanceId</code></td><td>Apply the rest of the expression to every element (keeps nesting)</td></tr>
<tr><td>Flatten projection</td><td><code>Reservations[].Instances[]</code></td><td>Projects <em>and</em> flattens one level of nesting</td></tr>
<tr><td>Filter</td><td><code>[?State.Name=='running']</code></td><td>Keep elements where the condition is true; <code>==</code>, <code>!=</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>!</code></td></tr>
<tr><td>Multi-select hash</td><td><code>{Id:InstanceId,Type:InstanceType}</code></td><td>Build an object with your own keys (great for <code>table</code>)</td></tr>
<tr><td>Multi-select list</td><td><code>[InstanceId,InstanceType]</code></td><td>Build a list (one row per item in <code>text</code>)</td></tr>
<tr><td>Pipe</td><td><code>expr | [0]</code></td><td>Stop the projection and apply the next expression to the <em>whole</em> result</td></tr>
<tr><td>Current node</td><td><code>@</code></td><td>The value being processed, e.g. <code>length(@)</code></td></tr>
<tr><td>Functions</td><td><code>length()</code>, <code>sort_by(list,&amp;key)</code>, <code>max_by()</code>, <code>reverse()</code>, <code>contains()</code>, <code>starts_with()</code>, <code>join()</code>, <code>sort()</code></td><td><code>&amp;key</code> is an expression reference: "sort by this field"</td></tr>
<tr><td>Literals</td><td><code>'running'</code> (raw string), <code>\`10\`</code> (JSON literal)</td><td>Compare numbers with a JSON literal: <code>[?Size&gt;\`100\`]</code></td></tr>
</tbody></table>
<div class="callout warn"><strong>Quoting.</strong> In bash or zsh, wrap the whole expression in <strong>double quotes</strong> and use single quotes for string literals: <code>--query "Volumes[?State=='available'].VolumeId"</code>. JSON literals contain backticks, which double-quoted bash would treat as command substitution, so for those use single quotes outside: <code>--query 'Volumes[?Size&gt;\`100\`].VolumeId'</code>. In PowerShell, use single quotes outside and double the inner single quotes, or put the expression in a variable. When in doubt, test in CloudShell.</div>

<h3>Pagination</h3>
<p>Most <code>list-*</code>/<code>describe-*</code> APIs return results in pages with a <code>NextToken</code> (or <code>Marker</code>). <strong>The CLI paginates automatically</strong>: it keeps calling until there are no more pages and then shows you everything. You can tune that:</p>
<table>
<thead><tr><th>Option</th><th>What it does</th><th>Typical reason</th></tr></thead>
<tbody>
<tr><td><code>--page-size N</code></td><td>Asks for N items <em>per API call</em>; still returns <em>all</em> items</td><td>Avoid timeouts on heavy calls; gentler on throttling</td></tr>
<tr><td><code>--max-items N</code></td><td>Returns at most N items <em>in total</em>, then prints a <code>NextToken</code></td><td>Sample a huge list; process in batches</td></tr>
<tr><td><code>--starting-token T</code></td><td>Resumes from a previous <code>NextToken</code></td><td>Continue a batch job</td></tr>
<tr><td><code>--no-paginate</code></td><td>Makes only the first API call</td><td>Quick peek. <strong>Gives incomplete results</strong> if used by mistake.</td></tr>
</tbody></table>
<p>Pagination happens <em>before</em> <code>--query</code> is applied, so <code>--query "length(Buckets)"</code> counts everything; with <code>--max-items</code> the query sees only that slice.</p>

<h3>Waiters, dry runs and input files</h3>
<ul>
  <li><strong>Waiters</strong> poll until a state is reached: <code>aws ec2 wait instance-running --instance-ids i-0abc</code>, <code>aws cloudformation wait stack-create-complete --stack-name app</code>, <code>aws rds wait db-instance-available …</code>. They exit non-zero (255) if the state isn't reached within the waiter's attempts. Use them instead of <code>sleep 60</code>.</li>
  <li><strong><code>--dry-run</code></strong> (EC2 and a few others) checks permissions and parameters without doing anything. Success is reported as the error <code>DryRunOperation</code>; missing permission as <code>UnauthorizedOperation</code>.</li>
  <li><strong><code>--generate-cli-skeleton</code></strong> prints a JSON (or <code>yaml-input</code>) template of every parameter; fill it in and run with <code>--cli-input-json file://req.json</code> or <code>--cli-input-yaml</code>. Good for long, reviewed, repeatable calls.</li>
  <li><strong><code>file://</code> and <code>fileb://</code></strong> load parameter values from files (text or binary), e.g. <code>--policy-document file://policy.json</code>.</li>
</ul>

<h3>Errors, exit codes and retries</h3>
<table>
<thead><tr><th>Exit code</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>Success</td></tr>
<tr><td><code>1</code></td><td>One or more <code>aws s3</code> transfers failed</td></tr>
<tr><td><code>2</code></td><td>Command line couldn't be parsed, or <code>aws s3</code> skipped files (e.g. unreadable)</td></tr>
<tr><td><code>130</code></td><td>Interrupted (Ctrl+C / SIGINT)</td></tr>
<tr><td><code>252</code></td><td>Invalid command syntax, unknown parameter or bad parameter value</td></tr>
<tr><td><code>253</code></td><td>Invalid system environment or configuration (e.g. a broken config file, missing profile)</td></tr>
<tr><td><code>254</code></td><td>The request reached AWS and the <strong>service returned an error</strong> (AccessDenied, NoSuchBucket, ThrottlingException…)</td></tr>
<tr><td><code>255</code></td><td>Catch-all general error (e.g. a waiter timed out, a network failure)</td></tr>
</tbody></table>
<ul>
  <li><strong>Retries.</strong> Throttling (<code>ThrottlingException</code>, <code>RequestLimitExceeded</code>, HTTP 429) and transient errors (5xx, timeouts) are retried automatically with exponential backoff and jitter. CLI v2 defaults to <code>retry_mode = standard</code> (3 attempts in total). <code>adaptive</code> adds client-side rate limiting for heavy scripts. Raise attempts with <code>max_attempts</code> in the profile or <code>AWS_MAX_ATTEMPTS</code>.</li>
  <li><strong><code>--debug</code></strong> prints everything: the config files read, the credential provider that won, the endpoint, the signed request, retries and the raw response. It's the fastest way to find "why is it calling the wrong account/Region?". It doesn't print secret keys, but treat its output as sensitive.</li>
  <li><strong>Pager.</strong> CLI v2 sends long output to <code>less</code>. In scripts set <code>AWS_PAGER=""</code> (or <code>cli_pager =</code> in the profile, or pass <code>--no-cli-pager</code>) so jobs don't hang waiting for a keypress.</li>
</ul>

<h3>Environment variables worth knowing</h3>
<table>
<thead><tr><th>Variable</th><th>Effect</th></tr></thead>
<tbody>
<tr><td><code>AWS_PROFILE</code></td><td>Profile to use when <code>--profile</code> isn't given</td></tr>
<tr><td><code>AWS_REGION</code> / <code>AWS_DEFAULT_REGION</code></td><td>Region (AWS_REGION wins)</td></tr>
<tr><td><code>AWS_ACCESS_KEY_ID</code>, <code>AWS_SECRET_ACCESS_KEY</code>, <code>AWS_SESSION_TOKEN</code></td><td>Explicit credentials (beat AWS_PROFILE)</td></tr>
<tr><td><code>AWS_DEFAULT_OUTPUT</code></td><td>Output format</td></tr>
<tr><td><code>AWS_PAGER</code></td><td>Pager program; empty string disables it</td></tr>
<tr><td><code>AWS_RETRY_MODE</code>, <code>AWS_MAX_ATTEMPTS</code></td><td>Retry behaviour</td></tr>
<tr><td><code>AWS_CONFIG_FILE</code>, <code>AWS_SHARED_CREDENTIALS_FILE</code></td><td>Alternative file locations</td></tr>
<tr><td><code>AWS_CA_BUNDLE</code></td><td>Custom CA bundle (corporate TLS-inspecting proxies)</td></tr>
<tr><td><code>HTTPS_PROXY</code> / <code>NO_PROXY</code></td><td>Send traffic through a forward proxy (M02.06)</td></tr>
</tbody></table>` },

    { type: "examples", title: "Worked examples: JMESPath step by step", html: `
<p>All examples use this simplified <code>describe-instances</code> response. Notice the shape: a list of <em>reservations</em> (one per launch request), each containing a list of <em>instances</em>. That two-level nesting is why EC2 queries start with <code>Reservations[].Instances[]</code>.</p>
<pre><code>{ "Reservations": [
    { "Instances": [
        { "InstanceId": "i-0a1", "InstanceType": "t3.micro",  "State": {"Name": "running"},
          "LaunchTime": "2026-09-01T10:00:00Z",
          "Tags": [ {"Key": "Name", "Value": "web-1"},   {"Key": "env", "Value": "prod"} ] },
        { "InstanceId": "i-0b2", "InstanceType": "m7g.large", "State": {"Name": "stopped"},
          "LaunchTime": "2026-08-15T08:30:00Z",
          "Tags": [ {"Key": "Name", "Value": "batch-1"}, {"Key": "env", "Value": "dev"} ] } ] },
    { "Instances": [
        { "InstanceId": "i-0c3", "InstanceType": "t3.micro",  "State": {"Name": "running"},
          "LaunchTime": "2026-09-20T16:45:00Z",
          "Tags": [ {"Key": "Name", "Value": "web-2"},   {"Key": "env", "Value": "prod"} ] } ] } ] }</code></pre>

<table>
<thead><tr><th>#</th><th>Expression</th><th>Result</th><th>What to learn</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Reservations[0].Instances[0].InstanceId</code></td><td><code>"i-0a1"</code></td><td>Plain navigation with indexes</td></tr>
<tr><td>2</td><td><code>Reservations[*].Instances[*].InstanceId</code></td><td><code>[["i-0a1","i-0b2"],["i-0c3"]]</code></td><td><code>[*]</code> projects but <strong>keeps nesting</strong></td></tr>
<tr><td>3</td><td><code>Reservations[].Instances[].InstanceId</code></td><td><code>["i-0a1","i-0b2","i-0c3"]</code></td><td><code>[]</code> flattens: the usual EC2 starting point</td></tr>
<tr><td>4</td><td><code>Reservations[].Instances[?State.Name=='running'].InstanceId</code></td><td><code>[["i-0a1"],["i-0c3"]]</code></td><td>A filter inside a projection gives one list per reservation</td></tr>
<tr><td>5</td><td><code>Reservations[].Instances[] | [?State.Name=='running'].InstanceId</code></td><td><code>["i-0a1","i-0c3"]</code></td><td>Flatten first, then filter: a flat list</td></tr>
<tr><td>6</td><td><code>Reservations[].Instances[].{Id:InstanceId,Type:InstanceType,State:State.Name}</code></td><td><code>[{"Id":"i-0a1","Type":"t3.micro","State":"running"}, …]</code> (3 objects)</td><td>Multi-select hash renames and reshapes; perfect with <code>--output table</code></td></tr>
<tr><td>7</td><td><code>Reservations[].Instances[].Tags[?Key=='Name'].Value[]</code></td><td><code>["web-1","batch-1","web-2"]</code></td><td>The standard "get the Name tag" idiom</td></tr>
<tr><td>8</td><td><code>Reservations[].Instances[].[InstanceId, Tags[?Key=='Name'] | [0].Value]</code></td><td><code>[["i-0a1","web-1"],["i-0b2","batch-1"],["i-0c3","web-2"]]</code></td><td>ID + Name per row: with <code>--output text</code> this prints two columns</td></tr>
<tr><td>9</td><td><code>length(Reservations[].Instances[?State.Name=='running'][])</code></td><td><code>2</code></td><td>The trailing <code>[]</code> flattens before counting</td></tr>
<tr><td>10</td><td><code>Reservations[].Instances[] | sort_by(@, &amp;LaunchTime)[-1].InstanceId</code></td><td><code>"i-0c3"</code></td><td>Newest instance (ISO-8601 timestamps sort correctly as strings)</td></tr>
<tr><td>11</td><td><code>reverse(sort_by(Reservations[].Instances[], &amp;LaunchTime))[:2].InstanceId</code></td><td><code>["i-0c3","i-0a1"]</code></td><td>Top-N pattern: newest two</td></tr>
<tr><td>12</td><td><code>Reservations[].Instances[] | [?contains(InstanceType, 'g.')].InstanceId</code></td><td><code>["i-0b2"]</code></td><td>Graviton instances (the "g" in m7<strong>g</strong>.large)</td></tr>
<tr><td>13</td><td><code>Reservations[].Instances[].InstanceId | [0]</code></td><td><code>"i-0a1"</code></td><td>The pipe ends the projection, so <code>[0]</code> picks the first of the whole list</td></tr>
<tr><td>14</td><td><code>Reservations[].Instances[].InstanceId[0]</code></td><td><code>[]</code></td><td>Gotcha: without the pipe, <code>[0]</code> is applied to each string, which isn't a list, so every element is dropped</td></tr>
</tbody></table>

<h3>Example 15: a real query, end to end</h3>
<pre><code>$ aws ec2 describe-instances --profile prod-readonly --region eu-west-1 \\
    --filters Name=instance-state-name,Values=running \\
    --query "Reservations[].Instances[].{Name:Tags[?Key=='Name']|[0].Value,Id:InstanceId,Type:InstanceType,AZ:Placement.AvailabilityZone}" \\
    --output table
-----------------------------------------------------------
|                    DescribeInstances                    |
+-------------+-----------------------+---------+---------+
|     AZ      |          Id           |  Name   |  Type   |
+-------------+-----------------------+---------+---------+
|  eu-west-1a |  i-0a1b2c3d4e5f60718  |  web-1  | t3.micro|
|  eu-west-1b |  i-0c3d4e5f6a7b80912  |  web-2  | t3.micro|
+-------------+-----------------------+---------+---------+</code></pre>
<p>Note that <code>table</code> sorts the columns alphabetically by key. If column order matters, use a multi-select <em>list</em> with <code>--output text</code>.</p>

<h3>Example 16: pagination in practice</h3>
<pre><code># 1) Peek at the first 2 of thousands of objects
$ aws s3api list-objects-v2 --bucket logs-prod-eu --max-items 2 \\
    --query "{Keys:Contents[].Key, Next:NextToken}"
{
  "Keys": ["2026/10/01/app-0001.gz", "2026/10/01/app-0002.gz"],
  "Next": "eyJDb250aW51YXRpb25Ub2tlbiI6IG51bGwsICJib3RvX3RydW5jYXRlX2Ftb3VudCI6IDJ9"
}

# 2) Continue from where you stopped
$ aws s3api list-objects-v2 --bucket logs-prod-eu --max-items 2 \\
    --starting-token eyJDb250aW51YXRpb25Ub2tlbiI6IG51bGwsICJib3RvX3RydW5jYXRlX2Ftb3VudCI6IDJ9

# 3) Count everything, fetching 500 keys per API call instead of 1,000
$ aws s3api list-objects-v2 --bucket logs-prod-eu --page-size 500 --query "length(Contents)"
48213</code></pre>

<h3>Example 17: reading an error and its exit code</h3>
<pre><code>$ aws s3api get-bucket-encryption --bucket app-assets --profile prod-readonly
An error occurred (AccessDenied) when calling the GetBucketEncryption operation:
User: arn:aws:sts::222222222222:assumed-role/AWSReservedSSO_ReadOnlyAccess_1a2b3c/priya
is not authorized to perform: s3:GetEncryptionConfiguration on resource: "arn:aws:s3:::app-assets"
$ echo $?
254</code></pre>
<p>254 means the service answered with an error, so your syntax and configuration were fine. Notice also that the IAM action (<code>s3:GetEncryptionConfiguration</code>) is <em>not</em> the operation name (<code>GetBucketEncryption</code>): always read the action from the error message or the Service Authorization Reference.</p>

<h3>Example 18: <code>--query</code> vs <code>jq</code></h3>
<pre><code># Same result, two tools
aws iam list-roles --query "Roles[?starts_with(RoleName,'AWSReservedSSO')].RoleName" --output text
aws iam list-roles --output json | jq -r '.Roles[] | select(.RoleName | startswith("AWSReservedSSO")) | .RoleName'</code></pre>
<p>Use <code>--query</code> by default: it's built in, works in CloudShell and CI images, and is applied before formatting. Reach for <code>jq</code> when you need features JMESPath lacks: variables, string manipulation, combining several command outputs, or converting to CSV with <code>@csv</code>.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>CLI approach</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Engineer working across dev, test and prod accounts</td><td>One <code>[sso-session]</code>, one profile per account/permission set; <code>aws sso login</code> once a day</td><td>No long-lived keys; least privilege per account; one login</td></tr>
<tr><td>Security team auditing 40 accounts</td><td>An audit role in every account (deployed with CloudFormation StackSets); profiles with <code>role_arn</code> + <code>source_profile</code>; loop over profiles</td><td>Central identity, consistent read-only role, CloudTrail shows the auditor</td></tr>
<tr><td>Nightly job on an EC2 instance</td><td>Instance profile role; no <code>~/.aws</code> files; <code>AWS_PAGER=""</code>; explicit <code>--region</code> and <code>--output</code></td><td>Credentials rotate automatically; deterministic output</td></tr>
<tr><td>CI pipeline (GitHub Actions, GitLab) deploying to AWS</td><td>OIDC federation → <code>sts:AssumeRoleWithWebIdentity</code> (web identity in the chain)</td><td>No secrets stored in the CI system</td></tr>
<tr><td>Incident: "which SGs allow SSH from anywhere?"</td><td><code>describe-security-groups</code> with server-side <code>--filters Name=ip-permission.from-port,Values=22 Name=ip-permission.cidr,Values=0.0.0.0/0</code></td><td>Answer in seconds, in every Region, without clicking</td></tr>
<tr><td>Testing whether a new policy lets a role launch instances</td><td><code>aws ec2 run-instances … --dry-run</code></td><td>Checks permissions without creating (or paying for) anything</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice (CloudShell or your laptop)", html: `
<p>Read-only and free. Use the <code>academy-admin</code> profile from Lab L01, or drop <code>--profile</code> in CloudShell.</p>
<pre><code># 1. Which identity, profile, Region and credential source am I using?
aws sts get-caller-identity
aws configure list

# 2. Watch the provider chain decide (look for "Found credentials" in the debug log)
aws sts get-caller-identity --debug 2&gt;&amp;1 | grep -iE "credentials|endpoint" | head

# 3. Same data, four formats
aws ec2 describe-regions --query "Regions[:3].RegionName"                 --output json
aws ec2 describe-regions --query "Regions[:3].RegionName"                 --output text
aws ec2 describe-regions --query "Regions[:3].{Name:RegionName,Opt:OptInStatus}" --output table
aws ec2 describe-regions --query "Regions[:3].RegionName"                 --output yaml

# 4. Server-side filter vs client-side query
aws ec2 describe-regions --filters Name=opt-in-status,Values=opt-in-not-required --query "length(Regions)"
aws ec2 describe-regions --all-regions --query "length(Regions[?OptInStatus=='opt-in-not-required'])"

# 5. Pagination options
aws iam list-policies --scope AWS --max-items 3 --query "{P:Policies[].PolicyName,Next:NextToken}"
aws iam list-policies --scope AWS --query "length(Policies)"

# 6. A dry run (succeeds with "DryRunOperation" if you are allowed; nothing is launched)
aws ec2 run-instances --dry-run --image-id resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \\
  --instance-type t3.micro ; echo "exit code: $?"

# 7. Generate an input skeleton
aws ec2 run-instances --generate-cli-skeleton yaml-input | head -20</code></pre>
<p>Expected for step 6: <em>"An error occurred (DryRunOperation) … Request would have succeeded, but DryRun flag is set."</em> and exit code 254 (the service technically returned an error).</p>
<h3>A safe script skeleton: every enabled Region</h3>
<pre><code>#!/usr/bin/env bash
set -euo pipefail                     # stop on errors, unset variables and failed pipes
export AWS_PAGER=""                   # never wait on a pager
PROFILE="\${1:-academy-admin}"

for region in $(aws ec2 describe-regions --profile "$PROFILE" \\
                  --query "Regions[].RegionName" --output text); do
  count=$(aws ec2 describe-instances --profile "$PROFILE" --region "$region" \\
            --filters Name=instance-state-name,Values=running \\
            --query "length(Reservations[].Instances[])" --output text)
  printf "%-16s %s running\\n" "$region" "$count"
done</code></pre>` },

    { type: "casestudy", title: "Case study: Orbital Freight retires shared access keys", html: `
<p><strong>The company.</strong> Orbital Freight (fictional) is a logistics firm with 12 AWS accounts (dev, test, prod for four product teams) and a six-person platform team. Over five years each engineer had accumulated an IAM user with access keys in every account they touched: 70+ active keys, some over three years old. A shared "automation" key with <code>AdministratorAccess</code> lived in a wiki page so that scripts "just worked".</p>
<p><strong>The trigger.</strong> An internal audit asked two questions the team couldn't answer: <em>who</em> made a production security group change last month (CloudTrail showed only the shared <code>automation</code> user), and <em>how many</em> EC2 instances were running across all accounts and Regions (answers from three engineers differed by 40).</p>
<p><strong>Requirements.</strong> (1) Every human call attributable to a person. (2) No long-lived keys on laptops. (3) Read access across all accounts for inventory without logging in 12 times. (4) A repeatable inventory the auditors could re-run.</p>
<p><strong>The design.</strong></p>
<table>
<thead><tr><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>IAM users + access keys per account</td><td>IAM Identity Center with the corporate IdP; permission sets <code>ReadOnly</code>, <code>PowerUser</code>, <code>Admin</code> (MFA required)</td></tr>
<tr><td>~/.aws/credentials with 12 key pairs</td><td>Generated <code>~/.aws/config</code>: one <code>[sso-session orbital]</code> and 24 profiles (<code>&lt;account&gt;-ro</code>, <code>&lt;account&gt;-admin</code>)</td></tr>
<tr><td>Shared automation key</td><td>Pipelines use OIDC roles; scheduled jobs use instance or task roles</td></tr>
<tr><td>Ad hoc counting in the console</td><td><code>inventory.sh</code>: loops over every <code>*-ro</code> profile and every enabled Region, uses server-side filters, writes CSV with account, Region, instance ID, type and Name tag</td></tr>
</tbody></table>
<p><strong>Rollout.</strong> They ran both systems in parallel for two weeks, used IAM's <em>last accessed</em> data and the credential report to find keys still in use, then deactivated (not deleted) every human key, waited a week for complaints, and deleted them. A Service Control Policy now denies <code>iam:CreateAccessKey</code> except for one break-glass role.</p>
<p><strong>Results.</strong> Active access keys: 70+ → 2 (both for a vendor tool, rotated every 90 days and scoped to one bucket). Every CloudTrail event now shows <code>AWSReservedSSO_…/firstname.lastname</code>. The inventory runs in about 4 minutes across 12 accounts × 17 Regions, and it's now a scheduled job whose output the auditors receive monthly.</p>
<p><strong>Lessons learned.</strong> The first inventory run was throttled in two accounts; switching to <code>retry_mode = adaptive</code> and server-side filters fixed it. Several scripts broke because engineers still had <code>AWS_ACCESS_KEY_ID</code> exported in their shell profiles, silently overriding <code>AWS_PROFILE</code>, so the onboarding checklist now starts with <code>env | grep AWS_</code> and <code>aws configure list</code>.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>If the question says…</th><th>Think…</th></tr></thead>
<tbody>
<tr><td>"Developers need CLI access to multiple accounts", "centrally managed", "no long-term credentials"</td><td>IAM Identity Center + <code>aws configure sso</code> profiles</td></tr>
<tr><td>"Application on EC2 needs to call S3/DynamoDB"</td><td>IAM role via instance profile; <strong>never</strong> access keys on the instance</td></tr>
<tr><td>"Access resources in another account"</td><td>Cross-account IAM role + <code>sts:AssumeRole</code>; the role's trust policy names the other account/principal</td></tr>
<tr><td>"CI/CD system outside AWS", "no stored secrets"</td><td>OIDC identity provider + <code>AssumeRoleWithWebIdentity</code></td></tr>
<tr><td>"On-premises servers need AWS credentials"</td><td>IAM Roles Anywhere (X.509) rather than access keys</td></tr>
<tr><td>"Leaked access key"</td><td>Deactivate/delete it, review CloudTrail, check for persistence (new users, keys, roles), move to temporary credentials</td></tr>
<tr><td>"Who made this API call?"</td><td>CloudTrail (management events, 90-day Event history; trails for long-term)</td></tr>
</tbody></table>
<p><strong>Distractors to reject:</strong> storing access keys in user data, AMIs, environment variables of a task definition, or code; sharing one IAM user between people; using root access keys for automation.</p>
<table>
<thead><tr><th></th><th>Access keys (IAM user)</th><th>Role credentials (STS)</th></tr></thead>
<tbody>
<tr><td>Lifetime</td><td>Until rotated or deleted (often years)</td><td>15 minutes to 12 hours (1 hour max when chaining)</td></tr>
<tr><td>Rotation</td><td>Manual</td><td>Automatic</td></tr>
<tr><td>Typical use</td><td>Legacy tools that can't do anything else</td><td>Humans (via Identity Center), workloads, cross-account, federation</td></tr>
<tr><td>Leak impact</td><td>High until detected</td><td>Limited by expiry</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Make the account visible.</strong> Put the account alias or profile in your shell prompt (many prompt themes read <code>AWS_PROFILE</code>) and make destructive scripts print <code>get-caller-identity</code> and ask for confirmation unless <code>--yes</code> is passed. Most "deleted the wrong thing" stories are wrong-account stories.</li>
  <li><strong>Pin the CLI version in automation</strong> (container image or package version). New CLI releases occasionally change defaults (pagination output, SSO flow); pinned images make behaviour reproducible, and you upgrade deliberately.</li>
  <li><strong>Throttling is account-wide and per API.</strong> Your inventory script competes with production workloads for the same <code>Describe*</code> rate limits. Use server-side filters, <code>--page-size</code>, adaptive retries, and run heavy scans off-peak, or use aggregated services instead: <strong>AWS Config</strong> advanced queries, <strong>Resource Explorer</strong>, or Systems Manager Inventory (M31).</li>
  <li><strong>Prefer IaC for changes.</strong> The CLI is perfect for reading, investigating and one-off fixes. Repeated <em>changes</em> belong in CloudFormation, CDK or Terraform (M36–M39), where they are reviewed, versioned and drift-detected.</li>
  <li><strong>Secrets hygiene.</strong> Scan repositories for keys with pre-commit hooks (git-secrets, gitleaks, trufflehog) and enable GitHub secret scanning. AWS also detects many publicly exposed keys and attaches a quarantine policy, but by then attackers may already have used them.</li>
  <li><strong>Least privilege for scripts.</strong> A read-only inventory doesn't need <code>AdministratorAccess</code>; use <code>ReadOnlyAccess</code> or a narrower custom policy, and generate it from CloudTrail activity with IAM Access Analyzer policy generation (M05).</li>
  <li><strong>Watch costs you create from the CLI.</strong> <code>aws s3 cp</code> of terabytes across Regions incurs data-transfer charges; listing billions of objects costs per request. Use S3 Inventory for large buckets instead of <code>list-objects-v2</code> loops.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Each CLI operation is one API action; IAM and CloudTrail use the API action name, which can differ from the CLI name.</li>
  <li>Put profiles in <code>~/.aws/config</code>; use <code>[sso-session]</code> + Identity Center for humans and roles for workloads. Avoid <code>~/.aws/credentials</code>.</li>
  <li>The credential chain stops at the first source that supplies credentials. Environment-variable keys beat <code>AWS_PROFILE</code>; <code>--profile</code> beats both.</li>
  <li><code>role_arn</code> + <code>source_profile</code> automates <code>sts:AssumeRole</code>; the target role's trust policy must allow you. Chained sessions last at most 1 hour.</li>
  <li>Filter on the server (<code>--filters</code>) when possible; shape output with <code>--query</code> (JMESPath). <code>[]</code> flattens, <code>[?…]</code> filters, <code>{…}</code> reshapes, <code>|</code> ends a projection.</li>
  <li>The CLI paginates automatically. <code>--page-size</code> changes the call size, <code>--max-items</code> limits the total and returns a <code>NextToken</code>, <code>--no-paginate</code> returns only the first page.</li>
  <li>Exit code 254 = the service returned an error; 252 = bad syntax; 253 = bad configuration; 255 = general error.</li>
  <li>Use waiters instead of sleeps, <code>--dry-run</code> to test permissions, <code>--debug</code> to see what the CLI really did, and <code>AWS_PAGER=""</code> in scripts.</li>
  <li><code>aws sts get-caller-identity</code> and <code>aws configure list</code> are the first two commands of every investigation.</li>
</ul>` }
  ],
  drills: [
    { id: "M03.02-d1", q: "Using the sample JSON in the worked examples, what does <code>Reservations[].Instances[] | length(@)</code> return?", answers: ["3"], hint: "Flatten all instances into one list, then count.", explain: "Two instances in the first reservation plus one in the second." },
    { id: "M03.02-d2", q: "Using the same JSON, what does <code>Reservations[].Instances[].InstanceId[0]</code> return? (type the JSON value)", answers: ["[]"], hint: "Without a pipe, <code>[0]</code> is applied to each projected element, and each element is a string.", explain: "Indexing a string yields null, and projections drop nulls, so the result is an empty list. Use <code>… | [0]</code> to get the first ID." },
    { id: "M03.02-d3", q: "Using the same JSON, what does <code>sort_by(Reservations[].Instances[], &amp;LaunchTime)[0].InstanceId</code> return?", answers: ["i-0b2", "\"i-0b2\""], hint: "Ascending sort: the oldest LaunchTime comes first.", explain: "i-0b2 was launched on 2026-08-15, the earliest of the three." },
    { id: "M03.02-d4", q: "A command reaches AWS but the service answers <code>AccessDenied</code>. Which CLI exit code do you get?", answers: ["254"], hint: "The 25x codes: 252 syntax, 253 configuration, 254 …, 255 general.", explain: "254 = the request was made and the service returned an error." },
    { id: "M03.02-d5", q: "You mistyped a parameter name (<code>--instance-idss</code>). Which exit code does the CLI return?", answers: ["252"], explain: "252 = the command syntax was invalid, an unknown parameter was given or a parameter value was incorrect." },
    { id: "M03.02-d6", q: "Which environment variable, set to an empty string, stops CLI v2 from sending output to a pager in scripts?", answers: ["AWS_PAGER"], hint: "AWS_…", explain: "<code>export AWS_PAGER=\"\"</code>; the per-command equivalent is <code>--no-cli-pager</code>." },
    { id: "M03.02-d7", q: "Which global option limits the TOTAL number of items the CLI returns and prints a NextToken so you can resume?", answers: ["--max-items", "max-items"], explain: "<code>--max-items</code> limits the output; <code>--page-size</code> only changes how many items each underlying API call requests." },
    { id: "M03.02-d8", q: "An EC2 call with <code>--dry-run</code> would have succeeded. What is the error code in the response?", answers: ["DryRunOperation"], explain: "Success is reported as <code>DryRunOperation</code>; lack of permission as <code>UnauthorizedOperation</code>." },
    { id: "M03.02-d9", q: "What is the maximum session duration, in hours, when you assume a role using credentials that themselves came from an assumed role (role chaining)?", answers: ["1", "1h", "one"], explain: "Role chaining limits the session to 1 hour, regardless of the role's configured maximum." },
    { id: "M03.02-d10", q: "Which CLI command shows the account ID and ARN of the identity your current credentials belong to?", answers: ["aws sts get-caller-identity", "sts get-caller-identity", "get-caller-identity"], explain: "It needs no permissions, so it works with any valid credentials." }
  ],
  check: [
    { id: "M03.02-k1", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company has 15 AWS accounts in AWS Organizations. Its 40 developers need CLI access to several accounts each, with credentials that expire automatically and access managed centrally from the corporate identity provider. Which approach meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Enable IAM Identity Center with the corporate IdP, assign permission sets per account, and have developers use <code>aws configure sso</code> profiles", c: true, why: "Central assignments across all accounts, federation with the IdP, and short-lived credentials cached by the CLI. One login covers every profile that shares the <code>sso-session</code>." },
        { t: "Create an IAM user with access keys for each developer in every account and rotate the keys every 90 days", c: false, why: "Hundreds of long-lived keys to manage and rotate: high overhead and high leak risk." },
        { t: "Create one shared IAM user per account and store its keys in AWS Secrets Manager", c: false, why: "Shared identities break attribution, and the keys are still long-lived." },
        { t: "Give developers the root user credentials of the dev accounts with MFA", c: false, why: "Root must never be used for daily work or shared." }
      ] },
    { id: "M03.02-k2", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A nightly shell script on an Amazon EC2 instance uses the AWS CLI to copy reports to an S3 bucket. What is the MOST secure way to give the script credentials?",
      options: [
        { t: "Attach an IAM role with a least-privilege S3 policy to the instance through an instance profile", c: true, why: "The CLI finds the role's temporary credentials through the instance metadata service at the bottom of the provider chain. Nothing is stored on disk and the credentials rotate automatically." },
        { t: "Run <code>aws configure</code> on the instance with an IAM user's access keys", c: false, why: "Long-lived keys on disk can be stolen from the instance or its snapshots." },
        { t: "Export the access keys as environment variables in the instance's user data", c: false, why: "User data is readable from the instance metadata service and the console; it is not a secret store." },
        { t: "Store the access keys in a private S3 bucket and download them at start-up", c: false, why: "The script would need credentials to read the bucket in the first place, and the keys are still long-lived." }
      ] },
    { id: "M03.02-k3", type: "single", domain: "D1", task: "1.1", level: 300,
      stem: "An engineer runs <code>export AWS_PROFILE=prod</code> and then <code>aws s3 ls</code>, but the buckets listed belong to the dev account. <code>aws configure list</code> shows the credential type as <code>env</code>. What is the MOST likely cause?",
      options: [
        { t: "<code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> for the dev account are still exported in the shell and take precedence over <code>AWS_PROFILE</code>", c: true, why: "Environment-variable credentials sit above profile-based credentials in the provider chain. Unset them, or pass <code>--profile prod</code>, which overrides both." },
        { t: "The prod profile's Region is wrong", c: false, why: "A wrong Region changes where Regional calls go, not which account's credentials are used. S3 bucket listing is account-wide anyway." },
        { t: "The SSO token for prod has expired", c: false, why: "An expired token produces an explicit error, not silently another account's results." },
        { t: "S3 bucket names are global, so <code>aws s3 ls</code> shows buckets from all accounts", c: false, why: "ListBuckets returns only buckets owned by the calling account." }
      ] },
    { id: "M03.02-k4", type: "single", domain: "D3", task: "3.1", level: 200,
      stem: "A script lists running instances tagged <code>env=prod</code> in an account with 20,000 EC2 instances. It uses <code>--query \"Reservations[].Instances[?State.Name=='running']\"</code> and is slow and frequently throttled. Which change will MOST improve it?",
      options: [
        { t: "Use server-side <code>--filters Name=instance-state-name,Values=running Name=tag:env,Values=prod</code> and keep <code>--query</code> only to shape the output", c: true, why: "Server-side filters reduce the data returned and the number of pages (API calls). <code>--query</code> runs on the client after every page has been downloaded." },
        { t: "Add <code>--no-paginate</code>", c: false, why: "Only the first page would be returned, so the results would be incomplete." },
        { t: "Change the output to <code>--output table</code>", c: false, why: "Formatting has no effect on how much data is fetched." },
        { t: "Run the same command in parallel from 10 terminals", c: false, why: "More concurrent calls make the throttling worse." }
      ] },
    { id: "M03.02-k5", type: "multi", domain: "D2", task: "2.1", level: 300,
      stem: "A compliance script runs <code>describe-*</code> calls across 30 accounts and all Regions. It fails intermittently with <code>ThrottlingException</code>. Which TWO changes make it more reliable?",
      options: [
        { t: "Set <code>retry_mode = adaptive</code> (or standard) with a higher <code>max_attempts</code> in the profile", c: true, why: "More retries with exponential backoff, plus client-side rate limiting in adaptive mode, absorb throttling." },
        { t: "Use server-side filters and only the API calls the report needs, to reduce the number of requests", c: true, why: "Fewer requests means less pressure on per-account API rate limits, which production workloads share." },
        { t: "Use <code>--max-items 1</code> on every call", c: false, why: "That limits output, not throttling, and would make the report incomplete." },
        { t: "Switch from SSO profiles to IAM user access keys", c: false, why: "The credential type has no effect on API rate limits, and access keys are less secure." },
        { t: "Pipe the output to <code>jq</code> instead of using <code>--query</code>", c: false, why: "Both run on the client after the data is fetched; neither reduces API calls." }
      ] },
    { id: "M03.02-k6", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "A profile is configured with <code>role_arn = arn:aws:iam::333333333333:role/SecurityAuditor</code> and <code>source_profile = dev</code>. The dev profile works, but commands with the new profile fail with <code>AccessDenied</code> on <code>sts:AssumeRole</code>. What should the administrator check FIRST?",
      options: [
        { t: "The trust policy of the SecurityAuditor role allows the dev profile's principal (or its account) to assume it", c: true, why: "AssumeRole needs both: the caller allowed to call sts:AssumeRole on the role, and the role's trust policy trusting the caller. A missing trust is the most common cause." },
        { t: "Whether the AWS CLI v2 supports role chaining", c: false, why: "It does; <code>role_arn</code> + <code>source_profile</code> is the standard mechanism." },
        { t: "Whether the profile's output format is set to json", c: false, why: "Output format has no effect on authorization." },
        { t: "Whether the SecurityAuditor role has an instance profile", c: false, why: "Instance profiles are only for attaching roles to EC2 instances." }
      ] }
  ],
  cards: ["fc-M03-2-01", "fc-M03-2-02", "fc-M03-2-03", "fc-M03-2-04", "fc-M03-2-05", "fc-M03-2-06", "fc-M03-2-07", "fc-M03-2-08", "fc-M03-2-09", "fc-M03-2-10", "fc-M03-2-11"],
  references: [
    "AWS CLI v2 User Guide: <em>Configuration and credential file settings</em>, <em>Configuring IAM Identity Center authentication</em>, <em>Using an IAM role in the AWS CLI</em>",
    "AWS CLI v2 User Guide: <em>Filtering output</em> (server-side and client-side), <em>Using pagination options</em>, <em>Command line return codes</em>, <em>Retries</em>",
    "AWS SDKs and Tools Reference Guide: <em>Standardized credential providers</em>",
    "JMESPath specification and tutorial (jmespath.org)",
    "<em>Hands-On AWS CDK</em> ch.1 \"Set Up Your Local Development Environment\" (PDF p32)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M03-2-01", front: "<code>~/.aws/config</code> vs <code>~/.aws/credentials</code>?", back: "config: profiles, Region, output, SSO and role settings (<code>[profile x]</code>). credentials: static keys (<code>[x]</code>), to be avoided." },
  { id: "fc-M03-2-02", front: "Order of the CLI credential provider chain (simplified)?", back: "CLI options → env vars → assume role (role_arn) → web identity → IAM Identity Center (SSO) → shared credentials file → credential_process → config file → container (ECS) → EC2 instance profile (IMDS). First match wins." },
  { id: "fc-M03-2-03", front: "AWS_PROFILE=prod is set but env-var access keys are also set. Which wins?", back: "The env-var keys. Only an explicit <code>--profile</code> overrides them." },
  { id: "fc-M03-2-04", front: "How does a profile assume a role in another account?", back: "<code>role_arn</code> + <code>source_profile</code> (or <code>credential_source</code>). The CLI calls sts:AssumeRole and caches the result. The role's trust policy must allow the caller." },
  { id: "fc-M03-2-05", front: "<code>--filters</code> vs <code>--query</code>?", back: "--filters: server-side, less data and fewer calls, limited fields. --query: client-side JMESPath on the full result, any field, reshaping." },
  { id: "fc-M03-2-06", front: "JMESPath: <code>[*]</code> vs <code>[]</code>?", back: "Both project; <code>[]</code> also flattens one level. EC2 queries start with <code>Reservations[].Instances[]</code>." },
  { id: "fc-M03-2-07", front: "JMESPath: why <code>… | [0]</code> instead of <code>…[0]</code>?", back: "The pipe ends the projection, so [0] applies to the whole list. Without it, [0] applies to each element." },
  { id: "fc-M03-2-08", front: "<code>--page-size</code> vs <code>--max-items</code> vs <code>--no-paginate</code>?", back: "page-size: items per API call (still returns all). max-items: total items returned + NextToken. no-paginate: first page only." },
  { id: "fc-M03-2-09", front: "CLI exit codes 252 / 253 / 254 / 255?", back: "252 bad syntax or parameter · 253 bad environment/config · 254 service returned an error · 255 general error." },
  { id: "fc-M03-2-10", front: "How do you test whether you may launch an instance without launching it?", back: "<code>aws ec2 run-instances … --dry-run</code>: <code>DryRunOperation</code> = allowed, <code>UnauthorizedOperation</code> = denied." },
  { id: "fc-M03-2-11", front: "First two commands when the CLI \"does something weird\"?", back: "<code>aws sts get-caller-identity</code> (who/which account) and <code>aws configure list</code> (profile, Region, credential source). Then <code>--debug</code>." }
);
// ================================================================== 03_git_yaml_json.js
/* ================================================================ M03.03 Git, YAML and JSON */
var DG_0303_GIT = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0303at m0303ad">
  <title id="m0303at">The Git workflow: four places your code lives, and a pull request</title>
  <desc id="m0303ad">Top: changes move from the working tree to the staging area with git add, to the local repository with git commit, and to the remote with git push. git pull brings remote commits back. Bottom: a feature branch leaves main, collects commits, and returns through a pull request with review and CI checks before merging.</desc>
  <defs><marker id="m0303a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-box" x="12" y="30" width="120" height="70" rx="8"/>
  <text class="dg-tb" x="22" y="56">Working tree</text><text class="dg-ts" x="22" y="76">files you edit</text>
  <rect class="dg-info" x="204" y="30" width="120" height="70" rx="8"/>
  <text class="dg-tb" x="214" y="56">Staging area</text><text class="dg-ts" x="214" y="76">(the index)</text>
  <rect class="dg-good" x="396" y="30" width="120" height="70" rx="8"/>
  <text class="dg-tb" x="406" y="56">Local repo</text><text class="dg-ts" x="406" y="76">.git: all commits</text>
  <rect class="dg-edge" x="588" y="30" width="160" height="70" rx="8"/>
  <text class="dg-tb" x="598" y="56">Remote (origin)</text><text class="dg-ts" x="598" y="76">GitHub, GitLab…</text>

  <path class="dg-line" d="M132 65 H202" marker-end="url(#m0303a-ar)"/><text class="dg-ts" x="145" y="58">git add</text>
  <path class="dg-line" d="M324 65 H394" marker-end="url(#m0303a-ar)"/><text class="dg-ts" x="329" y="58">git commit</text>
  <path class="dg-line" d="M516 65 H586" marker-end="url(#m0303a-ar)"/><text class="dg-ts" x="529" y="58">git push</text>

  <path class="dg-line" d="M668 100 V128 H72 V102" marker-end="url(#m0303a-ar)"/>
  <text class="dg-ts" x="190" y="146">git pull = git fetch (remote → local repo) + git merge (into your branch and working tree)</text>

  <text class="dg-tb" x="12" y="190">Branches and pull requests</text>
  <path class="dg-link" d="M70 290 H730"/>
  <text class="dg-ta" x="12" y="294">main</text>
  <path class="dg-line" d="M150 290 C180 240 200 240 230 240 H470 C500 240 520 260 548 286" marker-end="url(#m0303a-ar)"/>
  <circle class="dg-good" cx="110" cy="290" r="7"/><circle class="dg-good" cx="150" cy="290" r="7"/>
  <circle class="dg-good" cx="550" cy="290" r="9"/><circle class="dg-good" cx="660" cy="290" r="7"/>
  <circle class="dg-info" cx="260" cy="240" r="7"/><circle class="dg-info" cx="330" cy="240" r="7"/><circle class="dg-info" cx="400" cy="240" r="7"/>
  <text class="dg-ts" x="232" y="222">feature/add-s3-bucket: small commits</text>
  <rect class="dg-edge" x="566" y="204" width="182" height="54" rx="6"/>
  <text class="dg-t" x="576" y="226">Pull request</text>
  <text class="dg-ts" x="576" y="244">review · CI checks · merge</text>
  <text class="dg-ts" x="470" y="314">merge commit on main → pipeline deploys</text>
</svg>
<figcaption>Figure M03-3a. Git has four "places": your working tree, the staging area, your local repository and the shared remote. Teams change <code>main</code> only through reviewed pull requests.</figcaption>
</figure>`;

var DG_0303_EVAL = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0303bt m0303bd">
  <title id="m0303bt">Simplified IAM policy evaluation</title>
  <desc id="m0303bd">A request starts as an implicit deny. If any applicable policy has an explicit Deny, the result is Deny. Otherwise, if an applicable policy Allows it and no guardrail blocks it, the result is Allow. Otherwise the implicit deny stands.</desc>
  <defs><marker id="m0303b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="12" y="20" width="150" height="60" rx="8"/>
  <text class="dg-tb" x="24" y="46">Request</text><text class="dg-ts" x="24" y="64">default: implicit deny</text>
  <rect class="dg-info" x="210" y="20" width="160" height="60" rx="8"/>
  <text class="dg-t" x="222" y="46">Any explicit Deny</text><text class="dg-t" x="222" y="64">that applies?</text>
  <rect class="dg-info" x="420" y="20" width="160" height="60" rx="8"/>
  <text class="dg-t" x="432" y="46">Any Allow that</text><text class="dg-t" x="432" y="64">isn't blocked?</text>
  <rect class="dg-good" x="628" y="20" width="120" height="60" rx="8"/>
  <text class="dg-tb" x="640" y="56">ALLOW</text>
  <rect class="dg-bad" x="210" y="140" width="160" height="50" rx="8"/>
  <text class="dg-tb" x="222" y="170">DENY (explicit)</text>
  <rect class="dg-bad" x="420" y="140" width="160" height="50" rx="8"/>
  <text class="dg-tb" x="432" y="170">DENY (implicit)</text>
  <path class="dg-line" d="M162 50 H208" marker-end="url(#m0303b-ar)"/>
  <path class="dg-line" d="M370 50 H418" marker-end="url(#m0303b-ar)"/><text class="dg-ts" x="380" y="42">no</text>
  <path class="dg-line" d="M580 50 H626" marker-end="url(#m0303b-ar)"/><text class="dg-ts" x="592" y="42">yes</text>
  <path class="dg-line" d="M290 80 V138" marker-end="url(#m0303b-ar)"/><text class="dg-ts" x="298" y="114">yes</text>
  <path class="dg-line" d="M500 80 V138" marker-end="url(#m0303b-ar)"/><text class="dg-ts" x="508" y="114">no</text>
  <text class="dg-ts" x="12" y="222">Guardrails (SCPs/RCPs, permissions boundaries, session policies) never grant access; they only limit it.</text>
  <text class="dg-ts" x="12" y="240">Cross-account: an Allow is needed on both sides (caller's identity policy and the resource policy). Details in M05.</text>
</svg>
<figcaption>Figure M03-3b. Reading any policy starts with one rule: everything is denied unless something allows it, and an explicit Deny always wins.</figcaption>
</figure>`;

LESSONS.push({
  id: "M03.03", title: "Git, YAML and JSON", level: 200, minutes: 55,
  objectives: [
    "Use Git's working tree, staging area, local repository and remote to make, review and share infrastructure changes through pull requests",
    "Keep secrets out of repositories, and respond correctly when an AWS access key leaks",
    "Read and write IAM policy JSON: Effect, Action, Resource, Principal and Condition, including policy variables",
    "Write correct YAML, avoid type-coercion and indentation traps, and use CloudFormation short-form intrinsic functions",
    "Validate JSON and YAML with jq, yamllint and cfn-lint before deploying"
  ],
  sections: [
    { type: "why", html: `
<p>As a Solutions Architect you will rarely click your way to a production environment. Infrastructure is described in <strong>files</strong>: CloudFormation and SAM templates in YAML or JSON, IAM and bucket policies in JSON, CI/CD pipelines in YAML, CDK apps that generate JSON. Those files live in <strong>Git</strong>, and every change to production starts as a commit and a pull request.</p>
<p>Three small skills therefore carry a lot of weight:</p>
<ul>
  <li><strong>Git</strong> gives you history, review and rollback for infrastructure. "Who opened port 22 to the world, and when?" is answered by <code>git log</code>, not by guessing.</li>
  <li><strong>JSON</strong> is the language of AWS permissions. The SAA-C03 exam regularly shows you a policy document and asks what it allows. If you can't read <code>Effect</code>, <code>Action</code>, <code>Resource</code> and <code>Condition</code> fluently, you lose easy marks.</li>
  <li><strong>YAML</strong> is how most people write CloudFormation, SAM, Kubernetes manifests, CodeBuild buildspecs and GitHub Actions workflows. One wrong indent or an unquoted <code>NO</code> can break a deployment, or worse, deploy something different from what you meant.</li>
</ul>` },

    { type: "concept", title: "Concept 1: Git for infrastructure", html: DG_0303_GIT + `
<h3>What Git is</h3>
<p><strong>Git</strong> is a <em>distributed version control system</em>. Every clone holds the complete history, so you can commit, branch and inspect history offline. A <strong>commit</strong> is a snapshot of the whole project plus metadata (author, time, message, parent commit), identified by a hash such as <code>3f9c2ab</code>. Because each commit points to its parent, history forms a chain you can walk back.</p>

<h3>The four places your code lives</h3>
<table>
<thead><tr><th>Place</th><th>What it holds</th><th>Commands that move changes</th></tr></thead>
<tbody>
<tr><td><strong>Working tree</strong></td><td>The files on disk that you edit</td><td><code>git status</code>, <code>git diff</code> show what changed</td></tr>
<tr><td><strong>Staging area (index)</strong></td><td>The exact set of changes that will go into the next commit</td><td><code>git add file</code>, <code>git add -p</code> (stage chunk by chunk), <code>git restore --staged file</code></td></tr>
<tr><td><strong>Local repository</strong></td><td>All commits and branches, in the <code>.git</code> folder</td><td><code>git commit -m "…"</code>, <code>git log</code>, <code>git switch</code></td></tr>
<tr><td><strong>Remote</strong> (usually <code>origin</code>)</td><td>The shared copy on GitHub, GitLab, Bitbucket and so on</td><td><code>git push</code>, <code>git fetch</code>, <code>git pull</code></td></tr>
</tbody></table>
<div class="callout tip"><strong>Why a staging area?</strong> It lets you build a commit deliberately. You might change a template and a README in one sitting but commit them separately, so each commit does one thing and is easy to review and revert.</div>

<h3>Branches, merge and rebase</h3>
<ul>
  <li>A <strong>branch</strong> is just a movable pointer to a commit. Creating one is instant: <code>git switch -c feature/add-s3-bucket</code>.</li>
  <li><strong>Merge</strong> combines two lines of history. If <code>main</code> hasn't moved, Git simply moves the pointer forward (<em>fast-forward</em>). Otherwise it creates a <em>merge commit</em> with two parents. If both sides changed the same lines you get a <strong>merge conflict</strong> that you resolve by hand.</li>
  <li><strong>Rebase</strong> replays your commits on top of the latest <code>main</code>, giving a straight history. It <em>rewrites</em> commit hashes, so the rule is: <strong>never rebase a branch that others are already using</strong>.</li>
  <li><strong>Tags</strong> mark releases (<code>git tag -a v1.4.0 -m "…"</code>). Pipelines often deploy a tag to production, so you know exactly which code is running.</li>
</ul>

<h3>Pull requests and code review</h3>
<p>A <strong>pull request (PR)</strong>, called a merge request in GitLab, asks to merge a branch into <code>main</code>. It is the control point for infrastructure: reviewers read the diff, automated checks run (linting, security scanning, <code>cdk diff</code> or a CloudFormation change set), and <strong>branch protection</strong> rules stop anyone pushing directly to <code>main</code>. For infrastructure, the PR is your change-approval record and your audit trail.</p>

<h3>Branching strategies</h3>
<table>
<thead><tr><th></th><th>Trunk-based development</th><th>GitFlow</th></tr></thead>
<tbody>
<tr><td>Shape</td><td>Short-lived branches (hours to a couple of days) merged into <code>main</code> often</td><td>Long-lived <code>develop</code>, <code>release/*</code>, <code>hotfix/*</code> and <code>main</code> branches</td></tr>
<tr><td>Releases</td><td>Continuous; incomplete features hidden with feature flags</td><td>Scheduled release branches</td></tr>
<tr><td>Fits</td><td>CI/CD, cloud services, IaC repos (the common choice today)</td><td>Products with versioned releases and several supported versions</td></tr>
<tr><td>Risk</td><td>Needs good automated tests</td><td>Painful merges between long-lived branches; environments drift</td></tr>
</tbody></table>

<h3>Keeping secrets out of Git</h3>
<p>Anything pushed to a remote should be treated as permanent: history keeps it even after you delete the file, forks and clones copy it, and public repositories are scanned by attackers within minutes. Never commit:</p>
<ul>
  <li><code>~/.aws/credentials</code>, access keys, <code>.env</code> files, private keys (<code>*.pem</code>, <code>id_rsa</code>)</li>
  <li><code>terraform.tfstate</code> (it can contain passwords in plain text), <code>cdk.out/</code>, <code>node_modules/</code>, <code>.venv/</code>, build artefacts</li>
</ul>
<p>Layers of defence: a <code>.gitignore</code>; a pre-commit scanner such as <strong>git-secrets</strong> (from AWS Labs), gitleaks or trufflehog; <strong>secret scanning with push protection</strong> on GitHub; and above all, <strong>not having long-lived keys at all</strong>: use IAM Identity Center (SSO) for people and IAM roles (instance profiles, OIDC federation for CI/CD) for machines. Application secrets belong in <strong>AWS Secrets Manager</strong> or <strong>SSM Parameter Store</strong>, referenced by name.</p>
<p><strong>Signed commits</strong> (<code>git commit -S</code> with a GPG or SSH key) prove who made a commit; branch protection can require them. They matter for regulated environments and supply-chain security (M38).</p>` },

    { type: "concept", title: "Concept 2: JSON and IAM policy anatomy", html: `
<h3>JSON syntax rules</h3>
<p><strong>JSON</strong> (JavaScript Object Notation) has just six value types: <em>object</em> <code>{ }</code>, <em>array</em> <code>[ ]</code>, <em>string</em>, <em>number</em>, <code>true</code>/<code>false</code> and <code>null</code>. It is strict:</p>
<ul>
  <li>Keys and strings use <strong>double quotes</strong> only: <code>"Effect"</code>, never <code>'Effect'</code>.</li>
  <li><strong>No trailing commas</strong>: <code>["a", "b",]</code> is invalid.</li>
  <li><strong>No comments</strong>. Use a <code>"Sid"</code> (statement ID) or a description field to document intent.</li>
  <li>Keys should be unique within an object. Duplicate keys are technically allowed by the spec but parsers disagree on which one wins, so treat them as a bug.</li>
  <li>Whitespace doesn't matter, so the same document can be "pretty" or minified.</li>
</ul>

<h3>Anatomy of an IAM policy</h3>
<pre><code>{
  "Version": "2012-10-17",                 &lt;- policy language version; always use this value
  "Statement": [                           &lt;- one or more statements
    {
      "Sid": "ReadReports",                &lt;- optional label
      "Effect": "Allow",                   &lt;- Allow or Deny
      "Action": ["s3:GetObject"],          &lt;- service:operation, wildcards allowed (s3:Get*)
      "Resource": "arn:aws:s3:::reports-bucket/*",   &lt;- which resources (ARNs)
      "Condition": {                       &lt;- optional: when it applies
        "IpAddress": { "aws:SourceIp": "203.0.113.0/24" }
      }
    }
  ]
}</code></pre>
<table>
<thead><tr><th>Element</th><th>Meaning</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td><code>Version</code></td><td>Policy language version</td><td>Use <code>2012-10-17</code>. The older <code>2008-10-17</code> doesn't support policy variables such as <code>\${aws:username}</code>.</td></tr>
<tr><td><code>Effect</code></td><td><code>Allow</code> or <code>Deny</code></td><td>An explicit Deny overrides any Allow.</td></tr>
<tr><td><code>Action</code> / <code>NotAction</code></td><td>API operations, e.g. <code>ec2:StartInstances</code></td><td><code>NotAction</code> with <code>Allow</code> grants <em>everything except</em> the list, which is usually broader than intended.</td></tr>
<tr><td><code>Resource</code> / <code>NotResource</code></td><td>ARNs the statement covers</td><td>S3 has two levels: the <strong>bucket</strong> ARN (<code>arn:aws:s3:::name</code>) for <code>ListBucket</code>, and the <strong>object</strong> ARN (<code>arn:aws:s3:::name/*</code>) for <code>GetObject</code>/<code>PutObject</code>.</td></tr>
<tr><td><code>Principal</code></td><td>Who the policy applies to</td><td>Only in <strong>resource-based</strong> policies (bucket policies, KMS key policies, role trust policies, SQS queue policies). <code>"Principal": "*"</code> means anyone, so it is usually paired with a Condition.</td></tr>
<tr><td><code>Condition</code></td><td><code>{ operator: { key: value } }</code></td><td>Multiple keys in one block are AND-ed. Multiple values for one key are OR-ed.</td></tr>
</tbody></table>

<h3>Condition operators and keys you'll see most</h3>
<table>
<thead><tr><th>Operator</th><th>Example</th><th>Use</th></tr></thead>
<tbody>
<tr><td><code>StringEquals</code> / <code>StringLike</code></td><td><code>"aws:RequestedRegion": "eu-west-1"</code></td><td>Exact match / wildcard match (<code>*</code>, <code>?</code>)</td></tr>
<tr><td><code>ArnLike</code> / <code>ArnEquals</code></td><td><code>"aws:SourceArn": "arn:aws:sns:*:111122223333:alerts"</code></td><td>Restrict which resource may invoke a service (confused-deputy protection)</td></tr>
<tr><td><code>IpAddress</code> / <code>NotIpAddress</code></td><td><code>"aws:SourceIp": "203.0.113.0/24"</code></td><td>Restrict by public caller IP (CIDR from M02)</td></tr>
<tr><td><code>Bool</code></td><td><code>"aws:SecureTransport": "false"</code></td><td>Detect plain HTTP requests (deny them)</td></tr>
<tr><td><code>BoolIfExists</code></td><td><code>"aws:MultiFactorAuthPresent": "false"</code></td><td>"…IfExists" also matches when the key is absent, which avoids gaps</td></tr>
<tr><td><code>StringEquals</code> + org key</td><td><code>"aws:PrincipalOrgID": "o-a1b2c3d4e5"</code></td><td>Allow only principals from your AWS Organization</td></tr>
</tbody></table>
<p><strong>Policy variables</strong> are placeholders filled in at request time, such as <code>\${aws:username}</code>, <code>\${aws:PrincipalTag/Project}</code> or <code>\${aws:SourceVpce}</code>. One policy can then serve many users ("each user can access only <code>home/&lt;their name&gt;/</code>").</p>

<h3>Identity-based vs resource-based policies</h3>
<ul>
  <li><strong>Identity-based</strong> policies attach to a user, group or role and say what that identity may do. No <code>Principal</code> element.</li>
  <li><strong>Resource-based</strong> policies attach to a resource (S3 bucket, KMS key, SQS queue, Lambda function, the trust policy of a role) and say <em>who</em> may use it, so they include <code>Principal</code>. They are how cross-account access usually works.</li>
</ul>
` + DG_0303_EVAL },

    { type: "concept", title: "Concept 3: YAML without surprises", html: `
<h3>What YAML is</h3>
<p><strong>YAML</strong> ("YAML Ain't Markup Language") is a human-friendly data format. Since version 1.2 it is a superset of JSON: any valid JSON document is also valid YAML. It expresses structure with <strong>indentation</strong> instead of braces.</p>
<pre><code># A comment (JSON has none)
service: orders-api          # map: key: value
replicas: 3                  # integer
enabled: true                # boolean
ports:                       # list ("sequence"): each item starts with "- "
  - 80
  - 443
owner:                       # nested map: indented under its parent
  team: payments
  email: "payments@example.com"
tags: [prod, pci]            # flow style (JSON-like) also works</code></pre>

<h3>The rules that bite</h3>
<ol>
  <li><strong>Indentation is structure.</strong> Use spaces only; <strong>tabs are forbidden</strong> for indentation. Two spaces is the usual convention. Siblings must line up exactly.</li>
  <li><strong>Unquoted values are typed automatically</strong> ("implicit typing"), and older YAML 1.1 parsers (for example PyYAML, still widely used) are very eager:
    <table>
    <thead><tr><th>You write</th><th>YAML 1.1 parser reads</th><th>Write instead</th></tr></thead>
    <tbody>
    <tr><td><code>country: NO</code></td><td><code>false</code> (the "Norway problem": yes/no/on/off/y/n are booleans)</td><td><code>country: "NO"</code></td></tr>
    <tr><td><code>mode: 0644</code></td><td>420 (octal)</td><td><code>mode: "0644"</code></td></tr>
    <tr><td><code>version: 1.10</code></td><td>the float 1.1</td><td><code>version: "1.10"</code></td></tr>
    <tr><td><code>released: 2024-05-01</code></td><td>a date object, not a string</td><td><code>released: "2024-05-01"</code></td></tr>
    <tr><td><code>account: 012345678901</code></td><td>a number (and the leading 0 may be lost)</td><td><code>account: "012345678901"</code></td></tr>
    </tbody></table>
    YAML 1.2 only treats <code>true</code>/<code>false</code> as booleans, but you rarely know which version a tool uses. <strong>When in doubt, quote it.</strong> AWS account IDs, which can start with 0, are the classic AWS example.</li>
  <li><strong>Special characters need quotes.</strong> A value containing <code>: </code> or starting with <code>*</code>, <code>&amp;</code>, <code>!</code>, <code>{</code>, <code>[</code>, <code>%</code>, <code>@</code> or a backtick must be quoted. Single quotes are literal; double quotes allow escapes like <code>\\n</code>.</li>
</ol>

<h3>Multi-line strings</h3>
<pre><code>script: |          # literal block: keeps newlines (perfect for shell scripts, EC2 user data)
  #!/bin/bash
  dnf -y install nginx
  systemctl enable --now nginx
description: &gt;     # folded block: newlines become spaces (long prose)
  This stack creates the orders API
  and its DynamoDB table.</code></pre>
<p>Add <code>-</code> to strip the final newline (<code>|-</code>, <code>&gt;-</code>).</p>

<h3>Anchors and aliases</h3>
<pre><code>defaults: &amp;defaults        # &amp; defines an anchor
  timeout: 30
  memory: 512
worker:
  &lt;&lt;: *defaults            # * refers to it; &lt;&lt; merges the map (a YAML 1.1 feature)
  memory: 1024             # override one key</code></pre>
<p>Docker Compose and GitLab CI use these heavily. Support varies between tools, so check before relying on anchors in other templates.</p>

<h3>CloudFormation's short-form intrinsic functions</h3>
<p>CloudFormation lets you write intrinsic functions as YAML <strong>tags</strong>:</p>
<pre><code>Resources:
  LogsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "\${AWS::StackName}-logs-\${AWS::AccountId}"   # Fn::Sub
  ReadPolicy:
    Type: AWS::IAM::ManagedPolicy
    Properties:
      PolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Action: s3:GetObject
            Resource: !Sub "\${LogsBucket.Arn}/*"           # .Arn via Sub; or !GetAtt LogsBucket.Arn
Outputs:
  BucketName:
    Value: !Ref LogsBucket                                  # Ref returns the bucket name</code></pre>
<ul>
  <li><code>!Ref</code>, <code>!Sub</code>, <code>!GetAtt</code>, <code>!Join</code>, <code>!If</code> and friends are <strong>custom tags</strong>, not standard YAML. A generic parser such as Python's <code>yaml.safe_load</code> fails with <em>"could not determine a constructor for the tag '!Ref'"</em>. Use <strong>cfn-lint</strong> or a CloudFormation-aware library instead.</li>
  <li>The long form (<code>Fn::Sub:</code>, <code>Ref:</code>) is plain YAML and is what the JSON format uses.</li>
  <li>You can't put one short form directly inside another in some positions (for example <code>!Base64 !Sub …</code>). Use the long form for at least one of them: <code>Fn::Base64: !Sub …</code>.</li>
</ul>

<h3>JSON ↔ YAML</h3>
<p>The same IAM statement in both formats:</p>
<pre><code>{"Effect": "Allow", "Action": ["s3:GetObject"], "Resource": "arn:aws:s3:::reports-bucket/*"}

Effect: Allow
Action:
  - s3:GetObject
Resource: arn:aws:s3:::reports-bucket/*</code></pre>
<p>CloudFormation accepts either format. On the command line, <code>yq</code> converts (<code>yq -o=json template.yaml</code>), but note that generic converters don't understand the <code>!Ref</code> short forms.</p>` },

    { type: "workflow", title: "Workflow: shipping an infrastructure change through Git", html: `
<p>This is the loop you will repeat for every change from M36 (CloudFormation) onwards: here, adding an encrypted S3 bucket to a team's CloudFormation repository.</p>
<ol class="flow">
  <li><strong>Sync and branch.</strong> <code>git switch main &amp;&amp; git pull</code>, then <code>git switch -c feature/reports-bucket</code>. Start from the latest <code>main</code> to avoid conflicts later.</li>
  <li><strong>Edit</strong> <code>templates/storage.yaml</code>. Keep the change small and focused: one bucket and its policy, not a refactor of the whole file.</li>
  <li><strong>Validate locally.</strong> <code>yamllint templates/</code> (syntax and style), <code>cfn-lint templates/storage.yaml</code> (CloudFormation rules: valid properties, valid references, deprecated runtimes), and <code>aws cloudformation validate-template</code>. Pre-commit hooks can run these, plus a secret scanner, automatically.</li>
  <li><strong>Stage deliberately.</strong> <code>git status</code>, <code>git diff</code>, then <code>git add -p</code> to review each chunk as you stage it.</li>
  <li><strong>Commit with intent.</strong> <code>git commit -m "Add reports bucket with SSE-KMS and TLS-only policy"</code>. A good message says <em>what</em> and <em>why</em>, because future-you reads it during an incident.</li>
  <li><strong>Push and open a PR.</strong> <code>git push -u origin feature/reports-bucket</code>, then open the pull request with a description and, ideally, the change-set or <code>cdk diff</code> output.</li>
  <li><strong>Automated checks run</strong> on the PR: lint, policy checks (for example IAM Access Analyzer policy validation or cfn-guard rules such as "every bucket must block public access"), unit tests, and a CloudFormation <em>change set</em> that shows exactly which resources will be added, modified or <strong>replaced</strong>.</li>
  <li><strong>Peer review.</strong> A colleague reads the diff with a security eye: wildcards in Action or Resource, <code>Principal: "*"</code>, 0.0.0.0/0 ingress, missing encryption, replacement of stateful resources.</li>
  <li><strong>Merge</strong> (squash or merge commit, per team rules). Branch protection guarantees the checks passed and someone approved.</li>
  <li><strong>Deploy from main</strong> through the pipeline (M38), not from a laptop. Tag the release if your team deploys tags. Rollback = revert the commit and let the pipeline deploy again.</li>
</ol>
<div class="callout"><strong>The audit trail you get for free:</strong> who changed what (commit author), why (message and PR description), who approved it (PR review), and exactly what was deployed (commit hash in the pipeline run). Combine it with CloudTrail (M30) and you can answer almost any "how did this get here?" question.</div>` },

    { type: "aws", title: "Where Git, JSON and YAML show up on AWS", html: `
<table>
<thead><tr><th>AWS feature</th><th>Format</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>IAM identity policies, role trust policies, S3 bucket policies, KMS key policies, SQS/SNS policies, SCPs</td><td>JSON</td><td>Always JSON, even when embedded in a YAML template (written as YAML maps there, converted to JSON on deploy)</td></tr>
<tr><td>CloudFormation templates (M36)</td><td>JSON or YAML</td><td>YAML is more common because it allows comments and short-form functions. Max template body sizes apply: upload large templates to S3.</td></tr>
<tr><td>AWS SAM templates (M16)</td><td>YAML (usually)</td><td>A CloudFormation transform: <code>Transform: AWS::Serverless-2016-10-31</code></td></tr>
<tr><td>AWS CDK (M37)</td><td>TypeScript/Python/… → JSON</td><td><code>cdk synth</code> writes CloudFormation JSON into <code>cdk.out/</code>; <code>cdk.json</code> holds app settings</td></tr>
<tr><td>CodeBuild <code>buildspec.yml</code>, GitHub Actions, GitLab CI (M38)</td><td>YAML</td><td>Build and deploy steps; secrets referenced from Secrets Manager / Parameter Store</td></tr>
<tr><td>Step Functions state machines (M26)</td><td>JSON (Amazon States Language)</td><td>Also JSONata/JSONPath expressions inside</td></tr>
<tr><td>EventBridge event patterns (M25)</td><td>JSON</td><td>Patterns match the JSON structure of events</td></tr>
<tr><td>AWS CLI (M03.02)</td><td>JSON/YAML in and out</td><td><code>--output json|yaml</code>, <code>--cli-input-json</code>/<code>--cli-input-yaml</code>, <code>--generate-cli-skeleton</code></td></tr>
<tr><td>Source control integration</td><td>Git</td><td>CodePipeline and CodeBuild connect to GitHub, GitLab and Bitbucket through <strong>AWS CodeConnections</strong> (formerly CodeStar Connections)</td></tr>
</tbody></table>
<h3>AWS tools that check policies and templates</h3>
<ul>
  <li><strong>IAM policy editor</strong> in the console flags JSON syntax errors and offers a visual editor.</li>
  <li><strong>IAM Access Analyzer policy validation</strong> reports errors, security warnings (for example <code>iam:PassRole</code> with <code>*</code>) and suggestions. Its <em>custom policy checks</em> can fail a pipeline if a change grants new access or makes a resource public.</li>
  <li><strong>IAM policy simulator</strong> tests whether a principal can call an action on a resource.</li>
  <li><strong>cfn-lint</strong> (open source, from AWS) and <strong>CloudFormation Guard</strong> (<code>cfn-guard</code>, policy-as-code rules) check templates before deployment.</li>
  <li>If AWS detects your access key in a public repository, it notifies you and attaches a quarantine managed policy to the user to limit damage. You still have to rotate the key.</li>
</ul>` },

    { type: "examples", title: "Worked examples: four policies every architect should be able to read", html: `
<h3>Example 1: read-only access to one bucket</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListTheBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::reports-bucket"
    },
    {
      "Sid": "ReadObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::reports-bucket/*"
    }
  ]
}</code></pre>
<p><strong>Read it:</strong> two statements because S3 permissions live at two levels. <code>ListBucket</code> acts on the <em>bucket</em> ARN; <code>GetObject</code> acts on <em>objects</em>, hence <code>/*</code>. A common bug is putting both actions on <code>arn:aws:s3:::reports-bucket/*</code>: downloads work but listing fails with AccessDenied.</p>

<h3>Example 2: bucket policy that denies anything not using TLS</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::reports-bucket",
        "arn:aws:s3:::reports-bucket/*"
      ],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    }
  ]
}</code></pre>
<p><strong>Read it:</strong> a <em>resource-based</em> policy (it has <code>Principal</code>). For <em>anyone</em>, deny every S3 action on the bucket and its objects <em>when the request did not use HTTPS</em>. Because it's a Deny, it overrides any Allow anywhere. This is the standard answer to "enforce encryption in transit to S3" (exam task 1.3).</p>

<h3>Example 3: require MFA for destructive actions</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyTerminateWithoutMFA",
      "Effect": "Deny",
      "Action": ["ec2:TerminateInstances", "ec2:DeleteVolume"],
      "Resource": "*",
      "Condition": { "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" } }
    }
  ]
}</code></pre>
<p><strong>Read it:</strong> attach alongside the user's normal permissions. If the session wasn't MFA-authenticated, termination is denied. <code>BoolIfExists</code> matters: with long-term access keys the MFA key is <em>absent</em>, and plain <code>Bool</code> wouldn't match, so the deny wouldn't apply.</p>

<h3>Example 4: attribute-based access control (ABAC) with tags</h3>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "StartStopOwnProjectInstances",
      "Effect": "Allow",
      "Action": ["ec2:StartInstances", "ec2:StopInstances"],
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "StringEquals": { "aws:ResourceTag/Project": "\${aws:PrincipalTag/Project}" }
      }
    }
  ]
}</code></pre>
<p><strong>Read it:</strong> a developer whose role or session is tagged <code>Project=atlas</code> can start and stop only instances tagged <code>Project=atlas</code>. One policy scales to any number of projects: add a tag, not a new policy. (ABAC is covered fully in M05.)</p>

<h3>Example 5: one policy, many users (policy variable)</h3>
<pre><code>"Resource": "arn:aws:s3:::team-home/home/\${aws:username}/*"</code></pre>
<p>User <code>maria</code> gets <code>home/maria/*</code>; user <code>li</code> gets <code>home/li/*</code>. In a CloudFormation <code>!Sub</code> string you must escape it as <code>\${!aws:username}</code>, otherwise CloudFormation tries to substitute it.</p>

<h3>Example 6: catching errors before AWS does</h3>
<pre><code>$ echo '{"Effect": "Allow", "Action": ["s3:GetObject",], }' | jq .
jq: error (at &lt;stdin&gt;:1): Expected another array element at line 1, column 51

$ python3 -m json.tool policy.json        # pretty-prints, or reports the line/column of the error

$ yamllint storage.yaml
storage.yaml
  14:5   error    wrong indentation: expected 6 but found 4  (indentation)
  22:1   error    syntax error: found character '\\t' that cannot start any token

$ cfn-lint storage.yaml
E3002 Additional properties are not allowed ('BucketEncription' was unexpected)
storage.yaml:9:7</code></pre>
<p>Each tool catches a different class of mistake: JSON syntax (jq), YAML syntax and style (yamllint), and CloudFormation semantics such as a misspelt property (cfn-lint). Run them all, ideally automatically.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd use</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Five engineers change the same CloudFormation repository</td><td>Trunk-based development, short-lived branches, PRs with required review and CI checks</td><td>Small, reviewed changes; every deploy traceable to a commit</td></tr>
<tr><td>Contractors must read only their own S3 prefix</td><td>One identity policy with <code>\${aws:username}</code> (or <code>\${aws:PrincipalTag/…}</code>)</td><td>One policy instead of one per person</td></tr>
<tr><td>Security requires all S3 access over HTTPS</td><td>Bucket policy: Deny when <code>aws:SecureTransport</code> is <code>false</code></td><td>Explicit deny can't be overridden by any Allow</td></tr>
<tr><td>Stop a developer from committing an access key</td><td>git-secrets/gitleaks pre-commit hook + GitHub push protection + SSO instead of keys</td><td>Defence in depth: block, detect, and remove the key from the equation</td></tr>
<tr><td>Pipeline should reject templates that create public buckets</td><td>cfn-guard rules or IAM Access Analyzer custom policy checks in CI</td><td>Policy-as-code catches it before deployment, not after</td></tr>
<tr><td>Readable, commented infrastructure templates</td><td>CloudFormation in YAML with short-form functions, linted with cfn-lint</td><td>Comments and less punctuation than JSON</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: a safe IaC repository in 15 minutes", html: `
<p>Run this in WSL, Linux, macOS or AWS CloudShell (git, python3 and jq are preinstalled in CloudShell; add <code>pip install --user yamllint cfn-lint</code>).</p>
<pre><code># 1. Create a repository with a safe .gitignore
mkdir academy-iac &amp;&amp; cd academy-iac &amp;&amp; git init -b main
cat &gt; .gitignore &lt;&lt;'EOF'
.env
*.pem
.aws/
cdk.out/
node_modules/
.venv/
*.tfstate
*.tfstate.*
EOF

# 2. Install git-secrets hooks for this repo (blocks AWS keys in commits)
#    (install git-secrets first: https://github.com/awslabs/git-secrets)
git secrets --install &amp;&amp; git secrets --register-aws

# 3. Write a policy and validate it
mkdir policies &amp;&amp; cat &gt; policies/reports-read.json &lt;&lt;'EOF'
{"Version":"2012-10-17","Statement":[
 {"Sid":"List","Effect":"Allow","Action":"s3:ListBucket","Resource":"arn:aws:s3:::reports-bucket"},
 {"Sid":"Read","Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::reports-bucket/*"}]}
EOF
jq . policies/reports-read.json          # pretty-print = valid JSON
jq -r '.Statement[].Action' policies/reports-read.json

# 4. Ask IAM Access Analyzer for findings (free; uses your academy-admin profile)
aws accessanalyzer validate-policy --policy-type IDENTITY_POLICY \\
  --policy-document file://policies/reports-read.json --profile academy-admin
#   expect: "findings": []   (try adding "Action": "iam:PassRole", "Resource": "*" and run again)

# 5. Commit on a branch
git add . &amp;&amp; git commit -m "Add read-only reports policy"
git switch -c feature/try-a-leak
# a FAKE 40-character secret (AWS's documented EXAMPLE keys are allow-listed by git-secrets, so they won't trigger it)
echo 'aws_secret_access_key = 9dRk2pQv7XzT1mN4bL8sW3yH6cJ0fA5gE2uK7iOq' &gt; leak.txt
git add leak.txt &amp;&amp; git commit -m "oops"     # git-secrets should block this commit
git log --oneline --graph --all</code></pre>
<p>Then break YAML on purpose: write <code>country: NO</code> and <code>mode: 0644</code> to a file and run <code>python3 -c "import yaml,sys; print(yaml.safe_load(open(sys.argv[1])))" file.yaml</code> to watch them become <code>False</code> and <code>420</code>.</p>` },

    { type: "casestudy", title: "Case study: Larkspur Logistics and the over-broad policy", html: `
<p><strong>Context.</strong> Larkspur Logistics (fictional) runs its shipment-tracking platform on AWS, managed with CloudFormation in a single Git repository. Twelve engineers contribute. Until last year, changes were deployed from laptops with <code>aws cloudformation deploy</code> and long-lived IAM user keys.</p>
<p><strong>The incident.</strong> Under deadline pressure, an engineer gave a new Lambda function this inline policy so it could "just work":</p>
<pre><code>- Effect: Allow
  Action: "s3:*"
  Resource: "*"</code></pre>
<p>In the same change, a mis-indented <code>Condition</code> block sat at the level of the statement list instead of inside the statement. YAML parsed it without complaint, but the condition never applied. The template deployed; nobody reviewed it. Three months later a penetration test showed that a server-side request forgery bug in that function could read <strong>every bucket in the account</strong>, including customer exports.</p>
<p><strong>The redesign.</strong></p>
<table>
<thead><tr><th>Problem</th><th>Change</th></tr></thead>
<tbody>
<tr><td>Direct deploys from laptops</td><td>Branch protection on <code>main</code>; deployments only from a pipeline using an IAM role (OIDC), no user keys</td></tr>
<tr><td>No review</td><td>Pull requests with one required approval; CODEOWNERS makes the security team review anything under <code>iam/</code></td></tr>
<tr><td>Syntax "valid" but meaning wrong</td><td>yamllint, cfn-lint and cfn-guard in pre-commit hooks and in CI; a rule bans <code>Action: "*:*"</code>-style wildcards and <code>Resource: "*"</code> for data services</td></tr>
<tr><td>Over-broad permissions</td><td>IAM Access Analyzer custom policy check fails the PR if a change grants new access to sensitive buckets; policies rewritten to name exact actions and bucket ARNs</td></tr>
<tr><td>Keys on laptops</td><td>IAM Identity Center for humans, git-secrets and push protection to catch strays</td></tr>
</tbody></table>
<p><strong>Outcome.</strong> In the first quarter, CI blocked 14 changes (six for wildcards, five for YAML indentation or typing errors, three for unencrypted resources). Average review time was under an hour. The audit finding was closed with evidence taken straight from PR history.</p>
<p><strong>Lessons learned.</strong> A YAML file can be syntactically valid and still wrong, so validate <em>meaning</em> (cfn-lint, policy checks), not just syntax. Explicit, narrow JSON policies are reviewable; wildcards are not. And Git only gives you control if <code>main</code> can't be changed without review.</p>` },

    { type: "exam", html: `
<p>The exam never asks Git or YAML questions directly, but <strong>policy reading</strong> appears often: a JSON exhibit with "What does this policy allow?" or "Which policy meets the requirement?"</p>
<ul>
  <li>Default is <strong>implicit deny</strong>; <strong>explicit Deny always wins</strong>; otherwise an applicable Allow allows (subject to SCPs and boundaries).</li>
  <li>"Enforce HTTPS / encryption in transit to S3" → bucket policy <strong>Deny</strong> with <code>"aws:SecureTransport": "false"</code>.</li>
  <li>"Only from our corporate network" → <code>aws:SourceIp</code> (public IPs) or, via VPC endpoints, <code>aws:SourceVpce</code> / <code>aws:SourceVpc</code>.</li>
  <li>"Only principals in our organization" → <code>aws:PrincipalOrgID</code>.</li>
  <li>"Each user only their own folder" → policy variable <code>\${aws:username}</code>.</li>
  <li>"Scale permissions with tags / many projects" → ABAC: <code>aws:ResourceTag</code> = <code>aws:PrincipalTag</code>.</li>
  <li>Check the <strong>Resource</strong> level: bucket ARN vs <code>bucket/*</code>.</li>
  <li>A policy with <code>Principal</code> is resource-based; without it, identity-based.</li>
</ul>
<table>
<thead><tr><th>Distractor</th><th>Why it's wrong</th></tr></thead>
<tbody>
<tr><td>"Add an Allow to override the Deny"</td><td>Nothing overrides an explicit Deny; remove or narrow the Deny instead</td></tr>
<tr><td>"Store the access keys in the repository encrypted / in a config file"</td><td>Use roles (temporary credentials) and Secrets Manager; keys in repos are the problem</td></tr>
<tr><td><code>NotAction</code> + Allow to "allow only S3"</td><td>It allows everything <em>except</em> the listed actions</td></tr>
<tr><td>Bool instead of BoolIfExists for MFA</td><td>Requests without the key (access keys) slip past the deny</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Make <code>main</code> the only path to production.</strong> Branch protection, required reviews, required status checks, and a pipeline role that is the only identity allowed to deploy. Break-glass access should exist, be logged and be rare.</li>
  <li><strong>Leaked key playbook (in this order):</strong> 1) deactivate or delete the key in IAM immediately, 2) check CloudTrail for what it was used for and clean up (unknown instances, users, roles), 3) remove it from Git history (<code>git filter-repo</code> or BFG) and force-push, rotate anything else in the same file, 4) find out how it happened and fix the process. Deleting the commit alone is not remediation: assume the key was copied within minutes.</li>
  <li><strong>Prefer policy-as-code over reviewer vigilance.</strong> Humans miss wildcards at 6 pm on a Friday; cfn-guard and Access Analyzer checks don't.</li>
  <li><strong>Quote aggressively in YAML</strong>: account IDs, version numbers, ports-with-leading-zeros, country codes, anything that looks like yes/no. It costs nothing.</li>
  <li><strong>Keep policies small and named.</strong> Customer-managed policies with clear names and Sids are easier to audit than large inline policies, and there are size limits on policies (for example, managed policies have a character limit), so huge "kitchen sink" policies eventually stop fitting.</li>
  <li><strong>Watch out for replacement in CloudFormation diffs.</strong> Renaming a resource's logical ID or changing certain properties (such as a bucket name or an RDS identifier) replaces the resource. Review change sets for "Replacement: True" on anything stateful.</li>
  <li><strong>Monorepo or many repos?</strong> One repository per service (and its infrastructure) keeps ownership clear; a platform repository holds shared networking and account baselines. Either works if every repo follows the same PR and pipeline rules.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Git moves changes: working tree → <code>git add</code> → staging area → <code>git commit</code> → local repo → <code>git push</code> → remote.</li>
  <li>Change production only through pull requests with review, automated checks and branch protection; deploy from <code>main</code> via a pipeline.</li>
  <li>Never commit keys, <code>.env</code>, state files or build output. Use <code>.gitignore</code>, secret scanners and, best of all, roles instead of keys. If a key leaks: deactivate first, then investigate and purge.</li>
  <li>JSON: double quotes, no trailing commas, no comments.</li>
  <li>IAM policy = Version + Statements of Effect, Action, Resource, optional Condition; Principal only in resource-based policies.</li>
  <li>Implicit deny by default; explicit Deny always wins.</li>
  <li>S3 needs both the bucket ARN (list) and <code>bucket/*</code> (objects).</li>
  <li>YAML: spaces not tabs, indentation is structure, quote anything that might be coerced (NO, 0644, 1.10, account IDs).</li>
  <li><code>!Ref</code>/<code>!Sub</code>/<code>!GetAtt</code> are CloudFormation tags; validate templates with cfn-lint, not a generic YAML parser.</li>
</ul>` }
  ],
  drills: [
    { id: "M03.03-d1", q: "Is <code>{\"name\": 'web'}</code> valid JSON? (yes/no)", answers: ["no", "n"], hint: "Look at the quote characters.", explain: "JSON strings must use double quotes: <code>{\"name\": \"web\"}</code>." },
    { id: "M03.03-d2", q: "Is <code>{\"ports\": [80, 443,]}</code> valid JSON? (yes/no)", answers: ["no", "n"], explain: "Trailing commas are not allowed in JSON." },
    { id: "M03.03-d3", q: "A YAML 1.1 parser (such as PyYAML) reads <code>country: NO</code>. What value does <code>country</code> get?", answers: ["false", "False", "boolean false"], hint: "The \"Norway problem\".", explain: "In YAML 1.1, yes/no/on/off/y/n are booleans, so NO becomes <code>false</code>. Quote it: <code>\"NO\"</code>." },
    { id: "M03.03-d4", q: "An identity policy Allows <code>s3:GetObject</code> on a bucket, and the bucket policy explicitly Denies it for that user. Is the request allowed or denied?", answers: ["denied", "deny"], explain: "An explicit Deny always wins over any Allow." },
    { id: "M03.03-d5", q: "Which IAM policy element appears only in resource-based policies (and role trust policies)?", answers: ["Principal"], explain: "Identity-based policies apply to the identity they're attached to, so they have no Principal." },
    { id: "M03.03-d6", q: "Which Git command moves changes from the working tree into the staging area?", answers: ["git add", "add"], explain: "<code>git add</code> stages; <code>git commit</code> records the staged snapshot." },
    { id: "M03.03-d7", q: "What value should the <code>Version</code> element of an IAM policy have?", answers: ["2012-10-17", "\"2012-10-17\""], explain: "The current policy language version; required for policy variables." },
    { id: "M03.03-d8", q: "Which YAML block-scalar indicator keeps line breaks exactly (ideal for an EC2 user-data script)? Type the single character.", answers: ["|"], explain: "<code>|</code> is the literal style; <code>&gt;</code> folds lines into spaces." },
    { id: "M03.03-d9", q: "Which global condition key do you test (with value \"false\") to deny S3 requests that don't use HTTPS?", answers: ["aws:SecureTransport", "SecureTransport"], explain: "<code>\"Bool\": {\"aws:SecureTransport\": \"false\"}</code> in a Deny statement." }
  ],
  check: [
    { id: "M03.03-k1", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "A company must ensure that all access to an S3 bucket containing invoices uses encryption in transit. Which solution meets this requirement?",
      options: [
        { t: "A bucket policy statement that Denies <code>s3:*</code> for all principals when <code>aws:SecureTransport</code> is <code>false</code>", c: true, why: "The explicit Deny blocks every plain-HTTP request regardless of any Allow." },
        { t: "Enable default encryption (SSE-S3) on the bucket", c: false, why: "That's encryption at rest, not in transit." },
        { t: "An identity policy that Allows <code>s3:GetObject</code> only when <code>aws:SecureTransport</code> is <code>true</code>", c: false, why: "Other Allows (other policies or principals) could still permit HTTP; only a Deny in the bucket policy covers everyone." },
        { t: "Enable S3 Block Public Access", c: false, why: "It prevents public access, not unencrypted access." }
      ] },
    { id: "M03.03-k2", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A user's identity policy Allows <code>s3:GetObject</code> and <code>s3:ListBucket</code> on <code>arn:aws:s3:::reports-bucket/*</code>. The user can download objects but gets AccessDenied when listing the bucket. What is the cause?",
      options: [
        { t: "<code>s3:ListBucket</code> applies to the bucket ARN <code>arn:aws:s3:::reports-bucket</code>, not to <code>/*</code>", c: true, why: "Listing is a bucket-level action; object actions use <code>bucket/*</code>. The policy needs both resources." },
        { t: "The policy needs <code>\"Version\": \"2008-10-17\"</code>", c: false, why: "2012-10-17 is the current version; the version isn't the problem." },
        { t: "Listing a bucket always requires a bucket policy", c: false, why: "An identity policy is enough within the same account." },
        { t: "The user needs <code>s3:ListAllMyBuckets</code>", c: false, why: "That lists all buckets in the account; it's not needed to list one bucket's objects." }
      ] },
    { id: "M03.03-k3", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "A company wants each of its 200 analysts to access only <code>s3://team-data/home/&lt;their-username&gt;/</code>, with the LEAST administrative effort as analysts join and leave. What should a solutions architect do?",
      options: [
        { t: "Attach one policy to the analysts' group that uses the <code>\${aws:username}</code> policy variable in the Resource ARN", c: true, why: "One policy resolves per user at request time; no per-user policies to maintain." },
        { t: "Create a separate IAM policy for each analyst", c: false, why: "Works, but it's 200 policies to create and maintain." },
        { t: "Create one bucket per analyst", c: false, why: "High overhead, and bucket limits make it impractical." },
        { t: "Use S3 ACLs on each prefix", c: false, why: "ACLs are legacy (disabled by default for new buckets) and can't express per-prefix user rules cleanly." }
      ] },
    { id: "M03.03-k4", type: "multi", domain: "D1", task: "1.1", level: 200,
      stem: "A developer accidentally pushed an IAM user's access key to a public GitHub repository. Which TWO actions should be taken FIRST?",
      options: [
        { t: "Deactivate (then delete) the exposed access key and issue a new one if still needed", c: true, why: "Stops further misuse immediately. This comes before anything else." },
        { t: "Review CloudTrail for activity performed with the key and remove anything the attacker created", c: true, why: "You must find and undo unauthorized actions (instances, users, roles)." },
        { t: "Delete the commit and force-push; that removes the risk", c: false, why: "The key may already be copied; history clean-up is needed but doesn't stop misuse." },
        { t: "Make the repository private", c: false, why: "Too late: assume the key was harvested within minutes." },
        { t: "Wait for AWS to quarantine the key", c: false, why: "AWS may attach a quarantine policy, but it limits only some actions and doesn't rotate the key; you must act." }
      ] },
    { id: "M03.03-k5", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A team's CloudFormation YAML template contains <code>Owner: NO</code> (a Norwegian team code) and deploys with the tag value <code>false</code>. What is the BEST fix?",
      options: [
        { t: "Quote the value: <code>Owner: \"NO\"</code>", c: true, why: "Quoting forces a string, avoiding YAML 1.1 boolean coercion." },
        { t: "Convert the template to JSON", c: false, why: "Would work, but it's a large change to fix one value; quoting is the targeted fix." },
        { t: "Use a tab before the value", c: false, why: "Tabs aren't allowed for indentation and don't change typing." },
        { t: "Write it in lowercase: <code>Owner: no</code>", c: false, why: "Lowercase <code>no</code> is also a YAML 1.1 boolean." }
      ] },
    { id: "M03.03-k6", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "Which policy element combination allows developers to stop and start ONLY EC2 instances whose <code>Project</code> tag matches the <code>Project</code> tag on their own role, without writing a policy per project?",
      options: [
        { t: "Condition <code>StringEquals</code> with <code>aws:ResourceTag/Project</code> = <code>\${aws:PrincipalTag/Project}</code>", c: true, why: "This is attribute-based access control (ABAC): one policy, tag matching at request time." },
        { t: "<code>NotAction</code> listing every other EC2 action", c: false, why: "Allows everything except the list, and has nothing to do with tags." },
        { t: "<code>Principal</code> set to each developer's ARN", c: false, why: "Principal isn't used in identity policies, and listing people doesn't scale." },
        { t: "A <code>Resource</code> list of every instance ID", c: false, why: "Breaks as soon as instances are replaced." }
      ] }
  ],
  cards: ["fc-M03-3-01", "fc-M03-3-02", "fc-M03-3-03", "fc-M03-3-04", "fc-M03-3-05", "fc-M03-3-06", "fc-M03-3-07", "fc-M03-3-08", "fc-M03-3-09", "fc-M03-3-10", "fc-M03-3-11", "fc-M03-3-12"],
  references: [
    "IAM User Guide: <em>IAM JSON policy elements reference</em>, <em>Policy evaluation logic</em>, <em>IAM policy elements: Variables and tags</em>",
    "Amazon S3 User Guide: <em>Security best practices</em> (enforcing <code>aws:SecureTransport</code>)",
    "AWS CloudFormation User Guide: <em>Intrinsic function reference</em> (short form and long form)",
    "awslabs/git-secrets, cfn-lint, CloudFormation Guard (GitHub)",
    "<em>Pro Git</em> (git-scm.com/book), chapters 2–3",
    "YAML 1.2.2 specification (yaml.org)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M03-3-01", front: "Git's four places, and the commands between them?", back: "Working tree → <code>git add</code> → staging area (index) → <code>git commit</code> → local repo → <code>git push</code> → remote. <code>git pull</code> = fetch + merge." },
  { id: "fc-M03-3-02", front: "Merge vs rebase?", back: "Merge joins histories (may add a merge commit). Rebase replays your commits on the new base, rewriting hashes; never rebase shared branches." },
  { id: "fc-M03-3-03", front: "Access key leaked to a public repo: first steps?", back: "1) Deactivate/delete the key. 2) Check CloudTrail and undo attacker actions. 3) Purge from history and force-push. 4) Fix the process (roles/SSO, scanners)." },
  { id: "fc-M03-3-04", front: "JSON's three most common syntax errors?", back: "Single quotes, trailing commas, comments. JSON allows none of them." },
  { id: "fc-M03-3-05", front: "IAM policy statement elements?", back: "Sid (optional), Effect, Action/NotAction, Resource/NotResource, Condition (optional), Principal (resource-based only)." },
  { id: "fc-M03-3-06", front: "IAM evaluation in one sentence?", back: "Implicit deny by default; an explicit Deny anywhere wins; otherwise an applicable Allow allows, unless a guardrail (SCP, boundary, session policy) blocks it." },
  { id: "fc-M03-3-07", front: "S3 ARNs: bucket vs objects?", back: "<code>arn:aws:s3:::bucket</code> for bucket actions (ListBucket); <code>arn:aws:s3:::bucket/*</code> for object actions (GetObject, PutObject)." },
  { id: "fc-M03-3-08", front: "Enforce TLS to S3?", back: "Bucket policy: Deny <code>s3:*</code>, Principal <code>*</code>, Condition <code>Bool aws:SecureTransport = false</code>." },
  { id: "fc-M03-3-09", front: "Why BoolIfExists for MFA conditions?", back: "Requests made with long-term access keys don't include <code>aws:MultiFactorAuthPresent</code>; IfExists makes the deny still apply when the key is absent." },
  { id: "fc-M03-3-10", front: "The YAML \"Norway problem\"?", back: "YAML 1.1 reads unquoted yes/no/on/off/y/n (any case) as booleans: <code>NO</code> → false. Quote such values." },
  { id: "fc-M03-3-11", front: "YAML <code>|</code> vs <code>&gt;</code>?", back: "<code>|</code> literal block keeps newlines (scripts, user data). <code>&gt;</code> folded block joins lines with spaces (prose)." },
  { id: "fc-M03-3-12", front: "Which tools validate what?", back: "jq / json.tool: JSON syntax. yamllint: YAML syntax and style. cfn-lint: CloudFormation semantics. cfn-guard / Access Analyzer: policy rules." }
);
// ================================================================== 04_devenv.js
/* ================================================================ M03.04 Developer environment */
var DG_0304_VMCT = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0304at m0304ad">
  <title id="m0304at">Virtual machines compared with containers</title>
  <desc id="m0304ad">Left: virtual machines each run a full guest operating system on a hypervisor. Right: containers share the host operating system kernel through a container runtime, and package only the application and its libraries.</desc>
  <text class="dg-tb" x="12" y="24">Virtual machines (e.g. EC2 instances)</text>
  <text class="dg-ts" x="12" y="42">each VM boots its own OS: GBs in size, minutes to start</text>
  <rect class="dg-edge" x="24" y="56" width="108" height="34" rx="5"/><text class="dg-t" x="36" y="78">App A</text>
  <rect class="dg-edge" x="140" y="56" width="108" height="34" rx="5"/><text class="dg-t" x="152" y="78">App B</text>
  <rect class="dg-edge" x="256" y="56" width="108" height="34" rx="5"/><text class="dg-t" x="268" y="78">App C</text>
  <rect class="dg-box" x="24" y="96" width="108" height="34" rx="5"/><text class="dg-ts" x="36" y="117">bins / libs</text>
  <rect class="dg-box" x="140" y="96" width="108" height="34" rx="5"/><text class="dg-ts" x="152" y="117">bins / libs</text>
  <rect class="dg-box" x="256" y="96" width="108" height="34" rx="5"/><text class="dg-ts" x="268" y="117">bins / libs</text>
  <rect class="dg-info" x="24" y="136" width="108" height="40" rx="5"/><text class="dg-t" x="36" y="161">Guest OS</text>
  <rect class="dg-info" x="140" y="136" width="108" height="40" rx="5"/><text class="dg-t" x="152" y="161">Guest OS</text>
  <rect class="dg-info" x="256" y="136" width="108" height="40" rx="5"/><text class="dg-t" x="268" y="161">Guest OS</text>
  <rect class="dg-good" x="24" y="184" width="340" height="36" rx="5"/><text class="dg-t" x="36" y="207">Hypervisor (AWS Nitro on EC2)</text>
  <rect class="dg-dc" x="24" y="228" width="340" height="36" rx="5"/><text class="dg-t" x="36" y="251">Physical server</text>

  <text class="dg-tb" x="396" y="24">Containers (e.g. ECS, EKS, Lambda images)</text>
  <text class="dg-ts" x="396" y="42">share the host kernel: MBs in size, seconds to start</text>
  <rect class="dg-edge" x="408" y="96" width="108" height="34" rx="5"/><text class="dg-t" x="420" y="118">App A</text>
  <rect class="dg-edge" x="524" y="96" width="108" height="34" rx="5"/><text class="dg-t" x="536" y="118">App B</text>
  <rect class="dg-edge" x="640" y="96" width="108" height="34" rx="5"/><text class="dg-t" x="652" y="118">App C</text>
  <rect class="dg-box" x="408" y="136" width="108" height="40" rx="5"/><text class="dg-ts" x="420" y="160">bins / libs</text>
  <rect class="dg-box" x="524" y="136" width="108" height="40" rx="5"/><text class="dg-ts" x="536" y="160">bins / libs</text>
  <rect class="dg-box" x="640" y="136" width="108" height="40" rx="5"/><text class="dg-ts" x="652" y="160">bins / libs</text>
  <rect class="dg-good" x="408" y="184" width="340" height="36" rx="5"/><text class="dg-t" x="420" y="207">Container runtime (containerd / Docker)</text>
  <rect class="dg-info" x="408" y="228" width="340" height="36" rx="5"/><text class="dg-t" x="420" y="251">Host OS + shared Linux kernel (on a VM)</text>
  <text class="dg-ts" x="12" y="288">In the cloud, containers run on VMs: an ECS/EKS node is an EC2 instance; Fargate isolates each task in its own VM.</text>
</svg>
<figcaption>Figure M03-4a. A VM virtualises hardware; a container virtualises the operating system. Containers are smaller and faster to start, but share the host kernel.</figcaption>
</figure>`;

var DG_0304_PIPE = `
<figure>
<svg class="diagram" viewBox="0 0 760 150" role="img" aria-labelledby="m0304bt m0304bd">
  <title id="m0304bt">From Dockerfile to running container on AWS</title>
  <desc id="m0304bd">A Dockerfile and source code are built into an image, the image is pushed to Amazon ECR, and AWS compute services pull and run it.</desc>
  <defs><marker id="m0304b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="12" y="20" width="124" height="60" rx="8"/><text class="dg-tb" x="22" y="46">Dockerfile</text><text class="dg-ts" x="22" y="66">and source code</text>
  <rect class="dg-info" x="212" y="20" width="124" height="60" rx="8"/><text class="dg-tb" x="222" y="46">Image</text><text class="dg-ts" x="222" y="66">app:1.4.0, layers</text>
  <rect class="dg-edge" x="412" y="20" width="124" height="60" rx="8"/><text class="dg-tb" x="422" y="46">Amazon ECR</text><text class="dg-ts" x="422" y="66">scan on push</text>
  <rect class="dg-good" x="612" y="20" width="136" height="60" rx="8"/><text class="dg-tb" x="622" y="46">Run anywhere</text><text class="dg-ts" x="622" y="66">ECS, EKS, Lambda</text>
  <path class="dg-line" d="M136 50 H210" marker-end="url(#m0304b-ar)"/><text class="dg-ts" x="156" y="42">build</text>
  <path class="dg-line" d="M336 50 H410" marker-end="url(#m0304b-ar)"/><text class="dg-ts" x="358" y="42">push</text>
  <path class="dg-line" d="M536 50 H610" marker-end="url(#m0304b-ar)"/><text class="dg-ts" x="542" y="42">pull + run</text>
  <text class="dg-ts" x="12" y="110">Build once, then promote the SAME image (same digest) through dev, test and prod.</text>
  <text class="dg-ts" x="12" y="130">Authenticate first: aws ecr get-login-password | docker login --username AWS --password-stdin &lt;registry&gt;</text>
</svg>
<figcaption>Figure M03-4b. The container supply chain you will automate in M15 and M38.</figcaption>
</figure>`;

LESSONS.push({
  id: "M03.04", title: "Developer environment", level: 100, minutes: 50,
  objectives: [
    "Set up a working cloud toolchain on Windows (WSL2), macOS or Linux, or use AWS CloudShell with nothing to install",
    "Install and manage Node.js and Python versions for the AWS CLI, AWS CDK and AWS SAM, and explain why CDK always needs Node.js",
    "Explain images, containers, layers, registries, ports, volumes and environment variables, and write a multi-stage Dockerfile",
    "Build, tag and push a container image to Amazon ECR",
    "Make environments reproducible with version pinning, dev containers and pre-commit hooks"
  ],
  sections: [
    { type: "why", html: `
<p>Every later lab in this academy assumes a working toolchain: the AWS CLI with SSO (M03.02), Git (M03.03), Node.js for the AWS CDK (M37), Python for scripts and Lambda functions (M16), and Docker for containers (M15). A broken or inconsistent environment costs hours: "it works on my machine", a Lambda package built on a Mac that crashes in AWS, a CDK CLI too old for the library.</p>
<p>As an architect you also choose environments <em>for teams</em>. Picking the right defaults (CloudShell for quick admin work, dev containers for consistency, CI as the only place release artefacts are built) prevents whole classes of incidents, and it saves money: the quickest way to waste an afternoon is debugging a laptop rather than a system.</p>` },

    { type: "concept", title: "Concept 1: where you work", html: `
<h3>Choosing a workstation setup</h3>
<table>
<thead><tr><th>Option</th><th>What it is</th><th>Good for</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td><strong>WSL2</strong> (Windows)</td><td>A real Linux kernel in a lightweight VM, integrated with Windows. Install with <code>wsl --install</code> (Ubuntu by default).</td><td>Linux tooling on a Windows laptop; the closest match to Amazon Linux behaviour</td><td>Keep projects in the Linux file system (<code>~/projects</code>), not <code>/mnt/c</code>: cross-file-system access is much slower. Use Docker Desktop's WSL2 backend or Docker Engine inside WSL.</td></tr>
<tr><td><strong>macOS</strong></td><td>Unix-like; tools via Homebrew</td><td>Most tooling works natively</td><td>Apple Silicon is <strong>ARM64</strong>: images and native Python wheels you build default to arm64, while many AWS targets default to x86_64 (see the case study).</td></tr>
<tr><td><strong>Linux desktop</strong></td><td>Native</td><td>Fewest surprises</td><td>Distribution differences (apt vs dnf), covered in M03.01</td></tr>
<tr><td><strong>AWS CloudShell</strong></td><td>A browser-based shell in the console, running Amazon Linux 2023, already authenticated as your console identity</td><td>Quick admin tasks, labs, locked-down laptops; free to use</td><td>1 GB of persistent home-directory storage <em>per Region</em> (deleted after 120 days without use in that Region); sessions end after a period of inactivity and have a maximum length; not a place for long-running work</td></tr>
<tr><td><strong>Cloud IDE / remote dev</strong></td><td>VS Code Remote-SSH to an EC2 instance, GitHub Codespaces, or similar</td><td>Heavy builds, standardised team environments</td><td>Costs while running: stop instances; restrict access (use SSM Session Manager rather than open SSH, M13)</td></tr>
</tbody></table>

<h3>VS Code and useful extensions</h3>
<ul>
  <li><strong>AWS Toolkit</strong>: sign in with IAM Identity Center, browse resources, view CloudWatch logs, deploy and debug Lambda/SAM applications. (AI coding assistance such as Amazon Q Developer is a separate extension.)</li>
  <li><strong>YAML</strong> (Red Hat) with CloudFormation schema support, and the <strong>CloudFormation Linter</strong> extension (runs cfn-lint as you type).</li>
  <li><strong>Docker</strong> / <strong>Container Tools</strong>: build, run and inspect containers.</li>
  <li><strong>WSL</strong>, <strong>Remote-SSH</strong> and <strong>Dev Containers</strong>: the editor UI runs locally while the code, terminal and tools run in WSL, on a remote host, or inside a container.</li>
  <li><strong>GitLens</strong> (history and blame) and <strong>EditorConfig</strong> (consistent indentation, which matters for YAML).</li>
</ul>

<h3>Language runtimes: why both Node.js and Python?</h3>
<ul>
  <li>The <strong>AWS CDK CLI</strong> (<code>cdk</code>) is a <strong>Node.js application</strong>. Even if you write your CDK app in Python, Java, C# or Go, the CLI runs on Node, and the construct library itself is JavaScript under the hood (other languages call it through a bridge called jsii). So every CDK user needs Node.js, usually the current <em>LTS</em> (long-term support) release.</li>
  <li><strong>Python</strong> is the most common language for AWS scripting (boto3), Lambda functions and tools like cfn-lint and the AWS SAM CLI's build helpers.</li>
  <li>Use a <strong>version manager</strong> rather than the system interpreter: <code>nvm</code> (or <code>fnm</code>/<code>mise</code>) for Node, <code>pyenv</code> (or <code>uv</code>/<code>mise</code>) for Python, and a per-project <strong>virtual environment</strong> (<code>python3 -m venv .venv</code>) so each project's packages are isolated.</li>
</ul>

<h3>The AWS command-line tools</h3>
<table>
<thead><tr><th>Tool</th><th>Install</th><th>Purpose</th><th>Deep dive</th></tr></thead>
<tbody>
<tr><td>AWS CLI v2</td><td>Official installer (bundles its own Python)</td><td>Every AWS API from the shell</td><td>M03.02</td></tr>
<tr><td>AWS CDK CLI</td><td><code>npm install -g aws-cdk</code> (or per project: <code>npx aws-cdk</code>)</td><td>Synthesise and deploy CDK apps (<code>cdk init</code>, <code>synth</code>, <code>diff</code>, <code>deploy</code>)</td><td>M37</td></tr>
<tr><td>AWS SAM CLI</td><td>Official installer</td><td>Build, test locally (in Docker) and deploy serverless apps</td><td>M16</td></tr>
<tr><td>Docker (Desktop/Engine) or a compatible runtime</td><td>Per OS</td><td>Build and run container images; also used by <code>sam build --use-container</code> and CDK image assets</td><td>M15</td></tr>
<tr><td>Session Manager plugin</td><td>Installer</td><td><code>aws ssm start-session</code>: shell access to instances without SSH or open ports</td><td>M13, M31</td></tr>
</tbody></table>
<div class="callout"><strong>CDK versioning:</strong> the CDK CLI (<code>aws-cdk</code>) and the construct library (<code>aws-cdk-lib</code>) are released separately. Keep the CLI at least as new as the library; an old CLI refuses to work with a newer app and tells you to upgrade.</div>` },

    { type: "concept", title: "Concept 2: containers and Docker, from the ground up", html: DG_0304_VMCT + `
<h3>Why containers?</h3>
<p>A <strong>container</strong> packages an application <em>with</em> everything it needs to run (runtime, libraries, configuration defaults) into one immutable artefact. The same artefact runs on a laptop, in CI and in production, which removes "works on my machine" problems. Containers start in seconds and pack densely onto hosts. On AWS they run on <strong>Amazon ECS</strong>, <strong>Amazon EKS</strong> (Kubernetes), <strong>AWS Fargate</strong> (serverless compute for ECS/EKS), <strong>AWS App Runner</strong> and <strong>AWS Lambda</strong> (container images up to 10 GB). M15 covers the services; this lesson gives you the vocabulary.</p>

<h3>Core vocabulary</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><strong>Image</strong></td><td>A read-only template: a stack of file-system <strong>layers</strong> plus metadata (default command, exposed ports, environment). Identified by a name and <strong>tag</strong> (<code>orders-api:1.4.0</code>) and, immutably, by a content <strong>digest</strong> (<code>sha256:…</code>).</td></tr>
<tr><td><strong>Layer</strong></td><td>The file-system changes produced by one Dockerfile instruction. Layers are cached and shared between images, so rebuilds and pulls only move changed layers.</td></tr>
<tr><td><strong>Container</strong></td><td>A running (or stopped) instance of an image: the image layers + a thin writable layer + an isolated process (Linux namespaces and cgroups). Anything written inside is lost when the container is removed.</td></tr>
<tr><td><strong>Registry / repository</strong></td><td>Where images are stored and shared. Docker Hub is public; <strong>Amazon ECR</strong> is AWS's private (and public) registry, integrated with IAM.</td></tr>
<tr><td><strong>Port mapping</strong></td><td><code>-p 8080:3000</code> publishes container port 3000 on host port 8080 (<em>host:container</em>).</td></tr>
<tr><td><strong>Volume / bind mount</strong></td><td>Storage that outlives the container: a named volume managed by Docker (<code>-v pgdata:/var/lib/postgresql/data</code>) or a host directory (<code>-v "$PWD":/app</code>).</td></tr>
<tr><td><strong>Environment variables</strong></td><td><code>-e LOG_LEVEL=info</code>: how containers receive configuration. Secrets should come from Secrets Manager or Parameter Store at run time, not be baked into the image.</td></tr>
</tbody></table>

<h3>A Dockerfile, line by line (multi-stage build)</h3>
<pre><code># syntax=docker/dockerfile:1

# ---------- stage 1: build ----------
FROM node:22-alpine AS build          # pin a specific base image version
WORKDIR /app
COPY package.json package-lock.json ./ # copy manifests first: this layer is cached
RUN npm ci                             # exact versions from the lockfile
COPY . .                               # then the source (changes often)
RUN npm run build &amp;&amp; npm prune --omit=dev

# ---------- stage 2: runtime ----------
FROM node:22-alpine                    # fresh, small base; build tools left behind
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node                              # don't run as root
EXPOSE 3000                            # documentation: the app listens on 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]         # default process (exec form)</code></pre>
<ul>
  <li><strong>Order instructions from least to most frequently changed</strong> so the cache does most of the work. Copying the lockfile before the source means dependencies are reinstalled only when they change.</li>
  <li><strong>Multi-stage builds</strong> keep compilers, dev dependencies and source out of the final image: smaller, faster to pull, smaller attack surface.</li>
  <li>Add a <code>.dockerignore</code> (<code>node_modules</code>, <code>.git</code>, <code>.env</code>, <code>cdk.out</code>) so secrets and junk never enter the build context.</li>
  <li><code>CMD</code> sets the default command (easily overridden); <code>ENTRYPOINT</code> fixes the executable and treats <code>CMD</code> as its arguments.</li>
</ul>

<h3>The everyday commands</h3>
<pre><code>docker build -t orders-api:1.4.0 .            # build an image from ./Dockerfile
docker images                                 # list local images
docker run -d --name api -p 8080:3000 \\
  -e LOG_LEVEL=info orders-api:1.4.0          # run detached, publish a port, pass config
docker ps                                     # running containers (-a: include stopped)
docker logs -f api                            # follow stdout/stderr (what CloudWatch Logs collects on AWS)
docker exec -it api sh                        # open a shell inside the running container
docker stop api &amp;&amp; docker rm api              # stop and remove
docker buildx build --platform linux/amd64 -t orders-api:1.4.0 .   # build for a specific CPU architecture</code></pre>` },

    { type: "workflow", title: "Workflows: zero to cdk synth, and image to ECR", html: `
<h3>Workflow A: from a fresh machine to your first <code>cdk synth</code></h3>
<ol class="flow">
  <li><strong>Base OS shell.</strong> Windows: <code>wsl --install</code>, reboot, open Ubuntu. macOS: install Homebrew. Linux: update packages. Then <code>sudo apt install -y git unzip jq</code> (or the dnf/brew equivalents).</li>
  <li><strong>AWS CLI v2</strong> with the official installer, then <code>aws configure sso</code> → profile <code>academy-admin</code> (Lab L01). Check: <code>aws sts get-caller-identity --profile academy-admin</code>.</li>
  <li><strong>Node.js LTS via nvm:</strong> install nvm, then <code>nvm install --lts</code> and <code>nvm alias default 'lts/*'</code>. Check <code>node -v</code>.</li>
  <li><strong>CDK CLI:</strong> <code>npm install -g aws-cdk</code>, then <code>cdk --version</code>.</li>
  <li><strong>Python (if you'll write CDK in Python or Lambda in Python):</strong> <code>pyenv install</code> a supported 3.x, then per project <code>python3 -m venv .venv &amp;&amp; source .venv/bin/activate</code>.</li>
  <li><strong>Create an app:</strong> <code>mkdir hello-cdk &amp;&amp; cd hello-cdk &amp;&amp; cdk init app --language typescript</code>. This creates the project, a Git repo and installs dependencies.</li>
  <li><strong>Synthesise:</strong> <code>cdk synth</code> turns your code into a CloudFormation template (printed, and written to <code>cdk.out/</code>). Nothing is deployed and no credentials are needed for a simple app.</li>
  <li><strong>(Preview of M37) Bootstrap once per account and Region:</strong> <code>cdk bootstrap aws://ACCOUNT-ID/REGION --profile academy-admin</code> creates the <code>CDKToolkit</code> stack: an S3 bucket and ECR repository for assets, and IAM roles that deployments use. Only then does <code>cdk deploy</code> work.</li>
</ol>

<h3>Workflow B: build, tag and push an image to Amazon ECR</h3>
` + DG_0304_PIPE + `
<ol class="flow">
  <li><strong>Create a repository</strong> (once): <code>aws ecr create-repository --repository-name academy/orders-api --image-scanning-configuration scanOnPush=true --image-tag-mutability IMMUTABLE</code>.</li>
  <li><strong>Build</strong> for the target architecture: <code>docker buildx build --platform linux/amd64 -t orders-api:1.4.0 .</code> (or <code>linux/arm64</code> if you deploy to Graviton).</li>
  <li><strong>Authenticate Docker to ECR:</strong> <code>aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.eu-west-1.amazonaws.com</code>. The CLI uses your IAM identity to get a token (valid for 12 hours); Docker stores it.</li>
  <li><strong>Tag</strong> with the full repository URI: <code>docker tag orders-api:1.4.0 123456789012.dkr.ecr.eu-west-1.amazonaws.com/academy/orders-api:1.4.0</code>.</li>
  <li><strong>Push:</strong> <code>docker push 123456789012.dkr.ecr.eu-west-1.amazonaws.com/academy/orders-api:1.4.0</code>. Only layers ECR doesn't already have are uploaded.</li>
  <li><strong>Check the scan and digest:</strong> <code>aws ecr describe-images --repository-name academy/orders-api</code> and <code>aws ecr describe-image-scan-findings …</code>. Deploy by tag (immutable) or by digest.</li>
  <li><strong>Run it on AWS:</strong> an ECS task definition, EKS pod spec or Lambda function references the image URI; the service's IAM role (task execution role, node role) needs <code>ecr:GetAuthorizationToken</code> and pull permissions (M15).</li>
</ol>` },

    { type: "aws", title: "How it fits AWS", html: `
<ul>
  <li><strong>AWS CloudShell</strong> runs in the console with your current identity's permissions, so there are no access keys to manage. It includes the AWS CLI, Python, Node.js, Git and common utilities; you can install more into your home directory with <code>pip install --user</code> or <code>npm</code>. Storage persists only in <code>$HOME</code> (1 GB per Region). You can also launch CloudShell inside a VPC subnet to reach private resources.</li>
  <li><strong>Amazon ECR</strong>: private repositories with IAM-based access, image scanning (basic, or enhanced with Amazon Inspector), <strong>lifecycle policies</strong> to expire old images (storage costs money), tag immutability, encryption at rest, and cross-Region/cross-account replication. Pull-through cache rules can mirror public registries.</li>
  <li><strong>Lambda packaging</strong>: a .zip (50 MB zipped for direct upload, 250 MB unzipped including layers) or a container image (up to 10 GB) from ECR. Container images suit large dependencies such as ML libraries.</li>
  <li><strong>CPU architecture</strong>: Lambda, Fargate and EC2 support x86_64 and ARM64 (Graviton). Graviton generally gives better price-performance (Lambda on Arm is priced about 20% lower per GB-second), but your image or package must be built for arm64.</li>
  <li><strong>CI builds the release artefacts</strong>: AWS CodeBuild (or GitHub Actions with an OIDC role) builds images in a clean, controlled environment and pushes to ECR. Laptops build for development only (M38).</li>
  <li><strong>Remote access without SSH keys</strong>: AWS Systems Manager Session Manager, also usable as the transport for VS Code Remote-SSH, so no inbound port 22 is needed (M13, M31).</li>
</ul>` },

    { type: "examples", title: "Worked examples", html: `
<h3>Example 1: checking a toolchain</h3>
<pre><code>$ aws --version
aws-cli/2.x.x Python/3.x.x Linux/6.x exe/x86_64.ubuntu.24
$ node -v &amp;&amp; npm -v
v22.x.x
10.x.x
$ cdk --version
2.x.x (build abc1234)
$ python3 --version &amp;&amp; which python3
Python 3.12.x
/home/maria/projects/orders/.venv/bin/python3     &lt;- the venv is active (good)
$ docker version --format '{{.Server.Arch}}'
arm64                                             &lt;- Apple Silicon: images default to arm64!</code></pre>
<p>Version numbers above are illustrative. What matters is: CLI v2 (not v1), an LTS Node, the venv's Python (not the system one), and knowing your Docker architecture.</p>

<h3>Example 2: layer caching in action</h3>
<pre><code>$ docker build -t orders-api:dev .
 =&gt; [build 3/6] COPY package.json package-lock.json ./      CACHED
 =&gt; [build 4/6] RUN npm ci                                   CACHED   &lt;- dependencies unchanged
 =&gt; [build 5/6] COPY . .                                     0.2s
 =&gt; [build 6/6] RUN npm run build &amp;&amp; npm prune --omit=dev    6.1s</code></pre>
<p>Only the source changed, so only the last two steps ran. If <code>COPY . .</code> came before <code>npm ci</code>, every code change would reinstall all dependencies.</p>

<h3>Example 3: the architecture mismatch</h3>
<pre><code># Built on an Apple Silicon laptop, deployed to Fargate (x86_64 by default):
exec /usr/local/bin/docker-entrypoint.sh: exec format error

# Fix A: build for the target
docker buildx build --platform linux/amd64 -t orders-api:1.4.1 .
# Fix B: run the service on ARM64 (Graviton) - set runtimePlatform cpuArchitecture=ARM64 in the ECS task definition</code></pre>

<h3>Example 4: pinning the toolchain in a repository</h3>
<pre><code>.nvmrc              22                      # nvm use  -&gt; picks this Node version
.python-version     3.12                    # pyenv picks this Python version
package-lock.json   (committed)             # npm ci installs exactly these versions
requirements.txt    boto3==1.x.y            # pinned; or a lock file from pip-tools / uv
Dockerfile          FROM node:22-alpine     # pin a tag; for strict reproducibility pin a digest
.pre-commit-config.yaml                     # yamllint, cfn-lint, gitleaks, formatters on every commit</code></pre>

<h3>Example 5: a dev container definition</h3>
<pre><code>// .devcontainer/devcontainer.json
{
  "name": "academy",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:22",
  "features": {
    "ghcr.io/devcontainers/features/aws-cli:1": {},
    "ghcr.io/devcontainers/features/python:1": { "version": "3.12" }
  },
  "postCreateCommand": "npm ci &amp;&amp; npm install -g aws-cdk &amp;&amp; pip install cfn-lint",
  "mounts": ["source=\${localEnv:HOME}/.aws,target=/home/node/.aws,type=bind"]
}</code></pre>
<p>Opening the folder in VS Code with the Dev Containers extension (or in GitHub Codespaces) gives every engineer the same tools and versions. Mounting <code>~/.aws</code> reuses your SSO configuration without copying credentials into the image.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Run a few CLI commands from a locked-down corporate laptop</td><td>AWS CloudShell</td><td>Nothing to install, no access keys, uses your console identity</td></tr>
<tr><td>Windows developer building CDK and container apps</td><td>WSL2 (Ubuntu) + VS Code WSL extension + Docker WSL2 backend</td><td>Linux tooling with Windows desktop apps; projects in the Linux file system</td></tr>
<tr><td>New team members take two days to get a working setup</td><td>Dev containers (or Codespaces) with pinned versions</td><td>Environment defined as code; ready in minutes and identical for everyone</td></tr>
<tr><td>Python Lambda with native libraries (e.g. cryptography, numpy)</td><td><code>sam build --use-container</code> or CI build on Amazon Linux; or a Lambda container image</td><td>Dependencies compiled for the Lambda OS and architecture</td></tr>
<tr><td>Large ML inference function (2 GB of dependencies)</td><td>Lambda container image from ECR</td><td>Images up to 10 GB; .zip packages are limited to 250 MB unzipped</td></tr>
<tr><td>Cut compute cost for a containerised API</td><td>Build multi-arch or arm64 images and run on Graviton</td><td>Better price-performance, once images are built for arm64</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: build, run and push your first image", html: `
<p>Needs Docker locally (or CloudShell in a Region where Docker is available). Pushing to ECR stores a few MB, which costs a fraction of a cent per month; the clean-up step deletes it.</p>
<pre><code>mkdir hello-container &amp;&amp; cd hello-container
cat &gt; app.py &lt;&lt;'EOF'
from http.server import BaseHTTPRequestHandler, HTTPServer
import os, socket
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        msg = f"hello from {socket.gethostname()} env={os.environ.get('APP_ENV','dev')}\\n"
        self.send_response(200); self.end_headers(); self.wfile.write(msg.encode())
HTTPServer(("0.0.0.0", 8000), H).serve_forever()
EOF
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM python:3.12-slim
WORKDIR /app
COPY app.py .
USER nobody
EXPOSE 8000
CMD ["python", "app.py"]
EOF

docker build -t hello:1.0 .
docker run -d --name hello -p 8080:8000 -e APP_ENV=lab hello:1.0
curl -s localhost:8080            # hello from &lt;container-id&gt; env=lab
docker logs hello                 # the request log line
docker exec -it hello sh -c 'whoami; cat /etc/os-release | head -2'
docker rm -f hello

# Push to ECR (uses your SSO profile)
export AWS_PROFILE=academy-admin REGION=eu-west-1
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REPO=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/academy/hello
aws ecr create-repository --repository-name academy/hello --region $REGION \\
  --image-scanning-configuration scanOnPush=true
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT.dkr.ecr.$REGION.amazonaws.com
docker tag hello:1.0 $REPO:1.0 &amp;&amp; docker push $REPO:1.0
aws ecr describe-images --repository-name academy/hello --region $REGION \\
  --query "imageDetails[].{tags:imageTags,digest:imageDigest,sizeMB:imageSizeInBytes}"

# Clean up
aws ecr delete-repository --repository-name academy/hello --region $REGION --force</code></pre>` },

    { type: "casestudy", title: "Case study: Brightwave Analytics and the Lambda that only worked on laptops", html: `
<p><strong>Context.</strong> Brightwave Analytics (fictional) runs a dozen Python Lambda functions that generate PDF reports and sign download URLs. Five engineers use a mix of Intel Macs, Apple Silicon Macs and Windows laptops. Each developer packaged and deployed functions from their own machine with a shell script.</p>
<p><strong>The problem.</strong> After a new engineer deployed a routine change, the report function failed in production with <code>Runtime.ImportModuleError: … cannot open shared object file</code> (in other runs, <em>invalid ELF header</em>). The <code>cryptography</code> and image libraries contain compiled code; pip had installed <strong>macOS arm64</strong> builds, while the function ran on <strong>Amazon Linux x86_64</strong>. The same week, a Windows user's deployment broke a shell script because of CRLF line endings, and two developers had different Python minor versions from the Lambda runtime.</p>
<p><strong>Requirements.</strong> Identical builds regardless of laptop, quick onboarding, no change to the functions' behaviour, and lower Lambda cost if possible.</p>
<p><strong>Decisions.</strong></p>
<table>
<thead><tr><th>Change</th><th>Effect</th></tr></thead>
<tbody>
<tr><td>A dev container with the Python version matching the Lambda runtime, the AWS CLI, SAM CLI and cfn-lint</td><td>Every engineer has the same toolchain; onboarding dropped from two days to under an hour</td></tr>
<tr><td><code>.python-version</code>, pinned <code>requirements.txt</code>, <code>.gitattributes</code> forcing LF for <code>*.sh</code></td><td>No more silent version drift or line-ending breakage</td></tr>
<tr><td>Builds only in CI with <code>sam build --use-container</code> (Amazon Linux build image); artefacts deployed by the pipeline, never from laptops</td><td>Native libraries always match the Lambda environment; every deployed artefact traceable to a commit</td></tr>
<tr><td>Functions switched to the arm64 (Graviton) architecture, with dependencies built for arm64 in CI</td><td>Lower price per GB-second and slightly faster cold starts for this workload</td></tr>
</tbody></table>
<p><strong>Outcome.</strong> Zero packaging-related incidents in the following six months, and a noticeable drop in the monthly Lambda bill from the arm64 move.</p>
<p><strong>Lessons learned.</strong> "It works on my machine" usually means "my machine's OS, CPU architecture or versions differ from production". Pin versions, build release artefacts in one controlled place, and match the target platform explicitly.</p>` },

    { type: "exam", html: `
<p>Tooling isn't an exam domain, but these facts appear inside scenarios:</p>
<ul>
  <li>"Run AWS CLI commands from the browser without installing anything or managing credentials" → <strong>AWS CloudShell</strong>.</li>
  <li>"Store and share private container images, with vulnerability scanning" → <strong>Amazon ECR</strong> (scan on push; enhanced scanning uses Amazon Inspector). "Reduce ECR storage cost" → <strong>lifecycle policies</strong>.</li>
  <li>"Lambda function with very large dependencies" → <strong>container image</strong> (up to 10 GB) instead of .zip (250 MB unzipped).</li>
  <li>"Better price-performance for compute" → <strong>Graviton (arm64)</strong>, if the software supports ARM.</li>
  <li>"Shell access to instances without opening port 22 or managing SSH keys" → <strong>Systems Manager Session Manager</strong>.</li>
  <li>"Consistent, repeatable deployments" → build artefacts once in CI, store them (S3/ECR), deploy the same artefact everywhere (immutable infrastructure).</li>
</ul>
<table>
<thead><tr><th></th><th>Virtual machine (EC2)</th><th>Container (ECS/EKS/Fargate)</th></tr></thead>
<tbody>
<tr><td>Isolation unit</td><td>Whole OS on a hypervisor</td><td>Process, sharing the host kernel</td></tr>
<tr><td>Start time / size</td><td>Minutes / GBs</td><td>Seconds / MBs</td></tr>
<tr><td>You patch</td><td>Guest OS and app</td><td>Image (rebuild); host OS too on EC2 launch type, not on Fargate</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Release artefacts come from CI, never from laptops.</strong> Laptops are for development. The pipeline builds once, scans, signs if required, and promotes the same image or package through environments.</li>
  <li><strong>Avoid <code>:latest</code> in deployments.</strong> It's mutable and makes rollbacks ambiguous. Use immutable version tags or digests, and enable ECR tag immutability.</li>
  <li><strong>Keep images small and boring:</strong> slim or distroless bases, multi-stage builds, non-root users, no secrets in layers (they can be extracted from any layer, even if deleted later), rebuild regularly to pick up base-image patches.</li>
  <li><strong>Plan for two CPU architectures.</strong> Mixed teams (Apple Silicon and x86) and Graviton targets make <code>--platform</code> and multi-arch images a default, not an afterthought.</li>
  <li><strong>CloudShell is for operations, not production automation.</strong> Anything you run twice belongs in a script in Git, executed by a pipeline or Systems Manager Automation.</li>
  <li><strong>Watch the hidden costs:</strong> ECR storage for thousands of old images, NAT gateway data processing when private tasks pull images from ECR (use VPC endpoints for ECR and S3, M10), and idle cloud dev instances.</li>
  <li><strong>Credentials in dev environments:</strong> mount or reuse SSO configuration; never bake keys into dev container images or Dockerfiles.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>On Windows use WSL2 and keep code in the Linux file system; on Apple Silicon remember your default architecture is arm64.</li>
  <li>AWS CloudShell: free browser shell with your console identity, 1 GB persistent home per Region; ideal for quick tasks and labs.</li>
  <li>The CDK CLI is a Node.js app, so every CDK user needs Node (LTS) regardless of language; use nvm/pyenv and per-project virtual environments.</li>
  <li>Image = read-only layers + metadata; container = running instance with a writable layer; registry = where images live (ECR on AWS).</li>
  <li>Dockerfile tips: order for caching, multi-stage builds, <code>.dockerignore</code>, non-root user, pinned base images.</li>
  <li><code>-p host:container</code> publishes ports; volumes persist data; env vars pass config; secrets come from Secrets Manager/Parameter Store at run time.</li>
  <li>ECR push: <code>get-login-password | docker login</code> → <code>docker tag</code> with the full URI → <code>docker push</code>.</li>
  <li>Reproducibility: pinned versions, lockfiles with <code>npm ci</code>, dev containers, pre-commit hooks, and CI as the only place release artefacts are built.</li>
</ul>` }
  ],
  drills: [
    { id: "M03.04-d1", q: "In <code>docker run -p 8080:3000 myapp</code>, which port do you open in your browser on the host?", answers: ["8080"], explain: "The format is host:container. The app listens on 3000 inside the container; the host exposes it on 8080." },
    { id: "M03.04-d2", q: "Which npm command installs exactly the versions recorded in <code>package-lock.json</code> (and fails if it disagrees with package.json)?", answers: ["npm ci", "ci"], explain: "<code>npm ci</code> is meant for CI and reproducible installs; <code>npm install</code> may update the lockfile." },
    { id: "M03.04-d3", q: "How many GB of persistent home-directory storage does AWS CloudShell give you per Region?", answers: ["1", "1gb", "1 gb"], explain: "1 GB per Region in <code>$HOME</code>; everything outside the home directory is reset between sessions." },
    { id: "M03.04-d4", q: "Which file at the root of a project tells <code>nvm use</code> which Node.js version to select?", answers: [".nvmrc", "nvmrc"], explain: "<code>.nvmrc</code> contains a version such as <code>22</code> or <code>lts/*</code>." },
    { id: "M03.04-d5", q: "Which <code>aws ecr</code> subcommand prints a registry password that you pipe into <code>docker login</code>?", answers: ["get-login-password", "aws ecr get-login-password"], explain: "<code>aws ecr get-login-password | docker login --username AWS --password-stdin &lt;registry&gt;</code>. The token lasts 12 hours." },
    { id: "M03.04-d6", q: "What is the maximum size of a container image for an AWS Lambda function, in GB?", answers: ["10", "10gb", "10 gb"], explain: "Up to 10 GB, compared with 250 MB unzipped for .zip packages." }
  ],
  check: [
    { id: "M03.04-k1", type: "single", domain: "D1", task: "1.1", level: 100,
      stem: "An administrator needs to run occasional AWS CLI commands from a corporate laptop where software installation is blocked. Security policy forbids storing long-term access keys on endpoints. What should the administrator use?",
      options: [
        { t: "AWS CloudShell from the AWS Management Console", c: true, why: "Browser-based, preinstalled CLI, authenticated with the console identity: nothing to install and no keys to store." },
        { t: "Create an IAM user with access keys and store them in an encrypted file", c: false, why: "Violates the no-long-term-keys policy." },
        { t: "Launch an EC2 instance with an access key in user data", c: false, why: "Puts a key in user data (readable from the instance metadata) and adds cost and management." },
        { t: "Use the AWS SDK in a browser extension", c: false, why: "Still needs credentials and installation." }
      ] },
    { id: "M03.04-k2", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "A container image built on an Apple Silicon laptop runs locally but fails on Amazon ECS on AWS Fargate with <code>exec format error</code>. The team also wants to reduce compute cost. Which solution addresses BOTH?",
      options: [
        { t: "Build an arm64 image and set the task definition's runtime platform to ARM64 (Graviton)", c: true, why: "The architecture now matches, and Graviton offers better price-performance." },
        { t: "Increase the task's CPU and memory", c: false, why: "Resources don't fix an architecture mismatch, and they raise cost." },
        { t: "Switch to the EC2 launch type with x86 instances", c: false, why: "An arm64 image still won't run on x86, and cost isn't reduced." },
        { t: "Rebuild the image with the <code>:latest</code> tag", c: false, why: "The tag doesn't change the CPU architecture." }
      ] },
    { id: "M03.04-k3", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "A data science team wants to deploy an inference function to AWS Lambda. The model and its libraries total 3 GB. What is the MOST appropriate packaging?",
      options: [
        { t: "Package the function as a container image stored in Amazon ECR", c: true, why: "Lambda container images can be up to 10 GB." },
        { t: "A .zip deployment package uploaded directly", c: false, why: ".zip packages are limited to 50 MB for direct upload and 250 MB unzipped." },
        { t: "Split the libraries across five Lambda layers", c: false, why: "The 250 MB unzipped limit includes all layers." },
        { t: "Store the libraries in /tmp at build time", c: false, why: "/tmp is runtime ephemeral storage, not part of the package." }
      ] },
    { id: "M03.04-k4", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A team deploys container images tagged <code>latest</code>. After a bad release, they can't tell which image version is running and rollbacks are unreliable. What should a solutions architect recommend?",
      options: [
        { t: "Tag each build with a unique, immutable version (or deploy by digest) and enable tag immutability in Amazon ECR", c: true, why: "Each deployment references exactly one image, so rollbacks are a redeploy of a known previous version." },
        { t: "Push images more frequently", c: false, why: "More pushes to a mutable tag make the problem worse." },
        { t: "Enable ECR image scanning", c: false, why: "Scanning finds vulnerabilities, not version ambiguity." },
        { t: "Store images in Amazon S3 instead", c: false, why: "ECS, EKS and Lambda pull from registries such as ECR, and S3 doesn't fix tagging." }
      ] },
    { id: "M03.04-k5", type: "multi", domain: "D2", task: "2.1", level: 100,
      stem: "New engineers spend days setting up tools, and builds differ between laptops. Which TWO actions MOST improve consistency?",
      options: [
        { t: "Define the environment as a dev container with pinned tool versions", c: true, why: "Everyone gets the same OS, tools and versions from a file in Git." },
        { t: "Commit lockfiles and install with exact versions (e.g. <code>npm ci</code>, pinned requirements)", c: true, why: "Dependency versions no longer drift between machines." },
        { t: "Ask engineers to install the latest version of every tool", c: false, why: "\"Latest\" changes over time, so machines still drift." },
        { t: "Let each engineer build and deploy releases from their laptop", c: false, why: "That's the source of inconsistency; releases should be built in CI." },
        { t: "Use the root user for development to avoid permission errors", c: false, why: "A security anti-pattern that does nothing for consistency." }
      ] },
    { id: "M03.04-k6", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A Dockerfile copies a <code>.env</code> file containing a database password into the image, then deletes it in a later instruction. Is the password exposed?",
      options: [
        { t: "Yes: it remains in the earlier image layer and can be extracted by anyone who can pull the image", c: true, why: "Layers are immutable; deleting a file later only hides it. Use Secrets Manager at run time and a .dockerignore." },
        { t: "No: the later instruction removes it from the image", c: false, why: "Deletion adds a new layer that masks the file; the earlier layer still contains it." },
        { t: "No: ECR encrypts images at rest", c: false, why: "Encryption at rest doesn't stop anyone with pull access from reading layers." },
        { t: "Only if the container runs as root", c: false, why: "The exposure is in the image itself, regardless of the runtime user." }
      ] }
  ],
  cards: ["fc-M03-4-01", "fc-M03-4-02", "fc-M03-4-03", "fc-M03-4-04", "fc-M03-4-05", "fc-M03-4-06", "fc-M03-4-07", "fc-M03-4-08", "fc-M03-4-09", "fc-M03-4-10", "fc-M03-4-11"],
  references: [
    "<em>Hands-On AWS CDK</em> ch.1 \"Set Up Your Local Development Environment\" (PDF p32)",
    "AWS CloudShell User Guide: <em>Service quotas and restrictions</em>, <em>Working with Docker</em>",
    "AWS CDK Developer Guide: <em>Getting started</em>, <em>Bootstrapping</em>",
    "Amazon ECR User Guide: <em>Pushing a Docker image</em>, <em>Lifecycle policies</em>, <em>Image scanning</em>",
    "AWS Lambda Developer Guide: <em>Lambda quotas</em>, <em>Creating Lambda container images</em>",
    "Docker documentation: <em>Dockerfile reference</em>, <em>Multi-stage builds</em>, <em>Build cache</em>",
    "Microsoft: <em>Install WSL</em>; containers.dev (Dev Container specification)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M03-4-01", front: "Why does every AWS CDK user need Node.js?", back: "The CDK CLI is a Node.js app, and the construct library runs on JavaScript (other languages use it through jsii)." },
  { id: "fc-M03-4-02", front: "AWS CloudShell key facts?", back: "Free browser shell, your console identity (no keys), Amazon Linux 2023 with CLI/Python/Node/Git, 1 GB persistent $HOME per Region, sessions time out when idle." },
  { id: "fc-M03-4-03", front: "Image vs container?", back: "Image: read-only stack of layers + metadata (tag, digest). Container: a running instance = image + writable layer + isolated process." },
  { id: "fc-M03-4-04", front: "VM vs container isolation?", back: "VM: full guest OS on a hypervisor (GBs, minutes). Container: process sharing the host kernel (MBs, seconds)." },
  { id: "fc-M03-4-05", front: "Why a multi-stage Dockerfile?", back: "Build tools, dev dependencies and source stay in the build stage; the final image is smaller, faster to pull and has less attack surface." },
  { id: "fc-M03-4-06", front: "Dockerfile caching rule?", back: "Order instructions from least to most frequently changed: copy lockfiles and install dependencies before copying source." },
  { id: "fc-M03-4-07", front: "Push an image to ECR: the three commands?", back: "<code>aws ecr get-login-password | docker login …</code> → <code>docker tag app:1.0 &lt;acct&gt;.dkr.ecr.&lt;region&gt;.amazonaws.com/repo:1.0</code> → <code>docker push …</code>" },
  { id: "fc-M03-4-08", front: "<code>exec format error</code> when a container starts on AWS?", back: "CPU architecture mismatch (arm64 image on x86 or vice versa). Build with <code>--platform</code> or run on the matching architecture." },
  { id: "fc-M03-4-09", front: "Lambda package size limits?", back: ".zip: 50 MB zipped (direct upload), 250 MB unzipped including layers. Container image: up to 10 GB." },
  { id: "fc-M03-4-10", front: "Secrets and container images?", back: "Never bake them in: any layer can be extracted, even if the file is deleted later. Inject at run time from Secrets Manager or Parameter Store." },
  { id: "fc-M03-4-11", front: "Tools that make a dev environment reproducible?", back: "Dev containers, version files (.nvmrc, .python-version), committed lockfiles + <code>npm ci</code>, pinned base images, pre-commit hooks, CI-built artefacts." }
);
// ================================================================== 90_lab_quiz.js
/* ================================================================== LAB L03 */
var DG_L03_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 236" role="img" aria-labelledby="l03pt l03pd">
  <title id="l03pt">How the S3 inventory script works</title>
  <desc id="l03pd">One list-buckets call returns every bucket name. For each bucket the script asks for its Region, then makes three Regional calls for encryption, Block Public Access and versioning. Each result becomes a CSV row, which is also printed as a table. Errors for one bucket are written into that bucket's row and the script carries on.</desc>
  <defs><marker id="l03p-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="12" y="30" width="150" height="70" rx="8"/>
  <text class="dg-tb" x="24" y="54">list-buckets</text>
  <text class="dg-ts" x="24" y="74">all names, 1 call</text>
  <text class="dg-ts" x="24" y="90">(auto-paginated)</text>
  <path class="dg-line" d="M162 65 H194" marker-end="url(#l03p-ar)"/>
  <rect class="dg-box" x="196" y="30" width="176" height="70" rx="8"/>
  <text class="dg-t" x="208" y="54">get-bucket-location</text>
  <text class="dg-ts" x="208" y="74">per bucket → Region</text>
  <text class="dg-ts" x="208" y="90">null means us-east-1</text>
  <path class="dg-line" d="M372 65 H404" marker-end="url(#l03p-ar)"/>
  <rect class="dg-edge" x="406" y="14" width="190" height="104" rx="8"/>
  <text class="dg-tb" x="418" y="38">Regional calls</text>
  <text class="dg-ts" x="418" y="58">get-bucket-encryption</text>
  <text class="dg-ts" x="418" y="76">get-public-access-block</text>
  <text class="dg-ts" x="418" y="94">get-bucket-versioning</text>
  <text class="dg-ts" x="418" y="110">each with --region</text>
  <path class="dg-line" d="M596 65 H628" marker-end="url(#l03p-ar)"/>
  <rect class="dg-good" x="630" y="30" width="118" height="70" rx="8"/>
  <text class="dg-tb" x="642" y="54">CSV + table</text>
  <text class="dg-ts" x="642" y="74">one row/bucket</text>
  <text class="dg-ts" x="642" y="90">column -t</text>
  <rect class="dg-bad" x="196" y="146" width="552" height="74" rx="8"/>
  <text class="dg-tb" x="208" y="170">Per-bucket errors never stop the run</text>
  <text class="dg-ts" x="208" y="190">AccessDenied → ACCESS_DENIED in that row · no BPA config → NOT_SET</text>
  <text class="dg-ts" x="208" y="208">any other failure → ERR:&lt;ErrorCode&gt; so you can investigate later</text>
  <path class="dg-line" d="M500 118 V144" stroke-dasharray="4 3"/>
</svg>
<figcaption>Figure L03-1. One list call, then a fixed set of read-only calls per bucket, sent to that bucket's own Region.</figcaption>
</figure>`;

var LAB = {
  id: "L03", title: "CLI automation: S3 encryption inventory script", level: 200, duration: "90–120 min",
  cost: "≈ $0 (a few test buckets, deleted at the end)",
  objective: `
<p>Write a <strong>robust, least-privilege audit script</strong> that lists <em>every</em> S3 bucket in an account with its:</p>
<ul>
<li>Region</li>
<li>default encryption (SSE-S3, SSE-KMS or DSSE-KMS, plus the KMS key)</li>
<li>S3 Bucket Key status</li>
<li>bucket-level Block Public Access</li>
<li>versioning</li>
</ul>
<p>The report is written as a CSV and printed as a table.</p>
<p>Along the way you practise the CLI skills from M03.02: profiles and SSO, <code>--query</code> (JMESPath), <code>--output text</code>, exit codes and error handling. You build the same tool in bash and in Python, and you prove its IAM policy grants read access only.</p>
<p>This is the kind of script architects write in a client's first week ("what do we actually have?"). It also shows why AWS Config is the better long-term answer.</p>`,
  warning: "⚠️ The script is read-only, but steps 2 and 10 create and delete buckets. Run them only in your learning account. Double-check the bucket names before any delete command.",
  diagram: DG_L03_FLOW,
  steps: [
    { id: "s1", title: "Prerequisites: sign in and confirm who you are", html: `
<p>Use <strong>WSL2/Linux</strong> with AWS CLI v2 (from Lab L01), or <strong>AWS CloudShell</strong>, which already has the CLI, Python 3, boto3, git and <code>jq</code>. In CloudShell your console session supplies credentials, so drop <code>--profile academy-admin</code> everywhere (or set <code>AWS_PROFILE</code> to nothing).</p>
<pre><code>aws --version                              # expect aws-cli/2.x
aws sso login --profile academy-admin      # browser opens; approve the request
export AWS_PROFILE=academy-admin           # so you can omit --profile below
export AWS_PAGER=""                        # print output instead of opening less
aws sts get-caller-identity</code></pre>
<p>Expected output (your IDs differ):</p>
<pre><code>{
    "UserId": "AROAXXXXXXXXXXXXXXXXX:you@example.com",
    "Account": "111122223333",
    "Arn": "arn:aws:sts::111122223333:assumed-role/AWSReservedSSO_AdministratorAccess_0123456789abcdef/you@example.com"
}</code></pre>
<p><strong>What to notice:</strong> the ARN is an <em>assumed role</em>, so you are using short-lived credentials from IAM Identity Center, not long-term access keys. If you see <code>Unable to locate credentials</code> or <code>Token has expired</code>, run <code>aws sso login</code> again.</p>` },
    { id: "s2", title: "Create three test buckets with different settings", html: `
<p>Bucket names are <strong>globally unique</strong> across all AWS accounts, so we add your account ID and a random number. Run this block as-is:</p>
<pre><code>REGION="$(aws configure get region)"; REGION="\${REGION:-us-east-1}"
SUFFIX="$(aws sts get-caller-identity --query Account --output text)-$RANDOM"
B1="academy-l03-sse-s3-$SUFFIX"
B2="academy-l03-sse-kms-$SUFFIX"
B3="academy-l03-versioned-$SUFFIX"
echo "$REGION  $B1  $B2  $B3" | tee ~/l03-buckets.txt     # keep this for clean-up

# us-east-1 is special: create-bucket must NOT have a LocationConstraint there
mkb() {
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$1" --region us-east-1
  else
    aws s3api create-bucket --bucket "$1" --region "$REGION" \\
      --create-bucket-configuration LocationConstraint="$REGION"
  fi
}
mkb "$B1"; mkb "$B2"; mkb "$B3"

# B2: SSE-KMS with the AWS managed key (aws/s3) and an S3 Bucket Key
aws s3api put-bucket-encryption --bucket "$B2" --server-side-encryption-configuration \\
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms"},"BucketKeyEnabled":true}]}'

# B3: versioning on, and two versions of one object
aws s3api put-bucket-versioning --bucket "$B3" --versioning-configuration Status=Enabled
echo v1 &gt; note.txt &amp;&amp; aws s3 cp note.txt "s3://$B3/note.txt"
echo v2 &gt; note.txt &amp;&amp; aws s3 cp note.txt "s3://$B3/note.txt"</code></pre>
<p>Expected: each <code>create-bucket</code> prints a <code>"Location"</code>. The two <code>cp</code> commands print <code>upload: ./note.txt to s3://…/note.txt</code>.</p>
<div class="callout warn"><strong>The us-east-1 quirk.</strong> Outside us-east-1 you must pass <code>LocationConstraint</code>. In us-east-1, passing <code>LocationConstraint=us-east-1</code> fails with <code>InvalidLocationConstraint</code>. Scripts that create buckets in many Regions need exactly this <code>if</code>.</div>
<p><strong>What to notice:</strong> you did not configure encryption on <code>$B1</code>. Since January 2023, S3 applies <strong>SSE-S3 (AES256)</strong> to every bucket by default, and new buckets have <strong>Block Public Access</strong> fully on (since April 2023). Leaving <code>KMSMasterKeyID</code> out of B2's configuration means "use the AWS managed key <code>aws/s3</code>".</p>` },
    { id: "s3", title: "Explore each API by hand", html: `
<p>Before automating, look at the raw JSON of every call the script will make. Script bugs usually come from not knowing the response shape.</p>
<pre><code>aws s3api list-buckets --query "Buckets[?starts_with(Name, 'academy-l03')]"</code></pre>
<pre><code>[
    { "Name": "academy-l03-sse-kms-111122223333-23817", "CreationDate": "2026-10-07T09:12:44+00:00" },
    { "Name": "academy-l03-sse-s3-111122223333-23817",  "CreationDate": "2026-10-07T09:12:42+00:00" },
    { "Name": "academy-l03-versioned-111122223333-23817", "CreationDate": "2026-10-07T09:12:45+00:00" }
]</code></pre>
<p>Recent CLI versions also return a <code>BucketRegion</code> per bucket and paginate <code>list-buckets</code>. The script still uses <code>get-bucket-location</code>, which works on every version.</p>
<pre><code>aws s3api get-bucket-location --bucket "$B1"
#   {"LocationConstraint": "eu-west-1"}      &lt;- or null for us-east-1

aws s3api get-bucket-encryption --bucket "$B2"</code></pre>
<pre><code>{
    "ServerSideEncryptionConfiguration": {
        "Rules": [
            {
                "ApplyServerSideEncryptionByDefault": { "SSEAlgorithm": "aws:kms" },
                "BucketKeyEnabled": true
            }
        ]
    }
}</code></pre>
<pre><code>aws s3api get-public-access-block --bucket "$B1"
#   {"PublicAccessBlockConfiguration": {"BlockPublicAcls": true, "IgnorePublicAcls": true,
#                                       "BlockPublicPolicy": true, "RestrictPublicBuckets": true}}

aws s3api get-bucket-versioning --bucket "$B1"      # prints NOTHING: never enabled
aws s3api get-bucket-versioning --bucket "$B3"
#   {"Status": "Enabled"}

aws s3api get-public-access-block --bucket does-not-exist-$RANDOM-$RANDOM; echo "exit code: $?"
#   An error occurred (NoSuchBucket) when calling the GetPublicAccessBlock operation: ...
#   exit code: 254</code></pre>
<table>
<thead><tr><th>Call</th><th>Surprise to handle</th></tr></thead>
<tbody>
<tr><td><code>get-bucket-location</code></td><td><code>null</code> means <strong>us-east-1</strong>. Very old Ireland buckets return <code>EU</code>.</td></tr>
<tr><td><code>get-bucket-encryption</code></td><td>Algorithms: <code>AES256</code> (SSE-S3), <code>aws:kms</code> (SSE-KMS), <code>aws:kms:dsse</code> (DSSE-KMS). No <code>KMSMasterKeyID</code> means the AWS managed key.</td></tr>
<tr><td><code>get-public-access-block</code></td><td>A bucket with no bucket-level setting returns the error <code>NoSuchPublicAccessBlockConfiguration</code>, not an empty result. (The account-level setting is separate: <code>aws s3control get-public-access-block --account-id …</code>.)</td></tr>
<tr><td><code>get-bucket-versioning</code></td><td>Empty output means versioning was <em>never</em> enabled. Once enabled, it can only be <code>Suspended</code>, never "off" again.</td></tr>
<tr><td>Any call</td><td>Exit code <strong>254</strong> means the service returned an error. 255 is a general failure, 252 means invalid syntax or parameters.</td></tr>
</tbody></table>` },
    { id: "s4", title: "Extract exactly the fields you need with --query (JMESPath)", html: `
<p><code>--query</code> runs a <strong>JMESPath</strong> expression on the response <em>in the CLI, after it arrives</em>. Combined with <code>--output text</code> it produces values your shell can read directly.</p>
<pre><code># Just the names, tab-separated (ideal for a for-loop)
aws s3api list-buckets --query 'Buckets[].Name' --output text

# Number of buckets
aws s3api list-buckets --query 'length(Buckets)'

# Newest bucket
aws s3api list-buckets --query 'sort_by(Buckets, &amp;CreationDate)[-1].Name' --output text

# Three encryption fields in one call, as one tab-separated line
aws s3api get-bucket-encryption --bucket "$B2" --output text --query \\
  'ServerSideEncryptionConfiguration.Rules[0].[ApplyServerSideEncryptionByDefault.SSEAlgorithm, ApplyServerSideEncryptionByDefault.KMSMasterKeyID, BucketKeyEnabled]'
#   aws:kms	None	True

# All four Block Public Access flags
aws s3api get-public-access-block --bucket "$B1" --output text --query \\
  'PublicAccessBlockConfiguration.[BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets]'
#   True	True	True	True</code></pre>
<p><strong>What to notice:</strong></p>
<ul>
<li>In <code>text</code> output, JSON <code>null</code> prints as <code>None</code> and booleans print as <code>True</code>/<code>False</code>. Your script must compare against those spellings.</li>
<li><code>[a, b, c]</code> after a path is a <em>multi-select list</em>: it builds a new array from several fields.</li>
<li>Use <strong>single quotes</strong> around the expression in bash so the shell doesn't touch <code>[]</code>, <code>&amp;</code> or backticks. JMESPath string literals then use single quotes inside double quotes, or <code>\`literal\`</code> backticks.</li>
<li><code>--query</code> does <em>not</em> reduce what AWS sends you. For big EC2 listings, filter server-side with <code>--filters</code> first.</li>
</ul>` },
    { id: "s5", title: "Write the bash script s3-inventory.sh", html: `
<p>Create the file, paste the script, and make it executable:</p>
<pre><code>nano s3-inventory.sh        # or: code s3-inventory.sh
chmod +x s3-inventory.sh</code></pre>
<pre><code>#!/usr/bin/env bash
# s3-inventory.sh - list every S3 bucket with its Region, default encryption,
# S3 Bucket Key, Block Public Access (bucket level) and versioning status.
# Usage: ./s3-inventory.sh [--profile NAME] [--csv FILE]
set -euo pipefail

PROFILE="\${AWS_PROFILE:-academy-admin}"
CSV="s3-inventory-$(date +%Y%m%d-%H%M%S).csv"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile) PROFILE="$2"; shift 2 ;;
    --csv)     CSV="$2"; shift 2 ;;
    -h|--help) sed -n '2,4p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1" &gt;&amp;2; exit 2 ;;
  esac
done

export AWS_PAGER=""                       # never open a pager inside a script
ERRFILE="$(mktemp)"
trap 'rm -f "$ERRFILE"' EXIT

awsp() { aws --profile "$PROFILE" "$@"; }

# try CMD... : print the command's output, or "ERR:&lt;ErrorCode&gt;" if it fails.
# The AWS CLI prints e.g. "An error occurred (AccessDenied) when calling ...".
try() {
  local out code
  if out="$("$@" 2&gt;"$ERRFILE")"; then
    printf '%s' "$out"
  else
    code="$(grep -oE '\\([A-Za-z]+\\)' "$ERRFILE" | head -n1 | tr -d '()' || true)"
    printf 'ERR:%s' "\${code:-Unknown}"
  fi
}

bucket_region() {
  local loc
  loc="$(try awsp s3api get-bucket-location --bucket "$1" \\
           --query 'LocationConstraint' --output text)"
  case "$loc" in
    None|null|"") echo "us-east-1" ;;      # buckets in us-east-1 return null
    EU)           echo "eu-west-1" ;;      # legacy value for old Ireland buckets
    *)            echo "$loc" ;;
  esac
}

encryption() {   # prints: algorithm,kms-key,bucket-key
  local b="$1" r="$2" out algo key bkey
  out="$(try awsp s3api get-bucket-encryption --bucket "$b" --region "$r" \\
    --query 'ServerSideEncryptionConfiguration.Rules[0].[ApplyServerSideEncryptionByDefault.SSEAlgorithm, ApplyServerSideEncryptionByDefault.KMSMasterKeyID, BucketKeyEnabled]' \\
    --output text)"
  case "$out" in
    ERR:ServerSideEncryptionConfigurationNotFoundError) echo "NONE,-,-"; return ;;
    ERR:AccessDenied) echo "ACCESS_DENIED,-,-"; return ;;
    ERR:*) echo "$out,-,-"; return ;;
  esac
  IFS=$'\\t' read -r algo key bkey &lt;&lt;&lt; "$out"
  [[ "$key" == "None" || -z "$key" ]] &amp;&amp; key="aws-managed"
  [[ "$bkey" == "None" || -z "$bkey" ]] &amp;&amp; bkey="False"
  echo "$algo,$key,$bkey"
}

public_access() {
  local out
  out="$(try awsp s3api get-public-access-block --bucket "$1" --region "$2" \\
    --query 'PublicAccessBlockConfiguration.[BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets]' \\
    --output text)"
  case "$out" in
    ERR:NoSuchPublicAccessBlockConfiguration) echo "NOT_SET" ;;
    ERR:AccessDenied) echo "ACCESS_DENIED" ;;
    ERR:*) echo "$out" ;;
    $'True\\tTrue\\tTrue\\tTrue') echo "ALL_ON" ;;
    *) echo "PARTIAL(\${out//$'\\t'/ })" ;;
  esac
}

versioning() {
  local out
  out="$(try awsp s3api get-bucket-versioning --bucket "$1" --region "$2" \\
           --query 'Status' --output text)"
  case "$out" in
    None|"") echo "Never-enabled" ;;       # no Status key at all
    ERR:AccessDenied) echo "ACCESS_DENIED" ;;
    *) echo "$out" ;;                      # Enabled | Suspended | ERR:...
  esac
}

main() {
  echo "Account: $(awsp sts get-caller-identity --query Account --output text)  profile: $PROFILE" &gt;&amp;2
  local names
  names="$(awsp s3api list-buckets --query 'Buckets[].Name' --output text)"
  echo "bucket,region,sse_algorithm,kms_key,bucket_key,block_public_access,versioning" &gt; "$CSV"
  local b r
  for b in $names; do                      # bucket names never contain spaces
    echo "  checking $b" &gt;&amp;2
    r="$(bucket_region "$b")"
    if [[ "$r" == ERR:* ]]; then           # can't even find the Region: record it, move on
      echo "$b,$r,-,-,-,-,-" &gt;&gt; "$CSV"; continue
    fi
    echo "$b,$r,$(encryption "$b" "$r"),$(public_access "$b" "$r"),$(versioning "$b" "$r")" &gt;&gt; "$CSV"
  done
  column -s, -t &lt; "$CSV"
  echo &gt;&amp;2
  echo "Buckets: $(( $(wc -l &lt; "$CSV") - 1 ))   CSV written to $CSV" &gt;&amp;2
}

main</code></pre>
<p><strong>Design choices to understand (and reuse):</strong></p>
<ul>
<li><code>set -euo pipefail</code>: exit on any unhandled error (<code>-e</code>), treat unset variables as errors (<code>-u</code>), and fail a pipeline if any part fails (<code>pipefail</code>). Inside <code>try</code>, the failure is <em>handled</em>, so a single bucket can't kill the run.</li>
<li><code>try</code> turns a failed call into <code>ERR:&lt;ErrorCode&gt;</code> parsed from the CLI's standard error message. Each function then maps the codes it expects (<code>AccessDenied</code>, <code>NoSuchPublicAccessBlockConfiguration</code>) to readable values.</li>
<li>Every per-bucket call passes <code>--region "$r"</code>. Sending the request straight to the bucket's Region avoids redirects and the occasional <code>PermanentRedirect</code>/<code>AuthorizationHeaderMalformed</code> errors from cross-Region calls.</li>
<li>Diagnostics go to <strong>standard error</strong> (<code>&gt;&amp;2</code>), and data goes to the CSV and standard output. That keeps the output pipe-friendly.</li>
<li><code>AWS_PAGER=""</code> stops the CLI from opening <code>less</code> and hanging an unattended script.</li>
</ul>` },
    { id: "s6", title: "The Python (boto3) alternative", html: `
<p>The same report with the AWS SDK for Python. Save it as <code>s3_inventory.py</code>:</p>
<pre><code>#!/usr/bin/env python3
"""s3_inventory.py - the same report as s3-inventory.sh, written with boto3.

Usage: python3 s3_inventory.py [--profile academy-admin] [--csv out.csv]
"""
import argparse
import csv
import sys

import boto3
from botocore.exceptions import ClientError

FIELDS = ["bucket", "region", "sse_algorithm", "kms_key", "bucket_key",
          "block_public_access", "versioning"]


def err(e):
    return e.response.get("Error", {}).get("Code", "Unknown")


def list_bucket_names(s3):
    # Newer botocore versions can paginate ListBuckets; older ones return everything at once.
    if s3.can_paginate("list_buckets"):
        pages = s3.get_paginator("list_buckets").paginate()
    else:
        pages = [s3.list_buckets()]
    return [b["Name"] for page in pages for b in page.get("Buckets", [])]


def bucket_region(s3, name):
    loc = s3.get_bucket_location(Bucket=name).get("LocationConstraint")
    return {None: "us-east-1", "": "us-east-1", "EU": "eu-west-1"}.get(loc, loc)


def encryption(s3, name):
    try:
        rule = s3.get_bucket_encryption(Bucket=name)["ServerSideEncryptionConfiguration"]["Rules"][0]
    except ClientError as e:
        if err(e) == "ServerSideEncryptionConfigurationNotFoundError":
            return "NONE", "-", "-"
        return ("ACCESS_DENIED" if err(e) == "AccessDenied" else f"ERR:{err(e)}"), "-", "-"
    default = rule.get("ApplyServerSideEncryptionByDefault", {})
    return (default.get("SSEAlgorithm", "?"),
            default.get("KMSMasterKeyID", "aws-managed"),
            str(rule.get("BucketKeyEnabled", False)))


def public_access(s3, name):
    try:
        cfg = s3.get_public_access_block(Bucket=name)["PublicAccessBlockConfiguration"]
    except ClientError as e:
        if err(e) == "NoSuchPublicAccessBlockConfiguration":
            return "NOT_SET"
        return "ACCESS_DENIED" if err(e) == "AccessDenied" else f"ERR:{err(e)}"
    return "ALL_ON" if all(cfg.values()) else "PARTIAL(" + " ".join(str(v) for v in cfg.values()) + ")"


def versioning(s3, name):
    try:
        return s3.get_bucket_versioning(Bucket=name).get("Status", "Never-enabled")
    except ClientError as e:
        return "ACCESS_DENIED" if err(e) == "AccessDenied" else f"ERR:{err(e)}"


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--profile", default=None, help="AWS profile (default: normal credential chain)")
    p.add_argument("--csv", default="s3-inventory.csv")
    args = p.parse_args()

    session = boto3.Session(profile_name=args.profile)
    s3 = session.client("s3")
    clients = {}                      # one client per Region, created on demand
    rows = []
    for name in list_bucket_names(s3):
        try:
            region = bucket_region(s3, name)
        except ClientError as e:
            rows.append([name, f"ERR:{err(e)}", "-", "-", "-", "-", "-"])
            continue
        rs3 = clients.setdefault(region, session.client("s3", region_name=region))
        rows.append([name, region, *encryption(rs3, name), public_access(rs3, name), versioning(rs3, name)])

    with open(args.csv, "w", newline="") as f:
        csv.writer(f).writerows([FIELDS, *rows])

    widths = [max(len(str(r[i])) for r in [FIELDS, *rows]) for i in range(len(FIELDS))]
    for r in [FIELDS, *rows]:
        print("  ".join(str(v).ljust(w) for v, w in zip(r, widths)))
    print(f"\\nBuckets: {len(rows)}   CSV written to {args.csv}", file=sys.stderr)


if __name__ == "__main__":
    main()</code></pre>
<pre><code>python3 -m pip install --user boto3      # not needed in CloudShell
python3 s3_inventory.py --profile academy-admin --csv s3-inventory-py.csv</code></pre>
<table>
<thead><tr><th>Prefer a shell script + CLI when…</th><th>Prefer an SDK (boto3, JS, Go…) when…</th></tr></thead>
<tbody>
<tr><td>It is short glue: a few calls, run by a human or a simple pipeline step</td><td>Logic grows: branching, retries, data structures, unit tests</td></tr>
<tr><td>You want something anyone can paste into CloudShell</td><td>It will run in Lambda, a container or a long-lived service</td></tr>
<tr><td>Output is text for humans or another CLI tool</td><td>You need structured errors (<code>ClientError</code> codes), concurrency or pagination helpers</td></tr>
</tbody></table>
<p><strong>What to notice:</strong> boto3 gives you the error code directly (<code>e.response["Error"]["Code"]</code>), so you don't have to parse text. Both tools use the same credential chain, so <code>--profile</code>, environment variables and instance roles behave identically.</p>` },
    { id: "s7", title: "Run it and read the report", html: `
<pre><code>./s3-inventory.sh --csv s3-inventory.csv</code></pre>
<p>Sample output (your names, Regions and extra buckets differ):</p>
<pre><code>Account: 111122223333  profile: academy-admin
  checking academy-l03-sse-kms-111122223333-23817
  checking academy-l03-sse-s3-111122223333-23817
  checking academy-l03-versioned-111122223333-23817
  checking old-team-share-2019
bucket                                   region     sse_algorithm  kms_key      bucket_key  block_public_access          versioning
academy-l03-sse-kms-111122223333-23817   eu-west-1  aws:kms        aws-managed  True        ALL_ON                       Never-enabled
academy-l03-sse-s3-111122223333-23817    eu-west-1  AES256         aws-managed  False       ALL_ON                       Never-enabled
academy-l03-versioned-111122223333-23817 eu-west-1  AES256         aws-managed  False       ALL_ON                       Enabled
old-team-share-2019                      us-east-1  AES256         aws-managed  False       PARTIAL(True True False False)  Suspended

Buckets: 4   CSV written to s3-inventory.csv</code></pre>
<p><strong>How an architect reads this:</strong></p>
<ul>
<li><code>AES256</code> rows are encrypted (SSE-S3), but you can't control or audit key usage. If policy says "customer-managed keys", these fail. <code>kms_key = aws-managed</code> on an <code>aws:kms</code> row fails such a policy too.</li>
<li><code>PARTIAL(...)</code> on an old bucket deserves a look: <code>BlockPublicPolicy False</code> means someone could attach a public bucket policy.</li>
<li><code>Suspended</code> versioning means older objects keep versions, but new overwrites don't create them, which weakens ransomware and accidental-delete recovery.</li>
</ul>
<p>For the SSE-S3 rows, the <code>kms_key</code> column says <code>aws-managed</code> only because no key ID is returned. That's fine: SSE-S3 keys are fully managed by S3.</p>` },
    { id: "s8", title: "Make it least privilege, and prove it", html: `
<p>The script only <em>reads</em> configuration. Its identity should be able to do nothing else. Save this as <code>s3-inventory-policy.json</code>:</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListAllBuckets",
      "Effect": "Allow",
      "Action": "s3:ListAllMyBuckets",
      "Resource": "*"
    },
    {
      "Sid": "ReadBucketConfiguration",
      "Effect": "Allow",
      "Action": [
        "s3:GetBucketLocation",
        "s3:GetEncryptionConfiguration",
        "s3:GetBucketPublicAccessBlock",
        "s3:GetBucketVersioning"
      ],
      "Resource": "arn:aws:s3:::*"
    }
  ]
}</code></pre>
<ul>
<li><code>s3:ListAllMyBuckets</code> is not tied to a bucket, so its resource is <code>*</code>.</li>
<li>The other four are bucket-level actions, so they use the bucket ARN pattern <code>arn:aws:s3:::*</code> (no <code>/*</code>, which would mean <em>objects</em>).</li>
<li>Note the action name mismatch: the API is <code>GetBucketEncryption</code>, but the permission is <code>s3:GetEncryptionConfiguration</code>. Always check the <em>Service Authorization Reference</em>.</li>
</ul>
<p>Test the policy without creating anything, using the IAM policy simulator API:</p>
<pre><code>aws iam simulate-custom-policy \\
  --policy-input-list file://s3-inventory-policy.json \\
  --action-names s3:GetEncryptionConfiguration s3:GetBucketVersioning s3:PutBucketEncryption s3:GetObject \\
  --resource-arns "arn:aws:s3:::$B1" \\
  --query 'EvaluationResults[].[EvalActionName, EvalDecision]' --output table</code></pre>
<pre><code>-------------------------------------------------
|              SimulateCustomPolicy             |
+-------------------------------+---------------+
|  s3:GetEncryptionConfiguration|  allowed      |
|  s3:GetBucketVersioning       |  allowed      |
|  s3:PutBucketEncryption       |  implicitDeny |
|  s3:GetObject                 |  implicitDeny |
+-------------------------------+---------------+</code></pre>
<p><strong>Optional:</strong> in IAM Identity Center, create a permission set <code>S3InventoryReadOnly</code> with this inline policy, assign it to yourself, configure a second CLI profile with <code>aws configure sso</code>, and run <code>./s3-inventory.sh --profile s3-inventory</code>. Every column should still fill, and an attempted <code>aws s3api put-bucket-versioning</code> should fail with <code>AccessDenied</code>.</p>` },
    { id: "s9", title: "Extend it: many accounts, schedules, and when not to script", html: `
<p><strong>Many accounts.</strong> With one SSO profile per account (or role assumption), loop over profiles:</p>
<pre><code>for p in dev-readonly test-readonly prod-readonly; do
  ./s3-inventory.sh --profile "$p" --csv "s3-inventory-$p.csv" || echo "FAILED: $p" &gt;&amp;2
done
# combine: header once, then every file's rows
{ head -n1 s3-inventory-dev-readonly.csv; for f in s3-inventory-*-readonly.csv; do tail -n +2 "$f"; done; } &gt; all-accounts.csv</code></pre>
<p><strong>Run it on a schedule.</strong> Port the Python version to an AWS Lambda function (an IAM role with the policy from step 8, writing the CSV to a private S3 bucket), triggered daily by an <strong>Amazon EventBridge Scheduler</strong> schedule.</p>
<div class="callout tip"><strong>Architect lens: prefer managed controls for continuous compliance.</strong> A script is a point-in-time snapshot that someone must maintain. For an ongoing "every bucket must be encrypted / non-public / versioned" requirement, use:
<ul>
<li><strong>AWS Config</strong> managed rules such as <code>s3-bucket-server-side-encryption-enabled</code>, <code>s3-bucket-level-public-access-prohibited</code>, <code>s3-bucket-versioning-enabled</code> and <code>s3-default-encryption-kms</code>. These are evaluated continuously, with history, and can trigger automatic remediation.</li>
<li><strong>AWS Security Hub</strong> controls, which aggregate these findings across accounts and Regions.</li>
<li><strong>Prevention</strong> rather than detection: account-level Block Public Access and service control policies (M06).</li>
</ul>
Scripts like this one are still invaluable for one-off audits, migrations and incident response, and for understanding what those managed rules actually check.</div>` },
    { id: "s10", title: "Clean up", html: `<p>Run the commands in the <strong>Clean-up</strong> section below, then tick this step.</p>` }
  ],
  drillsTitle: "JMESPath and CLI worksheet (auto-graded)",
  drills: [
    { id: "L03-d01", q: "<p class=\"small\">Given this <code>list-buckets</code> response:</p><pre><code>{\"Buckets\": [\n  {\"Name\": \"logs-a\", \"CreationDate\": \"2024-03-02T09:15:00+00:00\"},\n  {\"Name\": \"data-b\", \"CreationDate\": \"2025-01-20T14:02:11+00:00\"},\n  {\"Name\": \"app-c\",  \"CreationDate\": \"2023-11-07T08:00:00+00:00\"}\n]}</code></pre>What does <code>--query 'length(Buckets)'</code> return?", answers: ["3"], explain: "<code>length()</code> counts array elements." },
    { id: "L03-d02", q: "<p class=\"small\">Given this <code>list-buckets</code> response:</p><pre><code>{\"Buckets\": [\n  {\"Name\": \"logs-a\", \"CreationDate\": \"2024-03-02T09:15:00+00:00\"},\n  {\"Name\": \"data-b\", \"CreationDate\": \"2025-01-20T14:02:11+00:00\"},\n  {\"Name\": \"app-c\",  \"CreationDate\": \"2023-11-07T08:00:00+00:00\"}\n]}</code></pre>What does <code>--query 'Buckets[1].Name' --output text</code> print?", answers: ["data-b"], hint: "Indexes start at 0.", explain: "Index 1 is the second bucket." },
    { id: "L03-d03", q: "<p class=\"small\">Given this <code>list-buckets</code> response:</p><pre><code>{\"Buckets\": [\n  {\"Name\": \"logs-a\", \"CreationDate\": \"2024-03-02T09:15:00+00:00\"},\n  {\"Name\": \"data-b\", \"CreationDate\": \"2025-01-20T14:02:11+00:00\"},\n  {\"Name\": \"app-c\",  \"CreationDate\": \"2023-11-07T08:00:00+00:00\"}\n]}</code></pre>What does <code>--query 'sort_by(Buckets, &amp;CreationDate)[-1].Name' --output text</code> print?", answers: ["data-b"], hint: "<code>sort_by</code> sorts ascending; <code>[-1]</code> is the last element.", explain: "Sorted oldest → newest: app-c (2023), logs-a (2024), data-b (2025). The last one is the newest: <code>data-b</code>. ISO-8601 timestamps sort correctly as strings." },
    { id: "L03-d04", q: "<p class=\"small\">Given this <code>list-buckets</code> response:</p><pre><code>{\"Buckets\": [\n  {\"Name\": \"logs-a\", \"CreationDate\": \"2024-03-02T09:15:00+00:00\"},\n  {\"Name\": \"data-b\", \"CreationDate\": \"2025-01-20T14:02:11+00:00\"},\n  {\"Name\": \"app-c\",  \"CreationDate\": \"2023-11-07T08:00:00+00:00\"}\n]}</code></pre>What does <code>--query \"Buckets[?starts_with(Name, 'app')] | [0].Name\" --output text</code> print?", answers: ["app-c"], hint: "Filter first, then the pipe stops the projection so <code>[0]</code> picks one element.", explain: "The filter keeps only <code>app-c</code>; <code>| [0].Name</code> takes its name." },
    { id: "L03-d05", q: "<p class=\"small\">Given this <code>get-bucket-encryption</code> response:</p><pre><code>{\"ServerSideEncryptionConfiguration\": {\"Rules\": [{\n  \"ApplyServerSideEncryptionByDefault\": {\"SSEAlgorithm\": \"aws:kms\",\n    \"KMSMasterKeyID\": \"arn:aws:kms:eu-west-1:111122223333:key/1234abcd-...\"},\n  \"BucketKeyEnabled\": true }]}}</code></pre>Write the value printed by <code>--query 'ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm' --output text</code>.", answers: ["aws:kms"], explain: "SSE-KMS shows as <code>aws:kms</code>." },
    { id: "L03-d06", q: "<p class=\"small\">Given this <code>get-bucket-encryption</code> response:</p><pre><code>{\"ServerSideEncryptionConfiguration\": {\"Rules\": [{\n  \"ApplyServerSideEncryptionByDefault\": {\"SSEAlgorithm\": \"aws:kms\",\n    \"KMSMasterKeyID\": \"arn:aws:kms:eu-west-1:111122223333:key/1234abcd-...\"},\n  \"BucketKeyEnabled\": true }]}}</code></pre>With <code>--output text</code>, what does <code>--query 'ServerSideEncryptionConfiguration.Rules[0].BucketKeyEnabled'</code> print? (exact spelling)", answers: ["True"], hint: "The CLI's text output uses Python spellings for booleans.", explain: "JSON <code>true</code> prints as <code>True</code> in text output; <code>null</code> prints as <code>None</code>." },
    { id: "L03-d07", q: "<p class=\"small\">Given this <code>get-public-access-block</code> response:</p><pre><code>{\"PublicAccessBlockConfiguration\": {\"BlockPublicAcls\": true, \"IgnorePublicAcls\": true,\n  \"BlockPublicPolicy\": true, \"RestrictPublicBuckets\": false}}</code></pre>What does <code>--query 'values(PublicAccessBlockConfiguration)[?@ == `false`] | length(@)'</code> return?", answers: ["1"], hint: "<code>values()</code> turns the object into an array of its values.", explain: "Only <code>RestrictPublicBuckets</code> is false, so the count is 1. A quick way to flag partially protected buckets." },
    { id: "L03-d08", q: "What <code>SSEAlgorithm</code> value does <code>get-bucket-encryption</code> show for <strong>SSE-S3</strong>?", answers: ["AES256"], explain: "SSE-S3 = <code>AES256</code>; SSE-KMS = <code>aws:kms</code>; DSSE-KMS = <code>aws:kms:dsse</code>." },
    { id: "L03-d09", q: "What <code>SSEAlgorithm</code> value indicates <strong>dual-layer</strong> SSE-KMS (DSSE-KMS)?", answers: ["aws:kms:dsse"], explain: "DSSE-KMS applies two independent layers of encryption, for workloads whose compliance standards require it." },
    { id: "L03-d10", q: "<code>aws s3api get-bucket-location</code> returns <code>{\"LocationConstraint\": null}</code>. Which Region is the bucket in?", answers: ["us-east-1"], explain: "For historical reasons, buckets in US East (N. Virginia) report a null location constraint." },
    { id: "L03-d11", q: "An old bucket's <code>get-bucket-location</code> returns <code>EU</code>. Which Region code does that mean?", answers: ["eu-west-1"], explain: "<code>EU</code> is the legacy constraint for Europe (Ireland)." },
    { id: "L03-d12", q: "Which AWS CLI v2 <strong>exit code</strong> means \"the request was sent, but the service returned an error\" (for example AccessDenied)?", answers: ["254"], hint: "It is between 252 and 255.", explain: "254 = service error; 255 = general failure; 252 = invalid syntax or parameters; 253 = invalid environment or configuration; 0 = success." },
    { id: "L03-d13", q: "<code>get-public-access-block</code> fails on a bucket that has no bucket-level setting. What is the error <strong>code</strong>?", answers: ["NoSuchPublicAccessBlockConfiguration"], hint: "It starts with NoSuch…", explain: "Handle this code explicitly; it means \"not set\", not \"broken\"." },
    { id: "L03-d14", q: "You create a bucket in <strong>us-east-1</strong> with <code>--create-bucket-configuration LocationConstraint=us-east-1</code>. Which error code do you get?", answers: ["InvalidLocationConstraint"], explain: "In us-east-1, omit the location constraint entirely." },
    { id: "L03-d15", q: "Versioning was enabled on a bucket and later turned off. What does <code>get-bucket-versioning</code> report as the <code>Status</code>?", answers: ["Suspended"], hint: "Versioning can never return to the never-enabled state.", explain: "A bucket is unversioned (no Status), <code>Enabled</code> or <code>Suspended</code>." },
    { id: "L03-d16", q: "A command returned 100 of 5,000 items with <code>--max-items 100</code> and printed a <code>NextToken</code>. Which option fetches the next 100?", answers: ["--starting-token"], explain: "<code>--starting-token &lt;NextToken&gt; --max-items 100</code> continues where you stopped." },
    { id: "L03-d17", q: "Which IAM action must the script's identity have to call <code>GetBucketEncryption</code>? (format: s3:Action)", answers: ["s3:GetEncryptionConfiguration"], hint: "The permission name differs from the API name.", explain: "API <code>GetBucketEncryption</code> → permission <code>s3:GetEncryptionConfiguration</code>. Always check the Service Authorization Reference." }
  ],
  validate: `
<pre><code># 1. Three lab buckets exist in your Region
aws s3api list-buckets --query "length(Buckets[?starts_with(Name, 'academy-l03')])"
#   expect 3

# 2. The KMS bucket uses SSE-KMS with a Bucket Key
aws s3api get-bucket-encryption --bucket "$B2" --output text \\
  --query 'ServerSideEncryptionConfiguration.Rules[0].[ApplyServerSideEncryptionByDefault.SSEAlgorithm, BucketKeyEnabled]'
#   expect: aws:kms   True

# 3. The CSV has a header plus one row per bucket, and no ERR: values for lab buckets
grep academy-l03 s3-inventory.csv | grep -c ERR:     # expect 0
grep -c academy-l03 s3-inventory.csv                 # expect 3

# 4. The versioned bucket has two versions of note.txt
aws s3api list-object-versions --bucket "$B3" --query 'length(Versions)'
#   expect 2

# 5. The least-privilege policy allows reads and denies writes
#    (step 8 simulator: Get* = allowed, PutBucketEncryption = implicitDeny)</code></pre>
<p>All five pass? Run the clean-up, tick the last step, and mark the lab complete.</p>`,
  cleanup: `
<p>If you opened a new shell, reload the names first: <code>read REGION B1 B2 B3 &lt; ~/l03-buckets.txt</code></p>
<pre><code># Unversioned buckets: delete objects, then the bucket
aws s3 rb "s3://$B1" --force
aws s3 rb "s3://$B2" --force

# Versioned bucket: every VERSION and delete marker must go first
aws s3api delete-objects --bucket "$B3" --delete "$(aws s3api list-object-versions --bucket "$B3" \\
  --query '{Objects: [Versions, DeleteMarkers][][].{Key: Key, VersionId: VersionId}, Quiet: \`true\`}' --output json)"
aws s3api delete-bucket --bucket "$B3"

# Confirm nothing is left
aws s3api list-buckets --query "Buckets[?starts_with(Name, 'academy-l03')].Name"
#   expect []
rm -f note.txt ~/l03-buckets.txt</code></pre>
<p><strong>Why the special case?</strong> <code>aws s3 rb --force</code> removes only current objects. A versioned bucket still holds the old versions, so <code>delete-bucket</code> fails with <code>BucketNotEmpty</code>. (The console's <em>Empty</em> button deletes all versions for you.)</p>
<p>Keep <code>s3-inventory.sh</code>, <code>s3_inventory.py</code> and the policy JSON: they are reusable. The script and the SSE-KMS bucket cost nothing measurable. A handful of KMS requests and a few bytes of storage round to $0.</p>`
};

/* ================================================================== MODULE QUIZ */
var QUIZ = {
  passMark: 70,
  questions: [
    { id: "M03-Q01", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A company runs Linux EC2 instances in private subnets with no internet access path. Administrators need interactive shell access. Security requires that no inbound ports are opened, no SSH keys are managed, and the commands run in every session are logged centrally. Which solution meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Use AWS Systems Manager Session Manager with an instance profile that includes <code>AmazonSSMManagedInstanceCore</code>, VPC interface endpoints for Systems Manager, and session logging to CloudWatch Logs or S3", c: true, why: "Session Manager needs no inbound ports or keys, authorises with IAM, logs session activity, and works from private subnets through the SSM, SSMMessages and EC2Messages interface endpoints." },
        { t: "Deploy a hardened bastion host in a public subnet that allows SSH from the corporate IP range, and distribute SSH keys to administrators", c: false, why: "That opens port 22, requires key distribution and rotation, and adds a server to patch. It doesn't log commands without extra tooling." },
        { t: "Create an EC2 Instance Connect Endpoint and allow SSH from it in the instances' security groups", c: false, why: "That avoids public IPs, but it still uses SSH on port 22 inbound from the endpoint and doesn't record session commands centrally." },
        { t: "Set up a Site-to-Site VPN and SSH to the instances' private IPs", c: false, why: "That's a lot of infrastructure, it still needs SSH keys and port 22, and it doesn't log sessions." }
      ] },
    { id: "M03-Q02", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "A web application on EC2 has a server-side request forgery (SSRF) vulnerability. The security team worries that an attacker could make the server fetch <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> and steal the instance role's credentials. Which change MOST directly mitigates this risk while the code is being fixed?",
      options: [
        { t: "Require IMDSv2 on the instance (<code>HttpTokens=required</code>), keeping the hop limit at 1", c: true, why: "IMDSv2 needs a session token obtained with a PUT request that carries a special header. A typical SSRF can only make simple GETs, so it can't get the token, and the hop limit of 1 stops the token leaving the host's network namespace." },
        { t: "Add a security group rule that denies outbound traffic to 169.254.169.254", c: false, why: "Security groups have no deny rules, and traffic to the link-local metadata service isn't filtered by security groups anyway." },
        { t: "Remove the instance profile and put access keys in the application's configuration file", c: false, why: "That swaps short-lived, automatically rotated credentials for long-lived keys on disk, which is far worse if the server is compromised." },
        { t: "Rotate the role's credentials every hour with a scheduled Lambda function", c: false, why: "Instance role credentials are already temporary and rotate automatically. Stolen ones remain valid until they expire, so the theft still works." }
      ] },
    { id: "M03-Q03", type: "single", domain: "D1", task: "1.2", level: 100,
      stem: "An application running on Amazon EC2 must read objects from an S3 bucket. What is the MOST secure way to give it credentials?",
      options: [
        { t: "Attach an IAM role to the instance through an instance profile, with a policy that allows <code>s3:GetObject</code> on that bucket", c: true, why: "The SDK gets temporary credentials from the instance metadata service automatically. Nothing is stored on disk, and credentials rotate on their own." },
        { t: "Create an IAM user and store its access keys in <code>~/.aws/credentials</code> on the instance", c: false, why: "Long-term keys on disk can leak through backups, AMIs or a compromise, and you must rotate them yourself." },
        { t: "Pass the access keys as environment variables in the instance's user data", c: false, why: "User data is readable by anyone who can describe the instance attribute or reach IMDS, so the keys are exposed." },
        { t: "Make the bucket public and restrict access with a referrer header condition", c: false, why: "Referrer headers are trivially forged. The data would effectively be public." }
      ] },
    { id: "M03-Q04", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "A developer accidentally pushed an IAM user's access key ID and secret access key to a public GitHub repository. Which TWO actions should the team take FIRST?",
      options: [
        { t: "Deactivate (and then delete) the exposed access key immediately", c: true, why: "Keys pushed to public repositories are usually found by automated scanners within minutes. Disabling the key stops further use." },
        { t: "Review AWS CloudTrail for API activity made with that access key ID, and look for unexpected resources or IAM changes", c: true, why: "You must establish what the attacker did, such as new users, keys, roles or expensive instances, and remove it." },
        { t: "Remove the file from the latest commit and force-push", c: false, why: "The key is already public and may be cached or cloned. Rewriting history is good hygiene but does not make the key safe." },
        { t: "Change the root user password", c: false, why: "The root password is unrelated to an IAM user's access key." },
        { t: "Enable MFA on the IAM user", c: false, why: "MFA doesn't protect API calls signed with access keys unless policies require MFA, so it doesn't stop the leaked key being used." }
      ] },
    { id: "M03-Q05", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "On a build server, the variables <code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> are exported, and <code>~/.aws/credentials</code> also has a <code>[default]</code> profile with different keys. A job runs <code>aws s3 ls</code> with no <code>--profile</code> option. Which credentials does the AWS CLI use?",
      options: [
        { t: "The credentials in the environment variables", c: true, why: "In the credential chain, environment variables come before the shared credentials and config files, so they win over the default profile." },
        { t: "The <code>[default]</code> profile in <code>~/.aws/credentials</code>", c: false, why: "The shared credentials file is checked only after the environment variables." },
        { t: "The instance profile of the build server", c: false, why: "Instance metadata is checked last, only if nothing earlier in the chain provides credentials." },
        { t: "Neither: the CLI fails because two credential sources conflict", c: false, why: "There is no conflict error. The first source in the chain that provides credentials is used." }
      ] },
    { id: "M03-Q06", type: "single", domain: "D3", task: "3.1", level: 200,
      stem: "An operations script must list only the <em>running</em> EC2 instances tagged <code>Environment=prod</code> in an account that has about 20,000 instances. The script should return quickly and transfer as little data as possible. What should the script use?",
      options: [
        { t: "<code>aws ec2 describe-instances --filters Name=instance-state-name,Values=running Name=tag:Environment,Values=prod</code>, with <code>--query</code> to shape the output", c: true, why: "<code>--filters</code> is applied by the EC2 service, so only matching instances are returned. <code>--query</code> then trims the fields on the client side." },
        { t: "<code>aws ec2 describe-instances --query \"Reservations[].Instances[?State.Name=='running']\"</code> on its own", c: false, why: "<code>--query</code> runs in the CLI after every page of all 20,000 instances has been downloaded. The output is right but slow and wasteful." },
        { t: "<code>--no-paginate</code> to get all instances in a single response", c: false, why: "That disables auto-pagination and returns just the first page. You'd silently miss instances." },
        { t: "<code>--output table</code>, because it compresses the response", c: false, why: "The output format only changes how results are printed, not what is fetched." }
      ] },
    { id: "M03-Q07", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A team stores a Linux EC2 bootstrap script in user data. After a change, they <em>stop and start</em> an existing instance, but the new script doesn't seem to run. What is the MOST likely reason?",
      options: [
        { t: "By default, cloud-init runs user data scripts only on the instance's first boot", c: true, why: "The scripts module runs once per instance. To run on every boot, use a multi-part MIME user data with <code>[scripts-user, always]</code>, or better, bake changes into a new AMI or launch template version." },
        { t: "User data scripts run as <code>ec2-user</code>, which lacks permission to install packages", c: false, why: "User data scripts run as <strong>root</strong>." },
        { t: "User data can't be changed after launch", c: false, why: "You can modify user data while the instance is stopped. The issue is when it runs, not whether it changed." },
        { t: "Stopping an instance deletes its user data", c: false, why: "User data is preserved across stop and start." }
      ] },
    { id: "M03-Q08", type: "single", domain: "D1", task: "1.2", level: 200,
      stem: "A user's identity policy allows <code>s3:*</code> on <code>arn:aws:s3:::finance-data/*</code>. The bucket policy for <code>finance-data</code> contains a statement with <code>\"Effect\": \"Deny\"</code> for <code>s3:DeleteObject</code> for that user. What happens when the user tries to delete an object?",
      options: [
        { t: "The request is denied, because an explicit deny in any applicable policy overrides any allow", c: true, why: "IAM evaluation: explicit deny → then any allow → otherwise implicit deny. Explicit deny always wins." },
        { t: "The request is allowed, because identity policies take precedence over bucket policies", c: false, why: "There is no such precedence. All applicable policies are evaluated together, and an explicit deny anywhere wins." },
        { t: "The request is allowed, because <code>s3:*</code> is more specific than <code>s3:DeleteObject</code>", c: false, why: "Specificity doesn't matter in IAM. Only the deny/allow logic does." },
        { t: "The result depends on which policy was attached most recently", c: false, why: "Attachment order has no effect on evaluation." }
      ] },
    { id: "M03-Q09", type: "single", domain: "D1", task: "1.2", level: 100,
      stem: "Which IAM policy element is required in a <em>resource-based</em> policy, such as an S3 bucket policy, but is NOT used in an identity-based policy attached to a user or role?",
      options: [
        { t: "<code>Principal</code>", c: true, why: "A resource policy must say <em>who</em> it applies to. In an identity policy, the principal is the identity the policy is attached to." },
        { t: "<code>Condition</code>", c: false, why: "Conditions are optional in both policy types." },
        { t: "<code>Resource</code>", c: false, why: "Identity policies use Resource. In resource policies it names the resource itself." },
        { t: "<code>Effect</code>", c: false, why: "Every statement in every policy type needs an Effect." }
      ] },
    { id: "M03-Q10", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A YAML configuration file contains <code>replicas: 08</code>, <code>region_code: NO</code> (meaning Norway) and <code>version: 1.10</code>. With many YAML 1.1 parsers, deployments behave unexpectedly. What is the BEST fix?",
      options: [
        { t: "Quote values that must stay strings, for example <code>region_code: \"NO\"</code> and <code>version: \"1.10\"</code>", c: true, why: "Unquoted YAML scalars are type-guessed: <code>NO</code> can become boolean false, <code>1.10</code> the float 1.1, and leading-zero numbers may be read as octal or fail. Quoting removes the ambiguity." },
        { t: "Convert tabs to two spaces", c: false, why: "Indentation problems cause parse errors, not silent type changes." },
        { t: "Rename the file from <code>.yml</code> to <code>.yaml</code>", c: false, why: "The extension doesn't change how values are parsed." },
        { t: "Wrap the whole file in <code>---</code> document markers", c: false, why: "Document markers don't change scalar typing." }
      ] },
    { id: "M03-Q11", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A team wants to store private container images for Amazon ECS. Requirements: access controlled with IAM, automatic vulnerability scanning on push, and LEAST operational overhead. What should they use?",
      options: [
        { t: "Amazon Elastic Container Registry (ECR) private repositories with image scanning enabled", c: true, why: "ECR is fully managed, integrates with IAM and ECS, and supports scan on push (basic) or continuous enhanced scanning with Amazon Inspector." },
        { t: "A self-hosted Docker registry on an EC2 Auto Scaling group backed by EBS", c: false, why: "It works, but you'd have to run, patch, scale and secure the registry and add scanning yourself." },
        { t: "Public Docker Hub repositories", c: false, why: "These are public, and they're outside IAM control." },
        { t: "Image tarballs saved to an S3 bucket with <code>docker save</code>", c: false, why: "ECS can't pull from tarballs in S3, and there's no scanning." }
      ] },
    { id: "M03-Q12", type: "single", domain: "D1", task: "1.1", level: 200,
      stem: "Developers use long-term IAM user access keys on their laptops for the AWS CLI. The security team wants short-lived credentials, central sign-in with the corporate identity provider, and MFA, while developers keep using the CLI. What should the team do?",
      options: [
        { t: "Use AWS IAM Identity Center with the corporate IdP, assign permission sets, and have developers run <code>aws configure sso</code> and <code>aws sso login</code>", c: true, why: "The CLI then obtains temporary role credentials through Identity Center, and the IdP enforces sign-in and MFA. No long-term keys stay on laptops." },
        { t: "Rotate the IAM user access keys every 30 days with a script", c: false, why: "Rotation shortens exposure but the keys remain long-term and stored on laptops, and there's no central sign-in." },
        { t: "Store the access keys in AWS Secrets Manager and have the CLI fetch them", c: false, why: "To fetch from Secrets Manager you first need credentials. The keys are still long-term." },
        { t: "Give each developer an EC2 instance with an instance profile and have them SSH in to use the CLI", c: false, why: "That adds servers to manage and still needs SSH keys. It doesn't integrate with the corporate IdP." }
      ] },
    { id: "M03-Q13", type: "single", domain: "D1", task: "1.2", level: 100,
      stem: "Connecting to an EC2 instance with <code>ssh -i mykey.pem ec2-user@&lt;ip&gt;</code> fails with <em>\"WARNING: UNPROTECTED PRIVATE KEY FILE! … bad permissions\"</em>. What fixes it?",
      options: [
        { t: "<code>chmod 400 mykey.pem</code>, so only the owner can read the key", c: true, why: "OpenSSH refuses private keys that other users can read. Mode 400 (or 600) fixes it." },
        { t: "<code>chmod 777 mykey.pem</code>", c: false, why: "That makes it worse: everyone could read and change the key." },
        { t: "Add port 22 to the instance's security group", c: false, why: "This error happens locally, before any network connection is attempted." },
        { t: "Connect as <code>root</code> instead of <code>ec2-user</code>", c: false, why: "The username doesn't affect the local key-permission check, and root login is disabled on Amazon Linux." }
      ] },
    { id: "M03-Q14", type: "multi", domain: "D1", task: "1.2", level: 200,
      stem: "A platform team wants to stop AWS credentials from ever being committed to the company's Git repositories. Which TWO measures are MOST effective?",
      options: [
        { t: "Run a secret scanner (for example git-secrets or gitleaks) as a pre-commit hook and in the CI pipeline", c: true, why: "This blocks commits containing key patterns before they reach the remote, and CI catches anything that bypassed local hooks." },
        { t: "Replace long-term access keys with short-lived credentials (IAM Identity Center for people, IAM roles or OIDC federation for pipelines)", c: true, why: "If no long-term keys exist, there is nothing durable to leak. Temporary credentials expire on their own." },
        { t: "Add <code>.aws/</code> to <code>.gitignore</code> after a key has been committed", c: false, why: "<code>.gitignore</code> doesn't remove files already committed, and keys often appear in code or config files instead." },
        { t: "Make all repositories private", c: false, why: "Private repositories still leak through forks, clones, laptops and CI logs, and insiders can misuse them." },
        { t: "Base64-encode keys before committing them", c: false, why: "Base64 is an encoding, not encryption. Anyone can decode it." }
      ] },
    { id: "M03-Q15", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "Compliance requires that all new objects in an S3 bucket are encrypted at rest with a customer managed AWS KMS key, and the team wants to keep AWS KMS request costs low for this high-traffic bucket. What should a solutions architect configure?",
      options: [
        { t: "Default encryption on the bucket set to SSE-KMS with the customer managed key, with S3 Bucket Keys enabled", c: true, why: "Default encryption applies the key to every new object. A Bucket Key lets S3 use a short-lived bucket-level key, cutting KMS requests (and their cost) by up to 99%." },
        { t: "Default encryption set to SSE-S3", c: false, why: "SSE-S3 uses S3-managed keys, not a customer managed KMS key." },
        { t: "Require clients to use SSE-C with their own keys", c: false, why: "SSE-C keys are supplied by the client on every request and aren't KMS keys. This adds operational burden." },
        { t: "SSE-KMS with the customer managed key, and S3 Bucket Keys disabled so each object gets a unique data key", c: false, why: "Objects get unique data keys either way. Disabling Bucket Keys only increases KMS calls and cost." }
      ] },
    { id: "M03-Q16", type: "single", domain: "D1", task: "1.2", level: 100,
      stem: "On an EC2 instance, <code>aws s3 ls</code> fails with <em>\"Unable to locate credentials\"</em>. The instance has no credentials files and no environment variables. What is the MOST likely cause?",
      options: [
        { t: "No IAM role (instance profile) is attached to the instance", c: true, why: "Without a role, the instance metadata service has no credentials to give the CLI, so the whole chain comes up empty. Attach a role with the needed S3 permissions." },
        { t: "The S3 bucket policy denies the instance", c: false, why: "A policy denial gives AccessDenied. \"Unable to locate credentials\" means no credentials were found at all." },
        { t: "The security group blocks outbound HTTPS", c: false, why: "That causes a connection timeout, not a missing-credentials error." },
        { t: "The AWS CLI is version 1", c: false, why: "CLI v1 also uses instance profiles." }
      ] },
    { id: "M03-Q17", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "An application on an EC2 instance must start automatically at boot and restart automatically if the process crashes. Which approach is MOST appropriate on Amazon Linux 2023?",
      options: [
        { t: "Create a systemd unit file with <code>Restart=on-failure</code> and enable it with <code>systemctl enable --now myapp</code>", c: true, why: "systemd supervises the process, restarts it on failure, starts it at boot and sends its logs to the journal (<code>journalctl -u myapp</code>)." },
        { t: "Start it with <code>nohup</code> from the user data script", c: false, why: "User data runs once at first boot by default, and nothing restarts the process if it crashes." },
        { t: "Add a <code>@reboot</code> entry to root's crontab", c: false, why: "That starts it at boot but doesn't restart it after a crash." },
        { t: "Run it in a <code>screen</code> session", c: false, why: "This is manual and doesn't survive a reboot or restart on failure." }
      ] },
    { id: "M03-Q18", type: "multi", domain: "D2", task: "2.1", level: 200,
      stem: "A developer will deploy an AWS CDK application written in Python to a new AWS account and Region for the first time. Which TWO are required?",
      options: [
        { t: "Run <code>cdk bootstrap</code> once for that account and Region", c: true, why: "Bootstrapping creates the CDKToolkit stack (an S3 bucket for assets, ECR repository and deployment roles) that <code>cdk deploy</code> uses." },
        { t: "Install Node.js, because the CDK CLI (Toolkit) runs on Node.js even when the app is written in Python", c: true, why: "The <code>cdk</code> command is an npm package. Python apps also need Python and the <code>aws-cdk-lib</code> package." },
        { t: "Install Terraform", c: false, why: "The CDK synthesises CloudFormation templates. Terraform isn't involved (CDK for Terraform is a separate project)." },
        { t: "Create an AWS CodeCommit repository", c: false, why: "Source control is good practice, but deployment doesn't require any particular repository." },
        { t: "Install Docker in every case", c: false, why: "Docker is needed only for container image assets or Docker-based bundling, not for every CDK app." }
      ] },
    { id: "M03-Q19", type: "single", domain: "D1", task: "1.2", level: 100,
      stem: "An engineer needs to run a few AWS CLI commands right now from a locked-down laptop where they can't install software. They're already signed in to the AWS Management Console. Which option requires the LEAST effort?",
      options: [
        { t: "Open AWS CloudShell from the console", c: true, why: "CloudShell is a browser-based shell with the CLI preinstalled. It uses the console session's credentials and costs nothing extra." },
        { t: "Create an IAM user and access keys, and use them from a web-based terminal service", c: false, why: "This creates long-term keys and sends them to a third party." },
        { t: "Launch an EC2 instance with an instance profile and connect to it", c: false, why: "It works but takes longer and adds a resource to manage and pay for." },
        { t: "Use the AWS Tools for PowerShell on the laptop", c: false, why: "That needs installing software, which isn't allowed." }
      ] },
    { id: "M03-Q20", type: "multi", domain: "D2", task: "2.1", level: 200,
      stem: "An instance's user data installs software from the internet, but the application isn't working after launch. Which TWO steps help MOST to diagnose the problem?",
      options: [
        { t: "Check <code>/var/log/cloud-init-output.log</code> on the instance for the script's output and errors", c: true, why: "cloud-init writes the stdout and stderr of user data scripts there. It's the first place to look." },
        { t: "Confirm the subnet has an outbound path to the internet (a route to an internet gateway with a public IP, or to a NAT gateway) and that security groups and NACLs allow the outbound HTTPS traffic", c: true, why: "Package downloads fail silently in private subnets without NAT or VPC endpoints, a very common cause." },
        { t: "Reboot the instance, because user data runs on every boot", c: false, why: "By default user data runs only on first boot, so rebooting won't re-run it." },
        { t: "Check the AWS Health Dashboard for an EC2 outage first", c: false, why: "This is rarely the cause. Check your own configuration and logs first." },
        { t: "Grant the instance profile <code>AdministratorAccess</code>", c: false, why: "Downloads from the internet don't use IAM, and admin access breaks least privilege." }
      ] }
  ]
};

  window.LMS_MODULES["M03"] = {
    summary: "The hands-on toolkit every AWS architect uses daily: enough Linux to bootstrap, operate and troubleshoot EC2 instances safely; the AWS CLI in depth (profiles, SSO, the credential chain, JMESPath queries, pagination and scripting); Git, JSON and YAML as the languages of infrastructure as code and IAM policies; and a reproducible developer environment with Node, Python and Docker ready for CDK and containers.",
    objectives: [
      "Operate a Linux instance: permissions, packages, systemd services, logs, disks, SSH and keyless access with Session Manager",
      "Bootstrap EC2 with user data and use IMDSv2 safely",
      "Use the AWS CLI with SSO profiles and role chaining, and explain the credential provider chain",
      "Extract exactly the data you need with --query (JMESPath), server-side filters and pagination, and write robust CLI scripts",
      "Read and write IAM policy JSON and CloudFormation YAML correctly, avoiding common syntax pitfalls, and keep secrets out of Git",
      "Set up a reproducible toolchain (CLI, Node, Python, CDK, Docker) and push a container image to Amazon ECR"
    ],
    lessons: LESSONS,
    labs: [LAB],
    quiz: QUIZ,
    flashcards: FLASHCARDS
  };
})();

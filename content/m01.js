/* M01 – Cloud computing and the AWS global infrastructure */
(function () {
  var DIAGRAM_GLOBAL = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="dg1t dg1d">
  <title id="dg1t">AWS global infrastructure</title>
  <desc id="dg1d">A Region contains three Availability Zones, each with one or more data centres, joined by low-latency links. Edge locations, Local Zones, Outposts and Wavelength extend the infrastructure.</desc>
  <rect class="dg-region" x="10" y="20" width="500" height="300" rx="14"/>
  <text class="dg-ta" x="24" y="44">AWS Region · e.g. eu-west-1 (Ireland)</text>
  <text class="dg-ts" x="24" y="62">Isolated geographic area · minimum of 3 AZs · data stays here unless you move it</text>

  <rect class="dg-az" x="28" y="76" width="145" height="168" rx="10"/>
  <text class="dg-tb" x="40" y="98">AZ  eu-west-1a</text>
  <rect class="dg-dc" x="40" y="114" width="56" height="40" rx="4"/><text class="dg-t" x="57" y="139">DC</text>
  <rect class="dg-dc" x="106" y="114" width="56" height="40" rx="4"/><text class="dg-t" x="123" y="139">DC</text>
  <rect class="dg-dc" x="40" y="164" width="56" height="40" rx="4"/><text class="dg-t" x="57" y="189">DC</text>
  <text class="dg-ts" x="40" y="230">1+ data centres</text>

  <rect class="dg-az" x="183" y="76" width="145" height="168" rx="10"/>
  <text class="dg-tb" x="195" y="98">AZ  eu-west-1b</text>
  <rect class="dg-dc" x="195" y="114" width="56" height="40" rx="4"/><text class="dg-t" x="212" y="139">DC</text>
  <rect class="dg-dc" x="261" y="114" width="56" height="40" rx="4"/><text class="dg-t" x="278" y="139">DC</text>
  <text class="dg-ts" x="195" y="216">Own power, cooling</text>
  <text class="dg-ts" x="195" y="230">and network</text>

  <rect class="dg-az" x="338" y="76" width="145" height="168" rx="10"/>
  <text class="dg-tb" x="350" y="98">AZ  eu-west-1c</text>
  <rect class="dg-dc" x="350" y="114" width="56" height="40" rx="4"/><text class="dg-t" x="367" y="139">DC</text>
  <rect class="dg-dc" x="416" y="114" width="56" height="40" rx="4"/><text class="dg-t" x="433" y="139">DC</text>
  <rect class="dg-dc" x="350" y="164" width="56" height="40" rx="4"/><text class="dg-t" x="367" y="189">DC</text>
  <text class="dg-ts" x="350" y="230">Separated by km, &lt;100 km</text>

  <path class="dg-link" d="M100 244 V262 M255 244 V262 M410 244 V262 M100 262 H410"/>
  <text class="dg-ts" x="150" y="282">Redundant, low-latency private fibre between AZs</text>
  <text class="dg-ts" x="60" y="304">Design rule: run every critical tier in ≥ 2 AZs, so that an AZ failure is survivable</text>

  <rect class="dg-edge" x="530" y="20" width="220" height="96" rx="10"/>
  <text class="dg-tb" x="544" y="44">Edge locations (PoPs)</text>
  <text class="dg-ts" x="544" y="64">CloudFront · Route 53 · Global</text>
  <text class="dg-ts" x="544" y="80">Accelerator · Shield · WAF</text>
  <text class="dg-ts" x="544" y="100">Hundreds of cities worldwide</text>

  <rect class="dg-info" x="530" y="128" width="220" height="86" rx="10"/>
  <text class="dg-tb" x="544" y="152">Local Zones</text>
  <text class="dg-ts" x="544" y="172">Extension of a parent Region</text>
  <text class="dg-ts" x="544" y="188">placed in a metro area for</text>
  <text class="dg-ts" x="544" y="204">single-digit-ms latency</text>
  <path class="dg-line" d="M510 170 H530" stroke-dasharray="4 3"/>

  <rect class="dg-good" x="530" y="226" width="220" height="94" rx="10"/>
  <text class="dg-tb" x="544" y="250">Outposts · Wavelength</text>
  <text class="dg-ts" x="544" y="270">Outposts: AWS racks/servers in</text>
  <text class="dg-ts" x="544" y="286">your own data centre</text>
  <text class="dg-ts" x="544" y="306">Wavelength: inside telco 5G</text>
</svg>
<figcaption>Figure M01-1. A Region is made of isolated Availability Zones. Edge and hybrid options extend AWS closer to users and to on-premises sites.</figcaption>
</figure>`;

  var DIAGRAM_SRM = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="dg2t dg2d">
  <title id="dg2t">AWS shared responsibility model</title>
  <desc id="dg2d">The customer is responsible for security in the cloud: data, applications, identity, operating system and network configuration, and encryption. AWS is responsible for security of the cloud: software services and the global hardware infrastructure.</desc>
  <rect class="dg-edge" x="10" y="10" width="740" height="152" rx="12"/>
  <text class="dg-ta" x="24" y="34">CUSTOMER · responsible for security IN the cloud</text>
  <rect class="dg-box" x="24" y="44" width="712" height="24" rx="5"/><text class="dg-t" x="36" y="61">Customer data</text>
  <rect class="dg-box" x="24" y="72" width="712" height="24" rx="5"/><text class="dg-t" x="36" y="89">Platform, applications, identity &amp; access management (IAM)</text>
  <rect class="dg-box" x="24" y="100" width="712" height="24" rx="5"/><text class="dg-t" x="36" y="117">Operating system (on EC2), network &amp; firewall configuration (security groups, NACLs)</text>
  <rect class="dg-box" x="24" y="128" width="712" height="24" rx="5"/><text class="dg-t" x="36" y="145">Client- &amp; server-side encryption, data integrity, network traffic protection</text>

  <rect class="dg-info" x="10" y="172" width="740" height="118" rx="12"/>
  <text class="dg-tb" x="24" y="196">AWS · responsible for security OF the cloud</text>
  <rect class="dg-box" x="24" y="206" width="712" height="34" rx="5"/><text class="dg-t" x="36" y="228">Software: compute · storage · database · networking services (incl. hypervisor, host OS)</text>
  <rect class="dg-box" x="24" y="246" width="712" height="34" rx="5"/><text class="dg-t" x="36" y="268">Hardware / global infrastructure: Regions · Availability Zones · edge locations · physical security</text>
</svg>
<figcaption>Figure M01-2. Where the line falls depends on the service: the more managed the service, the more AWS takes on.</figcaption>
</figure>`;

  window.LMS_MODULES["M01"] = {
    summary: "The vocabulary and mental model behind every AWS design: what the cloud changes, how AWS's global infrastructure is built (and how it fails), who is responsible for what, how you access AWS, how you are billed, and the Well-Architected Framework that the exam is built on.",
    objectives: [
      "Explain cloud service and deployment models and the six advantages of cloud computing",
      "Describe Regions, Availability Zones, edge locations, Local Zones, Wavelength and Outposts, and choose a Region with the four selection criteria",
      "Apply the shared responsibility model to EC2, RDS, Lambda and S3 scenarios",
      "Access AWS securely through the console, CLI (with IAM Identity Center) and SDKs",
      "Identify the main cost drivers, especially data transfer, and set up cost guardrails",
      "Name the six Well-Architected pillars and relate them to the exam domains"
    ],

    lessons: [
      // ================================================================ M01.01
      {
        id: "M01.01", title: "What is cloud computing", level: 100, minutes: 45,
        objectives: [
          "Define cloud computing and its five essential characteristics",
          "Compare IaaS, PaaS, SaaS and serverless by who manages what",
          "Explain the six advantages of cloud computing with examples"
        ],
        sections: [
          { type: "why", html: `
<p>Picture a retailer before the cloud. Before Black Friday it must <strong>buy servers months in advance</strong>, sized for the peak. For the other 11 months those servers sit mostly idle. If the forecast was too low, the site crashes on the busiest day of the year. Cloud computing replaces that guess with <strong>capacity that follows demand</strong>, and that shift underpins almost every design decision you will make as an architect.</p>` },
          { type: "concept", html: `
<p><strong>Cloud computing</strong> is the on-demand delivery of IT resources (compute, storage, databases, networking, software) over the internet with <strong>pay-as-you-go pricing</strong>. You rent capacity from a provider such as AWS instead of buying and running data centres yourself.</p>
<h3>Five essential characteristics (NIST definition)</h3>
<ol>
  <li><strong>On-demand self-service:</strong> provision resources yourself in minutes, with no ticket to a vendor.</li>
  <li><strong>Broad network access:</strong> reach everything over the network through standard APIs.</li>
  <li><strong>Resource pooling:</strong> the provider serves many customers from shared, isolated infrastructure (multi-tenancy).</li>
  <li><strong>Rapid elasticity:</strong> scale out and in, often automatically.</li>
  <li><strong>Measured service:</strong> usage is metered and you pay for what you use.</li>
</ol>
<h3>Service models: who manages what?</h3>
<table>
<thead><tr><th>Layer</th><th>On-premises</th><th>IaaS</th><th>PaaS</th><th>Serverless / FaaS</th><th>SaaS</th></tr></thead>
<tbody>
<tr><td>Application code</td><td>You</td><td>You</td><td>You</td><td>You</td><td>Provider</td></tr>
<tr><td>Runtime / middleware</td><td>You</td><td>You</td><td>Provider</td><td>Provider</td><td>Provider</td></tr>
<tr><td>Operating system</td><td>You</td><td>You</td><td>Provider</td><td>Provider</td><td>Provider</td></tr>
<tr><td>Servers, storage, network</td><td>You</td><td>Provider</td><td>Provider</td><td>Provider</td><td>Provider</td></tr>
<tr><td>Scaling</td><td>You</td><td>You (with tools)</td><td>Mostly provider</td><td>Provider, automatically</td><td>Provider</td></tr>
<tr><td><strong>AWS example</strong></td><td>–</td><td>Amazon EC2</td><td>AWS Elastic Beanstalk</td><td>AWS Lambda</td><td>Products from AWS Marketplace</td></tr>
</tbody></table>
<h3>Deployment models</h3>
<ul>
  <li><strong>Cloud (cloud-native):</strong> everything runs in the cloud.</li>
  <li><strong>Hybrid:</strong> cloud resources connected to on-premises systems (VPN, Direct Connect, Storage Gateway, Outposts). This is very common in exam scenarios.</li>
  <li><strong>On-premises (private cloud):</strong> cloud-like tooling inside your own data centre.</li>
</ul>` },
          { type: "workflow", title: "From API call to running capacity, and back again", html: `
<p>"On-demand" sounds abstract. Here is what actually happens when capacity is added and removed in the cloud, using an Auto Scaling group of EC2 instances as the example. The same loop, at a different level of abstraction, sits behind Lambda, Fargate and every other elastic service.</p>
<ol class="flow">
  <li><strong>A signal says demand changed.</strong> CloudWatch sees average CPU across the group above a target (say 60%) or a request-count-per-target metric rise. The scaling policy computes how many instances are needed.</li>
  <li><strong>An API call is made.</strong> Auto Scaling calls <code>RunInstances</code> on your behalf, using the launch template (AMI, instance type, security groups, IAM role, user data). Every action in AWS is an authenticated API call, even when a service makes it for you (M01.04).</li>
  <li><strong>The control plane places the instance.</strong> EC2 picks a physical host with free capacity in the target AZ and subnet. The Nitro hypervisor carves out the virtual machine, attaches an elastic network interface (ENI) and the root EBS volume.</li>
  <li><strong>Billing starts.</strong> The instance enters <code>pending</code>, then <code>running</code>. On-Demand Linux billing is per second (60-second minimum) from the moment it is running.</li>
  <li><strong>The instance boots and becomes useful.</strong> User data or a baked AMI installs and starts the app. The load balancer health check must pass before the instance receives traffic.</li>
  <li><strong>Demand falls.</strong> The metric drops below target for long enough, the policy scales in, the load balancer drains connections (deregistration delay), and the instance is terminated.</li>
  <li><strong>Billing stops.</strong> You pay nothing more for that instance. Its EBS root volume is deleted too if <em>DeleteOnTermination</em> is set (the default for root volumes).</li>
</ol>
<div class="callout tip"><strong>Why this matters:</strong> the gap between step 1 and step 5 (often 2–5 minutes for EC2) is why you keep a <em>minimum</em> capacity, use predictive or scheduled scaling for known peaks, and why serverless (where the gap is milliseconds to seconds) suits very spiky traffic.</div>
<h3>The capacity-planning workflow, cloud style</h3>
<ol>
  <li><strong>Measure the baseline</strong>: normal requests per second, CPU and memory per request.</li>
  <li><strong>Pick a scaling metric</strong> that tracks load (requests per target is usually better than CPU for web tiers).</li>
  <li><strong>Set min / desired / max</strong>: min covers the baseline plus AZ-failure headroom; max is a cost and quota guardrail.</li>
  <li><strong>Load-test</strong> to confirm the scaling reacts fast enough.</li>
  <li><strong>Review monthly</strong>: right-size instance types and commit (Savings Plans) to the steady baseline only.</li>
</ol>` },
          { type: "aws", title: "The six advantages of cloud computing (AWS)", html: `
<table>
<thead><tr><th>Advantage</th><th>What it means</th><th>Typical AWS mechanism</th></tr></thead>
<tbody>
<tr><td>1. Trade fixed expense for variable expense</td><td>Capital expenditure (CapEx, buying hardware) becomes operating expenditure (OpEx, paying for usage)</td><td>Pay-as-you-go billing</td></tr>
<tr><td>2. Benefit from massive economies of scale</td><td>AWS's scale lowers unit costs, and prices historically trend down</td><td>Lower per-unit prices, volume tiers</td></tr>
<tr><td>3. Stop guessing capacity</td><td>Scale with real demand instead of a forecast</td><td>Auto Scaling, serverless</td></tr>
<tr><td>4. Increase speed and agility</td><td>New resources in minutes, so experiments are cheap</td><td>Console/API provisioning, IaC</td></tr>
<tr><td>5. Stop spending money running and maintaining data centres</td><td>Focus on customers, not racking and stacking</td><td>Managed services</td></tr>
<tr><td>6. Go global in minutes</td><td>Deploy close to users worldwide</td><td>Multiple Regions, CloudFront</td></tr>
</tbody></table>
<div class="callout"><strong>Scalability vs elasticity.</strong> <em>Scalability</em> is the ability to handle growth, by scaling up (a bigger machine: vertical) or out (more machines: horizontal). <em>Elasticity</em> is scaling <strong>automatically in both directions</strong> to match demand, so you also stop paying when demand falls.</div>` },
          { type: "examples", html: `
<h3>Worked example 1: CapEx vs OpEx for a seasonal retailer</h3>
<p>Assumptions (illustrative, round numbers): the peak needs 40 server-equivalents for about 10 days a year; the rest of the year needs 4. A comparable cloud instance costs <strong>$0.20/hour</strong> On-Demand. A physical server costs <strong>$8,000</strong> and runs for 3 years, plus <strong>$1,200 per server per year</strong> for power, cooling, space and hardware support.</p>
<table>
<thead><tr><th>Line item</th><th>Calculation</th><th>Per year</th></tr></thead>
<tbody>
<tr><td>On-prem hardware (amortised)</td><td>40 × $8,000 ÷ 3 years</td><td>$106,667</td></tr>
<tr><td>On-prem running costs</td><td>40 × $1,200</td><td>$48,000</td></tr>
<tr><td><strong>On-prem total</strong></td><td></td><td><strong>≈ $154,667</strong></td></tr>
<tr><td>Cloud baseline</td><td>4 instances × 8,760 h × $0.20</td><td>$7,008</td></tr>
<tr><td>Cloud peak burst</td><td>36 extra × 240 h (10 days) × $0.20</td><td>$1,728</td></tr>
<tr><td><strong>Cloud compute total</strong></td><td></td><td><strong>≈ $8,736</strong></td></tr>
</tbody></table>
<p>The compute difference is dramatic because the on-prem fleet is sized for a peak that lasts 3% of the year. An honest comparison must still add cloud costs that this table ignores: load balancers, storage, data transfer out, support plan, and the people who run it (on both sides). The <strong>shape of the demand</strong> is what makes the cloud win; a flat, 24×7 workload narrows the gap, and that is when commitments (Savings Plans) matter.</p>
<h3>Worked example 2: one application, four service models</h3>
<p>The same WordPress-style site can be run in very different ways. Notice how your task list shrinks as you move right.</p>
<table>
<thead><tr><th>Task</th><th>EC2 (IaaS)</th><th>Elastic Beanstalk (PaaS)</th><th>Containers on Fargate</th><th>SaaS (hosted blog service)</th></tr></thead>
<tbody>
<tr><td>Choose and patch the OS</td><td>You</td><td>Platform updates managed (you choose when)</td><td>AWS (you patch the container image)</td><td>Provider</td></tr>
<tr><td>Install PHP / web server</td><td>You</td><td>Platform provides it</td><td>You, in the Dockerfile</td><td>Provider</td></tr>
<tr><td>Scaling</td><td>You configure an ASG</td><td>Set min/max in the environment</td><td>Service auto scaling</td><td>Provider</td></tr>
<tr><td>Deploy new code</td><td>Your scripts / pipeline</td><td><code>eb deploy</code></td><td>Push image, update service</td><td>Click "update"</td></tr>
<tr><td>Control and flexibility</td><td>Maximum</td><td>High</td><td>High</td><td>Minimal</td></tr>
</tbody></table>` },
          { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you'd choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Start-up MVP with unknown traffic</td><td>Serverless (Lambda, API Gateway, DynamoDB)</td><td>Near-zero cost at low traffic, no servers, scales automatically</td></tr>
<tr><td>Retailer with big seasonal peaks</td><td>EC2 Auto Scaling behind a load balancer, scheduled scaling before events</td><td>Elasticity: pay for the peak only while it lasts</td></tr>
<tr><td>Legacy ERP that needs a specific OS and licence</td><td>IaaS (EC2), possibly Dedicated Hosts for licensing</td><td>Full OS control; lift-and-shift first, modernise later</td></tr>
<tr><td>Dev/test environments used in office hours</td><td>On-Demand instances stopped nights and weekends (Instance Scheduler)</td><td>~65% fewer hours billed than 24×7</td></tr>
<tr><td>Data must stay on-premises but the team wants AWS tooling</td><td>Hybrid: Outposts, or VPN/Direct Connect to the data centre</td><td>Deployment model driven by residency or latency</td></tr>
<tr><td>Company email, CRM, HR</td><td>SaaS</td><td>Not differentiating; buy, don't build</td></tr>
</tbody></table>` },
          { type: "demo", title: "Thought experiment: the Black Friday retailer", html: `
<table>
<thead><tr><th></th><th>On-premises</th><th>AWS</th></tr></thead>
<tbody>
<tr><td>Capacity planning</td><td>Buy for the peak (e.g. 40 servers) months ahead</td><td>Baseline of 4 instances. An Auto Scaling group adds instances as load rises.</td></tr>
<tr><td>Normal-month utilisation</td><td>~10% (36 servers idle)</td><td>~60–70%, because capacity follows demand</td></tr>
<tr><td>Forecast too low</td><td>Site fails on the peak day</td><td>Scales to the actual load (within service quotas)</td></tr>
<tr><td>Forecast too high</td><td>Sunk cost</td><td>Pay only for what ran</td></tr>
</tbody></table>
<p>You will build exactly this, an Application Load Balancer with an Auto Scaling group across AZs, in modules M12 and M14.</p>` },
          { type: "casestudy", title: "Case study: TrailMart's Black Friday", html: `
<p><strong>The company.</strong> TrailMart (fictional) sells outdoor gear online. Its shop ran on 12 physical servers in a co-location facility. Normal traffic used about 15% of that capacity.</p>
<p><strong>The problem.</strong> On Black Friday, traffic jumped 8× within an hour of a marketing email. The servers saturated, checkout timed out, and the site was effectively down for 3 hours during the most valuable day of the year. Buying enough hardware for next year's peak would have meant 60+ servers sitting idle 360 days a year.</p>
<p><strong>Requirements.</strong> Handle 10× normal traffic without failing; avoid paying for idle peak capacity; keep the existing PHP application with minimal code changes; move within 4 months.</p>
<p><strong>Decision.</strong></p>
<ul>
  <li>Rehost the web tier on <strong>EC2 in an Auto Scaling group across 3 AZs</strong> behind an Application Load Balancer (IaaS, because the app needed little change).</li>
  <li>Move the MySQL database to <strong>Amazon RDS Multi-AZ</strong> (managed, so no more patching database servers at 2 a.m.).</li>
  <li>Move user sessions from local disk to <strong>ElastiCache</strong>, so any instance can serve any user (a prerequisite for scaling out).</li>
  <li>Serve images through <strong>CloudFront</strong> to take load off the web tier.</li>
  <li>Add <strong>scheduled scaling</strong> to pre-warm 3× capacity one hour before announced campaigns, with target tracking handling the rest.</li>
</ul>
<p><strong>Result.</strong> The next Black Friday peaked at 11× normal traffic with p95 page time under 600 ms. The group scaled from 4 to 38 instances and back to 4 by Monday. Yearly infrastructure spend fell by roughly half versus the planned hardware refresh, and the team stopped spending weekends on hardware.</p>
<p><strong>Lessons learned.</strong></p>
<ol>
  <li>Elasticity only works if the app is <strong>stateless</strong>; moving sessions out was the real enabler.</li>
  <li>Scaling is not instant; <strong>pre-warming for known events</strong> beat purely reactive scaling.</li>
  <li>The first month's bill was higher than expected because instances were oversized. Right-sizing after watching real metrics fixed it.</li>
</ol>` },
          { type: "exam", html: `
<ul>
  <li>"Unpredictable or spiky traffic" → elasticity: <strong>Auto Scaling</strong> or <strong>serverless</strong>.</li>
  <li>"Reduce operational overhead / undifferentiated heavy lifting" → move up the stack: <strong>managed or serverless</strong> (RDS instead of a self-managed database on EC2, Lambda/Fargate instead of servers).</li>
  <li>"Hybrid" scenarios are common. Expect VPN, Direct Connect, Storage Gateway, DataSync and Outposts as answers.</li>
</ul>` },
          { type: "architect", html: `
<ul>
  <li><strong>The cloud is not automatically cheaper.</strong> A "lift and shift" of oversized, always-on servers can cost more than the data centre did. Savings come from <em>architecture</em>: right-sizing, elasticity, managed services and purchasing models.</li>
  <li><strong>Moving up the stack trades control for less operational burden.</strong> Lambda removes patching but adds limits (e.g. a 15-minute maximum duration). Choose deliberately and record the decision in an ADR.</li>
  <li>Watch lock-in at the <em>data and API</em> layer more than at the compute layer. Open formats (Parquet, PostgreSQL, containers) keep options open.</li>
</ul>` },
          { type: "summary", html: `
<ul>
  <li>Cloud computing = on-demand IT resources over the internet with pay-as-you-go pricing (NIST: self-service, network access, pooling, elasticity, measured service).</li>
  <li>IaaS → PaaS → serverless → SaaS: the further right, the less you manage and the less you control.</li>
  <li>The six advantages: variable expense, economies of scale, stop guessing capacity, speed and agility, stop running data centres, go global in minutes.</li>
  <li>Elasticity = automatic scaling in <em>both</em> directions; it needs stateless application tiers.</li>
  <li>Cloud savings come from matching capacity to demand and from architecture, not from moving servers as-is.</li>
  <li>Deployment models: cloud, hybrid, on-premises. Hybrid is common on the exam.</li>
  <li>Exam reflex: "reduce operational overhead" → move up the stack to managed or serverless.</li>
</ul>` }
        ],
        check: [
          { id: "M01.01-k1", type: "single", domain: "D2", task: "2.1", level: 100,
            stem: "Which statement BEST describes <em>elasticity</em>?",
            options: [
              { t: "Automatically adding and removing resources to match demand", c: true, why: "Elasticity works in both directions and is automatic, so cost tracks demand." },
              { t: "Replacing a server with a larger one", c: false, why: "That is vertical scaling (scale up), and it is usually manual." },
              { t: "Running in multiple Regions", c: false, why: "That relates to global reach and disaster recovery." },
              { t: "Paying upfront for capacity", c: false, why: "That is the opposite of the cloud's variable-expense model." }
            ] },
          { id: "M01.01-k2", type: "single", domain: "D2", task: "2.1", level: 100,
            stem: "A team wants to deploy a web application without managing servers, operating systems or scaling, and pay only when requests run. Which model fits BEST?",
            options: [
              { t: "Serverless (e.g. AWS Lambda)", c: true, why: "No servers or OS to manage, automatic scaling, and you pay per request and duration." },
              { t: "IaaS (e.g. Amazon EC2)", c: false, why: "You manage the OS, patching and scaling." },
              { t: "On-premises virtualisation", c: false, why: "You manage everything." },
              { t: "Dedicated Hosts", c: false, why: "That is physical servers dedicated to you, the most management of all." }
            ] },
          { id: "M01.01-k3", type: "single", domain: "D4", task: "4.2", level: 100,
            stem: "Which advantage of cloud computing does \"stop buying servers for a forecast peak; scale to actual demand\" describe?",
            options: [
              { t: "Stop guessing capacity", c: true, why: "Capacity follows real demand instead of a forecast." },
              { t: "Go global in minutes", c: false, why: "That is about geographic reach." },
              { t: "Benefit from massive economies of scale", c: false, why: "That is about AWS's unit-cost advantage." },
              { t: "Increase speed and agility", c: false, why: "That is about provisioning speed and experimentation." }
            ] },
          { id: "M01.01-k4", type: "single", domain: "D2", task: "2.1", level: 200,
            stem: "A manufacturer must keep its plant-floor control systems in its own factory for latency reasons, but wants to run analytics and new applications on AWS with private connectivity between the two. Which deployment model is this?",
            options: [
              { t: "Hybrid", c: true, why: "Cloud resources connected to systems that stay on-premises is the definition of hybrid." },
              { t: "Cloud-native", c: false, why: "Cloud-native means everything runs in the cloud, which the latency requirement rules out." },
              { t: "On-premises private cloud", c: false, why: "That would keep everything on-premises, but they want to use AWS." },
              { t: "SaaS", c: false, why: "SaaS is a service model (buying a finished application), not a deployment model." }
            ] }
        ],
        cards: ["fc-M01-01", "fc-M01-02", "fc-M01-03", "fc-M01-21", "fc-M01-22"],
        references: [
          "AWS whitepaper: <em>Overview of Amazon Web Services</em>, \"Six advantages of cloud computing\"",
          "NIST SP 800-145, <em>The NIST Definition of Cloud Computing</em>",
          "<em>System Design on AWS</em> ch.7 \"Evolution of Application Deployment\" (PDF p301)"
        ]
      },

      // ================================================================ M01.02
      {
        id: "M01.02", title: "AWS global infrastructure", level: 200, minutes: 55,
        objectives: [
          "Describe Regions, Availability Zones, edge locations, Local Zones, Wavelength Zones and Outposts",
          "Classify services as global, Regional or zonal and explain the impact on failure domains",
          "Select a Region using compliance, latency, service availability and cost"
        ],
        sections: [
          { type: "why", html: `
<p>Every high-availability answer on the exam comes down to one question: <strong>what happens when this component's failure domain fails?</strong> To answer it you must know exactly what a Region and an Availability Zone are, and which services live where.</p>` },
          { type: "concept", html: DIAGRAM_GLOBAL + `
<h3>Regions</h3>
<ul>
  <li>A <strong>Region</strong> is a separate geographic area (e.g. <code>us-east-1</code> N. Virginia, <code>eu-west-1</code> Ireland, <code>ap-south-1</code> Mumbai).</li>
  <li>Regions are <strong>isolated from each other</strong>. A failure in one Region should not affect another, and <strong>your data does not leave a Region unless you move or replicate it</strong>. This is the basis of data-residency compliance.</li>
  <li>Each Region has <strong>at least three AZs</strong> (for Regions launched in recent years).</li>
  <li>Regions launched after March 2019 are <strong>opt-in</strong>: you must enable them for your account before use.</li>
</ul>
<h3>Availability Zones (AZs)</h3>
<ul>
  <li>An <strong>AZ</strong> is one or more discrete data centres with <strong>redundant power, networking and connectivity</strong>.</li>
  <li>AZs in a Region are <strong>physically separated</strong> (a meaningful distance, within about 100 km of each other) so that floods, fires or power events don't take out two at once, yet close enough for <strong>low-latency synchronous replication</strong>.</li>
  <li>AZs are connected by high-bandwidth, low-latency, redundant private fibre.</li>
  <li><strong>AZ names vs AZ IDs:</strong> <code>us-east-1a</code> in your account may be a different physical AZ from <code>us-east-1a</code> in another account. AWS shuffles the names to spread load. <strong>AZ IDs</strong> (e.g. <code>use1-az1</code>) are consistent across accounts. Use IDs when coordinating across accounts, for example with shared subnets.</li>
</ul>
<h3>Edge and extended infrastructure</h3>
<table>
<thead><tr><th>Component</th><th>What it is</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td><strong>Edge locations (points of presence)</strong></td><td>Hundreds of sites in cities worldwide, plus Regional edge caches</td><td>CloudFront caching, Route 53 DNS, Global Accelerator entry points, Shield/WAF at the edge, Lambda@Edge / CloudFront Functions</td></tr>
<tr><td><strong>Local Zones</strong></td><td>An extension of a <em>parent Region</em> in a metro area</td><td>Single-digit-millisecond latency for end users (media rendering, gaming, real-time apps), or local data residency</td></tr>
<tr><td><strong>Wavelength Zones</strong></td><td>AWS compute and storage inside telecom providers' 5G networks</td><td>Ultra-low latency for mobile devices (connected vehicles, AR/VR, live video)</td></tr>
<tr><td><strong>AWS Outposts</strong></td><td>AWS-managed racks or servers installed in <em>your</em> data centre</td><td>Workloads that must stay on-premises (low latency to local systems, data residency) but want AWS APIs and tooling</td></tr>
</tbody></table>` },
          { type: "workflow", title: "Workflows: choosing a Region, and surviving an AZ failure", html: `
<h3>A. Choosing a Region, step by step</h3>
<ol class="flow">
  <li><strong>Filter by law and policy.</strong> List the countries or blocs where the data may legally live (GDPR, data-localisation laws, contracts, sector regulators). Regions outside that list are out, whatever their price.</li>
  <li><strong>Filter by service availability.</strong> Check the <em>AWS Regional Services List</em> for every service and instance type you plan to use (e.g. a specific GPU instance, a newer managed service). Missing a service in a Region can block a design.</li>
  <li><strong>Rank by latency to users.</strong> Measure round-trip times from your main user locations (or use CloudFront/Global Accelerator if users are spread worldwide).</li>
  <li><strong>Compare cost.</strong> Price the same bill of materials in the Pricing Calculator for the shortlisted Regions; differences of 10–20%+ are common.</li>
  <li><strong>Pick the DR Region</strong> (if needed) with the same filters: residency first, then service parity, then distance from the primary.</li>
  <li><strong>Record the decision</strong> in an ADR, because moving Regions later is expensive.</li>
</ol>
<h3>B. What happens when an AZ fails</h3>
<p>Consider a typical web app: an Application Load Balancer, an Auto Scaling group across three AZs, and RDS Multi-AZ.</p>

<figure>
<svg class="diagram" viewBox="0 0 760 270" role="img" aria-labelledby="m0102wt m0102wd">
  <title id="m0102wt">An Availability Zone failure in a multi-AZ application</title>
  <desc id="m0102wd">An Application Load Balancer spreads traffic over web instances in three AZs. AZ b fails. The load balancer stops routing to it, the Auto Scaling group replaces its instances in AZ a and c, and RDS Multi-AZ fails over to the standby.</desc>
  <defs><marker id="m0102w-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-region" x="10" y="10" width="740" height="250" rx="12"/>
  <text class="dg-ta" x="24" y="32">Region</text>
  <rect class="dg-edge" x="250" y="40" width="260" height="34" rx="8"/>
  <text class="dg-tb" x="268" y="62">Application Load Balancer</text>
  <rect class="dg-az" x="24" y="96" width="230" height="150" rx="10"/>
  <text class="dg-tb" x="36" y="118">AZ a</text>
  <rect class="dg-box" x="36" y="128" width="96" height="30" rx="5"/><text class="dg-t" x="48" y="148">web (old)</text>
  <rect class="dg-good" x="142" y="128" width="100" height="30" rx="5"/><text class="dg-t" x="150" y="148">web (new)</text>
  <rect class="dg-good" x="36" y="186" width="206" height="44" rx="5"/><text class="dg-t" x="48" y="206">RDS: standby promoted</text><text class="dg-ts" x="48" y="222">now the primary</text>
  <rect class="dg-bad" x="265" y="96" width="230" height="150" rx="10"/>
  <text class="dg-tb" x="277" y="118">AZ b: FAILED</text>
  <rect class="dg-box" x="277" y="128" width="96" height="30" rx="5"/><text class="dg-t" x="289" y="148">web ✗</text>
  <rect class="dg-box" x="277" y="186" width="206" height="44" rx="5"/><text class="dg-t" x="289" y="206">RDS: old primary ✗</text><text class="dg-ts" x="289" y="222">unreachable</text>
  <rect class="dg-az" x="506" y="96" width="230" height="150" rx="10"/>
  <text class="dg-tb" x="518" y="118">AZ c</text>
  <rect class="dg-box" x="518" y="128" width="96" height="30" rx="5"/><text class="dg-t" x="530" y="148">web (old)</text>
  <rect class="dg-good" x="624" y="128" width="100" height="30" rx="5"/><text class="dg-t" x="632" y="148">web (new)</text>
  <text class="dg-ts" x="518" y="206">Survivors absorb the load;</text><text class="dg-ts" x="518" y="222">ASG rebalances later</text>
  <path class="dg-line" d="M330 74 L110 126" marker-end="url(#m0102w-ar)"/>
  <path class="dg-line" d="M430 74 L600 126" marker-end="url(#m0102w-ar)"/>
  <path class="dg-line" d="M380 74 L330 126" stroke-dasharray="4 4"/>
  <text class="dg-ts" x="384" y="104">no traffic</text>
</svg>
<figcaption>Figure M01-3. When AZ b fails, health checks remove it, Auto Scaling replaces lost instances in healthy AZs, and RDS Multi-AZ promotes its standby.</figcaption>
</figure>
<ol class="flow">
  <li><strong>Failure.</strong> Power or network loss takes out AZ b. Instances and the RDS primary there stop responding.</li>
  <li><strong>Detection (seconds).</strong> ALB health checks to targets in AZ b fail; after the unhealthy threshold, the ALB stops sending them traffic. Users connected to them may see a few errors and retry.</li>
  <li><strong>Database failover (typically 1–2 minutes).</strong> RDS detects the primary's loss and promotes the synchronous standby in another AZ. The DB endpoint's DNS name now points at the new primary, so apps reconnect without config changes.</li>
  <li><strong>Absorb the load.</strong> The remaining AZs handle all traffic. If they were sized with headroom (static stability), users notice nothing more.</li>
  <li><strong>Replace capacity.</strong> Auto Scaling launches replacement instances in healthy AZs to restore the desired count.</li>
  <li><strong>Recovery.</strong> When AZ b returns, Auto Scaling rebalances instances across AZs and RDS creates a new standby. Nothing needs a human, which is the goal.</li>
</ol>` },
          { type: "aws", title: "Service scope: global, Regional, zonal", html: `
<p>Knowing a service's scope tells you its <strong>failure domain</strong> and what you must do for high availability.</p>
<table>
<thead><tr><th>Scope</th><th>Examples</th><th>HA implication</th></tr></thead>
<tbody>
<tr><td><strong>Global</strong></td><td>IAM, Route 53, CloudFront, AWS Organizations, Global Accelerator</td><td>AWS runs it across locations. Configure it once.</td></tr>
<tr><td><strong>Regional</strong> (AWS spreads it across AZs for you)</td><td>S3 (bucket names are globally unique, but data lives in one Region), DynamoDB, Lambda, SQS, SNS, VPC, ALB/NLB, API Gateway, EFS (Standard)</td><td>Survives an AZ failure by design. For Regional failure you need a multi-Region design.</td></tr>
<tr><td><strong>Zonal</strong> (lives in one AZ)</td><td>EC2 instance, EBS volume, subnet, RDS single-AZ instance, NAT gateway, EFS One Zone</td><td><strong>You</strong> must deploy into multiple AZs: an ASG across subnets, RDS Multi-AZ, one NAT gateway per AZ.</td></tr>
</tbody></table>
<h3>Choosing a Region: the four criteria</h3>
<ol>
  <li><strong>Compliance and data residency:</strong> legal or regulatory requirements usually come first and are non-negotiable.</li>
  <li><strong>Latency / proximity to users:</strong> closer means faster.</li>
  <li><strong>Service and feature availability:</strong> not every service or instance type exists in every Region.</li>
  <li><strong>Pricing:</strong> prices differ between Regions, sometimes significantly.</li>
</ol>` },
          { type: "examples", html: `
<h3>Worked example 1: sizing for static stability</h3>
<p>Your web tier needs <strong>6 instances</strong> at peak. How many must you run so that losing any one AZ still leaves 6?</p>
<p>Formula: per-AZ count = ⌈ peak ÷ (number of AZs − 1) ⌉, total = per-AZ × number of AZs.</p>
<table>
<thead><tr><th>AZs used</th><th>Per AZ</th><th>Total running</th><th>Overhead vs 6</th></tr></thead>
<tbody>
<tr><td>2</td><td>⌈6 ÷ 1⌉ = 6</td><td>12</td><td>+100%</td></tr>
<tr><td>3</td><td>⌈6 ÷ 2⌉ = 3</td><td>9</td><td>+50%</td></tr>
<tr><td>4</td><td>⌈6 ÷ 3⌉ = 2</td><td>8</td><td>+33%</td></tr>
</tbody></table>
<p>This is why three AZs is the common sweet spot: much cheaper headroom than two AZs, without the complexity of many.</p>
<h3>Worked example 2: names vs IDs in real output</h3>
<pre><code>$ aws ec2 describe-availability-zones --region eu-west-1 \\
    --query "AvailabilityZones[].{Name:ZoneName,Id:ZoneId}" --output table
-----------------------------
| DescribeAvailabilityZones |
+-------------+-------------+
|     Id      |    Name     |
+-------------+-------------+
|  euw1-az3   |  eu-west-1a |
|  euw1-az1   |  eu-west-1b |
|  euw1-az2   |  eu-west-1c |
+-------------+-------------+</code></pre>
<p>In another account, <code>eu-west-1a</code> might map to <code>euw1-az1</code>. If two accounts must place resources in the <em>same physical</em> AZ (e.g. a shared subnet via AWS RAM, or to keep traffic in-AZ), coordinate on the <strong>ID</strong>.</p>
<h3>Worked example 3: is this service global, Regional or zonal?</h3>
<table>
<thead><tr><th>Resource</th><th>Scope</th><th>So, for an AZ failure…</th></tr></thead>
<tbody>
<tr><td>S3 bucket (Standard class)</td><td>Regional</td><td>Nothing to do; data is stored across ≥ 3 AZs</td></tr>
<tr><td>EBS volume</td><td>Zonal</td><td>Snapshots (stored regionally) let you recreate it in another AZ</td></tr>
<tr><td>NAT gateway</td><td>Zonal</td><td>Deploy one per AZ and route each AZ's private subnets to its own</td></tr>
<tr><td>IAM role</td><td>Global</td><td>Nothing to do</td></tr>
<tr><td>Lambda function</td><td>Regional</td><td>Nothing to do (if VPC-attached, give it subnets in several AZs)</td></tr>
</tbody></table>` },
          { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>EU hospital group storing patient records</td><td>An EU Region, e.g. Frankfurt or Ireland; replicate only to another EU Region</td><td>Data residency comes first</td></tr>
<tr><td>Global SaaS with users on every continent</td><td>One primary Region + CloudFront (and maybe Global Accelerator)</td><td>Edge locations cut latency without running many Regions</td></tr>
<tr><td>Game studio's artists in Los Angeles rendering on cloud GPUs</td><td>A Local Zone in Los Angeles</td><td>Single-digit-ms latency to the users' metro</td></tr>
<tr><td>Car factory needing millisecond control loops on site</td><td>AWS Outposts in the factory</td><td>Compute must physically be on-premises, but the team wants AWS APIs</td></tr>
<tr><td>Connected-vehicle telemetry over 5G</td><td>Wavelength Zone in the carrier network</td><td>Traffic stays inside the 5G network</td></tr>
<tr><td>Bank needing recovery from a Regional outage</td><td>Second Region in the same jurisdiction</td><td>Regions are independent failure domains</td></tr>
</tbody></table>` },
          { type: "demo", title: "Guided practice: explore your account's infrastructure", html: `
<p>You can run these after Lab L01 has set up your CLI profile. They are read-only and free.</p>
<pre><code># Regions enabled for your account
aws ec2 describe-regions --query "Regions[].RegionName" --output table --profile academy-admin

# AZ names AND AZ IDs in a Region (notice the mapping)
aws ec2 describe-availability-zones --region eu-west-1 \\
  --query "AvailabilityZones[].{Name:ZoneName,Id:ZoneId,Type:ZoneType}" --output table --profile academy-admin

# Include Local Zones / Wavelength Zones (opt-in zone groups)
aws ec2 describe-availability-zones --region us-west-2 --all-availability-zones \\
  --query "AvailabilityZones[?ZoneType!='availability-zone'].[ZoneName,ZoneType,OptInStatus]" --output table --profile academy-admin</code></pre>
<p>In the console, open the Region selector (top right) and notice that IAM, Route 53 and CloudFront show <em>Global</em>.</p>` },
          { type: "casestudy", title: "Case study: PaisaFlow keeps payment data in India", html: `
<p><strong>The company.</strong> PaisaFlow (fictional) is a payments start-up in Bengaluru. Regulation requires that payment system data is stored only in India, and the board wants the service to survive both a data-centre and a city-level disaster.</p>
<p><strong>Requirements.</strong> Data stays in India; 99.95% availability; recover from a Regional outage within 1 hour (RTO) with at most 5 minutes of lost data (RPO); latency under 50 ms for Indian users.</p>
<p><strong>Decision.</strong></p>
<ul>
  <li><strong>Primary Region: Asia Pacific (Mumbai) <code>ap-south-1</code></strong>, the most mature Indian Region with the widest service coverage. The workload runs across <strong>three AZs</strong>: ALB, an Auto Scaling group sized for static stability, and Aurora with replicas in two other AZs.</li>
  <li><strong>DR Region: Asia Pacific (Hyderabad) <code>ap-south-2</code></strong>, so replicated data <em>also</em> stays in India. Aurora Global Database replicates with typically sub-second lag, meeting the 5-minute RPO.</li>
  <li><strong>Guardrail:</strong> a Service Control Policy denies use of any Region except these two, so no one can accidentally create resources (or copies of data) elsewhere.</li>
</ul>
<p><strong>What went wrong first.</strong> During design, the team found that two services they planned to use were not yet available in the DR Region. They redesigned those components around services available in both Regions rather than accept a DR plan that could not actually run.</p>
<p><strong>Result.</strong> A quarterly DR game day now promotes the Hyderabad database and shifts traffic with Route 53 in about 25 minutes. A real AZ impairment in the primary Region caused no customer-visible outage, because the remaining two AZs already had the capacity.</p>
<p><strong>Lessons learned.</strong></p>
<ol>
  <li>Residency rules apply to <strong>replicas and backups</strong> too, not only the primary copy.</li>
  <li>Check <strong>service parity</strong> in the DR Region before designing, not after.</li>
  <li>Enforce Region choices with <strong>SCPs</strong>; policy documents alone don't stop mistakes.</li>
</ol>` },
          { type: "exam", html: `
<ul>
  <li><strong>"Highly available"</strong> → spread across <strong>multiple AZs</strong>. <strong>"Disaster recovery from a Regional outage"</strong> → <strong>multiple Regions</strong>.</li>
  <li><strong>"Data must not leave country X"</strong> → choose a Region in that country. Data stays in the Region unless you replicate it.</li>
  <li><strong>"Lowest latency for global users"</strong> → CloudFront or Global Accelerator (edge). <strong>"Single-digit-ms for users in city X"</strong> → Local Zones. <strong>"5G mobile devices"</strong> → Wavelength. <strong>"Must run on-premises with AWS APIs"</strong> → Outposts.</li>
  <li>A zonal resource (an EC2 instance, an EBS volume) is a single point of failure until you add redundancy in another AZ.</li>
</ul>` },
          { type: "architect", html: `
<ul>
  <li><strong>Static stability:</strong> design so that if one AZ is lost, the remaining AZs <em>already</em> have enough capacity (e.g. 3 AZs at ≥ 50% headroom each), rather than relying on scaling up during the failure.</li>
  <li><strong>Cross-AZ traffic costs money</strong> (see M01.05). Chatty microservices spread across AZs can produce surprising bills. Weigh this against availability.</li>
  <li>AWS has no fixed "paired Regions". You choose your DR Region, considering residency, latency to the primary, and service parity.</li>
  <li>Use AZ <strong>IDs</strong> in runbooks and multi-account designs, because names differ per account.</li>
</ul>` },
          { type: "summary", html: `
<ul>
  <li>Region = isolated geographic area; data stays in it unless you move it. AZ = one or more data centres with independent power and networking.</li>
  <li>Choose a Region by compliance → service availability → latency → cost.</li>
  <li>Know each service's scope: global (IAM, Route 53, CloudFront), Regional (S3, DynamoDB, Lambda, ALB), zonal (EC2, EBS, subnet, NAT gateway).</li>
  <li>Zonal resources need <em>you</em> to add redundancy in another AZ.</li>
  <li>Static stability: run enough capacity that losing one AZ needs no scaling to survive. Three AZs is the usual balance.</li>
  <li>Edge locations (CloudFront, Route 53), Local Zones (metro latency), Wavelength (5G), Outposts (on-premises).</li>
  <li>HA = multi-AZ. DR from a Regional outage = multi-Region.</li>
  <li>Use AZ IDs, not names, across accounts.</li>
</ul>` }
        ],
        check: [
          { id: "M01.02-k1", type: "single", domain: "D2", task: "2.2", level: 200,
            stem: "An application runs on EC2 instances in a single Availability Zone. Which change protects it from a data-centre-level failure at the LOWEST additional complexity?",
            options: [
              { t: "Run instances in at least two AZs behind a load balancer.", c: true, why: "Multi-AZ is the standard HA pattern for zonal resources." },
              { t: "Deploy a copy in a second Region.", c: false, why: "This works but is more complex and costly than the requirement needs." },
              { t: "Use a bigger instance type.", c: false, why: "Still a single AZ, so still a single point of failure." },
              { t: "Enable detailed CloudWatch monitoring.", c: false, why: "Monitoring alerts you but does not provide failover." }
            ] },
          { id: "M01.02-k2", type: "single", domain: "D1", task: "1.1", level: 200,
            stem: "A regulator requires that customer data never leaves Germany. What is the PRIMARY design decision?",
            options: [
              { t: "Deploy in the Europe (Frankfurt) Region and don't configure cross-Region replication.", c: true, why: "Data stays in the Region you choose unless you move it, so Region choice is the residency control." },
              { t: "Use CloudFront to serve the data.", c: false, why: "CloudFront caches content globally at edge locations, which works against strict residency." },
              { t: "Use AZ IDs instead of AZ names.", c: false, why: "AZ IDs are about cross-account consistency, not residency." },
              { t: "Enable S3 Cross-Region Replication to Ireland.", c: false, why: "That copies data out of Germany." }
            ] },
          { id: "M01.02-k3", type: "multi", domain: "D2", task: "2.2", level: 200,
            stem: "Which TWO resources are <em>zonal</em>, meaning you must design for multiple AZs yourself?",
            options: [
              { t: "Amazon EBS volume", c: true, why: "An EBS volume exists in one AZ." },
              { t: "Amazon EC2 instance", c: true, why: "An instance runs in one subnet in one AZ." },
              { t: "Amazon S3 bucket", c: false, why: "S3 Standard stores data across multiple AZs in the Region." },
              { t: "Amazon DynamoDB table", c: false, why: "DynamoDB replicates across AZs automatically." },
              { t: "AWS IAM role", c: false, why: "IAM is global." }
            ] },
          { id: "M01.02-k4", type: "single", domain: "D3", task: "3.4", level: 200,
            stem: "A game studio needs single-digit-millisecond latency for players in a specific large city that is far from the nearest AWS Region. Which option fits BEST?",
            options: [
              { t: "AWS Local Zones", c: true, why: "Local Zones put compute close to large population centres, extending a parent Region." },
              { t: "AWS Outposts", c: false, why: "Outposts go in your own data centre, not near the players." },
              { t: "A second Availability Zone", c: false, why: "AZs are in the Region, which is still far from the players." },
              { t: "Amazon S3 Transfer Acceleration", c: false, why: "That speeds up uploads to S3. It does not host game servers." }
            ] },
          { id: "M01.02-k5", type: "single", domain: "D2", task: "2.2", level: 300,
            stem: "A web tier needs 8 instances at peak to meet its SLA. The company wants the tier to keep meeting the SLA during the loss of one Availability Zone WITHOUT waiting for Auto Scaling. It uses 3 AZs. What is the minimum number of instances to run?",
            options: [
              { t: "12 (4 per AZ)", c: true, why: "Losing one AZ leaves 2 AZs that must carry 8 instances: 8 ÷ 2 = 4 per AZ, so 4 × 3 = 12." },
              { t: "8 (spread across 3 AZs)", c: false, why: "Losing an AZ would leave only about 5–6 instances, below the 8 needed." },
              { t: "9 (3 per AZ)", c: false, why: "After losing an AZ only 6 remain, below 8." },
              { t: "16 (8 per AZ in 2 of the AZs)", c: false, why: "It works but wastes capacity and ignores the third AZ." }
            ] }
        ],
        cards: ["fc-M01-04", "fc-M01-05", "fc-M01-06", "fc-M01-07", "fc-M01-08", "fc-M01-23", "fc-M01-24"],
        references: [
          "AWS docs: <em>Regions and Zones</em> (EC2 User Guide); <em>AZ IDs for your AWS resources</em>",
          "AWS whitepaper: <em>AWS Fault Isolation Boundaries</em>",
          "<em>System Design on AWS</em> ch.9 \"Getting Started with AWS\" (PDF p412)",
          "Exam guide: Task 1.1 &amp; 2.2, \"AWS global infrastructure\""
        ]
      },

      // ================================================================ M01.03
      {
        id: "M01.03", title: "The shared responsibility model", level: 200, minutes: 40,
        objectives: [
          "Distinguish security OF the cloud (AWS) from security IN the cloud (customer)",
          "Explain how responsibilities shift between EC2, RDS, Lambda and S3",
          "Identify shared and inherited controls"
        ],
        sections: [
          { type: "why", html: `
<p>Most cloud security incidents are not AWS failures but <strong>customer misconfigurations</strong>: public S3 buckets, leaked access keys, unpatched operating systems, overly open security groups. The shared responsibility model tells you exactly which of those are <em>your</em> job.</p>` },
          { type: "concept", html: DIAGRAM_SRM + `
<ul>
  <li><strong>AWS: security <em>of</em> the cloud.</strong> Physical data centres, hardware, the global network, the hypervisor and host OS, and the managed-service software itself.</li>
  <li><strong>Customer: security <em>in</em> the cloud.</strong> Your data, identities and permissions, your configuration choices, and, for IaaS, the guest OS and everything you install.</li>
</ul>
<h3>Control types</h3>
<ul>
  <li><strong>Inherited controls:</strong> fully AWS's job, and you inherit them (e.g. physical and environmental security).</li>
  <li><strong>Shared controls:</strong> both parties act, each at its own layer:
    <ul><li><em>Patch management:</em> AWS patches infrastructure. You patch your guest OS and applications.</li>
    <li><em>Configuration management:</em> AWS configures its devices. You configure your OS, databases and services.</li>
    <li><em>Awareness and training:</em> AWS trains its staff. You train yours.</li></ul></li>
  <li><strong>Customer-specific controls:</strong> entirely yours (e.g. how you segment and protect your data and applications).</li>
</ul>` },
          { type: "workflow", title: "Walk-through: one workload, three hosting choices", html: `
<p>Take an <strong>order-processing API</strong> and follow the security work it creates in three versions. The point is to see the line move, and to see what <em>never</em> moves.</p>
<ol class="flow">
  <li><strong>Version 1: EC2 + self-installed PostgreSQL.</strong> You harden the AMI, patch the OS monthly, patch PostgreSQL, configure disk encryption, run backups, rotate DB passwords, write security group rules, install a log agent, and manage the IAM role. AWS secures the building, servers, network and hypervisor.</li>
  <li><strong>Version 2: EC2 + Amazon RDS.</strong> The database host OS, engine patching (in your maintenance window), automated backups and Multi-AZ replication move to AWS. You still choose encryption at creation, set the parameter group, manage DB users, restrict the security group and patch the EC2 web tier.</li>
  <li><strong>Version 3: API Gateway + Lambda + DynamoDB.</strong> No OS, no runtime patches (managed runtimes), no database servers. Your list is now: least-privilege execution role, input validation in your code, dependency (library) updates, API authorization, encryption choices and data classification.</li>
  <li><strong>What never moved:</strong> your <em>data</em>, your <em>identities and permissions</em>, your <em>application code</em>, and the <em>configuration</em> choices that expose or protect them.</li>
</ol>
<h3>Responding to a newly announced vulnerability</h3>
<ol>
  <li>Identify the affected <strong>layer</strong> (hardware/hypervisor, managed-service software, guest OS, runtime, your dependencies, your code).</li>
  <li>Map that layer to the owner for <strong>each service</strong> you use (the table below).</li>
  <li>For AWS-owned layers, check the <strong>AWS security bulletins</strong> and your <strong>AWS Health Dashboard</strong> for any required action (e.g. a maintenance event).</li>
  <li>For your layers, patch, rebuild images or redeploy, and verify with a scanner such as Amazon Inspector.</li>
</ol>` },
          { type: "aws", title: "How the line moves by service", html: `
<table>
<thead><tr><th>Task</th><th>EC2 (IaaS)</th><th>RDS (managed)</th><th>Lambda (serverless)</th><th>S3 (managed storage)</th></tr></thead>
<tbody>
<tr><td>Physical security, hardware, host OS</td><td>AWS</td><td>AWS</td><td>AWS</td><td>AWS</td></tr>
<tr><td>Guest OS patching</td><td><strong>Customer</strong></td><td>AWS</td><td>AWS</td><td>n/a</td></tr>
<tr><td>Database engine patching</td><td>Customer (if self-installed)</td><td>AWS (in <em>your</em> chosen maintenance window)</td><td>n/a</td><td>n/a</td></tr>
<tr><td>Runtime / language patches</td><td>Customer</td><td>n/a</td><td>AWS (managed runtimes)</td><td>n/a</td></tr>
<tr><td>Network access rules (security groups, NACLs)</td><td>Customer</td><td>Customer</td><td>Customer (if VPC-attached)</td><td>n/a</td></tr>
<tr><td>IAM permissions and resource policies</td><td>Customer</td><td>Customer (+ DB users)</td><td>Customer (execution role)</td><td>Customer (bucket policies, Block Public Access)</td></tr>
<tr><td>Choosing to encrypt / key management</td><td>Customer</td><td>Customer</td><td>Customer</td><td>Customer (default SSE-S3 is on; choose KMS for more control)</td></tr>
<tr><td>Your code and your data</td><td>Customer</td><td>Customer</td><td>Customer</td><td>Customer</td></tr>
</tbody></table>
<div class="callout tip"><strong>Rule of thumb:</strong> the more managed the service, the less you patch, but you <em>always</em> own your data, identities, access configuration and encryption choices.</div>` },
          { type: "examples", html: `
<h3>Worked example: the containers trap</h3>
<p>Container questions catch people because the same container can run with very different responsibilities.</p>
<table>
<thead><tr><th>Task</th><th>ECS/EKS on EC2</th><th>ECS/EKS on Fargate</th></tr></thead>
<tbody>
<tr><td>Patch the host OS that runs containers</td><td><strong>Customer</strong> (use updated ECS/EKS-optimised AMIs)</td><td>AWS</td></tr>
<tr><td>Scale and right-size the host fleet</td><td>Customer</td><td>AWS (you size each task)</td></tr>
<tr><td>Patch the container image (base image, libraries)</td><td>Customer</td><td>Customer</td></tr>
<tr><td>IAM task role, network rules, secrets</td><td>Customer</td><td>Customer</td></tr>
<tr><td>Kubernetes control plane (EKS)</td><td>AWS</td><td>AWS</td></tr>
</tbody></table>
<h3>Worked example: assign the owner of ten tasks for a web app on EC2 + RDS + S3</h3>
<table>
<thead><tr><th>#</th><th>Task</th><th>Owner</th></tr></thead>
<tbody>
<tr><td>1</td><td>Shred failed disks from the data centre</td><td>AWS</td></tr>
<tr><td>2</td><td>Apply kernel patches to web servers</td><td>Customer</td></tr>
<tr><td>3</td><td>Apply a minor PostgreSQL engine patch on RDS</td><td>AWS (scheduled in your window; you can choose when)</td></tr>
<tr><td>4</td><td>Turn on RDS encryption at rest</td><td>Customer (choose at creation)</td></tr>
<tr><td>5</td><td>Block public access on the S3 bucket</td><td>Customer</td></tr>
<tr><td>6</td><td>Make the S3 service itself resilient to disk failures</td><td>AWS</td></tr>
<tr><td>7</td><td>Restrict SSH to the web servers</td><td>Customer (security groups; better, use Session Manager and no SSH)</td></tr>
<tr><td>8</td><td>Train developers on secure coding</td><td>Customer (shared control: AWS trains its own staff)</td></tr>
<tr><td>9</td><td>Enable CloudTrail and retain logs</td><td>Customer</td></tr>
<tr><td>10</td><td>Provide a SOC 2 report for auditors about AWS facilities</td><td>AWS (download it from AWS Artifact)</td></tr>
</tbody></table>` },
          { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Where your effort goes</th><th>Tooling that helps</th></tr></thead>
<tbody>
<tr><td>Regulated workload (PCI DSS, HIPAA) on AWS</td><td>Your controls on top of AWS's attested ones</td><td>AWS Artifact (reports, BAA), Config conformance packs, Security Hub standards</td></tr>
<tr><td>Fleet of EC2 instances</td><td>OS patching and hardening</td><td>Systems Manager Patch Manager, Amazon Inspector</td></tr>
<tr><td>Serverless API</td><td>Code, dependencies, IAM least privilege</td><td>Inspector Lambda scanning, IAM Access Analyzer</td></tr>
<tr><td>Data lake on S3</td><td>Access policies, encryption, sensitive-data discovery</td><td>S3 Block Public Access, KMS, Amazon Macie</td></tr>
<tr><td>Containers on Fargate</td><td>Image contents, task roles</td><td>ECR image scanning, Secrets Manager</td></tr>
</tbody></table>` },
          { type: "demo", title: "Classify the scenario", html: `
<ol>
  <li>A critical OpenSSL vulnerability affects the OS on your EC2 web servers. <em>Who patches it?</em> → <strong>You</strong> (guest OS on IaaS).</li>
  <li>The same vulnerability affects hosts running RDS. → <strong>AWS</strong> patches it, applied in your maintenance window or as a mandatory update.</li>
  <li>An S3 bucket containing customer PII is publicly readable. → <strong>Customer</strong> misconfiguration (Block Public Access, bucket policy).</li>
  <li>A disk fails in an AWS data centre. → <strong>AWS</strong> handles it, including secure decommissioning of media.</li>
  <li>A developer commits access keys to a public Git repository. → <strong>Customer</strong> (credential management; use roles and IAM Identity Center).</li>
</ol>` },
          { type: "casestudy", title: "Case study: CareBridge and the \"compliant\" bucket", html: `
<p><strong>The company.</strong> CareBridge Clinics (fictional) moved its patient-referral system to AWS. Because AWS offers HIPAA-eligible services and signs a Business Associate Addendum (BAA), the project team assumed the system would be compliant automatically.</p>
<p><strong>The incident.</strong> A developer created an S3 bucket for scanned referral letters and, to fix a broken image link in a partner portal, added a bucket policy that allowed public read. Six weeks later a security researcher reported that 40,000 documents were publicly listable.</p>
<p><strong>Whose responsibility?</strong> Entirely the customer's. S3 behaved exactly as configured; AWS's controls (data-centre security, durable storage, the service software) worked perfectly. The misconfiguration was "security <em>in</em> the cloud".</p>
<p><strong>The fix.</strong></p>
<ul>
  <li>Turned on <strong>S3 Block Public Access at the account level</strong> (and enforced it across all accounts with an SCP so it cannot be switched off).</li>
  <li>Gave the partner portal access through <strong>CloudFront with origin access control</strong> and signed URLs instead of a public bucket.</li>
  <li>Enabled <strong>AWS Config rules</strong> and <strong>Security Hub</strong> to flag public buckets within minutes, and <strong>Amazon Macie</strong> to discover buckets containing health data.</li>
  <li>Reviewed the BAA terms: only HIPAA-eligible services may hold patient data, and the customer must configure them correctly (encryption, logging, access control).</li>
</ul>
<p><strong>Lessons learned.</strong></p>
<ol>
  <li>Compliance is <strong>inherited only up to the line</strong>. An eligible service is a starting point, not a result.</li>
  <li>Prefer <strong>preventive guardrails</strong> (Block Public Access, SCPs) over relying on every person getting every setting right.</li>
  <li><strong>Detective controls</strong> shorten exposure time from weeks to minutes.</li>
</ol>` },
          { type: "exam", html: `
<ul>
  <li>"Who is responsible for…" questions: guest OS on EC2 → customer. Hypervisor and physical → AWS. RDS engine patching → AWS. Security groups → always the customer.</li>
  <li>Compliance evidence (SOC reports, ISO certificates, PCI attestations) for AWS's side → <strong>AWS Artifact</strong>.</li>
  <li>A managed service is often the right answer when the question emphasises <em>reducing patching or security operations effort</em>.</li>
</ul>` },
          { type: "architect", html: `
<ul>
  <li>Compliance is <strong>inherited only up to the line</strong>. A PCI-compliant service doesn't make <em>your</em> workload compliant. You still configure encryption, logging and access correctly.</li>
  <li>Automate your side: AWS Config rules, Security Hub, GuardDuty and Inspector (Track B) continuously check the "in the cloud" half.</li>
</ul>` },
          { type: "summary", html: `
<ul>
  <li>AWS: security <strong>of</strong> the cloud (facilities, hardware, network, hypervisor, managed-service software).</li>
  <li>Customer: security <strong>in</strong> the cloud (data, IAM, configuration, guest OS, encryption choices, code).</li>
  <li>The line moves with the service: EC2 (you patch the OS) → RDS (AWS patches the engine) → Lambda/Fargate (no OS for you).</li>
  <li>What never moves: your data, identities, permissions, code and configuration.</li>
  <li>Control types: inherited, shared (patching, configuration, training) and customer-specific.</li>
  <li>Containers: on EC2 you patch the hosts; on Fargate AWS does. You always patch your images.</li>
  <li>AWS Artifact = AWS's compliance reports and agreements (e.g. BAA).</li>
  <li>Most breaches are customer misconfiguration; use preventive and detective guardrails.</li>
</ul>` }
        ],
        check: [
          { id: "M01.03-k1", type: "single", domain: "D1", task: "1.1", level: 200,
            stem: "Under the shared responsibility model, who is responsible for patching the guest operating system of an Amazon EC2 instance?",
            options: [
              { t: "The customer", c: true, why: "EC2 is IaaS, so the guest OS is yours to patch (Systems Manager Patch Manager helps)." },
              { t: "AWS", c: false, why: "AWS patches the host OS and hypervisor, not your guest OS." },
              { t: "AWS, during the maintenance window", c: false, why: "That describes RDS engine patching." },
              { t: "Nobody; EC2 patches itself", c: false, why: "No automatic guest OS patching happens unless you configure it." }
            ] },
          { id: "M01.03-k2", type: "single", domain: "D1", task: "1.2", level: 200,
            stem: "A company moves its MySQL database from EC2 to Amazon RDS. Which responsibility moves from the customer to AWS?",
            options: [
              { t: "Patching the database engine and underlying OS", c: true, why: "RDS is a managed service, so AWS patches the engine and OS." },
              { t: "Managing database users and permissions", c: false, why: "Database users and grants remain the customer's job." },
              { t: "Configuring security group rules", c: false, why: "Network access rules are always the customer's job." },
              { t: "Deciding whether to enable encryption", c: false, why: "The encryption choice remains the customer's." }
            ] },
          { id: "M01.03-k3", type: "single", domain: "D1", task: "1.3", level: 200,
            stem: "An auditor asks for AWS's SOC 2 report covering the data centres hosting your workload. Where do you get it?",
            options: [
              { t: "AWS Artifact", c: true, why: "Artifact provides on-demand access to AWS's compliance reports and agreements." },
              { t: "AWS Config", c: false, why: "Config records the configuration of <em>your</em> resources." },
              { t: "Amazon Inspector", c: false, why: "Inspector scans your workloads for vulnerabilities." },
              { t: "AWS CloudTrail", c: false, why: "CloudTrail logs API activity in your account." }
            ] },
          { id: "M01.03-k4", type: "single", domain: "D1", task: "1.2", level: 200,
            stem: "A team wants to run containers WITHOUT being responsible for patching the operating system of the underlying hosts. Which option meets this requirement?",
            options: [
              { t: "Amazon ECS with the AWS Fargate launch type", c: true, why: "With Fargate, AWS manages the hosts, including OS patching. You still patch your container images." },
              { t: "Amazon ECS with the EC2 launch type", c: false, why: "You own the EC2 container instances, so you patch their OS (or replace them with updated AMIs)." },
              { t: "Docker installed on EC2 instances in an Auto Scaling group", c: false, why: "You manage the instances, OS and Docker itself." },
              { t: "Amazon EKS with self-managed node groups", c: false, why: "AWS manages the control plane, but you manage and patch the worker nodes." }
            ] }
        ],
        cards: ["fc-M01-09", "fc-M01-10", "fc-M01-11", "fc-M01-25", "fc-M01-26"],
        references: ["AWS: <em>Shared Responsibility Model</em> (aws.amazon.com/compliance/shared-responsibility-model)", "AWS Artifact documentation", "Exam guide: Task 1.1, \"The AWS shared responsibility model\""]
      },

      // ================================================================ M01.04
      {
        id: "M01.04", title: "Accessing AWS", level: 100, minutes: 45,
        objectives: [
          "Compare the console, CLI, SDKs, CloudShell and IaC as ways to call AWS APIs",
          "Explain identities: root user, IAM Identity Center users, IAM users and roles",
          "Configure CLI profiles that use short-lived credentials"
        ],
        sections: [
          { type: "why", html: `
<p>Every action in AWS, from a console click to a Terraform plan, is an <strong>authenticated API call</strong>. Understanding that one fact explains how automation works, how CloudTrail can audit everything, and why leaked credentials are so dangerous.</p>` },
          { type: "concept", html: `
<h3>Ways to call AWS</h3>
<table>
<thead><tr><th>Tool</th><th>Best for</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>AWS Management Console</strong></td><td>Learning, exploring, one-off tasks</td><td>Web UI. Not repeatable, so avoid it for production changes.</td></tr>
<tr><td><strong>AWS CLI v2</strong></td><td>Scripting, automation, quick queries</td><td><code>aws &lt;service&gt; &lt;operation&gt;</code>. Supports profiles, SSO, JMESPath <code>--query</code>.</td></tr>
<tr><td><strong>AWS SDKs</strong></td><td>Application code</td><td>Python (boto3), JavaScript, Java, Go, Ruby, .NET… with built-in retries and credential discovery</td></tr>
<tr><td><strong>AWS CloudShell</strong></td><td>A CLI in the browser, with no local setup</td><td>Pre-authenticated as your console identity</td></tr>
<tr><td><strong>Infrastructure as Code</strong></td><td>Repeatable environments</td><td>CloudFormation (the exam's answer), CDK, Terraform (Track L)</td></tr>
</tbody></table>
<p>All of them send HTTPS requests to service <strong>endpoints</strong> (e.g. <code>ec2.eu-west-1.amazonaws.com</code>), signed with <strong>Signature Version 4</strong> using your credentials. CloudTrail records the calls.</p>
<h3>Who is calling? Identities</h3>
<table>
<thead><tr><th>Identity</th><th>Credentials</th><th>Use for</th></tr></thead>
<tbody>
<tr><td><strong>Root user</strong></td><td>Email + password (+ MFA)</td><td><em>Only</em> the few tasks that require it (e.g. closing the account, changing certain account settings). Never daily work, and no access keys.</td></tr>
<tr><td><strong>IAM Identity Center user</strong></td><td>Sign-in via the access portal → <strong>temporary</strong> credentials</td><td><strong>Recommended</strong> for humans, across one or many accounts</td></tr>
<tr><td><strong>IAM user</strong></td><td>Password and/or <strong>long-lived</strong> access keys</td><td>Legacy or special cases. Avoid access keys where possible.</td></tr>
<tr><td><strong>IAM role</strong></td><td><strong>Temporary</strong> credentials via AWS STS</td><td>Workloads (EC2, Lambda, ECS), cross-account access, federation</td></tr>
</tbody></table>` },
          { type: "workflow", title: "What happens when you run an AWS CLI command", html: `
<p>Follow <code>aws s3 ls --profile academy-admin</code> from your keyboard to the audit log. The SDKs and the console follow the same path.</p>
<ol class="flow">
  <li><strong>Resolve configuration.</strong> The CLI reads the profile from <code>~/.aws/config</code> to find the Region, output format and credential source (here, an SSO session).</li>
  <li><strong>Resolve credentials.</strong> It walks the credential provider chain (command-line options → environment variables → config/credentials files → container role → instance role). For SSO it exchanges your cached SSO token for <strong>temporary role credentials</strong> (access key ID, secret key and session token) from AWS STS.</li>
  <li><strong>Build the request.</strong> The operation becomes an HTTPS request to the service endpoint, e.g. <code>https://s3.eu-west-1.amazonaws.com/</code>.</li>
  <li><strong>Sign it (SigV4).</strong> The CLI creates a canonical form of the request (method, path, query, selected headers, body hash), builds a "string to sign" with the timestamp and scope (<em>date/Region/service</em>), derives a signing key from your secret key and that scope, and adds an <code>Authorization</code> header with the signature. <strong>The secret key itself is never sent.</strong></li>
  <li><strong>Send over TLS.</strong> The request travels encrypted to the endpoint.</li>
  <li><strong>Authenticate.</strong> AWS recomputes the signature from its copy of the credentials. A mismatch, or a timestamp too far from AWS's clock (roughly five minutes), is rejected. Clock skew on your laptop really does cause errors.</li>
  <li><strong>Authorize.</strong> IAM evaluates every relevant policy: SCPs from AWS Organizations, resource-based policies, identity policies, permissions boundaries and session policies. The rule: <strong>an explicit Deny anywhere wins; otherwise an explicit Allow is required; otherwise it is denied by default</strong> (Track B covers the full logic).</li>
  <li><strong>Execute.</strong> The service performs the action (here, listing buckets) and returns JSON or XML. The CLI formats it (<code>--output</code>, <code>--query</code>).</li>
  <li><strong>Audit.</strong> CloudTrail records the call: who (the assumed-role ARN), what (<code>ListBuckets</code>), when, from which IP, and whether it succeeded. Management events appear in <em>Event history</em> for 90 days at no cost; a trail stores them in S3 for longer.</li>
  <li><strong>Retry if throttled.</strong> If the service returns a throttling or transient error, SDKs and the CLI retry automatically with <strong>exponential backoff and jitter</strong>.</li>
</ol>` },
          { type: "aws", title: "CLI configuration and credential resolution", html: `
<p>The CLI reads <code>~/.aws/config</code> (profiles, Region, SSO settings) and <code>~/.aws/credentials</code> (static keys, which you should avoid). It looks for credentials in a fixed <strong>order</strong>, roughly:</p>
<ol>
  <li>Command-line options (<code>--profile</code>)</li>
  <li>Environment variables (<code>AWS_ACCESS_KEY_ID</code>…, <code>AWS_PROFILE</code>)</li>
  <li>Shared config and credentials files (including SSO profiles)</li>
  <li>Container credentials (ECS task role)</li>
  <li>Instance profile credentials (EC2 role via the instance metadata service)</li>
</ol>
<p>This chain is why code that runs on EC2 with a role <strong>needs no keys at all</strong>: the SDK finds the role's temporary credentials automatically.</p>
<pre><code># ~/.aws/config written by "aws configure sso"
[profile academy-admin]
sso_session = academy
sso_account_id = 111122223333
sso_role_name = AdministratorAccess
region = eu-west-1
output = json

[sso-session academy]
sso_start_url = https://d-xxxxxxxxxx.awsapps.com/start
sso_region = eu-west-1
sso_registration_scopes = sso:account:access</code></pre>` },
          { type: "examples", html: `
<h3>Sample 1: debugging an AccessDenied error</h3>
<pre><code>$ aws s3 ls s3://finance-reports-2026 --profile dev-readonly
An error occurred (AccessDenied) when calling the ListObjectsV2 operation:
User: arn:aws:sts::111122223333:assumed-role/AWSReservedSSO_ReadOnly_ab12cd34/priya
is not authorized to perform: s3:ListBucket on resource: "arn:aws:s3:::finance-reports-2026"
with an explicit deny in a resource-based policy</code></pre>
<p>Read the message carefully: it names the <strong>caller</strong> (the assumed role), the <strong>action</strong> (<code>s3:ListBucket</code>, not the CLI command name), the <strong>resource</strong>, and the <strong>policy type</strong> that denied it (here, the bucket policy). Your troubleshooting order:</p>
<ol>
  <li><code>aws sts get-caller-identity</code>: am I who I think I am, in the right account?</li>
  <li>Which <em>IAM action</em> does the operation need? (CLI command ≠ action name.)</li>
  <li>Check for explicit denies: SCPs, the resource policy, permissions boundaries.</li>
  <li>Then check for the missing allow in the identity policy.</li>
</ol>
<h3>Sample 2: the same call from Python (boto3)</h3>
<pre><code>import boto3

session = boto3.Session(profile_name="academy-admin")   # on EC2/Lambda: boto3.Session() finds the role
ec2 = session.client("ec2", region_name="eu-west-1")

resp = ec2.describe_availability_zones()
for az in resp["AvailabilityZones"]:
    print(az["ZoneName"], az["ZoneId"], az["State"])

# Output:
# eu-west-1a euw1-az3 available
# eu-west-1b euw1-az1 available
# eu-west-1c euw1-az2 available</code></pre>
<p>Notice there are <strong>no keys in the code</strong>. Locally the profile supplies SSO credentials; deployed on AWS the same code finds the role's credentials through the provider chain.</p>
<h3>Sample 3: who changed it? Querying CloudTrail</h3>
<pre><code>$ aws cloudtrail lookup-events --max-results 2 \\
    --lookup-attributes AttributeKey=EventName,AttributeValue=AuthorizeSecurityGroupIngress \\
    --query "Events[].{Time:EventTime,User:Username,Event:EventName}" --output table
------------------------------------------------------------------------
|                             LookupEvents                             |
+----------------------------------+--------------------------+--------+
|              Event               |          Time            | User   |
+----------------------------------+--------------------------+--------+
|  AuthorizeSecurityGroupIngress   |  2026-10-05T14:02:11Z    | priya  |
|  AuthorizeSecurityGroupIngress   |  2026-10-01T09:47:30Z    | ci-bot |
+----------------------------------+--------------------------+--------+</code></pre>` },
          { type: "usecases", html: `
<table>
<thead><tr><th>Need</th><th>Best tool / identity</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Explore a new service</td><td>Console via IAM Identity Center</td><td>Visual, discoverable; temporary credentials</td></tr>
<tr><td>Quick one-off query with no local setup</td><td>AWS CloudShell</td><td>Pre-authenticated browser shell</td></tr>
<tr><td>Nightly report script on a laptop or server you manage</td><td>AWS CLI with an SSO profile (laptop) or an instance role (EC2)</td><td>No long-lived keys</td></tr>
<tr><td>Application calling DynamoDB</td><td>SDK + IAM role (instance profile, task role, execution role)</td><td>Credentials rotate automatically</td></tr>
<tr><td>CI/CD pipeline deploying infrastructure</td><td>IaC (CloudFormation/CDK/Terraform) + OIDC federation to an IAM role</td><td>Repeatable, reviewed changes; no stored secrets</td></tr>
<tr><td>On-premises server that must call AWS</td><td>IAM Roles Anywhere (X.509 certificates)</td><td>Temporary credentials outside AWS without access keys</td></tr>
</tbody></table>` },
          { type: "demo", title: "Guided practice", html: `
<pre><code># Who am I? (works with any credentials; the first thing to run when debugging)
aws sts get-caller-identity --profile academy-admin

# Output formats and JMESPath filtering
aws ec2 describe-regions --profile academy-admin --output table
aws ec2 describe-regions --profile academy-admin \\
  --query "Regions[?starts_with(RegionName, 'eu-')].RegionName" --output text

# Log in again when the SSO session expires
aws sso login --profile academy-admin</code></pre>
<p>Lab L01 walks you through creating this <code>academy-admin</code> profile.</p>` },
          { type: "casestudy", title: "Case study: Quillstack's leaked access key", html: `
<p><strong>The company.</strong> Quillstack (fictional), a 12-person SaaS start-up, gave each developer an IAM user with an access key "to make the CLI easy". One key with <code>AdministratorAccess</code> sat in a <code>.env</code> file.</p>
<p><strong>The incident.</strong> A developer pushed a demo project, including the <code>.env</code> file, to a public GitHub repository at 22:10. Automated scanners run by attackers found the key within minutes. By morning, hundreds of large GPU instances were mining cryptocurrency in Regions the company had never used. AWS detected the exposed key and emailed the account, but nobody read it overnight. The bill for 9 hours was about <strong>$14,000</strong>.</p>
<p><strong>Response.</strong> They deactivated and deleted the key, terminated the instances in every Region, reviewed CloudTrail to see exactly what the key had done (including whether it had created new IAM users or keys as a backdoor), and opened a support case.</p>
<p><strong>The redesign.</strong></p>
<table>
<thead><tr><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>IAM users with long-lived access keys</td><td><strong>IAM Identity Center</strong>; developers use <code>aws sso login</code> and get credentials that expire in hours</td></tr>
<tr><td>CI pipeline with stored keys</td><td>GitHub Actions <strong>OIDC federation</strong> to an IAM role; no secrets stored</td></tr>
<tr><td>Admin rights for everyone</td><td>Least-privilege permission sets; admin only via a break-glass role</td></tr>
<tr><td>All Regions usable</td><td>An <strong>SCP</strong> denies unused Regions</td></tr>
<tr><td>Nobody watching</td><td><strong>GuardDuty</strong> alerts (it flags crypto-mining and credential misuse), <strong>AWS Budgets</strong> and <strong>Cost Anomaly Detection</strong> to a chat channel</td></tr>
</tbody></table>
<p><strong>Lessons learned.</strong></p>
<ol>
  <li>The cheapest secret to protect is the one that <strong>doesn't exist</strong>: prefer temporary credentials everywhere.</li>
  <li>Any public leak of a key should be assumed <strong>exploited within minutes</strong>.</li>
  <li>Guardrails (SCPs, budgets, GuardDuty) limit the blast radius when a human mistake happens.</li>
</ol>` },
          { type: "exam", html: `
<ul>
  <li>An application on EC2, ECS or Lambda needs AWS access → an <strong>IAM role</strong> (instance profile / task role / execution role). <strong>Never</strong> embed access keys in code, AMIs or user data.</li>
  <li>Workforce users across many accounts → <strong>IAM Identity Center</strong> (optionally federated with an existing IdP or Active Directory).</li>
  <li>The root user should have MFA and no access keys. Use it only for root-only tasks.</li>
  <li>"Who did what, when?" → <strong>CloudTrail</strong> records API calls from the console, CLI, SDKs and IaC alike.</li>
</ul>` },
          { type: "architect", html: `
<ul>
  <li>Treat the console as <strong>read-mostly</strong> in production. Make changes through IaC and pipelines so they are reviewed, repeatable and reversible.</li>
  <li>Prefer <strong>short-lived credentials everywhere</strong>: Identity Center for people, roles for workloads, OIDC federation for CI/CD such as GitHub Actions (M38).</li>
  <li>Require <strong>IMDSv2</strong> on EC2 to protect instance-role credentials from server-side request forgery (SSRF) attacks (M13).</li>
</ul>` },
          { type: "summary", html: `
<ul>
  <li>Every AWS action is an authenticated, SigV4-signed HTTPS API call to a service endpoint, whatever tool makes it.</li>
  <li>Tools: console (explore), CLI (scripts), SDKs (apps), CloudShell (no setup), IaC (repeatable environments).</li>
  <li>Humans: IAM Identity Center with temporary credentials. Workloads: IAM roles. Root: MFA, no keys, rarely used.</li>
  <li>The credential provider chain lets the same code use SSO locally and a role on AWS, with no keys in code.</li>
  <li>Authorization: explicit Deny wins, then an explicit Allow is needed, otherwise default deny.</li>
  <li>CloudTrail records API calls (90 days of management events in Event history; create a trail for longer).</li>
  <li>Debug permissions with <code>aws sts get-caller-identity</code> first, then read the AccessDenied message.</li>
  <li>A leaked access key is exploited within minutes; avoid long-lived keys.</li>
</ul>` }
        ],
        check: [
          { id: "M01.04-k1", type: "single", domain: "D1", task: "1.2", level: 200,
            stem: "A Python application on EC2 uses boto3 to write to DynamoDB. How should it obtain credentials?",
            options: [
              { t: "Attach an IAM role to the instance. The SDK picks up temporary credentials automatically.", c: true, why: "The credential chain checks instance profile credentials, so no keys need to be stored." },
              { t: "Hard-code an IAM user's access keys in the source code.", c: false, why: "Keys in code leak through repositories and images." },
              { t: "Store root user keys in environment variables.", c: false, why: "Root keys are the highest-risk credentials and should not exist." },
              { t: "Put the keys in EC2 user data.", c: false, why: "User data is not a secret store." }
            ] },
          { id: "M01.04-k2", type: "single", domain: "D1", task: "1.1", level: 100,
            stem: "What is the recommended way for a team of engineers to access several AWS accounts?",
            options: [
              { t: "AWS IAM Identity Center with permission sets assigned per account", c: true, why: "Central workforce identity, temporary credentials, and one portal for all accounts." },
              { t: "One shared IAM user per account", c: false, why: "Shared identities remove accountability." },
              { t: "The root user of each account", c: false, why: "The root user is for root-only tasks." },
              { t: "IAM users with access keys in every account", c: false, why: "Long-lived keys and many identities mean high risk and high overhead." }
            ] },
          { id: "M01.04-k3", type: "single", domain: "D1", task: "1.1", level: 100,
            stem: "Which statement about AWS API access is TRUE?",
            options: [
              { t: "Console, CLI and SDK actions are all API calls and can be recorded by CloudTrail.", c: true, why: "Every interface uses the same signed APIs." },
              { t: "Console actions bypass IAM permissions.", c: false, why: "The console is subject to IAM like everything else." },
              { t: "The CLI can only use long-lived access keys.", c: false, why: "The CLI supports SSO, roles and temporary credentials." },
              { t: "CloudShell requires you to configure access keys.", c: false, why: "CloudShell is pre-authenticated as your console identity." }
            ] },
          { id: "M01.04-k4", type: "single", domain: "D1", task: "1.2", level: 200,
            stem: "A developer's laptop has an SSO profile configured, but a script still runs as an old IAM user that was supposed to be retired. The script is started with no <code>--profile</code> option. What is the MOST likely cause?",
            options: [
              { t: "The <code>AWS_ACCESS_KEY_ID</code> and <code>AWS_SECRET_ACCESS_KEY</code> environment variables are still set in the shell", c: true, why: "Environment variables come before the shared config files in the credential provider chain, so they win over the SSO profile." },
              { t: "SSO profiles cannot be used by scripts", c: false, why: "They can; the CLI and SDKs read SSO profiles like any other." },
              { t: "CloudTrail is caching the old identity", c: false, why: "CloudTrail records calls; it plays no part in choosing credentials." },
              { t: "The IAM user has a higher priority in IAM", c: false, why: "IAM has no priority between identities; the client chooses which credentials to sign with." }
            ] }
        ],
        cards: ["fc-M01-12", "fc-M01-13", "fc-M01-14", "fc-M01-27", "fc-M01-28"],
        references: ["AWS CLI User Guide: <em>Configuring IAM Identity Center authentication</em>; <em>Configuration and credential file settings</em>", "IAM User Guide: <em>Security best practices in IAM</em>", "<em>Hands-On AWS CDK</em> ch.1 \"Set Up Your Local Development Environment\" (PDF p32)"]
      },

      // ================================================================ M01.05
      {
        id: "M01.05", title: "Pricing fundamentals", level: 200, minutes: 50,
        objectives: [
          "Identify the three main cost drivers and the main data-transfer pricing rules",
          "Compare the purchasing models at a high level",
          "Choose the right cost tool for estimating, alerting, analysing and allocating"
        ],
        sections: [
          { type: "why", html: `
<p>Cost optimisation is 20% of the exam, and most cost questions hide in the architecture: where traffic flows, which storage tier data sits in, how compute is bought. The fastest way to an unexpected bill is to not know that <strong>data transfer between AZs and to the internet is charged</strong>.</p>` },
          { type: "concept", html: `
<h3>Pricing principles</h3>
<ul>
  <li><strong>Pay as you go:</strong> no upfront commitment (On-Demand).</li>
  <li><strong>Save when you commit:</strong> 1- or 3-year commitments (Savings Plans, Reserved Instances).</li>
  <li><strong>Pay less by using more:</strong> tiered volume pricing (e.g. S3 storage, data transfer out).</li>
  <li><strong>Save with spare capacity:</strong> Spot Instances for interruptible work.</li>
</ul>
<h3>The three main cost drivers</h3>
<ol>
  <li><strong>Compute:</strong> per second or hour (EC2: On-Demand Linux and Windows instances bill per second with a 60-second minimum), per request + GB-second (Lambda), per vCPU + GB per second (Fargate).</li>
  <li><strong>Storage:</strong> per GB-month, varying with tier (S3 classes, EBS volume type), plus requests and retrievals.</li>
  <li><strong>Data transfer:</strong> mostly <em>outbound</em> and <em>cross-boundary</em> traffic. The rules are below.</li>
</ol>
<h3>Data transfer rules of thumb</h3>
<table>
<thead><tr><th>Traffic</th><th>Charged?</th></tr></thead>
<tbody>
<tr><td>Internet → AWS (inbound)</td><td><strong>Free</strong></td></tr>
<tr><td>AWS → Internet (outbound)</td><td><strong>Charged</strong> per GB, tiered. A monthly free allowance applies across services.</td></tr>
<tr><td>Within the same AZ, using private IPs</td><td>Free</td></tr>
<tr><td>Between AZs in the same Region</td><td><strong>Charged in each direction</strong> (commonly $0.01/GB each way)</td></tr>
<tr><td>Between Regions</td><td><strong>Charged</strong> (per GB, from the source Region)</td></tr>
<tr><td>Through a NAT gateway</td><td>Hourly charge <strong>+ per-GB processing</strong>, on top of any transfer charges</td></tr>
<tr><td>EC2 → S3 or DynamoDB in the same Region via a <strong>gateway VPC endpoint</strong></td><td>No endpoint charge and no NAT processing</td></tr>
<tr><td>CloudFront → internet</td><td>Charged, often cheaper than serving direct from origin. Origin → CloudFront transfer from AWS origins is free.</td></tr>
</tbody></table>
<p class="muted small">Exact prices vary by Region and change over time. Always check the pricing pages or the Pricing Calculator.</p>` },
          { type: "workflow", title: "How your bill is built, and how to estimate one", html: `
<h3>A. From usage to invoice</h3>
<ol class="flow">
  <li><strong>Metering.</strong> Every service emits usage records: instance-seconds, GB-months stored, requests, GB transferred, LCUs, and so on, each tagged with Region, usage type and your resource tags.</li>
  <li><strong>Rating.</strong> Each usage type is multiplied by its price for that Region. Tiered prices apply as volume grows within the month (e.g. data transfer out gets cheaper per GB after the first tiers).</li>
  <li><strong>Discounts.</strong> Free Tier allowances, Savings Plans and Reserved Instances are applied to eligible usage. Savings Plans apply to the usage with the highest discount first.</li>
  <li><strong>Consolidation.</strong> In AWS Organizations, usage across all accounts is combined, so volume tiers and commitment discounts are shared across the organization.</li>
  <li><strong>Credits and tax.</strong> Promotional credits and taxes are applied.</li>
  <li><strong>Invoice.</strong> The month closes and the invoice is issued early the next month. Estimated charges are visible during the month in Billing, Cost Explorer and the Cost and Usage Report.</li>
</ol>
<h3>B. The estimation workflow for a new design</h3>
<ol>
  <li><strong>List every component</strong> from the architecture diagram, including the "invisible" ones: NAT gateways, load balancers, public IPv4 addresses, log storage, backups.</li>
  <li><strong>Write down usage assumptions</strong>: hours, requests per month, GB stored, GB transferred out, GB between AZs.</li>
  <li><strong>Build it in the Pricing Calculator</strong> for the chosen Region and save the shareable link.</li>
  <li><strong>Add data transfer explicitly</strong>; it is the most commonly forgotten line.</li>
  <li><strong>Compare purchasing options</strong> for the steady part (Savings Plans) and the variable part (On-Demand, Spot).</li>
  <li><strong>Add a contingency</strong> and set an <strong>AWS Budget</strong> at that figure before go-live.</li>
  <li><strong>Revisit after 1 month</strong> with Cost Explorer: compare actual vs estimate and fix the biggest gap.</li>
</ol>` },
          { type: "aws", title: "Purchasing models and cost tools", html: `
<table>
<thead><tr><th>Model</th><th>Discount vs On-Demand</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>On-Demand</td><td>–</td><td>Short-term, unpredictable, new workloads</td></tr>
<tr><td>Savings Plans (Compute / EC2 Instance)</td><td>Significant, for a $/hour commitment over 1–3 years</td><td>Steady usage. Compute SP also covers Fargate and Lambda.</td></tr>
<tr><td>Reserved Instances</td><td>Significant, for a 1–3 year commitment</td><td>Steady EC2 use, and RDS/ElastiCache/Redshift reservations</td></tr>
<tr><td>Spot Instances</td><td>Up to ~90%</td><td>Fault-tolerant, interruptible work (batch, CI, big data)</td></tr>
<tr><td>Dedicated Hosts</td><td>Premium</td><td>Bring-your-own-licence per socket or core; compliance</td></tr>
</tbody></table>
<p>The details come in M13 and M34. For now, learn the pattern: <em>steady → commit; spiky → On-Demand/serverless; interruptible → Spot</em>.</p>
<h3>Cost tools: which does what?</h3>
<table>
<thead><tr><th>Need</th><th>Tool</th></tr></thead>
<tbody>
<tr><td>Estimate before building</td><td><strong>AWS Pricing Calculator</strong></td></tr>
<tr><td>Alert when actual or forecast spend crosses a threshold (and optionally take action)</td><td><strong>AWS Budgets</strong></td></tr>
<tr><td>Visualise and analyse past spend, trends, forecasts, RI/SP recommendations</td><td><strong>AWS Cost Explorer</strong></td></tr>
<tr><td>Most detailed line-item billing data for analysis (e.g. in Athena)</td><td><strong>AWS Cost and Usage Report</strong> (CUR / Data Exports)</td></tr>
<tr><td>Attribute cost to teams or projects</td><td><strong>Cost allocation tags</strong> (activate them in Billing)</td></tr>
<tr><td>One bill and volume discounts across accounts</td><td><strong>AWS Organizations consolidated billing</strong></td></tr>
<tr><td>Rightsizing recommendations</td><td>AWS Compute Optimizer, Trusted Advisor</td></tr>
</tbody></table>
<h3>Free Tier</h3>
<p>AWS changed its Free Tier for <strong>new accounts created on or after 15 July 2025</strong> to a <strong>credit-based model</strong>: sign-up credits plus extra credits for completing onboarding activities, with a choice of a time-limited <em>free plan</em> or a <em>paid plan</em>. Many services also have <em>always-free</em> allowances (e.g. a monthly quota of Lambda requests). Read the current terms on the Free Tier page. Whatever your plan, <strong>set up a Budget in Lab L01</strong>.</p>
<div class="callout warn"><strong>Hidden cost to know:</strong> since February 2024, every <strong>public IPv4 address</strong> is charged per hour, whether in use or idle. Keep instances in private subnets when they don't need to be reachable from the internet.</div>` },
          { type: "examples", html: `
<h3>Worked example: monthly estimate for a small three-tier web app</h3>
<p>Illustrative US East prices (round, check current pricing): 730 hours per month. Two web instances in private subnets, an ALB, RDS PostgreSQL Multi-AZ, one NAT gateway for outbound patches and API calls.</p>
<table>
<thead><tr><th>Component</th><th>Calculation</th><th>$/month</th></tr></thead>
<tbody>
<tr><td>2 × EC2 t4g.small</td><td>2 × 730 h × $0.0168</td><td>24.53</td></tr>
<tr><td>Application Load Balancer</td><td>730 h × $0.0225 + ~1 LCU × 730 h × $0.008</td><td>22.27</td></tr>
<tr><td>RDS db.t4g.micro, Multi-AZ</td><td>730 h × $0.032 (twice single-AZ)</td><td>23.36</td></tr>
<tr><td>RDS storage, gp3 20 GB Multi-AZ</td><td>20 GB × $0.23</td><td>4.60</td></tr>
<tr><td>NAT gateway</td><td>730 h × $0.045 + 20 GB processed × $0.045</td><td>33.75</td></tr>
<tr><td>Public IPv4 (2 for the ALB, 1 for the NAT gateway)</td><td>3 × 730 h × $0.005</td><td>10.95</td></tr>
<tr><td>Data transfer out to internet</td><td>50 GB, inside the 100 GB/month free allowance</td><td>0.00</td></tr>
<tr><td>Cross-AZ traffic web ↔ DB</td><td>30 GB × $0.01 × 2 directions</td><td>0.60</td></tr>
<tr><td><strong>Total</strong></td><td></td><td><strong>≈ 120</strong></td></tr>
</tbody></table>
<p><strong>What the numbers teach:</strong> the two web servers are only about 20% of the bill. The NAT gateway costs more than the servers, and the "plumbing" (ALB, NAT, IPv4) is over half of the total. At small scale, architecture choices such as using VPC endpoints instead of NAT, or a serverless design, change the bill more than instance sizing does.</p>
<h3>Worked example: data-transfer math</h3>
<table>
<thead><tr><th>Flow (per month)</th><th>Rule</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>500 GB uploaded by users to S3</td><td>Inbound is free</td><td>$0</td></tr>
<tr><td>2 TB copied to another Region for DR</td><td>Inter-Region, about $0.02/GB from the source</td><td>2,048 × 0.02 ≈ $41</td></tr>
<tr><td>5 TB read by EC2 from S3 through a NAT gateway</td><td>NAT processing $0.045/GB</td><td>5,120 × 0.045 ≈ $230</td></tr>
<tr><td>Same 5 TB through an S3 gateway endpoint</td><td>No charge for the endpoint or same-Region S3 transfer</td><td>$0</td></tr>
</tbody></table>` },
          { type: "usecases", html: `
<table>
<thead><tr><th>Question you need answered</th><th>Tool</th><th>Example</th></tr></thead>
<tbody>
<tr><td>"What will this new design cost?"</td><td>Pricing Calculator</td><td>Shareable estimate attached to the ADR</td></tr>
<tr><td>"Tell me before we overspend"</td><td>AWS Budgets (with actions)</td><td>Email/Slack at 80% forecast; apply an SCP to stop new launches at 100%</td></tr>
<tr><td>"Something odd happened to spend yesterday"</td><td>Cost Anomaly Detection</td><td>Alert when a service's daily spend jumps beyond its normal pattern</td></tr>
<tr><td>"Which team spent what last quarter?"</td><td>Cost Explorer grouped by cost allocation tag</td><td>Monthly chargeback report per <code>CostCenter</code></td></tr>
<tr><td>"Give finance every line item"</td><td>Cost and Usage Report / Data Exports + Athena</td><td>Custom unit-cost dashboard</td></tr>
<tr><td>"Are we oversized?"</td><td>Compute Optimizer, Trusted Advisor</td><td>Right-size underused instances</td></tr>
</tbody></table>` },
          { type: "demo", title: "Guided practice: estimate a small web app", html: `
<ol>
  <li>Open the <strong>AWS Pricing Calculator</strong> (calculator.aws), then <em>Create estimate</em>.</li>
  <li>Add <strong>Amazon EC2</strong>: 2 × <code>t4g.small</code> Linux, On-Demand, 730 hours/month, in your Region.</li>
  <li>Add an <strong>Application Load Balancer</strong> with modest traffic.</li>
  <li>Add <strong>Amazon RDS for PostgreSQL</strong>: <code>db.t4g.micro</code>, Multi-AZ, 20 GB gp3.</li>
  <li>Add <strong>data transfer</strong>: 50 GB/month out to the internet.</li>
  <li>Now switch EC2 to a <strong>1-year Compute Savings Plan</strong> and compare the monthly total.</li>
</ol>
<p>Note which line items dominate. For small apps, the load balancer and Multi-AZ database often cost more than the instances.</p>` },
          { type: "casestudy", title: "Case study: LedgerLoop's bill triples", html: `
<p><strong>The company.</strong> LedgerLoop (fictional) runs an accounting SaaS. Its monthly AWS bill was a steady $3,000 until it launched a nightly analytics job. Next month the bill was <strong>$9,100</strong>.</p>
<p><strong>Investigation.</strong> Cost Explorer, grouped by <em>usage type</em>, showed the jump was not in compute at all:</p>
<table>
<thead><tr><th>Usage type</th><th>Increase</th><th>Cause</th></tr></thead>
<tbody>
<tr><td>NatGateway-Bytes</td><td>+$2,750</td><td>The ETL instances in private subnets read ~60 TB/month from S3 <em>through the NAT gateway</em></td></tr>
<tr><td>DataTransfer-Regional-Bytes (cross-AZ)</td><td>+$1,900</td><td>ETL workers in AZ a talked to a database in AZ b; spark shuffles crossed AZs</td></tr>
<tr><td>EC2 instance hours</td><td>+$1,450</td><td>Workers sized for a peak that only lasted 40 minutes</td></tr>
</tbody></table>
<p><strong>Fixes.</strong></p>
<ol>
  <li>Added an <strong>S3 gateway VPC endpoint</strong> to the private route tables (free). The NAT processing charge for S3 traffic disappeared.</li>
  <li>Ran the batch job's workers and the read replica they queried in the <strong>same AZ</strong>. A short-lived batch job does not need multi-AZ spread; the production database stayed Multi-AZ.</li>
  <li>Moved the workers to <strong>Spot Instances</strong> with checkpointing, since the job tolerated interruption.</li>
  <li>Activated <strong>cost allocation tags</strong> (<code>Workload=analytics</code>), a Budget for the analytics workload, and <strong>Cost Anomaly Detection</strong>.</li>
</ol>
<p><strong>Result.</strong> The bill settled at about $3,700, so the new feature now costs about $700 a month instead of $6,100.</p>
<p><strong>Lessons learned.</strong> Data transfer and NAT processing are invisible on architecture diagrams but very visible on invoices. Group by <em>usage type</em> when investigating, and add cost guardrails <em>before</em> launch.</p>` },
          { type: "exam", html: `
<ul>
  <li>"Alert when spend exceeds…" → <strong>AWS Budgets</strong>. "Analyse spend trends" → <strong>Cost Explorer</strong>. "Most granular billing data" → <strong>Cost and Usage Report</strong>. "Charge back to departments" → <strong>cost allocation tags</strong> (+ Organizations).</li>
  <li>"Reduce NAT gateway cost for S3/DynamoDB traffic" → <strong>gateway VPC endpoint</strong>.</li>
  <li>"Reduce data transfer out cost for global static content" → <strong>CloudFront</strong>.</li>
  <li>Watch for designs that move large volumes <strong>across AZs or Regions</strong> without need.</li>
</ul>` },
          { type: "architect", html: `
<ul>
  <li><strong>Tag from day one</strong> (<code>Project</code>, <code>Environment</code>, <code>Owner</code>, <code>CostCenter</code>) and enforce the tags with tag policies or SCPs. Retrofitting tags is painful.</li>
  <li>Track <strong>unit cost</strong> (cost per order, per active user, per GB processed), not just the total bill. Growth is fine while the unit cost falls.</li>
  <li>Put a price on every architecture alternative in your ADRs. "Highly available" has a cost you can quantify.</li>
</ul>` },
          { type: "summary", html: `
<ul>
  <li>Main cost drivers: compute, storage, data transfer.</li>
  <li>Inbound data is free. Outbound to the internet, cross-AZ (each direction), cross-Region and NAT processing are charged.</li>
  <li>A gateway VPC endpoint removes NAT costs for S3/DynamoDB traffic; CloudFront reduces and speeds up internet egress.</li>
  <li>Purchasing: steady → Savings Plans/RIs, spiky → On-Demand/serverless, interruptible → Spot.</li>
  <li>Tools: Pricing Calculator (estimate), Budgets (alert/act), Cost Explorer (analyse), CUR (line items), Anomaly Detection (surprises), tags (allocate).</li>
  <li>Every public IPv4 address is charged hourly.</li>
  <li>At small scale, "plumbing" (NAT, load balancers, IPs) can cost more than servers.</li>
  <li>Estimate before you build; set a Budget before go-live; compare actual vs estimate after one month.</li>
</ul>` }
        ],
        check: [
          { id: "M01.05-k1", type: "single", domain: "D4", task: "4.4", level: 200,
            stem: "Which data transfer is FREE?",
            options: [
              { t: "Data transferred into AWS from the internet", c: true, why: "Inbound data transfer is free." },
              { t: "Data transferred between two AZs in the same Region", c: false, why: "Cross-AZ transfer is charged in each direction." },
              { t: "Data transferred from AWS to the internet beyond the free allowance", c: false, why: "Outbound transfer is charged." },
              { t: "Data transferred between Regions", c: false, why: "Inter-Region transfer is charged." }
            ] },
          { id: "M01.05-k2", type: "single", domain: "D4", task: "4.2", level: 200,
            stem: "Finance wants an email when the forecast monthly spend for the account will exceed $1,000. Which service should be used?",
            options: [
              { t: "AWS Budgets", c: true, why: "Budgets alert on actual or forecast spend thresholds, and can trigger actions." },
              { t: "AWS Cost Explorer", c: false, why: "Cost Explorer is for analysis and visualisation, not threshold alerts." },
              { t: "AWS Pricing Calculator", c: false, why: "It estimates the cost of planned architectures." },
              { t: "AWS Cost and Usage Report", c: false, why: "It provides detailed billing data, not alerts." }
            ] },
          { id: "M01.05-k3", type: "single", domain: "D4", task: "4.1", level: 200,
            stem: "A company must report the AWS costs of each of its 12 product teams, which share accounts. What should it implement FIRST?",
            options: [
              { t: "Tag resources with a team tag and activate it as a cost allocation tag.", c: true, why: "Activated cost allocation tags let Cost Explorer and CUR break down cost by team." },
              { t: "Buy Savings Plans for each team.", c: false, why: "Savings Plans reduce cost but don't attribute it." },
              { t: "Enable AWS Shield Advanced.", c: false, why: "Shield Advanced is DDoS protection, unrelated." },
              { t: "Use a single AWS Budget.", c: false, why: "A single budget doesn't attribute cost to teams." }
            ] },
          { id: "M01.05-k4", type: "single", domain: "D4", task: "4.2", level: 200,
            stem: "Which workload is the BEST fit for Spot Instances?",
            options: [
              { t: "A fault-tolerant image-rendering job that can checkpoint and restart", c: true, why: "Interruptible, flexible work is the ideal fit for Spot." },
              { t: "A single-instance production database", c: false, why: "An interruption would cause an outage." },
              { t: "A steady 24/7 web tier with a fixed baseline", c: false, why: "Better covered by Savings Plans or RIs, with Spot only for extra capacity." },
              { t: "A licensed application that requires dedicated physical cores", c: false, why: "That needs Dedicated Hosts." }
            ] },
          { id: "M01.05-k5", type: "single", domain: "D4", task: "4.2", level: 200,
            stem: "A company runs steady 24×7 workloads on EC2, plus containers on AWS Fargate and functions on AWS Lambda. It wants ONE commitment-based discount that covers all three and lets it change instance families and Regions freely. What should it buy?",
            options: [
              { t: "A Compute Savings Plan", c: true, why: "Compute Savings Plans apply to EC2 (any family, size, Region, OS), Fargate and Lambda usage." },
              { t: "An EC2 Instance Savings Plan", c: false, why: "It covers EC2 only, and is tied to one instance family in one Region." },
              { t: "Standard Reserved Instances", c: false, why: "They apply to EC2 only (with fixed attributes) and do not cover Fargate or Lambda." },
              { t: "Spot Instances", c: false, why: "Spot is not a commitment and is interruptible; it does not cover Lambda." }
            ] }
        ],
        cards: ["fc-M01-15", "fc-M01-16", "fc-M01-17", "fc-M01-18", "fc-M01-29", "fc-M01-30"],
        references: ["AWS whitepaper: <em>How AWS Pricing Works</em>", "AWS: <em>Overview of Data Transfer Costs for Common Architectures</em> (Architecture Blog)", "AWS Free Tier page (current terms)", "Exam guide: Domain 4 tasks 4.1–4.4"]
      },

      // ================================================================ M01.06
      {
        id: "M01.06", title: "Well-Architected Framework intro", level: 200, minutes: 35,
        objectives: [
          "Name the six pillars of the AWS Well-Architected Framework and the core idea of each",
          "Relate the pillars to the four SAA-C03 domains",
          "Recall the general design principles"
        ],
        sections: [
          { type: "why", html: `
<p>The exam guide's first sentence says it validates your ability to design solutions <strong>"based on the AWS Well-Architected Framework"</strong>. The framework is the lens behind every question: when two answers both work, the one that better follows its principles wins.</p>` },
          { type: "concept", title: "The six pillars", html: `
<table>
<thead><tr><th>Pillar</th><th>Core question</th><th>Example practices</th><th>Exam domain</th></tr></thead>
<tbody>
<tr><td><strong>Operational Excellence</strong></td><td>Can we run, observe and improve the workload?</td><td>Infrastructure as Code, small reversible changes, runbooks, learning from failures</td><td>Indirect (automation, monitoring)</td></tr>
<tr><td><strong>Security</strong></td><td>Are data and systems protected?</td><td>Strong identity foundation, traceability, security at every layer, encryption, preparing for events</td><td>Domain 1 (30%)</td></tr>
<tr><td><strong>Reliability</strong></td><td>Does it work correctly and recover from failure?</td><td>Automatic recovery, horizontal scaling, testing recovery procedures, stop guessing capacity</td><td>Domain 2 (26%)</td></tr>
<tr><td><strong>Performance Efficiency</strong></td><td>Are we using resources efficiently as demand changes?</td><td>Managed or advanced technologies, going global in minutes, serverless, experimenting often</td><td>Domain 3 (24%)</td></tr>
<tr><td><strong>Cost Optimization</strong></td><td>Are we delivering value at the lowest price?</td><td>Cloud financial management, consumption model, measuring efficiency, avoiding undifferentiated heavy lifting</td><td>Domain 4 (20%)</td></tr>
<tr><td><strong>Sustainability</strong></td><td>Are we minimising environmental impact?</td><td>Maximise utilisation, managed services, efficient hardware (e.g. Graviton), data lifecycle</td><td>Indirect (right-sizing, managed services)</td></tr>
</tbody></table>` },
          { type: "workflow", title: "How a Well-Architected review runs", html: `
<ol class="flow">
  <li><strong>Define the workload and scope.</strong> A workload is a set of components that together deliver business value (e.g. "checkout service, production"). Name an owner, the environment and the business goals.</li>
  <li><strong>Gather the right people.</strong> The architect, engineers who run it and a business stakeholder. A review is a conversation, not an audit.</li>
  <li><strong>Answer the pillar questions</strong> in the Well-Architected Tool (e.g. "How do you back up data?", "How do you control access?"). Each question has best-practice choices; tick the ones you actually do.</li>
  <li><strong>Identify risks.</strong> The tool marks <strong>high-risk issues (HRIs)</strong> and <strong>medium-risk issues (MRIs)</strong> where best practices are missing.</li>
  <li><strong>Prioritise.</strong> Rank risks by business impact and effort. Some risks are accepted deliberately; record why.</li>
  <li><strong>Build the improvement plan.</strong> Turn the top risks into backlog items with owners and dates.</li>
  <li><strong>Save a milestone</strong> to capture the state, implement the fixes, then review again (e.g. every 6–12 months or after major changes) and compare milestones.</li>
</ol>` },
          { type: "aws", title: "General design principles and tools", html: `
<ol>
  <li><strong>Stop guessing your capacity needs:</strong> scale with demand.</li>
  <li><strong>Test systems at production scale:</strong> create production-like environments on demand, then delete them.</li>
  <li><strong>Automate with architectural experimentation in mind:</strong> IaC makes changes cheap and repeatable.</li>
  <li><strong>Consider evolutionary architectures:</strong> designs change as requirements change.</li>
  <li><strong>Drive architectures using data:</strong> measure, then decide.</li>
  <li><strong>Improve through game days:</strong> simulate failures and events regularly.</li>
</ol>
<ul>
  <li><strong>AWS Well-Architected Tool</strong> (in the console): answer the pillar questions for a workload, record risks and generate an improvement plan.</li>
  <li><strong>Lenses</strong> extend the framework for specific domains (e.g. Serverless, SaaS, Data Analytics).</li>
</ul>` },
          { type: "examples", html: `
<h3>Worked example: review findings for a two-tier web app</h3>
<p>The workload: one EC2 instance running a web app, a single-AZ RDS MySQL database, deployments by SSH, an IAM user with access keys for the app.</p>
<table>
<thead><tr><th>Finding</th><th>Pillar</th><th>Risk</th><th>Recommended fix</th></tr></thead>
<tbody>
<tr><td>Single EC2 instance, single-AZ database</td><td>Reliability</td><td>High</td><td>ALB + Auto Scaling group across 2–3 AZs; RDS Multi-AZ</td></tr>
<tr><td>Backups exist but have never been restored</td><td>Reliability</td><td>High</td><td>Schedule and test restores; document RTO/RPO</td></tr>
<tr><td>App uses an IAM user's access keys</td><td>Security</td><td>High</td><td>IAM role via an instance profile</td></tr>
<tr><td>Deployments by hand over SSH</td><td>Operational Excellence</td><td>Medium</td><td>CI/CD pipeline and IaC; Session Manager instead of SSH</td></tr>
<tr><td>Instance 10% utilised, 24×7 On-Demand</td><td>Cost Optimization</td><td>Medium</td><td>Right-size; Savings Plan for the baseline</td></tr>
<tr><td>Older x86 instance family</td><td>Sustainability / Performance</td><td>Low</td><td>Test Graviton-based instances</td></tr>
<tr><td>No alarms; outages reported by customers</td><td>Operational Excellence</td><td>High</td><td>CloudWatch alarms on errors and latency, with notifications</td></tr>
</tbody></table>
<p>Notice how each finding maps to an exam-style answer: the review questions and SAA-C03 scenarios test the same best practices.</p>` },
          { type: "usecases", html: `
<table>
<thead><tr><th>Situation</th><th>Use</th><th>Outcome</th></tr></thead>
<tbody>
<tr><td>Before a major launch</td><td>Full review across all six pillars</td><td>HRIs fixed before customers find them</td></tr>
<tr><td>Serverless application</td><td>Serverless Applications Lens</td><td>Questions specific to Lambda, API Gateway, event sources</td></tr>
<tr><td>Multi-tenant SaaS product</td><td>SaaS Lens</td><td>Tenant isolation, noisy-neighbour and onboarding practices</td></tr>
<tr><td>Data platform</td><td>Data Analytics Lens</td><td>Data lake governance and pipeline reliability</td></tr>
<tr><td>Company-specific standards</td><td>Custom lenses in the WA Tool</td><td>Your own questions and best practices tracked like AWS's</td></tr>
<tr><td>Architecture interview or exam question</td><td>Pillars as tie-breakers</td><td>Choose the option that is automated, managed and right-sized</td></tr>
</tbody></table>` },
          { type: "casestudy", title: "Case study: Fernhill Media's first review", html: `
<p><strong>The company.</strong> Fernhill Media (fictional) runs a subscription video-on-demand platform. After two outages in one quarter, the CTO asked for a Well-Architected review of the "playback API".</p>
<p><strong>The review.</strong> Five people spent half a day answering the questions in the WA Tool. The result: <strong>11 high-risk issues</strong> and 17 medium-risk issues. The top ones:</p>
<ul>
  <li><strong>Reliability:</strong> the Redis cache ran on one node; when it failed, every request hit the database and the database collapsed. This explained both outages.</li>
  <li><strong>Operational Excellence:</strong> no runbooks; recovery depended on one engineer.</li>
  <li><strong>Security:</strong> a database password was stored in plain text in a configuration file in the repository.</li>
  <li><strong>Cost:</strong> the dev and test environments ran 24×7 at production size.</li>
</ul>
<p><strong>Improvement plan (first 90 days).</strong></p>
<ol>
  <li>ElastiCache with a replica and automatic failover in another AZ; request coalescing so a cache miss storm can't overwhelm the database.</li>
  <li>Secrets moved to <strong>AWS Secrets Manager</strong> with rotation; the old password rotated immediately.</li>
  <li>Runbooks for the five most common alarms, plus a quarterly game day.</li>
  <li>Dev/test scaled down and stopped outside office hours.</li>
</ol>
<p><strong>Result.</strong> At the second review six months later, the HRI count was 2 (both consciously accepted and documented). No outage in that period; non-production spend fell by about 60%.</p>
<p><strong>Lessons learned.</strong> The review's value was not the report but the <strong>prioritised plan</strong> and the habit of repeating it. Trade-offs that were accepted were written down, so nobody had to rediscover why.</p>` },
          { type: "exam", html: `
<p>Use the pillars as tie-breakers:</p>
<ul>
  <li>Two answers are both secure, but one uses a managed service → <strong>Operational Excellence / Cost</strong> favours the managed one.</li>
  <li>One answer automates recovery and the other needs a human → <strong>Reliability</strong> favours automation.</li>
  <li>One answer is over-provisioned "just in case" → it violates "stop guessing capacity".</li>
</ul>` },
          { type: "architect", html: `
<p>Real designs <strong>trade pillars against each other</strong>. Multi-Region active-active improves reliability but raises cost and operational complexity. Name the trade-off explicitly in an ADR, and revisit it when the business context changes. You will run a full Well-Architected review in M43 and in the capstones.</p>` },
          { type: "summary", html: `
<ul>
  <li>Six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.</li>
  <li>Exam mapping: Security → D1, Reliability → D2, Performance → D3, Cost → D4.</li>
  <li>General principles: stop guessing capacity, test at production scale, automate, evolve, use data, run game days.</li>
  <li>The WA Tool records answers, flags high- and medium-risk issues and builds an improvement plan; milestones track progress.</li>
  <li>Lenses (Serverless, SaaS, Data Analytics, custom) add domain-specific questions.</li>
  <li>Pillars trade off against each other; document the choice in an ADR.</li>
  <li>When two exam answers both work, prefer the one that is managed, automated and right-sized.</li>
</ul>` }
        ],
        check: [
          { id: "M01.06-k1", type: "single", domain: "D2", task: "2.2", level: 200,
            stem: "Which Well-Architected pillar focuses on a workload's ability to recover from failures and meet demand?",
            options: [
              { t: "Reliability", c: true, why: "Reliability covers recovery, fault isolation and scaling to demand." },
              { t: "Performance Efficiency", c: false, why: "It is about using resources efficiently." },
              { t: "Operational Excellence", c: false, why: "It is about running and improving operations." },
              { t: "Sustainability", c: false, why: "It is about environmental impact." }
            ] },
          { id: "M01.06-k2", type: "single", domain: "D2", task: "2.2", level: 200,
            stem: "\"Improve through game days\" is a general design principle. What does it mean?",
            options: [
              { t: "Regularly simulate failures and events to test procedures and find weaknesses", c: true, why: "Game days rehearse failure handling before real incidents happen." },
              { t: "Run load tests only before major releases", c: false, why: "Game days are about event and failure simulation, done regularly." },
              { t: "Gamify developer productivity", c: false, why: "This is not the intended meaning." },
              { t: "Schedule maintenance on weekends", c: false, why: "Unrelated." }
            ] },
          { id: "M01.06-k3", type: "single", domain: "D4", task: "4.2", level: 200,
            stem: "Which pillar was added most recently and encourages maximising utilisation and using efficient hardware such as Graviton?",
            options: [
              { t: "Sustainability", c: true, why: "Sustainability was added as the sixth pillar." },
              { t: "Cost Optimization", c: false, why: "An original pillar, though it overlaps with utilisation." },
              { t: "Security", c: false, why: "An original pillar." },
              { t: "Reliability", c: false, why: "An original pillar." }
            ] },
          { id: "M01.06-k4", type: "single", domain: "D2", task: "2.2", level: 200,
            stem: "A team has just completed a review in the AWS Well-Architected Tool. What should it do with the high-risk issues (HRIs) the tool identified?",
            options: [
              { t: "Prioritise them into an improvement plan, implement fixes, and save milestones to track progress over time", c: true, why: "This is the intended review loop: the plan and repeated reviews deliver the value." },
              { t: "Submit them to AWS Support, which fixes them in the account", c: false, why: "The customer owns the workload and its improvements; AWS doesn't change your architecture for you." },
              { t: "Ignore them unless the workload is in production", c: false, why: "Risks found early are cheapest to fix; ignoring them defeats the purpose." },
              { t: "Delete the workload from the tool to clear the risks", c: false, why: "That hides the risks without fixing them." }
            ] }
        ],
        cards: ["fc-M01-19", "fc-M01-20", "fc-M01-31", "fc-M01-32"],
        references: ["AWS Well-Architected Framework whitepaper", "AWS Well-Architected Tool documentation", "<em>Hands-On AWS CDK</em> ch.14 \"Building Well-Architected Applications\" (PDF p405)"]
      }
    ],

    // ================================================================== LAB L01
    labs: [
      {
        id: "L01", title: "Secure your AWS account foundation", level: 100, duration: "60–90 min", cost: "$0 (all free features)",
        objective: `<p>Turn a brand-new (or existing personal) AWS account into a safe learning environment: protect the root user, add cost guardrails, create a day-to-day admin identity with <strong>IAM Identity Center</strong>, and configure the <strong>AWS CLI with short-lived SSO credentials</strong>. Every later lab assumes this setup.</p>`,
        warning: `⚠️ Use an account you control and are allowed to use for learning. Do not run labs in a production or employer account without permission.`,
        diagram: `<ul><li>Root user: MFA on, no access keys, locked away</li><li>AWS Budget: $10/month, with email alerts</li><li>IAM Identity Center: group <code>Admins</code> → permission set <code>AdministratorAccess</code> → your account</li><li>CLI profile <code>academy-admin</code> using SSO (temporary credentials)</li></ul>`,
        steps: [
          { id: "s1", title: "Sign in as root and enable MFA", html: `
<ol><li>Sign in at the AWS console with the root user email.</li>
<li>Open the account menu (top right) → <strong>Security credentials</strong> → <strong>Multi-factor authentication (MFA)</strong> → <strong>Assign MFA device</strong>.</li>
<li>Prefer a <strong>passkey or security key</strong>. An authenticator app also works. Register at least one.</li>
<li>On the same page, confirm that <strong>Access keys</strong> shows none. If any exist, delete them.</li></ol>
<p class="muted small">AWS now requires MFA for root users of most accounts. If you were asked to register MFA at sign-in, confirm it is listed here.</p>` },
          { id: "s2", title: "Set alternate contacts and billing access", html: `
<ol><li>Account menu → <strong>Account</strong>. Under <strong>Alternate contacts</strong>, add Billing, Operations and Security contacts (these can be your own email).</li>
<li>On the same page, find <strong>IAM user and role access to Billing information</strong> → <strong>Edit</strong> → <strong>Activate IAM Access</strong>. Without this, your future admin identity can't see billing.</li></ol>` },
          { id: "s3", title: "Create a $10 monthly cost budget", html: `
<ol><li>Open <strong>Billing and Cost Management → Budgets → Create budget</strong>.</li>
<li>Choose <strong>Use a template → Monthly cost budget</strong>. Name it <code>academy-monthly</code>, amount <strong>$10</strong>, and enter your email.</li>
<li>Create it. You'll get emails when actual spend crosses the template thresholds and when forecast spend is expected to exceed the budget.</li>
<li>Optional: in <strong>Billing preferences</strong>, enable <em>Free Tier usage alerts</em> if offered for your account.</li></ol>` },
          { id: "s4", title: "Enable IAM Identity Center", html: `
<ol><li>Choose your <strong>home Region</strong> (e.g. the one closest to you) in the Region selector. Identity Center is configured in one Region.</li>
<li>Open <strong>IAM Identity Center → Enable</strong>. Accept the option to enable it with <strong>AWS Organizations</strong> (this creates an organization with your account as the management account, at no cost).</li>
<li>Note the <strong>AWS access portal URL</strong> (looks like <code>https://d-xxxxxxxxxx.awsapps.com/start</code>).</li></ol>` },
          { id: "s5", title: "Create your admin user, group and permission set", html: `
<ol><li><strong>Groups → Create group</strong> named <code>Admins</code>.</li>
<li><strong>Users → Add user</strong>: your name and email, added to <code>Admins</code>.</li>
<li><strong>Permission sets → Create permission set → Predefined → AdministratorAccess</strong>. Keep the session duration at 1–4 hours.</li>
<li><strong>AWS accounts</strong> → select your account → <strong>Assign users or groups</strong> → <code>Admins</code> → permission set <code>AdministratorAccess</code>.</li>
<li>Accept the invitation email, set a password and <strong>register MFA</strong> for this user.</li></ol>` },
          { id: "s6", title: "Install AWS CLI v2 and configure an SSO profile", html: `
<p>Install the CLI v2 for your OS (see the AWS CLI <em>Getting started</em> guide), then run:</p>
<pre><code>aws --version            # should be aws-cli/2.x

aws configure sso
# SSO session name:        academy
# SSO start URL:           https://d-xxxxxxxxxx.awsapps.com/start
# SSO region:              &lt;your Identity Center home Region&gt;
# SSO registration scopes: (press Enter for default)
#  -> browser opens, approve access, then pick your account and AdministratorAccess
# Default client Region:   &lt;your preferred Region&gt;
# Output format:           json
# Profile name:            academy-admin</code></pre>
<p>Later sessions: <code>aws sso login --profile academy-admin</code>. Optionally run <code>export AWS_PROFILE=academy-admin</code> so you can omit <code>--profile</code>.</p>` },
          { id: "s7", title: "Stop using root", html: `
<ol><li>Sign out of the root user.</li>
<li>From now on, sign in through your <strong>AWS access portal URL</strong>: choose the account → <strong>AdministratorAccess</strong> → <em>Management console</em>.</li>
<li>Store the root credentials and MFA device safely. You should rarely need them.</li></ol>` },
          { id: "s8", title: "Run the validation commands", html: `<p>Run every command in <strong>Validate your work</strong> below and compare the output with the expected results.</p>` }
        ],
        validate: `
<pre><code># 1. You are using the SSO admin role, not root or an IAM user
aws sts get-caller-identity --profile academy-admin
#   expect "Arn": "arn:aws:sts::&lt;account&gt;:assumed-role/AWSReservedSSO_AdministratorAccess_.../&lt;you&gt;"

# 2. Root MFA is enabled and root has no access keys
aws iam get-account-summary --profile academy-admin \\
  --query "SummaryMap.{RootMFA:AccountMFAEnabled,RootAccessKeys:AccountAccessKeysPresent}"
#   expect RootMFA = 1 and RootAccessKeys = 0

# 3. The budget exists
aws budgets describe-budgets --profile academy-admin \\
  --account-id $(aws sts get-caller-identity --query Account --output text --profile academy-admin) \\
  --query "Budgets[].{Name:BudgetName,Limit:BudgetLimit.Amount,Unit:BudgetLimit.Unit}" --output table
#   expect academy-monthly | 10.0 | USD

# 4. The security alternate contact is set
aws account get-alternate-contact --alternate-contact-type SECURITY --profile academy-admin
#   expect your contact details (an error means it is not set)</code></pre>
<p>All four pass? Tick the last step and mark the lab complete. 🎉</p>`,
        cleanup: `<p><strong>Nothing to delete.</strong> Everything in this lab is free and is the foundation for later labs. Keep it.</p>`
      }
    ],

    // ================================================================== MODULE QUIZ
    quiz: {
      passMark: 70,
      questions: [
        { id: "M01-Q01", type: "single", domain: "D2", task: "2.2", level: 200,
          stem: "A web application runs on EC2 instances in one Availability Zone with a single-AZ RDS database. The business requires the application to survive the loss of an AZ. Which combination of changes is required?",
          options: [
            { t: "Run EC2 instances in an Auto Scaling group across two or more AZs behind an ALB, and enable RDS Multi-AZ.", c: true, why: "Both zonal tiers become redundant across AZs, with automatic failover." },
            { t: "Enable RDS read replicas in the same AZ and add more EC2 instances in the same AZ.", c: false, why: "Everything stays in one AZ, so the single point of failure remains." },
            { t: "Replicate the whole stack to a second Region.", c: false, why: "Multi-Region exceeds the requirement, adding cost and complexity." },
            { t: "Take hourly EBS and RDS snapshots.", c: false, why: "Backups help recovery but don't keep the application available." }
          ] },
        { id: "M01-Q02", type: "single", domain: "D1", task: "1.1", level: 200,
          stem: "Two AWS accounts must place resources in the same physical Availability Zone to minimise latency. How should the teams coordinate?",
          options: [
            { t: "Use AZ IDs (e.g. use1-az2), which are consistent across accounts.", c: true, why: "AZ names map to different physical AZs per account. AZ IDs do not." },
            { t: "Use the same AZ name (e.g. us-east-1a) in both accounts.", c: false, why: "The same name can refer to different physical AZs." },
            { t: "Use the same VPC CIDR block.", c: false, why: "CIDR blocks have nothing to do with AZ placement." },
            { t: "Use a cluster placement group spanning both accounts.", c: false, why: "Placement groups don't span accounts." }
          ] },
        { id: "M01-Q03", type: "single", domain: "D3", task: "3.4", level: 200,
          stem: "A media company needs to run latency-sensitive video processing on AWS infrastructure inside its own data centre, using the same AWS APIs and tools. Which service fits?",
          options: [
            { t: "AWS Outposts", c: true, why: "AWS-managed infrastructure on-premises with native AWS APIs." },
            { t: "AWS Local Zones", c: false, why: "AWS-operated sites in metro areas, not in your data centre." },
            { t: "AWS Wavelength", c: false, why: "That is inside telco 5G networks." },
            { t: "Amazon CloudFront", c: false, why: "A CDN for content delivery." }
          ] },
        { id: "M01-Q04", type: "single", domain: "D1", task: "1.2", level: 200,
          stem: "Under the shared responsibility model, which task is the customer's responsibility when using AWS Lambda?",
          options: [
            { t: "Defining the function's IAM execution role permissions", c: true, why: "Identity and access configuration is always the customer's job." },
            { t: "Patching the operating system that runs the function", c: false, why: "AWS manages the OS for Lambda." },
            { t: "Patching the managed language runtime", c: false, why: "AWS patches managed runtimes." },
            { t: "Physical security of the servers", c: false, why: "That is AWS's responsibility." }
          ] },
        { id: "M01-Q05", type: "multi", domain: "D1", task: "1.1", level: 200,
          stem: "Which TWO are AWS-recommended practices for human access to AWS accounts?",
          options: [
            { t: "Use IAM Identity Center to provide temporary credentials through permission sets.", c: true, why: "Central workforce identity with short-lived credentials." },
            { t: "Require MFA for users, including the root user.", c: true, why: "MFA blocks most credential-stuffing and phishing attacks." },
            { t: "Create root access keys for automation scripts.", c: false, why: "Root keys should not exist." },
            { t: "Share one IAM user among the operations team.", c: false, why: "Shared identities remove accountability." },
            { t: "Store long-lived access keys in a shared spreadsheet.", c: false, why: "That creates a serious leak risk." }
          ] },
        { id: "M01-Q06", type: "single", domain: "D4", task: "4.4", level: 300,
          stem: "A microservices application spreads chatty services randomly across three AZs, and the bill shows high \"Regional data transfer\" charges. What is the MOST likely cause?",
          options: [
            { t: "Cross-AZ traffic between services is charged in each direction.", c: true, why: "Inter-AZ transfer is billed per GB in both directions." },
            { t: "Inbound internet traffic is charged.", c: false, why: "Inbound transfer is free." },
            { t: "Traffic within a single AZ over private IPs is charged.", c: false, why: "Same-AZ private traffic is free." },
            { t: "IAM API calls are charged.", c: false, why: "IAM is free." }
          ] },
        { id: "M01-Q07", type: "single", domain: "D4", task: "4.2", level: 200,
          stem: "A CFO wants to analyse the last 12 months of spend by service and see a forecast for the next 3 months in a graphical interface. Which tool fits BEST?",
          options: [
            { t: "AWS Cost Explorer", c: true, why: "It provides visual analysis of historical spend with forecasting." },
            { t: "AWS Budgets", c: false, why: "Budgets are mainly for threshold alerts and actions." },
            { t: "AWS Pricing Calculator", c: false, why: "It estimates planned resources, not historical spend." },
            { t: "AWS Trusted Advisor", c: false, why: "It gives best-practice checks, not spend analytics." }
          ] },
        { id: "M01-Q08", type: "single", domain: "D1", task: "1.3", level: 200,
          stem: "A healthcare company must ensure that patient data stays in Canada. Which design choice meets this requirement MOST directly?",
          options: [
            { t: "Deploy all storage and processing in a Canadian AWS Region without cross-Region replication.", c: true, why: "Region selection is the primary data-residency control." },
            { t: "Encrypt all data with AWS KMS.", c: false, why: "Encryption protects data but doesn't control its location." },
            { t: "Use CloudFront for all access.", c: false, why: "Edge caching spreads content globally." },
            { t: "Use multiple Availability Zones.", c: false, why: "AZs are all within one Region, which is good for availability but doesn't by itself choose the country." }
          ] },
        { id: "M01-Q09", type: "single", domain: "D2", task: "2.1", level: 100,
          stem: "Which statement correctly contrasts scaling approaches?",
          options: [
            { t: "Horizontal scaling adds more instances. Vertical scaling increases the size of an instance.", c: true, why: "Scale out vs scale up." },
            { t: "Horizontal scaling increases instance size. Vertical scaling adds instances.", c: false, why: "These are reversed." },
            { t: "Vertical scaling removes single points of failure.", c: false, why: "One bigger instance is still a single point of failure." },
            { t: "Horizontal scaling is impossible with stateless applications.", c: false, why: "Stateless applications are the easiest to scale horizontally." }
          ] },
        { id: "M01-Q10", type: "single", domain: "D3", task: "3.4", level: 200,
          stem: "Which AWS infrastructure component does Amazon CloudFront use to cache content close to viewers?",
          options: [
            { t: "Edge locations (points of presence)", c: true, why: "CloudFront serves cached content from edge locations and Regional edge caches." },
            { t: "Availability Zones", c: false, why: "AZs host Regional resources." },
            { t: "AWS Outposts", c: false, why: "Outposts are on-premises infrastructure." },
            { t: "VPC subnets", c: false, why: "Subnets are inside your VPC." }
          ] },
        { id: "M01-Q11", type: "single", domain: "D1", task: "1.2", level: 200,
          stem: "A developer's laptop has long-lived access keys in ~/.aws/credentials for daily CLI work. What should replace them?",
          options: [
            { t: "An IAM Identity Center (SSO) profile created with \"aws configure sso\"", c: true, why: "This provides short-lived credentials obtained through the browser login, with nothing long-lived on disk." },
            { t: "Root user access keys", c: false, why: "Root keys are the worst option." },
            { t: "Keys rotated every year", c: false, why: "Still long-lived credentials." },
            { t: "Keys stored in environment variables instead", c: false, why: "Still long-lived keys, just in a different place." }
          ] },
        { id: "M01-Q12", type: "single", domain: "D4", task: "4.2", level: 200,
          stem: "Which purchasing approach is MOST cost-effective for a steady baseline of compute that runs 24/7 for the next 3 years, where the team may switch between EC2 instance families and move some workloads to Fargate?",
          options: [
            { t: "Compute Savings Plan", c: true, why: "Discounts apply flexibly across instance families, Regions, Fargate and Lambda." },
            { t: "On-Demand Instances", c: false, why: "No commitment discount." },
            { t: "Spot Instances", c: false, why: "Interruptible, so unsuitable for a steady baseline." },
            { t: "Dedicated Hosts", c: false, why: "These are for licensing and compliance, and expensive." }
          ] },
        { id: "M01-Q13", type: "single", domain: "D2", task: "2.2", level: 200,
          stem: "Which statement about AWS Regions and Availability Zones is TRUE?",
          options: [
            { t: "AZs in a Region are physically separate but connected by low-latency links, enabling synchronous replication.", c: true, why: "That is exactly why Multi-AZ designs can replicate synchronously." },
            { t: "An AZ is always a single data centre.", c: false, why: "An AZ is one or more data centres." },
            { t: "Data is automatically replicated to other Regions.", c: false, why: "Data stays in its Region unless you replicate it." },
            { t: "Every Region has exactly two AZs.", c: false, why: "Recent Regions have a minimum of three AZs." }
          ] },
        { id: "M01-Q14", type: "single", domain: "D2", task: "2.2", level: 200,
          stem: "Which Well-Architected design principle discourages buying servers sized for an estimated peak?",
          options: [
            { t: "Stop guessing your capacity needs", c: true, why: "Scale to actual demand instead." },
            { t: "Improve through game days", c: false, why: "That is about rehearsing failures." },
            { t: "Drive architectures using data", c: false, why: "Related, but the specific principle is \"stop guessing capacity\"." },
            { t: "Consider evolutionary architectures", c: false, why: "That is about adapting designs over time." }
          ] },
        { id: "M01-Q15", type: "multi", domain: "D4", task: "4.4", level: 300,
          stem: "EC2 instances in private subnets download large datasets from S3 in the same Region through a NAT gateway and serve results to global users directly from the instances. Which TWO changes reduce data-related costs?",
          options: [
            { t: "Add an S3 gateway VPC endpoint so that S3 traffic bypasses the NAT gateway.", c: true, why: "This removes NAT per-GB processing for S3 traffic, and the endpoint has no charge." },
            { t: "Serve results to users through Amazon CloudFront.", c: true, why: "Edge caching reduces origin load and transfer cost, and origin-to-CloudFront transfer is free." },
            { t: "Add a NAT gateway in every AZ.", c: false, why: "Better availability, but higher cost." },
            { t: "Give every instance a public IPv4 address.", c: false, why: "Public IPv4 addresses are billed hourly, and this weakens security." },
            { t: "Replicate the S3 bucket to another Region.", c: false, why: "That adds cross-Region transfer and storage cost." }
          ] }
      ]
    },

    // ================================================================== FLASHCARDS
    flashcards: [
      { id: "fc-M01-01", front: "Name the six advantages of cloud computing.", back: "Variable vs fixed expense · economies of scale · stop guessing capacity · speed and agility · stop running data centres · go global in minutes." },
      { id: "fc-M01-02", front: "Scalability vs elasticity?", back: "Scalability = ability to handle growth (up or out). Elasticity = <em>automatic</em> scaling in both directions to match demand." },
      { id: "fc-M01-03", front: "IaaS vs PaaS vs serverless: who patches the OS?", back: "IaaS (EC2): you. PaaS (Beanstalk) and serverless (Lambda): AWS." },
      { id: "fc-M01-04", front: "What is an Availability Zone?", back: "One or more discrete data centres with redundant power, networking and connectivity, physically separated from other AZs in the Region and linked by low-latency fibre." },
      { id: "fc-M01-05", front: "AZ name vs AZ ID?", back: "Names (us-east-1a) map to different physical AZs per account. IDs (use1-az1) are consistent across accounts." },
      { id: "fc-M01-06", front: "Four criteria for choosing a Region?", back: "Compliance and data residency · latency to users · service availability · pricing." },
      { id: "fc-M01-07", front: "Local Zones vs Wavelength vs Outposts?", back: "Local Zones: Region extension in a metro area. Wavelength: inside 5G networks. Outposts: AWS racks in your data centre." },
      { id: "fc-M01-08", front: "Name 3 zonal resources you must make multi-AZ yourself.", back: "EC2 instances, EBS volumes, subnets (also single-AZ RDS instances and NAT gateways)." },
      { id: "fc-M01-09", front: "Shared responsibility: security OF vs IN the cloud?", back: "AWS: OF the cloud (facilities, hardware, hypervisor, managed-service software). Customer: IN the cloud (data, IAM, guest OS, configuration, encryption)." },
      { id: "fc-M01-10", front: "Who patches the database engine on Amazon RDS?", back: "AWS, applied during your chosen maintenance window." },
      { id: "fc-M01-11", front: "Where do you download AWS compliance reports (SOC, ISO, PCI)?", back: "AWS Artifact." },
      { id: "fc-M01-12", front: "Recommended credentials for an app running on EC2?", back: "An IAM role via an instance profile, which provides temporary credentials that the SDK discovers automatically. Never access keys." },
      { id: "fc-M01-13", front: "Recommended way for humans to access many accounts?", back: "IAM Identity Center with permission sets (temporary credentials, MFA)." },
      { id: "fc-M01-14", front: "First CLI command to run when debugging permissions?", back: "aws sts get-caller-identity (who am I?)." },
      { id: "fc-M01-15", front: "Data transfer: which is free, which is charged?", back: "Free: inbound from the internet, same-AZ private traffic. Charged: outbound to the internet, cross-AZ (each direction), cross-Region, NAT processing." },
      { id: "fc-M01-16", front: "Budgets vs Cost Explorer vs CUR?", back: "Budgets: threshold alerts and actions. Cost Explorer: visual analysis and forecasts. CUR: most granular line-item data." },
      { id: "fc-M01-17", front: "How do you attribute cost to teams?", back: "Tag resources and activate the tags as cost allocation tags (plus Organizations consolidated billing)." },
      { id: "fc-M01-18", front: "Purchasing pattern rule of thumb?", back: "Steady → Savings Plans / RIs · spiky or new → On-Demand / serverless · interruptible → Spot." },
      { id: "fc-M01-19", front: "The six Well-Architected pillars?", back: "Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability." },
      { id: "fc-M01-20", front: "Which pillars map to the four SAA-C03 domains?", back: "Security → D1, Reliability → D2, Performance Efficiency → D3, Cost Optimization → D4." },
      { id: "fc-M01-21", front: "NIST's five essential characteristics of cloud computing?", back: "On-demand self-service · broad network access · resource pooling · rapid elasticity · measured service." },
      { id: "fc-M01-22", front: "What makes elastic scale-out possible for a web tier?", back: "Stateless instances: sessions and files kept outside the instance (ElastiCache/DynamoDB, S3/EFS), so any instance can serve any request." },
      { id: "fc-M01-23", front: "Static stability: how many instances per AZ?", back: "Per-AZ = ceil(peak ÷ (AZs − 1)). E.g. peak 6 over 3 AZs → 3 per AZ, 9 total." },
      { id: "fc-M01-24", front: "What happens to the RDS endpoint in a Multi-AZ failover?", back: "The standby is promoted and the same DNS endpoint is repointed to it; apps reconnect without config changes (typically 1–2 minutes)." },
      { id: "fc-M01-25", front: "ECS on EC2 vs Fargate: who patches the host OS?", back: "EC2 launch type: you. Fargate: AWS. In both cases you patch your container images." },
      { id: "fc-M01-26", front: "Where do you get the AWS Business Associate Addendum (BAA) for HIPAA?", back: "AWS Artifact (agreements). It covers HIPAA-eligible services only; you must still configure them correctly." },
      { id: "fc-M01-27", front: "What does SigV4 do, and is the secret key sent?", back: "Signs each request with a key derived from your secret key, date, Region and service, proving identity and integrity. The secret key is never sent." },
      { id: "fc-M01-28", front: "IAM evaluation in one sentence?", back: "An explicit Deny anywhere wins; otherwise an explicit Allow is required; otherwise the request is implicitly denied." },
      { id: "fc-M01-29", front: "Which tool flags an unusual daily spend spike automatically?", back: "AWS Cost Anomaly Detection (machine-learning based alerts by service, account, tag or cost category)." },
      { id: "fc-M01-30", front: "Which discount covers EC2, Fargate and Lambda?", back: "Compute Savings Plans." },
      { id: "fc-M01-31", front: "What does a Well-Architected review produce?", back: "Answers per pillar, high- and medium-risk issues (HRIs/MRIs), a prioritised improvement plan and milestones to track progress." },
      { id: "fc-M01-32", front: "What is a Well-Architected lens?", back: "An extension with domain-specific questions (e.g. Serverless, SaaS, Data Analytics), or a custom lens with your own standards." }
    ]
  };
})();

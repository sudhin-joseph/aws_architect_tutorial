/* M04 – System design fundamentals (assembled from per-lesson sections) */
(function () {
  var LESSONS = [], FLASHCARDS = [];

// ================================================================== 01_architect.js
/* ---------------------------------------------------------------- M04.01 Thinking like an architect */
var DG_0401_FLOW = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0401at m0401ad">
  <title id="m0401at">The architect's design workflow</title>
  <desc id="m0401ad">Eight steps in a loop: gather requirements, list constraints and assumptions, estimate the load, sketch a high-level design, deep dive into the riskiest components, evaluate trade-offs, record the decision in an ADR, and review against the Well-Architected Framework. Review findings and production metrics feed back into requirements.</desc>
  <defs><marker id="m0401a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-edge" x="12" y="20" width="164" height="62" rx="8"/><text class="dg-tb" x="24" y="44">1 Requirements</text><text class="dg-ts" x="24" y="64">functional + NFRs</text>
  <rect class="dg-edge" x="200" y="20" width="164" height="62" rx="8"/><text class="dg-tb" x="212" y="44">2 Constraints</text><text class="dg-ts" x="212" y="64">budget, law, skills</text>
  <rect class="dg-info" x="388" y="20" width="164" height="62" rx="8"/><text class="dg-tb" x="400" y="44">3 Estimate</text><text class="dg-ts" x="400" y="64">rps, storage, bandwidth</text>
  <rect class="dg-info" x="576" y="20" width="172" height="62" rx="8"/><text class="dg-tb" x="588" y="44">4 High-level design</text><text class="dg-ts" x="588" y="64">boxes, arrows, data flow</text>
  <rect class="dg-box" x="576" y="150" width="172" height="62" rx="8"/><text class="dg-tb" x="588" y="174">5 Deep dive</text><text class="dg-ts" x="588" y="194">riskiest parts first</text>
  <rect class="dg-box" x="388" y="150" width="164" height="62" rx="8"/><text class="dg-tb" x="400" y="174">6 Trade-offs</text><text class="dg-ts" x="400" y="194">cost vs speed vs risk</text>
  <rect class="dg-good" x="200" y="150" width="164" height="62" rx="8"/><text class="dg-tb" x="212" y="174">7 Decide + ADR</text><text class="dg-ts" x="212" y="194">record the why</text>
  <rect class="dg-good" x="12" y="150" width="164" height="62" rx="8"/><text class="dg-tb" x="24" y="174">8 Review</text><text class="dg-ts" x="24" y="194">Well-Architected, peers</text>
  <path class="dg-line" d="M176 51 H198" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M364 51 H386" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M552 51 H574" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M662 82 V148" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M576 181 H554" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M388 181 H366" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M200 181 H178" marker-end="url(#m0401a-ar)"/>
  <path class="dg-line" d="M94 150 V84" marker-end="url(#m0401a-ar)"/>
  <text class="dg-ts" x="104" y="122">findings and production metrics</text>
  <text class="dg-ts" x="104" y="136">feed back into requirements</text>
  <text class="dg-ts" x="12" y="246">Steps 1–3 are where most bad designs go wrong: a solution to the wrong problem, or sized for the wrong load.</text>
  <text class="dg-ts" x="12" y="264">On the exam, steps 1–2 are the scenario text; you do steps 4–7 in your head in about 90 seconds.</text>
  <text class="dg-ts" x="12" y="282">At work, step 7 (the Architecture Decision Record) is what lets the next person understand your design.</text>
</svg>
<figcaption>Figure M04-1a. Design is a loop, not a line. Every review and every production incident is new input for the requirements.</figcaption>
</figure>`;

var DG_0401_AVAIL = `
<figure>
<svg class="diagram" viewBox="0 0 760 320" role="img" aria-labelledby="m0401bt m0401bd">
  <title id="m0401bt">Serial versus parallel availability</title>
  <desc id="m0401bd">Top: three components in series, a load balancer at 99.99 percent, a single web server at 99.5 percent and a database at 99.95 percent, give about 99.44 percent overall, roughly 49 hours of downtime a year. Bottom: the same chain with the web tier duplicated across two Availability Zones gives about 99.94 percent, roughly 5.5 hours a year.</desc>
  <defs><marker id="m0401b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="22">Serial: every component must work (multiply)</text>
  <rect class="dg-box" x="12" y="36" width="150" height="50" rx="6"/><text class="dg-t" x="24" y="58">Load balancer</text><text class="dg-ts" x="24" y="76">99.99%</text>
  <rect class="dg-bad" x="210" y="36" width="150" height="50" rx="6"/><text class="dg-t" x="222" y="58">1 web server</text><text class="dg-ts" x="222" y="76">99.5% (one AZ)</text>
  <rect class="dg-box" x="408" y="36" width="150" height="50" rx="6"/><text class="dg-t" x="420" y="58">Database</text><text class="dg-ts" x="420" y="76">99.95%</text>
  <path class="dg-line" d="M162 61 H208" marker-end="url(#m0401b-ar)"/>
  <path class="dg-line" d="M360 61 H406" marker-end="url(#m0401b-ar)"/>
  <rect class="dg-bad" x="590" y="36" width="158" height="50" rx="6"/><text class="dg-tb" x="602" y="58">≈ 99.44%</text><text class="dg-ts" x="602" y="76">≈ 49 h down / year</text>
  <text class="dg-ts" x="12" y="108">0.9999 × 0.995 × 0.9995 = 0.99440. The chain is weaker than its weakest link.</text>

  <text class="dg-tb" x="12" y="146">Parallel: only one copy needs to work (1 − product of failures)</text>
  <rect class="dg-box" x="12" y="190" width="150" height="50" rx="6"/><text class="dg-t" x="24" y="212">Load balancer</text><text class="dg-ts" x="24" y="230">99.99%</text>
  <rect class="dg-az" x="200" y="160" width="170" height="110" rx="8"/>
  <rect class="dg-good" x="210" y="168" width="150" height="44" rx="6"/><text class="dg-t" x="222" y="188">web in AZ a</text><text class="dg-ts" x="222" y="204">99.5%</text>
  <rect class="dg-good" x="210" y="218" width="150" height="44" rx="6"/><text class="dg-t" x="222" y="238">web in AZ b</text><text class="dg-ts" x="222" y="254">99.5%</text>
  <rect class="dg-box" x="408" y="190" width="150" height="50" rx="6"/><text class="dg-t" x="420" y="212">Database</text><text class="dg-ts" x="420" y="230">99.95% Multi-AZ</text>
  <path class="dg-line" d="M162 215 H198" marker-end="url(#m0401b-ar)"/>
  <path class="dg-line" d="M370 215 H406" marker-end="url(#m0401b-ar)"/>
  <rect class="dg-good" x="590" y="190" width="158" height="50" rx="6"/><text class="dg-tb" x="602" y="212">≈ 99.94%</text><text class="dg-ts" x="602" y="230">≈ 5.5 h down / year</text>
  <text class="dg-ts" x="12" y="292">Web tier: 1 − (0.005 × 0.005) = 0.999975. Whole chain: 0.9999 × 0.999975 × 0.9995 = 0.99938.</text>
  <text class="dg-ts" x="12" y="310">Redundancy turned the weakest link into one of the strongest. The database is now the limit.</text>
</svg>
<figcaption>Figure M04-1b. Components in series multiply their availabilities; redundant copies in parallel multiply their failure probabilities. Numbers are illustrative, not AWS SLAs.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.01", title: "Thinking like an architect", level: 200, minutes: 55,
  objectives: [
    "Separate functional requirements from non-functional requirements (quality attributes), constraints and assumptions, and elicit them with the right questions",
    "Explain SLIs, SLOs, SLAs and error budgets, and convert any availability target into allowed downtime",
    "Calculate the availability of serial and parallel component chains, and use MTBF/MTTR",
    "Produce a back-of-envelope estimate of requests per second, storage and bandwidth from user numbers",
    "Follow a repeatable design workflow and decode how SAA-C03 question stems express requirements"
  ],
  sections: [
    { type: "why", html: `
<p>Two architects are given the same brief: "Build us a ticketing website." The first opens the console and starts creating EC2 instances. Three months later the site works perfectly for 500 users and collapses when a stadium concert goes on sale to 200,000 people at 10:00 on a Friday. The second spends the first two days asking questions: <em>How many people buy at the peak minute? What happens if two people buy the same seat? How long may the site be down? What does the finance team expect it to cost? Which country must the card data stay in?</em> The second design looks less impressive on day 3, and is still running on day 300.</p>
<p>The difference is not AWS knowledge. It is a <strong>way of thinking</strong>: start from requirements, quantify them, and only then pick services. The SAA-C03 exam tests exactly this. Every question is a compressed requirements document, and the "correct" answer is simply the design that meets <em>all</em> the stated requirements with the fewest compromises. This lesson gives you the vocabulary and the arithmetic you will use in every later module.</p>` },

    { type: "concept", title: "Requirements: what the system must do and how well", html: DG_0401_FLOW + `
<h3>Functional vs non-functional requirements</h3>
<p>A <strong>functional requirement</strong> describes a behaviour: <em>"A customer can reserve up to 6 seats for 10 minutes and then pay."</em> A <strong>non-functional requirement (NFR)</strong>, also called a <strong>quality attribute</strong>, describes <em>how well</em> the system performs that behaviour: <em>"Reservation responds within 300 ms at the 99th percentile while 5,000 people buy at once."</em></p>
<p>Functional requirements decide <em>what</em> you build. NFRs decide <em>how</em> you build it, and they drive nearly every architecture choice: two systems with identical features can need completely different designs because one must survive a Region failure and the other must cost under $200 a month.</p>
<table>
<thead><tr><th>Quality attribute</th><th>Question it answers</th><th>How it is measured</th><th>Typical AWS levers</th></tr></thead>
<tbody>
<tr><td><strong>Availability</strong></td><td>Is it up when users need it?</td><td>% of successful requests or minutes up</td><td>Multi-AZ, Auto Scaling, health checks, Route 53 failover</td></tr>
<tr><td><strong>Reliability / durability</strong></td><td>Does it do the right thing and keep the data?</td><td>Error rate, data loss (RPO), durability nines</td><td>S3 (11 nines durability), backups, Multi-AZ databases</td></tr>
<tr><td><strong>Scalability</strong></td><td>Can it handle more load by adding resources?</td><td>Max throughput while meeting the latency target</td><td>Horizontal scaling, serverless, DynamoDB, SQS</td></tr>
<tr><td><strong>Performance</strong></td><td>How fast does each request complete?</td><td>Latency percentiles (p50, p95, p99), throughput</td><td>Caching, CloudFront, right instance type, read replicas</td></tr>
<tr><td><strong>Security</strong></td><td>Who can do what, and is the data protected?</td><td>Controls in place, audit findings</td><td>IAM, KMS, VPC design, WAF, GuardDuty</td></tr>
<tr><td><strong>Cost</strong></td><td>What does it cost to run and to change?</td><td>$/month, $/transaction, unit cost</td><td>Right-sizing, Savings Plans, Spot, serverless, storage tiers</td></tr>
<tr><td><strong>Operability</strong></td><td>How hard is it to run, deploy and debug?</td><td>Deployment frequency, MTTR, toil hours</td><td>Managed services, IaC, CloudWatch, Systems Manager</td></tr>
<tr><td><strong>Compliance</strong></td><td>Does it meet laws and standards?</td><td>Audit results (PCI DSS, HIPAA, GDPR)</td><td>Region choice, encryption, CloudTrail, Config, Artifact</td></tr>
</tbody></table>

<h3>Constraints and assumptions</h3>
<ul>
  <li>A <strong>constraint</strong> is a fixed boundary you cannot negotiate away: <em>"Card data must stay in the EU"</em>, <em>"The team knows Java and PostgreSQL"</em>, <em>"Go live before the season opens on 1 March"</em>, <em>"Budget $8,000 per month"</em>. Constraints eliminate options before you compare them.</li>
  <li>An <strong>assumption</strong> is something you believe but have not verified: <em>"Peak traffic is 10× the average"</em>, <em>"Payment provider latency is under 1 second"</em>. Write assumptions down and attach an owner and a date to check them. A wrong assumption is the most common root cause of a design that "suddenly" fails.</li>
</ul>

<h3>How to elicit NFRs: questions to ask stakeholders</h3>
<p>Business stakeholders rarely volunteer NFRs, and when asked "how available should it be?" everyone says "100%". Ask about <em>consequences and money</em> instead:</p>
<table>
<thead><tr><th>Area</th><th>Ask</th><th>What the answer tells you</th></tr></thead>
<tbody>
<tr><td>Availability</td><td>"If the site is down for 1 hour on a Tuesday night, what does that cost? On launch day?"</td><td>Target nines, and whether you need multi-AZ or multi-Region</td></tr>
<tr><td>Data loss (RPO)</td><td>"If we lost the last 5 minutes of orders, what happens? The last day?"</td><td>Backup frequency vs synchronous replication</td></tr>
<tr><td>Recovery time (RTO)</td><td>"After a disaster, how long until customers must be able to buy again?"</td><td>Backup &amp; restore vs pilot light vs warm standby vs active/active (M33)</td></tr>
<tr><td>Load</td><td>"How many users today? In 2 years? What is the busiest minute of the year?"</td><td>Capacity estimate and the scaling model</td></tr>
<tr><td>Latency</td><td>"Where are the users? What feels slow to them?"</td><td>Region choice, CloudFront, caching</td></tr>
<tr><td>Security/compliance</td><td>"What data do we store? Which regulations apply? Who audits us?"</td><td>Encryption, residency, logging, account structure</td></tr>
<tr><td>Cost</td><td>"What is the budget, and is it fixed or per customer?"</td><td>Purchasing model, serverless vs provisioned</td></tr>
<tr><td>Operations</td><td>"Who runs this at 03:00? How big is that team?"</td><td>How managed/serverless the design must be</td></tr>
</tbody></table>
<div class="callout tip"><strong>Turn adjectives into numbers.</strong> "Fast" becomes "p99 &lt; 300 ms for /reserve". "Highly available" becomes "99.95% monthly, measured at the load balancer". "Scalable" becomes "5,000 checkout requests per second at peak with no latency degradation". If you cannot measure a requirement, you cannot design for it or prove you met it.</div>` },

    { type: "concept", title: "SLIs, SLOs, SLAs, error budgets and the nines", html: `
<h3>Three terms that are often confused</h3>
<table>
<thead><tr><th>Term</th><th>What it is</th><th>Example</th><th>Who cares</th></tr></thead>
<tbody>
<tr><td><strong>SLI</strong> (service level indicator)</td><td>A <em>measurement</em> of service behaviour</td><td>"Percentage of HTTP requests to /checkout that returned 2xx/3xx in under 500 ms"</td><td>Engineers (dashboards)</td></tr>
<tr><td><strong>SLO</strong> (service level objective)</td><td>An internal <em>target</em> for an SLI over a window</td><td>"99.9% of checkout requests succeed fast, measured over 30 days"</td><td>Engineering and product</td></tr>
<tr><td><strong>SLA</strong> (service level agreement)</td><td>A <em>contract</em> with consequences (usually service credits) if missed</td><td>"99.5% monthly uptime or 10% credit"</td><td>Customers, lawyers, finance</td></tr>
</tbody></table>
<p>The SLO is always <strong>stricter than the SLA</strong>, so you notice problems and fix them before you owe customers money. AWS publishes SLAs for its services (for example EC2, S3, RDS). They describe AWS's commitment and credits, not the availability of <em>your</em> application, which depends on how you combine services.</p>

<h3>Error budgets</h3>
<p>An <strong>error budget</strong> is <code>1 − SLO</code>: the amount of unreliability you are allowed. A 99.9% monthly SLO gives an error budget of 0.1%, which is <strong>43.2 minutes</strong> in a 30-day month (or 0.1% of requests). Teams use it to balance speed and stability: while budget remains, ship features; when a bad deployment burns most of it, freeze releases and invest in reliability. It turns "is this risky?" into a number both product and operations can agree on.</p>

<h3>The nines: what each target means in practice</h3>
<table>
<thead><tr><th>Availability</th><th>Downtime per year</th><th>Downtime per 30-day month</th><th>What it usually implies</th></tr></thead>
<tbody>
<tr><td>99% ("two nines")</td><td>3.65 days</td><td>7.2 hours</td><td>A single server with manual recovery can meet this</td></tr>
<tr><td>99.5%</td><td>1.83 days</td><td>3.6 hours</td><td>Single AZ, automated restarts and backups</td></tr>
<tr><td>99.9% ("three nines")</td><td>8.76 hours</td><td>43.2 minutes</td><td>Multi-AZ, health checks, automated replacement; a human cannot be in the recovery loop for every failure</td></tr>
<tr><td>99.95%</td><td>4.38 hours</td><td>21.6 minutes</td><td>Multi-AZ everything, zero-downtime deployments, fast database failover</td></tr>
<tr><td>99.99% ("four nines")</td><td>52.6 minutes</td><td>4.32 minutes</td><td>Fully automated failover, careful deployments (canary/blue-green), often multi-Region for critical paths</td></tr>
<tr><td>99.999% ("five nines")</td><td>5.26 minutes</td><td>25.9 seconds</td><td>Active/active multi-Region, no single shared dependency; very expensive</td></tr>
</tbody></table>
<p>Formula: <code>allowed downtime = (1 − availability) × period</code>. A year is 8,760 hours; a 30-day month is 720 hours (43,200 minutes). (Some sources use an average month of 30.44 days, so you may see 43.8 minutes for 99.9%.)</p>
<div class="callout warn"><strong>Each extra nine costs roughly an order of magnitude more effort.</strong> Going from 99.9% to 99.99% means every failure must be detected and recovered automatically in seconds, because 4.3 minutes a month is less time than it takes someone to read a page alert. Ask what the extra nine is worth to the business before promising it.</div>

<h3>Composite availability</h3>
<p>Real systems are chains of components. Two rules (assuming failures are independent):</p>
<ul>
  <li><strong>Serial</strong> (every component is needed): <code>A = A₁ × A₂ × … × Aₙ</code>. The result is always <em>lower</em> than the weakest component. Two 99.9% components in series give 99.8001%.</li>
  <li><strong>Parallel</strong> (any one of n redundant copies is enough): <code>A = 1 − (1 − A₁) × (1 − A₂) × …</code>. Two 99% copies in parallel give 1 − 0.01 × 0.01 = 99.99%.</li>
</ul>
` + DG_0401_AVAIL + `
<h3>MTBF and MTTR</h3>
<p><strong>MTBF</strong> (mean time between failures) is how long a component typically runs before failing. <strong>MTTR</strong> (mean time to repair/recover) is how long it takes to restore service. <code>Availability = MTBF / (MTBF + MTTR)</code>. A server that fails every 1,000 hours and takes 1 hour to fix is 1000/1001 = <strong>99.90%</strong> available. Cut MTTR to 6 minutes with automation and it becomes 99.99%, without making the hardware any better. On AWS, <strong>reducing MTTR</strong> (Auto Scaling replacing instances, RDS Multi-AZ failing over in about a minute or two, Route 53 health checks) is usually far cheaper than increasing MTBF.</p>
<div class="callout"><strong>Independence is an assumption.</strong> Two web servers in the <em>same</em> AZ, on the same deployment, sharing the same configuration bug, fail together. The parallel formula only holds when failures are independent. That is why AWS designs separate failure domains (AZs, Regions) and why you deploy changes gradually.</div>` },

    { type: "workflow", title: "Back-of-envelope estimation, step by step", html: `
<p>Estimation is not about precision; it is about getting the <strong>order of magnitude</strong> right so you choose the right architecture. 50 requests per second and 50,000 requests per second need different designs; 52 and 61 do not.</p>
<ol class="flow">
  <li><strong>Start from users:</strong> daily active users (DAU) and what each does per day (reads, writes). State it as an assumption.</li>
  <li><strong>Requests per day → average per second:</strong> divide by 86,400 seconds (≈ 10⁵ for mental maths). 1 million requests/day ≈ 11.6 per second.</li>
  <li><strong>Peak:</strong> multiply the average by a peak factor. Typical consumer apps see 2–10× average at the busiest hour; flash sales and ticket drops can be 100× for minutes. Always size for the peak you must survive.</li>
  <li><strong>Read/write split:</strong> most systems are read-heavy (10:1 to 100:1). This tells you whether caching and read replicas will help.</li>
  <li><strong>Storage:</strong> writes/day × size per item × retention (days). Add replicas, indexes and backups (often ×2–3 in total).</li>
  <li><strong>Bandwidth:</strong> requests × response size, converted to bits per second (bytes × 8). Large egress means CloudFront, compression and careful data-transfer cost analysis.</li>
  <li><strong>Compute:</strong> peak rps ÷ measured capacity per instance (from a load test, or a stated assumption), then add headroom and spread across AZs so losing one AZ still leaves enough capacity.</li>
  <li><strong>Sanity-check and write it down:</strong> compare against known limits (e.g. a single relational primary handling thousands of writes per second is a stretch; DynamoDB or sharding may be needed). Put the numbers and assumptions in the design document.</li>
</ol>
<h3>Numbers worth memorising</h3>
<table>
<thead><tr><th>Power of two</th><th>Exact</th><th>Approx.</th><th>Bytes name</th></tr></thead>
<tbody>
<tr><td>2¹⁰</td><td>1,024</td><td>1 thousand (10³)</td><td>1 KiB</td></tr>
<tr><td>2²⁰</td><td>1,048,576</td><td>1 million (10⁶)</td><td>1 MiB</td></tr>
<tr><td>2³⁰</td><td>1,073,741,824</td><td>1 billion (10⁹)</td><td>1 GiB</td></tr>
<tr><td>2⁴⁰</td><td>≈ 1.1 × 10¹²</td><td>1 trillion (10¹²)</td><td>1 TiB</td></tr>
</tbody></table>
<table>
<thead><tr><th>Quantity</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Seconds in a day</td><td>86,400 (≈ 10⁵)</td></tr>
<tr><td>Seconds in a 30-day month</td><td>≈ 2.6 million</td></tr>
<tr><td>1 million requests/day</td><td>≈ 11.6 requests/second average</td></tr>
<tr><td>1 billion requests/month</td><td>≈ 385 requests/second average</td></tr>
<tr><td>1 Gbps</td><td>125 MB/s ≈ 10.8 TB/day if saturated</td></tr>
</tbody></table>` },

    { type: "aws", title: "From requirements to AWS choices", html: `
<p>Once the NFRs are numbers, they map to AWS decisions surprisingly directly. The table below is a preview; each row is a later module.</p>
<table>
<thead><tr><th>Requirement (quantified)</th><th>AWS design consequence</th><th>Deep dive</th></tr></thead>
<tbody>
<tr><td>99.9%+ availability</td><td>No single-AZ components on the request path: ALB + Auto Scaling group across ≥ 2 AZs, RDS Multi-AZ or Aurora, one NAT gateway per AZ</td><td>M14, M21, M32</td></tr>
<tr><td>99.99% or Regional disaster tolerance</td><td>Multi-Region: Route 53 failover, Aurora Global Database or DynamoDB global tables, S3 replication</td><td>M12, M32, M33</td></tr>
<tr><td>RPO near zero</td><td>Synchronous replication within a Region (Multi-AZ); async cross-Region replication gives RPO of seconds, not zero</td><td>M21, M33</td></tr>
<tr><td>RTO of minutes</td><td>Warm standby or active/active; backups alone usually give hours</td><td>M33</td></tr>
<tr><td>Unpredictable or spiky load</td><td>Auto Scaling, serverless (Lambda, Fargate, DynamoDB on-demand), queues to absorb bursts</td><td>M14, M16, M25</td></tr>
<tr><td>p99 latency target for global users</td><td>CloudFront, caching (ElastiCache/DAX), Region close to users, Global Accelerator</td><td>M12, M23</td></tr>
<tr><td>Small ops team, "least operational overhead"</td><td>Managed and serverless services over self-managed EC2</td><td>M16, M17</td></tr>
<tr><td>Data residency (e.g. EU only)</td><td>Region choice; SCPs that deny other Regions; no cross-Region replication outside the boundary</td><td>M06</td></tr>
<tr><td>Fixed or minimal budget</td><td>Right-sizing, Savings Plans for steady load, Spot for interruptible work, storage lifecycle policies</td><td>M34</td></tr>
</tbody></table>
<h3>How SAA-C03 stems encode requirements</h3>
<p>Exam questions compress the requirements into a few phrases. Learn to translate them instantly:</p>
<table>
<thead><tr><th>Phrase in the stem</th><th>What it really requires</th><th>What it usually rules out</th></tr></thead>
<tbody>
<tr><td>"highly available", "fault tolerant"</td><td>Survive an AZ failure (multi-AZ). "Fault tolerant" often means no degradation at all during the failure</td><td>Single instance, single AZ, single NAT gateway</td></tr>
<tr><td>"MOST cost-effective"</td><td>Meet every other stated requirement at the lowest price</td><td>Over-provisioned or premium options, even if technically better</td></tr>
<tr><td>"LEAST operational overhead"</td><td>Most managed / serverless option that works</td><td>Self-managed EC2, custom scripts, cron jobs on servers</td></tr>
<tr><td>"minimise latency", "improve performance for global users"</td><td>Move data closer (CloudFront, caching, edge) or use faster storage/compute</td><td>Bigger instances in one far-away Region</td></tr>
<tr><td>"decouple", "handle spikes"</td><td>A queue or event bus between producers and consumers</td><td>Synchronous direct calls</td></tr>
<tr><td>"must not lose any data", "durable"</td><td>Synchronous replication, S3, durable queues</td><td>Ephemeral instance store, in-memory only</td></tr>
<tr><td>"in the shortest time", "as quickly as possible"</td><td>The fastest path to delivery, often a managed feature</td><td>Building something custom</td></tr>
</tbody></table>
<div class="callout tip">On the exam, <strong>every</strong> answer option may "work". Underline the constraint words, eliminate options that violate any of them, then pick the simplest remaining option. That is exactly the architect's workflow, compressed.</div>` },

    { type: "examples", html: `
<h3>Example 1: converting targets to downtime</h3>
<pre><code>SLO 99.95% over a 30-day month
  minutes in month  = 30 × 24 × 60          = 43,200 min
  error budget      = (1 − 0.9995) × 43,200 = 21.6 min

SLO 99.9% over a year
  hours in year     = 365 × 24              = 8,760 h
  allowed downtime  = 0.001 × 8,760         = 8.76 h</code></pre>

<h3>Example 2: composite availability of a classic AWS web stack</h3>
<p>Illustrative component availabilities (not AWS SLAs): ALB 99.99%, one EC2 web instance 99.5%, RDS Multi-AZ 99.95%.</p>
<pre><code>Design A: one EC2 instance in one AZ (serial)
  0.9999 × 0.995 × 0.9995                    = 0.99440  → 99.44%
  downtime ≈ (1 − 0.99440) × 8,760 h         ≈ 49 h/year

Design B: Auto Scaling group with an instance in each of 2 AZs
  web tier (parallel) = 1 − (0.005 × 0.005)  = 0.999975
  chain (serial)      = 0.9999 × 0.999975 × 0.9995 = 0.99938 → 99.94%
  downtime ≈ (1 − 0.99938) × 8,760 h         ≈ 5.5 h/year

Design B costs one extra small instance and removes ~43 hours of downtime a year.
The database is now the weakest link: Aurora (faster failover) or caching would be next.</code></pre>

<h3>Example 3: MTBF/MTTR</h3>
<pre><code>MTBF = 1,000 h, MTTR = 1 h    → 1000 / 1001   = 99.90%
MTBF = 1,000 h, MTTR = 0.1 h  → 1000 / 1000.1 = 99.99%   (automation: 6-minute recovery)</code></pre>

<h3>Example 4: full estimate for a photo-sharing app</h3>
<p>Assumptions (write them down!): 10 million DAU; each user views 50 photos a day and uploads 0.2 photos a day; an uploaded photo plus its thumbnails is 2 MB; a viewed (resized) photo is 200 KB; peak factor 3×; one API instance handles 1,000 metadata requests per second (from a load test).</p>
<table>
<thead><tr><th>Quantity</th><th>Calculation</th><th>Result</th></tr></thead>
<tbody>
<tr><td>Photo views/day</td><td>10 M × 50</td><td>500 M/day</td></tr>
<tr><td>Average read rps</td><td>500 M ÷ 86,400</td><td>≈ 5,800 rps</td></tr>
<tr><td>Peak read rps</td><td>5,787 × 3</td><td>≈ 17,400 rps</td></tr>
<tr><td>Uploads/day</td><td>10 M × 0.2</td><td>2 M/day ≈ 23/s average, ≈ 70/s peak</td></tr>
<tr><td>Read:write ratio</td><td>500 M : 2 M</td><td>250 : 1, so caching pays off hugely</td></tr>
<tr><td>New storage/day</td><td>2 M × 2 MB</td><td>4 TB/day</td></tr>
<tr><td>Storage/year</td><td>4 TB × 365</td><td>≈ 1.46 PB/year</td></tr>
<tr><td>Egress</td><td>500 M × 200 KB = 100 TB/day; × 8 ÷ 86,400</td><td>≈ 9.3 Gbps average</td></tr>
<tr><td>API instances at peak</td><td>17,400 ÷ 1,000</td><td>18 instances</td></tr>
<tr><td>Survive losing 1 of 3 AZs</td><td>18 must remain in 2 AZs → 9 per AZ</td><td>27 instances (9 × 3 AZs)</td></tr>
</tbody></table>
<p><strong>What the numbers tell the architect:</strong> photos belong in <strong>S3</strong> (petabytes, 11 nines durability) with lifecycle rules to cheaper storage classes; 9 Gbps of image egress must go through <strong>CloudFront</strong> (lower per-GB price, cache hit ratio removes most origin load); 70 uploads/s is easy if clients upload <em>directly to S3 with presigned URLs</em> instead of through the API; the 250:1 read ratio says cache metadata (ElastiCache or DAX) so the database sees only a fraction of reads. Notice that the estimate made the design obvious before any service was compared.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Key quantified requirement</th><th>Design consequence</th></tr></thead>
<tbody>
<tr><td>Internal HR portal, 300 staff, office hours</td><td>99.5%, cost-sensitive, 2-person team</td><td>Single-Region, serverless or small Multi-AZ setup; don't buy four nines nobody needs</td></tr>
<tr><td>E-commerce checkout</td><td>99.95%, RPO ≈ 0 for orders, p99 &lt; 500 ms</td><td>Multi-AZ everything, synchronous DB replication, queues for downstream work (email, warehouse)</td></tr>
<tr><td>Payments API for banks</td><td>99.99%, regulated, audited</td><td>Multi-Region active/passive or active/active, strict change management, encryption and logging everywhere</td></tr>
<tr><td>Nightly analytics batch</td><td>Finishes by 06:00; can retry</td><td>Availability matters little; Spot instances, EMR/Glue/Athena; optimise cost</td></tr>
<tr><td>Ticket on-sale event</td><td>100× normal load for 15 minutes</td><td>Waiting room/queue, pre-scaling (scheduled scaling), DynamoDB conditional writes for seat locks, CloudFront for static content</td></tr>
<tr><td>Global mobile game</td><td>&lt; 100 ms latency worldwide</td><td>Multiple Regions near players, Global Accelerator or CloudFront, regional data stores</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: build your estimation and availability calculator", html: `
<p>You can do this in any terminal with Python 3 (WSL, macOS, CloudShell). It turns this lesson's formulas into a reusable tool.</p>
<pre><code>cat &gt; capacity.py &lt;&lt;'EOF'
DAY = 86_400

def downtime(avail, hours):          # allowed downtime in minutes
    return (1 - avail) * hours * 60

def serial(*a):
    p = 1.0
    for x in a: p *= x
    return p

def parallel(*a):
    q = 1.0
    for x in a: q *= (1 - x)
    return 1 - q

for nines in (0.99, 0.999, 0.9995, 0.9999, 0.99999):
    print(f"{nines:.5f}: {downtime(nines, 8760)/60:7.2f} h/yr  {downtime(nines, 720):7.1f} min/30d")

single = serial(0.9999, 0.995, 0.9995)
multi  = serial(0.9999, parallel(0.995, 0.995), 0.9995)
print(f"single-AZ web: {single:.5%}   two-AZ web: {multi:.5%}")

dau, views, peak = 10_000_000, 50, 3
avg = dau * views / DAY
print(f"avg {avg:,.0f} rps, peak {avg*peak:,.0f} rps")
EOF
python3 capacity.py</code></pre>
<p>Expected output (abridged):</p>
<pre><code>0.99000:   87.60 h/yr    432.0 min/30d
0.99900:    8.76 h/yr     43.2 min/30d
0.99950:    4.38 h/yr     21.6 min/30d
0.99990:    0.88 h/yr      4.3 min/30d
0.99999:    0.09 h/yr      0.4 min/30d
single-AZ web: 99.44030%   two-AZ web: 99.93751%
avg 5,787 rps, peak 17,361 rps</code></pre>
<p><strong>Try it:</strong> change the web tier to three AZs, or the database to 99.99%, and see which change helps most. Then estimate a system you know at work. Keep the script: you will reuse it in M41.</p>` },

    { type: "casestudy", title: "Case study: requirements for \"StageDoor\" ticketing", html: `
<p><strong>Context.</strong> StageDoor, a fictional regional ticketing company, is moving from a hosted PHP application to AWS. The old site crashed during the last three big on-sales. The CTO asks for "a scalable, highly available site on AWS within four months".</p>
<p><strong>Elicitation.</strong> The architect ran three workshops (business, finance, operations) and turned the adjectives into numbers:</p>
<table>
<thead><tr><th>Area</th><th>Finding</th><th>Quantified requirement</th></tr></thead>
<tbody>
<tr><td>Load</td><td>Normal: 40,000 visitors/day. Biggest on-sale: 180,000 people arrive in the first 10 minutes</td><td>Peak ≈ 300 arrivals/s; ~3,000 seat-reservation rps at peak (assumption, verify with load test)</td></tr>
<tr><td>Correctness</td><td>Selling one seat twice costs a refund, a complaint and press coverage</td><td>Seat reservation must be strongly consistent; zero double-sells</td></tr>
<tr><td>Availability</td><td>Outside on-sales, 1 hour down costs ~$4,000; during an on-sale ~$150,000</td><td>99.95% monthly SLO; on-sale windows treated as critical events</td></tr>
<tr><td>Data loss</td><td>Losing confirmed orders is unacceptable; losing browsing sessions is fine</td><td>Orders RPO ≈ 0; sessions RPO = n/a</td></tr>
<tr><td>Recovery</td><td>A Regional disaster is rare; customers accept a few hours' outage</td><td>RTO 4 h for Region loss (backup &amp; restore / pilot light, not active/active)</td></tr>
<tr><td>Compliance</td><td>Card payments via a PCI DSS-certified payment provider</td><td>No card data stored; tokenised payments; reduces PCI scope</td></tr>
<tr><td>Operations</td><td>Three developers, no dedicated ops staff</td><td>"Least operational overhead": managed/serverless preferred</td></tr>
<tr><td>Cost</td><td>$6,000/month run-rate target, more allowed during on-sales</td><td>Elastic capacity; no 24/7 peak-sized fleet</td></tr>
</tbody></table>
<p><strong>Design decisions that followed.</strong> A virtual waiting room in front of the on-sale (queue-based admission) caps arrivals into checkout at a rate the backend has been load-tested for. Seats are reserved in <strong>DynamoDB with conditional writes</strong> (a write succeeds only if the seat is still free), which gives the strong per-item correctness the business needs without a single relational write bottleneck. Static content is served from <strong>S3 + CloudFront</strong>. The checkout API runs on <strong>Lambda behind API Gateway</strong>, sized by concurrency limits rather than instance counts, and order confirmations flow through <strong>SQS</strong> to email and accounting so a slow downstream can't block checkout. Orders are also written to <strong>Aurora PostgreSQL</strong> (Multi-AZ) for reporting. For Regional disaster, nightly cross-Region backups plus IaC give a 4-hour RTO, which the business explicitly accepted as cheaper than active/active.</p>
<p><strong>Outcome.</strong> The first big on-sale after migration admitted 172,000 people through the waiting room in 41 minutes with zero double-sells, p99 checkout latency of 410 ms, and an on-sale-day bill of about $900. Monthly run cost settled at $4,800.</p>
<p><strong>Lessons learned.</strong> (1) The most valuable output of the workshops was the <em>difference</em> between on-sale and normal hours: it justified elastic and serverless design. (2) Writing "RTO 4 h for Region loss, accepted by the CFO" in the ADR stopped months of debate about multi-Region. (3) The 3,000 rps figure was an assumption; the load test found 1,900 rps, and the waiting room's admission rate was set from the test, not the guess.</p>` },

    { type: "exam", html: `
<ul>
  <li><strong>Read the stem twice: once for the problem, once for the constraints.</strong> Count them ("highly available" + "cost-effective" + "minimal changes to the application"). The right answer satisfies all of them.</li>
  <li>"Highly available" → multi-AZ. A single EC2 instance, a single NAT gateway or a single-AZ RDS is a distractor even if the rest of the option is excellent.</li>
  <li>"Disaster recovery to another Region" with an RPO/RTO → pick the cheapest DR strategy that meets <em>both</em> numbers (backup &amp; restore → pilot light → warm standby → active/active).</li>
  <li>Durability ≠ availability: S3 Standard has 11 nines of <em>durability</em> (data not lost) but a lower availability design target. Don't mix them up in answer options.</li>
  <li>"Least operational overhead" beats "most control" unless the stem demands OS access, custom kernels or specific licensing.</li>
</ul>
<table>
<thead><tr><th>Term</th><th>vs</th><th>Difference</th></tr></thead>
<tbody>
<tr><td>SLA</td><td>SLO</td><td>SLA is a contract with penalties; SLO is the stricter internal target</td></tr>
<tr><td>Availability</td><td>Durability</td><td>Can I reach it now? vs will my data still exist?</td></tr>
<tr><td>RPO</td><td>RTO</td><td>How much data I may lose (time) vs how long until service is back</td></tr>
<tr><td>Fault tolerant</td><td>Highly available</td><td>No user-visible impact during failure vs recovers quickly with brief impact</td></tr>
<tr><td>Constraint</td><td>Assumption</td><td>Non-negotiable fact vs unverified belief to be tested</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Measure availability where the user is.</strong> An SLI computed from server health checks says 100% while DNS or the CDN is broken. Prefer load balancer request metrics or synthetic canaries (CloudWatch Synthetics) from outside.</li>
  <li><strong>Dependencies count in series.</strong> Your 99.99% design that calls a 99.9% third-party API synchronously is a 99.9% design. Use timeouts, fallbacks and queues to take dependencies off the critical path.</li>
  <li><strong>Estimates rot.</strong> Re-run them every quarter with real CloudWatch numbers. The peak factor you assumed is the number most likely to be wrong.</li>
  <li><strong>Correlated failures defeat the maths.</strong> A bad deployment pushed to all AZs at once, a shared configuration store, or an expired certificate fails every "independent" copy together. Deploy gradually (one AZ or a canary first) and keep shared dependencies few.</li>
  <li><strong>Write the ADR while you still remember why.</strong> Record context, options considered, decision and consequences (M04.09). Six months later "why didn't we go multi-Region?" has an answer with the CFO's sign-off attached.</li>
  <li><strong>Cost is a requirement too.</strong> A design that meets every technical NFR but costs 3× the budget is a failed design. Show the cost of each extra nine.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Functional requirements say what the system does; non-functional requirements (quality attributes) say how well, and they drive architecture.</li>
  <li>Turn adjectives into measurable targets; separate fixed constraints from assumptions you must verify.</li>
  <li>SLI = measurement, SLO = internal target, SLA = contract. Error budget = 1 − SLO.</li>
  <li>99.9% ≈ 8.76 h/year or 43.2 min/30-day month; 99.99% ≈ 52.6 min/year or 4.32 min/month.</li>
  <li>Serial availability multiplies (gets worse); parallel redundancy multiplies failure probabilities (gets better). Availability = MTBF / (MTBF + MTTR).</li>
  <li>Reducing MTTR through automation is usually the cheapest way to add nines on AWS.</li>
  <li>Estimate: users → requests/day → ÷ 86,400 → × peak factor → storage, bandwidth, instances (sized to survive losing an AZ).</li>
  <li>Exam stems are compressed requirement documents: map "highly available", "MOST cost-effective", "LEAST operational overhead" to design consequences.</li>
</ul>` }
  ],
  drills: [
    { id: "M04.01-d1", q: "How many hours of downtime per year does a 99.9% availability target allow? (365-day year)", answers: ["8.76", "8.76h"], hint: "(1 − 0.999) × 8,760 hours", explain: "0.001 × 8,760 = 8.76 hours." },
    { id: "M04.01-d2", q: "How many minutes of downtime per 30-day month does a 99.99% target allow?", answers: ["4.32", "4.32min"], hint: "A 30-day month has 43,200 minutes.", explain: "0.0001 × 43,200 = 4.32 minutes." },
    { id: "M04.01-d3", q: "Your SLO is 99.95% over a 30-day month. What is the error budget in minutes?", answers: ["21.6", "21.6min"], hint: "Error budget = (1 − SLO) × period.", explain: "0.0005 × 43,200 = 21.6 minutes." },
    { id: "M04.01-d4", q: "Two components, each 99.9% available, are in series. What is the combined availability in percent? (4 decimal places)", answers: ["99.8001", "99.8001%"], hint: "Multiply: 0.999 × 0.999.", explain: "0.999 × 0.999 = 0.998001 = 99.8001%. Lower than either component." },
    { id: "M04.01-d5", q: "Two independent redundant copies, each 99% available, run in parallel (either one is enough). What is the combined availability in percent?", answers: ["99.99", "99.99%"], hint: "1 − (0.01 × 0.01)", explain: "1 − 0.0001 = 0.9999 = 99.99%." },
    { id: "M04.01-d6", q: "A component has MTBF 1,000 hours and MTTR 1 hour. What is its availability in percent, to 2 decimal places?", answers: ["99.90", "99.9", "99.90%", "99.9%"], hint: "MTBF / (MTBF + MTTR)", explain: "1000 / 1001 = 0.999001 → 99.90%." },
    { id: "M04.01-d7", q: "A service receives 5 million requests per day, spread evenly. What is the average requests per second, rounded to the nearest whole number?", answers: ["58"], hint: "Divide by 86,400.", explain: "5,000,000 ÷ 86,400 = 57.87 ≈ 58 rps." },
    { id: "M04.01-d8", q: "Users upload 1 million images per day at 500 KB each and you keep them for a year. How many TB (decimal, 1 TB = 10¹² bytes) is that, before replication?", answers: ["182.5", "182.5tb"], hint: "1e6 × 500e3 bytes × 365", explain: "10⁶ × 5 × 10⁵ = 5 × 10¹¹ bytes/day = 0.5 TB/day; × 365 = 182.5 TB." },
    { id: "M04.01-d9", q: "Peak traffic needs 12 instances. You run in 3 AZs and must still have 12 instances after losing any one AZ. What is the minimum total number of instances?", answers: ["18"], hint: "The 12 must fit in the 2 surviving AZs.", explain: "12 ÷ 2 = 6 per AZ; 6 × 3 AZs = 18 instances (50% headroom). This is called static stability." },
    { id: "M04.01-d10", q: "A web tier, a single EC2 instance at 99.5%, sits behind a 99.99% load balancer and in front of a 99.95% database (all serial). What is the overall availability in percent, to 2 decimal places?", answers: ["99.44", "99.44%"], hint: "0.9999 × 0.995 × 0.9995", explain: "= 0.99440 → 99.44%, roughly 49 hours of downtime a year." }
  ],
  check: [
    { id: "M04.01-k1", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A product owner says: \"The checkout page must load in under 300 ms for 99% of requests during the holiday peak.\" What kind of requirement is this?",
      options: [
        { t: "A non-functional (performance) requirement with a measurable target", c: true, why: "It describes how well a function performs, with a percentile and a threshold, which makes it testable." },
        { t: "A functional requirement", c: false, why: "Functional requirements describe behaviour (\"a user can pay by card\"), not speed." },
        { t: "A constraint", c: false, why: "A constraint is a fixed boundary such as a law, budget or mandated technology. This is a quality target you design for." },
        { t: "An SLA", c: false, why: "An SLA is a contract with consequences for customers. This is an internal target (an SLO-style requirement)." }
      ] },
    { id: "M04.01-k2", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A web application uses an Application Load Balancer, one EC2 instance and an Amazon RDS Multi-AZ database. The company needs the application to remain available if an Availability Zone fails. What is the MOST effective change?",
      options: [
        { t: "Place the EC2 instances in an Auto Scaling group spanning at least two Availability Zones behind the ALB", c: true, why: "The single instance is the single point of failure and the weakest serial component. Redundant instances in two AZs make the web tier survive an AZ loss." },
        { t: "Change the instance to a larger instance type", c: false, why: "Vertical scaling adds capacity but the single instance still fails with its AZ." },
        { t: "Add an RDS read replica", c: false, why: "The database is already Multi-AZ. The web tier remains a single point of failure." },
        { t: "Enable detailed CloudWatch monitoring on the instance", c: false, why: "Monitoring detects failures faster but does not provide redundancy." }
      ] },
    { id: "M04.01-k3", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "An internal SLO is 99.9% availability over 30 days. A bad deployment caused 35 minutes of downtime this month. What does the error budget tell the team?",
      options: [
        { t: "About 81% of the 43.2-minute budget is used; slow down risky releases and prioritise reliability work", c: true, why: "Budget = 0.1% × 43,200 min = 43.2 min. 35 min is ~81% consumed, which is the signal to freeze or slow risky changes." },
        { t: "The SLA has been breached and customers are owed credits", c: false, why: "The SLO is internal and stricter than any SLA; nothing contractual has been breached yet." },
        { t: "There is no budget left at all", c: false, why: "About 8 minutes remain." },
        { t: "Error budgets apply only to yearly targets", c: false, why: "Error budgets apply to any SLO window; 30 days is the most common." }
      ] },
    { id: "M04.01-k4", type: "multi", domain: "D2", task: "2.2", level: 200,
      stem: "Which actions INCREASE the availability of a system? (Select TWO.)",
      options: [
        { t: "Reduce mean time to recovery by automating failure detection and replacement", c: true, why: "Availability = MTBF/(MTBF+MTTR). Lower MTTR raises availability without better hardware." },
        { t: "Add independent redundant copies of a single-point-of-failure component in separate AZs", c: true, why: "Parallel redundancy multiplies failure probabilities, which increases availability." },
        { t: "Add another mandatory synchronous dependency to the request path", c: false, why: "A serial component multiplies in another availability below 100%, which lowers the total." },
        { t: "Put all redundant copies in the same AZ to reduce latency", c: false, why: "They share a failure domain, so the failures are not independent and an AZ outage takes all of them." },
        { t: "Raise the SLA percentage in the customer contract", c: false, why: "Promising more doesn't change the system; it only increases penalties." }
      ] },
    { id: "M04.01-k5", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "A social app expects 20 million requests per day with a peak factor of 4. Each application server handles 300 requests per second. Ignoring headroom and AZ distribution, about how many servers are needed at peak?",
      options: [
        { t: "4", c: true, why: "20 M ÷ 86,400 ≈ 231 rps average; × 4 ≈ 926 rps; ÷ 300 ≈ 3.1, so 4 servers (before adding AZ headroom)." },
        { t: "1", c: false, why: "That would cover only the average (231 rps), not the peak." },
        { t: "67", c: false, why: "That divides 20 M by 300 per second without converting days to seconds." },
        { t: "13", c: false, why: "This doesn't follow from any correct conversion of the numbers given." }
      ] },
    { id: "M04.01-k6", type: "single", domain: "D4", task: "4.2", level: 200,
      stem: "A company runs an internal reporting tool used during office hours by 200 employees. The business accepts a few hours of downtime per month. The team asks whether to deploy it active/active across two Regions. What should the architect recommend?",
      options: [
        { t: "Deploy in one Region using managed services, with backups and IaC to rebuild if needed", c: true, why: "The requirement is roughly 99.5%. Multi-Region active/active would add large cost and complexity for availability nobody needs." },
        { t: "Active/active across two Regions to be safe", c: false, why: "That over-engineers the requirement and multiplies cost and operational overhead." },
        { t: "A single EC2 instance with no backups", c: false, why: "Cheap, but data loss would be unacceptable even if downtime is tolerated." },
        { t: "Warm standby in a second Region", c: false, why: "Better than active/active, but still more cost than the stated requirement justifies." }
      ] }
  ],
  cards: ["fc-M04-1-01", "fc-M04-1-02", "fc-M04-1-03", "fc-M04-1-04", "fc-M04-1-05", "fc-M04-1-06", "fc-M04-1-07", "fc-M04-1-08", "fc-M04-1-09", "fc-M04-1-10", "fc-M04-1-11", "fc-M04-1-12"],
  references: [
    "<em>System Design on AWS</em> ch.1 \"System Design Trade-offs and Guidelines\" (PDF p22–50): availability in nines, MTBF/MTTR, scalability",
    "AWS Well-Architected Framework, Reliability Pillar: <em>Availability</em> and <em>Calculating availability with hard dependencies</em>",
    "Google SRE Book, ch.4 \"Service Level Objectives\" (SLIs, SLOs, error budgets)",
    "AWS Service Level Agreements page (aws.amazon.com/legal/service-level-agreements)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-1-01", front: "Functional vs non-functional requirement?", back: "Functional = what the system does (a behaviour). Non-functional = how well it does it (availability, performance, security, cost…). NFRs drive the architecture." },
  { id: "fc-M04-1-02", front: "Constraint vs assumption?", back: "Constraint: fixed, non-negotiable boundary (law, budget, deadline, mandated tech). Assumption: unverified belief that must be tested (peak factor, dependency latency)." },
  { id: "fc-M04-1-03", front: "SLI vs SLO vs SLA?", back: "SLI = measurement. SLO = internal target for the SLI over a window. SLA = contract with penalties. SLO is stricter than SLA." },
  { id: "fc-M04-1-04", front: "What is an error budget?", back: "1 − SLO: the allowed unreliability. 99.9%/30 days = 43.2 minutes. Spend it on change; when it's gone, prioritise reliability." },
  { id: "fc-M04-1-05", front: "Downtime for 99.9% / 99.99% / 99.999% per year?", back: "8.76 h · 52.6 min · 5.26 min (per 30-day month: 43.2 min · 4.32 min · 25.9 s)." },
  { id: "fc-M04-1-06", front: "Serial vs parallel availability formulas?", back: "Serial: A₁ × A₂ × … (always lower). Parallel (independent copies): 1 − (1−A₁)(1−A₂)… (higher)." },
  { id: "fc-M04-1-07", front: "Availability from MTBF and MTTR?", back: "MTBF / (MTBF + MTTR). Cutting MTTR with automation is usually the cheapest way to add nines." },
  { id: "fc-M04-1-08", front: "1 million requests/day ≈ how many per second?", back: "≈ 11.6 rps (÷ 86,400). 1 billion/month ≈ 385 rps." },
  { id: "fc-M04-1-09", front: "Back-of-envelope estimation steps?", back: "DAU × actions → requests/day → ÷ 86,400 → × peak factor → read/write split → storage (× retention) → bandwidth (× 8 for bits) → instances (+ AZ headroom)." },
  { id: "fc-M04-1-10", front: "Static stability: instances needed to survive losing 1 of 3 AZs at N peak?", back: "N must fit in 2 AZs → N/2 per AZ × 3 = 1.5 N total." },
  { id: "fc-M04-1-11", front: "\"LEAST operational overhead\" in a stem means?", back: "Choose the most managed / serverless option that meets the requirements; avoid self-managed EC2, custom scripts and cron jobs." },
  { id: "fc-M04-1-12", front: "Availability vs durability?", back: "Availability: can I access it now? Durability: will the data still exist? (S3: 11 nines durability, lower availability target.)" }
);
// ================================================================== 02_scalability.js
/* ---------------------------------------------------------------- M04.02 Scalability */
var DG_0402_UPOUT = `
<figure>
<svg class="diagram" viewBox="0 0 760 270" role="img" aria-labelledby="m0402at m0402ad">
  <title id="m0402at">Scaling up versus scaling out</title>
  <desc id="m0402ad">Left: vertical scaling replaces one small server with one larger server; there is a ceiling at the largest instance size and the single server remains a single point of failure. Right: horizontal scaling adds more identical servers behind a load balancer; capacity grows in steps and losing one server removes only a fraction of capacity.</desc>
  <defs><marker id="m0402a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="12" y="22">Vertical: scale UP (bigger box)</text>
  <rect class="dg-box" x="30" y="150" width="70" height="50" rx="6"/><text class="dg-t" x="40" y="172">small</text><text class="dg-ts" x="40" y="190">2 vCPU</text>
  <path class="dg-line" d="M104 175 H140" marker-end="url(#m0402a-ar)"/>
  <rect class="dg-bad" x="146" y="60" width="210" height="140" rx="8"/><text class="dg-tb" x="160" y="86">one large server</text><text class="dg-ts" x="160" y="106">64+ vCPU, lots of RAM</text>
  <text class="dg-ts" x="160" y="140">+ no code changes</text><text class="dg-ts" x="160" y="158">− hard ceiling (max size)</text><text class="dg-ts" x="160" y="176">− still one point of failure</text><text class="dg-ts" x="160" y="194">− resize usually needs restart</text>
  <text class="dg-ts" x="12" y="236">Good first step for databases and legacy apps.</text>
  <text class="dg-ts" x="12" y="252">Cost per unit of capacity rises at the top end.</text>

  <path class="dg-line" d="M370 20 V256" stroke-dasharray="4 4"/>

  <text class="dg-tb" x="390" y="22">Horizontal: scale OUT (more boxes)</text>
  <rect class="dg-edge" x="500" y="40" width="150" height="34" rx="6"/><text class="dg-t" x="514" y="62">Load balancer</text>
  <rect class="dg-good" x="392" y="120" width="76" height="50" rx="6"/><text class="dg-t" x="402" y="142">node 1</text><text class="dg-ts" x="402" y="160">4 vCPU</text>
  <rect class="dg-good" x="484" y="120" width="76" height="50" rx="6"/><text class="dg-t" x="494" y="142">node 2</text><text class="dg-ts" x="494" y="160">4 vCPU</text>
  <rect class="dg-good" x="576" y="120" width="76" height="50" rx="6"/><text class="dg-t" x="586" y="142">node 3</text><text class="dg-ts" x="586" y="160">4 vCPU</text>
  <rect class="dg-good" x="668" y="120" width="76" height="50" rx="6" stroke-dasharray="4 3"/><text class="dg-t" x="678" y="142">node n</text><text class="dg-ts" x="678" y="160">added</text>
  <path class="dg-line" d="M540 74 L430 118" marker-end="url(#m0402a-ar)"/>
  <path class="dg-line" d="M560 74 L522 118" marker-end="url(#m0402a-ar)"/>
  <path class="dg-line" d="M590 74 L614 118" marker-end="url(#m0402a-ar)"/>
  <path class="dg-line" d="M620 74 L706 118" marker-end="url(#m0402a-ar)"/>
  <text class="dg-ts" x="392" y="198">+ near-linear growth, no hard ceiling</text>
  <text class="dg-ts" x="392" y="214">+ losing one node loses 1/n of capacity</text>
  <text class="dg-ts" x="392" y="230">+ add/remove with no downtime (elasticity)</text>
  <text class="dg-ts" x="392" y="246">− nodes must be stateless (state moved out)</text>
</svg>
<figcaption>Figure M04-2a. Vertical scaling is simple but limited and fragile; horizontal scaling is how cloud systems grow, at the price of designing for statelessness.</figcaption>
</figure>`;

var DG_0402_TIERS = `
<figure>
<svg class="diagram" viewBox="0 0 760 410" role="img" aria-labelledby="m0402bt m0402bd">
  <title id="m0402bt">A horizontally scaled three-tier architecture with externalised state</title>
  <desc id="m0402bd">Users reach CloudFront, which serves static content from S3 and forwards dynamic requests to an Application Load Balancer. The ALB spreads requests over stateless web and API instances in an Auto Scaling group across two Availability Zones. Session data lives in ElastiCache, uploaded files in S3. Slow work is sent to an SQS queue and processed by a worker Auto Scaling group that scales on queue depth. The data tier is an Aurora primary with read replicas.</desc>
  <defs><marker id="m0402b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="12" y="20" width="110" height="40" rx="6"/><text class="dg-t" x="26" y="45">Users</text>
  <rect class="dg-edge" x="160" y="20" width="160" height="40" rx="6"/><text class="dg-t" x="172" y="45">CloudFront (cache)</text>
  <rect class="dg-info" x="360" y="20" width="170" height="40" rx="6"/><text class="dg-t" x="372" y="45">S3: static + uploads</text>
  <path class="dg-line" d="M122 40 H158" marker-end="url(#m0402b-ar)"/>
  <path class="dg-line" d="M320 40 H358" marker-end="url(#m0402b-ar)"/>
  <rect class="dg-edge" x="160" y="90" width="160" height="34" rx="6"/><text class="dg-t" x="172" y="112">Application LB</text>
  <path class="dg-line" d="M240 60 V88" marker-end="url(#m0402b-ar)"/>

  <rect class="dg-region" x="12" y="140" width="460" height="130" rx="10"/>
  <text class="dg-ta" x="24" y="160">Auto Scaling group: stateless web/API (2 AZs)</text>
  <rect class="dg-az" x="24" y="170" width="214" height="90" rx="8"/><text class="dg-tb" x="34" y="190">AZ a</text>
  <rect class="dg-good" x="34" y="200" width="90" height="44" rx="6"/><text class="dg-t" x="44" y="226">web 1</text>
  <rect class="dg-good" x="136" y="200" width="90" height="44" rx="6"/><text class="dg-t" x="146" y="226">web 3</text>
  <rect class="dg-az" x="248" y="170" width="214" height="90" rx="8"/><text class="dg-tb" x="258" y="190">AZ b</text>
  <rect class="dg-good" x="258" y="200" width="90" height="44" rx="6"/><text class="dg-t" x="268" y="226">web 2</text>
  <rect class="dg-good" x="360" y="200" width="90" height="44" rx="6"/><text class="dg-t" x="370" y="226">web 4</text>
  <path class="dg-line" d="M240 124 V138" marker-end="url(#m0402b-ar)"/>

  <rect class="dg-info" x="530" y="150" width="218" height="48" rx="6"/><text class="dg-t" x="542" y="170">ElastiCache: sessions</text><text class="dg-ts" x="542" y="188">any node serves any user</text>
  <path class="dg-line" d="M472 175 H528" marker-end="url(#m0402b-ar)"/>
  <rect class="dg-edge" x="530" y="214" width="218" height="48" rx="6"/><text class="dg-t" x="542" y="234">SQS queue</text><text class="dg-ts" x="542" y="252">slow work: emails, images</text>
  <path class="dg-line" d="M472 238 H528" marker-end="url(#m0402b-ar)"/>
  <rect class="dg-good" x="530" y="290" width="218" height="48" rx="6"/><text class="dg-t" x="542" y="310">Worker ASG</text><text class="dg-ts" x="542" y="328">scales on backlog per instance</text>
  <path class="dg-line" d="M639 262 V288" marker-end="url(#m0402b-ar)"/>

  <rect class="dg-box" x="12" y="300" width="200" height="60" rx="6"/><text class="dg-t" x="24" y="322">Aurora primary</text><text class="dg-ts" x="24" y="342">all writes (scale up / shard)</text>
  <rect class="dg-box" x="240" y="300" width="232" height="60" rx="6"/><text class="dg-t" x="252" y="322">Read replicas ×n</text><text class="dg-ts" x="252" y="342">reads scale out (async copies)</text>
  <path class="dg-line" d="M120 270 V298" marker-end="url(#m0402b-ar)"/>
  <path class="dg-line" d="M356 270 V298" marker-end="url(#m0402b-ar)"/>
  <path class="dg-line" d="M212 330 H238" marker-end="url(#m0402b-ar)"/>
  <text class="dg-ts" x="12" y="382">Every web node is identical and disposable: no local sessions, no local files.</text>
  <text class="dg-ts" x="12" y="398">That is what lets Auto Scaling add and remove them freely.</text>
</svg>
<figcaption>Figure M04-2b. Each tier scales differently: the edge caches, the web tier scales out, slow work is queued, reads go to replicas and only writes stay on one primary.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.02", title: "Scalability", level: 200, minutes: 55,
  objectives: [
    "Compare vertical and horizontal scaling, including their limits, downtime and cost behaviour",
    "Explain why stateless services scale horizontally and choose a session-externalisation strategy",
    "Choose a scaling technique for each tier: web, application, data and asynchronous work",
    "Size concurrency and fleets with Little's law and reason about speed-up limits with Amdahl's law",
    "Recognise hot keys and other bottlenecks that stop a system from scaling"
  ],
  sections: [
    { type: "why", html: `
<p>An online shop runs happily on two large servers. On Black Friday the marketing campaign works too well: traffic jumps 8×. The team clicks "add instances", the new servers come up in three minutes, and... customers start complaining that their baskets are empty. Every time the load balancer sends someone to a different server, their session, stored in that server's memory, is gone. Adding servers made things <em>worse</em>.</p>
<p>The shop had capacity it could not use, because its design was not <strong>scalable</strong>. Scalability is not "the cloud gives me more servers". It is a property of your architecture: <em>can the system handle more load by adding resources, without redesign and without the user noticing?</em> This lesson explains what makes a design scalable, how each tier scales on AWS, and the two laws that tell you how far scaling can take you. It underpins exam Domain 3 (high-performing architectures) and much of Domain 2.</p>` },

    { type: "concept", title: "Vertical vs horizontal scaling", html: DG_0402_UPOUT + `
<h3>Definitions</h3>
<ul>
  <li><strong>Scalability</strong>: the ability to handle increased load by adding resources, while still meeting the performance targets.</li>
  <li><strong>Vertical scaling (scale up / scale down)</strong>: give one node more (or fewer) resources: a bigger EC2 instance type, a larger RDS instance class, more memory for a Lambda function.</li>
  <li><strong>Horizontal scaling (scale out / scale in)</strong>: add (or remove) more nodes of the same kind and spread the load across them: more instances in an Auto Scaling group, more read replicas, more partitions.</li>
  <li><strong>Elasticity</strong> (recap from M01): scaling <em>automatically</em> in both directions to follow demand, so you also stop paying when load falls. Scalability is the capability; elasticity is using it automatically.</li>
</ul>
<table>
<thead><tr><th></th><th>Vertical (up)</th><th>Horizontal (out)</th></tr></thead>
<tbody>
<tr><td>How</td><td>Bigger instance type or class</td><td>More instances, replicas or partitions</td></tr>
<tr><td>Code changes</td><td>Usually none</td><td>App must be stateless or partition-aware</td></tr>
<tr><td>Ceiling</td><td>Hard: the largest available size</td><td>Very high: add nodes until another bottleneck appears</td></tr>
<tr><td>Downtime to change</td><td>Usually a restart (EC2 stop/start; RDS class change causes a brief outage, shorter with Multi-AZ failover)</td><td>None: nodes join and leave behind the load balancer</td></tr>
<tr><td>Failure impact</td><td>One node = 100% of capacity</td><td>Losing one of n nodes removes 1/n</td></tr>
<tr><td>Cost curve</td><td>Price roughly doubles with each size step; the largest sizes are premium</td><td>Linear: n small nodes ≈ n × small price; can use Spot</td></tr>
<tr><td>Typical use</td><td>Relational database primary, legacy apps, quick fix</td><td>Web/API tiers, workers, containers, NoSQL, read replicas</td></tr>
</tbody></table>
<div class="callout tip"><strong>Scale up first, scale out for real.</strong> Moving from a <code>t3.medium</code> to an <code>m7i.xlarge</code> is a sensible quick win, especially for a database. But a design that can only scale vertically will hit a wall and stays a single point of failure. Plan for horizontal scaling in every tier that can support it.</div>

<h3>Stateless vs stateful services</h3>
<p>A service is <strong>stateless</strong> when any instance can handle any request because it keeps no client-specific data between requests. It is <strong>stateful</strong> when a request depends on something stored in a particular instance: an in-memory session, a file written to local disk, a WebSocket connection, a local cache that must be warm.</p>
<p>Statelessness is <em>the</em> enabler of horizontal scaling:</p>
<ul>
  <li>The load balancer can send a request to any healthy instance.</li>
  <li>Auto Scaling can terminate any instance during scale-in without losing data.</li>
  <li>A failed instance can be replaced by a fresh one from the same AMI or container image.</li>
  <li>You can use Spot Instances, because losing one is harmless.</li>
</ul>
<p>State doesn't disappear; you <strong>move it out</strong> of the compute tier into services built to hold it: sessions into ElastiCache or DynamoDB, files into S3 or EFS, data into a database, work into a queue.</p>

<h3>Session externalisation options</h3>
<table>
<thead><tr><th>Option</th><th>How it works</th><th>Pros</th><th>Cons</th></tr></thead>
<tbody>
<tr><td><strong>Sticky sessions</strong> (ALB session affinity)</td><td>The ALB sets a cookie and keeps sending a client to the same target</td><td>No code change; quick fix</td><td>Uneven load; sessions lost when that instance fails or scales in; it hides statefulness rather than removing it</td></tr>
<tr><td><strong>Distributed cache</strong> (ElastiCache for Redis/Valkey or Memcached)</td><td>App stores the session under a session ID in a shared in-memory store</td><td>Sub-millisecond access; any node serves any user</td><td>Another component to run (managed, but needs Multi-AZ replication for HA); data in memory</td></tr>
<tr><td><strong>Database store</strong> (DynamoDB with TTL)</td><td>Session item keyed by session ID; TTL deletes expired sessions</td><td>Durable, serverless, scales automatically</td><td>Single-digit-millisecond latency rather than sub-millisecond; cost per request</td></tr>
<tr><td><strong>Client-side tokens</strong> (signed JWT, e.g. from Amazon Cognito)</td><td>The client holds a signed token with its identity and claims; the server verifies the signature</td><td>No server-side session store at all</td><td>Token size; revocation before expiry is hard; never store secrets in it</td></tr>
</tbody></table>` },

    { type: "concept", title: "Scaling each tier, and the laws that limit scaling", html: `
<h3>Each tier scales differently</h3>
` + DG_0402_TIERS + `
<table>
<thead><tr><th>Tier</th><th>Main techniques</th><th>AWS building blocks</th></tr></thead>
<tbody>
<tr><td><strong>Edge</strong></td><td>Cache static and cacheable dynamic content close to users so requests never reach the origin</td><td>CloudFront, S3 (M12, M18)</td></tr>
<tr><td><strong>Web / API</strong></td><td>Stateless instances behind a load balancer, scaled automatically; or serverless</td><td>ALB + EC2 Auto Scaling, ECS/EKS services, Lambda + API Gateway (M14–M16)</td></tr>
<tr><td><strong>Asynchronous work</strong></td><td>Put slow or spiky work on a queue; a separate worker fleet processes it at its own pace and scales on queue depth</td><td>SQS, SNS, EventBridge, workers on ASG/ECS/Lambda (M25)</td></tr>
<tr><td><strong>Data: reads</strong></td><td>Cache hot reads; add read replicas; serve reads from replicas or the cache</td><td>ElastiCache, DAX, RDS/Aurora read replicas (up to 15 for Aurora) (M21, M23)</td></tr>
<tr><td><strong>Data: writes</strong></td><td>Hardest to scale: scale up the primary, batch writes, buffer through a queue, or partition (shard) data across nodes</td><td>Larger instance class, Aurora, DynamoDB (automatic partitioning), sharding by key (M21, M22)</td></tr>
</tbody></table>

<h3>Partitioning (sharding) and hot keys</h3>
<p>To scale writes beyond one machine you split the data by a <strong>partition key</strong> so each node owns a subset: customers A–M on one shard and N–Z on another, or a hash of the customer ID. DynamoDB does this automatically: it hashes the partition key to place items on partitions, and each partition has throughput limits (commonly quoted as 3,000 read capacity units and 1,000 write capacity units per second, and about 10 GB of data).</p>
<p>Partitioning only scales if load is <strong>spread evenly</strong>. A <strong>hot key</strong> or <strong>hot partition</strong> is one key that receives a disproportionate share of traffic: the celebrity's profile, today's date used as a partition key, the single "global counter" item. Adding nodes does not help, because all the traffic for that key still lands on one node. Fixes: choose a high-cardinality key (user ID rather than country), add a random or calculated suffix (write sharding), cache the hot item, or aggregate counters in memory and write periodically.</p>

<h3>Queues absorb spikes</h3>
<p>Synchronous designs must be sized for the peak. If the web tier hands slow work (sending email, resizing images, calling a slow partner API) to an <strong>SQS queue</strong>, the queue absorbs the spike and workers drain it at a steady pace. The user gets a fast "accepted" response, and the worker fleet can be smaller, scale on <em>backlog per instance</em>, and even use Spot. This is called <strong>load levelling</strong>, and it is one of the most frequent "decouple" answers on the exam.</p>

<h3>Little's law: how much concurrency do I need?</h3>
<p><strong>L = λ × W</strong>: the average number of requests in the system (<em>L</em>, concurrency) equals the arrival rate (<em>λ</em>, requests per second) times the average time each spends in the system (<em>W</em>, seconds). It holds for any stable system and is the fastest way to size thread pools, connection pools and Lambda concurrency.</p>
<ul>
  <li>500 requests/s × 0.2 s = <strong>100 requests in flight</strong>.</li>
  <li>Lambda: 2,000 requests/s × 300 ms average duration = <strong>600 concurrent executions</strong>. If duration doubles because a dependency slows down, concurrency doubles too, even though traffic hasn't changed. That is how a slow database can exhaust a concurrency quota.</li>
</ul>

<h3>Amdahl's law: why adding nodes stops helping</h3>
<p>If a fraction <em>p</em> of the work can be parallelised and <em>1 − p</em> must run serially (a single database lock, a single-threaded step, a global counter), the speed-up with <em>n</em> workers is <strong>1 / ((1 − p) + p / n)</strong>. With 90% parallel work and 10 workers, the speed-up is 1 / (0.1 + 0.09) ≈ <strong>5.3×</strong>, not 10×. Even with infinite workers it can never exceed 1 / (1 − p) = 10×. The lesson for architects: <strong>find and remove the serial part</strong> (the shared lock, the single writer, the synchronous dependency) instead of adding more nodes.</p>` },

    { type: "workflow", title: "Finding and removing a scaling bottleneck", html: `
<ol class="flow">
  <li><strong>Define the target:</strong> "sustain 3,000 rps with p99 &lt; 400 ms and error rate &lt; 0.1%". Without a target, you cannot tell when to stop.</li>
  <li><strong>Load-test realistically:</strong> production-like data volume and request mix, ramping up gradually (tools: Distributed Load Testing on AWS, k6, JMeter, Locust). Test the <em>scale-out</em> too, not just a fixed fleet.</li>
  <li><strong>Watch every tier's saturation signals together:</strong> CPU and memory on instances, ALB <code>TargetResponseTime</code> and 5xx, database CPU, connections and lock waits, DynamoDB throttled requests, Lambda throttles and concurrency, queue <code>ApproximateAgeOfOldestMessage</code>.</li>
  <li><strong>Find the first resource to saturate:</strong> latency rising while CPU is low usually means waiting on something else (a lock, a connection pool, a dependency). That is the bottleneck.</li>
  <li><strong>Remove it with the cheapest effective lever:</strong> cache it, replicate it, partition it, queue it, scale it up, or remove it from the request path.</li>
  <li><strong>Retest:</strong> the bottleneck moves to the next weakest component. Repeat until the target is met with headroom.</li>
  <li><strong>Automate:</strong> configure scaling policies on the metric that actually tracked load in the test (requests per target, queue backlog per instance, CPU), plus alarms for the limits you can't auto-scale (database connections, service quotas).</li>
</ol>
<div class="callout">Scaling policies in brief (deep dive in M14): <strong>target tracking</strong> keeps a metric near a value (e.g. 50% CPU or 1,000 requests per target); <strong>step scaling</strong> adds or removes amounts based on alarm bands; <strong>scheduled scaling</strong> pre-scales for known events; <strong>predictive scaling</strong> learns daily/weekly patterns and scales ahead of them.</div>` },

    { type: "aws", html: `
<table>
<thead><tr><th>Need</th><th>AWS service / feature</th><th>Scaling model</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td>Scale web/API servers</td><td>EC2 Auto Scaling + ALB</td><td>Horizontal, policy-driven</td><td>Instance warm-up time; stateful apps; health check grace period</td></tr>
<tr><td>Scale containers</td><td>ECS Service Auto Scaling, EKS (HPA + Karpenter/Cluster Autoscaler), Fargate</td><td>Horizontal (tasks/pods, then nodes)</td><td>Two layers to scale on EC2-backed clusters</td></tr>
<tr><td>Scale functions</td><td>Lambda</td><td>Automatic per request; concurrency = rps × duration</td><td>Account concurrency quota (default 1,000 per Region, can be raised); downstream databases can't keep up</td></tr>
<tr><td>Scale reads on a relational database</td><td>RDS read replicas, Aurora replicas + reader endpoint</td><td>Horizontal for reads</td><td>Replication lag (asynchronous); app must send reads to replicas</td></tr>
<tr><td>Scale writes</td><td>Bigger instance class; Aurora; DynamoDB; sharding</td><td>Vertical, or horizontal by partition</td><td>Hot keys; cross-shard queries and transactions</td></tr>
<tr><td>Absorb spikes</td><td>SQS, Kinesis, EventBridge</td><td>Buffering + independent consumer scaling</td><td>Consumers must be idempotent; FIFO queues have lower throughput limits than standard queues</td></tr>
<tr><td>Offload reads entirely</td><td>CloudFront, ElastiCache, DAX</td><td>Cache hit ratio removes origin load</td><td>Invalidation and stale data</td></tr>
<tr><td>Share sessions</td><td>ElastiCache, DynamoDB (TTL), Cognito tokens</td><td>Externalised state</td><td>Avoid relying on ALB stickiness for correctness</td></tr>
<tr><td>Shared files across nodes</td><td>S3 (objects), EFS (POSIX file system)</td><td>Scales automatically</td><td>Don't write user uploads to an instance's local disk</td></tr>
</tbody></table>
<p><strong>Service quotas</strong> are a scalability limit too: vCPUs per Region for On-Demand instances, Lambda concurrency, API request rates. Check and raise them <em>before</em> a big event; quota increases are not instant.</p>` },

    { type: "examples", html: `
<h3>Example 1: sizing a web tier with Little's law</h3>
<pre><code>Peak traffic             λ = 1,200 requests/s
Average response time    W = 0.25 s
Requests in flight       L = λ × W = 1,200 × 0.25 = 300

Each instance handles ~50 concurrent requests (worker threads, from a load test)
Instances at 100% use    300 ÷ 50 = 6
Target 70% utilisation   6 ÷ 0.7 = 8.6 → 9 instances
Survive 1 of 3 AZs lost  9 must fit in 2 AZs → 5 per AZ (rounded up) → 15 at peak</code></pre>

<h3>Example 2: Lambda concurrency and the downstream database</h3>
<pre><code>1,500 requests/s × 2 s average duration = 3,000 concurrent executions
Default Regional concurrency quota      = 1,000  → throttling (HTTP 429) unless raised

Each execution opens a database connection → 3,000 connections!
Fixes: RDS Proxy to pool connections, reserved concurrency to cap the function,
cache reads, or shorten the duration (the 2 s is probably a slow query).</code></pre>

<h3>Example 3: Amdahl's law in a batch job</h3>
<pre><code>A nightly job: 95% parallel (per-customer work), 5% serial (final report on one node)
  10 workers : 1 / (0.05 + 0.95/10)  = 6.9× faster
  100 workers: 1 / (0.05 + 0.95/100) = 16.8× faster
  ∞ workers  : 1 / 0.05              = 20× maximum

Going from 10 to 100 workers costs 10× more for 2.4× more speed.
Making the final report parallel (5% → 1% serial) raises the ceiling to 100×.</code></pre>

<h3>Example 4: scaling a worker fleet on queue backlog</h3>
<pre><code>Each message takes 0.5 s to process; acceptable delay is 60 s
Acceptable backlog per instance = 60 ÷ 0.5 = 120 messages

Current backlog (ApproximateNumberOfMessagesVisible) = 3,000
Instances needed = 3,000 ÷ 120 = 25

Publish "backlog per instance" as a custom CloudWatch metric and use
target tracking with target = 120 (this is AWS's recommended pattern for SQS-driven ASGs).</code></pre>

<h3>Example 5: target tracking intuition</h3>
<pre><code>4 instances at 80% average CPU, target 50%
Capacity needed ≈ 4 × 80 / 50 = 6.4 → scale out to 7 instances</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Scaling choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Legacy app that keeps sessions in memory, migration deadline next month</td><td>Short term: ALB sticky sessions; then move sessions to ElastiCache</td><td>Sticky sessions buy time without code changes, but don't fix scale-in or failure loss</td></tr>
<tr><td>News site with a viral article</td><td>CloudFront caching with sensible TTLs</td><td>Most requests are identical reads; the edge absorbs them</td></tr>
<tr><td>Image uploads that need resizing</td><td>Upload to S3 → event → SQS/Lambda workers</td><td>Slow work leaves the request path and scales independently</td></tr>
<tr><td>Reporting queries slowing down an OLTP database</td><td>Aurora read replica (reader endpoint) for reports</td><td>Separates read load from the write primary</td></tr>
<tr><td>IoT devices writing 50,000 readings/s</td><td>DynamoDB (or Kinesis then a store) with a high-cardinality partition key</td><td>Writes spread over many partitions; no single write primary</td></tr>
<tr><td>Predictable 09:00 login surge</td><td>Scheduled or predictive scaling</td><td>Capacity is ready before the surge instead of reacting to it</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: see Little's and Amdahl's laws in numbers", html: `
<p>Run this in any terminal with Python 3. It shows how latency, not just traffic, drives the concurrency you must provision, and how the serial fraction caps speed-up.</p>
<pre><code>python3 - &lt;&lt;'EOF'
rps = 2000
for ms in (100, 300, 1000, 3000):
    print(f"{rps} rps at {ms:4d} ms → {rps*ms/1000:6.0f} concurrent")

def amdahl(p, n): return 1 / ((1 - p) + p / n)
for p in (0.5, 0.9, 0.99):
    print(f"p={p}: n=10 → {amdahl(p,10):5.1f}x  n=100 → {amdahl(p,100):5.1f}x  max → {1/(1-p):6.1f}x")
EOF</code></pre>
<p>Expected output:</p>
<pre><code>2000 rps at  100 ms →    200 concurrent
2000 rps at  300 ms →    600 concurrent
2000 rps at 1000 ms →   2000 concurrent
2000 rps at 3000 ms →   6000 concurrent
p=0.5: n=10 →   1.8x  n=100 →   2.0x  max →    2.0x
p=0.9: n=10 →   5.3x  n=100 →   9.2x  max →   10.0x
p=0.99: n=10 →   9.2x  n=100 →  50.3x  max →  100.0x</code></pre>
<p><strong>Observe:</strong> the same traffic needs 30× more concurrency when latency goes from 100 ms to 3 s. A slow dependency is a scaling problem, not just a speed problem. And with only half the work parallel, 100 workers barely beat 10.</p>` },

    { type: "casestudy", title: "Case study: \"Kettle & Crumb\" survives Black Friday", html: `
<p><strong>Context.</strong> Kettle &amp; Crumb, a fictional kitchenware retailer, ran its Java monolith on two large EC2 instances (one per AZ) behind an ALB with sticky sessions enabled. Sessions and the shopping basket lived in server memory; product images uploaded by staff were saved to the instance's local disk and copied nightly with a script; order confirmation emails and PDF invoices were generated inside the checkout request.</p>
<p><strong>The incident.</strong> On Black Friday traffic rose 8×. CPU hit 100% on both instances; the team launched four more by hand. The new instances had no product images (the copy script ran nightly), so pages showed broken images. Sticky sessions kept existing customers pinned to the two overloaded instances, so the new ones sat half idle. When one original instance was restarted to apply a JVM setting, 50% of active baskets vanished. Checkout p99 reached 9 seconds because each request waited for the invoice PDF and the email provider. Estimated lost revenue: about $310,000.</p>
<p><strong>Redesign (eight weeks).</strong></p>
<table>
<thead><tr><th>Problem</th><th>Change</th><th>Effect</th></tr></thead>
<tbody>
<tr><td>Sessions in memory</td><td>Spring Session backed by ElastiCache (Redis OSS, Multi-AZ); stickiness turned off</td><td>Any instance serves any customer; scale-in and restarts lose nothing</td></tr>
<tr><td>Images on local disk</td><td>Images in S3, served via CloudFront</td><td>New instances are complete at boot; 70% less origin traffic</td></tr>
<tr><td>Slow work in checkout</td><td>Checkout writes the order, publishes a message to SQS and returns; workers generate invoices and send emails</td><td>Checkout p99 fell from 9 s to 420 ms</td></tr>
<tr><td>Manual scaling</td><td>Auto Scaling group across 3 AZs, target tracking on requests per target, scheduled pre-scaling for campaign launches</td><td>Capacity follows demand; no 2 a.m. heroics</td></tr>
<tr><td>Database reads</td><td>Product catalogue reads moved to an Aurora replica, with a short cache in ElastiCache</td><td>Primary CPU at peak dropped from 85% to 40%</td></tr>
</tbody></table>
<p><strong>Result.</strong> A load test at 12× normal traffic passed with p99 checkout under 500 ms. The next Black Friday peaked at 10×; the ASG scaled from 6 to 22 instances and back to 6 by midnight. Because the fleet now shrinks overnight, the monthly compute bill fell 18% compared with two always-on large instances, despite handling far more traffic.</p>
<p><strong>Lessons learned.</strong> (1) Adding capacity to a stateful design can make things worse. (2) Sticky sessions are a migration aid, not a scaling strategy. (3) The fastest way to make a request scale is to stop doing slow work inside it. (4) After removing the web bottleneck, the database became the limit. Scaling is always about the next bottleneck.</p>` },

    { type: "exam", html: `
<ul>
  <li>"Users lose their session when the Auto Scaling group scales in" → store sessions in <strong>ElastiCache</strong> or <strong>DynamoDB</strong>. Sticky sessions are a distractor when the stem asks for resilience.</li>
  <li>"Database overwhelmed by read traffic" → <strong>read replicas</strong> and/or <strong>ElastiCache</strong>. "Overwhelmed by writes" → scale up, Aurora, DynamoDB, or buffer writes with <strong>SQS</strong>.</li>
  <li>"Order processing can't keep up during spikes; orders must not be lost" → <strong>SQS</strong> between tiers, consumers in an ASG scaling on queue depth (backlog per instance).</li>
  <li>"Predictable daily or event-driven peaks" → <strong>scheduled</strong> or <strong>predictive scaling</strong>, not only reactive policies.</li>
  <li>"Unpredictable traffic, least operational overhead" → <strong>serverless</strong> (Lambda, API Gateway, DynamoDB on-demand, Fargate).</li>
  <li>"DynamoDB throttling on one key" → hot partition: better partition key, write sharding, or DAX caching for reads.</li>
</ul>
<table>
<thead><tr><th>Concept</th><th>vs</th><th>Key difference</th></tr></thead>
<tbody>
<tr><td>Scale up</td><td>Scale out</td><td>Bigger node (ceiling, restart) vs more nodes (stateless needed, no ceiling)</td></tr>
<tr><td>Scalability</td><td>Elasticity</td><td>Can handle more load vs automatically follows load both ways</td></tr>
<tr><td>Sticky sessions</td><td>Externalised sessions</td><td>Pins a user to one node vs any node can serve any user</td></tr>
<tr><td>Read replica</td><td>Multi-AZ standby</td><td>Scales reads (async) vs high availability (sync, not readable in classic RDS Multi-AZ)</td></tr>
<tr><td>Queue (SQS)</td><td>Direct synchronous call</td><td>Absorbs spikes, decouples vs caller waits and must be sized for peak</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Scale-out speed matters.</strong> An instance that takes 6 minutes to boot and warm up cannot react to a 2-minute spike. Bake software into AMIs or images, use warm pools, pre-scale for known events, or put a queue in front.</li>
  <li><strong>Protect the database from the autoscaler.</strong> 50 new instances × 20 connections each = 1,000 connections. Use connection pooling (RDS Proxy), cap pool sizes, and alarm on database connections.</li>
  <li><strong>Make consumers idempotent.</strong> Queues deliver at least once; horizontally scaled workers will occasionally process a message twice.</li>
  <li><strong>Cache with intent.</strong> Decide TTLs and invalidation up front; a cache stampede (all keys expiring together under load) can take down the origin you were protecting. Add jitter to TTLs.</li>
  <li><strong>Scale the unit cost down, not just the capacity up.</strong> Track cost per request or per order as you scale; elasticity and Spot should make it fall.</li>
  <li><strong>Quotas and limits are part of the design.</strong> Document them next to the capacity estimate and alarm at 80% of each.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Scalability = handle more load by adding resources while meeting targets; elasticity = doing it automatically both ways.</li>
  <li>Vertical scaling is simple but has a ceiling, needs restarts and remains a single point of failure; horizontal scaling has no practical ceiling but requires stateless nodes.</li>
  <li>Move state out of compute: sessions to ElastiCache/DynamoDB/tokens, files to S3/EFS, work to queues.</li>
  <li>Sticky sessions are a stop-gap, not a scaling strategy.</li>
  <li>Reads scale with caches and replicas; writes scale by scaling up, buffering or partitioning. Hot keys defeat partitioning.</li>
  <li>Queues (SQS) level load and let workers scale on backlog per instance.</li>
  <li>Little's law: concurrency = arrival rate × time in system. Amdahl's law: the serial fraction caps speed-up at 1/(1 − p).</li>
  <li>Scaling is a loop: load-test, find the first saturated resource, remove it, retest.</li>
</ul>` }
  ],
  drills: [
    { id: "M04.02-d1", q: "A service receives 500 requests/s and each request spends 0.2 s in the system. How many requests are in flight on average (Little's law)?", answers: ["100"], hint: "L = λ × W", explain: "500 × 0.2 = 100 concurrent requests." },
    { id: "M04.02-d2", q: "A Lambda function receives 2,000 requests/s with an average duration of 300 ms. How many concurrent executions does it need?", answers: ["600"], hint: "Concurrency = rps × duration in seconds.", explain: "2,000 × 0.3 = 600 concurrent executions." },
    { id: "M04.02-d3", q: "A system holds 50 requests in flight on average and the average latency is 0.25 s. What is its throughput in requests per second?", answers: ["200"], hint: "Rearrange Little's law: λ = L / W.", explain: "50 ÷ 0.25 = 200 requests/s." },
    { id: "M04.02-d4", q: "A job is 90% parallelisable. What speed-up do 10 workers give (Amdahl's law)? Answer to 2 decimal places.", answers: ["5.26", "5.26x"], hint: "1 / ((1 − p) + p / n)", explain: "1 / (0.1 + 0.09) = 1 / 0.19 = 5.26×." },
    { id: "M04.02-d5", q: "A job is 95% parallelisable. What is the maximum possible speed-up with unlimited workers?", answers: ["20", "20x"], hint: "Let n → ∞: 1 / (1 − p).", explain: "1 / 0.05 = 20×. The 5% serial part caps it." },
    { id: "M04.02-d6", q: "4 instances run at 80% average CPU. Target tracking aims for 50%. Using the proportional estimate and rounding up, how many instances will the group scale to?", answers: ["7"], hint: "4 × 80 / 50", explain: "4 × 80 / 50 = 6.4, rounded up to 7." },
    { id: "M04.02-d7", q: "Each SQS message takes 0.5 s to process and the acceptable delay is 60 s. The backlog is 3,000 messages. How many worker instances do you need?", answers: ["25"], hint: "Acceptable backlog per instance = 60 ÷ 0.5.", explain: "120 messages per instance; 3,000 ÷ 120 = 25 instances." },
    { id: "M04.02-d8", q: "Reads total 9,000 queries/s. Each read replica handles 2,000 queries/s and the primary takes no reads. What is the minimum number of read replicas?", answers: ["5"], hint: "Divide and round up.", explain: "9,000 ÷ 2,000 = 4.5 → 5 replicas (before headroom)." },
    { id: "M04.02-d9", q: "Adding more instances to an Auto Scaling group is called scaling ___. (one word)", answers: ["out"], explain: "Scale out / in = horizontal (more or fewer nodes). Scale up / down = vertical (bigger or smaller node)." },
    { id: "M04.02-d10", q: "A Lambda function's traffic stays at 1,000 requests/s but its average duration rises from 0.5 s to 2 s because the database slowed down. By what factor does required concurrency increase?", answers: ["4", "4x"], hint: "Concurrency is proportional to duration.", explain: "500 → 2,000 concurrent executions: 4×, with no change in traffic." }
  ],
  check: [
    { id: "M04.02-k1", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A web application runs on EC2 instances in an Auto Scaling group behind an Application Load Balancer. Users report being logged out at random, usually when the group scales in. Session data is stored in instance memory. Which solution resolves the issue and keeps the application horizontally scalable?",
      options: [
        { t: "Store session data in Amazon ElastiCache and make the instances stateless", c: true, why: "Externalised sessions let any instance serve any user, so scale-in and instance failures no longer lose sessions." },
        { t: "Enable sticky sessions on the ALB target group", c: false, why: "Stickiness reduces the symptom but sessions are still lost when the pinned instance is terminated or fails." },
        { t: "Disable scale-in on the Auto Scaling group", c: false, why: "This wastes money and still loses sessions when an instance fails." },
        { t: "Use larger instance types and fewer instances", c: false, why: "Vertical scaling doesn't fix in-memory state and reduces redundancy." }
      ] },
    { id: "M04.02-k2", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "An application on Amazon RDS for MySQL is slow during business hours. Monitoring shows 90% of database load is SELECT queries for product data that changes a few times a day. Which approach improves performance MOST cost-effectively?",
      options: [
        { t: "Cache product data in Amazon ElastiCache and add a read replica for remaining reads", c: true, why: "Read-heavy, rarely changing data is ideal for caching; replicas absorb the rest of the read load without touching the write path." },
        { t: "Scale the DB instance to the largest available class", c: false, why: "It helps, but costs much more and still has a ceiling; the workload is read-heavy and cacheable." },
        { t: "Enable Multi-AZ", c: false, why: "Multi-AZ improves availability; the classic standby doesn't serve reads." },
        { t: "Migrate the database to EC2 instance store volumes", c: false, why: "That adds operational burden and risks data loss without addressing read scaling." }
      ] },
    { id: "M04.02-k3", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "An order-processing system receives sudden bursts of orders. During bursts, the processing servers are overwhelmed and some orders are lost. The company needs every order to be processed, even if processing is delayed. What should the architect do?",
      options: [
        { t: "Send orders to an Amazon SQS queue and process them with an Auto Scaling group that scales on queue backlog per instance", c: true, why: "The queue durably absorbs bursts (no lost orders) and the consumers scale to drain it." },
        { t: "Increase the instance size of the processing servers", c: false, why: "Bigger servers raise the ceiling but bursts can still exceed it, and orders are still lost when they do." },
        { t: "Put the processing servers behind a Network Load Balancer", c: false, why: "Load balancing spreads requests but doesn't buffer them or prevent loss under overload." },
        { t: "Process orders with a cron job every 5 minutes", c: false, why: "That doesn't provide a durable buffer and adds a fixed delay." }
      ] },
    { id: "M04.02-k4", type: "multi", domain: "D2", task: "2.1", level: 200,
      stem: "A team is preparing a monolithic web application to run in an EC2 Auto Scaling group. Which changes make the instances stateless so they can be added and removed freely? (Select TWO.)",
      options: [
        { t: "Store user-uploaded files in Amazon S3 instead of on the instance's local disk", c: true, why: "Files in S3 are available to every instance and survive instance termination." },
        { t: "Store user sessions in Amazon DynamoDB or ElastiCache", c: true, why: "Externalised sessions remove per-instance state." },
        { t: "Enable sticky sessions with a 24-hour duration", c: false, why: "Stickiness pins users to instances; state still lives on the instance." },
        { t: "Store temporary user data on instance store volumes", c: false, why: "Instance store is local to one instance and lost on stop or termination." },
        { t: "Use a larger EBS volume on each instance", c: false, why: "Local storage on each instance is still per-instance state." }
      ] },
    { id: "M04.02-k5", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "An IoT platform writes sensor readings to an Amazon DynamoDB table using the date (for example 2026-10-07) as the partition key. Writes are throttled even though the table's total provisioned capacity is far above the write rate. What is the MOST likely cause and fix?",
      options: [
        { t: "A hot partition: all of today's writes share one key. Use a high-cardinality key such as device ID (optionally with the date as sort key)", c: true, why: "DynamoDB spreads load by partition key. One key per day concentrates every write on one partition, which has its own throughput limit." },
        { t: "The table needs more provisioned capacity", c: false, why: "Total capacity isn't the limit; the per-partition limit for the single hot key is." },
        { t: "DynamoDB cannot handle IoT write rates; use RDS instead", c: false, why: "DynamoDB handles very high write rates when the key spreads load evenly." },
        { t: "Enable DynamoDB Accelerator (DAX)", c: false, why: "DAX caches reads; it doesn't help write throttling." }
      ] },
    { id: "M04.02-k6", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "An API on AWS Lambda receives a steady 1,500 requests per second. Average function duration is 2 seconds. The account uses the default Regional concurrency quota. Users see HTTP 429 errors. What is the cause?",
      options: [
        { t: "The function needs about 3,000 concurrent executions, above the default quota of 1,000; reduce duration and/or request a quota increase", c: true, why: "Little's law: 1,500 × 2 = 3,000 concurrent executions, so requests beyond the quota are throttled." },
        { t: "Lambda cannot handle more than 1,000 requests per second", c: false, why: "The limit is on concurrency, not requests per second. Shorter functions handle far more rps with the same concurrency." },
        { t: "The function's memory is too high", c: false, why: "Memory affects cost and CPU, not the concurrency quota." },
        { t: "API Gateway is caching responses", c: false, why: "Caching would reduce Lambda invocations, not cause throttling." }
      ] }
  ],
  cards: ["fc-M04-2-01", "fc-M04-2-02", "fc-M04-2-03", "fc-M04-2-04", "fc-M04-2-05", "fc-M04-2-06", "fc-M04-2-07", "fc-M04-2-08", "fc-M04-2-09", "fc-M04-2-10", "fc-M04-2-11"],
  references: [
    "<em>System Design on AWS</em> ch.1 \"Scalability\" (PDF p22–50) and ch.5 on scaling approaches (PDF p215+)",
    "Amazon EC2 Auto Scaling User Guide: <em>Scaling policy based on Amazon SQS</em> (backlog per instance)",
    "AWS Lambda Developer Guide: <em>Understanding Lambda function scaling</em> (concurrency)",
    "Amazon DynamoDB Developer Guide: <em>Best practices for designing and using partition keys effectively</em>",
    "AWS Well-Architected Framework, Performance Efficiency Pillar"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-2-01", front: "Scale up vs scale out?", back: "Up (vertical): bigger node; ceiling, restart, still a SPOF. Out (horizontal): more nodes; near-linear, no downtime, needs stateless design." },
  { id: "fc-M04-2-02", front: "Why does statelessness enable horizontal scaling?", back: "Any instance can serve any request, so the LB can route anywhere and Auto Scaling can add, remove or replace instances without losing data." },
  { id: "fc-M04-2-03", front: "Four ways to externalise sessions?", back: "ALB sticky sessions (stop-gap), ElastiCache, DynamoDB with TTL, client-side signed tokens (JWT/Cognito)." },
  { id: "fc-M04-2-04", front: "Why are sticky sessions not a real fix?", back: "Sessions still live on one instance: lost on failure or scale-in, and load becomes uneven." },
  { id: "fc-M04-2-05", front: "How do reads vs writes scale?", back: "Reads: caches (ElastiCache, DAX, CloudFront) and read replicas. Writes: scale up, buffer with queues, or partition/shard (DynamoDB)." },
  { id: "fc-M04-2-06", front: "What is a hot partition / hot key?", back: "One key receiving a disproportionate share of traffic, so one partition saturates while others idle. Fix: high-cardinality key, write sharding, caching." },
  { id: "fc-M04-2-07", front: "Little's law?", back: "L = λ × W: concurrency = arrival rate × time in system. Lambda concurrency = rps × duration (s)." },
  { id: "fc-M04-2-08", front: "Amdahl's law?", back: "Speed-up = 1 / ((1 − p) + p/n). Maximum = 1 / (1 − p). Remove the serial part instead of adding nodes." },
  { id: "fc-M04-2-09", front: "How should an SQS-driven worker ASG scale?", back: "Target tracking on backlog per instance = visible messages ÷ instances, with target = acceptable latency ÷ processing time per message." },
  { id: "fc-M04-2-10", front: "Four EC2 Auto Scaling policy types?", back: "Target tracking, step, scheduled, predictive." },
  { id: "fc-M04-2-11", front: "Read replica vs Multi-AZ standby?", back: "Read replica: async copy that serves reads (performance). Multi-AZ standby: sync copy for failover (availability), not readable in classic RDS Multi-AZ." }
);
// ================================================================== 03_availability.js
/* ---------------------------------------------------------------- M04.03 Availability and reliability */
var DG_0403_RPO = `
<figure>
<svg class="diagram" viewBox="0 0 760 230" role="img" aria-labelledby="m0403at m0403ad">
  <title id="m0403at">RPO versus RTO on a timeline</title>
  <desc id="m0403ad">A timeline with three events: the last recovery point, the disaster, and the moment service is restored. The span from the last recovery point back from the disaster is the recovery point objective, the data you lose. The span from the disaster to restoration is the recovery time objective, the time you are down.</desc>
  <defs><marker id="m0403a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="24" y="26">Recovery Point Objective vs Recovery Time Objective</text>
  <path class="dg-link" d="M190 96 V84 H380 V96"/>
  <text class="dg-ta" x="226" y="74">RPO · data you lose</text>
  <path class="dg-link" d="M380 96 V84 H590 V96"/>
  <text class="dg-ta" x="420" y="74">RTO · time you're down</text>
  <path class="dg-line" d="M30 120 H730" marker-end="url(#m0403a-ar)"/>
  <text class="dg-ts" x="690" y="140">time</text>
  <circle class="dg-good" cx="190" cy="120" r="9"/>
  <circle class="dg-bad" cx="380" cy="120" r="9"/>
  <circle class="dg-good" cx="590" cy="120" r="9"/>
  <text class="dg-t" x="120" y="152">Last recovery point</text>
  <text class="dg-ts" x="120" y="168">backup, snapshot, replica</text>
  <text class="dg-t" x="350" y="152">Disaster</text>
  <text class="dg-ts" x="330" y="168">outage, corruption</text>
  <text class="dg-t" x="530" y="152">Service restored</text>
  <text class="dg-ts" x="530" y="168">traffic back, data usable</text>
  <text class="dg-ts" x="30" y="198">RPO is driven by how often data is copied: backup interval or replication lag.</text>
  <text class="dg-ts" x="30" y="214">RTO is driven by detect + decide + recover time: automation shortens all three.</text>
</svg>
<figcaption>Figure M04-3a. RPO looks backwards from the disaster (how much recent data is gone); RTO looks forwards (how long until the business works again).</figcaption>
</figure>`;

var DG_0403_SERIES = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0403bt m0403bd">
  <title id="m0403bt">Availability of components in series and in parallel</title>
  <desc id="m0403bd">Top: a load balancer at 99.99 percent, one app server at 99.9 percent and one database at 99.95 percent in series give about 99.84 percent, around 14 hours of downtime a year. Bottom: the same load balancer with two app servers in different AZs and a Multi-AZ database pair gives about 99.99 percent, now limited by the load balancer.</desc>
  <defs><marker id="m0403b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="16" y="22">In series: every component must be up (multiply)</text>
  <rect class="dg-box" x="16" y="38" width="150" height="56" rx="6"/><text class="dg-t" x="28" y="60">Load balancer</text><text class="dg-ts" x="28" y="80">99.99%</text>
  <rect class="dg-box" x="216" y="38" width="150" height="56" rx="6"/><text class="dg-t" x="228" y="60">1 app server</text><text class="dg-ts" x="228" y="80">99.9%</text>
  <rect class="dg-box" x="416" y="38" width="150" height="56" rx="6"/><text class="dg-t" x="428" y="60">1 database</text><text class="dg-ts" x="428" y="80">99.95%</text>
  <rect class="dg-bad" x="616" y="32" width="134" height="68" rx="6"/><text class="dg-tb" x="628" y="52">System</text><text class="dg-t" x="628" y="70">≈ 99.84%</text><text class="dg-ts" x="628" y="88">≈ 14 h down/yr</text>
  <path class="dg-line" d="M166 66 H214" marker-end="url(#m0403b-ar)"/><path class="dg-line" d="M366 66 H414" marker-end="url(#m0403b-ar)"/><path class="dg-line" d="M566 66 H614" marker-end="url(#m0403b-ar)"/>

  <text class="dg-tb" x="16" y="134">In parallel: a tier is down only if ALL its copies are down</text>
  <rect class="dg-box" x="16" y="176" width="150" height="56" rx="6"/><text class="dg-t" x="28" y="198">Load balancer</text><text class="dg-ts" x="28" y="218">99.99% (multi-AZ)</text>
  <rect class="dg-info" x="216" y="150" width="150" height="40" rx="6"/><text class="dg-t" x="228" y="167">App server</text><text class="dg-ts" x="228" y="182">AZ a · 99.9%</text>
  <rect class="dg-info" x="216" y="218" width="150" height="40" rx="6"/><text class="dg-t" x="228" y="235">App server</text><text class="dg-ts" x="228" y="250">AZ b · 99.9%</text>
  <rect class="dg-info" x="416" y="150" width="150" height="40" rx="6"/><text class="dg-t" x="428" y="167">DB primary</text><text class="dg-ts" x="428" y="182">AZ a · 99.95%</text>
  <rect class="dg-info" x="416" y="218" width="150" height="40" rx="6"/><text class="dg-t" x="428" y="235">DB standby</text><text class="dg-ts" x="428" y="250">AZ b · 99.95%</text>
  <rect class="dg-good" x="616" y="170" width="134" height="68" rx="6"/><text class="dg-tb" x="628" y="190">System</text><text class="dg-t" x="628" y="208">≈ 99.99%</text><text class="dg-ts" x="628" y="226">LB now dominates</text>
  <path class="dg-line" d="M166 196 L214 172" marker-end="url(#m0403b-ar)"/><path class="dg-line" d="M166 212 L214 236" marker-end="url(#m0403b-ar)"/><path class="dg-line" d="M366 170 H414" marker-end="url(#m0403b-ar)"/><path class="dg-line" d="M366 238 H414" marker-end="url(#m0403b-ar)"/><path class="dg-line" d="M566 204 H614" marker-end="url(#m0403b-ar)"/>
  <text class="dg-ts" x="16" y="286">Assumes independent failures. Shared dependencies (same AZ, same deploy, same config) break the maths.</text>
</svg>
<figcaption>Figure M04-3b. Chaining single components multiplies their unavailability. Duplicating each tier across AZs removes the single points of failure.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.03", title: "Availability and reliability", level: 200, minutes: 55,
  objectives: [
    "Distinguish availability, reliability, durability and resilience, and translate a number of nines into a downtime budget",
    "Calculate the availability of serial and redundant systems, and use MTBF, MTTR and MTTD to choose the cheapest improvement",
    "Find single points of failure and remove them with redundancy, static stability and failover",
    "Explain RPO and RTO and choose a disaster-recovery strategy that meets them",
    "Apply resilience patterns (timeouts, retries with backoff and jitter, circuit breakers, bulkheads, idempotency, graceful degradation) and map them to AWS services"
  ],
  sections: [
    { type: "why", html: `
<p>At 02:14 on a Saturday, one Availability Zone in your Region has a power event. Two SaaS companies run in that Region. The first runs one EC2 instance, one database and one NAT gateway, all in the affected AZ: it is down for six hours and loses the last 20 hours of orders because the only backup ran the night before. The second runs the same application in three AZs behind a load balancer with a Multi-AZ database: its dashboards show a brief error spike, a database failover of about a minute, and then nothing. Nobody is paged out of bed for long.</p>
<p>The difference is not luck or budget. It is a handful of design decisions you will learn in this lesson. Domain 2 of the SAA-C03 exam ("Design Resilient Architectures", 26% of the score) is built on exactly these ideas: removing single points of failure, choosing between active-active and active-passive, meeting an RPO and RTO, and picking the right DR strategy. As an architect, you will also be the person who turns a vague "it must always be up" into numbers the business can pay for.</p>` },

    { type: "concept", title: "Concept: the vocabulary of resilience", html: DG_0403_SERIES + `
<h3>Four words that are often confused</h3>
<table>
<thead><tr><th>Term</th><th>Question it answers</th><th>Typical measure</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Availability</strong></td><td>Is the system usable <em>right now</em>?</td><td>% of time (or of requests) served successfully</td><td>"The API answered 99.95% of requests this month."</td></tr>
<tr><td><strong>Reliability</strong></td><td>Does it keep working correctly <em>over a period</em>?</td><td>Mean time between failures (MTBF), failure rate</td><td>"The batch job fails about once every 400 runs."</td></tr>
<tr><td><strong>Durability</strong></td><td>Will my stored data still exist and be intact?</td><td>Probability of not losing an object per year</td><td>S3 Standard is designed for 99.999999999% (11 nines) durability</td></tr>
<tr><td><strong>Resilience</strong></td><td>How well does it <em>absorb and recover</em> from failure?</td><td>RTO, RPO, MTTR, behaviour under fault injection</td><td>"An AZ loss causes 60 s of errors and no data loss."</td></tr>
</tbody></table>
<div class="callout"><strong>Durability is not availability.</strong> S3 Standard is designed for 11 nines of durability but 99.99% availability. During a rare S3 availability event your objects are still safe; you just can't read them for a while. An exam answer that offers "S3 for high availability of a website" and another offering "S3 for durable storage of backups" are describing different properties.</div>

<h3>The nines and their downtime budgets</h3>
<p>Availability targets are usually expressed as "nines". Each extra nine cuts the allowed downtime by 10×, and usually raises cost and complexity sharply.</p>
<table>
<thead><tr><th>Availability</th><th>Downtime per year</th><th>Downtime per 30-day month</th><th>What it usually needs</th></tr></thead>
<tbody>
<tr><td>99% ("two nines")</td><td>3.65 days</td><td>7.2 hours</td><td>A single server with backups</td></tr>
<tr><td>99.5%</td><td>1.83 days</td><td>3.6 hours</td><td>Single server, fast restore procedures</td></tr>
<tr><td>99.9% ("three nines")</td><td>8.76 hours</td><td>43.2 minutes</td><td>Redundancy in one AZ or multi-AZ, automated recovery</td></tr>
<tr><td>99.95%</td><td>4.38 hours</td><td>21.6 minutes</td><td>Multi-AZ for every tier, automated failover</td></tr>
<tr><td>99.99% ("four nines")</td><td>52.6 minutes</td><td>4.32 minutes</td><td>Multi-AZ, no manual steps in recovery, safe deployments</td></tr>
<tr><td>99.999% ("five nines")</td><td>5.26 minutes</td><td>25.9 seconds</td><td>Multi-Region active-active, cell architecture, heavy investment</td></tr>
</tbody></table>
<p>The formula is simply <code>downtime = (1 − availability) × period</code>. A year has 8,760 hours; a 30-day month has 43,200 minutes.</p>

<h3>Combining components</h3>
<ul>
  <li><strong>In series</strong> (each request needs every component): <code>A = A₁ × A₂ × … × Aₙ</code>. The system is always <em>less</em> available than its weakest part. Figure M04-3b: 99.99% × 99.9% × 99.95% ≈ 99.84%.</li>
  <li><strong>In parallel</strong> (any one of n redundant copies is enough): <code>A = 1 − (1 − A₁)(1 − A₂)…</code>. Two independent 99% servers give 1 − 0.01 × 0.01 = 99.99%.</li>
  <li>Real systems are series chains of parallel tiers. Make every tier redundant and the weakest <em>non-redundant</em> component sets the ceiling.</li>
</ul>
<div class="callout warn"><strong>The independence trap.</strong> The parallel formula assumes the copies fail <em>independently</em>. Two servers in the same AZ, deployed from the same bad build, or reading the same broken configuration fail <em>together</em>, and the maths collapses. This is why AWS designs push copies into separate AZs, deploy gradually, and keep blast radius small.</div>

<h3>How systems actually fail</h3>
<table>
<thead><tr><th>Failure mode</th><th>Example</th><th>Typical defence</th></tr></thead>
<tbody>
<tr><td>Hardware</td><td>Host, disk or network card failure</td><td>Redundant instances, EBS replication within the AZ, auto recovery, ASG replacement</td></tr>
<tr><td>Software bugs</td><td>Memory leak, crash on a malformed input</td><td>Health checks, automatic restarts, canary deployments</td></tr>
<tr><td>Deployments and changes</td><td>A bad release or configuration push (the most common cause of outages in practice)</td><td>Blue/green, canary, automatic rollback, feature flags</td></tr>
<tr><td>Dependencies</td><td>A downstream API or database becomes slow</td><td>Timeouts, circuit breakers, bulkheads, caching, graceful degradation</td></tr>
<tr><td>Capacity</td><td>Traffic spike exhausts CPU, connections or quotas</td><td>Auto Scaling, load shedding, queues, quota monitoring</td></tr>
<tr><td>Data corruption or deletion</td><td>Bad migration, ransomware, operator error</td><td>Point-in-time recovery, versioning, immutable backups (replication copies corruption too)</td></tr>
<tr><td>AZ or Region event</td><td>Power or network loss in a data-centre group</td><td>Multi-AZ by default; multi-Region for the highest tiers</td></tr>
</tbody></table>

<h3>Single points of failure (SPOFs)</h3>
<p>A <strong>single point of failure</strong> is any component whose failure alone takes the system down. To find them, draw the <strong>dependency graph</strong> of one user request (every box it touches, including DNS, certificates, NAT, secrets, third-party APIs) and ask of each box: "if only this failed, would users notice?" Typical hidden SPOFs: a single NAT gateway, a single-AZ database, one EC2 "jump box" that runs cron jobs, a hard-coded IP address, a licence server, one person who knows how to restore the backups.</p>

<h3>Redundancy models</h3>
<ul>
  <li><strong>Active-active:</strong> all copies serve traffic all the time (EC2 instances behind a load balancer across AZs). Failover is just "stop sending to the dead one", so it is fast, and the spare capacity is exercised continuously.</li>
  <li><strong>Active-passive (standby):</strong> one copy serves; a standby takes over on failure (RDS Multi-AZ, Route 53 failover routing). Simpler for stateful systems but failover takes time and the standby may hide problems until you need it.</li>
  <li><strong>N+1 / N+2:</strong> if you need N units for peak load, run N+1 (survive one failure) or N+2 (survive one failure during maintenance).</li>
  <li><strong>Static stability:</strong> provision enough capacity <em>in advance</em> that losing an AZ needs no scaling action at all. If peak needs 6 instances across 3 AZs, run 3 per AZ (9 total) so the surviving two AZs still carry 6. Recovery that depends on launching new capacity during a regional event is recovery that might not happen.</li>
</ul>

<h3>MTBF, MTTR and MTTD</h3>
<ul>
  <li><strong>MTBF</strong> (mean time between failures): how long it typically runs before failing. Raised by better components and testing.</li>
  <li><strong>MTTD</strong> (mean time to detect): how long before anyone (or anything) notices.</li>
  <li><strong>MTTR</strong> (mean time to repair/recover): from failure to restored service. It contains MTTD.</li>
</ul>
<p><code>Availability = MTBF / (MTBF + MTTR)</code>. With MTBF = 1,000 h and MTTR = 1 h you get 99.90%. Doubling MTBF to 2,000 h gives 99.95%. Cutting MTTR to 6 minutes (0.1 h) instead gives 99.99%. <strong>Shortening recovery is usually cheaper and more effective than preventing every failure</strong>, which is why automation (health checks, auto-replacement, automatic failover) dominates AWS designs.</p>

<h3>RPO and RTO</h3>
` + DG_0403_RPO + `
<ul>
  <li><strong>Recovery Point Objective (RPO):</strong> the maximum acceptable data loss, measured in time. Nightly backups give an RPO of up to 24 h; asynchronous replication gives seconds; synchronous replication gives zero (for that failure scope).</li>
  <li><strong>Recovery Time Objective (RTO):</strong> the maximum acceptable time to restore service.</li>
  <li>Both are <strong>business decisions</strong> priced by the architect. Lower numbers cost more: more replicas, more running standby capacity, more automation and testing.</li>
</ul>

<h3>Disaster-recovery strategies (introduced here, deep dive in M33)</h3>
<table>
<thead><tr><th>Strategy</th><th>What runs in the recovery Region</th><th>Typical RPO / RTO</th><th>Cost</th></tr></thead>
<tbody>
<tr><td><strong>Backup and restore</strong></td><td>Nothing; backups are copied there</td><td>Hours / hours</td><td>$</td></tr>
<tr><td><strong>Pilot light</strong></td><td>Data replicated live; core infrastructure defined but app servers off or minimal</td><td>Minutes / tens of minutes</td><td>$$</td></tr>
<tr><td><strong>Warm standby</strong></td><td>A scaled-down but fully working copy, scaled up on failover</td><td>Seconds–minutes / minutes</td><td>$$$</td></tr>
<tr><td><strong>Multi-site active-active</strong></td><td>Full production serving traffic in both Regions</td><td>Near zero / near zero</td><td>$$$$</td></tr>
</tbody></table>` },

    { type: "concept", title: "Concept: resilience patterns inside the application", html: `
<p>Redundant infrastructure is not enough if the software turns one slow dependency into a total outage. These patterns are previewed here and treated in depth in M40.</p>
<h3>Timeouts</h3>
<p>Every network call needs a timeout shorter than the caller's own deadline. Without one, threads and connections pile up waiting on a dependency that will never answer, and the caller fails too (a <em>cascading failure</em>). Default SDK and HTTP-client timeouts are often far too long for interactive requests.</p>
<h3>Retries with exponential backoff and jitter</h3>
<p>Many failures are transient (a throttled API, a brief network blip), so retrying helps. Retrying <em>immediately</em> and <em>in lockstep</em> hurts: thousands of clients hammer a recovering service at the same instant (a <em>retry storm</em> or <em>thundering herd</em>). The cure:</p>
<ul>
  <li><strong>Exponential backoff:</strong> wait <code>base × 2^(attempt − 1)</code>, e.g. 100, 200, 400, 800 ms, up to a cap.</li>
  <li><strong>Jitter:</strong> randomise each wait (e.g. "full jitter": a random value between 0 and the backoff) so clients spread out.</li>
  <li><strong>Limited attempts</strong> and retries only for <em>retryable</em> errors (throttling, 5xx, timeouts), never for validation errors.</li>
</ul>
<p>The AWS SDKs and CLI already do this (the <em>standard</em> and <em>adaptive</em> retry modes from M03.02).</p>
<h3>Idempotency</h3>
<p>A retried request may arrive twice. An <strong>idempotent</strong> operation gives the same result no matter how many times it is applied: "set balance to 100" is idempotent, "add 10 to balance" is not. Make writes idempotent with an <em>idempotency key</em> (a client-generated request ID stored with the result; a repeat returns the stored result). Many AWS APIs accept a <code>ClientToken</code> for exactly this reason.</p>
<h3>Circuit breakers</h3>
<p>After repeated failures to a dependency, a circuit breaker "opens" and fails fast (or serves a fallback) for a cooling-off period instead of waiting on timeouts, then lets a few test requests through ("half-open"). This protects both the caller's resources and the struggling dependency.</p>
<h3>Bulkheads</h3>
<p>Separate pools of threads, connections or even whole deployments per dependency or per customer group, so one flooded compartment cannot sink the ship. On AWS: separate ASGs or ECS services per function, separate Lambda reserved concurrency, <strong>cell-based architectures</strong> where each cell serves a subset of customers.</p>
<h3>Graceful degradation and load shedding</h3>
<p>When something non-critical fails, keep the core working: show the product page without personalised recommendations, accept orders into a queue and process them later, serve stale cached data. When overloaded, reject excess requests early and cheaply (HTTP 429/503) rather than letting every request slow down.</p>
<h3>Blast radius</h3>
<p>Design so that any single failure affects as little as possible: per-AZ independence (each AZ's instances talk to their own AZ's NAT gateway and cache nodes), cells, separate accounts per environment, gradual deployments (one AZ or one percent at a time).</p>` },

    { type: "workflow", title: "Workflows: an AZ failure, step by step, and a SPOF review", html: `
<h3>What happens when an AZ fails (multi-AZ web application)</h3>
<ol class="flow">
  <li><strong>Failure (t = 0):</strong> AZ b loses power. Its EC2 instances, its NAT gateway and the RDS primary (which happened to be in AZ b) stop responding.</li>
  <li><strong>Detection (≈ 10–60 s):</strong> the ALB's health checks to targets in AZ b fail. After the configured unhealthy threshold, those targets are marked unhealthy. RDS's own monitoring detects the primary is unreachable.</li>
  <li><strong>Traffic shift (seconds):</strong> the ALB stops routing to unhealthy targets; the remaining AZs serve all requests. With static stability, they already have enough capacity.</li>
  <li><strong>Database failover (≈ 60–120 s for RDS Multi-AZ instance):</strong> RDS promotes the synchronous standby in AZ a and flips the DNS record of the endpoint to it. Applications reconnect (they must handle dropped connections and retry). Aurora typically fails over faster, often in about 30 seconds or less when a replica exists; Multi-AZ DB clusters with two readable standbys are also faster than a Multi-AZ instance.</li>
  <li><strong>Capacity replacement (minutes):</strong> the Auto Scaling group sees unhealthy or missing instances and launches replacements in the healthy AZs to restore the desired count.</li>
  <li><strong>Outbound traffic:</strong> private instances in AZ a and c keep using their own NAT gateways. If every private subnet had pointed at one NAT gateway in AZ b, outbound calls (payment APIs, OS updates) would have failed everywhere: a hidden SPOF.</li>
  <li><strong>Recovery of the AZ:</strong> when AZ b returns, the ASG rebalances, RDS re-creates a standby, and the system is back to full redundancy. Nobody did anything by hand.</li>
</ol>

<h3>A repeatable SPOF and resilience review</h3>
<ol class="flow">
  <li><strong>Agree targets with the business:</strong> availability SLO, RPO and RTO per workload (not one number for everything).</li>
  <li><strong>Draw the request path and data path:</strong> DNS → CDN → load balancer → compute → cache → database → storage, plus NAT, secrets, identity, third parties, and the deployment pipeline.</li>
  <li><strong>Mark each component's scope:</strong> zonal, Regional or global (from M01.02). Every zonal component needs a copy in another AZ.</li>
  <li><strong>Ask "what if only this fails?"</strong> for each box, then "what if this AZ fails?" and "what if a bad deploy ships?".</li>
  <li><strong>Calculate</strong> the series/parallel availability and compare with the SLO. Identify the weakest link.</li>
  <li><strong>Fix the biggest gap first</strong> with redundancy, automation or a design change, and record the decision in an ADR (M04.09).</li>
  <li><strong>Test it:</strong> fault injection (AWS Fault Injection Service), game days, restore drills. An untested backup or failover is a hope, not a plan.</li>
</ol>` },

    { type: "aws", html: `
<table>
<thead><tr><th>Concept</th><th>AWS implementation</th><th>Notes and exam hooks</th></tr></thead>
<tbody>
<tr><td>Redundant compute</td><td>EC2 Auto Scaling group spanning subnets in ≥ 2 AZs behind an ALB/NLB (M12, M14); ECS services and EKS node groups across AZs (M15)</td><td>Use <strong>ELB health checks</strong> on the ASG so instances that fail application checks are replaced, not just ones whose hardware fails</td></tr>
<tr><td>Serverless redundancy</td><td>Lambda, SQS, SNS, DynamoDB, S3, API Gateway are Regional and multi-AZ by design</td><td>"Least operational overhead + highly available" often points here</td></tr>
<tr><td>Database HA</td><td>RDS Multi-AZ (synchronous standby, automatic failover); Multi-AZ DB cluster; Aurora (storage replicated six ways across three AZs, replicas as failover targets) (M21)</td><td>Read replicas are for <strong>scaling reads</strong> (asynchronous); Multi-AZ standby is for <strong>availability</strong></td></tr>
<tr><td>Cross-Region data</td><td>Aurora Global Database (typically sub-second replication), DynamoDB global tables, S3 Cross-Region Replication, RDS cross-Region read replicas</td><td>The building blocks of pilot light, warm standby and active-active (M33)</td></tr>
<tr><td>Health checks and failover</td><td>ALB/NLB target health checks; Route 53 health checks with failover, weighted or latency routing (M12)</td><td>DNS failover is limited by TTL and client caching; keep TTLs low on failover records</td></tr>
<tr><td>Outbound redundancy</td><td>One NAT gateway per AZ, each private route table pointing to its own AZ's NAT gateway (M02.03, M09)</td><td>A single NAT gateway is a zonal SPOF and causes cross-AZ data charges</td></tr>
<tr><td>Backups</td><td>AWS Backup (central policies, cross-Region and cross-account copies, Vault Lock for immutability); RDS automated backups with point-in-time recovery; EBS snapshots; S3 Versioning and Object Lock (M20)</td><td>Replication is not a backup: it faithfully replicates deletions and corruption</td></tr>
<tr><td>Server DR</td><td>AWS Elastic Disaster Recovery (continuous block-level replication, RPO of seconds, RTO of minutes)</td><td>"Replicate on-premises or EC2 servers to AWS with minimal RPO/RTO" (M33)</td></tr>
<tr><td>Decoupling</td><td>SQS queues, SNS/EventBridge fan-out, Step Functions retries (M25, M26)</td><td>A queue lets the front end keep accepting work while the back end is down or slow</td></tr>
<tr><td>Testing resilience</td><td>AWS Fault Injection Service, AWS Resilience Hub (assesses an application against RPO/RTO targets)</td><td>Well-Architected Reliability pillar: "test recovery procedures"</td></tr>
</tbody></table>
<div class="callout tip"><strong>Shared responsibility for resilience.</strong> AWS is responsible for the resilience <em>of</em> the cloud (AZs that fail independently, Regional services that survive an AZ loss). You are responsible for resilience <em>in</em> the cloud: actually deploying across AZs, configuring backups, and testing recovery.</div>` },

    { type: "examples", title: "Worked examples", html: `
<h3>1. Series availability</h3>
<p>A request passes through Route 53 (treat as 100% for this exercise), an ALB (99.99%), one EC2 instance (99.9%) and one RDS Single-AZ instance (99.95%).</p>
<pre><code>A = 0.9999 × 0.999 × 0.9995
  = 0.9989001 × 0.9995
  = 0.99840065   → 99.84 %
Downtime/year = (1 − 0.9984) × 8,760 h ≈ 14.0 h</code></pre>
<p>Target was 99.95% (4.38 h/year). The single EC2 instance (8.76 h/year on its own) already blows the budget.</p>

<h3>2. Add redundancy to the tiers</h3>
<pre><code>App tier: 2 instances in different AZs, each 99.9 %
  A_app = 1 − (0.001 × 0.001) = 0.999999
DB tier: RDS Multi-AZ (treat primary and standby as two 99.95 % copies)
  A_db  = 1 − (0.0005 × 0.0005) = 0.99999975
System = 0.9999 × 0.999999 × 0.99999975 ≈ 0.99989875 → ≈ 99.99 %</code></pre>
<p>The load balancer is now the ceiling. In reality failover is not instantaneous and failures are partly correlated, so treat these numbers as an upper bound and a way to <em>compare</em> designs, not as a promise.</p>

<h3>3. MTTR beats MTBF</h3>
<table>
<thead><tr><th>Option</th><th>MTBF</th><th>MTTR</th><th>Availability</th></tr></thead>
<tbody>
<tr><td>Today (manual restore)</td><td>1,000 h</td><td>1 h</td><td>1000 / 1001 = 99.90%</td></tr>
<tr><td>Buy "better" hardware</td><td>2,000 h</td><td>1 h</td><td>2000 / 2001 = 99.95%</td></tr>
<tr><td>Automate recovery (ASG + health check)</td><td>1,000 h</td><td>0.1 h (6 min)</td><td>1000 / 1000.1 = 99.99%</td></tr>
</tbody></table>

<h3>4. Static stability sizing</h3>
<pre><code>Peak load needs 6 instances. Deploy across 3 AZs. Survive the loss of 1 AZ with no scaling.
Surviving AZs = 2  →  each AZ must carry 6 / 2 = 3 instances
Total = 3 AZs × 3 = 9 instances (50 % headroom over peak)
With 2 AZs instead: surviving AZs = 1 → 6 per AZ → 12 instances (100 % headroom)</code></pre>
<p>More AZs make static stability cheaper: with three AZs you over-provision by 50%, with two by 100%.</p>

<h3>5. RPO from a backup schedule</h3>
<pre><code>Daily snapshot at 01:00. Database corrupted at 19:00 the same day.
Restore from the 01:00 snapshot → lose 19:00 − 01:00 = 18 h of changes.
Worst case (failure just before the next snapshot) = 24 h → that is the RPO this schedule supports.
RDS automated backups + transaction logs (point-in-time recovery) → restore to within ~5 minutes.</code></pre>

<h3>6. Retry schedule with exponential backoff</h3>
<pre><code>base = 100 ms, cap = 2,000 ms, wait = min(cap, base × 2^(attempt − 1))
attempt 1: 100 ms   attempt 2: 200 ms   attempt 3: 400 ms   attempt 4: 800 ms   attempt 5: 1,600 ms
Full jitter: sleep = random(0, wait)  → clients no longer retry in lockstep</code></pre>

<h3>7. Error budget</h3>
<pre><code>SLO = 99.9 % of requests successful over 30 days, ~50 M requests/month
Error budget = 0.1 % = 50,000 failed requests (or 43.2 min of full outage)
A bad deploy that failed 5 % of requests for 20 min at 20 req/s = 0.05 × 20 × 1,200 = 1,200 failures
→ 2.4 % of the month's budget spent; deploys can continue</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Internal reporting tool, office hours only, can be down for a day</td><td>Single instance + daily AWS Backup, backup-and-restore DR</td><td>99.5% is enough; redundancy would cost more than the outage</td></tr>
<tr><td>Customer-facing web shop, must survive an AZ loss with no data loss</td><td>ALB + ASG across 3 AZs, RDS Multi-AZ or Aurora, NAT gateway per AZ</td><td>Multi-AZ removes zonal SPOFs; synchronous standby gives RPO ≈ 0 for an AZ event</td></tr>
<tr><td>Payments API needing minutes of RTO even if a whole Region fails</td><td>Warm standby in a second Region with Aurora Global Database and Route 53 failover</td><td>Regional failure needs a second Region; warm standby gives minutes, not hours</td></tr>
<tr><td>Order intake that must never reject a customer even if fulfilment is down</td><td>API → SQS queue → workers; idempotent consumers</td><td>The queue decouples availability of intake from availability of processing</td></tr>
<tr><td>Global gaming leaderboard with users on several continents</td><td>DynamoDB global tables, active-active Regions, latency routing</td><td>Near-zero RTO and local latency; accept eventual consistency across Regions (M04.04)</td></tr>
<tr><td>On-premises servers that need a cheap, fast DR site</td><td>AWS Elastic Disaster Recovery to a staging area in AWS</td><td>RPO of seconds, RTO of minutes, low-cost staging until failover</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: an availability calculator and a SPOF audit", html: `
<h3>Part A: availability and backoff maths (local, free)</h3>
<pre><code>python3 - &lt;&lt;'EOF'
import random
def series(*a):
    p = 1.0
    for x in a: p *= x
    return p
def parallel(*a):
    q = 1.0
    for x in a: q *= (1 - x)
    return 1 - q
def downtime_hours(a, hours=8760): return (1 - a) * hours

single = series(0.9999, 0.999, 0.9995)
redundant = series(0.9999, parallel(0.999, 0.999), parallel(0.9995, 0.9995))
for name, a in [("single", single), ("redundant", redundant)]:
    print(f"{name:10s} {a*100:.4f} %  {downtime_hours(a):6.2f} h/year")

base, cap = 0.1, 2.0
for attempt in range(1, 6):
    wait = min(cap, base * 2 ** (attempt - 1))
    print(f"attempt {attempt}: backoff {wait:.1f} s, full-jitter sleep {random.uniform(0, wait):.2f} s")
EOF</code></pre>
<p>Expected output (the jitter values will differ):</p>
<pre><code>single     99.8401 %   14.01 h/year
redundant  99.9899 %    0.89 h/year
attempt 1: backoff 0.1 s, full-jitter sleep 0.04 s
...</code></pre>
<p>Change one input at a time: what happens if the load balancer were 99.9%? If you add a third app server? Notice the diminishing returns once a tier is redundant.</p>

<h3>Part B: find zonal SPOFs in your own account (read-only, free)</h3>
<pre><code># RDS instances without a Multi-AZ standby
aws rds describe-db-instances --profile academy-admin --query "DBInstances[?MultiAZ==\`false\`].[DBInstanceIdentifier,AvailabilityZone]" --output table

# Auto Scaling groups that live in only one AZ
aws autoscaling describe-auto-scaling-groups --profile academy-admin --query "AutoScalingGroups[?length(AvailabilityZones)==\`1\`].AutoScalingGroupName"

# NAT gateways per subnet (one per AZ is the goal)
aws ec2 describe-nat-gateways --profile academy-admin --filter Name=state,Values=available --query "NatGateways[].[NatGatewayId,SubnetId,VpcId]" --output table</code></pre>
<p>A fresh learning account will return empty lists, which is fine; keep these commands for reviewing real environments. (The backticks are JMESPath literals, from M03.02.)</p>` },

    { type: "casestudy", title: "Case study: Lumora Scheduling's six-hour Saturday", html: `
<p><strong>Context.</strong> Lumora is a fictional SaaS that books appointments for 3,000 clinics. It ran on two EC2 instances (both in <code>eu-west-1a</code>, launched from the console), a single-AZ RDS PostgreSQL instance, one NAT gateway, and nightly snapshots at 01:00. The contract promised "99.9% availability" but nobody had calculated what the design could deliver.</p>
<p><strong>Incident.</strong> On a Saturday morning <code>eu-west-1a</code> suffered a power issue. Both web servers, the database and the NAT gateway were in that AZ. The team restored the 01:00 snapshot into another AZ, rebuilt the servers by hand from an outdated runbook and had the service back after 6 hours. Clinics lost 9 hours of bookings made since the snapshot; staff had to phone patients to reconstruct them. Monthly downtime: 360 minutes against a 43-minute budget.</p>
<p><strong>The RPO/RTO conversation.</strong> The architect ran a workshop with the head of customer success and finance, framed around money rather than nines:</p>
<table>
<thead><tr><th>Option</th><th>RPO / RTO for an AZ loss</th><th>RPO / RTO for a Region loss</th><th>Extra monthly cost (approx.)</th></tr></thead>
<tbody>
<tr><td>A. Multi-AZ in one Region</td><td>≈ 0 / 1–2 min</td><td>up to 24 h / many hours</td><td>+ ~40%</td></tr>
<tr><td>B. A + PITR + cross-Region backup copies</td><td>≈ 0 / 1–2 min</td><td>≤ 1 h / 4–8 h (backup and restore)</td><td>+ ~45%</td></tr>
<tr><td>C. B + warm standby in a second Region</td><td>≈ 0 / 1–2 min</td><td>seconds / ~15 min</td><td>+ ~110%</td></tr>
</tbody></table>
<p>Clinics could tolerate a rare multi-hour outage if a whole Region failed, but not losing bookings or a half-day outage from a single data-centre problem. The business chose <strong>option B</strong> and wrote the targets into the contract: 99.95% monthly SLO, RPO 5 minutes and RTO 15 minutes for an AZ failure, RPO 1 hour and RTO 8 hours for a Region failure.</p>
<p><strong>Redesign.</strong></p>
<ul>
  <li>An ALB and an Auto Scaling group across three AZs (3 instances per AZ for static stability), built from a launch template and infrastructure as code instead of console clicks.</li>
  <li>RDS PostgreSQL Multi-AZ with automated backups (point-in-time recovery, 14-day retention).</li>
  <li>One NAT gateway per AZ; private route tables point to their own AZ's gateway.</li>
  <li>AWS Backup plans copying snapshots to a second Region and a separate backup account, with Vault Lock.</li>
  <li>Application changes: connection retry with backoff on database failover, 2-second timeouts on the SMS provider plus a circuit breaker so text reminders queue in SQS when the provider is down.</li>
  <li>A quarterly game day using AWS Fault Injection Service to stop instances and fail over the database, plus a twice-yearly restore drill in the second Region.</li>
</ul>
<p><strong>Result.</strong> Eight months later a similar AZ event caused 70 seconds of elevated errors during the database failover and no data loss. The first restore drill took 5 h 10 min (inside the 8 h RTO) and revealed a missing KMS key policy in the DR Region, fixed before it mattered.</p>
<p><strong>Lessons learned.</strong> (1) Contracted availability must be backed by a calculation. (2) RPO and RTO are business decisions; present options with costs. (3) Hidden SPOFs (the NAT gateway, the runbook) matter as much as visible ones. (4) Only tested recovery counts.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Scenario keywords</th><th>Points to</th></tr></thead>
<tbody>
<tr><td>"Highly available", "fault tolerant", "survive the failure of an AZ"</td><td>Multi-AZ: ASG across ≥ 2 AZs + ELB; RDS Multi-AZ/Aurora; NAT gateway per AZ</td></tr>
<tr><td>"Improve read performance" of a database</td><td>Read replicas or caching (not Multi-AZ standby, which doesn't serve reads on an RDS Multi-AZ instance)</td></tr>
<tr><td>"RPO of seconds", "RTO of minutes", cross-Region</td><td>Warm standby; Aurora Global Database; DynamoDB global tables; Elastic Disaster Recovery</td></tr>
<tr><td>"Lowest cost" DR, RTO of hours acceptable</td><td>Backup and restore (AWS Backup cross-Region copy)</td></tr>
<tr><td>"Core components always running, scale out on failover"</td><td>Pilot light</td></tr>
<tr><td>"Decouple", "the processing tier is sometimes unavailable", "don't lose orders"</td><td>SQS between tiers</td></tr>
<tr><td>"Retries overwhelm the service", "throttling errors"</td><td>Exponential backoff with jitter</td></tr>
<tr><td>"Protect against accidental deletion or ransomware"</td><td>Versioning, Object Lock, AWS Backup Vault Lock, cross-account copies (replication alone is not enough)</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>Multi-AZ vs read replica:</strong> Multi-AZ = availability (synchronous, automatic failover). Read replica = read scaling (asynchronous, can be promoted manually, can be cross-Region).</li>
  <li><strong>"Add more instances in the same AZ"</strong> does not survive an AZ failure.</li>
  <li><strong>Vertical scaling</strong> (a bigger instance) does not remove a SPOF.</li>
  <li><strong>Snapshots only</strong> cannot meet an RPO of seconds.</li>
  <li><strong>Route 53 failover alone</strong> doesn't make the data available in the second Region: you still need replication.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Measure availability from the user's side.</strong> Server uptime can be 100% while users see errors. Define SLIs as successful requests / total requests and latency percentiles, measured at the load balancer or with synthetic canaries (CloudWatch Synthetics, M30).</li>
  <li><strong>Correlated failure is the real enemy.</strong> Same AMI, same config, same deploy wave, same dependency. Stagger deployments by AZ, use canaries with automatic rollback, and keep configuration changes as carefully controlled as code.</li>
  <li><strong>Dependencies set your ceiling.</strong> If your service calls five others in series at 99.9% each, you cannot be better than 99.5%. Cache, degrade gracefully or go asynchronous.</li>
  <li><strong>Failover paths rot.</strong> A standby that has never taken traffic will surprise you. Prefer active-active where practical, and exercise failover regularly.</li>
  <li><strong>Cross-AZ costs money.</strong> AZ-independent designs (each AZ uses its own NAT gateway, cache node and replica where possible) are both more resilient and cheaper on data transfer.</li>
  <li><strong>Don't over-build.</strong> Five nines for an internal tool is waste. Tier workloads (e.g. platinum, gold, bronze) with standard patterns and costs for each.</li>
  <li><strong>Backups need a restore story.</strong> Define who restores what, into which account and Region, with which keys and permissions, and time it.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Availability = usable now; reliability = keeps working over time; durability = data survives; resilience = absorbs and recovers from failure.</li>
  <li>99.9% ≈ 8.76 h/year or 43.2 min/month; 99.99% ≈ 52.6 min/year or 4.32 min/month.</li>
  <li>Series availabilities multiply; redundancy uses 1 − Π(1 − a), but only if failures are independent.</li>
  <li>Availability = MTBF / (MTBF + MTTR). Automated recovery (lower MTTR) is usually the cheapest lever.</li>
  <li>Find SPOFs by drawing the dependency graph; every zonal component needs a copy in another AZ.</li>
  <li>Static stability: pre-provision so an AZ loss needs no scaling action.</li>
  <li>RPO = data you can lose; RTO = time you can be down. DR strategies trade cost for lower RPO/RTO: backup and restore → pilot light → warm standby → active-active.</li>
  <li>Timeouts, retries with backoff and jitter, idempotency, circuit breakers, bulkheads and graceful degradation keep one failure from cascading.</li>
  <li>Test recovery: game days, fault injection, restore drills.</li>
</ul>` }
  ],
  drills: [
    { id: "M04.03-d1", q: "Two components in series each have 99.9% availability. What is the combined availability, in percent (to two decimal places)?", answers: ["99.80", "99.8", "99.80%", "99.8%", "99.8001"], hint: "Multiply: 0.999 × 0.999.", explain: "0.999 × 0.999 = 0.998001 → 99.80%." },
    { id: "M04.03-d2", q: "Two independent, redundant servers each have 99% availability, and either can serve all traffic. What is the availability of the pair, in percent?", answers: ["99.99", "99.99%"], hint: "1 − (probability both are down).", explain: "1 − 0.01 × 0.01 = 0.9999 → 99.99%." },
    { id: "M04.03-d3", q: "How many minutes of downtime does a 99.9% SLO allow in a 30-day month?", answers: ["43.2", "43.2min", "43.2 minutes"], hint: "30 days = 43,200 minutes.", explain: "0.001 × 43,200 = 43.2 minutes." },
    { id: "M04.03-d4", q: "How many minutes of downtime per year does 99.99% availability allow? (one decimal place)", answers: ["52.6", "52.56", "52.6min"], hint: "A year has 525,600 minutes.", explain: "0.0001 × 525,600 = 52.56 ≈ 52.6 minutes." },
    { id: "M04.03-d5", q: "A component has MTBF = 500 h and MTTR = 0.5 h. What is its availability, in percent (one decimal place)?", answers: ["99.9", "99.9%", "99.90"], hint: "MTBF / (MTBF + MTTR).", explain: "500 / 500.5 = 0.999001 → 99.9%." },
    { id: "M04.03-d6", q: "Backups run every 4 hours and nothing else protects the data. What is the worst-case RPO, in hours?", answers: ["4", "4h", "4 hours"], hint: "Failure happens just before the next backup.", explain: "Up to 4 hours of changes can be lost." },
    { id: "M04.03-d7", q: "A daily snapshot is taken at 01:00. The database is corrupted at 19:00 the same day and restored from that snapshot. How many hours of data are lost?", answers: ["18", "18h", "18 hours"], hint: "Time between the recovery point and the failure.", explain: "19:00 − 01:00 = 18 hours." },
    { id: "M04.03-d8", q: "Peak load needs 6 instances. You run in 3 AZs and must survive the loss of one AZ without launching anything new. How many instances must you run in total?", answers: ["9", "nine"], hint: "The 2 surviving AZs must carry all 6.", explain: "6 / 2 = 3 per AZ × 3 AZs = 9 instances." },
    { id: "M04.03-d9", q: "Retry waits follow base × 2^(attempt − 1) with base = 100 ms and no cap reached. How many milliseconds is the wait before attempt 4?", answers: ["800", "800ms", "800 ms"], hint: "100, 200, 400, …", explain: "100 × 2³ = 800 ms." },
    { id: "M04.03-d10", q: "Which DR strategy keeps a scaled-down but fully functional copy of production running in another Region and scales it up on failover? (two words)", answers: ["warm standby", "warmstandby"], explain: "Warm standby: RPO seconds to minutes, RTO minutes. Pilot light keeps only the data and core pieces running." }
  ],
  check: [
    { id: "M04.03-k1", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A web application runs on two EC2 instances in one Availability Zone behind an Application Load Balancer, with an RDS MySQL Single-AZ database in the same AZ. The company needs the application to keep working if that AZ fails, with no data loss. Which change BEST meets the requirement?",
      options: [
        { t: "Move the instances into an Auto Scaling group spanning at least two AZs and convert the database to RDS Multi-AZ", c: true, why: "Both tiers become redundant across AZs. The Multi-AZ standby is synchronous, so an AZ failure loses no committed data and fails over automatically." },
        { t: "Add a third EC2 instance and an RDS read replica in the same AZ", c: false, why: "Everything is still in one AZ, so an AZ failure takes it all down." },
        { t: "Take hourly RDS snapshots and copy them to another AZ", c: false, why: "Snapshots allow up to an hour of data loss and a slow manual restore." },
        { t: "Resize the instances and the database to larger instance types", c: false, why: "Vertical scaling adds capacity, not redundancy." }
      ] },
    { id: "M04.03-k2", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A business states that it can lose at most 15 minutes of data but can tolerate 8 hours of downtime after a Regional disaster. Which statement is correct?",
      options: [
        { t: "RPO is 15 minutes and RTO is 8 hours", c: true, why: "RPO measures acceptable data loss; RTO measures acceptable downtime." },
        { t: "RPO is 8 hours and RTO is 15 minutes", c: false, why: "This swaps the two definitions." },
        { t: "Both RPO and RTO are 15 minutes", c: false, why: "The downtime tolerance is 8 hours." },
        { t: "The requirement describes availability, not RPO or RTO", c: false, why: "Data loss and recovery time are exactly RPO and RTO." }
      ] },
    { id: "M04.03-k3", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A company needs disaster recovery in a second Region with an RTO of a few minutes and an RPO of seconds. Cost should be lower than running full production capacity in both Regions. Which strategy fits BEST?",
      options: [
        { t: "Warm standby: replicate data continuously and run a scaled-down copy of the application that is scaled up during failover", c: true, why: "Continuous replication gives seconds of RPO; a running scaled-down stack can take traffic within minutes." },
        { t: "Backup and restore with daily cross-Region snapshot copies", c: false, why: "RPO up to 24 hours and an RTO of hours." },
        { t: "Multi-site active-active at full capacity in both Regions", c: false, why: "Meets the targets but violates the cost constraint." },
        { t: "Pilot light with only AMIs and CloudFormation templates in the second Region", c: false, why: "Without live data replication and running components, RPO and RTO are too long. A true pilot light also replicates data, but still takes longer to scale than warm standby." }
      ] },
    { id: "M04.03-k4", type: "multi", domain: "D2", task: "2.1", level: 200,
      stem: "During a dependency slowdown, thousands of clients retried at the same moment and kept the downstream service overloaded. Which TWO changes reduce this risk?",
      options: [
        { t: "Use exponential backoff between retries", c: true, why: "Growing waits reduce retry pressure while the dependency recovers." },
        { t: "Add random jitter to each retry delay", c: true, why: "Jitter spreads clients out so they don't retry in lockstep." },
        { t: "Retry immediately and indefinitely until the call succeeds", c: false, why: "This creates exactly the retry storm described." },
        { t: "Increase client timeouts to 10 minutes", c: false, why: "Very long timeouts tie up resources and cause cascading failures." },
        { t: "Retry validation (HTTP 400) errors as well as throttling errors", c: false, why: "Client errors will never succeed on retry; retrying them only adds load." }
      ] },
    { id: "M04.03-k5", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "An application currently has MTBF of 1,000 hours and MTTR of 2 hours. Which change raises availability the MOST?",
      options: [
        { t: "Automate detection and replacement so MTTR drops to 6 minutes", c: true, why: "1000 / 1000.1 ≈ 99.99%, compared with 1000 / 1002 ≈ 99.80% today." },
        { t: "Improve components so MTBF rises to 1,500 hours", c: false, why: "1500 / 1502 ≈ 99.87%, a smaller gain." },
        { t: "Double the instance size", c: false, why: "Size doesn't change failure or recovery rates." },
        { t: "Add more CloudWatch dashboards", c: false, why: "Dashboards don't recover anything unless they trigger action." }
      ] },
    { id: "M04.03-k6", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "Private instances in three AZs reach the internet through a single NAT gateway in AZ a. What is the main resilience problem, and the fix?",
      options: [
        { t: "The NAT gateway is a zonal single point of failure; deploy one NAT gateway per AZ and point each private route table to its own AZ's gateway", c: true, why: "If AZ a fails, all outbound traffic fails. Per-AZ gateways remove the SPOF and the cross-AZ charges." },
        { t: "NAT gateways can't handle three AZs; replace it with an internet gateway", c: false, why: "An internet gateway would require public IPs and expose instances; the issue is the zonal scope." },
        { t: "There is no problem, because NAT gateways are Regional services", c: false, why: "A NAT gateway lives in one AZ (zonal)." },
        { t: "Add a second NAT gateway in AZ a for redundancy", c: false, why: "Both would fail together with AZ a." }
      ] }
  ],
  cards: ["fc-M04-3-01", "fc-M04-3-02", "fc-M04-3-03", "fc-M04-3-04", "fc-M04-3-05", "fc-M04-3-06", "fc-M04-3-07", "fc-M04-3-08", "fc-M04-3-09", "fc-M04-3-10", "fc-M04-3-11", "fc-M04-3-12"],
  references: [
    "<em>System Design on AWS</em> ch.1 (PDF p22–50): reliability, availability and fault tolerance fundamentals",
    "AWS Well-Architected Framework, <em>Reliability Pillar</em> whitepaper",
    "AWS whitepaper: <em>Disaster Recovery of Workloads on AWS: Recovery in the Cloud</em>",
    "AWS Builders' Library: <em>Timeouts, retries, and backoff with jitter</em>; <em>Static stability using Availability Zones</em>",
    "Amazon RDS User Guide: <em>Multi-AZ deployments</em>; AWS Backup and AWS Elastic Disaster Recovery documentation"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-3-01", front: "Availability vs reliability vs durability vs resilience?", back: "Availability: usable now (% time/requests). Reliability: keeps working over time (MTBF). Durability: data survives (S3: 11 nines). Resilience: absorbs and recovers from failure (RTO/RPO, MTTR)." },
  { id: "fc-M04-3-02", front: "Downtime allowed by 99.9% and 99.99%?", back: "99.9%: 8.76 h/year, 43.2 min/month. 99.99%: 52.6 min/year, 4.32 min/month." },
  { id: "fc-M04-3-03", front: "How do availabilities combine in series and in parallel?", back: "Series: multiply (A₁ × A₂ …). Parallel redundant copies: 1 − Π(1 − aᵢ), assuming independent failures." },
  { id: "fc-M04-3-04", front: "Availability formula using MTBF and MTTR?", back: "A = MTBF / (MTBF + MTTR). Reducing MTTR (automation) is usually the cheapest lever." },
  { id: "fc-M04-3-05", front: "RPO vs RTO?", back: "RPO: maximum data loss (time back to the last recovery point). RTO: maximum time to restore service." },
  { id: "fc-M04-3-06", front: "Four DR strategies, cheapest to most expensive?", back: "Backup and restore (hours) → pilot light (tens of minutes) → warm standby (minutes) → multi-site active-active (near zero)." },
  { id: "fc-M04-3-07", front: "What is static stability?", back: "Pre-provisioning enough capacity that losing an AZ requires no scaling or control-plane action. Peak 6 across 3 AZs → run 9." },
  { id: "fc-M04-3-08", front: "RDS Multi-AZ vs read replica?", back: "Multi-AZ: synchronous standby, automatic failover, for availability. Read replica: asynchronous, for read scaling (can be cross-Region, manual promotion)." },
  { id: "fc-M04-3-09", front: "Why add jitter to exponential backoff?", back: "To spread retries randomly so clients don't retry in lockstep and overwhelm a recovering service (thundering herd)." },
  { id: "fc-M04-3-10", front: "What makes an operation idempotent, and why does it matter for retries?", back: "Applying it many times has the same effect as once. Retries can deliver duplicates; use idempotency keys/ClientToken." },
  { id: "fc-M04-3-11", front: "Circuit breaker vs bulkhead?", back: "Circuit breaker: stop calling a failing dependency for a while and fail fast. Bulkhead: isolate resources (pools, cells) so one failure can't exhaust everything." },
  { id: "fc-M04-3-12", front: "Is replication a backup?", back: "No. Replication copies deletions and corruption too. Keep point-in-time, versioned, immutable backups (AWS Backup Vault Lock, S3 Object Lock)." }
);
// ================================================================== 04_consistency.js
/* ---------------------------------------------------------------- M04.04 Consistency, CAP and PACELC */
var DG_0404_STALE = `
<figure>
<svg class="diagram" viewBox="0 0 760 250" role="img" aria-labelledby="m0404at m0404ad">
  <title id="m0404at">A stale read caused by asynchronous replication</title>
  <desc id="m0404ad">Client A writes x equals 2 to the leader and gets OK. Before the change is replicated to the follower, client B reads from the follower and gets the old value 1. After replication, B reads 2. The window between the write and replication is the replication lag.</desc>
  <defs><marker id="m0404a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-tb" x="16" y="74">Leader</text>
  <text class="dg-tb" x="16" y="154">Follower</text>
  <path class="dg-line" d="M110 70 H730" marker-end="url(#m0404a-ar)"/><path class="dg-line" d="M110 150 H730" marker-end="url(#m0404a-ar)"/>
  <text class="dg-ts" x="700" y="92">time</text>
  <text class="dg-ts" x="116" y="56">x = 1</text>
  <circle class="dg-good" cx="200" cy="70" r="8"/>
  <text class="dg-t" x="160" y="50">A writes x = 2, gets OK</text>
  <text class="dg-ts" x="116" y="136">x = 1</text>
  <path class="dg-line" d="M420 80 V140" marker-end="url(#m0404a-ar)"/>
  <text class="dg-ts" x="428" y="114">change replicated</text>
  <circle class="dg-bad" cx="320" cy="150" r="8"/>
  <text class="dg-t" x="250" y="134">B reads x = 1 (stale)</text>
  <circle class="dg-good" cx="560" cy="150" r="8"/>
  <text class="dg-t" x="520" y="134">B reads x = 2</text>
  <path class="dg-link" d="M200 162 V170 H420 V162"/>
  <text class="dg-ts" x="226" y="186">replication lag: stale reads possible</text>
  <text class="dg-ts" x="16" y="216">Strong consistency: B's read goes to the leader (or waits for replication), so it always returns 2.</text>
  <text class="dg-ts" x="16" y="234">Eventual consistency: B may see 1 for a while; if writes stop, every replica converges to 2.</text>
</svg>
<figcaption>Figure M04-4a. With asynchronous replication, a successful write and a stale read can happen at the same time on different replicas.</figcaption>
</figure>`;

var DG_0404_PACELC = `
<figure>
<svg class="diagram" viewBox="0 0 760 260" role="img" aria-labelledby="m0404bt m0404bd">
  <title id="m0404bt">The PACELC decision</title>
  <desc id="m0404bd">If there is a network partition, a distributed system must choose between consistency and availability. Else, during normal operation, it chooses between low latency and consistency. Examples: DynamoDB eventually consistent reads and Cassandra are PA/EL; a single-leader relational database and DynamoDB strongly consistent reads are PC/EC.</desc>
  <defs><marker id="m0404b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-edge" x="260" y="14" width="240" height="44" rx="8"/>
  <text class="dg-t" x="272" y="41">Is there a network partition?</text>
  <path class="dg-line" d="M380 58 L190 108" marker-end="url(#m0404b-ar)"/><path class="dg-line" d="M380 58 L570 108" marker-end="url(#m0404b-ar)"/>
  <text class="dg-ta" x="236" y="80">yes: P</text>
  <text class="dg-ta" x="500" y="78">no: E (else)</text>
  <rect class="dg-info" x="40" y="110" width="300" height="70" rx="8"/>
  <text class="dg-tb" x="54" y="132">Choose C or A</text>
  <text class="dg-ts" x="54" y="152">PC: reject or wait, never stale</text>
  <text class="dg-ts" x="54" y="168">PA: keep answering, maybe stale</text>
  <rect class="dg-good" x="420" y="110" width="300" height="70" rx="8"/>
  <text class="dg-tb" x="434" y="132">Choose latency or consistency</text>
  <text class="dg-ts" x="434" y="152">EL: answer fast from a nearby replica</text>
  <text class="dg-ts" x="434" y="168">EC: coordinate replicas, pay latency</text>
  <text class="dg-ts" x="40" y="206">PA/EL: DynamoDB eventually consistent reads, Cassandra, DNS caching: fast, may be stale.</text>
  <text class="dg-ts" x="40" y="224">PC/EC: single-leader SQL primary, DynamoDB strongly consistent reads: correct, slower or unavailable.</text>
  <text class="dg-ts" x="40" y="242">Many systems let you choose per request or per table (e.g. ConsistentRead=true in DynamoDB).</text>
</svg>
<figcaption>Figure M04-4b. CAP only describes behaviour during a partition. PACELC adds the trade-off you make every day: latency versus consistency.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.04", title: "Consistency, CAP and PACELC", level: 300, minutes: 55,
  objectives: [
    "Explain why replicated data can be inconsistent, and compare synchronous and asynchronous replication",
    "Distinguish strong, eventual, read-your-writes, monotonic-read and causal consistency with concrete timelines",
    "Use quorum arithmetic (N, W, R) to decide whether reads are guaranteed to see the latest write",
    "State the CAP theorem precisely, avoid its common misreadings, and classify systems with PACELC",
    "Choose the consistency and isolation guarantees an AWS design needs (S3, DynamoDB, RDS/Aurora, ElastiCache, Route 53)"
  ],
  sections: [
    { type: "why", html: `
<p>A flash sale starts. The last 50 units of a popular console are in stock. Thousands of shoppers click "Buy". The checkout service reads the stock level from a fast read replica, sees "1 left" on hundreds of requests at once, and accepts every order. By the time the warehouse notices, the company has sold 312 consoles it doesn't have, and must cancel orders and refund angry customers.</p>
<p>Nothing "broke". Every component did exactly what it was designed to do. The design simply used <strong>eventually consistent</strong> reads for a decision that needed <strong>strong consistency</strong>. As soon as data is copied (to replicas, caches, other AZs or other Regions), you must decide which guarantees each feature needs. The exam tests this through choices like "DynamoDB strongly consistent reads", "read replicas", "S3 read-after-write consistency" and "DynamoDB global tables", and as an architect you will make these trade-offs in almost every design.</p>` },

    { type: "concept", title: "Concept: replication and consistency models", html: DG_0404_STALE + `
<h3>Why copies exist, and why they disagree</h3>
<p>We replicate data for three reasons: <strong>availability</strong> (survive a node or AZ failure), <strong>read scalability</strong> (spread reads over many copies) and <strong>latency</strong> (put a copy near users). The moment there are two copies, a write reaches them at slightly different times. What a reader sees during that window is the <em>consistency model</em>.</p>

<h3>Synchronous vs asynchronous replication</h3>
<table>
<thead><tr><th></th><th>Synchronous</th><th>Asynchronous</th></tr></thead>
<tbody>
<tr><td>When the writer gets "OK"</td><td>After the replica(s) also have the change</td><td>As soon as the leader has it; replicas catch up later</td></tr>
<tr><td>Write latency</td><td>Higher (waits for the slowest required replica)</td><td>Lower</td></tr>
<tr><td>Data loss if the leader dies</td><td>None for acknowledged writes</td><td>Up to the replication lag</td></tr>
<tr><td>Reads from replicas</td><td>Up to date</td><td>May be stale by the replication lag</td></tr>
<tr><td>Distance</td><td>Practical within a Region (across AZs)</td><td>Works across Regions and continents</td></tr>
<tr><td>AWS examples</td><td>RDS Multi-AZ standby; Aurora storage writes (4 of 6 copies across 3 AZs); EBS within an AZ</td><td>RDS and Aurora read replicas; Aurora Global Database; DynamoDB global tables; S3 Cross-Region Replication; ElastiCache replicas</td></tr>
</tbody></table>
<p><strong>Replication lag</strong> is the delay between a write on the leader and its arrival on a replica. It is usually milliseconds but grows under heavy write load, long transactions or network trouble, and that is exactly when your system is under the most stress.</p>

<h3>Replication topologies</h3>
<ul>
  <li><strong>Single leader (leader-follower, primary-replica):</strong> all writes go to one node; followers copy its log. Simple, no write conflicts. RDS, Aurora, ElastiCache (Redis OSS/Valkey) replication groups.</li>
  <li><strong>Multi-leader:</strong> several nodes accept writes (often one per Region) and exchange changes. Low local write latency, but concurrent writes to the same item <em>conflict</em>. DynamoDB global tables work this way.</li>
  <li><strong>Leaderless:</strong> clients write to and read from several replicas directly and use quorums (below). Amazon's original Dynamo design, Cassandra, Riak.</li>
</ul>

<h3>The consistency models you need to recognise</h3>
<table>
<thead><tr><th>Model</th><th>Guarantee</th><th>Timeline example</th><th>Where you meet it</th></tr></thead>
<tbody>
<tr><td><strong>Strong</strong> (linearizable)</td><td>Once a write is acknowledged, every later read, by anyone, sees it. The system behaves like a single copy.</td><td>A sets x = 2 at 10:00:00.000; B reads at 10:00:00.001 and gets 2.</td><td>S3 object reads after a PUT; DynamoDB with <code>ConsistentRead=true</code>; a single SQL primary</td></tr>
<tr><td><strong>Eventual</strong></td><td>If writes stop, all replicas converge to the same value. No promise about <em>when</em>.</td><td>B reads 1 from a lagging replica, then 2 a moment later.</td><td>DynamoDB default reads; read replicas; caches; DNS</td></tr>
<tr><td><strong>Read-your-writes</strong></td><td>A client always sees <em>its own</em> previous writes (others may not yet).</td><td>You post a comment and the page reload shows it, even if other users see it a second later.</td><td>Routing a user's reads to the leader for a short time after they write</td></tr>
<tr><td><strong>Monotonic reads</strong></td><td>A client never sees time go backwards: after seeing 2, it never later sees 1.</td><td>Without it: refresh shows 2, next refresh hits a staler replica and shows 1.</td><td>Sticky sessions to one replica</td></tr>
<tr><td><strong>Causal</strong></td><td>Operations that depend on each other are seen in order by everyone.</td><td>A reply never appears before the question it answers.</td><td>Some distributed databases; designing event ordering (message groups)</td></tr>
</tbody></table>
<p>These are ordered roughly from strongest to weakest: strong ⊃ causal ⊃ (read-your-writes, monotonic reads) ⊃ eventual. Stronger guarantees need more coordination, which means more latency and lower availability during failures.</p>` },

    { type: "concept", title: "Concept: quorums, conflicts, CAP, PACELC and transactions", html: `
<h3>Quorums: N, W and R</h3>
<p>In a leaderless (or quorum-based) system each item is stored on <strong>N</strong> replicas. A write is acknowledged when <strong>W</strong> replicas confirm it; a read asks <strong>R</strong> replicas and takes the newest version.</p>
<ul>
  <li>If <code>W + R &gt; N</code>, every read set overlaps every write set in at least one replica, so a read is guaranteed to include the latest acknowledged write.</li>
  <li>If <code>W + R ≤ N</code>, a read may contact only replicas that missed the write: eventual consistency, but lower latency and higher availability.</li>
  <li>Writes can continue while <code>N − W</code> replicas are down; reads while <code>N − R</code> are down.</li>
</ul>
<table>
<thead><tr><th>N</th><th>W</th><th>R</th><th>W + R &gt; N?</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td>3</td><td>2</td><td>2</td><td>4 &gt; 3 yes</td><td>Classic balanced quorum; tolerates 1 node down for reads and writes</td></tr>
<tr><td>3</td><td>3</td><td>1</td><td>4 &gt; 3 yes</td><td>Fast reads, but any one node down blocks writes</td></tr>
<tr><td>3</td><td>1</td><td>1</td><td>2 ≤ 3 no</td><td>Fastest and most available; reads may be stale</td></tr>
<tr><td>5</td><td>3</td><td>3</td><td>6 &gt; 5 yes</td><td>Tolerates 2 nodes down</td></tr>
</tbody></table>
<p>Aurora uses the same idea inside its storage layer: 6 copies across 3 AZs, writes need 4 (W = 4) and reads 3 (R = 3), so 4 + 3 &gt; 6, and the volume survives losing a whole AZ plus one more copy for reads.</p>

<h3>Write conflicts and how they are resolved</h3>
<p>With multi-leader or leaderless replication, two clients can update the same item concurrently in different places. Options:</p>
<ul>
  <li><strong>Last writer wins (LWW):</strong> keep the write with the latest timestamp; silently discard the other. Simple, but loses data. DynamoDB global tables (in their default, eventually consistent mode) reconcile concurrent updates this way.</li>
  <li><strong>Version vectors / vector clocks:</strong> track causality to detect true conflicts and keep both versions (siblings) for the application to merge, as in the original Dynamo paper.</li>
  <li><strong>CRDTs</strong> (conflict-free replicated data types): data structures such as counters and sets designed so concurrent updates merge automatically.</li>
  <li><strong>Avoid conflicts by design:</strong> route all writes for one item (one customer, one account) to a single "home" Region or partition.</li>
</ul>

<h3>The CAP theorem, stated precisely</h3>
<p>For a distributed data store, when a <strong>network partition (P)</strong> splits the nodes into groups that can't talk to each other, the system must choose between:</p>
<ul>
  <li><strong>Consistency (C):</strong> every read returns the latest write (linearizability). Nodes that can't confirm they are up to date must refuse or wait.</li>
  <li><strong>Availability (A):</strong> every request to a non-failed node gets a non-error response, even if it might be stale.</li>
</ul>
<p>Partitions are not optional in real networks, so the real choice is <strong>CP or AP, during a partition</strong>.</p>
<div class="callout warn"><strong>Common misreadings.</strong> (1) "Pick two of three" suggests you can give up P. You can't, unless you run on a single node. (2) CAP says nothing about normal operation, when you can have both C and A. (3) CAP's "availability" is not your SLA's availability; a CP system can still be highly available in practice. (4) It is not a property of a whole product: many databases let you choose per operation.</div>

<h3>PACELC: the everyday trade-off</h3>
` + DG_0404_PACELC + `
<p>Daniel Abadi's PACELC extends CAP: <strong>if P</strong>artition, choose <strong>A</strong> or <strong>C</strong>; <strong>e</strong>lse (normal operation), choose <strong>L</strong>atency or <strong>C</strong>onsistency. Even with a perfect network, a strongly consistent read must coordinate with the leader or a quorum, which costs time, especially across AZs or Regions. That everyday latency cost is the trade-off you actually feel.</p>

<h3>ACID vs BASE</h3>
<table>
<thead><tr><th>ACID (typical relational database)</th><th>BASE (typical distributed NoSQL)</th></tr></thead>
<tbody>
<tr><td><strong>A</strong>tomicity: all of a transaction or none</td><td><strong>B</strong>asically <strong>A</strong>vailable: answer even when parts fail</td></tr>
<tr><td><strong>C</strong>onsistency: constraints always hold (note: a different "C" from CAP)</td><td><strong>S</strong>oft state: replicas may differ for a while</td></tr>
<tr><td><strong>I</strong>solation: concurrent transactions don't interfere (per isolation level)</td><td><strong>E</strong>ventually consistent: they converge</td></tr>
<tr><td><strong>D</strong>urability: committed data survives crashes</td><td></td></tr>
</tbody></table>
<p>The line has blurred: DynamoDB offers ACID transactions, and relational databases offer asynchronous replicas. Think in terms of the guarantee each <em>operation</em> needs.</p>

<h3>Isolation levels in one table</h3>
<p>Consistency between replicas is one problem; consistency between <em>concurrent transactions</em> on one database is another. SQL isolation levels define which anomalies are allowed:</p>
<table>
<thead><tr><th>Level</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantom</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Read uncommitted</td><td>possible</td><td>possible</td><td>possible</td><td>Rarely used</td></tr>
<tr><td>Read committed</td><td>no</td><td>possible</td><td>possible</td><td>PostgreSQL default (also Aurora PostgreSQL)</td></tr>
<tr><td>Repeatable read</td><td>no</td><td>no</td><td>possible in the standard (engines differ)</td><td>MySQL InnoDB default (also Aurora MySQL)</td></tr>
<tr><td>Serializable</td><td>no</td><td>no</td><td>no</td><td>As if transactions ran one at a time; most coordination</td></tr>
</tbody></table>
<p>The anomaly behind most oversell bugs is the <strong>lost update</strong>: two transactions read stock = 1, both compute 0 and both write it. Prevent it with an atomic conditional update (<code>UPDATE … SET stock = stock - 1 WHERE id = ? AND stock &gt;= 1</code>), a row lock (<code>SELECT … FOR UPDATE</code>) or a stricter isolation level.</p>` },

    { type: "workflow", title: "Workflows: a quorum write and read, and choosing a consistency level", html: `
<h3>A quorum write and read (N = 3, W = 2, R = 2)</h3>
<ol class="flow">
  <li><strong>Write:</strong> the coordinator sends <code>x = 2 (version 7)</code> to replicas A, B and C.</li>
  <li>A and B acknowledge; C is slow. With W = 2 the coordinator returns "OK" to the client. C will receive the write later (or be repaired).</li>
  <li><strong>Read:</strong> another client reads x. The coordinator asks R = 2 replicas. Suppose it reaches B and C.</li>
  <li>B returns <code>x = 2 (v7)</code>; C returns <code>x = 1 (v6)</code>. Because W + R = 4 &gt; 3, at least one of them (B) has the latest write.</li>
  <li>The coordinator returns the newest version, <code>x = 2</code>, and may send v7 to C (<em>read repair</em>).</li>
  <li>If instead R = 1 and it had asked only C, the client would have seen the stale <code>x = 1</code>: the price of the faster, eventually consistent read.</li>
</ol>

<h3>Choosing the right consistency for a feature</h3>
<ol class="flow">
  <li><strong>Ask what a stale or lost value costs.</strong> A like-count that is 2 seconds old costs nothing; a double-spent balance or an oversold ticket costs money and trust.</li>
  <li><strong>Separate decisions from displays.</strong> Displays (catalogue, counters, dashboards) can usually tolerate eventual consistency and caching. Decisions (debit, reserve, unique username) need a strongly consistent check <em>at the moment of writing</em>.</li>
  <li><strong>Make the critical write atomic and conditional</strong> on the authoritative copy: a conditional write in DynamoDB, a single SQL statement or transaction on the primary.</li>
  <li><strong>Pick the read path:</strong> leader/strong reads for read-your-writes moments (just after a user's own change); replicas and caches for everything else.</li>
  <li><strong>Decide the multi-Region model:</strong> single home Region for writes (simpler, consistent) or multi-Region writes (lower latency, conflicts to handle).</li>
  <li><strong>Document the guarantee</strong> in the API contract and the ADR, and test with concurrent requests, not only single-user tests.</li>
</ol>` },

    { type: "aws", title: "How AWS services behave", html: `
<table>
<thead><tr><th>Service</th><th>Default behaviour</th><th>Stronger option / notes</th></tr></thead>
<tbody>
<tr><td><strong>Amazon S3</strong></td><td><strong>Strong read-after-write</strong> consistency for PUTs, overwrites, DELETEs and LIST of objects, in all Regions, at no extra cost (since December 2020)</td><td>Bucket <em>configuration</em> changes (e.g. enabling versioning) can take a moment to propagate. Cross-Region Replication is asynchronous.</td></tr>
<tr><td><strong>DynamoDB</strong> (one Region)</td><td>Reads are <strong>eventually consistent</strong> by default (usually consistent within about a second)</td><td><code>ConsistentRead=true</code> on GetItem/Query/Scan gives a strongly consistent read of the base table at twice the read-capacity cost. Global secondary indexes support only eventually consistent reads.</td></tr>
<tr><td><strong>DynamoDB transactions and conditional writes</strong></td><td>Conditional writes (<code>ConditionExpression</code>) apply atomically on the item</td><td><code>TransactWriteItems</code>/<code>TransactGetItems</code> give ACID, serializable operations across up to 100 items</td></tr>
<tr><td><strong>DynamoDB global tables</strong></td><td>Multi-Region, multi-active; replication across Regions is asynchronous and concurrent updates are reconciled with last writer wins</td><td>A multi-Region strong consistency (MRSC) mode also exists for specific needs; check current constraints before relying on it (M22)</td></tr>
<tr><td><strong>RDS Multi-AZ</strong></td><td>Synchronous standby (not readable on a Multi-AZ <em>instance</em>)</td><td>No data loss for committed transactions when failing over within the Region</td></tr>
<tr><td><strong>RDS read replicas</strong></td><td>Asynchronous; reads may be stale (monitor <code>ReplicaLag</code>)</td><td>Send read-your-writes traffic to the primary</td></tr>
<tr><td><strong>Aurora</strong></td><td>Shared storage; Aurora Replicas typically lag the writer by well under 100 ms</td><td>Reader endpoint = possibly stale reads; writer endpoint = current. Aurora Global Database replicates cross-Region typically in under a second.</td></tr>
<tr><td><strong>ElastiCache</strong> (Redis OSS / Valkey)</td><td>Replica nodes are updated asynchronously</td><td>A failover can lose the most recent writes; a cache is a copy, not the source of truth (M23)</td></tr>
<tr><td><strong>Route 53 / DNS</strong></td><td>Changes propagate to Route 53's authoritative servers quickly (typically within about a minute), but resolvers cache answers for the record's TTL</td><td>Plan TTLs before migrations (M02.04)</td></tr>
<tr><td><strong>SQS</strong></td><td>Standard queues: at-least-once delivery, best-effort ordering</td><td>FIFO queues: ordering per message group and deduplication (M25)</td></tr>
</tbody></table>
<div class="callout tip"><strong>Exam shortcut.</strong> "Must always read the latest data from DynamoDB" → strongly consistent reads (and not from a GSI). "Read replica shows old data after a write" → replication lag; read from the primary/writer for that request. "Overwrite an S3 object and immediately read it" → you get the new version.</div>` },

    { type: "examples", title: "Worked examples", html: `
<h3>1. Quorum arithmetic</h3>
<pre><code>N = 5 replicas, W = 3.
Smallest R for guaranteed fresh reads: W + R &gt; N → 3 + R &gt; 5 → R = 3
Writes keep working while N − W = 2 replicas are down
Reads (R = 3) keep working while N − R = 2 replicas are down

N = 3, W = 1, R = 1 → 1 + 1 = 2, not &gt; 3 → reads may be stale</code></pre>

<h3>2. Preventing an oversell with a DynamoDB conditional write</h3>
<pre><code># Reserve one unit only if at least one is left. The check and the decrement are one atomic operation.
aws dynamodb update-item --table-name Inventory --key '{"sku":{"S":"CONSOLE-X"}}' --update-expression "SET stock = stock - :one" --condition-expression "stock &gt;= :one" --expression-attribute-values '{":one":{"N":"1"}}' --return-values UPDATED_NEW

# Success:
{ "Attributes": { "stock": { "N": "0" } } }

# Same command again when stock is 0:
An error occurred (ConditionalCheckFailedException) when calling the UpdateItem operation: The conditional request failed</code></pre>
<p>The read that feeds the "Buy" button can be eventually consistent (or cached); the <em>decision</em> happens in the conditional write on the authoritative item, so two buyers can never both take the last unit.</p>

<h3>3. The same fix in SQL</h3>
<pre><code>-- Unsafe: read-modify-write (lost update under concurrency)
SELECT stock FROM inventory WHERE sku = 'CONSOLE-X';     -- both sessions see 1
UPDATE inventory SET stock = 0 WHERE sku = 'CONSOLE-X';  -- both "succeed"

-- Safe: one atomic, conditional statement on the primary
UPDATE inventory SET stock = stock - 1 WHERE sku = 'CONSOLE-X' AND stock &gt;= 1;
-- check "rows affected": 1 = reserved, 0 = sold out</code></pre>

<h3>4. Read-your-writes with Aurora</h3>
<pre><code>POST /profile        → writer endpoint (cluster endpoint)
GET  /profile (next 5 s for this user) → writer endpoint     ← user sees their own change
GET  /profile (everyone else)          → reader endpoint     ← may lag by milliseconds
GET  /reports                          → reader endpoint</code></pre>

<h3>5. Strongly consistent read cost in DynamoDB</h3>
<pre><code>Item size 6 KB → rounds up to 2 × 4 KB read units
Strongly consistent read:    2 RCU per read
Eventually consistent read:  1 RCU per read (half)
1,000 reads/s of this item: 2,000 RCU vs 1,000 RCU provisioned</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Feature</th><th>Guarantee needed</th><th>AWS design</th></tr></thead>
<tbody>
<tr><td>Product catalogue and prices shown on pages</td><td>Eventual (seconds of staleness fine)</td><td>CloudFront/ElastiCache cache, read replicas, DynamoDB eventually consistent reads</td></tr>
<tr><td>Reserving stock, seats or tickets</td><td>Strong at the moment of the write</td><td>DynamoDB conditional write or transaction; SQL conditional UPDATE on the primary</td></tr>
<tr><td>Bank transfer between two accounts</td><td>ACID across items</td><td>RDS/Aurora transaction, or DynamoDB <code>TransactWriteItems</code></td></tr>
<tr><td>User edits profile and expects to see it</td><td>Read-your-writes</td><td>Read from the writer/leader for that user briefly, or return the new data in the write response</td></tr>
<tr><td>Global social feed with users on several continents</td><td>Eventual across Regions, low latency</td><td>DynamoDB global tables, per-Region reads, conflict-tolerant data model</td></tr>
<tr><td>Unique usernames or idempotency keys</td><td>Strong uniqueness</td><td>DynamoDB <code>attribute_not_exists</code> conditional put on the key; SQL unique constraint</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: consistency in DynamoDB (≈ $0 with on-demand capacity)", html: `
<p>Run in CloudShell or with your <code>academy-admin</code> profile. On-demand tables cost fractions of a cent for this exercise; delete the table at the end.</p>
<pre><code># 1. Create a small on-demand table
aws dynamodb create-table --table-name Inventory --attribute-definitions AttributeName=sku,AttributeType=S --key-schema AttributeName=sku,KeyType=HASH --billing-mode PAY_PER_REQUEST
aws dynamodb wait table-exists --table-name Inventory

# 2. Put 2 units in stock
aws dynamodb put-item --table-name Inventory --item '{"sku":{"S":"CONSOLE-X"},"stock":{"N":"2"}}'

# 3. Reserve three times with a conditional write (the third must fail)
for i in 1 2 3; do aws dynamodb update-item --table-name Inventory --key '{"sku":{"S":"CONSOLE-X"}}' --update-expression "SET stock = stock - :one" --condition-expression "stock &gt;= :one" --expression-attribute-values '{":one":{"N":"1"}}' --return-values UPDATED_NEW --query "Attributes.stock.N" --output text || echo "reservation $i rejected: sold out"; done

# 4. Compare read modes (both should show 0 now; note the consumed capacity)
aws dynamodb get-item --table-name Inventory --key '{"sku":{"S":"CONSOLE-X"}}' --return-consumed-capacity TOTAL
aws dynamodb get-item --table-name Inventory --key '{"sku":{"S":"CONSOLE-X"}}' --consistent-read --return-consumed-capacity TOTAL

# 5. Clean up
aws dynamodb delete-table --table-name Inventory</code></pre>
<p><strong>What to notice:</strong> step 3 prints <code>1</code>, <code>0</code> and then the rejection. In step 4 the eventually consistent read consumes 0.5 capacity units and the strongly consistent read 1.0. You won't easily <em>see</em> a stale read in one Region (DynamoDB replicas usually converge in well under a second), which is exactly why concurrency bugs pass single-user testing and appear under load.</p>` },

    { type: "casestudy", title: "Case study: Pixelcart's flash-sale oversell", html: `
<p><strong>Context.</strong> Pixelcart is a fictional electronics retailer. Its checkout service ran on ECS and stored inventory in an Aurora MySQL cluster with two Aurora Replicas. To take load off the writer, the team had pointed <em>all</em> reads, including the stock check, at the reader endpoint, then performed the purchase as two steps: "read stock; if &gt; 0, insert order and update stock to stock − 1 computed in the application".</p>
<p><strong>Incident.</strong> During a flash sale of 50 consoles, about 4,000 checkout requests arrived in the first 20 seconds. Two problems compounded:</p>
<ul>
  <li><strong>Stale reads:</strong> under the write burst, replica lag reached a few hundred milliseconds, so many requests saw stock that had already been sold.</li>
  <li><strong>Lost updates:</strong> even requests that read the writer did read-then-write in the application, so concurrent sessions both computed the same new value.</li>
</ul>
<p>The system sold 312 units. The company cancelled 262 orders, paid goodwill vouchers, and made the news for the wrong reasons.</p>
<p><strong>Analysis.</strong> The architect separated the <em>display</em> path from the <em>decision</em> path. Product pages and "only a few left!" banners can tolerate staleness. Reserving a unit cannot.</p>
<p><strong>Redesign.</strong></p>
<ul>
  <li>Inventory reservations moved to a DynamoDB table keyed by SKU, using a <strong>conditional update</strong> (<code>stock &gt;= :qty</code>) so the check and the decrement are one atomic operation. Order creation and reservation were combined in a <code>TransactWriteItems</code> call with an idempotency key, so retries can't double-reserve.</li>
  <li>Page views read stock from a cache with a 2-second TTL, and the UI shows "availability confirmed at checkout".</li>
  <li>For the hottest SKUs, a queue (SQS FIFO with the SKU as message group) serialises reservation requests, smoothing the burst and preserving order.</li>
  <li>For the remaining SQL paths, every stock change became a single conditional <code>UPDATE … WHERE stock &gt;= 1</code> on the writer endpoint, checking rows affected.</li>
  <li>A load test with 5,000 concurrent buyers for 50 units became part of the release pipeline.</li>
</ul>
<p><strong>Result.</strong> At the next sale, 50 units sold, 3,950 buyers received an immediate "sold out" answer, and writer CPU stayed below 40% because reads were served from the cache.</p>
<p><strong>Lessons learned.</strong> (1) Use eventual consistency for what users <em>see</em>, strong consistency for what the business <em>decides</em>. (2) "Read, compute, write" in application code is a race condition; push the condition into the datastore. (3) Concurrency bugs only show up under concurrent tests.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Scenario keywords</th><th>Points to</th></tr></thead>
<tbody>
<tr><td>"Application must always read the most recent data" (DynamoDB)</td><td>Strongly consistent reads (<code>ConsistentRead</code>), on the base table, not a GSI</td></tr>
<tr><td>"Read replica returns outdated data"</td><td>Asynchronous replication lag; read from the primary/writer for that request</td></tr>
<tr><td>"Prevent two users from buying the last item", "avoid overwriting concurrent updates"</td><td>DynamoDB conditional writes / optimistic locking with a version attribute; transactions</td></tr>
<tr><td>"All-or-nothing changes to several items"</td><td>DynamoDB transactions or a relational database transaction</td></tr>
<tr><td>"Multi-Region, active-active, low-latency writes for global users"</td><td>DynamoDB global tables (eventually consistent across Regions, last writer wins)</td></tr>
<tr><td>"Read-heavy, global, cross-Region reads with fast regional DR" (relational)</td><td>Aurora Global Database (writes in one primary Region)</td></tr>
<tr><td>"Immediately read an object after uploading it" (S3)</td><td>Works: S3 is strongly consistent for reads after writes</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li>"Use S3 eventual consistency workarounds" (adding delays): outdated since 2020.</li>
  <li>"Use a read replica for strongly consistent reads": replicas are asynchronous.</li>
  <li>"Enable DAX to get strong consistency": DAX caches eventually consistent reads; strongly consistent reads pass through to DynamoDB.</li>
  <li>"Multi-AZ standby for read scaling" on an RDS Multi-AZ instance: the standby isn't readable.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Make the guarantee explicit per operation</strong> in API contracts ("balance is real-time", "recommendations may be up to 5 minutes old"). Unstated assumptions become production bugs.</li>
  <li><strong>Prefer a single writer per item.</strong> Even in multi-Region designs, giving each customer a home Region avoids most conflict-resolution complexity.</li>
  <li><strong>LWW silently discards data.</strong> With global tables, design items so concurrent writes to the same item are rare, or use additive structures (separate items per event) instead of overwriting.</li>
  <li><strong>Caches are replicas too.</strong> Choose TTLs deliberately, invalidate on writes where it matters, and never make a decision from a cached value.</li>
  <li><strong>Monitor lag</strong> (<code>ReplicaLag</code>, <code>AuroraReplicaLag</code>, global-table <code>ReplicationLatency</code>) and alarm on it; lag spikes during incidents and bulk loads.</li>
  <li><strong>Distance costs latency.</strong> Strong consistency across Regions means a round trip of tens to hundreds of milliseconds per write (PACELC's "EC"). Keep strongly consistent paths within a Region unless the business truly needs more.</li>
  <li><strong>Idempotency + conditional writes</strong> are the workhorses: together they make retries safe and races harmless.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Replication gives availability, scale and locality, and creates the possibility of disagreement between copies.</li>
  <li>Synchronous replication: no loss, higher latency. Asynchronous: low latency, possible stale reads and data loss up to the lag.</li>
  <li>Models: strong (behaves like one copy) → causal → read-your-writes / monotonic reads → eventual (converges if writes stop).</li>
  <li>Quorums: W + R &gt; N guarantees reads see the latest acknowledged write.</li>
  <li>CAP: during a partition, choose consistency or availability. PACELC: otherwise, choose latency or consistency.</li>
  <li>S3 is strongly consistent; DynamoDB reads are eventual by default with an opt-in strong read; read replicas and caches are asynchronous; Multi-AZ standbys are synchronous.</li>
  <li>Prevent oversells and lost updates with atomic conditional writes or transactions on the authoritative copy, not read-then-write in code.</li>
  <li>Use eventual consistency for displays, strong consistency for decisions.</li>
</ul>` }
  ],
  drills: [
    { id: "M04.04-d1", q: "N = 3, W = 2, R = 2. Is every read guaranteed to see the latest acknowledged write? (yes/no)", answers: ["yes", "y"], hint: "Compare W + R with N.", explain: "2 + 2 = 4 > 3, so read and write sets always overlap." },
    { id: "M04.04-d2", q: "N = 3, W = 1, R = 1. Is every read guaranteed to see the latest acknowledged write? (yes/no)", answers: ["no", "n"], explain: "1 + 1 = 2 ≤ 3: a read may hit a replica that missed the write." },
    { id: "M04.04-d3", q: "N = 5 and W = 3. What is the smallest R that guarantees fresh reads?", answers: ["3"], hint: "W + R must be greater than N.", explain: "3 + R > 5 → R ≥ 3." },
    { id: "M04.04-d4", q: "N = 5 and W = 3. How many replicas can be down while writes still succeed?", answers: ["2", "two"], explain: "N − W = 5 − 3 = 2." },
    { id: "M04.04-d5", q: "A user posts a comment and must see it on the very next page load, though other users may see it a little later. Which consistency guarantee is this? (hyphenated, e.g. x-y-z)", answers: ["read-your-writes", "read your writes", "readyourwrites", "read-your-own-writes"], explain: "Read-your-writes: a client always sees its own earlier writes." },
    { id: "M04.04-d6", q: "What consistency does a DynamoDB GetItem use if you don't set ConsistentRead? (one word)", answers: ["eventual", "eventually", "eventually consistent", "eventual consistency"], explain: "Eventually consistent by default; ConsistentRead=true opts in to a strongly consistent read at twice the cost." },
    { id: "M04.04-d7", q: "A strongly consistent DynamoDB read of a 6 KB item consumes how many read capacity units?", answers: ["2", "2rcu", "2 rcu"], hint: "One RCU covers a strongly consistent read of up to 4 KB.", explain: "6 KB rounds up to 8 KB = 2 × 4 KB → 2 RCU (an eventually consistent read would be 1)." }
  ],
  check: [
    { id: "M04.04-k1", type: "single", domain: "D3", task: "3.3", level: 300,
      stem: "A gaming company stores player balances in DynamoDB. After a purchase, the game immediately reads the balance and sometimes shows the old value. The read must always return the latest value. What is the MOST appropriate change?",
      options: [
        { t: "Set ConsistentRead=true on the GetItem call that follows a purchase", c: true, why: "A strongly consistent read of the base table returns the latest acknowledged write." },
        { t: "Read the balance from a global secondary index", c: false, why: "GSIs support only eventually consistent reads." },
        { t: "Add DynamoDB Accelerator (DAX) in front of the table", c: false, why: "DAX caches eventually consistent reads; it doesn't make reads stronger." },
        { t: "Convert the table to a global table", c: false, why: "Global tables add cross-Region asynchronous replication, which doesn't help here." }
      ] },
    { id: "M04.04-k2", type: "single", domain: "D3", task: "3.3", level: 300,
      stem: "An application writes to an Amazon RDS for PostgreSQL primary and reads from a read replica to offload traffic. Users complain that changes they just saved sometimes don't appear. What is the cause and the BEST fix?",
      options: [
        { t: "Asynchronous replication lag; read from the primary for requests that follow the user's own write", c: true, why: "Read replicas are asynchronous. Routing read-your-writes traffic to the primary fixes it while keeping other reads on replicas." },
        { t: "The read replica is in a different AZ; move it to the primary's AZ", c: false, why: "Lag comes from asynchronous replication, not mainly from the AZ." },
        { t: "Enable Multi-AZ and read from the standby", c: false, why: "On an RDS Multi-AZ instance the standby isn't readable." },
        { t: "Increase the replica's storage size", c: false, why: "Storage size doesn't change replication semantics." }
      ] },
    { id: "M04.04-k3", type: "multi", domain: "D2", task: "2.1", level: 300,
      stem: "An online ticketing system must never sell the same seat twice, even with many concurrent buyers. Seats are stored in DynamoDB. Which TWO approaches meet the requirement?",
      options: [
        { t: "Use a conditional write that only marks the seat sold if its status is currently available", c: true, why: "The condition is evaluated atomically with the write, so only one buyer can succeed." },
        { t: "Use TransactWriteItems to reserve the seat and create the order atomically", c: true, why: "Transactions are ACID and serializable; conflicting transactions fail." },
        { t: "Read the seat with an eventually consistent read and write it if it looks available", c: false, why: "Read-then-write is a race, and the read may also be stale." },
        { t: "Cache seat status in ElastiCache and check the cache before writing", c: false, why: "The cache is asynchronous and the check isn't atomic with the write." },
        { t: "Enable DynamoDB global tables so each Region can sell seats", c: false, why: "Multi-Region writes with last-writer-wins make double-selling more likely." }
      ] },
    { id: "M04.04-k4", type: "single", domain: "D2", task: "2.1", level: 300,
      stem: "Which statement about the CAP theorem is correct?",
      options: [
        { t: "When a network partition occurs, a distributed data store must choose between consistency and availability", c: true, why: "That is the precise statement; outside partitions both can be provided." },
        { t: "A distributed system can choose to give up partition tolerance and be both consistent and available", c: false, why: "Partitions happen in real networks; only a single-node system avoids them." },
        { t: "CAP's availability means the system meets a 99.99% SLA", c: false, why: "CAP availability means every request to a non-failed node gets a non-error response; it isn't an SLA." },
        { t: "CAP shows that eventually consistent systems are always faster", c: false, why: "Latency vs consistency in normal operation is PACELC's 'else' trade-off, not CAP." }
      ] },
    { id: "M04.04-k5", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "A data pipeline uploads a file to Amazon S3, overwriting an existing object, and the next step immediately downloads it. What will the next step receive?",
      options: [
        { t: "The new version, because S3 provides strong read-after-write consistency for overwrites", c: true, why: "Since December 2020, S3 is strongly consistent for PUTs (including overwrites), DELETEs and LISTs." },
        { t: "Possibly the old version for a few seconds, so the pipeline must add a delay", c: false, why: "That was true for overwrites before 2020, but is no longer the case." },
        { t: "An error until replication to all AZs completes", c: false, why: "The PUT succeeds only once the data is durably stored, and reads then return it." },
        { t: "The old version until the object's cache TTL expires", c: false, why: "S3 has no TTL; CloudFront caching would be a different matter." }
      ] },
    { id: "M04.04-k6", type: "single", domain: "D3", task: "3.3", level: 300,
      stem: "A social app is deployed in three Regions with DynamoDB global tables so users can write locally with low latency. Two users edit the same shared document attribute at the same moment in different Regions. What happens by default?",
      options: [
        { t: "Replication is asynchronous and the concurrent updates are reconciled with last writer wins, so one edit is overwritten", c: true, why: "Global tables (in their default mode) resolve concurrent writes with last-writer-wins; design the data model to avoid same-item conflicts." },
        { t: "Both writes are rejected until the Regions agree", c: false, why: "The default mode is multi-active and accepts local writes." },
        { t: "DynamoDB merges both edits automatically", c: false, why: "There is no automatic merge of attribute values." },
        { t: "The write in the oldest Region always wins", c: false, why: "Resolution is by timestamp, not Region age." }
      ] }
  ],
  cards: ["fc-M04-4-01", "fc-M04-4-02", "fc-M04-4-03", "fc-M04-4-04", "fc-M04-4-05", "fc-M04-4-06", "fc-M04-4-07", "fc-M04-4-08", "fc-M04-4-09", "fc-M04-4-10", "fc-M04-4-11", "fc-M04-4-12"],
  references: [
    "<em>System Design on AWS</em> ch.1 (PDF p22–50): consistency, CAP and distributed-system trade-offs",
    "Amazon DynamoDB Developer Guide: <em>Read consistency</em>, <em>Condition expressions</em>, <em>Transactions</em>, <em>Global tables</em>",
    "Amazon S3 User Guide: <em>Amazon S3 data consistency model</em>",
    "Amazon Aurora User Guide: <em>Replication with Aurora</em>; Aurora storage quorum (Verbitski et al., SIGMOD 2017)",
    "DeCandia et al., <em>Dynamo: Amazon's Highly Available Key-value Store</em> (2007); Gilbert and Lynch (2002) proof of CAP; Abadi, <em>Consistency Tradeoffs in Modern Distributed Database System Design</em> (2012)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-4-01", front: "Synchronous vs asynchronous replication?", back: "Sync: writer waits for replicas; no loss, higher latency (RDS Multi-AZ). Async: ack after leader only; low latency, stale reads and loss up to the lag (read replicas, global tables)." },
  { id: "fc-M04-4-02", front: "Strong vs eventual consistency?", back: "Strong: every read after an acknowledged write sees it (like one copy). Eventual: replicas converge if writes stop; reads may be stale meanwhile." },
  { id: "fc-M04-4-03", front: "Read-your-writes vs monotonic reads?", back: "Read-your-writes: you always see your own writes. Monotonic reads: you never see an older value after a newer one." },
  { id: "fc-M04-4-04", front: "Quorum rule for fresh reads?", back: "W + R > N. Writes tolerate N − W failures; reads tolerate N − R." },
  { id: "fc-M04-4-05", front: "CAP theorem, precisely?", back: "During a network partition, a distributed store must choose consistency (refuse/wait) or availability (answer, maybe stale). Outside partitions you can have both." },
  { id: "fc-M04-4-06", front: "What does PACELC add to CAP?", back: "Else (no partition), choose Latency or Consistency. E.g. DynamoDB default reads: PA/EL; single-leader SQL: PC/EC." },
  { id: "fc-M04-4-07", front: "S3 consistency model?", back: "Strong read-after-write for PUT (incl. overwrite), DELETE and LIST, all Regions, since Dec 2020. Cross-Region Replication is async." },
  { id: "fc-M04-4-08", front: "DynamoDB read consistency options and cost?", back: "Default eventually consistent (0.5 RCU per 4 KB). ConsistentRead=true: strongly consistent, 1 RCU per 4 KB, base table only (not GSIs)." },
  { id: "fc-M04-4-09", front: "How do DynamoDB global tables resolve concurrent writes (default mode)?", back: "Asynchronous multi-Region replication with last writer wins." },
  { id: "fc-M04-4-10", front: "How do you prevent a lost update / oversell?", back: "Atomic conditional write (DynamoDB ConditionExpression; SQL UPDATE … WHERE stock >= 1), row lock, or a transaction. Never read-then-write in app code." },
  { id: "fc-M04-4-11", front: "ACID vs BASE?", back: "ACID: atomic, consistent (constraints), isolated, durable. BASE: basically available, soft state, eventually consistent." },
  { id: "fc-M04-4-12", front: "Default isolation levels: PostgreSQL vs MySQL InnoDB?", back: "PostgreSQL: Read Committed. MySQL InnoDB: Repeatable Read. (Same on Aurora.)" }
);
// ================================================================== 05_performance.js
/* ---------------------------------------------------------------- M04.05 Latency, throughput and performance */
var DG_0405_DIST = `
<figure>
<svg class="diagram" viewBox="0 0 760 270" role="img" aria-labelledby="m0405at m0405ad">
  <title id="m0405at">A latency distribution with a long tail</title>
  <desc id="m0405ad">A histogram of request latencies. Most requests cluster on the left; a thin tail stretches far to the right. The median p50 sits in the cluster, the mean sits to its right because the tail pulls it, p90 is further right, and p99 is far out in the tail.</desc>
  <rect class="dg-info" x="40" y="221" width="24" height="9"/>
  <rect class="dg-info" x="68" y="194" width="24" height="36"/>
  <rect class="dg-info" x="96" y="149" width="24" height="81"/>
  <rect class="dg-info" x="124" y="104" width="24" height="126"/>
  <rect class="dg-info" x="152" y="86" width="24" height="144"/>
  <rect class="dg-info" x="180" y="95" width="24" height="135"/>
  <rect class="dg-info" x="208" y="122" width="24" height="108"/>
  <rect class="dg-info" x="236" y="149" width="24" height="81"/>
  <rect class="dg-info" x="264" y="172" width="24" height="58"/>
  <rect class="dg-info" x="292" y="190" width="24" height="40"/>
  <rect class="dg-info" x="320" y="201" width="24" height="29"/>
  <rect class="dg-info" x="348" y="208" width="24" height="22"/>
  <rect class="dg-info" x="376" y="214" width="24" height="16"/>
  <rect class="dg-info" x="404" y="217" width="24" height="13"/>
  <rect class="dg-info" x="432" y="220" width="24" height="10"/>
  <rect class="dg-info" x="460" y="222" width="24" height="8"/>
  <rect class="dg-info" x="488" y="223" width="24" height="7"/>
  <rect class="dg-info" x="516" y="224" width="24" height="6"/>
  <rect class="dg-info" x="544" y="225" width="24" height="5"/>
  <rect class="dg-info" x="572" y="226" width="24" height="4"/>
  <rect class="dg-info" x="600" y="226" width="24" height="4"/>
  <rect class="dg-info" x="628" y="226" width="24" height="4"/>
  <rect class="dg-info" x="656" y="226" width="24" height="4"/>
  <rect class="dg-info" x="684" y="227" width="24" height="3"/>
  <path class="dg-line" d="M30 230 H740"/>
  <path class="dg-line" d="M192 64 V230" stroke-dasharray="4 4"/>
  <text class="dg-tb" x="188" y="58" text-anchor="end">p50 (median)</text>
  <path class="dg-line" d="M276 64 V230" stroke-dasharray="4 4"/>
  <text class="dg-tb" x="280" y="58">mean</text>
  <path class="dg-line" d="M332 64 V230" stroke-dasharray="4 4"/>
  <text class="dg-tb" x="336" y="40">p90</text>
  <path class="dg-line" d="M584 64 V230" stroke-dasharray="4 4"/>
  <text class="dg-tb" x="588" y="40">p99</text>
  <text class="dg-ts" x="588" y="56">1 in 100 is slower</text>
  <text class="dg-ts" x="604" y="150">long tail: GC pauses,</text><text class="dg-ts" x="604" y="166">retries, cold caches,</text><text class="dg-ts" x="604" y="182">noisy neighbours</text>
  <text class="dg-ts" x="660" y="248">latency →</text><text class="dg-ts" x="40" y="248">fast</text><text class="dg-ts" x="8" y="84">requests</text>
</svg>
<figcaption>Figure M04-5a. Real latency distributions are skewed. The mean is pulled right by the tail and describes almost nobody; percentiles describe what users actually experience, and the tail (p99, p99.9) is where your most active users live.</figcaption>
</figure>`;

var DG_0405_LADDER = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0405bt m0405bd">
  <title id="m0405bt">Latency ladder on a logarithmic scale</title>
  <desc id="m0405bd">Bars on a log scale from one nanosecond to one second: L1 cache 1 ns, main memory 100 ns, SSD random read about 100 microseconds, same-AZ round trip about half a millisecond, cross-AZ round trip one to two milliseconds, disk seek about 5 ms, and a US to Europe round trip of 70 to 150 ms. In brackets, each value is rescaled as if an L1 reference took one second.</desc>
  <text class="dg-tb" x="12" y="22">Operation</text><text class="dg-tb" x="210" y="22">Approximate latency (log scale) · (if L1 = 1 second)</text>
  <text class="dg-t" x="12" y="57">L1 cache reference</text>
  <rect class="dg-good" x="210" y="44" width="4" height="18" rx="3"/>
  <text class="dg-ts" x="222" y="57">1 ns  (1 s)</text>
  <text class="dg-t" x="12" y="91">Main memory read</text>
  <rect class="dg-good" x="210" y="78" width="92" height="18" rx="3"/>
  <text class="dg-ts" x="310" y="91">100 ns  (1.7 min)</text>
  <text class="dg-t" x="12" y="125">SSD random read</text>
  <rect class="dg-info" x="210" y="112" width="230" height="18" rx="3"/>
  <text class="dg-ts" x="448" y="125">~100 µs  (1.2 days)</text>
  <text class="dg-t" x="12" y="159">Round trip, same AZ</text>
  <rect class="dg-info" x="210" y="146" width="262" height="18" rx="3"/>
  <text class="dg-ts" x="480" y="159">~0.5 ms  (5.8 days)</text>
  <text class="dg-t" x="12" y="193">Round trip, cross-AZ</text>
  <rect class="dg-edge" x="210" y="180" width="284" height="18" rx="3"/>
  <text class="dg-ts" x="502" y="193">~1–2 ms  (~17 days)</text>
  <text class="dg-t" x="12" y="227">HDD disk seek</text>
  <rect class="dg-edge" x="210" y="214" width="308" height="18" rx="3"/>
  <text class="dg-ts" x="526" y="227">~5 ms  (58 days)</text>
  <text class="dg-t" x="12" y="261">Round trip, US ↔ Europe</text>
  <rect class="dg-bad" x="210" y="248" width="368" height="18" rx="3"/>
  <text class="dg-ts" x="586" y="261">~70–150 ms  (2–5 years)</text>
  <path class="dg-line" d="M210 284 H624"/>
  <path class="dg-line" d="M210 280 V288"/><text class="dg-ts" x="202" y="302">1 ns</text>
  <path class="dg-line" d="M348 280 V288"/><text class="dg-ts" x="340" y="302">1 µs</text>
  <path class="dg-line" d="M486 280 V288"/><text class="dg-ts" x="478" y="302">1 ms</text>
  <path class="dg-line" d="M624 280 V288"/><text class="dg-ts" x="616" y="302">1 s</text>
  <text class="dg-ts" x="12" y="302">Each tick = 1,000×</text>
</svg>
<figcaption>Figure M04-5b. Commonly quoted, order-of-magnitude latencies. The network and the disk, not the CPU, dominate most request times: one cross-continent round trip costs as much as a hundred million L1 cache hits.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.05", title: "Latency, throughput and performance", level: 200, minutes: 55,
  objectives: [
    "Distinguish latency, response time, throughput, bandwidth and IOPS, and convert between their units",
    "Compute and interpret percentiles (p50, p90, p99), and explain why averages and fan-out hide the tail",
    "Find a bottleneck with the USE and RED methods, and use queueing intuition and Little's law to size a system",
    "Choose the AWS lever (caching, replicas, instance family, EBS type, placement, edge, async) that fixes a given performance problem"
  ],
  sections: [
    { type: "why", html: `
<p>"The site is slow" is one of the most common complaints an architect hears, and one of the least precise. Slow for whom? All users or 1 in 100? Since when? Under what load? A team that cannot answer those questions usually responds by buying a bigger instance. Sometimes that works; often it just raises the bill, because the real bottleneck was a database connection limit, a chatty call pattern across Regions, or one slow microservice out of twenty.</p>
<p>Speed is a business metric. Retailers and search engines have long reported that small increases in page latency measurably reduce engagement and sales, and the users who suffer the slowest responses are often your heaviest users: they make the most requests, so they hit the tail most often.</p>
<p>On the SAA-C03 exam, Domain 3 (<em>Design High-Performing Architectures</em>, 24%) is full of performance signals: "single-digit millisecond latency", "microsecond reads", "IOPS-intensive", "global users experience high latency", "the database is overwhelmed by reads". This lesson gives you the vocabulary and the reasoning to map each signal to the right fix.</p>` },

    { type: "concept", title: "Latency, throughput, bandwidth and IOPS", html: DG_0405_LADDER + `
<h3>Definitions you must keep separate</h3>
<table>
<thead><tr><th>Term</th><th>Meaning</th><th>Typical unit</th><th>Pipe analogy</th></tr></thead>
<tbody>
<tr><td><strong>Latency</strong></td><td>Time for one unit of work to travel or wait: a packet crossing the network, a request waiting in a queue</td><td>ns, µs, ms</td><td>How long one drop of water takes to travel the length of the pipe</td></tr>
<tr><td><strong>Response time</strong></td><td>What the user feels: latency (network + waiting) plus processing time. <em>Response time = latency + processing time.</em></td><td>ms, s</td><td>Travel time plus the time the tap takes to fill your glass</td></tr>
<tr><td><strong>Bandwidth</strong></td><td>The theoretical maximum data rate of a link</td><td>bits per second (Mbps, Gbps)</td><td>The pipe's diameter</td></tr>
<tr><td><strong>Throughput</strong></td><td>The work actually completed per unit of time. Always ≤ bandwidth (or capacity).</td><td>MB/s, requests/s, transactions/s</td><td>How much water actually comes out per second</td></tr>
<tr><td><strong>IOPS</strong></td><td>Input/output operations per second against storage</td><td>operations/s</td><td>How many separate cups you can fill per second</td></tr>
</tbody></table>
<p>Two conversions come up constantly:</p>
<ul>
  <li><strong>Bits vs bytes.</strong> Network links are quoted in <em>bits</em> per second; files and disks in <em>bytes</em>. Divide by 8: a 1 Gbps link moves at most 125 MB/s; a 10 Gbps link at most 1.25 GB/s.</li>
  <li><strong>Storage throughput = IOPS × I/O size.</strong> 3,000 IOPS of 16 KiB I/Os is 48,000 KiB/s ≈ 46.9 MiB/s. The same volume doing 256 KiB I/Os needs only 500 IOPS to move 125 MiB/s. That is why databases (small random I/O) are IOPS-bound and analytics or log processing (large sequential I/O) is throughput-bound.</li>
</ul>

<h3>Latency is physics, not just code</h3>
<p>The ladder above shows commonly quoted orders of magnitude. The exact values vary with hardware and distance, but the <em>ratios</em> are what matter for design:</p>
<ul>
  <li>Memory is roughly 1,000 times faster than an SSD read, which is a few times faster than a same-AZ network round trip.</li>
  <li>A round trip inside an Availability Zone is typically well under a millisecond; between AZs in the same Region it is still around a millisecond or two. That is why AWS can run synchronous replication across AZs (RDS Multi-AZ) but not across continents.</li>
  <li>A round trip between continents is tens to hundreds of milliseconds and cannot be optimised below the speed of light in fibre (about 200,000 km/s, roughly two-thirds of the speed of light in vacuum). The only fix is to <strong>move the data or the compute closer to the user</strong>: CloudFront, Global Accelerator, a second Region, or a Local Zone.</li>
  <li>A design that makes 30 sequential calls across Regions spends seconds waiting on light, whatever instance size you choose.</li>
</ul>

<h3>The latency–throughput relationship</h3>
<p>Latency and throughput are related but not the same, and improving one can hurt the other:</p>
<ul>
  <li><strong>Batching</strong> raises throughput (fewer round trips, less overhead per item) but raises the latency of each individual item, which waits for the batch to fill. Kinesis producers, SQS batch APIs and database bulk inserts all make this trade.</li>
  <li><strong>Pushing utilisation higher</strong> raises throughput per dollar but makes requests queue, so latency rises, slowly at first and then explosively (see the queueing section).</li>
  <li>The design goal from the <em>System Design on AWS</em> book is a good one to memorise: <strong>maximum throughput within an acceptable latency</strong>.</li>
</ul>

<h3>Little's law: the bridge between them</h3>
<p>For any stable system, <strong>L = λ × W</strong>: the average number of requests in the system (L, the concurrency) equals the arrival rate (λ, throughput) times the average time each spends inside (W, latency). It needs no assumptions about distributions, which makes it the most useful formula in capacity planning:</p>
<ul>
  <li>2,000 requests/s × 0.05 s average duration = <strong>100 concurrent requests</strong> in flight. For AWS Lambda this is literally the concurrency you need (Lambda documents exactly this calculation).</li>
  <li>If latency doubles because a dependency slowed down, concurrency doubles too, at the same traffic. That is how a slow database exhausts thread pools, connection pools and Lambda concurrency limits upstream.</li>
</ul>

<h3>Performance vs scalability</h3>
<p>A <strong>performance</strong> problem means the system is slow even for one user (p50 = 800 ms with no load). A <strong>scalability</strong> problem means it is fast for a few users and slow under load. The fixes differ: performance problems need a better algorithm, query, cache or data locality; scalability problems need more parallel capacity, less contention or decoupling. Always check which one you have before choosing a fix.</p>` },

    { type: "concept", title: "Percentiles and the tail", html: DG_0405_DIST + `
<h3>Why averages lie</h3>
<p>Latency distributions are never bell-shaped. Most requests are fast, and a thin tail of slow ones (a garbage-collection pause, a retry, a cache miss, a cold Lambda start, a noisy neighbour) stretches far to the right. The <strong>mean</strong> is dragged towards that tail, so it describes almost no real request, and it hides the bad experiences completely. Two services can have the same 50 ms mean where one serves every request in 50 ms and the other serves 95% in 10 ms and 5% in 810 ms.</p>
<h3>Percentiles</h3>
<p>The <strong>p-th percentile</strong> is the value below which p% of observations fall. <strong>p90 = 48 ms</strong> means 90% of requests completed in 48 ms or less, and 10% took longer.</p>
<ul>
  <li><strong>p50 (median):</strong> the typical experience.</li>
  <li><strong>p90 / p95:</strong> the experience of your unluckier users; useful for capacity alarms.</li>
  <li><strong>p99 / p99.9:</strong> the tail. At 1,000 requests per second, p99 is ten users <em>every second</em>; p99.9 is one per second, 86,400 per day.</li>
  <li><strong>max:</strong> usually noise (one pathological request), but worth glancing at.</li>
</ul>
<p>The simplest way to compute one is the <strong>nearest-rank method</strong>: sort the N values and take the value at rank ⌈p/100 × N⌉. Monitoring systems use interpolation or sketches over huge sample counts, but the meaning is the same. The worked examples compute percentiles by hand.</p>

<h3>Tail latency amplification in fan-out</h3>
<p>Modern requests rarely hit one server. A product page might call 20 microservices in parallel and must wait for the <em>slowest</em> one. If each service is fast 99% of the time, the probability that <em>all</em> 20 are fast is 0.99<sup>20</sup> ≈ 0.818. So about <strong>18% of page loads</strong> include at least one p99-slow call, even though each service individually "meets its p99". With 100 calls it is 0.99<sup>100</sup> ≈ 0.366: <strong>63% of requests</strong> see a tail event.</p>
<table>
<thead><tr><th>Parallel calls per request (N)</th><th>P(all fast) = 0.99<sup>N</sup></th><th>Requests that hit at least one slow call</th></tr></thead>
<tbody>
<tr><td>1</td><td>0.990</td><td>1.0%</td></tr>
<tr><td>5</td><td>0.951</td><td>4.9%</td></tr>
<tr><td>10</td><td>0.904</td><td>9.6%</td></tr>
<tr><td>20</td><td>0.818</td><td>18.2%</td></tr>
<tr><td>50</td><td>0.605</td><td>39.5%</td></tr>
<tr><td>100</td><td>0.366</td><td>63.4%</td></tr>
</tbody></table>
<p>This is why large systems care about p99.9 of their back-ends, and why techniques such as reducing fan-out, caching aggregates, timeouts with fallbacks and <em>hedged requests</em> (send a second copy of a slow request to another replica and take whichever answers first) exist. Google's paper <em>The Tail at Scale</em> popularised these ideas.</p>

<h3>SLOs are written on percentiles</h3>
<p>A good performance objective names a percentile, a threshold, a window and a scope: <em>"99% of checkout API requests complete in under 300 ms, measured at the load balancer over 28 days."</em> An objective on the average is almost useless. Service level objectives were introduced in M04.01; here, remember that the alarm you configure in CloudWatch should usually watch p90 or p99, not Average.</p>` },

    { type: "concept", title: "Finding the bottleneck", html: `
<h3>Every system has one bottleneck at a time</h3>
<p>Throughput is limited by the most constrained resource on the path: CPU on one tier, database connections, disk IOPS, a NAT gateway, a lock in the code, a downstream API's rate limit. Speeding up anything else changes nothing. Find it before you fix it.</p>

<h3>The USE method (for resources)</h3>
<p>Brendan Gregg's USE method checks every resource (CPU, memory, network interface, disk, connection pool, thread pool, queue) for three things:</p>
<table>
<thead><tr><th>Check</th><th>Question</th><th>AWS examples</th></tr></thead>
<tbody>
<tr><td><strong>U</strong>tilisation</td><td>How busy is it (% of time or % of capacity used)?</td><td>EC2 <code>CPUUtilization</code>, RDS <code>CPUUtilization</code>, EBS throughput vs the volume's limit, DynamoDB consumed vs provisioned capacity</td></tr>
<tr><td><strong>S</strong>aturation</td><td>Is work queuing because it is full?</td><td>EBS <code>VolumeQueueLength</code>, RDS <code>DatabaseConnections</code> near max, SQS <code>ApproximateAgeOfOldestMessage</code>, Lambda throttles, T-instance CPU credit balance at zero</td></tr>
<tr><td><strong>E</strong>rrors</td><td>Is it failing?</td><td>ELB 5xx counts, DynamoDB <code>ThrottledRequests</code>, NAT gateway <code>ErrorPortAllocation</code>, EC2 status-check failures</td></tr>
</tbody></table>

<h3>The RED method (for services)</h3>
<p>For every service or endpoint, track <strong>R</strong>ate (requests/s), <strong>E</strong>rrors (failed requests/s) and <strong>D</strong>uration (latency percentiles). RED tells you <em>which</em> service is unhealthy; USE tells you <em>why</em>. Google's SRE book calls a similar set the four golden signals: latency, traffic, errors and saturation.</p>

<h3>Queueing: why "80% busy" is already slow</h3>
<p>When requests arrive randomly, a server that is busy some of the time makes new arrivals wait. Queueing theory's simplest model (M/M/1: random arrivals, random service times, one server) gives the average time in the system as <strong>W = 1 / (μ − λ)</strong>, where μ is the service rate and λ the arrival rate. Take a server that can handle μ = 100 requests/s (10 ms each):</p>
<table>
<thead><tr><th>Arrival rate λ</th><th>Utilisation ρ = λ/μ</th><th>Average time in system W</th></tr></thead>
<tbody>
<tr><td>50 req/s</td><td>50%</td><td>20 ms</td></tr>
<tr><td>70 req/s</td><td>70%</td><td>33 ms</td></tr>
<tr><td>80 req/s</td><td>80%</td><td>50 ms</td></tr>
<tr><td>90 req/s</td><td>90%</td><td>100 ms</td></tr>
<tr><td>95 req/s</td><td>95%</td><td>200 ms</td></tr>
<tr><td>99 req/s</td><td>99%</td><td>1,000 ms</td></tr>
</tbody></table>
<p>Real systems are not exactly M/M/1, but the shape always holds: <strong>latency grows slowly, then explodes as utilisation approaches 100%</strong>. This is why Auto Scaling target-tracking policies commonly aim for 50–70% CPU rather than 95%, and why a small traffic increase can turn a "fine" system into an outage. The tail is affected first and worst.</p>

<div class="callout tip"><strong>Rule of thumb:</strong> keep steady-state utilisation of latency-sensitive resources well below saturation, leave headroom for the loss of one AZ, and alarm on saturation signals (queue length, connection count, throttles) rather than only on averages.</div>` },

    { type: "workflow", title: "A performance investigation, step by step", html: `
<ol class="flow">
  <li><strong>Pin down the symptom.</strong> Which operation, which users, which percentile, since when? "Checkout p99 went from 250 ms to 1.4 s at 09:00 for EU users" is actionable; "the app is slow" is not.</li>
  <li><strong>Check the objective.</strong> Compare with the SLO. If p99 is within the objective, you may not have a problem worth the engineering cost.</li>
  <li><strong>Measure each hop.</strong> Break the response time into its parts: client → CloudFront → ALB → service → cache → database → external API. On AWS, ALB metrics (<code>TargetResponseTime</code> with p99), AWS X-Ray or CloudWatch Application Signals traces, and database Performance Insights show where the time goes. Look for the largest segment, or the one that changed.</li>
  <li><strong>Apply USE to the slow tier.</strong> Is a resource saturated (CPU, connections, IOPS, credits, throttles), or is the time spent waiting on something else (locks, a downstream call, DNS, TLS handshakes)?</li>
  <li><strong>Correlate with change.</strong> Deployments, configuration changes, traffic shifts, a new customer, a cache flush, a failover. Most regressions have a trigger.</li>
  <li><strong>Form one hypothesis and change one thing.</strong> Add an index, enable caching, fix an N+1 query, raise the connection pool, move a call off the critical path. Changing five things at once teaches you nothing.</li>
  <li><strong>Verify under realistic load.</strong> Load-test with production-like data and concurrency, and compare the full percentile curve, not just the mean.</li>
  <li><strong>Lock it in.</strong> Add an alarm on the percentile and on the saturation signal you found, document the fix in an ADR or runbook, and consider a performance test in the CI/CD pipeline (M38).</li>
</ol>` },

    { type: "aws", title: "Performance levers on AWS", html: `
<p>Each lever below attacks a specific cause. Exam questions describe the cause; your job is to pick the matching lever.</p>
<table>
<thead><tr><th>Problem</th><th>Lever</th><th>AWS services and features</th><th>Deep dive</th></tr></thead>
<tbody>
<tr><td>Users far from the Region</td><td>Move content or entry points to the edge</td><td><strong>CloudFront</strong> (cache static and dynamic content at edge locations), <strong>Global Accelerator</strong> (anycast static IPs, traffic rides the AWS backbone; for TCP/UDP and non-cacheable traffic), Route 53 latency-based routing to multiple Regions</td><td>M12</td></tr>
<tr><td>Repeated reads of the same data</td><td>Cache</td><td><strong>ElastiCache</strong> (Valkey/Redis OSS, Memcached; sub-millisecond), <strong>DynamoDB Accelerator (DAX)</strong> for microsecond DynamoDB reads, API Gateway caching, CloudFront</td><td>M23</td></tr>
<tr><td>Read-heavy relational database</td><td>Scale reads out</td><td>RDS read replicas (asynchronous), Aurora Replicas (shared storage, typically &lt;100 ms lag) behind the reader endpoint. <em>Multi-AZ standbys are for availability, not read scaling</em> (Multi-AZ DB clusters are the exception with readable standbys).</td><td>M21</td></tr>
<tr><td>Too many database connections (often from Lambda)</td><td>Pool connections</td><td><strong>RDS Proxy</strong> pools and shares connections, smooths failover</td><td>M21</td></tr>
<tr><td>Wrong compute shape</td><td>Right-size the instance family</td><td>Compute-optimised (C), memory-optimised (R, X), storage-optimised (I, D) with local NVMe instance store, accelerated (P, G, Inf, Trn); <strong>Graviton</strong> (Arm) for better price-performance; Lambda memory setting also scales CPU</td><td>M13, M16</td></tr>
<tr><td>Disk-bound database or application</td><td>Provision IOPS and throughput</td><td><strong>gp3</strong>: baseline 3,000 IOPS and 125 MiB/s included, raise IOPS and throughput independently of size. <strong>io2 Block Express</strong>: highest provisioned IOPS (up to 256,000 per volume) with sub-millisecond latency. <strong>Instance store</strong>: fastest, but ephemeral. Avoid gp2 burst-credit surprises.</td><td>M19</td></tr>
<tr><td>Node-to-node latency in HPC or tightly coupled clusters</td><td>Co-locate and accelerate the network</td><td><strong>Cluster placement group</strong> (one AZ, low latency, high throughput), Enhanced Networking (ENA), Elastic Fabric Adapter (EFA) for MPI/HPC</td><td>M13</td></tr>
<tr><td>Slow work on the request path</td><td>Go asynchronous</td><td><strong>SQS</strong> queue plus workers, SNS/EventBridge fan-out, Step Functions; return 202 Accepted and process later</td><td>M25, M26</td></tr>
<tr><td>Large object transfers</td><td>Parallelise and use the backbone</td><td>S3 multipart upload and byte-range fetches, <strong>S3 Transfer Acceleration</strong>, DataSync, Snow Family for very large offline transfers</td><td>M18, M20</td></tr>
<tr><td>S3 request rate</td><td>Spread across prefixes</td><td>S3 supports at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second <em>per prefix</em>; more prefixes, more parallel throughput</td><td>M18</td></tr>
<tr><td>Cold starts on latency-sensitive Lambda</td><td>Pre-initialise</td><td>Provisioned concurrency, SnapStart (for supported runtimes), smaller deployment packages</td><td>M16</td></tr>
</tbody></table>
<h3>Measuring on AWS (preview of M30)</h3>
<ul>
  <li><strong>CloudWatch percentiles:</strong> many metrics (for example ALB <code>TargetResponseTime</code>, API Gateway <code>Latency</code>) support extended statistics such as p50, p90, p99. Alarm on p99, not Average.</li>
  <li><strong>AWS X-Ray / CloudWatch Application Signals:</strong> distributed traces show each downstream call's contribution to a request.</li>
  <li><strong>RDS Performance Insights / Database Insights:</strong> which SQL statements and wait events consume database time.</li>
  <li><strong>Compute Optimizer:</strong> right-sizing recommendations for EC2, EBS, Lambda and ECS on Fargate.</li>
</ul>` },

    { type: "examples", title: "Worked examples", html: `
<h3>1. Percentiles from a sample</h3>
<p>Twenty response times (ms), already sorted:</p>
<pre><code>12 14 15 15 16 17 18 18 19 20 21 22 24 25 28 31 35 48 120 950</code></pre>
<table>
<thead><tr><th>Statistic</th><th>Working (nearest rank: ⌈p/100 × 20⌉)</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Mean</td><td>sum 1,468 ÷ 20</td><td><strong>73.4 ms</strong></td></tr>
<tr><td>p50</td><td>rank ⌈0.50 × 20⌉ = 10</td><td><strong>20 ms</strong></td></tr>
<tr><td>p90</td><td>rank ⌈0.90 × 20⌉ = 18</td><td><strong>48 ms</strong></td></tr>
<tr><td>p95</td><td>rank ⌈0.95 × 20⌉ = 19</td><td><strong>120 ms</strong></td></tr>
<tr><td>p99</td><td>rank ⌈0.99 × 20⌉ = 20</td><td><strong>950 ms</strong></td></tr>
</tbody></table>
<p>Notice that the mean (73.4 ms) is higher than the p90. It describes no user at all: 18 of 20 requests were 48 ms or faster, and two were very slow. A dashboard showing "average 73 ms" would hide both facts. (With only 20 samples, p99 is simply the maximum; real p99s need thousands of samples.)</p>

<h3>2. Fan-out</h3>
<p>A search page calls 20 back-ends in parallel; each has p99 = 200 ms and p50 = 20 ms. The page waits for the slowest call. P(all 20 under 200 ms) = 0.99<sup>20</sup> = 0.818, so about 18% of page loads take at least 200 ms, even though every back-end "has a 200 ms p99". The page's own p99 will be well above 200 ms. Halving the fan-out to 10 calls cuts the affected share to 9.6%.</p>

<h3>3. Utilisation and latency</h3>
<p>An API tier processes requests in 10 ms each (μ = 100 req/s per instance). At 50 req/s per instance the M/M/1 estimate is 20 ms; at 90 req/s it is 100 ms. Scaling from 4 to 6 instances at a constant 360 req/s total moves each instance from 90 to 60 req/s and the average from 100 ms to 25 ms. The extra capacity bought latency, not throughput.</p>

<h3>4. Little's law for concurrency</h3>
<table>
<thead><tr><th>Scenario</th><th>λ (throughput)</th><th>W (latency)</th><th>L = λ × W (concurrency)</th></tr></thead>
<tbody>
<tr><td>Lambda behind API Gateway</td><td>2,000 req/s</td><td>50 ms</td><td>100 concurrent executions</td></tr>
<tr><td>Same, after a database slow-down</td><td>2,000 req/s</td><td>400 ms</td><td>800 concurrent executions (and 800 database connections without RDS Proxy)</td></tr>
<tr><td>Web tier thread pool</td><td>300 req/s</td><td>0.2 s</td><td>60 busy threads</td></tr>
</tbody></table>

<h3>5. Bandwidth and transfer time</h3>
<ul>
  <li>1 TB over a fully used 1 Gbps link: 10<sup>12</sup> × 8 bits ÷ 10<sup>9</sup> bits/s = 8,000 s ≈ <strong>2.2 hours</strong>. Real links rarely sustain 100%, so plan for more.</li>
  <li>10 TB over a 100 Mbps office uplink: 800,000 s ≈ <strong>9.3 days</strong>. That is why exam answers send tens of terabytes over a slow link with an AWS Snowball device, or provision Direct Connect for ongoing transfers.</li>
</ul>

<h3>6. IOPS and throughput on EBS</h3>
<ul>
  <li>A database issuing 16 KiB random I/O at 3,000 IOPS moves 3,000 × 16 KiB ≈ 46.9 MiB/s. It is IOPS-bound: raise gp3 IOPS, or move to io2 if it needs very high IOPS with consistent sub-millisecond latency.</li>
  <li>A log processor reading 256 KiB sequential chunks hits gp3's included 125 MiB/s throughput at just 500 IOPS. It is throughput-bound: raise gp3 throughput (or use st1 for large sequential, infrequently accessed data). Buying IOPS would not help.</li>
</ul>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you would choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Global news site with slow page loads in Asia; content mostly static</td><td>CloudFront in front of the origin</td><td>Edge caches remove the cross-continent round trip for cacheable content</td></tr>
<tr><td>Multiplayer game using UDP needs low, consistent latency worldwide and fixed IPs for allow-lists</td><td>Global Accelerator</td><td>Anycast static IPs, traffic enters the AWS backbone at the nearest edge; supports UDP; no caching needed</td></tr>
<tr><td>Product catalogue read 100× more than written; RDS CPU at 90% from SELECTs</td><td>ElastiCache (cache-aside) and/or read replicas</td><td>Offload repeated reads; replicas scale reads without application caching logic</td></tr>
<tr><td>DynamoDB table with hot read keys needs microsecond latency</td><td>DAX</td><td>In-memory, DynamoDB API-compatible cache</td></tr>
<tr><td>Serverless API exhausts database connections during spikes</td><td>RDS Proxy</td><td>Pools and multiplexes connections (Little's law: concurrency spikes when latency rises)</td></tr>
<tr><td>Tightly coupled HPC simulation across many instances</td><td>Cluster placement group + EFA</td><td>Lowest inter-node latency and highest throughput within one AZ</td></tr>
<tr><td>Image resizing makes uploads take 6 seconds</td><td>Upload to S3, SQS/EventBridge, asynchronous workers</td><td>Remove slow work from the user's request path</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: measure percentiles yourself", html: `
<p>Run this in WSL, Linux or CloudShell. It sends 50 requests and computes the distribution, so you can see a tail with your own eyes.</p>
<pre><code># 1. Collect 50 total response times (seconds) from curl
for i in $(seq 1 50); do curl -s -o /dev/null -w '%{time_total}\\n' https://aws.amazon.com/; done &gt; times.txt

# 2. Compute mean and nearest-rank percentiles (milliseconds)
python3 -c "
import math
v = sorted(float(x) * 1000 for x in open('times.txt'))
n = len(v)
pct = lambda p: v[math.ceil(p / 100 * n) - 1]
print('n=%d mean=%.1f p50=%.1f p90=%.1f p99=%.1f max=%.1f' % (n, sum(v) / n, pct(50), pct(90), pct(99), v[-1]))
"</code></pre>
<p>Typical output (yours will differ):</p>
<pre><code>n=50 mean=142.7 p50=118.3 p90=171.9 p99=702.4 max=702.4</code></pre>
<p>Run it again from CloudShell in a Region near you and in one far away, and compare p50: the difference is mostly network round trips (connection set-up plus TLS, as you measured in M02.05).</p>
<p><strong>Optional (if you have an ALB):</strong> fetch p50 and p99 target response time for the last hour in 5-minute periods. Replace the load balancer dimension with yours (the part of its ARN after <code>loadbalancer/</code>):</p>
<pre><code>aws cloudwatch get-metric-statistics --namespace AWS/ApplicationELB --metric-name TargetResponseTime --dimensions Name=LoadBalancer,Value=app/my-alb/0123456789abcdef --start-time $(date -u -d '-1 hour' +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 300 --extended-statistics p50 p99 --profile academy-admin</code></pre>` },

    { type: "casestudy", title: "Case study: the p99 that tripled after a \"small\" feature", html: `
<p><strong>Company:</strong> Marlowe Travel (fictional), an online travel agency. Its trip-summary API assembles a page from <strong>20 microservices</strong>: flights, hotels, prices, loyalty points, reviews, weather and so on. It runs on ECS behind an ALB in eu-west-1, with Aurora PostgreSQL and a few external partner APIs.</p>
<p><strong>Symptom:</strong> after a release that added four new widgets, the API's p50 stayed at 140 ms but <strong>p99 rose from 420 ms to 1.3 s</strong>, and mobile conversion fell. The average had barely moved, so the existing alarm (on Average) never fired; customer complaints found it first.</p>
<p><strong>Investigation (following the workflow):</strong></p>
<ul>
  <li>X-Ray traces showed the new widgets made the aggregator call 6 services <em>sequentially</em> (each needed an ID from the previous one) instead of in parallel, and raised the parallel fan-out from 14 to 20 calls.</li>
  <li>The reviews service had a p99 of 900 ms due to a partner API; it was now on the critical path with no timeout.</li>
  <li>Aurora was fine (CPU 35%), but the loyalty service opened a new database connection per request, so the database's connection count spiked during traffic bursts.</li>
</ul>
<p><strong>Fixes:</strong></p>
<table>
<thead><tr><th>Change</th><th>Lever</th><th>Effect</th></tr></thead>
<tbody>
<tr><td>Restructured calls: fetch IDs once, then call the 6 services in parallel</td><td>Reduce sequential round trips</td><td>−250 ms at p50 for the affected pages</td></tr>
<tr><td>Timeout of 250 ms on reviews, with a "reviews unavailable" fallback</td><td>Bound the tail, degrade gracefully</td><td>The slow partner no longer sets the page's p99</td></tr>
<tr><td>Cached weather and reviews summaries in ElastiCache for 5 minutes</td><td>Cache</td><td>Fan-out on the critical path dropped from 20 to 12 calls</td></tr>
<tr><td>Connection pooling in the loyalty service (and RDS Proxy evaluated)</td><td>Pool connections</td><td>Removed connection-storm latency spikes</td></tr>
<tr><td>Alarm on ALB <code>TargetResponseTime</code> p99 &gt; 500 ms for 3 of 5 minutes</td><td>Measure the right thing</td><td>The next regression was caught in canary</td></tr>
</tbody></table>
<p><strong>Result:</strong> p99 fell to 380 ms, below the original, and p50 to 110 ms, with no larger instances. Monthly cost went up by roughly the price of a small ElastiCache cluster.</p>
<p><strong>Lessons learned:</strong> watch percentiles, not averages; every extra call in a fan-out raises the odds of a tail event; put timeouts and fallbacks on non-essential dependencies; and look at the call graph before buying hardware.</p>` },

    { type: "exam", html: `
<h3>Keyword → answer</h3>
<table>
<thead><tr><th>Stem says</th><th>Think</th></tr></thead>
<tbody>
<tr><td>"Global users", "reduce latency", static or cacheable content</td><td>CloudFront</td></tr>
<tr><td>"Static IP addresses", "TCP/UDP", "non-HTTP", "improve global performance", fast Regional failover</td><td>Global Accelerator</td></tr>
<tr><td>"Single-digit millisecond" at any scale (key-value)</td><td>DynamoDB</td></tr>
<tr><td>"Microsecond" reads for DynamoDB</td><td>DAX</td></tr>
<tr><td>"Sub-millisecond", "session store", "leaderboard", "cache query results"</td><td>ElastiCache</td></tr>
<tr><td>"Read-heavy", "reporting queries slow down the primary"</td><td>Read replicas (or Aurora Replicas), caching</td></tr>
<tr><td>"Too many connections", "Lambda + RDS"</td><td>RDS Proxy</td></tr>
<tr><td>"Highest IOPS", "consistent sub-millisecond", "mission-critical database"</td><td>io2 Block Express (or instance store if data can be lost)</td></tr>
<tr><td>"Low latency between instances", "HPC", "tightly coupled"</td><td>Cluster placement group (+ EFA)</td></tr>
<tr><td>"Large sequential throughput, lowest cost HDD"</td><td>st1</td></tr>
<tr><td>"Decouple", "the front end must respond quickly while processing continues"</td><td>SQS + asynchronous workers</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>"Use a larger instance"</strong> when the stem describes repeated reads (cache), distance (edge), or connection exhaustion (RDS Proxy).</li>
  <li><strong>"Enable Multi-AZ"</strong> to fix read performance. Multi-AZ instance deployments are for availability; read scaling needs replicas.</li>
  <li><strong>CloudFront vs Global Accelerator:</strong> both use the edge. CloudFront caches HTTP(S) content; Global Accelerator does not cache and works for any TCP/UDP traffic with static anycast IPs.</li>
  <li><strong>Spread placement group</strong> is for isolating instances on separate hardware (availability), not for low latency.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Measure before you buy.</strong> A trace and a percentile chart cost nothing compared with a mis-sized fleet. Most slowness is a call pattern, a missing index or a missing cache.</li>
  <li><strong>Set objectives on p99 at the edge of your system</strong> (load balancer or API Gateway), and keep per-dependency budgets: if the page budget is 300 ms, a non-essential dependency gets a 100 ms timeout, not "whatever it takes".</li>
  <li><strong>Leave headroom.</strong> Size for peak plus the loss of one AZ at a utilisation where latency is still flat (often 50–70%). Running "efficiently" at 90% CPU buys you a fragile tail.</li>
  <li><strong>Beware burst mechanics:</strong> T-family CPU credits, gp2 burst balance and Lambda burst limits make systems fast in testing and slow after sustained load. Watch the credit and balance metrics.</li>
  <li><strong>Caches are not free:</strong> they add consistency questions, a cold-start problem after deploys or failovers (a flood of misses can overload the database), and a new failure mode. Plan for cache warm-up and for the cache being down.</li>
  <li><strong>Load-test like production:</strong> realistic data volumes, realistic key distribution (hot keys), realistic concurrency, and measure from the client side. Report the full percentile curve.</li>
  <li><strong>Performance has a cost dimension:</strong> provisioned IOPS, provisioned concurrency and over-provisioned clusters cost money every hour. Right-size against the SLO, not against "as fast as possible".</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>Latency is time per unit of work; throughput is work per unit of time; bandwidth is the theoretical maximum; IOPS counts storage operations. Throughput = IOPS × I/O size; 1 Gbps = 125 MB/s.</li>
  <li>Distance dominates: memory is nanoseconds, same-AZ round trips are sub-millisecond, cross-continent round trips are tens to hundreds of milliseconds. Move data and compute closer to users.</li>
  <li>Averages hide the tail. Use percentiles (nearest rank: ⌈p/100 × N⌉) and set objectives and alarms on p90/p99.</li>
  <li>Fan-out amplifies the tail: P(all N fast) = 0.99<sup>N</sup>; 20 calls means about 18% of requests hit a slow one.</li>
  <li>Little's law: concurrency = throughput × latency. When latency rises, concurrency (connections, threads, Lambda executions) rises with it.</li>
  <li>Latency explodes as utilisation approaches 100%; keep headroom.</li>
  <li>Find the bottleneck with RED (which service) and USE (which resource) before changing anything.</li>
  <li>AWS levers: CloudFront / Global Accelerator (distance), ElastiCache / DAX (repeated reads), read replicas (read scale), RDS Proxy (connections), instance families and Graviton (compute), gp3 / io2 (IOPS and throughput), placement groups and EFA (node latency), SQS (asynchronous work).</li>
</ul>` }
  ],

  drills: [
    { id: "M04.05-d1", q: "Ten sorted latencies (ms): 8, 9, 10, 11, 12, 13, 15, 18, 40, 200. Using the nearest-rank method, what is the p90 in ms?", answers: ["40", "40ms", "40 ms"], hint: "Rank = ⌈0.90 × 10⌉ = 9. Take the 9th value.", explain: "The 9th value in sorted order is 40 ms." },
    { id: "M04.05-d2", q: "For the same ten values (8, 9, 10, 11, 12, 13, 15, 18, 40, 200), what is the mean in ms?", answers: ["33.6", "33.6ms", "33.6 ms"], hint: "Add them up and divide by 10.", explain: "Sum = 336, so the mean is 33.6 ms: higher than 8 of the 10 values because of the 200 ms outlier." },
    { id: "M04.05-d3", q: "A page waits for 20 parallel calls, each fast 99% of the time (independently). What percentage of page loads have ALL 20 calls fast? (one decimal place)", answers: ["81.8", "81.8%", "82", "82%", "81.79"], hint: "0.99 to the power of 20.", explain: "0.99^20 ≈ 0.818, so 81.8% of page loads are fully fast and about 18.2% hit at least one slow call." },
    { id: "M04.05-d4", q: "An M/M/1 server can process 200 requests/s and receives 180 requests/s. What is the average time in the system, in ms? (W = 1 / (μ − λ))", answers: ["50", "50ms", "50 ms"], hint: "μ − λ = 20 per second.", explain: "W = 1/20 s = 0.05 s = 50 ms. At 50% load (100 req/s) it would be 10 ms." },
    { id: "M04.05-d5", q: "A Lambda function receives 500 requests per second and each invocation takes 200 ms. How many concurrent executions does it need (Little's law)?", answers: ["100"], hint: "L = λ × W, with W in seconds.", explain: "500 × 0.2 = 100 concurrent executions." },
    { id: "M04.05-d6", q: "What is the maximum data rate of a 1 Gbps link in megabytes per second (MB/s, decimal)?", answers: ["125", "125mb/s", "125 MB/s"], hint: "8 bits per byte.", explain: "1,000 Mbps ÷ 8 = 125 MB/s." },
    { id: "M04.05-d7", q: "An EBS workload performs 4,000 IOPS with 64 KiB I/Os. What throughput is that, in MiB/s?", answers: ["250", "250mib/s", "250 MiB/s"], hint: "Throughput = IOPS × I/O size; 1,024 KiB = 1 MiB.", explain: "4,000 × 64 KiB = 256,000 KiB/s = 250 MiB/s." },
    { id: "M04.05-d8", q: "How many hours does it take to move 2 TB (decimal) over a fully used 1 Gbps link? (one decimal place)", answers: ["4.4", "4.4h", "4.44", "4.4 hours"], hint: "2 × 10^12 bytes × 8 bits ÷ 10^9 bits/s, then ÷ 3,600.", explain: "16,000 s ÷ 3,600 ≈ 4.4 hours, before any protocol overhead." },
    { id: "M04.05-d9", q: "If an L1 cache reference (about 1 ns) took 1 second, how many seconds would a main-memory read (about 100 ns) take?", answers: ["100", "100s", "100 s"], hint: "Same ratio: 100 ns ÷ 1 ns.", explain: "100 seconds, under two minutes. A same-AZ round trip (~0.5 ms) would take about 5.8 days on the same scale." }
  ],

  check: [
    { id: "M04.05-k1", type: "single", domain: "D3", task: "3.1", level: 200,
      stem: "An API's average latency is 60 ms, which meets its target, but customers complain that some requests take several seconds. Which metric should the team alarm on to detect this problem?",
      options: [
        { t: "The p99 of the load balancer's target response time", c: true, why: "Percentiles expose the tail that users complain about; the average is pulled around by outliers and hides them." },
        { t: "The average target response time over 1 minute instead of 5", c: false, why: "A shorter window still averages the slow requests away with the fast ones." },
        { t: "Average CPU utilisation of the instances", c: false, why: "CPU is a resource metric; it may be normal while a downstream dependency causes slow requests." },
        { t: "The minimum response time", c: false, why: "The minimum shows the best case, the opposite of what customers report." }
      ] },
    { id: "M04.05-k2", type: "single", domain: "D3", task: "3.4", level: 200,
      stem: "A media company serves video thumbnails and static assets from an S3 bucket in us-east-1. Users in Australia and Europe report slow page loads. Which solution improves performance for these users with the LEAST operational overhead?",
      options: [
        { t: "Put an Amazon CloudFront distribution in front of the S3 bucket", c: true, why: "Edge caching removes the long round trip for cacheable content and is fully managed." },
        { t: "Copy the bucket to two more Regions with S3 Cross-Region Replication and route with Route 53 latency records", c: false, why: "Possible, but it adds buckets, replication and DNS to manage, and still lacks edge caching." },
        { t: "Move the bucket's contents to larger EC2 instances running a web server", c: false, why: "Instance size does not fix distance, and it adds servers to operate." },
        { t: "Enable S3 Transfer Acceleration for downloads", c: false, why: "Transfer Acceleration speeds up long-distance transfers to and from the bucket but does not cache content near users; CloudFront is the standard answer for serving content." }
      ] },
    { id: "M04.05-k3", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "An e-commerce application's Amazon RDS for MySQL instance runs at 90% CPU. Analysis shows 85% of queries are identical product-catalogue SELECTs, and catalogue data changes a few times per hour. What should a solutions architect do to reduce the database load MOST effectively?",
      options: [
        { t: "Cache the catalogue query results in Amazon ElastiCache using a cache-aside pattern", c: true, why: "Repeated identical reads of slowly changing data are the ideal caching case; most queries never reach the database." },
        { t: "Convert the instance to a Multi-AZ deployment", c: false, why: "A Multi-AZ instance standby is for failover and does not serve reads." },
        { t: "Move the database storage from gp3 to io2", c: false, why: "The bottleneck is CPU from repeated queries, not storage IOPS." },
        { t: "Increase the instance's allocated storage", c: false, why: "Storage size does not reduce CPU load from queries." }
      ] },
    { id: "M04.05-k4", type: "multi", domain: "D3", task: "3.1", level: 200,
      stem: "A tightly coupled scientific simulation runs on 32 EC2 instances that exchange messages constantly. Which TWO choices reduce inter-node latency the most?",
      options: [
        { t: "Launch the instances in a cluster placement group", c: true, why: "A cluster placement group packs instances close together in one AZ for low latency and high throughput." },
        { t: "Use an instance type that supports Elastic Fabric Adapter (EFA)", c: true, why: "EFA provides OS-bypass networking for MPI/HPC communication." },
        { t: "Spread the instances across three Availability Zones", c: false, why: "That improves availability but adds cross-AZ latency, the opposite of the goal." },
        { t: "Use a spread placement group", c: false, why: "Spread groups place instances on distinct hardware for isolation, not for low latency." },
        { t: "Put an Application Load Balancer between the nodes", c: false, why: "An extra L7 hop adds latency and doesn't fit node-to-node messaging." }
      ] },
    { id: "M04.05-k5", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "A serverless API built on API Gateway and AWS Lambda connects to an Amazon Aurora PostgreSQL cluster. During traffic spikes the database reports \"too many connections\" and latency rises sharply. What is the MOST appropriate solution?",
      options: [
        { t: "Put Amazon RDS Proxy between the Lambda functions and Aurora", c: true, why: "RDS Proxy pools and shares database connections, absorbing the concurrency spikes that Lambda scaling creates." },
        { t: "Increase the Lambda function's memory", c: false, why: "More memory speeds each invocation but doesn't cap the number of connections opened." },
        { t: "Add an Aurora Replica", c: false, why: "Replicas spread reads but each Lambda execution would still open its own connection." },
        { t: "Enable API Gateway caching for all methods", c: false, why: "Caching may help some GETs but doesn't solve connection exhaustion for writes or uncached requests." }
      ] },
    { id: "M04.05-k6", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "A log-analytics job on EC2 reads large files sequentially from a gp3 volume and is limited to about 125 MiB/s, while its IOPS are low. What change addresses the bottleneck directly?",
      options: [
        { t: "Increase the gp3 volume's provisioned throughput", c: true, why: "125 MiB/s is gp3's included baseline throughput; large sequential reads are throughput-bound, and gp3 lets you raise throughput independently." },
        { t: "Increase the gp3 volume's provisioned IOPS only", c: false, why: "The job does few, large I/Os; more IOPS don't raise the throughput limit." },
        { t: "Move the volume to io2 Block Express to get more IOPS", c: false, why: "io2 targets IOPS-intensive, latency-sensitive workloads and costs more; the constraint here is throughput." },
        { t: "Enable Multi-Attach on the volume", c: false, why: "Multi-Attach shares a volume between instances; it does not raise throughput." }
      ] }
  ],
  cards: ["fc-M04-5-01", "fc-M04-5-02", "fc-M04-5-03", "fc-M04-5-04", "fc-M04-5-05", "fc-M04-5-06", "fc-M04-5-07", "fc-M04-5-08", "fc-M04-5-09", "fc-M04-5-10", "fc-M04-5-11"],
  references: [
    "<em>System Design on AWS</em> ch.1 \"System Design Trade-offs\": latency vs throughput, performance vs scalability (PDF p42–44)",
    "J. Dean and L. A. Barroso, <em>The Tail at Scale</em>, Communications of the ACM, 2013",
    "B. Gregg, <em>The USE Method</em>; Google SRE book, ch.6 \"Monitoring Distributed Systems\" (the four golden signals)",
    "AWS documentation: Amazon EBS volume types; Amazon CloudWatch statistics (percentiles); Lambda concurrency; S3 performance guidelines",
    "AWS Well-Architected Framework, Performance Efficiency pillar"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-5-01", front: "Latency vs throughput vs bandwidth?", back: "Latency: time per unit of work. Throughput: work completed per unit of time (actual). Bandwidth: theoretical maximum data rate of a link." },
  { id: "fc-M04-5-02", front: "Response time formula?", back: "Response time = latency (network + waiting) + processing time." },
  { id: "fc-M04-5-03", front: "Storage throughput from IOPS?", back: "Throughput = IOPS × I/O size. 3,000 × 16 KiB ≈ 46.9 MiB/s. Small random I/O → IOPS-bound; large sequential → throughput-bound." },
  { id: "fc-M04-5-04", front: "Why alarm on p99 rather than the average?", back: "Latency distributions have long tails; the mean is distorted by outliers and hides the slow requests users complain about." },
  { id: "fc-M04-5-05", front: "Nearest-rank percentile method?", back: "Sort N values; pP = the value at rank ⌈P/100 × N⌉." },
  { id: "fc-M04-5-06", front: "Tail amplification with fan-out of 20 (each 99% fast)?", back: "P(all fast) = 0.99^20 ≈ 0.82, so ~18% of requests hit at least one slow call." },
  { id: "fc-M04-5-07", front: "Little's law?", back: "L = λ × W: concurrency = throughput × latency. 2,000 req/s × 0.05 s = 100 in flight." },
  { id: "fc-M04-5-08", front: "USE vs RED?", back: "USE (per resource): Utilisation, Saturation, Errors. RED (per service): Rate, Errors, Duration." },
  { id: "fc-M04-5-09", front: "What happens to latency as utilisation approaches 100%?", back: "It explodes (M/M/1: W = 1/(μ − λ)). Keep latency-sensitive resources well below saturation." },
  { id: "fc-M04-5-10", front: "CloudFront vs Global Accelerator?", back: "CloudFront: caches HTTP(S) content at the edge. Global Accelerator: no caching, static anycast IPs, any TCP/UDP, fast Regional failover." },
  { id: "fc-M04-5-11", front: "gp3 baseline and io2 Block Express?", back: "gp3: 3,000 IOPS and 125 MiB/s included, both raisable independently of size. io2 Block Express: up to 256,000 IOPS, sub-millisecond latency." }
);
// ================================================================== 06_fallacies.js
/* ---------------------------------------------------------------- M04.06 Fallacies of distributed computing */
var DG_0406_CALL = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="m0406at m0406ad">
  <title id="m0406at">Where a remote call can fail</title>
  <desc id="m0406ad">A client calls a load balancer, which calls a service, which writes to a database. Four numbered failure points: the request is lost or delayed on the network; the target behind the load balancer has been replaced; the service is slow; and the database commit succeeds but the reply is lost, so the client cannot tell whether the work happened.</desc>
  <defs><marker id="m0406a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-box" x="12" y="44" width="130" height="66" rx="8"/><text class="dg-tb" x="24" y="70">Client</text><text class="dg-ts" x="24" y="90">SDK / browser</text>
  <rect class="dg-box" x="210" y="44" width="130" height="66" rx="8"/><text class="dg-tb" x="222" y="70">Load balancer</text><text class="dg-ts" x="222" y="90">ALB / NLB</text>
  <rect class="dg-box" x="410" y="44" width="130" height="66" rx="8"/><text class="dg-tb" x="422" y="70">Service</text><text class="dg-ts" x="422" y="90">EC2 / ECS / Lambda</text>
  <rect class="dg-box" x="610" y="44" width="138" height="66" rx="8"/><text class="dg-tb" x="622" y="70">Database</text><text class="dg-ts" x="622" y="90">RDS / DynamoDB</text>
  <path class="dg-line" d="M142 62 H208" marker-end="url(#m0406a-ar)"/>
  <path class="dg-line" d="M210 94 H144" marker-end="url(#m0406a-ar)"/>
  <path class="dg-line" d="M340 62 H408" marker-end="url(#m0406a-ar)"/>
  <path class="dg-line" d="M410 94 H342" marker-end="url(#m0406a-ar)"/>
  <path class="dg-line" d="M540 62 H608" marker-end="url(#m0406a-ar)"/>
  <path class="dg-line" d="M610 94 H542" marker-end="url(#m0406a-ar)"/>
  <circle class="dg-bad" cx="176" cy="26" r="11"/><text class="dg-tb" x="172" y="31">1</text>
  <circle class="dg-bad" cx="375" cy="26" r="11"/><text class="dg-tb" x="371" y="31">2</text>
  <circle class="dg-bad" cx="475" cy="128" r="11"/><text class="dg-tb" x="471" y="133">3</text>
  <circle class="dg-bad" cx="575" cy="128" r="11"/><text class="dg-tb" x="571" y="133">4</text>
  <circle class="dg-bad" cx="24" cy="166" r="11"/><text class="dg-tb" x="20" y="171">1</text>
  <text class="dg-t" x="44" y="171">Request lost or delayed on the network → timeout, then retry</text>
  <circle class="dg-bad" cx="24" cy="194" r="11"/><text class="dg-tb" x="20" y="199">2</text>
  <text class="dg-t" x="44" y="199">Target replaced or scaled in (topology changed) → health checks, discovery</text>
  <circle class="dg-bad" cx="24" cy="222" r="11"/><text class="dg-tb" x="20" y="227">3</text>
  <text class="dg-t" x="44" y="227">Service slow (GC pause, overload): dead or just slow? → timeout, circuit breaker</text>
  <circle class="dg-bad" cx="24" cy="250" r="11"/><text class="dg-tb" x="20" y="255">4</text>
  <text class="dg-t" x="44" y="255">DB commit succeeded but the reply was lost: client can't tell → idempotency key</text>
  <text class="dg-ts" x="12" y="290">A timeout tells you only that you did not get an answer, not whether the work happened.</text>
</svg>
<figcaption>Figure M04-6a. Every arrow is a network hop that can drop, delay or duplicate a message. Failure point 4 is why retries must be safe to repeat.</figcaption>
</figure>`;

var DG_0406_BACKOFF = `
<figure>
<svg class="diagram" viewBox="0 0 760 290" role="img" aria-labelledby="m0406bt m0406bd">
  <title id="m0406bt">Retries with and without jitter</title>
  <desc id="m0406bd">Top: 100 clients use exponential backoff without jitter, so they all retry at the same instants (0.1, 0.3, 0.7, 1.5 and 3.1 seconds), hitting the server in tall synchronised spikes. Bottom: with full jitter each client waits a random time up to the same cap, so the same retries arrive as a low, spread-out trickle.</desc>
  <text class="dg-tb" x="12" y="24">A · Exponential backoff, no jitter: 100 clients retry in lockstep</text>
  <rect class="dg-bad" x="57" y="40" width="6" height="70"/>
  <rect class="dg-bad" x="74" y="40" width="6" height="70"/>
  <rect class="dg-bad" x="108" y="40" width="6" height="70"/>
  <rect class="dg-bad" x="176" y="40" width="6" height="70"/>
  <rect class="dg-bad" x="312" y="40" width="6" height="70"/>
  <rect class="dg-bad" x="584" y="40" width="6" height="70"/>
  <text class="dg-ts" x="222" y="96">800 ms</text>
  <text class="dg-ts" x="426" y="96">1,600 ms</text>
  <path class="dg-line" d="M30 110 H740"/>
  <text class="dg-tb" x="12" y="146">B · Same cap, full jitter: each client sleeps random(0, cap)</text>
  <rect class="dg-good" x="60" y="181.7" width="7" height="48.3"/>
  <rect class="dg-good" x="68" y="182.4" width="7" height="47.6"/>
  <rect class="dg-good" x="77" y="204.1" width="7" height="25.9"/>
  <rect class="dg-good" x="86" y="206.2" width="7" height="23.8"/>
  <rect class="dg-good" x="94" y="220.9" width="7" height="9.1"/>
  <rect class="dg-good" x="102" y="216.7" width="7" height="13.3"/>
  <rect class="dg-good" x="111" y="216.7" width="7" height="13.3"/>
  <rect class="dg-good" x="120" y="216.7" width="7" height="13.3"/>
  <rect class="dg-good" x="128" y="217.4" width="7" height="12.6"/>
  <rect class="dg-good" x="136" y="217.4" width="7" height="12.6"/>
  <rect class="dg-good" x="145" y="216.7" width="7" height="13.3"/>
  <rect class="dg-good" x="154" y="225.1" width="7" height="4.9"/>
  <rect class="dg-good" x="162" y="224.4" width="7" height="5.6"/>
  <rect class="dg-good" x="170" y="224.4" width="7" height="5.6"/>
  <rect class="dg-good" x="179" y="225.8" width="7" height="4.2"/>
  <rect class="dg-good" x="188" y="225.1" width="7" height="4.9"/>
  <rect class="dg-good" x="196" y="225.1" width="7" height="4.9"/>
  <rect class="dg-good" x="204" y="223.0" width="7" height="7.0"/>
  <rect class="dg-good" x="213" y="225.8" width="7" height="4.2"/>
  <rect class="dg-good" x="222" y="223.0" width="7" height="7.0"/>
  <rect class="dg-good" x="230" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="238" y="223.7" width="7" height="6.3"/>
  <rect class="dg-good" x="247" y="223.0" width="7" height="7.0"/>
  <rect class="dg-good" x="255" y="226.5" width="7" height="3.5"/>
  <rect class="dg-good" x="264" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="272" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="281" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="290" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="298" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="306" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="315" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="324" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="332" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="340" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="349" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="358" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="366" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="374" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="383" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="392" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="400" y="227.9" width="7" height="2.1"/>
  <rect class="dg-good" x="408" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="417" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="426" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="434" y="227.2" width="7" height="2.8"/>
  <rect class="dg-good" x="442" y="227.9" width="7" height="2.1"/>
  <rect class="dg-good" x="451" y="227.9" width="7" height="2.1"/>
  <rect class="dg-good" x="460" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="468" y="228.6" width="7" height="1.4"/>
  <rect class="dg-good" x="477" y="227.9" width="7" height="2.1"/>
  <rect class="dg-good" x="485" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="493" y="229.3" width="7" height="0.7"/>
  <rect class="dg-good" x="502" y="229.3" width="7" height="0.7"/>
  <path class="dg-line" d="M30 230 H740"/>
  <path class="dg-line" d="M60 226 V234"/><text class="dg-ts" x="54" y="250">0 s</text>
  <path class="dg-line" d="M230 226 V234"/><text class="dg-ts" x="224" y="250">1 s</text>
  <path class="dg-line" d="M400 226 V234"/><text class="dg-ts" x="394" y="250">2 s</text>
  <path class="dg-line" d="M570 226 V234"/><text class="dg-ts" x="564" y="250">3 s</text>
  <path class="dg-line" d="M740 226 V234"/><text class="dg-ts" x="734" y="250">4 s</text>
  <text class="dg-ts" x="12" y="276">Bar height = retries per 50 ms window (same scale). Early retries still bunch (the cap is small); later ones spread out.</text>
</svg>
<figcaption>Figure M04-6b. Backoff alone spaces retries out, but synchronised clients still arrive together. Adding jitter de-synchronises them, which is what lets an overloaded service recover.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.06", title: "Fallacies of distributed computing", level: 200, minutes: 55,
  objectives: [
    "State the eight fallacies of distributed computing and give a real failure symptom for each",
    "Map each fallacy to the design response and the AWS features that mitigate it",
    "Design a resilient remote call with timeouts, capped exponential backoff with jitter, idempotency keys, circuit breakers and fallbacks",
    "Explain at-least-once delivery, retry amplification, thundering herds, clock skew and partial failure, and how AWS services handle them"
  ],
  sections: [
    { type: "why", html: `
<p>In a single process, a function call either returns or throws, instantly and exactly once. Move that call across a network and every one of those guarantees disappears: the call can be slow, lost, duplicated, answered by a different server than last time, intercepted, or billed by the gigabyte. Code written as if the network were a local function call works perfectly on a laptop and fails in production in ways that are hard to reproduce.</p>
<p>In the 1990s, L. Peter Deutsch and colleagues at Sun Microsystems listed the false assumptions that engineers new to distributed systems make. Thirty years later, the list still explains a large share of real outages. Amazon's CTO Werner Vogels sums up the antidote: <strong>"Everything fails, all the time."</strong> Design for it.</p>
<p>For the exam, this lesson is the reasoning behind dozens of "correct answers": decoupling with SQS, retrying with exponential backoff, using multiple AZs, not hard-coding IP addresses, using VPC endpoints to avoid data charges, encrypting in transit. Each one exists because one of these assumptions is false.</p>` },

    { type: "concept", title: "The eight fallacies", html: DG_0406_CALL + `
<p>Each fallacy below follows the same pattern: the false assumption, what really happens, a symptom you will see, and the design response. AWS mitigations are summarised in the table in the next section.</p>

<h3>1. The network is reliable</h3>
<p><strong>Reality:</strong> packets are dropped, switches and power fail, connections reset, AZs have incidents, and deployments restart the server you were talking to. <strong>Symptom:</strong> sporadic <code>Connection reset</code> or timeout errors that "can't be reproduced"; an order that the customer was charged for but your system says failed. <strong>Response:</strong> assume every call can fail; use timeouts, retries with backoff and jitter, idempotent operations, durable queues between components, and redundancy across AZs.</p>

<h3>2. Latency is zero</h3>
<p><strong>Reality:</strong> every hop costs time and distance costs most (M04.05). <strong>Symptom:</strong> a page that makes 40 sequential calls to a service in another Region takes 4 seconds; an "N+1 query" pattern that is fine on localhost is unusable over the network. <strong>Response:</strong> minimise round trips (batch, aggregate, parallelise), cache, keep chatty components in the same AZ or Region, and move content to the edge.</p>

<h3>3. Bandwidth is infinite</h3>
<p><strong>Reality:</strong> links are shared and finite; congestion causes queuing and packet loss. <strong>Symptom:</strong> a nightly 20 TB copy over a 1 Gbps VPN never finishes inside its window; a mobile app downloads a 5 MB JSON payload on every screen. <strong>Response:</strong> compress, paginate, send only what changed (deltas), use efficient formats (Protocol Buffers, Parquet), and move bulk data over dedicated paths or offline devices.</p>

<h3>4. The network is secure</h3>
<p><strong>Reality:</strong> networks are shared, misconfigured, and attacked; insiders and compromised hosts exist. <strong>Symptom:</strong> plaintext credentials captured from internal HTTP traffic; a flat network lets one compromised server reach the database directly. <strong>Response:</strong> encrypt in transit everywhere (including "internal" traffic), authenticate and authorise every request (zero trust), segment networks, and keep traffic on private paths.</p>

<h3>5. Topology doesn't change</h3>
<p><strong>Reality:</strong> in the cloud, servers are replaced constantly: Auto Scaling adds and removes instances, containers reschedule, failovers move databases, IP addresses change. <strong>Symptom:</strong> an application with a hard-coded database IP breaks after an RDS Multi-AZ failover; a client caches DNS forever and keeps calling a terminated instance. <strong>Response:</strong> address services by name, not IP; use load balancers and service discovery; respect DNS TTLs; make components stateless and disposable.</p>

<h3>6. There is one administrator</h3>
<p><strong>Reality:</strong> different teams, accounts, partners and cloud providers own different parts of the path, each with their own change schedule and policies. <strong>Symptom:</strong> a partner rotates a TLS certificate or changes a firewall rule and your integration breaks; two teams change the same security group manually. <strong>Response:</strong> clear ownership boundaries, infrastructure as code, versioned APIs and contracts, guardrails applied centrally, and observability that crosses team boundaries.</p>

<h3>7. Transport cost is zero</h3>
<p><strong>Reality:</strong> moving data costs money (and serialisation costs CPU). <strong>Symptom:</strong> a surprise bill for cross-AZ traffic between chatty microservices, NAT gateway data processing for S3 traffic, or internet egress for a popular download. <strong>Response:</strong> design data paths with cost in mind: keep chatty traffic local, use VPC endpoints, cache at the edge, compress.</p>

<h3>8. The network is homogeneous</h3>
<p><strong>Reality:</strong> the path mixes devices, protocols, MTUs, IPv4 and IPv6, operating systems, client versions and languages. <strong>Symptom:</strong> large packets silently dropped on a VPN because of an MTU mismatch (M02.01); an old Android client that doesn't support the TLS version you enforced. <strong>Response:</strong> standard, well-supported protocols (HTTP, TLS, JSON/protobuf), explicit API versioning, interoperability testing, and dual-stack where needed.</p>` },

    { type: "concept", title: "Related failure modes every architect must know", html: DG_0406_BACKOFF + `
<h3>Timeouts: the most important line of code</h3>
<p>A call without a timeout can wait forever, holding a thread, a connection and the user. Every remote call needs a <strong>connect timeout</strong> and a <strong>request (read) timeout</strong>, set from the latency budget: if the caller must answer in 1 s and the dependency's p99.9 is 200 ms, a 300 ms timeout leaves room for one retry. Timeouts must shrink as you go deeper: a layer should never wait longer than its caller is willing to wait for it.</p>

<h3>Retries: helpful in small doses, dangerous in bulk</h3>
<ul>
  <li><strong>Retry only what is retryable:</strong> timeouts, connection errors, HTTP 429 (throttled), 500, 502, 503, 504. Never blindly retry 400-class validation errors; they will fail again.</li>
  <li><strong>Capped exponential backoff:</strong> wait base × 2<sup>attempt</sup>, up to a cap, so a struggling service gets breathing room.</li>
  <li><strong>Jitter:</strong> randomise the wait. Without it, clients that failed together retry together in synchronised waves (Figure M04-6b). "Full jitter" sleeps a random time between 0 and the capped exponential value.</li>
  <li><strong>Limit attempts and retry at one layer.</strong> If three layers each try 3 times (1 + 2 retries), the bottom service receives up to 3 × 3 × 3 = 27 calls for one user action: a <em>retry storm</em> that turns a brief slowdown into an outage.</li>
  <li><strong>Retry budgets / token buckets</strong> cap retries as a fraction of traffic. The AWS SDKs' <em>standard</em> and <em>adaptive</em> retry modes implement backoff, jitter and a retry quota for you.</li>
</ul>

<h3>Thundering herd</h3>
<p>Many clients act at the same moment: a cache entry expires and 5,000 requests hit the database at once; a service recovers and every client reconnects simultaneously; cron jobs all run at 00:00. Mitigations: jitter (on retries, TTLs and schedules), request coalescing (one request refreshes the cache while others wait), and staggered reconnection.</p>

<h3>At-least-once delivery and idempotency</h3>
<p>Because the client in failure point 4 of Figure M04-6a cannot tell whether its request was processed, a reliable system must sometimes deliver the same message twice. Most messaging systems therefore guarantee <strong>at-least-once</strong> delivery: SQS standard queues, SNS, EventBridge and Lambda asynchronous invocations can all deliver duplicates. "Exactly-once" is achieved, if at all, by <strong>deduplication plus idempotent processing</strong>:</p>
<ul>
  <li>An operation is <strong>idempotent</strong> if doing it twice has the same effect as doing it once: "set balance to 100" is idempotent; "add 10 to balance" is not.</li>
  <li>Make non-idempotent operations safe with an <strong>idempotency key</strong>: the client generates a unique ID per logical action and sends it with every attempt; the server records processed keys (for example with a DynamoDB conditional write) and returns the original result for a repeat.</li>
  <li>SQS FIFO queues deduplicate messages with the same deduplication ID within a 5-minute window, giving exactly-once <em>processing</em> within that scope.</li>
</ul>

<h3>Clocks are not synchronised</h3>
<p>Every server's clock drifts. Two machines can disagree by milliseconds or, without synchronisation, by seconds. Ordering events by wall-clock timestamps across machines, expiring tokens, or "last writer wins" conflict resolution can then produce wrong results. Synchronise with NTP (on EC2, the <strong>Amazon Time Sync Service</strong> at 169.254.169.123, with microsecond-accurate PTP hardware clocks on supported instance types), tolerate skew in token validation (SigV4 requests are rejected if the client clock is too far off), and prefer sequence numbers or version counters over timestamps for ordering.</p>

<h3>Partial and gray failure</h3>
<p>Distributed systems rarely fail cleanly. One AZ is slow but up; one instance returns errors for 5% of requests; a dependency answers health checks but times out real work. Design so that partial failure is detected (deep health checks, outlier detection, per-AZ metrics) and contained (bulkheads: separate pools per dependency so one slow dependency can't consume all threads; cell-based architectures; shuffle sharding).</p>` },

    { type: "workflow", title: "Designing a resilient remote call, step by step", html: `
<ol class="flow">
  <li><strong>Decide if the call must be synchronous.</strong> If the user doesn't need the result now, put a message on a queue (SQS) or an event bus (EventBridge) and return. Asynchronous work tolerates failures far better.</li>
  <li><strong>Set timeouts from the latency budget.</strong> Connect timeout (short, ~1 s or less inside a Region) and request timeout (from the dependency's measured p99.9 plus margin, within the caller's own budget).</li>
  <li><strong>Classify errors.</strong> Retryable: timeouts, connection failures, 429, 5xx. Not retryable: 4xx validation and authorisation errors. Surface the latter immediately.</li>
  <li><strong>Make the operation safe to repeat.</strong> Use naturally idempotent operations (PUT a full state, set rather than increment) or send an idempotency key that the server records.</li>
  <li><strong>Retry with capped exponential backoff and full jitter</strong>, a small maximum number of attempts (often 3 in total), and only at one layer of the stack. Prefer the SDK's built-in retry modes.</li>
  <li><strong>Add a circuit breaker.</strong> After a threshold of failures, stop calling the dependency for a cool-down period and fail fast; then let a few trial requests through (half-open) before resuming. This protects both the caller's resources and the struggling dependency.</li>
  <li><strong>Provide a fallback.</strong> Serve cached or default data, hide a non-essential widget, queue the work for later, or return a clear error. Decide this per dependency in the design, not during the incident.</li>
  <li><strong>Isolate resources (bulkheads).</strong> Separate connection pools or concurrency limits per dependency, so one slow dependency can't starve the others.</li>
  <li><strong>Observe.</strong> Emit metrics for attempts, retries, timeouts, circuit state and fallback use; trace across services (X-Ray).</li>
  <li><strong>Test it.</strong> Inject latency, errors and dropped connections deliberately (AWS Fault Injection Service) and confirm the system degrades the way you designed.</li>
</ol>` },

    { type: "aws", title: "Fallacy by fallacy: how AWS helps", html: `
<table>
<thead><tr><th>Fallacy</th><th>Design response</th><th>AWS features and services</th><th>Deep dive</th></tr></thead>
<tbody>
<tr><td>1. The network is reliable</td><td>Redundancy, retries, durable buffers, idempotency</td><td>Multi-AZ deployments (ELB, ASG, RDS Multi-AZ); SDK retry modes (standard, adaptive); <strong>SQS</strong> with visibility timeout and dead-letter queues; Lambda async retries and destinations; Step Functions <code>Retry</code> with backoff and jitter; EventBridge retry policies and DLQs; Route 53 health checks and failover</td><td>M14, M25, M26, M32</td></tr>
<tr><td>2. Latency is zero</td><td>Fewer round trips, caching, locality</td><td>CloudFront, Global Accelerator, ElastiCache, DAX, cluster placement groups, Local Zones, multi-Region with latency-based routing; batch APIs (SQS SendMessageBatch, DynamoDB BatchGetItem)</td><td>M12, M23</td></tr>
<tr><td>3. Bandwidth is infinite</td><td>Compress, paginate, move bulk data on dedicated paths</td><td>CloudFront compression; API pagination; S3 multipart and Transfer Acceleration; Direct Connect (1–100 Gbps dedicated); DataSync; Snow Family for offline bulk transfer</td><td>M11, M18, M20</td></tr>
<tr><td>4. The network is secure</td><td>Encrypt and authenticate everything; segment; private paths</td><td>TLS with ACM certificates; SigV4-signed, IAM-authorised AWS API calls; security groups and NACLs; <strong>PrivateLink</strong> and VPC endpoints; AWS WAF, Shield, Network Firewall; VPC Lattice auth policies</td><td>M05, M07, M08, M10</td></tr>
<tr><td>5. Topology doesn't change</td><td>Address by name, discover dynamically, stateless instances</td><td>Elastic Load Balancing; Route 53 (aliases, low TTLs); <strong>AWS Cloud Map</strong> and ECS Service Connect for service discovery; RDS/Aurora endpoints (DNS names that follow failover); Auto Scaling replacing unhealthy instances</td><td>M12, M14, M15</td></tr>
<tr><td>6. There is one administrator</td><td>Clear ownership, automation, central guardrails</td><td>Multi-account with <strong>AWS Organizations</strong>, SCPs and Control Tower; infrastructure as code (CloudFormation, CDK); AWS Config rules; CloudTrail for who-changed-what; API versioning in API Gateway</td><td>M06, M31, M36, M37</td></tr>
<tr><td>7. Transport cost is zero</td><td>Design data paths for cost</td><td>Data transfer pricing (internet egress, cross-AZ and cross-Region are charged); <strong>gateway VPC endpoints</strong> for S3 and DynamoDB (no NAT processing charge); CloudFront for cheaper egress at scale; keep chatty services in one AZ where resilience allows</td><td>M10, M34</td></tr>
<tr><td>8. The network is homogeneous</td><td>Standard protocols, versioned contracts, dual-stack</td><td>ALB/NLB protocol support (HTTP/1.1, HTTP/2, gRPC, WebSockets, TCP/UDP); IPv4/IPv6 dual-stack VPCs and load balancers; API Gateway for REST/HTTP/WebSocket; EventBridge schemas</td><td>M09, M12, M16</td></tr>
</tbody></table>
<h3>AWS services that do the retrying for you</h3>
<ul>
  <li><strong>AWS SDKs and CLI:</strong> automatic retries with exponential backoff and jitter for throttling and transient errors. The <em>standard</em> mode makes up to 3 attempts by default; <em>adaptive</em> adds client-side rate limiting when it sees throttling.</li>
  <li><strong>Lambda asynchronous invocation:</strong> retries failed events (twice by default), then sends them to an on-failure destination or a DLQ.</li>
  <li><strong>SQS:</strong> a message that isn't deleted becomes visible again after the visibility timeout; after <code>maxReceiveCount</code> failures, a redrive policy moves it to a dead-letter queue.</li>
  <li><strong>Step Functions:</strong> per-state <code>Retry</code> with <code>IntervalSeconds</code>, <code>BackoffRate</code>, <code>MaxAttempts</code>, <code>MaxDelaySeconds</code> and <code>JitterStrategy</code>, plus <code>Catch</code> for fallbacks.</li>
  <li><strong>Powertools for AWS Lambda</strong> provides an idempotency utility backed by DynamoDB.</li>
</ul>` },

    { type: "examples", title: "Worked examples", html: `
<h3>1. Capped exponential backoff with full jitter</h3>
<p>Base = 100 ms, cap = 2,000 ms. Before retry number n (n = 0 for the first retry), the ceiling is min(cap, base × 2<sup>n</sup>); full jitter sleeps a random time between 0 and that ceiling.</p>
<table>
<thead><tr><th>Retry n</th><th>base × 2<sup>n</sup></th><th>Ceiling (capped)</th><th>Full-jitter sleep</th></tr></thead>
<tbody>
<tr><td>0</td><td>100 ms</td><td>100 ms</td><td>random 0–100 ms</td></tr>
<tr><td>1</td><td>200 ms</td><td>200 ms</td><td>random 0–200 ms</td></tr>
<tr><td>2</td><td>400 ms</td><td>400 ms</td><td>random 0–400 ms</td></tr>
<tr><td>3</td><td>800 ms</td><td>800 ms</td><td>random 0–800 ms</td></tr>
<tr><td>4</td><td>1,600 ms</td><td>1,600 ms</td><td>random 0–1,600 ms</td></tr>
<tr><td>5</td><td>3,200 ms</td><td>2,000 ms (capped)</td><td>random 0–2,000 ms</td></tr>
</tbody></table>
<p>Without jitter, the total wait across retries 0–4 is 100 + 200 + 400 + 800 + 1,600 = <strong>3,100 ms</strong> for every client, so they all arrive together. With full jitter, the expected total is about half that, and clients are spread out.</p>

<h3>2. Retry amplification</h3>
<p>Web tier → order service → payment service → database, each making 3 attempts (1 try + 2 retries). If the database is struggling, one user click can produce 3 × 3 × 3 = <strong>27</strong> database calls. With 1,000 clicks per second, a database that was 10% over capacity now receives up to 27,000 calls per second. Fix: retry at one layer (usually the edge or the caller closest to the user), fail fast below it, and use retry budgets.</p>

<h3>3. Python: retry with full jitter and an idempotency key</h3>
<pre><code>import random, time, uuid
import requests

RETRYABLE = {429, 500, 502, 503, 504}

def call_with_retries(url, payload, attempts=3, base=0.1, cap=2.0, timeout=(1.0, 2.0)):
    key = str(uuid.uuid4())                 # one key per logical action, reused on every attempt
    for n in range(attempts):
        try:
            r = requests.post(url, json=payload, timeout=timeout,
                              headers={"Idempotency-Key": key})
            if r.status_code not in RETRYABLE:
                return r                    # success, or an error that retrying won't fix
        except (requests.ConnectionError, requests.Timeout):
            pass                            # transient: fall through to backoff
        if n == attempts - 1:
            break
        time.sleep(random.uniform(0, min(cap, base * 2 ** n)))   # full jitter
    raise RuntimeError("dependency unavailable after %d attempts" % attempts)</code></pre>
<p>Note the <code>(connect, read)</code> timeout tuple, the reuse of the same idempotency key on every attempt, and that 4xx responses are returned rather than retried.</p>

<h3>4. Server side: record the idempotency key atomically (DynamoDB)</h3>
<pre><code>import boto3
from botocore.exceptions import ClientError

table = boto3.resource("dynamodb").Table("payments-idempotency")

def charge_once(idem_key, order_id, amount):
    try:
        table.put_item(
            Item={"pk": idem_key, "order_id": order_id, "status": "IN_PROGRESS"},
            ConditionExpression="attribute_not_exists(pk)",   # only the first attempt wins
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return table.get_item(Key={"pk": idem_key})["Item"]   # duplicate: return the stored outcome
        raise
    result = payment_provider_charge(order_id, amount)       # runs at most once per key
    table.update_item(Key={"pk": idem_key},
                      UpdateExpression="SET #s = :s, provider_ref = :r",
                      ExpressionAttributeNames={"#s": "status"},
                      ExpressionAttributeValues={":s": "DONE", ":r": result})
    return {"status": "DONE", "provider_ref": result}</code></pre>
<p>In production, add a TTL attribute so old keys expire, and handle a crash between the two writes (a key stuck in IN_PROGRESS) with a timeout-based recovery. Powertools for AWS Lambda implements this pattern for you.</p>

<h3>5. Let the SDK do it: boto3 retry configuration</h3>
<pre><code>from botocore.config import Config
import boto3

cfg = Config(retries={"mode": "standard", "max_attempts": 5},   # backoff + jitter + retry quota
             connect_timeout=2, read_timeout=5)
ddb = boto3.client("dynamodb", config=cfg)</code></pre>

<h3>6. Step Functions: declarative retry with jitter</h3>
<pre><code>"ChargeCard": {
  "Type": "Task",
  "Resource": "arn:aws:states:::lambda:invoke",
  "Retry": [{
    "ErrorEquals": ["Lambda.TooManyRequestsException", "States.Timeout"],
    "IntervalSeconds": 1, "BackoffRate": 2.0, "MaxAttempts": 3,
    "MaxDelaySeconds": 10, "JitterStrategy": "FULL"
  }],
  "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "QueueForManualReview" }],
  "Next": "SendReceipt"
}</code></pre>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>What you would choose</th><th>Why (fallacy addressed)</th></tr></thead>
<tbody>
<tr><td>Orders must never be lost if the fulfilment service is down</td><td>SQS queue between web tier and fulfilment, with a DLQ</td><td>The network/service is not reliable; the queue buffers and retries</td></tr>
<tr><td>Payment API must never double-charge on retries</td><td>Idempotency keys stored with DynamoDB conditional writes</td><td>Delivery is at-least-once; repeats must be harmless</td></tr>
<tr><td>Microservices on ECS need to find each other as tasks come and go</td><td>ECS Service Connect / AWS Cloud Map, or an internal ALB</td><td>Topology changes; never hard-code IPs</td></tr>
<tr><td>Private instances download terabytes from S3 every day</td><td>S3 gateway VPC endpoint</td><td>Transport cost is not zero (avoids NAT data processing charges)</td></tr>
<tr><td>Internal service-to-service calls carry customer data</td><td>TLS everywhere, IAM-authorised calls, security groups referencing security groups, PrivateLink</td><td>The network is not secure, even inside the VPC</td></tr>
<tr><td>A flaky third-party API slows down checkout</td><td>Timeout + circuit breaker + fallback (queue the request)</td><td>Partial failure must not cascade</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: simulate a retry storm", html: `
<p>Save as <code>storm.py</code> and run <code>python3 storm.py</code> (no AWS account needed). It simulates 1,000 clients whose first call failed at the same instant, each retrying 5 times with capped exponential backoff (base 1 s, cap 20 s), and counts how many retries arrive in the busiest 100 ms window.</p>
<pre><code>import random

CLIENTS, RETRIES, BASE, CAP = 1000, 5, 1.0, 20.0

def busiest_window(jitter):
    windows = {}
    for _ in range(CLIENTS):
        t = 0.0
        for n in range(RETRIES):
            ceiling = min(CAP, BASE * 2 ** n)
            t += random.uniform(0, ceiling) if jitter else ceiling
            w = int(round(t / 0.1, 9))   # 100 ms window number
            windows[w] = windows.get(w, 0) + 1
    return max(windows.values()), len(windows)

for jitter in (False, True):
    peak, spread = busiest_window(jitter)
    print("jitter=%-5s peak retries in one 100 ms window: %4d  windows used: %d" % (jitter, peak, spread))</code></pre>
<p>Typical output:</p>
<pre><code>jitter=False peak retries in one 100 ms window: 1000  windows used: 5
jitter=True  peak retries in one 100 ms window:  150  windows used: 268</code></pre>
<p>Without jitter, all 1,000 clients hit the server in the same 100 ms window, five times over. With full jitter the same 5,000 retries spread across more than 250 windows and the peak drops by roughly 85% (your numbers vary slightly per run). Now set <code>BASE = 0.1</code> and run again: with a tiny first ceiling, the early retries still bunch into the first few windows, and the jittered peak can even exceed the no-jitter one. Jitter needs a sensible base, plus a small attempt limit and a retry quota, to protect a recovering service.</p>` },

    { type: "casestudy", title: "Case study: the double charge", html: `
<p><strong>Company:</strong> Kestrel Tickets (fictional), an event-ticketing platform. Checkout runs on Lambda behind API Gateway; it calls an external payment provider and records the order in DynamoDB.</p>
<p><strong>Incident:</strong> on a major on-sale day, the payment provider slowed to 4–8 seconds per call. The checkout Lambda had a 3-second HTTP timeout and retried twice. The mobile app also retried when the API took more than 10 seconds, and API Gateway's integration timeout had been reached on some requests. Hundreds of customers were <strong>charged two or three times</strong> for the same tickets, and some orders were recorded as failed even though payment succeeded.</p>
<p><strong>Root cause analysis:</strong></p>
<ul>
  <li><strong>Fallacy 1 in action:</strong> a timeout was treated as "the charge failed". In reality the provider usually completed the charge; only the response was late (failure point 4).</li>
  <li><strong>Non-idempotent retries:</strong> each retry created a new charge, with no shared key between attempts.</li>
  <li><strong>Retries at two layers</strong> (app and Lambda) multiplied attempts and load on the already slow provider.</li>
</ul>
<p><strong>Fix:</strong></p>
<table>
<thead><tr><th>Change</th><th>Principle</th></tr></thead>
<tbody>
<tr><td>The app generates an idempotency key per checkout and sends it on every attempt; the Lambda passes it to the provider (which supports idempotency keys) and stores it with a DynamoDB conditional write</td><td>Idempotency</td></tr>
<tr><td>Checkout made asynchronous: API returns 202 with an order ID; the payment step runs from an SQS queue with a DLQ; the app polls or receives a push notification</td><td>Don't hold a synchronous call open on a slow dependency</td></tr>
<tr><td>Retries only in the worker, with capped backoff and full jitter; the app no longer retries the POST blindly</td><td>Retry at one layer</td></tr>
<tr><td>Circuit breaker on the provider; when open, orders queue as "payment pending" instead of failing</td><td>Fail fast, degrade gracefully</td></tr>
<tr><td>A reconciliation job compares provider charges with orders daily</td><td>Detect what the design missed</td></tr>
</tbody></table>
<p><strong>Result:</strong> the next on-sale had a similar provider slowdown; checkout latency for customers stayed under 300 ms (they got an order ID immediately), payments completed within minutes, and there were no duplicate charges.</p>
<p><strong>Lessons learned:</strong> a timeout is "I don't know", not "it failed"; every retried operation needs an idempotency story; and retries belong at exactly one layer.</p>` },

    { type: "exam", html: `
<h3>Keyword → answer</h3>
<table>
<thead><tr><th>Stem says</th><th>Think</th></tr></thead>
<tbody>
<tr><td>"Decouple", "the downstream system is sometimes unavailable", "don't lose requests"</td><td>SQS (with DLQ), or SNS/EventBridge fan-out</td></tr>
<tr><td>"ThrottlingException", "ProvisionedThroughputExceededException", "intermittent errors"</td><td>Exponential backoff with jitter (SDK retries), and fix the capacity cause</td></tr>
<tr><td>"Process each message exactly once", "preserve order"</td><td>SQS FIFO (deduplication ID, message group ID), plus idempotent consumers</td></tr>
<tr><td>"Messages that repeatedly fail processing"</td><td>Dead-letter queue (redrive policy)</td></tr>
<tr><td>"Application uses hard-coded IP addresses" / "instances are replaced frequently"</td><td>Load balancer, Route 53 names, Cloud Map service discovery</td></tr>
<tr><td>"Reduce data transfer costs for S3 traffic from private subnets"</td><td>Gateway VPC endpoint</td></tr>
<tr><td>"Encrypt data in transit between services"</td><td>TLS (ACM certificates on ALB/NLB, re-encrypt to targets)</td></tr>
<tr><td>"Accurate time on EC2"</td><td>Amazon Time Sync Service (169.254.169.123)</td></tr>
</tbody></table>
<h3>Common distractors</h3>
<ul>
  <li><strong>"Increase the retry count"</strong> as a fix for throttling. More retries without backoff make throttling worse.</li>
  <li><strong>SQS standard queue for "exactly once":</strong> standard queues are at-least-once and best-effort ordered; FIFO is needed for deduplication and order.</li>
  <li><strong>Assuming a timeout means failure</strong> and choosing a design that re-submits non-idempotent work.</li>
  <li><strong>Tight coupling options</strong> (direct synchronous calls between tiers) when the stem stresses resilience.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Write down the failure model for every dependency</strong> in the design review: timeout, retries, idempotency, fallback, owner. If a box on the diagram has no answer, it is a future incident.</li>
  <li><strong>Prefer asynchronous boundaries</strong> between bounded contexts. Synchronous call chains multiply both latency and failure probability (availability of a chain is the product of its parts, M04.03).</li>
  <li><strong>Make retries visible.</strong> A system that "works" only because it silently retries 30% of calls is already in trouble. Graph retry rates.</li>
  <li><strong>Watch for metastable failure:</strong> a system pushed over the edge by a trigger (a deploy, a cache flush) can stay down after the trigger is gone, because retries and timeouts keep it overloaded. Load shedding, retry budgets and circuit breakers break the loop.</li>
  <li><strong>Cost belongs in the network design:</strong> model cross-AZ, cross-Region, NAT and egress traffic in the cost estimate. Chatty microservices spread across AZs can cost more in data transfer than in compute.</li>
  <li><strong>Chaos engineering is a practice, not a stunt:</strong> run fault-injection experiments (AWS FIS) in staging first, with stop conditions, and game days with the on-call team.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>The eight fallacies: the network is reliable; latency is zero; bandwidth is infinite; the network is secure; topology doesn't change; there is one administrator; transport cost is zero; the network is homogeneous. All are false.</li>
  <li>A timeout means "I don't know whether it happened", so retried operations must be idempotent. Use idempotency keys and conditional writes.</li>
  <li>Retry only transient errors, with capped exponential backoff and jitter, a small attempt limit, at one layer. Layered retries multiply (3 × 3 × 3 = 27).</li>
  <li>Most messaging on AWS is at-least-once; SQS FIFO adds deduplication within a 5-minute window.</li>
  <li>Every remote call needs a connect and a request timeout derived from the latency budget; add circuit breakers, fallbacks and bulkheads for partial failure.</li>
  <li>Address services by name (ELB, Route 53, Cloud Map), never by IP; topology changes constantly in the cloud.</li>
  <li>Encrypt and authenticate internal traffic too; keep it on private paths (VPC endpoints, PrivateLink).</li>
  <li>Data transfer costs money: cross-AZ, cross-Region, NAT processing and internet egress all appear on the bill.</li>
  <li>Synchronise clocks (Amazon Time Sync Service) and don't rely on wall-clock order across machines.</li>
</ul>` }
  ],

  drills: [
    { id: "M04.06-d1", q: "Backoff with base 100 ms and cap 2,000 ms: what is the ceiling (maximum sleep) before retry n = 3? (in ms)", answers: ["800", "800ms", "800 ms"], hint: "min(cap, base × 2^n).", explain: "100 × 2³ = 800 ms, below the cap." },
    { id: "M04.06-d2", q: "Same settings (base 100 ms, cap 2,000 ms): what is the ceiling before retry n = 5? (in ms)", answers: ["2000", "2,000", "2000ms", "2000 ms"], hint: "100 × 2^5 = 3,200, then apply the cap.", explain: "3,200 ms exceeds the cap, so the ceiling is 2,000 ms." },
    { id: "M04.06-d3", q: "Without jitter (sleep exactly the ceiling), how many ms in total does a client wait across retries n = 0 to 4 with base 100 ms and cap 2,000 ms?", answers: ["3100", "3,100", "3100ms", "3100 ms"], hint: "100 + 200 + 400 + 800 + 1,600.", explain: "3,100 ms, and every client that failed together waits exactly the same amount, so they retry in lockstep." },
    { id: "M04.06-d4", q: "Three layers each make up to 3 attempts (1 try + 2 retries). How many calls can the bottom service receive for ONE user request in the worst case?", answers: ["27"], hint: "Attempts multiply across layers.", explain: "3 × 3 × 3 = 27. Retry at one layer only, and fail fast below it." },
    { id: "M04.06-d5", q: "Which IPv4 address serves the Amazon Time Sync Service inside a VPC?", answers: ["169.254.169.123"], hint: "It is link-local, next to the metadata service (…254).", explain: "169.254.169.123 (IPv6: fd00:ec2::123 on Nitro instances)." },
    { id: "M04.06-d6", q: "Which SQS queue type deduplicates messages and preserves order? (one word)", answers: ["FIFO", "fifo"], hint: "First in, first out.", explain: "FIFO queues deduplicate within a 5-minute window and preserve order within a message group. Standard queues are at-least-once with best-effort ordering." }
  ],

  check: [
    { id: "M04.06-k1", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A web application writes orders directly to a fulfilment service through a synchronous HTTP call. When the fulfilment service is redeployed, some orders are lost. What change makes the design MOST resilient?",
      options: [
        { t: "Have the web tier send orders to an Amazon SQS queue that the fulfilment service consumes, with a dead-letter queue", c: true, why: "The queue durably buffers orders while the consumer is unavailable and retries failed processing; the DLQ captures poison messages." },
        { t: "Increase the HTTP timeout on the web tier to 60 seconds", c: false, why: "A longer timeout holds resources longer and still loses orders when the service is down." },
        { t: "Run the fulfilment service on larger instances", c: false, why: "Size doesn't help when the service is restarting or unreachable." },
        { t: "Retry the HTTP call immediately up to 10 times", c: false, why: "Immediate retries without backoff hammer a recovering service and can still fail; they also risk duplicate orders without idempotency." }
      ] },
    { id: "M04.06-k2", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "An application calls Amazon DynamoDB and receives intermittent ProvisionedThroughputExceededException errors during short bursts. Which client-side behaviour is recommended?",
      options: [
        { t: "Retry with exponential backoff and jitter (for example, the AWS SDK's standard or adaptive retry mode)", c: true, why: "Backoff gives the table time to recover and jitter de-synchronises clients; the SDKs implement this. Also review capacity mode for sustained load." },
        { t: "Retry immediately in a tight loop until the call succeeds", c: false, why: "Tight retries increase load and prolong throttling." },
        { t: "Switch the client to a different Region's endpoint on each error", c: false, why: "The table lives in one Region (unless it's a global table); this adds latency and doesn't address throttling." },
        { t: "Disable retries so errors surface faster", c: false, why: "Transient throttling is exactly what retries with backoff are for." }
      ] },
    { id: "M04.06-k3", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A payment service occasionally times out while calling a card processor, and the caller retries. Customers are sometimes charged twice. What is the BEST fix?",
      options: [
        { t: "Send a unique idempotency key with each logical payment and have the service store processed keys with a conditional write", c: true, why: "The timed-out first attempt may have succeeded; an idempotency key lets repeats return the original result instead of charging again." },
        { t: "Disable retries for payments", c: false, why: "That avoids duplicates but loses payments that would have succeeded, and doesn't tell you whether the timed-out call charged the card." },
        { t: "Shorten the timeout so the first attempt is abandoned sooner", c: false, why: "An abandoned request may still complete on the processor; duplicates would increase." },
        { t: "Move the payment service to a larger Lambda memory size", c: false, why: "Performance doesn't change the semantics of retrying a non-idempotent operation." }
      ] },
    { id: "M04.06-k4", type: "multi", domain: "D2", task: "2.2", level: 200,
      stem: "A legacy application stores the private IP addresses of its database and API servers in a configuration file. The team is moving to Auto Scaling groups and Amazon RDS Multi-AZ. Which TWO changes address the \"topology doesn't change\" fallacy?",
      options: [
        { t: "Connect to the database through the RDS endpoint DNS name instead of an IP address", c: true, why: "The endpoint name follows the primary after a Multi-AZ failover; an IP would point at the old host." },
        { t: "Put the API servers behind an internal Application Load Balancer and use its DNS name", c: true, why: "The load balancer tracks instances as Auto Scaling replaces them." },
        { t: "Assign Elastic IP addresses to every Auto Scaling instance", c: false, why: "Instances are replaced constantly; managing EIPs on them fights the elastic design and isn't needed for private traffic." },
        { t: "Increase the DNS TTL to 24 hours to reduce lookups", c: false, why: "Long TTLs make clients keep using stale addresses after changes." },
        { t: "Disable Auto Scaling so IPs stay stable", c: false, why: "That gives up elasticity and self-healing instead of designing for change." }
      ] },
    { id: "M04.06-k5", type: "single", domain: "D4", task: "4.4", level: 200,
      stem: "Applications in private subnets read several terabytes per day from Amazon S3 in the same Region through a NAT gateway. Which change reduces cost the MOST with no loss of functionality?",
      options: [
        { t: "Add a gateway VPC endpoint for S3 and update the private route tables", c: true, why: "Gateway endpoints for S3 have no hourly or data processing charge, so S3 traffic stops incurring NAT gateway processing fees." },
        { t: "Replace the NAT gateway with a larger NAT instance", c: false, why: "You still pay for the instance and operate it; it doesn't remove the data path cost as cleanly." },
        { t: "Move the instances to public subnets with public IPs", c: false, why: "That weakens security and adds public IPv4 charges." },
        { t: "Enable S3 Transfer Acceleration", c: false, why: "Acceleration adds a per-GB charge and is for long-distance transfers, not same-Region access." }
      ] },
    { id: "M04.06-k6", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A Lambda function consumes messages from an SQS standard queue and inserts rows into a database. Occasionally the same row appears twice. Why, and what is the correct response?",
      options: [
        { t: "SQS standard queues provide at-least-once delivery, so the consumer must be idempotent (for example, use the message's business key with a unique constraint or conditional write)", c: true, why: "Duplicates are part of the at-least-once contract; idempotent processing makes them harmless." },
        { t: "The queue is misconfigured; standard queues guarantee exactly-once delivery", c: false, why: "Standard queues are at-least-once; FIFO queues add deduplication." },
        { t: "Lambda never retries SQS messages, so the duplicates come from the producer only", c: false, why: "A message not deleted (for example after a function error or timeout) becomes visible again and is processed again." },
        { t: "Increase the visibility timeout to 12 hours to stop duplicates entirely", c: false, why: "An appropriate visibility timeout reduces redeliveries during processing but cannot eliminate at-least-once duplicates." }
      ] }
  ],
  cards: ["fc-M04-6-01", "fc-M04-6-02", "fc-M04-6-03", "fc-M04-6-04", "fc-M04-6-05", "fc-M04-6-06", "fc-M04-6-07", "fc-M04-6-08", "fc-M04-6-09", "fc-M04-6-10", "fc-M04-6-11"],
  references: [
    "<em>System Design on AWS</em> ch.1 \"Fallacies of Distributed Computing\" (PDF p40–42)",
    "L. P. Deutsch et al., <em>The Eight Fallacies of Distributed Computing</em> (Sun Microsystems)",
    "Amazon Builders' Library: <em>Timeouts, retries, and backoff with jitter</em>; <em>Making retries safe with idempotent APIs</em>",
    "AWS Architecture Blog: <em>Exponential Backoff And Jitter</em>",
    "AWS documentation: SDK retry behaviour; Amazon SQS at-least-once delivery and FIFO deduplication; Step Functions error handling; Amazon Time Sync Service",
    "AWS Well-Architected Framework, Reliability pillar (REL05: design interactions to mitigate or withstand failures)"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-6-01", front: "The eight fallacies of distributed computing?", back: "Network is reliable · latency is zero · bandwidth is infinite · network is secure · topology doesn't change · one administrator · transport cost is zero · network is homogeneous." },
  { id: "fc-M04-6-02", front: "What does a timeout tell you?", back: "Only that no answer arrived in time, not whether the work happened. Retried operations must be idempotent." },
  { id: "fc-M04-6-03", front: "Capped exponential backoff with full jitter formula?", back: "sleep = random(0, min(cap, base × 2^attempt))." },
  { id: "fc-M04-6-04", front: "Why add jitter to retries?", back: "To de-synchronise clients that failed together, so retries arrive as a trickle instead of waves (avoids thundering herds)." },
  { id: "fc-M04-6-05", front: "Retry amplification across 3 layers with 3 attempts each?", back: "3 × 3 × 3 = 27 calls at the bottom. Retry at one layer only." },
  { id: "fc-M04-6-06", front: "Idempotency key pattern?", back: "Client generates a unique key per logical action, sends it on every attempt; server stores it (e.g. DynamoDB conditional write) and returns the original result for repeats." },
  { id: "fc-M04-6-07", front: "SQS standard vs FIFO delivery?", back: "Standard: at-least-once, best-effort ordering. FIFO: ordered per message group, deduplication within 5 minutes (exactly-once processing)." },
  { id: "fc-M04-6-08", front: "Circuit breaker states?", back: "Closed (normal) → Open (fail fast after too many failures) → Half-open (trial requests) → Closed or Open again." },
  { id: "fc-M04-6-09", front: "Which errors are retryable?", back: "Timeouts, connection errors, 429 throttling, 500/502/503/504. Not 4xx validation or authorisation errors." },
  { id: "fc-M04-6-10", front: "AWS mitigations for 'topology doesn't change'?", back: "Load balancers, Route 53 names, RDS endpoints, AWS Cloud Map / ECS Service Connect, Auto Scaling. Never hard-code IPs." },
  { id: "fc-M04-6-11", front: "Amazon Time Sync Service address?", back: "169.254.169.123 (IPv6 fd00:ec2::123 on Nitro), with PTP hardware clocks on supported instances." }
);
// ================================================================== 07_storage_formats.js
/* ---------------------------------------------------------------- M04.07 Data storage formats */
var DG_0407_BFO = `
<figure>
<svg class="diagram" viewBox="0 0 760 296" role="img" aria-labelledby="m0407at m0407ad">
  <title id="m0407at">Block, file and object storage compared</title>
  <desc id="m0407ad">Three panels. Block storage presents fixed-size blocks addressed by number and is attached to one instance, as with Amazon EBS. File storage presents a hierarchy of paths shared by many clients over NFS or SMB, as with Amazon EFS and FSx. Object storage is a flat map from bucket and key to whole objects with metadata, reached over an HTTPS API, as with Amazon S3.</desc>

  <rect class="dg-info" x="12" y="12" width="234" height="240" rx="10"/>
  <text class="dg-tb" x="24" y="36">Block storage</text>
  <rect class="dg-box" x="24" y="52" width="30" height="22" rx="3"/><rect class="dg-box" x="64" y="52" width="30" height="22" rx="3"/><rect class="dg-box" x="104" y="52" width="30" height="22" rx="3"/><rect class="dg-box" x="144" y="52" width="30" height="22" rx="3"/><rect class="dg-box" x="184" y="52" width="30" height="22" rx="3"/>
  <rect class="dg-box" x="24" y="82" width="30" height="22" rx="3"/><rect class="dg-box" x="64" y="82" width="30" height="22" rx="3"/><rect class="dg-box" x="104" y="82" width="30" height="22" rx="3"/><rect class="dg-box" x="144" y="82" width="30" height="22" rx="3"/><rect class="dg-box" x="184" y="82" width="30" height="22" rx="3"/>
  <text class="dg-ts" x="24" y="124">fixed-size blocks, by number</text>
  <text class="dg-ts" x="24" y="148">Address: volume + block offset</text>
  <text class="dg-ts" x="24" y="164">Attached to one instance*</text>
  <text class="dg-ts" x="24" y="180">Protocol: NVMe (block device)</text>
  <text class="dg-ts" x="24" y="196">You format it (xfs, ext4, NTFS)</text>
  <text class="dg-ts" x="24" y="212">Latency: sub-millisecond</text>
  <text class="dg-t" x="24" y="236">AWS: EBS, instance store</text>

  <rect class="dg-good" x="263" y="12" width="234" height="240" rx="10"/>
  <text class="dg-tb" x="275" y="36">File storage</text>
  <text class="dg-t" x="279" y="62">/</text>
  <text class="dg-t" x="295" y="80">data/</text>
  <text class="dg-t" x="315" y="98">sales.csv</text>
  <text class="dg-t" x="295" y="116">home/ana/</text>
  <path class="dg-line" d="M283 66 V112 M283 76 H291 M283 112 H291 M301 84 V94 H311"/>
  <text class="dg-ts" x="380" y="80">a hierarchy</text>
  <text class="dg-ts" x="380" y="96">of paths</text>
  <text class="dg-ts" x="275" y="148">Address: path /data/sales.csv</text>
  <text class="dg-ts" x="275" y="164">Many clients at the same time</text>
  <text class="dg-ts" x="275" y="180">Protocol: NFS or SMB</text>
  <text class="dg-ts" x="275" y="196">Locks, permissions, rename</text>
  <text class="dg-ts" x="275" y="212">Latency: low milliseconds</text>
  <text class="dg-t" x="275" y="236">AWS: EFS, FSx (4 types)</text>

  <rect class="dg-edge" x="514" y="12" width="234" height="240" rx="10"/>
  <text class="dg-tb" x="526" y="36">Object storage</text>
  <rect class="dg-box" x="526" y="50" width="210" height="22" rx="11"/><text class="dg-ts" x="538" y="65">key: logs/2025/10/07/app.log</text>
  <rect class="dg-box" x="526" y="78" width="210" height="22" rx="11"/><text class="dg-ts" x="538" y="93">key: img/logo.png</text>
  <rect class="dg-box" x="526" y="106" width="210" height="22" rx="11"/><text class="dg-ts" x="538" y="121">+ metadata, version ID, tags</text>
  <text class="dg-ts" x="526" y="148">Address: bucket + key (flat)</text>
  <text class="dg-ts" x="526" y="164">Any client, anywhere, via HTTPS</text>
  <text class="dg-ts" x="526" y="180">Protocol: REST API (GET/PUT)</text>
  <text class="dg-ts" x="526" y="196">Whole-object writes, no edits</text>
  <text class="dg-ts" x="526" y="212">Latency: tens of ms to 1st byte</text>
  <text class="dg-t" x="526" y="236">AWS: Amazon S3</text>

  <text class="dg-ts" x="12" y="276">* Exception: EBS Multi-Attach (io1/io2, same AZ) shares one volume, but needs a cluster-aware file system.</text>
</svg>
<figcaption>Figure M04-7a. The three ways to store bytes. The difference is how you <em>address</em> data and <em>who can share it</em>, and that decides which AWS service fits.</figcaption>
</figure>`;

var DG_0407_ROWCOL = `
<figure>
<svg class="diagram" viewBox="0 0 760 286" role="img" aria-labelledby="m0407bt m0407bd">
  <title id="m0407bt">Row-oriented versus columnar storage layout</title>
  <desc id="m0407bd">A four-row sales table with columns id, name, country and amount. A row store keeps each row's values together, so a query that needs only country and amount must still read every value. A column store keeps each column's values together, so the same query reads only the country and amount columns.</desc>

  <text class="dg-tb" x="12" y="24">Logical table</text>
  <rect class="dg-box" x="12" y="34" width="44" height="22"/><text class="dg-ts" x="20" y="50">id</text>
  <rect class="dg-box" x="56" y="34" width="44" height="22"/><text class="dg-ts" x="62" y="50">name</text>
  <rect class="dg-box" x="100" y="34" width="44" height="22"/><text class="dg-ts" x="108" y="50">ctry</text>
  <rect class="dg-box" x="144" y="34" width="44" height="22"/><text class="dg-ts" x="152" y="50">amt</text>
  <text class="dg-ts" x="20" y="74">1</text><text class="dg-ts" x="62" y="74">Ana</text><text class="dg-ts" x="108" y="74">PT</text><text class="dg-ts" x="152" y="74">30</text>
  <text class="dg-ts" x="20" y="98">2</text><text class="dg-ts" x="62" y="98">Bo</text><text class="dg-ts" x="108" y="98">SE</text><text class="dg-ts" x="152" y="98">12</text>
  <text class="dg-ts" x="20" y="122">3</text><text class="dg-ts" x="62" y="122">Cy</text><text class="dg-ts" x="108" y="122">PT</text><text class="dg-ts" x="152" y="122">45</text>
  <text class="dg-ts" x="20" y="146">4</text><text class="dg-ts" x="62" y="146">Di</text><text class="dg-ts" x="108" y="146">US</text><text class="dg-ts" x="152" y="146">8</text>

  <text class="dg-tb" x="210" y="24">Row-oriented (OLTP)</text>
  <rect class="dg-box" x="210" y="34" width="48" height="24"/><text class="dg-ts" x="218" y="50">1</text>
  <rect class="dg-box" x="258" y="34" width="48" height="24"/><text class="dg-ts" x="266" y="50">Ana</text>
  <rect class="dg-good" x="306" y="34" width="48" height="24"/><text class="dg-ts" x="314" y="50">PT</text>
  <rect class="dg-good" x="354" y="34" width="48" height="24"/><text class="dg-ts" x="362" y="50">30</text>
  <rect class="dg-box" x="210" y="64" width="48" height="24"/><text class="dg-ts" x="218" y="80">2</text>
  <rect class="dg-box" x="258" y="64" width="48" height="24"/><text class="dg-ts" x="266" y="80">Bo</text>
  <rect class="dg-good" x="306" y="64" width="48" height="24"/><text class="dg-ts" x="314" y="80">SE</text>
  <rect class="dg-good" x="354" y="64" width="48" height="24"/><text class="dg-ts" x="362" y="80">12</text>
  <rect class="dg-box" x="210" y="94" width="48" height="24"/><text class="dg-ts" x="218" y="110">3</text>
  <rect class="dg-box" x="258" y="94" width="48" height="24"/><text class="dg-ts" x="266" y="110">Cy</text>
  <rect class="dg-good" x="306" y="94" width="48" height="24"/><text class="dg-ts" x="314" y="110">PT</text>
  <rect class="dg-good" x="354" y="94" width="48" height="24"/><text class="dg-ts" x="362" y="110">45</text>
  <rect class="dg-box" x="210" y="124" width="48" height="24"/><text class="dg-ts" x="218" y="140">4</text>
  <rect class="dg-box" x="258" y="124" width="48" height="24"/><text class="dg-ts" x="266" y="140">Di</text>
  <rect class="dg-good" x="306" y="124" width="48" height="24"/><text class="dg-ts" x="314" y="140">US</text>
  <rect class="dg-good" x="354" y="124" width="48" height="24"/><text class="dg-ts" x="362" y="140">8</text>
  <text class="dg-ts" x="210" y="172">Each row is stored together. The query</text>
  <text class="dg-ts" x="210" y="188">reads all 16 values to use 8. Ideal for</text>
  <text class="dg-ts" x="210" y="204">"fetch or update order 42".</text>

  <text class="dg-tb" x="470" y="24">Columnar (OLAP)</text>
  <text class="dg-ts" x="470" y="50">id</text>
  <rect class="dg-box" x="510" y="34" width="56" height="24"/><text class="dg-ts" x="518" y="50">1</text>
  <rect class="dg-box" x="566" y="34" width="56" height="24"/><text class="dg-ts" x="574" y="50">2</text>
  <rect class="dg-box" x="622" y="34" width="56" height="24"/><text class="dg-ts" x="630" y="50">3</text>
  <rect class="dg-box" x="678" y="34" width="56" height="24"/><text class="dg-ts" x="686" y="50">4</text>
  <text class="dg-ts" x="470" y="80">name</text>
  <rect class="dg-box" x="510" y="64" width="56" height="24"/><text class="dg-ts" x="518" y="80">Ana</text>
  <rect class="dg-box" x="566" y="64" width="56" height="24"/><text class="dg-ts" x="574" y="80">Bo</text>
  <rect class="dg-box" x="622" y="64" width="56" height="24"/><text class="dg-ts" x="630" y="80">Cy</text>
  <rect class="dg-box" x="678" y="64" width="56" height="24"/><text class="dg-ts" x="686" y="80">Di</text>
  <text class="dg-ts" x="470" y="110">ctry</text>
  <rect class="dg-good" x="510" y="94" width="56" height="24"/><text class="dg-ts" x="518" y="110">PT</text>
  <rect class="dg-good" x="566" y="94" width="56" height="24"/><text class="dg-ts" x="574" y="110">SE</text>
  <rect class="dg-good" x="622" y="94" width="56" height="24"/><text class="dg-ts" x="630" y="110">PT</text>
  <rect class="dg-good" x="678" y="94" width="56" height="24"/><text class="dg-ts" x="686" y="110">US</text>
  <text class="dg-ts" x="470" y="140">amt</text>
  <rect class="dg-good" x="510" y="124" width="56" height="24"/><text class="dg-ts" x="518" y="140">30</text>
  <rect class="dg-good" x="566" y="124" width="56" height="24"/><text class="dg-ts" x="574" y="140">12</text>
  <rect class="dg-good" x="622" y="124" width="56" height="24"/><text class="dg-ts" x="630" y="140">45</text>
  <rect class="dg-good" x="678" y="124" width="56" height="24"/><text class="dg-ts" x="686" y="140">8</text>
  <text class="dg-ts" x="470" y="172">Each column is stored together. The query</text>
  <text class="dg-ts" x="470" y="188">reads only 2 columns (8 values), and</text>
  <text class="dg-ts" x="470" y="204">similar values compress very well.</text>

  <rect class="dg-info" x="12" y="220" width="736" height="34" rx="6"/>
  <text class="dg-t" x="24" y="242">SELECT ctry, SUM(amt) FROM sales GROUP BY ctry   → only the green cells are needed</text>
  <text class="dg-ts" x="12" y="276">Real column stores keep millions of values per column chunk, with min/max statistics so whole chunks can be skipped.</text>
</svg>
<figcaption>Figure M04-7b. Same data, two physical layouts. Row stores make single-record reads and writes cheap; column stores make scans over a few columns cheap.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.07", title: "Data storage formats", level: 200, minutes: 55,
  objectives: [
    "Compare block, file and object storage by addressing, sharing, protocol, latency and scale, and map each to EBS, instance store, EFS, FSx and S3",
    "Choose a database by data model (relational, key-value, document, wide-column, graph, time-series, search, in-memory) and name the AWS purpose-built service",
    "Explain row vs columnar storage and calculate the effect of columnar formats, compression and partitioning on bytes scanned and query cost",
    "Distinguish OLTP from OLAP and pick Aurora/RDS, DynamoDB, Redshift, Athena or EMR for a workload",
    "Recognise the exam keywords that point to each storage service"
  ],
  sections: [
    { type: "why", html: `
<p>Every system eventually stores data, and the storage choice is one of the hardest decisions to reverse. Moving 50 TB from one service to another, rewriting an application's data-access layer, or re-modelling a database under production load costs weeks. Choosing the wrong format is also expensive: the same analytics query can scan 1 TB of CSV for about $5, or 10 GB of partitioned Parquet for about 5 cents.</p>
<p>The SAA-C03 exam tests this constantly. A typical stem describes the data ("shared across many Linux instances", "Windows file shares with Active Directory", "petabytes of logs queried occasionally", "millisecond lookups by key at any scale") and asks for the service. If you can classify the data by <strong>how it is addressed</strong>, <strong>who shares it</strong> and <strong>how it is queried</strong>, most of these questions answer themselves.</p>` },

    { type: "concept", title: "Block, file and object storage", html: DG_0407_BFO + `
<p>All storage ultimately writes bytes to disks or flash. The three <em>storage types</em> differ in the interface they give you, and that interface decides who can use the data and how.</p>
<h3>Block storage</h3>
<p><strong>Block storage</strong> exposes a raw disk: a long array of fixed-size <em>blocks</em> (commonly 512 bytes or 4 KiB) addressed by number, the <em>logical block address (LBA)</em>. The storage knows nothing about files. The operating system formats the device with a <strong>file system</strong> (xfs, ext4, NTFS) that keeps track of which blocks belong to which file.</p>
<ul>
  <li><strong>Strengths:</strong> the lowest latency and the finest-grained access. A database can update one 8 KiB page in place without touching the rest of the file. Boot volumes, databases and anything that needs a "real disk" use block storage.</li>
  <li><strong>Limitation:</strong> a normal file system assumes it is the only writer. Two servers mounting the same block device would corrupt it, so block volumes are attached to <strong>one instance at a time</strong> (with a narrow exception, EBS Multi-Attach, which requires a cluster-aware file system).</li>
  <li><strong>On AWS:</strong> <strong>Amazon EBS</strong> (network-attached volumes that persist independently of the instance, scoped to one AZ) and <strong>instance store</strong> (NVMe disks physically in the host: very fast, but <em>ephemeral</em>).</li>
</ul>
<h3>File storage</h3>
<p><strong>File storage</strong> exposes a shared <strong>hierarchy of directories and files</strong> over a network protocol: <strong>NFS</strong> (Network File System, the Linux/Unix standard) or <strong>SMB</strong> (Server Message Block, the Windows standard). The file server owns the file system, so many clients can read and write the same files at once, with locking and permissions handled centrally.</p>
<ul>
  <li><strong>Strengths:</strong> sharing. Content-management systems, home directories, shared build caches, media processing and lift-and-shift applications that expect a mounted share all need file storage.</li>
  <li><strong>Semantics:</strong> POSIX-style operations such as open, seek, append, rename and lock work as applications expect.</li>
  <li><strong>On AWS:</strong> <strong>Amazon EFS</strong> (elastic NFS for Linux) and the <strong>Amazon FSx</strong> family: FSx for Windows File Server, FSx for Lustre, FSx for NetApp ONTAP and FSx for OpenZFS.</li>
</ul>
<h3>Object storage</h3>
<p><strong>Object storage</strong> keeps <strong>whole objects</strong> (data plus metadata) in a <strong>flat namespace</strong>: a bucket and a key such as <code>logs/2025/10/07/app.log</code>. The slashes are just characters in the key; there are no real directories. You reach objects through an <strong>HTTP(S) API</strong> (<code>PUT</code>, <code>GET</code>, <code>DELETE</code>, <code>LIST</code>) from anywhere with network access and permission.</p>
<ul>
  <li><strong>Strengths:</strong> practically unlimited scale and very high durability at a low price per GB. Any number of clients can read concurrently, from inside or outside AWS.</li>
  <li><strong>Limitation:</strong> objects are written as a whole. You can't modify byte 1,000 of a 2 GB object in place; you upload a new version. First-byte latency is higher than block or file storage, typically tens of milliseconds (S3 Express One Zone offers single-digit milliseconds for latency-sensitive cases).</li>
  <li><strong>On AWS:</strong> <strong>Amazon S3</strong>, the foundation of data lakes, backups, static websites and application assets.</li>
</ul>
<table>
<thead><tr><th>Property</th><th>Block</th><th>File</th><th>Object</th></tr></thead>
<tbody>
<tr><td>Unit of access</td><td>Block (bytes at an offset)</td><td>File (byte ranges within a file)</td><td>Whole object (range reads allowed)</td></tr>
<tr><td>Addressed by</td><td>Device + block number</td><td>Path</td><td>Bucket + key</td></tr>
<tr><td>Interface</td><td>Block device (NVMe)</td><td>NFS / SMB mount</td><td>HTTPS REST API, SDKs</td></tr>
<tr><td>Concurrent clients</td><td>One (normally)</td><td>Many</td><td>Effectively unlimited</td></tr>
<tr><td>In-place update</td><td>Yes</td><td>Yes</td><td>No (replace the object)</td></tr>
<tr><td>Typical latency</td><td>Sub-millisecond</td><td>Low milliseconds</td><td>Tens of milliseconds to first byte</td></tr>
<tr><td>Scaling</td><td>You provision size and performance</td><td>Elastic (EFS) or provisioned (FSx)</td><td>Automatic, no capacity planning</td></tr>
<tr><td>Relative price per GB</td><td>Medium (you pay for provisioned size)</td><td>Highest (EFS Standard)</td><td>Lowest, with cheaper archive classes</td></tr>
<tr><td>Typical use</td><td>Boot disks, databases, transactional apps</td><td>Shared content, home dirs, lift-and-shift</td><td>Data lakes, backups, media, static assets, logs</td></tr>
</tbody></table>` },

    { type: "concept", title: "Data models: choosing a database", html: `
<p>Storage types describe <em>where bytes live</em>. <strong>Data models</strong> describe <em>how the application thinks about its data</em> and how it queries it. Modern architectures use <strong>purpose-built databases</strong>: pick the model that fits each access pattern instead of forcing everything into one engine.</p>
<table>
<thead><tr><th>Model</th><th>Shape of the data</th><th>Typical queries</th><th>AWS service</th></tr></thead>
<tbody>
<tr><td><strong>Relational</strong></td><td>Tables with a fixed schema; relationships through foreign keys; ACID transactions</td><td>Joins, ad hoc SQL, multi-row transactions</td><td>Amazon RDS (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Db2), Amazon Aurora</td></tr>
<tr><td><strong>Key-value</strong></td><td>Items looked up by a key; schema-less attributes</td><td>Get/put by key at any scale with single-digit-ms latency</td><td>Amazon DynamoDB</td></tr>
<tr><td><strong>Document</strong></td><td>JSON-like documents with nested fields</td><td>Query by fields inside documents</td><td>Amazon DocumentDB (MongoDB-compatible), DynamoDB for simpler cases</td></tr>
<tr><td><strong>Wide-column</strong></td><td>Rows with many, varying columns, partitioned by key</td><td>High-volume writes, queries by partition key</td><td>Amazon Keyspaces (Apache Cassandra-compatible)</td></tr>
<tr><td><strong>Graph</strong></td><td>Nodes and edges</td><td>Traversals: friends of friends, fraud rings, recommendations</td><td>Amazon Neptune</td></tr>
<tr><td><strong>Time-series</strong></td><td>Timestamped measurements</td><td>Aggregations over time windows, downsampling</td><td>Amazon Timestream</td></tr>
<tr><td><strong>Search</strong></td><td>Text documents with an inverted index</td><td>Full-text search, relevance ranking, log analytics</td><td>Amazon OpenSearch Service</td></tr>
<tr><td><strong>In-memory</strong></td><td>Keys and data structures held in RAM</td><td>Microsecond reads, caching, leaderboards, sessions</td><td>Amazon ElastiCache (Valkey, Redis OSS, Memcached), Amazon MemoryDB (durable)</td></tr>
<tr><td><strong>Ledger</strong></td><td>Append-only, cryptographically verifiable history</td><td>"Prove this record was never changed"</td><td>Historically Amazon QLDB. AWS has announced end of support for QLDB, so new designs typically use Aurora PostgreSQL with audit features or another verifiable log.</td></tr>
</tbody></table>
<div class="callout"><strong>Schema-on-write vs schema-on-read.</strong> A relational database validates data against its schema when you <em>write</em> it. A data lake stores raw files and applies a schema when you <em>read</em> (query) them, for example through the AWS Glue Data Catalog. Schema-on-read is flexible and cheap to ingest; schema-on-write catches bad data early.</div>
<h3>OLTP vs OLAP</h3>
<p>Two very different workloads sit on top of these models:</p>
<table>
<thead><tr><th></th><th>OLTP (online transaction processing)</th><th>OLAP (online analytical processing)</th></tr></thead>
<tbody>
<tr><td>Question asked</td><td>"Place order 42", "update this customer"</td><td>"Revenue by country by month for 3 years"</td></tr>
<tr><td>Rows touched per query</td><td>A few</td><td>Millions to billions</td></tr>
<tr><td>Columns touched</td><td>Most of the row</td><td>A few of many</td></tr>
<tr><td>Concurrency</td><td>Thousands of short transactions</td><td>Tens of long queries</td></tr>
<tr><td>Best layout</td><td>Row-oriented, indexed</td><td>Columnar, compressed, partitioned</td></tr>
<tr><td>AWS</td><td>Aurora, RDS, DynamoDB</td><td>Amazon Redshift (warehouse), Amazon Athena (serverless SQL on S3), Amazon EMR (Spark, Hive, Presto)</td></tr>
</tbody></table>
<p>Running heavy analytics on the OLTP database slows down customer transactions. The standard pattern is to <strong>separate them</strong>: copy data from OLTP to an analytical store, by ETL jobs, change data capture, or <strong>zero-ETL integrations</strong> (for example Aurora to Redshift). Systems that try to do both well are called <strong>HTAP</strong> (hybrid transactional/analytical processing).</p>` },

    { type: "concept", title: "Row vs columnar storage, file formats and partitioning", html: DG_0407_ROWCOL + `
<h3>Why layout matters</h3>
<p>Disks and S3 are read in chunks (pages, blocks, byte ranges). If the values a query needs are spread through every chunk, it reads everything. A <strong>row-oriented</strong> layout stores each record's fields together, which is perfect for "read or update one order", because one read fetches the whole record. A <strong>columnar</strong> layout stores each column's values together, which is perfect for "sum one column over a billion rows", because the query reads only the columns it needs.</p>
<p>Columnar storage has two more advantages:</p>
<ul>
  <li><strong>Compression:</strong> a column holds values of one type, often repetitive (country codes, status flags, timestamps close together). Encodings such as dictionary, run-length and delta encoding plus a compression codec (Snappy, ZSTD, GZIP) commonly shrink it several times.</li>
  <li><strong>Skipping:</strong> each chunk of a column stores <strong>statistics</strong> such as min and max. A filter <code>WHERE amount &gt; 1000</code> can skip every chunk whose max is below 1,000 without reading it. This is called <strong>predicate pushdown</strong>.</li>
</ul>
<h3>File formats for data lakes</h3>
<table>
<thead><tr><th>Format</th><th>Layout</th><th>Schema</th><th>Compression</th><th>Splittable for parallel reads</th><th>Best for</th></tr></thead>
<tbody>
<tr><td><strong>CSV</strong></td><td>Row, text</td><td>None (header row at best)</td><td>Whole-file only (gzip makes it unsplittable)</td><td>Uncompressed only</td><td>Interchange with humans and legacy tools</td></tr>
<tr><td><strong>JSON / JSON Lines</strong></td><td>Row, text</td><td>Self-describing per record</td><td>Whole-file</td><td>JSON Lines uncompressed</td><td>Events, APIs, semi-structured data</td></tr>
<tr><td><strong>Avro</strong></td><td>Row, binary</td><td>Embedded, supports evolution</td><td>Per block</td><td>Yes</td><td>Streaming and ingestion (Kafka), write-heavy pipelines</td></tr>
<tr><td><strong>Parquet</strong></td><td>Columnar, binary</td><td>Embedded</td><td>Per column chunk</td><td>Yes (row groups)</td><td>Analytics on S3: Athena, Redshift Spectrum, EMR, Glue</td></tr>
<tr><td><strong>ORC</strong></td><td>Columnar, binary</td><td>Embedded</td><td>Per stripe</td><td>Yes (stripes)</td><td>Analytics, Hive ecosystem</td></tr>
</tbody></table>
<p>Open table formats such as <strong>Apache Iceberg</strong>, Delta Lake and Hudi add a metadata layer on top of Parquet files: ACID updates, time travel and schema evolution for data lakes. Athena, EMR, Glue and Redshift support Iceberg. You'll meet them in M28.</p>
<h3>Partitioning</h3>
<p><strong>Partitioning</strong> splits a dataset into folders by a column that queries usually filter on, most often date:</p>
<pre><code>s3://acme-logs/app=checkout/year=2025/month=10/day=07/part-0001.snappy.parquet
s3://acme-logs/app=checkout/year=2025/month=10/day=08/part-0001.snappy.parquet</code></pre>
<p>A query with <code>WHERE year = '2025' AND month = '10' AND day = '07'</code> reads only that folder. This <strong>partition pruning</strong> is the single biggest cost lever in Athena. Choose partition keys that queries actually filter on, and don't over-partition: millions of tiny partitions or files slow planning and add S3 request costs.</p>
<h3>Hot, warm and cold data</h3>
<p>Data cools as it ages: last week's orders are read constantly, last year's rarely, and seven-year-old records only for audits. Architects match the storage tier to the temperature: S3 Standard → S3 Standard-IA → S3 Glacier Instant/Flexible Retrieval → S3 Glacier Deep Archive, moved automatically by <strong>lifecycle rules</strong> or by <strong>S3 Intelligent-Tiering</strong> when access patterns are unknown. EFS and EBS have their own colder tiers. The details are in M18 and M19.</p>` },

    { type: "workflow", title: "Choosing storage, and how a data-lake query executes", html: `
<h3>A repeatable decision process</h3>
<ol class="flow">
  <li><strong>Describe the access pattern.</strong> Who reads and writes (one server, many servers, any client on the internet)? Random small reads and in-place updates, or whole files and objects? Point lookups or scans?</li>
  <li><strong>Pick the storage type.</strong> One instance needs a disk → block (EBS, or instance store for scratch). Many instances share files → file (EFS for Linux, FSx for Windows/SMB, HPC, NetApp or ZFS). Huge scale, HTTP access, write-once → object (S3).</li>
  <li><strong>If it's structured data that applications query, pick the data model.</strong> Joins and transactions → relational. Known key-based access at any scale → key-value. Relationships → graph. Text → search. Microsecond reads → in-memory.</li>
  <li><strong>Separate analytics from transactions.</strong> Feed an OLAP store (S3 data lake + Athena, or Redshift) instead of querying production.</li>
  <li><strong>Choose formats and layout for analytics.</strong> Columnar (Parquet/ORC), compressed, partitioned by the most common filter, files sized roughly 128 MB to 1 GB.</li>
  <li><strong>Plan the data's life cycle.</strong> Tiering, retention, deletion, backups and encryption (M07, M18, M20).</li>
  <li><strong>Check the non-functionals.</strong> Durability, availability (zonal or Regional?), latency, throughput, cost per GB and per request, compliance.</li>
</ol>
<h3>What happens when Athena queries a partitioned Parquet table</h3>
<ol class="flow">
  <li><strong>Parse and plan:</strong> Athena (built on the Trino/Presto engine) parses the SQL and reads the table definition and partition list from the <strong>AWS Glue Data Catalog</strong>.</li>
  <li><strong>Partition pruning:</strong> filters on partition columns (<code>day = '07'</code>) eliminate every other S3 prefix before any data is read.</li>
  <li><strong>Read file footers:</strong> each Parquet file ends with metadata: the schema, row groups, and min/max statistics per column chunk.</li>
  <li><strong>Column pruning:</strong> only the column chunks named in the query are fetched, using S3 byte-range GETs.</li>
  <li><strong>Predicate pushdown:</strong> row groups whose statistics can't match the <code>WHERE</code> clause are skipped entirely.</li>
  <li><strong>Distributed execution:</strong> many workers decompress and process the chunks in parallel, then aggregate.</li>
  <li><strong>Billing:</strong> you pay for the <strong>bytes actually scanned</strong>, compressed size, with a small minimum per query. Steps 2, 4 and 5 are what make the bill small.</li>
</ol>` },

    { type: "aws", html: `
<h3>Block storage on AWS</h3>
<table>
<thead><tr><th>Service</th><th>Key facts for architects</th></tr></thead>
<tbody>
<tr><td><strong>Amazon EBS</strong></td><td>Network-attached volumes in <strong>one AZ</strong>; data persists when the instance stops. Volume types: gp3 (general-purpose SSD, baseline 3,000 IOPS and 125 MiB/s, both adjustable independently of size), io2 Block Express (highest IOPS, sub-millisecond, critical databases), st1/sc1 (throughput-optimised and cold HDD for big sequential workloads). <strong>Snapshots</strong> are incremental and stored in S3; copy them to another AZ or Region to move or protect data. Multi-Attach for io1/io2 in one AZ.</td></tr>
<tr><td><strong>Instance store</strong></td><td>NVMe disks on the physical host. Very high IOPS and lowest latency, included in the instance price. Data <strong>survives a reboot</strong> but is <strong>lost when the instance stops, hibernates or terminates, or the host fails</strong>. Use for caches, buffers, scratch and replicated data (for example a Cassandra or Kafka cluster that replicates across nodes).</td></tr>
</tbody></table>
<h3>File storage on AWS</h3>
<table>
<thead><tr><th>Service</th><th>Protocol</th><th>Choose it when</th></tr></thead>
<tbody>
<tr><td><strong>Amazon EFS</strong></td><td>NFSv4.x, Linux</td><td>Many Linux instances, containers or Lambda functions share files. Regional (multi-AZ) by default, One Zone option for lower cost. Grows and shrinks automatically. Storage classes Standard, Infrequent Access and Archive, with lifecycle policies.</td></tr>
<tr><td><strong>FSx for Windows File Server</strong></td><td>SMB, NTFS, Active Directory</td><td>Windows applications, home directories, SharePoint, SQL Server shares; needs AD integration, DFS namespaces, Windows ACLs. Multi-AZ option.</td></tr>
<tr><td><strong>FSx for Lustre</strong></td><td>Lustre (POSIX)</td><td>HPC, ML training, media rendering: hundreds of GB/s and millions of IOPS. Can link to an S3 bucket, presenting objects as files. <em>Scratch</em> (temporary, cheaper) vs <em>persistent</em> deployment types.</td></tr>
<tr><td><strong>FSx for NetApp ONTAP</strong></td><td>NFS, SMB and iSCSI</td><td>Migrating NetApp workloads, multi-protocol access to the same data, snapshots/clones/replication with familiar ONTAP tools.</td></tr>
<tr><td><strong>FSx for OpenZFS</strong></td><td>NFS</td><td>Migrating ZFS or Linux NFS servers; very low latency, snapshots and clones.</td></tr>
</tbody></table>
<h3>Object storage on AWS: Amazon S3</h3>
<ul>
  <li>Objects up to 5 TB (multipart upload for anything large; a single PUT is limited to 5 GB). Designed for 99.999999999% (11 nines) durability across multiple AZs (except One Zone classes).</li>
  <li><strong>Strong read-after-write consistency</strong> for all PUT, DELETE and LIST operations since December 2020.</li>
  <li>Storage classes from Standard to Glacier Deep Archive; lifecycle rules; versioning; replication (CRR/SRR); encryption by default (SSE-S3) since January 2023. Deep dive in M18.</li>
  <li>Query in place with <strong>Athena</strong>, <strong>Redshift Spectrum</strong> or <strong>S3 Select</strong>-style range reads; catalogue with <strong>AWS Glue</strong>.</li>
</ul>
<h3>Analytics services that care about formats</h3>
<table>
<thead><tr><th>Service</th><th>What it is</th><th>Format advice</th></tr></thead>
<tbody>
<tr><td><strong>Amazon Athena</strong></td><td>Serverless SQL over S3, priced per data scanned (commonly about $5 per TB in many Regions; check current pricing)</td><td>Parquet/ORC, compressed, partitioned; avoid many tiny files</td></tr>
<tr><td><strong>Amazon Redshift</strong></td><td>Columnar, massively parallel data warehouse (provisioned or Serverless)</td><td>Load with COPY from Parquet; sort and distribution keys; Spectrum for S3 data</td></tr>
<tr><td><strong>Amazon EMR</strong></td><td>Managed Spark, Hive, Trino, HBase clusters (or EMR Serverless)</td><td>Parquet/ORC; table formats such as Iceberg</td></tr>
<tr><td><strong>AWS Glue</strong></td><td>Data Catalog, crawlers and serverless Spark ETL</td><td>Use Glue jobs to convert CSV/JSON to partitioned Parquet</td></tr>
</tbody></table>` },

    { type: "examples", html: `
<h3>Worked example 1: bytes scanned, row vs columnar</h3>
<p>A <code>sales</code> table has <strong>50 columns</strong> of roughly equal size and <strong>1 TB</strong> of uncompressed data. An analyst runs <code>SELECT country, SUM(amount) FROM sales GROUP BY country</code> (2 of 50 columns).</p>
<table>
<thead><tr><th>Layout</th><th>Calculation</th><th>Data read</th><th>Athena cost at $5/TB</th></tr></thead>
<tbody>
<tr><td>CSV (row, uncompressed)</td><td>All columns must be read</td><td>1 TB</td><td>$5.00</td></tr>
<tr><td>Parquet, uncompressed</td><td>1 TB × 2/50</td><td>40 GB</td><td>$0.20</td></tr>
<tr><td>Parquet + Snappy (assume 4:1 compression)</td><td>40 GB ÷ 4</td><td>10 GB</td><td>$0.05</td></tr>
</tbody></table>
<p>Columnar layout alone cut the scan 25×; compression cut it another 4×. The query also runs much faster, because there is less data to read.</p>
<h3>Worked example 2: partition pruning</h3>
<p>The same table holds one year of data, <strong>3.65 TB</strong> as CSV, evenly spread over 365 days (10 GB per day). A dashboard always queries the <strong>last 7 days</strong>.</p>
<ul>
  <li>Unpartitioned: every query scans 3.65 TB.</li>
  <li>Partitioned by day: the query reads 7 × 10 GB = <strong>70 GB</strong>, a 52× reduction, before any columnar savings.</li>
  <li>Partitioned and Parquet (2 of 50 columns, 4:1 compression): 70 GB × 2/50 ÷ 4 = <strong>0.7 GB</strong>.</li>
</ul>
<h3>Worked example 3: converting CSV to partitioned Parquet with Athena (CTAS)</h3>
<pre><code>-- 1. Table over the existing CSV files (schema-on-read)
CREATE EXTERNAL TABLE logs_csv (
  ts string, app string, status int, latency_ms int, user_id string, path string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
LOCATION 's3://acme-raw/logs/'
TBLPROPERTIES ('skip.header.line.count'='1');

-- 2. CREATE TABLE AS SELECT writes Parquet, compressed and partitioned
CREATE TABLE logs_parquet
WITH (
  format = 'PARQUET',
  write_compression = 'SNAPPY',
  external_location = 's3://acme-curated/logs/',
  partitioned_by = ARRAY['day']          -- partition columns must come last
) AS
SELECT ts, app, status, latency_ms, user_id, path,
       substr(ts, 1, 10) AS day
FROM logs_csv
WHERE ts &gt;= '2025-10-01';

-- 3. Same question, two tables: compare "Data scanned" in the console
SELECT status, count(*) FROM logs_csv     WHERE substr(ts,1,10) = '2025-10-07' GROUP BY status;
SELECT status, count(*) FROM logs_parquet WHERE day = '2025-10-07'             GROUP BY status;</code></pre>
<p>Typical result shape (numbers depend on your data):</p>
<pre><code>Query 1  Run time: 6.8 sec   Data scanned: 41.27 GB
Query 2  Run time: 0.9 sec   Data scanned: 38.40 MB</code></pre>
<p class="muted small">A single CTAS query can create a limited number of partitions (100 at the time of writing). For larger backfills, run it per date range or use a Glue ETL job.</p>
<h3>Worked example 4: classify five workloads</h3>
<table>
<thead><tr><th>Workload</th><th>Reasoning</th><th>Choice</th></tr></thead>
<tbody>
<tr><td>PostgreSQL database on EC2 needing 20,000 IOPS</td><td>One server, random small I/O, in-place updates</td><td>EBS gp3 with provisioned IOPS (or io2 for the strictest latency); better still, consider Amazon RDS</td></tr>
<tr><td>WordPress on 6 instances behind an ALB sharing <code>wp-content/uploads</code></td><td>Many Linux servers need the same files</td><td>Amazon EFS (and S3 + CloudFront for media offload)</td></tr>
<tr><td>Windows file shares for 800 staff with AD permissions</td><td>SMB, NTFS ACLs, Active Directory</td><td>FSx for Windows File Server (Multi-AZ)</td></tr>
<tr><td>Nightly genome analysis on 2,000 cores reading 200 TB from S3</td><td>HPC, massive parallel throughput, data in S3</td><td>FSx for Lustre linked to the S3 bucket (scratch deployment)</td></tr>
<tr><td>10 years of clickstream for occasional SQL analysis</td><td>Write-once, huge, scanned rarely</td><td>S3 (partitioned Parquet, lifecycle to colder classes) + Athena</td></tr>
</tbody></table>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Shopping cart and session data for millions of users, key lookups, unpredictable traffic</td><td>DynamoDB (on-demand)</td><td>Key-value access, single-digit-ms latency at any scale, serverless</td></tr>
<tr><td>Order management with joins, constraints and transactions</td><td>Aurora or RDS</td><td>Relational model, ACID, SQL</td></tr>
<tr><td>Product catalogue with flexible attributes per category, queried by nested fields</td><td>DocumentDB (or DynamoDB if access patterns are simple and known)</td><td>Document model matches JSON products</td></tr>
<tr><td>Fraud detection: "accounts sharing devices with a flagged account, within 3 hops"</td><td>Neptune</td><td>Graph traversals are expensive as SQL joins</td></tr>
<tr><td>IoT sensor readings every second, queried as hourly averages</td><td>Timestream (or partitioned Parquet in S3 for long-term analysis)</td><td>Time-series storage, retention tiers, time-window functions</td></tr>
<tr><td>Site search with typo tolerance and relevance ranking</td><td>OpenSearch Service</td><td>Inverted index and text analysis</td></tr>
<tr><td>Leaderboard updated thousands of times per second</td><td>ElastiCache (Valkey/Redis sorted sets) or MemoryDB if it must be durable</td><td>In-memory data structures, microsecond latency</td></tr>
<tr><td>Temporary scratch space for video transcoding</td><td>Instance store</td><td>Fastest local I/O, data is disposable</td></tr>
<tr><td>Enterprise BI over 50 TB with complex joins and many concurrent dashboards</td><td>Redshift</td><td>Columnar MPP warehouse, optimised for repeated complex queries</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: see compression and format effects locally", html: `
<p>Run this in WSL, Linux or AWS CloudShell (free). It needs only Python 3 and gzip.</p>
<pre><code>mkdir -p ~/m04-formats &amp;&amp; cd ~/m04-formats

# 1. Generate a 1,000,000-row CSV with repetitive columns (like real logs)
python3 - &lt;&lt;'PY'
import csv, random
random.seed(7)
apps = ["checkout", "search", "cart", "login"]
with open("logs.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["ts", "app", "status", "latency_ms", "country"])
    for i in range(1_000_000):
        w.writerow([f"2025-10-07T12:{i % 60:02d}:{i % 60:02d}Z", random.choice(apps),
                    random.choice([200, 200, 200, 404, 500]), random.randint(5, 900),
                    random.choice(["PT", "SE", "US", "IN"])])
PY

# 2. How big is it, and how well does it compress?
ls -lh logs.csv
gzip -k -9 logs.csv &amp;&amp; ls -lh logs.csv.gz

# 3. Simulate "column pruning": keep only the 2 columns a query needs
cut -d, -f2,3 logs.csv &gt; two_columns.csv
ls -lh two_columns.csv
gzip -k -9 two_columns.csv &amp;&amp; ls -lh two_columns.csv.gz</code></pre>
<p><strong>What to notice</strong> (sizes from a test run): the full CSV is about 38 MB and gzip shrinks it to about 5 MB (≈7:1) because the values repeat. Keeping only the two columns a query needs gives 11 MB, and those two low-cardinality columns compress to about 0.7 MB: roughly 50× less data than the original file. Parquet does both automatically, per column, while staying queryable.</p>
<p><strong>Optional, in your AWS account (cents):</strong> upload <code>logs.csv</code> to a bucket, create the <code>logs_csv</code> table from Worked example 3 in Athena (set a query-results location first), run a <code>GROUP BY</code>, then CTAS it to Parquet and compare the <em>Data scanned</em> figure. Delete the bucket contents, the tables and the results afterwards.</p>` },

    { type: "casestudy", title: "Case study: the Athena bill that grew with the data lake", html: `
<p><strong>Company:</strong> Parcelo, a parcel-tracking platform. Every scan event from 9,000 delivery vans lands in S3 as gzipped CSV, one file per van per hour.</p>
<p><strong>Situation:</strong> After a year the bucket held <strong>12 TB</strong> (uncompressed equivalent) in about 79 million small files. The operations team ran around <strong>40 Athena queries a day</strong> for dashboards and investigations. Because the table was unpartitioned and gzipped CSV can't skip columns, every query scanned the whole dataset. Queries took 8 to 15 minutes, some timed out, and the Athena line on the bill reached tens of thousands of dollars a month.</p>
<p><strong>Analysis:</strong></p>
<ul>
  <li>Almost every query filtered on a date range, usually the last 7 days.</li>
  <li>Queries used on average 4 of the 40 columns.</li>
  <li>Files averaged about 150 KB, so planning and S3 GET requests added overhead.</li>
</ul>
<p><strong>Design change:</strong></p>
<ol>
  <li>A nightly <strong>AWS Glue</strong> Spark job converts the previous day's CSV into <strong>Parquet with Snappy</strong>, <strong>partitioned by <code>event_date</code></strong>, compacted into files of about 256 MB.</li>
  <li>A one-off backfill converted the historical year, after which the raw CSV moved to S3 Glacier Flexible Retrieval through a lifecycle rule (kept for 2 years for compliance, then expired).</li>
  <li>Dashboards were rewritten to always filter on <code>event_date</code>; Athena <strong>workgroups</strong> got a per-query data-scanned limit to stop runaway queries.</li>
</ol>
<table>
<thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>Dataset size in S3 (queried copy)</td><td>12 TB uncompressed equivalent (CSV)</td><td>2.4 TB Parquet (≈5:1)</td></tr>
<tr><td>Data scanned per typical query</td><td>~12 TB</td><td>2.4 TB × 4/40 columns × 7/365 days ≈ 4.6 GB</td></tr>
<tr><td>Athena cost per day (40 queries, $5/TB)</td><td>40 × 12 TB × $5 = $2,400</td><td>40 × 0.0046 TB × $5 ≈ $0.92 (+ a few dollars of Glue ETL)</td></tr>
<tr><td>Typical query time</td><td>8–15 minutes</td><td>5–20 seconds</td></tr>
</tbody></table>
<p><strong>Lessons learned:</strong> the format and layout of data in a lake are an architecture decision, not a detail. Design partitions around the filters people actually use, compact small files, and put guardrails (workgroup limits, budgets) on pay-per-scan services. Keep the raw data for reprocessing, but in a cheaper storage class.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Keywords in the stem</th><th>Likely answer</th></tr></thead>
<tbody>
<tr><td>"Boot volume", "database on EC2", "low-latency block storage", "persists after stop"</td><td>Amazon EBS (gp3; io2 for highest IOPS)</td></tr>
<tr><td>"Temporary", "scratch", "highest I/O", "data can be lost", "buffer/cache"</td><td>Instance store</td></tr>
<tr><td>"Shared file system", "multiple Linux instances / AZs", "POSIX", "NFS", "scales automatically"</td><td>Amazon EFS</td></tr>
<tr><td>"Windows", "SMB", "Active Directory", "NTFS permissions", "DFS"</td><td>FSx for Windows File Server</td></tr>
<tr><td>"HPC", "machine learning training", "high-performance parallel file system", "process S3 data as files"</td><td>FSx for Lustre</td></tr>
<tr><td>"NetApp", "multi-protocol NFS + SMB + iSCSI"</td><td>FSx for NetApp ONTAP</td></tr>
<tr><td>"Unlimited storage", "static website/assets", "data lake", "durable backups", "HTTP access"</td><td>Amazon S3</td></tr>
<tr><td>"Ad hoc SQL on data in S3", "serverless", "pay per query"</td><td>Amazon Athena</td></tr>
<tr><td>"Data warehouse", "complex BI queries", "petabyte-scale analytics"</td><td>Amazon Redshift</td></tr>
<tr><td>"Reduce Athena cost / improve query performance"</td><td>Columnar format (Parquet/ORC), compression, partitioning</td></tr>
<tr><td>"Key-value", "single-digit millisecond at any scale", "serverless NoSQL"</td><td>DynamoDB</td></tr>
<tr><td>"Graph", "relationships", "social network", "fraud rings"</td><td>Neptune</td></tr>
<tr><td>"MongoDB-compatible"</td><td>DocumentDB</td></tr>
<tr><td>"Cassandra-compatible"</td><td>Keyspaces</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong></p>
<ul>
  <li><strong>EBS for shared storage:</strong> EBS attaches to one instance in one AZ. Multi-Attach is the rare exception and is limited to one AZ and io1/io2.</li>
  <li><strong>EFS for Windows:</strong> EFS is NFS for Linux. Windows shares mean FSx for Windows File Server.</li>
  <li><strong>S3 as a mounted disk for a database:</strong> S3 is object storage; databases need block storage. (Mountpoint for Amazon S3 exists for read-heavy file workloads, but it isn't a POSIX file system for databases.)</li>
  <li><strong>"Use a bigger RDS instance" for analytics:</strong> separate OLTP and OLAP instead (read replica for light reporting, Redshift or Athena for heavy analytics).</li>
  <li><strong>Instance store for anything that must survive a stop:</strong> its data is lost on stop and terminate.</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>The small-files problem.</strong> Millions of KB-sized objects make every analytics engine slow and add S3 request costs. Batch writes (Kinesis Data Firehose buffering, compaction jobs) to target files of roughly 128 MB to 1 GB.</li>
  <li><strong>Partition design is a contract.</strong> Partition by what queries filter on, at a granularity that yields reasonably large partitions. Partitioning by <code>user_id</code> creates millions of tiny partitions; partitioning by <code>hour</code> may be too fine for low-volume data. Partition projection in Athena avoids catalogue overhead for predictable patterns.</li>
  <li><strong>EBS is zonal.</strong> An instance in AZ b can't attach a volume from AZ a. Moving data between AZs means snapshots; designing for AZ failure means replication at the application or database layer (or a Regional service such as EFS, S3 or Aurora).</li>
  <li><strong>EFS cost surprises.</strong> EFS Standard costs several times more per GB than S3 Standard or EBS gp3. Use lifecycle management to IA/Archive tiers and keep bulk data in S3.</li>
  <li><strong>Durability is not availability, and neither is backup.</strong> S3's 11 nines protect against hardware loss, not against someone deleting objects: enable versioning, MFA delete or Object Lock, and AWS Backup for the rest.</li>
  <li><strong>Polyglot persistence has a cost.</strong> Each extra database engine means more skills, monitoring, backups and security reviews. Use purpose-built databases where the access pattern clearly justifies it, not for novelty.</li>
  <li><strong>Schema evolution.</strong> Adding columns to Parquet is easy; renaming or changing types breaks readers. Table formats such as Iceberg make evolution and updates safe on S3.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li><strong>Block</strong> = raw disk for one instance (EBS persistent and zonal; instance store fast but ephemeral). <strong>File</strong> = shared hierarchy over NFS/SMB (EFS for Linux, FSx for Windows, Lustre, ONTAP, OpenZFS). <strong>Object</strong> = flat bucket + key over HTTPS, massive scale (S3).</li>
  <li>Pick databases by <strong>data model and access pattern</strong>: relational (RDS/Aurora), key-value (DynamoDB), document (DocumentDB), wide-column (Keyspaces), graph (Neptune), time-series (Timestream), search (OpenSearch), in-memory (ElastiCache/MemoryDB).</li>
  <li><strong>OLTP</strong>: many small transactions, row stores. <strong>OLAP</strong>: big scans of few columns, columnar stores (Redshift, Athena, EMR). Keep them separate.</li>
  <li>Columnar formats (<strong>Parquet/ORC</strong>) read only needed columns, compress well and skip chunks using statistics.</li>
  <li><strong>Partitioning</strong> by common filters (usually date) lets engines skip whole prefixes.</li>
  <li>Athena bills per data scanned: <strong>columnar + compression + partitioning</strong> can cut cost and time by 100× or more.</li>
  <li>Match storage tier to data temperature with lifecycle rules (deep dive M18).</li>
</ul>` }
  ],
  drills: [
    { id: "M04.07-d1", q: "A 1 TB table has 50 columns of equal size. A query reads 2 columns. How many GB does a columnar, uncompressed format scan? (1 TB = 1,000 GB)", answers: ["40", "40gb"], hint: "Fraction of columns × total size.", explain: "1,000 GB × 2/50 = 40 GB." },
    { id: "M04.07-d2", q: "Athena charges $5 per TB scanned. What does a query that scans 40 GB cost, in dollars? (1 TB = 1,000 GB)", answers: ["0.2", "0.20", "$0.2", "$0.20"], explain: "40 GB = 0.04 TB; 0.04 × $5 = $0.20." },
    { id: "M04.07-d3", q: "A table holds 3.65 TB spread evenly across 365 daily partitions. How many GB does a query over the last 7 days scan (CSV, no column savings)?", answers: ["70", "70gb"], hint: "Size per day × days queried.", explain: "3,650 GB ÷ 365 = 10 GB per day; 7 × 10 GB = 70 GB." },
    { id: "M04.07-d4", q: "A 12 TB CSV dataset becomes 2.4 TB as Parquet with Snappy. What is the compression ratio? (format: N:1)", answers: ["5:1", "5"], explain: "12 ÷ 2.4 = 5, so 5:1." },
    { id: "M04.07-d5", q: "Which AWS storage loses its data when the EC2 instance is stopped? (two words)", answers: ["instance store", "instancestore", "ec2 instance store"], explain: "Instance store volumes live on the host; data survives a reboot but not a stop, hibernate, terminate or host failure." },
    { id: "M04.07-d6", q: "Which AWS service provides a shared NFS file system for many Linux instances across AZs?", answers: ["EFS", "Amazon EFS", "Elastic File System"], explain: "Amazon EFS: Regional, elastic NFS." },
    { id: "M04.07-d7", q: "Which AWS service is the answer for Windows file shares (SMB) integrated with Active Directory?", answers: ["FSx for Windows File Server", "FSx for Windows", "Amazon FSx for Windows File Server", "FSx Windows"], explain: "Amazon FSx for Windows File Server supports SMB, NTFS ACLs and AD." },
    { id: "M04.07-d8", q: "Which row-based binary file format with embedded, evolvable schemas is popular for streaming ingestion (Kafka)?", answers: ["Avro", "Apache Avro"], explain: "Avro is row-oriented and binary, with schema evolution support. Parquet and ORC are columnar." },
    { id: "M04.07-d9", q: "Which data model (one word) fits \"find accounts linked to a flagged account within 3 hops\"?", answers: ["graph"], explain: "Multi-hop relationship traversal is the graph model's strength (Amazon Neptune)." }
  ],
  check: [
    { id: "M04.07-k1", type: "single", domain: "D3", task: "3.1", level: 200,
      stem: "A content-management application runs on eight Amazon EC2 Linux instances across three Availability Zones. All instances must read and write the same uploaded files, and storage should grow automatically. Which storage option meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Amazon EFS file system mounted on all instances", c: true, why: "EFS is a Regional, elastic NFS file system that many Linux instances in multiple AZs can mount concurrently, with no capacity management." },
        { t: "An Amazon EBS gp3 volume attached to each instance, synchronised with rsync", c: false, why: "EBS volumes are per-instance and zonal. Synchronising them yourself adds overhead and risks conflicts." },
        { t: "An Amazon EBS io2 volume with Multi-Attach shared by all instances", c: false, why: "Multi-Attach works only within one AZ, for io1/io2, and requires a cluster-aware file system. It can't span three AZs." },
        { t: "Instance store volumes on each instance", c: false, why: "Instance store is local, not shared, and its data is lost when instances stop." }
      ] },
    { id: "M04.07-k2", type: "single", domain: "D4", task: "4.3", level: 200,
      stem: "A company stores 30 TB of application logs in Amazon S3 as uncompressed CSV and queries them with Amazon Athena. Most queries filter on a date range and use a few of the 60 columns. Which change will MOST reduce query cost?",
      options: [
        { t: "Convert the data to compressed Parquet, partitioned by date", c: true, why: "Partitioning prunes dates that aren't queried, the columnar format reads only the needed columns, and compression shrinks what remains. Athena bills per byte scanned." },
        { t: "Move the CSV files to S3 Standard-IA", c: false, why: "That lowers storage cost slightly but doesn't change the bytes Athena scans, and adds retrieval charges." },
        { t: "Load the data into a larger Amazon RDS instance and query it there", c: false, why: "RDS is an OLTP database; it would be expensive and slow for large scans and adds operational work." },
        { t: "Gzip each CSV file", c: false, why: "Compression helps, but gzipped CSV still has to be read in full (all columns, all dates) and can't be split for parallel reads." }
      ] },
    { id: "M04.07-k3", type: "multi", domain: "D3", task: "3.3", level: 200,
      stem: "Which TWO workloads are the best fit for a columnar data store such as Amazon Redshift or Parquet files queried by Athena?",
      options: [
        { t: "Monthly revenue by region and product over five years of sales", c: true, why: "Aggregates over many rows and few columns are the textbook OLAP workload." },
        { t: "Finding the 20 slowest API endpoints from a year of access logs", c: true, why: "A scan and aggregation over a large dataset using a few columns." },
        { t: "Updating one customer's shipping address during checkout", c: false, why: "Single-row read-modify-write is OLTP; use a row-oriented database such as Aurora or DynamoDB." },
        { t: "Storing user session state read on every request", c: false, why: "Key-based, low-latency access fits DynamoDB or ElastiCache, not a columnar warehouse." }
      ] },
    { id: "M04.07-k4", type: "single", domain: "D3", task: "3.1", level: 200,
      stem: "A research team runs ML training jobs on hundreds of instances that need hundreds of GB/s of throughput to a dataset stored in Amazon S3. The file system is needed only for the duration of each job. Which solution fits BEST?",
      options: [
        { t: "Amazon FSx for Lustre, scratch deployment, linked to the S3 bucket", c: true, why: "Lustre delivers massive parallel throughput, presents S3 objects as files, and scratch deployments are a cost-effective fit for temporary processing." },
        { t: "Amazon EFS in Max I/O mode", c: false, why: "EFS scales well for shared files, but Lustre is purpose-built for HPC-level throughput and S3 integration." },
        { t: "FSx for Windows File Server", c: false, why: "That's for SMB/Windows workloads, not Linux HPC." },
        { t: "An EBS io2 volume per instance with a copy of the dataset", c: false, why: "Copying the dataset to hundreds of volumes is slow, costly and operationally heavy." }
      ] },
    { id: "M04.07-k5", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "An application caches transcoded video segments on Amazon EC2 instance store volumes. The source videos are in Amazon S3. During maintenance an operator stops and starts the instances. What happens to the cached segments?",
      options: [
        { t: "They are lost, and the application must regenerate them from S3", c: true, why: "Instance store data doesn't survive a stop. That's acceptable here because the cache can be rebuilt from the durable source in S3." },
        { t: "They are preserved, because instance store survives stop and start", c: false, why: "Instance store survives a reboot, not a stop/start, which usually moves the instance to new hardware." },
        { t: "They are automatically snapshotted to S3", c: false, why: "Instance store has no snapshot feature; EBS does." },
        { t: "They are moved to an EBS volume", c: false, why: "AWS doesn't migrate instance store data." }
      ] },
    { id: "M04.07-k6", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "A social platform needs to recommend \"people you may know\" by exploring friends-of-friends relationships in real time. Which database is the BEST fit?",
      options: [
        { t: "Amazon Neptune", c: true, why: "A graph database is designed for fast multi-hop traversals of relationships." },
        { t: "Amazon Redshift", c: false, why: "A data warehouse is for analytical scans, not real-time traversal." },
        { t: "Amazon DynamoDB", c: false, why: "Key-value lookups don't express multi-hop traversals efficiently without heavy application logic." },
        { t: "Amazon ElastiCache for Memcached", c: false, why: "A simple cache with no relationship model." }
      ] }
  ],
  cards: ["fc-M04-7-01", "fc-M04-7-02", "fc-M04-7-03", "fc-M04-7-04", "fc-M04-7-05", "fc-M04-7-06", "fc-M04-7-07", "fc-M04-7-08", "fc-M04-7-09", "fc-M04-7-10", "fc-M04-7-11"],
  references: [
    "<em>System Design on AWS</em> ch.2 \"Data Storage Format\" (PDF p51 onward)",
    "Amazon EBS User Guide: <em>Amazon EBS volume types</em>; Amazon EC2 User Guide: <em>Instance store</em>",
    "Amazon EFS User Guide; Amazon FSx documentation: <em>Choosing an Amazon FSx file system</em>",
    "Amazon Athena User Guide: <em>Top performance tuning tips</em>, <em>Partitioning data</em>, <em>CTAS</em>",
    "AWS whitepaper: <em>Storage Best Practices for Data and Analytics Applications</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-7-01", front: "Block vs file vs object storage: how is data addressed?", back: "Block: device + block number. File: path in a hierarchy. Object: bucket + key in a flat namespace." },
  { id: "fc-M04-7-02", front: "EBS vs instance store?", back: "EBS: network-attached, persistent, zonal, snapshots. Instance store: local NVMe, fastest, lost on stop/terminate/host failure (survives reboot)." },
  { id: "fc-M04-7-03", front: "Which FSx for which need?", back: "Windows File Server: SMB + AD. Lustre: HPC/ML, S3-linked. NetApp ONTAP: NFS+SMB+iSCSI, NetApp migrations. OpenZFS: ZFS/NFS migrations, low latency." },
  { id: "fc-M04-7-04", front: "EFS in one line?", back: "Elastic, Regional (multi-AZ) NFS file system for many Linux clients; storage classes Standard/IA/Archive; One Zone option." },
  { id: "fc-M04-7-05", front: "Row vs columnar storage?", back: "Row: a record's fields together, best for OLTP point reads/updates. Columnar: a column's values together, best for OLAP scans of few columns; compresses well." },
  { id: "fc-M04-7-06", front: "Three levers to cut Athena cost?", back: "Columnar format (Parquet/ORC), compression (Snappy/ZSTD), partitioning by common filters. Also avoid tiny files and use workgroup scan limits." },
  { id: "fc-M04-7-07", front: "OLTP vs OLAP AWS services?", back: "OLTP: Aurora, RDS, DynamoDB. OLAP: Redshift, Athena, EMR." },
  { id: "fc-M04-7-08", front: "Purpose-built databases by model?", back: "Relational RDS/Aurora · key-value DynamoDB · document DocumentDB · wide-column Keyspaces · graph Neptune · time-series Timestream · search OpenSearch · in-memory ElastiCache/MemoryDB." },
  { id: "fc-M04-7-09", front: "What is partition pruning?", back: "The query engine skips whole partitions (S3 prefixes like day=2025-10-07) that can't match the WHERE clause, so they are never read or billed." },
  { id: "fc-M04-7-10", front: "Schema-on-write vs schema-on-read?", back: "Write: database validates against its schema on insert. Read: raw files stored as-is; schema applied at query time (Glue Data Catalog + Athena)." },
  { id: "fc-M04-7-11", front: "S3 object size limits?", back: "Up to 5 TB per object; a single PUT up to 5 GB; use multipart upload for large objects." }
);
// ================================================================== 08_architectures.js
/* ---------------------------------------------------------------- M04.08 Monolith → SOA → microservices */
var DG_0408_MONO = `
<figure>
<svg class="diagram" viewBox="0 0 760 316" role="img" aria-labelledby="m0408at m0408ad">
  <title id="m0408at">Monolith versus microservices</title>
  <desc id="m0408ad">Left: a monolith is one deployable unit containing catalog, cart, orders, payments, users and search modules that call each other in-process and share one database. Right: microservices sit behind an API gateway; catalog, orders and payments are separate services, each with its own data store and deployment, communicating through an event bus.</desc>
  <defs><marker id="m0408a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <text class="dg-tb" x="12" y="22">Monolith: one deployable unit</text>
  <rect class="dg-edge" x="12" y="36" width="330" height="190" rx="10"/>
  <text class="dg-ts" x="24" y="56">one process, one release, scaled as a whole</text>
  <rect class="dg-box" x="24" y="68" width="146" height="30" rx="6"/><text class="dg-t" x="36" y="88">Catalog</text>
  <rect class="dg-box" x="182" y="68" width="146" height="30" rx="6"/><text class="dg-t" x="194" y="88">Cart</text>
  <rect class="dg-box" x="24" y="106" width="146" height="30" rx="6"/><text class="dg-t" x="36" y="126">Orders</text>
  <rect class="dg-box" x="182" y="106" width="146" height="30" rx="6"/><text class="dg-t" x="194" y="126">Payments</text>
  <rect class="dg-box" x="24" y="144" width="146" height="30" rx="6"/><text class="dg-t" x="36" y="164">Users</text>
  <rect class="dg-box" x="182" y="144" width="146" height="30" rx="6"/><text class="dg-t" x="194" y="164">Search</text>
  <text class="dg-ts" x="24" y="200">in-process calls: fast, but one shared release</text>
  <path class="dg-line" d="M177 226 V244" marker-end="url(#m0408a-ar)"/>
  <rect class="dg-info" x="92" y="246" width="170" height="40" rx="8"/><text class="dg-t" x="108" y="271">One shared database</text>
  <text class="dg-ts" x="12" y="306">Change one module → retest and redeploy everything</text>

  <text class="dg-tb" x="400" y="22">Microservices: deployed independently</text>
  <rect class="dg-edge" x="400" y="36" width="348" height="30" rx="8"/><text class="dg-t" x="412" y="56">API gateway / load balancer</text>
  <path class="dg-line" d="M452 66 V88" marker-end="url(#m0408a-ar)"/>
  <path class="dg-line" d="M574 66 V88" marker-end="url(#m0408a-ar)"/>
  <path class="dg-line" d="M696 66 V88" marker-end="url(#m0408a-ar)"/>
  <rect class="dg-good" x="400" y="90" width="104" height="56" rx="8"/><text class="dg-t" x="410" y="110">Catalog</text><text class="dg-ts" x="410" y="126">own data store</text><text class="dg-ts" x="410" y="140">DynamoDB</text>
  <rect class="dg-good" x="522" y="90" width="104" height="56" rx="8"/><text class="dg-t" x="532" y="110">Orders</text><text class="dg-ts" x="532" y="126">own data store</text><text class="dg-ts" x="532" y="140">Aurora</text>
  <rect class="dg-good" x="644" y="90" width="104" height="56" rx="8"/><text class="dg-t" x="654" y="110">Payments</text><text class="dg-ts" x="654" y="126">own data store</text><text class="dg-ts" x="654" y="140">Aurora</text>
  <path class="dg-line" d="M452 146 V174" stroke-dasharray="4 3" marker-end="url(#m0408a-ar)"/>
  <path class="dg-line" d="M574 146 V174" stroke-dasharray="4 3" marker-end="url(#m0408a-ar)"/>
  <path class="dg-line" d="M696 146 V174" stroke-dasharray="4 3" marker-end="url(#m0408a-ar)"/>
  <rect class="dg-box" x="400" y="176" width="348" height="30" rx="8"/><text class="dg-t" x="412" y="196">Event bus (EventBridge or SNS + SQS)</text>
  <text class="dg-ts" x="400" y="228">Own code, data, pipeline and team per service</text>
  <text class="dg-ts" x="400" y="246">Trade-off: network calls, eventual consistency,</text>
  <text class="dg-ts" x="400" y="262">more moving parts to operate and observe</text>
</svg>
<figcaption>Figure M04-8a. The same shop as a monolith and as microservices. Microservices buy independent deployment and scaling, paid for with distributed-systems complexity.</figcaption>
</figure>`;

var DG_0408_STRANGLER = `
<figure>
<svg class="diagram" viewBox="0 0 760 252" role="img" aria-labelledby="m0408bt m0408bd">
  <title id="m0408bt">Strangler fig migration in three stages</title>
  <desc id="m0408bd">Stage 1: a facade such as an ALB or API Gateway is placed in front of the monolith and routes all traffic to it. Stage 2: one capability, orders, is rebuilt as a new service and the facade routes the orders path to it while everything else still goes to the monolith. Stage 3: after repeating this, the monolith is retired or reduced to a small core.</desc>
  <defs><marker id="m0408b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>

  <rect class="dg-az" x="12" y="12" width="236" height="226" rx="10"/>
  <text class="dg-tb" x="24" y="34">1 · Put a facade in front</text>
  <rect class="dg-box" x="80" y="46" width="100" height="24" rx="6"/><text class="dg-ts" x="110" y="62">Clients</text>
  <path class="dg-line" d="M130 70 V90" marker-end="url(#m0408b-ar)"/>
  <rect class="dg-edge" x="30" y="92" width="200" height="28" rx="6"/><text class="dg-ts" x="44" y="110">Facade (ALB or API Gateway)</text>
  <path class="dg-line" d="M130 120 V146" marker-end="url(#m0408b-ar)"/>
  <rect class="dg-info" x="24" y="148" width="212" height="40" rx="6"/><text class="dg-t" x="36" y="172">Monolith (all routes)</text>
  <text class="dg-ts" x="24" y="222">Same behaviour, new routing point</text>

  <rect class="dg-az" x="262" y="12" width="236" height="226" rx="10"/>
  <text class="dg-tb" x="274" y="34">2 · Extract one capability</text>
  <rect class="dg-box" x="330" y="46" width="100" height="24" rx="6"/><text class="dg-ts" x="360" y="62">Clients</text>
  <path class="dg-line" d="M380 70 V90" marker-end="url(#m0408b-ar)"/>
  <rect class="dg-edge" x="280" y="92" width="200" height="28" rx="6"/><text class="dg-ts" x="294" y="110">Facade (ALB or API Gateway)</text>
  <path class="dg-line" d="M330 120 V146" marker-end="url(#m0408b-ar)"/>
  <path class="dg-line" d="M440 120 V146" marker-end="url(#m0408b-ar)"/>
  <rect class="dg-info" x="274" y="148" width="116" height="40" rx="6"/><text class="dg-t" x="286" y="172">Monolith</text>
  <rect class="dg-good" x="398" y="148" width="88" height="40" rx="6"/><text class="dg-t" x="408" y="172">Orders</text>
  <text class="dg-ts" x="404" y="204">/orders/*</text>
  <text class="dg-ts" x="274" y="222">Route /orders/* to the new service</text>

  <rect class="dg-az" x="512" y="12" width="236" height="226" rx="10"/>
  <text class="dg-tb" x="524" y="34">3 · Repeat, then retire</text>
  <rect class="dg-box" x="580" y="46" width="100" height="24" rx="6"/><text class="dg-ts" x="610" y="62">Clients</text>
  <path class="dg-line" d="M630 70 V90" marker-end="url(#m0408b-ar)"/>
  <rect class="dg-edge" x="530" y="92" width="200" height="28" rx="6"/><text class="dg-ts" x="544" y="110">Facade (ALB or API Gateway)</text>
  <path class="dg-line" d="M560 120 V146" marker-end="url(#m0408b-ar)"/>
  <path class="dg-line" d="M630 120 V146" marker-end="url(#m0408b-ar)"/>
  <path class="dg-line" d="M700 120 V146" marker-end="url(#m0408b-ar)"/>
  <rect class="dg-good" x="524" y="148" width="66" height="40" rx="6"/><text class="dg-ts" x="532" y="172">Orders</text>
  <rect class="dg-good" x="597" y="148" width="66" height="40" rx="6"/><text class="dg-ts" x="605" y="172">Catalog</text>
  <rect class="dg-good" x="670" y="148" width="66" height="40" rx="6"/><text class="dg-ts" x="678" y="172">Users</text>
  <text class="dg-ts" x="524" y="222">Monolith retired, or a small core</text>
</svg>
<figcaption>Figure M04-8b. The strangler fig pattern: the new system grows around the old one, one route at a time, and every step is reversible by changing the routing rule.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.08", title: "Monolith → SOA → microservices", level: 200, minutes: 55,
  objectives: [
    "Describe 1-, 2-, 3- and n-tier architectures and map the classic 3-tier web application onto AWS",
    "Compare monoliths, modular monoliths, SOA and microservices, and decide when microservices are (and aren't) justified",
    "Explain coupling, cohesion, bounded contexts and database-per-service, and spot a distributed monolith",
    "Choose between synchronous and asynchronous communication, and between SQS, SNS, EventBridge and Step Functions",
    "Plan an incremental migration with the strangler fig pattern"
  ],
  sections: [
    { type: "why", html: `
<p>"Should we move to microservices?" is one of the most expensive questions a team can answer wrongly. Teams that split too early often build a <strong>distributed monolith</strong>: all the complexity of a distributed system (network failures, partial outages, eventual consistency, many pipelines) with none of the benefits, because every service still has to be released together. Teams that never split can end up with a codebase where a one-line change needs a full regression test and a weekend deployment.</p>
<p>The SAA-C03 exam tests the same ideas from the AWS side. Stems ask you to <strong>"decouple"</strong> components, make an application <strong>"loosely coupled"</strong>, <strong>"absorb traffic spikes"</strong>, <strong>"fan out"</strong> events to several consumers, or <strong>"orchestrate"</strong> multi-step workflows, and the answers are SQS, SNS, EventBridge, Step Functions, Lambda and containers. This lesson gives you the architectural reasoning behind those answers.</p>` },

    { type: "concept", title: "Tiers: from one box to n-tier", html: DG_0408_MONO + `
<p>A <strong>tier</strong> is a physically separate layer of an application, running on its own servers and scaled on its own. (A <em>layer</em> is a logical separation inside the code; tiers are layers that are also deployed separately.)</p>
<table>
<thead><tr><th>Architecture</th><th>What's separated</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>1-tier</strong></td><td>Nothing: UI, logic and data on one machine</td><td>A desktop app with a local database file</td></tr>
<tr><td><strong>2-tier</strong> (client-server)</td><td>Client (UI + logic) and a database server</td><td>A desktop app talking directly to a SQL Server database</td></tr>
<tr><td><strong>3-tier</strong></td><td>Presentation, application (business logic), data</td><td>Browser → web/app servers → database</td></tr>
<tr><td><strong>n-tier</strong></td><td>Further tiers such as caching, search, messaging, analytics</td><td>Web → API → cache → database, plus queue workers and a search cluster</td></tr>
</tbody></table>
<h3>The classic 3-tier web application on AWS</h3>
<ul>
  <li><strong>Presentation:</strong> Amazon CloudFront (and S3 for static assets) in front of an <strong>Application Load Balancer</strong> in public subnets.</li>
  <li><strong>Application:</strong> EC2 instances in an <strong>Auto Scaling group</strong> (or ECS/Fargate tasks) in private subnets across at least two AZs. Stateless, with sessions in ElastiCache or DynamoDB.</li>
  <li><strong>Data:</strong> <strong>Amazon RDS or Aurora Multi-AZ</strong> in isolated subnets, often with ElastiCache in front for reads.</li>
  <li><strong>Security groups chained</strong> tier to tier: ALB-sg → app-sg → db-sg (you saw this in M02.06).</li>
</ul>
<p>This pattern is the backbone of countless exam scenarios. Most improvements to it are about <em>removing coupling between its parts</em>, which leads to the architectural styles below.</p>` },

    { type: "concept", title: "Monolith, SOA and microservices", html: `
<h3>The monolith</h3>
<p>A <strong>monolith</strong> is an application built and deployed as <strong>one unit</strong>: one codebase, one build artefact, one process (replicated for scale), usually one database. That's not automatically bad. Monoliths are simple to develop, test, deploy and debug: function calls are fast and reliable, and transactions are local.</p>
<p>Problems appear as the system and the organisation grow:</p>
<ul>
  <li><strong>Release coupling:</strong> a small change requires rebuilding, retesting and redeploying everything; teams queue for release slots.</li>
  <li><strong>Scaling coupling:</strong> the whole application scales together, even if only search is busy.</li>
  <li><strong>Blast radius:</strong> a memory leak in one module crashes the process for every feature.</li>
  <li><strong>Technology lock-in:</strong> one language, one framework version, one database for every need.</li>
</ul>
<div class="callout tip"><strong>The modular monolith.</strong> A monolith with strict internal boundaries (separate modules with explicit interfaces and no reaching into each other's tables) keeps the simplicity of one deployment while preparing clean seams for later extraction. For many teams it's the right starting point.</div>
<h3>Service-oriented architecture (SOA)</h3>
<p><strong>SOA</strong> (popular in the 2000s) split enterprise systems into reusable services that communicated over a network, often through an <strong>enterprise service bus (ESB)</strong> that handled routing, transformation and orchestration, with SOAP/XML contracts. SOA delivered reuse but often concentrated logic and change control in the central bus and shared enterprise data models, which became a new bottleneck.</p>
<h3>Microservices</h3>
<p><strong>Microservices</strong> are small, independently deployable services, each owning one business capability and its data, communicating over lightweight protocols (HTTP/gRPC APIs, events). Compared with SOA, the intelligence lives in the services ("smart endpoints, dumb pipes"), not in a central bus.</p>
<table>
<thead><tr><th>Characteristic</th><th>What it means in practice</th></tr></thead>
<tbody>
<tr><td>Independently deployable</td><td>A service can be released without coordinating with others. This is the defining test.</td></tr>
<tr><td>Owns its data</td><td><strong>Database per service</strong>: other services use its API or events, never its tables.</td></tr>
<tr><td>Organised around business capabilities</td><td>"Orders", "Payments", not "UI layer" and "DB layer".</td></tr>
<tr><td>Owned by one team</td><td>"You build it, you run it": the team operates what it ships.</td></tr>
<tr><td>Decentralised technology choices</td><td>Each service may choose its runtime and data store (within platform guardrails).</td></tr>
<tr><td>Designed for failure</td><td>Timeouts, retries with backoff, circuit breakers, graceful degradation.</td></tr>
</tbody></table>
<h3>Finding service boundaries: domain-driven design</h3>
<p><strong>Domain-driven design (DDD)</strong> provides the vocabulary. A <strong>bounded context</strong> is a part of the business where a model and its language are consistent. "Customer" means something different to Billing (payment methods, invoices) and to Shipping (addresses, delivery windows). Each bounded context is a candidate service. Good boundaries have <strong>high cohesion</strong> (things that change together live together) and <strong>low coupling</strong> (services rarely need to change together).</p>
<p><strong>Conway's law</strong> says that systems end up mirroring the communication structure of the organisations that build them. Architects use it deliberately (the "inverse Conway manoeuvre"): shape teams around the service boundaries you want.</p>
<h3>Types of coupling</h3>
<table>
<thead><tr><th>Coupling</th><th>Symptom</th><th>Remedy</th></tr></thead>
<tbody>
<tr><td><strong>Deployment</strong></td><td>Services must be released together</td><td>Versioned, backward-compatible contracts</td></tr>
<tr><td><strong>Temporal</strong></td><td>A service fails if another is down right now</td><td>Asynchronous messaging, queues, caching</td></tr>
<tr><td><strong>Data</strong></td><td>Services read or write each other's tables</td><td>Database per service; publish events or expose APIs</td></tr>
<tr><td><strong>Location</strong></td><td>Hard-coded hostnames and IPs</td><td>Service discovery, load balancers, DNS</td></tr>
<tr><td><strong>Semantic</strong></td><td>A change to a shared model ripples everywhere</td><td>Bounded contexts with their own models; translate at the boundary</td></tr>
</tbody></table>` },

    { type: "concept", title: "How services communicate", html: `
<h3>Synchronous vs asynchronous</h3>
<table>
<thead><tr><th></th><th>Synchronous (request/response)</th><th>Asynchronous (messages, events)</th></tr></thead>
<tbody>
<tr><td>Mechanism</td><td>REST/HTTP, gRPC; caller waits for a reply</td><td>Queues, topics, event buses, streams; sender doesn't wait</td></tr>
<tr><td>Coupling</td><td>Temporal: callee must be up now</td><td>Decoupled in time; consumer can be down or slow</td></tr>
<tr><td>Latency</td><td>Adds up along the call chain</td><td>Caller returns fast; work completes later</td></tr>
<tr><td>Failure behaviour</td><td>Failures propagate up the chain</td><td>Messages wait, retry, and land in a dead-letter queue if they keep failing</td></tr>
<tr><td>Consistency</td><td>Easier to reason about</td><td>Eventual consistency; must handle duplicates and ordering</td></tr>
<tr><td>Good for</td><td>Queries needing an immediate answer ("show product 42")</td><td>Commands and notifications ("order placed", "resize image")</td></tr>
</tbody></table>
<h3>Messaging patterns</h3>
<ul>
  <li><strong>Point-to-point queue:</strong> each message is processed by one consumer from a pool of workers. Buffers spikes and levels load. <em>Amazon SQS.</em></li>
  <li><strong>Publish/subscribe:</strong> one message is delivered to every subscriber. <em>Amazon SNS</em>, often with an SQS queue per subscriber ("fan-out").</li>
  <li><strong>Event bus with content-based routing:</strong> producers emit events; rules route them by content to many targets, including SaaS and other accounts. <em>Amazon EventBridge.</em></li>
  <li><strong>Event streaming:</strong> an ordered, replayable log consumed by many readers at their own pace. <em>Kinesis Data Streams, Amazon MSK (Kafka)</em> (M27).</li>
  <li><strong>Orchestration:</strong> a central workflow calls services in order, with retries and compensation. <em>AWS Step Functions</em> (M26).</li>
</ul>
<h3>Supporting infrastructure</h3>
<ul>
  <li><strong>API gateway:</strong> a single entry point that handles routing, authentication, throttling and request transformation for many services (Amazon API Gateway, or an ALB with path-based routing).</li>
  <li><strong>Service discovery:</strong> services find each other by name instead of hard-coded addresses (AWS Cloud Map, ECS Service Connect, Kubernetes DNS).</li>
  <li><strong>Service networking / mesh:</strong> consistent service-to-service connectivity, authentication, retries and observability (Amazon VPC Lattice; Istio on EKS). AWS has announced end of support for AWS App Mesh, so new designs use the alternatives.</li>
  <li><strong>Observability:</strong> distributed tracing (AWS X-Ray, OpenTelemetry), correlation IDs, centralised logs and metrics (M30).</li>
</ul>
<h3>Distributed data: the hard part</h3>
<p>With a database per service, one business transaction spanning services ("place order": reserve stock, charge card, create shipment) can't use a single ACID transaction. Common answers:</p>
<ul>
  <li><strong>Saga:</strong> a sequence of local transactions, each with a <em>compensating action</em> to undo it if a later step fails (refund the card, release the stock). <strong>Choreography</strong>: services react to each other's events. <strong>Orchestration</strong>: a coordinator such as Step Functions drives the steps.</li>
  <li><strong>Transactional outbox:</strong> write the business change and the event to publish in the <em>same</em> local transaction, then relay the event. This avoids "saved the order but lost the event".</li>
  <li><strong>Idempotent consumers:</strong> at-least-once delivery means duplicates happen. Consumers record processed message IDs (for example a DynamoDB conditional write) and ignore repeats.</li>
  <li><strong>Eventual consistency:</strong> other services see the change a little later. Design the user experience for it ("Order received, confirmation email on its way").</li>
</ul>
<p>These patterns are covered in depth in M40.</p>` },

    { type: "workflow", title: "Placing an order: synchronous chain vs event-driven, and a strangler fig migration", html: `
<h3>Version A: synchronous call chain</h3>
<ol class="flow">
  <li>The client calls <strong>Orders</strong> (<code>POST /orders</code>).</li>
  <li>Orders calls <strong>Inventory</strong> to reserve stock and waits.</li>
  <li>Orders calls <strong>Payments</strong> to charge the card and waits.</li>
  <li>Orders calls <strong>Shipping</strong> to create a shipment and waits.</li>
  <li>Orders calls <strong>Notifications</strong> to send the confirmation email and waits.</li>
  <li>Only now does the client get <code>201 Created</code>. Latency is the <em>sum</em> of every call, and if any service is down or slow, the order fails, even though email has nothing to do with taking the customer's money.</li>
</ol>
<h3>Version B: event-driven</h3>
<ol class="flow">
  <li>The client calls <strong>Orders</strong>, which validates the request, reserves stock and authorises payment (the steps the customer must wait for), stores the order, and publishes <code>OrderPlaced</code> to <strong>EventBridge</strong> (through an outbox).</li>
  <li>The client immediately gets <code>202 Accepted</code> with an order ID.</li>
  <li>EventBridge rules route <code>OrderPlaced</code> to an <strong>SQS queue</strong> per consumer: Shipping, Notifications, Analytics.</li>
  <li>Each consumer processes at its own pace. If Notifications is down for 10 minutes, messages wait in its queue and are processed when it recovers.</li>
  <li>Messages that keep failing move to a <strong>dead-letter queue</strong> for investigation, without blocking others.</li>
  <li>Adding a new consumer (a loyalty-points service) means adding a rule and a queue, with <strong>no change to Orders</strong>.</li>
</ol>
<h3>Migrating with the strangler fig pattern</h3>
` + DG_0408_STRANGLER + `
<ol class="flow">
  <li><strong>Introduce a facade:</strong> put an ALB or API Gateway in front of the monolith. All routes still go to the monolith; nothing changes for users.</li>
  <li><strong>Pick the first capability:</strong> one with clear boundaries, high change rate or scaling needs, and limited data entanglement (often not the core of the core).</li>
  <li><strong>Build the new service</strong> with its own data store. Synchronise data during the transition (events from the monolith, or change data capture).</li>
  <li><strong>Shift traffic gradually:</strong> route <code>/orders/*</code> (or a percentage, or one customer segment) to the new service. Keep the old path as a rollback.</li>
  <li><strong>Remove the old code</strong> from the monolith once the new service owns the capability fully.</li>
  <li><strong>Repeat</strong> until the monolith is gone or reduced to a small core that isn't worth extracting.</li>
</ol>` },

    { type: "aws", html: `
<table>
<thead><tr><th>Need</th><th>AWS services</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Run services</td><td>Amazon ECS / EKS (on EC2 or Fargate), AWS Lambda, AWS App Runner</td><td>Fargate and Lambda remove server management; EKS for Kubernetes standardisation (M15, M16)</td></tr>
<tr><td>Single entry point</td><td>Amazon API Gateway, Application Load Balancer</td><td>API Gateway: auth, throttling, usage plans; ALB: path/host routing to target groups</td></tr>
<tr><td>Queue (decouple, buffer, level load)</td><td>Amazon SQS (Standard, FIFO)</td><td>Standard: nearly unlimited throughput, at-least-once, best-effort order. FIFO: ordering within a message group and deduplication</td></tr>
<tr><td>Pub/sub fan-out</td><td>Amazon SNS (+ SQS subscribers)</td><td>One publish, many deliveries; message filtering per subscription</td></tr>
<tr><td>Event bus</td><td>Amazon EventBridge</td><td>Content-based rules, schema registry, archive and replay, cross-account buses, SaaS sources, Pipes and Scheduler</td></tr>
<tr><td>Workflow orchestration and sagas</td><td>AWS Step Functions</td><td>Visual state machines, retries, catch/compensate, wait for callbacks (M26)</td></tr>
<tr><td>Streaming</td><td>Kinesis Data Streams, Amazon MSK</td><td>Ordered, replayable streams for high-volume events (M27)</td></tr>
<tr><td>Service discovery and networking</td><td>AWS Cloud Map, ECS Service Connect, Amazon VPC Lattice</td><td>Lattice connects services across VPCs and accounts with IAM auth</td></tr>
<tr><td>Per-service data</td><td>DynamoDB, Aurora, RDS, ElastiCache, OpenSearch</td><td>Choose per access pattern (M04.07, M21, M22, M23)</td></tr>
<tr><td>Observability</td><td>AWS X-Ray, CloudWatch (Logs, metrics, Application Signals), OpenTelemetry</td><td>Trace one request across services (M30)</td></tr>
</tbody></table>` },

    { type: "examples", html: `
<h3>Worked example 1: availability of a synchronous chain</h3>
<p>An order request passes synchronously through <strong>5 services</strong>, each available <strong>99.9%</strong> of the time (independently). The request succeeds only if all five are up:</p>
<pre><code>A = 0.999 × 0.999 × 0.999 × 0.999 × 0.999 = 0.999^5 ≈ 0.9950  →  99.50%</code></pre>
<p>99.5% allows about <strong>3.6 hours of failure per 30-day month</strong>, compared with 43 minutes for a single 99.9% service. Every synchronous dependency multiplies in. In the event-driven version, only Orders (and what it must call before replying) is on the critical path; the others are buffered by queues, so their outages delay work instead of failing orders.</p>
<h3>Worked example 2: latency of a synchronous chain</h3>
<p>Typical (p50) latencies: Orders 20 ms of its own work, Inventory 35 ms, Payments 15 ms, Shipping 30 ms, Notifications 25 ms. Called one after another, the user waits about 20 + 35 + 15 + 30 + 25 = <strong>125 ms</strong> plus network hops, and at p99 the tail latencies add up much worse. Calling independent services <em>in parallel</em> or moving them off the critical path (asynchronous) is how you cut it.</p>
<h3>Worked example 3: an EventBridge rule</h3>
<p>Route large orders to a fraud-review queue. Event pattern:</p>
<pre><code>{
  "source":      ["com.shop.orders"],
  "detail-type": ["OrderPlaced"],
  "detail": {
    "total":    [{ "numeric": ["&gt;", 500] }],
    "currency": ["EUR", "USD"]
  }
}</code></pre>
<p>The Orders service publishes once with <code>aws events put-events</code> or the SDK. Every rule whose pattern matches gets a copy; the producer doesn't know or care who listens.</p>
<h3>Worked example 4: idempotent consumer with a DynamoDB conditional write</h3>
<pre><code>aws dynamodb put-item --table-name processed-messages \\
  --item '{"pk": {"S": "msg-7f3a9c"}, "processedAt": {"S": "2025-10-07T10:15:00Z"}}' \\
  --condition-expression "attribute_not_exists(pk)"

# First delivery: succeeds (exit code 0), so do the work.
# Duplicate delivery of the same message:
# An error occurred (ConditionalCheckFailedException) when calling the PutItem
# operation: The conditional request failed      ← already processed, skip it</code></pre>
<h3>Worked example 5: a saga orchestrated by Step Functions (simplified)</h3>
<pre><code>{
  "StartAt": "ReserveStock",
  "States": {
    "ReserveStock":  { "Type": "Task", "Resource": "arn:aws:states:::lambda:invoke",
                       "Parameters": { "FunctionName": "reserve-stock", "Payload.$": "$" },
                       "Next": "ChargeCard" },
    "ChargeCard":    { "Type": "Task", "Resource": "arn:aws:states:::lambda:invoke",
                       "Parameters": { "FunctionName": "charge-card", "Payload.$": "$" },
                       "Retry": [{ "ErrorEquals": ["States.TaskFailed"], "MaxAttempts": 2, "BackoffRate": 2 }],
                       "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "ReleaseStock" }],
                       "Next": "OrderConfirmed" },
    "ReleaseStock":  { "Type": "Task", "Resource": "arn:aws:states:::lambda:invoke",
                       "Parameters": { "FunctionName": "release-stock", "Payload.$": "$" },
                       "Next": "OrderFailed" },
    "OrderConfirmed": { "Type": "Succeed" },
    "OrderFailed":    { "Type": "Fail", "Error": "PaymentFailed" }
  }
}</code></pre>
<p>If charging the card still fails after retries, the <code>Catch</code> runs the <strong>compensating action</strong> (release the stock) before ending in a failed state.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Choice</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Start-up with 4 engineers validating a product</td><td>Modular monolith on Elastic Beanstalk, App Runner or ECS</td><td>Speed of change matters most; distributed complexity would slow the team down</td></tr>
<tr><td>Enterprise with 30 teams blocked by one release train</td><td>Microservices along bounded contexts, extracted with the strangler fig pattern</td><td>Independent deployment removes the coordination bottleneck</td></tr>
<tr><td>Image uploads need thumbnails, virus scanning and indexing</td><td>S3 event → EventBridge/SNS → SQS queues → Lambda consumers</td><td>Fan-out to independent workers; each scales and fails separately</td></tr>
<tr><td>Order intake must survive flash-sale spikes 20× normal</td><td>API accepts and enqueues to SQS; workers drain the queue</td><td>The queue absorbs the spike; back-end capacity can stay modest</td></tr>
<tr><td>Loan application with 8 steps, human approval and compensation on rejection</td><td>Step Functions orchestration</td><td>Explicit state, retries, timeouts, callbacks and an audit trail</td></tr>
<tr><td>Strict processing order per customer account</td><td>SQS FIFO with message group ID = account ID (or Kinesis with partition key)</td><td>Ordering within a group while still parallel across groups</td></tr>
<tr><td>Integrating SaaS events (Zendesk, Shopify) and many internal consumers</td><td>EventBridge with partner event sources and rules</td><td>Managed integration and content-based routing without custom glue</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: build an SNS → SQS fan-out with the CLI", html: `
<p>Run in AWS CloudShell or any shell with the <code>academy-admin</code> profile. Everything here is within the Free Tier for this volume; clean up at the end.</p>
<pre><code>export AWS_PROFILE=academy-admin
TOPIC_ARN=$(aws sns create-topic --name m04-orders --query TopicArn --output text)

for Q in billing shipping; do
  URL=$(aws sqs create-queue --queue-name m04-$Q --query QueueUrl --output text)
  ARN=$(aws sqs get-queue-attributes --queue-url "$URL" --attribute-names QueueArn \\
        --query Attributes.QueueArn --output text)

  # Queue policy: allow only this topic to send to this queue
  python3 - "$TOPIC_ARN" "$ARN" &gt; attrs.json &lt;&lt;'PY'
import json, sys
topic, queue = sys.argv[1:]
policy = {"Version": "2012-10-17", "Statement": [{
    "Effect": "Allow", "Principal": {"Service": "sns.amazonaws.com"},
    "Action": "sqs:SendMessage", "Resource": queue,
    "Condition": {"ArnEquals": {"aws:SourceArn": topic}}}]}
print(json.dumps({"Policy": json.dumps(policy)}))
PY
  aws sqs set-queue-attributes --queue-url "$URL" --attributes file://attrs.json
  aws sns subscribe --topic-arn "$TOPIC_ARN" --protocol sqs \\
      --notification-endpoint "$ARN" --attributes RawMessageDelivery=true
done

# Publish ONE message
aws sns publish --topic-arn "$TOPIC_ARN" --message '{"orderId":"42","total":99.5}'

# Each queue received its own copy
for Q in billing shipping; do
  URL=$(aws sqs get-queue-url --queue-name m04-$Q --query QueueUrl --output text)
  echo "== $Q"; aws sqs receive-message --queue-url "$URL" --wait-time-seconds 5 \\
      --query 'Messages[0].Body' --output text
done</code></pre>
<p>Expected output:</p>
<pre><code>== billing
{"orderId":"42","total":99.5}
== shipping
{"orderId":"42","total":99.5}</code></pre>
<p><strong>What to notice:</strong> the publisher made one call and knows nothing about the consumers. Stop "consuming" one queue (don't receive from it) and publish again: its messages simply wait, which is temporal decoupling in action.</p>
<p><strong>Clean up:</strong></p>
<pre><code>for Q in billing shipping; do
  aws sqs delete-queue --queue-url "$(aws sqs get-queue-url --queue-name m04-$Q --query QueueUrl --output text)"
done
aws sns delete-topic --topic-arn "$TOPIC_ARN"
rm -f attrs.json</code></pre>` },

    { type: "casestudy", title: "Case study: from monolith to services, and back from a distributed monolith", html: `
<p><strong>Company:</strong> Verdant Home, an online furniture retailer with a 9-year-old Java monolith on EC2 and one large Oracle-compatible database, now migrated to Aurora PostgreSQL. Eleven teams commit to the same repository.</p>
<p><strong>Problem:</strong> releases happen every three weeks after a two-day regression cycle. Black Friday traffic forces scaling the entire application, including the rarely used admin back office. A bug in PDF invoice generation once took down checkout.</p>
<p><strong>First attempt (what went wrong):</strong> the team split the code into 14 services in six months. But all services kept using the <strong>same database schema</strong>, the order flow became a chain of <strong>seven synchronous REST calls</strong>, and a shared "common" library forced coordinated releases. Availability dropped (each extra hop multiplied failure), latency doubled, and teams still had to release together. They had built a <strong>distributed monolith</strong>.</p>
<p><strong>Second attempt:</strong></p>
<ol>
  <li><strong>Boundaries from the business:</strong> event-storming workshops identified bounded contexts: Catalog, Cart, Ordering, Payments, Fulfilment, Customer. Services were merged back to six, one per team.</li>
  <li><strong>Strangler fig:</strong> an ALB facade routed paths gradually. Ordering was extracted first because it changed most often and had the clearest data boundary.</li>
  <li><strong>Data ownership:</strong> Ordering got its own Aurora cluster; other services received <code>OrderPlaced</code>, <code>OrderCancelled</code> and similar events through <strong>EventBridge</strong>, each consumer with its own SQS queue and DLQ. A transactional outbox guaranteed events weren't lost.</li>
  <li><strong>Only the essentials synchronous:</strong> checkout calls Payments synchronously (the customer must know the result) but everything else, including invoices and emails, happens asynchronously.</li>
  <li><strong>Platform guardrails:</strong> a shared CDK construct library (M37) gave every service the same pipeline, X-Ray tracing, alarms and least-privilege roles.</li>
</ol>
<table>
<thead><tr><th>Metric</th><th>Monolith</th><th>Distributed monolith</th><th>Event-driven services</th></tr></thead>
<tbody>
<tr><td>Deployments per week</td><td>0.3</td><td>1 (coordinated)</td><td>40+ (independent)</td></tr>
<tr><td>Checkout p99 latency</td><td>900 ms</td><td>1,900 ms</td><td>650 ms</td></tr>
<tr><td>Checkout failures caused by non-critical features</td><td>Yes (shared process)</td><td>Yes (sync chain)</td><td>No (queued)</td></tr>
</tbody></table>
<p><strong>Lessons learned:</strong> microservices are an organisational scaling tool first. Without independent data and asynchronous integration, splitting code only adds network hops. Start from business boundaries, migrate incrementally, keep the critical path short, and invest in a platform so each new service doesn't reinvent pipelines and observability.</p>` },

    { type: "exam", html: `
<table>
<thead><tr><th>Keywords in the stem</th><th>Likely answer</th></tr></thead>
<tbody>
<tr><td>"Decouple", "loosely coupled", "buffer requests", "absorb spikes", "process asynchronously"</td><td>Amazon SQS between the tiers</td></tr>
<tr><td>"Same message to multiple systems", "fan-out"</td><td>SNS topic with SQS queues subscribed (or EventBridge)</td></tr>
<tr><td>"Route events by content", "SaaS integration", "many targets", "event bus", "cross-account events"</td><td>Amazon EventBridge</td></tr>
<tr><td>"Coordinate multiple steps", "retries and error handling", "human approval", "visual workflow"</td><td>AWS Step Functions</td></tr>
<tr><td>"Messages must be processed in order, exactly once"</td><td>SQS FIFO (message groups, deduplication)</td></tr>
<tr><td>"Reduce operational overhead" for services</td><td>Lambda, Fargate, App Runner, managed messaging</td></tr>
<tr><td>"Migrate gradually from a monolith with minimal risk"</td><td>Strangler fig: facade (ALB/API Gateway) routing to new services</td></tr>
<tr><td>"Messages that repeatedly fail processing"</td><td>Dead-letter queue (DLQ)</td></tr>
<tr><td>"Scale components independently"</td><td>Split tiers/services; separate Auto Scaling groups or services; queue-based scaling</td></tr>
</tbody></table>
<p><strong>Common distractors:</strong></p>
<ul>
  <li><strong>"Increase the instance size"</strong> when the stem says requests are lost during spikes: the decoupling answer (SQS) is usually right.</li>
  <li><strong>SNS alone for durable processing:</strong> SNS pushes and doesn't store messages for later consumption; put SQS behind it.</li>
  <li><strong>Kinesis when no ordering or replay is required:</strong> SQS is simpler and cheaper for work queues.</li>
  <li><strong>Direct synchronous calls between tiers</strong> in a "loosely coupled" scenario.</li>
</ul>
<table>
<thead><tr><th>Service</th><th>Model</th><th>Consumers per message</th><th>Persistence</th></tr></thead>
<tbody>
<tr><td>SQS</td><td>Queue (pull)</td><td>One</td><td>Up to 14 days</td></tr>
<tr><td>SNS</td><td>Pub/sub (push)</td><td>All subscribers</td><td>No (delivery with retries)</td></tr>
<tr><td>EventBridge</td><td>Event bus with rules (push)</td><td>All matching rules' targets</td><td>Optional archive and replay</td></tr>
<tr><td>Kinesis Data Streams</td><td>Stream (pull, ordered per shard)</td><td>Many independent readers</td><td>24 hours by default, extendable</td></tr>
</tbody></table>` },

    { type: "architect", html: `
<ul>
  <li><strong>Smells of a distributed monolith:</strong> services sharing a database; releases that must be coordinated; long synchronous call chains; a "common" library everyone must upgrade together; one team owning many services or many teams sharing one.</li>
  <li><strong>Start with a modular monolith</strong> unless you have clear reasons (team scale, very different scaling or compliance needs per part). Extract services when the seams are proven.</li>
  <li><strong>Keep the critical path short and synchronous only where needed.</strong> Everything else becomes events.</li>
  <li><strong>Contracts are products.</strong> Version APIs and event schemas, make changes backward compatible, use a schema registry (EventBridge has one), and test consumers against contracts.</li>
  <li><strong>Every network call needs a timeout, retry with exponential backoff and jitter, and a fallback.</strong> Retries without idempotency create duplicates; retries without backoff create retry storms.</li>
  <li><strong>Observability before decomposition.</strong> Without tracing and correlation IDs you can't debug a request that crosses 8 services.</li>
  <li><strong>Cost:</strong> many small services each with a load balancer, NAT path, minimum task count and database can cost far more than the monolith. Share platform components, use serverless for spiky services, and right-size.</li>
  <li><strong>Cell-based architecture</strong> (M40): at large scale, run multiple independent copies ("cells") of the whole stack, each serving a subset of customers, to limit blast radius.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li><strong>Tiers</strong> separate presentation, logic and data; the 3-tier AWS pattern is CloudFront/ALB → Auto Scaling app tier → RDS/Aurora Multi-AZ.</li>
  <li>A <strong>monolith</strong> is simple but couples releases, scaling and failures; a <strong>modular monolith</strong> is often the best start.</li>
  <li><strong>SOA</strong> centralised logic in an ESB; <strong>microservices</strong> are independently deployable, own their data and are aligned to business capabilities.</li>
  <li>Find boundaries with <strong>DDD bounded contexts</strong>; aim for high cohesion and low coupling; remember <strong>Conway's law</strong>.</li>
  <li>Synchronous chains multiply failure (0.999^5 ≈ 99.5%) and add latency; <strong>asynchronous messaging</strong> decouples in time.</li>
  <li>AWS mapping: SQS (queue), SNS (fan-out), EventBridge (content-routed event bus), Step Functions (orchestration/sagas), Kinesis/MSK (streams).</li>
  <li>Distributed data needs <strong>sagas, outbox, idempotent consumers</strong> and acceptance of eventual consistency.</li>
  <li>Migrate with the <strong>strangler fig</strong> pattern; beware the <strong>distributed monolith</strong>.</li>
</ul>` }
  ],
  drills: [
    { id: "M04.08-d1", q: "A request passes synchronously through 5 services, each 99.9% available (independent failures). What is the end-to-end availability, in percent, to 2 decimal places?", answers: ["99.50", "99.5", "99.50%", "99.5%"], hint: "Multiply: 0.999 to the power of 5.", explain: "0.999^5 ≈ 0.99501 → 99.50%." },
    { id: "M04.08-d2", q: "Services in a synchronous chain have p50 latencies of 20, 35, 15, 30 and 25 ms and are called one after another. Ignoring network time, what is the total p50 latency in ms?", answers: ["125", "125ms", "125 ms"], explain: "20 + 35 + 15 + 30 + 25 = 125 ms." },
    { id: "M04.08-d3", q: "One message is published to an SNS topic with 3 SQS queues subscribed (no filter policies). How many copies of the message are delivered in total?", answers: ["3", "three"], explain: "Pub/sub fan-out: every subscriber gets its own copy." },
    { id: "M04.08-d4", q: "Name the migration pattern that places a facade in front of a monolith and moves routes to new services one at a time.", answers: ["strangler fig", "strangler", "strangler fig pattern", "strangler pattern"], explain: "The strangler fig pattern, named after a vine that gradually envelops its host tree." },
    { id: "M04.08-d5", q: "Which \"law\" says that systems mirror the communication structure of the organisation that builds them?", answers: ["Conway's law", "conways law", "conway", "conway's", "conways"], explain: "Conway's law (Melvin Conway, 1967)." },
    { id: "M04.08-d6", q: "A saga in which a central coordinator such as AWS Step Functions calls each step is called (one word)...", answers: ["orchestration", "orchestrated"], explain: "Orchestration uses a coordinator. Choreography has services react to each other's events with no central coordinator." },
    { id: "M04.08-d7", q: "What is the maximum message retention period of an Amazon SQS queue, in days?", answers: ["14", "14 days", "14days"], explain: "Configurable from 1 minute to 14 days; the default is 4 days." }
  ],
  check: [
    { id: "M04.08-k1", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "An order-processing web tier sends orders directly to a processing tier on EC2. During flash sales the processing tier can't keep up and orders are lost. The company wants to stop losing orders with the LEAST change to the processing code. What should a solutions architect do?",
      options: [
        { t: "Put an Amazon SQS queue between the tiers and have the processing tier poll it, scaling on queue depth", c: true, why: "The queue durably buffers orders during spikes and decouples the tiers; workers process at their own pace and can auto scale on ApproximateNumberOfMessagesVisible." },
        { t: "Increase the processing instances to a larger instance type", c: false, why: "Still coupled: a bigger spike will overwhelm it again, and you pay for peak capacity all the time." },
        { t: "Publish orders to an Amazon SNS topic that the processing tier subscribes to over HTTP", c: false, why: "SNS pushes to subscribers but doesn't hold messages until a busy consumer is ready; it doesn't buffer load the way a queue does." },
        { t: "Use a Network Load Balancer in front of the processing tier", c: false, why: "A load balancer spreads requests but doesn't buffer them; overloaded targets still fail requests." }
      ] },
    { id: "M04.08-k2", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "When an order is placed, the billing, shipping and analytics systems must each receive the order event and process it independently, even if one of them is temporarily unavailable. Which design meets these requirements?",
      options: [
        { t: "Publish to an Amazon SNS topic with a separate Amazon SQS queue subscribed for each system", c: true, why: "SNS fans the event out; each SQS queue stores its copy until that system processes it, so one consumer's outage doesn't affect the others." },
        { t: "Send the event to a single SQS queue that all three systems poll", c: false, why: "Each message would be consumed by only one of the systems, not all three." },
        { t: "Have the order service call each system's API synchronously", c: false, why: "Tight temporal coupling: if one system is down, the order flow fails or the event is lost." },
        { t: "Write the event to an S3 bucket and have the systems list the bucket every minute", c: false, why: "Polling S3 is inefficient, adds latency and gives no per-consumer delivery tracking." }
      ] },
    { id: "M04.08-k3", type: "multi", domain: "D2", task: "2.1", level: 300,
      stem: "A team split its monolith into 12 services. They now must release all services together, and an outage in the email service makes checkout fail. Which TWO changes address the root causes?",
      options: [
        { t: "Give each service its own data store and integrate through APIs or events instead of shared tables", c: true, why: "Shared databases create data coupling, which forces coordinated releases." },
        { t: "Make non-critical steps such as email asynchronous through a queue or event bus", c: true, why: "Removes temporal coupling: checkout no longer depends on the email service being up." },
        { t: "Merge the services back into the monolith's shared library to reuse code", c: false, why: "A shared library that everyone must upgrade together increases deployment coupling." },
        { t: "Add more instances of every service", c: false, why: "Capacity doesn't fix coupling; failures in the email service still propagate synchronously." }
      ] },
    { id: "M04.08-k4", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A loan-approval process has eight steps, including calls to external credit agencies, a human approval that can take days, and compensation steps if the loan is rejected after funds are reserved. Which AWS service is the BEST fit to coordinate it?",
      options: [
        { t: "AWS Step Functions", c: true, why: "Orchestration with explicit state, retries, error catching, long waits with callback tokens and compensating steps." },
        { t: "Amazon SQS", c: false, why: "A queue moves messages between components but doesn't track a multi-step workflow's state." },
        { t: "Amazon SNS", c: false, why: "Pub/sub notifications have no workflow state or compensation." },
        { t: "A cron job on EC2 that checks a database table", c: false, why: "Possible, but you'd build and operate the orchestration yourself; not the least operational overhead." }
      ] },
    { id: "M04.08-k5", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "A company wants to move from a monolithic application to microservices gradually, keeping the ability to roll back each step and without a big-bang cutover. Which approach should a solutions architect recommend?",
      options: [
        { t: "Place an Application Load Balancer or API Gateway in front of the monolith and use routing rules to send specific paths to new services as they are built", c: true, why: "That's the strangler fig pattern: incremental, low risk, and each step is reversible by changing the routing rule." },
        { t: "Rewrite the whole application as microservices and switch DNS on a chosen weekend", c: false, why: "A big-bang rewrite is high risk and delays all value to the end." },
        { t: "Move the monolith to a larger EC2 instance first", c: false, why: "That doesn't move towards microservices at all." },
        { t: "Split the database into many schemas but keep the monolith code unchanged", c: false, why: "Splitting data without service boundaries creates complexity without independence." }
      ] },
    { id: "M04.08-k6", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A payment service consumes messages from an Amazon SQS standard queue. Occasionally a customer is charged twice because the same message is delivered more than once. What is the MOST appropriate fix?",
      options: [
        { t: "Make the consumer idempotent, for example by recording processed message IDs with a DynamoDB conditional write and skipping duplicates", c: true, why: "SQS standard queues deliver at least once; idempotent processing makes duplicates harmless." },
        { t: "Increase the visibility timeout to 12 hours", c: false, why: "A longer timeout can reduce redelivery when processing is slow but can't eliminate at-least-once duplicates, and it delays retries of failed messages." },
        { t: "Switch to an SNS topic", c: false, why: "SNS also delivers at least once and doesn't buffer for the consumer." },
        { t: "Reduce the number of consumers to one", c: false, why: "Duplicates can still occur with one consumer, and throughput suffers." }
      ] }
  ],
  cards: ["fc-M04-8-01", "fc-M04-8-02", "fc-M04-8-03", "fc-M04-8-04", "fc-M04-8-05", "fc-M04-8-06", "fc-M04-8-07", "fc-M04-8-08", "fc-M04-8-09", "fc-M04-8-10", "fc-M04-8-11"],
  references: [
    "<em>System Design on AWS</em> ch.1 (PDF p22–50): service architectures and communication",
    "AWS whitepaper: <em>Implementing Microservices on AWS</em>",
    "AWS Prescriptive Guidance: <em>Strangler fig pattern</em>, <em>Saga pattern</em>, <em>Transactional outbox pattern</em>",
    "Amazon SQS, SNS and EventBridge Developer Guides; AWS Step Functions Developer Guide",
    "Martin Fowler, \"Microservices\" and \"StranglerFigApplication\"; Eric Evans, <em>Domain-Driven Design</em>"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-8-01", front: "What defines a microservice?", back: "Independently deployable, owns its data, aligned to one business capability, owned by one team, communicates via APIs/events." },
  { id: "fc-M04-8-02", front: "What is a distributed monolith?", back: "Services that must be released together (shared database, shared libraries, long sync call chains): distributed complexity without independence." },
  { id: "fc-M04-8-03", front: "Modular monolith?", back: "One deployable unit with strict internal module boundaries and interfaces; simple to run, easy to split later." },
  { id: "fc-M04-8-04", front: "Bounded context?", back: "A DDD term: a part of the domain where one model and language are consistent. A natural service boundary." },
  { id: "fc-M04-8-05", front: "Conway's law?", back: "Systems mirror the communication structure of the organisation that builds them. Shape teams around the architecture you want." },
  { id: "fc-M04-8-06", front: "Availability of N services in a synchronous chain?", back: "Multiply them: e.g. 0.999^5 ≈ 99.5%. Each sync dependency lowers end-to-end availability." },
  { id: "fc-M04-8-07", front: "SQS vs SNS vs EventBridge?", back: "SQS: queue, one consumer per message, buffers. SNS: push pub/sub fan-out. EventBridge: event bus with content-based rules, SaaS/cross-account, archive/replay." },
  { id: "fc-M04-8-08", front: "Saga: choreography vs orchestration?", back: "Choreography: services react to each other's events. Orchestration: a coordinator (Step Functions) calls steps and runs compensations." },
  { id: "fc-M04-8-09", front: "Transactional outbox?", back: "Save the business change and the outgoing event in the same local transaction; a relay publishes the event. Prevents lost or phantom events." },
  { id: "fc-M04-8-10", front: "Why must consumers be idempotent?", back: "At-least-once delivery (SQS standard, SNS, EventBridge) means duplicates happen; processing the same message twice must have no extra effect." },
  { id: "fc-M04-8-11", front: "Strangler fig pattern?", back: "Put a facade (ALB/API Gateway) in front of the monolith and move routes to new services one at a time until the old system can be retired." }
);
// ================================================================== 09_tradeoffs.js
/* ================================================================== M04.09 Trade-off framework and ADRs */
var DG_0409_RADAR = `
<figure>
<svg class="diagram" viewBox="0 0 760 330" role="img" aria-labelledby="m0409at m0409ad">
  <title id="m0409at">Quality-attribute radar for two candidate designs</title>
  <desc id="m0409ad">A six-axis radar chart scoring two designs from 1 to 5 on cost efficiency, performance, reliability, security, low operational effort and time to market. The serverless design is stronger on operational effort and time to market; the self-managed EC2 design is stronger on raw performance. Neither design dominates on every axis.</desc>
  <polygon class="dg-box" points="230,55 333.9,115 333.9,235 230,295 126.1,235 126.1,115"/>
  <polygon class="dg-line" stroke-width="0.6" stroke-dasharray="2 3" fill="none" points="230,79 313.1,127 313.1,223 230,271 146.9,223 146.9,127"/>
  <polygon class="dg-line" stroke-width="0.6" stroke-dasharray="2 3" fill="none" points="230,103 292.4,139 292.4,211 230,247 167.6,211 167.6,139"/>
  <polygon class="dg-line" stroke-width="0.6" stroke-dasharray="2 3" fill="none" points="230,127 271.6,151 271.6,199 230,223 188.4,199 188.4,151"/>
  <polygon class="dg-line" stroke-width="0.6" stroke-dasharray="2 3" fill="none" points="230,151 250.8,163 250.8,187 230,199 209.2,187 209.2,163"/>
  <path class="dg-line" stroke-width="0.6" d="M230 175 L230 55 M230 175 L333.9 115 M230 175 L333.9 235 M230 175 L230 295 M230 175 L126.1 235 M230 175 L126.1 115"/>
  <polygon class="dg-link" fill="none" points="230,79 313.1,127 313.1,223 230,271 126.1,235 126.1,115"/>
  <polygon class="dg-line" stroke-width="2.5" stroke-dasharray="7 4" fill="none" points="230,103 333.9,115 292.4,211 230,271 188.4,199 188.4,151"/>
  <text class="dg-t" x="230" y="42" text-anchor="middle">Cost efficiency</text>
  <text class="dg-t" x="344" y="110">Performance</text>
  <text class="dg-t" x="344" y="246">Reliability</text>
  <text class="dg-t" x="230" y="316" text-anchor="middle">Security</text>
  <text class="dg-t" x="116" y="246" text-anchor="end">Low ops effort</text>
  <text class="dg-t" x="116" y="110" text-anchor="end">Time to market</text>
  <text class="dg-ts" x="236" y="172">1</text><text class="dg-ts" x="236" y="62">5</text>

  <rect class="dg-info" x="470" y="30" width="276" height="270" rx="10"/>
  <text class="dg-tb" x="484" y="54">Two designs, one workload</text>
  <path class="dg-link" d="M484 76 H514"/><text class="dg-t" x="522" y="80">A: Lambda + DynamoDB</text>
  <path class="dg-line" stroke-width="2.5" stroke-dasharray="7 4" d="M484 100 H514"/><text class="dg-t" x="522" y="104">B: self-managed on EC2</text>
  <text class="dg-ts" x="484" y="134">Score 1 (centre) to 5 (edge) per axis.</text>
  <text class="dg-ts" x="484" y="154">A wins on ops effort and time to market.</text>
  <text class="dg-ts" x="484" y="172">B wins on raw performance (tuned hosts).</text>
  <text class="dg-ts" x="484" y="190">Neither shape covers the other, so there</text>
  <text class="dg-ts" x="484" y="208">is no "best" design, only a best fit.</text>
  <text class="dg-ts" x="484" y="236">The business driver decides which axes</text>
  <text class="dg-ts" x="484" y="254">matter: weight them, then compare.</text>
  <text class="dg-ts" x="484" y="282">Scores are illustrative.</text>
</svg>
<figcaption>Figure M04-9a. A radar chart makes trade-offs visible: improving one axis usually costs another. The architect's job is to choose which axes matter for this workload and to say so explicitly.</figcaption>
</figure>`;

var DG_0409_ADR = `
<figure>
<svg class="diagram" viewBox="0 0 760 230" role="img" aria-labelledby="m0409bt m0409bd">
  <title id="m0409bt">The lifecycle of an Architecture Decision Record</title>
  <desc id="m0409bd">An ADR starts as Proposed. Review either accepts or rejects it. An accepted ADR can later be deprecated, when the decision no longer applies, or superseded by a newer ADR that replaces it. ADRs are never edited to change the decision; a new ADR is written instead.</desc>
  <defs><marker id="m0409b-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <rect class="dg-info" x="20" y="60" width="150" height="56" rx="8"/><text class="dg-tb" x="34" y="84">Proposed</text><text class="dg-ts" x="34" y="102">PR opened for review</text>
  <rect class="dg-good" x="270" y="60" width="150" height="56" rx="8"/><text class="dg-tb" x="284" y="84">Accepted</text><text class="dg-ts" x="284" y="102">merged; now binding</text>
  <rect class="dg-bad" x="270" y="160" width="150" height="56" rx="8"/><text class="dg-tb" x="284" y="184">Rejected</text><text class="dg-ts" x="284" y="202">kept, with the reasons</text>
  <rect class="dg-box" x="540" y="14" width="200" height="56" rx="8"/><text class="dg-tb" x="554" y="38">Deprecated</text><text class="dg-ts" x="554" y="56">no longer applies</text>
  <rect class="dg-edge" x="540" y="106" width="200" height="56" rx="8"/><text class="dg-tb" x="554" y="130">Superseded by 0012</text><text class="dg-ts" x="554" y="148">a newer ADR replaces it</text>
  <path class="dg-line" d="M170 88 H268" marker-end="url(#m0409b-ar)"/><text class="dg-ts" x="190" y="80">review</text>
  <path class="dg-line" d="M120 116 V188 H268" marker-end="url(#m0409b-ar)"/>
  <path class="dg-line" d="M420 80 L538 46" marker-end="url(#m0409b-ar)"/>
  <path class="dg-line" d="M420 98 L538 130" marker-end="url(#m0409b-ar)"/>
  <text class="dg-ts" x="450" y="200">Rule: never rewrite an accepted ADR.</text>
  <text class="dg-ts" x="450" y="216">Write a new one and link both ways.</text>
</svg>
<figcaption>Figure M04-9b. ADRs are an append-only log of decisions. The history of <em>why</em> is as valuable as the current state.</figcaption>
</figure>`;

LESSONS.push({
  id: "M04.09", title: "Trade-off framework and ADRs", level: 300, minutes: 55,
  objectives: [
    "Explain why every architecture is a set of trade-offs and name the main tension axes between quality attributes",
    "Score candidate designs with a weighted decision matrix and test how sensitive the result is to the weights",
    "Classify decisions as reversible (two-way door) or irreversible (one-way door) and set the effort to match",
    "Write an Architecture Decision Record (Nygard or MADR format) and manage its lifecycle in a repository",
    "Decode SAA-C03 questions as trade-off questions by mapping constraint keywords to the priority they encode"
  ],
  sections: [
    { type: "why", html: `
<p>Two senior engineers are arguing in a design review. One wants Amazon DynamoDB for a new orders service: "it scales to anything and there's nothing to patch." The other wants Amazon Aurora PostgreSQL: "our queries are relational, and the team knows SQL." Both are right. Neither is going to convince the other by repeating their point louder.</p>
<p>This is the normal state of architecture work. There is almost never a design that is best on every dimension: cheaper usually means less redundant, faster usually means more expensive or less consistent, more secure usually means more friction. What separates an architect from an opinionated engineer is a <strong>repeatable way to make the trade-off explicit</strong>: state the drivers, weigh the options against them, decide, and write down why so that the next person doesn't re-litigate it in six months.</p>
<p>It is also how the SAA-C03 exam works. Almost every question offers several answers that <em>work</em>. Only one fits the constraint in the stem: "MOST cost-effective", "LEAST operational overhead", "with minimal changes to the application". Every exam question is a trade-off question in disguise.</p>` },

    { type: "concept", title: "Concept: there is no best architecture, only the best fit", html: DG_0409_RADAR + `
<h3>Quality attributes pull against each other</h3>
<p>A <strong>quality attribute</strong> (also called a non-functional requirement, see M04.01) is a property of the whole system: availability, latency, throughput, cost, security, operability, time to market. Improving one almost always moves another. The table lists the tensions you will meet most often.</p>
<table>
<thead><tr><th>Tension</th><th>Why they conflict</th><th>Typical AWS example</th></tr></thead>
<tbody>
<tr><td><strong>Cost vs reliability</strong></td><td>Redundancy means paying for capacity you hope never to use</td><td>Single-AZ RDS vs Multi-AZ (roughly double the instance cost); pilot light vs active/active DR</td></tr>
<tr><td><strong>Cost vs performance</strong></td><td>Lower latency needs more or faster resources, caches or edge locations</td><td>Adding ElastiCache or DAX; Provisioned IOPS (io2) vs gp3; CloudFront in front of an origin</td></tr>
<tr><td><strong>Consistency vs latency/availability</strong></td><td>Coordinating replicas takes round trips; during a partition you must choose (M04.04)</td><td>DynamoDB strongly consistent reads cost twice the read capacity of eventually consistent reads; global tables replicate asynchronously by default</td></tr>
<tr><td><strong>Security vs usability/speed</strong></td><td>Every control adds friction or latency</td><td>Private subnets plus VPC endpoints instead of public access; KMS encryption adds API calls and cost</td></tr>
<tr><td><strong>Control vs operational effort</strong></td><td>The more you control, the more you operate</td><td>Self-managed Kafka on EC2 vs Amazon MSK vs Amazon Kinesis; EC2 vs Fargate vs Lambda</td></tr>
<tr><td><strong>Time to market vs long-term fit</strong></td><td>The quickest path today may not scale or may lock you in</td><td>Lambda and DynamoDB for an MVP vs a carefully tuned container platform</td></tr>
<tr><td><strong>Flexibility vs simplicity</strong></td><td>Generic, configurable systems are harder to understand and operate</td><td>Microservices vs a modular monolith (M04.08)</td></tr>
</tbody></table>

<h3>The Well-Architected pillars conflict too</h3>
<p>The six pillars of the AWS Well-Architected Framework (M01.06, M43) are not a checklist where you maximise every item. AWS itself describes trade-offs between pillars: you might accept lower <em>performance efficiency</em> to gain <em>cost optimisation</em>, or spend more (cost) for <em>reliability</em>. The framework's advice is to make these trade-offs <strong>deliberately and based on business context</strong>. In practice:</p>
<ol>
  <li><strong>Security and operational excellence are rarely traded down.</strong> Treat them as constraints, not dials. A regulated payment system doesn't "trade" encryption for speed.</li>
  <li><strong>Reliability, performance and cost are the usual dials.</strong> Set targets for them from the business (an SLO, a latency budget, a monthly cost ceiling), then optimise within those targets.</li>
  <li><strong>Sustainability</strong> usually moves with cost: right-sizing, managed services and higher utilisation reduce both.</li>
</ol>

<h3>Turn opinions into numbers</h3>
<p>Arguments become productive when each side has to quantify. "DynamoDB scales better" becomes "we expect 300 writes per second at peak; both options handle that with headroom, so scalability is not a differentiator here." "Aurora is expensive" becomes "Aurora Serverless v2 at our load is an estimated few hundred dollars a month, which is below the cost ceiling." Quantifying often reveals that half the criteria don't actually separate the options, and the decision collapses to two or three that do.</p>

<h3>Decision techniques</h3>
<table>
<thead><tr><th>Technique</th><th>What it is</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><strong>Weighted decision matrix</strong></td><td>Score each option 1–5 per criterion, multiply by a weight that reflects business priority, and sum</td><td>Three or more options, several criteria, stakeholders who disagree</td></tr>
<tr><td><strong>One-way vs two-way door</strong></td><td>Ask how expensive the decision is to undo</td><td>Always first: it tells you how much analysis the decision deserves</td></tr>
<tr><td><strong>Last responsible moment</strong></td><td>Delay an irreversible decision until waiting longer would remove a good option</td><td>Requirements are still uncertain and the decision is costly to reverse</td></tr>
<tr><td><strong>Spike or prototype</strong></td><td>A short, time-boxed experiment to replace an assumption with data</td><td>A key score in the matrix is a guess (for example, "will Lambda cold starts break our p99?")</td></tr>
<tr><td><strong>Cost model / TCO</strong></td><td>Estimate the infrastructure cost <em>plus</em> the engineering time to build and run each option</td><td>Cost is a heavy criterion, or a cheap-looking option needs lots of people to operate</td></tr>
</tbody></table>

<h3>Reversible and irreversible decisions</h3>
<p>Amazon's well-known framing splits decisions into <strong>two-way doors</strong>, which you can walk back through cheaply, and <strong>one-way doors</strong>, which are expensive or impossible to undo. The point is to <em>match the process to the door</em>: make two-way-door decisions quickly with a small group, and reserve deep analysis, prototypes and wide review for one-way doors.</p>
<table>
<thead><tr><th>Usually two-way doors (decide fast)</th><th>Usually one-way doors (decide carefully)</th></tr></thead>
<tbody>
<tr><td>EC2 instance size or family; Auto Scaling limits</td><td>Primary data store and data model for a large, long-lived dataset</td></tr>
<tr><td>CloudFront cache TTLs; feature flags</td><td>Three-year Savings Plans or Reserved Instances paid all upfront</td></tr>
<tr><td>Moving a container between ECS on EC2 and Fargate</td><td>Public API contracts that external customers integrate with</td></tr>
<tr><td>Log retention period (if increasing)</td><td>Deleting data; choosing a Region for data that must stay resident</td></tr>
<tr><td>Adding a read replica or a cache</td><td>Overlapping IP ranges across VPCs you will later need to connect (M02.02)</td></tr>
</tbody></table>
<div class="callout tip"><strong>Design to make doors two-way.</strong> Many architecture patterns exist precisely to make decisions reversible: infrastructure as code (rebuild instead of repair), containers (portable runtime), queues between components (swap the consumer), the strangler fig pattern (migrate piece by piece), blue/green deployments (switch back). A good architect doesn't only choose well; they reduce the cost of choosing wrong.</div>

<h3>Architecture Decision Records (ADRs)</h3>
<p>An <strong>Architecture Decision Record</strong> is a short document, usually one or two pages, that captures <strong>one</strong> significant decision: the context that forced it, the decision itself, and its consequences. Michael Nygard popularised the format in 2011. The collection of ADRs for a system becomes its <em>decision log</em>.</p>
<p><strong>Why bother?</strong> Code shows <em>what</em> the system does; it never shows <em>why</em> it is built that way or which alternatives were rejected. Without that, new team members either cargo-cult past decisions or reverse them without knowing what problem they solved. ADRs also force clear thinking: if you can't write the Context and Consequences sections, you don't understand the decision yet.</p>
<p><strong>What deserves an ADR?</strong> A decision that is <em>architecturally significant</em>: it affects structure, quality attributes, dependencies, interfaces or construction techniques, and it is costly to change. Choosing a database, an integration style (synchronous API vs events), a multi-account structure, a DR strategy or a tenancy model: yes. Choosing a logging library: usually no.</p>
<h4>The Nygard template</h4>
<table>
<thead><tr><th>Section</th><th>What goes in it</th></tr></thead>
<tbody>
<tr><td><strong>Title</strong></td><td>A short noun phrase with a number: "ADR-0007: Use Aurora PostgreSQL for the orders service"</td></tr>
<tr><td><strong>Status</strong></td><td>Proposed, Accepted, Rejected, Deprecated, or Superseded by ADR-00NN (with the date)</td></tr>
<tr><td><strong>Context</strong></td><td>The forces at play: requirements, constraints, team skills, numbers, deadlines. Written neutrally, so a reader understands the problem before the answer</td></tr>
<tr><td><strong>Decision</strong></td><td>The choice, in active voice: "We will…"</td></tr>
<tr><td><strong>Consequences</strong></td><td>Everything that follows, good <em>and</em> bad: new capabilities, new costs, new risks, follow-up work, and what would make us revisit</td></tr>
</tbody></table>
<h4>MADR: the "Markdown ADR" variant</h4>
<p>MADR adds structure that is useful for contentious decisions: <strong>decision drivers</strong> (the criteria), <strong>considered options</strong>, the <strong>decision outcome</strong>, and <strong>pros and cons of each option</strong>. It pairs naturally with a weighted decision matrix: the drivers are your criteria and the pros/cons justify your scores.</p>
<h4>Where ADRs live</h4>
<p>Keep them <strong>in the same Git repository as the code they govern</strong>, typically <code>docs/adr/0001-record-architecture-decisions.md</code>, <code>docs/adr/0002-…</code>. Number them sequentially and never reuse numbers. Propose an ADR as a pull request (M03.03), so review, discussion and approval are recorded alongside it. Platform-wide decisions (account structure, network design) go in a central architecture repository.</p>`},

    { type: "workflow", title: "Workflow: from disagreement to recorded decision", html: DG_0409_ADR + `
<ol class="flow">
  <li><strong>Frame the decision.</strong> Write one sentence: "We need to choose the primary data store for the orders service." Check the scope: one decision per ADR.</li>
  <li><strong>Classify the door.</strong> Is it cheap to reverse? If yes, timebox the decision to hours, decide, and record a short ADR. If no, continue with the full process.</li>
  <li><strong>Gather the drivers.</strong> Pull the relevant functional and non-functional requirements (M04.01), with numbers: peak requests per second, data volume after 3 years, RPO/RTO, latency budget, compliance rules, budget ceiling, deadline, team skills.</li>
  <li><strong>List the options, including the boring ones.</strong> Always include "a fully managed AWS service that does this" and "change nothing / extend what we have". Three to four options is ideal.</li>
  <li><strong>Choose criteria and weights before scoring.</strong> Agree weights with stakeholders (they must sum to 100 or 1). Setting weights first prevents people from tuning them to favour an option they already like.</li>
  <li><strong>Score each option 1–5 per criterion,</strong> with one sentence of evidence per score. Where a score is a guess that matters, run a time-boxed spike.</li>
  <li><strong>Compute the weighted totals and run a sensitivity check.</strong> Shift the top weights by ±10–15 points. If the winner changes, the decision depends on a priority you must confirm with the business.</li>
  <li><strong>Decide, and write the ADR.</strong> Context (drivers and numbers), Decision ("We will…"), Consequences (positive, negative, risks, revisit triggers). Attach or link the matrix.</li>
  <li><strong>Review via pull request.</strong> Status is Proposed during review; merging sets it to Accepted. Rejected ADRs are kept too: they stop the same idea being proposed again without new information.</li>
  <li><strong>Revisit when a trigger fires.</strong> If the context changes (traffic ten times higher, a new compliance rule), write a new ADR that <em>supersedes</em> the old one and update the old one's status line only.</li>
</ol>` },

    { type: "aws", title: "How it works on AWS: trade-offs you will make again and again", html: `
<p>Most AWS design choices sit on a small number of recurring axes. Recognising the axis tells you which question to ask the business.</p>
<table>
<thead><tr><th>Decision</th><th>Option leaning to control/cost per unit</th><th>Option leaning to low effort/speed</th><th>Question that decides it</th></tr></thead>
<tbody>
<tr><td>Compute</td><td>EC2 (with Spot or Savings Plans)</td><td>Fargate → Lambda</td><td>How steady and how long-running is the work? How much ops capacity does the team have? (M13, M15, M16)</td></tr>
<tr><td>Relational database</td><td>Self-managed on EC2</td><td>RDS → Aurora → Aurora Serverless v2</td><td>Do we need OS or engine-level access? How spiky is load? (M21)</td></tr>
<tr><td>Data model</td><td>Relational (flexible queries, joins, transactions)</td><td>DynamoDB (predictable performance at any scale, known access patterns)</td><td>Are access patterns known and key-based, or ad hoc? (M21, M22)</td></tr>
<tr><td>Integration</td><td>Synchronous API calls (simple, immediate)</td><td>Queues and events (decoupled, resilient, eventually consistent)</td><td>Must the caller know the result right now? (M25, M26)</td></tr>
<tr><td>Streaming vs queueing</td><td>Kinesis Data Streams / MSK (ordering, replay, multiple consumers)</td><td>SQS (simplest, per-message, scales automatically)</td><td>Do several consumers need to read the same data, or replay it? (M25, M27)</td></tr>
<tr><td>Resilience</td><td>Single AZ (cheapest)</td><td>Multi-AZ → multi-Region active/active</td><td>What are the RPO, RTO and availability SLO, and what does downtime cost per hour? (M32, M33)</td></tr>
<tr><td>Purchasing</td><td>On-Demand (no commitment)</td><td>Savings Plans / RIs (cheaper, committed) and Spot (cheapest, interruptible)</td><td>How predictable is usage, and can the work be interrupted? (M34)</td></tr>
<tr><td>Build vs buy</td><td>Build on primitives (EC2, containers)</td><td>A purpose-built managed service (MediaConvert, Transcribe, OpenSearch Service)</td><td>Is this capability a differentiator for the business? (M43)</td></tr>
</tbody></table>
<h3>Tools that support the decision on AWS</h3>
<ul>
  <li><strong>AWS Pricing Calculator</strong> for the cost criterion: model each option with your estimated usage and export the estimate to attach to the ADR.</li>
  <li><strong>AWS Well-Architected Tool</strong>: review a workload and record which pillar trade-offs you accepted; high-risk issues become ADR candidates (M43).</li>
  <li><strong>Service quotas and documentation limits</strong>: check them early. A hard limit (Lambda's 15-minute maximum duration, a 400 KB DynamoDB item, a 10 GB Lambda container image) can eliminate an option outright before any scoring.</li>
  <li><strong>Tags and Cost Explorer</strong>: after the decision, tag resources with the ADR or service name so you can check whether the cost assumptions held.</li>
</ul>
<div class="callout"><strong>Eliminate before you score.</strong> Hard constraints are filters, not criteria. If data must stay in one country, options that replicate to another Region are out. If jobs run for 40 minutes, a single Lambda invocation is out unless you redesign the job into steps. Scoring an option that violates a hard constraint wastes everyone's time and confuses the matrix.</div>` },

    { type: "examples", title: "Worked examples", html: `
<h3>Example 1: a weighted decision matrix for the orders database</h3>
<p><strong>Context.</strong> An e-commerce company is building a new orders service. Expected load: about 300 writes per second at peak, a few thousand reads per second, 2 TB of data after three years. Queries include joins across orders, line items and customers, plus monthly reporting. The team of five knows PostgreSQL well and has no DynamoDB experience. The availability target is 99.95%.</p>
<p><strong>Options.</strong> (A) Amazon Aurora PostgreSQL, (B) Amazon DynamoDB, (C) self-managed PostgreSQL on EC2.</p>
<p><strong>Criteria and weights</strong> (agreed with the product owner before scoring; they sum to 100):</p>
<table>
<thead><tr><th>Criterion</th><th>Weight</th><th>A: Aurora PostgreSQL</th><th>B: DynamoDB</th><th>C: PostgreSQL on EC2</th></tr></thead>
<tbody>
<tr><td>Fit for relational queries and reporting</td><td>25</td><td>5</td><td>2</td><td>5</td></tr>
<tr><td>Low operational effort</td><td>20</td><td>4</td><td>5</td><td>1</td></tr>
<tr><td>Scalability headroom</td><td>15</td><td>4</td><td>5</td><td>2</td></tr>
<tr><td>Cost at expected load</td><td>15</td><td>3</td><td>4</td><td>4</td></tr>
<tr><td>Team skills</td><td>15</td><td>5</td><td>2</td><td>4</td></tr>
<tr><td>Availability (Multi-AZ, failover)</td><td>10</td><td>4</td><td>5</td><td>2</td></tr>
<tr><td><strong>Weighted total (out of 500)</strong></td><td>100</td><td><strong>425</strong></td><td>365</td><td>315</td></tr>
<tr><td><strong>Weighted score (out of 5)</strong></td><td></td><td><strong>4.25</strong></td><td>3.65</td><td>3.15</td></tr>
</tbody></table>
<p><strong>The arithmetic for A:</strong> 25×5 + 20×4 + 15×4 + 15×3 + 15×5 + 10×4 = 125 + 80 + 60 + 45 + 75 + 40 = <strong>425</strong>. Dividing by the total weight (100) gives <strong>4.25</strong> on the 1–5 scale. B: 50 + 100 + 75 + 60 + 30 + 50 = 365 → 3.65. C: 125 + 20 + 30 + 60 + 60 + 20 = 315 → 3.15.</p>
<p><strong>Reading the result.</strong> Aurora wins clearly. Notice <em>why</em>: DynamoDB actually scores higher on four of six criteria, but it loses heavily on the two that the business weighted most for this workload (query fit and team skills). For a different workload, such as a session store with key-based access at very high scale, the same matrix with different weights would pick DynamoDB. The matrix doesn't encode a universal truth; it encodes <em>this team's priorities</em>.</p>

<h3>Example 2: sensitivity check</h3>
<p>Suppose a stakeholder argues that operational effort matters more than the team admits. Move 10 points from "team skills" to "low operational effort" (weights 25, 30, 15, 15, 5, 10):</p>
<ul>
  <li>A: 125 + 120 + 60 + 45 + 25 + 40 = 415 → 4.15</li>
  <li>B: 50 + 150 + 75 + 60 + 10 + 50 = 395 → 3.95</li>
  <li>C: 125 + 30 + 30 + 60 + 20 + 20 = 285 → 2.85</li>
</ul>
<p>Aurora still wins, so the decision is <strong>robust</strong> to that disagreement and you can stop arguing about the weight. If the winner had flipped, you would have learned that the decision really hinges on how much the business values operational effort, which is a conversation to have with the business, not a technical fact to argue about.</p>

<h3>Example 3: total cost of ownership beats sticker price</h3>
<p>Option X costs $1,200 per month in AWS charges but needs about 20 engineer-hours a month of patching, upgrades and on-call. Option Y, a more managed service, costs $1,800 per month and needs about 10 hours. At a fully loaded cost of $100 per engineer-hour:</p>
<ul>
  <li>X: $1,200 + 20 × $100 = <strong>$3,200 per month</strong></li>
  <li>Y: $1,800 + 10 × $100 = <strong>$2,800 per month</strong></li>
</ul>
<p>The "more expensive" managed service is $400 a month cheaper in total, and the 10 hours saved go to features. This is the economic logic behind the exam's "LEAST operational overhead" answers.</p>

<h3>Example 4: a complete sample ADR</h3>
<pre><code># ADR-0007: Use Amazon Aurora PostgreSQL for the orders service

Status: Accepted (2026-03-14). Supersedes: none. Superseded by: none.
Deciders: orders team, platform architect, product owner

## Context
- New orders service, launching in Q3. Peak forecast: 300 writes/s,
  3,000 reads/s; 2 TB after 3 years (from the capacity model in the design doc).
- Queries join orders, line items and customers; finance needs monthly
  reporting with ad hoc SQL.
- Availability SLO 99.95%; RPO 1 minute, RTO 15 minutes for this service.
- Team of 5 with strong PostgreSQL skills, no DynamoDB production experience.
- Monthly cost ceiling for the data tier: USD 2,500.
- Options considered: Aurora PostgreSQL, DynamoDB, PostgreSQL on EC2.
  Weighted decision matrix (attached): Aurora 4.25, DynamoDB 3.65, EC2 3.15.
  Sensitivity check (+10 weight on operational effort): Aurora still first.

## Decision
We will use Amazon Aurora PostgreSQL (provisioned writer plus one reader in
a second AZ) as the system of record for orders.

## Consequences
Positive
- Relational queries and reporting work with the team's existing skills.
- Multi-AZ failover typically completes in well under a minute, meeting RTO.
- Continuous backup to S3 with point-in-time restore meets the RPO.
Negative / risks
- Write scaling is limited to one writer instance; a much higher write load
  would need sharding or a different store.
- Higher baseline cost than DynamoDB at low traffic (estimated USD 900/month).
Follow-up
- Put reporting on the reader endpoint, not the writer.
- Add connection pooling (RDS Proxy) before Lambda consumers are added.
Revisit if
- Peak writes exceed 2,000/s, or a new access pattern is purely key-value at
  very high scale (consider DynamoDB for that pattern in a new ADR).</code></pre>
<p>Notice the qualities: numbers instead of adjectives, alternatives named, negatives stated honestly, and explicit <strong>revisit triggers</strong>. A reader in two years can tell immediately whether the decision still holds.</p>` },

    { type: "usecases", html: `
<table>
<thead><tr><th>Scenario</th><th>Technique to reach for</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Three teams each favour a different message broker</td><td>Weighted decision matrix with weights agreed first, then an ADR</td><td>Moves the argument from preferences to priorities; the losing teams can see their option was considered fairly</td></tr>
<tr><td>Choosing an EC2 instance family for a new service</td><td>Two-way door: pick a sensible default, measure, adjust</td><td>Resizing is cheap; analysis would cost more than a wrong first guess</td></tr>
<tr><td>Committing to a 3-year Savings Plan</td><td>One-way door: cost model from 3–6 months of usage data, sensitivity on growth</td><td>The commitment can't be cancelled; over-committing wastes money every month</td></tr>
<tr><td>"Will Lambda cold starts break our 200 ms p99?"</td><td>Time-boxed spike with a load test</td><td>A decisive score is a guess; one day of measurement replaces it with data</td></tr>
<tr><td>A new joiner asks "why don't we use Kubernetes?"</td><td>Point to the ADR</td><td>The context and rejected options are already written down; no re-litigation</td></tr>
<tr><td>Traffic grew 20× since the database decision</td><td>Check the ADR's revisit triggers; write a superseding ADR if one fired</td><td>Decisions are valid for a context; when the context changes, the decision should be reviewed deliberately</td></tr>
</tbody></table>` },

    { type: "demo", title: "Guided practice: set up an ADR log in a repository", html: `
<p>This takes about 15 minutes in WSL, Linux or CloudShell and needs only Git (M03.03).</p>
<pre><code>mkdir -p ~/adr-demo/docs/adr &amp;&amp; cd ~/adr-demo &amp;&amp; git init -q

# ADR-0001 records the decision to use ADRs at all (a common first entry)
cat &gt; docs/adr/0001-record-architecture-decisions.md &lt;&lt;'EOF'
# ADR-0001: Record architecture decisions
Status: Accepted (2026-10-07)
## Context
We need a lightweight, reviewable record of significant design decisions.
## Decision
We will keep ADRs in docs/adr/ using the Nygard format, proposed via pull request.
## Consequences
Every architecturally significant change includes an ADR. Accepted ADRs are not
rewritten; a new ADR supersedes an old one.
EOF

git add docs/adr &amp;&amp; git commit -qm "ADR-0001: record architecture decisions"
git log --oneline -- docs/adr</code></pre>
<p>Now practise the full process on a real decision from your own work (or use "SQS vs Kinesis Data Streams for click events"):</p>
<ol>
  <li>Create <code>docs/adr/0002-&lt;slug&gt;.md</code> with Status <em>Proposed</em>.</li>
  <li>Write the drivers first, with numbers. Then list three options, including a managed AWS service.</li>
  <li>Build a matrix in a spreadsheet or a Markdown table, agree weights before scoring, compute totals, and run one sensitivity check.</li>
  <li>Fill in Decision and Consequences, including at least two negatives and one revisit trigger.</li>
  <li>Commit on a branch and, if you have a remote, open a pull request so the review is recorded.</li>
</ol>
<p class="muted small">Optional tooling: the open-source <em>adr-tools</em> scripts (<code>adr new</code>, <code>adr new -s 2</code> to supersede) automate numbering and status links. Plain Markdown works just as well.</p>` },

    { type: "casestudy", title: "Case study: the video pipeline that almost got built", html: `
<p><strong>Company.</strong> ClipForge, a fictional 12-person start-up, lets creators upload raw videos (up to 2 GB) that are transcoded into several resolutions and analysed by a custom machine-learning model that detects scene changes. Volume today is about 2,000 videos a day, very spiky around evening hours; transcoding takes 5–40 minutes per video on a 4-vCPU machine. Two engineers own the whole backend.</p>
<p><strong>Options the team listed.</strong> (1) An EC2 Auto Scaling group of Spot Instances reading jobs from SQS; (2) ECS on Fargate (with Fargate Spot) tasks triggered from SQS; (3) AWS Lambda orchestrated by Step Functions. A hard-constraint check came first: a single Lambda invocation runs for at most 15 minutes, so option 3 would need each video split into chunks, transcoded in parallel and stitched back together. Not impossible, but a lot of custom work.</p>
<p><strong>Matrix</strong> (weights agreed with the founders):</p>
<table>
<thead><tr><th>Criterion</th><th>Weight</th><th>EC2 Spot fleet</th><th>ECS Fargate</th><th>Lambda + Step Functions</th></tr></thead>
<tbody>
<tr><td>Fit for 5–40 minute jobs</td><td>25</td><td>5</td><td>5</td><td>2</td></tr>
<tr><td>Cost per video</td><td>25</td><td>5</td><td>4</td><td>3</td></tr>
<tr><td>Low operational effort</td><td>20</td><td>2</td><td>4</td><td>5</td></tr>
<tr><td>Time to market</td><td>15</td><td>2</td><td>4</td><td>4</td></tr>
<tr><td>Burst elasticity</td><td>15</td><td>4</td><td>4</td><td>5</td></tr>
<tr><td><strong>Weighted score</strong></td><td>100</td><td>3.80</td><td><strong>4.25</strong></td><td>3.60</td></tr>
</tbody></table>
<p><strong>Sensitivity.</strong> One founder cared most about cost, so the team re-ran the matrix with cost at 40 and operational effort and time to market at 10 each. The result: EC2 Spot <strong>4.25</strong>, Fargate <strong>4.25</strong>, Lambda 3.35. A tie. That told them the real question was "do we value the cheapest compute or two engineers' time?" Because moving containers between Fargate and EC2 Spot later is a <em>two-way door</em> (same images, same queue), they chose Fargate to launch faster and wrote a revisit trigger: "if compute exceeds $8,000/month, evaluate ECS on EC2 Spot capacity providers."</p>
<p><strong>The review that changed the answer.</strong> In the ADR pull request, the platform architect asked one question: "Did we consider <em>buying</em> transcoding?" AWS Elemental MediaConvert is a managed, per-minute-priced transcoding service. Scored with the same weights (fit 5, cost 3, ops 5, time to market 5, elasticity 5), it reached <strong>4.50</strong>, the highest score. But it can't run ClipForge's custom scene-detection model.</p>
<p><strong>Final decision (ADR-0004).</strong> Use MediaConvert for standard transcoding, triggered by S3 upload events through EventBridge, and run the custom ML analysis as Fargate tasks pulling from SQS. ADR-0003 (Fargate for everything) was marked <em>Superseded by ADR-0004</em>.</p>
<p><strong>Outcome after three months.</strong> Launch was four weeks earlier than the original plan, the engineers wrote no transcoding code, and the per-video cost stayed within budget. Lessons the team wrote into their engineering handbook:</p>
<ul>
  <li><strong>Always include a "buy" option.</strong> The best answer wasn't on the original list.</li>
  <li><strong>A tie is information.</strong> It reveals the priority the business has to decide, and reversibility is a good tie-breaker.</li>
  <li><strong>Review catches what the author can't see.</strong> The ADR pull request was worth more than the matrix.</li>
</ul>` },

    { type: "exam", html: `
<p>SAA-C03 questions usually give you several technically valid answers. The <strong>constraint keyword</strong> tells you which trade-off the question wants you to make. Train yourself to underline it first.</p>
<table>
<thead><tr><th>Keyword in the stem</th><th>Priority it encodes</th><th>Answers it tends to favour</th></tr></thead>
<tbody>
<tr><td>"MOST cost-effective", "minimise cost"</td><td>Cost, while still meeting every stated requirement</td><td>Spot for interruptible work, S3 lifecycle tiers, serverless for spiky loads, Savings Plans for steady loads, gateway endpoints instead of NAT for S3</td></tr>
<tr><td>"LEAST operational overhead", "minimal management"</td><td>Operational effort</td><td>Managed or serverless services (Fargate, Lambda, Aurora Serverless, SQS, managed connectors) over self-managed EC2</td></tr>
<tr><td>"Highly available", "fault tolerant", "resilient"</td><td>Reliability</td><td>Multi-AZ by default; multi-Region only if the stem mentions Regional failure or global users</td></tr>
<tr><td>"Lowest latency", "improve performance for global users"</td><td>Performance</td><td>Caching (ElastiCache, DAX, CloudFront), read replicas, Global Accelerator, edge</td></tr>
<tr><td>"With minimal changes to the application / code"</td><td>Time to market, low migration risk</td><td>Compatible managed services (RDS for the same engine, Amazon MQ for existing ActiveMQ, EFS for shared POSIX files)</td></tr>
<tr><td>"As quickly as possible", "in the shortest time"</td><td>Time to market</td><td>Managed services, AWS-native integrations, Snowball for large offline transfers</td></tr>
<tr><td>"Most secure", "comply with", "must not traverse the internet"</td><td>Security as a hard constraint</td><td>Private connectivity (endpoints, PrivateLink), encryption with KMS, least privilege</td></tr>
</tbody></table>
<ul>
  <li><strong>Distractor pattern 1: over-engineering.</strong> Multi-Region active/active when the stem only asks for high availability within a Region. It works but violates "cost-effective".</li>
  <li><strong>Distractor pattern 2: under-delivering.</strong> The cheapest option that silently drops a requirement (single AZ when the stem says "must remain available if an AZ fails").</li>
  <li><strong>Distractor pattern 3: right service, wrong effort.</strong> Self-managing on EC2 something AWS offers as a managed service, when the stem says "least operational overhead".</li>
  <li>Rule: first <em>eliminate</em> options that violate a hard requirement, then pick the one that best serves the keyword among the survivors. That is the exam version of "filter, then score".</li>
</ul>` },

    { type: "architect", html: `
<ul>
  <li><strong>Anti-pattern: resume-driven design.</strong> Choosing Kubernetes, Kafka or microservices because they look good on a CV, not because the drivers call for them. The matrix exposes it: "career interest" is never a weighted criterion.</li>
  <li><strong>Anti-pattern: gold-plating.</strong> Designing for 100× the forecast load or five nines when the business asked for three. Every extra nine costs money and complexity (M04.03). Design for the stated target plus sensible headroom, and record a revisit trigger.</li>
  <li><strong>Anti-pattern: premature optimisation.</strong> Tuning or sharding before measuring. Start simple, instrument (M30), and optimise the proven bottleneck (M04.05).</li>
  <li><strong>Anti-pattern: analysis paralysis.</strong> Treating every decision as a one-way door. If a decision is reversible, the cost of delay usually exceeds the cost of being wrong.</li>
  <li><strong>Anti-pattern: the matrix as theatre.</strong> Scores reverse-engineered to justify a decision already made. Agree weights before scoring, write evidence next to each score, and have someone outside the team review it.</li>
  <li><strong>Make the implicit explicit.</strong> Every system already embodies trade-offs; the only question is whether anyone chose them on purpose. A short ADR for each significant choice is cheap insurance.</li>
  <li><strong>Revisit triggers keep ADRs alive.</strong> Tie them to metrics you already monitor (requests per second, monthly cost, p99 latency), so a dashboard alarm can prompt the review.</li>
  <li><strong>Communicate trade-offs in business language.</strong> "Option A costs $600 more a month but cuts expected downtime from 8.8 hours to 52 minutes a year" lands with executives; "Multi-AZ improves availability" does not.</li>
</ul>` },

    { type: "summary", html: `
<ul>
  <li>There is no best architecture, only the best fit for stated drivers. Quality attributes pull against each other: cost, performance, reliability, consistency, security, operational effort and time to market.</li>
  <li>Treat security and compliance as constraints; trade along the reliability–performance–cost dials using business targets.</li>
  <li>Filter out options that break hard constraints first, then score the rest with a weighted decision matrix whose weights were agreed before scoring.</li>
  <li>Run a sensitivity check. If the winner flips, the decision depends on a business priority you must confirm. A tie can be broken by reversibility.</li>
  <li>Match the effort to the door: decide two-way doors fast; reserve analysis, spikes and wide review for one-way doors. Design patterns (IaC, containers, queues, blue/green) make doors two-way.</li>
  <li>Compare total cost of ownership (infrastructure plus engineering time), not sticker price.</li>
  <li>An ADR records one decision: Title, Status, Context, Decision, Consequences (MADR adds drivers, options, pros and cons). Store ADRs in the repo, review them by pull request, never rewrite an accepted one; supersede it.</li>
  <li>Always include a managed "buy" option and a "do nothing" option.</li>
  <li>On the exam, underline the constraint keyword, eliminate answers that miss a requirement, then pick the one that best serves the keyword.</li>
</ul>` }
  ],

  drills: [
    { id: "M04.09-d1", q: "Weights: cost 50, operational effort 30, performance 20. Option P scores cost 2, ops 5, performance 4. What is P's weighted score on the 1–5 scale? (two decimals)", answers: ["3.30", "3.3"], hint: "Multiply each score by its weight, add them up, divide by the total weight (100).", explain: "50×2 + 30×5 + 20×4 = 100 + 150 + 80 = 330, and 330 / 100 = 3.30." },
    { id: "M04.09-d2", q: "In Example 1, what is DynamoDB's weighted score on the 1–5 scale? (two decimals)", answers: ["3.65"], hint: "25×2 + 20×5 + 15×5 + 15×4 + 15×2 + 10×5, then divide by 100.", explain: "50 + 100 + 75 + 60 + 30 + 50 = 365 → 3.65." },
    { id: "M04.09-d3", q: "In the case study's cost-heavy sensitivity run (weights 25, 40, 10, 10, 15), what weighted score does the EC2 Spot fleet get? (two decimals)", answers: ["4.25"], hint: "Spot scores are 5, 5, 2, 2, 4.", explain: "25×5 + 40×5 + 10×2 + 10×2 + 15×4 = 125 + 200 + 20 + 20 + 60 = 425 → 4.25, tying with Fargate." },
    { id: "M04.09-d4", q: "In the case study, what score does MediaConvert get with the base weights (25, 25, 20, 15, 15) and scores 5, 3, 5, 5, 5? (two decimals)", answers: ["4.50", "4.5"], hint: "Weighted sum divided by 100.", explain: "125 + 75 + 100 + 75 + 75 = 450 → 4.50." },
    { id: "M04.09-d5", q: "Option X: $1,200/month infrastructure + 20 engineer-hours. Option Y: $1,800/month + 10 hours. At $100 per hour, what is the monthly TCO of the cheaper option, in dollars?", answers: ["2800", "$2800", "2,800", "$2,800"], hint: "Add infrastructure cost and hours × $100 for each option, then take the smaller.", explain: "X = 1,200 + 2,000 = 3,200. Y = 1,800 + 1,000 = 2,800. Y is cheaper overall." },
    { id: "M04.09-d6", q: "Buying a 3-year, all-upfront Compute Savings Plan: one-way door or two-way door? (answer one-way or two-way)", answers: ["one-way", "oneway", "one way", "one-way door"], hint: "Can you cancel it next month?", explain: "Savings Plans can't be cancelled, so the commitment is effectively irreversible: analyse usage data before committing." },
    { id: "M04.09-d7", q: "ADR-0003 is replaced by ADR-0004. What single word goes in ADR-0003's Status line (before \"by ADR-0004\")?", answers: ["superseded", "superseded by adr-0004"], hint: "It's not 'deprecated': a newer decision replaces it.", explain: "Superseded by ADR-0004. Deprecated means the decision simply no longer applies, with no replacement." }
  ],

  check: [
    { id: "M04.09-k1", type: "single", domain: "D2", task: "2.1", level: 300,
      stem: "A two-person start-up must launch an API in six weeks. Traffic is unknown and probably spiky. The founders' top priorities are speed of delivery and not having to manage servers. Which approach BEST fits these drivers?",
      options: [
        { t: "Amazon API Gateway with AWS Lambda and Amazon DynamoDB", c: true, why: "Fully managed and serverless: nothing to patch, scales with demand, pay per request. It best serves time to market and low operational effort." },
        { t: "A self-managed Kubernetes cluster on EC2 across three AZs", c: false, why: "Powerful but heavy to build and operate. It works against both stated drivers." },
        { t: "An active/active deployment in two Regions from day one", c: false, why: "Gold-plating: nothing in the drivers asks for multi-Region resilience, and it slows delivery and adds cost." },
        { t: "EC2 instances with a 3-year Reserved Instance commitment", c: false, why: "A one-way-door commitment for unknown traffic, plus server management. It contradicts both drivers." }
      ] },
    { id: "M04.09-k2", type: "single", domain: "D2", task: "2.2", level: 300,
      stem: "A team decided in ADR-0005 to use Amazon SQS. A year later they move to Amazon Kinesis Data Streams because several consumers now need to replay the same events. What should they do with the ADRs?",
      options: [
        { t: "Write ADR-0011 for the new decision and mark ADR-0005 as \"Superseded by ADR-0011\"", c: true, why: "ADRs are append-only. The new context and decision go in a new record, and the old one points to its replacement." },
        { t: "Edit ADR-0005 so that it says Kinesis", c: false, why: "That erases the history of why SQS was chosen and what changed, which is exactly what ADRs exist to preserve." },
        { t: "Delete ADR-0005 because it is no longer true", c: false, why: "Deleting loses the reasoning. Old decisions explain the current shape of the system." },
        { t: "Mark ADR-0005 as Rejected", c: false, why: "Rejected is for proposals that were never accepted. ADR-0005 was accepted and is now replaced." }
      ] },
    { id: "M04.09-k3", type: "multi", domain: "D4", task: "4.2", level: 300,
      stem: "Which TWO decisions are one-way doors that deserve careful analysis before committing?",
      options: [
        { t: "Purchasing a 3-year, all-upfront Savings Plan", c: true, why: "The commitment can't be cancelled; a wrong estimate wastes money for three years." },
        { t: "Choosing the primary data store and data model for a large, long-lived core dataset", c: true, why: "Migrating terabytes of data and rewriting access code is slow, risky and expensive." },
        { t: "Changing an EC2 instance from m7g.large to m7g.xlarge", c: false, why: "A stop/start resize, easily reversed: a two-way door." },
        { t: "Lowering a CloudFront cache TTL from 1 day to 1 hour", c: false, why: "A configuration change you can revert in minutes." },
        { t: "Raising an Auto Scaling group's maximum size", c: false, why: "Instantly reversible." }
      ] },
    { id: "M04.09-k4", type: "single", domain: "D4", task: "4.2", level: 300,
      stem: "A nightly batch job runs for about 3 hours. It checkpoints its progress to Amazon S3 and can resume after an interruption. It must finish before 06:00, and there is ample time. Which compute option is MOST cost-effective?",
      options: [
        { t: "EC2 Spot Instances, with the job resuming from its last checkpoint after any interruption", c: true, why: "Interruptible, flexible work is the ideal Spot use case, at a steep discount to On-Demand. Checkpointing makes interruptions harmless." },
        { t: "EC2 On-Demand Instances", c: false, why: "Works, but costs several times more than Spot for work that tolerates interruption." },
        { t: "EC2 Reserved Instances for the job's instance type", c: false, why: "You'd pay for 24 hours a day to use 3; a reservation suits steady, always-on use." },
        { t: "EC2 Dedicated Hosts", c: false, why: "The most expensive option; it's for licensing or compliance needs that the stem doesn't mention." }
      ] },
    { id: "M04.09-k5", type: "single", domain: "D2", task: "2.1", level: 300,
      stem: "Weights: cost 50, operational effort 30, performance 20 (sum 100). Option A scores 4, 2, 5. Option B scores 3, 5, 4. Which result is correct?",
      options: [
        { t: "B wins with 3.80; A scores 3.60", c: true, why: "A: 200 + 60 + 100 = 360 → 3.60. B: 150 + 150 + 80 = 380 → 3.80." },
        { t: "A wins, because it scores highest on the heaviest criterion", c: false, why: "Winning the heaviest criterion isn't enough: B's lead on operational effort outweighs it." },
        { t: "They tie at 3.60", c: false, why: "Recompute B: 3×50 + 5×30 + 4×20 = 380, not 360." },
        { t: "A wins with 3.80; B scores 3.60", c: false, why: "The totals are reversed." }
      ] },
    { id: "M04.09-k6", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "A company needs a message queue between its web tier and its worker tier. The requirement is the LEAST operational overhead. Which option should a solutions architect choose?",
      options: [
        { t: "Amazon SQS", c: true, why: "Fully managed and serverless: no brokers to size, patch or fail over, and it scales automatically." },
        { t: "RabbitMQ installed on EC2 instances in an Auto Scaling group", c: false, why: "You'd manage the OS, the broker, clustering and upgrades: the most overhead." },
        { t: "Amazon MQ for RabbitMQ", c: false, why: "Managed brokers, but you still choose instance sizes and handle broker configuration. Prefer it when you need protocol compatibility, which the stem doesn't mention." },
        { t: "Apache Kafka on EC2", c: false, why: "Heavy to operate, and a streaming platform is more than a simple work queue needs." }
      ] }
  ],
  cards: ["fc-M04-9-01", "fc-M04-9-02", "fc-M04-9-03", "fc-M04-9-04", "fc-M04-9-05", "fc-M04-9-06", "fc-M04-9-07", "fc-M04-9-08", "fc-M04-9-09", "fc-M04-9-10", "fc-M04-9-11"],
  references: [
    "Michael Nygard, \"Documenting Architecture Decisions\" (2011), the original ADR template",
    "MADR: Markdown Architectural Decision Records (adr.github.io/madr)",
    "AWS Prescriptive Guidance: <em>Using architectural decision records to streamline technical decision-making</em>",
    "AWS Well-Architected Framework whitepaper: design principles and pillar trade-offs",
    "<em>System Design on AWS</em> ch.1 (PDF p22–50): system design concepts and trade-offs"
  ]
});

FLASHCARDS.push(
  { id: "fc-M04-9-01", front: "Why is there no \"best\" architecture?", back: "Quality attributes conflict (cost, performance, reliability, consistency, security, ops effort, time to market). The best design is the best <em>fit</em> for stated, weighted drivers." },
  { id: "fc-M04-9-02", front: "Steps of a weighted decision matrix?", back: "Filter out options that break hard constraints → agree criteria and weights <em>before</em> scoring → score 1–5 with evidence → weighted sum ÷ total weight → sensitivity check." },
  { id: "fc-M04-9-03", front: "What does a sensitivity check tell you?", back: "Whether the winner changes when weights shift ±10–15. If it flips, the decision depends on a business priority you must confirm. A tie can be broken by reversibility." },
  { id: "fc-M04-9-04", front: "One-way door vs two-way door?", back: "One-way: expensive or impossible to undo (data store for a large dataset, 3-year commitment, public API contract). Decide carefully. Two-way: cheap to reverse (instance size, TTL, flags). Decide fast." },
  { id: "fc-M04-9-05", front: "Nygard ADR sections?", back: "Title · Status · Context · Decision · Consequences." },
  { id: "fc-M04-9-06", front: "What does MADR add to a Nygard ADR?", back: "Decision drivers, considered options, decision outcome, and pros/cons for each option." },
  { id: "fc-M04-9-07", front: "ADR statuses and what happens when a decision changes?", back: "Proposed → Accepted or Rejected; later Deprecated or Superseded by ADR-NNNN. Never rewrite an accepted ADR: write a new one that supersedes it." },
  { id: "fc-M04-9-08", front: "Where should ADRs be stored?", back: "In the Git repository with the code (e.g. docs/adr/0001-*.md), proposed and reviewed through pull requests." },
  { id: "fc-M04-9-09", front: "TCO vs sticker price?", back: "TCO = infrastructure cost + engineering time to build and operate. A pricier managed service is often cheaper overall." },
  { id: "fc-M04-9-10", front: "Exam keyword → priority: \"LEAST operational overhead\" / \"MOST cost-effective\" / \"minimal changes\"?", back: "Managed/serverless · cheapest option that still meets every requirement · compatible managed service (same engine or protocol)." },
  { id: "fc-M04-9-11", front: "Four architecture anti-patterns from this lesson?", back: "Resume-driven design · gold-plating · premature optimisation · analysis paralysis (plus the matrix as theatre)." }
);
// ================================================================== 90_lab.js
/* ================================================================== LAB L04 */
var DG_L04_REF = `
<figure>
<svg class="diagram" viewBox="0 0 760 300" role="img" aria-labelledby="l04at l04ad">
  <title id="l04at">Reference design for the LinkSnap URL shortener</title>
  <desc id="l04ad">Users resolve the domain through Route 53 and reach CloudFront, which caches redirects at the edge. Cache misses go to API Gateway, then Lambda, which reads or writes the links table in DynamoDB. CloudFront real-time logs stream every click, including cached ones, to Kinesis Data Streams, then Amazon Data Firehose delivers them to S3, where Athena queries them.</desc>
  <defs><marker id="l04a-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>
  <text class="dg-ta" x="10" y="22">Request path (redirects and link creation)</text>
  <rect class="dg-box" x="10" y="36" width="105" height="58" rx="8"/><text class="dg-t" x="22" y="60">Users</text><text class="dg-ts" x="22" y="80">clients</text>
  <rect class="dg-info" x="137" y="36" width="105" height="58" rx="8"/><text class="dg-t" x="149" y="60">Route 53</text><text class="dg-ts" x="149" y="80">alias record</text>
  <rect class="dg-edge" x="264" y="36" width="105" height="58" rx="8"/><text class="dg-t" x="276" y="60">CloudFront</text><text class="dg-ts" x="276" y="80">edge cache</text>
  <rect class="dg-info" x="391" y="36" width="105" height="58" rx="8"/><text class="dg-t" x="403" y="60">API Gateway</text><text class="dg-ts" x="403" y="80">HTTP API, JWT</text>
  <rect class="dg-info" x="518" y="36" width="105" height="58" rx="8"/><text class="dg-t" x="530" y="60">Lambda</text><text class="dg-ts" x="530" y="80">code lookup</text>
  <rect class="dg-good" x="645" y="36" width="105" height="58" rx="8"/><text class="dg-t" x="657" y="60">DynamoDB</text><text class="dg-ts" x="657" y="80">links table</text>
  <path class="dg-line" d="M115 65 H135" marker-end="url(#l04a-ar)"/>
  <path class="dg-line" d="M242 65 H262" marker-end="url(#l04a-ar)"/>
  <path class="dg-line" d="M369 65 H389" marker-end="url(#l04a-ar)"/>
  <path class="dg-line" d="M496 65 H516" marker-end="url(#l04a-ar)"/>
  <path class="dg-line" d="M623 65 H643" marker-end="url(#l04a-ar)"/>
  <text class="dg-ts" x="340" y="112">cache misses only (about 20% of redirects, plus all creates)</text>

  <text class="dg-ta" x="10" y="150">Click analytics (all requests)</text>
  <rect class="dg-edge" x="264" y="166" width="140" height="58" rx="8"/><text class="dg-t" x="276" y="190">Kinesis Streams</text><text class="dg-ts" x="276" y="210">real-time logs</text>
  <rect class="dg-info" x="434" y="166" width="140" height="58" rx="8"/><text class="dg-t" x="446" y="190">Data Firehose</text><text class="dg-ts" x="446" y="210">buffer, Parquet</text>
  <rect class="dg-good" x="604" y="166" width="146" height="58" rx="8"/><text class="dg-t" x="616" y="190">S3 + Athena</text><text class="dg-ts" x="616" y="210">click counts (SQL)</text>
  <path class="dg-line" d="M316 94 V164" marker-end="url(#l04a-ar)"/>
  <path class="dg-line" d="M404 195 H432" marker-end="url(#l04a-ar)"/>
  <path class="dg-line" d="M574 195 H602" marker-end="url(#l04a-ar)"/>
  <text class="dg-ts" x="10" y="250">Short codes: 7 random base62 chars, written with a conditional put (attribute_not_exists); retry on collision.</text>
  <text class="dg-ts" x="10" y="268">Redirect status 302 with a short edge TTL, so link changes take effect quickly. The logs still record every click.</text>
  <text class="dg-ts" x="10" y="286">Multi-AZ by default: every service here is Regional or global; no single-AZ component.</text>
</svg>
<figcaption>Figure L04-1. One reasonable reference design. Yours may differ; what matters is that each choice traces back to a requirement.</figcaption>
</figure>`;

var LAB = {
  id: "L04", title: "Design workshop: estimate, decide, record (ADR)", level: 300, duration: "2–3 h",
  cost: "$0 (pen, paper, Pricing Calculator)",
  objective: `
<p>Practise the whole architect's loop from M04 on one realistic system, without creating any AWS resources. You will design <strong>LinkSnap</strong>, a URL-shortening service, by:</p>
<ul>
  <li>turning a business brief into functional and non-functional requirements (M04.01);</li>
  <li>doing back-of-envelope estimates for throughput, storage, bandwidth and cache size (M04.01, M04.05);</li>
  <li>checking whether the design can meet its availability target (M04.03);</li>
  <li>sketching an AWS design, then hunting for single points of failure and failure modes (M04.03, M04.06);</li>
  <li>choosing consistency and latency trade-offs per data item (M04.04);</li>
  <li>comparing two data stores with a weighted decision matrix and recording the result as an ADR (M04.09).</li>
</ul>
<p>Work on paper or in a text file first. The auto-graded exercises below check your estimates, and a reference solution is at the end. Don't open it until you have your own answer.</p>`,
  warning: `ℹ️ This lab creates nothing in AWS and costs nothing. Use the AWS Pricing Calculator without signing in; don't save estimates that include real account details.`,
  diagram: `<p>The output of this lab is a one-page design: a requirements list, an estimates table, a diagram, a failure-mode table, a decision matrix and an ADR. Figure L04-1 (in step 12) shows one reference design to compare against once you've finished.</p>`,
  steps: [
    { id: "s1", title: "Read the brief", html: `
<div class="callout"><strong>LinkSnap: product brief</strong>
<ul>
  <li>Signed-in users create short links (for example <code>lnk.example/aZ3k9Qp</code>) that redirect to long URLs. Anyone can follow a short link without signing in.</li>
  <li>Users can see how many times each link was clicked. Counts may lag by up to <strong>5 minutes</strong>.</li>
  <li>Volume: <strong>100 million new links per month</strong>. Links are read (followed) <strong>100 times</strong> as often as they are created.</li>
  <li>Each link record (code, long URL, owner, timestamps) is about <strong>500 bytes</strong>. A redirect response is also about <strong>500 bytes</strong>.</li>
  <li>Links are kept for <strong>5 years</strong>. Short codes must never collide.</li>
  <li>Assume peak traffic is <strong>3×</strong> the average.</li>
  <li>Redirects must be fast: <strong>p99 under 100 ms</strong> for users in the launch Region's continent. Availability target for redirects: <strong>99.9%</strong> per month.</li>
  <li>The team is three engineers who prefer managed services. Cost should be as low as practical.</li>
</ul></div>
<p>Use a 30-day month (2,592,000 seconds) and decimal units (1 TB = 10<sup>12</sup> bytes) throughout.</p>` },
    { id: "s2", title: "List functional and non-functional requirements", html: `
<p>Write two lists. Make every non-functional requirement <strong>measurable</strong>: a number, a unit and a condition.</p>
<table>
<thead><tr><th>Type</th><th>Example to start you off</th><th>Add at least…</th></tr></thead>
<tbody>
<tr><td>Functional (what it does)</td><td>FR1: an authenticated user can create a short link for a long URL</td><td>3 more (redirect, view click counts, optional custom alias, delete a link…)</td></tr>
<tr><td>Non-functional (how well)</td><td>NFR1: 99.9% of redirect requests per month succeed</td><td>5 more (latency, durability, retention, freshness of counts, security, cost)</td></tr>
</tbody></table>
<p>Then mark the <strong>top three drivers</strong>, the requirements that will dominate design choices. For LinkSnap, think about which matters most: redirect latency, availability, cost, or click-count freshness?</p>` },
    { id: "s3", title: "Back-of-envelope estimation", html: `
<p>Fill in this template. Show your arithmetic and round sensibly; the goal is the <em>order of magnitude</em>, not false precision.</p>
<table>
<thead><tr><th>Quantity</th><th>Formula</th><th>Your result</th></tr></thead>
<tbody>
<tr><td>Average writes per second</td><td>new links per month ÷ seconds per month</td><td></td></tr>
<tr><td>Average reads (redirects) per second</td><td>writes per second × read:write ratio</td><td></td></tr>
<tr><td>Peak reads and writes per second</td><td>average × peak factor</td><td></td></tr>
<tr><td>Links stored after 5 years</td><td>links per month × 12 × 5</td><td></td></tr>
<tr><td>Storage after 5 years</td><td>links × bytes per record (before replicas, indexes and backups)</td><td></td></tr>
<tr><td>Average outbound bandwidth for redirects</td><td>reads per second × response size</td><td></td></tr>
<tr><td>Redirects per day</td><td>reads per month ÷ 30</td><td></td></tr>
<tr><td>Cache size (80/20 rule)</td><td>20% of a day's requests × record size: cache the hot 20% that serves ~80% of traffic</td><td></td></tr>
<tr><td>Short-code length</td><td>smallest <em>n</em> with 62<sup>n</sup> ≥ links stored (base62 = a–z, A–Z, 0–9)</td><td></td></tr>
</tbody></table>
<div class="callout tip"><strong>Shortcuts.</strong> A 30-day month is about 2.6 million seconds, so 100 million per month is about 40 per second. One request per second is about 2.6 million a month. Check your answers in the auto-graded exercises below the steps.</div>
<p><strong>What to notice:</strong> the write rate is tiny; this is a <em>read-heavy</em> system, so the design should be built around serving redirects cheaply and fast (caching), not around writes. Storage of a few terabytes over five years is modest for any managed database.</p>` },
    { id: "s4", title: "Availability target and composite availability", html: `
<p>The redirect path is a chain: the request must pass through every component, so availabilities <strong>multiply</strong> (M04.03).</p>
<ol>
  <li>Using illustrative component availabilities (not official SLAs) of <strong>99.99%</strong> for the edge/API layer, <strong>99.95%</strong> for compute and <strong>99.99%</strong> for the database, compute the availability of the chain.</li>
  <li>Does it meet the 99.9% target? How many minutes of downtime per 30-day month does 99.9% allow?</li>
  <li>If one component were a pair of instances in two AZs, each 99.5% available on its own and failing independently, what would the pair's availability be? Why does this show that redundancy beats buying a "better" single component?</li>
</ol>
<p><strong>What to notice:</strong> a chain is always <em>less</em> available than its weakest link; redundancy (parallel components) is how you climb back up.</p>` },
    { id: "s5", title: "Sketch a high-level AWS design", html: `
<p>Draw boxes and arrows for two paths: <strong>create a link</strong> and <strong>follow a link</strong>. For each component write one line: which requirement it serves. Questions to resolve while drawing:</p>
<ul>
  <li><strong>Where is the cache?</strong> At the edge (CloudFront), in front of the database (ElastiCache or DAX), or both? Which gives the biggest latency win for a global audience at the lowest cost?</li>
  <li><strong>Which compute?</strong> Containers, functions or instances, given three engineers and a spiky, read-heavy load? (M04.09 trade-offs: operational effort vs control.)</li>
  <li><strong>How are short codes generated without collisions?</strong> Random codes plus a conditional write, a central counter, or pre-generated code blocks? What does each cost in coordination?</li>
  <li><strong>301 or 302?</strong> A 301 (permanent) is cached by browsers, which cuts load but means browsers stop asking you, so you can't count those clicks or change the target. A 302 keeps every click visible. Which fits FR "view click counts"?</li>
  <li><strong>How do clicks reach the counts within 5 minutes,</strong> including clicks served from a cache?</li>
</ul>
<p>Keep it to 6–10 components. You can compare with Figure L04-1 in step 12 when you are done.</p>` },
    { id: "s6", title: "Find single points of failure and failure modes", html: `
<p>Walk your diagram component by component and fill in a table like this one (two rows are done for you):</p>
<table>
<thead><tr><th>Component</th><th>What if it fails or slows down?</th><th>Impact</th><th>Mitigation</th></tr></thead>
<tbody>
<tr><td>Database in one AZ</td><td>AZ outage</td><td>All cache misses and all creates fail</td><td>Use a Regional, multi-AZ store (DynamoDB) or Multi-AZ deployment</td></tr>
<tr><td>Code generator</td><td>Two requests pick the same random code</td><td>One user's link overwrites another's</td><td>Conditional write (<code>attribute_not_exists</code>) and retry on conflict</td></tr>
<tr><td>…</td><td></td><td></td><td></td></tr>
</tbody></table>
<p>Include at least: the cache (cold start after a deploy, or an eviction storm), the analytics pipeline (backlog: does it affect redirects?), a hot link (one celebrity link receiving 50,000 clicks per second), a bad deployment, and a Regional outage (in or out of scope for a 99.9% target?).</p>
<p><strong>What to notice:</strong> the analytics path should be <em>decoupled</em>: if it fails, redirects must keep working. That's a design principle from M04.06: don't let a non-critical dependency take down the critical path.</p>` },
    { id: "s7", title: "Choose consistency and latency per data item", html: `
<p>Not every piece of data needs the same guarantees (M04.04). Complete the table:</p>
<table>
<thead><tr><th>Data</th><th>Consistency needed</th><th>Latency budget</th><th>Your choice and why</th></tr></thead>
<tbody>
<tr><td>Short code → long URL mapping</td><td>?</td><td>p99 &lt; 100 ms end to end</td><td></td></tr>
<tr><td>Uniqueness of a new short code</td><td>?</td><td>A few hundred ms is fine for creates</td><td></td></tr>
<tr><td>Click counts per link</td><td>?</td><td>Fresh within 5 minutes</td><td></td></tr>
<tr><td>Link deletion (abuse takedown)</td><td>?</td><td>Effective within minutes</td><td></td></tr>
</tbody></table>
<p>Hint: uniqueness needs a strongly consistent, atomic check at write time. Reading the mapping can tolerate eventual consistency and caching. Click counts are naturally eventually consistent. Think about how your cache TTL limits how fast a takedown takes effect.</p>` },
    { id: "s8", title: "Rough cost estimate with the AWS Pricing Calculator", html: `
<ol>
  <li>Open the AWS Pricing Calculator (calculator.aws) and create an estimate for your Region.</li>
  <li>Translate your estimates into <strong>monthly usage</strong>: redirects per month (reads per day × 30), creates per month, storage in GB, data transfer out in GB.</li>
  <li>Apply your cache: if the edge serves <strong>80%</strong> of redirects, only 20% reach API Gateway, Lambda and the database. Work out the requests per month that reach the database.</li>
  <li>Add the main services: CloudFront (requests and data out), API Gateway (HTTP API requests), Lambda (requests and GB-seconds), DynamoDB (on-demand reads and writes, storage, point-in-time recovery), and the analytics pipeline.</li>
  <li>Record the top three cost drivers. Then test one change: what happens to the bill if the cache hit ratio drops from 80% to 50%?</li>
</ol>
<div class="callout warn">Prices vary by Region and change over time, so this lab gives no prices. Use the calculator's current figures and treat the result as an order-of-magnitude estimate, not a quote.</div>
<p><strong>What to notice:</strong> for read-heavy systems, the <em>cache hit ratio</em> is usually the biggest cost lever, bigger than instance sizing.</p>` },
    { id: "s9", title: "Weighted decision matrix: DynamoDB vs Aurora for the links table", html: `
<p>Score both options 1–5 on each criterion, with a sentence of evidence each. Use these weights (agreed with the "product owner" before scoring):</p>
<table>
<thead><tr><th>Criterion</th><th>Weight</th><th>DynamoDB</th><th>Aurora PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Fit for key-value lookups by short code</td><td>30</td><td></td><td></td></tr>
<tr><td>Scales to peak reads with headroom</td><td>25</td><td></td><td></td></tr>
<tr><td>Low operational effort</td><td>20</td><td></td><td></td></tr>
<tr><td>Cost at this load</td><td>15</td><td></td><td></td></tr>
<tr><td>Ad hoc querying and reporting</td><td>10</td><td></td><td></td></tr>
</tbody></table>
<p>Compute each option's weighted score (weighted sum ÷ 100). Then run a sensitivity check: move 15 points from "fit for key-value lookups" to "ad hoc querying". Does the winner change? What does that tell you about where reporting should live?</p>` },
    { id: "s10", title: "Write the ADR", html: `
<p>Copy this template into <code>docs/adr/0001-links-data-store.md</code> (or a text file) and complete it. Keep it to about one page.</p>
<pre><code># ADR-0001: &lt;decision as a short noun phrase&gt;

Status: Proposed (&lt;date&gt;)
Deciders: &lt;names or roles&gt;

## Context
- Drivers (with numbers): &lt;peak reads/s, storage after 5 years,
  availability target, latency target, team constraints&gt;
- Options considered: &lt;A, B, C&gt;
- Decision matrix: &lt;scores&gt;; sensitivity check: &lt;result&gt;

## Decision
We will &lt;choice&gt; because &lt;the one or two drivers that decided it&gt;.

## Consequences
Positive
- &lt;…&gt;
Negative / risks
- &lt;…&gt;  (at least two, honestly stated)
Follow-up
- &lt;…&gt;
Revisit if
- &lt;a measurable trigger, e.g. "reporting queries exceed …"&gt;</code></pre>` },
    { id: "s11", title: "Self-review with the rubric", html: `
<p>Score your own design (or swap with a colleague). A strong design scores at least "Good" in every row.</p>
<table>
<thead><tr><th>Criterion</th><th>Needs work</th><th>Good</th><th>Excellent</th></tr></thead>
<tbody>
<tr><td>Requirements</td><td>Vague ("fast", "scalable")</td><td>Every NFR has a number and unit</td><td>Top drivers named and traced to design choices</td></tr>
<tr><td>Estimation</td><td>Missing or off by more than 10×</td><td>Throughput, storage, bandwidth and cache estimated correctly</td><td>Assumptions stated; peak and growth considered</td></tr>
<tr><td>Availability</td><td>Not checked</td><td>Composite availability computed; meets target</td><td>SPOFs removed, failure modes table with mitigations</td></tr>
<tr><td>Data choices</td><td>One consistency model for everything</td><td>Consistency chosen per data item</td><td>Cache TTL, takedown latency and collisions reasoned through</td></tr>
<tr><td>Cost</td><td>Not considered</td><td>Main cost drivers identified</td><td>Sensitivity to cache hit ratio explored</td></tr>
<tr><td>Decision record</td><td>No ADR, or ADR without alternatives</td><td>Nygard sections complete, options and matrix included</td><td>Honest negatives, follow-ups and measurable revisit triggers</td></tr>
</tbody></table>` },
    { id: "s12", title: "Compare with the reference solution", html: `
<details><summary><strong>Show the reference solution</strong> (open it only after you have your own design)</summary>
` + DG_L04_REF + `
<h4>Estimates</h4>
<table>
<thead><tr><th>Quantity</th><th>Result</th></tr></thead>
<tbody>
<tr><td>Writes per second</td><td>100,000,000 ÷ 2,592,000 ≈ <strong>38.6/s average</strong> (≈ 116/s at 3× peak)</td></tr>
<tr><td>Reads per second</td><td>38.6 × 100 ≈ <strong>3,858/s average</strong>, ≈ <strong>11,574/s peak</strong></td></tr>
<tr><td>Links after 5 years</td><td>100 M × 60 = <strong>6 billion</strong></td></tr>
<tr><td>Storage</td><td>6 × 10<sup>9</sup> × 500 B = <strong>3 TB</strong> (before replicas and backups)</td></tr>
<tr><td>Bandwidth</td><td>3,858 × 500 B ≈ <strong>1.9 MB/s</strong> average: trivial</td></tr>
<tr><td>Redirects per day</td><td>10 billion per month ÷ 30 ≈ <strong>333 million</strong></td></tr>
<tr><td>Cache (80/20)</td><td>0.2 × 333 M × 500 B ≈ <strong>33 GB</strong>, which fits comfortably in memory or at the edge</td></tr>
<tr><td>Code length</td><td>62<sup>6</sup> ≈ 56.8 billion ≥ 6 billion, so <strong>6 characters</strong> suffice; 7 (≈ 3.5 trillion) makes random collisions rare</td></tr>
</tbody></table>
<h4>Availability</h4>
<p>0.9999 × 0.9995 × 0.9999 ≈ <strong>99.93%</strong>, which meets 99.9% (about 30 minutes of expected downtime per month against an allowance of 43.2). A pair of independent 99.5% components gives 1 − 0.005² = <strong>99.9975%</strong>.</p>
<h4>Key decisions</h4>
<ul>
  <li><strong>CloudFront as the cache</strong>, with 302 redirects and a short edge TTL (for example 60 s): most redirects never leave the edge, latency is lowest for users, and a takedown is effective within one TTL. With an 80% hit ratio, only 2 billion of the 10 billion monthly redirects reach the origin.</li>
  <li><strong>Serverless request path</strong> (API Gateway HTTP API, Lambda, DynamoDB on-demand): no servers for three engineers to run, every component Regional and multi-AZ, and cost follows traffic.</li>
  <li><strong>DynamoDB</strong> for the links table, keyed by short code. Reads are eventually consistent (cheaper; the cache is eventually consistent anyway). Creates use a conditional put so that uniqueness is checked atomically.</li>
  <li><strong>Analytics from CloudFront real-time logs</strong>, not from Lambda. Lambda only sees cache misses, so counting clicks there would miss about 80% of them. Logs flow through Kinesis Data Streams and Amazon Data Firehose to S3 in Parquet, and Athena aggregates counts. The pipeline is decoupled: if it stalls, redirects still work.</li>
  <li><strong>Hot links:</strong> CloudFront absorbs them. The origin sees at most one request per edge location per TTL for a cached link.</li>
  <li><strong>Regional outage:</strong> out of scope for 99.9% by default; recorded as a known risk with a revisit trigger (for example, DynamoDB global tables if the SLO rises to 99.99%).</li>
</ul>
<h4>Decision matrix</h4>
<p>DynamoDB 5, 5, 5, 4, 2 → (150 + 125 + 100 + 60 + 20) ÷ 100 = <strong>4.55</strong>. Aurora 3, 3, 4, 3, 5 → (90 + 75 + 80 + 45 + 50) ÷ 100 = <strong>3.40</strong>. Sensitivity (key-value 15, ad hoc 25): DynamoDB 4.10, Aurora 3.70. DynamoDB still wins, and the shift shows that reporting is better served by the S3 + Athena path than by choosing a relational store for redirects.</p>
</details>` }
  ],
  drillsTitle: "Estimation worksheet (auto-graded)",
  drills: [
    { id: "L04-d01", q: "Average <strong>writes</strong> (new links) per second, rounded to the nearest whole number?", answers: ["39", "38.6", "38.58"], hint: "100,000,000 ÷ 2,592,000", explain: "≈ 38.58/s, about 39." },
    { id: "L04-d02", q: "Average <strong>reads</strong> (redirects) per second, rounded to the nearest whole number?", answers: ["3858", "3,858"], hint: "Writes per second × 100 (use the unrounded value).", explain: "38.58 × 100 ≈ 3,858/s." },
    { id: "L04-d03", q: "<strong>Peak</strong> reads per second (3× average), rounded to the nearest whole number?", answers: ["11574", "11,574"], hint: "3 × 3,858.02", explain: "≈ 11,574/s." },
    { id: "L04-d04", q: "Peak writes per second, rounded to the nearest whole number?", answers: ["116"], hint: "3 × 38.58", explain: "≈ 115.7, about 116/s." },
    { id: "L04-d05", q: "How many links are stored after 5 years, in billions?", answers: ["6", "6 billion", "6b", "6000000000"], hint: "100 million × 12 × 5", explain: "6 × 10<sup>9</sup> links." },
    { id: "L04-d06", q: "Raw storage after 5 years at 500 bytes per link, in TB (decimal)?", answers: ["3", "3tb"], hint: "6 × 10<sup>9</sup> × 500 bytes", explain: "3 × 10<sup>12</sup> bytes = 3 TB, before replicas, indexes and backups." },
    { id: "L04-d07", q: "Redirects per day, in millions (nearest whole number)?", answers: ["333", "333m", "333 million"], hint: "10 billion redirects per month ÷ 30", explain: "≈ 333.3 million per day." },
    { id: "L04-d08", q: "Cache size using the 80/20 rule (20% of a day's redirects × 500 bytes), in GB to the nearest whole number?", answers: ["33", "33gb"], hint: "0.2 × 333.3 million × 500 bytes", explain: "≈ 33.3 × 10<sup>9</sup> bytes ≈ 33 GB." },
    { id: "L04-d09", q: "Average outbound bandwidth for redirects, in MB/s to one decimal place (500-byte responses)?", answers: ["1.9", "1.9mb/s"], hint: "3,858 × 500 bytes per second", explain: "≈ 1.93 MB/s. Bandwidth is not a concern for this system." },
    { id: "L04-d10", q: "What is the minimum base62 code length that can represent 6 billion links?", answers: ["6"], hint: "62<sup>5</sup> ≈ 916 million; 62<sup>6</sup> ≈ 56.8 billion", explain: "6 characters (62<sup>6</sup> ≈ 5.68 × 10<sup>10</sup> ≥ 6 × 10<sup>9</sup>)." },
    { id: "L04-d11", q: "How many distinct 7-character base62 codes are there, in trillions to one decimal place?", answers: ["3.5", "3.52"], hint: "62<sup>7</sup>", explain: "62<sup>7</sup> ≈ 3.52 × 10<sup>12</sup>: about 3.5 trillion, so 6 billion links use under 0.2% of the space." },
    { id: "L04-d12", q: "Composite availability of a chain of 99.99%, 99.95% and 99.99% components, in percent to two decimal places?", answers: ["99.93", "99.93%"], hint: "Multiply: 0.9999 × 0.9995 × 0.9999", explain: "≈ 0.99930 → 99.93%." },
    { id: "L04-d13", q: "Availability of two independent components in parallel, each 99.5% available, in percent?", answers: ["99.9975", "99.9975%"], hint: "1 − (1 − 0.995)²", explain: "1 − 0.005² = 1 − 0.000025 = 99.9975%." },
    { id: "L04-d14", q: "How many minutes of downtime does a 99.9% target allow in a 30-day month?", answers: ["43.2", "43.2min"], hint: "0.1% of 43,200 minutes", explain: "43,200 × 0.001 = 43.2 minutes." },
    { id: "L04-d15", q: "With an 80% edge cache hit ratio, how many redirect requests per month reach the database? (a number, e.g. 1000000000)", answers: ["2000000000", "2,000,000,000", "2 billion", "2billion", "2b", "2e9"], hint: "10 billion redirects per month × 20%", explain: "2 × 10<sup>9</sup> requests per month reach the origin." },
    { id: "L04-d16", q: "In step 9, what is DynamoDB's weighted score with scores 5, 5, 5, 4, 2 and weights 30, 25, 20, 15, 10? (two decimals)", answers: ["4.55"], hint: "Weighted sum ÷ 100", explain: "150 + 125 + 100 + 60 + 20 = 455 → 4.55." }
  ],
  validate: `
<p>You're done when you can tick every item:</p>
<ul>
  <li>☐ At least 4 functional and 6 measurable non-functional requirements, with the top three drivers marked.</li>
  <li>☐ The estimates table is complete and the auto-graded worksheet shows all items correct.</li>
  <li>☐ Composite availability is computed and compared with the 99.9% target.</li>
  <li>☐ A diagram with both paths (create, redirect) and a one-line justification per component.</li>
  <li>☐ A failure-modes table with at least six rows, including a hot link and an analytics backlog.</li>
  <li>☐ A consistency and latency choice for each of the four data items in step 7.</li>
  <li>☐ The three biggest cost drivers identified, and the effect of a lower cache hit ratio described.</li>
  <li>☐ A decision matrix with a sensitivity check, and an ADR with honest negatives and a measurable revisit trigger.</li>
  <li>☐ Self-review scored "Good" or better in every rubric row, and differences from the reference solution explained (a different choice is fine if you can justify it).</li>
</ul>`,
  cleanup: `<p><strong>Nothing to clean up.</strong> No AWS resources were created. Keep your design and ADR: you will revisit LinkSnap in M41 (system design method) and M42 (case studies).</p>`
};
// ================================================================== 95_quiz.js
/* M04 module quiz: 20 questions across the nine lessons (M04.01–M04.09) */
var QUIZ = {
  passMark: 70,
  questions: [
    // ---------------------------------------------------------------- M04.01 thinking like an architect
    { id: "M04-Q01", type: "single", domain: "D2", task: "2.2", level: 200,
      stem: "A product team agrees a service level objective (SLO) of <strong>99.99% availability</strong>, measured over a 30-day month. What is the MAXIMUM total downtime the service can have in a month and still meet the SLO?",
      options: [
        { t: "About 4.3 minutes", c: true, why: "30 days × 24 h × 60 min = 43,200 min. 0.01% of that is 4.32 minutes. That is the whole monthly error budget." },
        { t: "About 43 minutes", c: false, why: "43.2 minutes per month is the budget for 99.9% (three nines), ten times more than four nines allows." },
        { t: "About 52.6 minutes", c: false, why: "52.6 minutes is the downtime allowed by 99.99% over a whole <em>year</em> (8,760 h), not a month." },
        { t: "About 21.6 minutes", c: false, why: "21.6 minutes per month corresponds to 99.95%." }
      ] },
    { id: "M04-Q02", type: "single", domain: "D2", task: "2.2", level: 300,
      stem: "A request must pass through three components <strong>in series</strong>, and fails if any one of them is down: a load balancer (99.99% available), a web tier (99.9%) and a database (99.95%). Assuming failures are independent, what is the approximate availability of the whole request path?",
      options: [
        { t: "99.84%", c: true, why: "Serial availability is the product: 0.9999 × 0.999 × 0.9995 ≈ 0.9984. Every component in series lowers the total below its weakest part." },
        { t: "99.9%", c: false, why: "That assumes the system is only as available as its weakest component. In series, the failures of all components add up, so the total is lower than the weakest one." },
        { t: "99.95%", c: false, why: "Availabilities in series are multiplied, not averaged." },
        { t: "99.99%", c: false, why: "That is the availability of the best component only. Adding components in series can never raise availability." }
      ] },
    { id: "M04-Q03", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "A new API is expected to receive <strong>50 million requests per day</strong>. The team assumes the busiest period carries <strong>3× the average rate</strong>. Roughly what peak throughput must the design be load-tested for?",
      options: [
        { t: "About 1,700 requests per second", c: true, why: "50,000,000 ÷ 86,400 s ≈ 579 req/s on average; × 3 for the peak ≈ 1,736 req/s. Always size and test for the peak, and state the peak factor as an assumption." },
        { t: "About 580 requests per second", c: false, why: "That is the daily average. Sizing for the average guarantees overload during the peak." },
        { t: "About 17,000 requests per second", c: false, why: "That is ten times too high; check the division by 86,400 seconds (≈ 10<sup>5</sup>)." },
        { t: "About 104,000 requests per second", c: false, why: "About 104,000 is the peak per <em>minute</em> (1,736 × 60). Mixing units is a classic estimation slip: keep everything in seconds." }
      ] },

    // ---------------------------------------------------------------- M04.02 scalability
    { id: "M04-Q04", type: "multi", domain: "D2", task: "2.1", level: 200,
      stem: "A web application runs on EC2 instances in an Auto Scaling group behind an Application Load Balancer. User sessions are stored in each instance's memory, so users are logged out whenever the group scales in or an instance is replaced. Which actions make the web tier stateless so that it can scale horizontally without losing sessions?",
      options: [
        { t: "Store session data in Amazon ElastiCache (Redis OSS or Valkey)", c: true, why: "An external in-memory store keeps sessions outside the instances, with sub-millisecond reads. Any instance can serve any user, and instances can come and go." },
        { t: "Store session data in an Amazon DynamoDB table with a TTL attribute", c: true, why: "DynamoDB is a durable, fully managed session store; TTL expires old sessions automatically. Like ElastiCache, it removes state from the instances." },
        { t: "Enable sticky sessions (session affinity) on the ALB", c: false, why: "Stickiness routes a user back to the same instance but the state still lives on it. When that instance is terminated, the session is lost, and stickiness also unbalances load." },
        { t: "Move to larger instance types so fewer instances are needed", c: false, why: "That is vertical scaling. It reduces how often the problem happens but sessions are still lost on any replacement, and it caps how far you can scale." },
        { t: "Write sessions to an EBS volume attached to each instance", c: false, why: "EBS volumes are zonal and attached to one instance, so the state is still tied to a single server." }
      ] },
    { id: "M04-Q05", type: "single", domain: "D2", task: "2.1", level: 200,
      stem: "An order-intake web tier calls a back-end fulfilment service synchronously. During flash sales the back end cannot keep up, requests time out and <strong>orders are lost</strong>. The business accepts that orders may be fulfilled a few minutes later. Which design change BEST improves resilience?",
      options: [
        { t: "Put an Amazon SQS queue between the tiers and scale the back-end workers on queue depth", c: true, why: "The queue absorbs the spike durably (load levelling), the web tier responds as soon as the message is stored, and workers drain the backlog at their own pace. Scaling on ApproximateNumberOfMessagesVisible adds workers when the backlog grows." },
        { t: "Move the back end to larger instances", c: false, why: "Vertical scaling raises the ceiling but the tiers stay tightly coupled; a bigger spike still loses orders, and you pay for peak capacity all the time." },
        { t: "Publish each order to an Amazon SNS topic that the back end subscribes to over HTTPS", c: false, why: "SNS pushes messages immediately. It doesn't hold a backlog for a slow consumer the way a queue does, so an overwhelmed endpoint still drops work after retries are exhausted." },
        { t: "Make the web tier retry each failed call immediately until it succeeds", c: false, why: "Immediate retries add even more load to an overloaded service (a retry storm) and keep users waiting." }
      ] },

    // ---------------------------------------------------------------- M04.03 availability and reliability
    { id: "M04-Q06", type: "single", domain: "D2", task: "2.2", level: 300,
      stem: "A company needs a disaster recovery plan for a critical application in a second AWS Region. Requirements: <strong>RPO of a few minutes</strong>, <strong>RTO under one hour</strong>, at the <strong>LOWEST cost</strong>. Which strategy fits BEST?",
      options: [
        { t: "Pilot light: replicate the database continuously to the DR Region and keep the rest of the infrastructure defined but scaled to zero until failover", c: true, why: "Continuous data replication meets an RPO of minutes; starting the pre-defined compute (for example from IaC and AMIs) typically takes tens of minutes, inside the 1-hour RTO, and you pay mainly for the replicated data while idle." },
        { t: "Backup and restore: copy nightly snapshots to the DR Region", c: false, why: "Nightly backups give an RPO of up to 24 hours, and restoring everything usually takes hours, so both targets are missed." },
        { t: "Warm standby: run a scaled-down but fully functional copy of the stack in the DR Region", c: false, why: "Warm standby meets the targets (RTO in minutes) but runs compute all the time, so it costs more than needed for a 1-hour RTO." },
        { t: "Multi-site active/active across both Regions", c: false, why: "Near-zero RPO/RTO, but it is the most expensive and complex option, far beyond the stated requirements." }
      ] },
    { id: "M04-Q07", type: "multi", domain: "D2", task: "2.2", level: 200,
      stem: "An application runs on EC2 instances in two Availability Zones behind an Application Load Balancer. Private instances reach the internet through <strong>one NAT gateway in AZ-a</strong>. Data is stored in a <strong>Single-AZ Amazon RDS instance</strong> in AZ-a, shared files in Amazon EFS (Regional/Standard), and static assets in Amazon S3. Which components are single points of failure if AZ-a fails?",
      options: [
        { t: "The NAT gateway", c: true, why: "A NAT gateway is a zonal resource. If AZ-a fails, instances in AZ-b lose outbound internet access. Deploy one NAT gateway per AZ with per-AZ route tables." },
        { t: "The Single-AZ RDS instance", c: true, why: "A Single-AZ database lives in one AZ. Use a Multi-AZ deployment so a synchronous standby in another AZ takes over automatically." },
        { t: "The Application Load Balancer", c: false, why: "An ALB is deployed across the AZs you enable, with nodes in each, so it keeps serving from AZ-b." },
        { t: "The Amazon EFS file system", c: false, why: "EFS Regional (Standard) storage stores data redundantly across multiple AZs and provides mount targets per AZ." },
        { t: "The S3 bucket", c: false, why: "S3 Standard stores objects across at least three AZs and is a Regional service." }
      ] },
    { id: "M04-Q08", type: "single", domain: "D2", task: "2.2", level: 300,
      stem: "A component fails on average once every 30 days (MTBF = 720 hours). Today an engineer restores it manually, which takes 1 hour (MTTR). The team automates detection and recovery so that MTTR falls to <strong>6 minutes</strong>, without changing how often it fails. What is the component's approximate availability after the change?",
      options: [
        { t: "About 99.986%", c: true, why: "Availability = MTBF ÷ (MTBF + MTTR) = 720 ÷ 720.1 ≈ 0.99986. Cutting recovery time tenfold improved availability by almost a whole \"nine\" without making failures rarer." },
        { t: "About 99.86%", c: false, why: "That is the availability <em>before</em> the change: 720 ÷ 721 ≈ 0.9986." },
        { t: "About 99.9%", c: false, why: "That doesn't follow from the formula; recompute MTBF ÷ (MTBF + MTTR) with MTTR = 0.1 h." },
        { t: "Unchanged, because the failure rate is the same", c: false, why: "Availability depends on both how often you fail (MTBF) and how quickly you recover (MTTR). Faster recovery directly reduces downtime." }
      ] },

    // ---------------------------------------------------------------- M04.04 consistency
    { id: "M04-Q09", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "A profile service stores data in Amazon DynamoDB. Right after users save changes, the next page sometimes shows their <strong>old</strong> profile. The application reads the item with <code>GetItem</code> immediately after <code>PutItem</code>, in the same Region. Which change fixes this with the LEAST effort?",
      options: [
        { t: "Set <code>ConsistentRead</code> to true on the <code>GetItem</code> call that follows the write", c: true, why: "DynamoDB reads are eventually consistent by default. A strongly consistent read returns the latest acknowledged write in that Region. It costs twice the read capacity of an eventually consistent read, so use it only where needed." },
        { t: "Put DynamoDB Accelerator (DAX) in front of the table", c: false, why: "DAX caches items for eventually consistent reads, so it can serve stale data too. Strongly consistent reads pass through DAX to DynamoDB anyway." },
        { t: "Convert the table to a global table", c: false, why: "Global tables replicate across Regions, eventually consistent by default. That adds replicas; it doesn't make a same-Region read fresher." },
        { t: "Increase the table's provisioned read capacity", c: false, why: "Capacity affects throttling, not consistency. More capacity still serves eventually consistent reads." }
      ] },
    { id: "M04-Q10", type: "multi", domain: "D3", task: "3.3", level: 300,
      stem: "Which statements about the CAP theorem and PACELC are correct?",
      options: [
        { t: "When a network partition occurs, a replicated system must choose between returning possibly stale data (availability) and refusing some requests (consistency)", c: true, why: "That is the actual content of CAP: partitions happen, so P is not optional; the choice is C or A <em>during</em> the partition." },
        { t: "PACELC adds that even without a partition, a replicated system trades latency against consistency", c: true, why: "Else (no partition), waiting for replicas to confirm gives consistency at the cost of latency. RDS Multi-AZ's synchronous standby is an example: each commit waits for the standby (PC/EC)." },
        { t: "A distributed database can choose \"CA\" and ignore partitions if it runs on a reliable cloud network", c: false, why: "Networks between nodes can always partition, even inside a Region. A system that ignores P simply behaves unpredictably when one happens." },
        { t: "Asynchronous read replicas favour consistency over availability", c: false, why: "Asynchronous replicas keep serving reads even when they lag, so they favour availability and low latency over consistency." },
        { t: "Eventual consistency means acknowledged writes may be permanently lost", c: false, why: "Eventual consistency is about <em>visibility</em>: replicas converge to the latest write given time. Durability of acknowledged writes is a separate property." }
      ] },

    // ---------------------------------------------------------------- M04.05 latency, throughput, performance
    { id: "M04-Q11", type: "single", domain: "D3", task: "3.2", level: 200,
      stem: "An API's average latency in Amazon CloudWatch is 80 ms, yet many customers complain that it is slow. Investigation shows that 1 in 100 requests takes about 1.8 seconds. Which metric should the team use for its latency SLO and alarm?",
      options: [
        { t: "The p99 latency percentile statistic", c: true, why: "Percentiles describe what users actually experience. p99 = 1.8 s means 1% of requests (often from your busiest customers) are slow, which the average hides. CloudWatch supports percentile statistics such as p99." },
        { t: "The average (mean) latency", c: false, why: "The mean blends a few very slow requests into many fast ones and hides tail latency." },
        { t: "The maximum latency", c: false, why: "The maximum is dominated by a single outlier and is too noisy for an SLO." },
        { t: "The sum of latency per minute", c: false, why: "The sum mixes traffic volume with latency, so it rises when traffic grows even if each request is fast." }
      ] },
    { id: "M04-Q12", type: "multi", domain: "D3", task: "3.4", level: 200,
      stem: "A global e-commerce site has two performance problems: (1) customers on other continents wait for product images served from an S3 bucket in one Region, and (2) the same product-catalogue queries run thousands of times per minute against an Amazon RDS for PostgreSQL database, which is near 90% CPU. Which actions address these problems?",
      options: [
        { t: "Serve the images through an Amazon CloudFront distribution with the S3 bucket as the origin", c: true, why: "CloudFront caches the images at edge locations close to users, cutting latency and taking load off the origin." },
        { t: "Add Amazon ElastiCache in front of the database and cache catalogue query results (cache-aside with a TTL)", c: true, why: "Repeated read queries are served from memory in sub-millisecond time, so the database CPU drops. A TTL bounds how stale the catalogue can get." },
        { t: "Add DynamoDB Accelerator (DAX)", c: false, why: "DAX is a cache only for DynamoDB tables; it cannot cache PostgreSQL queries." },
        { t: "Enable S3 Transfer Acceleration on the bucket", c: false, why: "Transfer Acceleration speeds up long-distance <em>uploads</em> (and transfers) to S3; it doesn't cache content near readers like a CDN." },
        { t: "Move the database to a larger instance class", c: false, why: "Vertical scaling buys time at higher cost but leaves the repeated identical queries in place; caching removes them." }
      ] },
    { id: "M04-Q13", type: "single", domain: "D3", task: "3.3", level: 200,
      stem: "AWS Lambda functions query an Amazon RDS for MySQL database. During traffic spikes Lambda scales to thousands of concurrent executions and the database runs out of connections. Which solution has the LEAST operational overhead?",
      options: [
        { t: "Put Amazon RDS Proxy between the functions and the database", c: true, why: "RDS Proxy is a managed connection pool: thousands of function connections are multiplexed over a smaller, reused set of database connections, and it also speeds up failover." },
        { t: "Move to a larger DB instance class to raise <code>max_connections</code>", c: false, why: "That costs more and only moves the limit; Lambda concurrency can still exceed it." },
        { t: "Set the function's reserved concurrency to 1", c: false, why: "That protects the database by throttling almost all requests, which breaks the application." },
        { t: "Run a self-managed connection pooler such as PgBouncer or ProxySQL on EC2", c: false, why: "It can work but you must run, patch and make it highly available yourself: more overhead than the managed RDS Proxy." }
      ] },

    // ---------------------------------------------------------------- M04.06 fallacies of distributed computing
    { id: "M04-Q14", type: "multi", domain: "D2", task: "2.1", level: 300,
      stem: "An order service calls a third-party payment API that occasionally times out. The current code retries immediately in a loop. This has caused <strong>duplicate charges</strong> and, during an outage, a <strong>retry storm</strong> that overloaded the provider. Which changes should the team make?",
      options: [
        { t: "Retry with exponential backoff and jitter, and cap the number of attempts", c: true, why: "Growing, randomised delays spread retries out so clients don't hammer a struggling dependency in sync; a cap stops endless retrying (combine with a circuit breaker for long outages)." },
        { t: "Send an idempotency key with each payment request so that a retried request is processed only once", c: true, why: "A timeout doesn't tell you whether the charge happened. With an idempotency key the provider recognises the retry and returns the original result instead of charging again." },
        { t: "Increase the client timeout to 15 minutes so requests never time out", c: false, why: "Very long timeouts tie up threads and connections and make users wait; the call can still fail, and the duplicate problem remains." },
        { t: "Disable retries completely", c: false, why: "Most timeouts are transient; without retries, many payments fail that would have succeeded. The fix is safe retries, not none." },
        { t: "Retry from several threads in parallel to get the fastest answer", c: false, why: "Parallel duplicate requests multiply both the load and the risk of duplicate charges." }
      ] },
    { id: "M04-Q15", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "Microservices in private subnets of one VPC call each other over plain HTTP because \"the VPC is private\". A new compliance requirement says that <strong>all data in transit must be encrypted</strong>, including traffic inside the VPC. Which approach meets the requirement?",
      options: [
        { t: "Use TLS for service-to-service traffic, for example HTTPS listeners with ACM certificates on internal load balancers and TLS between services and their targets", c: true, why: "\"The network is secure\" is one of the fallacies of distributed computing. TLS encrypts each connection end to end regardless of which network the packets cross." },
        { t: "Tighten the security groups so only the calling services can connect", c: false, why: "Security groups control who can connect; they don't encrypt anything." },
        { t: "Move the services into separate subnets with stricter network ACLs", c: false, why: "NACLs filter traffic by address and port. The payloads are still plaintext." },
        { t: "Enable VPC Flow Logs to monitor the traffic", c: false, why: "Flow Logs record metadata about connections for auditing; they provide no encryption." }
      ] },
    { id: "M04-Q16", type: "single", domain: "D4", task: "4.4", level: 200,
      stem: "EC2 instances in private subnets download several terabytes per day from Amazon S3 in the same Region. The traffic goes through a NAT gateway, and the NAT data-processing charges have become a large part of the bill. What is the MOST cost-effective change?",
      options: [
        { t: "Create an S3 gateway VPC endpoint and add it to the private subnets' route tables", c: true, why: "Gateway endpoints for S3 (and DynamoDB) have no hourly or per-GB charge. S3 traffic then bypasses the NAT gateway entirely: \"transport cost is zero\" is a fallacy, so design to avoid paid hops." },
        { t: "Create an S3 interface VPC endpoint (AWS PrivateLink)", c: false, why: "An interface endpoint also keeps traffic private but charges per hour per AZ plus per GB processed, so it costs more than the free gateway endpoint for this case." },
        { t: "Replace the NAT gateway with a NAT instance", c: false, why: "It removes the NAT processing charge but adds instance cost, a bandwidth ceiling and operational work, and the traffic still takes an unnecessary path." },
        { t: "Add a second NAT gateway in another AZ", c: false, why: "That improves availability but doubles the hourly cost and still charges per GB processed." }
      ] },

    // ---------------------------------------------------------------- M04.07 data storage formats
    { id: "M04-Q17", type: "single", domain: "D4", task: "4.1", level: 300,
      stem: "Analysts use Amazon Athena every day on 5 TB of CSV log files in Amazon S3. Most queries filter on a date range and read only 3 of the 40 columns. Athena charges by data scanned, and the bill is high. Which change is the MOST cost-effective?",
      options: [
        { t: "Convert the data to compressed Apache Parquet and partition it by date in S3", c: true, why: "Columnar Parquet lets Athena read only the 3 needed columns, compression shrinks what is read, and date partitions let it skip whole folders. Scanned data, cost and run time all drop sharply." },
        { t: "Compress the CSV files with gzip", c: false, why: "Compression reduces bytes scanned, but CSV is row-oriented, so Athena must still read every column of every row in range." },
        { t: "Load the logs into an Amazon RDS database and query them there", c: false, why: "RDS is designed for OLTP, not scanning terabytes of logs; it adds cost and administration and performs poorly for this analytical workload." },
        { t: "Move the files to S3 Glacier Flexible Retrieval", c: false, why: "Lower storage cost, but Athena can't query archived objects without restoring them first; it doesn't fit daily analysis." }
      ] },
    { id: "M04-Q18", type: "single", domain: "D1", task: "1.3", level: 200,
      stem: "A web application running on many EC2 instances in an Auto Scaling group lets users upload scanned identity documents. The documents must be stored durably, encrypted at rest, shared by all instances, and later downloaded by their owner through short-lived links. Which storage choice fits BEST?",
      options: [
        { t: "Amazon S3 object storage with default encryption (SSE-S3 or SSE-KMS), Block Public Access on, and presigned URLs for downloads", c: true, why: "Object storage suits whole files written once and read many times; S3 is shared, highly durable and encrypted by default, and presigned URLs grant time-limited access to one object without making anything public." },
        { t: "An encrypted Amazon EBS volume attached to one of the instances", c: false, why: "EBS is block storage attached to a single instance in one AZ; other instances can't share it (Multi-Attach is limited to specific cases), and it gives no per-user download links." },
        { t: "The instance store of each EC2 instance", c: false, why: "Instance store is ephemeral: data is lost when the instance stops or is replaced, and it isn't shared." },
        { t: "An Amazon EFS file system mounted on every instance, served through a public web folder", c: false, why: "EFS can be shared, but exposing documents through a public folder breaks access control; for per-user, time-limited access to files, S3 with presigned URLs is the simpler and safer fit." }
      ] },

    // ---------------------------------------------------------------- M04.08 monolith → microservices
    { id: "M04-Q19", type: "single", domain: "D1", task: "1.2", level: 300,
      stem: "A company is breaking up a monolith using the <strong>strangler fig</strong> pattern. The first new microservice handles <code>/payments</code> and runs on Amazon ECS in private subnets behind an internal Application Load Balancer. Clients must keep using one public URL, all other paths must still go to the monolith, and the new service must <strong>not be reachable directly from the internet</strong>. Which design meets these requirements with the LEAST operational overhead?",
      options: [
        { t: "Use an Amazon API Gateway HTTP API as the front door: route <code>/payments</code> through a VPC link to the internal ALB, and send all other routes to the monolith", c: true, why: "API Gateway gives one public entry point with per-route integrations, so traffic moves to new services route by route (the strangler façade). A VPC link reaches the private ALB without exposing it, and API Gateway adds authorisation and throttling." },
        { t: "Give the ECS tasks public IP addresses and let clients call the new service directly", c: false, why: "That exposes the service to the internet and makes clients track two URLs, violating both requirements." },
        { t: "Change the internal ALB to internet-facing and update DNS for <code>/payments</code>", c: false, why: "DNS works on host names, not URL paths, and an internet-facing ALB makes the service directly reachable." },
        { t: "Rewrite the whole monolith as microservices and switch over in one release", c: false, why: "A \"big bang\" rewrite is the risk the strangler fig pattern exists to avoid; it also delivers nothing until the very end." }
      ] },

    // ---------------------------------------------------------------- M04.09 trade-offs
    { id: "M04-Q20", type: "single", domain: "D4", task: "4.2", level: 200,
      stem: "A nightly batch job runs a CPU-heavy report for about 3 hours. It saves checkpoints, so it can resume if interrupted, and it only has to finish before 08:00. The requirement is the <strong>MOST cost-effective</strong> compute option. Which should the architect choose?",
      options: [
        { t: "EC2 Spot Instances (for example through AWS Batch with a Spot compute environment), resuming from checkpoints after interruptions", c: true, why: "The decisive constraint is cost, and the job is interruptible and flexible in time, which is exactly the Spot profile: large discounts in exchange for possible interruption." },
        { t: "On-Demand EC2 instances", c: false, why: "On-Demand works but costs much more than Spot; nothing in the requirements needs uninterrupted capacity." },
        { t: "A 1-year Compute Savings Plan sized for the job", c: false, why: "A Savings Plan commits to an hourly spend for every hour of the term, but the job runs only about 3 hours a day, so most of the commitment would be wasted." },
        { t: "AWS Lambda functions", c: false, why: "Lambda has a 15-minute maximum duration per invocation, so a 3-hour CPU job would need to be re-engineered; it's not the natural fit." }
      ] }
  ]
};

  window.LMS_MODULES["M04"] = {
    summary: "How architects think before they choose services: turning requirements into measurable quality attributes, estimating load, and reasoning about scalability, availability, consistency, latency and failure in distributed systems. It covers how data is stored, how monoliths evolve into services, and how to make and record trade-off decisions. Every concept is mapped to the AWS services and patterns that implement it.",
    objectives: [
      "Translate business needs into functional and non-functional requirements, SLOs and back-of-envelope capacity estimates",
      "Design for horizontal scalability with stateless tiers, externalised state, caching and queues",
      "Calculate composite availability, eliminate single points of failure, and choose recovery strategies from RPO and RTO",
      "Explain consistency models, quorum, CAP and PACELC, and classify AWS data services accordingly",
      "Reason about latency percentiles and bottlenecks, and design remote calls that survive the fallacies of distributed computing",
      "Choose block, file or object storage, row or columnar formats, OLTP or OLAP, and monolith or microservices for a scenario",
      "Make trade-offs explicit with weighted decision matrices and Architecture Decision Records (ADRs)"
    ],
    lessons: LESSONS,
    labs: [LAB],
    quiz: QUIZ,
    flashcards: FLASHCARDS
  };
})();

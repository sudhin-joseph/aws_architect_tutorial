/* M00 – Orientation, exam blueprint and study skills */
window.LMS_MODULES["M00"] = {
  review: {
    version: "m00-pilot-2",
    reviewedAt: "2026-10-08",
    nextReview: "2027-01-08",
    scope: "SAA-C03 orientation and a sampled diagnostic; not complete exam coverage",
    sources: [
      { title: "AWS SAA-C03 exam guide", url: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html" },
      { title: "IAM security best practices", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
      { title: "AWS Budgets and notification delays", url: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html" },
      { title: "SCP scope and exceptions", url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html" },
      { title: "SNS FIFO archiving and replay", url: "https://docs.aws.amazon.com/sns/latest/dg/fifo-message-archiving-replay.html" },
      { title: "S3 Bucket Keys and KMS audit events", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html" },
      { title: "Current exam service exclusions", url: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-out-of-scope-services.html" }
    ]
  },
  summary: "Start here. Learn how the academy works, what the SAA-C03 exam measures, how AWS writes its questions, and how to study so knowledge sticks. Then take the diagnostic test to get your personalised starting point.",
  objectives: [
    "Navigate the academy's paths, levels, gating and progress tracking",
    "Describe the SAA-C03 exam format, scoring and the four content domains with their weightings",
    "Deconstruct a scenario question: find the constraint keyword and eliminate distractors",
    "Set up a sustainable study system (spaced repetition, error log, decision tables)",
    "Identify your strongest and weakest exam domains with the diagnostic test"
  ],

  lessons: [
    // ------------------------------------------------------------------ M00.01
    {
      id: "M00.01", title: "How this academy works", level: 100, minutes: 15,
      objectives: [
        "Explain the content hierarchy: path → track → module → lesson",
        "Interpret the 100/200/300/400 level tags",
        "Describe how completion, gating and progress saving work"
      ],
      sections: [
        { type: "why", html: `
<p>This academy is a self-paced learning pilot. M00–M09 currently have learning content; the other modules show planned outlines. Start by choosing a study goal, then use lessons, recall practice and hands-on work together. The full-path hour estimates are provisional and have not been measured with learners.</p>` },
        { type: "concept", title: "The structure", html: `
<ul>
  <li><strong>Learning path:</strong> your goal. The <em>SAA-C03 Exam Path</em> (~150 h) or the <em>Full Architect Path</em> (~230 h, adds DevOps/IaC and system design).</li>
  <li><strong>Track:</strong> a subject area, e.g. <em>C · Networking</em>. There are 15 tracks.</li>
  <li><strong>Module:</strong> a unit with lessons, hands-on labs, a module quiz and a flashcard deck. You earn a 🏅 badge when it is complete.</li>
  <li><strong>Lesson:</strong> use the duration shown on each lesson as an estimate; deeper lessons can take an hour or more. Lessons combine explanations, examples, knowledge checks and references. Practice and revision need additional time.</li>
</ul>
<h3>Content levels</h3>
<table>
<thead><tr><th>Level</th><th>Name</th><th>What you'll do</th></tr></thead>
<tbody>
<tr><td><span class="lvl lvl-100">100</span></td><td>Foundational</td><td>Learn vocabulary and concepts; guided console tours</td></tr>
<tr><td><span class="lvl lvl-200">200</span></td><td>Intermediate</td><td>Understand how a service works and configure it hands-on</td></tr>
<tr><td><span class="lvl lvl-300">300</span></td><td>Advanced (exam level)</td><td>Make scenario-based design decisions and trade-offs</td></tr>
<tr><td><span class="lvl lvl-400">400</span></td><td>Expert (beyond the exam)</td><td>Multi-account/multi-Region design, IaC, automation, system design</td></tr>
</tbody></table>
<h3>Choose your goal</h3>
<ul>
  <li><strong>Certification:</strong> prioritise the Exam Path, domain practice and unseen timed mock exams. CloudFormation concepts belong here; detailed CDK implementation is optional.</li>
  <li><strong>Certification plus DevOps:</strong> add the planned CloudFormation/CDK, CI/CD and capstone work after the core service topics. Budget additional weeks.</li>
  <li><strong>Architect development:</strong> add requirements, ADRs, failure testing, operational reviews and the AI-agent elective. A course or level label does not certify professional expertise.</li>
</ul>
<p>Path selection is guidance in this pilot. Pre-tests, automatic test-out, full mock exams and verified certificates are planned features.</p>` },
        { type: "aws", title: "How completion works", html: `
<ul>
  <li><strong>Lesson:</strong> answer every knowledge-check question, then click <em>Mark lesson complete</em>. Wrong answers still count, because the point is to read the explanations.</li>
  <li><strong>Lab:</strong> run the validation commands and cleanup, then tick the steps and mark complete. This is self-reported completion; the app does not inspect your AWS account.</li>
  <li><strong>Module quiz:</strong> score at least the pass mark (usually 70%). Questions and options are shuffled on every attempt.</li>
  <li><strong>Module complete:</strong> all lessons + any labs + any module quiz passed. M00 has four reading lessons and one diagnostic lesson, with no lab or module quiz.</li>
  <li><strong>Gating:</strong> a module unlocks when its prerequisite modules are complete. Experienced learners can switch off strict gating on the <a href="#/progress">Progress</a> page.</li>
</ul>
<div class="callout"><strong>Where is my progress saved?</strong> In this browser: localStorage first, then cookies, then sessionStorage. Nothing is sent to a server. Use <em>Export progress</em> on the Progress page to back up or move to another device.</div>` },
        { type: "demo", title: "Try it", html: `
<ol>
  <li>Open the <a href="#/catalog">Catalog</a> and find Track C (Networking). Modules marked <em>Coming soon</em> show their planned lessons.</li>
  <li>Open the <a href="#/progress">Progress</a> page and note which storage method your browser is using.</li>
  <li>Come back here and complete the knowledge check below.</li>
</ol>` },
        { type: "exam", title: "Lab safety: read this now", html: `
<p>Labs use a <strong>real AWS account</strong>, and real accounts cost real money. Before your first lab (L01, in module M01) you will:</p>
<ul>
  <li>Use a dedicated learning account. Protect root with MFA; use IAM Identity Center or federated roles for daily access.</li>
  <li>Configure actual and forecast AWS Budget alerts against a budget you can afford (for example $10). <strong>Alerts are delayed and do not cap spending or stop resources.</strong> Free Tier eligibility varies; check the account plan and each service before deploying.</li>
  <li>Record the Region, resources and intended deletion time before starting. Follow the lab cleanup and verify that billable resources, retained snapshots, volumes and addresses have been removed where appropriate. NAT gateways, load balancers and databases can continue charging while you are away.</li>
  <li>M00 itself deploys nothing and requires no AWS credentials.</li>
</ul>` },
        { type: "summary", html: `
<ul>
  <li>Path → track → module → lesson. Choose the SAA-C03 Exam Path or the Full Architect Path.</li>
  <li>Levels: 100 foundational, 200 intermediate, 300 exam-level decisions, 400 beyond the exam.</li>
  <li>A lesson completes after its knowledge check; a module completes with all lessons, labs and a passed quiz.</li>
  <li>Progress lives in your browser; export it to back it up.</li>
  <li>Labs use a real AWS account: MFA on root, a Budget, and always do the clean-up.</li>
</ul>` }
      ],
      check: [
        { id: "M00.01-k1", type: "single", stem: "Which level tag marks content that goes <em>beyond</em> the SAA-C03 exam (e.g. writing CDK pipelines or multi-Region active-active design)?",
          options: [
            { t: "100", c: false, why: "100 is foundational vocabulary and concepts." },
            { t: "200", c: false, why: "200 covers how a service works, with hands-on configuration." },
            { t: "300", c: false, why: "300 is exam level: scenario-based trade-offs." },
            { t: "400", c: true, why: "400 is expert level, beyond the exam: IaC, automation and deep design." }
          ] },
        { id: "M00.01-k2", type: "single", stem: "You get 2 of 4 knowledge-check questions wrong. Can you still complete the lesson?",
          options: [
            { t: "Yes. Answering every question (right or wrong) unlocks completion; the goal is to read the explanations.", c: true, why: "Knowledge checks are formative. Quizzes, not checks, have pass marks." },
            { t: "No. You need 100% on the knowledge check.", c: false, why: "Only module quizzes have a pass mark." },
            { t: "No. You must wait 24 hours and retry.", c: false, why: "There are no cool-down periods." },
            { t: "Only if strict gating is turned off.", c: false, why: "Gating controls module access, not lesson completion." }
          ] },
        { id: "M00.01-k3", type: "single", stem: "Your progress is stored only in this browser. What is the safest way to continue on a new laptop?",
          options: [
            { t: "Export progress as JSON on the Progress page and import it on the new laptop.", c: true, why: "Export/import is the supported way to move progress between browsers." },
            { t: "Sign in with your AWS account.", c: false, why: "The academy has no server-side accounts. Progress is local." },
            { t: "Nothing; it syncs automatically.", c: false, why: "There is no automatic sync." },
            { t: "Copy the index.html file.", c: false, why: "Progress lives in browser storage, not in the app files." }
          ] }
      ],
      references: ["LMS blueprint: <code>LMS_PLAN.md</code> §2 Course architecture", "Study plan: <code>STUDY_PLAN.md</code>"]
    },

    // ------------------------------------------------------------------ M00.02
    {
      id: "M00.02", title: "The SAA-C03 exam", level: 100, minutes: 25,
      objectives: [
        "State the exam format, scoring model and passing score",
        "List the four content domains, their weightings and task statements",
        "Distinguish in-scope from out-of-scope services and explain why it matters"
      ],
      sections: [
        { type: "why", html: `
<p>Use the official exam guide to organise your study around architecture tasks. AWS states that the guide is not a comprehensive list of exam content. Pair it with current service documentation and scenario practice; no course can guarantee every question you will encounter.</p>` },
        { type: "concept", title: "Format and scoring", html: `
<table>
<tbody>
<tr><th>Questions</th><td>65 in total: <strong>50 scored + 15 unscored</strong>. The unscored questions are being trialled and are not identified.</td></tr>
<tr><th>Question types</th><td><strong>Multiple choice:</strong> 1 correct answer, 3 distractors. <strong>Multiple response:</strong> 2 or more correct answers out of 5 or more options. Scored all-or-nothing.</td></tr>
<tr><th>Time</th><td>130 minutes, about 2 minutes per question</td></tr>
<tr><th>Score</th><td>Scaled 100–1,000. <strong>720 to pass.</strong> Pass/fail result.</td></tr>
<tr><th>Scoring model</th><td><strong>Compensatory:</strong> you need to pass overall, not each domain</td></tr>
<tr><th>Guessing</th><td>No penalty. <strong>Never leave a question blank.</strong></td></tr>
<tr><th>Delivery</th><td>Pearson VUE test centre or online proctored</td></tr>
</tbody></table>
<p class="muted small">Fees, retake waiting periods and validity (currently 3 years) can change. Confirm them on the AWS Certification site before booking.</p>
<h3>The four domains</h3>
<table>
<thead><tr><th>Domain</th><th>Weight</th><th>Task statements</th></tr></thead>
<tbody>
<tr><td><strong>1 · Design Secure Architectures</strong></td><td>30%</td><td>1.1 Secure access to AWS resources · 1.2 Secure workloads and applications · 1.3 Data security controls</td></tr>
<tr><td><strong>2 · Design Resilient Architectures</strong></td><td>26%</td><td>2.1 Scalable and loosely coupled architectures · 2.2 Highly available and/or fault-tolerant architectures</td></tr>
<tr><td><strong>3 · Design High-Performing Architectures</strong></td><td>24%</td><td>3.1 Storage · 3.2 Compute · 3.3 Databases · 3.4 Networking · 3.5 Data ingestion and transformation</td></tr>
<tr><td><strong>4 · Design Cost-Optimized Architectures</strong></td><td>20%</td><td>4.1 Storage · 4.2 Compute · 4.3 Databases · 4.4 Networking</td></tr>
</tbody></table>
<p>Of the 50 scored questions, that is roughly <strong>15 security, 13 resilience, 12 performance and 10 cost</strong> questions.</p>` },
        { type: "aws", title: "Scope: what can and cannot appear", html: `
<p>The guide lists <strong>in-scope services</strong> by category: analytics, application integration, compute, containers, database, networking, security, storage, and others. It also lists <strong>out-of-scope services</strong> that will never be a correct answer. Notable out-of-scope items for this academy:</p>
<div class="keyword-list"><span>AWS CDK</span><span>CodeBuild</span><span>CodeCommit</span><span>CodeDeploy</span><span>CloudShell</span><span>Lightsail</span><span>MWAA</span><span>IoT services</span><span>Cloud Map</span><span>Elemental Media*</span></div>
<p>So CDK is taught in Track L because architects use it daily, but on the exam the IaC answer is <strong>CloudFormation</strong>.</p>
<div class="callout"><strong>Name changes to watch for:</strong> the current guide uses <em>Amazon Quick</em> (formerly QuickSight) and <em>Amazon Data Firehose</em> (formerly Kinesis Data Firehose). The exam shows official short names (e.g. "Amazon SNS"), and the in-exam Help lists the full names.</div>` },
        { type: "exam", title: "Exam lens: what this means for your study", html: `
<ul>
  <li><strong>Security is the biggest domain (30%).</strong> IAM policy logic, KMS, VPC security and multi-account guardrails deserve extra time.</li>
  <li>Every domain mixes services. A "cost" question about NAT gateways is still a networking question.</li>
  <li>The exam tests <strong>judgement</strong> ("which is most cost-effective / least operational overhead"), not syntax or console clicks.</li>
  <li>Target <strong>≥ 80%</strong> on unseen mock exams before booking. The 720 scaled pass mark is not 72% raw, so build a margin.</li>
</ul>` },
        { type: "architect", html: `
<p>The four exam domains map onto four of the six <strong>AWS Well-Architected</strong> pillars: Security, Reliability, Performance Efficiency and Cost Optimization. The other two pillars, <em>Operational Excellence</em> and <em>Sustainability</em>, still shape real designs and appear indirectly (automation, managed services, right-sizing). You'll meet the framework in M01.06 and in depth in M43.</p>` },
        { type: "summary", html: `
<ul>
  <li>65 questions (50 scored + 15 unscored, which you can't identify), 130 minutes, multiple choice and multiple response.</li>
  <li>Scaled score 100–1000; 720 to pass. Scoring is compensatory: you pass on the overall score, not per domain.</li>
  <li>Domains: Secure 30%, Resilient 26%, High-performing 24%, Cost-optimized 20%.</li>
  <li>No penalty for guessing, so never leave a question blank.</li>
  <li>Study in proportion to the weights, but don't skip any domain.</li>
</ul>` }
      ],
      check: [
        { id: "M00.02-k1", type: "single", stem: "How many questions on the SAA-C03 exam affect your score?",
          options: [
            { t: "65", c: false, why: "65 is the total, which includes 15 unscored questions." },
            { t: "50", c: true, why: "50 scored questions plus 15 unscored questions = 65 total." },
            { t: "60", c: false, why: "Not a number used by this exam." },
            { t: "72", c: false, why: "You may be thinking of the 720 passing score." }
          ] },
        { id: "M00.02-k2", type: "single", stem: "Which domain carries the highest weighting?",
          options: [
            { t: "Design Resilient Architectures (26%)", c: false, why: "Second highest." },
            { t: "Design Secure Architectures (30%)", c: true, why: "Security is 30% of scored content." },
            { t: "Design High-Performing Architectures (24%)", c: false, why: "Third highest." },
            { t: "Design Cost-Optimized Architectures (20%)", c: false, why: "The lowest weighting, but still 1 in 5 questions." }
          ] },
        { id: "M00.02-k3", type: "multi", stem: "Which statements about scoring are TRUE?",
          options: [
            { t: "Unanswered questions are scored as incorrect, and there is no penalty for guessing.", c: true, why: "So always answer every question." },
            { t: "You must pass each domain individually.", c: false, why: "Scoring is compensatory: only the overall score matters." },
            { t: "The scaled passing score is 720 out of 1,000.", c: true, why: "Results are reported on a scale of 100–1,000." },
            { t: "Multiple-response questions give partial credit.", c: false, why: "You must select all correct options (and only those) to get the point." },
            { t: "Unscored questions are clearly labelled.", c: false, why: "They are not identified." }
          ] }
      ],
      references: ["<a href=\"https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html\">Current SAA-C03 exam guide</a>", "<a href=\"https://aws.amazon.com/certification/certified-solutions-architect-associate/\">AWS Certification: exam duration, delivery and booking information</a>"]
    },

    // ------------------------------------------------------------------ M00.03
    {
      id: "M00.03", title: "How AWS exam questions are built", level: 200, minutes: 25,
      objectives: [
        "Identify the parts of a scenario question: context, requirement, constraint and ask",
        "Map common constraint keywords to the kind of answer they usually favour",
        "Apply a four-step elimination method to distractors"
      ],
      sections: [
        { type: "why", html: `
<p>Most wrong answers on this exam are not knowledge gaps but <strong>reading failures</strong>: choosing a solution that <em>works</em> but ignores the one word that decides the question, such as "cheapest", "least operational overhead" or "without code changes". This lesson trains that reflex.</p>` },
        { type: "concept", title: "Anatomy of a scenario question", html: `
<ol>
  <li><strong>Context:</strong> "A company runs a web application on EC2 instances behind an ALB…"</li>
  <li><strong>Requirement:</strong> "…must remain available if an Availability Zone fails…"</li>
  <li><strong>Constraint (the decider):</strong> "…with the LEAST operational overhead."</li>
  <li><strong>Ask:</strong> "Which solution meets these requirements?"</li>
</ol>
<p>Typically, <strong>two options fail the requirement</strong> outright, and <strong>one option meets the requirement but fails the constraint</strong>. That third option is the plausible distractor, and it is where most points are lost.</p>
<h3>Constraint keywords and what they usually favour</h3>
<table>
<thead><tr><th>Keyword</th><th>Usually favours</th></tr></thead>
<tbody>
<tr><td>LEAST operational overhead / effort</td><td>Managed or serverless services, native features over custom scripts (e.g. Secrets Manager rotation over a cron job)</td></tr>
<tr><td>MOST cost-effective / lowest cost</td><td>Spot, Savings Plans, S3 lifecycle tiers, gateway endpoints, serverless for spiky loads, right-sizing</td></tr>
<tr><td>Highly available / fault tolerant</td><td>Multi-AZ, Auto Scaling across AZs, managed failover; multi-Region only if the question asks for it</td></tr>
<tr><td>Decouple / absorb spikes</td><td>SQS, SNS fan-out, EventBridge</td></tr>
<tr><td>Without code changes / legacy</td><td>Infrastructure-level fixes: ALB/ASG, RDS Multi-AZ, EFS for shared state, RDS Proxy</td></tr>
<tr><td>Real-time / milliseconds</td><td>Kinesis, DynamoDB/DAX, ElastiCache, Global Accelerator</td></tr>
<tr><td>Compliance / audit / prove</td><td>CloudTrail, Config, KMS customer-managed keys, Object Lock, Artifact</td></tr>
<tr><td>Securely / privately</td><td>Private subnets, VPC endpoints/PrivateLink, IAM roles (never access keys), encryption</td></tr>
</tbody></table>` },
        { type: "aws", title: "The common distractor patterns", html: `
<ul>
  <li><strong>Works, but over-engineered:</strong> multi-Region active-active when the requirement is just "highly available".</li>
  <li><strong>Works, but manual:</strong> "write a script on an EC2 instance that…" when a managed feature exists.</li>
  <li><strong>Right service, wrong feature:</strong> RDS read replica offered for automatic failover (that's Multi-AZ).</li>
  <li><strong>Real feature, wrong context:</strong> S3 Transfer Acceleration for traffic that never leaves the Region.</li>
  <li><strong>Security anti-patterns:</strong> embedding access keys, opening 0.0.0.0/0, using the root user. These are almost never correct.</li>
</ul>` },
        { type: "demo", title: "Worked example", html: `
<div class="callout"><p>A company stores application logs in Amazon S3. Logs are queried frequently for 30 days, rarely after that, and must be kept for 7 years for compliance. Retrieval of old logs within 12 hours is acceptable. Which solution is MOST cost-effective?</p>
<ol type="A">
<li>Keep all logs in S3 Standard.</li>
<li>Use an S3 Lifecycle rule to transition logs to S3 Glacier Deep Archive after 30 days.</li>
<li>Use an S3 Lifecycle rule to transition logs to S3 Standard-IA after 30 days.</li>
<li>Copy logs to EBS Cold HDD (sc1) volumes after 30 days.</li>
</ol></div>
<ol>
  <li><strong>Find the constraint:</strong> MOST cost-effective, with retrieval within 12 hours acceptable.</li>
  <li><strong>Remove the options that fail the requirement:</strong> D (EBS is block storage attached to instances, and pricier per GB for archives).</li>
  <li><strong>Remove the options that work but fail the constraint:</strong> A works but is the most expensive. C works but is pricier than an archive tier.</li>
  <li><strong>Confirm:</strong> B. Deep Archive is the cheapest class, and standard retrieval fits within 12 hours. ✓</li>
</ol>` },
        { type: "examples", title: "More worked examples", html: `
<p>Two more decoded questions, using the four-step method. Cover the explanation and try first.</p>
<h3>Example 2: least operational overhead</h3>
<div class="callout"><p>A company runs a stateless web application on a single EC2 instance. The application must keep running if an Availability Zone fails. The solution must require the LEAST operational overhead and no application changes.</p>
<ol type="A">
<li>Take hourly AMIs and use a script to launch a new instance in another AZ if the instance fails.</li>
<li>Create an Auto Scaling group across two AZs behind an Application Load Balancer.</li>
<li>Deploy a copy of the application in a second Region and use Route 53 failover routing.</li>
<li>Move the instance to a larger instance type with Enhanced Networking.</li>
</ol></div>
<ol>
  <li><strong>Ask:</strong> which solution keeps the app running during an AZ failure?</li>
  <li><strong>Constraint:</strong> LEAST operational overhead, no application changes.</li>
  <li><strong>Fails the requirement:</strong> D (still one instance in one AZ).</li>
  <li><strong>Works but fails the constraint:</strong> A (custom scripts and slow recovery), C (a second Region is over-engineered for an AZ requirement and doubles the operations).</li>
  <li><strong>Answer: B.</strong> Managed health checks and replacement across AZs, and a stateless app needs no change. ✓</li>
</ol>
<h3>Example 3: a multiple-response question</h3>
<div class="callout"><p>An application on EC2 instances in private subnets must upload files to an S3 bucket in the same Region. Security requires that the traffic does not traverse the internet and that no long-term credentials are stored on the instances. Which combination of steps meets these requirements? (Choose TWO.)</p>
<ol type="A">
<li>Create an S3 gateway VPC endpoint and add it to the private subnets' route tables.</li>
<li>Attach an IAM role with S3 permissions to the instances through an instance profile.</li>
<li>Store an IAM user's access keys in the application configuration file.</li>
<li>Route the traffic through a NAT gateway in a public subnet.</li>
<li>Enable S3 Transfer Acceleration on the bucket.</li>
</ol></div>
<ol>
  <li><strong>Split the requirement into parts:</strong> (1) private path to S3, (2) no stored long-term credentials. Each correct option should cover one part.</li>
  <li><strong>Part 1:</strong> A keeps traffic on the AWS network through the endpoint. D sends traffic out through the NAT gateway to S3's public endpoint, and E is about speeding long-distance uploads over the internet.</li>
  <li><strong>Part 2:</strong> B gives temporary, automatically rotated credentials. C is the classic security anti-pattern.</li>
  <li><strong>Answer: A and B.</strong> ✓ Bonus: the gateway endpoint also removes NAT gateway processing charges, which is the reason it is often the "most cost-effective" answer too.</li>
</ol>` },
        { type: "exam", title: "The four-step method", html: `
<ol>
  <li><strong>Read the last sentence first</strong> to know what you are choosing.</li>
  <li><strong>Underline the constraint</strong> (cost, overhead, availability, latency, no code change).</li>
  <li><strong>Eliminate the options that fail the requirement</strong> (usually two).</li>
  <li><strong>Choose between the remaining two on the constraint.</strong> If unsure, flag it, pick one, and move on. Never leave a blank.</li>
</ol>
<p>For multiple-response questions, the number to choose is stated ("Choose TWO"). Each correct option usually covers a <em>different part</em> of the requirement.</p>` },
        { type: "summary", html: `
<ul>
  <li>Every scenario has context, requirement, constraint and ask. The constraint decides between options that all "work".</li>
  <li>Learn the keyword map: least overhead → managed; most cost-effective → cheapest tier that still meets the requirement; highly available → multi-AZ.</li>
  <li>Typical shape: two options fail the requirement, one fails the constraint, one fits both.</li>
  <li>Watch for the distractor patterns: over-engineered, manual, right service/wrong feature, wrong context, security anti-pattern.</li>
  <li>Multiple-response: each correct option usually covers a different part of the requirement.</li>
</ul>` }
      ],
      check: [
        { id: "M00.03-k1", type: "single", stem: "A question ends with \"…with the LEAST operational overhead.\" Two options meet the requirement: (1) a Lambda function on a schedule that rotates database passwords, (2) AWS Secrets Manager with built-in rotation. Which is better?",
          options: [
            { t: "Secrets Manager with built-in rotation", c: true, why: "A native managed feature beats custom code you must maintain." },
            { t: "Scheduled Lambda function", c: false, why: "It works, but you write, test and maintain the rotation code: more overhead." },
            { t: "Both are equal", c: false, why: "The constraint is there precisely to separate them." },
            { t: "Neither; use an EC2 cron job", c: false, why: "That is even more overhead (you also manage a server)." }
          ] },
        { id: "M00.03-k2", type: "single", stem: "Which option is a classic \"right service, wrong feature\" distractor for the requirement \"automatic failover of an RDS database\"?",
          options: [
            { t: "Enable RDS Multi-AZ", c: false, why: "This is the correct feature for automatic failover." },
            { t: "Create an RDS read replica", c: true, why: "Read replicas scale reads. Promotion is manual (for RDS non-Aurora), so this is the distractor." },
            { t: "Use Amazon Aurora with replicas in multiple AZs", c: false, why: "Aurora replicas support automatic failover, so this also meets the requirement." },
            { t: "Take automated backups", c: false, why: "Backups help recovery, not automatic failover. This fails the requirement outright." }
          ] },
        { id: "M00.03-k3", type: "single", stem: "When a question says \"highly available\" but does not mention Regional failure or disaster recovery, which design is usually expected?",
          options: [
            { t: "Multi-AZ within one Region", c: true, why: "Multi-AZ is the default HA answer. Multi-Region adds cost and complexity unless the question asks for it." },
            { t: "Active-active across three Regions", c: false, why: "Over-engineered for a plain HA requirement." },
            { t: "A single large instance with EBS snapshots", c: false, why: "A single instance is a single point of failure." },
            { t: "Placement group of instances", c: false, why: "A cluster placement group is in a single AZ, which is low latency, not HA." }
          ] }
      ],
      references: ["Exam guide: Response types (multiple choice / multiple response)", "<code>STUDY_PLAN.md</code> §6 Decision tables"]
    },

    // ------------------------------------------------------------------ M00.04
    {
      id: "M00.04", title: "Learning science: study smarter", level: 100, minutes: 15,
      objectives: [
        "Use active recall and spaced repetition with the academy's flashcards",
        "Keep an error log that turns wrong answers into lessons",
        "Plan a weekly rhythm that balances reading, labs and practice"
      ],
      sections: [
        { type: "why", html: `
<p>Re-reading feels productive but is one of the least effective ways to study. Testing yourself and spacing reviews over time consistently produce better long-term retention. The academy is built around those two ideas.</p>` },
        { type: "concept", title: "Five techniques that work", html: `
<ol>
  <li><strong>Active recall:</strong> try to answer before looking. Every lesson ends with a knowledge check, and flashcards hide the answer until you flip.</li>
  <li><strong>Spaced repetition:</strong> review just before you would forget. The flashcard scheduler (the SM-2 algorithm) widens the gap after each successful recall (1 day → 6 days → ~2 weeks …) and resets it when you forget.</li>
  <li><strong>Interleaving:</strong> mix topics. Scenario questions combine networking, security and cost, so your practice should too.</li>
  <li><strong>Elaboration, through decision tables:</strong> for each service write "<em>When X, use Y because Z; not W because…</em>". This is exactly the comparison the exam forces.</li>
  <li><strong>An error log:</strong> for every wrong answer, record the topic, why the right answer is right, and <em>why the distractor looked attractive</em>. Re-read the log weekly.</li>
</ol>` },
        { type: "workflow", title: "A repeatable study loop", html: `
<p>Use this loop for every module. It turns reading into the kind of recall a scenario exam needs.</p>
<ol class="flow">
  <li><strong>Prime (10 min).</strong> Read the module overview and objectives. Save the quiz for your first closed-book attempt so its questions remain unseen.</li>
  <li><strong>Learn (weekdays).</strong> One or two lessons per session. Answer each knowledge check before reading the explanations, even if you are guessing.</li>
  <li><strong>Do (weekend).</strong> Complete the labs, then the clean-up. Write down one thing that surprised you in each lab.</li>
  <li><strong>Consolidate.</strong> Add rows to your decision table, e.g. <em>"Gateway endpoint vs NAT gateway for S3: endpoint is private and free; NAT is for general internet egress."</em></li>
  <li><strong>Test.</strong> Take the module quiz closed-book. Below 70%? Re-read only the lessons behind the wrong answers, then retake it the next day.</li>
  <li><strong>Log errors.</strong> For each miss: topic, correct reasoning, and why the distractor looked right.</li>
  <li><strong>Review (daily, 10 min).</strong> Flashcards that are due, across all decks. This keeps earlier modules alive while you learn new ones.</li>
</ol>
<div class="callout tip"><strong>Signs the loop is working:</strong> your quiz scores on the <em>first</em> attempt rise over time, and your error log shows fewer repeat mistakes on the same topic.</div>` },
        { type: "aws", title: "Using the academy's tools", html: `
<ul>
  <li><strong>Flashcards:</strong> grade honestly. <em>Again</em> = forgot; <em>Hard</em> = slow or partial; <em>Good</em> = recalled; <em>Easy</em> = instant. Keyboard: <kbd>Space</kbd> flip, <kbd>1</kbd>–<kbd>4</kbd> grade.</li>
  <li><strong>Practice accuracy by domain (Dashboard):</strong> summarises recorded answers, including repeats. Use it to find review topics, not to certify mastery. The diagnostic study plan saves missed answers with explanations and links.</li>
  <li><strong>Labs:</strong> do them. Concepts you have configured yourself are far easier to recall in a scenario.</li>
</ul>
<h3>Suggested weekly rhythm (10–12 h)</h3>
<table><thead><tr><th>When</th><th>What</th></tr></thead><tbody>
<tr><td>Weekdays, 1 h</td><td>About 40–50 min of lesson work and practice + 10 min of flashcards; split longer lessons across sessions</td></tr>
<tr><td>Saturday, 3 h</td><td>Labs for the week's module</td></tr>
<tr><td>Sunday, 2 h</td><td>Module quiz + error-log review + decision table update</td></tr>
</tbody></table>` },
        { type: "exam", html: `
<p>Near the exam, use unseen full-length timed mocks from a trusted source; the pilot does not supply them yet. Allow 130 minutes to answer plus a separate review session. Consistent scores of at least 80% are a study target, not an AWS passing-score conversion or a guarantee. Adjust your schedule to leave time for weak topics.</p>` },
        { type: "summary", html: `
<ul>
  <li>Testing yourself (active recall) beats re-reading.</li>
  <li>Spaced repetition: review flashcards when due and grade honestly.</li>
  <li>Interleave topics; build decision tables ("when X, use Y, not W because…").</li>
  <li>Keep an error log, including why the distractor tempted you, and re-read it weekly.</li>
  <li>Book the exam when you consistently score ≥ 80% on unseen mock exams.</li>
</ul>` }
      ],
      check: [
        { id: "M00.04-k1", type: "single", stem: "You recalled a flashcard answer, but it took a long time and you were unsure. Which grade is most honest?",
          options: [
            { t: "Again", c: false, why: "Use Again only when you could not recall it." },
            { t: "Hard", c: true, why: "Hard = recalled with difficulty, so the card comes back sooner than with Good." },
            { t: "Good", c: false, why: "Good is for a clean recall." },
            { t: "Easy", c: false, why: "Easy is for instant, effortless recall." }
          ] },
        { id: "M00.04-k2", type: "single", stem: "What is the most valuable field in an error-log entry?",
          options: [
            { t: "The question number", c: false, why: "Useful for lookup, but not for learning." },
            { t: "Why the distractor looked attractive", c: true, why: "This reveals the reasoning trap, so you avoid it next time." },
            { t: "The date", c: false, why: "Helpful for tracking, but not for learning." },
            { t: "Your time spent", c: false, why: "Useful for pacing only." }
          ] },
        { id: "M00.04-k3", type: "single", stem: "Which study activity has the LEAST evidence of long-term benefit?",
          options: [
            { t: "Re-reading notes several times", c: true, why: "Re-reading creates familiarity, not retrievable memory." },
            { t: "Self-testing with practice questions", c: false, why: "Active recall is among the most effective techniques." },
            { t: "Spaced flashcard review", c: false, why: "Spacing strongly improves retention." },
            { t: "Building decision tables", c: false, why: "Elaboration builds the comparisons the exam needs." }
          ] }
      ],
      references: ["Dunlosky et al., \"Improving Students' Learning With Effective Learning Techniques\" (2013)", "SM-2 algorithm (P. Woźniak, SuperMemo)"]
    },

    // ------------------------------------------------------------------ M00.05
    {
      id: "M00.05", title: "Diagnostic test", level: "–", minutes: 30, diagnostic: true,
      objectives: [
        "Measure your starting point across the four exam domains",
        "Get a per-domain recommendation for your learning path"
      ],
      sections: [
        { type: "why", html: `
<p>The pilot diagnostic has <strong>20 practice questions</strong>: 6 security, 5 resilience, 5 performance and 4 cost. This approximates the exam weights; it does not sample every task or predict your exam score. Tasks 3.2 (compute performance) and 4.3 (database cost) are not sampled, and other tasks have only a few questions. Allow about <strong>30 minutes</strong>; the timer shows elapsed time without a deadline. A low starting score is expected.</p>
<ul>
  <li>Don't look anything up, because an honest baseline is the point.</li>
  <li>Guess when unsure, just as on the real exam.</li>
  <li>Submitting completes this lesson regardless of score. Results save your missed and unanswered questions and link to study recommendations, including prerequisites and planned content.</li>
  <li>Retakes use the same questions in a new order. Improvement may reflect memory; use unseen, timed full-length exams for readiness decisions.</li>
</ul>` }
      ],
      references: ["Pilot guidance: below 80% prioritise review; 80% or above continue studying and confirm with unseen questions. Scores never bypass prerequisites."]
    }
  ],

  // ------------------------------------------------------------------ diagnostic (20 Qs)
  diagnostic: {
    version: "m00-diagnostic-2",
    minutes: 30,
    // A foundation available now and the eventual service module, in study order.
    remediation: {
      "DX-01": ["M01.03", "M05.01"], "DX-02": ["M05.05"],
      "DX-03": ["M05.06"], "DX-04": ["M07.02", "M07.03"],
      "DX-05": ["M06.03"], "DX-06": ["M07.08"],
      "DX-07": ["M04.08", "M25"], "DX-08": ["M04.03", "M21"],
      "DX-09": ["M04.03", "M33"], "DX-10": ["M04.03", "M14"],
      "DX-11": ["M04.08", "M25"], "DX-12": ["M02.04", "M12"],
      "DX-13": ["M04.05", "M23"], "DX-14": ["M04.07", "M19"],
      "DX-15": ["M04.07", "M22"], "DX-16": ["M04.08", "M27"],
      "DX-17": ["M01.05", "M13"], "DX-18": ["M01.05", "M18"],
      "DX-19": ["M02.03", "M10"], "DX-20": ["M01.05", "M13"]
    },
    questions: [
      // D1 – Secure (6)
      { id: "DX-01", type: "multi", domain: "D1", task: "1.1", level: 200,
        stem: "A company has just created a new AWS account. Which TWO actions should a solutions architect take to secure the root user?",
        options: [
          { t: "Enable MFA on the root user.", c: true, why: "MFA is the most important root-user protection." },
          { t: "Ensure the root user has no access keys, and use separate identities for daily administration.", c: true, why: "Root access keys are a high-risk credential. Daily work should use IAM Identity Center or IAM identities." },
          { t: "Share the root password with the operations team for emergencies.", c: false, why: "Shared root credentials remove accountability and increase risk." },
          { t: "Use the root user for daily administrative tasks to reduce the number of identities.", c: false, why: "The root user should be reserved for the few tasks that require it." },
          { t: "Create an IAM user named \"root\" with AdministratorAccess.", c: false, why: "The name changes nothing about security." }
        ] },
      { id: "DX-02", type: "single", domain: "D1", task: "1.1", level: 200,
        stem: "An application running on Amazon EC2 needs to read objects from an S3 bucket. What is the MOST secure way to grant access?",
        options: [
          { t: "Attach an IAM role to the instance through an instance profile.", c: true, why: "Roles provide automatically rotated temporary credentials. No secrets are stored on the instance." },
          { t: "Store an IAM user's access keys in the application configuration file.", c: false, why: "Long-lived keys on disk can leak and are hard to rotate." },
          { t: "Pass access keys through EC2 user data.", c: false, why: "User data is readable from the instance metadata, so it is not a secret store." },
          { t: "Make the bucket public and restrict access by the instance's public IP.", c: false, why: "Public buckets are an anti-pattern, and IPs change." }
        ] },
      { id: "DX-03", type: "single", domain: "D1", task: "1.1", level: 300,
        stem: "External auditors working in their own AWS account need read-only access to resources in a company's production account. What should the solutions architect do?",
        options: [
          { t: "Create an IAM role in the production account with a read-only policy and a trust policy that allows the auditors' account to assume it.", c: true, why: "Cross-account roles give temporary, auditable access without sharing credentials." },
          { t: "Create IAM users in the production account and email the passwords to the auditors.", c: false, why: "That means long-lived credentials and more identities to manage." },
          { t: "Share the production account's root credentials with the auditors.", c: false, why: "Never share root." },
          { t: "Copy all the data to a public S3 bucket.", c: false, why: "This exposes data publicly." }
        ] },
      { id: "DX-04", type: "single", domain: "D1", task: "1.3", level: 300,
        stem: "A company must encrypt data at rest in Amazon S3, control key permissions and audit KMS API calls through CloudTrail. Which option meets these requirements?",
        options: [
          { t: "SSE-KMS with a customer managed key", c: true, why: "You control the key policy, and CloudTrail records KMS API calls. This is not a per-object access audit: S3 Bucket Keys can reduce KMS calls; configure S3 data events separately when object access auditing is required." },
          { t: "SSE-S3", c: false, why: "AWS manages these keys entirely, so you get no key policy and no per-use audit trail of the key." },
          { t: "SSE-C", c: false, why: "You must supply and manage the keys yourself on every request, which is heavy overhead and gives no KMS audit trail." },
          { t: "No encryption, with bucket versioning enabled", c: false, why: "Versioning is not encryption." }
        ] },
      { id: "DX-05", type: "single", domain: "D1", task: "1.1", level: 300,
        stem: "A company uses AWS Organizations with all features and SCPs enabled. It must prevent IAM users and roles in member accounts, including administrators, from calling regional service endpoints outside eu-west-1, while allowing required global services. Which centrally managed control fits?",
        options: [
          { t: "Attach a tested SCP using aws:RequestedRegion to the organization root, with exceptions for required global services.", c: true, why: "SCPs restrict IAM users and roles in member accounts, including administrators. They do not restrict the management account or service-linked roles and never grant permissions. RequestedRegion controls the endpoint called, not all cross-Region effects." },
          { t: "Add a deny statement to the IAM policies in each account.", c: false, why: "Account administrators could remove it, and it is high operational overhead." },
          { t: "Create an AWS Config rule that detects resources in other Regions.", c: false, why: "Config detects problems after the fact. It does not prevent them." },
          { t: "Enable CloudTrail in all Regions.", c: false, why: "CloudTrail audits activity. It does not restrict it." }
        ] },
      { id: "DX-06", type: "single", domain: "D1", task: "1.2", level: 300,
        stem: "An application needs database credentials that are rotated automatically every 30 days, with the LEAST operational overhead. What should the architect use?",
        options: [
          { t: "AWS Secrets Manager with automatic rotation", c: true, why: "Rotation is built in, with managed rotation functions for RDS." },
          { t: "Systems Manager Parameter Store SecureString parameters", c: false, why: "Secure storage, but no native automatic rotation." },
          { t: "An encrypted file in S3, updated by a cron job", c: false, why: "Custom code means more overhead." },
          { t: "AWS KMS", c: false, why: "KMS manages encryption keys, not database passwords." }
        ] },

      // D2 – Resilient (5)
      { id: "DX-07", type: "single", domain: "D2", task: "2.1", level: 200,
        stem: "During sales events, a web tier sends orders directly to a processing tier, and orders are lost when the processing tier is overwhelmed. What should the architect do to make the system resilient to these spikes?",
        options: [
          { t: "Place an Amazon SQS queue between the web tier and the processing tier.", c: true, why: "The queue buffers orders durably, and consumers process them at their own pace." },
          { t: "Increase the instance size of the processing tier.", c: false, why: "Vertical scaling only raises the ceiling. Spikes can still exceed it." },
          { t: "Add a second web tier.", c: false, why: "The bottleneck is in processing." },
          { t: "Use Amazon SNS to send the orders directly.", c: false, why: "SNS pushes messages and does not buffer them for slow consumers by itself." }
        ] },
      { id: "DX-08", type: "single", domain: "D2", task: "2.2", level: 200,
        stem: "A MySQL database on Amazon RDS must automatically fail over if its Availability Zone becomes unavailable. What should be enabled?",
        options: [
          { t: "RDS Multi-AZ deployment", c: true, why: "It keeps a synchronous standby in another AZ with automatic failover." },
          { t: "An RDS read replica in the same AZ", c: false, why: "Read replicas scale reads, and a replica in the same AZ doesn't survive an AZ failure." },
          { t: "Automated backups", c: false, why: "Backups support recovery, not automatic failover." },
          { t: "Larger instance class", c: false, why: "A larger instance is still a single AZ." }
        ] },
      { id: "DX-09", type: "single", domain: "D2", task: "2.2", level: 300,
        stem: "A non-critical internal application can tolerate an RTO of 24 hours and an RPO of 12 hours. Which disaster recovery strategy is MOST cost-effective?",
        options: [
          { t: "Backup and restore", c: true, why: "It is the cheapest strategy and suited to RTO/RPO measured in hours." },
          { t: "Pilot light", c: false, why: "It keeps core components running, which costs more than the targets need." },
          { t: "Warm standby", c: false, why: "A scaled-down copy runs continuously, which costs more." },
          { t: "Multi-site active-active", c: false, why: "The most expensive option, needed only for near-zero RTO/RPO." }
        ] },
      { id: "DX-10", type: "single", domain: "D2", task: "2.2", level: 200,
        stem: "A stateless web application runs on a single EC2 instance. Which design makes it highly available?",
        options: [
          { t: "An Application Load Balancer in front of an Auto Scaling group spanning multiple Availability Zones", c: true, why: "This removes the single instance and single AZ as points of failure, and replaces unhealthy instances." },
          { t: "A larger instance with an Elastic IP address", c: false, why: "Still a single point of failure." },
          { t: "Two instances in a cluster placement group", c: false, why: "A cluster placement group is in a single AZ." },
          { t: "Hourly EBS snapshots", c: false, why: "Backups are not availability." }
        ] },
      { id: "DX-11", type: "single", domain: "D2", task: "2.1", level: 300,
        stem: "When an order is placed, three independent systems (billing, shipping and analytics) must each receive and process it independently. Which design is MOST loosely coupled?",
        options: [
          { t: "Publish to an Amazon SNS topic with an SQS queue for each system subscribed (fan-out).", c: true, why: "Each consumer gets its own durable copy and scales and fails independently." },
          { t: "Have the order service call each system's API in sequence.", c: false, why: "Tight coupling: one slow system blocks the others." },
          { t: "Use a single SQS queue polled by all three systems.", c: false, why: "Each message would be consumed by only one system." },
          { t: "Write orders to a shared database table that each system polls.", c: false, why: "This creates coupling through the database and inefficient polling." }
        ] },

      // D3 – High-performing (5)
      { id: "DX-12", type: "single", domain: "D3", task: "3.4", level: 200,
        stem: "A website serves images and videos from S3 to users around the world, and users far from the Region report slow loads. What should the architect do?",
        options: [
          { t: "Serve the content through Amazon CloudFront.", c: true, why: "The CDN caches content at edge locations close to users." },
          { t: "Move the bucket to a larger instance.", c: false, why: "S3 does not run on instances you size." },
          { t: "Enable S3 versioning.", c: false, why: "Versioning does not affect performance." },
          { t: "Use a NAT gateway.", c: false, why: "A NAT gateway provides outbound access for private subnets. It is unrelated to this problem." }
        ] },
      { id: "DX-13", type: "single", domain: "D3", task: "3.3", level: 300,
        stem: "A relational database is overloaded by the same product-catalog queries repeated thousands of times per minute, and the application needs sub-millisecond reads. What should the architect add?",
        options: [
          { t: "Amazon ElastiCache as a cache in front of the database", c: true, why: "An in-memory cache serves repeated reads in microseconds and offloads the database." },
          { t: "A larger EBS volume for the database", c: false, why: "Storage size doesn't fix repeated-read load." },
          { t: "Amazon S3 Glacier", c: false, why: "An archive tier is unrelated to read performance." },
          { t: "An Amazon SQS queue", c: false, why: "Queues decouple writes. They do not speed up reads." }
        ] },
      { id: "DX-14", type: "single", domain: "D3", task: "3.1", level: 200,
        stem: "Several Linux EC2 instances across multiple Availability Zones need concurrent read/write access to the same file system. Which service fits?",
        options: [
          { t: "Amazon EFS", c: true, why: "A managed NFS file system that is regional and mountable by many instances across AZs." },
          { t: "Amazon EBS gp3", c: false, why: "EBS volumes are AZ-scoped and attach to one instance (Multi-Attach is limited to io1/io2 in one AZ)." },
          { t: "Instance store", c: false, why: "Ephemeral storage local to a single host." },
          { t: "Amazon S3", c: false, why: "Object storage, not a POSIX file system." }
        ] },
      { id: "DX-15", type: "single", domain: "D3", task: "3.3", level: 200,
        stem: "A new mobile app needs a key-value database that delivers single-digit-millisecond performance at any scale, with no servers to manage. Which service should be used?",
        options: [
          { t: "Amazon DynamoDB", c: true, why: "Serverless key-value/document database with consistent low latency at scale." },
          { t: "Amazon RDS for MySQL", c: false, why: "Relational, and you must size the instances." },
          { t: "Amazon Redshift", c: false, why: "A data warehouse for analytics, not app key-value access." },
          { t: "Amazon Neptune", c: false, why: "A graph database." }
        ] },
      { id: "DX-16", type: "single", domain: "D3", task: "3.5", level: 300,
        stem: "A company ingests clickstream events in real time. Several applications must read the same stream independently, and the data must be replayable for 24 hours. Which service fits BEST?",
        options: [
          { t: "Amazon Kinesis Data Streams", c: true, why: "Multiple consumers can read the same ordered stream, with a configurable retention for replay." },
          { t: "Amazon SQS standard queue", c: false, why: "A message is deleted once processed, so there is no multi-consumer replay." },
          { t: "Amazon SNS standard topic", c: false, why: "Standard topics do not provide a replayable stream. SNS FIFO topics can archive and replay messages, so the topic type matters." },
          { t: "Amazon Data Firehose", c: false, why: "Delivers to destinations such as S3, but it is not a replayable multi-consumer stream." }
        ] },

      // D4 – Cost (4)
      { id: "DX-17", type: "single", domain: "D4", task: "4.2", level: 200,
        stem: "A nightly batch job is fault tolerant, can be interrupted and restarted, and has a flexible completion time. Which EC2 purchasing option is MOST cost-effective?",
        options: [
          { t: "Spot Instances", c: true, why: "Up to ~90% off On-Demand, and an ideal fit for interruptible workloads." },
          { t: "On-Demand Instances", c: false, why: "These work, but cost the most." },
          { t: "Dedicated Hosts", c: false, why: "For licensing or compliance needs, and expensive." },
          { t: "A 3-year Reserved Instance", c: false, why: "A commitment to always-on capacity for a job that runs only nightly." }
        ] },
      { id: "DX-18", type: "single", domain: "D4", task: "4.1", level: 300,
        stem: "Objects in S3 are accessed frequently for 30 days, then rarely, but must still be retrievable in milliseconds when requested. Which solution is MOST cost-effective?",
        options: [
          { t: "A lifecycle rule that transitions objects to S3 Standard-IA after 30 days", c: true, why: "Lower storage cost with millisecond access for infrequently accessed data." },
          { t: "A lifecycle rule that transitions objects to S3 Glacier Deep Archive after 30 days", c: false, why: "Retrieval takes hours, which fails the millisecond requirement." },
          { t: "Keep the objects in S3 Standard", c: false, why: "This works but costs more for rarely accessed data." },
          { t: "Move the objects to EBS volumes", c: false, why: "More expensive and not object storage." }
        ] },
      { id: "DX-19", type: "single", domain: "D4", task: "4.4", level: 300,
        stem: "EC2 instances in private subnets transfer terabytes to S3 in the same Region through a NAT gateway, and NAT data-processing charges are high. What reduces cost with no application changes?",
        options: [
          { t: "Add an S3 gateway VPC endpoint to the private subnets' route tables.", c: true, why: "Gateway endpoints have no charge, and S3 traffic bypasses the NAT gateway." },
          { t: "Add a NAT gateway in every AZ.", c: false, why: "Better availability, but more cost." },
          { t: "Enable S3 Transfer Acceleration.", c: false, why: "For long-distance transfers over the internet, and it adds cost." },
          { t: "Move the instances to public subnets.", c: false, why: "This weakens security, and public IPv4 addresses are charged." }
        ] },
      { id: "DX-20", type: "single", domain: "D4", task: "4.2", level: 300,
        stem: "A company has steady 24/7 compute usage for the next 3 years across EC2 (several instance families and Regions), AWS Fargate and AWS Lambda. Which purchasing option provides savings with the MOST flexibility?",
        options: [
          { t: "Compute Savings Plans", c: true, why: "These apply across instance families, sizes, Regions, Fargate and Lambda." },
          { t: "EC2 Instance Savings Plans", c: false, why: "Limited to one instance family in one Region." },
          { t: "Standard Reserved Instances", c: false, why: "Tied to instance attributes, and they don't cover Fargate or Lambda." },
          { t: "Spot Instances", c: false, why: "Spot can serve interruption-tolerant production workloads, but does not provide a commitment discount spanning EC2, Fargate and Lambda." }
        ] }
    ]
  },

  flashcards: [
    { id: "fc-M00-01", front: "SAA-C03 format: how many questions, how many scored, how long?", back: "65 questions (50 scored + 15 unscored), 130 minutes." },
    { id: "fc-M00-02", front: "SAA-C03 passing score and scoring model?", back: "720 on a 100–1,000 scale. Compensatory: you pass overall, not per domain." },
    { id: "fc-M00-03", front: "The four SAA-C03 domains and their weights?", back: "Secure 30% · Resilient 26% · High-Performing 24% · Cost-Optimized 20%." },
    { id: "fc-M00-04", front: "Keyword: \"LEAST operational overhead\" usually favours…", back: "Managed or serverless services and native features over custom scripts or self-managed servers." },
    { id: "fc-M00-05", front: "Keyword: \"highly available\" (no DR or Regional failure mentioned) usually means…", back: "Multi-AZ within one Region (ALB + ASG across AZs, RDS Multi-AZ). Multi-Region is usually over-engineering." },
    { id: "fc-M00-06", front: "Keyword: \"without code changes\" / legacy app usually favours…", back: "Infrastructure-level fixes: ALB/ASG, RDS Multi-AZ, RDS Proxy, EFS for shared state, CloudFront." },
    { id: "fc-M00-07", front: "Multiple-response questions: is partial credit given?", back: "No. You must select all correct options and only those." },
    { id: "fc-M00-08", front: "IaC answer on the exam: CDK or CloudFormation?", back: "CloudFormation. AWS CDK is listed as out of scope for SAA-C03." },
    { id: "fc-M00-09", front: "The four-step elimination method?", back: "1) Read the ask. 2) Underline the constraint. 3) Remove the options that fail the requirement. 4) Choose between the remaining options on the constraint." },
    { id: "fc-M00-10", front: "Readiness bar before booking the exam?", back: "Consistently ≥ 80% on unseen, timed full-length mock exams." }
  ]
};

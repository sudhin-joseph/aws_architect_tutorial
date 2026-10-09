# AWS Architect Academy (LMS)

A self-paced learning app for **AWS Solutions Architect – Associate (SAA-C03)**, plus DevOps/IaC and system design. It is plain HTML/CSS/JavaScript, with **no build step, no dependencies and no server**.

The curriculum blueprint is [`../LMS_PLAN.md`](../LMS_PLAN.md). The initial study schedule is [`../STUDY_PLAN.md`](../STUDY_PLAN.md). This is a local learning pilot: **11 of 47 modules and 80 of 309 planned lessons are available**. Planned outlines do not count against available-content completion.

### M00 pilot (2026-10-08)

M00 contains **five lessons: four reading lessons and one 20-question diagnostic**, approximately 30 minutes for the diagnostic (6 security / 5 resilience / 5 performance / 4 cost). It is a small, uncalibrated sample, not an exam-readiness score. A future 40-question diagnostic remains planned.

- Missed and unanswered questions are saved with original option indexes, explanations and study links. Review them from the dashboard or M00.05 after reloading.
- Recommendations prioritise weak domains, respect gating, and distinguish available foundations from planned service modules. Scores never grant test-out.
- The same questions recur on retakes. Only the latest diagnostic is retained; retakes cannot measure performance on unseen questions.
- Module review metadata and official source links appear on M00, M08, M09 and M10 pages. M01–M07 have not received this pilot audit.
- Version-1 progress files remain supported. Imports validate nested data before replacing progress; missing fields receive defaults. Older diagnostic scores remain visible and prompt a retake for question-level feedback.
- LMS lab completion is self-reported. L08 includes a standalone, learner-run read-only AWS configuration validator; no integrated cloud verification is provided. Authentication, mock exams, pre-tests, certificates and server synchronisation remain planned.

Run `node --test lms/tests/*.test.cjs` and `python3 -B -m unittest discover -s lms/tests -p 'test_m*.py'` from the workspace root for content, lab guardrail, validator and progress-import checks. These tests do not contact AWS.

M08 adds eight lessons (340 estimated reading/practice minutes), 32 knowledge checks, 24 lesson drills, a 24-question quiz, 48 flashcards and a 90-minute sandbox lab with three drills. [L08 files and runbook](labs/m08/README.md) include CloudFormation, validation, cost guardrails and cleanup. Infrastructure has not been deployed by the author. Sources reviewed 2026-10-08; next review 2027-01-08. M05 is the prerequisite; M09 is recommended and does not block access.

M09 adds eight detailed lessons (420 estimated minutes), 40 knowledge checks, 32 lesson drills, a 32-question quiz, 64 flashcards, eight architecture diagrams and eight workflow diagrams. Every lesson includes worked examples and detailed use cases. [L09 runbook and worksheet](labs/m09/README.md) cover a hand-built two-AZ topology and a paid NACL/Flow Logs break/fix extension, with eight lab drills. The Python checker validates an offline IPv4 plan only; labs are not deployment-tested. M02 is the prerequisite. Budget approximately 12 hours including labs and review; source review 2026-10-08, next review 2027-01-08.

M10 covers peering, Transit Gateway, gateway/interface endpoints, PrivateLink, network cost modelling and Lattice awareness. [L10 runbook and worksheet](labs/m10/README.md) distinguish route configuration, observed requests and Flow Log evidence. Allow approximately eight hours with lab and review. M09 is the prerequisite. Source review 2026-10-09; next review 2027-01-09. No AWS resources are created by the LMS.

For new modules, preserve this content standard: explain the concept and limitations, trace a workflow, show meaningful architecture boundaries, work through a use case with decision/trade-off/failure behavior, then assess the reasoning. Diagrams must have accessible titles/descriptions and remain readable on mobile. Distinguish offline exercises, author-tested behavior and learner-observed AWS evidence.

M00 coverage (pilot review: 2026-10-08; next source review: 2027-01-08):

| Lesson | Learning evidence | Scope |
|---|---|---|
| M00.01 | 3 knowledge checks | Navigation, completion, account and cost precautions |
| M00.02 | 3 knowledge checks | Exam format, domain weights, scope and scaled scoring |
| M00.03 | 3 knowledge checks | Scenario constraints and distractor reasoning |
| M00.04 | 3 knowledge checks | Recall, spacing, error log and realistic study rhythm |
| M00.05 | 20 diagnostic questions | Sampled tasks with per-question domain/task tags and remediation mappings |

The diagnostic does not sample tasks 3.2 or 4.3. Neither sampled tasks nor high scores establish comprehensive coverage. The `review` metadata holds official source links, and `diagnostic.remediation` maps every question to study targets. The integrity check verifies targets exist and match the catalog.

## Run it

**Option 1: open the file.** Double-click `index.html`, or from WSL run:

```bash
explorer.exe index.html
```

Progress is saved in `localStorage`. This works for `file://` pages in Chrome, Edge and Firefox.

**Option 2: serve over http** (recommended if your browser blocks storage for `file://`):

```bash
cd lms && python3 -m http.server 8000   # then open http://localhost:8000
```

## Progress tracking

| Order | Backend | Persists? | Notes |
|---|---|---|---|
| 1 | `localStorage` | Yes | Default. About 5 MB available. |
| 2 | Cookies | Yes (1 year) | Used if localStorage is blocked. The state is split across `aws-academy-progress-v1_N` cookies (about 4 KB browser limit each). Chrome does not support cookies on `file://`, so serve over http to use this. |
| 3 | `sessionStorage` | Until the tab closes | – |
| 4 | Memory | No | Last resort |

The footer and the **Progress** page show which backend is active. Use **Export progress / Import progress** (JSON) to back up or move progress between browsers.

What is tracked:
- Lesson completion
- Knowledge-check answers (these feed domain mastery)
- Quiz attempts, best and last score, and per-domain results
- The diagnostic result
- Lab steps
- Flashcard schedules (SM-2)
- Last visited page and settings

**Completion rules:**
- A **lesson** is complete after all its knowledge checks are answered and you click *Mark complete*.
- A **lab** is complete when all its steps are ticked.
- A **module** is complete when all its lessons and labs are done and its quiz is passed (≥ pass mark).
- **Gating:** a module unlocks when its prerequisite modules are complete. Prerequisites that have no content yet don't block. You can turn strict gating off on the Progress page.

## Structure

```
lms/
├── index.html            app shell; loads catalog → module content → store → app
├── css/styles.css        light/dark theme tokens, responsive layout, diagram classes
├── js/store.js           progress persistence (localStorage → cookies → session → memory), SM-2
├── js/app.js             hash router + views: dashboard, catalog, module, lesson, quiz/diagnostic, lab, flashcards, progress
├── content/catalog.js    AUTO-GENERATED: 15 tracks · 47 modules · 309 planned lessons · 5 paths
├── content/m00.js        M00 Orientation (5 lessons, including 20-question diagnostic)
├── content/m01.js        M01 Cloud & global infrastructure
├── content/m02.js        M02 Networking fundamentals
├── content/m03.js        M03 Linux, CLI and tooling essentials
├── content/m04.js        M04 System design fundamentals
├── content/m05.js        M05 Identity and Access Management (IAM)
├── content/m06.js        M06 Multi-account strategy and governance
├── content/m07.js        M07 Data protection and encryption
├── content/m08.js        M08 Threat protection, detection and perimeter security
├── content/m09.js        M09 Amazon VPC core; 16 accessible inline SVG diagrams
├── content/m10.js        M10 VPC connectivity; six lessons and 12 accessible diagrams
├── labs/m10/             TGW/S3 runbook, route worksheet and offline checker
├── labs/m08/             CloudFormation JSON, read-only validator and runbook
├── labs/m09/             manual runbook, IPv4 worksheet and offline checker
├── tests/                local content, store and lab-validator regression tests
└── tools/build_catalog.py  regenerates catalog.js from LMS_PLAN.md
```

**Routes:**

| Route | Page |
|---|---|
| `#/` | Dashboard |
| `#/catalog` | Catalogue |
| `#/m/M01` | Module |
| `#/l/M01.02` | Lesson |
| `#/quiz/M01` | Module quiz |
| `#/diagnostic` | Diagnostic test |
| `#/lab/M01/L01` | Lab |
| `#/cards/M01` or `#/cards/all` | Flashcards |
| `#/progress` | Progress |

## Adding a module

1. Create `content/mNN.js` and register it:

   ```js
   window.LMS_MODULES["M09"] = {
     summary: "…", objectives: ["…"],
     lessons: [{
       id: "M09.01", title: "VPC anatomy", level: 100, minutes: 25,
       objectives: ["…"],
       sections: [               // optional custom title; see "Section types" below
         { type: "why", html: `<p>…</p>` },
         { type: "concept", html: `…` }
       ],
       drills: [                 // optional auto-graded free-text practice (shown before the knowledge check)
         { id: "M09.01-d1", q: "How many usable IPs in a /24 subnet on AWS?", answers: ["251"],
           hint: "2^(32−24) minus the 5 addresses AWS reserves", explain: "256 − 5 = 251" }
       ],
       check: [ /* questions (see below) */ ],
       cards: ["fc-M09-01"],     // optional: ids of this lesson's flashcards
       references: ["SD ch.9 (PDF p418)"]
     }],
     labs: [{ id: "L09a", title: "…", level: 200, duration: "60 min", cost: "< $0.50",
              objective: `…`, warning: `…`, diagram: `…`,
              steps: [{ id: "s1", title: "…", html: `…` }],
              drills: [ /* optional auto-graded exercises, same shape as lesson drills */ ],
              // a module can have several labs: labs: [ {id: "L05a", …}, {id: "L05b", …} ]
              validate: `<pre><code>…</code></pre>`, cleanup: `…` }],
     quiz: { passMark: 70, questions: [ /* … */ ] },
     flashcards: [{ id: "fc-M09-01", front: "…", back: "…" }]
   };
   ```

2. Add `<script src="content/mNN.js"></script>` to `index.html`, after the previous module's script.

**Section types**, rendered in the order you list them:

| Type | Default heading | Use it for |
|---|---|---|
| `why` | Why it matters | The real-world or exam problem that motivates the lesson |
| `concept` | Concept | The explanation, simple to detailed, with a diagram |
| `workflow` | How it works, step by step | Packet walks, request flows, procedures. Use `<ol class="flow">` for numbered step cards. |
| `aws` | How it works on AWS | Service mapping, limits, defaults, pricing |
| `examples` | Worked examples | Calculations, commands with annotated output, samples |
| `usecases` | Use cases | Scenario → choice → why |
| `demo` | Demo / guided practice | Things the learner runs |
| `casestudy` | Case study | A realistic company scenario: requirements, decision, outcome, lessons |
| `exam` | Exam lens | Keywords, distractors, X-vs-Y tables |
| `architect` | Architect lens (400) | Production gotchas, troubleshooting, cost traps |
| `summary` | Key takeaways | 6–10 bullets |

Callouts: `<div class="callout">`, `callout tip`, `callout warn`.

**Question schema**, used by knowledge checks, quizzes and the diagnostic:

```js
{ id: "M09-Q01", type: "single" | "multi", domain: "D1".."D4", task: "1.2", level: 300,
  stem: "HTML…",
  options: [{ t: "HTML…", c: true, why: "Explanation shown after answering" }, …] }
```

- Multiple-response questions are scored all-or-nothing, and the stem automatically gets "(Choose TWO)".
- Options are shuffled for every quiz attempt.
- Authoring rules are in `LMS_PLAN.md` §4.3: one decisive constraint per stem, plausible distractors, and an explanation for every option.

**Diagrams:** use inline SVG with the theme classes, so they adapt to light and dark mode.
- Shapes: `dg-box`, `dg-region`, `dg-az`, `dg-edge`, `dg-info`, `dg-good`, `dg-line`, `dg-link`
- Shapes also: `dg-bad`, `dg-dc`. Arrowheads: a `<marker>` whose path has class `dg-arrow`.
- Text: `dg-t`, `dg-tb`, `dg-ts`, `dg-ta`

## Regenerating the catalogue

After you edit the curriculum in `LMS_PLAN.md`:

```bash
python3 lms/tools/build_catalog.py
```

## Content status

| Module | Status |
|---|---|
| M00 Orientation, exam blueprint and study skills | Pilot reviewed: 5 lessons (4 reading + diagnostic), 12 knowledge checks, 20-question diagnostic with saved remediation, 10 flashcards |
| M01 Cloud computing and the AWS global infrastructure | ✅ Complete: 6 lessons (each with workflow, worked examples, use cases, case study), 26 knowledge checks, Lab L01, 15-question quiz, 32 flashcards, 3 diagrams |
| M02 Networking fundamentals | ✅ Complete: 6 lessons (~26k words), 35 knowledge checks, 48 practice drills, Lab L02 with a 25-item auto-graded CIDR worksheet, 25-question quiz, 69 flashcards, 12 diagrams |
| M03 Linux, CLI and tooling essentials | ✅ Complete: 4 lessons (~18k words), 24 knowledge checks, 34 practice drills, Lab L03 (S3 encryption inventory script in bash and boto3, 17 auto-graded items), 20-question quiz, 46 flashcards, 9 diagrams |
| M04 System design fundamentals | ✅ Complete: 9 lessons (~40k words), 54 knowledge checks, 75 practice drills, Lab L04 design workshop (estimate → decide → ADR, 16 auto-graded items, reference solution), 20-question quiz, 102 flashcards, 19 diagrams |
| M05 Identity and Access Management (IAM) | ✅ Complete: 10 lessons (~40k words), 60 knowledge checks, 79 practice drills, 3 labs (L05a least-privilege S3 + Policy Simulator, L05b cross-account role with External ID, L05c Cognito-protected HTTP API; 30 auto-graded items), 25-question quiz, 111 flashcards, 23 diagrams |
| M06 Multi-account strategy and governance | ✅ Complete: 8 lessons (~40k words), 48 knowledge checks, 86 practice drills, Lab L06 (Organizations with two OUs + Region-deny SCP verified from a member account; 18 auto-graded items), 25-question quiz, 92 flashcards, 23 diagrams |
| M07 Data protection and encryption | ✅ Complete: 10 lessons (~60k words), 60 knowledge checks, 130 practice drills, 2 labs (L07a customer managed KMS key + SSE-KMS bucket + key policy for one role; L07b Secrets Manager rotation for an RDS password; 40 auto-graded items), 25-question quiz, 120 flashcards, 32 diagrams |
| M08 Threat protection, detection and perimeter security | Source-reviewed: 8 lessons, 32 knowledge checks, 24 lesson drills, Lab L08 with downloadable infrastructure/validator and 3 drills, 24-question quiz, 48 flashcards; cloud deployment not tested |
| M09 Amazon VPC core | Source-reviewed: 8 detailed lessons, 16 diagrams, 40 knowledge checks, 32 lesson drills, 32-question quiz, 64 flashcards, L09a/L09b with 8 lab drills and an offline plan checker; cloud execution not tested |
| M10 VPC connectivity and private access | Source-reviewed: 6 lessons (270 estimated minutes), 12 diagrams, 24 knowledge checks, 24 lesson drills, 24-question quiz, 48 flashcards, L10 with 4 lab drills and an offline route checker; cloud execution not tested |
| M11–M46 | 🚧 Outline only (from the blueprint), shown as "Coming soon" |

## Authoring gotcha: backslashes in template literals

Lesson HTML lives in JavaScript template literals, where a backslash is an escape character:
- a `\` at the end of a line (shell line continuation) is **silently removed together with the newline**. Write `\\`.
- `${` starts an interpolation. Write `\${` (for example IAM policy variables like `\${aws:username}`).
- a backtick ends the literal. Write `` \` `` (JMESPath literals).

Diagram gotcha: `marker-end` draws an arrowhead only at the end of the *last* subpath, so use one `<path>` per arrow, not `d="M… M…"`.

/* AWS Architect Academy - single-page LMS (no build step, no dependencies). */
(function () {
  "use strict";

  var CATALOG = window.LMS_CATALOG;
  var CONTENT = window.LMS_MODULES || {};
  var S = window.LMSStore;
  var app = document.getElementById("app");

  var DOMAINS = {
    D1: "Secure Architectures",
    D2: "Resilient Architectures",
    D3: "High-Performing Architectures",
    D4: "Cost-Optimized Architectures"
  };
  var DOMAIN_WEIGHT = { D1: 30, D2: 26, D3: 24, D4: 20 };
  var SECTION_TITLES = {
    why: "Why it matters",
    concept: "Concept",
    aws: "How it works on AWS",
    demo: "Demo / guided practice",
    workflow: "How it works, step by step",
    examples: "Worked examples",
    usecases: "Use cases",
    casestudy: "Case study",
    exam: "Exam lens",
    architect: "Architect lens (400)",
    summary: "Key takeaways"
  };
  var LEVEL_NAMES = { "100": "Foundational", "200": "Intermediate", "300": "Advanced", "400": "Expert" };

  // ---------------------------------------------------------------- helpers
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pct(n, d) { return d ? Math.round((n * 100) / d) : 0; }
  function fmtDate(ts) { return ts ? new Date(ts).toLocaleDateString() : "–"; }
  function levelBadge(l) {
    if (!l || l === "–") return "";
    var first = String(l).slice(0, 3);
    return '<span class="lvl lvl-' + esc(first) + '" title="' + esc(LEVEL_NAMES[first] || "") + '">' + esc(l) + "</span>";
  }
  function bar(p, cls) {
    return '<div class="pbar ' + (cls || "") + '"><i style="width:' + p + '%"></i></div>';
  }

  // ---------------------------------------------------------------- catalog model
  var MODULES = [];   // ordered catalog modules
  var BY_ID = {};
  CATALOG.tracks.forEach(function (t) {
    t.modules.forEach(function (m) { m.trackTitle = t.title; MODULES.push(m); BY_ID[m.id] = m; });
  });

  function content(id) { return CONTENT[id] || null; }
  function isDeveloped(id) { return !!CONTENT[id]; }

  function lessonIndex() {
    var list = [];
    MODULES.forEach(function (m) {
      var c = content(m.id);
      if (c) c.lessons.forEach(function (l) { list.push({ module: m, lesson: l }); });
    });
    return list;
  }
  function findLesson(id) {
    var mid = id.slice(0, 3);
    var c = content(mid);
    if (!c) return null;
    for (var i = 0; i < c.lessons.length; i++) if (c.lessons[i].id === id) return { module: BY_ID[mid], c: c, lesson: c.lessons[i], idx: i };
    return null;
  }

  function moduleItems(id) {
    var c = content(id);
    if (!c) return [];
    var items = c.lessons.map(function (l) { return { kind: "lesson", id: l.id, title: l.title, done: S.isLessonDone(l.id) }; });
    (c.labs || []).forEach(function (lab) {
      var st = S.state.labs[lab.id];
      items.push({ kind: "lab", id: lab.id, title: "Lab " + lab.id + ": " + lab.title, done: !!(st && st.done) });
    });
    if (c.quiz) {
      var q = S.state.quizzes[id];
      items.push({ kind: "quiz", id: id, title: "Module quiz (pass mark " + c.quiz.passMark + "%)", done: !!(q && q.passed) });
    }
    return items;
  }
  function moduleProgress(id) {
    var items = moduleItems(id);
    var done = items.filter(function (i) { return i.done; }).length;
    return { done: done, total: items.length, pct: pct(done, items.length), complete: items.length > 0 && done === items.length };
  }
  function moduleStatus(id) {
    if (!isDeveloped(id)) return "soon";
    var p = moduleProgress(id);
    if (p.complete) return "done";
    if (!isUnlocked(id)) return "locked";
    return p.done > 0 ? "progress" : "new";
  }
  function missingPrereqs(id) {
    var m = BY_ID[id];
    // prerequisites that have no content yet cannot be completed, so they don't block
    return m.prereqs.filter(function (p) { return isDeveloped(p) && !moduleProgress(p).complete; });
  }
  function isUnlocked(id) {
    if (!S.state.settings.strictGating) return true;
    return missingPrereqs(id).length === 0;
  }
  var STATUS_LABEL = { soon: "Coming soon", done: "Complete", locked: "Locked", progress: "In progress", new: "Not started" };

  function nextUp() {
    var all = lessonIndex();
    for (var i = 0; i < all.length; i++) {
      var mid = all[i].module.id;
      if (!isUnlocked(mid)) continue;
      var items = moduleItems(mid);
      for (var j = 0; j < items.length; j++) {
        if (!items[j].done) {
          var it = items[j];
          return {
            title: it.title,
            module: all[i].module,
            href: it.kind === "lesson" ? "#/l/" + it.id : it.kind === "lab" ? "#/lab/" + mid + "/" + it.id : "#/quiz/" + mid
          };
        }
      }
    }
    return null;
  }

  function domainMastery() {
    var agg = { D1: { c: 0, t: 0 }, D2: { c: 0, t: 0 }, D3: { c: 0, t: 0 }, D4: { c: 0, t: 0 } };
    function add(d, c, t) { if (agg[d]) { agg[d].c += c; agg[d].t += t; } }
    Object.keys(S.state.checks).forEach(function (k) {
      var r = S.state.checks[k];
      if (r.domain) add(r.domain, r.correct ? 1 : 0, 1);
    });
    Object.keys(S.state.quizzes).forEach(function (k) {
      var d = S.state.quizzes[k].domains || {};
      Object.keys(d).forEach(function (dk) { add(dk, d[dk].c, d[dk].t); });
    });
    if (S.state.diagnostic) {
      var b = S.state.diagnostic.byDomain;
      Object.keys(b).forEach(function (dk) { add(dk, b[dk].c, b[dk].t); });
    }
    return agg;
  }

  function badges() {
    var out = [];
    var anyLesson = Object.keys(S.state.lessons).length > 0;
    out.push({ icon: "🚀", name: "Lift-off", desc: "Complete your first lesson", earned: anyLesson });
    out.push({ icon: "🩺", name: "Diagnosed", desc: "Take the diagnostic test", earned: !!S.state.diagnostic });
    out.push({ icon: "🛠️", name: "Hands-on", desc: "Complete your first lab", earned: Object.keys(S.state.labs).some(function (k) { return S.state.labs[k].done; }) });
    out.push({ icon: "🎯", name: "Quiz ace", desc: "Score 100% on a module quiz", earned: Object.keys(S.state.quizzes).some(function (k) { return S.state.quizzes[k].best === 100; }) });
    out.push({ icon: "🧠", name: "Recall builder", desc: "Review 25 flashcards", earned: Object.keys(S.state.cards).length >= 25 });
    MODULES.filter(function (m) { return isDeveloped(m.id); }).forEach(function (m) {
      out.push({ icon: "🏅", name: m.id + " complete", desc: m.title, earned: moduleProgress(m.id).complete });
    });
    return out;
  }

  function allCards(moduleId) {
    var cards = [];
    Object.keys(CONTENT).forEach(function (mid) {
      if (moduleId && moduleId !== "all" && mid !== moduleId) return;
      (CONTENT[mid].flashcards || []).forEach(function (c) { cards.push(Object.assign({ module: mid }, c)); });
    });
    return cards;
  }
  function dueCards(moduleId) {
    var now = Date.now();
    return allCards(moduleId).filter(function (c) {
      var st = S.cardState(c.id);
      return !st || st.due <= now;
    });
  }

  // ---------------------------------------------------------------- question rendering
  function renderQuestion(q, opts) {
    // opts: { name, order (option index order), mode: "check"|"quiz", number }
    var order = opts.order || q.options.map(function (_, i) { return i; });
    var multi = q.type === "multi";
    var need = multi ? q.options.filter(function (o) { return o.c; }).length : 1;
    var html = '<div class="question" data-qid="' + esc(q.id) + '">';
    html += '<div class="q-meta">' + (opts.number ? '<span class="q-num">Q' + opts.number + "</span>" : "");
    if (q.domain) html += '<span class="tag">' + esc(q.domain) + " · " + esc(DOMAINS[q.domain] || "") + "</span>";
    if (q.task) html += '<span class="tag">Task ' + esc(q.task) + "</span>";
    if (q.level) html += levelBadge(String(q.level));
    html += "</div>";
    html += '<div class="q-stem">' + q.stem + (multi ? ' <strong class="choose">(Choose ' + ["", "ONE", "TWO", "THREE"][need] + ")</strong>" : "") + "</div>";
    html += '<div class="q-options">';
    order.forEach(function (oi) {
      var o = q.options[oi];
      html += '<label class="opt" data-oi="' + oi + '"><input type="' + (multi ? "checkbox" : "radio") + '" name="' + esc(opts.name) + '" value="' + oi + '"><span class="opt-text">' + o.t + '</span><div class="opt-why" hidden></div></label>';
    });
    html += "</div>";
    if (opts.mode === "check") html += '<div class="q-actions"><button class="btn btn-sm" data-check="' + esc(q.id) + '">Check answer</button><span class="q-result"></span></div>';
    html += "</div>";
    return html;
  }

  function selectedOf(qEl) {
    return $all("input:checked", qEl).map(function (i) { return parseInt(i.value, 10); }).sort();
  }
  function isCorrect(q, sel) {
    var correct = q.options.map(function (o, i) { return o.c ? i : -1; }).filter(function (i) { return i >= 0; }).sort();
    return sel.length === correct.length && sel.every(function (v, i) { return v === correct[i]; });
  }
  function revealQuestion(q, qEl, sel) {
    var ok = isCorrect(q, sel);
    qEl.classList.add("revealed", ok ? "is-correct" : "is-wrong");
    $all(".opt", qEl).forEach(function (lab) {
      var oi = parseInt(lab.dataset.oi, 10);
      var o = q.options[oi];
      lab.classList.toggle("opt-correct", !!o.c);
      lab.classList.toggle("opt-picked-wrong", !o.c && sel.indexOf(oi) >= 0);
      var why = $(".opt-why", lab);
      if (o.why) { why.innerHTML = (o.c ? "✔ " : "✘ ") + o.why; why.hidden = false; }
      $("input", lab).disabled = true;
    });
    return ok;
  }

  // ---------------------------------------------------------------- views
  function reviewNote(c) {
    if (!c || !c.review) return "";
    var r = c.review;
    return '<section class="notice"><strong>Content review · ' + esc(r.version) + '</strong><p>' + esc(r.scope) +
      '</p><p class="small">Reviewed ' + esc(r.reviewedAt) + ' · Next review ' + esc(r.nextReview) + '</p><ul>' +
      r.sources.map(function (s) { return '<li><a href="' + esc(s.url) + '">' + esc(s.title) + '</a></li>'; }).join("") + '</ul></section>';
  }

  function studyLink(target) {
    var mid = target.slice(0, 3), m = BY_ID[mid], l = findLesson(target);
    if (!m) return "";
    if (!isDeveloped(mid)) return '<a href="#/m/' + mid + '">' + esc(mid + " " + m.title) + '</a> <span class="muted">(planned outline)</span>';
    if (!isUnlocked(mid)) {
      var prereqs = missingPrereqs(mid);
      return '<span>' + esc(target + " " + (l ? l.lesson.title : m.title)) + ' — complete prerequisites first: ' +
        prereqs.map(function (p) { return '<a href="#/m/' + p + '">' + esc(p + " " + BY_ID[p].title) + '</a>'; }).join(", ") + '</span>';
    }
    return '<a href="#/' + (l ? 'l/' + target : 'm/' + mid) + '">' + esc(target + " " + (l ? l.lesson.title : m.title)) + '</a>';
  }

  function diagnosticReview(onResultPage) {
    var d = S.state.diagnostic, config = content("M00").diagnostic;
    if (!d) return "";
    var h = '<section class="card" id="diagnostic-review"><h2>Your diagnostic study plan</h2><p>Latest score: ' + esc(d.score) +
      '%. This small sample guides revision; it does not establish exam readiness or unlock modules.</p>' + domainTable(d.byDomain, true);
    if (d.version !== config.version || !d.responses || !d.responses.length) {
      return h + '<p>Retake the current diagnostic to save question-level feedback and study links. Your earlier score is preserved.</p><a class="btn" href="#/diagnostic">Take diagnostic</a></section>';
    }
    var missed = d.responses.filter(function (r) { return !r.correct; });
    missed.sort(function (a, b) {
      function priority(r) {
        var q = config.questions.find(function (q) { return q.id === r.id; });
        var b = q && d.byDomain[q.domain];
        return b && b.t ? (1 - b.c / b.t) * DOMAIN_WEIGHT[q.domain] : 0;
      }
      return priority(b) - priority(a);
    });
    if (!missed.length) h += '<p>No missed questions in this attempt. Continue the curriculum and verify understanding with unseen questions; repeating this set can reward memorisation.</p>';
    else {
      h += '<p>Review missed questions below, prioritised by domain weakness and exam weighting. Study links respect your prerequisite setting; planned modules link to outlines.</p>';
      missed.forEach(function (r) {
        var q = config.questions.find(function (q) { return q.id === r.id; });
        if (!q) return;
        h += '<details class="notice"><summary>' + esc(q.id + ' · ' + q.domain + ' · Task ' + q.task) + (r.selected.length ? ' — incorrect' : ' — unanswered') + '</summary>';
        h += '<p>' + q.stem + '</p><p><strong>Your answer:</strong> ' + (r.selected.length ? r.selected.map(function (i) { return q.options[i] ? q.options[i].t : 'Unknown option'; }).join('; ') : 'No answer') + '</p>';
        h += '<ul>' + q.options.map(function (o) { return '<li><strong>' + (o.c ? 'Correct: ' : 'Distractor: ') + o.t + '</strong> — ' + o.why + '</li>'; }).join('') + '</ul>';
        h += '<p><strong>Study next:</strong></p><ul>' + (config.remediation[q.id] || []).map(function (id) { return '<li>' + studyLink(id) + '</li>'; }).join('') + '</ul></details>';
      });
    }
    return h + (onResultPage ? '<button class="btn" id="retake">Retake diagnostic (same question set)</button>'
      : '<a class="btn" href="#/diagnostic">Retake diagnostic (same question set)</a>') + '</section>';
  }

  function viewDashboard() {
    var lessonsTotal = lessonIndex().length;
    var lessonsDone = lessonIndex().filter(function (x) { return S.isLessonDone(x.lesson.id); }).length;
    var developed = MODULES.filter(function (m) { return isDeveloped(m.id); });
    var modulesDone = developed.filter(function (m) { return moduleProgress(m.id).complete; }).length;
    var nu = nextUp();
    var due = dueCards("all").length;
    var mastery = domainMastery();

    var h = '<section class="hero card">';
    h += '<div><h1>AWS Architect Academy</h1><p class="muted">Self-paced SAA-C03 learning pilot, with planned DevOps, IaC and system design tracks.</p><p>' + developed.length + ' of ' + MODULES.length + ' modules available · ' + lessonsTotal + ' available lessons. Remaining modules are planned outlines.</p></div>';
    if (nu) {
      h += '<div class="hero-next"><div class="muted small">Up next · ' + esc(nu.module.id) + " " + esc(nu.module.title) + "</div><div class=\"next-title\">" + esc(nu.title) + '</div><a class="btn btn-primary" href="' + nu.href + '">Continue →</a></div>';
    } else {
      h += '<div class="hero-next"><div class="next-title">All available content complete 🎉</div><a class="btn" href="#/catalog">Browse catalog</a></div>';
    }
    h += "</section>";

    h += '<section class="stats">';
    h += stat("Available lessons completed", lessonsDone + " / " + lessonsTotal, pct(lessonsDone, lessonsTotal));
    h += stat("Available modules completed", modulesDone + " / " + developed.length, pct(modulesDone, developed.length), MODULES.length + " modules in the planned curriculum");
    h += stat("Flashcards due", String(due), null, '<a href="#/cards/all">Review now →</a>');
    h += stat("Diagnostic", S.state.diagnostic ? S.state.diagnostic.score + "%" : "Not taken", null, S.state.diagnostic ? '<a href="#/l/M00.05">Review your diagnostic study plan →</a>' : '<a href="#/diagnostic">Take it (30 min) →</a>');
    h += "</section>";

    h += '<div class="grid-2">';
    h += '<section class="card"><h2>Practice accuracy by domain</h2><p class="muted small">Latest knowledge-check answers, quizzes and diagnostic. Repeated questions and incomplete coverage mean these percentages are not proof of mastery. Exam weights appear on the right.</p>';
    Object.keys(DOMAINS).forEach(function (d) {
      var a = mastery[d];
      var p = pct(a.c, a.t);
      h += '<div class="domain-row"><div class="domain-head"><span>' + d + " · " + DOMAINS[d] + '</span><span class="muted small">' + (a.t ? p + "% of " + a.t : "no data") + " · " + DOMAIN_WEIGHT[d] + "% of exam</span></div>" + bar(a.t ? p : 0, p >= 80 ? "good" : p >= 60 ? "ok" : "low") + "</div>";
    });
    h += "</section>";

    h += '<section class="card"><h2>Badges</h2><div class="badges">';
    badges().forEach(function (b) {
      h += '<div class="badge-item ' + (b.earned ? "earned" : "") + '" title="' + esc(b.desc) + '"><span class="b-icon">' + b.icon + '</span><span class="b-name">' + esc(b.name) + "</span></div>";
    });
    h += "</div></section></div>";

    h += '<section class="card"><h2>Learning paths</h2><div class="table-wrap"><table><thead><tr><th>Path</th><th>Modules</th><th>Effort</th><th>Outcome</th></tr></thead><tbody>';
    CATALOG.paths.forEach(function (p) {
      h += "<tr><td><strong>" + esc(p.id) + "</strong> " + esc(p.name) + "</td><td>" + esc(p.modules) + "</td><td>" + esc(p.hours) + "</td><td>" + esc(p.outcome) + "</td></tr>";
    });
    h += "</tbody></table></div></section>";
    return h;

    function stat(label, value, p, foot) {
      return '<div class="card stat"><div class="muted small">' + label + '</div><div class="stat-value">' + esc(value) + "</div>" + (p != null ? bar(p) : "") + (foot ? '<div class="small muted">' + foot + "</div>" : "") + "</div>";
    }
  }

  function viewCatalog() {
    var h = '<div class="page-head"><h1>Course catalog</h1><p class="muted">15 tracks · 47 modules · ' +
      MODULES.reduce(function (n, m) { return n + m.lessons.length; }, 0) +
      ' lessons. Modules marked <em>Coming soon</em> show their planned lessons.</p></div>';
    CATALOG.tracks.forEach(function (t) {
      h += '<section class="track"><h2><span class="track-id">' + esc(t.id) + "</span> " + esc(t.title) + '</h2><div class="module-grid">';
      t.modules.forEach(function (m) {
        var st = moduleStatus(m.id);
        var p = isDeveloped(m.id) ? moduleProgress(m.id) : null;
        h += '<a class="card module-card st-' + st + '" href="#/m/' + m.id + '">';
        h += '<div class="mc-top"><span class="mid">' + m.id + '</span><span class="status s-' + st + '">' + STATUS_LABEL[st] + "</span></div>";
        h += '<div class="mc-title">' + esc(m.title) + "</div>";
        h += '<div class="mc-meta">' + levelBadge(m.levels) + '<span class="muted small">' + esc(m.hours) + " · " + m.lessons.length + " lessons</span></div>";
        if (p) h += bar(p.pct, p.complete ? "good" : "");
        h += "</a>";
      });
      h += "</div></section>";
    });
    return h;
  }

  function viewModule(id) {
    var m = BY_ID[id];
    if (!m) return notFound();
    var c = content(id);
    var st = moduleStatus(id);
    var h = crumbs([["#/catalog", "Catalog"], [null, m.id]]);
    h += '<section class="card module-head"><div class="mh-top"><span class="mid">' + m.id + " · Track " + esc(m.track) + " – " + esc(m.trackTitle) + '</span><span class="status s-' + st + '">' + STATUS_LABEL[st] + "</span></div>";
    h += "<h1>" + esc(m.title) + "</h1>";
    h += '<div class="mh-meta">' + levelBadge(m.levels) + "<span>⏱ " + esc(m.hours) + "</span>" + (m.exam ? "<span>📘 Exam: " + esc(m.exam) + "</span>" : "") +
      "<span>🔗 Prerequisites: " + (m.prereqs.length ? m.prereqs.map(function (p) { return '<a href="#/m/' + p + '">' + p + "</a>"; }).join(", ") : "none") + "</span></div>";
    if (c && c.summary) h += '<p class="lead">' + c.summary + "</p>";
    if (c) {
      var p = moduleProgress(id);
      h += '<div class="mh-progress">' + bar(p.pct, p.complete ? "good" : "") + '<span class="small muted">' + p.done + " / " + p.total + " items complete</span></div>";
    }
    h += "</section>";

    if (st === "locked") {
      h += '<div class="notice warn">🔒 This module unlocks when you complete: ' + missingPrereqs(id).map(function (p) { return '<a href="#/m/' + p + '">' + p + " " + esc(BY_ID[p].title) + "</a>"; }).join(", ") +
        '. You can turn off strict gating on the <a href="#/progress">Progress</a> page.</div>';
    }

    if (!c) {
      h += '<div class="notice">This module is a planned outline. Lessons and assessments are not available yet.</div>';
      h += '<section class="card"><h2>Planned lessons</h2><div class="lesson-list">';
      m.lessons.forEach(function (l) {
        h += '<div class="lesson-row disabled"><span class="lr-id">' + esc(l.id) + '</span><div class="lr-main"><div class="lr-title">' + esc(l.title) + '</div><div class="small muted">' + esc(l.concepts) + "</div></div>" + levelBadge(l.level) + "</div>";
      });
      h += "</div></section>";
      return h;
    }

    h += reviewNote(c);
    if (c.objectives) {
      h += '<section class="card"><h2>Module outcomes</h2><ul class="checks">' + c.objectives.map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ul></section>";
    }

    var locked = st === "locked";
    h += '<section class="card"><h2>Lessons</h2><div class="lesson-list">';
    c.lessons.forEach(function (l) {
      var done = S.isLessonDone(l.id);
      h += '<a class="lesson-row ' + (done ? "done" : "") + (locked ? " disabled" : "") + '" href="' + (locked ? "javascript:void 0" : "#/l/" + l.id) + '">' +
        '<span class="tick">' + (done ? "✓" : "") + '</span><span class="lr-id">' + esc(l.id) + '</span><div class="lr-main"><div class="lr-title">' + esc(l.title) + "</div>" +
        '<div class="small muted">' + (l.minutes ? l.minutes + " min" : "") + (l.diagnostic ? " · assessment" : "") + "</div></div>" + levelBadge(String(l.level)) + "</a>";
    });
    h += "</div></section>";

    if ((c.labs || []).length) {
      h += '<section class="card"><h2>Hands-on labs</h2><div class="lesson-list">';
      c.labs.forEach(function (lab) {
        var ls = S.state.labs[lab.id] || { steps: {} };
        var nDone = Object.keys(ls.steps).length;
        h += '<a class="lesson-row ' + (ls.done ? "done" : "") + (locked ? " disabled" : "") + '" href="' + (locked ? "javascript:void 0" : "#/lab/" + id + "/" + lab.id) + '"><span class="tick">' + (ls.done ? "✓" : "") + '</span><span class="lr-id">' + esc(lab.id) + '</span><div class="lr-main"><div class="lr-title">' + esc(lab.title) + '</div><div class="small muted">' + esc(lab.duration) + " · est. cost " + esc(lab.cost) + " · " + nDone + "/" + lab.steps.length + " steps</div></div>" + levelBadge(String(lab.level)) + "</a>";
      });
      h += "</div></section>";
    }

    h += '<div class="grid-2">';
    if (c.quiz) {
      var q = S.state.quizzes[id];
      h += '<section class="card"><h2>Module quiz</h2><p class="muted">' + c.quiz.questions.length + " questions · pass mark " + c.quiz.passMark + "% · questions and options are shuffled each attempt.</p>" +
        (q ? "<p>Best: <strong>" + q.best + "%</strong> · Last: " + q.last + "% · Attempts: " + q.attempts + (q.passed ? ' · <span class="good-text">Passed ✓</span>' : "") + "</p>" : "") +
        (locked ? "" : '<a class="btn btn-primary" href="#/quiz/' + id + '">' + (q ? "Retake quiz" : "Start quiz") + "</a>") + "</section>";
    }
    var cards = (c.flashcards || []).length;
    if (cards) {
      h += '<section class="card"><h2>Flashcards</h2><p class="muted">' + cards + " cards · " + dueCards(id).length + " due now. Spaced repetition (SM-2) schedules each card.</p>" +
        '<a class="btn" href="#/cards/' + id + '">Review deck</a></section>';
    }
    h += "</div>";
    return h;
  }

  function viewLesson(lessonId) {
    var f = findLesson(lessonId);
    if (!f) return notFound();
    var m = f.module, l = f.lesson, c = f.c;
    if (!isUnlocked(m.id)) { location.hash = "#/m/" + m.id; return ""; }
    S.setLastVisited("#/l/" + l.id);
    var done = S.isLessonDone(l.id);
    var h = crumbs([["#/catalog", "Catalog"], ["#/m/" + m.id, m.id + " " + m.title], [null, l.id]]);
    h += '<article class="lesson">';
    h += '<header class="lesson-head"><div class="muted small">' + esc(l.id) + " · " + esc(m.title) + "</div><h1>" + esc(l.title) + '</h1><div class="mh-meta">' + levelBadge(String(l.level)) + (l.minutes ? "<span>⏱ " + l.minutes + " min</span>" : "") + (done ? '<span class="good-text">✓ Completed</span>' : "") + "</div></header>";

    if (l.objectives) {
      h += '<section class="objectives"><h2>Learning objectives</h2><p class="muted small">By the end of this lesson you can:</p><ul class="checks">' + l.objectives.map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ul></section>";
    }
    (l.sections || []).forEach(function (s) {
      h += '<section class="ls ls-' + s.type + '"><h2>' + esc(s.title || SECTION_TITLES[s.type] || "") + "</h2>" + s.html + "</section>";
    });

    if (l.diagnostic) {
      var d = S.state.diagnostic;
      h += '<section class="ls"><h2>Your diagnostic</h2>' + (d ? "<p>Last taken " + fmtDate(d.at) + " · score <strong>" + d.score + "%</strong>.</p>" : "<p>Not taken yet.</p>") +
        '<a class="btn btn-primary" href="#/diagnostic">' + (d ? "Retake diagnostic" : "Start diagnostic") + "</a></section>";
      h += diagnosticReview();
    }

    h += renderDrills(l.drills);

    if ((l.check || []).length) {
      h += '<section class="ls ls-check"><h2>Knowledge check</h2><p class="muted small">Answer every question to complete the lesson. Each option has an explanation.</p>';
      l.check.forEach(function (q, i) { h += renderQuestion(q, { name: "kc-" + q.id, mode: "check", number: i + 1 }); });
      h += "</section>";
    }

    if ((l.cards || []).length) {
      h += '<section class="ls"><h2>Flashcards</h2><p class="muted small">' + l.cards.length + ' cards from this lesson are in the <a href="#/cards/' + m.id + '">' + m.id + " deck</a>.</p></section>";
    }

    h += reviewNote(c);
    if ((l.references || []).length) {
      h += '<section class="ls ls-refs"><h2>References</h2><ul>' + l.references.map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul></section>";
    }

    var prev = c.lessons[f.idx - 1], next = c.lessons[f.idx + 1];
    h += '<footer class="lesson-foot">';
    h += prev ? '<a class="btn" href="#/l/' + prev.id + '">← ' + esc(prev.id) + "</a>" : '<a class="btn" href="#/m/' + m.id + '">← Module</a>';
    if (!l.diagnostic) {
      h += done ? '<button class="btn" id="undo-complete">Mark as not complete</button>'
        : '<button class="btn btn-primary" id="mark-complete"' + ((l.check || []).length ? " disabled" : "") + ">Mark lesson complete</button>";
    }
    h += next ? '<a class="btn" href="#/l/' + next.id + '">' + esc(next.id) + " →</a>" : '<a class="btn" href="#/m/' + m.id + '">Module overview →</a>';
    h += "</footer></article>";

    setTimeout(function () { bindLesson(l, next ? "#/l/" + next.id : "#/m/" + m.id); }, 0);
    return h;
  }

  function bindLesson(l, nextHref) {
    bindDrills(l.drills);
    var answered = {};
    var checks = l.check || [];
    function refreshComplete() {
      var btn = $("#mark-complete");
      if (btn) btn.disabled = Object.keys(answered).length < checks.length;
    }
    checks.forEach(function (q) {
      var qEl = $('.question[data-qid="' + q.id + '"]');
      if (!qEl) return;
      // restore previously answered state
      if (S.state.checks[q.id] && S.isLessonDone(l.id)) answered[q.id] = true;
      $("[data-check]", qEl).addEventListener("click", function () {
        var sel = selectedOf(qEl);
        if (!sel.length) { $(".q-result", qEl).textContent = "Select an answer first."; return; }
        var ok = revealQuestion(q, qEl, sel);
        $(".q-result", qEl).innerHTML = ok ? '<span class="good-text">Correct ✓</span>' : '<span class="bad-text">Not quite. Review the explanations.</span>';
        this.disabled = true;
        S.recordCheck(q.id, ok, q.domain);
        answered[q.id] = true;
        refreshComplete();
      });
    });
    refreshComplete();
    var mc = $("#mark-complete");
    if (mc) mc.addEventListener("click", function () { S.completeLesson(l.id); location.hash = nextHref; });
    var un = $("#undo-complete");
    if (un) un.addEventListener("click", function () { S.uncompleteLesson(l.id); render(); });
  }

  // ---------------------------------------------------------------- practice drills (auto-graded free-text)
  // drill: { id, q: "HTML", answers: ["10.0.0.0/24", ...], hint: "HTML", explain: "HTML", placeholder: "…" }
  // Comparison ignores case, spaces and commas, so "/24" style answers are tolerant of formatting.
  function normAnswer(s) { return String(s == null ? "" : s).toLowerCase().replace(/[\s,]+/g, ""); }
  function renderDrills(drills, title) {
    if (!(drills || []).length) return "";
    var h = '<section class="ls ls-drills"><h2>' + esc(title || "Practice drills") + '</h2><p class="muted small">Type your answer and press <em>Check</em> (or Enter). Work it out on paper first: the method matters more than the number.</p><ol class="drills">';
    drills.forEach(function (d) {
      h += '<li class="drill" data-drill="' + esc(d.id) + '"><div class="drill-q">' + d.q + '</div>' +
        '<div class="drill-row"><input type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(d.placeholder || "Your answer") + '" aria-label="Answer">' +
        '<button class="btn btn-sm" data-drill-check>Check</button>' + (d.hint ? '<button class="btn btn-sm" data-drill-hint>Hint</button>' : "") +
        '<button class="btn btn-sm" data-drill-show>Show answer</button><span class="drill-result" aria-live="polite"></span></div>' +
        (d.hint ? '<div class="drill-hint" hidden>💡 ' + d.hint + "</div>" : "") +
        '<div class="drill-explain" hidden><strong>Answer:</strong> <code>' + esc(d.answers[0]) + "</code>" + (d.explain ? "<div>" + d.explain + "</div>" : "") + "</div></li>";
    });
    return h + "</ol></section>";
  }
  function bindDrills(drills) {
    (drills || []).forEach(function (d) {
      var el = $('.drill[data-drill="' + d.id + '"]');
      if (!el) return;
      var input = $("input", el), res = $(".drill-result", el), ex = $(".drill-explain", el);
      var ok = d.answers.map(normAnswer);
      function check() {
        if (!input.value.trim()) { res.textContent = "Type an answer first."; return; }
        var good = ok.indexOf(normAnswer(input.value)) >= 0;
        res.innerHTML = good ? '<span class="good-text">Correct ✓</span>' : '<span class="bad-text">Not quite. Try again or use the hint.</span>';
        el.classList.toggle("drill-ok", good);
        if (good) ex.hidden = false;
      }
      $("[data-drill-check]", el).addEventListener("click", check);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
      var hb = $("[data-drill-hint]", el);
      if (hb) hb.addEventListener("click", function () { $(".drill-hint", el).hidden = false; });
      $("[data-drill-show]", el).addEventListener("click", function () { ex.hidden = false; });
    });
  }

  // ---------------------------------------------------------------- quiz engine
  var attempt = null;

  function startAttempt(kind, id, questions, passMark, title) {
    attempt = {
      kind: kind, id: id, title: title, passMark: passMark, started: Date.now(),
      items: shuffle(questions).map(function (q) { return { q: q, order: shuffle(q.options.map(function (_, i) { return i; })) }; })
    };
  }

  function viewQuiz(id, isDiagnostic) {
    var questions, passMark, title, back;
    if (isDiagnostic) {
      var m0 = content("M00");
      if (!m0 || !m0.diagnostic) return notFound();
      questions = m0.diagnostic.questions; passMark = 0; title = "Diagnostic test"; back = "#/l/M00.05";
    } else {
      var c = content(id);
      if (!c || !c.quiz) return notFound();
      if (!isUnlocked(id)) { location.hash = "#/m/" + id; return ""; }
      questions = c.quiz.questions; passMark = c.quiz.passMark; title = id + " module quiz"; back = "#/m/" + id;
    }
    var kind = isDiagnostic ? "diagnostic" : "quiz";
    if (!attempt || attempt.kind !== kind || attempt.id !== id || attempt.finished) startAttempt(kind, id, questions, passMark, title);

    var h = crumbs([[back, isDiagnostic ? "M00.05" : id], [null, title]]);
    h += '<div class="quiz-head card"><div><h1>' + esc(title) + '</h1><p class="muted">' + attempt.items.length + " questions" + (passMark ? " · pass mark " + passMark + "%" : "") +
      " · Multiple-response questions are all-or-nothing, as on the real exam.</p></div>" +
      '<div class="quiz-timer" id="timer">00:00</div></div>';
    h += '<form id="quiz-form">';
    attempt.items.forEach(function (it, i) {
      h += '<div class="card">' + renderQuestion(it.q, { name: "q-" + i, order: it.order, mode: "quiz", number: i + 1 }) + "</div>";
    });
    h += '<div class="quiz-submit card"><span id="answered-count" class="muted"></span><button type="submit" class="btn btn-primary">Submit answers</button></div></form>';
    h += '<div id="quiz-result"></div>';
    setTimeout(bindQuiz, 0);
    return h;
  }

  var timerHandle = null;
  function bindQuiz() {
    var form = $("#quiz-form");
    // Rapid route renders can queue more than one deferred bind for the same form.
    if (!form || form.dataset.quizBound) return;
    form.dataset.quizBound = "true";
    clearInterval(timerHandle);
    timerHandle = setInterval(function () {
      var el = $("#timer");
      if (!el || !attempt) { clearInterval(timerHandle); return; }
      var s = Math.floor((Date.now() - attempt.started) / 1000);
      el.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }, 1000);
    function count() {
      var n = $all(".question", form).filter(function (q) { return selectedOf(q).length > 0; }).length;
      $("#answered-count").textContent = n + " of " + attempt.items.length + " answered";
    }
    form.addEventListener("change", count);
    count();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!attempt || attempt.finished) return;
      var qEls = $all(".question", form);
      var unanswered = qEls.filter(function (q) { return !selectedOf(q).length; }).length;
      if (unanswered && !confirm(unanswered + " question(s) unanswered. Unanswered questions score as incorrect. Submit anyway?")) return;
      var correct = 0, byDomain = {}, responses = [];
      attempt.items.forEach(function (it, i) {
        var qEl = qEls[i];
        var ok = revealQuestion(it.q, qEl, selectedOf(qEl));
        responses.push({ id: it.q.id, selected: selectedOf(qEl), correct: ok });
        if (ok) correct++;
        var d = it.q.domain || "D1";
        byDomain[d] = byDomain[d] || { c: 0, t: 0 };
        byDomain[d].t++;
        if (ok) byDomain[d].c++;
      });
      clearInterval(timerHandle);
      var score = pct(correct, attempt.items.length);
      attempt.finished = true;
      $(".quiz-submit", form).hidden = true;
      var r = $("#quiz-result");
      var h = '<div class="card result">';
      if (attempt.kind === "diagnostic") {
        S.recordDiagnostic(score, byDomain, responses, content("M00").diagnostic.version);
        S.completeLesson("M00.05"); // taking the diagnostic completes its lesson
        h += "<h2>Diagnostic result: " + score + "%</h2><p>" + correct + " of " + attempt.items.length + " correct. Here is what to do next for each domain:</p>";
        h += diagnosticReview(true);
        h += '<p class="muted small">Your feedback is saved in this browser and included in progress exports.</p><a class="btn btn-primary" href="#/l/M00.05">Back to lesson</a>';
      } else {
        var rec = S.recordQuiz(attempt.id, score, attempt.passMark, byDomain);
        var passed = score >= attempt.passMark;
        h += "<h2>" + (passed ? "Passed ✓" : "Not yet") + " · " + score + "%</h2><p>" + correct + " of " + attempt.items.length + " correct · pass mark " + attempt.passMark + "% · best " + rec.best + "%</p>";
        h += domainTable(byDomain, false);
        h += '<p class="muted small">Review the explanations above, then retake when ready. Questions and options are reshuffled each attempt.</p>';
        h += '<a class="btn btn-primary" href="#/m/' + attempt.id + '">Back to module</a> <button class="btn" id="retake">Retake</button>';
      }
      h += "</div>";
      r.innerHTML = h;
      r.scrollIntoView({ behavior: "smooth" });
      var rt = $("#retake");
      if (rt) rt.addEventListener("click", function () { attempt = null; render(); window.scrollTo(0, 0); });
    });
  }

  function domainTable(byDomain, advise) {
    var h = '<div class="table-wrap"><table><thead><tr><th>Domain</th><th>Score</th>' + (advise ? "<th>Recommendation</th>" : "") + "</tr></thead><tbody>";
    Object.keys(DOMAINS).forEach(function (d) {
      var b = byDomain[d];
      if (!b) return;
      var p = pct(b.c, b.t);
      var rec = p >= 80 ? "Promising sample. Continue studying and verify with unseen questions; no test-out is awarded."
        : p >= 50 ? "Review missed topics and continue the Exam Path."
          : "Prioritise this domain; follow the study links and their prerequisites.";
      h += "<tr><td>" + d + " · " + DOMAINS[d] + "</td><td>" + b.c + "/" + b.t + " (" + p + "%)</td>" + (advise ? "<td>" + rec + "</td>" : "") + "</tr>";
    });
    return h + "</tbody></table></div>";
  }

  // ---------------------------------------------------------------- labs
  function viewLab(mid, labId) {
    var c = content(mid);
    var lab = c && (c.labs || []).filter(function (x) { return x.id === labId; })[0];
    if (!lab) return notFound();
    if (!isUnlocked(mid)) { location.hash = "#/m/" + mid; return ""; }
    S.setLastVisited("#/lab/" + mid + "/" + labId);
    var st = S.state.labs[labId] || { steps: {}, done: null };
    var h = crumbs([["#/catalog", "Catalog"], ["#/m/" + mid, mid], [null, "Lab " + labId]]);
    h += '<article class="lesson"><header class="lesson-head"><div class="muted small">Hands-on lab · ' + esc(mid) + "</div><h1>" + esc(labId) + ": " + esc(lab.title) + "</h1>" +
      '<div class="mh-meta">' + levelBadge(String(lab.level)) + "<span>⏱ " + esc(lab.duration) + "</span><span>💲 " + esc(lab.cost) + "</span>" + (st.done ? '<span class="good-text">✓ Completed</span>' : "") + "</div></header>";
    h += '<section class="ls"><h2>Objective</h2>' + lab.objective + "</section>";
    if (lab.warning) h += '<div class="notice warn">' + lab.warning + "</div>";
    if (lab.diagram) h += '<section class="ls"><h2>What you will build</h2>' + lab.diagram + "</section>";
    h += '<section class="ls"><h2>Steps</h2><p class="muted small">Tick each step as you complete it. Progress is saved.</p><ol class="lab-steps">';
    lab.steps.forEach(function (s) {
      h += '<li class="lab-step ' + (st.steps[s.id] ? "done" : "") + '"><label class="lab-check"><input type="checkbox" data-step="' + esc(s.id) + '"' + (st.steps[s.id] ? " checked" : "") + '><span class="lab-step-title">' + esc(s.title) + '</span></label><div class="lab-step-body">' + s.html + "</div></li>";
    });
    h += "</ol></section>";
    h += renderDrills(lab.drills, lab.drillsTitle || "Auto-graded exercises");
    if (lab.validate) h += '<section class="ls ls-exam"><h2>Validate your work</h2>' + lab.validate + "</section>";
    if (lab.cleanup) h += '<section class="ls"><h2>Clean-up</h2>' + lab.cleanup + "</section>";
    h += '<footer class="lesson-foot"><a class="btn" href="#/m/' + mid + '">← Module</a>' +
      (st.done ? '<button class="btn" id="lab-undo">Mark as not complete</button>' : '<button class="btn btn-primary" id="lab-done" disabled>Mark lab complete</button>') + "</footer></article>";
    setTimeout(function () {
      bindDrills(lab.drills);
      function refresh() {
        var all = $all("[data-step]");
        var b = $("#lab-done");
        if (b) b.disabled = !all.every(function (i) { return i.checked; });
      }
      $all("[data-step]").forEach(function (cb) {
        cb.addEventListener("change", function () {
          S.toggleLabStep(labId, cb.dataset.step, cb.checked);
          cb.closest(".lab-step").classList.toggle("done", cb.checked);
          refresh();
        });
      });
      refresh();
      var d = $("#lab-done");
      if (d) d.addEventListener("click", function () { S.setLabDone(labId, true); render(); });
      var u = $("#lab-undo");
      if (u) u.addEventListener("click", function () { S.setLabDone(labId, false); render(); });
    }, 0);
    return h;
  }

  // ---------------------------------------------------------------- flashcards
  var cardSession = null;

  function viewCards(deck) {
    deck = deck || "all";
    var deckName = deck === "all" ? "All decks" : deck + " " + (BY_ID[deck] ? BY_ID[deck].title : "");
    if (!cardSession || cardSession.deck !== deck) {
      cardSession = { deck: deck, cram: false, queue: shuffle(dueCards(deck)), reviewed: 0 };
    }
    var h = crumbs([deck === "all" ? ["#/", "Dashboard"] : ["#/m/" + deck, deck], [null, "Flashcards"]]);
    h += '<div class="page-head"><h1>Flashcards · ' + esc(deckName) + '</h1><p class="muted">Recall the answer before flipping. Grade yourself honestly: the schedule adapts to you. Keys: <kbd>Space</kbd> flip, <kbd>1</kbd>–<kbd>4</kbd> grade.</p>';
    h += '<div class="deck-picker"><a class="chip ' + (deck === "all" ? "on" : "") + '" href="#/cards/all">All</a>';
    Object.keys(CONTENT).forEach(function (mid) {
      if ((CONTENT[mid].flashcards || []).length) h += '<a class="chip ' + (deck === mid ? "on" : "") + '" href="#/cards/' + mid + '">' + mid + " (" + dueCards(mid).length + " due)</a>";
    });
    h += "</div></div>";

    var card = cardSession.queue[0];
    if (!card) {
      var total = allCards(deck).length;
      h += '<div class="card center"><h2>Nothing due 🎉</h2><p class="muted">You reviewed ' + cardSession.reviewed + " card(s) this session. " + total + " cards in this deck.</p>" +
        '<button class="btn" id="cram">Study all ' + total + " cards anyway</button></div>";
      setTimeout(function () {
        var b = $("#cram");
        if (b) b.addEventListener("click", function () { cardSession.queue = shuffle(allCards(deck)); cardSession.cram = true; render(); });
      }, 0);
      return h;
    }
    h += '<div class="flash-wrap"><div class="muted small">' + cardSession.queue.length + " remaining · " + esc(card.module) + "</div>";
    h += '<div class="flashcard" id="flashcard" tabindex="0"><div class="fc-face fc-front"><div class="fc-label">Question</div><div class="fc-text">' + card.front + '</div><div class="muted small">Click or press Space to reveal</div></div>' +
      '<div class="fc-face fc-back" hidden><div class="fc-label">Answer</div><div class="fc-text">' + card.back + "</div></div></div>";
    h += '<div class="grades" id="grades" hidden><button class="btn g-again" data-q="1">1 · Again</button><button class="btn g-hard" data-q="3">2 · Hard</button><button class="btn g-good" data-q="4">3 · Good</button><button class="btn g-easy" data-q="5">4 · Easy</button></div></div>';

    setTimeout(function () {
      var fc = $("#flashcard");
      if (!fc) return;
      fc.focus();
      function flip() {
        $(".fc-front", fc).hidden = true;
        $(".fc-back", fc).hidden = false;
        $("#grades").hidden = false;
        fc.classList.add("flipped");
      }
      function grade(q) {
        var res = S.gradeCard(card.id, q);
        cardSession.queue.shift();
        cardSession.reviewed++;
        if (q < 3) cardSession.queue.push(card); // see again in this session
        void res;
        render();
      }
      fc.addEventListener("click", flip);
      $all("#grades [data-q]").forEach(function (b) { b.addEventListener("click", function () { grade(parseInt(b.dataset.q, 10)); }); });
      keyHandler = function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.code === "Space") { e.preventDefault(); flip(); }
        var map = { Digit1: 1, Digit2: 3, Digit3: 4, Digit4: 5 };
        if (map[e.code] && !$("#grades").hidden) grade(map[e.code]);
      };
    }, 0);
    return h;
  }
  var keyHandler = null;
  document.addEventListener("keydown", function (e) { if (keyHandler) keyHandler(e); });

  // ---------------------------------------------------------------- progress page
  function viewProgress() {
    var h = '<div class="page-head"><h1>Your progress</h1><p class="muted">Started ' + fmtDate(S.state.started) + ".</p></div>";
    h += '<section class="card"><h2>Saved in this browser</h2>';
    h += "<p>Progress is stored using <strong>" + esc(S.backendName()) + "</strong>" + (S.isPersistent() ? " and persists between visits." : '. <span class="bad-text">It will be lost when this tab closes. Export a backup, or serve the app over http:// (see README).</span>') + "</p>";
    h += '<p class="muted small">Storage order: localStorage → cookies → sessionStorage. Progress stays on this device. Use export/import to move it to another browser.</p>';
    h += '<div class="btn-row"><button class="btn" id="export">⬇ Export progress (JSON)</button><label class="btn">⬆ Import progress<input type="file" id="import" accept="application/json" hidden></label><button class="btn btn-danger" id="reset">Reset all progress</button></div></section>';

    h += '<section class="card"><h2>Settings</h2><label class="switch"><input type="checkbox" id="gating"' + (S.state.settings.strictGating ? " checked" : "") + "> Strict prerequisite gating (lock modules until their prerequisites are complete)</label></section>";

    h += '<section class="card"><h2>Modules</h2><div class="table-wrap"><table><thead><tr><th>Module</th><th>Status</th><th>Progress</th><th>Quiz best</th></tr></thead><tbody>';
    MODULES.filter(function (m) { return isDeveloped(m.id); }).forEach(function (m) {
      var p = moduleProgress(m.id), q = S.state.quizzes[m.id];
      h += '<tr><td><a href="#/m/' + m.id + '">' + m.id + " " + esc(m.title) + '</a></td><td><span class="status s-' + moduleStatus(m.id) + '">' + STATUS_LABEL[moduleStatus(m.id)] + "</span></td><td>" + p.done + "/" + p.total + "</td><td>" + (q ? q.best + "%" : "–") + "</td></tr>";
    });
    h += "</tbody></table></div></section>";

    var qs = Object.keys(S.state.quizzes);
    if (qs.length) {
      h += '<section class="card"><h2>Quiz history</h2><div class="table-wrap"><table><thead><tr><th>Module</th><th>Attempts</th><th>Scores (latest last)</th></tr></thead><tbody>';
      qs.forEach(function (k) {
        var q = S.state.quizzes[k];
        h += "<tr><td>" + esc(k) + "</td><td>" + q.attempts + "</td><td>" + q.history.map(function (x) { return x.score + "%"; }).join(" → ") + "</td></tr>";
      });
      h += "</tbody></table></div></section>";
    }

    setTimeout(function () {
      $("#export").addEventListener("click", function () {
        var blob = new Blob([S.exportJSON()], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "aws-academy-progress-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a); a.click(); a.remove();
      });
      $("#import").addEventListener("change", function (e) {
        var f = e.target.files[0];
        if (!f) return;
        f.text().then(function (t) {
          try { S.importJSON(t); toast("Progress imported"); render(); } catch (err) { alert("Import failed: " + err.message); }
        });
      });
      $("#reset").addEventListener("click", function () {
        if (confirm("Delete ALL progress (lessons, quizzes, labs, flashcards)? This cannot be undone. Consider exporting first.")) { S.reset(); toast("Progress reset"); render(); }
      });
      $("#gating").addEventListener("change", function (e) { S.setSetting("strictGating", e.target.checked); });
    }, 0);
    return h;
  }

  // ---------------------------------------------------------------- misc
  function crumbs(list) {
    return '<nav class="crumbs">' + list.map(function (c) { return c[0] ? '<a href="' + c[0] + '">' + esc(c[1]) + "</a>" : "<span>" + esc(c[1]) + "</span>"; }).join(" / ") + "</nav>";
  }
  function notFound() { return '<div class="card center"><h1>Not found</h1><p><a href="#/">Back to dashboard</a></p></div>'; }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  function enhance() {
    // copy buttons on code blocks
    $all("pre", app).forEach(function (pre) {
      if (pre.querySelector(".copy")) return;
      var b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.textContent = "Copy";
      b.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        var text = code.innerText;
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { b.textContent = "Select & copy"; });
        setTimeout(function () { b.textContent = "Copy"; }, 1500);
      });
      pre.appendChild(b);
    });
    $all(".table-wrap table, table", app).forEach(function (t) {
      if (t.parentElement.classList.contains("table-wrap")) return;
      var w = document.createElement("div"); w.className = "table-wrap";
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }

  // ---------------------------------------------------------------- router
  function render() {
    keyHandler = null;
    var parts = (location.hash || "#/").replace(/^#\/?/, "").split("/");
    var route = parts[0] || "";
    var html;
    switch (route) {
      case "": html = viewDashboard(); break;
      case "catalog": html = viewCatalog(); break;
      case "m": html = viewModule(parts[1]); break;
      case "l": html = viewLesson(parts[1]); break;
      case "quiz": html = viewQuiz(parts[1], false); break;
      case "diagnostic": html = viewQuiz("M00", true); break;
      case "lab": html = viewLab(parts[1], parts[2]); break;
      case "cards": html = viewCards(parts[1]); break;
      case "progress": html = viewProgress(); break;
      default: html = notFound();
    }
    if (html === "") return; // redirected
    app.innerHTML = html;
    enhance();
    $all(".nav a").forEach(function (a) {
      var r = a.getAttribute("href").replace(/^#\/?/, "").split("/")[0];
      a.classList.toggle("active", r === route || (r === "catalog" && (route === "m" || route === "l" || route === "lab" || route === "quiz")));
    });
    $("#storage-note").textContent = "Progress saved via " + S.backendName();
  }

  var lastHash = null;
  window.addEventListener("hashchange", function () {
    // leaving an unfinished quiz discards it
    if (attempt && !attempt.finished && !/^#\/(quiz|diagnostic)/.test(location.hash)) attempt = null;
    if (!/^#\/cards/.test(location.hash)) cardSession = null;
    render();
    if (lastHash !== location.hash) window.scrollTo(0, 0);
    lastHash = location.hash;
  });

  // theme
  var root = document.documentElement;
  try { var th = localStorage.getItem("aws-academy-theme"); if (th) root.dataset.theme = th; } catch (e) { /* ignore */ }
  $("#theme").addEventListener("click", function () {
    var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("aws-academy-theme", root.dataset.theme); } catch (e) { /* ignore */ }
  });

  render();
})();

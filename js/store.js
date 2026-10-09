/*
 * Progress store.
 *
 * Persists learner progress with the first backend that works:
 *   1. localStorage  - persistent, ~5 MB, works for file:// pages in Chrome/Firefox/Edge
 *   2. cookies       - persistent, chunked (browsers cap a cookie at ~4 KB); NOT available on file:// in Chrome
 *   3. sessionStorage - survives reloads, cleared when the tab closes
 *   4. memory        - last resort; lost on reload
 * Progress can always be exported/imported as JSON from the Progress page.
 */
(function () {
  "use strict";

  var KEY = "aws-academy-progress-v1";
  var COOKIE_CHUNK = 3500;
  var COOKIE_MAX_CHUNKS = 40;

  function blank() {
    return {
      version: 1,
      started: Date.now(),
      lessons: {},     // lessonId -> completedAt
      checks: {},      // questionId -> { correct, at, domain }
      quizzes: {},     // moduleId -> { best, last, attempts, passed, history: [{score, at}] }
      diagnostic: null,// { at, score, byDomain: {D1:{c,t}} }
      labs: {},        // labId -> { steps: {stepId: true}, done: ts }
      cards: {},       // cardId -> { ef, interval, reps, due }
      lastVisited: null,
      settings: { strictGating: true }
    };
  }

  // Validate before replacing saved progress. Older v1 exports may omit fields.
  function normalize(obj) {
    function record(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
    function number(v) { return typeof v === "number" && Number.isFinite(v) && v >= 0; }
    function requireValue(ok) { if (!ok) throw new Error("Invalid progress data; existing progress was kept"); }
    function domains(v) {
      requireValue(record(v));
      Object.keys(v).forEach(function (d) {
        requireValue(/^D[1-4]$/.test(d) && record(v[d]) && number(v[d].c) && number(v[d].t) && v[d].c <= v[d].t);
      });
    }
    requireValue(record(obj) && obj.version === 1 && record(obj.lessons));
    var next = blank();
    ["lessons", "checks", "quizzes", "labs", "cards"].forEach(function (field) {
      if (obj[field] === undefined) return;
      requireValue(record(obj[field]));
      Object.keys(obj[field]).forEach(function (key) {
        requireValue(/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(key) && !["__proto__", "constructor", "prototype"].includes(key));
        var v = obj[field][key];
        if (field === "lessons") requireValue(number(v));
        else {
          requireValue(record(v));
          if (field === "checks") requireValue(typeof v.correct === "boolean" && number(v.at) && (v.domain == null || /^D[1-4]$/.test(v.domain)));
          if (field === "quizzes") {
            requireValue(number(v.best) && v.best <= 100 && number(v.attempts) && typeof v.passed === "boolean" && Array.isArray(v.history));
            requireValue(v.last === undefined || (number(v.last) && v.last <= 100));
            v.history.forEach(function (h) { requireValue(record(h) && number(h.score) && h.score <= 100 && number(h.at)); });
            if (v.domains !== undefined) domains(v.domains);
          }
          if (field === "labs") {
            requireValue(record(v.steps) && (v.done == null || number(v.done)));
            Object.keys(v.steps).forEach(function (step) { requireValue(typeof v.steps[step] === "boolean"); });
          }
          if (field === "cards") requireValue(number(v.ef) && number(v.interval) && number(v.reps) && number(v.due));
        }
        next[field][key] = v;
      });
    });
    if (obj.settings !== undefined) {
      requireValue(record(obj.settings));
      if (obj.settings.strictGating !== undefined) {
        requireValue(typeof obj.settings.strictGating === "boolean");
        next.settings.strictGating = obj.settings.strictGating;
      }
    }
    if (obj.started !== undefined) { requireValue(number(obj.started)); next.started = obj.started; }
    if (obj.lastVisited != null) { requireValue(typeof obj.lastVisited === "string"); next.lastVisited = obj.lastVisited; }
    if (obj.diagnostic != null) {
      var d = obj.diagnostic;
      requireValue(record(d) && number(d.score) && d.score <= 100 && number(d.at));
      domains(d.byDomain);
      requireValue(d.version === undefined || typeof d.version === "string");
      if (d.responses !== undefined) {
        requireValue(Array.isArray(d.responses));
        d.responses.forEach(function (r) {
          requireValue(record(r) && typeof r.id === "string" && typeof r.correct === "boolean" && Array.isArray(r.selected));
          requireValue(r.selected.every(function (i) { return Number.isInteger(i) && i >= 0; }));
        });
      }
      next.diagnostic = d;
    }
    return next;
  }

  // ---- backends ---------------------------------------------------------
  // Accessing window.localStorage itself can throw (e.g. SecurityError when site data is blocked),
  // so the getter call happens inside the try as well.
  function probe(getStorage) {
    try {
      var storage = getStorage();
      if (!storage) return false;
      var k = "__probe__";
      storage.setItem(k, "1");
      storage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  var local = {
    name: "localStorage",
    ok: function () { return probe(function () { return window.localStorage; }); },
    read: function () { return window.localStorage.getItem(KEY); },
    write: function (s) { window.localStorage.setItem(KEY, s); },
    clear: function () { window.localStorage.removeItem(KEY); }
  };

  var session = {
    name: "sessionStorage",
    ok: function () { return probe(function () { return window.sessionStorage; }); },
    read: function () { return window.sessionStorage.getItem(KEY); },
    write: function (s) { window.sessionStorage.setItem(KEY, s); },
    clear: function () { window.sessionStorage.removeItem(KEY); }
  };

  function getCookie(name) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
    return m ? m[1] : null;
  }
  function setCookie(name, value, maxAge) {
    document.cookie = name + "=" + value + "; max-age=" + maxAge + "; path=/; SameSite=Lax";
  }

  var cookie = {
    name: "cookies",
    ok: function () {
      try {
        setCookie("__probe__", "1", 60);
        var ok = getCookie("__probe__") === "1";
        setCookie("__probe__", "", 0);
        return ok;
      } catch (e) { return false; }
    },
    read: function () {
      var n = parseInt(getCookie(KEY + "_n") || "0", 10);
      if (!n) return null;
      var out = "";
      for (var i = 0; i < n; i++) out += getCookie(KEY + "_" + i) || "";
      try { return decodeURIComponent(out); } catch (e) { return null; }
    },
    write: function (s) {
      var enc = encodeURIComponent(s);
      var chunks = Math.ceil(enc.length / COOKIE_CHUNK);
      if (chunks > COOKIE_MAX_CHUNKS) throw new Error("Progress too large for cookies");
      var old = parseInt(getCookie(KEY + "_n") || "0", 10);
      var year = 60 * 60 * 24 * 365;
      for (var i = 0; i < chunks; i++) setCookie(KEY + "_" + i, enc.slice(i * COOKIE_CHUNK, (i + 1) * COOKIE_CHUNK), year);
      for (var j = chunks; j < old; j++) setCookie(KEY + "_" + j, "", 0);
      setCookie(KEY + "_n", String(chunks), year);
    },
    clear: function () {
      var n = parseInt(getCookie(KEY + "_n") || "0", 10);
      for (var i = 0; i < n; i++) setCookie(KEY + "_" + i, "", 0);
      setCookie(KEY + "_n", "", 0);
    }
  };

  var memoryValue = null;
  var memory = {
    name: "memory (not saved)",
    ok: function () { return true; },
    read: function () { return memoryValue; },
    write: function (s) { memoryValue = s; },
    clear: function () { memoryValue = null; }
  };

  var backend = [local, cookie, session, memory].filter(function (b) { return b.ok(); })[0];

  // ---- state ------------------------------------------------------------
  var state;
  try {
    var raw = backend.read();
    state = raw ? normalize(JSON.parse(raw)) : blank();
  } catch (e) {
    state = blank();
  }
  // forward-compatible defaults
  var defaults = blank();
  Object.keys(defaults).forEach(function (k) { if (state[k] === undefined) state[k] = defaults[k]; });

  var listeners = [];

  function save() {
    try {
      backend.write(JSON.stringify(state));
    } catch (e) {
      // e.g. cookie quota exceeded -> degrade to session/memory
      backend = [session, memory].filter(function (b) { return b.ok(); })[0];
      try { backend.write(JSON.stringify(state)); } catch (e2) { /* memory never throws */ }
    }
    listeners.forEach(function (fn) { fn(state); });
  }

  window.LMSStore = {
    get state() { return state; },
    backendName: function () { return backend.name; },
    isPersistent: function () { return backend === local || backend === cookie; },
    save: save,
    onChange: function (fn) { listeners.push(fn); },

    // lessons
    completeLesson: function (id) { if (!state.lessons[id]) { state.lessons[id] = Date.now(); save(); } },
    uncompleteLesson: function (id) { delete state.lessons[id]; save(); },
    isLessonDone: function (id) { return !!state.lessons[id]; },

    // knowledge checks
    recordCheck: function (qid, correct, domain) {
      state.checks[qid] = { correct: !!correct, at: Date.now(), domain: domain || null };
      save();
    },

    // quizzes
    recordQuiz: function (moduleId, score, passMark, responses) {
      var q = state.quizzes[moduleId] || { best: 0, attempts: 0, passed: false, history: [] };
      q.attempts += 1;
      q.last = score;
      q.best = Math.max(q.best, score);
      q.passed = q.passed || score >= passMark;
      q.history.push({ score: score, at: Date.now() });
      if (q.history.length > 20) q.history = q.history.slice(-20);
      q.domains = responses; // latest attempt's per-domain {D1:{c,t}}
      state.quizzes[moduleId] = q;
      save();
      return q;
    },

    recordDiagnostic: function (score, byDomain, responses, version) {
      state.diagnostic = { at: Date.now(), score: score, byDomain: byDomain, responses: responses || [], version: version || "legacy" };
      save();
    },

    // labs
    toggleLabStep: function (labId, stepId, on) {
      var l = state.labs[labId] || { steps: {}, done: null };
      if (on) l.steps[stepId] = true; else delete l.steps[stepId];
      state.labs[labId] = l;
      save();
    },
    setLabDone: function (labId, done) {
      var l = state.labs[labId] || { steps: {}, done: null };
      l.done = done ? Date.now() : null;
      state.labs[labId] = l;
      save();
    },

    // flashcards (SM-2)
    cardState: function (id) { return state.cards[id] || null; },
    gradeCard: function (id, quality) {
      // quality: 1 = again, 3 = hard, 4 = good, 5 = easy
      var c = state.cards[id] || { ef: 2.5, interval: 0, reps: 0, due: 0 };
      if (quality < 3) {
        c.reps = 0;
        c.interval = 0;
        c.due = Date.now() + 60 * 1000; // see again in this session
      } else {
        c.reps += 1;
        if (c.reps === 1) c.interval = 1;
        else if (c.reps === 2) c.interval = 6;
        else c.interval = Math.round(c.interval * c.ef);
        if (quality === 3) c.interval = Math.max(1, Math.round(c.interval * 0.6));
        c.due = Date.now() + c.interval * 86400000;
      }
      c.ef = Math.max(1.3, c.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      state.cards[id] = c;
      save();
      return c;
    },

    setLastVisited: function (route) { state.lastVisited = route; save(); },
    setSetting: function (k, v) { state.settings[k] = v; save(); },

    exportJSON: function () { return JSON.stringify(state, null, 2); },
    importJSON: function (text) {
      var next = normalize(JSON.parse(text));
      state = next;
      save();
    },
    reset: function () {
      backend.clear();
      state = blank();
      save();
    }
  };
})();

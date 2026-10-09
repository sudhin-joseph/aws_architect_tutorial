const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function loadStore(raw) {
  const values = new Map(raw ? [['aws-academy-progress-v1', raw]] : []);
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
  const context = vm.createContext({ window: { localStorage: storage, sessionStorage: storage }, document: { cookie: '' } });
  vm.runInContext(fs.readFileSync(path.join(root, 'js/store.js'), 'utf8'), context);
  return { store: context.window.LMSStore, values };
}

const context = vm.createContext({ window: { LMS_MODULES: {} } });
for (const filename of fs.readdirSync(path.join(root, 'content')).filter(f => f.endsWith('.js'))) {
  vm.runInContext(fs.readFileSync(path.join(root, 'content', filename), 'utf8'), context, { filename });
}
const modules = context.window.LMS_MODULES;
const catalog = context.window.LMS_CATALOG.tracks.flatMap(t => t.modules);

test('M00 pilot has valid questions, complete remediation mappings and no duplicate IDs', () => {
  const m = modules.M00;
  assert.equal(m.lessons.length, 5);
  assert.equal(m.diagnostic.questions.length, 20);
  const domains = { D1: 0, D2: 0, D3: 0, D4: 0 };
  const ids = new Set();
  for (const q of [...m.lessons.flatMap(l => l.check || []), ...m.diagnostic.questions]) {
    assert.ok(!ids.has(q.id), q.id);
    ids.add(q.id);
    const correct = q.options.filter(o => o.c).length;
    assert.ok(q.type === 'multi' ? correct >= 2 && q.options.length >= 5 : correct === 1);
    assert.ok(q.options.every(o => typeof o.c === 'boolean' && o.t && o.why));
  }
  for (const q of m.diagnostic.questions) {
    domains[q.domain]++;
    assert.equal(q.task[0], q.domain[1]);
    assert.ok(m.diagnostic.remediation[q.id].length);
    for (const target of m.diagnostic.remediation[q.id]) {
      const cm = catalog.find(m => m.id === target.slice(0, 3));
      assert.ok(cm, target);
      if (target.includes('.')) assert.ok(modules[cm.id].lessons.some(l => l.id === target), target);
    }
  }
  assert.deepEqual(domains, { D1: 6, D2: 5, D3: 5, D4: 4 });
  assert.ok(m.review.sources.every(s => new URL(s.url).hostname === 'docs.aws.amazon.com'));
});

test('old v1 exports receive nested and top-level defaults', () => {
  const { store } = loadStore();
  store.importJSON(JSON.stringify({ version: 1, lessons: { 'M00.01': 100 }, settings: {} }));
  assert.equal(store.state.settings.strictGating, true);
  assert.equal(store.isLessonDone('M00.01'), true);
  assert.equal(Object.keys(store.state.quizzes).length, 0);
  store.importJSON(JSON.stringify({ version: 1, lessons: {} }));
  assert.equal(store.state.settings.strictGating, true);
});

test('malformed imports leave both memory and persisted progress unchanged', () => {
  const { store, values } = loadStore();
  store.completeLesson('M00.01');
  const saved = store.exportJSON();
  const persisted = values.get('aws-academy-progress-v1');
  const invalid = [null, [], { version: 2, lessons: {} }, { version: 1, lessons: null },
    { version: 1, lessons: {}, settings: { strictGating: 'false' } },
    { version: 1, lessons: {}, quizzes: { M01: { best: 100, attempts: 1, passed: true, history: null } } },
    { version: 1, lessons: {}, diagnostic: { at: 1, score: 100, byDomain: { D1: { c: 8, t: 6 } } } },
    { version: 1, lessons: {}, cards: { x: { ef: 2.5, interval: -1, reps: 0, due: 0 } } },
    { version: 1, lessons: {}, labs: { x: { steps: null, done: null } } }];
  for (const value of invalid) {
    assert.throws(() => store.importJSON(JSON.stringify(value)));
    assert.equal(store.exportJSON(), saved);
    assert.equal(values.get('aws-academy-progress-v1'), persisted);
  }
  assert.throws(() => store.importJSON('{"version":1,"lessons":{"__proto__":1}}'));
  assert.throws(() => store.importJSON('not-json'));
});

test('diagnostic answers survive export, import and reload, including unanswered items', () => {
  const { store, values } = loadStore();
  const answers = [{ id: 'DX-01', selected: [0, 1], correct: true }, { id: 'DX-02', selected: [], correct: false }];
  store.recordDiagnostic(50, { D1: { c: 1, t: 2 } }, answers, 'm00-diagnostic-2');
  store.completeLesson('M00.05');
  const restored = loadStore(values.get('aws-academy-progress-v1')).store;
  assert.equal(JSON.stringify(restored.state.diagnostic.responses), JSON.stringify(answers));
  assert.equal(restored.isLessonDone('M00.05'), true);
  restored.importJSON(store.exportJSON());
  assert.equal(restored.state.diagnostic.version, 'm00-diagnostic-2');
});

test('legacy diagnostic scores load and corrupt stored roots do not crash startup', () => {
  const legacy = { version: 1, lessons: {}, diagnostic: { at: 1, score: 50, byDomain: { D1: { c: 3, t: 6 } } } };
  assert.equal(loadStore(JSON.stringify(legacy)).store.state.diagnostic.score, 50);
  for (const raw of ['null', '[]', '{', '{"version":1,"lessons":null}']) {
    assert.equal(loadStore(raw).store.state.settings.strictGating, true);
  }
});

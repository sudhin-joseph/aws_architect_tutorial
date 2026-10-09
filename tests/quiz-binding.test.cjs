const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Exercise the actual binder with a minimal DOM adapter; end-to-end QA uses Chromium.
const source = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
const start = source.indexOf('  function bindQuiz() {');
const end = source.indexOf('\n  function domainTable(', start);
assert.ok(start >= 0 && end > start);
const binder = source.slice(start, end);

function harness() {
  let saved = 0, timers = 0;
  const events = {};
  const form = { dataset: {}, addEventListener(name, fn) { (events[name] ||= []).push(fn); } };
  const elements = {
    '#quiz-form': form, '#answered-count': {}, '.quiz-submit': {},
    '#quiz-result': { innerHTML: '', scrollIntoView() {} }
  };
  const ctx = vm.createContext({
    $: key => elements[key] || null, $all: () => [], timerHandle: null,
    setInterval: () => ++timers, clearInterval() {},
    attempt: { kind: 'quiz', id: 'M09', items: [], passMark: 70, started: 0 },
    pct: () => 100, domainTable: () => '',
    S: { recordQuiz() { saved++; return { best: 100 }; } }
  });
  vm.runInContext(binder, ctx);
  return { ctx, events, get saved() { return saved; }, get timers() { return timers; } };
}

test('repeated deferred quiz binding installs only one change and submit handler', () => {
  const h = harness();
  for (let i = 0; i < 5; i++) vm.runInContext('bindQuiz()', h.ctx);
  assert.equal(h.events.change.length, 1);
  assert.equal(h.events.submit.length, 1);
  assert.equal(h.timers, 1);
});

test('one completed quiz attempt cannot be persisted twice by repeated submit events', () => {
  const h = harness();
  vm.runInContext('bindQuiz()', h.ctx);
  const event = { preventDefault() {} };
  h.events.submit[0](event);
  h.events.submit[0](event);
  assert.equal(h.saved, 1);
  assert.equal(h.ctx.attempt.finished, true);
  h.ctx.attempt = null;
  assert.doesNotThrow(() => h.events.submit[0](event));
  assert.equal(h.saved, 1);
});

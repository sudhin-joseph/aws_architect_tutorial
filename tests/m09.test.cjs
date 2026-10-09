const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({ window: { LMS_MODULES: {} } });
for (const file of fs.readdirSync(path.join(root, 'content')).filter(f => f.endsWith('.js'))) {
  vm.runInContext(fs.readFileSync(path.join(root, 'content', file), 'utf8'), ctx, { filename: file });
}
const modules = ctx.window.LMS_MODULES;
const m = modules.M09;
const catalog = ctx.window.LMS_CATALOG.tracks.flatMap(t => t.modules);

test('M09 is integrated and curriculum metadata matches all eight lessons', () => {
  assert.ok(fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('src="content/m09.js"'));
  assert.ok(Object.keys(modules).length >= 10);
  assert.ok(Object.values(modules).reduce((sum, v) => sum + v.lessons.length, 0) >= 74);
  const cm = catalog.find(v => v.id === 'M09');
  assert.equal(JSON.stringify(cm.prereqs), '["M02"]');
  assert.equal(cm.hours, '12 h');
  assert.equal(cm.levels, '100–400');
  assert.equal(m.lessons.length, 8);
  assert.equal(m.lessons.reduce((sum, l) => sum + l.minutes, 0), 420);
  for (const [i, l] of m.lessons.entries()) {
    assert.equal(l.id, 'M09.0' + (i + 1));
    assert.equal(l.title, cm.lessons[i].title);
    assert.equal(String(l.level), cm.lessons[i].level);
  }
});

test('Every M09 lesson contains substantial concepts, use cases and both diagram types', () => {
  const diagramIds = new Set();
  for (const lesson of m.lessons) {
    for (const type of ['why', 'concept', 'aws', 'workflow', 'examples', 'usecases', 'demo', 'exam', 'architect', 'summary']) {
      assert.ok(lesson.sections.some(s => s.type === type && s.html.length > 100), lesson.id + ': ' + type);
    }
    const concept = lesson.sections.find(s => s.type === 'concept').html;
    const cases = lesson.sections.find(s => s.type === 'usecases').html;
    assert.ok(concept.replace(/<[^>]*>/g, ' ').split(/\s+/).length >= 160, lesson.id + ' concept depth');
    assert.equal((cases.match(/<h3>/g) || []).length, 3, lesson.id + ' three use cases');
    const html = lesson.sections.map(s => s.html).join('');
    assert.equal((html.match(/<svg /g) || []).length, 2, lesson.id + ' two diagrams');
    assert.match(html, /Architecture:/);
    assert.match(html, /Workflow:/);
    assert.equal((html.match(/role="img"/g) || []).length, 2);
    assert.equal((html.match(/tabindex="0" role="region"/g) || []).length, 2);
    for (const match of html.matchAll(/id="([^"]+)"/g)) {
      assert.ok(!diagramIds.has(match[1]), 'Duplicate SVG ID: ' + match[1]);
      diagramIds.add(match[1]);
    }
    for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
      for (const id of match[1].split(' ')) assert.ok(html.includes('id="' + id + '"'), id);
    }
    assert.ok(!/undefined|NaN|ninety\(\)|sixty\(\)/.test(html));
    assert.ok(lesson.references.length >= 3);
    assert.ok(lesson.references.every(r => /https:\/\/docs\.aws\.amazon\.com\//.test(r)));
  }
  assert.equal(diagramIds.size, 48); // title, description and arrow marker per diagram
});

test('M09 assessments, drills and flashcards have complete valid coverage', () => {
  assert.equal(m.quiz.questions.length, 32);
  assert.equal(m.quiz.passMark, 70);
  assert.equal(m.flashcards.length, 64);
  assert.equal(m.lessons.flatMap(l => l.check).length, 40);
  assert.equal(m.lessons.flatMap(l => l.drills).length, 32);
  const ids = new Set();
  const stems = new Set();
  for (const question of [...m.lessons.flatMap(l => l.check), ...m.quiz.questions]) {
    assert.ok(!ids.has(question.id), question.id);
    ids.add(question.id);
    assert.ok(!stems.has(question.stem), 'Repeated check/quiz stem');
    stems.add(question.stem);
    const correct = question.options.filter(o => o.c).length;
    assert.ok(question.type === 'multi' ? correct >= 2 && question.options.length >= 5 : correct === 1);
    assert.ok(question.options.every(o => o.t && o.why && typeof o.c === 'boolean'));
    assert.ok(['1.2', '3.4', '4.4'].includes(question.task));
    assert.equal(question.domain, 'D' + question.task[0]);
  }
  for (const l of m.lessons) {
    assert.equal(l.check.length, 5);
    assert.equal(l.drills.length, 4);
    assert.equal(l.cards.length, 8);
    assert.ok(l.cards.every(id => m.flashcards.some(c => c.id === id && c.front && c.back)));
    assert.ok(l.drills.every(d => d.answers.length > 0 && d.explain && d.q));
  }
});

test('M09 includes current platform caveats without claiming cloud validation', () => {
  const html = m.lessons.flatMap(l => l.sections.map(s => s.html)).join('');
  assert.match(html, /regional availability mode/);
  assert.match(html, /\/44 to \/64/);
  assert.match(html, /64:ff9b::\/96/);
  assert.match(html, /does not send real packets/);
  assert.match(html, /does not provide payload\/session logging/);
  assert.match(m.review.scope, /not been deployed/);
  assert.equal(m.review.reviewedAt, '2026-10-08');
});

test('Both M09 labs include executable instructions, evidence, safety and cleanup', () => {
  assert.equal(m.labs.length, 2);
  assert.equal(m.labs.flatMap(l => l.drills).length, 8);
  for (const lab of m.labs) {
    assert.ok(lab.warning && lab.cost && lab.objective && lab.validate && lab.cleanup);
    assert.ok(lab.steps.length >= 8);
    assert.equal(new Set(lab.steps.map(s => s.id)).size, lab.steps.length);
    assert.match(lab.steps.at(-1).html, /delete|remove/i);
  }
  for (const file of ['README.md', 'network-plan.json', 'check_plan.py']) {
    assert.ok(fs.statSync(path.join(root, 'labs/m09', file)).size > 100);
  }
  const runbook = fs.readFileSync(path.join(root, 'labs/m09/README.md'), 'utf8');
  assert.match(runbook, /--max-time 8/);
  assert.match(runbook, /--ingress/);
  assert.match(runbook, /Delete the two lab NAT gateways/);
  assert.match(runbook, /Release the two allocated lab EIPs/);
  assert.match(runbook, /not inspect deployed resources/);
});

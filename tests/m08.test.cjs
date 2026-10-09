const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: { LMS_MODULES: {} } });
for (const file of fs.readdirSync(path.join(root, 'content')).filter(f => f.endsWith('.js'))) {
  vm.runInContext(fs.readFileSync(path.join(root, 'content', file), 'utf8'), context, { filename: file });
}
const modules = context.window.LMS_MODULES;
const m = modules.M08;
const catalog = context.window.LMS_CATALOG.tracks.flatMap(t => t.modules);
const template = JSON.parse(fs.readFileSync(path.join(root, 'labs/m08/template.json')));

test('M08 is registered, loaded and aligned with its catalog and availability claims', () => {
  assert.ok(fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('src="content/m08.js"'));
  // M08 remains complete as later modules are added; avoid freezing global availability here.
  assert.ok(Object.keys(modules).length >= 9);
  assert.ok(Object.values(modules).reduce((n, item) => n + item.lessons.length, 0) >= 66);
  assert.equal(m.lessons.length, 8);
  const cm = catalog.find(c => c.id === 'M08');
  assert.equal(JSON.stringify(cm.prereqs), '["M05"]');
  assert.equal(cm.hours, '8 h');
  assert.equal(m.review.reviewedAt, '2026-10-08');
  m.lessons.forEach((l, i) => {
    assert.equal(l.id, 'M08.0' + (i + 1));
    assert.equal(l.title, cm.lessons[i].title);
    assert.equal(String(l.level), cm.lessons[i].level);
    assert.ok(l.sections.length >= 8);
    assert.ok(l.sections.every(s => s.html && !s.html.includes('undefined')));
    assert.ok(l.objectives.length >= 3);
    assert.ok(l.references.every(ref => /https:\/\/(docs\.)?aws\.amazon\.com\//.test(ref)));
  });
});

test('M08 has complete assessments with globally unique question and card IDs', () => {
  assert.equal(m.lessons.flatMap(l => l.check).length, 32);
  assert.equal(m.lessons.flatMap(l => l.drills).length, 24);
  assert.equal(m.quiz.questions.length, 24);
  assert.equal(m.quiz.passMark, 70);
  assert.equal(m.flashcards.length, 48);
  const ids = new Set();
  for (const module of Object.values(modules)) {
    const items = [...module.lessons.flatMap(l => l.check || []), ...(module.quiz?.questions || []),
      ...(module.diagnostic?.questions || []), ...(module.flashcards || [])];
    for (const item of items) {
      assert.ok(!ids.has(item.id), 'Duplicate: ' + item.id);
      ids.add(item.id);
    }
  }
  for (const q of [...m.lessons.flatMap(l => l.check), ...m.quiz.questions]) {
    const count = q.options.filter(o => o.c).length;
    assert.ok(q.type === 'multi' ? count >= 2 && q.options.length >= 5 : count === 1);
    assert.ok(q.options.every(o => typeof o.c === 'boolean' && o.t && o.why));
    assert.equal(q.domain, 'D' + q.task[0]);
    assert.ok(['1.2', '1.3'].includes(q.task));
  }
  for (const l of m.lessons) {
    assert.equal(l.cards.length, 6);
    assert.ok(l.cards.every(id => m.flashcards.some(c => c.id === id && c.front && c.back)));
    assert.ok(l.drills.every(d => d.q && d.answers.length && d.explain));
  }
});

test('L08 downloads exist and its checklist explicitly covers cost, evidence and cleanup', () => {
  const lab = m.labs[0];
  assert.equal(lab.id, 'L08');
  assert.equal(lab.steps.length, 10);
  assert.equal(new Set(lab.steps.map(s => s.id)).size, 10);
  assert.equal(lab.drills.length, 3);
  assert.match(lab.warning, /self-reported/);
  assert.match(lab.warning, /charges/);
  assert.match(lab.steps.at(-1).html, /DELETE_FAILED/);
  for (const file of ['template.json', 'validate.py', 'README.md']) {
    assert.ok(fs.statSync(path.join(root, 'labs/m08', file)).size > 100);
    assert.ok(lab.steps.some(s => s.html.includes('labs/m08/' + file)));
  }
});

test('CloudFormation guardrails: explicit detector ownership, narrow ingress and sample-only routing', () => {
  const { Parameters: p, Resources: r } = template;
  assert.equal(p.RateAction.Default, 'Count');
  assert.equal(p.CreateLabDetector.Default, 'false');
  assert.ok(template.Rules.ExactlyOneDetectorChoice.Assertions.length);
  assert.equal(r.Detector.Condition, 'CreateDetector');
  const ingress = r.AlbSecurityGroup.Properties.SecurityGroupIngress;
  assert.equal(ingress.length, 1);
  assert.deepEqual(ingress[0], { IpProtocol: 'tcp', FromPort: 80, ToPort: 80, CidrIp: { Ref: 'LearnerCidr' } });
  assert.ok(p.LearnerCidr.AllowedPattern.endsWith('/32$'));
  assert.deepEqual(r.SampleRule.Properties.EventPattern.detail, { service: { additionalInfo: { sample: [true] } } });
  const rate = r.WebAcl.Properties.Rules.find(r => r.Name === 'RateTestPath');
  assert.equal(rate.Statement.RateBasedStatement.EvaluationWindowSec, 60);
  assert.equal(rate.Statement.RateBasedStatement.Limit, 100);
  assert.deepEqual(rate.Action['Fn::If'], ['BlockRate', { Block: {} }, { Count: {} }]);
  assert.ok(!Object.values(r).some(r => /AWS::IAM|AWS::EC2::Instance|AWS::EC2::NatGateway/.test(r.Type)));
});

test('CloudFormation Ref/GetAtt and dependency targets resolve locally', () => {
  const allowed = new Set([...Object.keys(template.Parameters), ...Object.keys(template.Resources)]);
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (value.Ref) assert.ok(allowed.has(value.Ref) || value.Ref.startsWith('AWS::'), value.Ref);
    if (value['Fn::GetAtt']) assert.ok(template.Resources[value['Fn::GetAtt'][0]]);
    if (value.DependsOn) for (const id of [].concat(value.DependsOn)) assert.ok(template.Resources[id], id);
    if (value['Fn::If']) assert.ok(template.Conditions[value['Fn::If'][0]]);
    Object.values(value).forEach(walk);
  }
  walk(template);
});

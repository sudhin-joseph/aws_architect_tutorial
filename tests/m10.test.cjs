const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({window: {LMS_MODULES: {}}});
for (const file of fs.readdirSync(path.join(root, 'content')).filter(f => f.endsWith('.js'))) {
  vm.runInContext(fs.readFileSync(path.join(root, 'content', file), 'utf8'), ctx, {filename:file});
}
const m = ctx.window.LMS_MODULES.M10;
const catalog = ctx.window.LMS_CATALOG.tracks.flatMap(t => t.modules).find(m => m.id === 'M10');

test('M10 is loaded and aligned with curriculum and prerequisite', () => {
  assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'), /src="content\/m10.js"/);
  assert.equal(JSON.stringify(catalog.prereqs), '["M09"]');
  assert.equal(catalog.hours,'8 h');
  assert.equal(m.lessons.length,6);
  assert.equal(m.lessons.reduce((n,l)=>n+l.minutes,0),270);
  m.lessons.forEach((l,i)=>{
    assert.equal(l.id,catalog.lessons[i].id);
    assert.equal(l.title,catalog.lessons[i].title);
    assert.equal(String(l.level),catalog.lessons[i].level);
  });
});

test('M10 diagrams are accessible and linked resources exist', () => {
  const allIds = new Set();
  for (const l of m.lessons) {
    for (const type of ['why','concept','aws','workflow','examples','usecases','demo','exam','architect','summary']) {
      assert.ok(l.sections.some(s=>s.type===type && s.html.length>100),l.id+': '+type);
    }
    const html=l.sections.map(s=>s.html).join('');
    assert.equal((html.match(/<svg /g)||[]).length,2);
    assert.equal((html.match(/role="img"/g)||[]).length,2);
    assert.equal((html.match(/tabindex="0" role="region"/g)||[]).length,2);
    for (const match of html.matchAll(/id="([^"]+)"/g)) {
      assert.ok(!allIds.has(match[1]),'duplicate '+match[1]);allIds.add(match[1]);
    }
    for (const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
      for (const id of match[1].split(' ')) assert.ok(html.includes('id="'+id+'"'));
    }
    assert.ok(!/undefined|NaN/.test(html));
    assert.ok(l.references.length>=3);
  }
  const html=JSON.stringify(m);
  for (const match of html.matchAll(/labs\/m10\/[a-z_\-.]+/g)) assert.ok(fs.existsSync(path.join(root,match[0])),match[0]);
});

test('M10 assessments have valid answers, unique stems and card references', () => {
  assert.equal(m.quiz.questions.length,24);
  assert.equal(m.flashcards.length,48);
  assert.equal(m.quiz.passMark,70);
  const stems=new Set(), ids=new Set();
  for(const q of [...m.lessons.flatMap(l=>l.check),...m.quiz.questions]) {
    assert.ok(!ids.has(q.id));ids.add(q.id);
    assert.ok(!stems.has(q.stem));stems.add(q.stem);
    assert.equal(q.domain,'D'+q.task[0]);
    const correct=q.options.filter(o=>o.c).length;
    assert.ok(q.type==='multi' ? correct>=2 && q.options.length>=5 : correct===1);
    assert.ok(q.options.every(o=>o.t && o.why && typeof o.c==='boolean'));
  }
  for(const l of m.lessons) {
    assert.equal(l.check.length,4); assert.equal(l.drills.length,4); assert.equal(l.cards.length,8);
    assert.ok(l.cards.every(id=>m.flashcards.some(c=>c.id===id && c.front && c.back)));
    assert.ok(l.drills.every(d=>d.answers.length && d.explain));
  }
});

test('L10 describes evidence limits and recoverable learner-run actions', () => {
  assert.equal(m.review.reviewedAt,'2026-10-09');
  assert.match(m.review.scope,/not been deployed/);
  const lab=m.labs[0];assert.equal(lab.id,'L10');assert.equal(lab.steps.length,10);
  assert.equal(lab.drills.length,4);
  assert.match(lab.validate,/inconclusive/);
  const text=fs.readFileSync(path.join(root,'labs/m10/README.md'),'utf8');
  for(const needle of ['--max-time 8','aws:SourceVpce','external operator','release its EIP','log-status','not a resilient production topology']) assert.ok(text.includes(needle),needle);
  assert.ok(!text.includes('s3:*'));
});

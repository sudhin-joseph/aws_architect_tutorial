const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({window:{LMS_MODULES:{}}});
for (const file of fs.readdirSync(path.join(root,'content')).filter(f=>f.endsWith('.js'))) {
  vm.runInContext(fs.readFileSync(path.join(root,'content',file),'utf8'),ctx,{filename:file});
}
const m=ctx.window.LMS_MODULES.M11;
const catalog=ctx.window.LMS_CATALOG.tracks.flatMap(t=>t.modules).find(m=>m.id==='M11');

test('M11 is registered, catalog-aligned and included in available-content totals',()=>{
  assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/src="content\/m11.js"/);
  assert.equal(JSON.stringify(catalog.prereqs),'["M09","M10"]');
  assert.equal(catalog.hours,'8 h');
  assert.equal(m.lessons.length,5);
  assert.equal(m.lessons.reduce((n,l)=>n+l.minutes,0),225);
  m.lessons.forEach((l,i)=>{
    assert.equal(l.id,catalog.lessons[i].id);
    assert.equal(l.title,catalog.lessons[i].title);
    assert.equal(String(l.level),catalog.lessons[i].level);
  });
  assert.equal(Object.keys(ctx.window.LMS_MODULES).length,12);
  assert.equal(Object.values(ctx.window.LMS_MODULES).reduce((n,m)=>n+m.lessons.length,0),85);
});

test('M11 rendered content has complete sections, accessible unique diagrams and existing downloads',()=>{
  const ids=new Set();
  for (const l of m.lessons) {
    for (const type of ['why','concept','aws','workflow','examples','usecases','demo','exam','architect','summary']) {
      assert.ok(l.sections.some(s=>s.type===type && s.html.length>100),l.id+': '+type);
    }
    const html=l.sections.map(s=>s.html).join('');
    assert.equal((html.match(/<svg /g)||[]).length,2);
    assert.equal((html.match(/role="img"/g)||[]).length,2);
    assert.equal((html.match(/tabindex="0" role="region"/g)||[]).length,2);
    for(const match of html.matchAll(/id="([^"]+)"/g)) {
      assert.ok(!ids.has(match[1]),'duplicate '+match[1]);ids.add(match[1]);
    }
    for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
      for(const id of match[1].split(' ')) assert.ok(html.includes('id="'+id+'"'));
    }
    assert.ok(!/undefined|NaN|REPLACE_/.test(html));
    assert.ok(l.references.length>=3);
  }
  for(const match of JSON.stringify(m).matchAll(/labs\/m11\/[a-z0-9_.-]+/g)) {
    assert.ok(fs.existsSync(path.join(root,match[0])),match[0]);
  }
});

test('M11 assessments can be graded and all remediation explanations/card references exist',()=>{
  const questions=[...m.lessons.flatMap(l=>l.check),...m.quiz.questions];
  assert.equal(questions.length,45);
  assert.equal(m.quiz.questions.length,25);
  assert.equal(m.quiz.questions.filter(q=>q.type==='multi').length,3);
  assert.equal(m.quiz.passMark,70);
  assert.equal(m.flashcards.length,40);
  const ids=new Set(),stems=new Set();
  for(const q of questions) {
    assert.ok(!ids.has(q.id));ids.add(q.id);
    assert.ok(!stems.has(q.stem));stems.add(q.stem);
    assert.ok(['1.2','3.4','4.4'].includes(q.task));
    assert.equal(q.domain,'D'+q.task[0]);
    const correct=q.options.filter(o=>o.c).length;
    assert.ok(q.type==='multi'? correct===2 && q.options.length===5 : correct===1 && q.options.length===4);
    assert.equal(new Set(q.options.map(o=>o.t)).size,q.options.length);
    assert.ok(q.options.every(o=>typeof o.c==='boolean' && o.t && o.why));
  }
  for(const l of m.lessons) {
    assert.equal(l.check.length,4);assert.equal(l.drills.length,4);assert.equal(l.cards.length,8);
    assert.ok(l.cards.every(id=>m.flashcards.some(c=>c.id===id && c.front && c.back)));
    for(const d of l.drills) {
      assert.ok(!ids.has(d.id));ids.add(d.id);
      assert.ok(d.answers.length && d.answers.every(a=>typeof a==='string' && a.trim()) && d.explain);
    }
  }
  assert.equal(new Set(m.flashcards.map(c=>c.id)).size,40);
});

test('L11 preserves evidence limits, no-secret output and recovery/cleanup guidance',()=>{
  assert.equal(m.review.reviewedAt,'2026-10-12');
  assert.match(m.review.scope,/not been deployed/);
  assert.ok(m.review.sources.every(s=>['docs.aws.amazon.com','aws.amazon.com'].includes(new URL(s.url).hostname)));
  const lab=m.labs[0];assert.equal(lab.id,'L11');assert.equal(lab.steps.length,10);assert.equal(lab.drills.length,4);
  assert.match(lab.warning,/one tunnel at a time/);
  assert.match(lab.validate,/inconclusive/);
  const runbook=fs.readFileSync(path.join(root,'labs/m11/README.md'),'utf8');
  for(const needle of ['external operator','--max-time 8','release the EIP','one tunnel at a time','not been deployed','Do not export `ip xfrm state`','manual recovery','Inconclusive','source/destination']) assert.ok(runbook.includes(needle),needle);
  const template=fs.readFileSync(path.join(root,'labs/m11/swanctl.conf.example'),'utf8');
  assert.equal((template.match(/start_action = none/g)||[]).length,2);
  assert.equal((template.match(/local_ts = 10.60.10.0\/24/g)||[]).length,2);
  assert.equal((template.match(/secret = "REPLACE_TUNNEL_[12]_PSK"/g)||[]).length,2);
  assert.ok(!template.includes('start_action = start'));
});

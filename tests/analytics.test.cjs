const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const source = readFileSync(require.resolve('../analytics.js'), 'utf8');

function load(origin, canonical = 'https://www.edatweets.com/work/') {
  const scripts = [];
  const window = {};
  runInNewContext(source, {
    window, location: {origin}, URL,
    document: {
      querySelector: () => canonical ? {href: canonical} : null,
      createElement: () => ({}),
      head: {appendChild: script => scripts.push(script)}
    }
  });
  return {scripts, window};
}

test('analytics loads on the canonical production origin and queues calls', () => {
  const {scripts, window} = load('https://www.edatweets.com');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, '/_vercel/insights/script.js');
  assert.equal(scripts[0].defer, true);
  window.va('event', {name: 'example'});
  assert.equal(window.vaq[0][0], 'event');
});

test('local and preview visits do not initialize tracking', () => {
  for (const origin of ['http://localhost:4173', 'http://127.0.0.1:4173', 'https://preview.vercel.app']) {
    const {scripts, window} = load(origin);
    assert.equal(scripts.length, 0);
    assert.equal(window.va, undefined);
  }
  assert.equal(load('https://www.edatweets.com', null).scripts.length, 0);
});

test('tracking follows a future canonical domain change', () => {
  assert.equal(load('https://edaakturk.com', 'https://edaakturk.com/work/').scripts.length, 1);
  assert.equal(load('https://www.edatweets.com', 'https://edaakturk.com/work/').scripts.length, 0);
});

test('every generated page includes the analytics loader', () => {
  for (const page of ['index.html', 'experience/index.html', 'work/index.html', 'writing/index.html', 'events/index.html']) {
    assert.match(readFileSync(require('node:path').join(__dirname, '..', page), 'utf8'), /<script src="\/analytics\.js" defer><\/script>/);
  }
});

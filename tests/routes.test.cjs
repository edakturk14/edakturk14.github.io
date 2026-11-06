const {test} = require('node:test');
const assert = require('node:assert/strict');
const {legacyDestination} = require('../gallery.js');

test('existing section bookmarks move to real pages', () => {
  const routes = {
    '#home':'/', '#writing':'/writing/', '#work':'/work/', '#events':'/events/',
    '#talks':'/work/', '#other-work':'/work/', '#photos':'/events/',
    '#judging':'/work/#card-judging', '#experience':'/experience/'
  };
  for (const [hash, path] of Object.entries(routes)) assert.equal(legacyDestination(hash), path);
});

test('old item links preserve their destination', () => {
  assert.equal(legacyDestination('#writing/hyperlane-guide'), '/writing/#card-hyperlane-guide');
  assert.equal(legacyDestination('#talks/ethcc-intents'), '/work/#card-ethcc-intents');
  assert.equal(legacyDestination('#photos/cannes'), '/events/#card-cannes');
  assert.equal(legacyDestination('#experience/hyperlane'), '/experience/#hyperlane');
});

test('native anchors, skip links, and ordinary page loads are not redirected', () => {
  for (const hash of ['', '#main', '#card-batches', '#hyperlane', '#world-bank', '#unknown']) {
    assert.equal(legacyDestination(hash), null);
  }
});

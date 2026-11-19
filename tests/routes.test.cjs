const {test} = require('node:test');
const assert = require('node:assert/strict');
const {legacyDestination} = require('../gallery.js');

test('existing section bookmarks move to real pages', () => {
  const routes = {
    '#home':'/', '#writing':'/writing/', '#work':'/work/', '#events':'/work/#work-talks',
    '#talks':'/work/', '#other-work':'/work/', '#photos':'/work/#work-talks',
    '#judging':'/work/#card-judging', '#experience':'/experience/', '#work-with-me':'/work-with-me/'
  };
  for (const [hash, path] of Object.entries(routes)) assert.equal(legacyDestination(hash), path);
});

test('old item links preserve their destination', () => {
  assert.equal(legacyDestination('#writing/hyperlane-guide'), '/writing/#card-hyperlane-guide');
  assert.equal(legacyDestination('#talks/ethcc-intents'), '/work/#card-ethcc-intents');
  assert.equal(legacyDestination('#photos/cannes'), '/work/#card-ethcc-intents');
  assert.equal(legacyDestination('#experience/hyperlane'), '/experience/#hyperlane');
});

test('native anchors, skip links, and ordinary page loads are not redirected', () => {
  for (const hash of ['', '#main', '#card-batches', '#hyperlane', '#world-bank', '#unknown']) {
    assert.equal(legacyDestination(hash), null);
  }
});

test('retired event bookmarks reach surviving work entries', () => {
  assert.equal(legacyDestination('#events/ethgunu-stage'), '/work/#card-ethgunu-stage');
  assert.equal(legacyDestination('#photos/fireside'), '/work/#card-ethgunu');
  assert.equal(legacyDestination('#events/brussels'), '/work/#work-talks');
  assert.equal(legacyDestination('#events/unknown'), '/work/#work-talks');
});

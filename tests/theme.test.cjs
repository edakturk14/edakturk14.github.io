const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const source = readFileSync(require.resolve('../theme.js'), 'utf8');

function load(saved, {blocked = false, reduced = false, transition = 'unsupported'} = {}) {
  const state = {saved, transitions:0};
  const properties = {};
  const root = {dataset:{}, style:{setProperty(k,v) {properties[k] = v;}}};
  const controls = {hidden:true};
  const buttons = ['light','dark'].map((theme, i) => ({
    dataset:{setTheme:theme},
    setAttribute(k,v) {this[k] = v;},
    addEventListener(k,fn) {this.click = fn;},
    getBoundingClientRect() {return {left:18 + i * 54, top:832, width:44, height:44};}
  }));
  const document = {
    documentElement:root, readyState:'complete',
    querySelector(s) {return s === '.theme-controls' ? controls : {setAttribute(k,v) {state.meta = v;}};},
    querySelectorAll() {return buttons;}
  };
  if (transition !== 'unsupported') document.startViewTransition = update => {
    state.transitions++;
    if (transition === 'throw') throw Error('unavailable');
    update();
    return {
      ready:transition === 'skip' ? Promise.reject(Error('skipped')) : Promise.resolve(),
      finished:new Promise((resolve, reject) => {state.finish = resolve; state.fail = reject;})
    };
  };
  const localStorage = {
    getItem() {if (blocked) throw Error('blocked'); return state.saved;},
    setItem(k,v) {if (blocked) throw Error('blocked'); state.saved = v;}
  };
  const window = {innerWidth:1348, innerHeight:926, matchMedia() {return {matches:reduced};}};
  runInNewContext(source, {document, localStorage, window});
  return {state, root, controls, buttons, properties};
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test('new visitors and invalid stored values always start in white mode', () => {
  for (const initial of [undefined, null, 'light', 'invalid']) assert.equal(load(initial).root.dataset.theme, 'light');
});
test('dark preference survives a new page load', () => {
  const page = load(null); page.buttons[1].click();
  assert.equal(page.state.saved, 'dark');
  assert.equal(load(page.state.saved).root.dataset.theme, 'dark');
});
test('selected icon and browser color follow both directions', () => {
  const page = load(null);
  assert.equal(page.controls.hidden, false);
  assert.deepEqual(page.buttons.map(b => b['aria-pressed']), ['true','false']);
  page.buttons[1].click();
  assert.deepEqual(page.buttons.map(b => b['aria-pressed']), ['false','true']);
  assert.equal(page.state.meta, '#10151e');
  page.buttons[0].click();
  assert.deepEqual(page.buttons.map(b => b['aria-pressed']), ['true','false']);
  assert.equal(page.state.saved, 'light'); assert.equal(page.state.meta, '#ffffff');
});
test('unavailable storage does not stop the theme controls', () => {
  const page = load(null, {blocked:true});
  page.buttons[1].click(); assert.equal(page.root.dataset.theme, 'dark');
});
test('the reveal originates at the selected icon and covers the furthest corner', async () => {
  const page = load(null, {transition:'supported'});
  page.buttons[1].click();
  assert.equal(page.properties['--theme-x'], '94px');
  assert.equal(page.properties['--theme-y'], '854px');
  assert.equal(page.properties['--theme-radius'], `${Math.ceil(Math.hypot(1254,854))}px`);
  assert.equal(page.root.dataset.theme, 'dark');
  assert.ok('themeTransition' in page.root.dataset);
  page.state.finish(); await flush();
  assert.ok(!('themeTransition' in page.root.dataset));
});
test('active theme and rapid clicks do not start overlapping transitions', async () => {
  const page = load(null, {transition:'supported'});
  page.buttons[0].click(); assert.equal(page.state.transitions, 0);
  page.buttons[1].click(); page.buttons[0].click();
  assert.equal(page.state.transitions, 1);
  page.state.finish(); await flush();
  page.buttons[0].click(); assert.equal(page.state.transitions, 2);
  assert.equal(page.root.dataset.theme, 'light');
  page.state.finish(); await flush();
});
test('reduced motion changes theme immediately without a reveal', () => {
  const page = load(null, {reduced:true, transition:'supported'});
  page.buttons[1].click();
  assert.equal(page.state.transitions, 0);
  assert.equal(page.root.dataset.theme, 'dark');
});
test('unavailable or interrupted transitions leave working controls', async () => {
  for (const transition of ['throw','skip','supported']) {
    const page = load(null, {transition});
    page.buttons[1].click();
    if (transition === 'skip') page.state.finish();
    if (transition === 'supported') page.state.fail(Error('interrupted'));
    await flush();
    assert.equal(page.root.dataset.theme, 'dark');
    assert.ok(!('themeTransition' in page.root.dataset));
    page.buttons[0].click();
    if (page.state.finish) page.state.finish();
    await flush();
    assert.equal(page.root.dataset.theme, 'light');
  }
});

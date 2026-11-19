const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const source = readFileSync(require.resolve('../theme.js'), 'utf8');
function load(saved, blocked = false) {
  const state = {saved};
  const root = {dataset: {}};
  const button = {hidden: true, setAttribute(k,v) { this[k] = v; }, addEventListener(k,fn) { state.click = fn; }};
  const document = {documentElement: root, readyState: 'complete', querySelector(s) { return s === '.theme-toggle' ? button : {setAttribute(k,v) {state.meta = v;}}; }};
  const localStorage = {getItem() {if (blocked) throw Error('blocked'); return state.saved;}, setItem(k,v) {if (blocked) throw Error('blocked'); state.saved = v;}};
  runInNewContext(source, {document, localStorage});
  return {state, root, button};
}
test('new visitors and invalid stored values always start in white mode', () => {
  for (const initial of [undefined, null, 'light', 'invalid']) assert.equal(load(initial).root.dataset.theme, 'light');
});
test('dark preference survives a new page load', () => {
  const page = load(null); page.state.click();
  assert.equal(page.state.saved, 'dark');
  assert.equal(load(page.state.saved).root.dataset.theme, 'dark');
});
test('switch state and browser color follow both directions', () => {
  const page = load(null);
  assert.equal(page.button.hidden, false);
  assert.equal(page.button['aria-checked'], 'false');
  page.state.click(); assert.equal(page.button['aria-checked'], 'true');
  assert.equal(page.state.meta, '#10151e');
  page.state.click(); assert.equal(page.button['aria-checked'], 'false');
  assert.equal(page.state.saved, 'light'); assert.equal(page.state.meta, '#ffffff');
});
test('unavailable storage does not stop the theme switch', () => {
  const page = load(null, true);
  assert.equal(page.root.dataset.theme, 'light');
  page.state.click(); assert.equal(page.root.dataset.theme, 'dark');
});

const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const source = readFileSync(require.resolve('../work-with-me.js'), 'utf8');

function setup({reduced = false} = {}) {
  const frames = new Map();
  let frameId = 0;
  class Element {
    constructor() { this.handlers = new Map(); this.attributes = {}; this.hidden = false; this.children = []; this.scrollLeft = 0; this.scrollWidth = 1248; this.clientWidth = 820; this.style = {setProperty:(key, value) => {this[key] = value;}}; this.classList = {add:() => {}}; }
    addEventListener(type, fn, {signal} = {}) {
      if (!this.handlers.has(type)) this.handlers.set(type, new Set());
      this.handlers.get(type).add(fn);
      signal?.addEventListener('abort', () => this.handlers.get(type).delete(fn), {once:true});
    }
    emit(type, data = {}) { for (const fn of [...(this.handlers.get(type) || [])]) fn({preventDefault() {}, ...data}); }
    setAttribute(key, value) { this.attributes[key] = value; }
    contains(target) { return target === this || this.children.some(child => child.contains(target)); }
    append(child) { this.children.push(child); child.parent = this; }
    get firstElementChild() { return this.children[0]; }
    getBoundingClientRect() { return {width:1248}; }
    scrollBy({left}) { this.scrollLeft += left; }
    querySelector(selector) { return this.selectors?.[selector]; }
    querySelectorAll(selector) { return this.selectors?.[selector] || []; }
  }
  const document = new Element();
  const page = new Element();
  const section = new Element();
  const rows = [new Element()];
  rows.forEach(row => row.append(new Element()));
  section.children = rows;
  section.selectors = {'.testimonial-row':rows};
  page.selectors = {'.testimonials':section};
  document.selectors = {'.work-with-me':page};
  const preference = new Element(); preference.matches = reduced;
  const observers = [];
  class Observer {
    constructor(fn) { this.fn = fn; observers.push(this); }
    observe() { this.fn([{isIntersecting:true}]); }
    disconnect() { this.disconnected = true; }
  }
  runInNewContext(source, {
    document, window:{matchMedia:() => preference, IntersectionObserver:Observer},
    IntersectionObserver:Observer, AbortController,
    requestAnimationFrame:fn => {frames.set(++frameId, fn); return frameId;},
    cancelAnimationFrame:id => frames.delete(id)
  });
  const advance = now => {
    const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now));
  };
  return {document, page, section, rows, preference, observers, frames, advance};
}

test('quotes move at fractional speeds, reverse at the ends, and pause for reading or manual control', () => {
  const s = setup();
  s.advance(100); s.advance(116);
  assert.ok(s.rows[0].scrollLeft > 0 && s.rows[0].scrollLeft < 1);
  s.section.emit('pointerenter', {pointerType:'mouse'});
  assert.equal(s.frames.size, 0);
  s.section.emit('pointerleave');
  assert.equal(s.frames.size, 1);
  s.section.emit('focusin', {target:s.rows[0]});
  assert.equal(s.frames.size, 0);
  s.section.emit('focusout', {relatedTarget:null});
  assert.equal(s.frames.size, 1);
  s.rows[0].scrollLeft = s.rows[0].scrollWidth - s.rows[0].clientWidth - 1;
  s.document.emit('visibilitychange');
  s.advance(200); s.advance(264);
  assert.equal(s.rows[0].scrollLeft, 428);
  s.advance(328);
  assert.ok(s.rows[0].scrollLeft < 428);
  s.rows[0].scrollLeft = 1;
  s.document.emit('visibilitychange');
  s.advance(400); s.advance(464);
  assert.equal(s.rows[0].scrollLeft, 0);
  s.advance(528);
  assert.ok(s.rows[0].scrollLeft > 0);
  s.document.emit('pointerdown', {pointerType:'touch', target:s.rows[0]});
  assert.equal(s.frames.size, 0);
  s.document.emit('pointerdown', {pointerType:'touch', target:s.page});
  assert.equal(s.frames.size, 1);
});

test('reduced motion stops auto-scroll, including live preference changes', () => {
  const s = setup({reduced:true});
  assert.equal(s.frames.size, 0);
  s.preference.matches = false;
  s.preference.emit('change');
  assert.equal(s.frames.size, 1);
  s.preference.matches = true;
  s.preference.emit('change');
  assert.equal(s.frames.size, 0);
});

test('arrow keys pan the focused region but never hide a focused source link', () => {
  const s = setup({reduced:true});
  const row = s.rows[0];
  row.emit('keydown', {key:'ArrowRight', target:row});
  assert.equal(row.scrollLeft, 310);
  row.emit('keydown', {key:'ArrowLeft', target:row});
  assert.equal(row.scrollLeft, 0);
  const link = {};
  let prevented = 0;
  for (const key of ['ArrowRight', 'ArrowLeft']) {
    row.emit('keydown', {key, target:link, preventDefault:() => prevented++});
    assert.equal(row.scrollLeft, 0);
  }
  assert.equal(prevented, 2);
  row.emit('keydown', {key:'Enter', target:link, preventDefault:() => prevented++});
  assert.equal(prevented, 2);
});

test('soft navigation cleans up animation without duplicating quotes or accumulating listeners', () => {
  const s = setup();
  assert.equal(s.rows[0].children.length, 1);
  s.document.emit('site:before-render');
  assert.equal(s.frames.size, 0);
  assert.equal(s.rows[0].children.length, 1);
  assert.equal(s.observers[0].disconnected, true);
  for (let i = 0; i < 3; i++) s.document.emit('site:page-ready');
  assert.equal(s.rows[0].children.length, 1);
  assert.equal(s.frames.size, 1);
  s.section.emit('pointerenter', {pointerType:'mouse'});
  assert.equal(s.frames.size, 0);
  s.section.emit('pointerleave');
  assert.equal(s.frames.size, 1);
});

test('testimonials lead with Austin, include ETHIstanbul, and omit removed podcast posts without duplicates', () => {
  const html = readFileSync(require.resolve('../content/work-with-me.html'), 'utf8');
  const links = [...html.matchAll(/href="(https:\/\/(?:x\.com\/[^\"]+\/status\/[^\"]+|www\.devntell\.com\/[^\"]+))"/g)].map(match => match[1]);
  assert.equal(links.length, 7);
  assert.equal(links[0], 'https://x.com/austingriffith/status/1570794474812633088');
  assert.ok(links.includes('https://x.com/ETHIstanbul/status/1581016882639179777'));
  assert.equal(new Set(links).size, links.length);
  assert.doesNotMatch(html, /pumatheuma|Uma Roy|StaniKulechov|>Stani<|sreeramkannan|Sreeram Kannan/);
  assert.doesNotMatch(html, /testimonials-toggle/);
  assert.match(html, /<p>Kind words from people I've worked with<\/p>/);
});

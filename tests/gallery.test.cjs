const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../gallery.js'), 'utf8');

function element(dataset = {}) {
  return {
    dataset, hidden: false, style: {}, attributes: {}, listeners: {}, children: [],
    classList: {values: new Set(), add(name) { this.values.add(name); }},
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name]; },
    removeAttribute(name) { delete this.attributes[name]; },
    append(child) { child.parent = this; },
    focus() { this.focused = true; },
    contains(child) { return this.children.includes(child); },
    querySelectorAll() { return this.children; },
    scrollIntoView() { this.scrolled = true; },
    animate() { this.animated = true; return {cancel() {}}; }
  };
}

function setup({hash = '', mobile = false, reducedMotion = false, resize = true} = {}) {
  const titles = {home: 'About Me', writing: 'Selected writing', work: 'Work', events: 'Events'};
  const sections = Object.entries(titles).map(([id, title]) => Object.assign(element({title}), {id}));
  const nav = sections.map(section => element({section: section.id}));
  const name = element();
  const menu = element();
  const menuPath = element();
  menu.querySelector = () => menuPath;
  menu.setAttribute('aria-expanded', 'false');
  const sidebar = element();
  const footer = element();
  const main = element();
  const gallery = element();
  const status = element();
  const document = element();
  document.body = element();
  document.documentElement = element();
  const cards = ['jev', 'judging', 'fireside'].map(id => Object.assign(element(), {id: `card-${id}`}));
  cards.forEach((card, index) => {
    const inner = element();
    inner.getBoundingClientRect = () => ({height: 200});
    card.firstElementChild = inner;
    sections[index + 1].children.push(card);
  });
  gallery.querySelectorAll = selector => selector === '.card' ? [cards[2]] : [cards[2].firstElementChild];
  const selectors = {'#gallery-events': gallery, '.mobile-menu-toggle': menu, '#site-socials': footer, '.sidebar': sidebar, '.name': name, '#main': main, '#gallery-status': status};
  document.querySelector = selector => selectors[selector];
  document.querySelectorAll = selector => selector === '.page-section' ? sections : selector === '.nav-link' ? nav : [...nav, name];
  document.getElementById = id => cards.find(card => card.id === id);
  const viewport = element();
  viewport.matches = mobile;
  const window = element();
  window.matchMedia = query => query.includes('max-width') ? viewport : {matches: reducedMotion};
  window.scrollTo = () => { window.scrolled = true; };
  const location = {hash};
  const frames = new Map();
  let frameId = 0;
  const context = {
    document, window, location,
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame(id) { frames.delete(id); },
    getComputedStyle() { return {gridAutoRows: '4px', rowGap: '22px'}; }
  };
  if (resize) context.ResizeObserver = class { observe() {} };
  vm.runInNewContext(source, context);
  const flush = () => {
    while (frames.size) {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach(callback => callback());
    }
  };
  const route = next => { location.hash = next; window.listeners.hashchange(); flush(); };
  flush();
  return {sections, nav, menu, main, sidebar, footer, viewport, window, document, status, cards, route};
}

test('enhances existing HTML without recreating cards', () => {
  const app = setup();
  assert.deepEqual(app.sections.map(section => section.hidden), [false, true, true, true]);
  assert.equal(app.document.title, 'Eda Akturk');
  assert.equal(app.nav[0].getAttribute('aria-current'), 'page');
  assert.equal(app.document.documentElement.classList.values.has('enhanced'), true);
  assert.equal(app.sections[1].children[0], app.cards[0]);
});

test('routes direct links, section changes, and history events', () => {
  const app = setup({hash: '#writing/jev'});
  assert.equal(app.sections[1].hidden, false);
  assert.equal(app.cards[0].scrolled, true);
  app.route('#work');
  assert.equal(app.document.title, 'Work — Eda Akturk');
  assert.equal(app.nav[1].getAttribute('aria-current'), undefined);
  assert.equal(app.nav[2].getAttribute('aria-current'), 'page');
  app.route('#writing');
  assert.equal(app.sections[1].hidden, false);
  assert.equal(app.status.textContent, 'Selected writing, 1 items');
});

test('preserves legacy links and accepts native card anchors', () => {
  const app = setup();
  for (const hash of ['#talks', '#other-work', '#judging']) {
    app.route(hash);
    assert.equal(app.sections[2].hidden, false);
  }
  assert.equal(app.cards[1].scrolled, true);
  app.route('#photos');
  assert.equal(app.sections[3].hidden, false);
  app.route('#card-jev');
  assert.equal(app.sections[1].hidden, false);
  assert.equal(app.cards[0].scrolled, true);
});

test('handles unknown hashes, skip links, and cross-section card IDs', () => {
  const app = setup({hash: '#main'});
  assert.equal(app.sections[0].hidden, false);
  app.route('#work');
  app.route('#main');
  assert.equal(app.sections[2].hidden, false);
  app.route('#writing/judging');
  assert.equal(app.cards[1].scrolled, undefined);
  app.route('#does-not-exist');
  assert.equal(app.sections[0].hidden, false);
});

test('mobile menu, Escape, footer placement, and viewport changes work', () => {
  const app = setup({mobile: true});
  assert.equal(app.footer.parent, app.document.body);
  app.menu.listeners.click();
  assert.equal(app.menu.getAttribute('aria-expanded'), 'true');
  app.document.listeners.keydown({key: 'Escape'});
  assert.equal(app.menu.getAttribute('aria-expanded'), 'false');
  assert.equal(app.menu.focused, true);
  app.menu.listeners.click();
  app.nav[2].listeners.click({});
  assert.equal(app.main.focused, true);
  assert.equal(app.menu.getAttribute('aria-expanded'), 'false');
  app.viewport.matches = false;
  app.viewport.listeners.change();
  assert.equal(app.footer.parent, app.sidebar);
});

test('event masonry is optional and reduced motion disables page animation', () => {
  const app = setup({hash: '#events', reducedMotion: true});
  assert.equal(app.cards[2].style.gridRowEnd, 'span 9');
  app.route('#work');
  assert.equal(app.sections[2].animated, undefined);
  const fallback = setup({hash: '#events', resize: false});
  assert.equal(fallback.document.documentElement.classList.values.has('masonry'), false);
  assert.equal(fallback.cards[2].style.gridRowEnd, undefined);
  assert.equal(fallback.sections[3].hidden, false);
});

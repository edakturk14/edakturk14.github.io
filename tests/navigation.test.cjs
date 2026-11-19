const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const source = readFileSync(require.resolve('../navigation.js'), 'utf8');
const origin = 'https://preview.example';
const routes = ['/', '/experience/', '/work/', '/writing/', '/work-with-me/'];

function setup({automatic = true} = {}) {
  const state = {page:'/', requests:[], pending:[], events:[], fallbacks:[], reloads:0, pushes:0, focus:0};
  let address = new URL(origin);
  const location = {
    get href() {return address.href;}, get origin() {return address.origin;},
    assign(url) {state.fallbacks.push(url);}, reload() {state.reloads++;}
  };
  const documentHandlers = new Map();
  const windowHandlers = new Map();
  const attributeNode = initial => ({
    attributes:{...initial},
    setAttribute(key,value) {this.attributes[key] = value;},
    getAttribute(key) {return this.attributes[key] ?? null;},
    removeAttribute(key) {delete this.attributes[key];}
  });
  function anchor(path, options = {}) {
    return {
      ...attributeNode(), href:new URL(path,origin).href, target:options.target || '',
      hasAttribute(name) {return name === 'download' && !!options.download;},
      classList:{contains(name) {return options.skip && name === 'skip-link';}},
      closest() {return this;}
    };
  }
  const links = routes.map(path => anchor(path));
  const main = {
    ...attributeNode(),
    replaceChildren(...nodes) {state.page = nodes[0].route;},
    focus() {state.focus++;}
  };
  const announcement = {textContent:''};
  const metadata = new Map();
  const meta = selector => {
    if (!metadata.has(selector)) metadata.set(selector, attributeNode({content:'initial',href:'https://www.edatweets.com/'}));
    return metadata.get(selector);
  };
  const history = {
    state:null,
    replaceState(value) {this.state = value;},
    pushState(value, _, href) {this.state = value; address = new URL(href); state.pushes++;}
  };
  const window = {
    history, scrollX:0, scrollY:0,
    scrollTo({left,top}) {this.scrollX = left; this.scrollY = top;},
    addEventListener(type,handler) {windowHandlers.set(type,handler);}
  };
  const document = {
    title:'About', documentElement:{outerHTML:'/'},
    querySelector(selector) {
      if (selector === '#main') return main;
      if (selector === '#page-announcement') return announcement;
      return meta(selector);
    },
    querySelectorAll() {return links;},
    importNode(node) {return {...node};},
    getElementById(id) {
      return id === 'buidlguidl' ? {scrollIntoView() {window.scrollY = 540;}} : null;
    },
    addEventListener(type,handler) {documentHandlers.set(type,handler);},
    dispatchEvent(event) {state.events.push(event.type);}
  };
  class DOMParser {
    parseFromString(route) {
      return {
        title:route === '/' ? 'About' : `Page ${route}`,
        querySelector(selector) {
          if (route === 'invalid') return null;
          if (selector === '#main') return {childNodes:[{route}]};
          if (selector === '.navigation') return {};
          return attributeNode({content:`Metadata ${route}`,href:`https://www.edatweets.com${route}`});
        }
      };
    }
  }
  const response = (path, ok = true) => ({ok, headers:{get() {return 'text/html';}}, async text() {return path;}});
  const fetch = path => {
    state.requests.push(path);
    if (automatic) return Promise.resolve(response(path));
    return new Promise((resolve,reject) => state.pending.push({path,resolve,reject}));
  };
  window.fetch = fetch; window.DOMParser = DOMParser;
  runInNewContext(source, {
    window, document, location, fetch, DOMParser, URL, AbortController,
    CustomEvent:class {constructor(type,options) {this.type = type; this.detail = options?.detail;}},
    setTimeout, clearTimeout, cancelAnimationFrame() {}, requestAnimationFrame(fn) {state.scrollCallback = fn; return 1;}
  });
  async function click(path, options = {}) {
    const event = {
      button:0, defaultPrevented:false, ...options, target:anchor(path,options),
      preventDefault() {this.defaultPrevented = true;}
    };
    await documentHandlers.get('click')(event);
    return event;
  }
  function pop(path, position) {
    address = new URL(path,origin);
    history.state = {edaScroll:position};
    return windowHandlers.get('popstate')({state:history.state});
  }
  function nativeHash(path) {
    address = new URL(path,origin);
    return windowHandlers.get('hashchange')();
  }
  return {state, main, links, document, window, metadata, announcement, history, click, pop, nativeHash, response, documentHandlers, windowHandlers, anchor};
}

test('page links replace only main content and update URL, title, metadata, and active navigation', async () => {
  const page = setup();
  const sidebarLinks = page.links;
  page.window.scrollY = 400;
  const event = await page.click('/experience/');
  assert.equal(event.defaultPrevented, true);
  assert.equal(page.state.page, '/experience/');
  assert.equal(page.document.title, 'Page /experience/');
  assert.equal(page.metadata.get('link[rel="canonical"]').getAttribute('href'), 'https://www.edatweets.com/experience/');
  assert.equal(page.links, sidebarLinks);
  assert.equal(page.links[1].getAttribute('aria-current'), 'page');
  assert.equal(page.links[0].getAttribute('aria-current'), null);
  assert.equal(page.main.getAttribute('aria-busy'), null);
  assert.equal(page.window.scrollY, 0);
  assert.equal(page.state.pushes, 1);
  assert.equal(page.state.focus, 1);
  assert.equal(page.announcement.textContent, 'Page /experience/');
  assert.deepEqual(page.state.events, ['site:navigate','site:before-render','site:page-ready']);
  assert.deepEqual(page.state.fallbacks, []);
});
test('modified clicks, downloads, external links, new tabs, skip links, and photo links stay native', async () => {
  const page = setup();
  for (const [path,options] of [
    ['/work/',{metaKey:true}], ['/work/',{ctrlKey:true}], ['/work/',{shiftKey:true}], ['/work/',{altKey:true}],
    ['/work/',{button:1}], ['/work/',{target:'_blank'}], ['/work/',{download:true}],
    ['https://other.example/work/',{}], ['mailto:hello@example.com',{}], ['/assets/photo.jpg',{}], ['/#main',{skip:true}]
  ]) assert.equal((await page.click(path,options)).defaultPrevented, false);
  assert.deepEqual(page.state.requests, []);
  assert.equal(page.state.pushes, 0);
});
test('Back and Forward restore saved scroll without adding history or reloading cached pages', async () => {
  const page = setup();
  await page.click('/writing/');
  await page.pop('/',{x:0,y:360});
  assert.equal(page.state.page, '/'); assert.equal(page.window.scrollY, 360);
  await page.pop('/writing/',{x:0,y:820});
  assert.equal(page.state.page, '/writing/'); assert.equal(page.window.scrollY, 820);
  assert.equal(page.state.pushes, 1);
  assert.deepEqual(page.state.requests, ['/writing/']);
  assert.equal(page.state.reloads, 0);
});
test('cross-page anchors and same-page navigation do not refetch or duplicate history', async () => {
  const page = setup();
  await page.click('/experience/#buidlguidl');
  assert.equal(page.window.scrollY, 540);
  await page.click('/experience/#buidlguidl');
  assert.equal(page.state.pushes, 1);
  assert.deepEqual(page.state.requests, ['/experience/']);
  await page.click('/experience/');
  assert.equal(page.window.scrollY, 0);
  assert.equal(page.state.pushes, 2);
});
test('the latest click wins when page responses arrive out of order', async () => {
  const page = setup({automatic:false});
  const first = page.click('/work/');
  const second = page.click('/writing/');
  assert.equal(page.state.page, '/');
  page.state.pending[1].resolve(page.response('/writing/')); await second;
  page.state.pending[0].resolve(page.response('/work/')); await first;
  assert.equal(page.state.page, '/writing/');
  assert.equal(page.state.pushes, 1);
  assert.equal(page.state.events.filter(e => e === 'site:page-ready').length, 1);
});
test('selecting the current page cancels a pending navigation', async () => {
  const page = setup({automatic:false});
  const pending = page.click('/work/');
  await page.click('/');
  page.state.pending[0].resolve(page.response('/work/')); await pending;
  assert.equal(page.state.page, '/');
  assert.equal(page.state.pushes, 0);
  assert.equal(page.main.getAttribute('aria-busy'), null);
});
test('failed and invalid page requests fall back to an ordinary page load', async () => {
  for (const failure of ['reject','404','invalid']) {
    const page = setup({automatic:false});
    const pending = page.click('/work/');
    const request = page.state.pending[0];
    if (failure === 'reject') request.reject(Error('offline'));
    else request.resolve(page.response(failure === 'invalid' ? 'invalid' : '/work/',failure !== '404'));
    await pending;
    assert.equal(page.state.page, '/');
    assert.deepEqual(page.state.fallbacks, [`${origin}/work/`]);
    assert.equal(page.state.pushes, 0);
    assert.equal(page.main.getAttribute('aria-busy'), null);
  }
});
test('hover prefetch is reused and scrolling saves the current history position', async () => {
  const page = setup();
  page.documentHandlers.get('pointerover')({target:page.anchor('/writing/')});
  await page.click('/writing/');
  assert.deepEqual(page.state.requests, ['/writing/']);
  page.window.scrollY = 650;
  page.windowHandlers.get('scroll')(); page.state.scrollCallback();
  assert.equal(page.history.state.edaScroll.y, 650);
});
test('native skip-link hash changes keep recording the correct scroll position', () => {
  const page = setup();
  page.nativeHash('/#main');
  page.window.scrollY = 280;
  page.windowHandlers.get('scroll')(); page.state.scrollCallback();
  assert.equal(page.history.state.edaScroll.y, 280);
  assert.equal(page.state.pushes, 0);
});

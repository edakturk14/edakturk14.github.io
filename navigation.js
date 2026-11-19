// Keep the sidebar and theme mounted while visiting the site's static HTML pages.
(() => {
  const main = document.querySelector('#main');
  const links = [...document.querySelectorAll('.nav-link')];
  if (!main || !links.length || !window.fetch || !window.DOMParser || !window.history.pushState) return;
  const routes = new Set(links.map(link => new URL(link.href).pathname));
  const history = window.history;
  const announcement = document.querySelector('#page-announcement');
  const parse = html => new DOMParser().parseFromString(html, 'text/html');
  const pageKey = url => url.pathname + url.search;
  let renderedURL = new URL(location.href);
  let navigationId = 0;
  let scrollFrame;
  // Capture the initial, unenhanced content before the carousel/motion scripts run.
  const pages = new Map([[pageKey(renderedURL), Promise.resolve(parse(document.documentElement.outerHTML))]]);

  function rememberPosition() {
    if (location.href !== renderedURL.href) return;
    history.replaceState({...history.state, edaScroll:{x:window.scrollX, y:window.scrollY}}, '', location.href);
  }
  function destinationFor(link) {
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.classList.contains('skip-link')) return null;
    const url = new URL(link.href, location.href);
    return url.origin === location.origin && routes.has(url.pathname) ? url : null;
  }
  function loadPage(url) {
    const key = pageKey(url);
    if (!pages.has(key)) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const request = fetch(key, {headers:{Accept:'text/html'}, credentials:'same-origin', signal:controller.signal})
        .then(async response => {
          if (!response.ok) throw Error('Page unavailable');
          const type = response.headers.get('content-type');
          if (type && !type.includes('text/html')) throw Error('Not an HTML page');
          const page = parse(await response.text());
          if (!page.querySelector('#main') || !page.querySelector('.navigation')) throw Error('Missing site content');
          return page;
        })
        .catch(error => {pages.delete(key); throw error;})
        .finally(() => clearTimeout(timeout));
      pages.set(key, request);
    }
    return pages.get(key);
  }
  function updateMetadata(page) {
    document.title = page.title;
    for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[property="og:url"]', 'link[rel="canonical"]']) {
      const current = document.querySelector(selector);
      const next = page.querySelector(selector);
      if (current && next) {
        const attribute = selector.startsWith('link') ? 'href' : 'content';
        current.setAttribute(attribute, next.getAttribute(attribute));
      }
    }
  }
  function placePage(url, position) {
    if (position && Number.isFinite(position.x) && Number.isFinite(position.y)) {
      window.scrollTo({left:position.x, top:position.y, behavior:'instant'});
    } else {
      let target;
      try {target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));} catch {}
      if (target) target.scrollIntoView({behavior:'instant', block:'start'});
      else window.scrollTo({left:0, top:0, behavior:'instant'});
    }
  }
  async function navigate(url, {fromHistory = false, position} = {}) {
    const id = ++navigationId;
    const replaceContent = pageKey(url) !== pageKey(renderedURL);
    if (!fromHistory) rememberPosition();
    main.setAttribute('aria-busy', 'true');
    try {
      // The current page stays visible while the next page is fetched.
      const page = replaceContent ? await loadPage(url) : null;
      if (id !== navigationId) return;
      document.dispatchEvent(new CustomEvent('site:navigate'));
      if (!fromHistory && url.href !== location.href) {
        rememberPosition();
        history.pushState({edaScroll:{x:0,y:0}}, '', url.href);
      }
      if (replaceContent) {
        document.dispatchEvent(new CustomEvent('site:before-render'));
        const nodes = [...page.querySelector('#main').childNodes].map(node => document.importNode(node, true));
        main.replaceChildren(...nodes);
        updateMetadata(page);
      }
      renderedURL = url;
      links.forEach(link => {
        if (new URL(link.href).pathname === url.pathname) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      placePage(url, position);
      main.removeAttribute('aria-busy');
      if (replaceContent) {
        document.dispatchEvent(new CustomEvent('site:page-ready', {detail:{navigation:true, restoring:fromHistory}}));
        if (announcement) announcement.textContent = document.title;
      }
      if (!fromHistory) main.focus({preventScroll:true});
      rememberPosition();
    } catch {
      if (id !== navigationId) return;
      main.removeAttribute('aria-busy');
      // Ordinary page navigation remains the fallback for failed requests.
      if (fromHistory) location.reload();
      else location.assign(url.href);
    }
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = destinationFor(event.target.closest('a[href]'));
    if (!url) return;
    event.preventDefault();
    return navigate(url);
  });
  const prefetch = event => {
    const url = destinationFor(event.target.closest('a[href]'));
    if (url) loadPage(url).catch(() => {});
  };
  document.addEventListener('pointerover', prefetch);
  document.addEventListener('focusin', prefetch);
  window.addEventListener('popstate', event => navigate(new URL(location.href), {fromHistory:true, position:event.state?.edaScroll}));
  window.addEventListener('hashchange', () => {
    const url = new URL(location.href);
    if (pageKey(url) === pageKey(renderedURL)) {
      renderedURL = url;
      rememberPosition();
    }
  });
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(rememberPosition);
  }, {passive:true});
  window.addEventListener('pagehide', rememberPosition);
  history.scrollRestoration = 'manual';
  rememberPosition();
})();

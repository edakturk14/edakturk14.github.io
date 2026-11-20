// Every quote and source link is available without JavaScript.
(() => {
  function connectWorkWithMe() {
    const page = document.querySelector('.work-with-me');
    if (!page) return () => {};
    const events = new AbortController();
    const {signal} = events;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const section = page.querySelector('.testimonials');
    const rows = [...section.querySelectorAll('.testimonial-row')];
    let touched = false;
    let hovered = false;
    let focused = false;
    let visible = !('IntersectionObserver' in window);
    let frame = 0;
    let last = 0;
    const offsets = new Map();
    const directions = new Map();

    rows.forEach(row => {
      row.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          // Pan the focused region, never move a focused source link offscreen.
          if (event.target !== row) return;
          row.scrollBy({left:(event.key === 'ArrowLeft' ? -1 : 1) * 310, behavior:'instant'});
        }
      }, {signal});
    });

    function tick(now) {
      const elapsed = last ? Math.min(now - last, 64) : 0;
      last = now;
      rows.forEach(row => {
        // Reverse at each end instead of appending duplicate quote cards.
        const maximum = Math.max(0, row.scrollWidth - row.clientWidth);
        const next = (offsets.get(row) || 0) + (directions.get(row) || 1) * elapsed * 0.028;
        const offset = Math.max(0, Math.min(maximum, next));
        if (next >= maximum) directions.set(row, -1);
        else if (next <= 0) directions.set(row, 1);
        offsets.set(row, offset);
        row.scrollLeft = offset;
      });
      frame = requestAnimationFrame(tick);
    }
    function syncMotion() {
      cancelAnimationFrame(frame);
      last = 0;
      rows.forEach(row => offsets.set(row, row.scrollLeft));
      if (!touched && !hovered && !focused && visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(tick);
    }
    section.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; syncMotion(); } }, {signal});
    section.addEventListener('pointerleave', () => { hovered = false; syncMotion(); }, {signal});
    // A focused control should never move away from someone using a keyboard.
    section.addEventListener('focusin', () => { focused = true; syncMotion(); }, {signal});
    section.addEventListener('focusout', event => { focused = section.contains(event.relatedTarget); syncMotion(); }, {signal});
    // On touchscreens, pause to read until the next tap outside the carousel.
    document.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') { touched = section.contains(event.target); syncMotion(); }
    }, {signal});
    document.addEventListener('visibilitychange', syncMotion, {signal});
    preference.addEventListener('change', syncMotion, {signal});
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting; syncMotion();});
      observer.observe(section);
    }
    syncMotion();
    return () => {
      events.abort();
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }
  let cleanup = connectWorkWithMe();
  document.addEventListener('site:before-render', () => cleanup());
  document.addEventListener('site:page-ready', () => {cleanup(); cleanup = connectWorkWithMe();});
})();

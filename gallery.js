'use strict';

// Old bookmarks still open the matching page and item. New links use real HTML routes.
function legacyDestination(hash) {
  let [section, id] = hash.replace(/^#/, '').split('/');
  const aliases = {talks:'work', 'other-work':'work', photos:'events', judging:'work', home:''};
  if (section === 'judging') id = 'judging';
  if (Object.hasOwn(aliases, section)) section = aliases[section];
  else if (!['experience', 'work', 'writing', 'events'].includes(section)) return null;
  return `/${section ? `${section}/` : ''}${id ? `#${section === 'experience' ? '' : 'card-'}${encodeURIComponent(id)}` : ''}`;
}

function restoreLegacyLink() {
  const destination = legacyDestination(location.hash);
  if (destination && destination !== `${location.pathname}${location.hash}`) location.replace(destination);
}

// Export only the pure route mapper for Node regression checks.
if (typeof module !== 'undefined') module.exports = {legacyDestination};
if (typeof document !== 'undefined') {
  restoreLegacyLink();
  window.addEventListener('hashchange', restoreLegacyLink);
  const $ = selector => document.querySelector(selector);
  const mobileViewport = window.matchMedia('(max-width: 700px)');
  const mobileMenu = $('.mobile-menu-toggle');
  const socialFooter = $('#site-socials');

  function placeSocialFooter() {
    (mobileViewport.matches ? document.body : $('.sidebar')).append(socialFooter);
  }
  function setMobileMenu(open) {
    $('.sidebar').dataset.menuOpen = String(open);
    mobileMenu.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.querySelector('path').setAttribute('d', open ? 'm5 5 10 10M5 15 15 5' : 'M3 7h14M3 13h14');
  }
  mobileMenu.addEventListener('click', () => setMobileMenu(mobileMenu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileViewport.matches && mobileMenu.getAttribute('aria-expanded') === 'true') {
      setMobileMenu(false);
      mobileMenu.focus();
    }
  });
  mobileViewport.addEventListener('change', () => {
    setMobileMenu(false);
    placeSocialFooter();
    if (!mobileViewport.matches && document.activeElement === mobileMenu) $('.name').focus();
  });
  placeSocialFooter();
  document.documentElement.classList.add('enhanced');

  // Event photos keep the existing masonry layout. Without JS they remain a regular grid.
  const gallery = $('.gallery[data-section="events"]');
  if (gallery && typeof ResizeObserver === 'function') {
    let frame;
    const layout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const css = getComputedStyle(gallery);
        const row = parseFloat(css.gridAutoRows);
        const gap = parseFloat(css.rowGap);
        gallery.querySelectorAll('.card').forEach(card => {
          const height = card.firstElementChild.getBoundingClientRect().height;
          card.style.gridRowEnd = `span ${Math.ceil((height + gap) / (row + gap))}`;
        });
      });
    };
    document.documentElement.classList.add('masonry');
    const observer = new ResizeObserver(layout);
    observer.observe(gallery);
    gallery.querySelectorAll('.card-inner').forEach(inner => observer.observe(inner));
    document.fonts?.ready.then(layout);
    layout();
  }
}

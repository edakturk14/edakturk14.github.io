'use strict';

// Old bookmarks still open the matching page and item. New links use real HTML routes.
function legacyDestination(hash) {
  if (hash === '#work-with-me') return '/work-with-me/';
  let [section, id] = hash.replace(/^#/, '').split('/');
  if (section === 'events' || section === 'photos') {
    const targets = {'ethgunu-stage':'card-ethgunu-stage', fireside:'card-ethgunu', volunteers:'card-ethgunu', cannes:'card-ethcc-intents'};
    return `/work/#${targets[id] || 'work-talks'}`;
  }
  const aliases = {talks:'work', 'other-work':'work', judging:'work', home:''};
  if (section === 'judging') id = 'judging';
  if (Object.hasOwn(aliases, section)) section = aliases[section];
  else if (!['experience', 'work', 'writing'].includes(section)) return null;
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

}

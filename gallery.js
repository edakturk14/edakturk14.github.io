'use strict';

const $ = selector => document.querySelector(selector);
const sections = Object.fromEntries(
  Array.from(document.querySelectorAll('.page-section'), section => [section.id, section])
);
const eventGallery = $('#gallery-events');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileViewport = window.matchMedia('(max-width: 700px)');
const mobileMenu = $('.mobile-menu-toggle');
const socialFooter = $('#site-socials');
let currentSection = '';
let layoutFrame;
let pageAnimation;

// Without ResizeObserver, retain the regular CSS grid used by the HTML-only page.
function layout() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(() => {
    if (currentSection !== 'events' || !resizeObserver) return;
    const css = getComputedStyle(eventGallery);
    const row = parseFloat(css.gridAutoRows);
    const gap = parseFloat(css.rowGap);
    eventGallery.querySelectorAll('.card').forEach(card => {
      const height = card.firstElementChild.getBoundingClientRect().height;
      card.style.gridRowEnd = `span ${Math.ceil((height + gap) / (row + gap))}`;
    });
  });
}
const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(layout) : null;
if (resizeObserver) {
  resizeObserver.observe(eventGallery);
  eventGallery.querySelectorAll('.card-inner').forEach(inner => resizeObserver.observe(inner));
}

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
  layout();
});
document.querySelectorAll('.nav-link, .name').forEach(link => {
  link.addEventListener('click', event => {
    if (!mobileViewport.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMobileMenu(false);
    $('#main').focus({preventScroll: true});
  });
});

function activateSection(section) {
  const changingPage = Boolean(currentSection);
  pageAnimation?.cancel();
  currentSection = section;
  Object.entries(sections).forEach(([id, content]) => {
    content.hidden = id !== section;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.section === section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const content = sections[section];
  const title = content.dataset.title;
  const count = content.querySelectorAll('.card').length;
  $('#gallery-status').textContent = section === 'home' ? 'About Eda' : `${title}, ${count} items`;
  document.title = section === 'home' ? 'Eda Akturk' : `${title} — Eda Akturk`;
  if (changingPage && !reducedMotion.matches && typeof content.animate === 'function') {
    pageAnimation = content.animate(
      [{opacity: 0, transform: 'translateY(6px)'}, {opacity: 1, transform: 'translateY(0)'}],
      {duration: 360, easing: 'cubic-bezier(.22,1,.36,1)'}
    );
  }
  layout();
}

function route() {
  if (mobileViewport.matches) setMobileMenu(false);
  let [section, id] = location.hash.slice(1).split('/');
  if (section === 'main' && currentSection) return;
  if (section === 'talks' || section === 'other-work') section = 'work';
  if (section === 'photos') section = 'events';
  if (section === 'judging') { section = 'work'; id = 'judging'; }
  if (section.startsWith('card-')) {
    const target = document.getElementById(section);
    const parent = Object.entries(sections).find(([, content]) => target && content.contains(target));
    if (parent) { id = section.slice(5); section = parent[0]; }
  }
  if (!Object.hasOwn(sections, section)) section = 'home';
  if (section !== currentSection) {
    activateSection(section);
    window.scrollTo({top: 0, behavior: 'instant'});
  }
  const card = id ? document.getElementById(`card-${id}`) : null;
  if (card && sections[section].contains(card)) {
    const routedHash = location.hash;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (location.hash === routedHash) card.scrollIntoView({block: 'nearest', behavior: 'instant'});
    }));
  }
}

window.addEventListener('hashchange', route);
document.fonts?.ready.then(layout);
placeSocialFooter();
route();
document.documentElement.classList.add('enhanced');
if (resizeObserver) document.documentElement.classList.add('masonry');

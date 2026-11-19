(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = [...document.querySelectorAll([
    '.home-intro > .eyebrow', '.home-intro > h1', '.bio > p',
    '.experience-intro', '.experience-role', '.education-section',
    '.gallery-heading:not(.sr-only)', '.work-group-title', '.card',
    '.services-header', '.service-card', '.services-contact'
  ].join(','))];
  const reveal = element => {
    element.classList.add('is-revealed');
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 100}ms`);
      reveal(entry.target);
    });
  }, {threshold:0, rootMargin:'0px 0px -16px 0px'});
  targets.forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
  document.addEventListener('focusin', event => {
    const target = event.target.closest('.reveal');
    if (target) reveal(target);
  });
  const showAll = () => {
    document.documentElement.classList.remove('motion-ready');
    observer.disconnect();
  };
  preference.addEventListener('change', event => { if (event.matches) showAll(); });
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
})();

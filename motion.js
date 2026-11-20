(() => {
  function connectMotion({navigation = false, restoring = false} = {}) {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return () => {};
    const events = new AbortController();
    const targets = [...document.querySelectorAll([
      '.home-intro > .eyebrow', '.home-intro > h1', '.bio > p',
      '.experience-intro', '.experience-role', '.education-section',
      '.gallery-heading:not(.sr-only)', '.work-group-title', '.card',
      '.services-header', '.service-card', '.testimonials-header', '.services-contact'
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
      const rect = element.getBoundingClientRect();
      // Page changes get a quick entrance; scrolling still reveals later sections.
      if (navigation && rect.top < window.innerHeight && rect.bottom > 0) reveal(element);
      else observer.observe(element);
    });
    document.documentElement.classList.add('motion-ready');
    const main = document.querySelector('#main');
    const entrance = navigation && !restoring && typeof main.animate === 'function' ? main.animate([
      {opacity:0, transform:'translateY(6px)'}, {opacity:1, transform:'none'}
    ], {duration:200, easing:'ease-out'}) : null;
    document.addEventListener('focusin', event => {
      const target = event.target.closest('.reveal');
      if (target) reveal(target);
    }, {signal:events.signal});
    const showAll = () => {
      document.documentElement.classList.remove('motion-ready');
      observer.disconnect();
      entrance?.cancel();
    };
    preference.addEventListener('change', event => {if (event.matches) showAll();}, {signal:events.signal});
    window.addEventListener('pageshow', event => {if (event.persisted) showAll();}, {signal:events.signal});
    return () => {events.abort(); showAll();};
  }
  let cleanup = connectMotion();
  document.addEventListener('site:before-render', () => cleanup());
  document.addEventListener('site:page-ready', event => {cleanup = connectMotion(event.detail);});
})();

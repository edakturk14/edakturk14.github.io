(() => {
  const carousel = document.querySelector('.about-photos');
  if (!carousel) return;
  const track = carousel.querySelector('.photo-track');
  const slides = [...carousel.querySelectorAll('.photo-slide')];
  const controls = carousel.querySelector('.photo-controls');
  const play = carousel.querySelector('.photo-play');
  const count = carousel.querySelector('.photo-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let visible = false;
  let timer;
  let scrollTimer;
  function updateControls() {
    play.dataset.paused = String(paused);
    play.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    count.setAttribute('aria-live', paused ? 'polite' : 'off');
    count.textContent = `${index + 1} / ${slides.length}`;
  }
  function schedule() {
    clearTimeout(timer);
    if (!paused && !hovered && visible && !document.hidden) {
      timer = setTimeout(() => { show(index + 1); schedule(); }, 6000);
    }
  }
  function show(next) {
    index = (next + slides.length) % slides.length;
    track.scrollTo({left:index * track.clientWidth, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
    updateControls();
  }
  function manual(next) { paused = true; show(next); schedule(); }
  carousel.querySelector('.photo-prev').addEventListener('click', () => manual(index - 1));
  carousel.querySelector('.photo-next').addEventListener('click', () => manual(index + 1));
  play.addEventListener('click', () => { paused = !paused; updateControls(); schedule(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', event => {
    if (event.target !== play) { paused = true; updateControls(); schedule(); }
  });
  track.addEventListener('pointerdown', () => { paused = true; updateControls(); schedule(); });
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); manual(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
      updateControls();
    }, 100);
  }, {passive:true});
  window.addEventListener('resize', () => { track.scrollTo({left:index * track.clientWidth, behavior:'instant'}); });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { paused = true; updateControls(); schedule(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, {threshold:0.35}).observe(carousel);
  } else { visible = true; }
  controls.hidden = false;
  updateControls();
  schedule();
})();

(() => {
  const carousel = document.querySelector('.about-photos');
  if (!carousel) return;
  const track = carousel.querySelector('.photo-track');
  const controls = carousel.querySelector('.photo-controls');
  const play = carousel.querySelector('.photo-play');
  const slides = [...track.children];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Two copies keep the loop seamless even when the viewport is wider than one set.
  for (let copy = 0; copy < 2; copy += 1) {
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }
  let paused = reducedMotion.matches;
  let hovered = false;
  let visible = false;
  let frame;
  let previousTime;
  let position = 0;
  let loopWidth;
  function measure() {
    loopWidth = track.children[slides.length].offsetLeft - slides[0].offsetLeft;
  }
  function tick(time) {
    if (previousTime !== undefined) {
      position = (position + Math.min(time - previousTime, 50) * 0.022) % loopWidth;
      track.scrollLeft = position;
    }
    previousTime = time;
    frame = requestAnimationFrame(tick);
  }
  function update() {
    cancelAnimationFrame(frame);
    previousTime = undefined;
    play.textContent = paused ? 'Play' : 'Pause';
    play.setAttribute('aria-label', paused ? 'Play photo strip' : 'Pause photo strip');
    if (!paused && !hovered && visible && !document.hidden) {
      position = track.scrollLeft % loopWidth;
      frame = requestAnimationFrame(tick);
    }
  }
  play.addEventListener('click', () => { paused = !paused; update(); });
  track.addEventListener('mouseenter', () => { hovered = true; update(); });
  track.addEventListener('mouseleave', () => { hovered = false; update(); });
  track.addEventListener('pointerdown', () => { paused = true; update(); });
  track.addEventListener('focus', () => { paused = true; update(); });
  window.addEventListener('resize', () => { measure(); update(); });
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { paused = true; update(); }
  });
  measure();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      update();
    }, {threshold:0.1}).observe(carousel);
  } else { visible = true; }
  controls.hidden = false;
  update();
})();

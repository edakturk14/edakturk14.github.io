(() => {
  const carousel = document.querySelector('.about-photos');
  if (!carousel) return;
  const track = carousel.querySelector('.photo-track');
  const controls = carousel.querySelector('.photo-controls');
  const play = carousel.querySelector('.photo-play');
  const slides = [...track.children];
  const originals = slides.map(slide => slide.querySelector('.photo-open'));
  const viewer = carousel.querySelector('.photo-viewer');
  const viewerImage = viewer.querySelector('.photo-viewer-image');
  const viewerStatus = viewer.querySelector('.photo-viewer-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsDialog = typeof viewer.showModal === 'function';
  // Extra copies keep the loop seamless at every viewport width.
  for (let copy = 0; copy < 2; copy += 1) {
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('a').tabIndex = -1;
      track.appendChild(clone);
    });
  }
  [...track.children].forEach((slide, index) => {
    slide.style.setProperty('--photo-delay', `${Math.min(index, 5) * 105}ms`);
  });
  let paused = reducedMotion.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  let entered = reducedMotion.matches;
  let entering = false;
  let frame;
  let entryTimer;
  let previousTime;
  let position = 0;
  let loopWidth;
  let currentPhoto = 0;
  let opener;
  let requestId = 0;
  let zoom;
  let oldBodyOverflow;
  function measure() {
    loopWidth = track.children[slides.length].offsetLeft - slides[0].offsetLeft;
  }
  function tick(time) {
    if (previousTime !== undefined) {
      position = (position + Math.min(time - previousTime, 50) * 0.038) % loopWidth;
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
    if (!paused && !hovered && !focused && visible && entered && !viewer.open && !document.hidden && loopWidth > 0) {
      position = track.scrollLeft % loopWidth;
      frame = requestAnimationFrame(tick);
    }
  }
  function enter() {
    if (entered || entering) return;
    entering = true;
    carousel.classList.add('photos-entering');
    entryTimer = setTimeout(() => {
      entered = true;
      entering = false;
      carousel.classList.remove('photos-waiting', 'photos-entering');
      update();
    }, 1150);
  }
  async function showPhoto(index, trigger) {
    const token = ++requestId;
    currentPhoto = (index + originals.length) % originals.length;
    const source = originals[currentPhoto].querySelector('img');
    const from = trigger?.querySelector('img').getBoundingClientRect();
    zoom?.cancel();
    viewerImage.src = source.src;
    viewerImage.alt = source.alt;
    viewerImage.removeAttribute('aria-hidden');
    viewerImage.width = Number(source.getAttribute('width'));
    viewerImage.height = Number(source.getAttribute('height'));
    try { await viewerImage.decode(); } catch { return; }
    if (token !== requestId) return;
    if (!viewer.open) {
      opener = trigger || originals[currentPhoto];
      oldBodyOverflow = document.body.style.overflow;
      viewer.showModal();
      document.body.style.overflow = 'hidden';
      update();
    }
    viewerStatus.textContent = `Photo ${currentPhoto + 1} of ${originals.length}`;
    if (!reducedMotion.matches && typeof viewerImage.animate === 'function') {
      const to = viewerImage.getBoundingClientRect();
      const origin = from && from.width && to.width ? {
        transform:`translate(${from.x + from.width / 2 - to.x - to.width / 2}px, ${from.y + from.height / 2 - to.y - to.height / 2}px) scale(${from.width / to.width}, ${from.height / to.height})`,
        opacity:0.7
      } : {transform:'translateY(14px) scale(.95)', opacity:0};
      zoom = viewerImage.animate([origin, {transform:'translate(0,0) scale(1)', opacity:1}], {
        duration:from ? 500 : 280, easing:'cubic-bezier(.22,1,.36,1)'
      });
    }
  }
  track.addEventListener('click', event => {
    const link = event.target.closest('.photo-open');
    if (!link || !supportsDialog || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPhoto(Number(link.dataset.photoIndex), link);
  });
  viewer.querySelector('.photo-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.photo-previous').addEventListener('click', () => showPhoto(currentPhoto - 1));
  viewer.querySelector('.photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(currentPhoto + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => {
    requestId += 1;
    zoom?.cancel();
    document.body.style.overflow = oldBodyOverflow || '';
    const original = originals[Number(opener?.dataset.photoIndex) || 0];
    original.focus({preventScroll:true});
    update();
  });
  play.addEventListener('click', () => { paused = !paused; update(); });
  track.addEventListener('mouseenter', () => { hovered = true; update(); });
  track.addEventListener('mouseleave', () => { hovered = false; update(); });
  // Touch scrolling should stay put; a click opens the viewer without turning autoplay off.
  track.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') { paused = true; update(); }
  });
  track.addEventListener('focusin', () => {
    focused = true;
    carousel.classList.remove('photos-waiting', 'photos-entering');
    clearTimeout(entryTimer);
    entered = true;
    entering = false;
    update();
  });
  track.addEventListener('focusout', event => {
    if (!track.contains(event.relatedTarget)) { focused = false; update(); }
  });
  window.addEventListener('resize', () => { measure(); update(); });
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      paused = true;
      entered = true;
      entering = false;
      clearTimeout(entryTimer);
      zoom?.cancel();
      carousel.classList.remove('photos-waiting', 'photos-entering');
      update();
    }
  });
  if (!reducedMotion.matches) carousel.classList.add('photos-waiting');
  measure();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) enter();
      update();
    }, {threshold:0.15}).observe(carousel);
  } else { visible = true; enter(); }
  controls.hidden = false;
  update();
})();

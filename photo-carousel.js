(() => {
  function connectCarousel() {
    const carousel = document.querySelector('.about-photos');
    if (!carousel) return () => {};
    const events = new AbortController();
    const listen = (target, type, handler) => target.addEventListener(type, handler, {signal:events.signal});
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
    listen(track, 'click', event => {
      const link = event.target.closest('.photo-open');
      if (!link || !supportsDialog || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPhoto(Number(link.dataset.photoIndex), link);
    });
    listen(viewer.querySelector('.photo-close'), 'click', () => viewer.close());
    listen(viewer.querySelector('.photo-previous'), 'click', () => showPhoto(currentPhoto - 1));
    listen(viewer.querySelector('.photo-next'), 'click', () => showPhoto(currentPhoto + 1));
    listen(viewer, 'keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(currentPhoto + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    listen(viewer, 'click', event => { if (event.target === viewer) viewer.close(); });
    listen(viewer, 'close', () => {
      requestId += 1;
      zoom?.cancel();
      document.body.style.overflow = oldBodyOverflow || '';
      const original = originals[Number(opener?.dataset.photoIndex) || 0];
      original.focus({preventScroll:true});
      update();
    });
    listen(play, 'click', () => { paused = !paused; update(); });
    listen(track, 'mouseenter', () => { hovered = true; update(); });
    listen(track, 'mouseleave', () => { hovered = false; update(); });
    // Touch scrolling should stay put; a click opens the viewer without turning autoplay off.
    listen(track, 'pointerdown', event => {
      if (event.pointerType === 'touch') { paused = true; update(); }
    });
    listen(track, 'focusin', () => {
      focused = true;
      carousel.classList.remove('photos-waiting', 'photos-entering');
      clearTimeout(entryTimer);
      entered = true;
      entering = false;
      update();
    });
    listen(track, 'focusout', event => {
      if (!track.contains(event.relatedTarget)) { focused = false; update(); }
    });
    listen(window, 'resize', () => { measure(); update(); });
    listen(document, 'visibilitychange', update);
    listen(reducedMotion, 'change', () => {
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
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) enter();
        update();
      }, {threshold:0.15});
      observer.observe(carousel);
    } else { visible = true; enter(); }
    controls.hidden = false;
    update();
    return () => {
      requestId += 1;
      events.abort();
      observer?.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(entryTimer);
      zoom?.cancel();
      if (viewer.open) {
        viewer.close();
        document.body.style.overflow = oldBodyOverflow || '';
      }
    };
  }
  let cleanup = connectCarousel();
  document.addEventListener('site:before-render', () => cleanup());
  document.addEventListener('site:page-ready', () => {cleanup = connectCarousel();});
})();

// Runs before styles so a remembered preference never flashes the wrong theme.
(() => {
  const root = document.documentElement;
  let theme = 'light';
  try { if (localStorage.getItem('eda-theme') === 'dark') theme = 'dark'; } catch {}
  root.dataset.theme = theme;
  function connectControls() {
    const controls = document.querySelector('.theme-controls');
    const buttons = document.querySelectorAll('[data-set-theme]');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!controls) return;
    let transitioning = false;
    function render() {
      const dark = root.dataset.theme === 'dark';
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.setTheme === root.dataset.theme)));
      if (meta) meta.setAttribute('content', dark ? '#10151e' : '#ffffff');
    }
    function applyTheme(next) {
      root.dataset.theme = next;
      try { localStorage.setItem('eda-theme', next); } catch {}
      render();
    }
    function finishTransition() {
      delete root.dataset.themeTransition;
      transitioning = false;
    }
    function selectTheme(button) {
      const next = button.dataset.setTheme;
      if (transitioning || next === root.dataset.theme) return;
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        applyTheme(next);
        return;
      }
      // Use the control, including for keyboard input, rather than the pointer.
      const {left, top, width, height} = button.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty('--theme-x', `${x}px`);
      root.style.setProperty('--theme-y', `${y}px`);
      root.style.setProperty('--theme-radius', `${Math.ceil(radius)}px`);
      root.dataset.themeTransition = '';
      transitioning = true;
      try {
        const transition = document.startViewTransition(() => applyTheme(next));
        // A skipped transition (e.g. in a hidden tab) still applies the theme.
        transition.ready.catch(() => {});
        transition.finished.catch(() => applyTheme(next)).finally(finishTransition);
      } catch {
        applyTheme(next);
        finishTransition();
      }
    }
    render();
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => selectTheme(button)));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectControls, {once:true});
  else connectControls();
})();

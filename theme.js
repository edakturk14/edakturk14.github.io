// Runs before styles so a remembered preference never flashes the wrong theme.
(() => {
  const root = document.documentElement;
  let theme = 'light';
  try { if (localStorage.getItem('eda-theme') === 'dark') theme = 'dark'; } catch {}
  root.dataset.theme = theme;
  function connectToggle() {
    const button = document.querySelector('.theme-toggle');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!button) return;
    function render() {
      const dark = root.dataset.theme === 'dark';
      button.setAttribute('aria-checked', String(dark));
      if (meta) meta.setAttribute('content', dark ? '#10151e' : '#ffffff');
    }
    render();
    button.hidden = false;
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('eda-theme', root.dataset.theme); } catch {}
      render();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectToggle, {once:true});
  else connectToggle();
})();

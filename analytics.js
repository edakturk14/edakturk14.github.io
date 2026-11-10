(() => {
  // Keep local development and preview visits out of production analytics.
  // The canonical URL follows the production origin in content/site.mjs.
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical || location.origin !== new URL(canonical.href).origin) return;

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();

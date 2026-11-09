import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {items, workGroups} from '../content/gallery.mjs';
import {origin, pages} from '../content/site.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const template = await read('content/layout.html');
const external = (url, label, className = '') => `<a${className ? ` class="${className}"` : ''} href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;

function card(item, index) {
  const image = `/${item.image}`;
  const heading = item.section === 'work' ? 'h3' : 'h2';
  const visual = `<div class="card-visual"${item.section === 'events' ? ` style="aspect-ratio:${item.ratio}"` : ''}><img src="${escape(image)}" alt="${escape(item.alt)}" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async"${item.fit ? ` style="object-fit:${item.fit}"` : ''} /></div>`;
  const caption = `<div class="card-caption"><${heading}>${escape(item.title)}</${heading}><p class="card-meta">${escape(item.meta)}</p></div>`;
  const main = item.group === 'community' ? visual + caption : external(item.links?.[0]?.[1] || image, visual + caption, 'card-main-link');
  const links = (item.links || []).map(([label, url]) => external(url, `${escape(label)} <span aria-hidden="true">↗</span>`, 'external-link')).join('\n');
  return `<article class="card" id="card-${item.id}"><div class="card-inner">${main}${item.description ? `<p class="card-description">${escape(item.description)}</p>` : ''}<div class="card-links">${links}</div></div></article>`;
}

function portfolio(section) {
  const selected = items.filter(item => item.section === section);
  if (section === 'writing') selected.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  let content;
  if (section === 'work') {
    let index = 0;
    content = workGroups.map(group => `<section class="work-group" id="work-${group.id}" data-group="${group.id}" aria-labelledby="work-${group.id}-title"><h2 class="work-group-title" id="work-${group.id}-title">${escape(group.title)}</h2><div class="work-grid">${group.items.map(id => card(items.find(item => item.id === id), index++)).join('\n')}</div></section>`).join('\n');
  } else content = selected.map(card).join('\n');
  const blogs = section === 'writing' ? `<nav class="writing-blogs" aria-label="Writing blogs"><svg class="heading-divider" viewBox="0 0 40 12" aria-hidden="true"><path d="M1 6h38"/></svg><span>Now: ${external('https://edatweets.substack.com/', 'Substack')}</span><span>Previously: ${external('https://paragraph.com/@edatweets', 'Paragraph')} · ${external('https://eda.hashnode.dev/', 'Hashnode')}</span></nav>` : '';
  return `<section id="portfolio" aria-labelledby="section-title"><div class="gallery-heading${section === 'work' ? ' sr-only' : ''}"><div class="gallery-heading-main"><h1 id="section-title">${section === 'writing' ? 'Selected writing' : section === 'work' ? 'Selected Work' : 'Events'}</h1>${blogs}</div><span id="item-count" aria-hidden="true">${String(selected.length).padStart(2, '0')}</span></div><div class="gallery" id="gallery" data-section="${section}">${content}</div></section>`;
}

for (const page of pages) {
  const content = ['home', 'experience'].includes(page.id) ? await read(`content/${page.id}.html`) : portfolio(page.id);
  const navigation = pages.map(item => `      <a class="nav-link" href="${item.path}"${item.id === page.id ? ' aria-current="page"' : ''}>${item.label}</a>`).join('\n');
  const values = {content, navigation, title:escape(page.title), description:escape(page.description), origin, canonical:`${origin}${page.path}`};
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]);
  const directory = new URL(`.${page.path}`, root);
  await mkdir(directory, {recursive:true});
  await writeFile(new URL('index.html', directory), html);
}
await writeFile(new URL('sitemap.xml', root), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>${origin}${page.path}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('robots.txt', root), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${pages.length} static pages in ${fileURLToPath(root)}`);

'use strict';

// Content and links retained from the existing portfolio. Cover sources are in ASSET-SOURCES.md.
const items = [
  {id:'hyperlane-mcp',section:'work',group:'talks',title:'Hyperlane MCP',meta:'Demo · 2025',image:'assets/demo-hyperlane-opening.png',alt:'Eda presenting the Hyperlane MCP demo in front of a brick wall',links:[['Watch demo','https://x.com/hyperlane/status/1935063992827092996']]},
  {id:'onchainkit',section:'work',group:'talks',title:'Scaffold-ETH 2 × OnchainKit',meta:'Demo · 2024',image:'assets/demo-onchainkit.jpg',alt:'Eda demonstrating the OnchainKit extension for Scaffold-ETH 2',links:[['Watch demo','https://x.com/edatweets_/status/1823003723548762597']]},
  {id:'grok-bot',section:'writing',publishedAt:'2026-09-16',title:'Building a company in 3 days with Grok Bot',meta:'Marketing & AI · 2026',image:'assets/cover-grok-bot.png',alt:'Grok Bot Galaxy cover with colorful characters on a black background',links:[['Read the post','https://edatweets.substack.com/p/building-a-company-in-3-days-with']]},
  {id:'jev',section:'writing',publishedAt:'2026-10-06',title:'JEV for everyone else',meta:'Technical explainer · AI · 2026',image:'assets/cover-jev-diagram.png',fit:'contain',alt:'Diagram comparing JEV’s System 1 model, which returns choices, scores, and noul, with System 2 models that return text',links:[['Read the post','https://edatweets.substack.com/p/jev-for-everyone-else']]},
  {id:'free-hat',section:'writing',publishedAt:'2025-10-05',title:'2 Hours in Line for a Free Hat',meta:'Marketing & culture · 2025',image:'assets/claude-hats.png',alt:'Claude’s pop-up at the Air Mail café, with a bicycle outside',ratio:.88,links:[['Read the post','https://edatweets.substack.com/p/2-hours-in-line-for-a-free-hat'],['View on X','https://x.com/edatweets_/status/1974864591848157250']]},
  {id:'ethcc-intents',section:'work',group:'talks',title:'A Beginner’s Guide to Intents & the Open Intents Framework',meta:'Speaker · ETHCC, Cannes · 2025',image:'assets/talk-intents.jpg',alt:'Video thumbnail for A Beginner’s Guide to Intents and the Open Intents Framework',ratio:1.7778,links:[['Watch the talk','https://www.youtube.com/watch?v=-nKZEl3M9oY']]},
  {id:'batches',section:'work',group:'community',title:'BuidlGuidl Batches',meta:'Program launch · BuidlGuidl core team',image:'assets/batches-onboarding.png',alt:'BG Onboarding Batches artwork with an illustrated slide and the text From beginner to expert in open source dApp development',ratio:1.1,description:'Launched a cohort-based program at BuidlGuidl to help Ethereum developers build apps and contribute to open source.',links:[['Batches homepage','https://buidlguidl.com/batches']]},
  {id:'lovable',section:'writing',publishedAt:'2026-04-05',title:'On Lovable',meta:'Marketing & growth · 2026',image:'assets/cover-lovable.png',alt:'Lovable in numbers, an image from the article',ratio:1.17,links:[['Read the post','https://edatweets.substack.com/p/on-lovable']]},
  {id:'ethgunu',section:'work',group:'community',title:'ETHGünü',meta:'Core organizer · Istanbul · 2023',image:'assets/g-fireside.jpg',alt:'Fireside chat with Aya Miyaguchi at ETHGünü in Istanbul',ratio:1.1,description:'Core organizer of ETHGünü during Devconnect Istanbul 2023. Also hosted a fireside chat with Aya Miyaguchi, then Executive Director of the Ethereum Foundation.',links:[['Visit ETHGünü','https://ethgunu.com/en/'],['Watch the fireside chat','https://streameth.org/watch/65b8f8cea5b2d09b88ec1055']]},
  {id:'ef-grant',section:'work',group:'community',title:'Ethereum Foundation grant',meta:'Grantee · Technical education',image:'assets/ef-garden.png',alt:'Ethereum Foundation illustration of an Ethereum diamond in a forest garden',description:'Received an Ethereum Foundation grant for developer education and community building. Created technical guides, gave workshops, and brought developers together at major Ethereum events.',links:[]},
  {id:'brussels',section:'events',title:'Workshop in Brussels',meta:'Brussels · 2024',image:'assets/g-workshop.jpg',alt:'Eda leading a developer workshop in Brussels',ratio:1.13,},
  {id:'intents-guide',section:'writing',publishedAt:'2025-02-24',title:'A Developer’s Guide to Intents',meta:'Technical explainer · 2025',image:'assets/cover-intents.png',alt:'Cover of A Developer’s Guide to Intents and the Open Intents Framework',ratio:1.2,links:[['Read the guide','https://paragraph.com/@edatweets/a-developer-s-guide-to-intents-the-open-intents-framework'],['View on X','https://x.com/edatweets_/status/1894091793773236315']]},
  {id:'buenos-aires',section:'events',title:'Devconnect, Buenos Aires',meta:'Buenos Aires · 2025',image:'assets/g-argentina.jpg',alt:'At Devconnect in Buenos Aires',ratio:.9,},
  {id:'hyperlane-guide',section:'writing',publishedAt:'2024-12-02',title:'A Developer’s Guide to Interoperability with Hyperlane',meta:'Technical explainer · 2024',image:'assets/cover-hyperlane.png',alt:'Cover of A Developer’s Guide to Interoperability with Hyperlane',ratio:1.2,links:[['Read the guide','https://paragraph.com/@edatweets/a-developer-s-guide-to-interoperability-with-hyperlane']]},
  {id:'web2-web3',section:'work',group:'videos',title:'Web2 to Web3: Building on Ethereum',meta:'Video series creator · 2022',image:'assets/talk-web3.jpg',alt:'Web2 to Web3: Building on Ethereum video series',ratio:1.2,description:'Created a 15-part video guide to building on Ethereum with Austin Griffith and Carlos.',links:[['Watch the series','https://www.youtube.com/watch?v=zuJ-elbo88E&list=PLJz1HruEnenAf80uOfDwBPqaliJkjKg69'],['View on X','https://x.com/edatweets_/status/1575177155738099712']]},
  {id:'judging',section:'work',group:'community',title:'Hackathon judging',meta:'Hackathon judge · Tokyo, Istanbul & Seoul',image:'assets/ethglobal-tokyo.jpg',alt:'Official ETHGlobal Tokyo artwork showing a nighttime street with Ethereum neon signs',description:'Judged at ETHGlobal Tokyo and Istanbul in 2023, and ETH Seoul in 2024.',links:[['ETHGlobal Tokyo','https://ethglobal.com/events/tokyo'],['ETHGlobal Istanbul','https://ethglobal.com/events/istanbul'],['ETH Seoul','https://www.ethseoul.org/ethseoul2024.html']]},
  {id:'zk-guide',section:'writing',publishedAt:'2023-12-04',title:'Zero-Knowledge Proofs in Plain English',meta:'Cryptography · 2023',image:'assets/cover-zk.png',alt:'Cover of Zero-Knowledge Proofs in Plain English',ratio:1.15,links:[['Read the post','https://paragraph.com/@edatweets/zero-knowledge-proofs-in-plain-english'],['View on X','https://x.com/edatweets_/status/1731668335056568725']]},
  {id:'seoul-workshop',section:'work',group:'talks',title:'Building Dapps on Ethereum with ScaffoldETHv2',meta:'Workshop instructor · ETH Seoul · 2024',image:'assets/talk-seoul.jpg',alt:'Video thumbnail for Eda Akturk’s Building Dapps on Ethereum with ScaffoldETHv2 workshop at ETH Seoul 2024',links:[['Watch the workshop','https://www.youtube.com/watch?v=FYuDggnYpFA&t=72s']]},
  {id:'builder-show',section:'work',group:'videos',title:'The Builder Show',meta:'Podcast co-host · 2024',image:'assets/builder-show-wide.png',alt:'The Builder Show artwork featuring Eda Akturk and Austin Griffith',description:'Co-hosted a podcast with Austin Griffith about builders in Web3.',links:[['Watch on YT','https://www.youtube.com/watch?v=cPNrYKR9rtI&list=PLnVqcyNGbH00XdrWBNM6DiPkF6SYBCY_G'],['Listen on Spotify','https://creators.spotify.com/pod/profile/buidlguidl/'],['Launch post on X','https://x.com/edatweets_/status/1767156509694116301']]},
  {id:'100-days',section:'work',group:'community',title:'100 Days of Web3',meta:'100-day learning challenge',image:'assets/100-days-web3.png',alt:'My Web3 Journey: Day 100 of #100daysofWeb3 on a colorful gradient background',description:'Documented learning and building with blockchains on my blog and X (formerly Twitter). The challenge that started my career in crypto.',links:[['Read the blog post','https://eda.hashnode.dev/my-web3-journey-day-100-of-100daysofweb3'],['See the thread','https://x.com/edatweets_/status/1483040244530393090']]},
  {id:'cryptist',section:'events',title:'Cryptist, Istanbul',meta:'Istanbul · 2022',image:'assets/g-cryptist.jpg',alt:'Group photo at Cryptist in Istanbul',ratio:1.2,},
  {id:'ctf',section:'events',title:'BuidlGuidl CTF at Devcon SEA',meta:'Devcon SEA · 2024',image:'assets/g-ctf.jpg',alt:'BuidlGuidl CTF crew at Devcon SEA',ratio:1.05,},
  {id:'volunteers',section:'events',title:'The ETHGünü crew',meta:'Istanbul · 2023',image:'assets/g-team.jpg',alt:'ETHGünü volunteers together on stage',ratio:1.25,},
  {id:'ethgunu-stage',section:'events',title:'ETHGünü',meta:'Istanbul · 2023',image:'assets/talk-ethgunu.jpg',alt:'Eda presenting at ETHGünü',ratio:.9,links:[['Watch the talk','https://streameth.org/watch/65b8f8d0a5b2d09b88ec1209']]},
  {id:'fireside',section:'events',title:'A conversation with Aya Miyaguchi',meta:'ETHGünü, Istanbul · 2023',image:'assets/g-fireside.jpg',alt:'Eda hosting a fireside chat with Aya Miyaguchi',ratio:1.2,links:[['Watch the conversation','https://streameth.org/watch/65b8f8cea5b2d09b88ec1055']]},
  {id:'cannes',section:'events',title:'ETHCC, Cannes',meta:'Cannes · 2025',image:'assets/talk-cannes.jpg',alt:'Eda speaking at ETHCC in Cannes',ratio:.8,}
];
const sections = {home:'About Me',writing:'Selected writing',work:'Work',events:'Events'};
const workGroups = [
  {id:'videos',title:'Videos',items:['builder-show','web2-web3']},
  {id:'community',title:'Projects and Community',items:['batches','ethgunu','ef-grant','judging','100-days']},
  {id:'talks',title:'Talks & workshops',items:['ethcc-intents','seoul-workshop','hyperlane-mcp','onchainkit']}
];
// Show writing in newest-first publication order.
function sectionItems(section) {
  const selected = items.filter(item => item.section === section);
  return section === 'writing'
    ? selected.sort((a,b) => b.publishedAt.localeCompare(a.publishedAt))
    : selected;
}
const $ = selector => document.querySelector(selector);
const gallery = $('#gallery');
let currentSection = '';
let visibleItems = [];
let layoutFrame;

// Only event photos use masonry. Article and recording covers share a compact format.
function layout() {
  cancelAnimationFrame(layoutFrame);
  layoutFrame = requestAnimationFrame(() => {
    if (currentSection !== 'events') return;
    const css = getComputedStyle(gallery);
    const row = parseFloat(css.gridAutoRows);
    const gap = parseFloat(css.rowGap);
    gallery.querySelectorAll('.card').forEach(card => {
      const height = card.firstElementChild.getBoundingClientRect().height;
      card.style.gridRowEnd = `span ${Math.ceil((height + gap) / (row + gap))}`;
    });
  });
}
const resizeObserver = new ResizeObserver(layout);
resizeObserver.observe(gallery);

function caption(item) {
  const el = document.createElement('div');
  el.className = 'card-caption';
  const title = document.createElement(item.section === 'work' ? 'h3' : 'h2'); title.textContent = item.title;
  const meta = document.createElement('p'); meta.className = 'card-meta'; meta.textContent = item.meta;
  el.append(title,meta);
  return el;
}

function media(item,index) {
  if (!item.image) return null;
  const visual = document.createElement('div'); visual.className = 'card-visual';
  if (item.section === 'events') visual.style.aspectRatio = item.ratio;
  const img = document.createElement('img');
  img.src = item.image; img.alt = item.alt; img.decoding = 'async';
  if (item.fit) img.style.objectFit = item.fit;
  img.loading = index < 6 ? 'eager' : 'lazy';
  visual.append(img);
  return visual;
}

function linksFor(item) {
  const el = document.createElement('div'); el.className = 'card-links';
  for (const [label,url] of item.links || []) {
    const a = document.createElement('a'); a.className = 'external-link'; a.href = url;
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.textContent = label;
    const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden','true');
    a.append(arrow); el.append(a);
  }
  return el;
}

function createCard(item,index) {
  const card = document.createElement('article'); card.className = 'card'; card.id = `card-${item.id}`;
  const inner = document.createElement('div'); inner.className = 'card-inner';
  const visual = media(item,index);
  const cardCaption = caption(item);
  if (item.group !== 'community') {
    const primary = document.createElement('a'); primary.className = 'card-main-link';
    primary.href = item.links?.[0]?.[1] || item.image;
    primary.target = '_blank'; primary.rel = 'noopener noreferrer';
    if (visual) primary.append(visual);
    primary.append(cardCaption);
    inner.append(primary);
  } else {
    if (visual) inner.append(visual);
    inner.append(cardCaption);
  }
  if (item.description) {
    const description = document.createElement('p'); description.className = 'card-description'; description.textContent = item.description;
    inner.append(description);
  }
  inner.append(linksFor(item));
  card.append(inner);
  resizeObserver.observe(inner);
  return card;
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileViewport = window.matchMedia('(max-width: 700px)');
const mobileMenu = $('.mobile-menu-toggle');
const socialFooter = $('#site-socials');
function placeSocialFooter() {
  (mobileViewport.matches ? document.body : $('.sidebar')).append(socialFooter);
}
function setMobileMenu(open) {
  $('.sidebar').dataset.menuOpen = String(open);
  mobileMenu.setAttribute('aria-expanded',String(open));
  mobileMenu.setAttribute('aria-label',open ? 'Close menu' : 'Open menu');
  mobileMenu.querySelector('path').setAttribute('d',open ? 'm5 5 10 10M5 15 15 5' : 'M3 7h14M3 13h14');
}
mobileMenu.addEventListener('click',() => setMobileMenu(mobileMenu.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown',event => {
  if (event.key === 'Escape' && mobileViewport.matches && mobileMenu.getAttribute('aria-expanded') === 'true') {
    setMobileMenu(false);
    mobileMenu.focus();
  }
});
mobileViewport.addEventListener('change',() => {
  setMobileMenu(false);
  placeSocialFooter();
  if (!mobileViewport.matches && document.activeElement === mobileMenu) $('.name').focus();
  if (currentSection) {
    renderSection(currentSection);
    route();
  }
});
document.querySelectorAll('.nav-link, .name').forEach(link => {
  link.addEventListener('click',event => {
    if (!mobileViewport.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMobileMenu(false);
    $('#main').focus({preventScroll:true});
  });
});
let pageAnimation;

function renderSection(section) {
  const changingPage = Boolean(currentSection);
  pageAnimation?.cancel();
  currentSection = section;
  visibleItems = sectionItems(section);
  $('#home-intro').hidden = section !== 'home';
  $('#portfolio').hidden = section === 'home';
  $('#writing-blogs').hidden = section !== 'writing';
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.section === section;
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  gallery.querySelectorAll('.card-inner').forEach(el => resizeObserver.unobserve(el));
  gallery.dataset.section = section;
  if (section === 'work') {
    let cardIndex = 0;
    gallery.replaceChildren(...workGroups.map(group => {
      const block = document.createElement('section'); block.className = 'work-group';
      block.id = `work-${group.id}`; block.dataset.group = group.id;
      const heading = document.createElement('h2'); heading.className = 'work-group-title';
      heading.id = `${block.id}-title`; heading.textContent = group.title;
      block.setAttribute('aria-labelledby',heading.id);
      const grid = document.createElement('div'); grid.className = 'work-grid';
      grid.append(...group.items.map(id => createCard(visibleItems.find(item => item.id === id),cardIndex++)));
      block.append(heading,grid);
      return block;
    }));
  } else {
    gallery.replaceChildren(...visibleItems.map(createCard));
  }
  $('.gallery-heading').classList.toggle('sr-only',section === 'work');
  $('#section-title').textContent = sections[section];
  $('#item-count').textContent = String(visibleItems.length).padStart(2,'0');
  $('#gallery-status').textContent = section === 'home' ? 'About Eda' : `${sections[section]}, ${visibleItems.length} items`;
  document.title = section === 'home' ? 'Eda Akturk' : `${sections[section]} — Eda Akturk`;
  if (changingPage && !reducedMotion.matches) {
    const content = section === 'home' ? $('#home-intro') : $('#portfolio');
    pageAnimation = content.animate(
      [{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:360,easing:'cubic-bezier(.22,1,.36,1)'}
    );
  }
  layout();
}

function route() {
  if (mobileViewport.matches) setMobileMenu(false);
  let [section,id] = location.hash.slice(1).split('/');
  if (section === 'main') return; // Let the skip link move keyboard focus to main.
  if (section === 'talks' || section === 'other-work') section = 'work';
  if (section === 'photos') section = 'events';
  if (section === 'judging') { section = 'work'; id = 'judging'; }
  if (!Object.hasOwn(sections,section)) section = 'home';
  if (section !== currentSection) { renderSection(section); window.scrollTo({top:0,behavior:'instant'}); }
  if (id && visibleItems.some(item => item.id === id)) {
    const routedHash = location.hash;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (location.hash === routedHash) document.getElementById(`card-${id}`)?.scrollIntoView({block:'nearest',behavior:'instant'});
    }));
  }
}

window.addEventListener('hashchange',route);
document.fonts.ready.then(layout);
placeSocialFooter();
route();

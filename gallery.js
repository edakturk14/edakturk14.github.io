'use strict';

// Content and links retained from the existing portfolio. Cover sources are in ASSET-SOURCES.md.
const items = [
  {id:'grok-bot',section:'writing',publishedAt:'2026-09-16',title:'Building a company in 3 days with Grok Bot',meta:'Marketing & AI · 2026',image:'assets/cover-grok-bot.png',alt:'Grok Bot Galaxy cover with colorful characters on a black background',description:'Three people, three days, and a company built live. A few thoughts on Grok Bot Galaxy.',links:[['Read the post','https://edatweets.substack.com/p/building-a-company-in-3-days-with']]},
  {id:'jev',section:'writing',publishedAt:'2026-10-06',title:'JEV for everyone else',meta:'Technical explainer · AI',image:'assets/cover-jev-diagram.png',fit:'contain',alt:'Diagram comparing JEV’s System 1 model, which returns choices, scores, and noul, with System 2 models that return text',description:'A plain-English introduction to JEV: what it is, how it makes decisions, and what you can build with it.',links:[['Read the post','https://edatweets.substack.com/p/jev-for-everyone-else']]},
  {id:'free-hat',section:'writing',publishedAt:'2025-10-05',title:'2 Hours in Line for a Free Hat',meta:'Marketing & culture · 2025',image:'assets/claude-hats.png',alt:'Claude’s pop-up at the Air Mail café, with a bicycle outside',ratio:.88,description:'A few thoughts on the Claude pop-up, the people in line, and what makes us want to be part of something.',links:[['Read the post','https://edatweets.substack.com/p/2-hours-in-line-for-a-free-hat']]},
  {id:'ethcc-intents',section:'talks',title:'A Beginner’s Guide to Intents & the Open Intents Framework',meta:'Speaker · ETHCC, Cannes · 2025',image:'assets/talk-intents.jpg',alt:'Video thumbnail for A Beginner’s Guide to Intents and the Open Intents Framework',ratio:1.7778,description:'An introduction to intents and the Open Intents Framework, presented at ETHCC in Cannes. Recording published July 2, 2025.',links:[['Watch the talk','https://www.youtube.com/watch?v=-nKZEl3M9oY']]},
  {id:'batches',section:'other-work',title:'BuidlGuidl Batches',meta:'Developer education · BuidlGuidl',image:'assets/cover-batches.png',alt:'BuidlGuidl illustration of builders in an Ethereum landscape',ratio:1.1,description:'Launched a cohort-based program helping Ethereum developers contribute to open source and build apps together while I was part of the BuidlGuidl core team.',links:[['Explore the batches','https://buidlguidl.com/batches']]},
  {id:'lovable',section:'writing',publishedAt:'2026-04-05',title:'On Lovable',meta:'Marketing & growth · 2026',image:'assets/cover-lovable.png',alt:'Lovable in numbers, an image from the article',ratio:1.17,description:'Thinking about Lovable’s growth, distribution, and the people who use it. What happens when the audience comes before the product?',links:[['Read the post','https://edatweets.substack.com/p/on-lovable']]},
  {id:'ethgunu',section:'other-work',title:'ETHGünü',meta:'Core organizer · Istanbul · 2023',image:'assets/g-fireside.jpg',alt:'Fireside chat with Aya Miyaguchi at ETHGünü in Istanbul',ratio:1.1,description:'I was one of the core organizers of ETHGünü, a day of Ethereum talks and workshops for the Turkish community during Devconnect Istanbul in 2023. I also hosted a fireside chat with Aya Miyaguchi.',links:[['Visit ETHGünü','https://ethgunu.com/en/'],['Watch the fireside chat','https://streameth.org/watch/65b8f8cea5b2d09b88ec1055']]},
  {id:'ef-grant',section:'other-work',title:'Ethereum Foundation grant',meta:'Technical education',image:'assets/ef-garden.png',alt:'Ethereum Foundation illustration of an Ethereum diamond in a forest garden',description:'Received a grant from the Ethereum Foundation to create technical educational content. I also gave workshops about Ethereum at major Ethereum events.',links:[]},
  {id:'brussels',section:'events',title:'Workshop in Brussels',meta:'Brussels · 2024',image:'assets/g-workshop.jpg',alt:'Eda leading a developer workshop in Brussels',ratio:1.13,description:'Leading a developer workshop in Brussels, 2024.'},
  {id:'intents-guide',section:'writing',publishedAt:'2025-02-24',title:'A Developer’s Guide to Intents',meta:'Technical explainer · 2025',image:'assets/cover-intents.png',alt:'Cover of A Developer’s Guide to Intents and the Open Intents Framework',ratio:1.2,description:'A developer’s introduction to intents and the Open Intents Framework.',links:[['Read the guide','https://paragraph.com/@edatweets/a-developer-s-guide-to-intents-the-open-intents-framework']]},
  {id:'buenos-aires',section:'events',title:'Devconnect, Buenos Aires',meta:'Buenos Aires · 2025',image:'assets/g-argentina.jpg',alt:'At Devconnect in Buenos Aires',ratio:.9,description:'A moment from Devconnect in Buenos Aires, 2025.'},
  {id:'hyperlane-guide',section:'writing',publishedAt:'2024-12-02',title:'A Developer’s Guide to Interoperability with Hyperlane',meta:'Technical explainer · 2024',image:'assets/cover-hyperlane.png',alt:'Cover of A Developer’s Guide to Interoperability with Hyperlane',ratio:1.2,description:'A guide to understanding interoperability and getting started with Hyperlane.',links:[['Read the guide','https://paragraph.com/@edatweets/a-developer-s-guide-to-interoperability-with-hyperlane']]},
  {id:'web2-web3',section:'talks',title:'Web2 to Web3: Building on Ethereum',meta:'Workshop instructor · 2022',image:'assets/talk-web3.jpg',alt:'Video thumbnail for the Web2 to Web3 workshop',ratio:1.2,description:'A guide to building on Ethereum, for developers making the move from Web2 to Web3.',links:[['Watch the workshop','https://www.youtube.com/watch?v=zuJ-elbo88E']]},
  {id:'judging',section:'other-work',title:'Hackathon judging',meta:'Tokyo · Istanbul · Seoul',image:'assets/ethglobal-tokyo.jpg',alt:'Official ETHGlobal Tokyo artwork showing a nighttime street with Ethereum neon signs',description:'Judging at ETHGlobal Tokyo (April 14–16, 2023), ETHGlobal Istanbul (November 17–19, 2023), and ETH Seoul (March 29–31, 2024).',links:[['ETHGlobal Tokyo','https://ethglobal.com/events/tokyo'],['ETHGlobal Istanbul','https://ethglobal.com/events/istanbul'],['ETH Seoul','https://www.ethseoul.org/ethseoul2024.html']]},
  {id:'zk-guide',section:'writing',publishedAt:'2023-12-04',title:'Zero-Knowledge Proofs in Plain English',meta:'Cryptography · 2023',image:'assets/cover-zk.png',alt:'Cover of Zero-Knowledge Proofs in Plain English',ratio:1.15,description:'Making zero-knowledge proofs a little easier to understand, in plain English.',links:[['Read the post','https://paragraph.com/@edatweets/zero-knowledge-proofs-in-plain-english']]},
  {id:'seoul-workshop',section:'talks',title:'Building Dapps on Ethereum with ScaffoldETHv2',meta:'Workshop instructor · ETH Seoul · 2024',image:'assets/talk-seoul.jpg',alt:'Video thumbnail for Eda Akturk’s Building Dapps on Ethereum with ScaffoldETHv2 workshop at ETH Seoul 2024',description:'A workshop on building Ethereum applications with Scaffold-ETH v2 at ETH Seoul, March 29–31, 2024.',links:[['Watch the workshop','https://www.youtube.com/watch?v=FYuDggnYpFA&t=72s']]},
  {id:'builder-show',section:'talks',title:'The Builder Show with Austin Griffith',meta:'Podcast co-host · 2024',image:'assets/talk-builder.jpg',alt:'The Builder Show episode with Austin Griffith and Eda',ratio:1.2,description:'Co-hosting The Builder Show with Austin Griffith. This episode covers getting a job in Web3 and crypto with Harper and Alec.',links:[['Watch the episode','https://www.youtube.com/watch?v=cPNrYKR9rtI']]},
  {id:'100-days',section:'other-work',title:'100 Days of Web3',meta:'Learning in public',image:'eda-akturk.jpeg',alt:'Eda Akturk',ratio:.88,description:'Documented my journey learning and building with blockchains through blog posts and X (formerly Twitter). The challenge that started my career in crypto.',links:[['Read the blog post','https://eda.hashnode.dev/my-web3-journey-day-100-of-100daysofweb3'],['See the thread','https://x.com/edatweets_/status/1483040244530393090']]},
  {id:'cryptist',section:'events',title:'Cryptist, Istanbul',meta:'Istanbul · 2022',image:'assets/g-cryptist.jpg',alt:'Group photo at Cryptist in Istanbul',ratio:1.2,description:'The group at Cryptist in Istanbul, 2022.'},
  {id:'ctf',section:'events',title:'BuidlGuidl CTF at Devcon SEA',meta:'Devcon SEA · 2024',image:'assets/g-ctf.jpg',alt:'BuidlGuidl CTF crew at Devcon SEA',ratio:1.05,description:'With the BuidlGuidl CTF crew at Devcon SEA, 2024.'},
  {id:'volunteers',section:'events',title:'The ETHGünü crew',meta:'Istanbul · 2023',image:'assets/g-team.jpg',alt:'ETHGünü volunteers together on stage',ratio:1.25,description:'ETHGünü volunteers on stage in Istanbul, 2023.'},
  {id:'ethgunu-stage',section:'events',title:'ETHGünü',meta:'Istanbul · 2023',image:'assets/talk-ethgunu.jpg',alt:'Eda presenting at ETHGünü',ratio:.9,description:'Presenting at ETHGünü in Istanbul, 2023.'},
  {id:'fireside',section:'events',title:'A conversation with Aya Miyaguchi',meta:'ETHGünü, Istanbul · 2023',image:'assets/g-fireside.jpg',alt:'Eda hosting a fireside chat with Aya Miyaguchi',ratio:1.2,description:'Hosting a fireside chat with Aya Miyaguchi at ETHGünü, 2023.',links:[['Watch the conversation','https://streameth.org/watch/65b8f8cea5b2d09b88ec1055']]},
  {id:'cannes',section:'events',title:'ETHCC, Cannes',meta:'Cannes · 2025',image:'assets/talk-cannes.jpg',alt:'Eda speaking at ETHCC in Cannes',ratio:.8,description:'Speaking at ETHCC in Cannes, 2025.'}
];
const sections = {home:'About Me',writing:'Selected writing',talks:'Selected Talks and Workshops','other-work':'Other projects',events:'Events'};
// Keep gallery cards and sidebar links in the same publication-date order.
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
  const title = document.createElement('h2'); title.textContent = item.title;
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
  const description = document.createElement('p'); description.className = 'card-description'; description.textContent = item.description;
  const hasDisclosure = !mobileViewport.matches && item.section !== 'other-work' && Boolean(visual);
  if (hasDisclosure) {
    const details = document.createElement('details'); details.dataset.item = item.id;
    const summary = document.createElement('summary');
    const cardCaption = caption(item);
    const indicator = document.createElement('span'); indicator.className = 'expand-indicator'; indicator.setAttribute('aria-hidden','true');
    cardCaption.append(indicator);
    summary.append(visual,cardCaption);
    details.append(summary,description);
    details.addEventListener('toggle',() => {
      if (!details.isConnected) return;
      // Keep direct links and Back navigation aligned with native inline disclosures.
      if (details.open) {
        gallery.querySelectorAll('details[open]').forEach(other => { if (other !== details) other.open = false; });
        history.replaceState(null,'',`#${currentSection}/${item.id}`);
      } else if (location.hash === `#${currentSection}/${item.id}`) {
        history.replaceState(null,'',`#${currentSection}`);
      }
      updateActiveItem();
      layout();
    });
    inner.append(details);
  } else {
    if (visual) inner.append(visual);
    else card.classList.add('text-card');
    inner.append(caption(item),description);
  }
  inner.append(linksFor(item));
  card.append(inner);
  resizeObserver.observe(inner);
  return card;
}

function updateActiveItem() {
  const id = location.hash.slice(1).split('/')[1];
  document.querySelectorAll('.subnav a').forEach(a => a.classList.toggle('active',a.dataset.item === id));
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
const menuAnimations = new WeakMap();
let pageAnimation;

function setMenuExpanded(button, expanded) {
  if ((button.getAttribute('aria-expanded') === 'true') === expanded) return;
  const list = document.getElementById(button.getAttribute('aria-controls'));
  const hidden = list.hidden;
  const style = getComputedStyle(list);
  const start = {
    height: hidden ? '0px' : `${list.getBoundingClientRect().height}px`,
    marginTop: hidden ? '0px' : style.marginTop,
    marginBottom: hidden ? '0px' : style.marginBottom,
    opacity: hidden ? 0 : style.opacity
  };
  menuAnimations.get(list)?.cancel();
  button.setAttribute('aria-expanded',String(expanded));
  list.inert = !expanded;
  list.hidden = false;
  list.style.overflow = '';
  if (reducedMotion.matches) {
    list.hidden = !expanded;
    return;
  }
  const natural = getComputedStyle(list);
  const end = expanded ? {
    height: `${list.getBoundingClientRect().height}px`,
    marginTop: natural.marginTop,
    marginBottom: natural.marginBottom,
    opacity: 1
  } : {height:'0px',marginTop:'0px',marginBottom:'0px',opacity:0};
  list.style.overflow = 'hidden';
  const animation = list.animate([start,end],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'});
  menuAnimations.set(list,animation);
  animation.onfinish = () => {
    list.hidden = !expanded;
    list.style.overflow = '';
    menuAnimations.delete(list);
  };
}

function renderSection(section) {
  const changingPage = Boolean(currentSection);
  pageAnimation?.cancel();
  currentSection = section;
  visibleItems = sectionItems(section);
  $('#home-intro').hidden = section !== 'home';
  $('#portfolio').hidden = section === 'home';
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.section === section;
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.nav-toggle').forEach(button => {
    if (button.dataset.section !== section) {
      setMenuExpanded(button,false);
    }
  });
  gallery.querySelectorAll('.card-inner').forEach(el => resizeObserver.unobserve(el));
  gallery.dataset.section = section;
  gallery.replaceChildren(...visibleItems.map(createCard));
  $('#section-title').textContent = sections[section];
  $('#item-count').textContent = String(visibleItems.length).padStart(2,'0');
  $('#gallery-status').textContent = section === 'home' ? 'About Eda' : `${sections[section]}, ${visibleItems.length} items`;
  document.title = section === 'home' ? 'Eda Akturk' : `${sections[section]} — Eda Akturk`;
  if (changingPage && !reducedMotion.matches) {
    const content = section === 'home' ? $('#home-intro') : $('#portfolio');
    pageAnimation = content.animate([{opacity:.45},{opacity:1}],{duration:160,easing:'ease-out'});
  }
  layout();
}

function route() {
  if (mobileViewport.matches) setMobileMenu(false);
  let [section,id] = location.hash.slice(1).split('/');
  if (section === 'main') return; // Let the skip link move keyboard focus to main.
  if (section === 'work') section = 'writing';
  if (section === 'photos') section = 'events';
  if (section === 'judging') { section = 'other-work'; id = 'judging'; }
  if (!Object.hasOwn(sections,section)) section = 'home';
  if (section !== currentSection) { renderSection(section); window.scrollTo({top:0,behavior:'instant'}); }
  gallery.querySelectorAll('details').forEach(details => { details.open = details.dataset.item === id; });
  updateActiveItem();
  if (id && visibleItems.some(item => item.id === id)) {
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`card-${id}`).scrollIntoView({block:'nearest',behavior:'instant'})));
  }
}

for (const section of ['writing','talks','other-work']) {
  const list = document.getElementById(`${section}-links`);
  for (const item of sectionItems(section)) {
    const li = document.createElement('li'); const a = document.createElement('a');
    a.href = `#${section}/${item.id}`; a.dataset.item = item.id; a.textContent = item.title;
    li.append(a); list.append(li);
  }
}

document.querySelectorAll('.nav-row .nav-link').forEach(link => {
  link.addEventListener('click',event => {
    if (mobileViewport.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const button = link.parentElement.querySelector('.nav-toggle');
    setMenuExpanded(button,true);
  });
});

document.querySelectorAll('.nav-toggle').forEach(button => {
  button.addEventListener('click',() => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    setMenuExpanded(button,!expanded);
  });
});
window.addEventListener('hashchange',route);
document.fonts.ready.then(layout);
placeSocialFooter();
route();

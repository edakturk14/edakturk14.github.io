const stops = {
  phoenix: {number:'01', alt:'A sage-green car on a desert road outside Phoenix at sunrise.', coordinates:'33.4484° N, 112.0740° W', state:'ARIZONA'},
  sedona: {number:'02', alt:'Two travelers seen through the windshield, driving between the red rock formations of Sedona.', coordinates:'34.8697° N, 111.7610° W', state:'ARIZONA'},
  'grand-canyon': {number:'03', alt:'Two tiny travelers at the rim of the Grand Canyon, above layered terracotta cliffs and the river far below.', coordinates:'36.0544° N, 112.1401° W', state:'ARIZONA'},
  page: {number:'04', alt:'Two travelers walking between the flowing orange sandstone walls of Antelope Canyon.', coordinates:'36.8620° N, 111.3743° W', state:'ARIZONA'},
  bryce: {number:'05', alt:'A windshield view of the soft pink hoodoo spires of Bryce Canyon.', coordinates:'37.5930° N, 112.1871° W', state:'UTAH'},
  zion: {number:'06', alt:'A small sage-green car crossing Zion beneath towering sandstone cliffs beside the Virgin River.', coordinates:'37.2982° N, 113.0263° W', state:'UTAH'},
  vegas: {number:'07', alt:'A small rental car approaching the softly glowing Las Vegas skyline at night.', coordinates:'36.1716° N, 115.1391° W', state:'NEVADA'}
};

const image = document.querySelector('#stop-image');
const details = [...document.querySelectorAll('.stop')];
for (const detail of details) {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    for (const other of details) if (other !== detail) other.open = false;
    const key = detail.dataset.stop;
    const stop = stops[key];
    image.src = `assets/${key}.webp`;
    image.alt = stop.alt;
    document.querySelector('#art-number').textContent = stop.number;
    document.querySelector('#art-caption').textContent = stop.coordinates;
    document.querySelector('#art-state').textContent = stop.state;
  });
}

// Load the other paintings quietly after the first page has finished rendering.
window.addEventListener('load', () => {
  const preload = () => Object.keys(stops).forEach(key => { new Image().src = `assets/${key}.webp`; });
  if ('requestIdleCallback' in window) window.requestIdleCallback(preload);
  else window.setTimeout(preload, 1200);
});

const dialog = document.querySelector('#film-dialog');
const film = document.querySelector('#film');
let filmTrigger;
document.querySelectorAll('[data-film]').forEach(button => button.addEventListener('click', () => {
  filmTrigger = button;
  dialog.showModal();
  document.body.classList.add('film-open');
  film.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
}));
document.querySelector('#close-film').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  film.pause();
  document.body.classList.remove('film-open');
  filmTrigger?.focus({preventScroll:true});
});

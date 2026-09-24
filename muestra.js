const tracks = [
  { title: 'boom bap', genre: 'Trap', bpm: '91 BPM', price: '€19', audio: 'beats-venta/previews-45s/mp3/boom%20bap_45s.mp3', colors: ['#2d2140', '#11131b'] },
  { title: 'BUCLE', genre: 'R&B', bpm: '89 BPM', price: '€25', audio: 'beats-venta/previews-45s/mp3/BUCLE_45s.mp3', colors: ['#422b3c', '#17121d'] },
  { title: 'EL TIEMPO', genre: 'Hip Hop', bpm: '91 BPM', price: '€21', audio: 'beats-venta/previews-45s/mp3/EL%20TIEMPO_45s.mp3', colors: ['#263a36', '#10191b'] },
  { title: 'encontrarme', genre: 'Drill', bpm: '89 BPM', price: '€29', audio: 'beats-venta/previews-45s/mp3/encontrarme_45s.mp3', colors: ['#382432', '#15121b'] },
  { title: 'Project 16 - TIKTOK BOOM BAP 2', genre: 'Trap', bpm: '85 BPM', price: '€22', audio: 'beats-venta/previews-45s/mp3/Project_16%20-%20TIKTOK%20BOOM%20BAP%202_45s.mp3', colors: ['#34254b', '#11121c'] },
  { title: 'tiktok2', genre: 'R&B', bpm: '91 BPM', price: '€27', audio: 'beats-venta/previews-45s/mp3/tiktok2_45s.mp3', colors: ['#27334a', '#10141c'] }
];

const grid = document.getElementById('beatGrid');
const searchInput = document.getElementById('searchInput');
const audio = new Audio();
const nowTitle = document.getElementById('nowTitle');
const nowMeta = document.getElementById('nowMeta');
const toggle = document.getElementById('toggle');
const progress = document.querySelector('#progress span');
const volume = document.getElementById('volume');
let activeIndex = 0;
let activeFilter = 'all';

function icon(name, size = 16) {
  return `<i data-lucide="${name}" width="${size}"></i>`;
}

function setIcon(name) {
  toggle.innerHTML = icon(name, 15);
  lucide.createIcons();
}

function selectTrack(index, autoPlay = true) {
  activeIndex = (index + tracks.length) % tracks.length;
  const track = tracks[activeIndex];
  nowTitle.textContent = track.title;
  nowMeta.textContent = `NEGATIVO FILMS · ${track.bpm}`;
  audio.src = new URL(track.audio, window.location.href).href;
  audio.load();
  if (autoPlay) audio.play().catch(() => {});
}

function matches(track) {
  const term = searchInput.value.trim().toLowerCase();
  const genreMatch = activeFilter === 'all' || track.genre === activeFilter;
  const searchMatch = !term || track.title.toLowerCase().includes(term) || track.genre.toLowerCase().includes(term);
  return genreMatch && searchMatch;
}

function renderTracks() {
  grid.innerHTML = tracks.map((track, index) => `
    <article class="beat-card${matches(track) ? '' : ' hidden'}">
      <div class="cover" style="--a:${track.colors[0]};--b:${track.colors[1]};">
        <span class="bpm">${track.bpm}</span>
        <button class="play" type="button" data-index="${index}" aria-label="Reproducir ${track.title}">${icon('play', 16)}</button>
      </div>
      <div class="card-body">
        <div class="card-top"><h3 class="card-title">${track.title}</h3><span class="price">${track.price}</span></div>
        <div class="card-meta"><span>${track.genre}</span><button class="buy" type="button" data-buy="${index}">Comprar ${icon('arrow-up-right', 13)}</button></div>
      </div>
    </article>
  `).join('');
  lucide.createIcons();

  grid.querySelectorAll('.play').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      if (index === activeIndex && !audio.paused) audio.pause();
      else selectTrack(index);
    });
  });

  grid.querySelectorAll('[data-buy]').forEach((button) => {
    button.addEventListener('click', () => {
      const track = tracks[Number(button.dataset.buy)];
      const text = encodeURIComponent(`Hola NEGATIVO FILMS, quiero comprar la instrumental ${track.title}.`);
      window.open(`https://wa.me/573227200078?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  });
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
    renderTracks();
  });
});

searchInput.addEventListener('input', renderTracks);
volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
toggle.addEventListener('click', () => {
  if (!audio.src) selectTrack(activeIndex, false);
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
});
document.getElementById('previous').addEventListener('click', () => selectTrack(activeIndex - 1));
document.getElementById('next').addEventListener('click', () => selectTrack(activeIndex + 1));
document.getElementById('progress').addEventListener('click', (event) => {
  if (!audio.duration) return;
  audio.currentTime = (event.offsetX / event.currentTarget.clientWidth) * audio.duration;
});
audio.addEventListener('play', () => setIcon('pause'));
audio.addEventListener('pause', () => setIcon('play'));
audio.addEventListener('ended', () => selectTrack(activeIndex + 1));
audio.addEventListener('timeupdate', () => {
  progress.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100}%` : '0%';
});

audio.volume = Number(volume.value) / 100;
renderTracks();
lucide.createIcons();

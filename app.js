lucide.createIcons();

const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playMain = document.querySelector('.play-main');
const countBeats = document.getElementById('countBeats');
const filterButtons = document.querySelectorAll('.pill');
const beatCards = document.querySelectorAll('.beat-card');
const playerAudio = new Audio();
playerAudio.preload = 'auto';
const volumeInput = document.querySelector('input[type="range"]');
const previousButton = document.querySelector('.player-controls .icon-btn:first-child');
const nextButton = document.querySelector('.player-controls .icon-btn:last-child');
const timeline = document.querySelector('.timeline');
const timelineProgress = document.querySelector('.timeline span');
let currentCard = null;
let isPlaying = false;

function setPlayIcon(isActive) {
  playMain.innerHTML = `<i data-lucide="${isActive ? 'pause' : 'play'}" width="15" fill="currentColor"></i>`;
  lucide.createIcons();
}

function loadTrack(card) {
  if (!card) return;
  currentCard = card;
  const title = card.dataset.title;
  const artist = card.dataset.artist;
  const bpm = card.dataset.bpm;

  playerTitle.textContent = title;
  playerArtist.textContent = `${artist} • ${bpm}`;

  if (card.dataset.audio) {
    const trackUrl = new URL(card.dataset.audio, window.location.href).href;
    playerAudio.src = trackUrl;
    playerAudio.load();
    playerAudio.currentTime = 0;
  }
}

volumeInput.addEventListener('input', (event) => {
  playerAudio.volume = Number(event.target.value) / 100;
});

playerAudio.volume = Number(volumeInput.value) / 100;

playerAudio.addEventListener('play', () => {
  isPlaying = true;
  setPlayIcon(true);
});

playerAudio.addEventListener('pause', () => {
  isPlaying = false;
  setPlayIcon(false);
});

playerAudio.addEventListener('ended', () => {
  playRelative(1);
});

playerAudio.addEventListener('timeupdate', () => {
  if (playerAudio.duration) {
    timelineProgress.style.width = `${(playerAudio.currentTime / playerAudio.duration) * 100}%`;
  }
});

timeline.addEventListener('click', (event) => {
  if (!playerAudio.duration) return;
  const position = event.offsetX / timeline.clientWidth;
  playerAudio.currentTime = position * playerAudio.duration;
});

function playCard(card) {
  if (!card) return;
  loadTrack(card);
  playerAudio.play().catch(() => {});
}

function playRelative(direction) {
  const currentIndex = Array.from(beatCards).indexOf(currentCard);
  const nextIndex = currentIndex < 0
    ? 0
    : (currentIndex + direction + beatCards.length) % beatCards.length;
  playCard(beatCards[nextIndex]);
}

function applyFilter(selected) {
  let visible = 0;
  beatCards.forEach((card) => {
    const match = selected === 'all' || card.dataset.genre === selected;
    card.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  countBeats.textContent = `${visible} instrumental${visible !== 1 ? 'es' : ''} disponible${visible !== 1 ? 's' : ''}`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    applyFilter(button.dataset.filter);
  });
});

document.querySelectorAll('.play-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.beat-card');
    if (card === currentCard && !playerAudio.paused) {
      playerAudio.pause();
    } else {
      playCard(card);
    }
  });
});

document.querySelectorAll('.tiny-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const icon = button.querySelector('svg');
    if (icon) {
      button.style.borderColor = 'rgba(217,179,104,0.5)';
      button.style.color = '#f3d9a0';
    }

    if (button.getAttribute('aria-label') === 'Comprar') {
      const card = button.closest('.beat-card');
      const message = encodeURIComponent(`Hola NEGATIVO FILMS, quiero comprar la instrumental ${card.dataset.title}.`);
      window.open(`https://wa.me/573227200078?text=${message}`, '_blank', 'noopener,noreferrer');
    }
  });
});

playMain.addEventListener('click', () => {
  if (!currentCard) {
    currentCard = document.querySelector('.beat-card');
  }

  if (!currentCard) return;

  if (playerAudio.paused) {
    if (!playerAudio.src) loadTrack(currentCard);
    playerAudio.play().catch(() => {});
  } else {
    playerAudio.pause();
  }
});

previousButton.addEventListener('click', () => playRelative(-1));
nextButton.addEventListener('click', () => playRelative(1));

const initialCard = document.querySelector('.beat-card');
if (initialCard) {
  const title = initialCard.dataset.title;
  const artist = initialCard.dataset.artist;
  const bpm = initialCard.dataset.bpm;
  playerTitle.textContent = title;
  playerArtist.textContent = `${artist} • ${bpm}`;
  currentCard = initialCard;
}
applyFilter('all');

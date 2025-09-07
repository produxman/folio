// folio-hero.js
// Card stack carousel logic for hero section
// (see index.html for markup, folio-hero.css for styles)

document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('heroStackTrack');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.switch-card'));
  const btnPrev = document.getElementById('heroBtnPrev');
  const btnNext = document.getElementById('heroBtnNext');
  let current = 0;
  let autoPlayInterval;
  let isAutoPlaying = true;

  function render() {
    const total = cards.length;
    cards.forEach((card, i) => {
      card.classList.remove('active','left-1','left-2','right-1','right-2');
      let offset = (i - current);
      if (offset > 2) offset -= total;
      if (offset < -2) offset += total;
      if (offset === 0) card.classList.add('active');
      else if (offset === -1) card.classList.add('left-1');
      else if (offset === -2) card.classList.add('left-2');
      else if (offset === 1) card.classList.add('right-1');
      else if (offset === 2) card.classList.add('right-2');
      else {
        card.style.transform = 'translate(-50%,-50%) translateZ(-160px) scale(.9)';
        card.style.opacity = '.15';
        card.style.zIndex = 1;
        return;
      }
      card.style.transform = '';
      card.style.opacity = '';
      card.style.zIndex = '';
    });
  }

  function next(){
    current = (current + 1) % cards.length;
    render();
  }

  function prev(){
    current = (current - 1 + cards.length) % cards.length;
    render();
  }

  function startAutoPlay() {
    if (isAutoPlaying && !autoPlayInterval) {
      autoPlayInterval = setInterval(next, 5000); // Auto cycle every 5 seconds
    }
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    setTimeout(startAutoPlay, 3000); // Resume auto-play after 3 seconds of inactivity
  }

  btnNext.addEventListener('click', () => {
    next();
    restartAutoPlay();
  });

  btnPrev.addEventListener('click', () => {
    prev();
    restartAutoPlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      next();
      restartAutoPlay();
    }
    if (e.key === 'ArrowLeft') {
      prev();
      restartAutoPlay();
    }
  });
  // Touch navigation
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  function handleSwipe() {
    if (touchEndX < touchStartX - swipeThreshold) {
      next();
      restartAutoPlay();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prev();
      restartAutoPlay();
    }
  }

  // Pause auto-play when user hovers over the carousel
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);

  // Initialize
  render();
  startAutoPlay();
});

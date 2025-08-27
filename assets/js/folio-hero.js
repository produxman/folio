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
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
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
    if (touchEndX < touchStartX - swipeThreshold) next();
    if (touchEndX > touchStartX + swipeThreshold) prev();
  }
  render();
});

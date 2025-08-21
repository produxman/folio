// Year in footer
document.getElementById('y').textContent = new Date().getFullYear();

// Fade-in on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach(el => {
    setTimeout(() => el.classList.add('show'), 200);
  });
});

// Filtering
const buttons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.card');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const company = btn.dataset.filter;
    cards.forEach(card => {
      card.style.display = (company === 'all' || card.dataset.company === company) ? 'block' : 'none';
    });
  });
});

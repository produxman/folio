// YEAR
document.getElementById('year').textContent = new Date().getFullYear();

// THEME TOGGLE (remembers choice)
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? '' : 'light';
  if (next) document.documentElement.setAttribute('data-theme', next);
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', next);
});

// PROJECT DATA (per company)
const PROJECTS = {
  Meister: [
    { title: 'Billing Re-architecture', desc: 'Service-oriented billing; projected +12% ARR uplift', cover: 'assets/img/work/meister-billing.webp', href: '#' },
    { title: 'AI Monetization', desc: '0→1 pricing & packaging for Meister AI', cover: 'assets/img/work/meister-ai.webp', href: '#' },
    { title: 'Accounts UX Modernization', desc: 'Self-serve surfaces for enterprise scale', cover: 'assets/img/work/meister-accounts.webp', href: '#' },
  ],
  Pelcro: [
    { title: 'Campaign Builder', desc: '+20% conversions via segmentation & automation', cover: 'assets/img/work/pelcro-campaign.webp', href: '#' },
    { title: 'WorldPay Integration', desc: 'Expanded payments coverage', cover: 'assets/img/work/pelcro-worldpay.webp', href: '#' },
    { title: 'Fraud Prevention', desc: '-40% fraudulent transactions at checkout', cover: 'assets/img/work/pelcro-fraud.webp', href: '#' },
  ],
  Dell: [
    { title: 'PowerProtect Sizer', desc: 'Workload-driven sizing tool; +10% upsell', cover: 'assets/img/work/dell-pps.webp', href: '#' },
  ],
  Zyda: [
    { title: 'Deliverect Integration', desc: '+25% CSAT via POS & delivery sync', cover: 'assets/img/work/zyda-deliverect.webp', href: '#' },
    { title: 'Survv Integration', desc: '-10% CAC through regional POS onboarding', cover: 'assets/img/work/zyda-survv.webp', href: '#' },
  ],
  VeraSafe: [
    { title: 'Preava Prevent', desc: 'MVP for misdirection prevention', cover: 'assets/img/work/verasafe-preava.webp', href: '#' },
  ],
  CIB: [
    { title: 'Enterprise Backup System', desc: '-50% RTO, -30% data loss risk', cover: 'assets/img/work/cib-backup.webp', href: '#' },
  ],
  IBM: []
};

// RENDER projects for active company
const grid = document.getElementById('projectGrid');
const projectsTitle = document.getElementById('projectsTitle');

function renderProjects(company) {
  projectsTitle.textContent = `${company} — Projects`;
  grid.innerHTML = '';
  const items = PROJECTS[company] || [];
  if (!items.length) {
    grid.innerHTML = '<p class="muted">No public projects to show for this company yet.</p>';
    return;
  }
  items.forEach(p => {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = p.href || '#';
    a.innerHTML = `
      <div class="cover"><img src="${p.cover}" alt="${p.title}"></div>
      <div class="body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `;
    grid.appendChild(a);
  });
}

// TIMELINE interactivity (expand clicked; collapse others; load cards)
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
  item.addEventListener('click', () => {
    timelineItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    renderProjects(item.dataset.company);
  });
});

// Initial render = first (active) company
const firstActive = document.querySelector('.timeline-item.active')?.dataset.company || 'Meister';
renderProjects(firstActive);

// SCROLL-IN animation for timeline items (your snippet)
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); }),
  { threshold: 0.3 }
);
document.querySelectorAll('.timeline-item').forEach(el => io.observe(el));

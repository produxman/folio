// ===== Year + Theme =====
document.getElementById('year').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'light' ? '' : 'light';
  if (next) document.documentElement.setAttribute('data-theme', next);
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', next);
});



// ===== Projects data (cards link to GitHub markdown pages) =====
const PROJECTS = {
  Meister: [
    { title:'Billing Re-architecture', desc:'Service-oriented billing; projected +12% ARR uplift', cover:'assets/img/work/meister-billing.webp', href:'projects/meister-billing.md' },
    { title:'AI Monetization', desc:'0→1 pricing & packaging for Meister AI', cover:'assets/img/work/meister-ai.webp', href:'projects/meister-ai.md' },
    { title:'Accounts UX Modernization', desc:'Self-serve surfaces for enterprise scale', cover:'assets/img/work/meister-accounts.webp', href:'projects/meister-accounts.md' },
  ],
  Pelcro: [
    { title:'Campaign Builder', desc:'+20% conversions via segmentation & automation', cover:'assets/img/work/pelcro-campaign.webp', href:'projects/pelcro-campaign.md' },
    { title:'WorldPay Integration', desc:'Expanded payments coverage', cover:'assets/img/work/pelcro-worldpay.webp', href:'projects/pelcro-worldpay.md' },
    { title:'Fraud Prevention', desc:'-40% fraudulent transactions at checkout', cover:'assets/img/work/pelcro-fraud.webp', href:'projects/pelcro-fraud.md' },
  ],
  Dell: [
    { title:'PowerProtect Sizer', desc:'Workload-driven sizing tool; +10% upsell', cover:'assets/img/work/dell-pps.webp', href:'projects/dell-powerprotect-sizer.md' },
  ],
  Zyda: [
    { title:'Deliverect Integration', desc:'+25% CSAT via POS & delivery sync', cover:'assets/img/work/zyda-deliverect.webp', href:'projects/zyda-deliverect.md' },
    { title:'Survv Integration', desc:'-10% CAC through regional POS onboarding', cover:'assets/img/work/zyda-survv.webp', href:'projects/zyda-survv.md' },
  ],
  VeraSafe: [
    { title:'Preava Prevent', desc:'MVP for misdirection prevention', cover:'assets/img/work/verasafe-preava.webp', href:'projects/verasafe-preava.md' },
  ],
  CIB: [
    { title:'Enterprise Backup System', desc:'-50% RTO, -30% data loss risk', cover:'assets/img/work/cib-backup.webp', href:'projects/cib-enterprise-backup.md' },
  ],
  IBM: []
};

const grid = document.getElementById('projectGrid');
const title = document.getElementById('projectsTitle');

// Render helpers
function renderCards(company) {
  title.textContent = `${company} — Projects`;
  grid.innerHTML = '';
  const items = PROJECTS[company] || [];
  if (!items.length) {
    grid.innerHTML = `<p class="muted">No public projects to show for this company yet.</p>`;
    return;
  }
  items.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = p.href; // GitHub will render markdown pages nicely
    a.innerHTML = `
      <div class="cover"><img src="${p.cover}" alt="${p.title}"></div>
      <div class="body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `;
    grid.appendChild(a);
    // staggered reveal
    requestAnimationFrame(()=> setTimeout(()=> a.classList.add('show'), 60*i));
  });
}

// Timeline behavior (single-open accordion + project switching)
const tl = document.getElementById('wa-timeline');
if (tl) {
  tl.querySelectorAll('.wa-details').forEach(d => {
    // Ensure caret updates and single-open behavior
    d.addEventListener('toggle', () => {
      if (d.open) {
        // close others
        tl.querySelectorAll('.wa-details').forEach(o => { if (o!==d) o.open = false; });
        // update carets
        tl.querySelectorAll('.wa-details summary .wa-caret').forEach(c => c.textContent = '▸');
        d.querySelector('.wa-caret').textContent = '▾';
        // load projects
        renderCards(d.dataset.company);
      } else {
        d.querySelector('.wa-caret').textContent = '▸';
      }
    });
    // Make dot-btn click open the details (like clicking the card)
    const dotBtn = d.querySelector('.dot-btn');
    if (dotBtn) {
      dotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!d.open) {
          d.open = true;
        } else {
          // Optionally, scroll to the card if already open
          d.scrollIntoView({behavior:'smooth', block:'center'});
        }
      });
    }
  });
}

// Initial load: first open details
const first = tl?.querySelector('.wa-details[open]')?.dataset.company || 'Meister';
renderCards(first);

// ==== IntersectionObserver for “scroll-in” of each timeline node (your snippet spirit) ====
const nodes = document.querySelectorAll('.wa-details');
const observer = new IntersectionObserver(
  (entries)=> entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }),
  {threshold:.3}
);
nodes.forEach(n=>observer.observe(n));

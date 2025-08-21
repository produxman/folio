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
    { title:'Billing Engine Evolution', desc:'Service-oriented billing; projected +12% ARR uplift', cover:'assets/img/work/meister-billing.webp', href:'projects/meister-billingengine.md' },
    { title:'AI Monetization', desc:'0→1 pricing & packaging for Meister AI', cover:'assets/img/work/meister-ai.webp', href:'projects/meister-meisterai.md' },
    { title:'Accounts Design System', desc:'Self-serve surfaces for enterprise scale', cover:'assets/img/work/meister-accounts.webp', href:'projects/meister-accountsdesignsystem.md' },
  ],
  Pelcro: [
    { title:'Pelcro Automations', desc:'+20% conversions via segmentation & automation', cover:'assets/img/work/pelcro-automations.webp', href:'projects/pelcro-automations.md' },
    { title:'WorldPay Integration', desc:'Expanded payments coverage', cover:'assets/img/work/pelcro-worldpay.webp', href:'projects/pelcro-worldpay.md' },
    { title:'Braintree Integration', desc:'-40% fraudulent transactions at checkout', cover:'assets/img/work/pelcro-braintree.webp', href:'projects/pelcro-braintree.md' },
    { title:'Fraud Management Controls', desc:'-40% fraudulent transactions at checkout', cover:'assets/img/work/pelcro-fraudmanagement.webp', href:'projects/pelcro-fraudmanagement.md' },
  ],
  Dell: [
    { title:'PowerProtect Sizer', desc:'Workload-driven sizing tool; +10% upsell', cover:'assets/img/work/dell-powerprotectsizer.webp', href:'projects/dell-powerprotectsizer.md' },
  ],
  Zyda: [
    { title:'Deliverect Integration', desc:'+25% CSAT via POS & delivery sync', cover:'assets/img/work/zyda-deliverect.webp', href:'projects/zyda-deliverect.md' },
    { title:'Survv Integration', desc:'-10% CAC through regional POS onboarding', cover:'assets/img/work/zyda-survv.webp', href:'projects/zyda-survv.md' },
  ],
  VeraSafe: [
    { title:'Preava Prevent', desc:'MVP for misdirection prevention', cover:'assets/img/work/verasafe-preava.webp', href:'projects/verasafe-preava.md' },
  ],
  CIB: [
    { title:'Enterprise Backup System', desc:'-50% RTO, -30% data loss risk', cover:'assets/img/work/cib-enterprisebackup.webp', href:'projects/cib-enterprisebackup.md' },
  ],
  IBM: [
    { title:'Tech Support Nexus', desc:'-50% RTO, -30% data loss risk', cover:'assets/img/work/ibm-techsupportnexus.webp', href:'projects/ibm-techsupportnexus.md' },
  ]
};

const grid = document.getElementById('projectGrid');
const title = document.getElementById('projectsTitle');

// Render helpers
function renderCards(company) {
  // On mobile, hide main grid and render mini-cards under expanded experience card
  if (window.matchMedia('(max-width: 700px)').matches) {
    grid.innerHTML = '';
    // Remove any existing mini-projects and mobile project headers
    document.querySelectorAll('.mini-projects, .mini-projects-header').forEach(el => el.remove());
    // Find the open details for this company
    const details = document.querySelector(`.wa-details[data-company="${company}"]`);
    if (!details) return;
    const items = PROJECTS[company] || [];
    if (!items.length) return;
    // Create header
    const header = document.createElement('h2');
    header.className = 'mini-projects-header';
    header.textContent = `${company} — Projects`;
    // Create mini-cards
    const mini = document.createElement('div');
    mini.className = 'mini-projects';
    items.forEach((p, i) => {
      const a = document.createElement('a');
      a.className = 'mini-card';
      a.href = p.href;
      a.innerHTML = `
        <img class="mini-card-cover" src="${p.cover}" alt="${p.title}">
        <div class="mini-card-title">${p.title}</div>
        <div class="mini-card-desc">${p.desc}</div>
      `;
      mini.appendChild(a);
    });
    // Insert header and mini-cards after the wa-content div
    const content = details.querySelector('.wa-content');
    if (content) {
      content.insertAdjacentElement('afterend', mini);
      mini.insertAdjacentElement('beforebegin', header);
    }
    return;
  }
  // Desktop: normal grid
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

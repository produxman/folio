// Dynamically align hero image to match left (down to socials) and right (to project cards)
function alignHeroImage() {
  const hero = document.querySelector('.hero');
  const heroLeft = document.querySelector('.hero-left');
  const socials = document.querySelector('.socials');
  const heroRight = document.querySelector('.hero-right');
  const heroPhoto = document.querySelector('.hero-photo');
  const projectsCol = document.querySelector('.projects-col');
  if (!hero || !heroLeft || !socials || !heroRight || !heroPhoto || !projectsCol) return;

  // Get the bottom of the socials relative to hero
  const heroRect = hero.getBoundingClientRect();
  const socialsRect = socials.getBoundingClientRect();
  const leftHeight = socialsRect.bottom - heroRect.top;

  // Get the width of the projects column
  const projectsRect = projectsCol.getBoundingClientRect();
  const heroRightRect = heroRight.getBoundingClientRect();
  const rightWidth = projectsRect.right - heroRightRect.left;

  // Set the hero image height and width
  heroPhoto.style.height = leftHeight + 'px';
  heroPhoto.style.width = rightWidth + 'px';
}

window.addEventListener('DOMContentLoaded', alignHeroImage);
window.addEventListener('resize', alignHeroImage);
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
    { title:'Billing Engine Evolution', desc:'ARR Growth, Lower Churn & Accurate Reporting through via Service-Oriented Architecture', cover:'assets/work/meister-billingengine.webp', href:'projects/meister-billingengine.md', highlight: true },
    { title:'AI Monetization', desc:'Defining 0→1 Strategy for Pricing, Packaging & Billing Design & Frameworks', cover:'assets/work/meister-aipricing.webp', href:'projects/meister-aipricing.md' },
    { title:'Accounts Design System', desc:'Enhanced Customer Experience & Growth Readiness through UX Modernization', cover:'assets/work/meister-accountsdesignsystem.webp', href:'projects/meister-accountsdesignsystem.md' },
  ],
  Pelcro: [
    { title:'Pelcro Automations', desc:'20% Higher Conversions through Targeted Segmentation & Workflow Automation Modules', cover:'assets/work/pelcro-automations.webp', href:'projects/pelcro-automations.md', highlight: true },
    { title:'Financial Reporting Overhaul', desc:'10% Increase in Retention via Accurate Financial Reporting & Analytics', cover:'assets/work/pelcro-financialreporting.webp', href:'projects/pelcro-financialreporting.md', highlight: true },
    { title:'WorldPay Integration', desc:'20% ARR Growth via Online Card & Digital Wallet Expansion', cover:'assets/work/pelcro-worldpay.webp', href:'projects/pelcro-worldpay.md' },
    { title:'Braintree Integration', desc:'Enhanced Retention & Flexibility through Direct Debit & Improved Payment UI', cover:'assets/work/pelcro-braintree.webp', href:'projects/pelcro-braintree.md' },
    { title:'Fraud Management Controls', desc:'40% Decline in Fraudulent Transactions with Advanced Online Checkout Protection', cover:'assets/work/pelcro-fraudmanagement.webp', href:'projects/pelcro-fraudmanagement.md' },
    { title:'Modernized Authentication', desc:'Multi-tenant & SAML Identity Management & Stronger Security via 2FA Controls', cover:'assets/work/pelcro-modernauthentication.webp', href:'projects/pelcro-modernauthentication.md' },
  ],
  Dell: [
    { title:'PowerProtect Sizer', desc:'10% More Upsell Opportunities through Data Protection Deployment Modeling', cover:'assets/work/dell-powerprotectsizer.webp', href:'projects/dell-powerprotectsizer.md', highlight: true  },
    { title:'Workforce Capacity Planning Tool', desc:'95%+ SLA Compliance, 15% Faster Allocation for Resource Management', cover:'assets/work/dell-workforcecapacity.webp', href:'projects/dell-workforcecapacity.md' },
  ],
  Zyda: [
    { title:'Deliverect Integration', desc:'10% Reduction in Acquisition Costs via Streamlined POS Operations', cover:'assets/work/zyda-deliverect.webp', href:'projects/zyda-deliverect.md', highlight: true },
    { title:'Survv Integration', desc:'15% Faster Order Timelines with Integrated Last Mile Delivery', cover:'assets/work/zyda-survv.webp', href:'projects/zyda-survv.md' },
  ],
  VeraSafe: [
    { title:'Preava Prevent', desc:'MVP for Preventing Misdirected Emails Enabling Initial Product Launch', cover:'assets/work/verasafe-preava.webp', href:'projects/verasafe-preava.md', highlight: true },
    { title:'Project Setup Blueprint', desc:'25% Faster Project Onboarding Time via Workflow Automation', cover:'assets/work/verasafe-projectworkflows.webp', href:'projects/verasafe-projectworkflows.md' },
  ],
  CIB: [
    { title:'Enterprise Backup Migration', desc:'50% Faster Recovery, 20% Lower Storage Costs via Backup Modernization', cover:'assets/work/cib-enterprisebackupmigration.webp', href:'projects/cib-enterprisebackupmigration.md', highlight: true },
    { title:'Resilience Dashboards', desc:'40% Operational Efficiency Gain in Backup & Recovery via Observability Dashboards', cover:'assets/work/cib-resiliencedashboards.webp', href:'projects/cib-resiliencedashboards.md' },
  ],
  IBM: [
    { title:'Support Knowledge Base', desc:'Reduced Support Costs, Improved Utilization via Technical Support Enablement', cover:'assets/work/ibm-supportknowledgebase.webp', href:'projects/ibm-supportknowledgebase.md' },
  ]
};

const grid = document.getElementById('projectGrid');
const title = document.getElementById('projectsTitle');

// Render helpers
function renderCards(company) {
  // Mobile: keep existing logic
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
    header.textContent = `Projects Where I Drove Impact`;
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

  // Desktop: Only show projects if the company card is open
  const details = document.querySelector(`.wa-details[data-company="${company}"]`);
  // If no company is open or the requested company is not open, clear grid and hide projects
  if (!details || !details.open) {
    grid.innerHTML = '';
    grid.classList.remove('single-card-grid');
    return;
  }

  // Render projects for the open company
  title.textContent = `Projects Where I Drove Impact`;
  grid.innerHTML = '';
  const items = PROJECTS[company] || [];
  if (!items.length) {
    grid.innerHTML = `<p class="muted">No public projects to show for this company yet.</p>`;
    grid.classList.remove('single-card-grid');
    return;
  }
  if (items.length === 1) {
    grid.classList.add('single-card-grid');
  } else {
    grid.classList.remove('single-card-grid');
  }
  items.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'card' + (p.highlight ? ' card-highlight' : '');
    a.href = p.href;
    a.innerHTML = `
      ${p.highlight ? `
        <span class="card-badge" title="Highlighted">
          <i class="fa fa-star"></i>
        </span>
      ` : ''}
      <div class="cover"><img src="${p.cover}" alt="${p.title}"></div>
      <div class="body">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `;
    grid.appendChild(a);
    requestAnimationFrame(()=> setTimeout(()=> a.classList.add('show'), 60*i));
  });
}

function showProjectsPlaceholder() {
  // Always show the placeholder at the top of the projects-col
  grid.innerHTML = `
    <div class="projects-placeholder">
      <div class="projects-placeholder-inner">
        <span class="projects-placeholder-icon"><i class="fa fa-arrow-left"></i></span>
        <span class="projects-placeholder-text">Expand a company card to the left for more details.</span> 
      </div>
    </div>
  `;
  grid.classList.remove('single-card-grid');
}

// Timeline behavior (single-open accordion + project switching)
const tl = document.getElementById('wa-timeline');
if (tl) {
  tl.querySelectorAll('.wa-details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        // close others
        tl.querySelectorAll('.wa-details').forEach(o => { if (o!==d) o.open = false; });
        // update carets
        tl.querySelectorAll('.wa-details summary .wa-caret').forEach(c => c.textContent = '▸');
        d.querySelector('.wa-caret').textContent = '▾';
        // load projects for the open company
        renderCards(d.dataset.company);
        alignProjectsColToCompany(d.dataset.company);
        setTimeout(() => {
          d.scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 0);
      } else {
        d.querySelector('.wa-caret').textContent = '▸';
        // If no company is open, show placeholder
        const open = tl.querySelector('.wa-details[open]');
        if (open) {
          renderCards(open.dataset.company);
        } else {
          showProjectsPlaceholder();
        }
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

// Align projects column to match expanded details on desktop
function alignProjectsColToCompany(company) {
  if (window.innerWidth <= 700) {
    document.querySelector('.projects-col')?.style.removeProperty('margin-top');
    return;
  }

  const projectsCol = document.querySelector('.projects-col');
  const details = document.querySelector(`.wa-details[data-company="${company}"]`);
  const stacked = document.querySelector('.stacked');

  if (!projectsCol || !details || !stacked) return;

  const stackedBox = stacked.getBoundingClientRect();
  const cardBox = details.getBoundingClientRect();
  const alignmentOffset = cardBox.top - stackedBox.top;
  projectsCol.style.marginTop = `${alignmentOffset}px`;
}

// Also align on window resize (desktop only)
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) {
    const open = document.querySelector('.wa-details[open]');
    if (open) alignProjectsColToCompany(open.dataset.company);
    else document.querySelector('.projects-col')?.style.setProperty('margin-top', '0px');
  } else {
    document.querySelector('.projects-col')?.style.removeProperty('margin-top');
  }
});

// Initial load: show placeholder if nothing open, else show projects
const firstOpen = tl?.querySelector('.wa-details[open]');
if (firstOpen) {
  renderCards(firstOpen.dataset.company);
  alignProjectsColToCompany(firstOpen.dataset.company);
} else {
  showProjectsPlaceholder();
  document.querySelector('.projects-col')?.style.setProperty('margin-top', '0px');
}

// ==== IntersectionObserver for “scroll-in” of each timeline node (your snippet spirit) ====
const nodes = document.querySelectorAll('.wa-details');
const observer = new IntersectionObserver(
  (entries)=> entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }),
  {threshold:.3}
);
nodes.forEach(n=>observer.observe(n));

// ===== Typewriter Text Rotator for Hero =====
(function() {
  const phrases = [
    "Product Leader.",
    "Your Friendly Neighborhood Produxman.",
    "Founder of Senza.",
    "Cooking Aficionado.",
    "Builder of Things.",
    "Sarcasm Enthusiast.",
    "Cat Dad Extraordinaire.",
    "Your wingman in from Roadmap to Rollout.",
  ];
  const ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00baad';
  const heroLeft = document.querySelector('.hero-left');
  if (!heroLeft) return;

  // Insert rotator directly under the h1
  const h1 = heroLeft.querySelector('h1');
  const target = document.createElement('div');
  target.className = 'typewriter-rotator';
  if (h1) {
    h1.insertAdjacentElement('afterend', target);
  } else {
    heroLeft.insertAdjacentElement('afterbegin', target);
  }

  let phraseIdx = 0, charIdx = 0, typing = true, timeout;
  function setCaret(blink) {
    return `<span class="typewriter-caret${blink ? ' blink' : ''}"></span>`;
  }
  function render(text, blink) {
    // Always render at least one character to prevent layout shift
    const safeText = text.length === 0 ? '&nbsp;' : text;
    target.innerHTML = `<span class="typewriter-text">${safeText}</span>${setCaret(blink)}`;
  }
  function loop() {
    const phrase = phrases[phraseIdx];
    if (typing) {
      if (charIdx <= phrase.length) {
        render(phrase.slice(0, charIdx), true);
        charIdx++;
        timeout = setTimeout(loop, 60 + Math.random()*60);
      } else {
        typing = false;
        timeout = setTimeout(loop, 1200);
      }
    } else {
      if (charIdx > 0) {
        render(phrase.slice(0, charIdx), true);
        charIdx--;
        timeout = setTimeout(loop, 30 + Math.random()*40);
      } else {
        // Prevent layout shift by rendering a non-breaking space
        render('', true);
        typing = true;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        timeout = setTimeout(loop, 500);
      }
    }
  }
  render('', true);
  loop();
})();
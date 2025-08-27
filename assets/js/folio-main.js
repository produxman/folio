class Typewriter {
  constructor(el, phrases = [], options = {}) {
    this.el = el;
    this.phrases = phrases;
    this.options = {
      typeSpeed: 60,
      deleteSpeed: 35,
      pauseAtEnd: 1200,
      loop: true,
      ...options
    };
    
    this.currentPhrase = 0;
    this.isDeleting = false;
    this.text = '';
    this.timeout = null;
    
    // Bind methods
    this.tick = this.tick.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    
    // Setup visibility handlers
    document.addEventListener('visibilitychange', this.handleVisibility);
  }
  
  tick() {
    const current = this.phrases[this.currentPhrase] || '';
    
    if (this.isDeleting) {
      this.text = current.substring(0, this.text.length - 1);
    } else {
      this.text = current.substring(0, this.text.length + 1);
    }
    
    // Use existing typewriter HTML structure
    const safeText = this.text.length === 0 ? '&nbsp;' : this.text;
    this.el.innerHTML = `<span class="typewriter-text">${safeText}</span><span class="typewriter-caret"></span>`;
    
    let delta = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
    
    if (!this.isDeleting && this.text === current) {
      delta = this.options.pauseAtEnd;
      this.isDeleting = true;
    } else if (this.isDeleting && this.text === '') {
      this.isDeleting = false;
      // Pick random next phrase, but not the same as current
      let next;
      do {
        next = Math.floor(Math.random() * this.phrases.length);
      } while (this.phrases.length > 1 && next === this.currentPhrase);
      this.currentPhrase = next;
      delta = 500;
    }
    
    this.timeout = setTimeout(this.tick, delta);
  }
  
  handleVisibility() {
    if (document.hidden) {
      clearTimeout(this.timeout);
    } else {
      this.timeout = setTimeout(this.tick, this.options.typeSpeed);
    }
  }
  
  start() {
    this.tick();
  }
  
  stop() {
    clearTimeout(this.timeout);
  }
  
  destroy() {
    this.stop();
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }
}

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

// Ensure .logo max-height matches h1 + .typewriter-rotator
function setLogoMaxHeight() {
  // Handles both dark and light logo
  const logoDark = document.querySelector('.logo.logo-dark');
  const logoLight = document.querySelector('.logo.logo-light');
  const h1 = document.querySelector('.logo-and-title h1');
  const typewriter = document.querySelector('.logo-and-title .typewriter-rotator');
  if (!h1 || !typewriter) return;
  // Get computed heights (including margins)
  const h1Rect = h1.getBoundingClientRect();
  const typeRect = typewriter.getBoundingClientRect();
  // If stacked vertically, sum heights; if inline, use max bottom
  let totalHeight;
  if (h1Rect.bottom <= typeRect.top) {
    // Stacked
    totalHeight = (h1Rect.height + typeRect.height);
  } else {
    // Overlapping or inline, use max bottom - min top
    totalHeight = Math.max(h1Rect.bottom, typeRect.bottom) - Math.min(h1Rect.top, typeRect.top);
  }
  // Set max-height in px
  if (logoDark) logoDark.style.maxHeight = totalHeight + 'px';
  if (logoLight) logoLight.style.maxHeight = totalHeight + 'px';
}

window.addEventListener('DOMContentLoaded', () => {
  alignHeroImage();
  setLogoMaxHeight();
});
window.addEventListener('resize', () => {
  alignHeroImage();
  setLogoMaxHeight();
});
// ===== Year + Theme =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Projects data (cards link to GitHub markdown pages) =====
const PROJECTS = {
  Meister: [
    { title:'Billing Engine Evolution', desc:'ARR Growth, Lower Churn & Accurate Reporting through via Service-Oriented Architecture', cover:'assets/img/project-cards/meister-billingengine.webp', href:'projects/meister-billingengine.md', highlight: true },
    { title:'AI Monetization', desc:'Defining 0→1 Strategy for Pricing, Packaging & Billing Design & Frameworks', cover:'assets/img/project-cards/meister-aipricing.webp', href:'projects/meister-aipricing.md' },
    { title:'Accounts Design System', desc:'Enhanced Customer Experience & Growth Readiness through UX Modernization', cover:'assets/img/project-cards/meister-accountsdesignsystem.webp', href:'projects/meister-accountsdesignsystem.md' },
  ],
  Pelcro: [
    { title:'Pelcro Automations', desc:'20% Higher Conversions through Targeted Segmentation & Workflow Automation Modules', cover:'assets/img/project-cards/pelcro-automations.webp', href:'projects/pelcro-automations.md', highlight: true },
    { title:'Financial Reporting Overhaul', desc:'10% Increase in Retention via Accurate Financial Reporting & Analytics', cover:'assets/img/project-cards/pelcro-financialreporting.webp', href:'projects/pelcro-financialreporting.md', highlight: true },
    { title:'WorldPay Integration', desc:'20% ARR Growth via Online Card & Digital Wallet Expansion', cover:'assets/img/project-cards/pelcro-worldpay.webp', href:'projects/pelcro-worldpay.md' },
    { title:'Braintree Integration', desc:'Enhanced Retention & Flexibility through Direct Debit & Improved Payment UI', cover:'assets/img/project-cards/pelcro-braintree.webp', href:'projects/pelcro-braintree.md' },
    { title:'Fraud Management Controls', desc:'40% Decline in Fraudulent Transactions with Advanced Online Checkout Protection', cover:'assets/img/project-cards/pelcro-fraudmanagement.webp', href:'projects/pelcro-fraudmanagement.md' },
    { title:'Modernized Authentication', desc:'Multi-tenant & SAML Identity Management & Stronger Security via 2FA Controls', cover:'assets/img/project-cards/pelcro-modernauthentication.webp', href:'projects/pelcro-modernauthentication.md' },
  ],
  Dell: [
    { title:'PowerProtect Sizer', desc:'10% More Upsell Opportunities through Data Protection Deployment Modeling', cover:'assets/img/project-cards/dell-powerprotectsizer.webp', href:'projects/dell-powerprotectsizer.md', highlight: true  },
    { title:'Workforce Capacity Planning Tool', desc:'95%+ SLA Compliance, 15% Faster Allocation for Resource Management', cover:'assets/img/project-cards/dell-workforcecapacity.webp', href:'projects/dell-workforcecapacity.md' },
  ],
  Zyda: [
    { title:'Deliverect Integration', desc:'10% Reduction in Acquisition Costs via Streamlined POS Operations', cover:'assets/img/project-cards/zyda-deliverect.webp', href:'projects/zyda-deliverect.md', highlight: true },
    { title:'ZyDine (Now Dyma)', desc:'MVP for a Food Ordering App with Personalized Recommendations & Direct Rewards', cover:'assets/img/project-cards/zyda-dyma.webp', href:'projects/zyda-dyma.md', highlight: true },
    { title:'Survv Integration', desc:'15% Faster Order Timelines with Integrated Last Mile Delivery', cover:'assets/img/project-cards/zyda-survv.webp', href:'projects/zyda-survv.md' },
  ],
  VeraSafe: [
    { title:'Preava Prevent', desc:'MVP for Preventing Misdirected Emails Enabling Initial Product Launch', cover:'assets/img/project-cards/verasafe-preava.webp', href:'projects/verasafe-preava.md', highlight: true },
    { title:'Project Setup Blueprint', desc:'25% Faster Project Onboarding Time via Workflow Automation', cover:'assets/img/project-cards/verasafe-projectworkflows.webp', href:'projects/verasafe-projectworkflows.md' },
  ],
  CIB: [
    { title:'Enterprise Backup Migration', desc:'50% Faster Recovery, 20% Lower Storage Costs via Backup Modernization', cover:'assets/img/project-cards/cib-enterprisebackupmigration.webp', href:'projects/cib-enterprisebackupmigration.md', highlight: true },
    { title:'Resilience Dashboards', desc:'40% Operational Efficiency Gain in Backup & Recovery via Observability Dashboards', cover:'assets/img/project-cards/cib-resiliencedashboards.webp', href:'projects/cib-resiliencedashboards.md' },
  ],
  IBM: [
    { title:'Support Knowledge Base', desc:'Reduced Support Costs, Improved Utilization via Technical Support Enablement', cover:'assets/img/project-cards/ibm-supportknowledgebase.webp', href:'projects/ibm-supportknowledgebase.md' },
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
    header.textContent = `Where I Drove Impact`;
    // Create mini-cards
    const mini = document.createElement('div');
    mini.className = 'mini-projects';
    items.forEach((p, i) => {
      const a = document.createElement('a');
      a.className = 'mini-card' + (p.highlight ? ' card-highlight' : '');
      a.href = p.href;
      a.innerHTML = `
        ${p.highlight ? `
          <span class="card-badge mini-card-badge" title="Highlighted">
            <i class="fa fa-star"></i>
          </span>
        ` : ''}
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
  title.textContent = `Where I Drove Impact`;
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
  <div class="cover"><img class="project-card-img" src="${p.cover}" alt="${p.title}"></div>
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
const heroLeft = document.querySelector('.hero-left');
if (heroLeft) {
  const h1 = heroLeft.querySelector('h1');
  const target = document.createElement('div');
  target.className = 'typewriter-rotator';
  if (h1) {
    h1.insertAdjacentElement('afterend', target);
  } else {
    heroLeft.insertAdjacentElement('afterbegin', target);
  }

  const phrases = [
    "Product Leader.",
    "Subpar Multitasker.",
    "Founder of Senza.",
    "Cooking Aficionado.", 
    "Builder of Things.",
    "Sarcasm Enthusiast.",
    "Vibe-Driven Developer.",
    "Cat Dad Extraordinaire.",
    "Chaos Organizer.",
    "Night Owl.",
  ];

  // Initialize with already shuffled phrases
  const typewriter = new Typewriter(target, phrases.sort(() => Math.random() - 0.5));
  typewriter.start();
}

// ===== Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

// Set initial theme
if (currentTheme) {
  document.documentElement.dataset.theme = currentTheme;
  updateThemeIcon(currentTheme === 'light');
} else {
  document.documentElement.dataset.theme = prefersDark.matches ? 'dark' : 'light';
  updateThemeIcon(!prefersDark.matches);
}

// Toggle theme function
function toggleTheme() {
  const isLight = document.documentElement.dataset.theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'dark' : 'light';
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
  updateThemeIcon(!isLight);
}

// Update icon based on theme
function updateThemeIcon(isLight) {
  // We're now using a lightbulb icon with CSS handling the color
  // No need to change innerHTML
}

// Add click event listener
themeToggle.addEventListener('click', toggleTheme);

// ===== Mobile: hide theme toggle after hero scrolls out =====
const HERO_SELECTOR = '.hero';
const heroEl = document.querySelector(HERO_SELECTOR);
const mq = window.matchMedia('(max-width: 700px)');

function applyVisibility(visible) {
  if (!themeToggle) return;
  if (!mq.matches) {
    themeToggle.classList.remove('theme-toggle-hidden'); // always show on desktop
    return;
  }
  themeToggle.classList.toggle('theme-toggle-hidden', !visible);
}

let io = null;
function setupObserver() {
  if (!heroEl) return;
  if (io) io.disconnect();

  io = new IntersectionObserver(
    ([entry]) => applyVisibility(entry.isIntersecting),
    { root: null, threshold: 0 } // root=null = viewport
  );

  io.observe(heroEl);
  applyVisibility(true); // set initial state
}

document.addEventListener('DOMContentLoaded', () => {
  setupObserver();
  setTimeout(setupObserver, 100); // safety for layout shifts
});

window.addEventListener('resize', () => {
  setupObserver(); // rebind if viewport breakpoint changes
});

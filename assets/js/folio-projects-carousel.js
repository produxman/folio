// Projects Carousel Data
const projectsData = [
  {
    name: "Bazyl",
    type: "Project",
    status: "planning",
    description: "An AI-powered budgeting app that manages itself, tracking spending patterns and providing intelligent financial insights.",
    image: "assets/img/projects/bazyl-preview.png",
    fallbackGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    ctaText: "Join the Waitlist",
    ctaLink: "mailto:mail@produxman.me"
  },
  {
    name: "What Friends are Watching",
    type: "Case Study",
    status: "Concept",
      description: "A Netflix social layer concept that shows what friends are watching, using social proof to increase engagement.",
    image: "assets/img/projects/netflix-friends-watching.png",
    fallbackGradient: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
    ctaText: "View Live Prototype",
    ctaLink: "https://id-preview--610d16e6-df5f-4183-8589-dc548a738735.lovable.app/"
  }
];

// Carousel State
let currentSlide = 0;
let slidesPerView = 3;
let autoplayInterval = null;
let isTransitioning = false;

// Initialize Carousel
function initProjectsCarousel() {
  updateSlidesPerView();
  renderProjects();
  renderDots();
  updateCarousel();
  
  // Event listeners
  document.getElementById('carouselPrev')?.addEventListener('click', prevSlide);
  document.getElementById('carouselNext')?.addEventListener('click', nextSlide);
  
  window.addEventListener('resize', () => {
    updateSlidesPerView();
    updateCarousel();
    renderDots();
  });
  
  // Touch/swipe support
  const track = document.getElementById('projectsCarouselTrack');
  if (track) {
    // On mobile, use scroll events to sync the currentSlide
    if (window.innerWidth < 768) {
      let scrollTimeout;
      track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const cards = track.querySelectorAll('.project-card');
          if (cards.length === 0) return;
          const cardWidth = cards[0].offsetWidth;
          const gap = 16;
          const newSlide = Math.round(track.scrollLeft / (cardWidth + gap));
          currentSlide = Math.max(0, Math.min(newSlide, projectsData.length - 1));
          // Update dots only
          document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
          });
        }, 100);
      });
    }
  }
  
  // Start autoplay
  startAutoplay();
  
  // Pause on hover
  const container = document.querySelector('.projects-carousel-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }
}

// Update slides per view based on screen size
function updateSlidesPerView() {
  const width = window.innerWidth;
  if (width < 768) {
    slidesPerView = 1;
  } else if (width < 1024) {
    slidesPerView = 2;
  } else {
    slidesPerView = 3;
  }
}

// Render project cards
function renderProjects() {
  const track = document.getElementById('projectsCarouselTrack');
  if (!track) return;
  
  const statusClasses = {
    active: 'status-active',
    beta: 'status-beta',
    ideation: 'status-ideation',
    planning: 'status-planning'
  };
  
  const statusLabels = {
    active: 'Live',
    beta: 'Beta',
    ideation: 'Ideation',
    planning: 'Planning'
  };
  
  track.innerHTML = projectsData.map(project => `
    <article class="project-card">
      <div class="project-card-image" style="background: ${project.fallbackGradient};">
        <img src="${project.image}" alt="${project.name}" loading="lazy" 
             onerror="this.style.display='none';">
        <span class="project-card-status ${statusClasses[project.status] || ''}">${statusLabels[project.status] || project.status}</span>
      </div>
      <div class="project-card-content">
        <h3 class="project-card-title">${project.name}</h3>
        <p class="project-card-description">${project.description}</p>
        <a href="${project.ctaLink}" class="project-card-cta" ${project.ctaLink.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
          ${project.ctaText} <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </article>
  `).join('');
}

// Render dots
function renderDots() {
  const dotsContainer = document.getElementById('carouselDots');
  if (!dotsContainer) return;
  
  const totalSlides = Math.max(1, projectsData.length - slidesPerView + 1);
  
  dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) => 
    `<button class="carousel-dot ${i === currentSlide ? 'active' : ''}" 
            data-slide="${i}" 
            aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
  
  // Add click listeners to dots
  dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.dataset.slide);
      goToSlide(slideIndex);
    });
  });
}

// Update carousel position
function updateCarousel() {
  const track = document.getElementById('projectsCarouselTrack');
  if (!track) return;
  
  const cards = track.querySelectorAll('.project-card');
  if (cards.length === 0) return;
  
  // Use native scroll on mobile, transform on desktop
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Use native scroll for mobile
    const cardWidth = cards[currentSlide].offsetWidth;
    const gap = 16;
    const scrollPosition = currentSlide * (cardWidth + gap);
    track.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  } else {
    // Use transform for desktop
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const offset = currentSlide * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }
  
  // Update navigation buttons
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  
  if (prevBtn) prevBtn.disabled = currentSlide === 0;
  if (nextBtn) nextBtn.disabled = currentSlide >= projectsData.length - slidesPerView;
  
  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Navigation functions
function nextSlide() {
  if (isTransitioning || currentSlide >= projectsData.length - slidesPerView) return;
  isTransitioning = true;
  currentSlide++;
  updateCarousel();
  setTimeout(() => { isTransitioning = false; }, 500);
}

function prevSlide() {
  if (isTransitioning || currentSlide === 0) return;
  isTransitioning = true;
  currentSlide--;
  updateCarousel();
  setTimeout(() => { isTransitioning = false; }, 500);
}

function goToSlide(index) {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide = Math.max(0, Math.min(index, projectsData.length - slidesPerView));
  updateCarousel();
  setTimeout(() => { isTransitioning = false; }, 500);
}

// Autoplay functions
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    if (currentSlide >= projectsData.length - slidesPerView) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    updateCarousel();
  }, 5000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsCarousel);
} else {
  initProjectsCarousel();
}

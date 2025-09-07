// ===========================
// EASTER EGG FUNCTIONALITY
// Theme toggle click tracker and modal
// ===========================

// Easter egg state
let clickCount = 0;
let clickTimer = null;
const CLICK_TIMEOUT = 60000; // 60 seconds
const TRIGGER_CLICKS = 4;
const SESSION_KEY = 'easterEggShown';

// Track theme toggle clicks for easter egg
function trackThemeToggleClick() {
  // Check if easter egg was already shown this session
  if (sessionStorage.getItem(SESSION_KEY)) {
    return;
  }
  
  clickCount++;
  
  // Clear existing timer
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
  
  // Check if we've reached the trigger
  if (clickCount >= TRIGGER_CLICKS) {
    showEasterEgg();
    resetClickCounter();
    return;
  }
  
  // Set timer to reset counter after 60 seconds
  clickTimer = setTimeout(() => {
    resetClickCounter();
  }, CLICK_TIMEOUT);
}

// Reset click counter
function resetClickCounter() {
  clickCount = 0;
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
}

// Show easter egg modal
function showEasterEgg() {
  const modal = document.getElementById('easterEggModal');
  const closeBtn = document.getElementById('easterEggClose');
  
  if (!modal) return;
  
  // Mark as shown for this session
  sessionStorage.setItem(SESSION_KEY, 'true');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Show modal
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('show');
  
  // Focus the close button for accessibility
  setTimeout(() => {
    closeBtn?.focus();
  }, 300);
  
  // Setup close handlers
  setupEasterEggCloseHandlers(modal, closeBtn);
}

// Setup modal close handlers
function setupEasterEggCloseHandlers(modal, closeBtn) {
  const themeToggle = document.getElementById('themeToggle');
  
  // Close modal function
  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Return focus to theme toggle
    themeToggle?.focus();
  }
  
  // Button click handler
  const buttonHandler = () => closeModal();
  closeBtn?.addEventListener('click', buttonHandler, { once: true });
  
  // ESC key handler
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
      document.removeEventListener('keydown', trapFocus);
    }
  };
  document.addEventListener('keydown', escHandler, { once: true });
  
  // Click outside handler
  const overlayHandler = (e) => {
    if (e.target === modal || e.target.classList.contains('easter-egg-overlay')) {
      closeModal();
      modal.removeEventListener('click', overlayHandler);
      document.removeEventListener('keydown', trapFocus);
    }
  };
  modal.addEventListener('click', overlayHandler, { once: true });
  
  // Focus trap
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const trapFocus = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };
  document.addEventListener('keydown', trapFocus);
}

// Initialize easter egg functionality
function initEasterEgg() {
  // Only initialize if modal exists on the page
  const modal = document.getElementById('easterEggModal');
  if (!modal) return;
  
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  // Add click tracking to existing theme toggle functionality
  const originalClickHandler = themeToggle.onclick;
  themeToggle.addEventListener('click', (e) => {
    trackThemeToggleClick();
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEasterEgg);
} else {
  initEasterEgg();
}

// Export functions for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackThemeToggleClick,
    showEasterEgg,
    resetClickCounter,
    initEasterEgg
  };
}

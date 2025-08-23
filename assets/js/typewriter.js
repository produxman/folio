export class Typewriter {
  constructor(el, phrases = [], options = {}) {
    this.el = el;
    this.phrases = phrases;
    this.options = {
      typeSpeed: 80,
      deleteSpeed: 50,
      pauseAtEnd: 1200,
      loop: true,
      cursorChar: '|',
      ...options
    };
    
    this.cursor = document.createElement('span');
    this.cursor.className = 'caret';
    this.cursor.textContent = this.options.cursorChar;
    
    this.currentPhrase = 0;
    this.isDeleting = false;
    this.text = '';
    this.timeout = null;
    
    // Add cursor and ARIA attributes
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('role', 'status');
    el.after(this.cursor);
    
    // Bind methods
    this.tick = this.tick.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    
    // Setup visibility handlers
    document.addEventListener('visibilitychange', this.handleVisibility);
  }
  
  tick() {
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
      // Simply swap text without animation
      this.text = this.phrases[this.currentPhrase] || '';
      this.el.textContent = this.text;
      this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
      this.timeout = setTimeout(this.tick, this.options.pauseAtEnd);
      return;
    }
    
    // Normal animated behavior
    const current = this.phrases[this.currentPhrase] || '';
    
    if (this.isDeleting) {
      this.text = current.substring(0, this.text.length - 1);
    } else {
      this.text = current.substring(0, this.text.length + 1);
    }
    
    this.el.textContent = this.text;
    
    let delta = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
    
    if (!this.isDeleting && this.text === current) {
      delta = this.options.pauseAtEnd;
      this.isDeleting = true;
    } else if (this.isDeleting && this.text === '') {
      this.isDeleting = false;
      this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
      delta = 500; // Pause before starting next phrase
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
    this.stop();
    this.tick();
  }
  
  stop() {
    clearTimeout(this.timeout);
  }
  
  destroy() {
    this.stop();
    this.cursor.remove();
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }
}

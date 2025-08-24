(() => {
  const $ = document.querySelector.bind(document);

  // Hardcoded configuration
  const CONFIG = {
    baseUrl: 'https://regular-precise-tadpole.ngrok-free.app',
    username: 'produxman',
    password: 'Chedda123!',
    model: 'gemma3:4b',
    system: ''
  };

  class Chat {
    constructor() {
      this.elements = {
        widget: $('#chat-widget'),
        header: document.querySelector('#chat-widget .chat-header'),
        minimize: document.getElementById('chat-minimize'), // Fix: use correct ID
        maximize: null, // will create below
        messages: document.getElementById('chat-messages'), // Fix: use correct ID
        input: document.getElementById('chat-input'),      // Fix: use correct ID
        send: document.getElementById('chat-send'),        // Fix: use correct ID
        stop: document.getElementById('chat-stop'),        // Fix: use correct ID
        status: $('#status'),
        // Add dot references
        launcherConnDot: null,
        headerConnDot: null,
        headerConnLabel: null
      };

      this.controller = null;
      this.loadingDiv = null;
      this.checkInterval = null;  // Add this line for periodic checks
      this.init();
    }

    init() {
      this.insertConnectionDots();
      this.setupListeners();
      this.checkConnection();
      
      // Check connection every 30 seconds
      this.checkInterval = setInterval(() => this.checkConnection(), 30000);
    }

    insertConnectionDots() {
      // 1. Dot on chat launcher button (positioned absolutely in top-right)
      const chatBubble = document.getElementById('chat-bubble');
      if (chatBubble && !chatBubble.querySelector('.chat-conn-dot')) {
        const dot = document.createElement('span');
        dot.className = 'chat-conn-dot';
        dot.setAttribute('aria-label', 'Connection status');
        dot.setAttribute('title', 'Connection status');
        // Use absolute positioning, so wrap chat icon in a relative container if needed
        chatBubble.style.position = 'relative';
        dot.style.position = 'absolute';
        dot.style.top = '7px';
        dot.style.right = '7px';
        dot.style.zIndex = '2';
        chatBubble.appendChild(dot);
        this.elements.launcherConnDot = dot;
      } else if (chatBubble) {
        this.elements.launcherConnDot = chatBubble.querySelector('.chat-conn-dot');
      }

      // 2. Dot and status in chat header (next to title)
      if (this.elements.header && !this.elements.header.querySelector('.chat-header-status')) {
        const statusWrap = document.createElement('span');
        statusWrap.className = 'chat-header-status';
        const dot = document.createElement('span');
        dot.className = 'chat-conn-dot';
        statusWrap.appendChild(dot);
        const label = document.createElement('span');
        label.className = 'chat-conn-label';
        label.textContent = ''; // Will be set in setStatus
        statusWrap.appendChild(label);
        // Insert after the title
        const title = this.elements.header.querySelector('.chat-title');
        if (title) {
          title.insertAdjacentElement('afterend', statusWrap);
        } else {
          this.elements.header.appendChild(statusWrap);
        }
        this.elements.headerConnDot = dot;
        this.elements.headerConnLabel = label;
      } else if (this.elements.header) {
        const statusWrap = this.elements.header.querySelector('.chat-header-status');
        this.elements.headerConnDot = statusWrap?.querySelector('.chat-conn-dot');
        this.elements.headerConnLabel = statusWrap?.querySelector('.chat-conn-label');
      }
    }

    setStatus(message, isConnected) {
      // Remove the unused connDot check (it wasn't defined)
      if (this.elements.launcherConnDot) {
        this.elements.launcherConnDot.classList.toggle('online', isConnected);
        this.elements.launcherConnDot.classList.toggle('offline', !isConnected);
      }
      if (this.elements.headerConnDot) {
        this.elements.headerConnDot.classList.toggle('online', isConnected);
        this.elements.headerConnDot.classList.toggle('offline', !isConnected);
      }
      if (this.elements.headerConnLabel) {
        this.elements.headerConnLabel.textContent = isConnected ? 'Online' : 'Offline';
        this.elements.headerConnLabel.className = 'chat-conn-label' + (isConnected ? ' online' : ' offline');
      }
    }

    async checkConnection() {
      try {
        const response = await fetch(`${CONFIG.baseUrl}/api/tags`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });        
        // Consider connected only if we get a 2xx response
        const isConnected = response.status >= 200 && response.status < 300;
        this.setStatus(isConnected ? 'Connected' : `Error: ${response.status}`, isConnected);
      } catch (err) {
        console.error('Connection check failed:', err);
        this.setStatus('Cannot reach server', false);
      }
    }

    addMessage(content, role = 'user') {
      const div = document.createElement('div');
      div.className = `chat-message ${role}`; // Fix: add chat- prefix
      
      if (role === 'assistant') {
        // Parse markdown and sanitize for assistant messages
        const htmlContent = marked.parse(content, {
          gfm: true,
          breaks: true
        });
        const sanitized = DOMPurify.sanitize(htmlContent, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'blockquote'],
          ALLOWED_ATTR: ['href']
        });
        div.innerHTML = sanitized;
      } else {
        // Plain text for user messages
        div.textContent = content;
      }

      this.elements.messages.appendChild(div);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      return div;
    }

    showLoadingIndicator() {
      if (this.loadingDiv) return;
      this.loadingDiv = document.createElement('div');
      this.loadingDiv.className = 'chat-loading-indicator';
      this.loadingDiv.innerHTML = `
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      this.elements.messages.appendChild(this.loadingDiv);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    removeLoadingIndicator() {
      if (this.loadingDiv && this.loadingDiv.parentNode) {
        this.loadingDiv.parentNode.removeChild(this.loadingDiv);
      }
      this.loadingDiv = null;
    }

    async send() {
      const content = this.elements.input.value.trim();
      if (!content) return;

      // Initialize controller before making requests
      this.controller = new AbortController();
      
      this.elements.input.value = '';
      this.updateUIState(true);

      this.addMessage(content, 'user');
      this.showLoadingIndicator();

      try {
        const response = await this.fetchCompletion(content);
        this.removeLoadingIndicator();
        await this.handleStream(response);
      } catch (err) {
        this.removeLoadingIndicator();
        // Only show error message if not aborted
        if (err.name !== 'AbortError') {
          this.addMessage(`Error: ${err.message}`, 'assistant');
        }
      } finally {
        this.controller = null; // Clean up controller
        this.updateUIState(false);
      }
    }

    async handleStream(response) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let markdown = '';
      let responseDiv = null;

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let lineEnd;
          
          while ((lineEnd = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);
            if (!line) continue;
            
            try {
              const { output } = JSON.parse(line);
              if (output) {
                if (!responseDiv) {
                  responseDiv = this.addMessage('', 'assistant');
                }
                markdown += output;
                // Re-render complete markdown on each update
                const htmlContent = marked.parse(markdown, { gfm: true, breaks: true });
                const sanitized = DOMPurify.sanitize(htmlContent, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'blockquote'],
                  ALLOWED_ATTR: ['href']
                });
                responseDiv.innerHTML = sanitized;
                this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
              }
            } catch (e) {
              // Ignore malformed lines
            }
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          throw new Error('Stream processing failed');
        }
      }
    }

    async fetchCompletion(content) {
      try {
        const response = await fetch(`${CONFIG.baseUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${CONFIG.username}:${CONFIG.password}`)}`
          },
          body: JSON.stringify({
            prompt: content,
            model: CONFIG.model,
            system: CONFIG.system,
            stream: true
          }),
          signal: this.controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (err) {
        if (err.name === 'TypeError' && err.message && err.message.includes('CORS')) {
          throw new Error('Could not reach server — check URL or tunnel status');
        }
        throw err;
      }
    }

    updateUIState(isGenerating) {
      this.elements.input.disabled = isGenerating;
      this.elements.send.disabled = isGenerating;
      this.elements.stop.disabled = !isGenerating;
      if (!isGenerating) this.controller = null;
    }

    stop() {
      if (this.controller) this.controller.abort();
    }

    setupListeners() {
      // Theme toggle listeners
      this.elements.input?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey && !this.elements.input.disabled) {
          e.preventDefault();
          this.send();
        }
      });

      this.elements.send?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.elements.send.disabled) this.send();
      });

      this.elements.stop?.addEventListener('click', () => this.stop());

      // Auto-expand textarea
      this.elements.input?.addEventListener('input', () => {
        const input = this.elements.input;
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 5 * 24) + 'px';
      });

      // Widget state handlers
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-backdrop')) {
          this.setState('minimized');
        }
      });

      const fab = document.getElementById('chat-bubble');
      fab?.addEventListener('click', () => this.setState('open'));
      
      // Fix: Use chat-minimize button directly
      const minimizeBtn = document.getElementById('chat-minimize');
      minimizeBtn?.addEventListener('click', () => this.setState('minimized'));

      // Double-click header for fullscreen
      this.elements.header?.addEventListener('dblclick', () => {
        if (this.elements.widget.classList.contains('fullscreen')) {
          this.setState('minimized');
        } else {
          this.setState('fullscreen');
        }
      });
    }

    setState(state) {
      if (!this.elements.widget) return;
      this.elements.widget.classList.remove('minimized');
      if (state === 'minimized') {
        this.elements.widget.classList.add('minimized');
      }
      if (state !== 'minimized') {
        setTimeout(() => this.elements.input?.focus(), 200);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => new Chat());
})();
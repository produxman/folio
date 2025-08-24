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
        header: document.querySelector('#chat-widget .widget-header'),
        minimize: $('#minimize'),
        maximize: null, // will create below
        messages: $('#messages'),
        input: $('#input'),
        send: $('#send'),
        stop: $('#stop'),
        status: $('#status'),
        connDot: $('#connDot')
      };

      this.controller = null;
      this.loadingDiv = null;
      this.init();
    }

    init() {
      this.addMaximizeButton();
      this.setupListeners();
      this.checkConnection();
      this.setupWidgetControls();
    }

    setupListeners() {
      // Fix: Only trigger send if input is not disabled
      this.elements.input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey && !this.elements.input.disabled) {
          e.preventDefault();
          this.send();
        }
      });

      this.elements.send.addEventListener('click', () => {
        if (!this.elements.send.disabled) this.send();
      });
      this.elements.stop.addEventListener('click', () => this.stop());
    }

    setupWidgetControls() {
      // Maximize button
      const maximize = this.elements.maximize;
      if (maximize) {
        maximize.addEventListener('click', (e) => {
          e.stopPropagation();
          const isExpanded = this.elements.widget.classList.toggle('expanded');
          maximize.textContent = isExpanded ? '⊏⊐' : '⊐⊏';
          maximize.title = isExpanded ? 'Exit fullscreen' : 'Enter fullscreen';
          
          // Remove minimized state if present
          this.elements.widget.classList.remove('minimized');
          this.elements.minimize.textContent = '−';
          
          // Auto-focus input in fullscreen
          if (isExpanded) {
            this.elements.input.focus();
          }
        });
      }

      // Minimize button
      const minimize = this.elements.minimize;
      if (minimize) {
        minimize.addEventListener('click', (e) => {
          e.stopPropagation();
          // Only allow minimize if not expanded
          if (!this.elements.widget.classList.contains('expanded')) {
            const isMinimized = this.elements.widget.classList.toggle('minimized');
            minimize.textContent = isMinimized ? '□' : '−';
            minimize.title = isMinimized ? 'Restore' : 'Minimize';
          }
        });
      }

      // Prevent header clicks from affecting buttons
      this.elements.header.addEventListener('click', (e) => {
        if (e.target === this.elements.header) {
          e.stopPropagation();
        }
      });
    }

    setStatus(message, isConnected) {
      if (this.elements.status) {
        this.elements.status.textContent = message;
      }
      if (this.elements.connDot) {
        this.elements.connDot.classList.toggle('connected', isConnected);
      }
    }

    async checkConnection() {
      try {
        const response = await fetch(`${CONFIG.baseUrl}/api/tags`);
        this.setStatus(response.ok ? 'Connected' : 'Error', response.ok);
      } catch {
        this.setStatus('Cannot reach server', false);
      }
    }

    addMessage(content, role = 'user') {
      const div = document.createElement('div');
      div.className = `message ${role}`;
      
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
      this.loadingDiv.className = 'chat-message loading assistant';
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

      this.elements.input.value = '';
      this.updateUIState(true);

      this.addMessage(content, 'user');
      this.showLoadingIndicator();

      const responseDiv = this.addMessage('', 'assistant');

      this.controller = new AbortController();

      try {
        const response = await this.fetchCompletion(content);
        this.removeLoadingIndicator();
        await this.handleStream(response, responseDiv);
      } catch (err) {
        this.removeLoadingIndicator();
        responseDiv.textContent = err.name === 'AbortError'
          ? '[Stopped]'
          : `Error: ${err.message}`;
      } finally {
        this.updateUIState(false);
      }
    }

    async handleStream(response, outputDiv) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let markdown = '';

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
                markdown += output;
                // Re-render complete markdown on each update
                const htmlContent = marked.parse(markdown, {
                  gfm: true,
                  breaks: true
                });
                const sanitized = DOMPurify.sanitize(htmlContent, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'blockquote'],
                  ALLOWED_ATTR: ['href']
                });
                outputDiv.innerHTML = sanitized;
              }
            } catch (e) {
              // Ignore malformed lines
            }
          }
          this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
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
  }

  window.addEventListener('DOMContentLoaded', () => new Chat());

  const widget = document.getElementById('chat-widget');
  const fab = document.getElementById('chat-bubble');
  const overlay = widget.querySelector('.chat-overlay');
  const minimizeBtn = document.getElementById('chat-minimize');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const stopBtn = document.getElementById('chat-stop');

  let controller = null;
  let streamingDiv = null;

  function setState(state) {
    widget.classList.remove('minimized');
    if (state === 'minimized') {
      widget.classList.add('minimized');
    }
    if (state !== 'minimized') {
      setTimeout(() => input.focus(), 200);
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-backdrop')) {
      setState('minimized');
    }
  });

  fab.addEventListener('click', () => setState('open'));
  minimizeBtn.addEventListener('click', () => setState('minimized'));

  // Double-click header to toggle fullscreen/minimized
  widget.querySelector('.chat-header').addEventListener('dblclick', () => {
    if (widget.classList.contains('fullscreen')) setState('minimized');
    else setState('fullscreen');
  });

  // Auto-expand textarea up to 5 lines
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 5 * 24) + 'px';
  });

  // Enter to send, Shift+Enter for newline
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    input.style.height = '';
    sendBtn.disabled = true;
    stopBtn.disabled = false;
    streamBotReply(text);
  });

  stopBtn.addEventListener('click', () => {
    if (controller) controller.abort();
  });

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    if (role === 'assistant') {
      // Parse markdown and sanitize for assistant messages
      const htmlContent = window.marked
        ? marked.parse(text, { gfm: true, breaks: true })
        : text;
      const sanitized = window.DOMPurify
        ? DOMPurify.sanitize(htmlContent, {
            ALLOWED_TAGS: [
              'p', 'br', 'strong', 'em', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'blockquote'
            ],
            ALLOWED_ATTR: ['href']
          })
        : htmlContent;
      div.innerHTML = sanitized;
    } else {
      div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  // --- Streaming fetch logic (unchanged) ---
  async function streamBotReply(userText) {
    const CONFIG = {
      baseUrl: 'https://regular-precise-tadpole.ngrok-free.app',
      username: 'produxman',
      password: 'Chedda123!',
      model: 'gemma3:4b',
      system: ''
    };

    controller = new AbortController();
    streamingDiv = addMessage('', 'assistant');

    try {
      const response = await fetch(`${CONFIG.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${CONFIG.username}:${CONFIG.password}`)}`
        },
        body: JSON.stringify({
          prompt: userText,
          model: CONFIG.model,
          system: CONFIG.system,
          stream: true
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await handleStream(response, streamingDiv);
    } catch (err) {
      streamingDiv.textContent = err.name === 'AbortError'
        ? '[Stopped]'
        : `Error: ${err.message}`;
    } finally {
      sendBtn.disabled = false;
      stopBtn.disabled = true;
      controller = null;
    }
  }

  async function handleStream(response, outputDiv) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let markdown = '';

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
              markdown += output;
              // Render markdown as HTML, sanitize
              const htmlContent = window.marked
                ? marked.parse(markdown, { gfm: true, breaks: true })
                : markdown;
              const sanitized = window.DOMPurify
                ? DOMPurify.sanitize(htmlContent, {
                    ALLOWED_TAGS: [
                      'p', 'br', 'strong', 'em', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'blockquote'
                    ],
                    ALLOWED_ATTR: ['href']
                  })
                : htmlContent;
              outputDiv.innerHTML = sanitized;
              messages.scrollTop = messages.scrollHeight;
            }
          } catch (e) {
            // Ignore malformed lines
          }
        }
      }
      if (buffer.trim()) {
        try {
          const { output } = JSON.parse(buffer);
          if (output) {
            markdown += output;
            const htmlContent = window.marked
              ? marked.parse(markdown, { gfm: true, breaks: true })
              : markdown;
            const sanitized = window.DOMPurify
              ? DOMPurify.sanitize(htmlContent, {
                  ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'em', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'blockquote'
                  ],
                  ALLOWED_ATTR: ['href']
                })
              : htmlContent;
            outputDiv.innerHTML = sanitized;
            messages.scrollTop = messages.scrollHeight;
          }
        } catch (e) {}
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw new Error('Stream processing failed');
      }
    }
  }

  setState('minimized');
})();

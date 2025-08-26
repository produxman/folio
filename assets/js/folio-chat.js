/**
 * Standalone AI Chatbot Widget - JavaScript Functionality
 * For use with static HTML structure
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiEndpoint: window.location.origin + '/api/chat',
    greeting: '👋 I can answer a bit about Sherif. For nuance, ask the real guy.',
    maxLength: 500,
    rateLimit: {
      maxRequests: 20,
      windowMs: 60000 // 1 minute
    }
  };

  // Global state
  let sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
  let messages = [{ role: 'assistant', content: CONFIG.greeting, id: 'welcome' }];
  let isTyping = false;
  let isOpen = false;
  let requestCount = 0;
  let lastRequestTime = 0;

  // Rate limiting
  function checkRateLimit() {
    const now = Date.now();
    if (now - lastRequestTime > CONFIG.rateLimit.windowMs) {
      requestCount = 0;
    }
    if (requestCount >= CONFIG.rateLimit.maxRequests) {
      return false;
    }
    requestCount++;
    lastRequestTime = now;
    return true;
  }

  // Simple markdown renderer
  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  // Sanitize HTML content
  function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  // Auto-resize textarea
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }

  // Render messages
  function renderMessages() {
    const container = document.getElementById('ai-chatbot-messages');
    if (!container) return;

    container.innerHTML = '';

    messages.forEach((message, index) => {
      // If assistant message is hidden, skip rendering its bubble
      if (message.role === 'assistant' && message.hidden) return;
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${message.role}`;

      const renderedContent = message.role === 'assistant' 
        ? renderMarkdown(message.content)
        : sanitizeHTML(message.content).replace(/\n/g, '<br>');

      messageDiv.innerHTML = `
        <div class="chatbot-message-content">
          ${renderedContent}
        </div>
      `;

      container.appendChild(messageDiv);
    });

    // Add typing indicator if needed
    if (isTyping) {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chatbot-typing';
      typingDiv.innerHTML = `
        <div class="chatbot-typing-content">
          <span style="font-size: 12px;">Produxman is typing</span>
          <div class="chatbot-typing-dots">
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
          </div>
        </div>
      `;
      container.appendChild(typingDiv);
    }

    // Scroll to bottom
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }

  // --- REPLACE sendMessage and handleUserMessage with streaming backend integration ---

  // Backend config (from ama-script.js)
  const BACKEND_CONFIG = {
    baseUrl: 'https://regular-precise-tadpole.ngrok-free.app',
    username: 'produxman',
    password: 'Chedda123!',
    model: 'gemma3:4b',
    system: ''
  };

  async function streamBackendResponse(prompt, onChunk, onDone, onError, _retried = false) {
  window.currentController = new AbortController();
  let markdown = '';

  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${BACKEND_CONFIG.username}:${BACKEND_CONFIG.password}`)}`
      },
      body: JSON.stringify({ prompt, rag: true, k: 5, stream: true }),
      signal: window.currentController.signal
    });

    if (response.status === 424 && !_retried) {
      await fetch(`${BACKEND_CONFIG.baseUrl}/rag/reload`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${btoa(`${BACKEND_CONFIG.username}:${BACKEND_CONFIG.password}`)}` }
      });
      return streamBackendResponse(prompt, onChunk, onDone, onError, true); // retry once
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let lineEnd;
      while ((lineEnd = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);
        if (!line) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.done) { onDone?.(markdown); return; }
          const chunk = parsed.response ?? parsed.output ?? '';
          if (chunk) { markdown += chunk; onChunk?.(chunk, markdown); }
        } catch { /* ignore non-JSON lines */ }
      }
    }
    onDone?.(markdown);
  } catch (err) {
    if (err.name !== 'AbortError') onError?.(err);
    onDone?.(markdown);
  } finally {
    window.currentController = null;
  }
}

  // Replace handleUserMessage to use streaming
  async function handleUserMessage() {
    const input = document.getElementById('ai-chatbot-input');
    const sendButton = document.getElementById('ai-chatbot-send');
    const container = document.getElementById('ai-chatbot-messages');
    const content = input.value.trim();
    
    // If we're currently streaming, this is a stop request
    if (isTyping) {
      window.currentController?.abort();
      isTyping = false;
      sendButton.classList.remove('streaming');
      return;
    }
    
    if (!content || content.length > CONFIG.maxLength) return;
    
    messages.push({ id: Date.now().toString(), role: 'user', content });
    input.value = '';
    autoResizeTextarea(input);
    updateCounter();
    renderMessages();
    
    isTyping = true;
    sendButton.classList.add('streaming');
    
    // Add placeholder for streaming response, but keep it hidden until first chunk
    const aiMsg = { id: Date.now().toString() + '_bot', role: 'assistant', content: '', hidden: true };
    messages.push(aiMsg);
    renderMessages();
    let firstChunkReceived = false;
    await new Promise((resolve) => {
      streamBackendResponse(content, (chunk, full) => {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          aiMsg.hidden = false;
          isTyping = false;
          renderMessages();
        }
        aiMsg.content = full;
        if (!aiMsg.hidden) {
          const allMsgDivs = container.querySelectorAll('.chatbot-message.assistant .chatbot-message-content');
          const lastAIDiv = allMsgDivs[allMsgDivs.length - 1];
          if (lastAIDiv) lastAIDiv.innerHTML = renderMarkdown(full);
          container.scrollTop = container.scrollHeight;
        }
      }, () => {
        isTyping = false;
        sendButton.classList.remove('streaming');
        renderMessages();
        resolve();
      }, (err) => {
        aiMsg.content = 'Sorry, there was an error generating the response.';
        aiMsg.hidden = false;
        isTyping = false;
        sendButton.classList.remove('streaming');
        renderMessages();
        resolve();
      });
    });
  }

  // Update character counter
  function updateCounter() {
    const input = document.getElementById('ai-chatbot-input');
    const counter = document.getElementById('message-counter');
    if (input && counter) {
      const length = input.value.length;
      counter.textContent = `${length}/${CONFIG.maxLength}`;
      counter.style.color = length > CONFIG.maxLength * 0.9 ? '#EF4444' : '#6B7280';
    }
  }

  // Toggle widget visibility
  function toggleWidget() {
    const widget = document.getElementById('ai-chatbot-widget');
    const input = document.getElementById('ai-chatbot-input');

    if (!widget) return;

    isOpen = !isOpen;

    if (isOpen) {
      widget.style.display = 'flex';
      setTimeout(() => {
        widget.classList.add('show');
        renderMessages();
        if (input && window.innerWidth > 480) {
          input.focus();
        }
      }, 10);
    } else {
      widget.classList.remove('show');
      setTimeout(() => {
        widget.style.display = 'none';
      }, 300);
    }
  }

  // Handle outside clicks
  function handleOutsideClick(e) {
    const widget = document.getElementById('ai-chatbot-widget');
    const toggle = document.getElementById('ai-chatbot-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatModal = chatWidget?.querySelector('.chat-modal');
    const chatBubble = document.getElementById('chat-bubble');

    // If main widget is present, close if click is outside widget and toggle
    if (widget && toggle && widget.classList.contains('show')) {
      if (!widget.contains(e.target) && !toggle.contains(e.target)) {
        closeWidget();
      }
    }
    // If alternate chatWidget/modal is present, minimize if click is outside
    if (chatWidget && chatModal && chatBubble && !chatWidget.classList.contains('minimized')) {
      if (!chatModal.contains(e.target) && !chatBubble.contains(e.target)) {
        chatWidget.classList.add('minimized');
      }
    }
  }

  // Handle mobile keyboard
  function handleMobileKeyboard() {
    if (window.innerWidth > 480) return;

    const widget = document.getElementById('ai-chatbot-widget');
    const messages = document.getElementById('ai-chatbot-messages');
    
    if (!widget || !messages) return;

    function updateHeight() {
      const height = window.visualViewport?.height || window.innerHeight;
      widget.style.height = `${height}px`;
      messages.scrollTop = messages.scrollHeight;
    }

    window.visualViewport?.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('scroll', updateHeight);
  }

  // Close widget
  function closeWidget() {
    const widget = document.getElementById('ai-chatbot-widget');
    if (!widget) return;

    isOpen = false;
    widget.classList.remove('show');
    setTimeout(() => {
      widget.style.display = 'none';
    }, 300);
  }

  // --- Add connection status logic for status dot ---

  const STATUS_CONFIG = {
    baseUrl: 'https://regular-precise-tadpole.ngrok-free.app'
  };

  async function checkConnectionStatus() {
    try {
      const response = await fetch(`${STATUS_CONFIG.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      // Consider connected only if we get a 2xx response
      const isOnline = response.status >= 200 && response.status < 300;
      updateStatusDot(isOnline ? 'Connected' : `Error: ${response.status}`, isOnline);
      return isOnline;
    } catch (err) {
      console.error('Connection check failed:', err);
      updateStatusDot('Cannot reach server', false);
      return false;
    }
  }

  function updateStatusDot(message, isOnline) {
    const statusDot = document.querySelector('#ai-chatbot-header .status-dot');
    const statusLabel = document.querySelector('#ai-chatbot-header .status');
    
    if (statusDot) {
      statusDot.style.backgroundColor = isOnline ? '#10B981' : '#EF4444';
      statusDot.classList.toggle('online', isOnline);
      statusDot.classList.toggle('offline', !isOnline);
    }
    
    if (statusLabel) {
      statusLabel.innerHTML = `
        <span class="status-dot" style="background-color: ${isOnline ? '#10B981' : '#EF4444'}"></span>
        ${isOnline ? ' Online' : ' Offline'}
      `;
    }
  }

  // Call this on load and every 30s
  async function startStatusPolling() {
    async function poll() {
      await checkConnectionStatus();
    }
    await poll();
    setInterval(poll, 30000);
  }

  // Initialize chatbot
  function initChatbot() {
    // Add event listeners
    const toggle = document.getElementById('ai-chatbot-toggle');
    const closeBtn = document.getElementById('ai-chatbot-close');
    const input = document.getElementById('ai-chatbot-input');
    const sendBtn = document.getElementById('ai-chatbot-send');

    if (toggle) {
      toggle.addEventListener('click', toggleWidget);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeWidget);
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserMessage();
        }
      });

      input.addEventListener('input', (e) => {
        autoResizeTextarea(e.target);
        updateCounter();
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', handleUserMessage);
    }

    // Add outside click handler for both mouse and pointer (covers touch, pen, mouse)
    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('pointerdown', handleOutsideClick, { capture: true });
    
    // Initialize mobile keyboard handling
    handleMobileKeyboard();

    // Initial render
    renderMessages();
    updateCounter();
  }

  // Expose public API
  window.AIChatbot = {
    open: toggleWidget,
    close: closeWidget,
    sendMessage: function(content) {
      const input = document.getElementById('ai-chatbot-input');
      if (input) {
        input.value = content;
        handleUserMessage();
      }
    },
    isOpen: function() {
      return isOpen;
    }
  };


  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { 
      initChatbot(); 
      startStatusPolling();
      // Add outside click handler for both mouse and pointer (covers touch, pen, mouse)
      document.addEventListener('click', handleOutsideClick, true);
      document.addEventListener('pointerdown', handleOutsideClick, { capture: true });
    });
  } else {
    initChatbot();
    startStatusPolling();
    // Add outside click handler for both mouse and pointer (covers touch, pen, mouse)
    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('pointerdown', handleOutsideClick, { capture: true });
  }
})();
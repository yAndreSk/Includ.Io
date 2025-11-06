// content/content.js

class IncludIOManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.ally = window.ally; // Carregado pelo manifest
    this.currentUtterance = null;
    this.isReading = false;
    this.isPaused = false;
    this.lastSpokenText = "";
    this.highlightEl = null;
    this.ttsSettings = { rate: 1.0, pitch: 1.0, voiceName: null };

    // Estado visual (sincronizado com visual-injector.js)
    this.visualState = {
      fontSize: 100,
      contrast: 'none',
      readerMode: false,
      clickToRead: false,
    };
    
    // Elementos do Modo de Leitura
    this.readerContainer = null;
    
    this.loadSettings();
    this.initListeners();
  }

  /**
   * Carrega configurações de voz (do cache local)
   */
  loadSettings() {
    chrome.storage.local.get('local_settings', (data) => {
      if (data.local_settings) {
        this.ttsSettings = data.local_settings;
      }
    });
    // Carrega o estado visual salvo para este separador
    chrome.runtime.sendMessage({ action: "LOAD_STATE_FOR_TAB" }, (savedState) => {
        if (savedState) {
            this.visualState = savedState;
        }
    });
    // Ouve por mudanças nas configurações (feitas na pág. de opções)
    chrome.storage.onChanged.addListener((changes) => {
        if(changes.local_settings) {
            this.ttsSettings = changes.local_settings.newValue;
        }
    });
  }

  /**
   * Inicia todos os ouvintes de eventos
   */
  initListeners() {
    // Ouvinte de mensagens (do background e popup)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Para respostas assíncronas
    });

    // Ouvinte para o "Clique para Ouvir"
    document.body.addEventListener('click', this.handleClickToRead.bind(this), true);
  }

  /**
   * Gestor central de mensagens
   */
  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case "TTS_SPEAK_TEXT":
        this.speak(request.text);
        break;
      case "TTS_PLAY_MAIN":
        this.playMainContent();
        break;
      case "TTS_PAUSE":
        this.pause();
        break;
      case "TTS_PLAY_PAUSE": // Atalho de teclado
        this.togglePlayPause();
        break;
      case "TTS_STOP":
        this.stop();
        break;
      case "TOGGLE_READER_MODE":
        this.toggleReaderMode();
        break;
      case "REQUEST_CURRENT_STATE":
        sendResponse({ ...this.visualState, isReading: this.isReading });
        break;
      case "APPLY_VISUAL_STATE":
        this.visualState = request.state;
        this.setReaderMode(this.visualState.readerMode);
        break;
    }
  }

  // --- LÓGICA DE LEITURA (TTS) ---

  speak(text) {
    if (!text) return;
    this.stop(); // Para qualquer fala anterior
    
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.lastSpokenText = text;
    this.isReading = true;
    this.isPaused = false;
    
    // Aplica configurações de voz
    this.currentUtterance.rate = this.ttsSettings.rate;
    this.currentUtterance.pitch = this.ttsSettings.pitch;
    if (this.ttsSettings.voiceName) {
      const voices = this.synth.getVoices();
      const voice = voices.find(v => v.name === this.ttsSettings.voiceName);
      if (voice) this.currentUtterance.voice = voice;
    }

    // Recurso: Destaque de Sentença
    this.currentUtterance.onboundary = (event) => {
      if (event.name === 'sentence') {
        this.highlightText(event.charIndex, event.charLength);
      }
    };

    this.currentUtterance.onend = () => {
      this.isReading = false;
      this.isPaused = false;
      this.removeHighlight();
    };

    this.currentUtterance.onerror = () => {
      this.isReading = false;
      this.isPaused = false;
      this.removeHighlight();
    };
    
    this.synth.speak(this.currentUtterance);
  }

  pause() {
    if (this.isReading && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.isReading = false;
    }
  }

  resume() {
    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.isReading = true;
    }
  }

  stop() {
    this.synth.cancel();
    this.isReading = false;
    this.isPaused = false;
    this.removeHighlight();
  }

  togglePlayPause() {
    if (this.isReading) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.playMainContent(); // Começa do zero
    }
  }

  playMainContent() {
    let contentEl;
    if (this.visualState.readerMode && this.readerContainer) {
      contentEl = this.readerContainer.querySelector('#includio-reader-content');
    } else {
      contentEl = document.querySelector('main') || document.querySelector('article') || document.body;
    }
    
    let text = this.ally.util.getText(contentEl); // ally.js para extrair texto
    text = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').trim();
    this.speak(text);
  }

  // --- LÓGICA DE DESTAQUE ---

  highlightText(charIndex, charLength) {
    this.removeHighlight();
    const sentence = this.lastSpokenText.substring(charIndex, charIndex + charLength);
    if (!sentence) return;
    
    let targetElement = document.body;
    if (this.visualState.readerMode) {
        targetElement = document.getElementById('includio-reader-content');
    }
    
    const paragraphs = targetElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
    let bestMatch = null;
    for(const p of paragraphs) {
        if(p.textContent.includes(sentence)) {
            bestMatch = p;
            break;
        }
    }
    
    if (bestMatch) {
      bestMatch.classList.add('includio-tts-highlight');
      this.highlightEl = bestMatch;
      bestMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  removeHighlight() {
    if (this.highlightEl) {
      this.highlightEl.classList.remove('includio-tts-highlight');
      this.highlightEl = null;
    }
  }
  
  // --- LÓGICA DE CLIQUE-PARA-OUVIR ---

  handleClickToRead(event) {
    if (!this.visualState.clickToRead) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    let target = event.target;
    let blockElement = target.closest('p, h1, h2, h3, h4, li, [role="button"]');
    
    if (blockElement) {
        this.speak(blockElement.textContent);
    }
  }

  // --- LÓGICA DO MODO DE LEITURA ---

  toggleReaderMode() {
    this.setReaderMode(!this.visualState.readerMode);
  }
  
  setReaderMode(enable) {
    this.visualState.readerMode = enable;
    
    if (enable) {
      if (this.readerContainer) return;
      
      const mainContent = document.querySelector('main, article, [role="main"]');
      let contentToClone;
      if (mainContent) {
        contentToClone = mainContent.cloneNode(true);
      } else {
        contentToClone = document.body.cloneNode(true);
        contentToClone.querySelectorAll('nav, aside, footer, header, script, style').forEach(el => el.remove());
      }
      
      this.readerContainer = document.createElement('div');
      this.readerContainer.id = 'includio-reader-container';
      
      const contentDiv = document.createElement('div');
      contentDiv.id = 'includio-reader-content';
      contentDiv.appendChild(contentToClone);
      
      const closeButton = document.createElement('button');
      closeButton.id = 'includio-reader-close';
      closeButton.textContent = 'Fechar Modo de Leitura';
      closeButton.onclick = () => this.setReaderMode(false);
      
      this.readerContainer.appendChild(closeButton);
      this.readerContainer.appendChild(contentDiv);
      document.body.appendChild(this.readerContainer);
      
    } else {
      if (this.readerContainer) {
        this.readerContainer.remove();
        this.readerContainer = null;
      }
    }
    
    // Notifica o injector para aplicar a classe css e salvar o estado
    chrome.runtime.sendMessage({
      action: "APPLY_VISUAL_STATE",
      state: this.visualState
    });
  }
}

window.includioManager = new IncludIOManager();
// content/visual-injector.js

(function() {
  let currentState = {
    fontSize: 100,
    contrast: 'none',
    readerMode: false,
    clickToRead: false
  };

  /**
   * Aplica os estilos visuais ao DOM (<html> e <body>)
   */
  function applyVisuals(state) {
    const html = document.documentElement;
    const body = document.body;
    
    if (!body) return; // O body pode ainda não existir

    // 1. Contraste
    html.setAttribute('data-includio-contrast', state.contrast);

    // 2. Tamanho da Fonte
    const fontScale = state.fontSize / 100;
    html.style.setProperty('--includio-font-scale', fontScale);
    if (state.fontSize !== 100) {
      html.setAttribute('data-includio-font-size', state.fontSize);
    } else {
      html.removeAttribute('data-includio-font-size');
    }

    // 3. Modo de Leitura (aplica/remove classe no <body>)
    if (state.readerMode) {
      body.classList.add('includio-reader-active');
    } else {
      body.classList.remove('includio-reader-active');
    }
    
    // 4. Clique para Ouvir (aplica/remove classe no <body>)
    if (state.clickToRead) {
        body.classList.add('includio-click-to-read');
    } else {
        body.classList.remove('includio-click-to-read');
    }
  }

  // Ouvinte de mensagens do background.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'APPLY_VISUAL_STATE') {
      currentState = { ...currentState, ...request.state };
      applyVisuals(currentState);
      
      // Salva o estado atual para este separador
      chrome.runtime.sendMessage({
        action: "SAVE_STATE_FOR_TAB",
        state: currentState
      });
    }
    return true;
  });

  // Carrega o estado salvo para este separador assim que possível
  chrome.runtime.sendMessage({ action: "LOAD_STATE_FOR_TAB" }, (savedState) => {
    if (savedState) {
      currentState = savedState;
      // Espera o <body> existir para aplicar
      if (document.body) {
        applyVisuals(currentState);
      } else {
        document.addEventListener('DOMContentLoaded', () => applyVisuals(currentState), { once: true });
      }
    }
  });

})();
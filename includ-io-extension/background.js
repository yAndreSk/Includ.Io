// background.js

// 1. VALORES PADRÃO NA INSTALAÇÃO
chrome.runtime.onInstalled.addListener(() => {
  // Configurações globais de voz (armazenadas localmente)
  chrome.storage.local.set({
    'local_settings': {
      voiceName: null,
      rate: 1.0,
      pitch: 1.0
    }
  });
  
  // Menu de contexto
  chrome.contextMenus.create({
    id: "includio_read_selection",
    title: "INCLUD.IO: Ler texto selecionado",
    contexts: ["selection"]
  });
});

// 2. OUVINTE DO MENU DE CONTEXTO
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "includio_read_selection" && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: "TTS_SPEAK_TEXT",
      text: info.selectionText
    });
  }
});

// 3. OUVINTE DOS ATALHOS DE TECLADO
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-reader-mode") {
    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_READER_MODE" });
  }
  if (command === "toggle-tts") {
    chrome.tabs.sendMessage(tab.id, { action: "TTS_PLAY_PAUSE" });
  }
});

// 4. OUVINTE DE MENSAGENS (DO POPUP E CONTENT SCRIPTS)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_TAB_STATE") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "REQUEST_CURRENT_STATE" }, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: "Não é possível comunicar com esta página." });
        } else {
          sendResponse(response);
        }
      });
    });
    return true; // Resposta assíncrona
  }
  
  if (request.action === "UPDATE_VISUAL_STATE") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "APPLY_VISUAL_STATE",
        state: request.state
      });
    });
  }
  
  if (request.action === "TTS_ACTION") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: request.ttsAction 
      });
    });
  }

  // Permite que o content script salve o seu estado
  if (request.action === "SAVE_STATE_FOR_TAB") {
    const tabId = sender.tab.id;
    chrome.storage.local.set({ [`tab_${tabId}_state`]: request.state });
  }
  
  // Permite que o content script carregue o seu estado
  if (request.action === "LOAD_STATE_FOR_TAB") {
    const tabId = sender.tab.id;
    chrome.storage.local.get([`tab_${tabId}_state`], (result) => {
      sendResponse(result[`tab_${tabId}_state`]);
    });
    return true; // Resposta assíncrona
  }
});
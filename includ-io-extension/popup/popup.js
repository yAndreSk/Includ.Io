// popup.js

// Estado local para evitar sobrecarga de mensagens
let currentState = {
  fontSize: 100,
  contrast: 'none',
  readerMode: false,
  clickToRead: false,
  isReading: false
};

// Mapeamento de Elementos da UI
const ui = {
  btnPlayPause: document.getElementById('btnPlayPause'),
  playPauseText: document.getElementById('playPauseText'),
  playPauseIcon: document.querySelector('#btnPlayPause i'),
  btnStop: document.getElementById('btnStop'),
  switchClickToRead: document.getElementById('switchClickToRead'),
  switchReaderMode: document.getElementById('switchReaderMode'),
  selectContrast: document.getElementById('selectContrast'),
  btnFontDecrease: document.getElementById('btnFontDecrease'),
  btnFontReset: document.getElementById('btnFontReset'),
  btnFontIncrease: document.getElementById('btnFontIncrease'),
  fontPercentage: document.getElementById('fontPercentage'),
  btnOptions: document.getElementById('btnOptions')
};

/**
 * Atualiza a UI do popup com base no estado atual
 */
function updateUI() {
  ui.fontPercentage.textContent = `${currentState.fontSize}%`;
  ui.selectContrast.value = currentState.contrast;
  ui.switchReaderMode.checked = currentState.readerMode;
  ui.switchClickToRead.checked = currentState.clickToRead;

  if (currentState.isReading) {
    ui.playPauseText.textContent = "Pausar";
    ui.playPauseIcon.className = "bi bi-pause-fill";
  } else {
    ui.playPauseText.textContent = "Ler";
    ui.playPauseIcon.className = "bi bi-play-fill";
  }
}

/**
 * Envia o estado visual atualizado para o background script
 */
function sendVisualState() {
  const newState = {
    fontSize: currentState.fontSize,
    contrast: currentState.contrast,
    readerMode: currentState.readerMode,
    clickToRead: currentState.clickToRead
  };
  chrome.runtime.sendMessage({
    action: "UPDATE_VISUAL_STATE",
    state: newState
  });
}

/**
 * Envia uma ação de TTS para o background script
 */
function sendTTSAction(ttsAction) {
  chrome.runtime.sendMessage({ action: "TTS_ACTION", ttsAction });
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Carrega o estado atual do separador
  chrome.runtime.sendMessage({ action: "GET_TAB_STATE" }, (response) => {
    if (chrome.runtime.lastError || (response && response.error)) {
      console.warn("Erro ao carregar estado:", chrome.runtime.lastError?.message || response.error);
      document.body.innerHTML = "<div class='p-3 text-center text-muted'>Não é possível ativar o INCLUD.IO nesta página.</div>";
    } else if (response) {
      currentState = { ...currentState, ...response };
      updateUI();
    }
  });

  // 2. Listeners de TTS
  ui.btnPlayPause.addEventListener('click', () => {
    currentState.isReading = !currentState.isReading; 
    updateUI();
    sendTTSAction(currentState.isReading ? "TTS_PLAY_MAIN" : "TTS_PAUSE");
  });

  ui.btnStop.addEventListener('click', () => {
    currentState.isReading = false;
    updateUI();
    sendTTSAction("TTS_STOP");
  });

  ui.switchClickToRead.addEventListener('change', (e) => {
    currentState.clickToRead = e.target.checked;
    sendVisualState(); // Envia o estado atualizado
  });

  // 3. Listeners Visuais
  ui.switchReaderMode.addEventListener('change', (e) => {
    currentState.readerMode = e.target.checked;
    sendVisualState();
  });

  ui.selectContrast.addEventListener('change', (e) => {
    currentState.contrast = e.target.value;
    sendVisualState();
  });

  ui.btnFontIncrease.addEventListener('click', () => {
    currentState.fontSize = Math.min(currentState.fontSize + 10, 200);
    updateUI();
    sendVisualState();
  });
  
  ui.btnFontDecrease.addEventListener('click', () => {
    currentState.fontSize = Math.max(currentState.fontSize - 10, 50);
    updateUI();
    sendVisualState();
  });

  ui.btnFontReset.addEventListener('click', () => {
    currentState.fontSize = 100;
    updateUI();
    sendVisualState();
  });
  
  // 4. Botão de Opções
  ui.btnOptions.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
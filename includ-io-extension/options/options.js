// includ-io-premium/options/options.js

// URL do seu servidor backend Java
const API_BASE_URL = 'http://localhost:8080/api';

// Mapeamento da UI (Elementos Globais)
const ui = {
    voiceSelect: document.getElementById('voice-select'),
    rateSlider: document.getElementById('rate-slider'),
    rateValue: document.getElementById('rate-value'),
    pitchSlider: document.getElementById('pitch-slider'),
    pitchValue: document.getElementById('pitch-value'),
    saveButton: document.getElementById('save-button'),
    saveStatusWrapper: document.getElementById('save-status-wrapper'), // Wrapper de Alerta
    
    // Elementos de Autenticação
    loginContainer: document.getElementById('login-form-container'),
    loggedInContainer: document.getElementById('logged-in-container'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    btnLogin: document.getElementById('btn-login'),
    btnRegister: document.getElementById('btn-register'),
    btnLogout: document.getElementById('btn-logout'),
    authStatusWrapper: document.getElementById('auth-status-wrapper'), // Wrapper de Alerta
    userEmailDisplay: document.getElementById('user-email')
};

const synth = window.speechSynthesis;

// --- 1. LÓGICA DE VOZ (igual antes) ---
function populateVoiceList() {
  const voices = synth.getVoices();
  ui.voiceSelect.innerHTML = '<option value="">Padrão do Navegador</option>';
  for (const voice of voices) {
    if (voice.lang.includes('pt') || voice.lang.includes('en')) {
      const option = document.createElement('option');
      option.textContent = `${voice.name} (${voice.lang})`;
      option.value = voice.name;
      ui.voiceSelect.appendChild(option);
    }
  }
}
populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}
ui.rateSlider.addEventListener('input', () => ui.rateValue.textContent = ui.rateSlider.value);
ui.pitchSlider.addEventListener('input', () => ui.pitchValue.textContent = ui.pitchSlider.value);

// --- 2. NOVAS FUNÇÕES DE FEEDBACK (Spinners e Alertas) ---

/**
 * Mostra um spinner de carregamento num botão
 * @param {HTMLElement} button - O botão a modificar
 */
function showSpinner(button) {
    button.disabled = true;
    button.querySelector('.spinner-border').style.display = 'inline-block';
    button.querySelector('.button-text').style.display = 'none';
}

/**
 * Esconde o spinner e restaura o botão
 * @param {HTMLElement} button - O botão a restaurar
 */
function hideSpinner(button) {
    button.disabled = false;
    button.querySelector('.spinner-border').style.display = 'none';
    button.querySelector('.button-text').style.display = 'inline-block';
}

/**
 * Mostra uma mensagem de alerta (Bootstrap)
 * @param {string} wrapperId - ID do elemento <div> que vai conter o alerta
 * @param {string} message - A mensagem a mostrar
 * @param {string} type - 'success', 'danger', 'warning' (tipos do Bootstrap)
 */
function showAlert(wrapperId, message, type = 'danger') {
    const wrapper = document.getElementById(wrapperId);
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

// --- 3. LÓGICA DE AUTENTICAÇÃO E DADOS (ATUALIZADA) ---

async function updateAuthUI() {
    const userData = await chrome.storage.local.get(['userId', 'userEmail']);
    if (userData.userId && userData.userEmail) {
        ui.loginContainer.style.display = 'none';
        ui.loggedInContainer.style.display = 'block';
        ui.userEmailDisplay.textContent = userData.userEmail;
    } else {
        ui.loginContainer.style.display = 'block';
        ui.loggedInContainer.style.display = 'none';
    }
}

async function callApi(endpoint, method, body = null) {
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return fetch(API_BASE_URL + endpoint, options);
}

async function handleLogin() {
    const email = ui.emailInput.value;
    const password = ui.passwordInput.value;
    showAlert('auth-status-wrapper', 'A tentar login...', 'info'); // Feedback
    showSpinner(ui.btnLogin);

    try {
        const response = await callApi('/auth/login', 'POST', { email, password });
        const data = await response.json();

        if (response.ok) {
            await chrome.storage.local.set({ userId: data.userId, userEmail: email });
            ui.authStatusWrapper.innerHTML = ''; // Limpa alerta
            await updateAuthUI();
            await loadOptions();
        } else {
            showAlert('auth-status-wrapper', `Erro: ${data}`, 'danger');
        }
    } catch (e) {
        showAlert('auth-status-wrapper', 'Erro de conexão com o servidor.', 'danger');
    } finally {
        hideSpinner(ui.btnLogin); // Restaura o botão
    }
}

async function handleRegister() {
    const email = ui.emailInput.value;
    const password = ui.passwordInput.value;
    showAlert('auth-status-wrapper', 'A registar...', 'info');
    showSpinner(ui.btnRegister);

    try {
        const response = await callApi('/auth/register', 'POST', { email, password });
        const data = await response.text();

        if (response.ok) {
            showAlert('auth-status-wrapper', 'Registado com sucesso! Agora faça o login.', 'success');
        } else {
            showAlert('auth-status-wrapper', `Erro: ${data}`, 'danger');
        }
    } catch (e) {
        showAlert('auth-status-wrapper', 'Erro de conexão com o servidor.', 'danger');
    } finally {
        hideSpinner(ui.btnRegister);
    }
}

async function handleLogout() {
    await chrome.storage.local.remove(['userId', 'userEmail']);
    await updateAuthUI();
}

async function saveOptions() {
    const settings = {
        voiceName: ui.voiceSelect.value,
        rate: parseFloat(ui.rateSlider.value),
        pitch: parseFloat(ui.pitchSlider.value),
    };

    showSpinner(ui.saveButton);
    ui.saveStatusWrapper.innerHTML = ''; // Limpa status anterior

    // 1. Salva localmente
    await chrome.storage.local.set({ 'local_settings': settings });
    
    // 2. Tenta salvar na nuvem
    const { userId } = await chrome.storage.local.get('userId');
    if (userId) {
        try {
            const response = await callApi(`/settings/${userId}`, 'POST', settings);
            if (response.ok) {
                showAlert('save-status-wrapper', 'Configurações salvas e sincronizadas!', 'success');
            } else {
                showAlert('save-status-wrapper', 'Configurações salvas e sincronizadas!', 'warning');
            }
        } catch (e) {
             showAlert('save-status-wrapper', 'Salvo localmente (servidor offline).', 'warning');
        }
    } else {
        showAlert('save-status-wrapper', 'Salvo localmente. Faça login para sincronizar.', 'info');
    }
    
    hideSpinner(ui.saveButton); // Restaura o botão
}

async function loadOptions() {
    let settings = null;
    const { userId } = await chrome.storage.local.get('userId');

    if (userId) {
        try {
            const response = await callApi(`/settings/${userId}`, 'GET');
            if (response.ok) {
                settings = await response.json();
                await chrome.storage.local.set({ 'local_settings': settings });
            }
        } catch (e) {
            console.warn("Não foi possível carregar da nuvem, a usar cache local.");
        }
    }
    
    if (!settings) {
        const { local_settings } = await chrome.storage.local.get('local_settings');
        if (local_settings) {
            settings = local_settings;
        }
    }

    if (settings) {
        ui.rateSlider.value = settings.rate || 1.0;
        ui.rateValue.textContent = settings.rate || 1.0;
        ui.pitchSlider.value = settings.pitch || 1.0;
        ui.pitchValue.textContent = settings.pitch || 1.0;
        
        const checkVoices = setInterval(() => {
            if (synth.getVoices().length > 0) {
                clearInterval(checkVoices);
                ui.voiceSelect.value = settings.voiceName || "";
            }
        }, 100);
    }
}

// Inicia tudo
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadOptions();
    
    // Listeners
    ui.saveButton.addEventListener('click', saveOptions);
    ui.btnLogin.addEventListener('click', handleLogin);
    ui.btnRegister.addEventListener('click', handleRegister);
    ui.btnLogout.addEventListener('click', handleLogout);
});
// Main Application Script

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  BIRTHDAY_KEY: 'K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu',
  GOOGLE_FORM_ID: '', // TO BE FILLED BY USER
  APPS_SCRIPT_URL: '', // TO BE FILLED BY USER
  PWA_DISMISS_DAYS: 14,
  STORAGE_KEYS: {
    guestName: 'birthday_guest_name',
    firstVisit: 'birthday_first_visit',
    pwaDismissed: 'birthday_pwa_dismissed'
  }
};

// ============================================
// STORAGE HELPERS
// ============================================

const Storage = {
  getGuestName() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.guestName);
  },

  setGuestName(name) {
    if (name) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.guestName, name);
    }
  },

  getFirstVisit() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.firstVisit);
  },

  setFirstVisit() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.firstVisit, new Date().toISOString());
  },

  isPWADismissed() {
    const dismissed = localStorage.getItem(CONFIG.STORAGE_KEYS.pwaDismissed);
    if (!dismissed) return false;

    const dismissedDate = new Date(dismissed);
    const days = (new Date() - dismissedDate) / (1000 * 60 * 60 * 24);
    if (days > CONFIG.PWA_DISMISS_DAYS) {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.pwaDismissed);
      return false;
    }
    return true;
  },

  setPWADismissed() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.pwaDismissed, new Date().toISOString());
  }
};

// ============================================
// GUEST DETECTION & PERSONALIZATION
// ============================================

function detectAndSetGuestName() {
  let guestName = null;

  // Try URL parameter first
  guestName = window.CryptoUtils?.getGuestNameFromUrl();

  // If not in URL, try localStorage
  if (!guestName) {
    guestName = Storage.getGuestName();
  }

  // If still nothing, ask user
  if (!guestName) {
    guestName = promptGuestName();
  }

  if (guestName) {
    Storage.setGuestName(guestName);
    personalizePageWithName(guestName);
  }

  return guestName;
}

function promptGuestName() {
  const name = prompt('Olá, navegante! Qual é seu nome, nakama? 🏴‍☠️');
  if (name && name.trim()) {
    return name.trim();
  }
  return 'nakama';
}

function personalizePageWithName(name) {
  const guestNameEl = document.getElementById('guest-name');
  if (guestNameEl) {
    guestNameEl.textContent = name;
  }

  const messageNameInput = document.getElementById('message-name');
  if (messageNameInput && !messageNameInput.value) {
    messageNameInput.value = name;
  }
}

// ============================================
// GOOGLE FORMS INTEGRATION
// ============================================

function buildFormUrl(guestName) {
  if (!CONFIG.GOOGLE_FORM_ID) {
    console.warn('GOOGLE_FORM_ID not configured');
    return null;
  }

  const baseUrl = `https://docs.google.com/forms/d/${CONFIG.GOOGLE_FORM_ID}/viewform`;

  // Note: field IDs need to be obtained from the form
  // This is a template - user must fill in the actual entry IDs
  const params = new URLSearchParams({
    'usp': 'pp_url',
    'entry.0': encodeURIComponent(guestName)
  });

  return `${baseUrl}?${params.toString()}`;
}

function openConfirmationForm() {
  const guestName = Storage.getGuestName() || 'nakama';

  if (!CONFIG.GOOGLE_FORM_ID) {
    showErrorMessage('⚠️ Formulário ainda não configurado. Por favor, contate o aniversariante.');
    return;
  }

  const formUrl = buildFormUrl(guestName);

  // Open in new tab/window
  window.open(formUrl, '_blank', 'width=800,height=600');
}

// ============================================
// MESSAGE SUBMISSION (Google Apps Script)
// ============================================

async function submitMessage(event) {
  event.preventDefault();

  const name = document.getElementById('message-name').value.trim();
  const email = document.getElementById('message-email').value.trim();
  const message = document.getElementById('message-text').value.trim();

  if (!name || !message) {
    showErrorMessage('💬 Preencha ao menos seu nome e sua mensagem!');
    return;
  }

  if (!CONFIG.APPS_SCRIPT_URL) {
    showErrorMessage('⚠️ Servidor de mensagens ainda não configurado.');
    return;
  }

  try {
    showLoadingMessage('Enviando seu recado...');

    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
      }),
      mode: 'no-cors'
    });

    // no-cors mode doesn't allow us to read response, but we can show success
    showSuccessMessage('🎯 Seu recado chegou ao Capitão! Obrigado, nakama!');
    document.getElementById('message-form').reset();
    personalizePageWithName(Storage.getGuestName());

  } catch (error) {
    console.error('Message submission error:', error);
    showErrorMessage('💔 Erro ao enviar recado. Tente novamente mais tarde.');
  }
}

// ============================================
// UI FEEDBACK
// ============================================

function showSuccessMessage(msg) {
  const statusEl = document.getElementById('message-status');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.className = 'message-status success show';
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 4000);
  }
}

function showErrorMessage(msg) {
  const statusEl = document.getElementById('message-status');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.className = 'message-status error show';
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 5000);
  }
}

function showLoadingMessage(msg) {
  const statusEl = document.getElementById('message-status');
  if (statusEl) {
    statusEl.textContent = msg;
    statusEl.className = 'message-status show';
  }
}

// ============================================
// PWA INSTALL PROMPT
// ============================================

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showPWAPrompt();
});

function showPWAPrompt() {
  if (Storage.isPWADismissed() || !deferredPrompt) {
    return;
  }

  const pwaPrompt = document.getElementById('pwa-prompt');
  if (pwaPrompt) {
    pwaPrompt.setAttribute('aria-hidden', 'false');
  }
}

function hidePWAPrompt() {
  const pwaPrompt = document.getElementById('pwa-prompt');
  if (pwaPrompt) {
    pwaPrompt.setAttribute('aria-hidden', 'true');
  }
}

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed');
        hidePWAPrompt();
      }
      deferredPrompt = null;
    });
  }
}

window.addEventListener('appinstalled', () => {
  console.log('PWA app installed');
  deferredPrompt = null;
  hidePWAPrompt();
});

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './' })
        .then((reg) => {
          console.log('Service Worker registered:', reg);
        })
        .catch((error) => {
          console.warn('Service Worker registration failed:', error);
        });
    });
  }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
  // RSVP Buttons
  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', openConfirmationForm);
  }

  const maybeBtn = document.getElementById('maybe-btn');
  if (maybeBtn) {
    maybeBtn.addEventListener('click', openConfirmationForm);
  }

  // Message Form
  const messageForm = document.getElementById('message-form');
  if (messageForm) {
    messageForm.addEventListener('submit', submitMessage);
  }

  // Character Counter
  const messageText = document.getElementById('message-text');
  if (messageText) {
    messageText.addEventListener('input', updateCharCount);
  }

  // PWA Prompt Controls
  const pwaInstall = document.getElementById('pwa-install');
  if (pwaInstall) {
    pwaInstall.addEventListener('click', installPWA);
  }

  const pwaLater = document.getElementById('pwa-later');
  if (pwaLater) {
    pwaLater.addEventListener('click', () => {
      Storage.setPWADismissed();
      hidePWAPrompt();
    });
  }

  const pwaClose = document.getElementById('pwa-close');
  if (pwaClose) {
    pwaClose.addEventListener('click', () => {
      Storage.setPWADismissed();
      hidePWAPrompt();
    });
  }
}

function updateCharCount() {
  const messageText = document.getElementById('message-text');
  const charCount = document.getElementById('char-count');
  if (charCount) {
    charCount.textContent = messageText.value.length;
  }
}

// ============================================
// INITIALIZATION
// ============================================

function initialize() {
  // Set first visit if needed
  if (!Storage.getFirstVisit()) {
    Storage.setFirstVisit();
  }

  // Detect and personalize guest name
  detectAndSetGuestName();

  // Setup event listeners
  setupEventListeners();

  // Register service worker for PWA
  registerServiceWorker();

  // Log initialization
  console.log('🏴‍☠️ Festa Pirata initialized!');
}

// Run initialization on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Debug mode - check config
console.log('Birthday App Config:', {
  hasFormId: !!CONFIG.GOOGLE_FORM_ID,
  hasAppsScriptUrl: !!CONFIG.APPS_SCRIPT_URL
});

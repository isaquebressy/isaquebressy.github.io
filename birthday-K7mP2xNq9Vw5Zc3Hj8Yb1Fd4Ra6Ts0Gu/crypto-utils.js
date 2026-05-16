// Crypto Utils - Simple encryption for guest names in URL
// Uses Base64 + XOR for privacy (not security)

const CIPHER_KEY = 'onepiece2026';

function xorString(str, key) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

function encryptName(name, key = CIPHER_KEY) {
  if (!name || typeof name !== 'string') return null;
  try {
    const trimmed = name.trim().toLowerCase();
    const xored = xorString(trimmed, key);
    const base64 = btoa(xored);
    return base64;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

function decryptName(encrypted, key = CIPHER_KEY) {
  if (!encrypted || typeof encrypted !== 'string') return null;
  try {
    const xored = atob(encrypted);
    const decrypted = xorString(xored, key);
    return decrypted.charAt(0).toUpperCase() + decrypted.slice(1);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

function getGuestNameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encrypted = params.get('guest');
  if (encrypted) {
    return decryptName(encrypted);
  }
  return null;
}

// Export for use
window.CryptoUtils = {
  encryptName,
  decryptName,
  getGuestNameFromUrl
};

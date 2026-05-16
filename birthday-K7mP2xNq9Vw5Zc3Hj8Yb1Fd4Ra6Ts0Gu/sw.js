// Service Worker for PWA - Festa Pirata

const CACHE_NAME = 'birthday-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './crypto-utils.js',
  './manifest.json',
  './img/pwa/icon-192.png',
  './img/pwa/icon-512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - cache-first for assets, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-https and localhost (localhost for dev)
  if (!url.protocol.startsWith('http') && url.hostname !== 'localhost') {
    return;
  }

  // Cache-first strategy for local assets
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Return offline fallback if available
          return caches.match(request) || offlineFallback();
        });
      })
    );
    return;
  }

  // Network-first for external APIs (Google Forms, Apps Script, Maps)
  if (url.hostname.includes('google') || url.hostname.includes('googleapis')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request) || offlineFallback();
      })
    );
    return;
  }

  // Default: network with fallback to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request) || offlineFallback();
    })
  );
});

function offlineFallback() {
  // Return a simple offline page if main page is not cached
  return new Response(
    '<html><body><h1>🏴‍☠️ Sem Internet</h1><p>Parece que você perdeu a conexão! Tente novamente quando a internet voltar.</p></body></html>',
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }
  );
}

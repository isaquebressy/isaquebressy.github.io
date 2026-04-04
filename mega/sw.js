/* Super Mega — service worker (cache de shell + dados locais) */
var CACHE_NAME = 'mega-pwa-v10';
var BOOTSTRAP_CSS =
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';

var PRECACHE_LOCAL_URLS = [
	'./',
	'./index.html',
	'./style.css',
	'./js/angular.min.js',
	'./manifest.json',
	'./img/icos_loterias.png',
	'./img/pwa/icon-192.png',
	'./img/pwa/icon-512.png',
	'./data/games/index.json',
	'./data/games/all.json',
	'./data/games/mega-sena.json',
	'./data/games/lotofacil.json',
	'./data/games/quina.json',
	'./data/games/lotomania.json'
];

function precacheLocalParallel(cache) {
	return Promise.all(
		PRECACHE_LOCAL_URLS.map(function (url) {
			return cache.add(url).catch(function () {});
		})
	);
}

function precache() {
	return caches.open(CACHE_NAME).then(function (cache) {
		return precacheLocalParallel(cache).then(function () {
			return cache.add(BOOTSTRAP_CSS).catch(function () {});
		});
	});
}

self.addEventListener('install', function (event) {
	event.waitUntil(
		precache().then(function () {
			return self.skipWaiting();
		})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches
			.keys()
			.then(function (keys) {
				return Promise.all(
					keys.map(function (key) {
						if (key !== CACHE_NAME) {
							return caches.delete(key);
						}
					})
				);
			})
			.then(function () {
				return self.clients.claim();
			})
	);
});

function isAnalyticsOrAd(url) {
	var h = url.hostname;
	return (
		h === 'www.google-analytics.com' ||
		h === 'www.googletagmanager.com' ||
		h === 'pagead2.googlesyndication.com' ||
		h === 'googleads.g.doubleclick.net' ||
		h === 'securepubads.g.doubleclick.net'
	);
}

self.addEventListener('fetch', function (event) {
	var req = event.request;
	if (req.method !== 'GET') {
		return;
	}
	var url = new URL(req.url);
	if (isAnalyticsOrAd(url)) {
		return;
	}

	event.respondWith(
		caches.match(req).then(function (cached) {
			if (cached) {
				return cached;
			}
			if (req.mode === 'navigate') {
				var indexUrl = new URL('index.html', self.registration.scope).href;
				return caches.match(indexUrl).then(function (page) {
					if (page) {
						return page;
					}
					return fetch(req);
				});
			}
			return fetch(req)
				.then(function (res) {
					if (!res || res.status !== 200 || res.type === 'opaque') {
						return res;
					}
					if (url.origin === self.location.origin) {
						var copy = res.clone();
						caches.open(CACHE_NAME).then(function (cache) {
							cache.put(req, copy);
						});
					}
					return res;
				})
				.catch(function () {
					if (req.mode === 'navigate') {
						return caches.match(
							new URL('index.html', self.registration.scope).href
						);
					}
				});
		})
	);
});

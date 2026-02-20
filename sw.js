const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/main.js',
  '/config.js',
  '/utils.js',
  '/api.js',
  '/ui-controller.js',
  '/map-manager.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.Default.css',
  'https://cdn.jsdelivr.net/gh/trafforddatalab/leaflet.reachability@v2.0.1/leaflet.reachability.css',
  'https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js',
  'https://cdn.jsdelivr.net/gh/trafforddatalab/leaflet.reachability@v2.0.1/leaflet.reachability.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://unpkg.com/@turf/turf@6/turf.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);
  const isCoreAsset = CORE_ASSETS.includes(req.url);
  const isNavigation = req.mode === 'navigate' && url.origin === self.location.origin;

  // Only intercept:
  // - navigation requests for our own origin (app shell)
  // - explicitly pre-cached core assets (CDN libs)
  // Let everything else (e.g. remote basemap tiles) go straight to network.
  if (!isCoreAsset && !isNavigation) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(req);
    }).catch(() => {
      if (isNavigation) {
        return caches.match('/index.html');
      }
      return new Response('', { status: 503, statusText: 'Offline' });
    })
  );
});

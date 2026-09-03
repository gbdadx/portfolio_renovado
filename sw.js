const CACHE_NAME = 'proyectos-v2'; // subí este número cada vez que cambies index.html
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/custom.css',
  './assets/img/Orange-Favicon.png',
  './assets/img/descarga.png',
  './assets/img/historiaclinica.png',
  './assets/img/radio.png',
  './assets/img/foto-perfilGrande.png',
  './assets/img/untref.png',
  './assets/img/listaTAreas.png',
  './assets/img/bancoM.png',
  './assets/img/criptoCompare.png',
  './assets/img/funWflags.png'
];

// Instala el Service Worker y guarda los archivos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activa el Service Worker y limpia cachés viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

// CACHE-FIRST: responde al instante con lo ya guardado en el teléfono
// (sin importar la conexión), y en segundo plano busca una versión nueva
// ignorando el caché normal del navegador.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const networkFetch = fetch(e.request, { cache: 'no-cache' })
        .then((response) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, response.clone()));
          return response;
        })
        .catch(() => cached || caches.match('./index.html'));
      return cached || networkFetch;
    })
  );
});
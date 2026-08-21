/* EFPA EFA · Service Worker
   Guarda la app en el dispositivo para que funcione SIN CONEXIÓN.
   Al publicar una versión nueva, sube el número de VERSION. */

const VERSION = 'efpa-efa-v43';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Las llamadas al grupo de estudio SIEMPRE van a la red, nunca a la caché.
  if (url.hostname.endsWith('supabase.co')) return;
  if (e.request.method !== 'GET') return;

  // Para la app: primero caché (arranque instantáneo), y se refresca por detrás.
  e.respondWith(
    caches.match(e.request).then(hit => {
      const red = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copia = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, copia));
        }
        return res;
      }).catch(() => hit);
      return hit || red;
    })
  );
});

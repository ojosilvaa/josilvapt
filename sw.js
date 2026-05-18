const CACHE_NAME = 'josilvaPT-v7';
const CACHE_FILES = [
  './',
  './aluno.html',
  './admin.html',
  './logo.jpg',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  './manifest-admin.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Never cache API calls
  if (
    url.includes('supabase.co') ||
    url.includes('anthropic.com') ||
    url.includes('googleapis.com/identitytoolkit') ||
    e.request.method !== 'GET'
  ) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Network-first, cache fallback
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('push', e => {
  if (!e.data) return;
  let data;
  try { data = e.data.json(); } catch(ex) { data = { title: 'Jo Silva PT', body: e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'Jo Silva PT', {
      body: data.body || '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'pt-resposta'
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('aluno.html') && 'focus' in c) return c.focus();
      }
      return clients.openWindow('./aluno.html');
    })
  );
});

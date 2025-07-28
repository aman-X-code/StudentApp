const STATIC_CACHE = 'eduhub-static-v1';
const DYNAMIC_CACHE = 'eduhub-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        const clone = fetchResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, clone);
        });
        return fetchResponse;
      });
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from EduHub!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
    actions: [
      { action: 'explore', title: 'View Details', icon: '/pwa-192x192.png' },
      { action: 'close', title: 'Close', icon: '/pwa-192x192.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('EduHub - Student App', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log('Notification clicked:', event);

  if (event.action === 'explore' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('/');
      })
    );
  }
});

// ✅ Message from React app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, ...rest } = event.data;

    const options = {
      body: rest.body || 'Notification from EduHub!',
      icon: rest.icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      silent: false,
      data: rest.data || { dateOfArrival: Date.now() },
      actions: rest.actions || [
        { action: 'explore', title: 'View Details' },
        { action: 'close', title: 'Close' }
      ],
      tag: 'eduhub-notification-' + Date.now()
    };

    self.registration.showNotification(title || 'EduHub Notification', options)
      .then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
      .catch((error) => {
        console.error('Notification failed:', error);
        event.ports[0]?.postMessage({ success: false, error: error.message });
      });
  }
});

async function doBackgroundSync() {
  console.log('Background sync triggered');
}

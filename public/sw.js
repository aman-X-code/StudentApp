const CACHE_NAME = 'eduhub-v1.0.0';
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
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch((error) => {
      console.error('Service Worker: Cache installation failed:', error);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // API requests - Network first strategy
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Static assets - Cache first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Enhanced push notifications with mobile compatibility
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let notificationData = {
    title: 'EduHub - Student App',
    body: 'New notification from EduHub!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png'
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.log('Service Worker: Using text data from push:', event.data.text());
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    },
    requireInteraction: true,
    silent: false,
    tag: 'eduhub-push-' + Date.now(),
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/pwa-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
      .then(() => {
        console.log('Service Worker: Push notification displayed successfully');
      })
      .catch((error) => {
        console.error('Service Worker: Failed to show push notification:', error);
      })
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Try to focus existing window first
          for (const client of clientList) {
            if (client.url === self.location.origin && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window if no existing window found
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
        .catch((error) => {
          console.error('Service Worker: Error handling notification click:', error);
        })
    );
  } else if (event.action === 'close') {
    // Just close the notification (already done above)
    console.log('Service Worker: Notification closed by user');
  } else {
    // Default click (no action button)
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === self.location.origin && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
        .catch((error) => {
          console.error('Service Worker: Error handling default notification click:', error);
        })
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);

  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data;
    
    const options = {
      body: body || 'Notification from EduHub',
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        url: '/'
      },
      requireInteraction: true,
      silent: false,
      tag: 'eduhub-message-' + Date.now(),
      actions: [
        { action: 'explore', title: 'View Details' },
        { action: 'close', title: 'Close' }
      ]
    };

    self.registration.showNotification(title || 'EduHub Notification', options)
      .then(() => {
        console.log('Service Worker: Message notification displayed successfully');
        // Send success response back to main thread
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      })
      .catch((error) => {
        console.error('Service Worker: Failed to show message notification:', error);
        // Send error response back to main thread
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: false, error: error.message });
        }
      });
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    console.log('Service Worker: Performing background sync');
    // Implement your background sync logic here
    // For example: sync offline data, update cache, etc.
    
    // Example: Show a notification about completed sync
    const options = {
      body: 'Your data has been synchronized',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'sync-complete',
      requireInteraction: false,
      silent: true
    };
    
    await self.registration.showNotification('EduHub - Sync Complete', options);
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}
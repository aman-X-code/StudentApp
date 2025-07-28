import { useState, useEffect } from 'react';

interface NotificationHook {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export const useNotifications = (): NotificationHook => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported] = useState('Notification' in window && 'serviceWorker' in navigator);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      if (isSupported) {
        setPermission(Notification.permission);
        console.log('Notification support detected:', isSupported);
        console.log('Current permission:', Notification.permission);

        // Initialize service worker
        if ('serviceWorker' in navigator) {
          try {
            let registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
              registration = await navigator.serviceWorker.register('/sw.js');
              console.log('Service Worker registered:', registration);
            }
            
            // Wait for service worker to be ready
            registration = await navigator.serviceWorker.ready;
            setSwRegistration(registration);
            console.log('Service Worker ready:', registration);
          } catch (error) {
            console.error('Service Worker registration failed:', error);
          }
        }
      }
    };

    initializeNotifications();
  }, [isSupported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      console.log('Notifications not supported');
      return 'denied';
    }

    try {
      console.log('Requesting notification permission...');
      const result = await Notification.requestPermission();
      console.log('Permission result:', result);
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions): void => {
    console.log('Attempting to send notification:', { title, options, permission });
    
    if (!isSupported || permission !== 'granted') {
      console.log('Cannot send notification - not supported or permission denied');
      return;
    }

    // Enhanced mobile support - same options for all devices
    const defaultOptions: NotificationOptions = {
      body: options?.body || 'New notification from EduHub',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      data: { dateOfArrival: Date.now() },
      requireInteraction: true,
      silent: false,
      tag: 'eduhub-notification-' + Date.now(),
    };

    const mergedOptions: NotificationOptions = {
      ...defaultOptions,
      ...options,
    };

    // Method 1: Try Service Worker notification first (works on all devices including mobile)
    if (navigator.serviceWorker && swRegistration) {
      console.log('Sending service worker notification...');
      
      // Enhanced options for service worker notifications
      const swOptions = {
        ...mergedOptions,
        actions: [
          { action: 'explore', title: 'View Details' },
          { action: 'close', title: 'Close' }
        ]
      };

      navigator.serviceWorker.ready
        .then((registration) => {
          return registration.showNotification(title, swOptions);
        })
        .then(() => {
          console.log('Service worker notification sent successfully');
        })
        .catch((error) => {
          console.warn('Service worker notification failed, trying direct notification:', error);
          
          // Method 2: Fallback to direct Notification API (remove actions as they're not supported)
          const { actions, ...safeOptions } = mergedOptions;
          try {
            const notification = new Notification(title, safeOptions);
            
            notification.onclick = () => {
              console.log('Direct notification clicked');
              window.focus();
              notification.close();
            };

            // Auto close after 8 seconds
            setTimeout(() => {
              notification.close();
            }, 8000);

            console.log('Direct notification sent successfully');
          } catch (directError) {
            console.error('Direct notification also failed:', directError);
          }
        });
    } else {
      // Method 2: Direct Notification API (no service worker available)
      console.log('Service worker not available, using direct notification API');
      
      const { actions, ...safeOptions } = mergedOptions;
      try {
        const notification = new Notification(title, safeOptions);
        
        notification.onclick = () => {
          console.log('Direct notification clicked');
          window.focus();
          notification.close();
        };

        // Auto close after 8 seconds
        setTimeout(() => {
          notification.close();
        }, 8000);

        console.log('Direct notification sent successfully');
      } catch (error) {
        console.error('Direct notification failed:', error);
      }
    }
  };

  return { permission, requestPermission, sendNotification, isSupported };
};
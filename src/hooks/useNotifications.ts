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

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const sendNotification = (title: string, options?: NotificationOptions): void => {
    if (!isSupported || permission !== 'granted') return;

    // Enhanced mobile support
    const defaultOptions: NotificationOptions = {
      body: 'New notification from EduHub',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200], // Stronger vibration for mobile
      data: { dateOfArrival: Date.now() },
      requireInteraction: true, // Keep notification visible until user interacts
      silent: false, // Ensure sound plays on mobile
    };

    const mergedOptions: NotificationOptions = {
      ...defaultOptions,
      ...options,
    };

    // Check if we're on mobile and service worker is available
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (navigator.serviceWorker && navigator.serviceWorker.controller && !isMobile) {
      // ✅ Use SW-based persistent notification with actions
      mergedOptions.actions = [
        { action: 'explore', title: 'View Details' },
        { action: 'close', title: 'Close' }
      ];

      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, mergedOptions);
        })
        .catch((err) => {
          console.warn('SW not ready, fallback to direct notification', err);
          // Remove actions for direct notification API
          const { actions, ...safeOptions } = mergedOptions;
          new Notification(title, safeOptions);
        });
    } else {
      // ❌ actions not allowed in direct Notification API — remove them
      const { actions, ...safeOptions } = mergedOptions;
      try {
        new Notification(title, safeOptions);
      } catch (error) {
        console.error('Direct notification failed:', error);
        // Could implement fallback UI notification here
      }
    }
  };

  return { permission, requestPermission, sendNotification, isSupported };
};

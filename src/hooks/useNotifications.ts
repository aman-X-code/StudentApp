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

    const defaultOptions: NotificationOptions = {
      body: 'New notification from EduHub',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      data: { dateOfArrival: Date.now() },
    };

    const mergedOptions: NotificationOptions = {
      ...defaultOptions,
      ...options,
    };

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
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
          new Notification(title, mergedOptions);
        });
    } else {
      // ❌ actions not allowed in direct Notification API — remove them
      const { actions, ...safeOptions } = mergedOptions;
      new Notification(title, safeOptions);
    }
  };

  return { permission, requestPermission, sendNotification, isSupported };
};

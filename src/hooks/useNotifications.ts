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
      data: { dateOfArrival: Date.now() }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      // ✅ Use SW for persistent notification
      mergedOptions.actions = [
        { action: 'explore', title: 'View Details' },
        { action: 'close', title: 'Close' }
      ];

      navigator.serviceWorker.ready
        .then(reg => reg.showNotification(title, mergedOptions))
        .catch(err => {
          console.warn('SW not ready, fallback to basic Notification:', err);
          const { actions, ...fallbackOptions } = mergedOptions;
          new Notification(title, fallbackOptions);
        });
    } else {
      // ❌ Remove `actions` for non-persistent
      const { actions, ...safeOptions } = mergedOptions;
      new Notification(title, safeOptions);
    }
  };

  return { permission, requestPermission, sendNotification, isSupported };
};

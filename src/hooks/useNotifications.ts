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

    navigator.serviceWorker.ready.then((registration) => {
      const defaultOptions: NotificationOptions = {
        body: 'New notification from EduHub',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        vibrate: [100, 50, 100],
        data: { dateOfArrival: Date.now() },
        actions: [
          { action: 'explore', title: 'View Details' },
          { action: 'close', title: 'Close' }
        ]
      };

      registration.showNotification(title, { ...defaultOptions, ...options });
    });
  };

  return { permission, requestPermission, sendNotification, isSupported };
};
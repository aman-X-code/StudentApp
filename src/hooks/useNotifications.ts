import { useState, useEffect } from 'react';

interface NotificationHook {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  isSupported: boolean;
}

export const useNotifications = (): NotificationHook => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const isSupported = 'Notification' in window && 'serviceWorker' in navigator;

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

  const sendNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
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
      actions: [
        { action: 'explore', title: 'View Details' },
        { action: 'close', title: 'Close' }
      ]
    };

    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, mergedOptions);
    } catch (err) {
      console.error('❌ Failed to show notification via service worker:', err);
    }
  };

  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Test Notification', { body: 'This is a direct test.' });
      }
    });
  }

  return { permission, requestPermission, sendNotification, isSupported };
};

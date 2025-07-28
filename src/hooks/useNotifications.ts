import { useState, useEffect } from 'react';

interface NotificationHook {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  isSupported: boolean;
}

export const useNotifications = (): NotificationHook => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      navigator.serviceWorker.getRegistration().then(async (reg) => {
        if (!reg) {
          try {
            const registered = await navigator.serviceWorker.register('/sw.js');
            const ready = await navigator.serviceWorker.ready;
            setSwRegistration(ready);
            console.log('Service Worker registered and ready');
          } catch (err) {
            console.error('Service Worker registration failed:', err);
          }
        } else {
          setSwRegistration(reg);
        }
      });
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const sendNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Notifications not supported or permission not granted');
      return;
    }

    const defaultOptions: NotificationOptions = {
      body: 'New notification from EduHub!',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      silent: false,
      data: { dateOfArrival: Date.now() },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      if (swRegistration && swRegistration.active) {
        const messageChannel = new MessageChannel();

        const success = await new Promise<boolean>((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data?.success ?? false);
          };

          swRegistration.active!.postMessage(
            {
              type: 'SHOW_NOTIFICATION',
              title,
              ...mergedOptions,
            },
            [messageChannel.port2]
          );

          // Fallback timeout
          setTimeout(() => resolve(false), 5000);
        });

        if (!success) {
          new Notification(title, mergedOptions);
        }
      } else {
        new Notification(title, mergedOptions);
      }
    } catch (err) {
      console.error('Notification failed:', err);
    }
  };

  return { permission, requestPermission, sendNotification, isSupported };
};

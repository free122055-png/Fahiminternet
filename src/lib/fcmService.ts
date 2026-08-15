import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app, db, auth } from './firebase';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

let messagingInstance: any = null;

export async function getFcmMessaging() {
  if (typeof window === 'undefined') return null;
  if (messagingInstance) return messagingInstance;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('FCM Messaging is not supported in this environment.');
      return null;
    }
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (err) {
    console.warn('Error getting FCM messaging instance:', err);
    return null;
  }
}

export async function requestFcmToken(userId?: string, forcePrompt: boolean = false): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const effectiveUserId = userId || auth.currentUser?.phoneNumber || auth.currentUser?.uid || 'guest';
  const cleanUserId = effectiveUserId.replace(/[^a-zA-Z0-9_@.-]/g, '');

  try {
    // 1. Check if running on Native Android (Capacitor Play Store App)
    if (Capacitor.isNativePlatform()) {
      console.log('Running on Native Android Platform. Requesting Native Push Permissions...');
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('Native Android notification permission not granted:', permStatus);
        return null;
      }

      await PushNotifications.register();

      return new Promise((resolve) => {
        PushNotifications.removeAllListeners();

        PushNotifications.addListener('registration', async (token) => {
          console.log('Native Android FCM Token obtained:', token.value.substring(0, 15) + '...');
          try {
            await setDoc(doc(db, 'fcm_tokens', token.value), {
              token: token.value,
              userId: cleanUserId,
              rawUserId: effectiveUserId,
              updatedAt: serverTimestamp(),
              platform: 'android-native-playstore',
              userAgent: navigator.userAgent
            }, { merge: true });
          } catch (firestoreErr) {
            console.warn('Failed to save native FCM token to Firestore:', firestoreErr);
          }
          resolve(token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.warn('Native Android FCM registration error:', JSON.stringify(error));
          resolve(null);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Native Android FCM notification received in foreground:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Native Android FCM notification action performed:', notification);
          const data = notification.notification.data;
          if (data?.url) {
            window.location.href = data.url;
          }
        });
      });
    }

    // 2. Fallback for Web Browser / PWA
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser.');
      return null;
    }

    if (Notification.permission === 'default' && !forcePrompt) {
      console.log('Skipping FCM request to prevent auto-prompt. Prompt from UI instead.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted:', permission);
      return null;
    }

    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let reg of registrations) {
          if (reg.active?.scriptURL.includes('firebase-messaging-sw.js')) {
            await reg.update();
            swRegistration = reg;
          }
        }
        
        if (!swRegistration) {
          swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }
        swRegistration = await navigator.serviceWorker.ready;
      } catch (e) {
        console.warn('SW registration error:', e);
      }
    }

    const messaging = await getFcmMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      serviceWorkerRegistration: swRegistration
    });

    if (token) {
      console.log('Web FCM Token obtained:', token.substring(0, 15) + '...');
      try {
        await setDoc(doc(db, 'fcm_tokens', token), {
          token,
          userId: cleanUserId,
          rawUserId: effectiveUserId,
          updatedAt: serverTimestamp(),
          platform: 'web-browser',
          userAgent: navigator.userAgent
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn('Failed to save Web FCM token to Firestore:', firestoreErr);
      }

      return token;
    } else {
      console.warn('No FCM token available.');
      return null;
    }
  } catch (err) {
    console.warn('An error occurred while retrieving FCM token:', err);
    return null;
  }
}

export async function initFcm(userId?: string) {
  if (typeof window === 'undefined') return;

  const token = await requestFcmToken(userId);

  if (!Capacitor.isNativePlatform()) {
    const messaging = await getFcmMessaging();
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Foreground FCM Message received:', payload);
        const title = payload.notification?.title || payload.data?.title || 'ফাহিম ইন্টারনেট';
        const message = payload.notification?.body || payload.data?.body || '';
        sendLocalNotification(title, message);
      });
    }
  }

  return token;
}

export async function sendLocalNotification(title: string, message: string) {
  if (typeof window === 'undefined') return;

  if (!('Notification' in window)) {
    console.warn('Notification API not supported');
    return;
  }

  try {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        try {
          let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
          if (!registration) {
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          }
          if (registration && registration.showNotification) {
            const options: any = {
              body: message,
              icon: '/favicon-192x192.png',
              badge: '/favicon-192x192.png',
              vibrate: [200, 100, 200],
              tag: 'fahim-internet-' + Date.now(),
              data: { url: '/' }
            };
            await registration.showNotification(title, options);
            return;
          }
        } catch (swErr) {
          console.warn('SW showNotification error:', swErr);
        }
      }

      try {
        new Notification(title, {
          body: message,
          icon: '/favicon-192x192.png',
          badge: '/favicon-192x192.png'
        });
      } catch (e) {
        console.warn('Window Notification error:', e);
      }
    }
  } catch (err) {
    console.warn('sendLocalNotification error:', err);
  }
}


import OneSignal from '@onesignal/capacitor-plugin';
import { Capacitor } from '@capacitor/core';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

const ONESIGNAL_APP_ID = (import.meta as any).env.VITE_ONESIGNAL_APP_ID || 'f23b5d21-4821-4148-b4b1-e23456789abc';

export async function initOneSignal(userId?: string) {
  if (typeof window === 'undefined') return;

  try {
    if (Capacitor.isNativePlatform()) {
      console.log('Initializing OneSignal for Native Android...');
      
      // Initialize OneSignal
      await OneSignal.initialize(ONESIGNAL_APP_ID);

      // Request Notification Permission (Android 13+)
      const permissionGranted = await OneSignal.Notifications.requestPermission(true);
      console.log('OneSignal notification permission granted:', permissionGranted);

      // Login / Identify user if logged in
      const effectiveUserId = userId || auth.currentUser?.phoneNumber || auth.currentUser?.uid || 'guest';
      const cleanUserId = effectiveUserId.replace(/[^a-zA-Z0-9_@.-]/g, '');
      await OneSignal.login(cleanUserId);

      // Get Subscription ID / Device Token
      const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
      const optedIn = await OneSignal.User.pushSubscription.getOptedInAsync();

      console.log('OneSignal Subscription ID:', subscriptionId);
      console.log('OneSignal Opted In:', optedIn);

      // Save to Firestore for admin tracking
      if (subscriptionId) {
        try {
          await setDoc(doc(db, 'onesignal_subscriptions', subscriptionId), {
            subscriptionId,
            userId: cleanUserId,
            optedIn,
            updatedAt: serverTimestamp(),
            platform: 'android-onesignal'
          }, { merge: true });
        } catch (dbErr) {
          console.warn('Failed to save OneSignal subscription to Firestore:', dbErr);
        }
      }

      // Add click listener
      OneSignal.Notifications.addEventListener('click', (event) => {
        console.log('OneSignal notification clicked:', event);
        const data = event.notification.additionalData;
        if (data && (data as any).url) {
          window.location.href = (data as any).url;
        }
      });

      return subscriptionId;
    } else {
      console.log('OneSignal Native SDK active on mobile apps. Web environment uses server proxy.');
    }
  } catch (err) {
    console.error('Error initializing OneSignal:', err);
  }
  return null;
}

export async function sendOneSignalNotification(title: string, message: string, userId: string = 'all') {
  const response = await fetch('/api/onesignal/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, message, userId })
  });
  return await response.json();
}

export async function triggerLoginNotification(userId: string) {
  try {
    await fetch('/api/notifications/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch (e) {
    console.warn('Login notification trigger error:', e);
  }
}

export async function triggerPaymentNotification(userId: string) {
  try {
    await fetch('/api/notifications/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch (e) {
    console.warn('Payment notification trigger error:', e);
  }
}

export async function triggerRechargeNotification(userId: string) {
  try {
    await fetch('/api/notifications/recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  } catch (e) {
    console.warn('Recharge notification trigger error:', e);
  }
}


importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAvAsDpGMaPHD3yZVwu5NM5exjmEJWxK7w",
  authDomain: "gen-lang-client-0777100836.firebaseapp.com",
  projectId: "gen-lang-client-0777100836",
  storageBucket: "gen-lang-client-0777100836.firebasestorage.app",
  messagingSenderId: "812848601619",
  appId: "1:812848601619:web:437b098a70a186eda23de6"
});

const messaging = firebase.messaging();

// Handle background messages manually to ensure showNotification always runs and satisfies Chrome
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const title = payload.notification?.title || payload.data?.title || 'Fahim Internet';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'নতুন নোটিফিকেশন এসেছে।',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png',
    data: { url: payload.data?.url || '/' }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

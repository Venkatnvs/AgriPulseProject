importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: 'AIzaSyD1F7uVpn27xz5d0mKTsLb6c0ROVz0kO48',
  authDomain: 'krishi-pragya.firebaseapp.com',
  projectId: 'krishi-pragya',
  messagingSenderId: '363665919312',
  appId: '1:363665919312:web:62d022a1f50b36db607055',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || './small_logo.png',
    click_action: payload.data.click_action || 'https://nvs-krishi-pragya.vercel.app/',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click event: ', event);

  event.notification.close();

  const urlToOpen = event.notification?.data?.click_action || 'https://nvs-krishi-pragya.vercel.app/';
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
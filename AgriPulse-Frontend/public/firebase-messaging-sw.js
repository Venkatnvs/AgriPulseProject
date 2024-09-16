importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyD1F7uVpn27xz5d0mKTsLb6c0ROVz0kO48',
    authDomain: 'krishi-pragya.firebaseapp.com',
    projectId: 'krishi-pragya',
    storageBucket: 'krishi-pragya.appspot.com',
    messagingSenderId: '363665919312',
    appId: '1:363665919312:web:62d022a1f50b36db607055',
    measurementId: 'G-Y8LFY8FBWK',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './small_logo.png',  // Ensure this path is correct
    data: payload.data  // Ensure data is correctly handled
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.click_action || 'https://nvs-krishi-pragya.vercel.app/';
  event.waitUntil(
    clients.openWindow(url)
  );
});
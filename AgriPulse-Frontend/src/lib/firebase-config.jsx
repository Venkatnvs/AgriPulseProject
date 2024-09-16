import { firebaseConfig, VAPID_KEY } from '@/constants/FirebaseContants';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (callback) => {
  console.log('Requesting permission...');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Notification permission not granted.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log('Current token for client:', currentToken);
      callback(currentToken);
    } else {
      console.log('No registration token available.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    try {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });
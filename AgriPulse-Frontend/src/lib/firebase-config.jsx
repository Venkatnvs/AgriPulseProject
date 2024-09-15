import { createFcmTokenApi } from '@/apis/utils/notification';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyD1F7uVpn27xz5d0mKTsLb6c0ROVz0kO48',
  authDomain: 'krishi-pragya.firebaseapp.com',
  projectId: 'krishi-pragya',
  storageBucket: 'krishi-pragya.appspot.com',
  messagingSenderId: '363665919312',
  appId: '1:363665919312:web:62d022a1f50b36db607055',
  measurementId: 'G-Y8LFY8FBWK',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (setTokenFound) => {
  try {
    // Ensure service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Request permission and get token
    const currentToken = await getToken(messaging, { 
      vapidKey: 'BLnvqsezenpUs1nY6141_YkXuxlmuHoum5vj0xo9IRV-1x6l8Jfc4OT9QskdWbH83RlbcbhlM9K0ki7jgTtk3u0', 
      serviceWorkerRegistration: registration 
    });

    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      SendTokenToServer(currentToken);
      setTokenFound(true);
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    setTokenFound(false);
  }
};

export const onMessageListener = () =>
  new Promise(resolve => {
    onMessage(messaging, payload => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });

export const SendTokenToServer = async (token) => {
  try {
    const res = await createFcmTokenApi(
      {
        fcm_token: token,
      }
    )
    if (res.status === 201) {
      console.log('Token sent to server');
    }
  } catch (error) {
    console.error('Error sending token to server', error);
  }
};
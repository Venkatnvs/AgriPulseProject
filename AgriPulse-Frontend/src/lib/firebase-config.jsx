import { firebaseConfig, VAPID_KEY } from '@/constants/FirebaseContants';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async setUpUserFCToken => {
  try {
    const registration = await navigator.serviceWorker.ready;

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      setUpUserFCToken(currentToken);
    } else {
      console.log(
        'No registration token available. Request permission to generate one.',
      );
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};

const VAPID_KEY = import.meta.env.VITE_FC_VAPID_PUBLIC_KEY;

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FC_API_KEY,
    authDomain: import.meta.env.VITE_FC_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FC_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FC_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FC_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FC_APP_ID,
    measurementId: import.meta.env.VITE_FC_MEASUREMENT_ID,
};

export { VAPID_KEY };
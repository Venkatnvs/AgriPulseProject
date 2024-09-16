import AXIOS_INSTANCE from '../axios';

export const fetchFcmTokenListApi = () => AXIOS_INSTANCE.get('/utils/fcm-token/');

export const createUpdateFcmTokenApi = formData =>
    AXIOS_INSTANCE.post('/utils/fcm-token/', formData);

export const sendPushNotificationApi = formData =>
    AXIOS_INSTANCE.post('/utils/send-push-notification/', formData);
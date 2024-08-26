import AXIOS_INSTANCE from '../axios';

export const loginApi = formData =>
  AXIOS_INSTANCE.post('/auth/login/', formData);

export const registerApi = formData =>
  AXIOS_INSTANCE.post('/auth/register/', formData);

export const refreshTokenApi = refreshToken =>
  AXIOS_INSTANCE.post('/auth/token/refresh/', { refresh: refreshToken });

export const fetchUserApi = () => AXIOS_INSTANCE.get('/auth/user/');

export const sendOtpApi = email =>
  AXIOS_INSTANCE.post('/auth/send-otp/', { email: email });

export const verifyOtpApi = (email, otp) =>
  AXIOS_INSTANCE.post('/auth/verify-otp/', { email: email, otp: otp });

export const forgotPasswordApi = email =>
  AXIOS_INSTANCE.post('/auth/forgot-password/', { email: email });

export const resetPasswordApi = (uidb64, token, new_password) =>
  AXIOS_INSTANCE.post('/auth/reset-password/', {
    uidb64: uidb64,
    token: token,
    new_password: new_password,
});

export const verifyResetPasswordRequestApi = (uidb64, token) =>
  AXIOS_INSTANCE.post('/auth/verify-reset-password-request/', {
    uidb64: uidb64,
    token: token,
});
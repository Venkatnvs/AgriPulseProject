import {
  fetchUserApi,
  forgotPasswordApi,
  loginApi,
  refreshTokenApi,
  registerApi,
  resetPasswordApi,
  sendOtpApi,
  verifyOtpApi,
  verifyResetPasswordRequestApi,
} from '../../apis/auth';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/CookiesConstants';
import {
  AUTH_FAIL,
  FETCH_USER_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  SET_LOADING,
  SET_USER,
} from '../../constants/store/AuthConstants';
import Cookies from 'js-cookie';

export const loginSuccess = authTokens => ({
  type: LOGIN_SUCCESS,
  payload: authTokens,
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS,
});

export const setUser = user => ({
  type: SET_USER,
  payload: user,
});

export const setUserFail = error => ({
  type: FETCH_USER_FAIL,
  payload: error,
});

export const authFail = error => ({
  type: AUTH_FAIL,
  payload: error,
});

export const logout = () => {
  Cookies.remove(ACCESS_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
  return {
    type: LOGOUT,
  };
};

export const setLoading = () => ({
  type: SET_LOADING,
});

export const loginUser = formData => async dispatch => {
  try {
    const response = await loginApi(formData);
    Cookies.set(ACCESS_TOKEN, response.data.tokens.access, { expires: 1 });
    Cookies.set(REFRESH_TOKEN, response.data.tokens.refresh, { expires: 30 });
    dispatch(loginSuccess(response.data.tokens));
    dispatch(fetchUser());
    return response;
  } catch (error) {
    dispatch(
      authFail(
        error?.response?.data ||
          'Something went wrong! Please try again later.',
      ),
    );
    return error;
  }
};

export const registerUser = formData => async dispatch => {
  try {
    const response = await registerApi(formData);
    dispatch(registerSuccess());
    return response;
  } catch (error) {
    dispatch(authFail(error.response.data));
    return error;
  }
};

export const refreshToken = () => async dispatch => {
  try {
    const refreshToken = Cookies.get(REFRESH_TOKEN);
    if (!refreshToken) {
      dispatch(logout());
      return;
    }
    const response = await refreshTokenApi(refreshToken);
    Cookies.set(ACCESS_TOKEN, response.data.access, { expires: 1 });
    Cookies.set(REFRESH_TOKEN, response.data.refresh, { expires: 30 });
    dispatch(loginSuccess(response.data));
  } catch (error) {
    dispatch(logout());
  }
};

export const fetchUser = () => async dispatch => {
  dispatch(setLoading());
  try {
    const response = await fetchUserApi();
    dispatch(setUser(response.data));
  } catch (error) {
    dispatch(setUserFail(error.response.data));
  }
};

export const logoutUser = () => async dispatch => {
  console.log('Logging out');
  dispatch(logout());
};

export const sendOtpToEmail = email => async dispatch => {
  try {
    const response = await sendOtpApi(email);
    return response;
  } catch (error) {
    dispatch(authFail('Error sending OTP. Please try again'));
    return error;
  }
};

export const verifyOtp = (email, otp) => async dispatch => {
  try {
    const response = await verifyOtpApi(email, otp);
    return response;
  } catch (error) {
    dispatch(authFail('Error verifying OTP. Please try again.'));
    return error;
  }
};

export const forgotPassword = email => async dispatch => {
  try {
    const response = await forgotPasswordApi(email);
    return response;
  } catch (error) {
    dispatch(authFail('Error sending email. Please try again.'));
    return error;
  }
};

export const resetPassword = (uidb64, token, newPassword) => async dispatch => {
  try {
    const response = await resetPasswordApi(uidb64, token, newPassword);
    return response;
  } catch (error) {
    dispatch(authFail('Error resetting password. Please try again.'));
    return error;
  }
};

export const verifyResetPasswordRequest = (uidb64, token) => async dispatch => {
  try {
    const response = await verifyResetPasswordRequestApi(uidb64, token);
    return response;
  } catch (error) {
    dispatch(
      authFail('Error verifying reset password request. Please try again.'),
    );
    return error;
  }
};

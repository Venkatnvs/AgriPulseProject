import axios from 'axios';
import { API_URLS, BASE_URL } from '../constants/BaseAxios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/CookiesConstants';
import store from '@/store/store';
import { logoutUser } from '@/store/actions/authActions';

const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,
});

AXIOS_INSTANCE.interceptors.request.use(
  config => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

AXIOS_INSTANCE.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response) {
      if (
        error.response.status === 401 &&
        originalRequest.url === API_URLS.AUTH_TOKEN_REFRESH
      ) {
        // Redirect to login page if token refresh fails
        console.error('Token refresh failed');
        store.dispatch(logoutUser());
        window.location.href = '/login/';
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Cookies.get(REFRESH_TOKEN);
        if (refreshToken) {
          try {
            const response = await AXIOS_INSTANCE.post(
              API_URLS.AUTH_TOKEN_REFRESH,
              {
                refresh: refreshToken,
              },
            );
            Cookies.set(ACCESS_TOKEN, response.data.access);
            Cookies.set(REFRESH_TOKEN, response.data.refresh);
            AXIOS_INSTANCE.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${response.data.access}`;
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${response.data.access}`;
            return AXIOS_INSTANCE(originalRequest);
          } catch (refreshError) {
            store.dispatch(logoutUser());
            window.location.href = '/login/';
            return Promise.reject(refreshError);
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default AXIOS_INSTANCE;

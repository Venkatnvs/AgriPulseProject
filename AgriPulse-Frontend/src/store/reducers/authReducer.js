import Cookies from 'js-cookie';
import { ACCESS_TOKEN, NOTIFICATION_FCM_TOKEN, REFRESH_TOKEN } from '../../constants/CookiesConstants';
import {
  AUTH_FAIL,
  FETCH_USER_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  SET_LOADING,
  SET_NOTIFICATION_TOKEN,
  SET_USER,
} from '../../constants/store/AuthConstants';

const initialState = {
  authTokens: {
    access: Cookies.get(ACCESS_TOKEN),
    refresh: Cookies.get(REFRESH_TOKEN),
  },
  user: null,
  error: null,
  loading: false,
  fcNotificationToken: Cookies.get(NOTIFICATION_FCM_TOKEN),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        authTokens: action.payload,
        error: null,
        loading: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        authTokens: null,
        user: null,
        error: null,
        loading: false,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        error: null,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case AUTH_FAIL:
    case FETCH_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_NOTIFICATION_TOKEN:
      return {
        ...state,
        fcNotificationToken: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;

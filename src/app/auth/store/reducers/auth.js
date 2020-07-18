import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  REGISTER_LOADING,
  LOGOUT,
} from "../../actions/auth/types";

const getToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("token");
  } else return null;
};

const setToken = (token) => {
  if (typeof window !== "undefined") {
    return sessionStorage.setItem("token", token);
  } else return null;
};

const deleteToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.removeItem("token");
  } else return null;
};

const initialState = {
  token: getToken(),
  isAuthenticated: "",
  isLoading: false,
  user: null,
  patchingUser: false,
  patchedUser: false,
  patchingUserFailed: false,
  registerUserLoading: false,
  registerUserFailed: false,
  registerUserSuccess: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
    case LOGIN_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
      setToken(action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    //
    case REGISTER_LOADING:
      return {
        ...state,
        registerUserLoading: true,
        registerUserSuccess: false,
        registerUserFailed: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerUserLoading: false,
        registerUserFailed: false,
        registerUserSuccess: true,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registerUserFailed: true,
        registerUserLoading: false,
        registerUserSuccess: false,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };

    //
    // TODO: handle session expired error from
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
      deleteToken();
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
}

import axios from "axios";
import { URL } from "../url";
import { createMessage, returnErrors } from "../alerts/messages";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REGISTER_LOADING,
  LOGIN_LOADING,
} from "./types";

//
//
///// LOGIN USER /////
export const login = (username, password) => (dispatch) => {
  dispatch({ type: LOGIN_LOADING });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Request Body (change to string)
  const body = JSON.stringify({ username: username, password: password });
  axios
    .post(`${URL}/api/v1/auth/login`, body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: LOGIN_FAIL,
      });
      if (typeof err.response === "undefined") {
        return dispatch(
          createMessage({
            undefinedErrMsg: ".",
          })
        );
      } else {
        return dispatch(
          returnErrors(err.response.data, err.response.status, "Login Failed")
        );
      }
    });
};

//
//
///// REGISTER USER /////
export const register = ({ username, email, password, groups }) => (
  dispatch,
  getState
) => {
  const body = JSON.stringify({ username, email, password, groups });
  dispatch({ type: REGISTER_LOADING });
  axios
    .post(`${URL}/api/v1/auth/register`, body, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ success: "User Regisered" }));
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({ type: REGISTER_FAIL });
      if (typeof err.response === "undefined") {
        return dispatch(
          createMessage({
            undefinedErrMsg: ".",
          })
        );
      } else {
        return dispatch(
          returnErrors(
            err.response.data,
            err.response.status,
            "Registration Failed"
          )
        );
      }
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  dispatch({
    type: LOGOUT,
  });
  axios
    .post(`${URL}/api/v1/auth/logout/`, null, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: "CLEAR_ALL" });
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      if (typeof err.response === "undefined") {
        return dispatch(
          createMessage({
            undefinedErrMsg: ".",
          })
        );
      } else {
        dispatch(returnErrors(err.response.data, err.response.status));
      }
    });
};

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
  // User Loading
  dispatch({ type: USER_LOADING });
  axios
    .get(`${URL}/api/v1/auth/user`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // Headers
  const config = { headers: { "Content-Type": "application/json" } };
  // Get token from state
  const token = getState().authReducer.token;
  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};

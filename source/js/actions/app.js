import { setJWT } from 'api/auth';

export const SET_BACKGROUND_MAP_LOCATION = 'SET_BACKGROUND_MAP_LOCATION ';
export const SET_BACKGROUND_MAP_REFERENCE = 'SET_BACKGROUND_MAP_REFERENCE';
export const GET_USER_LOCATION = 'GET_USER_LOCATION';
export const GET_USER_LOCATION_ERROR = 'GET_USER_LOCATION_ERROR';
export const GET_USER_LOCATION_SUCCESS = 'GET_USER_LOCATION_SUCCESS';
export const LOGIN_RESET = 'LOGIN_RESET ';
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_SNACKBAR_PROPS = 'SET_SNACKBAR_PROPS';

export function setBackgroundMapReference(backgroundMapReference) {
  return {
    type: SET_BACKGROUND_MAP_REFERENCE,
    backgroundMapReference,
  };
}

export function setBackgroundMapLocation(backgroundMapLocation) {
  return {
    type: SET_BACKGROUND_MAP_LOCATION,
    backgroundMapLocation,
  };
}

export function getUserLocation() {
  return {
    type: GET_USER_LOCATION,
  };
}

export function setSnackbarProps(snackbarProps) {
  return {
    snackbarProps,
    type: SET_SNACKBAR_PROPS,
  };
}

export function login(username, password) {
  return {
    password,
    username,
    type: LOGIN_START,
  };
}

export function logout() {
  setJWT(null);
  return {
    type: LOGOUT,
  };
}

export function loginReset() {
  return {
    type: LOGIN_RESET,
  };
}

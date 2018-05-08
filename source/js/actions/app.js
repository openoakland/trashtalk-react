export const SET_BACKGROUND_MAP_LOCATION = 'SET_BACKGROUND_MAP_LOCATION ';
export const SET_BACKGROUND_MAP_REFERENCE = 'SET_BACKGROUND_MAP_REFERENCE';
export const GET_USER_LOCATION = 'GET_USER_LOCATION';
export const GET_USER_LOCATION_ERROR = 'GET_USER_LOCATION_ERROR';
export const GET_USER_LOCATION_SUCCESS = 'GET_USER_LOCATION_SUCCESS';
export const LOGIN = 'LOGIN ';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SET_SNACKBAR = 'SET_SNACKBAR';

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

export function setSnackbar(props) {
  return {
    props,
    type: SET_SNACKBAR,
  };
}

export function login(username, password) {
  return {
    password,
    username,
    type: LOGIN,
  };
}

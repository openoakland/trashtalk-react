import { takeLatest, call, put } from 'redux-saga/effects';
import { getUserFromJWT, setJWT } from 'api/auth';

import {
  GET_USER_LOCATION,
  GET_USER_LOCATION_SUCCESS,
  GET_USER_LOCATION_ERROR,
  LOGIN_START,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
} from 'actions/app';

import api from 'api';

import Location from 'models/Location';

function* getUserLocationStart() {
  const getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  try {
    const position = yield call(() =>
      getPosition({
        enableHighAccuracy: true,
      }));
    const { latitude, longitude } = position.coords;
    yield put({
      type: GET_USER_LOCATION_SUCCESS,
      userLocation: new Location({ latitude, longitude }),
    });
  } catch (error) {
    yield put({ type: GET_USER_LOCATION_ERROR, error });
  }
}

function* loginStart(action) {
  try {
    const { username, password } = action;
    const data = yield call(() => api.login(username, password));
    setJWT(data.token);
    yield put({
      type: LOGIN_SUCCESS,
      user: getUserFromJWT(),
    });
  } catch (error) {
    yield put({
      type: LOGIN_ERROR,
      error,
    });
  }
}

export default [
  takeLatest(GET_USER_LOCATION, getUserLocationStart),
  takeLatest(LOGIN_START, loginStart),
];

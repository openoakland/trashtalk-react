import { takeLatest, call, put } from 'redux-saga/effects';

import { GET_USER_LOCATION, GET_USER_LOCATION_SUCCESS, GET_USER_LOCATION_ERROR } from 'actions/app';

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

export default [takeLatest(GET_USER_LOCATION, getUserLocationStart)];

import { takeLatest, call, put } from 'redux-saga/effects';

import {
  GET_CLEANUPS_ERROR,
  GET_CLEANUPS_START,
  GET_CLEANUPS_SUCCESS,
} from 'actions/cleanups';

import api from 'api';

function* getCleanupsStart() {
  try {
    const data = yield call(() => api.getCleanups());
    yield put({ type: GET_CLEANUPS_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_CLEANUPS_ERROR, error });
  }
}

export default [
  takeLatest(GET_CLEANUPS_START, getCleanupsStart),
];

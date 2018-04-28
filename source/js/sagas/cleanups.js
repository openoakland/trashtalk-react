import { takeLatest, call, put } from 'redux-saga/effects';

import {
  GET_CLEANUPS_ERROR,
  GET_CLEANUPS_START,
  GET_CLEANUPS_SUCCESS,
  POST_CLEANUPS_ERROR,
  POST_CLEANUPS_START,
  POST_CLEANUPS_SUCCESS,
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

function* postCleanupStart(action) {
  try {
    const data = yield call(() => api.postCleanup({
      body: action.cleanup,
      method: 'POST',
    }));
    yield put({ type: POST_CLEANUPS_SUCCESS, data });
  } catch (error) {
    yield put({ type: POST_CLEANUPS_ERROR, error });
  }
}

export default [
  takeLatest(GET_CLEANUPS_START, getCleanupsStart),
  takeLatest(POST_CLEANUPS_START, postCleanupStart),
];

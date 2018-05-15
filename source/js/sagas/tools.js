import { takeLatest, call, put } from 'redux-saga/effects';

import {
  GET_TOOLS_ERROR,
  GET_TOOLS_START,
  GET_TOOLS_SUCCESS,
  GET_TOOL_CATEGORIES_ERROR,
  GET_TOOL_CATEGORIES_START,
  GET_TOOL_CATEGORIES_SUCCESS,
} from 'actions/tools';

import api from 'api';

function* getToolsStart() {
  try {
    const data = yield call(api.getTools);
    yield put({ type: GET_TOOLS_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_TOOLS_ERROR, error });
  }
}

function* getToolCategoriesStart() {
  try {
    const data = yield call(api.getToolCategories);
    yield put({ type: GET_TOOL_CATEGORIES_SUCCESS, data });
  } catch (error) {
    yield put({ type: GET_TOOL_CATEGORIES_ERROR, error });
  }
}

export function* getToolCategoriesWatcher() {
  yield takeLatest(GET_TOOL_CATEGORIES_START, getToolCategoriesStart);
}

export function* getToolsWatcher() {
  yield takeLatest(GET_TOOLS_START, getToolsStart);
}

export default [
  getToolCategoriesWatcher(),
  getToolsWatcher(),
];

import { Map } from 'immutable';

import {
  GET_CLEANUPS_START,
  GET_CLEANUPS_ERROR,
  GET_CLEANUPS_SUCCESS,
  POST_CLEANUPS_START,
  POST_CLEANUPS_ERROR,
  POST_CLEANUPS_SUCCESS,
} from 'actions/cleanups';

import Cleanup from 'models/Cleanup';

const initialState = Map({
  loading: false,
  error: null,
  cleanups: Map(),
  currentCleanup: null,
});

const actionsMap = {
  // Async action
  [GET_CLEANUPS_START]: state => {
    return state.merge(Map({
      loading: true,
      error: null,
    }));
  },
  [GET_CLEANUPS_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [GET_CLEANUPS_SUCCESS]: (state, action) => {
    const parsedCleanups = action.data.reduce(
      (prev, rawCleanupObject) =>
        prev.set(
          rawCleanupObject.id,
          new Cleanup(rawCleanupObject)
        ),
      Map()
    );

    return state.merge(Map({
      loading: false,
      cleanups: parsedCleanups,
    }));
  },
  [POST_CLEANUPS_START]: state => {
    return state.merge(Map({
      loading: true,
      error: null,
    }));
  },
  [POST_CLEANUPS_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [POST_CLEANUPS_SUCCESS]: (state, action) => {
    return state.setIn(['cleanups', action.data.id], new Cleanup(action.data));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}

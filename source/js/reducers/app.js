import { Map } from 'immutable';

import {
  GET_USER_LOCATION_SUCCESS,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_RESET,
  LOGOUT,
  SET_BACKGROUND_MAP_LOCATION,
  SET_BACKGROUND_MAP_REFERENCE,
  SET_SNACKBAR_PROPS,
} from 'actions/app';


import { POST_CLEANUPS_SUCCESS } from 'actions/cleanups';

import Location from 'models/Location';
import { getUserFromJWT } from '../api/auth';


const initialState = Map({
  backgroundMapReference: null,
  backgroundMapLocation: null,
  snackbarProps: null,
  userLocation: null,
  user: getUserFromJWT(),
  loginState: null,
});

const actionsMap = {
  [SET_BACKGROUND_MAP_REFERENCE]: (state, action) => {
    return state.set(
      'backgroundMapReference',
      action.backgroundMapReference
    );
  },
  [SET_BACKGROUND_MAP_LOCATION]: (state, action) => {
    return state.set(
      'backgroundMapLocation',
      action.backgroundMapLocation
    );
  },
  [SET_SNACKBAR_PROPS]: (state, action) => {
    return state.set(
      'snackbarProps',
      action.snackbarProps
    );
  },
  [GET_USER_LOCATION_SUCCESS]: (state, action) => {
    return state.set(
      'userLocation',
      action.userLocation
    );
  },
  [LOGIN_START]: (state) => {
    return state.set('loginState', LOGIN_START);
  },
  [LOGIN_ERROR]: (state) => {
    return state.set('loginState', LOGIN_ERROR);
  },
  [LOGIN_SUCCESS]: (state, action) => {
    return state.set('user', action.user).set('loginState', LOGIN_SUCCESS);
  },
  [LOGIN_RESET]: (state) => {
    return state.set('loginState', null);
  },
  [LOGOUT]: (state) => {
    return state.set('user', null);
  },
  [POST_CLEANUPS_SUCCESS]: (state, action) => {
    return state.set('backgroundMapLocation', new Location(action.data.location));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}

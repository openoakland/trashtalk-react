import { Map } from 'immutable';

import { SET_BACKGROUND_MAP_LOCATION, SET_BACKGROUND_MAP_REFERENCE, GET_USER_LOCATION_SUCCESS } from 'actions/app';

const initialState = Map({
  backgroundMapReference: null,
  backgroundMapLocation: null,
  userLocation: null,
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
  [GET_USER_LOCATION_SUCCESS]: (state, action) => {
    return state.set(
      'userLocation',
      action.userLocation
    ).set(
      'backgroundMapLocation',
      action.userLocation
    );
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}

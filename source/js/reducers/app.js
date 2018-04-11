import { Map } from 'immutable';

import { SET_MAP_REFERENCE, SET_USER_LOCATION } from 'actions/app';

import Location from 'models/Location';

const initialState = Map({
  mapCenter: new Location(),
  mapReference: null,
});

const actionsMap = {
  [SET_USER_LOCATION]: (state, action) => {
    return state.set('mapCenter', action.location);
  },
  [SET_MAP_REFERENCE]: (state, action) => {
    return state.set('mapReference', action.mapReference);
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}

export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const SET_MAP_REFERENCE = 'SET_MAP_REFERENCE';

export function setMapCenter(location) {
  return {
    type: SET_USER_LOCATION,
    mapCenter: location,
  };
}

export function setMapReference(mapReference) {
  return {
    type: SET_MAP_REFERENCE,
    mapReference,
  };
}

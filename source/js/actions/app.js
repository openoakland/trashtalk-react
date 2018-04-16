export const SET_BACKGROUND_MAP_LOCATION = 'SET_BACKGROUND_MAP_LOCATION ';
export const SET_BACKGROUND_MAP_REFERENCE = 'SET_BACKGROUND_MAP_REFERENCE';

export function setBackgroundMapReference(backgroundMapReference) {
  return {
    type: SET_BACKGROUND_MAP_REFERENCE,
    backgroundMapReference,
  };
}

export function setBackgroundMapLocation(backgroundMapLocation) {
  return {
    type: SET_BACKGROUND_MAP_LOCATION,
    backgroundMapLocation,
  };
}

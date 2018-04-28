import { Record } from 'immutable';

export const MIDDLE_OF_OAKLAND = {
  latitude: 37.804,
  longitude: -122.271,
};

export default class Location extends Record({
  id: undefined,
  latitude: 0.0,
  longitude: 0.0,
  query: null,
}) {
  constructor(args) {
    // Initialize using args or default to MIDDLE_OF_OAKLAND
    const parsedLatLong = args && 'latitude' in args && 'longitude' in args ? {
      latitude: Number(parseFloat(args.latitude).toFixed(6)),
      longitude: Number(parseFloat(args.longitude).toFixed(6)),
    } : {};

    super({
      ...MIDDLE_OF_OAKLAND,
      ...args,
      ...parsedLatLong,
    });
  }

  /**
   * Method to determine if one location is at the same location as another.
   * We may decide to refine this logic at some point to consider two locations to be the
   * same if they're within a certain distance from one another.
   */
  isAt(otherLocation) {
    return this.latitude === otherLocation.latitude && this.longitude === otherLocation.longitude;
  }

  /**
   * Helper method to get an object with lat and lng, used by Google Maps API
   */
  getLatLngObj() {
    return {
      lat: this.latitude,
      lng: this.longitude,
    };
  }

  /**
   * Set the center of a map referred to by mapReference to this location
   * @param {Google Map Reference} mapReference
   */
  setMapCenter(mapReference) {
    mapReference.setCenter(this.getLatLngObj());
  }
}

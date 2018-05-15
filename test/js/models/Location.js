import {
  expect
} from 'chai';
import Location from 'models/Location';
import * as Immutable from 'immutable';
import * as LOCATION_ASSETS from '../assets/locations';

describe('Location', () => {
  it('can be initialized from valid JSON', () => {
    const location = new Location(LOCATION_ASSETS.LOCATION1);
    expect(location.id).to.equal(LOCATION_ASSETS.LOCATION1.id);
  });

  it('can get a Google Maps API friendly object with lat/long', () => {
    const LOCATION_DATA = LOCATION_ASSETS.LOCATION1;
    const location = new Location(LOCATION_DATA);
    const latLong = location.getLatLngObj();
    expect(
      latLong.lat === LOCATION_DATA.latitude &&
      latLong.lng === LOCATION_DATA.longitude
    ).to.be.true;
  });

  it('can return the distance from one location to another using the getDistanceFrom()) method', () => {
    const location = new Location(LOCATION_ASSETS.LOCATION1);
    const location2 = new Location(LOCATION_ASSETS.LOCATION2);
    const distance = location.getDistanceFrom(location2, { unit: 'feet' });
    expect(distance).to.be.at.least(1);
  });

  it('returns false when the isAt() method is given a location at a different location', () => {
    const location = new Location(LOCATION_ASSETS.LOCATION1);
    const location2 = new Location(LOCATION_ASSETS.LOCATION2);
    expect(location.isAt(location2)).to.be.false;
  });

  it('returns true when the isAt() method is given a location at the same location', () => {
    const location = new Location(LOCATION_ASSETS.LOCATION1);
    const location2 = new Location(LOCATION_ASSETS.LOCATION1);
    expect(location.isAt(location2)).to.be.true;
  });
});


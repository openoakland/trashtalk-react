import {
  expect
} from 'chai';
import Cleanup from 'models/Cleanup';
import User from 'models/User';
import * as Immutable from 'immutable';
import * as CLEANUP_ASSETS from '../assets/cleanups';

describe('Cleanup', () => {
  it('can be initialized from valid JSON', () => {
    const cleanup = new Cleanup(CLEANUP_ASSETS.CLEANUP_WITH_TOOLS);
    expect(cleanup.id).to.equal(CLEANUP_ASSETS.CLEANUP_WITH_TOOLS.id);
  });

  it('can return an API friendly cleanup object from the toApiJSON method', () => {
    const cleanup = new Cleanup(CLEANUP_ASSETS.CLEANUP_WITH_TOOLS);
    expect(Immutable.is(
      new Cleanup(cleanup.toApiJSON()),
      cleanup
    )).to.be.true;
  });

  it('uses the Cleanup.title if one is set', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_TITLE;
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.getName()).to.equal(CLEANUP_DATA.title);
  });

  it('uses the Cleanup.location.query if one is set and Cleanup.title is not', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_LOCATION_QUERY;
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.getName()).to.equal(CLEANUP_DATA.location.query);
  });

  it('uses the Cleanup.title if one is set over the Cleanup.location.query', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_TITLE_AND_LOCATION_QUERY;
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.getName()).to.equal(CLEANUP_DATA.title);
  });

  it('can get the cleanup.requiredTools property as an Immutable List', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_TOOLS;
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.getRequiredToolsAsList().size).to.equal(CLEANUP_DATA.required_tools.length);
  });

  it('can determine if a user is a host to a cleanup using the hasHost() method', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_HOST;
    const user = new User({
      id: CLEANUP_DATA.host
    });
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.hasHost(user)).to.be.true;
  });

  it('can determine if a user is a participant to a cleanup using the hasParticipant() method', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_PARTICIPANTS;
    const user = new User({
      id: CLEANUP_DATA.participants[0]
    });
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.hasParticipant(user)).to.be.true;
  });

  it('returns false when a user is not a host to a cleanup using the hasHost() method', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_HOST;
    const user = new User({
      id: -1
    });
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.hasHost(user)).to.be.false;
  });

  it('returns false when a user is not a participant to a cleanup using the hasParticipant() method', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_PARTICIPANTS;
    const user = new User({
      id: -1
    });
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.hasParticipant(user)).to.be.false;
  });

  it('returns a valid path with its id in the path', () => {
    const CLEANUP_DATA = CLEANUP_ASSETS.CLEANUP_WITH_TOOLS;
    const cleanup = new Cleanup(CLEANUP_DATA);
    expect(cleanup.getCleanupPath().indexOf(cleanup.id) > 0).to.be.true;
  });
});


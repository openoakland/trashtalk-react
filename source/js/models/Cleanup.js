import { Map, Record } from 'immutable';

import Location from 'models/Location';

export default class Cleanup extends Record({
  id: undefined,
  location: null,
  title: null,
  organizer: null,
  start: null,
  end: null,
  requiredTools: Map(),
}) {
  constructor(args) {
    super(Object.assign(
      {},
      {
        location: new Location((args || {}).location),
      },
      args,
      {
        end: args.end ? new Date(args.end) : null,
        start: args.start ? new Date(args.start) : null,
      }
    ));
  }

  getName() {
    if (this.title) {
      return this.title;
    }

    return this.location.query || this.location.getLatLngObj();
  }

  timesAreValid() {
    return (
      (this.start != null && this.end != null) &&
      this.start > Date.now() &&
      this.end > this.start
    );
  }
}

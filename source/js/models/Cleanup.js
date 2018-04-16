import { Record } from 'immutable';

import Location from 'models/Location';

export default class Cleanup extends Record({
  id: undefined,
  location: null,
  organizer: null,
  startTime: null,
  endTime: null,
  toolSelections: [],
}) {
  constructor(args) {
    super(Object.assign(
      {},
      {
        location: new Location(),
      },
      args
    ));
  }

  timesAreValid() {
    return (
      (this.startTime != null && this.endTime != null) &&
      this.startTime > Date.now() &&
      this.endTime > this.startTime
    );
  }
}

import { List, Map, Record } from 'immutable';

import Location from 'models/Location';

export default class Cleanup extends Record({
  id: undefined,
  location: null,
  title: null,
  organizer: null,
  start: null,
  end: null,
  participants: List(),
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

  /**
   * Function to convert a Cleanup object to an API friendly structure.
   *
   * Note that we're converting the requiredTools dictionary to a list of {tool: [toolId], quantity: ...}
   */
  toJSON() {
    const cleanup = this.toJS();
    const requiredTools = [];
    Object.keys(cleanup.requiredTools).forEach(toolId => {
      requiredTools.push({
        tool: toolId,
        quantity: cleanup.requiredTools[toolId],
      });
    });

    cleanup.requiredTools = requiredTools;
    return cleanup;
  }
}

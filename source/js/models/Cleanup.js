import { List, Map, Record } from 'immutable';

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
        // Convert required_tools array to requiredTools map for more efficient parsing
        requiredTools: (args.required_tools || [])
          .reduce((prev, curr) => prev.set(curr.tool, curr.quantity), Map()),
      },
      args,
      {
        location: new Location((args || {}).location),
      },
      {
        end: args.end ? new Date(args.end) : null,
        start: args.start ? new Date(args.start) : null,
      },
    ));
  }

  getName() {
    if (this.title) {
      return this.title;
    }

    return this.location.query || this.location.getLatLngObj();
  }

  getRequiredToolsAsList() {
    return this.requiredTools.reduce((prev, quantity, tool) => prev.push({
      tool,
      quantity,
    }), List());
  }

  toApiJSON() {
    const cleanupJSON = this.toJSON();

    // Convert requiredTools from JS preferred camel-case to Python snake case
    delete cleanupJSON.requiredTools;
    cleanupJSON.required_tools = this.getRequiredToolsAsList().toJSON();

    return cleanupJSON;
  }

  timesAreValid() {
    return this.start != null && this.end != null && this.start > Date.now() && this.end > this.start;
  }
}

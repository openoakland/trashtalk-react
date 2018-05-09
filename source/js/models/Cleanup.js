import { List, Map, Record, Set } from 'immutable';
import { CLEANUP_ROOT } from 'constants/routes';
import Location from 'models/Location';

export default class Cleanup extends Record({
  id: undefined,
  description: null,
  location: null,
  title: null,
  host: null,
  participants: Set(),
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
      {
        participants: Set(args.participants),
      }
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

  getCleanupPath() {
    return `${ CLEANUP_ROOT }${ this.id }`;
  }

  hasHost(user) {
    if (user == null) {
      return false;
    }
    return user.id === this.host;
  }

  hasParticipant(user) {
    if (user == null) {
      return false;
    }
    return this.participants.has(user.id);
  }

  toggleParticipant(user) {
    let participants = this.participants;
    participants = this.hasParticipant(user) ? participants.delete(user.id) : participants.add(user.id);
    return this.set('participants', participants);
  }

  toApiJSON() {
    const cleanupJSON = this.toJSON();

    // Convert requiredTools from JS preferred camel-case to Python snake case
    delete cleanupJSON.requiredTools;
    cleanupJSON.required_tools = this.getRequiredToolsAsList().toJSON();

    // We'll leave it up to the API to set the user
    delete cleanupJSON.host;

    return cleanupJSON;
  }

  timesAreValid() {
    return this.start != null && this.end != null && this.start > Date.now() && this.end > this.start;
  }
}

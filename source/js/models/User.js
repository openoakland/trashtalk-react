import { Record } from 'immutable';

export default class User extends Record({
  id: null,
  username: null,
  email: null,
}) {
}

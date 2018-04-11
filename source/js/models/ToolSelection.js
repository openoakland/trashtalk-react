import { Record } from 'immutable';

export default class ToolSelection extends Record({
  cleanupId: null,
  categoryId: '',
  toolId: '',
  quantity: null,
}) {
  categoryIsSet() {
    return this.categoryId !== '' && this.categoryId !== null;
  }

  toolIsSet() {
    return this.toolId !== '' && this.toolId !== null;
  }
}

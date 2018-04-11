import { combineReducers } from 'redux';
import app from 'reducers/app';
import cleanups from 'reducers/cleanups';
import tools from 'reducers/tools';

export default combineReducers({
  app,
  cleanups,
  tools,
});

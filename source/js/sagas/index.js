import { all } from 'redux-saga/effects';

import appSagas from 'sagas/app';
import cleanupSagas from 'sagas/cleanups';
import toolsSagas from 'sagas/tools';

export default function* rootSaga() {
  yield all([
    ...appSagas,
    ...cleanupSagas,
    ...toolsSagas,
  ]);
}

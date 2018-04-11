import { all } from 'redux-saga/effects';

import cleanupSagas from 'sagas/cleanups';
import toolsSagas from 'sagas/tools';

export default function* rootSaga() {
  yield all([
    ...cleanupSagas,
    ...toolsSagas,
  ]);
}

export const GET_CLEANUPS_START = 'GET_CLEANUPS_START';
export const GET_CLEANUPS_ERROR = 'GET_CLEANUPS_ERROR';
export const GET_CLEANUPS_SUCCESS = 'GET_CLEANUPS_SUCCESS';

export function getCleanups() {
  return {
    type: GET_CLEANUPS_START,
  };
}

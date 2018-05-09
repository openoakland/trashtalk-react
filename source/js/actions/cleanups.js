export const GET_CLEANUPS_START = 'GET_CLEANUPS_START';
export const GET_CLEANUPS_ERROR = 'GET_CLEANUPS_ERROR';
export const GET_CLEANUPS_SUCCESS = 'GET_CLEANUPS_SUCCESS';
export const POST_CLEANUPS_START = 'POST_CLEANUPS_START';
export const POST_CLEANUPS_ERROR = 'POST_CLEANUPS_ERROR';
export const POST_CLEANUPS_SUCCESS = 'POST_CLEANUPS_SUCCESS';
export const PATCH_CLEANUPS_START = 'PATCH_CLEANUPS_START';
export const PATCH_CLEANUPS_ERROR = 'PATCH_CLEANUPS_ERROR';
export const PATCH_CLEANUPS_SUCCESS = 'PATCH_CLEANUPS_SUCCESS';

export function getCleanups() {
  return {
    type: GET_CLEANUPS_START,
  };
}

export function postCleanup(cleanup) {
  return {
    cleanup,
    type: POST_CLEANUPS_START,
  };
}

export function patchCleanup(cleanup) {
  return {
    cleanup,
    type: PATCH_CLEANUPS_START,
  };
}

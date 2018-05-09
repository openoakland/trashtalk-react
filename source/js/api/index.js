// Simple API wrapper
import { fetchResource } from './helpers';

function getCleanups() {
  return fetchResource('api/v1/cleanups/');
}

function getTools() {
  return fetchResource('api/v1/tools/');
}

function getToolCategories() {
  return fetchResource('api/v1/toolcategories/');
}

function patchCleanup(options) {
  const cleanupId = options.body.id;
  return fetchResource(
    `api/v1/cleanups/${ cleanupId }/`,
    {
      ...options,
      ...{ method: 'PATCH' },
    }
  );
}

function postCleanup(options) {
  return fetchResource(
    'api/v1/cleanups/',
    {
      ...options,
      ...{ method: 'POST' },
    }
  );
}

function login(username, password) {
  return fetchResource(
    'api/v1/token/',
    {
      method: 'POST',
      body: {
        password,
        username,
      },
    }
  );
}

export default {
  getCleanups,
  getTools,
  getToolCategories,
  login,
  patchCleanup,
  postCleanup,
};

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

function postCleanup(options) {
  return fetchResource('api/v1/cleanups/', options);
}

export default {
  getCleanups,
  getTools,
  getToolCategories,
  postCleanup,
};

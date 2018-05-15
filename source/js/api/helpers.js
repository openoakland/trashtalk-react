import 'babel-polyfill'; // Included here to make unit tests happy. See https://github.com/babel/babel/issues/5085
import { API_URL } from 'constants/app';
import { getJWTasync, redirectToLogin } from 'api/auth';

// Simple API wrapper

// Custom API error to throw
function ApiError(message, data, status) {
  let response = null;
  let isObject = false;

  // We are trying to parse response
  try {
    response = JSON.parse(data);
    isObject = true;
  } catch (e) {
    response = data;
  }

  return {
    response,
    message,
    status,
    toString: () => {
      return `${ this.message }\nResponse:\n${ isObject ? JSON.stringify(this.response, null, 2) : this.response }`;
    },
  };
}

// API wrapper function
export const fetchResource = async (path, userOptions = {}, addAuthHeader = true) => {
  // Define default options
  const defaultOptions = {};

  // Define default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const options = {
    // Merge options
    ...defaultOptions,
    ...userOptions,
    // Merge headers
    headers: {
      ...defaultHeaders,
      ...userOptions.headers,
    },
  };

  if (addAuthHeader) {
    const jwt = await getJWTasync();
    if (jwt) {
      options.headers.Authorization = `JWT ${ jwt }`;
    }
  }

  // Build Url
  const url = `${ API_URL }/${ path }`;

  // Detect if we are uploading a file
  const isFile = typeof window !== 'undefined' && options.body instanceof File;

  // Stringify JSON data
  // If body is not a file
  if (options.body && typeof options.body === 'object' && !isFile) {
    options.body = JSON.stringify(options.body);
  }

  // Variable which will be used for storing response
  let response;
  try {
    response = await fetch(url, options);
    if (response.status === 401) {
      redirectToLogin();
    } else if (response.status < 200 || response.status >= 400) {
      throw response;
    }
    response = await response.json();
  } catch (error) {
    if (response) {
      throw ApiError(`Request failed with status ${ response.status }.`, error, response.status);
    } else {
      throw ApiError(error.toString(), null, 'REQUEST_FAILED');
    }
  }

  return response;
};

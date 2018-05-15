/*
TODO: We'll want to set up a more sophisticated way of figuring out what the API_URL is. While this works for now,
the limitations are:

- It assumes there are only two environments
- When developing the frontend, we assume there's a running Django instance at localhost:8000
*/

let IS_DEV;

try {
  IS_DEV = window != null && window.location.host.indexOf('localhost') === 0;
} catch (err) {
  IS_DEV = false;
}

export const API_URL = IS_DEV ? 'http://localhost:8000' : 'http://trashtalk.divethree.com';

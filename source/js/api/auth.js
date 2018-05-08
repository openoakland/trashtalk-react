import { API_URL } from 'constants/app';
import jwt from 'jsonwebtoken';

const JWT_KEY = 'jwtPayload';
const TIME_UNTIL_REFRESH = 3600000; // One hour in ms

export const getJWT = () => {
  // Add JWT if one is set in storage
  const jwtPayload = localStorage.getItem(JWT_KEY);
  if (jwtPayload) {
    return JSON.parse(jwtPayload);
  }

  return null;
};

export const setJWT = (token) => {
  localStorage.setItem(JWT_KEY, token);
};

/**
 * Function that adds JWT header if one is found in storage. If one is found and it's expired,
 * attempt to refresh the token and add it to the header. If no JWT is found, return the header as is.
 * @param {Object} headers
 */
export const addJWTheader = async (headers) => {
  const updatedHeaders = Object.assign({}, headers);

  const token = getJWT();
  if (token) {
    const decoded = jwt.decode(token);
    if ((decoded.exp - TIME_UNTIL_REFRESH) > Date.now()) {
      updatedHeaders.Authorization = `JWT ${ token }`;
    } else {
      // Attempt to refresh the token if it's expired
      try {
        const url = `${ API_URL }/api/v1/token-refresh`;
        const refreshToken = await fetch(
          url,
          { body: { token } }
        );
        updatedHeaders.Authorization = `JWT ${ refreshToken }`;
        setJWT(refreshToken);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return updatedHeaders;
};


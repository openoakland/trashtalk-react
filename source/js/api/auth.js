import jwt from 'jsonwebtoken';
import { routeCodes } from 'constants/routes';
import { fetchResource } from 'api/helpers';

const JWT_KEY = 'jwtPayload';

export const redirectToLogin = () => {
  const {
    pathname,
    search,
  } = window.location;
  sessionStorage.setItem('PATH_ON_LOGIN', pathname + search);
  window.location.pathname = routeCodes.LOGIN;
};

export const setJWT = payload => {
  localStorage.setItem(JWT_KEY, payload);
};

export const getJWT = async () => {
  // Add JWT if one is set in storage
  let token = localStorage.getItem(JWT_KEY);
  if (token) {
    const decoded = jwt.decode(token);
    // If the token is expired or getting close to being expired, attempt to get a new token
    if ((Date.now() / 1000) > decoded.exp) {
      try {
        const url = 'api/v1/token-refresh/';
        const response = await fetchResource(url, { body: { token }, method: 'POST' });
        token = response.token;
        setJWT(token);
      } catch (err) {
        setJWT(null);
        console.error(err);
        token = null;
      }
    }
  }

  console.debug(token);

  return token;
};

/**
 * Class/Component decorator that redirects to login page if a valid JWT
 * doesn't exist or if a refresh token can't be requested from an
 * expired JWT
 */
export const loginRequired = (ReactComponent) => {
  return async function (props) {
    const token = await getJWT();
    if (token != null) {
      return new ReactComponent(props);
    }

    redirectToLogin();
    return null;
  };
};


import jwt from 'jsonwebtoken';
import { routeCodes } from 'constants/routes';
import { fetchResource } from 'api/helpers';
import User from 'models/User';

const JWT_KEY = 'jwtPayload';

export const redirectToLogin = () => {
  window.location = `${ routeCodes.LOGIN }?redirectTo=${ window.location.pathname }`;
};

export const setJWT = token => {
  if (token == null) {
    localStorage.removeItem(JWT_KEY);
  } else {
    localStorage.setItem(JWT_KEY, token);
  }
};

export const getJWT = () => {
  return localStorage.getItem(JWT_KEY);
};

export const getJWTasync = async () => {
  // Add JWT if one is set in storage
  let token = getJWT();
  if (token) {
    const decoded = jwt.decode(token);
    // If the token is expired or getting close to being expired, attempt to get a new token
    if ((Date.now() / 1000) > decoded.exp) {
      try {
        const url = 'api/v1/token-refresh/';
        const addAuthHeader = false;
        const response = await fetchResource(
          url,
          { body: { token }, method: 'POST' },
          addAuthHeader
        );
        token = response.token;
      } catch (err) {
        token = null;
      }

      setJWT(token);
    }
  }

  return token;
};

export const getUserFromJWT = inputJWT => {
  const token = inputJWT || getJWT();
  let user;
  if (token != null) {
    const decoded = jwt.decode(token);
    const { user_id, username, email } = decoded; // eslint-disable-line camelcase
    user = new User({
      email,
      id: user_id,
      username,
    });
  }

  return user;
};

/**
 * Class/Component decorator that redirects to login page if a valid JWT
 * doesn't exist
 */
export const loginRequired = (ReactComponent) => {
  return (props) => {
    const token = localStorage.getItem(JWT_KEY);
    if (token == null || (Date.now() / 1000 > jwt.decode(token).exp)) {
      redirectToLogin();
      return null;
    }

    return new ReactComponent(props);
  };
};

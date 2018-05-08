import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import jwt from 'jsonwebtoken';

export const JWT_KEY = 'jwt';

/**
 * Wrapper for views requiring auth.
 * On mount, we check to see if a JWT has been persisted. If it hasn't,
 * redirect to Login view
 */
@withRouter()
export default class ConnectedComponent extends Component {
  static propTypes = {
    children: PropTypes.element,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.verifyJWT();
  }

  verifyJWT = () => {
    const token = localStorage.getItem(JWT_KEY);
    if (jwt == null) {
      this.redirectToLogin();
    }

    const payload = jwt.decode(token);
    const { exp } = (payload || {});
    if (exp && exp < Math.floor(Date.now() / 1000)) {
      this.redirectToLogin();
    }
  }

  redirectToLogin = () => {

  }

  render() {
    return (
      <div>Connected Component</div>
    );
  }
}

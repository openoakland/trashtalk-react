import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { routeCodes } from 'constants/routes';
import { withStyles } from 'material-ui/styles';

import Logo from 'components/global/Logo';
import DialogContainer from 'components/global/DialogContainer';
import { DialogContentText, DialogContent } from 'material-ui/Dialog';
import { login, loginReset } from 'actions/app';
import queryString from 'query-string';
import { LOGIN_ERROR, LOGIN_SUCCESS } from '../actions/app';

const styles = theme => ({
});

/**
 * This component is used to display the details of a cleanup
 */
@connect(
  (state, props) => {
    return {
      cleanups: state.cleanups.get('cleanups'),
      cleanupId: Number(props.match.params.cleanupId),
      loginState: state.app.get('loginState'),
      user: state.app.get('user'),
    };
  },
  dispatch => bindActionCreators({ login, loginReset }, dispatch)
)
@withStyles(styles)
class Login extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    login: PropTypes.func,
    loginReset: PropTypes.func,
    loginState: PropTypes.string,
    user: PropTypes.object,
  };

  state = { username: '', password: '' }

  componentWillReceiveProps(nextProps) { // eslint-disable-line react/sort-comp
    if (nextProps.loginState === LOGIN_SUCCESS) {
      const queryParams = queryString.parse(window.location.search);
      if (queryParams.redirectTo == null) {
        this.props.history.replace('/');
      } else {
        this.props.history.replace(queryParams.redirectTo);
      }
    }
  }

  componentWillUnmount() {
    this.props.loginReset();
  }

  onUsernameChange = event => {
    const username = event.currentTarget.value;
    this.setState({ username });
  }

  onPasswordChange = event => {
    const password = event.currentTarget.value;
    this.setState({ password });
  }

  gotoRegistration = () => {
    this.props.history.push(routeCodes.REGISTER);
  };

  handleLoginRequest = () => {
    const { username, password } = this.state;
    this.props.login(username, password);
  }

  render() {
    const { password, username } = this.state;
    const { classes, loginState, user } = this.props;
    return (
      <DialogContainer
        actions={[
          <Button
            variant='raised'
            color='primary'
            disabled={ password === '' || username === '' }
            onClick={ this.handleLoginRequest }
          >
            Login
          </Button>,
          <Button
            className={classes.registerButton}
            onClick={this.gotoRegistration}
            variant='flat'
          >
            Register a new account
            </Button>,
        ] }
      >
        <DialogContent>
          <Logo />
          { loginState === LOGIN_ERROR ? (
            <DialogContentText>The username/password combination could not be found. Please try again.</DialogContentText>
          ) : (
            <DialogContentText>
              { user ? `You are currently logged in as "${ user.username }".` : ''}
              Enter your username and password to login.
            </DialogContentText>
          )}
          <form autoComplete='off'>
            <TextField
              autoFocus
              margin='dense'
              label='Username'
              onChange={ this.onUsernameChange }
              value={ username }
              fullWidth
            />
            <TextField
              margin='dense'
              onChange={ this.onPasswordChange }
              label='Password'
              type='password'
              value={ password }
              fullWidth
            />
          </form>
        </DialogContent>
      </DialogContainer>
    );
  }
}

export default withRouter(Login);

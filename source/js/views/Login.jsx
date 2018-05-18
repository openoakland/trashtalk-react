import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Logo from 'components/global/Logo';
import DialogContainer from 'components/global/DialogContainer';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import { login, loginReset, setSnackbarProps } from 'actions/app';
import queryString from 'query-string';
import { API_URL } from 'constants/app';
import { LOGIN_ERROR, LOGIN_SUCCESS } from '../actions/app';

const styles = theme => ({
  header: {
    size: '2rem',
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 4,
  },
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
  dispatch => bindActionCreators({ login, loginReset, setSnackbarProps }, dispatch)
)
@withStyles(styles)
class Login extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    login: PropTypes.func,
    loginReset: PropTypes.func,
    loginState: PropTypes.string,
    setSnackbarProps: PropTypes.func,
    user: PropTypes.object,
  };

  state = { username: '', password: '' }

  componentWillReceiveProps(nextProps) { // eslint-disable-line react/sort-comp
    if (nextProps.loginState === LOGIN_SUCCESS) {
      this.props.setSnackbarProps({
        message: 'You have been logged in',
        open: true,
      });

      const queryParams = queryString.parse(window.location.search);
      this.props.history.replace(queryParams.redirectTo || '/');
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

  getHeader = () => {
    const { loginState, user } = this.props;
    const queryParams = queryString.parse(window.location.search);
    let header = 'Enter your username and password.';
    if (loginState === LOGIN_ERROR) {
      header = 'The username password combination could not be found.';
    } else if (queryParams.redirectTo != null) {
      header = 'Please login to continue.';
    } else if (user != null) {
      header = `You are logged in as "${ user.username }". Did you want to log in as someone else?`;
    }
    return header;
  }

  gotoRegistration = () => {
    // this.props.history.push(routeCodes.REGISTER);
    const win = window.open(`${ API_URL }/signup`);
    win.focus();
  };

  handleLoginRequest = () => {
    const { username, password } = this.state;
    this.props.login(username, password);
  }

  render() {
    const { password, username } = this.state;
    const { classes } = this.props;

    return (
      <DialogContainer
        actions={ [
          <Button
            variant='raised'
            color='primary'
            disabled={ password === '' || username === '' }
            onClick={ this.handleLoginRequest }
          >
            Login
          </Button>,
          <Button
            className={ classes.registerButton }
            onClick={ this.gotoRegistration }
            variant='flat'
          >
            Register a new account
          </Button>,
        ] }
      >
        <DialogContent>
          <Logo />
          <DialogContentText className={ classes.header }>
            { this.getHeader() }
          </DialogContentText>
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

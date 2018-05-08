import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { routeCodes } from 'constants/routes';

import Logo from 'components/global/Logo';
import DialogContainer from 'components/global/DialogContainer';
import { DialogContentText, DialogContent } from 'material-ui/Dialog';
import { login } from 'actions/app';


/**
 * This component is used to display the details of a cleanup
 */
@connect(
  (state, props) => {
    return {
      cleanups: state.cleanups.get('cleanups'),
      cleanupId: Number(props.match.params.cleanupId),
    };
  },
  dispatch => bindActionCreators({ login }, dispatch)
)
class Login extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    login: PropTypes.func,
  };

  state = { email: '', password: '' }

  onEmailChange = event => {
    const email = event.currentTarget.value;
    this.setState({ email });
  }

  onPasswordChange = event => {
    const password = event.currentTarget.value;
    this.setState({ password });
  }

  gotoRegistration = () => {
    this.props.history.push(routeCodes.REGISTER);
  };

  handleLoginRequest = () => {
    const { email, password } = this.state;
    this.props.login(email, password);
  }

  render() {
    const { password, email } = this.state;
    return (
      <DialogContainer
        actions={[
          <Button
            variant='raised'
            color='primary'
            onClick={ this.handleLoginRequest }
          >
            Login
            </Button>,
        ]}
      >
        <DialogContent>
          <Logo />
          <DialogContentText>Enter your email and password to login</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Email Address'
            type='email'
            onChange={ this.onEmailChange }
            value={ email }
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
          <Button onClick={ this.gotoRegistration }> Register a new account </Button>
        </DialogContent>
      </DialogContainer>
    );
  }
}

export default withRouter(Login);

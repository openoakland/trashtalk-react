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

import { DialogActions, DialogContentText, DialogContent, DialogTitle } from 'material-ui/Dialog';


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
  dispatch => bindActionCreators({}, dispatch)
)
class Login extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  };

  gotoRegistration = () => {
    this.props.history.push(routeCodes.REGISTER);
  };

  render() {
    return (
      <DialogContainer
      >
        <DialogContent
          actions={ [
            <Button
              variant='raised'
              color='primary'
            >
              Login
            </Button>,
          ] }
        >
          <Logo />
          <DialogContentText>Enter your username and password to login</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Email Address'
            type='email'
            fullWidth
          />
          <TextField
            margin='dense'
            label='Password'
            type='password'
            fullWidth
          />
          <Button onClick={ this.gotoRegistration }> Register a new account </Button>
        </DialogContent>
      </DialogContainer>
    );
  }
}

export default withRouter(Login);

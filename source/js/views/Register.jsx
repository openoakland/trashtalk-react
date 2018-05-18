import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { DialogContentText } from '@material-ui/core/Dialog';

import DialogContainer from 'components/global/DialogContainer';

const styles = theme => ({
  passwordsContainer: {
    display: 'flex'
  },
  passwordField: {
    margin: theme.spacing.unit,
  },
});

/**
 * This component is used to display the details of a cleanup
 */
@withStyles(styles)
@connect(
  () => ({}),
  dispatch => bindActionCreators({}, dispatch)
)
class Register extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
  }

  render() {
    const { classes } = this.props;
    return (
      <DialogContainer
        actions={
          [
            <Button
              variant='raised'
              color='primary'
            >
              Register
            </Button>,
          ]
        }
      >
        <DialogContentText>
          Register a new account
        </DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          label='Email Address'
          type='email'
          fullWidth
        />
        <div className={ classes.passwordsContainer }>
          <TextField
            className={ classes.passwordField }
            margin='dense'
            label='Password'
            type='password'
            fullWidth
          />
          <TextField
            className={ classes.passwordField }
            margin='dense'
            label='Re-enter password'
            type='password'
            fullWidth
          />
        </div>
      </DialogContainer>
    );
  }
}

export default Register;

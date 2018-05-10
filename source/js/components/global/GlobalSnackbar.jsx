import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

import { setSnackbarProps } from 'actions/app';

/**
 * Global snackbar for sending messages from any component
 */
@connect(
  state => ({
    'snackbarProps': state.app.get('snackbarProps'),
  }),
  dispatch => bindActionCreators({ setSnackbarProps }, dispatch)
)
export default class ConnectedComponent extends Component {
  static propTypes = {
    setSnackbarProps: PropTypes.func,
    snackbarProps: PropTypes.object,
  }

  getSnackbarProps = () => Object.assign(
    {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      autoHideDuration: 6000,
      onClose: () => this.props.setSnackbarProps(null),
      open: false,
    },
    this.props.snackbarProps
  )

  render() {
    return (
      <Snackbar { ...this.getSnackbarProps() } />
    );
  }
}

import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { routeCodes } from 'constants/routes';
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

const AUTO_HIDE_DURATION = 6000;

/**
 * This is a generic container for dialogs. It exists to reduce boilerplate code
 * and standardize stylistic decisions
 */
class DialogContainer extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    history: PropTypes.object,
    reasonToLock: PropTypes.string,
    title: PropTypes.string,
  }

  state = {
    open: true,
    showSnackbar: false,
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.reasonToLock !== this.props.reasonToLock) {
      this.setState({ showSnackbar: false });
    }
  }

  handleCloseRequest = () => {
    const { reasonToLock } = this.props;

    if (reasonToLock == null) {
      this.closeDialog();
    } else {
      this.setState({ showSnackbar: true }, () => {
        setTimeout(() => {
          this.setState({ showSnackbar: false } );
        }, AUTO_HIDE_DURATION);
      });
    }
  };

  closeDialog = () => {
    this.setState(
      { open: false },

      // We add a delay before changing the route to allow UI transitions to flush out
      () => setTimeout(() => this.props.history.push(routeCodes.HOME), 225)
    );
  }

  render() {
    const { children, reasonToLock, title } = this.props;
    const { showSnackbar } = this.state;

    return (
      <div>
        <Dialog
          open={ this.state.open }
          onClose={ this.handleCloseRequest }
          aria-labelledby='responsive-dialog-title'
          fullWidth={ true }
          maxWidth='md'
        >
          { title && (
            <DialogTitle>{ title }</DialogTitle>
          )}
          <DialogContent>
            { children }
          </DialogContent>
          <DialogActions>
            <Button onClick={ this.handleCloseRequest } color='primary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        {(
          <Snackbar
            anchorOrigin={ {
              vertical: 'bottom',
              horizontal: 'center',
            } }
            open={ showSnackbar }
            SnackbarContentProps={ { 'aria-describedby': 'message-id' } }
            message={ <span>{ reasonToLock }</span> }
            transition={ Fade }
            action={
              [
                <Button
                  key='undo'
                  color='primary'
                  size='small'
                  onClick={ this.closeDialog }
                >
                  Cancel Anyway
                </Button>,
              ]
            }
          />
        )}
      </div>
    );
  }
}

export default withRouter(DialogContainer);

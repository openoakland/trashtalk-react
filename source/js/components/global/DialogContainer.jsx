import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { routeCodes } from 'constants/routes';
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';
import { withStyles } from 'material-ui/styles';

import Dialog, { DialogActions, DialogContentText, DialogContent, DialogTitle } from 'material-ui/Dialog';

const AUTO_HIDE_DURATION = 6000;

const styles = theme => ({
  childrenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  snackbar: {
    margin: theme.spacing.unit,
  },
  subtitle: {
    maxHeight: 52,
  },
});

/**
 * This is a generic container for dialogs. It exists to reduce boilerplate code
 * and standardize stylistic decisions
 */
@withStyles(styles)
class DialogContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.element),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    classes: PropTypes.object,
    dialogClasses: PropTypes.object,
    history: PropTypes.object,
    reasonToLock: PropTypes.string,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    triggerClose: PropTypes.bool,
  };

  static defaultProps = {
    actions: [],
  };

  state = {
    open: true,
    showSnackbar: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.reasonToLock !== this.props.reasonToLock) {
      this.handleSnackbarClose();
    }

    if (nextProps.triggerClose) {
      this.closeDialog();
    }
  }

  handleCloseRequest = () => {
    const { reasonToLock } = this.props;

    if (reasonToLock == null) {
      this.closeDialog();
    } else {
      this.setState({ showSnackbar: true });
    }
  };

  handleSnackbarClose = () => this.setState({ showSnackbar: false })

  closeDialog = () => {
    this.setState(
      { open: false },

      // We add a delay before changing the route to allow UI transitions to flush out
      () => setTimeout(() => this.props.history.push(routeCodes.HOME), 225)
    );
  };

  render() {
    const {
      actions, classes, dialogClasses, children, reasonToLock, subtitle, title,
    } = this.props;
    const { showSnackbar } = this.state;

    return (
      <div>
        <Dialog
          classes={ dialogClasses }
          open={ this.state.open }
          onClose={ this.handleCloseRequest }
          aria-labelledby='responsive-dialog'
          fullWidth={ true }
          maxWidth='md'
        >
          {title && <DialogTitle>{title}</DialogTitle>}
          {subtitle && (
            <DialogContent className={ classes.subtitle }>
              <DialogContentText>{subtitle}</DialogContentText>
            </DialogContent>
          )}
          <DialogContent className={ classes.childrenContainer }>{children}</DialogContent>
          <DialogActions>
            {actions.map((action, index) => (
              <div key={ index }>{action}</div>
            )) /* eslint-disable-line react/no-array-index-key */}
            <Button
              onClick={ this.handleCloseRequest }
              color='primary'
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={ {
            vertical: 'bottom',
            horizontal: 'center',
          } }
          autoHideDuration={ AUTO_HIDE_DURATION }
          onClose={ this.handleSnackbarClose }
          open={ showSnackbar }
          SnackbarContentProps={ { 'aria-describedby': 'message-id' } }
          message={ reasonToLock }
          transition={ Fade }
          action={ [
            <Button
              key='undo'
              color='primary'
              size='small'
              onClick={ this.closeDialog }
            >
              Close Anyway
            </Button>,
          ] }
        />
      </div>
    );
  }
}

export default withRouter(DialogContainer);

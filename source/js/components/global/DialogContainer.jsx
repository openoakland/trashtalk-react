import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { routeCodes } from 'constants/routes';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { setSnackbarProps } from 'actions/app';

const styles = theme => ({
  additionalActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalActionContainer: {
    margin: theme.spacing.unit,
  },
  dialogActions: {
    justifyContent: 'space-between',
  },
  childrenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  subtitle: {
    maxHeight: 52,
  },
});

/**
 * This is a generic container for dialogs. It exists to reduce boilerplate code
 * and standardize stylistic decisions
 */
@connect(
  () => ({}),
  dispatch => bindActionCreators({ setSnackbarProps }, dispatch)
)
@withStyles(styles)
class DialogContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.element),
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    classes: PropTypes.object,
    dialogClasses: PropTypes.object,
    history: PropTypes.object,
    reasonToLock: PropTypes.string,
    setSnackbarProps: PropTypes.func,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    triggerClose: PropTypes.bool,
  };

  static defaultProps = {
    actions: [],
  };

  state = { open: true };

  componentWillReceiveProps(nextProps) {
    if (nextProps.triggerClose) {
      this.closeDialog();
    }
  }

  handleCloseRequest = () => {
    const { reasonToLock } = this.props;

    if (reasonToLock == null) {
      this.closeDialog();
    } else {
      this.props.setSnackbarProps({
        action: [
          <Button
            key='undo'
            color='primary'
            size='small'
            onClick={ this.handleCloseSnackbarClick }
          >
            Close Anyway
          </Button>,
        ],
        message: reasonToLock,
        open: true,
      });
    }
  };

  handleCloseSnackbarClick = () => {
    this.closeDialog();
    this.props.setSnackbarProps(null);
  }

  closeDialog = () => {
    this.setState(
      { open: false },

      // We add a delay before changing the route to allow UI transitions to finish animating
      () => setTimeout(
        () => this.props.history.push(routeCodes.HOME),
        200
      )
    );
  };

  render() {
    const {
      actions, classes, dialogClasses, children, subtitle, title,
    } = this.props;

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
          <DialogActions className={ classes.dialogActions }>
            <div className={ classes.additionalActions }>
              {actions.map((action, index) => (/* eslint-disable-line react/no-array-index-key */
                <div key={ index } className={ classes.additionalActionContainer }>{action}</div> // eslint-disable-line
              ))}
            </div>
            <Button
              onClick={ this.handleCloseRequest }
              color='primary'
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(DialogContainer);

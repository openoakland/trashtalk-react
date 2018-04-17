import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { routeCodes } from 'constants/routes';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import CleanupSummary from 'components/cleanup/CleanupSummary';

const styles = {
  stepStyle: {
    width: '100vw',
    maxWidth: '100%',
  },
};

export const SUMMARY = 3;

/**
 * This class encompasses all the view logic required to create a new Cleanup
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
class CleanupView extends React.Component {
  static propTypes = {
    cleanups: PropTypes.object,
    cleanupId: PropTypes.number,
    history: PropTypes.object,
  }

  state = {
    open: true,
  }

  handleClose = () => {
    // The fadeout transition takes a little while, so pause temporarily to
    // allow animation to finish before actual browser history push
    this.setState(
      { open: false },
      () => setTimeout(() => this.props.history.push(routeCodes.HOME), 225)
    );
  };

  render() {
    const { cleanups, cleanupId } = this.props;
    const cleanup = (cleanups || {})[cleanupId];

    if (cleanup == null) {
      return null;
    }

    return (
      <Dialog
        open={ this.state.open }
        onClose={ this.handleClose }
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle>{ cleanup.getName() }</DialogTitle>
        <DialogContent>
          <CleanupSummary
            cleanup={ cleanup }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.handleClose } color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(withMobileDialog()(CleanupView));

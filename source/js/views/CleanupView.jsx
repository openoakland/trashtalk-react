import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import DialogContainer from 'components/global/DialogContainer';
import CleanupSummary from 'components/cleanup/CleanupSummary';
import { CardHeader } from 'material-ui';
import Icon from 'material-ui/Icon';

import { redirectToLogin } from 'api/auth';
import { patchCleanup } from 'actions/cleanups';
import * as Immutable from 'immutable';

import { setBackgroundMapLocation } from 'actions/app';

const styles = theme => ({
  dialogPaper: { height: '100%' },
  placesIcon: {
    colorPrimary: '#eb4335',
    height: 60,
  },
  title: {
    fontSize: '1.5rem',
  },
});

/**
 * This component is used to display the details of a cleanup
 */
@connect(
  (state, props) => {
    return {
      cleanup: state.cleanups.getIn([
        'cleanups',
        Number(props.match.params.cleanupId)
      ]),
      user: state.app.get('user'),
    };
  },
  dispatch => bindActionCreators({ patchCleanup, setBackgroundMapLocation }, dispatch)
)
@withStyles(styles)
export default class CleanupView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.object,
    patchCleanup: PropTypes.func,
    setBackgroundMapLocation: PropTypes.func,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { cleanup } = props;
    if (cleanup != null) {
      this.props.setBackgroundMapLocation(cleanup.location);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.cleanup, nextProps.cleanup) && nextProps.cleanup != null) {
      this.props.setBackgroundMapLocation(nextProps.cleanup.location);
    }
  }

  getSubheader = () => {
    const { cleanup, user } = this.props;
    if (cleanup == null) {
      return null;
    }

    let subheader = null;
    if (cleanup.hasHost(user)) {
      subheader = 'You are the host of this cleanup';
    } else if (cleanup.hasParticipant(user)) {
      subheader = 'You are participating in this cleanup';
    }

    return subheader;
  }

  toggleUserAsParticipant = () => {
    const { cleanup, user } = this.props;
    if (user == null) {
      redirectToLogin();
    }

    this.props.patchCleanup(cleanup.toggleParticipant(user).toApiJSON());
  }

  render() {
    const { classes, cleanup, user } = this.props;

    const actions = [];
    if (cleanup && !cleanup.hasHost(user)) {
      actions.push(
        <Button
          variant='raised'
          color='primary'
          onClick={ this.toggleUserAsParticipant }
        >
          Participate in this cleanup
        </Button>
      );
    }

    return (
      <DialogContainer
        dialogClasses={{ paper: classes.dialogPaper }}
        actions={ actions }
      >
        <CardHeader
          title={ cleanup ? cleanup.title : 'Loading...' }
          subheader={ this.getSubheader() }
          avatar={ <Icon classes={ { colorPrimary: classes.placesIcon.colorPrimary } }>place</Icon> }
          classes={ { title: classes.title } }
        />

        {cleanup && <CleanupSummary cleanup={ cleanup } />}
      </DialogContainer>
    );
  }
}

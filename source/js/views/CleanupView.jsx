import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import DialogContainer from 'components/global/DialogContainer';
import CleanupSummary from 'components/cleanup/CleanupSummary';
import { CardContent, CardHeader } from 'material-ui';
import DateRepresentation from 'components/cleanup/DateRepresentation';

import { redirectToLogin } from 'api/auth';
import { patchCleanup } from 'actions/cleanups';
import * as Immutable from 'immutable';

import { setBackgroundMapLocation } from 'actions/app';

const styles = theme => ({
  dialogPaper: { height: '100%', padding: 0 },
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

    this.state = { cleanup };
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.cleanup, nextProps.cleanup)) {
      this.setState({ cleanup: nextProps.cleanup });
      this.props.setBackgroundMapLocation(nextProps.cleanup.location);
    }
  }

  componentWillUnmount() {
    if (!Immutable.is(this.props.cleanup, this.state.cleanup)) {
      this.props.patchCleanup(this.state.cleanup.toApiJSON());
    }
  }

  setCleanup = cleanup => this.setState({ cleanup })

  toggleUserAsParticipant = () => {
    const { user } = this.props;
    const { cleanup } = this.state;
    if (user == null) {
      redirectToLogin();
    }

    this.props.patchCleanup(cleanup.toggleParticipant(user).toApiJSON());
  }

  render() {
    const { classes, user } = this.props;
    const { cleanup } = this.state;

    const actions = [];
    let subheader;
    if (cleanup != null) {
      if (!cleanup.hasHost(user)) {
        actions.push(
          <Button
            variant='raised'
            color='primary'
            onClick={ this.toggleUserAsParticipant }
          >
            { cleanup.hasParticipant(user) ? 'Remove me from this cleanup' : 'Add me to this cleanup' }
          </Button>
        );
      }

      if (cleanup.hasHost(user)) {
        subheader = ' You are the host of this cleanup';
      } else if (cleanup.hasParticipant(user)) {
        subheader = 'You are a participant in this cleanup';
      }
    }

    // If the user is the host, allow him/her to modify the cleanup by passing the setCleanup method
    const setCleanup = cleanup != null && cleanup.hasHost(user) ? this.setCleanup : null;

    return (
      <DialogContainer
        dialogClasses={{ paper: classes.dialogPaper }}
        actions={ actions }
      >
        <CardHeader
          title={ cleanup == null ? 'Loading...' : (cleanup.title || cleanup.query) }
          subheader={ subheader }
          classes={ { title: classes.title } }
        />
        { cleanup.description && cleanup.description !== '' && (
          <CardContent>
            { cleanup.description }
          </CardContent>
        )}
        <CardContent>
          <DateRepresentation
            cleanup={ cleanup }
            setCleanup={ setCleanup }
          />
        </CardContent>
        <CleanupSummary
          cleanup={ cleanup }
          user={ user }
          setCleanup={ setCleanup }
        />
      </DialogContainer>
    );
  }
}

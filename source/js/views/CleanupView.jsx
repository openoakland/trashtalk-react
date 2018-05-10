import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import DialogContainer from 'components/global/DialogContainer';
import CleanupSummary from 'components/cleanup/CleanupSummary';
import Metadata from 'components/cleanup/Metadata';
import Typography from 'material-ui/Typography';
import { CardContent } from 'material-ui/Card';

import { redirectToLogin } from 'api/auth';
import { patchCleanup } from 'actions/cleanups';
import * as Immutable from 'immutable';

import { setBackgroundMapLocation } from 'actions/app';

const styles = theme => ({
  dialogPaper: { height: '100%', padding: 0 },
  icon: {
    marginRight: theme.spacing.unit,
  },
  placesIcon: {
    colorPrimary: '#eb4335',
    height: 60,
  },
  subheading: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
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
        subheader = 'You are the host of this cleanup';
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
        <Metadata cleanup={ cleanup } setCleanup={ setCleanup } />
        {subheader && (
          <CardContent>
            <Typography color='primary' variant='subheading' className={ classes.subheading }>
              <Icon className={ classes.icon }>person</Icon>
              { cleanup == null ? 'Loading...' : subheader }
            </Typography>
          </CardContent>
        )}
        <br />
        <CleanupSummary
          cleanup={ cleanup }
          user={ user }
          setCleanup={ setCleanup }
        />
      </DialogContainer>
    );
  }
}

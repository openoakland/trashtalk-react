import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Avatar from 'material-ui/Avatar';
import DialogContainer from 'components/global/DialogContainer';
import CleanupSummary from 'components/cleanup/CleanupSummary';
import { CardHeader } from 'material-ui';
import Icon from 'material-ui/Icon';

import { setBackgroundMapLocation } from 'actions/app';

const styles = theme => ({
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
      cleanups: state.cleanups.get('cleanups'),
      cleanupId: Number(props.match.params.cleanupId),
    };
  },
  dispatch => bindActionCreators({ setBackgroundMapLocation }, dispatch)
)
@withStyles(styles)
export default class CleanupView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    cleanups: PropTypes.object,
    cleanupId: PropTypes.number,
    setBackgroundMapLocation: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const { cleanupId } = props;
    if (props.cleanups.has(cleanupId)) {
      this.props.setBackgroundMapLocation(props.cleanups.get(cleanupId).location);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { cleanupId } = this.props;
    if (!this.props.cleanups.has(cleanupId) && nextProps.cleanups.has(cleanupId)) {
      this.props.setBackgroundMapLocation(nextProps.cleanups.get(cleanupId).location);
    }
  }

  render() {
    const { classes, cleanups, cleanupId } = this.props;
    const cleanup = cleanups.get(cleanupId);

    return (
      <DialogContainer>
        <CardHeader
          title={ cleanup ? cleanup.title : 'Loading...' }
          avatar={ <Icon classes={ { colorPrimary: classes.placesIcon.colorPrimary } }>place</Icon> }
          classes={ { title: classes.title } }
        />

        {cleanup && <CleanupSummary cleanup={ cleanup } />}
      </DialogContainer>
    );
  }
}

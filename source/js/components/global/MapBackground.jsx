
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import GoogleMap from 'components/GoogleMap';
import { getCleanups } from 'actions/cleanups';
import { setBackgroundMapLocation, setBackgroundMapReference } from 'actions/app';

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    zIndex: -1,
  },
};

@connect(
  state => ({
    cleanups: state.cleanups.get('cleanups'),
    backgroundMapLocation: state.app.get('backgroundMapLocation'),
    backgroundMapReference: state.app.get('backgroundMapReference'),
    userLocation: state.app.get('userLocation'),
  }),
  dispatch => bindActionCreators({
    getCleanups, setBackgroundMapLocation, setBackgroundMapReference,
  }, dispatch)
)
/**
 * This component is the default map always shown (and shown in the background when modals are open)
 */
export default class MapBackground extends Component {
  static propTypes = {
    backgroundMapLocation: PropTypes.object,
    backgroundMapReference: PropTypes.object,
    cleanups: PropTypes.object,
    getCleanups: PropTypes.func,
    mapCenter: PropTypes.object,
    setBackgroundMapReference: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.props.getCleanups();
  }

  /**
   * Tasks that need to be performed after map initialization go here
   */
  componentWillReceiveProps(nextProps) {
    // If the background map location is changed, update map center
    if (
      nextProps.backgroundMapLocation != null && (
        this.props.backgroundMapLocation == null ||
        !nextProps.backgroundMapLocation.isAt(this.props.backgroundMapLocation)
      )
    ) {
      nextProps.backgroundMapLocation.setMapCenter(this.props.backgroundMapReference);
    }
  }

  render() {
    const { cleanups, mapCenter } = this.props;
    return (
      <div
        style={ styles.container }
      >
        <GoogleMap
          cleanups={ cleanups }
          mapCenter={ mapCenter }
          handleMapInitialization={ this.props.setBackgroundMapReference }
          zoom={ 14 }
        />
      </div>
    );
  }
}

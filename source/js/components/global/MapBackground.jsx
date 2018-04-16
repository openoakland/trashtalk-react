
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import GoogleMap from 'components/GoogleMap';
import { getCleanups } from 'actions/cleanups';
import { getUserLocation, setBackgroundMapLocation, setBackgroundMapReference } from 'actions/app';

import Location from 'models/Location';

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
    getCleanups, setBackgroundMapLocation, setBackgroundMapReference, getUserLocation,
  }, dispatch)
)
/**
 * This component is the default map always shown (and shown in the background when modals are open)
 */
export default class MapBackground extends Component {
  static propTypes = {
    backgroundMapLocation: PropTypes.object,
    backgroundMapReference: PropTypes.object,
    cleanups: PropTypes.array,
    getCleanups: PropTypes.func,
    mapCenter: PropTypes.object,
    setBackgroundMapReference: PropTypes.func,
    getUserLocation: PropTypes.func,
    userLocation: PropTypes.instanceOf(Location),
  }

  static defaultProps = {
    cleanups: [],
  }

  /**
   * Tasks that need to be performed after map initialization go here
   * @param {*} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.backgroundMapReference == null && nextProps.backgroundMapReference != null) {
      // Get all the cleanups so we can display them on the map
      this.props.getCleanups();
    }

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

  getUserLocation = () => {
    const { userLocation } = this.props;
    if (userLocation == null) {
      this.props.getUserLocation();
    }
  }

  render() {
    const { cleanups, mapCenter } = this.props;
    const cleanupLocations = cleanups.map(cleanup => cleanup.location);
    return (
      <div
        onMouseEnter={ this.getUserLocation }
        style={ styles.container }
      >
        <GoogleMap
          locations={ cleanupLocations }
          mapCenter={ mapCenter }
          setMapReference={ this.props.setBackgroundMapReference }
        />
      </div>
    );
  }
}

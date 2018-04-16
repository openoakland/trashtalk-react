
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import GoogleMap from 'components/GoogleMap';
import { getCleanups } from 'actions/cleanups';
import { setBackgroundMapLocation, setBackgroundMapReference } from 'actions/app';

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
  }),
  dispatch => bindActionCreators({ getCleanups, setBackgroundMapLocation, setBackgroundMapReference }, dispatch)
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
    setBackgroundMapLocation: PropTypes.func,
    setBackgroundMapReference: PropTypes.func,
  }

  static defaultProps = {
    cleanups: [],
  }

  componentWillReceiveProps(nextProps) {
    // Tasks that need to be performed after map initialization go here
    if (this.props.backgroundMapReference == null && nextProps.backgroundMapReference != null) {
      // Attempt to center map to user location
      this.initializeMapCenter();

      // Get all the cleanups so we can display on the map
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

  initializeMapCenter = () => {
    navigator.geolocation.getCurrentPosition((position) =>
      this.props.setBackgroundMapLocation(new Location({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }))
    );
  }

  render() {
    const { cleanups, mapCenter } = this.props;
    const cleanupLocations = cleanups.map(cleanup => cleanup.location);
    return (
      <div
        onMouseEnter={ this.getLocation }
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

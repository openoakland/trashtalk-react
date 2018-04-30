import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CLEANUP_ROOT } from 'constants/routes';
import { Map, Set } from 'immutable';

import Location from 'models/Location';

const styles = {
  container: {
    display: 'flex',
    backgroundColor: 'rgb(228, 226, 222)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
};

const DEFAULT_ZOOM = 17;

class GoogleMap extends Component {
  static propTypes = {
    cleanups: PropTypes.array,
    history: PropTypes.object,
    mapCenter: PropTypes.object,
    setMapReference: PropTypes.func,
    zoom: PropTypes.number,
  };

  static defaultProps = {
    mapCenter: new Location(),
    zoom: DEFAULT_ZOOM,
  };

  state = {
    id: Date.now(),
    cleanupMarkers: Map(),
    mapReference: null, // After we initialize the Google Map object, we store the reference here
  };

  /**
   * After this component is mounted, initialize the Google Map object and mount to this element.
   * Also save a reference to the Map object so that it can be used elsewhere, e.g.: in this.markLocations()
   */
  componentDidMount() {
    const { id } = this.state;
    const { setMapReference, zoom } = this.props;

    // Initialize Google Map object using mapCenter inside mapContainer
    // https://developers.google.com/maps/documentation/javascript/adding-a-google-map
    const mapCenter = this.props.mapCenter || new Location();
    const mapReference = new window.google.maps.Map(document.getElementById(id), {
      center: mapCenter.getLatLngObj(),
      zoom,
    });

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ mapReference }, () => {
      this.syncCleanupMarkers(this.props.cleanups);

      if (setMapReference) {
        setMapReference(mapReference);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // Here we should check to see if nextProps.mapCenter has changed.
    // If it has, recenter map to new location
    if (nextProps.mapCenter && (this.props.mapCenter == null || !nextProps.mapCenter.isAt(this.props.mapCenter))) {
      const { mapReference } = this.state;
      mapReference.panTo(nextProps.mapCenter.getLatLngObj());
    }

    // If the array of locations have changed, markLocations again
    this.syncCleanupMarkers(nextProps.cleanups);
  }

  componentWillUnmount() {
    const { cleanupMarkers } = this.state;
    cleanupMarkers.forEach((marker) => {
      marker.setMap(null);
    });
  }

  /**
   * Given an array of cleanups, mark them on the rendered map
   * https://developers.google.com/maps/documentation/javascript/examples/marker-simple
   * https://developers.google.com/maps/documentation/javascript/markers
   */
  syncCleanupMarkers = cleanups => {
    const { mapReference } = this.state;
    // If the map hasn't been initialized yet, just bail out
    if (mapReference == null) {
      return;
    }

    let { cleanupMarkers } = this.state;
    // First remove any existing cleanup markers that aren't the passed in cleanups param
    const cleanupsSet = Set(cleanups);
    cleanupMarkers.forEach((marker, cleanup) => {
      if (!cleanupsSet.has(cleanup)) {
        marker.setMap(null);
        cleanupMarkers = cleanupMarkers.delete(cleanup);
      }
    });

    // Now add cleanup markers that haven't already been added
    if (cleanups != null) {
      cleanups.filter(cleanup => !cleanupMarkers.has(cleanup)).forEach(cleanup => {
        const marker = new window.google.maps.Marker({
          animation: window.google.maps.Animation.DROP,
          position: cleanup.location.getLatLngObj(),
          map: mapReference,
        });

        // If the cleanup is an existing cleanup, make it clickable so that
        // users are taken to the cleanup's details view
        if (cleanup.has('id')) {
          marker.addListener('click', () => this.props.history.push(`${ CLEANUP_ROOT }${ cleanup.id }`));
        }
        cleanupMarkers = cleanupMarkers.set(cleanup, marker);
      });

      this.setState({ cleanupMarkers });
    }
  };

  render() {
    const { id } = this.state;
    return (<div
      id={ id }
      style={ styles.container }
    />);
  }
}

export default withRouter(GoogleMap);

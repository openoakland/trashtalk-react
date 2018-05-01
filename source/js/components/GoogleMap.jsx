import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Immutable, { Map, Set } from 'immutable';

import Location from 'models/Location';

import { RETRO as THEME } from './GoogleMap/styles';

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
    handleMapInitialization: PropTypes.func,
    zoom: PropTypes.number,
  };

  static defaultProps = {
    mapCenter: new Location(),
    zoom: DEFAULT_ZOOM,
  };

  state = {
    id: Date.now(), // Unique ID assigned to element that would contain the Goole Map
    cleanupMarkers: Map(), // Collection to keep track of markers that have been created
    mapReference: null, // After initializing the Google Map object, store the reference here
  };

  /**
   * After this component is mounted, initialize the Google Map object and mount to this component.
   * Also save a reference to the Map object so that it can be used elsewhere
   */
  componentDidMount() {
    const { id } = this.state;
    const { handleMapInitialization, zoom } = this.props;

    // Initialize Google Map object using mapCenter inside mapContainer
    // https://developers.google.com/maps/documentation/javascript/adding-a-google-map
    const mapCenter = this.props.mapCenter || new Location();
    const styledMapType = new window.google.maps.StyledMapType(THEME.styles, THEME.name);
    const mapReference = new window.google.maps.Map(document.getElementById(id), {
      center: mapCenter.getLatLngObj(),
      zoom,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map'],
      },
    });

    // Associate the styled map with the MapTypeId and set it to display.
    mapReference.mapTypes.set('styled_map', styledMapType);
    mapReference.setMapTypeId('styled_map');

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ mapReference }, () => {
      this.syncCleanupMarkers(this.props.cleanups);

      if (handleMapInitialization) {
        handleMapInitialization(mapReference);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // Check to see if the mapCenter has changed.
    // If it has, recenter map to new location
    if (nextProps.mapCenter && (this.props.mapCenter == null || !nextProps.mapCenter.isAt(this.props.mapCenter))) {
      const { mapReference } = this.state;
      mapReference.panTo(nextProps.mapCenter.getLatLngObj());
    }

    // If the collection of cleanups gets updated, resync the cleanup markers
    if (!Immutable.is(nextProps.cleanups, this.props.cleanups)) {
      this.syncCleanupMarkers(nextProps.cleanups);
    }
  }

  componentWillUnmount() {
    const { cleanupMarkers } = this.state;
    cleanupMarkers.forEach(marker => {
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

        // If the cleanup has been persisted (it would have an id), make it clickable so that
        // users can click on it and view its details
        if (cleanup.get('id') != null) {
          marker.addListener('click', () => this.props.history.push(cleanup.getCleanupPath()));
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

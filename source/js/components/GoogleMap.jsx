import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
const PIN_DROP_DURATION = 500; // The time it takes for all pins to drop when animating

@connect(
  (state) => {
    return {
      user: state.app.get('user'),
    };
  },
  dispatch => bindActionCreators({}, dispatch)
)
export class GoogleMap extends Component {
  static propTypes = {
    animate: PropTypes.bool,
    cleanups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    history: PropTypes.object,
    mapCenter: PropTypes.object,
    handleMapInitialization: PropTypes.func,
    user: PropTypes.object,
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

    // If the user has changed, clear the markers. They will be recreated in componentDidUpdate with user specific info
    if (!Immutable.is(nextProps.user, this.props.user)) {
      this.clearMarkers();
    }
  }

  componentDidUpdate(prevProps) {
    // If the user has changed, re-render the markers so that they're properly marked with user info
    if (!Immutable.is(prevProps.user, this.props.user)) {
      const animate = false;
      this.syncCleanupMarkers(this.props.cleanups, animate);
    }
  }

  componentWillUnmount() {
    this.clearMarkers();
  }

  getNewMarker = (cleanup, animate) => {
    const { user } = this.props;
    let label;
    if (user != null) {
      if (cleanup.hasHost(user)) {
        label = 'H';
      } else if (cleanup.hasParticipant(user)) {
        label = 'P';
      }
    }

    const marker = new window.google.maps.Marker({
      animation: animate ? window.google.maps.Animation.DROP : null,
      label,
      position: cleanup.location.getLatLngObj(),
    });

    // If the cleanup has been persisted in the DB (it would have an id), make it clickable so that
    // users can click on it and view its details
    if (cleanup.get('id') != null) {
      marker.addListener('click', () => this.props.history.push(cleanup.getCleanupPath()));
    }

    return marker;
  }

  clearMarkers = () => {
    const { cleanupMarkers } = this.state;
    cleanupMarkers.forEach(marker => marker.setMap(null));
    this.setState({ cleanupMarkers: Map() });
  }

  /**
   * Given an array of cleanups, mark them on the rendered map
   * https://developers.google.com/maps/documentation/javascript/examples/marker-simple
   * https://developers.google.com/maps/documentation/javascript/markers
   */
  syncCleanupMarkers = (cleanups, defaultAnimateParam = true) => {
    const { mapReference } = this.state;
    if (mapReference == null) { return; }

    const animate = this.props.animate != null ? this.props.animate : defaultAnimateParam;
    let { cleanupMarkers } = this.state;

    // First remove any stale cleanup markers that are missing from the cleanups param
    const currentCleanups = Set(cleanups);
    cleanupMarkers.forEach((marker, cleanup) => {
      if (!currentCleanups.has(cleanup)) {
        marker.setMap(null);
        cleanupMarkers = cleanupMarkers.delete(cleanup);
      }
    });

    // Now loop through the cleanups that haven't been added and add markers to each
    cleanups.forEach(cleanup => {
      if (!cleanupMarkers.has(cleanup)) {
        // Create a cleanup marker and persist it so it can be manipulated later, e.g.: in this.clearMarkers()
        const newMarker = this.getNewMarker(cleanup, animate);
        cleanupMarkers = cleanupMarkers.set(cleanup, newMarker);

        // Add the marker to the map
        setTimeout(
          () => newMarker.setMap(mapReference),
          animate ? PIN_DROP_DURATION * Math.random() : 0
        );
      }
    });

    this.setState({ cleanupMarkers });
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

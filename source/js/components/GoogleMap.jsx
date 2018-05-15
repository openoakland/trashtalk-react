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

@connect(
  (state) => {
    return {
      user: state.app.get('user'),
    };
  },
  dispatch => bindActionCreators({}, dispatch)
)
class GoogleMap extends Component {
  static propTypes = {
    animate: PropTypes.bool,
    cleanups: PropTypes.object,
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

  clearMarkers = () => {
    const { cleanupMarkers } = this.state;
    cleanupMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.setState({
      cleanupMarkers: Map(),
    });
  }

  /**
   * Given an array of cleanups, mark them on the rendered map
   * https://developers.google.com/maps/documentation/javascript/examples/marker-simple
   * https://developers.google.com/maps/documentation/javascript/markers
   */
  syncCleanupMarkers = (cleanups, animateParam = true) => {
    const { mapReference } = this.state;
    const { user } = this.props;
    // If the map hasn't been initialized yet, just bail out
    if (mapReference == null) {
      return;
    }

    const animate = this.props.animate != null ? this.props.animate : animateParam;

    let { cleanupMarkers } = this.state;
    // First remove any existing cleanup markers that aren't in the cleanups param
    const cleanupsSet = Set(cleanups);
    cleanupMarkers.forEach((marker, cleanup) => {
      if (!cleanupsSet.has(cleanup)) {
        marker.setMap(null);
        cleanupMarkers = cleanupMarkers.delete(cleanup);
      }
    });

    // Now loop through the cleanups and add markers to each
    let markersToAdd = Immutable.List(); // We'll use this to separately animate the dropping of new markers
    if (cleanups != null) {
      cleanups
        .filter(cleanup => !cleanupMarkers.has(cleanup)) // Filter out cleanups that have already been added
        .forEach(cleanup => {
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

          // Persist a reference to the cleanup marker so that we can manipulate it later
          // e.g.: in this.clearMarkers()
          cleanupMarkers = cleanupMarkers.set(cleanup, marker);
          markersToAdd = markersToAdd.push(marker);
        });

      this.setState({ cleanupMarkers });

      // Add pins to map after setting state so that we can control the time between pin drops
      // without running into timing issues with setting the component state
      const MAX_DROP_TIME = 500; // The time it takes for all pins to drop
      markersToAdd.forEach(marker => {
        setTimeout(
          () => marker.setMap(mapReference),
          // If there's no animation, just render all the pin drops at the same time
          animate ? MAX_DROP_TIME * Math.random() : 0
        );
      });
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

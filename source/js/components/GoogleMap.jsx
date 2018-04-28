import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CLEANUP_ROOT } from 'constants/routes';

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
  }

  static defaultProps = {
    mapCenter: new Location(),
    zoom: DEFAULT_ZOOM,
  }

  state = {
    id: Date.now(),
    markers: [],
    mapReference: null, // After we initialize the Google Map object, we store the reference here
  }

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

    this.setState( // eslint-disable-line react/no-did-mount-set-state
      { mapReference },
      () => {
        this.clearMarkers();
        this.markCleanups(this.props);

        if (setMapReference) {
          setMapReference(mapReference);
        }
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    // Here we should check to see if nextProps.mapCenter has changed.
    // If it has, recenter map to new location
    if (
      nextProps.mapCenter && (this.props.mapCenter == null || !nextProps.mapCenter.isAt(this.props.mapCenter))
    ) {
      const { mapReference } = this.state;
      mapReference.setCenter(nextProps.mapCenter.getLatLngObj());
    }

    // If the array of locations have changed, markLocations again
    this.clearMarkers();
    this.markCleanups(nextProps);
  }

  clearMarkers = () => {
    this.state.markers.forEach(marker => marker.setMap(null));
  }
  /**
   * Given an array of cleanups, mark them on the rendered map
   * https://developers.google.com/maps/documentation/javascript/examples/marker-simple
   * https://developers.google.com/maps/documentation/javascript/markers
   */
  markCleanups = (props) => {
    const { cleanups } = props;
    const { mapReference } = this.state;

    if (mapReference != null && cleanups != null) {
      const markers = [];
      cleanups.forEach(cleanup => {
        const marker = new window.google.maps.Marker({
          position: cleanup.location.getLatLngObj(),
          map: mapReference,
        });

        // If the cleanup is an existing cleanup, make it clickable so that
        // users can navigate to it
        if (cleanup.has('id')) {
          marker.addListener('click', () => {
            this.props.history.push(`${ CLEANUP_ROOT }${ cleanup.id }`);
          });
        }
        markers.push(marker);
      });

      this.setState({ markers });
    }
  }

  render() {
    const { id } = this.state;
    return (
      <div id={ id } style={ styles.container } />
    );
  }
}

export default withRouter(GoogleMap);


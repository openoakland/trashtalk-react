import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

export default class GoogleMap extends Component {
  static propTypes = {
    locations: PropTypes.array,
    mapCenter: PropTypes.object,
    setMapReference: PropTypes.func,
    zoom: PropTypes.number,
  }

  static defaultProps = {
    locations: [],
    mapCenter: new Location(), // New Location objects default to middle of Oakland
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
    const {
      locations, mapCenter, setMapReference, zoom,
    } = this.props;

    // Initialize Google Map object using mapCenter inside mapContainer
    // https://developers.google.com/maps/documentation/javascript/adding-a-google-map
    const mapReference = new window.google.maps.Map(document.getElementById(id), {
      center: { lat: mapCenter.latitude, lng: mapCenter.longitude },
      zoom,
    });

    this.setState( // eslint-disable-line react/no-did-mount-set-state
      { mapReference },
      () => {
        this.markLocations(locations); // After we set the map reference, mark locations

        if (setMapReference) {
          setMapReference(mapReference);
        }
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    // Here we should check to see if nextProps.mapCenter has changed.
    // If it has, recenter map to new location
    if (!nextProps.mapCenter.isAt(this.props.mapCenter)) {
      const { mapReference } = this.state;
      mapReference.setCenter(nextProps.mapCenter.getLatLngObj());
    }

    // If the array of locations have changed, markLocations again
    this.markLocations(nextProps.locations);
  }

  /**
   * Given an array of locations, mark them on the rendered map
   * https://developers.google.com/maps/documentation/javascript/examples/marker-simple
   * https://developers.google.com/maps/documentation/javascript/markers
   */
  markLocations = (locations) => {
    const { mapReference } = this.state;

    // Clear out any existing markers
    this.state.markers.forEach(marker => marker.setMap(null));

    if (mapReference != null && locations != null) {
      const markers = [];
      locations.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: mapReference,
        });
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


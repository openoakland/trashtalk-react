
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import GoogleMap from 'components/GoogleMap';
import { getCleanups } from 'actions/cleanups';
import { setMapReference } from 'actions/app';

import { Cleanup, Location } from 'models';

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
    mapCenter: state.app.get('mapCenter'),
  }),
  dispatch => bindActionCreators({ getCleanups, setMapReference }, dispatch)
)
export default class MapBackground extends Component {
  static propTypes = {
    cleanups: PropTypes.array,
    getCleanups: PropTypes.func,
    mapCenter: PropTypes.object,
    setMapReference: PropTypes.func,
  }

  static defaultProps = {
    cleanups: [],
  }

  componentWillMount() {
    this.props.getCleanups();
  }

  getLocation = () => {
    const getSuccess = (location) => console.debug(location);
    navigator.geolocation.getCurrentPosition(getSuccess);
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
          setMapReference={ this.props.setMapReference }
        />
      </div>
    );
  }
}

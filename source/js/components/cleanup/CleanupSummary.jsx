import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import { screens } from 'constants/cleanup';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const styles = theme => ({
  BottomNavigationAction: {
  },
  bottomNavigation: {
    width: '100%',
    justifyContent: 'space-around',
  },
  summaryItemContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

const {
  LOCATION_SELECTION, TOOL_SELECTION,
} = screens;

/**
 * Shows summary for a cleanup
 */
@withStyles(styles)
class CleanupSummary extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.object,
    setCleanup: PropTypes.func,
    user: PropTypes.object,
  }

  state = { value: LOCATION_SELECTION }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  renderSummaryItem = () => {
    const { value } = this.state;
    const { cleanup } = this.props;

    const props = {
      cleanup,
      setCleanup: this.props.setCleanup,
    };

    const stepMapping = {
      [LOCATION_SELECTION]: (
        <LocationRepresentation
          { ...props }
          animate={ false }
        />
      ),
      [TOOL_SELECTION]: (
        <ToolsRepresentation { ...props } />
      ),
    };

    return stepMapping[value];
  }

  render() {
    const { value } = this.state;
    const { classes, cleanup, user } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.summaryItemContainer } >
          { this.renderSummaryItem() }
        </div>
        { cleanup && cleanup.hasHost(user) && (
          <BottomNavigation
            className={ classes.bottomNavigation }
            value={ value }
            onChange={ this.handleChange }
            showLabels={ true }
          >
            <BottomNavigationAction
              className={ classes.bottomNavigation }
              label='Where'
              value={ LOCATION_SELECTION }
              icon={ <Icon> place </Icon> }
            />
            <BottomNavigationAction
              label='Tools'
              value={ TOOL_SELECTION }
              icon={ <Icon> list </Icon> }
            />
          </BottomNavigation>
        )}
      </div>
    );
  }
}

export default CleanupSummary;

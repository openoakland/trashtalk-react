import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import DateRepresentation from 'components/cleanup/DateRepresentation';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import Cleanup from 'models/Cleanup';
import { screens } from 'constants/cleanup';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';

const styles = theme => ({
  BottomNavigation: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.primary,
    justifyContent: 'space-around',
  },
});

const {
  LOCATION_SELECTION, DATE_SELECTION, SUMMARY, TOOL_SELECTION,
} = screens;

/**
 * Shows summary for a cleanup
 */
@withStyles(styles)
class CleanupSummary extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.instanceOf(Cleanup),
    toolSelections: PropTypes.object,
  }

  static defaultProps = {
  }

  state = { value: LOCATION_SELECTION }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  renderSummaryItem = () => {
    const { cleanup, toolSelections } = this.props;
    const { value } = this.state;

    const stepMapping = {
      [LOCATION_SELECTION]: (
        <LocationRepresentation cleanup={ cleanup } />
      ),
      [DATE_SELECTION]: (
        <DateRepresentation cleanup={ cleanup } />
      ),
      [TOOL_SELECTION]: (
        <ToolsRepresentation toolSelections={ toolSelections } />
      ),
    };

    return stepMapping[value];
  }

  render() {
    const { value } = this.state;
    const { classes } = this.props;

    return (
      <div>
        { this.renderSummaryItem() }
        <BottomNavigation
          className={ classes.BottomNavigation }
          value={ value }
          color='primary'
          onChange={ this.handleChange }
        >
          <BottomNavigationAction
            label='Where'
            value={ LOCATION_SELECTION }
            icon={ <Icon> place </Icon> }
          />
          <BottomNavigationAction
            label='When'
            value={ DATE_SELECTION }
            icon={ <Icon> date_range </Icon> }
          />
          <BottomNavigationAction
            label='Tools'
            value={ TOOL_SELECTION }
            icon={ <Icon> playlist_add_check </Icon> }
          />
        </BottomNavigation>
      </div>
    );
  }
}

export default CleanupSummary;

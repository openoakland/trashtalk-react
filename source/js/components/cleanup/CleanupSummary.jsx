import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import DateRepresentation from 'components/cleanup/DateRepresentation';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import { screens } from 'constants/cleanup';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';

const styles = theme => ({
  BottomNavigationAction: {
    color: theme.palette.secondary.light,
  },
  bottomNavigation: {
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
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
  LOCATION_SELECTION, DATE_SELECTION, SUMMARY, TOOL_SELECTION,
} = screens;

/**
 * Shows summary for a cleanup
 */
@withStyles(styles)
class CleanupSummary extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.object,
  }

  state = { value: LOCATION_SELECTION }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  renderSummaryItem = () => {
    const { cleanup } = this.props;
    const { value } = this.state;

    const stepMapping = {
      [LOCATION_SELECTION]: (
        <LocationRepresentation cleanup={ cleanup } />
      ),
      [DATE_SELECTION]: (
        <DateRepresentation cleanup={ cleanup } />
      ),
      [TOOL_SELECTION]: (
        <ToolsRepresentation cleanup={ cleanup } />
      ),
    };

    return stepMapping[value];
  }

  render() {
    const { value } = this.state;
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <div className={ classes.summaryItemContainer } >
          { this.renderSummaryItem() }
        </div>
        <BottomNavigation
          className={ classes.bottomNavigation }
          value={ value }
          onChange={ this.handleChange }
          showLabels={ true }
        >
          <BottomNavigationAction
            className={ classes.BottomNavigationAction }
            label='Where'
            value={ LOCATION_SELECTION }
            icon={ <Icon> place </Icon> }
          />
          <BottomNavigationAction
            className={ classes.BottomNavigationAction }
            label='When'
            value={ DATE_SELECTION }
            icon={ <Icon> date_range </Icon> }
          />
          <BottomNavigationAction
            className={ classes.BottomNavigationAction }
            label='Tools'
            value={ TOOL_SELECTION }
            icon={ <Icon> list </Icon> }
          />
        </BottomNavigation>
      </div>
    );
  }
}

export default CleanupSummary;

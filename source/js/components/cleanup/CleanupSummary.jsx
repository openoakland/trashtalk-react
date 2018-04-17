import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import DateRepresentation from 'components/cleanup/DateRepresentation';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import Cleanup from 'models/Cleanup';

export const LOCATION_SELECTION = 0;
export const DATE_SELECTION = 1;
export const TOOL_SELECTION = 2;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

/**
 * Shows summary for a cleanup
 */
class CleanupSummary extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.instanceOf(Cleanup),
    toolSelections: PropTypes.object,
  }

  static defaultProps = {
  }

  state = { tabIndex: 0 }

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  }

  renderSummaryItem = () => {
    const { cleanup, toolSelections } = this.props;
    const { tabIndex } = this.state;

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

    return stepMapping[tabIndex];
  }

  render() {
    const { classes } = this.props;
    const { tabIndex } = this.state;

    return (
      <Paper className={ classes.root }>
        <Tabs
          tabIndex={ tabIndex }
          onChange={ this.handleChange }
          fullWidth
        >
          <Tab label='Where' icon={ <Icon> place </Icon> } />
          <Tab label='When' icon={ <Icon> date_range </Icon> } />
          <Tab label='Tools' icon={ <Icon> playlist_add_check </Icon> } />
        </Tabs>
        { this.renderSummaryItem() }
      </Paper>
    );
  }
}

export default withStyles(styles)(CleanupSummary);

import React, { Component } from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import TimePicker from 'material-ui-pickers/TimePicker';
import DatePicker from 'material-ui-pickers/DatePicker';

import Cleanup from 'models/Cleanup';

const styles = theme => ({
  spacer: {
    display: 'inline-block',
    marginRight: theme.spacing.unit * 2,
  },
  timePicker: {
    width: 100,
  },
});

const ONE_HOUR = 3600000;

/**
 * Component for showing/selecting dates for a cleanup
 */
@withStyles(styles)
export default class DateRepresentation extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.instanceOf(Cleanup),
    setCleanup: PropTypes.func,
  }

  handleDateChange = (date) => {
    const eightAm = new Date(date.getTime() + (8 * ONE_HOUR));
    this.handleStartChange(eightAm);
  }

  handleStartChange = (start) => {
    const { cleanup, setCleanup } = this.props;
    const end = new Date(start.getTime() + ONE_HOUR + 1);

    setCleanup(cleanup
      .set('start', start)
      .set('end', end));
  }

  handleEndChange = (date) => {
    const { cleanup, setCleanup } = this.props;
    setCleanup(cleanup.set('end', date));
  }

  render() {
    const { classes, cleanup, setCleanup } = this.props;
    if (cleanup == null) {
      return null;
    }

    const { end, start } = cleanup;
    const minEndDate = start == null ? null : new Date(start.getTime() + ONE_HOUR);

    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils }>
        <span>
          <span className={ classes.spacer }>Date: </span>
          <span className={ classes.spacer }>
            <DatePicker
              autoOk={ true }
              disablePast={ true }
              disabled={ setCleanup == null }
              minDateMessage='Choose a day after today'
              value={ start }
              onChange={ this.handleDateChange }
            />
          </span>
          <span className={ classes.spacer }>Start time: </span>
          <span className={ classes.spacer }>
            <TimePicker
              autoOk={ true }
              className={ classes.timePicker }
              disabled={ setCleanup == null }
              value={ start }
              onChange={ this.handleStartChange }
            />
          </span>
          <span className={ classes.spacer }>End time: </span>
          <span className={ classes.spacer }>
            <TimePicker
              autoOk={ true }
              className={ classes.timePicker }
              disabled={ setCleanup == null || start == null }
              minDate={ minEndDate }
              minDateMessage='End time must be at least an hour after the start time'
              value={ end }
              onChange={ this.handleEndChange }
            />
          </span>
        </span>
      </MuiPickersUtilsProvider>
    );
  }
}

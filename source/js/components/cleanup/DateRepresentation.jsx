import React, { Component } from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import PropTypes from 'prop-types';

import TimePicker from 'material-ui-pickers/TimePicker';
import DatePicker from 'material-ui-pickers/DatePicker';
import { CardContent } from 'material-ui/Card';

import Cleanup from 'models/Cleanup';

const styles = {
  pickers: {
    display: 'inline-block',
    marginLeft: '.5rem',
    marginRight: '.5rem',
    height: '4rem',
  },
};

const ONE_HOUR = 3600000;

/**
 * Component for showing/selecting dates for a cleanup
 */
export default class DateRepresentation extends Component {
  static propTypes = {
    cleanup: PropTypes.instanceOf(Cleanup),
    setCleanup: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { startTime, endTime } = props.cleanup;

    this.state = {
      endTime,
      startTime,
    };
  }

  handleDateChange = (date) => {
    const eightAm = new Date(date.getTime() + (8 * ONE_HOUR));
    this.handleStartChange(eightAm);
  }

  handleStartChange = (startTime) => {
    const { cleanup, setCleanup } = this.props;
    const endTime = new Date(startTime.getTime() + ONE_HOUR + 1);

    this.setState({
      endTime,
      startTime,
    });

    setCleanup(cleanup
      .set('startTime', startTime)
      .set('endTime', endTime)
    );
  }

  handleEndChange = (date) => {
    const { cleanup, setCleanup } = this.props;
    this.setState({ endTime: date });
    setCleanup(cleanup.set('endTime', date));
  }

  render() {
    const { endTime, setCleanup, startTime } = this.state;
    const minEndDate = startTime == null ? null : new Date(startTime.getTime() + ONE_HOUR);

    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils }>
        <CardContent>
          It takes place on
          <span style={ styles.pickers }>
            <DatePicker
              autoOk={ true }
              disablePast={ true }
              disabled={ setCleanup == null }
              minDateMessage='Choose a day after today'
              value={ startTime }
              onChange={ this.handleDateChange }
            />
          </span>
          at
          <span style={ styles.pickers }>
            <TimePicker
              autoOk={ true }
              disabled={ setCleanup == null || startTime == null  }
              value={ startTime }
              onChange={ this.handleStartChange }
            />
          </span> and ends at
          <span style={ styles.pickers }>
            <TimePicker
              autoOk={ true }
              disabled={ setCleanup == null || startTime == null  }
              minDate={ minEndDate }
              minDateMessage='End time must be at least an hour after the start time'
              value={ endTime }
              onChange={ this.handleEndChange }
            />
          </span>
        </CardContent>
      </MuiPickersUtilsProvider>
    );
  }
}

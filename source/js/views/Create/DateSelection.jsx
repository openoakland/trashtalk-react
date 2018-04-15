import React, { Component } from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import PropTypes from 'prop-types';

import TimePicker from 'material-ui-pickers/TimePicker';
import DatePicker from 'material-ui-pickers/DatePicker';

import Cleanup from 'models/Cleanup';

const styles = {
  pickers: {
    display: 'inline-block',
    marginLeft: '.5rem',
    marginRight: '.5rem',
    height: '4rem',
  },
};

/**
 * Component for showing/selecting dates for a cleanup
 */
export default class DateSelection extends Component {
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

  state = {
    startTime: null,
    endTime: null,
  }

  handleDateChange = (date) => {
    const { cleanup, setCleanup } = this.props;
    this.setState({ endTime: date, startTime: date });

    setCleanup(cleanup
      .set('startTime', date)
      .set('endTime', date));
  }

  handleStartChange = (date) => {
    const { cleanup, setCleanup } = this.props;
    let { endTime } = this.state;

    if (endTime < date) {
      endTime = date;
    }

    this.setState({
      endTime,
      startTime: date,
    });

    setCleanup(cleanup
      .set('startTime', date)
      .set('endTime', endTime)
    );
  }

  handleEndChange = (date) => {
    const { cleanup, setCleanup } = this.props;
    this.setState({ endTime: date });
    setCleanup(cleanup.set('endTime', date));
  }

  render() {
    const { endTime, startTime } = this.state;
    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils }>
        <div>
          This cleanup will take place on
          <span style={ styles.pickers }>
            <DatePicker
              autoOk={ true }
              disablePast={ true }
              minDateMessage='Choose a day after today'
              value={ startTime }
              onChange={ this.handleDateChange }
            />.
          </span>
          <br />
          It starts at
          <span style={ styles.pickers }>
            <TimePicker
              autoOk={ true }
              disabled={ startTime == null }
              value={ startTime }
              onChange={ this.handleStartChange }
            />
          </span> and ends at
          <span style={ styles.pickers }>
            <TimePicker
              autoOk={ true }
              disabled={ startTime == null }
              minDate={ startTime }
              minDateMessage='End time must be after start time'
              value={ endTime }
              onChange={ this.handleEndChange }
            />
          </span>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

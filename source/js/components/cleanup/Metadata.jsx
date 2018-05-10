import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { CardContent } from 'material-ui/Card';
import DateRepresentation from 'components/cleanup/DateRepresentation';

import Cleanup from 'models/Cleanup';

const styles = theme => ({
  contentRoot: {
    width: '100%',
  },
  descriptionField: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  timeContainer: {
    marginTop: theme.spacing.unit * 5,
  },
  titleField: {
    width: '100%',
  },
  spacer: {
    display: 'inline-block',
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 5,
  },
});

const ONE_HOUR = 3600000;

/**
 * Component for showing/selecting dates for a cleanup
 */
@withStyles(styles)
export default class Metadata extends Component {
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
      .set('end', end)
    );
  }

  handleEndChange = (date) => {
    const { cleanup, setCleanup } = this.props;
    setCleanup(cleanup.set('end', date));
  }

  handleDescriptionChange = event => {
    const { cleanup } = this.props;
    const value = event.currentTarget.value;
    this.props.setCleanup(cleanup.set('description', value));
  }

  handleTitleChange = event => {
    const { cleanup } = this.props;
    const value = event.currentTarget.value;
    this.props.setCleanup(cleanup.set('title', value));
  }

  render() {
    const { classes, cleanup, setCleanup } = this.props;
    if (cleanup == null) {
      return null;
    }

    return (
      <CardContent classes={ { root: classes.contentRoot } }>
        { setCleanup != null ? (
          <FormControl fullWidth>
            <InputLabel>Title</InputLabel>
            <Input
              disabled={ setCleanup == null }
              value={ cleanup.title || '' }
              onChange={ this.handleTitleChange }
            />
          </FormControl>
        ) : (
          <Typography variant='display1' > { cleanup.title } </Typography>
        )
        }
        <div className={ classes.descriptionField } >
          {(setCleanup != null || (cleanup.description !== '' && cleanup.description != null)) && (
            <TextField
              label='Description'
              fullWidth={ true }
              disabled={ setCleanup == null }
              onChange={ this.handleDescriptionChange }
              value={ cleanup.description || '' }
              margin='normal'
              placeholder='Enter any additional details here'
            />
          )}
        </div>
        <div className={ classes.timeContainer }>
          <DateRepresentation
            cleanup={ cleanup }
            setCleanup={ setCleanup }
          />
        </div>
      </CardContent>
    );
  }
}

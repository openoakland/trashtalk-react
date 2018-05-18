import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
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

/**
 * Component for modifying extra Cleanup metadata
 */
@withStyles(styles)
export default class Metadata extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanup: PropTypes.instanceOf(Cleanup),
    setCleanup: PropTypes.func,
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

    if (cleanup == null) { return null; }

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

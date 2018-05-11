import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';

import Icon from 'material-ui/Icon';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing.unit,
    fontSize: 36,
  },
});

/**
 * Template for creating connected components
 */
@withStyles(styles)
export default class ConnectedComponent extends Component {
  static propTypes = {
    classes: PropTypes.object,
    scale: PropTypes.number,
  };

  render() {
    const { classes, scale } = this.props;
    return (
      <div
        className={ classes.root }
        styles={ {
          transform: `scale(${ scale || 1 })`,
        } }
      >
        <Icon className={ classes.icon }> delete </Icon>
        <Typography variant='title'> TrashTalk </Typography>
      </div>
    );
  }
}

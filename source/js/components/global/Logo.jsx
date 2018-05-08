import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

import Icon from 'material-ui/Icon';

const styles = theme => {
  root: {

  }
};

/**
 * Template for creating connected components
 */
@withStyles(styles)
export default class ConnectedComponent extends Component {
  static propTypes = {
  }

  render() {
    const { classes } = this.props;
    return (
      <div><Icon>delete</Icon>TrashTalk</div>
    );
  }
}

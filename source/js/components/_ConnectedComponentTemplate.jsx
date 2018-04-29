import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

const styles = {
};

/**
 * Template for creating connected components
 */
@connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)
@withStyles(styles)
export default class ConnectedComponent extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  render() {
    return (
      <div>Connected Component</div>
    );
  }
}

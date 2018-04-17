import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router-dom';
import { routeCodes } from 'constants/routes';
import PropTypes from 'prop-types';

const styles = {
  Toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

class Menu extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  handleCreateClick = () => {
    this.props.history.push(routeCodes.NEW_CLEANUP);
  }

  render() {
    return (
      <AppBar title='Title' position='static'>
        <Toolbar style={ styles.Toolbar }>
          <Typography variant='title' color='inherit'>
            TrashTalk
          </Typography>
          <Button
            variant='raised'
            color='secondary'
            onClick={ this.handleCreateClick }
          >
            Organize a Cleanup
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(Menu);

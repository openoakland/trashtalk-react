import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router-dom';
import { routeCodes } from 'constants/routes';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  Toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

@withStyles(styles)
class Menu extends Component {
  static propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
  }

  handleCreateClick = () => {
    this.props.history.push(routeCodes.NEW_CLEANUP);
  }

  handleLoginClick = () => {
    this.props.history.push(routeCodes.LOGIN);
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar title='Title' position='static'>
        <Toolbar className={ classes.Toolbar }>
          <Typography variant='title' color='inherit'>
            TrashTalk
          </Typography>
          <div>
            <Button
              className={ classes.button }
              variant='raised'
              color='secondary'
              onClick={ this.handleCreateClick }
            >
              Organize a Cleanup
            </Button>
            <IconButton
              onClick={ this.handleLoginClick }
            >
              <Icon> account_circle </Icon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(Menu);

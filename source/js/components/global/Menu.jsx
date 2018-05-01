import React, { PureComponent } from 'react';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router-dom';
import { routeCodes } from 'constants/routes';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { getUserLocation } from 'actions/app';
import SearchDrawer from './Menu/SearchDrawer';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

/**
 * This is the menu bar at the top of the app window
 */
@connect(
  state => ({
    userLocation: state.app.get('userLocation'),
  }),
  dispatch => bindActionCreators({ getUserLocation }, dispatch)
)
@withStyles(styles)
class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    getUserLocation: PropTypes.func,
    userLocation: PropTypes.object,
  };

  state = { drawerOpen: false };

  handleCreateClick = () => this.props.history.push(routeCodes.NEW_CLEANUP);

  handleLoginClick = () => this.props.history.push(routeCodes.LOGIN);

  handleDrawerToggle = () => {
    this.initUserLocation();
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  initUserLocation = () => {
    const { userLocation } = this.props;
    if (userLocation == null) {
      this.props.getUserLocation();
    }
  }

  render() {
    const { classes } = this.props;
    const { drawerOpen } = this.state;
    return (
      <div>
        <SearchDrawer
          open={ drawerOpen }
          handleToggle={ this.handleDrawerToggle }
        />
        <AppBar title='Title'>
          <Toolbar
            className={ classes.toolbar }
            disableGutters={ true }
            onClick={ this.initUserLocation }
          >
            <Typography
              variant='title'
              color='inherit'
            >
              <IconButton
                className={ classes.button }
                onClick={ this.handleDrawerToggle }
              >
                <Icon>sort</Icon>
              </IconButton>
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
              <IconButton onClick={ this.handleLoginClick }>
                <Icon> account_circle </Icon>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Menu);

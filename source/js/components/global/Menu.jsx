import React, { PureComponent } from 'react';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { routeCodes } from 'constants/routes';

import Avatar from 'material-ui/Avatar';
import Menu, { MenuItem } from 'material-ui/Menu';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { getUserLocation, logout } from 'actions/app';
import SearchDrawer from './Menu/SearchDrawer';
import { setSnackbarProps } from 'actions/app';

const styles = theme => ({
  avatar: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
  },
  button: {
    margin: theme.spacing.unit,
  },
  menuIcon: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing.unit,
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
    anchorEl: null,
    userLocation: state.app.get('userLocation'),
    user: state.app.get('user'),
  }),
  dispatch => bindActionCreators({ getUserLocation, logout, setSnackbarProps }, dispatch)
)
@withStyles(styles)
class MenuComponent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    getUserLocation: PropTypes.func,
    logout: PropTypes.func,
    setSnackbarProps: PropTypes.func,
    userLocation: PropTypes.object,
    user: PropTypes.object,
  };

  state = { drawerOpen: false };

  handleCreateClick = () => this.props.history.push(routeCodes.NEW_CLEANUP);

  handleLoginClick = () => {
    this.props.history.push(routeCodes.LOGIN);
    this.handleMenuClose();
  };

  handleLogoutClick = () => {
    this.props.logout();
    this.handleMenuClose();
    this.props.setSnackbarProps({
      message: 'You have been logged out',
      open: true,
    });
  }

  handleDrawerToggle = () => {
    this.initUserLocation();
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => this.setState({ anchorEl: null })

  initUserLocation = () => {
    const { userLocation } = this.props;
    if (userLocation == null) {
      this.props.getUserLocation();
    }
  }

  render() {
    const { classes, user } = this.props;
    const { anchorEl, drawerOpen } = this.state;
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
              <IconButton
                className={ classes.button }
                onClick={ this.handleMenuClick }
              >
                {user == null ? (
                  <Icon> account_circle </Icon>
                ) : (
                  <Avatar className={ classes.avatar }>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
              <Menu
                anchorEl={ anchorEl }
                open={ Boolean(anchorEl) }
                onClose={ this.handleMenuClose }
              >
                <MenuItem onClick={this.handleLoginClick}>
                  <Icon className={classes.menuIcon}>account_box</Icon> Login
                </MenuItem>
                { user && (
                  <MenuItem onClick={this.handleLogoutClick}>
                    <Icon className={classes.menuIcon}>exit_to_app</Icon> Logout
                  </MenuItem>
                )}
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(MenuComponent);

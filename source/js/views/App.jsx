import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { CLEANUP_ROOT, routeCodes } from 'constants/routes';
import { GRAYS_GREENS as THEME } from 'config/themes';

import Menu from 'components/global/Menu';
import Notifications from 'components/global/Notifications';
import Create from 'views/Create';
import CleanupView from 'views/CleanupView';
import Login from 'views/Login';
import NotFound from 'views/NotFound';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Register from 'views/Register';
import GlobalSnackbar from 'components/global/GlobalSnackbar';

import { createMuiTheme } from 'material-ui/styles';
import MapBackground from '../components/global/MapBackground';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={ createMuiTheme(THEME) } >
        <MapBackground />
        <div style={ { zIndex: 1 } }> <Menu /> </div>
        <div style={ { zIndex: 2 } }>
          <Switch>
            <Route exact path={ routeCodes.LOGIN } component={ Login } />
            <Route exact path={ routeCodes.NEW_CLEANUP } component={ Create } />
            <Route exact path={ routeCodes.REGISTER } component={ Register } />
            <Route path={ `${ CLEANUP_ROOT }:cleanupId` } component={ CleanupView } />
            <Route path={ routeCodes.HOME } />
            <Route path='*' component={ NotFound } />
          </Switch>
        </div>
        <div style={ { zIndex: 3 } }> <Notifications /> </div>
        <div style={ { zIndex: 4 } }> <GlobalSnackbar /> </div>
      </MuiThemeProvider>
    );
  }
}

export default hot(module)(App);

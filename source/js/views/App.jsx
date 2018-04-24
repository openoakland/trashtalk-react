import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { CLEANUP_ROOT, routeCodes } from 'constants/routes';
import themes from 'config/themes';

import Menu from 'components/global/Menu';
import Create from 'views/Create';
import CleanupView from 'views/CleanupView';
import Login from 'views/Login';
import NotFound from 'views/NotFound';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Register from 'views/Register';

import { createMuiTheme } from 'material-ui/styles';
import MapBackground from '../components/global/MapBackground';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={ createMuiTheme(themes.greens2) } >
        <MapBackground />
        <div style={ { zIndex: -1 } }> <Menu /> </div>
        <div style={ { zIndex: 1 } }>
          <Switch>
            <Route exact path={ routeCodes.LOGIN } component={ Login } />
            <Route exact path={ routeCodes.NEW_CLEANUP } component={ Create } />
            <Route exact path={ routeCodes.REGISTER } component={ Register } />
            <Route path={ `${ CLEANUP_ROOT }:cleanupId` } component={ CleanupView } />
            <Route path={ routeCodes.HOME } />
            <Route path='*' component={ NotFound } />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default hot(module)(App);

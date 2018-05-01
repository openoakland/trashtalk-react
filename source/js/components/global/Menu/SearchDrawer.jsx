import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CLEANUP_ROOT } from 'constants/routes';
import { Map } from 'immutable';
import geolib from 'geolib';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { ListItemText } from 'material-ui/List';
import { MenuItem, MenuList } from 'material-ui/Menu';
import { Button } from 'material-ui';
import Icon from 'material-ui/Icon';
import Select from 'material-ui/Select';

import Location from 'models/Location';

const styles = theme => ({
  closeButton: {
    marginBottom: theme.spacing.unit,
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing.unit * 2,
    outlineColor: 'white',
  },
  drawerPaper: {},
  listItemHeaderText: {
    fontSize: '2rem',
  },
  listItemText: {
    maxWidth: '100%',
  },
  locationAvatar: {
    borderRadius: 0,
    width: 60,
    height: 60,
  },
  menuItem: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: (ITEM_HEIGHT * 4.5) + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/**
 * Template for creating connected components
 */
@connect(
  state => ({
    cleanups: state.cleanups.get('cleanups'),
    userLocation: state.app.get('userLocation'),
  }),
  dispatch => bindActionCreators({}, dispatch)
)
@withStyles(styles)
class SearchDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object,
    cleanups: PropTypes.object,
    handleToggle: PropTypes.func,
    history: PropTypes.object,
    open: PropTypes.bool,
    userLocation: PropTypes.instanceOf(Location),
  };

  static defaultProps = {};

  state = {
    sortType: 'sortByNextUp',
  };

  sortByNextUp = (cleanupA, cleanupB) => cleanupA.start - cleanupB.start;

  sortByDistanceFromUser = (cleanupA, cleanupB) => {
    const { latitude, longitude } = this.props.userLocation;
    return (
      geolib.getDistance(
        { latitude, longitude },
        { latitude: cleanupA.location.latitude, longitude: cleanupB.location.longitude }
      ) -
      geolib.getDistance(
        { latitude, longitude },
        { latitude: cleanupB.location.latitude, longitude: cleanupB.location.longitude }
      )
    );
  };

  handleCleanupClick = event => {
    const { history } = this.props;
    const cleanupId = event.currentTarget.dataset.cleanupId;
    history.push(`${ CLEANUP_ROOT }${ cleanupId }`);
  };

  handleSortingChange = (event) => this.setState({ sortType: event.target.value })

  render() {
    const {
      classes, cleanups, handleToggle, open, userLocation,
    } = this.props;

    const { sortType } = this.state;

    let sortingFunctions = Map({
      sortByNextUp: {
        function: this.sortByNextUp,
        label: 'Next Cleanup Date',
      },
    });

    // If we know the user's location, allow sorting by distance from user
    if (userLocation != null) {
      sortingFunctions = sortingFunctions.set('sortByDistanceFromUser', {
        function: this.sortByDistanceFromUser,
        label: 'Distance From Your Location',
      });
    }

    return (
      <Drawer
        anchor='left'
        classes={ { paper: classes.drawerPaper } }
        open={ open }
        onClose={ handleToggle }
      >
        <MenuList>
          <div className={ classes.listHeader }>
            <FormControl className={ classes.formControl } disabled={ sortingFunctions.size === 1 }>
              <InputLabel htmlFor='sorting-type'>Sorted By</InputLabel>
              <Select
                value={ sortType }
                onChange={ this.handleSortingChange }
                input={ <Input id='sorting-type' /> }
                MenuProps={ MenuProps }
              >
                {sortingFunctions.keySeq().map(key => (
                  <MenuItem
                    key={ key }
                    value={ key }
                  >
                    {sortingFunctions.get(key).label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              color='primary'
              mini
              variant='fab'
              onClick={ handleToggle }
              className={ classes.closeButton }
            >
              <Icon>close</Icon>
            </Button>
          </div>
          {cleanups
            .toList()
            .sort(sortingFunctions.get(sortType).function)
            .map(cleanup => (
              <div key={ cleanup.id }>
                <Divider />
                <MenuItem
                  data-cleanup-id={ cleanup.id }
                  onClick={ this.handleCleanupClick }
                  className={ classes.menuItem }
                >
                  {cleanup.location.image ? (
                    <Avatar
                      src={ cleanup.location.image }
                      className={ classNames(classes.avatar, classes.locationAvatar) }
                    />
                  ) : (
                    <Icon style={ { color: '#eb4335' } }>place</Icon>
                  )}
                  <ListItemText
                    primary={ cleanup.title }
                    secondary={ cleanup.start.toLocaleString() }
                    classes={ {
                      root: classes.listItemText,
                    } }
                  />
                </MenuItem>
              </div>
            ))
          }
        </MenuList>
      </Drawer>
    );
  }
}

export default withRouter(SearchDrawer);

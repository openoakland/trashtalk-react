import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Map } from 'immutable';

import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';

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

const DEFAULT_SORTING = 'sortByDistance';
const DEFAULT_FILTERING = 'allCleanup';

/**
 * Template for creating connected components
 */
@connect(
  state => ({
    cleanups: state.cleanups.get('cleanups'),
    userLocation: state.app.get('userLocation'),
    user: state.app.get('user'),
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
    user: PropTypes.object,
  };

  static defaultProps = {};

  state = {
    sortType: DEFAULT_SORTING,
    filterType: DEFAULT_FILTERING,
  };

  getFilteringOptions = () => {
    let filteringOptions = Map({
      [DEFAULT_FILTERING]: {
        function: () => true,
        label: 'All Cleanups',
      },
    });

    // If user is known, allow filtering by the user's cleanups
    const { user } = this.props;
    if (user != null) {
      filteringOptions = filteringOptions.merge(Map({
        'filterByHosting': {
          label: "Cleanups I'm Hosting",
          function: cleanup => cleanup.hasHost(user),
        },
        'filterByParticipation': {
          label: "Cleanups I'm Participating In",
          function: cleanup => cleanup.hasParticipant(user),
        },
      }));
    }

    return filteringOptions;
  }

  getSortingOptions = () => {
    let sortingOptions = Map({
      [DEFAULT_SORTING]: {
        label: 'Next Cleanup Date',
        function: (a, b) => a.start - b.start,
      },
    });

    // If the user's location is known, allow sorting by distance from user
    const { userLocation } = this.props;
    if (userLocation != null) {
      sortingOptions = sortingOptions.merge(Map({
        'sortByDistanceFromUser':
          {
            label: 'Distance',
            function: (a, b) => a.location.getDistanceFrom(userLocation) - b.location.getDistanceFrom(userLocation),
          },
      }));
    }

    return sortingOptions;
  }

  handleCleanupClick = event => {
    const { cleanups, history } = this.props;
    const cleanupId = Number(event.currentTarget.dataset.cleanupId);
    const cleanup = cleanups.get(cleanupId);
    history.push(cleanup.getCleanupPath());
  };

  handleFilteringChange = event => this.setState({ filterType: event.target.value });
  handleSortingChange = event => this.setState({ sortType: event.target.value });

  render() {
    const {
      classes, cleanups, handleToggle, open, userLocation,
    } = this.props;
    const { filterType, sortType } = this.state;
    const sortingOptions = this.getSortingOptions();
    const filteringOptions = this.getFilteringOptions();

    return (
      <Drawer
        anchor='left'
        open={ open }
        onClose={ handleToggle }
      >
        <MenuList>
          <div className={ classes.listHeader }>
            <FormControl disabled={ filteringOptions.size === 1 } >
              <InputLabel htmlFor='filter-type'> Showing </InputLabel>
              <Select
                value={ filterType }
                onChange={ this.handleFilteringChange }
                input={ <Input id='filter-type' /> }
                MenuProps={ MenuProps }
              >
                {filteringOptions.keySeq().map(key => (
                  <MenuItem
                    key={ key }
                    value={ key }
                  >
                    {filteringOptions.get(key).label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl disabled={ sortingOptions.size === 1 } >
              <InputLabel htmlFor='sorting-type'> Sorted By </InputLabel>
              <Select
                value={ sortType }
                onChange={ this.handleSortingChange }
                input={ <Input id='sorting-type' /> }
                MenuProps={ MenuProps }
              >
                {sortingOptions.keySeq().map(key => (
                  <MenuItem
                    key={ key }
                    value={ key }
                  >
                    {sortingOptions.get(key).label}
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
            .filter(filteringOptions.get(filterType).function)
            .toList()
            .sort(sortingOptions.get(sortType).function)
            .map(cleanup => {
              let secondary = `${ cleanup.start.toLocaleString() }`;

              if (userLocation != null) {
                const distance = cleanup.location.getDistanceFrom(userLocation, { unit: 'mile' });
                secondary +=
                  distance > 0
                    ? `, about ${ distance } mile${ distance === 1 ? '' : 's' } away`
                    : ', less than a mile away';
              }

              return (
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
                      secondary={ secondary }
                      classes={ {
                        root: classes.listItemText,
                      } }
                    />
                  </MenuItem>
                </div>
              );
            })}
        </MenuList>
      </Drawer>
    );
  }
}

export default withRouter(SearchDrawer);

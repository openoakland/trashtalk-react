import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CLEANUP_ROOT } from 'constants/routes';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import { ListItemText } from 'material-ui/List';
import { MenuItem, MenuList } from 'material-ui/Menu';
import { Button } from 'material-ui';

const styles = theme => ({
  closeButton: {
    marginBottom: theme.spacing.unit,
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing.unit * 2,
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

/**
 * Template for creating connected components
 */
@connect(
  state => ({
    cleanups: state.cleanups.get('cleanups'),
  }),
  dispatch => bindActionCreators({}, dispatch)
)
@withStyles(styles)
class SearchDrawer extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    cleanups: PropTypes.object,
    handleToggle: PropTypes.func,
    history: PropTypes.object,
    open: PropTypes.bool,
  };

  static defaultProps = {};

  handleCleanupClick = event => {
    const { history } = this.props;
    const cleanupId = event.currentTarget.dataset.cleanupId;
    history.push(`${ CLEANUP_ROOT }${ cleanupId }`);
  };

  render() {
    const {
      classes, cleanups, handleToggle, open,
    } = this.props;
    return (
      <Drawer
        anchor='left'
        classes={ { paper: classes.drawerPaper } }
        open={ open }
        onClose={ handleToggle }
      >
        <MenuList>
          <div className={ classes.listHeader }>
            <Typography
              variant='title'
              gutterBottom
            >
              Upcoming Cleanups
            </Typography>
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
            .sort((cleanupA, cleanupB) => cleanupA.start - cleanupB.start)
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
            ))}
        </MenuList>
      </Drawer>
    );
  }
}

export default withRouter(SearchDrawer);

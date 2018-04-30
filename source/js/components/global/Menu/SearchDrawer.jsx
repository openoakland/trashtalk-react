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
import { ListItemText } from 'material-ui/List';
import { MenuItem, MenuList } from 'material-ui/Menu';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  drawerPaper: {
    minWidth: '320px',
  },
  locationAvatar: {
    borderRadius: 0,
    margin: 10,
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
    open: PropTypes.boolean,
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
          {cleanups
            .toList()
            .sort((cleanupA, cleanupB) => {
              return cleanupA.title > cleanupB.title ? 1 : -1;
            })
            .map(cleanup => (
              <div>
                <MenuItem
                  key={ cleanup.id }
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
                    <Icon style={{color: '#eb4335'}}>
                      place
                    </Icon>
                  )}
                  <ListItemText
                    primary={ cleanup.title }
                    secondary={ cleanup.start.toLocaleString() }
                  />
                </MenuItem>
                <Divider />
              </div>
            ))}
        </MenuList>
      </Drawer>
    );
  }
}

export default withRouter(SearchDrawer);

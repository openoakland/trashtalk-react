import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { WELCOME } from 'constants/notices';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';

import Notice from 'models/Notice';

const styles = theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  avatar: {
    backgroundColor: 'red',
  },
  dialog: {
    width: '100%',
    maxWidth: '960px',
  },
  card: {
    maxWidth: 960,
    height: '100%',
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: '2rem',
  },
});

/**
 * This component is used to display notifications the first time a user gets
 * to the site in a session.
 *
 */
const WELCOME_VIEWED_KEY = 'WELCOME_VIEWED_KEY';
const initialNotice = sessionStorage.getItem(WELCOME_VIEWED_KEY) ? null : WELCOME;

@withStyles(styles)
export default class CleanupView extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    notice: PropTypes.instanceOf(Notice),
  }

  static defaultProps = {
    notice: initialNotice,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: sessionStorage.getItem(WELCOME_VIEWED_KEY) == null,
    };
  }

  handleButtonClick = () => {
    this.setState({
      open: false,
    });
    sessionStorage.setItem(WELCOME_VIEWED_KEY, true);
  }

  render() {
    const { open } = this.state;
    const { classes, notice } = this.props;

    return notice == null ? null : (
      <Dialog
        classes={ {
          paper: classes.dialog,
        } }
        open={ open }
        aria-labelledby='responsive-dialog-title'
      >
        <Card raised={true} className={ classes.card }>
          <CardHeader
            classes={ {
              title: classes.title,
            } }
            avatar={
              <Avatar
                aria-label='Recipe'
                src='/assets/img/trashSplash.jpg'
                className={ classes.bigAvatar }
              />
            }
            title={ notice.title }
          />
          <CardContent>
            <Typography component='p'>
              {notice.description}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Button
              size='large'
              color='primary'
              onClick={ this.handleButtonClick }
              variant='raised'
            >
              Close
            </Button>
          </CardActions>
        </Card>
      </Dialog>
    );
  }
}

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import List, { ListItem } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';

import Icon from 'material-ui/Icon';

import { getTools, getToolCategories } from 'actions/tools';

const styles = theme => ({
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  button: {
    margin: theme.spacing.unit,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit,
  },
  icon: {
    marginLeft: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  list: {
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '50px',
  },
});

/**
 * Component for displaying/selecting tools required for a cleanup
 */
@connect(
  state => ({
    cleanups: state.cleanups.get('cleanups'),
    mapCenter: state.app.get('mapCenter'),
    tools: state.tools.get('tools'),
    toolCategories: state.tools.get('toolCategories'),
    categoryToToolMap: state.tools.get('categoryToToolMap'),
  }),
  dispatch => bindActionCreators(
    { getTools, getToolCategories },
    dispatch
  )
)
class ToolsRepresentation extends Component {
  static propTypes = {
    categoryToToolMap: PropTypes.object,
    classes: PropTypes.object,
    getTools: PropTypes.func,
    getToolCategories: PropTypes.func,
    setToolSelection: PropTypes.func,
    tools: PropTypes.object,
    toolCategories: PropTypes.object,
    toolSelections: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.props.getTools();
    this.props.getToolCategories();
  }

  getToolDetails = toolId => {
    const { classes, tools, toolSelections } = this.props;
    const currentTool = tools[toolId];
    const quantity = toolSelections.get(toolId, 0);

    return {
      quantity,
      name: currentTool.name,
      listItem: (
        <ListItem key={ toolId }>
          <div style={ { display: 'flex', alignItems: 'center', width: '100%' } }>
            <Avatar
              alt={ currentTool.name }
              src={
                // TODO: Dynamically get root from API
                `http://localhost:8000/assets/${currentTool.image_static_location}`
              }
              className={ classNames(classes.avatar, classes.bigAvatar) }
            />
            <div style={ { margin: '0 1rem', flexGrow: 1 } }>
              <Typography className={ classes.heading }>
                {currentTool.name}
              </Typography>
              <Typography className={ classes.secondaryHeading }>
                {currentTool.description}
              </Typography>
            </div>
            <div style={ {
              width: '178px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              } }
            >
              <Button
                aria-label='Add'
                className={ classes.button }
                color='primary'
                data-tool-id={ toolId }
                data-quantity={ quantity }
                onClick={ this.handleIncrement }
                mini
                variant='fab'
              >
                <Icon>add</Icon>
              </Button>
              <Button
                aria-label='Remove'
                className={ classes.button }
                color='secondary'
                data-quantity={ quantity }
                data-tool-id={ toolId }
                disabled={ quantity === 0 }
                mini
                onClick={ this.handleDecrement }
                variant='fab'
              >
                <Icon>remove</Icon>
              </Button>
              <TextField
                disabled={ true }
                label='Quantity'
                value={ quantity }
                type='number'
                className={ classes.textField }
                margin='dense'
              />
            </div>
          </div>
        </ListItem>
      ),
    };
  }

  handleDecrement = event => {
    const { setToolSelection } = this.props;
    const { toolId, quantity } = event.currentTarget.dataset;
    setToolSelection(Number(toolId), Number(quantity) - 1);
  }

  handleIncrement = event => {
    const { setToolSelection } = this.props;
    const { toolId, quantity } = event.currentTarget.dataset;
    setToolSelection(Number(toolId), Number(quantity) + 1);
  }

  renderToolCategory = categoryId => {
    const { classes, categoryToToolMap, toolCategories } = this.props;
    const currentCategory = toolCategories[categoryId] || {};
    const categoryTools = categoryToToolMap[categoryId];
    const toolSummaries = [];
    const toolListItems = [];

    categoryTools.forEach(toolId => {
      const { listItem, name, quantity } = this.getToolDetails(toolId);
      if (quantity > 0) {
        toolSummaries.push(`${ name } (${ quantity })`);
      }
      toolListItems.push(listItem);
    });

    return (
      <ExpansionPanel key={ categoryId }>
        <ExpansionPanelSummary
          expandIcon={ <Icon>arrow_drop_down</Icon> }
        >
          <Typography className={ classes.heading }>
            { currentCategory.name}
          </Typography>
          <Typography className={ classes.secondaryHeading }>
            { toolSummaries.join(', ') }
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className={ classes.list }>
            { toolListItems.map(listItem => listItem) }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  render() {
    const { categoryToToolMap } = this.props;

    return (
      <div>
        {Object.keys(categoryToToolMap).map(categoryId =>
           this.renderToolCategory(categoryId)
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ToolsRepresentation);

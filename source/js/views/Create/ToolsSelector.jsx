import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Divider from 'material-ui/Divider';
import { List, Set } from 'immutable';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import Icon from 'material-ui/Icon';


import { getTools, getToolCategories } from 'actions/tools';
import ToolSelection from 'models/ToolSelection';

const styles = theme => ({
  avatar: {
    margin: 10,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '50px',
  },
  icon: {
    marginLeft: theme.spacing.unit * 2,
  },
});

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
class ToolsSelector extends Component {
  static propTypes = {
    categoryToToolMap: PropTypes.object,
    classes: PropTypes.object,
    cleanup: PropTypes.object,
    getTools: PropTypes.func,
    getToolCategories: PropTypes.func,
    setCleanup: PropTypes.func,
    tools: PropTypes.object,
    toolCategories: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.props.getTools();
    this.props.getToolCategories();
    this.state = {
      selectedCategoryId: null,
      selectedToolId: null,
      specifiedQuantity: 1,
      toolSelections: List(),
      selectedToolIds: Set(),
    };
  }

  handleAddClick = () => {
    const { selectedCategoryId, selectedToolIds, selectedToolId, specifiedQuantity, toolSelections } = this.state;
    this.setState({
      selectedCategoryId: null,
      selectedToolId: null,
      specifiedQuantity: 1,
      selectedToolIds: selectedToolIds.add(selectedToolId),
      toolSelections: toolSelections.push(new ToolSelection({
        categoryId: selectedCategoryId,
        toolId: selectedToolId,
        quantity: specifiedQuantity,
      })),
    });
  }

  handleCategoryChange = (event) => {
    const categoryId = Number(event.target.value);
    this.setState({
      selectedCategoryId: categoryId,
      selectedToolId: null
    });
  }

  handleDelete = (toolId) => {
    const { selectedToolIds, toolSelections } = this.state;
    const toolIndex = toolSelections.findIndex(
      toolSelection => toolSelection.toolId === toolId
    );

    this.setState({
      selectedToolIds: selectedToolIds.remove(toolId),
      toolSelections: toolSelections.delete(toolIndex),
    });
  }

  handleToolChange = (event) => {
    const toolId = event.target.value;
    this.setState({ selectedToolId: toolId });
  }

  handleQuantityChange = (event) => {
    const quantity = Number(event.target.value);

    if (quantity >= 1) {
      this.setState({ specifiedQuantity: quantity });
    }
  }

  renderSelections = () => {
    const { toolSelections } = this.state;
    const { classes, tools } = this.props;

    return toolSelections.map(toolSelection => {
      const { toolId, quantity } = toolSelection;
      const tool = tools[toolId];
      return (
        <Chip
          key={ toolId }
          avatar={
            tool == null ? null :
            <Avatar
              alt={ tool.name }
              src={
                `http://localhost:8000/assets/${tool.image_static_location}` // TODO: Dynamically get root from API
              }
            />
          }
          label={ `${ tool.name } (Quantity: ${ quantity })` }
          data-tool-id={ toolId }
          onDelete={ () => this.handleDelete(toolId) }
          className={ classes.chip }
        />
      );
    });
  }

  renderToolSelector = (toolSelection, index) => {
    const { categoryToToolMap, classes, tools, toolCategories } = this.props;
    const { selectedCategoryId, selectedToolIds, selectedToolId, specifiedQuantity } = this.state;
    return (
      <div>
        <FormControl
          className={ classes.formControl }
          key={ index }
        >
          <InputLabel htmlFor='tool-category'>
            Tool Category
          </InputLabel>
          <Select
            value={ selectedCategoryId || ''}
            onChange={ this.handleCategoryChange }
            inputProps={ {
              name: index,
              id: 'tool-category',
            } }
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {
              Object.keys(toolCategories).map((id) => (
                <MenuItem
                  key={ id }
                  value={ Number(id) }
                >
                  <em>{(toolCategories[id] || {}).name}</em>
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl className={ classes.formControl }>
          <InputLabel htmlFor='tool'>Tool</InputLabel>
          <Select
            disabled={ selectedCategoryId == null }
            value={ selectedToolId || ''}
            onChange={ this.handleToolChange }
            inputProps={{
              name: index,
              id: 'tool',
            }}
          >
            {
              (categoryToToolMap[selectedCategoryId] || []).map( toolId => {
                const tool = tools[toolId];
                return tool == null ? null : (
                  <MenuItem
                    key={toolId}
                    disabled={selectedToolIds.has(toolId)}
                    value={toolId}
                  >
                    <em>
                      {tool.name}{selectedToolIds.has(toolId) ? ' (Already added)' : ''}
                    </em>
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label='Quantity'
            disabled={ selectedToolId == null }
            value={ specifiedQuantity }
            onChange={ this.handleQuantityChange }
            type='number'
            className={ classes.textField }
            InputLabelProps={ { shrink: true } }
            margin='normal'
          />
        </FormControl>
        { selectedToolId != null && (
          <div>
            <Typography variant='caption' gutterBottom>
              {
                tools[selectedToolId].description
              }
            </Typography>
          </div>
        )}
        <Button
          className={classes.button}
          disabled={ selectedToolId == null }
          color='primary'
          onClick={this.handleAddClick}
          variant='raised'
        >
          Add tools
          <Icon className={ classes.icon }>add_circle</Icon>
        </Button>
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.renderToolSelector() }
        { this.renderSelections() }
        <Divider style={{marginTop: '2rem'}} />
      </div>
    );
  }
}

export default withStyles(styles)(ToolsSelector);

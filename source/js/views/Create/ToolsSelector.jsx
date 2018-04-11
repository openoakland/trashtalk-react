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
import Add from '@material-ui/icons/Add';
import Divider from 'material-ui/Divider';
import { List } from 'immutable';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';

import { getTools, getToolCategories } from 'actions/tools';
import ToolSelection from 'models/ToolSelection';

const styles = theme => ({
  avatar: {
    margin: 10,
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
  iconSmall: {
    fontSize: 20,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '50px',
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
      age: 'foo',
      toolSelections: List([
        new ToolSelection({ quantity: 1 })
      ])
    };
  }

  handleAddClick = () => {
    const { toolSelections } = this.state;
    this.setState({
      toolSelections: toolSelections.push(new ToolSelection()),
    });
  }

  handleCategoryChange = (event, child) => {
    const { toolSelections } = this.state;
    const categoryId = Number(event.target.value);
    const index = Number(event.target.name);
    const currentToolSelection = toolSelections.get(index);
    this.setState({
      toolSelections: toolSelections.set(
        index,
        currentToolSelection
          .set('categoryId', categoryId)
          .set('toolId', '')
      ),
    });
  }

  handleToolChange = (event, child) => {
    const { toolSelections } = this.state;
    const toolId = event.target.value;
    const index = Number(event.target.name);
    const currentToolSelection = toolSelections.get(index);
    this.setState({
      toolSelections: toolSelections.set(
        index,
        currentToolSelection.set(
          'toolId',
          toolId === '' ? '' : Number(toolId)
        )
      ),
    });
  }

  handleQuantityChange = (event) => {
    const { toolSelections } = this.state;
    const quantity = Number(event.target.value);
    const index = Number(event.target.name);
    const currentToolSelection = toolSelections.get(index);

    if (quantity < 1) {
      this.setState({ toolSelections: toolSelections.remove(index) });
    } else {
      this.setState({
        toolSelections: toolSelections.set(index,
          currentToolSelection.set('quantity', quantity)
        ),
      });
    }
  }

  renderToolSelection = (toolSelection, index) => {
    const { categoryToToolMap, classes, tools, toolCategories } = this.props;
    const { toolSelections } = this.state;
    const currentToolSelection = toolSelections.get(index);
    return (
      <div>
        <FormControl
          className={ classes.formControl }
          key={ index }
        >
          <InputLabel htmlFor="tool-category">
            Tool Category
          </InputLabel>
          <Select
            value={ toolSelection.categoryId }
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
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="tool">Tool</InputLabel>
          <Select
            disabled={ !currentToolSelection.categoryIsSet() }
            value={currentToolSelection.toolId}
            onChange={this.handleToolChange}
            inputProps={{
              name: index,
              id: 'tool',
            }}
          >
            {
              (categoryToToolMap[currentToolSelection.categoryId] || []).map( toolId => {
                const tool = tools[toolId];
                return tool == null ? null : (
                  <MenuItem value={ toolId }>
                    <em>{ tool.name }</em>
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            label='Quantity'
            disabled={ !currentToolSelection.toolIsSet() }
            value={ currentToolSelection.quantity }
            onChange={ this.handleQuantityChange }
            type='number'
            className={ classes.textField }
            InputLabelProps={ { shrink: true } }
            margin='normal'
          />
        </FormControl>
        { currentToolSelection.toolId !== '' && (
          <div>
            <Typography variant="caption" gutterBottom>
              {
                tools[currentToolSelection.toolId].description
              }
            </Typography>
            <Avatar
              alt='Tool image'
              src={
                `http://localhost:8000/assets/${tools[currentToolSelection.toolId].image_static_location}`
              }
            />
          </div>
        )}
        <Divider style={{marginTop: '2rem'}} />
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { toolSelections } = this.state;
    return (
      <div>
        {toolSelections.map(
          (toolSelection, index) =>
          this.renderToolSelection(toolSelection, index)
        )}
        <Button
          className={classes.button}
          color='primary'
          onClick={this.handleAddClick}
          variant='raised'
        >
          Add tool selection
          <Add className={ classes.rightIcon } />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(ToolsSelector);

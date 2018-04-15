import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { Map } from 'immutable';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import DateRepresentation from 'components/cleanup/DateRepresentation';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import { routeCodes } from '../constants/routes';


import Cleanup from '../models/Cleanup';

const styles = {
  stepStyle: {
    width: '100vw',
    maxWidth: '100%',
  },
};

const LOCATION_SELECTION = 0;
const DATE_SELECTION = 1;
const TOOL_SELECTION = 2;
const SUMMARY = 3;

/**
 * This class encompasses all the view logic required to create a new Cleanup
 */
@connect(
  () => ({}),
  dispatch => bindActionCreators({}, dispatch)
)
class Create extends React.Component {
  static propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      cleanup: new Cleanup(),
      toolSelections: Map(),
      open: true,
    };
  }

  setCleanup = cleanup => this.setState({ cleanup })

  setToolSelection = (toolId, quantity) => {
    let toolSelections = this.state.toolSelections;
    if (quantity === 0) {
      // delete toolSelections[toolId];
      toolSelections = toolSelections.delete(toolId);
    } else {
      // toolSelections[toolId] = quantity;
      toolSelections = toolSelections.set(toolId, quantity);
    }

    this.setState({ toolSelections });
  }

  handleClose = () => {
    // The fadeout transition takes a little while, so pause temporarily to
    // allow animation to finish before actual browser history push
    this.setState(
      { open: false },
      () => setTimeout(() => this.props.history.push(routeCodes.HOME), 225)
    );
  };

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  steps = ['Location', 'Date and Time', 'Tools', 'Summary']

  renderContentText = () => {
    const { activeStep } = this.state;
    const stepMapping = {
      [LOCATION_SELECTION]: 'Where is this cleanup located?',
      [DATE_SELECTION]: 'When does it start and end?',
      [TOOL_SELECTION]: 'What tools are required?',
      [SUMMARY]: 'Summary',
    };

    return (
      <DialogContentText>
        { stepMapping[activeStep] }
      </DialogContentText>
    );
  }

  renderNextButton = () => {
    const { activeStep, cleanup } = this.state;

    const stepMapping = {
      [LOCATION_SELECTION]: {
        disabled: cleanup.location == null,
      },
      [DATE_SELECTION]: {
        disabled: !cleanup.timesAreValid(),
      },
      [TOOL_SELECTION]: {},
      [SUMMARY]: {},
    };

    return (
      <Button
        disabled={ stepMapping[activeStep].disabled }
        color='secondary'
        onClick={ this.handleNext }
        variant='raised'
      >
        {activeStep === this.steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    );
  }

  renderStep = () => {
    const { activeStep, cleanup, toolSelections } = this.state;

    const stepMapping = {
      [LOCATION_SELECTION]: (
        <LocationRepresentation cleanup={ cleanup } setCleanup={ this.setCleanup } />
      ),
      [DATE_SELECTION]: (
        <DateRepresentation cleanup={ cleanup } setCleanup={ this.setCleanup } />
      ),
      [TOOL_SELECTION]: (
        <ToolsRepresentation setToolSelection={ this.setToolSelection } toolSelections={ toolSelections } />
      ),
      [SUMMARY]: 'Step 4: Summary',
    };

    return stepMapping[activeStep];
  }

  render() {
    const { fullScreen } = this.props;
    const { activeStep } = this.state;

    return (
      <Dialog
        fullScreen={ fullScreen }
        open={ this.state.open }
        onClose={ this.handleClose }
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle>Organize a New Cleanup</DialogTitle>
        <DialogContent>
          {this.renderContentText()}
          <Stepper
            activeStep={ activeStep }
            alternativeLabel
          >
            {this.steps.map(label => {
              return (
                <Step key={ label }>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {this.state.activeStep === this.steps.length ? (
            <div>
              <Typography >
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={ this.handleReset }>Reset</Button>
            </div>
          ) : (
            <div style={ styles.stepStyle } >
              {this.renderStep()}
              <DialogActions>
                <Button
                  disabled={ activeStep === 0 }
                  onClick={ this.handleBack }
                >
                  Back
                </Button>
                {this.renderNextButton()}
              </DialogActions>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.handleClose } color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(withMobileDialog()(Create));

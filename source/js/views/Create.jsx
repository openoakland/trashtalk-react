import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import { routeCodes } from 'constants/routes';
import { Map } from 'immutable';

import { withMobileDialog } from 'material-ui/Dialog';
import DialogContainer from 'components/global/DialogContainer';
import DateRepresentation from 'components/cleanup/DateRepresentation';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import CleanupSummary, { LOCATION_SELECTION, DATE_SELECTION, TOOL_SELECTION } from 'components/cleanup/CleanupSummary';
import Cleanup from 'models/Cleanup';
import Location from 'models/Location';
import Divider from 'material-ui/Divider';

const styles = {
  stepStyle: {
    width: '100vw',
    maxWidth: '100%',
  },
};

export const SUMMARY = 3;

/**
 * This class encompasses all the view logic required to create a new Cleanup
 */
@connect(
  (state) => ({
    backgroundMapLocation: state.app.get('backgroundMapLocation'),
  }),
  dispatch => bindActionCreators({}, dispatch)
)
class Create extends React.Component {
  static propTypes = {
    backgroundMapLocation: PropTypes.instanceOf(Location),
    history: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      cleanup: new Cleanup({ location: props.backgroundMapLocation || new Location() }),
      reasonToLock: 'You have not finished creating this cleanup',
      toolSelections: Map(),
    };
  }

  getNextButton = () => {
    const { activeStep, cleanup } = this.state;

    const stepMapping = {
      [LOCATION_SELECTION]: {
        disabled: cleanup.location.query == null,
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

  handleNext = () => {
    const { activeStep } = this.state;

    if (activeStep === 3) {
      // If we're done, create new cleanup, add tools, redirect back home
      this.props.history.replace(routeCodes.HOME);
    } else {
      this.setState({ activeStep: activeStep + 1 });
    }
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({ activeStep: activeStep - 1 });
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

    return stepMapping[activeStep];
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
      [SUMMARY]: (
        <CleanupSummary
          cleanup={ cleanup }
          setCleanup={ this.setCleanup }
          toolSelections={ toolSelections }
        />
      ),

    };

    return stepMapping[activeStep];
  }

  render() {
    const { activeStep, reasonToLock } = this.state;
    const actions = [
      <Button
        disabled={ activeStep === 0 }
        onClick={ this.handleBack }
      >
        Back
      </Button>,
      this.getNextButton(),
    ];

    return (
      <DialogContainer
        actions={ actions }
        reasonToLock={ reasonToLock }
        title='Organize a New Cleanup'
        subtitle={ this.renderContentText() }
      >
        <Stepper
          activeStep={ activeStep }
          alternativeLabel
        >
          {this.steps.map(label => (
            <Step key={ label }>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Divider />
        <br />
        <div style={ styles.stepStyle } >
          {this.renderStep()}
        </div>
      </DialogContainer>
    );
  }
}

export default withRouter(withMobileDialog()(Create));

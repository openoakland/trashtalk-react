import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import { withMobileDialog } from 'material-ui/Dialog';
import DialogContainer from 'components/global/DialogContainer';
import DateRepresentation from 'components/cleanup/DateRepresentation';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import CleanupSummary from 'components/cleanup/CleanupSummary';
import Cleanup from 'models/Cleanup';
import Location from 'models/Location';
import Divider from 'material-ui/Divider';
import { screens } from 'constants/cleanup';

import { postCleanup } from 'actions/cleanups';

const styles = theme => ({
  stepStyle: {
    width: '100vw',
    maxWidth: '100%',
  },
});

const {
  LOCATION_SELECTION, DATE_SELECTION, SUMMARY, TOOL_SELECTION,
} = screens;

/**
 * This class encompasses all the view logic required to create a new Cleanup
 */
@connect(
  state => ({
    backgroundMapLocation: state.app.get('backgroundMapLocation'),
  }),
  dispatch =>
    bindActionCreators(
      {
        postCleanup,
      },
      dispatch
    )
)
@withStyles(styles)
class Create extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    backgroundMapLocation: PropTypes.instanceOf(Location),
    postCleanup: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      cleanup: new Cleanup({ location: props.backgroundMapLocation || new Location() }),
      dialogCloseTriggered: false,
    };
  }

  getNextButton = () => {
    const { activeStep, cleanup } = this.state;

    const stepMapping = {
      [LOCATION_SELECTION]: { disabled: cleanup.location.query == null },
      [DATE_SELECTION]: { disabled: !cleanup.timesAreValid() },
      [TOOL_SELECTION]: {},
      [SUMMARY]: {},
    };

    return (
      <Button
        disabled={ (stepMapping[activeStep] || {}).disabled }
        color='secondary'
        onClick={ this.handleNext }
        variant='raised'
      >
        {activeStep === this.steps.length - 1 ? 'Create Cleanup' : 'Next'}
      </Button>
    );
  };

  setCleanup = cleanup => this.setState({ cleanup });

  handleNext = () => {
    const { activeStep } = this.state;

    if (activeStep === this.steps.length - 1) {
      // If we're done, create new cleanup, add tools, redirect back home
      const { cleanup } = this.state;
      this.props.postCleanup(cleanup.toApiJSON());
      this.setState({ dialogCloseTriggered: true });
    } else {
      this.setState({ activeStep: activeStep + 1 });
    }
  };

  handleBack = () => this.setState({ activeStep: this.state.activeStep - 1 });

  steps = ['Location', 'Date and Time', 'Tools', 'Summary'];

  renderContentText = () => {
    const { activeStep } = this.state;
    const stepMapping = {
      [LOCATION_SELECTION]: 'Where is this cleanup located?',
      [DATE_SELECTION]: 'When does it start and end?',
      [TOOL_SELECTION]: 'What tools are required?',
      [SUMMARY]: 'Cleanup Summary',
    };

    return stepMapping[activeStep];
  };

  renderStep = () => {
    const { activeStep, cleanup } = this.state;
    const commonProps = { cleanup, setCleanup: this.setCleanup };

    const stepMapping = {
      [LOCATION_SELECTION]: <LocationRepresentation { ...commonProps } />,
      [DATE_SELECTION]: <DateRepresentation { ...commonProps } />,
      [TOOL_SELECTION]: <ToolsRepresentation { ...commonProps } />,
      [SUMMARY]: <CleanupSummary cleanup={ cleanup } setCleanup={ this.setCleanup } />,
    };

    return stepMapping[activeStep];
  };

  render() {
    const { activeStep, dialogCloseTriggered } = this.state;
    const { classes } = this.props;
    const actions = [
      <Button disabled={ activeStep === 0 } onClick={ this.handleBack }>
        Back
      </Button>,
      this.getNextButton(),
    ];

    return (
      <DialogContainer
        actions={ actions }
        reasonToLock='This cleanup has not been completed.'
        subtitle={ this.renderContentText() }
        title='Organize a New Cleanup'
        triggerClose={ dialogCloseTriggered }
      >
        <Stepper activeStep={ activeStep } alternativeLabel>
          {this.steps.map(label => (
            <Step key={ label }>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={ classes.stepStyle }>{this.renderStep()}</div>
      </DialogContainer>
    );
  }
}

export default withMobileDialog()(Create);

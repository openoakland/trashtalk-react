import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogContainer from 'components/global/DialogContainer';
import LocationRepresentation from 'components/cleanup/LocationRepresentation';
import ToolsRepresentation from 'components/cleanup/ToolsRepresentation';
import Metadata from 'components/cleanup/Metadata';
import Cleanup from 'models/Cleanup';
import Location from 'models/Location';

import { setSnackbarProps } from 'actions/app';
import { postCleanup } from 'actions/cleanups';
import { getTools, getToolCategories } from 'actions/tools';
import { loginRequired } from 'api/auth';

const styles = theme => ({
  dialogPaper: { height: '100%' },
  stepStyle: {
    display: 'flex',
    flex: 1,
    width: '100vw',
    maxWidth: '100%',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
  },
});

// Step order
const LOCATION_SELECTION = 0;
const TOOL_SELECTION = 1;
const METADATA = 2;

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
        getTools,
        getToolCategories,
        postCleanup,
        setSnackbarProps,
      },
      dispatch
    )
)
@withStyles(styles)
@loginRequired
class Create extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    backgroundMapLocation: PropTypes.instanceOf(Location),
    getTools: PropTypes.func,
    getToolCategories: PropTypes.func,
    postCleanup: PropTypes.func,
    setSnackbarProps: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      cleanup: new Cleanup({ location: props.backgroundMapLocation || new Location() }),
      dialogCloseTriggered: false,
    };

    // Get tools and tool categories so that by the time the user gets to the tools step
    // everthing is already available for rendering
    props.getTools();
    props.getToolCategories();
  }

  getNextButton = () => {
    const { activeStep, cleanup } = this.state;

    const disabledCriteria = {
      [LOCATION_SELECTION]: cleanup.location.query == null,
      [TOOL_SELECTION]: null,
      [METADATA]: !cleanup.timesAreValid(),
    };

    return (
      <Button
        disabled={ disabledCriteria[activeStep] }
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
      this.props.setSnackbarProps({
        message: 'Your new cleanup has been successfully created!',
        open: true,
      });
      this.setState({ dialogCloseTriggered: true });
    } else {
      this.setState({ activeStep: activeStep + 1 });
    }
  };

  handleBack = () => this.setState({ activeStep: this.state.activeStep - 1 });

  steps = ['Location', 'Tools', 'Wrap-up'];

  renderContentText = () => {
    const { activeStep } = this.state;
    const stepMapping = {
      [LOCATION_SELECTION]: 'Where is this cleanup located?',
      [TOOL_SELECTION]: 'What tools are required?',
      [METADATA]: 'Remaining details',
    };

    return stepMapping[activeStep];
  };

  renderStep = () => {
    const { activeStep, cleanup } = this.state;
    const commonProps = { cleanup, setCleanup: this.setCleanup };

    const stepMapping = {
      [LOCATION_SELECTION]: <LocationRepresentation { ...commonProps } />,
      [TOOL_SELECTION]: <ToolsRepresentation { ...commonProps } />,
      [METADATA]: <Metadata { ...commonProps } />,
    };

    return stepMapping[activeStep];
  };

  render() {
    const { activeStep, dialogCloseTriggered } = this.state;
    const { classes } = this.props;
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
        dialogClasses={ { paper: classes.dialogPaper } }
        reasonToLock='This cleanup has not been completed.'
        subtitle={ this.renderContentText() }
        title='Organize a New Cleanup'
        triggerClose={ dialogCloseTriggered }
      >
        <Stepper
          activeStep={ activeStep }
          alternativeLabel
          className={ classes.stepper }
        >
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

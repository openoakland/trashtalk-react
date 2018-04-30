import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DialogContainer from 'components/global/DialogContainer';
import CleanupSummary from 'components/cleanup/CleanupSummary';

/**
 * This component is used to display the details of a cleanup
 */
@connect(
  (state, props) => {
    return {
      cleanups: state.cleanups.get('cleanups'),
      cleanupId: Number(props.match.params.cleanupId),
    };
  },
  dispatch => bindActionCreators({}, dispatch)
)
export default class CleanupView extends React.PureComponent {
  static propTypes = {
    cleanups: PropTypes.object,
    cleanupId: PropTypes.number,
  }

  render() {
    const { cleanups, cleanupId } = this.props;
    const cleanup = cleanups.get(cleanupId);

    return (
      <DialogContainer>
        { cleanup && <CleanupSummary cleanup={ cleanup } /> }
      </DialogContainer>
    );
  }
}

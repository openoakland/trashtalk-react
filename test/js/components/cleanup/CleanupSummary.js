import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import { CleanupSummary } from 'components/cleanup/CleanupSummary';
import Cleanup from 'models/Cleanup';
import { Map } from 'immutable';

spy(CleanupSummary.prototype, 'componentDidMount');

describe('<CleanupSummary />', () => {
  it('calls componentDidMount once', () => {
    const options = {
      context: {
        store: {
          subscribe: () => {},
          dispatch: () => {},
          getState: () => ({
            app: Map(),
          }),
        },
      },
      childContextTypes: { store: PropTypes.object.isRequired },
    };

    const props = {
      cleanup: new Cleanup(),
      setCleanup: () => {},
      classes: {},
    };

    const wrapper = mount(
      (
        <MemoryRouter initialEntries={ [{ pathname: '/', key: 'testKey' }] }>
          <CleanupSummary { ...props } />
        </MemoryRouter>
      ), options
    );

    expect(CleanupSummary.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});


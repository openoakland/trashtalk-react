import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { GoogleMap } from 'components/GoogleMap';
import createSagaMiddleware from 'redux-saga';
import * as Immutable from 'immutable';

spy(GoogleMap.prototype, 'componentDidMount');


describe('<GoogleMap />', () => {
  it('calls componentDidMount once', () => {
    const props = {
      cleanups: [],
      store: {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => ({
          app: Immutable.Map(),
        }),
      },
    };

    const wrapper = mount(<GoogleMap { ...props } />);

    expect(GoogleMap.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { GoogleMap } from 'components/GoogleMap';
import createSagaMiddleware from 'redux-saga';
import configureMockStore from 'redux-mock-store';
import * as Immutable from 'immutable';

spy(GoogleMap.prototype, 'componentDidMount');

const mockStore = configureMockStore([createSagaMiddleware()]);
const mockStoreInitialized = mockStore({
  app: Immutable.Map(),
});

describe('<GoogleMap />', () => {
  it('componentDidMount gets called in the GoogleMap component', () => {
    const props = {
      cleanups: [],
      store: mockStoreInitialized,
    };
    const wrapper = mount(<GoogleMap { ...props } />);
    expect(GoogleMap.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});

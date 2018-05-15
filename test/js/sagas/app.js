import { expect } from 'chai';
import { loginStart } from 'sagas/app';
import { cloneableGenerator } from 'redux-saga/utils';
import { call, take } from 'redux-saga/effects';

describe('App Saga', () => {
  it('has a functioning loginStart', () => {
    const action = {
      username: 'foo',
      password: 'bar',
    };
    const generator = loginStart(action);
    // expect(take('LOGIN_START', action)).to.deep.equal(generator.next());
  });
});


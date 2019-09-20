import { before, after } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

let hasSetupComplete = false;

export class TestUtilError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export function setup() {

  if (hasSetupComplete) {
    return;
  }

  hasSetupComplete = true;
  before(() => {
    sinon.stub(console, 'error').callsFake((warning) => {
      throw new TestUtilError(warning);
    });
  });

  // While not forgetting to restore it afterwards
  after(() => {
    console.error.restore();
  });

}

export function assertRenderSuccess(enzymeWrapperProvider, successId) {
  try {
    const enzymeWrapper = enzymeWrapperProvider();
    expect(enzymeWrapper.find(successId)).to.have.length(1);
  } catch (ex) {
    expect.fail(null, null, 'Should pass, but failed with stack: ' + ex.stack);
  }
}

export function assertRenderFailure(enzymeWrapperProvider, errHandler) {
  try {
    enzymeWrapperProvider();
    expect.fail(null, null, 'Should throw, but passed');
  } catch (ex) {
    if (ex && ex.name === 'TestUtilError') {
      errHandler(ex);
    } else {
      throw ex;
    }
  }
}

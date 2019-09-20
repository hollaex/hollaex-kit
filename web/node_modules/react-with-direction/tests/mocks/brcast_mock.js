import casual from 'casual';
import sinon from 'sinon-sandbox';

export default (overrides = {}) => {
  const brcast = {
    data: casual.string,
    setState: sinon.stub(),
    unsubscribe: sinon.stub(),
    ...overrides,
  };

  brcast.getState = sinon.stub().returns(brcast.data);
  brcast.subscribe = sinon.stub().returns(brcast.unsubscribe);

  return {
    ...brcast,
    ...overrides,
  };
};

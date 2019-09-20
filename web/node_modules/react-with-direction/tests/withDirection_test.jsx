import PropTypes from 'prop-types';
import React from 'react';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';
import sinon from 'sinon-sandbox';

import DirectionProvider from '../src/DirectionProvider';
import withDirection, { withDirectionPropTypes } from '../src/withDirection';
import { DIRECTIONS, CHANNEL } from '../src/constants';
import mockBrcast from './mocks/brcast_mock';

function getWrappedComponent(expectedDirection) {
  function MyComponent({ animal, direction }) {
    expect(direction).to.equal(expectedDirection);
    return (
      <div>{`My direction is ${direction} and my animal is ${animal}.`}</div>
    );
  }
  MyComponent.propTypes = {
    ...withDirectionPropTypes,
    animal: PropTypes.string,
  };
  MyComponent.defaultProps = {
    animal: 'dog',
  };

  return withDirection(MyComponent);
}

describe('withDirection()', () => {
  it('has a wrapped displayName', () => {
    const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
    expect(Wrapped.displayName).to.equal('withDirection(MyComponent)');
  });

  it('defaults direction to LTR', () => {
    const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
    render(<Wrapped />);
  });

  it('passes direction from context to the wrapped component', () => {
    const Wrapped = getWrappedComponent(DIRECTIONS.RTL);
    render(
      <DirectionProvider direction={DIRECTIONS.RTL}>
        <div>
          <Wrapped />
        </div>
      </DirectionProvider>,
    );
  });

  describe('lifecycle methods', () => {
    let brcast;
    beforeEach(() => {
      const unsubscribe = sinon.stub();
      brcast = mockBrcast({
        data: DIRECTIONS.LTR,
        subscribe: sinon.stub().yields(DIRECTIONS.RTL).returns(unsubscribe),
        unsubscribe,
      });
    });

    describe('with a brcast context', () => {
      let context;
      beforeEach(() => {
        context = {
          [CHANNEL]: brcast,
        };
      });

      it('sets state with a new direction when the context changes', () => {
        const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
        const wrapper = shallow(<Wrapped />, { context });
        expect(wrapper).to.have.prop('direction', DIRECTIONS.LTR);

        wrapper.instance().componentDidMount();
        wrapper.update();
        expect(wrapper).to.have.prop('direction', DIRECTIONS.RTL);
      });

      it('calls brcast subscribe when the component mounts', () => {
        const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
        const wrapper = shallow(<Wrapped />, { context });

        expect(brcast.subscribe).to.have.callCount(0);
        wrapper.instance().componentDidMount();
        expect(brcast.subscribe).to.have.callCount(1);
      });

      it('calls brcast unsubscribe when the component unmounts', () => {
        const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
        const wrapper = shallow(<Wrapped />, { context });
        wrapper.instance().componentDidMount();

        expect(brcast.unsubscribe).to.have.callCount(0);
        wrapper.instance().componentWillUnmount();
        expect(brcast.unsubscribe).to.have.callCount(1);
      });
    });

    describe('without a brcast context', () => {
      let context;
      beforeEach(() => {
        context = {
          [CHANNEL]: null,
        };
      });

      it('does not call brcast subscribe when the component mounts', () => {
        const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
        const wrapper = shallow(<Wrapped />, { context });

        wrapper.instance().componentDidMount();
        expect(brcast.subscribe).to.have.callCount(0);
      });

      it('does not call brcast unsubscribe when the component unmounts', () => {
        const Wrapped = getWrappedComponent(DIRECTIONS.LTR);
        const wrapper = shallow(<Wrapped />, { context });
        wrapper.instance().componentDidMount();

        wrapper.instance().componentWillUnmount();
        expect(brcast.unsubscribe).to.have.callCount(0);
      });
    });
  });
});

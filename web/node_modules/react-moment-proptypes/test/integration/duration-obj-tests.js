import { describe } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import moment from 'moment';
import { setup, assertRenderSuccess, assertRenderFailure, TestUtilError } from './util';
import { momentDurationObj } from '../../src/index';
import { messages } from '../../src/core';

const successIdKey = '#success';
class MomentDurationObj extends React.Component {
  render() {
    return (
      <h1 id='success'>
        <div>required: {typeof this.props.requiredMomentDurationObj}</div>
        <div>required: {typeof this.props.optionalMomentDurationObj}</div>
      </h1>
    );
  }
}

setup();

describe('momentDurationObj', () => {

  describe('isRequired', () => {

    before(() => {
      MomentDurationObj.propTypes = {
        requiredMomentDurationObj: momentDurationObj.isRequired,
      };
    });

    describe('<MomentDurationObj />', () => {
      it('Throws required message', () => {
        assertRenderFailure(() => shallow(<MomentDurationObj />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.requiredCore);
        });
      });
    });

    describe('<MomentDurationObj moment={null} />', () => {
      it('Throws required message', () => {
        const props = { requiredMomentDurationObj: null };
        assertRenderFailure(() => shallow(<MomentDurationObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.requiredCore);
        });
      });
    });

    // TODO: [Issue 26] passing when it shouldn't in Enzyme. Uncomment when fixed
    // describe('<MomentDurationObj moment={undefined} />', () => {
    //   it('Throws required message', () => {
    //     const props = { requiredMomentDurationObj: undefined };
    //     assertRenderFailure(() => mount(<MomentDurationObj {...props} />), (ex) => {
    //       expect(ex).to.be.an.instanceOf(TestUtilError);
    //       expect(ex.message).to.contain(messages.requiredCore);
    //     });
    //   });
    // });

    describe('<MomentDurationObj moment={Number} />', () => {
      it('Throws invalid type message', () => {
        const props = { requiredMomentDurationObj: 123 };
        assertRenderFailure(() => shallow(<MomentDurationObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain(messages.invalidTypeCore);
        });
      });
    });

    describe('<MomentDurationObj moment={moment} />', () => {
      it('renders without error', () => {
        const props = { requiredMomentDurationObj: moment.duration(0) };
        assertRenderSuccess(() => shallow(<MomentDurationObj {...props} />), successIdKey);
      });
    });

  });

  describe('optional', () => {

    before(() => {
      MomentDurationObj.propTypes = {
        optionalMomentDurationObj: momentDurationObj,
      };
    });

    describe('<MomentDurationObj />', () => {
      it('renders without error', () => {
        assertRenderSuccess(() => shallow(<MomentDurationObj />), successIdKey);
      });
    });

    describe('<MomentDurationObj moment={null} />', () => {
      it('Throws required message', () => {
        const props = { optionalMomentDurationObj: null };
        assertRenderSuccess(() => shallow(<MomentDurationObj {...props} />), successIdKey);
      });
    });

    describe('<MomentDurationObj moment={undefined} />', () => {
      it('Throws required message', () => {
        const props = { optionalMomentDurationObj: undefined };
        assertRenderSuccess(() => shallow(<MomentDurationObj {...props} />), successIdKey);
      });
    });

    describe('<MomentDurationObj moment={Number} />', () => {
      it('Throws invalid type message', () => {
        const props = { optionalMomentDurationObj: 123 };
        assertRenderFailure(() => shallow(<MomentDurationObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.invalidTypeCore);
        });
      });
    });

    describe('<MomentDurationObj moment={moment} />', () => {
      it('renders without error', () => {
        const props = { optionalMomentDurationObj: moment.duration(0) };
        assertRenderSuccess(() => shallow(<MomentDurationObj {...props} />), successIdKey);
      });
    });

  });

});

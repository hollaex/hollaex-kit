import { describe } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import moment from 'moment';
import { setup, assertRenderSuccess, assertRenderFailure, TestUtilError } from './util';
import { momentObj } from '../../src/index';
import { messages } from '../../src/core';

const successIdKey = '#success';
class MomentObj extends React.Component {
  render() {
    return (
      <h1 id='success'>
        <div>required: {typeof this.props.requiredMomentObj}</div>
        <div>required: {typeof this.props.optionalMomentObj}</div>
      </h1>
    );
  }
}

setup();

describe('momentObj', () => {

  describe('isRequired', () => {

    before(() => {
      MomentObj.propTypes = {
        requiredMomentObj: momentObj.isRequired,
      };
    });

    describe('<MomentObj />', () => {
      it('Throws required message', () => {
        assertRenderFailure(() => shallow(<MomentObj />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.requiredCore);
        });
      });
    });

    describe('<MomentObj moment={null} />', () => {
      it('Throws required message', () => {
        const props = { requiredMomentObj: null };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.requiredCore);
        });
      });
    });

    // TODO: [Issue 26] passing when it shouldn't in Enzyme. Uncomment when fixed
    // describe('<MomentObj moment={undefined} />', () => {
    //   it('Throws required message', () => {
    //     const props = { requiredMomentObj: undefined };
    //     assertRenderFailure(() => mount(<MomentObj {...props} />), (ex) => {
    //       expect(ex).to.be.an.instanceOf(TestUtilError);
    //       expect(ex.message).to.contain(messages.requiredCore);
    //     });
    //   });
    // });

    describe('<MomentObj moment={Number} />', () => {
      it('Throws invalid type message', () => {
        const props = { requiredMomentObj: 123 };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain(messages.invalidTypeCore);
        });
      });
    });

    describe('<MomentObj moment={moment} />', () => {
      it('renders without error', () => {
        const props = { requiredMomentObj: moment() };
        assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      });
    });

  });

  describe('optional', () => {

    before(() => {
      MomentObj.propTypes = {
        optionalMomentObj: momentObj,
      };
    });

    describe('<MomentObj />', () => {
      it('renders without error', () => {
        assertRenderSuccess(() => shallow(<MomentObj />), successIdKey);
      });
    });

    describe('<MomentObj moment={null} />', () => {
      it('Throws required message', () => {
        const props = { optionalMomentObj: null };
        assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      });
    });

    describe('<MomentObj moment={undefined} />', () => {
      it('Throws required message', () => {
        const props = { optionalMomentObj: undefined };
        assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      });
    });

    describe('<MomentObj moment={Number} />', () => {
      it('Throws invalid type message', () => {
        const props = { optionalMomentObj: 123 };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.invalidTypeCore);
        });
      });
    });

    describe('<MomentObj moment={moment} />', () => {
      it('renders without error', () => {
        const props = { optionalMomentObj: moment() };
        assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      });
    });

  });

});

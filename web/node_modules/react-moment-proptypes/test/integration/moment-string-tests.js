import { describe } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { setup, assertRenderSuccess, assertRenderFailure } from './util';
import { momentString } from '../../src/index';
import { messages } from '../../src/core';

const successIdKey = '#success';
class MomentStr extends React.Component {
  render() {
    return (
      <h1 id='success'>
        <div>required: {typeof this.props.requiredMomentStr}</div>
        <div>required: {typeof this.props.optionalMomentStr}</div>
      </h1>
    );
  }
}

setup();

describe('momentString', () => {

  describe('isRequired', () => {

    before(() => {
      MomentStr.propTypes = {
        requiredMomentStr: momentString.isRequired,
      };
    });

    describe('<MomentStr />', () => {
      it('Throws required message', () => {
        assertRenderFailure(() => shallow(<MomentStr />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain(messages.requiredCore);
        });
      });
    });

    describe('<MomentStr moment={null} />', () => {
      it('Throws required message', () => {
        const props = { requiredMomentStr: null };
        assertRenderFailure(() => shallow(<MomentStr {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain(messages.requiredCore);
        });
      });
    });

    // TODO:[Issue 26] passing when it shouldn't in Enzyme. Uncomment when fixed
    // describe('<MomentStr moment={undefined} />', () => {
    //   it('Throws required message', () => {
    //     const props = { requiredMomentStr: undefined };
    //     assertRenderFailure(() => shallow(<MomentStr {...props} />), (ex) => {
    //       expect(ex).to.be.an.instanceOf(Error);
    //       expect(ex.message).to.contain(messages.requiredCore);
    //     });
    //   });
    // });

    describe('<MomentStr moment={Number} />', () => {
      it('Throws invalid type message', () => {
        const props = { requiredMomentStr: 123 };
        assertRenderFailure(() => shallow(<MomentStr {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain(messages.invalidTypeCore);
        });
      });
    });

    describe('<MomentStr moment={"invalidMomentString"} />', () => {
      it('renders without error', () => {
        const props = { requiredMomentStr: 'not a date' };
        assertRenderFailure(() => shallow(<MomentStr {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain('Moment');
        });
      });
    });

    describe('<MomentStr moment={"momentString"} />', () => {
      it('renders without error', () => {
        const props = { requiredMomentStr: '2012-12-31' };
        assertRenderSuccess(() => shallow(<MomentStr {...props} />), successIdKey);
      });
    });

  });

  describe('optional', () => {

    before(() => {
      MomentStr.propTypes = {
        optionalMomentStr: momentString,
      };
    });

    describe('<MomentStr />', () => {
      it('renders without error', () => {
        assertRenderSuccess(() => shallow(<MomentStr />), successIdKey);
      });
    });

    describe('<MomentStr moment={null} />', () => {
      it('Throws required message', () => {
        const props = { optionalMomentStr: null };
        assertRenderSuccess(() => shallow(<MomentStr {...props} />), successIdKey);
      });
    });

    describe('<MomentStr moment={undefined} />', () => {
      it('Throws required message', () => {
        const props = { optionalMomentStr: undefined };
        assertRenderSuccess(() => shallow(<MomentStr {...props} />), successIdKey);
      });
    });

    describe('<MomentStr moment={Number} />', () => {
      it('Throws invalid type message', () => {
        const props = { optionalMomentStr: 123 };
        assertRenderFailure(() => shallow(<MomentStr {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain(messages.invalidTypeCore);
        });
      });
    });

    describe('<MomentStr moment={"invalidMomentString"} />', () => {
      it('renders without error', () => {
        const props = { optionalMomentStr: 'not a date' };
        assertRenderFailure(() => shallow(<MomentStr {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(Error);
          expect(ex.message).to.contain('Moment');
        });
      });
    });

    describe('<MomentStr moment={"momentString"} />', () => {
      it('renders without error', () => {
        const props = { optionalMomentStr: '2012-12-31' };
        assertRenderSuccess(() => shallow(<MomentStr {...props} />), successIdKey);
      });
    });

  });

});

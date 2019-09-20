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
        <div>required: {typeof this.props.requiredObjectNamedPredicate}</div>
        <div>required: {typeof this.props.requiredObjectAnonPredicate}</div>
      </h1>
    );
  }
}

setup();

describe('predicates', () => {

  describe('isRequired', () => {

    describe('<MomentObj moment={moment} />', () => {
      before(() => {
        MomentObj.propTypes = {
          requiredObjectNamedPredicate : momentObj.withPredicate(
            function namedPredicate(momentPropValue) {
              return true;
            }
          ).isRequired,
          requiredObjectAnonPredicate : momentObj.withPredicate(() => true).isRequired,
        };
      });

      it('renders without error', () => {
        const props = {
          requiredObjectNamedPredicate: moment(),
          requiredObjectAnonPredicate: moment(),
        };
        assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      });
    });

    describe('<MomentObj moment={moment} />', () => {
      let predicateName = null;

      before(() => {
        function namedPredicate(momentPropValue) {
          return false;
        }
        predicateName = namedPredicate.name;
        MomentObj.propTypes = {
          requiredObjectNamedPredicate : momentObj.withPredicate(namedPredicate).isRequired,
        };
      });

      it('named predicated fails', () => {
        const props = { requiredObjectNamedPredicate: moment() };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(predicateName).to.not.be.null;
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.predicateFailureCore);
          expect(ex.message).to.contain(predicateName);
        });
      });
    });

    describe('<MomentObj moment={moment} />', () => {
      before(() => {
        MomentObj.propTypes = {
          requiredObjectAnonPredicate : momentObj.withPredicate(() => false).isRequired,
        };
      });

      it('anonymous predicated fails', () => {
        const props = { requiredObjectAnonPredicate: moment() };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.predicateFailureCore);
          expect(ex.message).to.contain(messages.anonymousMessage);
        });
      });
    });

    describe('basePropValidation', () => {

      before(() => {
        MomentObj.propTypes = {
          requiredObjectAnonPredicate : momentObj.withPredicate(() => true).isRequired,
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
          const props = { requiredObjectAnonPredicate: null };
          assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
            expect(ex).to.be.an.instanceOf(TestUtilError);
            expect(ex.message).to.contain(messages.requiredCore);
          });
        });
      });

      // TODO: [Issue 26] passing when it shouldn't in Enzyme. Uncomment when fixed
      // describe('<MomentObj moment={undefined} />', () => {
      //   it('Throws required message', () => {
      //     const props = { requiredObjectAnonPredicate: undefined };
      //     assertRenderFailure(() => mount(<MomentObj {...props} />), (ex) => {
      //       expect(ex).to.be.an.instanceOf(TestUtilError);
      //       expect(ex.message).to.contain(messages.requiredCore);
      //     });
      //   });
      // });
    });

  });

  describe('optional', () => {

    describe('<MomentObj moment={moment} />', () => {
      before(() => {
        MomentObj.propTypes = {
          optionalObjectNamedPredicate : momentObj.withPredicate(
            function namedPredicate(momentPropValue) {
              return true;
            }
          ),
          optionalObjectAnonPredicate : momentObj.withPredicate(() => true),
        };
      });

      it('renders without error', () => {
        const props = {
          optionalObjectNamedPredicate: moment(),
          optionalObjectAnonPredicate: moment(),
        };
        assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      });
    });

    describe('<MomentObj moment={moment} />', () => {
      let predicateName = null;

      before(() => {
        function namedPredicate(momentPropValue) {
          return false;
        }
        predicateName = namedPredicate.name;
        MomentObj.propTypes = {
          optionalObjectNamedPredicate : momentObj.withPredicate(namedPredicate),
        };
      });

      it('named predicated fails', () => {
        const props = { optionalObjectNamedPredicate: moment() };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(predicateName).to.not.be.null;
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.predicateFailureCore);
          expect(ex.message).to.contain(predicateName);
        });
      });
    });

    describe('<MomentObj moment={moment} />', () => {
      before(() => {
        MomentObj.propTypes = {
          optionalObjectAnonPredicate : momentObj.withPredicate(() => false),
        };
      });

      it('anonymous predicated fails', () => {
        const props = { optionalObjectAnonPredicate: moment() };
        assertRenderFailure(() => shallow(<MomentObj {...props} />), (ex) => {
          expect(ex).to.be.an.instanceOf(TestUtilError);
          expect(ex.message).to.contain(messages.predicateFailureCore);
          expect(ex.message).to.contain(messages.anonymousMessage);
        });
      });
    });

    describe('basePropValidation', () => {

      before(() => {
        MomentObj.propTypes = {
          optionalObjectAnonPredicate : momentObj.withPredicate(() => true),
        };
      });

      describe('<MomentObj />', () => {
        it('Throws required message', () => {
          assertRenderSuccess(() => shallow(<MomentObj />), successIdKey);
        });
      });

      describe('<MomentObj moment={null} />', () => {
        it('Throws required message', () => {
          const props = { optionalObjectAnonPredicate: null };
          assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
        });
      });

      // TODO: [Issue 26] passing when it shouldn't in Enzyme. Uncomment when fixed
      // describe('<MomentObj moment={undefined} />', () => {
      //   it('Throws required message', () => {
      //     const props = { optionalObjectAnonPredicate: undefined };
      //     assertRenderSuccess(() => shallow(<MomentObj {...props} />), successIdKey);
      //   });
      // });
    });

  });

});

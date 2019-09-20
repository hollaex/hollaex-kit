import { describe } from 'mocha';
import { expect } from 'chai';

import { messages, createMomentChecker, constructPropValidatorVariations } from '../src/core';

const baseArguments = {
  props: { requiredMomentObj: '2017-07-02T02:23:38.149Z' },
  propName: 'requiredMomentObj',
  componentName: 'MomentObj',
  location: 'prop',
  propFullName: null,
  type: 'object',
  momentType: 'Moment',
};

function flattenValidatorArgs(argsObj) {
  let argumentsObj = { ...baseArguments, ...argsObj };
  return [
    argumentsObj.props,
    argumentsObj.propName,
    argumentsObj.componentName,
    argumentsObj.location,
    argumentsObj.propFullName,
    argumentsObj.type,
    argumentsObj.momentType,
  ];
}

describe('core', () => {

  describe('constructPropValidatorVariations', () => {

    it('throws when invalid prop validator', () => {
      try {
        constructPropValidatorVariations(null);
        expect.fail(null, null, 'should have thrown');
      } catch (ex) {
        expect(ex).to.be.an.instanceOf(Error);
        expect(ex.name).to.not.equal('AssertionError', ex.stack);
        expect(ex.message).to.equal(messages.invalidPropValidator);
      }
    });

    it('throws when invalid validation predicate', () => {
      let propValidator = constructPropValidatorVariations(() => true);
      expect(propValidator).to.not.be.null;
      expect(propValidator.withPredicate).to.be.a('function', typeof propValidator.withPredicate);

      try {
        propValidator.withPredicate(null);
        expect.fail(null, null, 'should have thrown');
      } catch (ex) {
        expect(ex).to.be.an.instanceOf(Error);
        expect(ex.name).to.not.equal('AssertionError', ex.stack);
        expect(ex.message).to.equal(messages.invalidPredicate);
      }
    });

    it('returns correct variations', () => {
      let propValidator = constructPropValidatorVariations(() => true);
      expect(propValidator).to.not.be.null;
      expect(propValidator).to.be.a('function', typeof propValidator);
      expect(propValidator.isRequired).to.be.a('function', typeof propValidator.isRequired);
      expect(propValidator.withPredicate).to.be.a('function', typeof propValidator.withPredicate);
    });

    it('returns correct predicate variations', () => {
      let propValidator = constructPropValidatorVariations(() => true);
      expect(propValidator).to.not.be.null;
      expect(propValidator).to.be.a('function', typeof propValidator);
      expect(propValidator.withPredicate).to.be.a('function', typeof propValidator.withPredicate);

      let predicatePropValidator = propValidator.withPredicate(() => true);
      expect(predicatePropValidator).to.not.be.null;
      expect(predicatePropValidator).to.be.a('function', typeof predicatePropValidator);
      expect(predicatePropValidator.isRequired)
        .to.be.a('function', typeof predicatePropValidator.isRequired);
    });

  });

  describe('createMomentChecker', () => {

    let propValidator;

    before(() => {
      propValidator = createMomentChecker(
        'string',
        () => true,
        () => true,
        'Moment'
      );
    });

    it('passes validation', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
      validationResult = propValidator.isRequired.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
      validationResult = propValidator.isRequired.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
      validationResult = propValidator.withPredicate(() => true).apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(validationResult));
      validationResult = propValidator.withPredicate(() => true).isRequired.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });

    it('returns error when missing optional', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: {} });
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });

    it('returns error when `undefined` optional', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: { [baseArguments.propName]: undefined } });
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });

    it('returns error when `null` optional', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: { [baseArguments.propName]: null } });
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });

    it('returns error when missing isRequired', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: {} });
      let validationResult = propValidator.isRequired.apply(null, args);
      expect(validationResult).to.an.instanceOf(Error, JSON.stringify(args));
      expect(validationResult.message).to.contain(messages.requiredCore);
      expect(validationResult.message).to.contain(args.componentName);
    });

    it('returns error when missing isRequired in anonymous component', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: {}, componentName: null });
      let validationResult = propValidator.isRequired.apply(null, args);
      expect(validationResult).to.an.instanceOf(Error, JSON.stringify(args));
      expect(validationResult.message).to.contain(messages.requiredCore);
      expect(validationResult.message).to.contain(messages.anonymousMessage);
    });

    it('returns error when `undefined` isRequired', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: { [baseArguments.propName]: undefined } });
      let validationResult = propValidator.isRequired.apply(null, args);
      expect(validationResult).to.an.instanceOf(Error, JSON.stringify(args));
      expect(validationResult.message).to.contain(messages.requiredCore);
    });

    it('returns error when `null` isRequired', () => {
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs({ props: { [baseArguments.propName]: null } });
      let validationResult = propValidator.isRequired.apply(null, args);
      expect(validationResult).to.an.instanceOf(Error, JSON.stringify(args));
      expect(validationResult.message).to.contain(messages.requiredCore);
    });

  });

  describe('typeValidator', () => {
    it('passes validation when missing', () => {
      let propValidator = createMomentChecker(
        'string',
        null,
        () => true,
        'Moment'
      );

      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });

    it('returns error when typeValidator fails', () => {
      let propValidator = createMomentChecker(
        'string',
        () => false,
        () => true,
        'Moment'
      );

      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.an.instanceOf(Error, JSON.stringify(args));
      expect(validationResult.message).to.contain(messages.invalidTypeCore);
    });

    it('passes validation when typeValidator passes', () => {
      let propValidator = createMomentChecker(
        'string',
        () => true,
        () => true,
        'Moment'
      );

      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });
  });

  describe('validator', () => {
    it('returns error when missing', () => {
      // TODO: change behavior to fail instead of throw
      let propValidator = createMomentChecker('string', null, null, 'Moment');
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      expect(() => propValidator.apply(null, args)).to.throw;
    });

    it('returns error when invalid', () => {
      let propValidator = createMomentChecker('string', null, () => false, 'Moment');
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.an.instanceOf(Error, JSON.stringify(args));
      expect(validationResult.message).to
        .contain(messages.baseInvalidMessage + baseArguments.location, JSON.stringify(args));
    });

    it('returns null when valid', () => {
      let propValidator = createMomentChecker('string', null, () => true, 'Moment');
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });
  });

  describe('predicate', () => {
    it('returns error when invalid', () => {
      function namedPredicate() {
        return false;
      }
      let propValidator = createMomentChecker('string', null, () => true, 'Moment');
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.withPredicate(namedPredicate).apply(null, args);
      expect(validationResult).to.be.an.instanceOf(Error);
      expect(validationResult.message).to.contain(messages.predicateFailureCore);
      expect(validationResult.message).to.contain(namedPredicate.name);
    });

    it('returns error when invalid for anonymous predicate', () => {
      let propValidator = createMomentChecker('string', null, () => true, 'Moment');
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.withPredicate(() => false).apply(null, args);
      expect(validationResult).to.be.an.instanceOf(Error);
      expect(validationResult.message).to.contain(messages.predicateFailureCore);
      expect(validationResult.message).to.contain(messages.anonymousMessage);
    });

    it('returns null when valid', () => {
      let propValidator = createMomentChecker('string', null, () => true, 'Moment');
      expect(propValidator).to.be.a('function', typeof propValidator);
      const args = flattenValidatorArgs();
      let validationResult = propValidator.withPredicate(() => true).apply(null, args);
      expect(validationResult).to.equal(null, JSON.stringify(args));
    });
  });

});

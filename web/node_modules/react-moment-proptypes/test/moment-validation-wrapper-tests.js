import { describe } from 'mocha';
import { expect } from 'chai';

import moment from 'moment';
import { isValidMoment } from '../src/moment-validation-wrapper';

describe('isValidMoment', () => {

  it('returns false for ', () => {
    const wrongTypeTestValues = [undefined, null, [], 123, ''];
    for (let testValue of wrongTypeTestValues) {
      expect(isValidMoment(testValue)).to.equal(false, JSON.stringify(testValue));
    }
  });

  it('returns false for invalid moment', () => {
    const wrongTypeTestValues = [
      moment('not a moment'),
    ];
    for (let testValue of wrongTypeTestValues) {
      expect(isValidMoment(testValue)).to.equal(false, JSON.stringify(testValue));
    }
  });

  it('returns true for valid moment', () => {
    const testValue = moment('2012-12-31');
    expect(isValidMoment(testValue)).to.equal(true, JSON.stringify(testValue));
  });

});

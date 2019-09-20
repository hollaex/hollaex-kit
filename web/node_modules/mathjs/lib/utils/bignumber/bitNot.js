'use strict';
/**
 * Bitwise not
 * @param {BigNumber} x
 * @return {BigNumber} Result of ~`x`, fully precise
 *
 */

module.exports = function bitNot(x) {
  if (x.isFinite() && !x.isInteger()) {
    throw new Error('Integer expected in function bitNot');
  }

  var BigNumber = x.constructor;
  var prevPrec = BigNumber.precision;
  BigNumber.config({
    precision: 1E9
  });
  var result = x.plus(new BigNumber(1));
  result.s = -result.s || null;
  BigNumber.config({
    precision: prevPrec
  });
  return result;
};
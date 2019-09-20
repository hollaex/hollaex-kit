'use strict';

var nearlyEqual = require('../../utils/number').nearlyEqual;

var bigNearlyEqual = require('../../utils/bignumber/nearlyEqual');

function factory(type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  var latex = require('../../utils/latex');
  /**
   * Test whether value x is larger or equal to y.
   *
   * The function returns true when x is larger than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.largerEq(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 1 + 1)         // returns false
   *    math.largerEq(2, 1 + 1)       // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is larger or equal to y, else returns false
   */


  var largerEq = typed('largerEq', {
    'boolean, boolean': function booleanBoolean(x, y) {
      return x >= y;
    },
    'number, number': function numberNumber(x, y) {
      return x >= y || nearlyEqual(x, y, config.epsilon);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.gte(y) || bigNearlyEqual(x, y, config.epsilon);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.compare(y) !== -1;
    },
    'Complex, Complex': function ComplexComplex() {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }

      return largerEq(x.value, y.value);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm07(x, y, largerEq);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm03(y, x, largerEq, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm03(x, y, largerEq, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, largerEq);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return largerEq(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return largerEq(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return largerEq(x, matrix(y));
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm12(x, y, largerEq, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, largerEq, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm12(y, x, largerEq, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, largerEq, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, largerEq, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, largerEq, true).valueOf();
    }
  });
  largerEq.toTex = {
    2: "\\left(${args[0]}".concat(latex.operators['largerEq'], "${args[1]}\\right)")
  };
  return largerEq;
}

exports.name = 'largerEq';
exports.factory = factory;
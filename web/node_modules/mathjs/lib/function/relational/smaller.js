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
   * Test whether value x is smaller than y.
   *
   * The function returns true when x is smaller than y and the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.smaller(x, y)
   *
   * Examples:
   *
   *    math.smaller(2, 3)            // returns true
   *    math.smaller(5, 2 * 2)        // returns false
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('2 inch')
   *    math.smaller(a, b)            // returns true
   *
   * See also:
   *
   *    equal, unequal, smallerEq, smaller, smallerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */


  var smaller = typed('smaller', {
    'boolean, boolean': function booleanBoolean(x, y) {
      return x < y;
    },
    'number, number': function numberNumber(x, y) {
      return x < y && !nearlyEqual(x, y, config.epsilon);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.lt(y) && !bigNearlyEqual(x, y, config.epsilon);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.compare(y) === -1;
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }

      return smaller(x.value, y.value);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm07(x, y, smaller);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm03(y, x, smaller, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm03(x, y, smaller, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, smaller);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return smaller(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return smaller(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return smaller(x, matrix(y));
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm12(x, y, smaller, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, smaller, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm12(y, x, smaller, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, smaller, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, smaller, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, smaller, true).valueOf();
    }
  });
  smaller.toTex = {
    2: "\\left(${args[0]}".concat(latex.operators['smaller'], "${args[1]}\\right)")
  };
  return smaller;
}

exports.name = 'smaller';
exports.factory = factory;
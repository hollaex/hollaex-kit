'use strict';

var DimensionError = require('../../error/DimensionError');

function factory(type, config, load, typed) {
  var latex = require('../../utils/latex');

  var matrix = load(require('../../type/matrix/function/matrix'));
  var addScalar = load(require('./addScalar'));
  var unaryMinus = load(require('./unaryMinus'));
  var algorithm01 = load(require('../../type/matrix/utils/algorithm01'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm05 = load(require('../../type/matrix/utils/algorithm05'));
  var algorithm10 = load(require('../../type/matrix/utils/algorithm10'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14')); // TODO: split function subtract in two: subtract and subtractScalar

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */

  var subtract = typed('subtract', {
    'number, number': function numberNumber(x, y) {
      return x - y;
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.sub(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.minus(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.sub(y);
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (x.value === null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value === null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value = subtract(res.value, y.value);
      res.fixPrefix = false;
      return res;
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm05(x, y, subtract);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm03(y, x, subtract, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm01(x, y, subtract, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      checkEqualDimensions(x, y);
      return algorithm13(x, y, subtract);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return subtract(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return subtract(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return subtract(x, matrix(y));
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm10(x, unaryMinus(y), addScalar);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, subtract);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm10(y, x, subtract, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, subtract, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, subtract, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, subtract, true).valueOf();
    }
  });
  subtract.toTex = {
    2: "\\left(${args[0]}".concat(latex.operators['subtract'], "${args[1]}\\right)")
  };
  return subtract;
}
/**
 * Check whether matrix x and y have the same number of dimensions.
 * Throws a DimensionError when dimensions are not equal
 * @param {Matrix} x
 * @param {Matrix} y
 */


function checkEqualDimensions(x, y) {
  var xsize = x.size();
  var ysize = y.size();

  if (xsize.length !== ysize.length) {
    throw new DimensionError(xsize.length, ysize.length);
  }
}

exports.name = 'subtract';
exports.factory = factory;
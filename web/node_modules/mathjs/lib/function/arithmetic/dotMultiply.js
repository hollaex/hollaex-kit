'use strict';

function factory(type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var multiplyScalar = load(require('./multiplyScalar'));

  var latex = require('../../utils/latex');

  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm09 = load(require('../../type/matrix/utils/algorithm09'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotMultiply(x, y)
   *
   * Examples:
   *
   *    math.dotMultiply(2, 4) // returns 8
   *
   *    a = [[9, 5], [6, 1]]
   *    b = [[3, 2], [5, 2]]
   *
   *    math.dotMultiply(a, b) // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b)    // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, dotDivide
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Left hand value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Right hand value
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
   */

  var dotMultiply = typed('dotMultiply', {
    'any, any': multiplyScalar,
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm09(x, y, multiplyScalar, false);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm02(y, x, multiplyScalar, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm02(x, y, multiplyScalar, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, multiplyScalar);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return dotMultiply(x, matrix(y));
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm11(x, y, multiplyScalar, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, multiplyScalar, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm11(y, x, multiplyScalar, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, multiplyScalar, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf();
    }
  });
  dotMultiply.toTex = {
    2: "\\left(${args[0]}".concat(latex.operators['dotMultiply'], "${args[1]}\\right)")
  };
  return dotMultiply;
}

exports.name = 'dotMultiply';
exports.factory = factory;
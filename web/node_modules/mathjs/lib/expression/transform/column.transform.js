'use strict';

var errorTransform = require('./error.transform').transform;
/**
 * Attach a transform function to matrix.column
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `index` parameter of function column
 * from zero-based to one-based
 */


function factory(type, config, load, typed) {
  var column = load(require('../../function/matrix/column')); // @see: comment of column itself

  return typed('column', {
    '...any': function any(args) {
      // change last argument from zero-based to one-based
      var lastIndex = args.length - 1;
      var last = args[lastIndex];

      if (type.isNumber(last)) {
        args[lastIndex] = last - 1;
      }

      try {
        return column.apply(null, args);
      } catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'column';
exports.path = 'expression.transform';
exports.factory = factory;
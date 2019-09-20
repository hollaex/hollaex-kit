'use strict';

var errorTransform = require('./error.transform').transform;
/**
 * Attach a transform function to math.apply
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function apply
 * from one-based to zero based
 */


function factory(type, config, load, typed) {
  var apply = load(require('../../function/matrix/apply')); // @see: comment of concat itself

  return typed('apply', {
    '...any': function any(args) {
      // change dim from one-based to zero-based
      var dim = args[1];

      if (type.isNumber(dim)) {
        args[1] = dim - 1;
      } else if (type.isBigNumber(dim)) {
        args[1] = dim.minus(1);
      }

      try {
        return apply.apply(null, args);
      } catch (err) {
        throw errorTransform(err);
      }
    }
  });
}

exports.name = 'apply';
exports.path = 'expression.transform';
exports.factory = factory;
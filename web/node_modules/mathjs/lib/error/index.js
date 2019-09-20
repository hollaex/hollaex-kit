'use strict';

var ArgumentsError = require('./ArgumentsError');

var DimensionError = require('./DimensionError');

var IndexError = require('./IndexError');

module.exports = [{
  name: 'ArgumentsError',
  path: 'error',
  factory: function factory() {
    return ArgumentsError;
  }
}, {
  name: 'DimensionError',
  path: 'error',
  factory: function factory() {
    return DimensionError;
  }
}, {
  name: 'IndexError',
  path: 'error',
  factory: function factory() {
    return IndexError;
  }
}]; // TODO: implement an InvalidValueError?
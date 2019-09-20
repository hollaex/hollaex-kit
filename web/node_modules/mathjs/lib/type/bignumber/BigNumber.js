'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;
exports.math = exports.path = exports.name = void 0;

var _decimal = _interopRequireDefault(require("decimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function factory(type, config, load, typed, math) {
  var BigNumber = _decimal["default"].clone({
    precision: config.precision
  });
  /**
   * Attach type information
   */


  BigNumber.prototype.type = 'BigNumber';
  BigNumber.prototype.isBigNumber = true;
  /**
   * Get a JSON representation of a BigNumber containing
   * type information
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "BigNumber", "value": "0.2"}`
   */

  BigNumber.prototype.toJSON = function () {
    return {
      mathjs: 'BigNumber',
      value: this.toString()
    };
  };
  /**
   * Instantiate a BigNumber from a JSON object
   * @param {Object} json  a JSON object structured as:
   *                       `{"mathjs": "BigNumber", "value": "0.2"}`
   * @return {BigNumber}
   */


  BigNumber.fromJSON = function (json) {
    return new BigNumber(json.value);
  }; // listen for changed in the configuration, automatically apply changed precision


  math.on('config', function (curr, prev) {
    if (curr.precision !== prev.precision) {
      BigNumber.config({
        precision: curr.precision
      });
    }
  });
  return BigNumber;
}

var name = 'BigNumber';
exports.name = name;
var path = 'type';
exports.path = path;
var math = true; // request access to the math namespace

exports.math = math;
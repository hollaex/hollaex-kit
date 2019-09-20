"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _es6Error = _interopRequireDefault(require("es6-error"));

var SubmissionError =
/*#__PURE__*/
function (_ExtendableError) {
  (0, _inheritsLoose2["default"])(SubmissionError, _ExtendableError);

  function SubmissionError(errors) {
    var _this;

    _this = _ExtendableError.call(this, 'Submit Validation Failed') || this;
    _this.errors = errors;
    return _this;
  }

  return SubmissionError;
}(_es6Error["default"]);

var _default = SubmissionError;
exports["default"] = _default;
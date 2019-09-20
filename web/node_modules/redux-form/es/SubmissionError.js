import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import ExtendableError from 'es6-error';

var SubmissionError =
/*#__PURE__*/
function (_ExtendableError) {
  _inheritsLoose(SubmissionError, _ExtendableError);

  function SubmissionError(errors) {
    var _this;

    _this = _ExtendableError.call(this, 'Submit Validation Failed') || this;
    _this.errors = errors;
    return _this;
  }

  return SubmissionError;
}(ExtendableError);

export default SubmissionError;
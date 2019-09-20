'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  100% {\n    transform: rotate(360deg)\n  }\n'], ['\n  100% {\n    transform: rotate(360deg)\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  10%, 90% {\n    transform: translate3d(-1px, 0, 0);\n  }\n\n  20%, 80% {\n    transform: translate3d(2px, 0, 0);\n  }\n\n  30%, 50%, 70% {\n    transform: translate3d(-4px, 0, 0);\n  }\n\n  40%, 60% {\n    transform: translate3d(4px, 0, 0);\n  }\n'], ['\n  10%, 90% {\n    transform: translate3d(-1px, 0, 0);\n  }\n\n  20%, 80% {\n    transform: translate3d(2px, 0, 0);\n  }\n\n  30%, 50%, 70% {\n    transform: translate3d(-4px, 0, 0);\n  }\n\n  40%, 60% {\n    transform: translate3d(4px, 0, 0);\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  0% {\n    transform: scale(.75);\n  }\n\n  20% {\n    transform: scale(1);\n  }\n\n  40% {\n    transform: scale(.75);\n  }\n\n  60% {\n    transform: scale(1);\n  }\n\n  80% {\n    transform: scale(.75);\n  }\n\n  100% {\n    transform: scale(.75);\n  }\n'], ['\n  0% {\n    transform: scale(.75);\n  }\n\n  20% {\n    transform: scale(1);\n  }\n\n  40% {\n    transform: scale(.75);\n  }\n\n  60% {\n    transform: scale(1);\n  }\n\n  80% {\n    transform: scale(.75);\n  }\n\n  100% {\n    transform: scale(.75);\n  }\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  ', '\n'], ['\n  ', '\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n    animation: ', ' 2s linear infinite;\n  '], ['\n    animation: ', ' 2s linear infinite;\n  ']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var rotate = (0, _styledComponents.keyframes)(_templateObject);

var shake = (0, _styledComponents.keyframes)(_templateObject2);
var beat = (0, _styledComponents.keyframes)(_templateObject3);
exports.default = _styledComponents2.default.svg(_templateObject4, function (props) {
  return props.rotate && (0, _styledComponents.css)(_templateObject5, rotate);
});
module.exports = exports['default'];
//# sourceMappingURL=Ionicon.js.map
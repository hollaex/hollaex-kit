Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = registerCSSInterfaceNamespace;

var _globalCache = require('global-cache');

var _globalCache2 = _interopRequireDefault(_globalCache);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Register a namespace to use for constructing unique class names.
 *
 * CSSInterfaceNamespace {String} The namespace to be used. e.g. Name of the project
 */
function registerCSSInterfaceNamespace(CSSInterfaceNamespace) {
  var sharedState = _globalCache2['default'].get(_constants.GLOBAL_CACHE_KEY);
  if (!sharedState) {
    _globalCache2['default'].set(_constants.GLOBAL_CACHE_KEY, { namespace: CSSInterfaceNamespace });
  } else {
    sharedState.namespace = CSSInterfaceNamespace;
  }
}
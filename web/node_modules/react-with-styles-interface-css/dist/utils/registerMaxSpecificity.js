Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = registerMaxSpecificity;

var _globalCache = require('global-cache');

var _globalCache2 = _interopRequireDefault(_globalCache);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Register max specificity for generating CSS
 *
 * maxSpecificity {Integer} max specificity to use for generating stylesheets,
 *   ie how many _N classes get generated
 */
function registerMaxSpecificity(maxSpecificity) {
  var sharedState = _globalCache2['default'].get(_constants.GLOBAL_CACHE_KEY);
  if (!sharedState) {
    _globalCache2['default'].set(_constants.GLOBAL_CACHE_KEY, { maxSpecificity: maxSpecificity });
  } else {
    sharedState.maxSpecificity = maxSpecificity;
  }
}
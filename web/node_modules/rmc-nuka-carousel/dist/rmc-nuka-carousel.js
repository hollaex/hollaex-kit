(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["rmc-nuka-carousel"] = factory(require("react"));
	else
		root["rmc-nuka-carousel"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_45__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 95);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(10)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(9);
var IE8_DOM_DEFINE = __webpack_require__(37);
var toPrimitive = __webpack_require__(26);
var dP = Object.defineProperty;

exports.f = __webpack_require__(2) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(1);
var ctx = __webpack_require__(35);
var hide = __webpack_require__(6);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4);
var createDesc = __webpack_require__(14);
module.exports = __webpack_require__(2) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(38);
var defined = __webpack_require__(16);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(24)('wks');
var uid = __webpack_require__(15);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(42);
var enumBugKeys = __webpack_require__(17);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(9);
var dPs = __webpack_require__(72);
var enumBugKeys = __webpack_require__(17);
var IE_PROTO = __webpack_require__(23)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(36)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(66).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(4).f;
var has = __webpack_require__(3);
var TAG = __webpack_require__(8)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(24)('keys');
var uid = __webpack_require__(15);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(11);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(1);
var LIBRARY = __webpack_require__(19);
var wksExt = __webpack_require__(28);
var defineProperty = __webpack_require__(4).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(8);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(51);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(52);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(50);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(33);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(33);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(54);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(53);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(62);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(11);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(2) && !__webpack_require__(10)(function () {
  return Object.defineProperty(__webpack_require__(36)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(34);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(19);
var $export = __webpack_require__(5);
var redefine = __webpack_require__(43);
var hide = __webpack_require__(6);
var has = __webpack_require__(3);
var Iterators = __webpack_require__(18);
var $iterCreate = __webpack_require__(68);
var setToStringTag = __webpack_require__(22);
var getPrototypeOf = __webpack_require__(74);
var ITERATOR = __webpack_require__(8)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(13);
var createDesc = __webpack_require__(14);
var toIObject = __webpack_require__(7);
var toPrimitive = __webpack_require__(26);
var has = __webpack_require__(3);
var IE8_DOM_DEFINE = __webpack_require__(37);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(2) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(42);
var hiddenKeys = __webpack_require__(17).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(3);
var toIObject = __webpack_require__(7);
var arrayIndexOf = __webpack_require__(64)(false);
var IE_PROTO = __webpack_require__(23)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(16);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_45__;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Carousel = __webpack_require__(47);

module.exports = Carousel;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = __webpack_require__(55);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(29);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(30);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(32);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(31);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

var _decorators = __webpack_require__(48);

var _decorators2 = _interopRequireDefault(_decorators);

var _exenv = __webpack_require__(90);

var _exenv2 = _interopRequireDefault(_exenv);

var _raf = __webpack_require__(93);

var _raf2 = _interopRequireDefault(_raf);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}

// from https://github.com/chenglou/tween-functions
function easeOutCirc(t, b, _c, d) {
    var c = _c - b;
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}
function linear(t, b, _c, d) {
    var c = _c - b;
    return c * t / d + b;
}
var DEFAULT_STACK_BEHAVIOR = 'ADDITIVE';
var DEFAULT_DURATION = 300;
var DEFAULT_DELAY = 0;
var stackBehavior = {
    ADDITIVE: 'ADDITIVE',
    DESTRUCTIVE: 'DESTRUCTIVE'
};
var addEvent = function addEvent(elem, type, eventHandle) {
    if (elem === null || typeof elem === 'undefined') {
        return;
    }
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = eventHandle;
    }
};
var removeEvent = function removeEvent(elem, type, eventHandle) {
    if (elem === null || typeof elem === 'undefined') {
        return;
    }
    if (elem.removeEventListener) {
        elem.removeEventListener(type, eventHandle, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = null;
    }
};

var Carousel = function (_React$Component) {
    (0, _inherits3['default'])(Carousel, _React$Component);

    function Carousel(props) {
        (0, _classCallCheck3['default'])(this, Carousel);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

        _this._rafCb = function () {
            var state = _this.state;
            if (state.tweenQueue.length === 0) {
                return;
            }
            var now = Date.now();
            var newTweenQueue = [];
            for (var i = 0; i < state.tweenQueue.length; i++) {
                var item = state.tweenQueue[i];
                var initTime = item.initTime,
                    config = item.config;

                if (now - initTime < config.duration) {
                    newTweenQueue.push(item);
                } else {
                    if (config.onEnd) {
                        config.onEnd();
                    }
                }
            }
            // onEnd might trigger a parent callback that removes this component
            // -1 means we've canceled it in componentWillUnmount
            if (_this._rafID === -1) {
                return;
            }
            _this.setState({
                tweenQueue: newTweenQueue
            });
            _this._rafID = (0, _raf2['default'])(_this._rafCb);
        };
        _this.handleClick = function (e) {
            if (_this.clickSafe === true) {
                e.preventDefault();
                e.stopPropagation();
                if (e.nativeEvent) {
                    e.nativeEvent.stopPropagation();
                }
            }
        };
        _this.autoplayIterator = function () {
            if (_this.props.wrapAround) {
                return _this.nextSlide();
            }
            if (_this.state.currentSlide !== _this.state.slideCount - _this.state.slidesToShow) {
                _this.nextSlide();
            } else {
                _this.stopAutoplay();
            }
        };
        // Action Methods
        _this.goToSlide = function (index) {
            var _this$props = _this.props,
                beforeSlide = _this$props.beforeSlide,
                afterSlide = _this$props.afterSlide;

            if (index >= _react2['default'].Children.count(_this.props.children) || index < 0) {
                if (!_this.props.wrapAround) {
                    return;
                }
                ;
                if (index >= _react2['default'].Children.count(_this.props.children)) {
                    beforeSlide(_this.state.currentSlide, 0);
                    return _this.setState({
                        currentSlide: 0
                    }, function () {
                        _this.animateSlide(null, null, _this.getTargetLeft(null, index), function () {
                            _this.animateSlide(null, 0.01);
                            afterSlide(0);
                            _this.resetAutoplay();
                            _this.setExternalData();
                        });
                    });
                } else {
                    var endSlide = _react2['default'].Children.count(_this.props.children) - _this.state.slidesToScroll;
                    beforeSlide(_this.state.currentSlide, endSlide);
                    return _this.setState({
                        currentSlide: endSlide
                    }, function () {
                        _this.animateSlide(null, null, _this.getTargetLeft(null, index), function () {
                            _this.animateSlide(null, 0.01);
                            afterSlide(endSlide);
                            _this.resetAutoplay();
                            _this.setExternalData();
                        });
                    });
                }
            }
            beforeSlide(_this.state.currentSlide, index);
            _this.setState({
                currentSlide: index
            }, function () {
                _this.animateSlide();
                _this.props.afterSlide(index);
                _this.resetAutoplay();
                _this.setExternalData();
            });
        };
        _this.nextSlide = function () {
            var childrenCount = _react2['default'].Children.count(_this.props.children);
            var slidesToShow = _this.props.slidesToShow;
            if (_this.props.slidesToScroll === 'auto') {
                slidesToShow = _this.state.slidesToScroll;
            }
            if (_this.state.currentSlide >= childrenCount - slidesToShow && !_this.props.wrapAround) {
                return;
            }
            if (_this.props.wrapAround) {
                _this.goToSlide(_this.state.currentSlide + _this.state.slidesToScroll);
            } else {
                if (_this.props.slideWidth !== 1) {
                    return _this.goToSlide(_this.state.currentSlide + _this.state.slidesToScroll);
                }
                _this.goToSlide(Math.min(_this.state.currentSlide + _this.state.slidesToScroll, childrenCount - slidesToShow));
            }
        };
        _this.previousSlide = function () {
            if (_this.state.currentSlide <= 0 && !_this.props.wrapAround) {
                return;
            }
            if (_this.props.wrapAround) {
                _this.goToSlide(_this.state.currentSlide - _this.state.slidesToScroll);
            } else {
                _this.goToSlide(Math.max(0, _this.state.currentSlide - _this.state.slidesToScroll));
            }
        };
        _this.onResize = function () {
            _this.setDimensions();
        };
        _this.onReadyStateChange = function () {
            _this.setDimensions();
        };
        _this.state = {
            currentSlide: _this.props.slideIndex,
            dragging: false,
            frameWidth: 0,
            left: 0,
            slideCount: 0,
            slidesToScroll: _this.props.slidesToScroll,
            slideWidth: 0,
            top: 0,
            tweenQueue: []
        };
        _this.touchObject = {};
        _this.clickSafe = true;
        return _this;
    }

    (0, _createClass3['default'])(Carousel, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setInitialDimensions();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setDimensions();
            this.bindEvents();
            this.setExternalData();
            if (this.props.autoplay) {
                this.startAutoplay();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({
                slideCount: nextProps.children.length
            });
            this.setDimensions(nextProps);
            if (this.props.slideIndex !== nextProps.slideIndex && nextProps.slideIndex !== this.state.currentSlide) {
                this.goToSlide(nextProps.slideIndex);
            }
            if (this.props.autoplay !== nextProps.autoplay) {
                if (nextProps.autoplay) {
                    this.startAutoplay();
                } else {
                    this.stopAutoplay();
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.unbindEvents();
            this.stopAutoplay();
            _raf2['default'].cancel(this._rafID);
            this._rafID = -1;
        }
        // react-tween-state

    }, {
        key: 'tweenState',
        value: function tweenState(path, _ref) {
            var _this2 = this;

            var easing = _ref.easing,
                duration = _ref.duration,
                delay = _ref.delay,
                beginValue = _ref.beginValue,
                endValue = _ref.endValue,
                onEnd = _ref.onEnd,
                configSB = _ref.stackBehavior;

            this.setState(function (state) {
                var cursor = state;
                var stateName = void 0;
                // see comment below on pash hash
                var pathHash = void 0;
                if (typeof path === 'string') {
                    stateName = path;
                    pathHash = path;
                } else {
                    for (var i = 0; i < path.length - 1; i++) {
                        cursor = cursor[path[i]];
                    }
                    stateName = path[path.length - 1];
                    pathHash = path.join('|');
                }
                // see the reasoning for these defaults at the top of file
                var newConfig = {
                    easing: easing,
                    duration: duration == null ? DEFAULT_DURATION : duration,
                    delay: delay == null ? DEFAULT_DELAY : delay,
                    beginValue: beginValue == null ? cursor[stateName] : beginValue,
                    endValue: endValue,
                    onEnd: onEnd,
                    stackBehavior: configSB || DEFAULT_STACK_BEHAVIOR
                };
                var newTweenQueue = state.tweenQueue;
                if (newConfig.stackBehavior === stackBehavior.DESTRUCTIVE) {
                    newTweenQueue = state.tweenQueue.filter(function (item) {
                        return item.pathHash !== pathHash;
                    });
                }
                // we store path hash, so that during value retrieval we can use hash
                // comparison to find the path. See the kind of shitty thing you have to
                // do when you don't have value comparison for collections?
                newTweenQueue.push({
                    pathHash: pathHash,
                    config: newConfig,
                    initTime: Date.now() + newConfig.delay
                });
                // sorry for mutating. For perf reasons we don't want to deep clone.
                // guys, can we please all start using persistent collections so that
                // we can stop worrying about nonesense like this
                cursor[stateName] = newConfig.endValue;
                if (newTweenQueue.length === 1) {
                    _this2._rafID = (0, _raf2['default'])(_this2._rafCb);
                }
                // this will also include the above mutated update
                return { tweenQueue: newTweenQueue };
            });
        }
    }, {
        key: 'getTweeningValue',
        value: function getTweeningValue(path) {
            var state = this.state;
            var tweeningValue = void 0;
            var pathHash = void 0;
            if (typeof path === 'string') {
                tweeningValue = state[path];
                pathHash = path;
            } else {
                tweeningValue = state;
                for (var i = 0; i < path.length; i++) {
                    tweeningValue = tweeningValue[path[i]];
                }
                pathHash = path.join('|');
            }
            var now = Date.now();
            for (var _i = 0; _i < state.tweenQueue.length; _i++) {
                var _state$tweenQueue$_i = state.tweenQueue[_i],
                    itemPathHash = _state$tweenQueue$_i.pathHash,
                    initTime = _state$tweenQueue$_i.initTime,
                    config = _state$tweenQueue$_i.config;

                if (itemPathHash !== pathHash) {
                    continue;
                }
                var progressTime = now - initTime > config.duration ? config.duration : Math.max(0, now - initTime);
                // `now - initTime` can be negative if initTime is scheduled in the
                // future by a delay. In this case we take 0
                // if duration is 0, consider that as jumping to endValue directly. This
                // is needed because the easing functino might have undefined behavior for
                // duration = 0
                var easeValue = config.duration === 0 ? config.endValue : config.easing(progressTime, config.beginValue, config.endValue, config.duration);
                var contrib = easeValue - config.endValue;
                tweeningValue += contrib;
            }
            return tweeningValue;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var children = _react2['default'].Children.count(this.props.children) > 1 ? this.formatChildren(this.props.children) : this.props.children;
            return _react2['default'].createElement('div', { className: ['slider', this.props.className || ''].join(' '), ref: 'slider', style: (0, _extends3['default'])({}, this.getSliderStyles(), this.props.style) }, _react2['default'].createElement('div', (0, _extends3['default'])({ className: 'slider-frame', ref: 'frame', style: this.getFrameStyles() }, this.getTouchEvents(), this.getMouseEvents(), { onClick: this.handleClick }), _react2['default'].createElement('ul', { className: 'slider-list', ref: 'list', style: this.getListStyles() }, children)), this.props.decorators ? this.props.decorators.map(function (Decorator, index) {
                return _react2['default'].createElement('div', { style: (0, _extends3['default'])({}, _this3.getDecoratorStyles(Decorator.position), Decorator.style || {}), className: 'slider-decorator-' + index, key: index }, _react2['default'].createElement(Decorator.component, { currentSlide: _this3.state.currentSlide, slideCount: _this3.state.slideCount, frameWidth: _this3.state.frameWidth, slideWidth: _this3.state.slideWidth, slidesToScroll: _this3.state.slidesToScroll, cellSpacing: _this3.props.cellSpacing, slidesToShow: _this3.props.slidesToShow, wrapAround: _this3.props.wrapAround, nextSlide: _this3.nextSlide, previousSlide: _this3.previousSlide, goToSlide: _this3.goToSlide }));
            }) : null, _react2['default'].createElement('style', { type: 'text/css', dangerouslySetInnerHTML: { __html: this.getStyleTagStyles() } }));
        }
        // Touch Events

    }, {
        key: 'getTouchEvents',
        value: function getTouchEvents() {
            var self = this;
            if (this.props.swiping === false) {
                return null;
            }
            return {
                onTouchStart: function onTouchStart(e) {
                    self.touchObject = {
                        startX: e.touches[0].pageX,
                        startY: e.touches[0].pageY
                    };
                    self.handleMouseOver();
                },
                onTouchMove: function onTouchMove(e) {
                    var direction = self.swipeDirection(self.touchObject.startX, e.touches[0].pageX, self.touchObject.startY, e.touches[0].pageY);
                    if (direction !== 0) {
                        e.preventDefault();
                    }
                    var length = self.props.vertical ? Math.round(Math.sqrt(Math.pow(e.touches[0].pageY - self.touchObject.startY, 2))) : Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - self.touchObject.startX, 2)));
                    self.touchObject = {
                        startX: self.touchObject.startX,
                        startY: self.touchObject.startY,
                        endX: e.touches[0].pageX,
                        endY: e.touches[0].pageY,
                        length: length,
                        direction: direction
                    };
                    self.setState({
                        left: self.props.vertical ? 0 : self.getTargetLeft(self.touchObject.length * self.touchObject.direction),
                        top: self.props.vertical ? self.getTargetLeft(self.touchObject.length * self.touchObject.direction) : 0
                    });
                },
                onTouchEnd: function onTouchEnd(e) {
                    self.handleSwipe(e);
                    self.handleMouseOut();
                },
                onTouchCancel: function onTouchCancel(e) {
                    self.handleSwipe(e);
                }
            };
        }
    }, {
        key: 'getMouseEvents',
        value: function getMouseEvents() {
            var self = this;
            if (this.props.dragging === false) {
                return null;
            }
            return {
                onMouseOver: function onMouseOver() {
                    self.handleMouseOver();
                },
                onMouseOut: function onMouseOut() {
                    self.handleMouseOut();
                },
                onMouseDown: function onMouseDown(e) {
                    self.touchObject = {
                        startX: e.clientX,
                        startY: e.clientY
                    };
                    self.setState({
                        dragging: true
                    });
                },
                onMouseMove: function onMouseMove(e) {
                    if (!self.state.dragging) {
                        return;
                    }
                    var direction = self.swipeDirection(self.touchObject.startX, e.clientX, self.touchObject.startY, e.clientY);
                    if (direction !== 0) {
                        e.preventDefault();
                    }
                    var length = self.props.vertical ? Math.round(Math.sqrt(Math.pow(e.clientY - self.touchObject.startY, 2))) : Math.round(Math.sqrt(Math.pow(e.clientX - self.touchObject.startX, 2)));
                    self.touchObject = {
                        startX: self.touchObject.startX,
                        startY: self.touchObject.startY,
                        endX: e.clientX,
                        endY: e.clientY,
                        length: length,
                        direction: direction
                    };
                    self.setState({
                        left: self.props.vertical ? 0 : self.getTargetLeft(self.touchObject.length * self.touchObject.direction),
                        top: self.props.vertical ? self.getTargetLeft(self.touchObject.length * self.touchObject.direction) : 0
                    });
                },
                onMouseUp: function onMouseUp(e) {
                    if (!self.state.dragging) {
                        return;
                    }
                    self.handleSwipe(e);
                },
                onMouseLeave: function onMouseLeave(e) {
                    if (!self.state.dragging) {
                        return;
                    }
                    self.handleSwipe(e);
                }
            };
        }
    }, {
        key: 'handleMouseOver',
        value: function handleMouseOver() {
            if (this.props.autoplay) {
                this.autoplayPaused = true;
                this.stopAutoplay();
            }
        }
    }, {
        key: 'handleMouseOut',
        value: function handleMouseOut() {
            if (this.props.autoplay && this.autoplayPaused) {
                this.startAutoplay();
                this.autoplayPaused = null;
            }
        }
    }, {
        key: 'handleSwipe',
        value: function handleSwipe(_) {
            if (typeof this.touchObject.length !== 'undefined' && this.touchObject.length > 44) {
                this.clickSafe = true;
            } else {
                this.clickSafe = false;
            }
            var _props = this.props,
                slidesToShow = _props.slidesToShow,
                slidesToScroll = _props.slidesToScroll,
                swipeSpeed = _props.swipeSpeed;
            // var slidesToShow = this.props.slidesToShow;

            if (slidesToScroll === 'auto') {
                slidesToShow = this.state.slidesToScroll;
            }
            if (_react2['default'].Children.count(this.props.children) > 1 && this.touchObject.length > this.state.slideWidth / slidesToShow / swipeSpeed) {
                if (this.touchObject.direction === 1) {
                    if (this.state.currentSlide >= _react2['default'].Children.count(this.props.children) - slidesToShow && !this.props.wrapAround) {
                        this.animateSlide(this.props.edgeEasing);
                    } else {
                        this.nextSlide();
                    }
                } else if (this.touchObject.direction === -1) {
                    if (this.state.currentSlide <= 0 && !this.props.wrapAround) {
                        this.animateSlide(this.props.edgeEasing);
                    } else {
                        this.previousSlide();
                    }
                }
            } else {
                this.goToSlide(this.state.currentSlide);
            }
            this.touchObject = {};
            this.setState({
                dragging: false
            });
        }
    }, {
        key: 'swipeDirection',
        value: function swipeDirection(x1, x2, y1, y2) {
            var xDist = x1 - x2;
            var yDist = y1 - y2;
            var r = Math.atan2(yDist, xDist);
            var swipeAngle = Math.round(r * 180 / Math.PI);
            if (swipeAngle < 0) {
                swipeAngle = 360 - Math.abs(swipeAngle);
            }
            if (swipeAngle <= 45 && swipeAngle >= 0) {
                return 1;
            }
            if (swipeAngle <= 360 && swipeAngle >= 315) {
                return 1;
            }
            if (swipeAngle >= 135 && swipeAngle <= 225) {
                return -1;
            }
            if (this.props.vertical === true) {
                if (swipeAngle >= 35 && swipeAngle <= 135) {
                    return 1;
                } else {
                    return -1;
                }
            }
            return 0;
        }
    }, {
        key: 'startAutoplay',
        value: function startAutoplay() {
            if (_react2['default'].Children.count(this.props.children) <= 1) {
                return;
            }
            this.autoplayID = setInterval(this.autoplayIterator, this.props.autoplayInterval);
        }
    }, {
        key: 'resetAutoplay',
        value: function resetAutoplay() {
            if (this.props.resetAutoplay && this.props.autoplay && !this.autoplayPaused) {
                this.stopAutoplay();
                this.startAutoplay();
            }
        }
    }, {
        key: 'stopAutoplay',
        value: function stopAutoplay() {
            if (this.autoplayID) {
                clearInterval(this.autoplayID);
            }
        }
        // Animation

    }, {
        key: 'animateSlide',
        value: function animateSlide(easing, duration, endValue, callback) {
            this.tweenState(this.props.vertical ? 'top' : 'left', {
                easing: easing || this.props.easing,
                duration: duration || this.props.speed,
                endValue: endValue || this.getTargetLeft(),
                delay: null,
                beginValue: null,
                onEnd: callback || null,
                stackBehavior: stackBehavior
            });
        }
    }, {
        key: 'getTargetLeft',
        value: function getTargetLeft(touchOffset, slide) {
            var offset = void 0;
            var target = slide || this.state.currentSlide;
            var cellSpacing = this.props.cellSpacing;
            switch (this.props.cellAlign) {
                case 'left':
                    {
                        offset = 0;
                        offset -= cellSpacing * target;
                        break;
                    }
                case 'center':
                    {
                        offset = (this.state.frameWidth - this.state.slideWidth) / 2;
                        offset -= cellSpacing * target;
                        break;
                    }
                case 'right':
                    {
                        offset = this.state.frameWidth - this.state.slideWidth;
                        offset -= cellSpacing * target;
                        break;
                    }
                default:
                    break;
            }
            var left = this.state.slideWidth * target;
            var lastSlide = this.state.currentSlide > 0 && target + this.state.slidesToScroll >= this.state.slideCount;
            if (lastSlide && this.props.slideWidth !== 1 && !this.props.wrapAround && this.props.slidesToScroll === 'auto') {
                left = this.state.slideWidth * this.state.slideCount - this.state.frameWidth;
                offset = 0;
                offset -= cellSpacing * (this.state.slideCount - 1);
            }
            offset -= touchOffset || 0;
            return (left - offset) * -1;
        }
        // Bootstrapping

    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            if (_exenv2['default'].canUseDOM) {
                addEvent(window, 'resize', this.onResize);
                addEvent(document, 'readystatechange', this.onReadyStateChange);
            }
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            if (_exenv2['default'].canUseDOM) {
                removeEvent(window, 'resize', this.onResize);
                removeEvent(document, 'readystatechange', this.onReadyStateChange);
            }
        }
    }, {
        key: 'formatChildren',
        value: function formatChildren(children) {
            var _this4 = this;

            var positionValue = this.props.vertical ? this.getTweeningValue('top') : this.getTweeningValue('left');
            return _react2['default'].Children.map(children, function (child, index) {
                return _react2['default'].createElement('li', { className: 'slider-slide', style: _this4.getSlideStyles(index, positionValue), key: index }, child);
            });
        }
    }, {
        key: 'setInitialDimensions',
        value: function setInitialDimensions() {
            var _this5 = this;

            var _props2 = this.props,
                vertical = _props2.vertical,
                initialSlideHeight = _props2.initialSlideHeight,
                initialSlideWidth = _props2.initialSlideWidth,
                slidesToShow = _props2.slidesToShow,
                cellSpacing = _props2.cellSpacing,
                children = _props2.children;

            var slideWidth = vertical ? initialSlideHeight || 0 : initialSlideWidth || 0;
            var slideHeight = initialSlideHeight ? initialSlideHeight * slidesToShow : 0;
            var frameHeight = slideHeight + cellSpacing * (slidesToShow - 1);
            this.setState({
                slideHeight: slideHeight,
                frameWidth: vertical ? frameHeight : '100%',
                slideCount: _react2['default'].Children.count(children),
                slideWidth: slideWidth
            }, function () {
                _this5.setLeft();
                _this5.setExternalData();
            });
        }
    }, {
        key: 'setDimensions',
        value: function setDimensions(props) {
            var _this6 = this;

            props = props || this.props;
            var frameWidth = void 0;
            var frameHeight = void 0;
            var slideHeight = void 0;
            var slideWidth = void 0;
            var slidesToScroll = props.slidesToScroll;
            var frame = this.refs.frame;
            var firstSlide = frame.childNodes[0].childNodes[0];
            if (firstSlide) {
                firstSlide.style.height = 'auto';
                slideHeight = this.props.vertical ? firstSlide.offsetHeight * props.slidesToShow : firstSlide.offsetHeight;
            } else {
                slideHeight = 100;
            }
            if (typeof props.slideWidth !== 'number') {
                slideWidth = parseInt(props.slideWidth, 10);
            } else {
                if (props.vertical) {
                    slideWidth = slideHeight / props.slidesToShow * props.slideWidth;
                } else {
                    slideWidth = frame.offsetWidth / props.slidesToShow * props.slideWidth;
                }
            }
            if (!props.vertical) {
                slideWidth -= props.cellSpacing * ((100 - 100 / props.slidesToShow) / 100);
            }
            frameHeight = slideHeight + props.cellSpacing * (props.slidesToShow - 1);
            frameWidth = props.vertical ? frameHeight : frame.offsetWidth;
            if (props.slidesToScroll === 'auto') {
                slidesToScroll = Math.floor(frameWidth / (slideWidth + props.cellSpacing));
            }
            this.setState({
                slideHeight: slideHeight,
                frameWidth: frameWidth,
                slideWidth: slideWidth,
                slidesToScroll: slidesToScroll,
                left: props.vertical ? 0 : this.getTargetLeft(),
                top: props.vertical ? this.getTargetLeft() : 0
            }, function () {
                _this6.setLeft();
            });
        }
    }, {
        key: 'setLeft',
        value: function setLeft() {
            this.setState({
                left: this.props.vertical ? 0 : this.getTargetLeft(),
                top: this.props.vertical ? this.getTargetLeft() : 0
            });
        }
        // Data

    }, {
        key: 'setExternalData',
        value: function setExternalData() {
            if (this.props.data) {
                this.props.data();
            }
        }
        // Styles

    }, {
        key: 'getListStyles',
        value: function getListStyles() {
            var listWidth = this.state.slideWidth * _react2['default'].Children.count(this.props.children);
            var cellSpacing = this.props.cellSpacing;
            var spacingOffset = cellSpacing * _react2['default'].Children.count(this.props.children);
            var transform = 'translate3d(' + this.getTweeningValue('left') + 'px, ' + this.getTweeningValue('top') + 'px, 0)';
            return {
                transform: transform,
                WebkitTransform: transform,
                msTransform: 'translate(' + this.getTweeningValue('left') + 'px, ' + this.getTweeningValue('top') + 'px)',
                position: 'relative',
                display: 'block',
                margin: this.props.vertical ? cellSpacing / 2 * -1 + 'px 0px' : '0px ' + cellSpacing / 2 * -1 + 'px',
                padding: 0,
                height: this.props.vertical ? listWidth + spacingOffset : this.state.slideHeight,
                width: this.props.vertical ? 'auto' : listWidth + spacingOffset,
                cursor: this.state.dragging === true ? 'pointer' : 'inherit',
                boxSizing: 'border-box',
                MozBoxSizing: 'border-box'
            };
        }
    }, {
        key: 'getFrameStyles',
        value: function getFrameStyles() {
            return {
                position: 'relative',
                display: 'block',
                overflow: this.props.frameOverflow,
                height: this.props.vertical ? this.state.frameWidth || 'initial' : 'auto',
                margin: this.props.framePadding,
                padding: 0,
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                msTransform: 'translate(0, 0)',
                boxSizing: 'border-box',
                MozBoxSizing: 'border-box'
            };
        }
    }, {
        key: 'getSlideStyles',
        value: function getSlideStyles(index, positionValue) {
            var targetPosition = this.getSlideTargetPosition(index, positionValue);
            var cellSpacing = this.props.cellSpacing;
            return {
                position: 'absolute',
                left: this.props.vertical ? 0 : targetPosition,
                top: this.props.vertical ? targetPosition : 0,
                display: this.props.vertical ? 'block' : 'inline-block',
                listStyleType: 'none',
                verticalAlign: 'top',
                width: this.props.vertical ? '100%' : this.state.slideWidth,
                height: 'auto',
                boxSizing: 'border-box',
                MozBoxSizing: 'border-box',
                marginLeft: this.props.vertical ? 'auto' : cellSpacing / 2,
                marginRight: this.props.vertical ? 'auto' : cellSpacing / 2,
                marginTop: this.props.vertical ? cellSpacing / 2 : 'auto',
                marginBottom: this.props.vertical ? cellSpacing / 2 : 'auto'
            };
        }
    }, {
        key: 'getSlideTargetPosition',
        value: function getSlideTargetPosition(index, positionValue) {
            var slidesToShow = this.state.frameWidth / this.state.slideWidth;
            var targetPosition = (this.state.slideWidth + this.props.cellSpacing) * index;
            var end = (this.state.slideWidth + this.props.cellSpacing) * slidesToShow * -1;
            if (this.props.wrapAround) {
                var slidesBefore = Math.ceil(positionValue / this.state.slideWidth);
                if (this.state.slideCount - slidesBefore <= index) {
                    return (this.state.slideWidth + this.props.cellSpacing) * (this.state.slideCount - index) * -1;
                }
                var slidesAfter = Math.ceil((Math.abs(positionValue) - Math.abs(end)) / this.state.slideWidth);
                if (this.state.slideWidth !== 1) {
                    slidesAfter = Math.ceil((Math.abs(positionValue) - this.state.slideWidth) / this.state.slideWidth);
                }
                if (index <= slidesAfter - 1) {
                    return (this.state.slideWidth + this.props.cellSpacing) * (this.state.slideCount + index);
                }
            }
            return targetPosition;
        }
    }, {
        key: 'getSliderStyles',
        value: function getSliderStyles() {
            return {
                position: 'relative',
                display: 'block',
                width: this.props.width,
                height: 'auto',
                boxSizing: 'border-box',
                MozBoxSizing: 'border-box',
                visibility: this.state.slideWidth ? 'visible' : 'hidden'
            };
        }
    }, {
        key: 'getStyleTagStyles',
        value: function getStyleTagStyles() {
            return '.slider-slide > img {width: 100%; display: block;}';
        }
    }, {
        key: 'getDecoratorStyles',
        value: function getDecoratorStyles(position) {
            switch (position) {
                case 'TopLeft':
                    {
                        return {
                            position: 'absolute',
                            top: 0,
                            left: 0
                        };
                    }
                case 'TopCenter':
                    {
                        return {
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            WebkitTransform: 'translateX(-50%)',
                            msTransform: 'translateX(-50%)'
                        };
                    }
                case 'TopRight':
                    {
                        return {
                            position: 'absolute',
                            top: 0,
                            right: 0
                        };
                    }
                case 'CenterLeft':
                    {
                        return {
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            transform: 'translateY(-50%)',
                            WebkitTransform: 'translateY(-50%)',
                            msTransform: 'translateY(-50%)'
                        };
                    }
                case 'CenterCenter':
                    {
                        return {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)',
                            WebkitTransform: 'translate(-50%, -50%)',
                            msTransform: 'translate(-50%, -50%)'
                        };
                    }
                case 'CenterRight':
                    {
                        return {
                            position: 'absolute',
                            top: '50%',
                            right: 0,
                            transform: 'translateY(-50%)',
                            WebkitTransform: 'translateY(-50%)',
                            msTransform: 'translateY(-50%)'
                        };
                    }
                case 'BottomLeft':
                    {
                        return {
                            position: 'absolute',
                            bottom: 0,
                            left: 0
                        };
                    }
                case 'BottomCenter':
                    {
                        return {
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            textAlign: 'center'
                        };
                    }
                case 'BottomRight':
                    {
                        return {
                            position: 'absolute',
                            bottom: 0,
                            right: 0
                        };
                    }
                default:
                    {
                        return {
                            position: 'absolute',
                            top: 0,
                            left: 0
                        };
                    }
            }
        }
    }]);
    return Carousel;
}(_react2['default'].Component);

Carousel.defaultProps = {
    afterSlide: function afterSlide() {},
    autoplay: false,
    resetAutoplay: true,
    swipeSpeed: 12,
    autoplayInterval: 3000,
    beforeSlide: function beforeSlide() {},
    cellAlign: 'left',
    cellSpacing: 0,
    data: function data() {},
    decorators: _decorators2['default'],
    dragging: true,
    easing: easeOutCirc,
    edgeEasing: linear,
    framePadding: '0px',
    frameOverflow: 'hidden',
    slideIndex: 0,
    slidesToScroll: 1,
    slidesToShow: 1,
    slideWidth: 1,
    speed: 500,
    swiping: true,
    vertical: false,
    width: '100%',
    wrapAround: false,
    style: {}
};
exports['default'] = Carousel;
module.exports = exports['default'];

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(29);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(30);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(32);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(31);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(45);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}

var DefaultDecorators = [{
    component: function (_React$Component) {
        (0, _inherits3['default'])(component, _React$Component);

        function component() {
            (0, _classCallCheck3['default'])(this, component);

            var _this = (0, _possibleConstructorReturn3['default'])(this, (component.__proto__ || Object.getPrototypeOf(component)).apply(this, arguments));

            _this.handleClick = function (e) {
                e.preventDefault();
                _this.props.previousSlide();
            };
            return _this;
        }

        (0, _createClass3['default'])(component, [{
            key: 'render',
            value: function render() {
                return _react2['default'].createElement('button', { style: this.getButtonStyles(this.props.currentSlide === 0 && !this.props.wrapAround), onClick: this.handleClick }, 'PREV');
            }
        }, {
            key: 'getButtonStyles',
            value: function getButtonStyles(disabled) {
                return {
                    border: 0,
                    background: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    padding: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer'
                };
            }
        }]);
        return component;
    }(_react2['default'].Component),
    position: 'CenterLeft'
}, {
    component: function (_React$Component2) {
        (0, _inherits3['default'])(component, _React$Component2);

        function component() {
            (0, _classCallCheck3['default'])(this, component);

            var _this2 = (0, _possibleConstructorReturn3['default'])(this, (component.__proto__ || Object.getPrototypeOf(component)).apply(this, arguments));

            _this2.handleClick = function (e) {
                e.preventDefault();
                if (_this2.props.nextSlide) {
                    _this2.props.nextSlide();
                }
            };
            return _this2;
        }

        (0, _createClass3['default'])(component, [{
            key: 'render',
            value: function render() {
                return _react2['default'].createElement('button', { style: this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround), onClick: this.handleClick }, 'NEXT');
            }
        }, {
            key: 'getButtonStyles',
            value: function getButtonStyles(disabled) {
                return {
                    border: 0,
                    background: 'rgba(0,0,0,0.4)',
                    color: 'white',
                    padding: 10,
                    outline: 0,
                    opacity: disabled ? 0.3 : 1,
                    cursor: 'pointer'
                };
            }
        }]);
        return component;
    }(_react2['default'].Component),
    position: 'CenterRight'
}, {
    component: function (_React$Component3) {
        (0, _inherits3['default'])(component, _React$Component3);

        function component() {
            (0, _classCallCheck3['default'])(this, component);
            return (0, _possibleConstructorReturn3['default'])(this, (component.__proto__ || Object.getPrototypeOf(component)).apply(this, arguments));
        }

        (0, _createClass3['default'])(component, [{
            key: 'render',
            value: function render() {
                var _this4 = this;

                var indexes = this.getIndexes(this.props.slideCount, this.props.slidesToScroll);
                return _react2['default'].createElement('ul', { style: this.getListStyles() }, indexes.map(function (index) {
                    return _react2['default'].createElement('li', { style: _this4.getListItemStyles(), key: index }, _react2['default'].createElement('button', { style: _this4.getButtonStyles(_this4.props.currentSlide === index), onClick: _this4.props.goToSlide && _this4.props.goToSlide.bind(null, index) }, '\u2022'));
                }));
            }
        }, {
            key: 'getIndexes',
            value: function getIndexes(count, inc) {
                var arr = [];
                for (var i = 0; i < count; i += inc) {
                    arr.push(i);
                }
                return arr;
            }
        }, {
            key: 'getListStyles',
            value: function getListStyles() {
                return {
                    position: 'relative',
                    margin: 0,
                    top: -10,
                    padding: 0
                };
            }
        }, {
            key: 'getListItemStyles',
            value: function getListItemStyles() {
                return {
                    listStyleType: 'none',
                    display: 'inline-block'
                };
            }
        }, {
            key: 'getButtonStyles',
            value: function getButtonStyles(active) {
                return {
                    border: 0,
                    background: 'transparent',
                    color: 'black',
                    cursor: 'pointer',
                    padding: 10,
                    outline: 0,
                    fontSize: 24,
                    opacity: active ? 1 : 0.5
                };
            }
        }]);
        return component;
    }(_react2['default'].Component),
    position: 'BottomCenter'
}];
exports['default'] = DefaultDecorators;
module.exports = exports['default'];

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(56), __esModule: true };

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(58), __esModule: true };

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(59), __esModule: true };

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(61), __esModule: true };

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(49);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
module.exports = __webpack_require__(1).Object.assign;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(81);
var $Object = __webpack_require__(1).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(82);
var $Object = __webpack_require__(1).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(83);
module.exports = __webpack_require__(1).Object.setPrototypeOf;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(86);
__webpack_require__(84);
__webpack_require__(87);
__webpack_require__(88);
module.exports = __webpack_require__(1).Symbol;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(89);
module.exports = __webpack_require__(28).f('iterator');


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(7);
var toLength = __webpack_require__(78);
var toAbsoluteIndex = __webpack_require__(77);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(12);
var gOPS = __webpack_require__(21);
var pIE = __webpack_require__(13);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(0).document;
module.exports = document && document.documentElement;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(34);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(20);
var descriptor = __webpack_require__(14);
var setToStringTag = __webpack_require__(22);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(6)(IteratorPrototype, __webpack_require__(8)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(15)('meta');
var isObject = __webpack_require__(11);
var has = __webpack_require__(3);
var setDesc = __webpack_require__(4).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(10)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(12);
var gOPS = __webpack_require__(21);
var pIE = __webpack_require__(13);
var toObject = __webpack_require__(44);
var IObject = __webpack_require__(38);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(10)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4);
var anObject = __webpack_require__(9);
var getKeys = __webpack_require__(12);

module.exports = __webpack_require__(2) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(7);
var gOPN = __webpack_require__(41).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(3);
var toObject = __webpack_require__(44);
var IE_PROTO = __webpack_require__(23)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(11);
var anObject = __webpack_require__(9);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(35)(Function.call, __webpack_require__(40).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(25);
var defined = __webpack_require__(16);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(25);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(25);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(63);
var step = __webpack_require__(69);
var Iterators = __webpack_require__(18);
var toIObject = __webpack_require__(7);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(39)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(5);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(71) });


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(5);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(20) });


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(5);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(2), 'Object', { defineProperty: __webpack_require__(4).f });


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(5);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(75).set });


/***/ }),
/* 84 */
/***/ (function(module, exports) {



/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(76)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(39)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(0);
var has = __webpack_require__(3);
var DESCRIPTORS = __webpack_require__(2);
var $export = __webpack_require__(5);
var redefine = __webpack_require__(43);
var META = __webpack_require__(70).KEY;
var $fails = __webpack_require__(10);
var shared = __webpack_require__(24);
var setToStringTag = __webpack_require__(22);
var uid = __webpack_require__(15);
var wks = __webpack_require__(8);
var wksExt = __webpack_require__(28);
var wksDefine = __webpack_require__(27);
var enumKeys = __webpack_require__(65);
var isArray = __webpack_require__(67);
var anObject = __webpack_require__(9);
var toIObject = __webpack_require__(7);
var toPrimitive = __webpack_require__(26);
var createDesc = __webpack_require__(14);
var _create = __webpack_require__(20);
var gOPNExt = __webpack_require__(73);
var $GOPD = __webpack_require__(40);
var $DP = __webpack_require__(4);
var $keys = __webpack_require__(12);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(41).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(13).f = $propertyIsEnumerable;
  __webpack_require__(21).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(19)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(6)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('asyncIterator');


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27)('observable');


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(79);
var global = __webpack_require__(0);
var hide = __webpack_require__(6);
var Iterators = __webpack_require__(18);
var TO_STRING_TAG = __webpack_require__(8)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
/* global define */

(function () {
	'use strict';

	var canUseDOM = !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);

	var ExecutionEnvironment = {

		canUseDOM: canUseDOM,

		canUseWorkers: typeof Worker !== 'undefined',

		canUseEventListeners:
			canUseDOM && !!(window.addEventListener || window.attachEvent),

		canUseViewport: canUseDOM && !!window.screen

	};

	if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return ExecutionEnvironment;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = ExecutionEnvironment;
	} else {
		window.ExecutionEnvironment = ExecutionEnvironment;
	}

}());


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

//# sourceMappingURL=performance-now.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(92)))

/***/ }),
/* 92 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(91)
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(94)))

/***/ }),
/* 94 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(46);


/***/ })
/******/ ]);
});
//# sourceMappingURL=rmc-nuka-carousel.js.map
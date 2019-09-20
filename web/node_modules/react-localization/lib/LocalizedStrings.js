'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Simple module to localize the React interface using the same syntax
 * used in the ReactNativeLocalization module
 * (https://github.com/stefalda/ReactNativeLocalization)
 *
 * Originally developed by Stefano Falda (stefano.falda@gmail.com)
 *
 * It uses a call to the Navigator/Browser object to get the current interface language,
 * then display the correct language strings or the default language (the first
 * one if a match is not found).
 *
 * How to use:
 * Check the instructions at:
 * https://github.com/stefalda/react-localization
 */

var placeholderRegex = /(\{[\d|\w]+\})/;
var isReactComponent = function isReactComponent(value) {
    return _typeof(value.$$typeof) === 'symbol';
};

var LocalizedStrings = function () {
    _createClass(LocalizedStrings, [{
        key: '_getBestMatchingLanguage',
        value: function _getBestMatchingLanguage(language, props) {
            //If an object with the passed language key exists return it
            if (props[language]) return language;

            //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
            var idx = language.indexOf('-');
            var auxLang = idx >= 0 ? language.substring(0, idx) : language;
            return props[auxLang] ? auxLang : Object.keys(props)[0];
        }
    }]);

    function LocalizedStrings(props) {
        _classCallCheck(this, LocalizedStrings);

        this._interfaceLanguage = utils.getInterfaceLanguage();
        this._language = this._interfaceLanguage;
        this.setContent(props);
    }

    _createClass(LocalizedStrings, [{
        key: 'setContent',
        value: function setContent(props) {
            this._defaultLanguage = Object.keys(props)[0];
            this._defaultLanguageFirstLevelKeys = [];
            //Store locally the passed strings
            this._props = props;
            utils.validateTranslationKeys(Object.keys(props[this._defaultLanguage]));
            //Store first level keys (for identifying missing translations)
            for (var key in this._props[this._defaultLanguage]) {
                if (typeof this._props[this._defaultLanguage][key] == "string") {
                    this._defaultLanguageFirstLevelKeys.push(key);
                }
            }
            //Set language to its default value (the interface)
            this.setLanguage(this._interfaceLanguage);
        }

        //Can be used from ouside the class to force a particular language
        //indipendently from the interface one

    }, {
        key: 'setLanguage',
        value: function setLanguage(language) {
            //Check if exists a translation for the current language or if the default
            //should be used
            var bestLanguage = this._getBestMatchingLanguage(language, this._props);
            var defaultLanguage = Object.keys(this._props)[0];
            this._language = bestLanguage;
            //Associate the language object to the this object
            if (this._props[bestLanguage]) {
                //delete default propery values to identify missing translations
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this._defaultLanguageFirstLevelKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        key = _step.value;

                        delete this[key];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var localizedStrings = Object.assign({}, this._props[this._language]);
                for (var key in localizedStrings) {
                    if (localizedStrings.hasOwnProperty(key)) {
                        this[key] = localizedStrings[key];
                    }
                }
                //Now add any string missing from the translation but existing in the default language
                if (defaultLanguage !== this._language) {
                    localizedStrings = this._props[defaultLanguage];
                    this._fallbackValues(localizedStrings, this);
                }
            }
        }

        //Load fallback values for missing translations

    }, {
        key: '_fallbackValues',
        value: function _fallbackValues(defaultStrings, strings) {
            for (var key in defaultStrings) {
                if (defaultStrings.hasOwnProperty(key) && !strings[key]) {
                    strings[key] = defaultStrings[key];
                    console.log('\uD83D\uDEA7 \uD83D\uDC77 key \'' + key + '\' not found in localizedStrings for language ' + this._language + ' \uD83D\uDEA7');
                } else {
                    if (typeof strings[key] != "string") {
                        //It's an object
                        this._fallbackValues(defaultStrings[key], strings[key]);
                    }
                }
            }
        }

        //The current language displayed (could differ from the interface language
        // if it has been forced manually and a matching translation has been found)

    }, {
        key: 'getLanguage',
        value: function getLanguage() {
            return this._language;
        }

        //The current interface language (could differ from the language displayed)

    }, {
        key: 'getInterfaceLanguage',
        value: function getInterfaceLanguage() {
            return this._interfaceLanguage;
        }

        //Return an array containing the available languages passed as props in the constructor

    }, {
        key: 'getAvailableLanguages',
        value: function getAvailableLanguages() {
            if (!this._availableLanguages) {
                this._availableLanguages = [];
                for (var language in this._props) {
                    this._availableLanguages.push(language);
                }
            }
            return this._availableLanguages;
        }

        //Format the passed string replacing the numbered or tokenized placeholders
        //eg. 1: I'd like some {0} and {1}, or just {0}
        //eg. 2: I'd like some {bread} and {butter}, or just {bread}
        //Use example:
        //eg. 1: strings.formatString(strings.question, strings.bread, strings.butter)
        //eg. 2: strings.formatString(strings.question, { bread: strings.bread, butter: strings.butter })

    }, {
        key: 'formatString',
        value: function formatString(str) {
            for (var _len = arguments.length, valuesForPlaceholders = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                valuesForPlaceholders[_key - 1] = arguments[_key];
            }

            return str.split(placeholderRegex).filter(function (textPart) {
                return !!textPart;
            }).map(function (textPart, index) {
                if (textPart.match(placeholderRegex)) {
                    var matchedKey = textPart.slice(1, -1);
                    var valueForPlaceholder = valuesForPlaceholders[matchedKey];

                    // If no value found, check if working with an object instead
                    if (valueForPlaceholder == undefined) {
                        var valueFromObjectPlaceholder = valuesForPlaceholders[0][matchedKey];
                        if (valueFromObjectPlaceholder !== undefined) {
                            valueForPlaceholder = valueFromObjectPlaceholder;
                        } else {
                            // If value still isn't found, then it must have been undefined/null
                            return valueForPlaceholder;
                        }
                    }

                    if (isReactComponent(valueForPlaceholder)) {
                        return _react2.default.Children.toArray(valueForPlaceholder).map(function (component) {
                            return _extends({}, component, { key: index.toString() });
                        });
                    }

                    return valueForPlaceholder;
                }
                return textPart;
            });
        }

        //Return a string with the passed key in a different language

    }, {
        key: 'getString',
        value: function getString(key, language) {
            try {
                return this._props[language][key];
            } catch (ex) {
                console.log("No localization found for key " + key + " and language " + language);
            }
            return null;
        }
    }]);

    return LocalizedStrings;
}();

exports.default = LocalizedStrings;
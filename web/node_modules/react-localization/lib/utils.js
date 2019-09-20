'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterfaceLanguage = getInterfaceLanguage;
exports.validateTranslationKeys = validateTranslationKeys;
function getInterfaceLanguage() {
  var defaultLang = 'en-US';
  if (typeof navigator === "undefined") {
    return defaultLang;
  }
  if (!!navigator && !!navigator.language) {
    return navigator.language;
  } else if (!!navigator && !!navigator.languages && !!navigator.languages[0]) {
    return navigator.languages[0];
  } else if (!!navigator && !!navigator.userLanguage) {
    return navigator.userLanguage;
  } else if (!!navigator && !!navigator.browserLanguage) {
    return navigator.browserLanguage;
  }
  return defaultLang;
}

function validateTranslationKeys(translationKeys) {
  var reservedNames = ['_interfaceLanguage', '_language', '_defaultLanguage', '_defaultLanguageFirstLevelKeys', '_props'];
  translationKeys.forEach(function (key) {
    if (reservedNames.indexOf(key) !== -1) {
      throw new Error(key + ' cannot be used as a key. It is a reserved word.');
    }
  });
}
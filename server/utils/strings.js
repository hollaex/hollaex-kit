'use strict';
const toolsLib = require('hollaex-tools-lib');
const DEFAULT_LANGUAGE = () => toolsLib.getKitConfig().defaults.language;
const VALID_LANGUAGES = () => toolsLib.getKitConfig().valid_languages;

const getValidLanguage = (language = DEFAULT_LANGUAGE()) => {
	if (VALID_LANGUAGES().indexOf(language) > -1) {
		return language;
	}
	return DEFAULT_LANGUAGE();
};

module.exports = {
	getValidLanguage
};

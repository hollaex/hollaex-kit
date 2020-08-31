'use strict';
const { getKit } = require('../init');
const DEFAULT_LANGUAGE = () => getKit().defaults.language;
const VALID_LANGUAGES = () => getKit().valid_languages;

const getValidLanguage = (language = DEFAULT_LANGUAGE()) => {
	if (VALID_LANGUAGES().indexOf(language) > -1) {
		return language;
	}
	return DEFAULT_LANGUAGE();
};

module.exports = {
	getValidLanguage
};

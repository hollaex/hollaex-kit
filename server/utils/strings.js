'use strict';
const { getConfiguration } = require('../init');
const DEFAULT_LANGUAGE = () => getConfiguration().constants.defaults.language;
const VALID_LANGUAGES = () => getConfiguration().constants.valid_languages;

const getValidLanguage = (language = DEFAULT_LANGUAGE()) => {
	if (VALID_LANGUAGES().indexOf(language) > -1) {
		return language;
	}
	return DEFAULT_LANGUAGE();
};

module.exports = {
	getValidLanguage
};

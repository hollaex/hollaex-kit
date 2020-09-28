import moment from 'moment';

import { LANGUAGE_KEY, DEFAULT_LANGUAGE } from '../config/constants';
import STRINGS from '../config/localizedStrings';
import { getValidLanguages } from 'utils/initialize';
export { formatBtcAmount, formatBaseAmount, formatEthAmount } from './currency';

export const getFormattedDate = (value) => {
	const stringDate = (value ? new Date(value) : new Date()).toISOString();
	const stringDateSplit = stringDate.split('T', 1);
	return stringDateSplit[0];
};

export const getLanguageFromString = (value = '') => {
	const index = value.indexOf('-');
	if (index > 0) {
		return value.substring(0, index);
	}
	return value;
};

export const getLanguageFromLocal = () => localStorage.getItem(LANGUAGE_KEY);

export const getLanguage = () => {
	let language = localStorage.getItem(LANGUAGE_KEY);

	if (!language) {
		language = DEFAULT_LANGUAGE;
	}

	return language;
};

export const setLanguage = (languageParam = DEFAULT_LANGUAGE) => {
	const language = languageParam.toLowerCase();
	STRINGS.setLanguage(language);
	localStorage.setItem(LANGUAGE_KEY, language);
	moment.locale('en');
	return language;
};

export const removeLanguage = () => {
	localStorage.removeItem(LANGUAGE_KEY);
};

export const getInterfaceLanguage = () => STRINGS.getInterfaceLanguage();

const LANGUAGE_RTL = 'language_rtl';
const DIRECTION_RTL = 'direction_rtl';
const APPLY_RTL = 'apply_rtl';
const DIRECTION_LTR = 'direction_ltr';

export const RTL_CLASSES_ARRAY = [DIRECTION_RTL, APPLY_RTL];
export const RTL_CLASSES_OBJECT = {
	[LANGUAGE_RTL]: true,
	[DIRECTION_RTL]: true,
	[APPLY_RTL]: true
};

export const LTR_CLASSES_ARRAY = [DIRECTION_LTR];
export const LTR_CLASSES_OBJECT = {
	[DIRECTION_LTR]: true
};

export const getClasesForLanguage = (language = '', type = 'object') => {
	switch (language) {
		case 'fa':
		case 'ar':
			return type === 'object' ? RTL_CLASSES_OBJECT : RTL_CLASSES_ARRAY;
		default:
			return type === 'object' ? LTR_CLASSES_OBJECT : LTR_CLASSES_ARRAY;
	}
};

export const getFontClassForLanguage = (language = '') => {
	switch (language) {
		case 'fa':
		case 'ar':
			return LANGUAGE_RTL;
		default:
			return '';
	}
};

export const maskToken = (token = '') => {
	return token.substr(0, 5) + '**********' + token.substr(-5);
};

export const setContent = (content) => {
  STRINGS.setContent(content);
};

export const overwriteLocale = (key = DEFAULT_LANGUAGE, overwrites = {}) => {
	const content = STRINGS._props;

	const mergedContent = {
		...content,
		[key]: {
      ...(content[key] ? content[key] : {}),
      ...overwrites
		}
  }

  setContent(mergedContent)
}

export const getStringByKey = (key, lang = DEFAULT_LANGUAGE, content = STRINGS._props) => {

	if (!content[lang]) {
		return;
	}

	const string = content[lang][key];
  if (typeof string === 'string') {
		return string;
	}
}

export const getAllStrings = (validLanguages = getValidLanguages(), content = STRINGS._props) => {
	const allStrings = [];

  Object.entries(content['en']).forEach(([key]) => {
    const stringObject = { key };
		validLanguages.forEach((lang) => {
      stringObject[lang] = getStringByKey(key, lang, content)
		})
    allStrings.push(stringObject)
	})

	return allStrings.filter(({key}) => !EXCLUSIONS.includes(key));
}

const EXCLUSIONS = [
	"FOOTER.FOOTER_LEGAL",
	"LEGAL.PRIVACY_POLICY.TEXTS",
	"LEGAL.GENERAL_TERMS.TEXTS",
	"TYPES",
	"SIDES",
	"DEFAULT_TOGGLE_OPTIONS",
	"SETTINGS_LANGUAGE_OPTIONS",
	"SETTINGS_ORDERPOPUP_OPTIONS",
	"SETTINGS_THEME_OPTIONS",
];

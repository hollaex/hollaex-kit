import math from 'mathjs';
import numbro from 'numbro';
import moment from 'moment';

import { LANGUAGE_KEY } from '../config/constants';
import STRINGS from '../config/localizedStrings';

export const BTC_FORMAT = '0,0.[0000]';
export const FIAT_FORMAT = '0,0.[00]';

export const formatBtcAmount = (amount = 0) =>
	numbro(math.number(amount)).format(BTC_FORMAT);
export const formatFiatAmount = (amount = 0) =>
	numbro(math.number(amount)).format(FIAT_FORMAT);

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

const AVAILABLE_LENGUAGES = STRINGS.getAvailableLanguages().map(
	getLanguageFromString
);
const DEFAULT_LANGUAGE = 'fa';

export const getLanguage = () => {
	let language = localStorage.getItem(LANGUAGE_KEY);

	if (!language) {
		const interfaceLanguage = getLanguageFromString(getInterfaceLanguage());
		const indexOfInterfaceLanguage = AVAILABLE_LENGUAGES.indexOf(
			interfaceLanguage
		);
		const indexOfFa = AVAILABLE_LENGUAGES.indexOf(DEFAULT_LANGUAGE);
		if (indexOfInterfaceLanguage > -1) {
			language = AVAILABLE_LENGUAGES[indexOfInterfaceLanguage];
		} else if (indexOfFa > -1) {
			language = AVAILABLE_LENGUAGES[indexOfFa];
		} else {
			language = AVAILABLE_LENGUAGES[0];
		}
	}

	return language;
};

export const setLanguage = (language) => {
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
			return type === 'object' ? RTL_CLASSES_OBJECT : RTL_CLASSES_ARRAY;
		default:
			return type === 'object' ? LTR_CLASSES_OBJECT : LTR_CLASSES_ARRAY;
	}
};

export const getFontClassForLanguage = (language = '') => {
	switch (language) {
		case 'fa':
			return LANGUAGE_RTL;
		default:
			return '';
	}
};

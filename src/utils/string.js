import math from 'mathjs';
import numbro from 'numbro';

import { LANGUAGE_KEY } from '../config/constants';
import STRINGS from '../config/localizedStrings';

export const BTC_FORMAT = '0,0.[0000]';
export const FIAT_FORMAT = '0,0.[00]';

export const formatBtcAmount = (amount = 0) => numbro(math.number(amount)).format(BTC_FORMAT);
export const formatFiatAmount = (amount = 0) => numbro(math.number(amount)).format(FIAT_FORMAT);

export const getFormattedDate = (value) => {
	const stringDate = (value ? new Date(value) : new Date()).toISOString();
	const stringDateSplit = stringDate.split('T', 1);
	return stringDateSplit[0];
}

export const getLanguageFromString = (value = '') => {
  const index = value.indexOf('-');
  if (index > 0) {
    return value.substring(0, index);
  }
  return value;
}

const AVAILABLE_LENGUAGES = STRINGS.getAvailableLanguages().map(getLanguageFromString);

export const getLanguage = () => {
  const language = localStorage.getItem(LANGUAGE_KEY);

	if (!language) {
		return AVAILABLE_LENGUAGES[0];
	}
	return language;
}

export const setLanguage = (language) => {
	STRINGS.setLanguage(language);
  localStorage.setItem(LANGUAGE_KEY, language);
	return language;
}

export const removeLanguage = () => {
	localStorage.removeItem(LANGUAGE_KEY);
}

export const getInterfaceLanguage = () => STRINGS.getInterfaceLanguage();

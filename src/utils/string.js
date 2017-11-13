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


export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY);
}

export const setLanguage = (token) => {
  localStorage.setItem(LANGUAGE_KEY, token);
}

export const removeLanguage = () => {
	localStorage.removeItem(LANGUAGE_KEY);
}

export const getInterfaceLanguage = () => STRINGS.getInterfaceLanguage();

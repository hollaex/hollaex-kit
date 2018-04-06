import moment from 'moment';
import momentJ from 'moment-jalaali';

import {
	TOKEN_TIME,
	TIMESTAMP_FORMAT,
	TIMESTAMP_FORMAT_FA
} from '../config/constants';
import { getLanguage } from './string';

const bitcoin = {
	COIN: 100000000,
	PRECISION: 8,
	DUST: 2730,
	BASE_FEE: 10000
};

/**
 * convert a BTC value to Satoshi
 *
 * @param btc   float       BTC value
 * @returns int             Satoshi value (int)
 */
bitcoin.toSatoshi = (btc) => {
	return parseInt((btc * bitcoin.COIN).toFixed(0), 10);
};

/**
 * convert a Satoshi value to BTC
 *
 * @param satoshi   int     Satoshi value
 * @returns {string}        BTC value (float)
 */
bitcoin.toBTC = (satoshi) => {
	return (satoshi / bitcoin.COIN).toFixed(bitcoin.PRECISION);
};

export default bitcoin;

export const checkUserSessionExpired = (loginTime) => {
	const currentTime = Date.now();

	return currentTime - loginTime > TOKEN_TIME;
};

export const formatTimestamp = (date, format) => {
	if (getLanguage() === 'fa') {
		return formatTimestampFarsi(date, format);
	}
	return formatTimestampGregorian(date, format);
};

export const formatTimestampGregorian = (date, format = TIMESTAMP_FORMAT) =>
	moment(date).format(format);
export const formatTimestampFarsi = (date, format = TIMESTAMP_FORMAT_FA) =>
	momentJ(date).format(format);

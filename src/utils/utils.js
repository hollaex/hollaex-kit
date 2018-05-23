import moment from 'moment';

import { TOKEN_TIME, TIMESTAMP_FORMAT } from '../config/constants';

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
	return formatTimestampGregorian(date, format);
};

export const formatTimestampGregorian = (date, format = TIMESTAMP_FORMAT) =>
	moment(date).format(format);

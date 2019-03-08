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

export const getDecimals = (value = 0) =>
	value % 1 ? value.toString().split('.')[1].length : 0;

export const isBlockchainTx = (transactionId) => {
	return (transactionId.indexOf('-') === -1) ? true : false
}

export const constructSettings = (state = {}, settings) => {
	let settingsData = { ...state };
	if (settings.notification) {
		settingsData.notification = { ...settingsData.notification, ...settings.notification };
	}
	if (settings.popup_order_confirmation || settings.popup_order_confirmation === false) {
		settingsData.notification.popup_order_confirmation = settings.popup_order_confirmation;
	}
	if (settings.popup_order_completed || settings.popup_order_completed === false) {
		settingsData.notification.popup_order_completed = settings.popup_order_completed;
	}
	if (settings.popup_order_partially_filled || settings.popup_order_partially_filled === false) {
		settingsData.notification.popup_order_partially_filled = settings.popup_order_partially_filled;
	}
	if (settings.interface) {
		settingsData.interface = { ...settingsData.interface, ...settings.interface };
	}
	if (settings.theme) {
		settingsData.interface.theme = settings.theme;
	}
	if (settings.order_book_levels) {
		settingsData.interface.order_book_levels = settings.order_book_levels;
	}
	// if (settings.language) {
	// 	settingsData.language = { ...settingsData.language, ...settings.language };
	// } else {
	// 	if (settings.language) {
	// 		settingsData.language.language = settings.language;
	// 	}
	// }
	if (settings.audio_cue) {
		settingsData.audio_cue = { ...settingsData.settingsData, ...settings.audio_cue };
	}
	if (settings.audio_order_completed || settings.audio_order_completed === false) {
		settingsData.audio_cue.audio_order_completed = settings.audio_order_completed;
	}
	if (settings.audio_order_partially_completed || settings.audio_order_partially_completed === false) {
		settingsData.audio_cue.audio_order_partially_completed = settings.audio_order_partially_completed;
	}
	if (settings.audio_public_trade || settings.audio_public_trade === false) {
		settingsData.audio_cue.audio_public_trade = settings.audio_public_trade;
	}
	if (settings.manage_risk) {
		settingsData.manage_risk = { ...settings.manage_risk };
	}
	if (settings.order_portfolio_percentage) {
		settingsData.manage_risk.order_portfolio_percentage = settings.order_portfolio_percentage;
	}
	if (settings.popup_warning || settings.popup_warning === false) {
		settingsData.manage_risk.popup_warning = settings.popup_warning;
	}
	if (settings.usernameIsSet) {
		settingsData.usernameIsSet = settings.usernameIsSet
	}
	if (settings.theme) {
		settingsData.theme = settings.theme
	}
	if (settings.language) {
		settingsData.language = settings.language
	}
	return settingsData;
};

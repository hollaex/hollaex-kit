import { fiatSymbol } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

const generateFiatDepositTexts = (strings) => ({
	TITLE: strings.formatString(
		strings.NOTIFICATIONS.DEPOSITS.FIAT.TITLE,
		strings.FIAT_NAME
	),
	SUBTITLE: strings.formatString(
		strings.NOTIFICATIONS.DEPOSITS.FIAT.SUBTITLE,
		strings.FIAT_FULLNAME
	),
	INFORMATION_PENDING: [],
	INFORMATION_COMPLETE: []
});

const generateCryptoDepositTexts = (strings, status, currency) => {
	const name = strings[`${currency}_NAME`];
	const fullName = strings[`${currency}_FULLNAME`];
	return {
		TITLE: status
			? strings.formatString(
					strings.NOTIFICATIONS.DEPOSITS[currency].TITLE_RECEIVED,
					name
				)
			: strings.formatString(
					strings.NOTIFICATIONS.DEPOSITS[currency].TITLE_INCOMING,
					fullName
				),
		SUBTITLE: strings.formatString(
			status
				? strings.NOTIFICATIONS.DEPOSITS[currency].SUBTITLE_RECEIVED
				: strings.NOTIFICATIONS.DEPOSITS[currency].SUBTITLE_INCOMING,
			fullName
		),
		INFORMATION_PENDING: [
			strings
				.formatString(
					strings.NOTIFICATIONS.DEPOSITS[currency].INFORMATION_PENDING_1,
					name
				)
				.join(''),
			strings
				.formatString(
					strings.NOTIFICATIONS.DEPOSITS[currency].INFORMATION_PENDING_2,
					name
				)
				.join('')
		],
		INFORMATION_COMPLETE: []
	};
};

export const getDepositTexts = (currency, status = false) => {
	let texts = {};
	if (currency === fiatSymbol) {
		texts = generateFiatDepositTexts(STRINGS);
	} else {
		texts = generateCryptoDepositTexts(STRINGS, status, currency.toUpperCase());
	}
	return {
		title: texts.TITLE,
		subtitle: texts.SUBTITLE,
		information: status ? texts.INFORMATION_COMPLETE : texts.INFORMATION_PENDING
	};
};

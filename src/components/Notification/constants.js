import { BASE_CURRENCY } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const generateBaseDepositTexts = (strings) => ({
	TITLE: strings.formatString(
		strings.NOTIFICATIONS.DEPOSITS[BASE_CURRENCY.toUpperCase()].TITLE,
		strings[`${BASE_CURRENCY.toUpperCase()}_NAME`]
	),
	SUBTITLE: strings.formatString(
		strings.NOTIFICATIONS.DEPOSITS[BASE_CURRENCY.toUpperCase()].SUBTITLE,
		strings[`${BASE_CURRENCY.toUpperCase()}_FULLNAME`]
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
					strings.NOTIFICATIONS.DEPOSITS.TITLE_RECEIVED,
					name
				)
			: strings.formatString(
					strings.NOTIFICATIONS.DEPOSITS.TITLE_INCOMING,
					fullName
				),
		SUBTITLE: strings.formatString(
			status
				? strings.NOTIFICATIONS.DEPOSITS.SUBTITLE_RECEIVED
				: strings.NOTIFICATIONS.DEPOSITS.SUBTITLE_INCOMING,
			fullName
		),
		INFORMATION_PENDING: [
			strings
				.formatString(
					strings.NOTIFICATIONS.DEPOSITS.INFORMATION_PENDING_1,
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
	if (currency === BASE_CURRENCY) {
		texts = generateBaseDepositTexts(STRINGS);
	} else {
		texts = generateCryptoDepositTexts(STRINGS, status, currency.toUpperCase());
	}
	return {
		title: texts.TITLE,
		subtitle: texts.SUBTITLE,
		information: status ? texts.INFORMATION_COMPLETE : texts.INFORMATION_PENDING
	};
};

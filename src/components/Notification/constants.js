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

const generateBtcDepositTexts = (strings, status) => {
	const name = strings.BTC_NAME;
	const fullName = strings.BTC_FULLNAME;
	return {
		TITLE: status
			? strings.formatString(
					strings.NOTIFICATIONS.DEPOSITS.BTC.TITLE_RECEIVED,
					name
				)
			: strings.formatString(
					strings.NOTIFICATIONS.DEPOSITS.BTC.TITLE_INCOMING,
					fullName
				),
		SUBTITLE: strings.formatString(
			status
				? strings.NOTIFICATIONS.DEPOSITS.BTC.SUBTITLE_RECEIVED
				: strings.NOTIFICATIONS.DEPOSITS.BTC.SUBTITLE_INCOMING,
			fullName
		),
		INFORMATION_PENDING: [
			strings
				.formatString(
					strings.NOTIFICATIONS.DEPOSITS.BTC.INFORMATION_PENDING_1,
					name
				)
				.join(''),
			strings
				.formatString(
					strings.NOTIFICATIONS.DEPOSITS.BTC.INFORMATION_PENDING_2,
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
		texts = generateBtcDepositTexts(STRINGS, status);
	}
	return {
		title: texts.TITLE,
		subtitle: texts.SUBTITLE,
		information: status ? texts.INFORMATION_COMPLETE : texts.INFORMATION_PENDING
	};
};

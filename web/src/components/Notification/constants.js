// import { BASE_CURRENCY } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { DEFAULT_COIN_DATA } from '../../config/constants';

// const generateBaseDepositTexts = (strings) => ({
// 	TITLE: strings.formatString(
// 		strings[`NOTIFICATIONS.DEPOSITS.${BASE_CURRENCY.toUpperCase()}.TITLE`],
// 		strings[`${BASE_CURRENCY.toUpperCase()}_NAME`]
// 	),
// 	SUBTITLE: strings.formatString(
// 		strings[`NOTIFICATIONS.DEPOSITS.${BASE_CURRENCY.toUpperCase()}.SUBTITLE`],
// 		strings[`${BASE_CURRENCY.toUpperCase()}_FULLNAME`]
// 	),
// 	INFORMATION_PENDING: [],
// 	INFORMATION_COMPLETE: []
// });

const generateCryptoDepositTexts = (strings, status, currency, coins) => {
	// const name = strings[`${currency}_NAME`];
	const { fullname } = coins[currency] || DEFAULT_COIN_DATA;
	return {
		TITLE: status
			? strings.formatString(
					strings['NOTIFICATIONS.DEPOSITS.TITLE_RECEIVED'],
					// name
					fullname
			  )
			: strings.formatString(
					strings['NOTIFICATIONS.DEPOSITS.TITLE_INCOMING'],
					fullname
			  ),
		SUBTITLE: strings.formatString(
			status
				? strings['NOTIFICATIONS.DEPOSITS.SUBTITLE_RECEIVED']
				: strings['NOTIFICATIONS.DEPOSITS.SUBTITLE_INCOMING'],
			fullname
		),
		INFORMATION_PENDING: [
			strings
				.formatString(
					strings['NOTIFICATIONS.DEPOSITS.INFORMATION_PENDING_1'],
					fullname
					// name
				)
				.join(''),
			strings
				.formatString(
					strings['NOTIFICATIONS.DEPOSITS.INFORMATION_PENDING_2'],
					fullname
					// name
				)
				.join(''),
		],
		INFORMATION_COMPLETE: [],
	};
};

export const getDepositTexts = (currency, coins = {}, status = false) => {
	let texts = {};
	let currencySymbol = currency.trim();
	texts = generateCryptoDepositTexts(
		STRINGS,
		status,
		currencySymbol.toUpperCase(),
		coins
	);
	return {
		title: texts.TITLE,
		subtitle: texts.SUBTITLE,
		information: status
			? texts.INFORMATION_COMPLETE
			: texts.INFORMATION_PENDING,
	};
};

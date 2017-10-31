import LocalizedStrings from 'react-localization';
import math from 'mathjs';
import numbro from 'numbro';

let strings = new LocalizedStrings({
	en: {

	}
});

export default strings


export const BTC_FORMAT = '0,0.[0000]';
export const FIAT_FORMAT = '0,0.[00]';

export const formatBtcAmount = (amount = 0) => numbro(math.number(amount)).format(BTC_FORMAT);
export const formatFiatAmount = (amount = 0) => numbro(math.number(amount)).format(FIAT_FORMAT);

export const getFormattedDate = (value) => {
	const stringDate = (value ? new Date(value) : new Date()).toISOString();
	const stringDateSplit = stringDate.split('T', 1);
	return stringDateSplit[0];
}

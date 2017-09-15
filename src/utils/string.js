import LocalizedStrings from 'react-localization';
import numbro from 'numbro';

let strings = new LocalizedStrings({
	en: {

	}
});

export default strings


export const BTC_FORMAT = '0,0.[0000]';
export const FIAT_FORMAT = '0,0.[00]';

export const formatBtcAmount = (amount = 0) => numbro(amount).format(BTC_FORMAT);
export const formatFiatAmount = (amount = 0) => numbro(amount).format(FIAT_FORMAT);

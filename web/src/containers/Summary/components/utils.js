import moment from 'moment';
import { calculatePrice } from 'utils/currency';

export const checkBankVerification = (bank_account = [], id_data) => {
	let bank_status = 0;
	if (bank_account.length) {
		if (bank_account.filter((data) => data.status === 3).length) {
			bank_status = 3;
		} else if (bank_account.filter((data) => data.status === 1).length) {
			bank_status = 1;
		} else if (bank_account.filter((data) => data.status === 2).length) {
			bank_status = 2;
		}
		if (id_data.status !== 3) {
			bank_status = 1;
		}
		if (
			bank_account.length ===
			bank_account.filter((data) => data.status === 0).length
		) {
			bank_status = 0;
		}
	}
	return bank_status;
};

export const getLastMonthVolume = (tradeData = {}, prices = {}, pairs = {}) => {
	const month = moment().subtract(1, 'month').format('M');
	const trade = tradeData[month];
	let total = 0;
	if (trade) {
		Object.keys(trade).map((pair) => {
			let pairValue = pairs[pair] || {};
			let volumeObj = trade[pair] || {};
			let pairPrice = calculatePrice(volumeObj.volume, pairValue.pair_base);
			total += pairPrice;
			return total;
		});
	}
	return total;
};

import mathjs from 'mathjs';
import store from 'store';

const WITHDRAWAL_FEES_KEY = 'withdrawal_fees';
const DEPOSIT_FEES_KEY = 'deposit_fees';
const WITHDRAWAL_LIMIT_KEY = 'withdrawal_limit';
const DEPOSIT_LIMIT_KEY = 'deposit_limit';

const limitNumberWithinRange = (num, min = 0, max = Number.MAX_VALUE) => {
	return mathjs.min(mathjs.max(num, min), max);
};

export const getFiatFee = (currency, amount, network, type) => {
	const {
		app: { coins },
		user: { verification_level },
	} = store.getState();

	const feeNetwork = network || currency;
	const { [type]: fees, [type.slice(0, -1)]: fee } = coins[currency];
	if (fees && fees[feeNetwork]) {
		const { symbol, value, type, min, max, levels } = fees[feeNetwork];
		const { [verification_level]: level_based_fee = value } = levels || {};

		if (type === 'percentage') {
			return {
				symbol,
				rate: level_based_fee,
				value: limitNumberWithinRange(
					mathjs.divide(mathjs.multiply(amount, level_based_fee), 100),
					min,
					max
				),
			};
		} else {
			return {
				symbol,
				rate: level_based_fee,
				value: level_based_fee,
			};
		}
	} else if (fee) {
		return {
			symbol: currency,
			rate: fee,
			value: fee,
		};
	}

	return { symbol: currency, rate: 0, value: 0 };
};

export const getFiatWithdrawalFee = (currency, amount = 0, network) =>
	getFiatFee(currency, amount, network, WITHDRAWAL_FEES_KEY);

export const getFiatDepositFee = (currency, amount = 0, network) =>
	getFiatFee(currency, amount, network, DEPOSIT_FEES_KEY);

export const getFiatLimit = (type) => {
	const {
		app: { config_level },
		user: { verification_level },
	} = store.getState();

	const { [type]: limit = 0 } = config_level[verification_level] || {};
	return limit;
};

export const getFiatWithdrawalLimit = () => getFiatLimit(WITHDRAWAL_LIMIT_KEY);
export const getFiatDepositLimit = () => getFiatLimit(DEPOSIT_LIMIT_KEY);

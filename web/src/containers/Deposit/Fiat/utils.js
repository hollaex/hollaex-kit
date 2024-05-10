import { createSelector } from 'reselect';
import store from 'store';

const WITHDRAWAL_FEES_KEY = 'withdrawal_fees';
const DEPOSIT_FEES_KEY = 'deposit_fees';
const WITHDRAWAL_LIMIT_KEY = 'withdrawal_limit';
const DEPOSIT_LIMIT_KEY = 'deposit_limit';

export const getFiatFee = (
	currency,
	amount,
	network,
	type,
	getWithdrawCurrency
) => {
	const {
		app: { coins },
	} = store.getState();

	const feeNetwork = network || currency;
	const { [type]: fees, [type.slice(0, -1)]: fee } = getWithdrawCurrency
		? coins[getWithdrawCurrency]
		: coins[currency];
	if (fees && fees[feeNetwork]) {
		const { symbol, value } = fees[feeNetwork];

		return {
			symbol,
			rate: value,
			value: value,
		};
	} else if (fee) {
		return {
			symbol: currency,
			rate: fee,
			value: fee,
		};
	}

	return { symbol: currency, rate: 0, value: 0 };
};

export const getFiatWithdrawalFee = (
	currency,
	amount = 0,
	network,
	getWithdrawCurrency
) =>
	getFiatFee(
		currency,
		amount,
		network,
		WITHDRAWAL_FEES_KEY,
		getWithdrawCurrency
	);

export const getFiatDepositFee = (currency, amount = 0, network) =>
	getFiatFee(currency, amount, network, DEPOSIT_FEES_KEY);

export const getFiatLimit = (type, currency) => {
	const transactionType =
		type === WITHDRAWAL_LIMIT_KEY ? 'withdrawal' : 'deposit';
	const {
		app: { transaction_limits },
		user: { verification_level },
	} = store.getState();

	const independentLimit = transaction_limits?.find(
		(limit) =>
			limit.limit_currency === currency &&
			limit.tier === verification_level &&
			limit.type === transactionType
	);
	const defaultLimit = transaction_limits?.find(
		(limit) =>
			limit.limit_currency === 'default' &&
			limit.tier === verification_level &&
			limit.type === transactionType
	);

	const limit = independentLimit || defaultLimit;

	return limit?.amount || 0;
};

export const getFiatWithdrawalLimit = (symbol) =>
	getFiatLimit(WITHDRAWAL_LIMIT_KEY, symbol);
export const getFiatDepositLimit = (symbol) =>
	getFiatLimit(DEPOSIT_LIMIT_KEY, symbol);

export const getOnramp = (state, ownProps) =>
	state.app.onramp[ownProps.currency][ownProps.method];

export const depositOptionsSelector = createSelector([getOnramp], (onramp) => {
	const options = { ...onramp };
	if (options.type === 'manual') {
		const data = options.data.map(([labelObject, ...rest], index) => {
			return [{ ...labelObject, id: `${labelObject.value}_${index}` }, ...rest];
		});

		options.data = data;
	}

	return options;
});

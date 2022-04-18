import { createSelector } from 'reselect';
import { DEFAULT_COIN_DATA } from 'config/constants';

const getCoins = (state) => state.app.coins;
const getOrders = (state) => state.wallet.orderHistory;
const getTrades = (state) => state.wallet.trades;
const getDeposits = (state) => state.wallet.deposits;
const getWithdrawals = (state) => state.wallet.withdrawals;

const modifyTradesAndOrders = (history, coins) => {
	const data = history.data.map((record) => {
		const { symbol: pair, fee_coin } = record;
		const [pair_base, pair_2] = pair.split('-');
		const { display_name: pair_base_display, icon_id } =
			coins[pair_base] || DEFAULT_COIN_DATA;
		const { display_name: pair_2_display } = coins[pair_2] || DEFAULT_COIN_DATA;
		const { display_name: fee_coin_display } =
			coins[fee_coin || pair_base] || DEFAULT_COIN_DATA;
		const display_name = `${pair_base_display}-${pair_2_display}`;
		return {
			...record,
			display_name,
			pair_base_display,
			pair_2_display,
			fee_coin_display,
			icon_id,
		};
	});

	return { ...history, data };
};

export const orderHistorySelector = createSelector(
	[getOrders, getCoins],
	(orders, coins) => modifyTradesAndOrders(orders, coins)
);

export const tradeHistorySelector = createSelector(
	[getTrades, getCoins],
	(trades, coins) => modifyTradesAndOrders(trades, coins)
);

const modifyDepositsAndWithdrawals = (history, coins) => {
	const data = history.data.map((record) => {
		const { currency, fee_coin } = record;
		const { display_name, icon_id } = coins[currency] || DEFAULT_COIN_DATA;
		const { display_name: fee_coin_display } =
			coins[fee_coin || currency] || DEFAULT_COIN_DATA;
		return { ...record, display_name, fee_coin_display, icon_id };
	});

	return { ...history, data };
};

export const depositHistorySelector = createSelector(
	[getDeposits, getCoins],
	(deposits, coins) => modifyDepositsAndWithdrawals(deposits, coins)
);

export const withdrawalHistorySelector = createSelector(
	[getWithdrawals, getCoins],
	(withdrawals, coins) => modifyDepositsAndWithdrawals(withdrawals, coins)
);

import axios from 'axios';
import math from 'mathjs';

import { estimatedQuickTradePriceSelector } from 'containers/Trade/utils';
import { getDecimals } from 'utils/utils';
import STRINGS from 'config/localizedStrings';

export function getOrderbook() {
	return {
		type: 'GET_QUICK_TRADE_ORDERBOOK',
		payload: axios.get('/orderbooks'),
	};
}

export const setPriceEssentials = (priceEssentials) => (dispatch, getState) => {
	const store = getState();
	const pair = store.app.pair;
	const pairData = store.app.pairs[pair] || {};
	const side =
		priceEssentials.side !== undefined
			? priceEssentials.side
			: store.quickTrade.side;
	const isSourceChanged =
		priceEssentials.isSourceChanged !== undefined
			? priceEssentials.isSourceChanged
			: store.quickTrade.isSourceChanged;
	let priceValues = {};

	const decimalPoint = getDecimals(pairData.increment_size);
	if (priceEssentials.size) {
		let [estimatedPrice] = estimatedQuickTradePriceSelector(store, {
			side,
			size: priceEssentials.size,
			isFirstAsset: side === 'buy' ? !isSourceChanged : isSourceChanged,
		});
		let sourceAmount = priceEssentials.sourceAmount;
		let targetAmount = priceEssentials.targetAmount;
		if (side === 'buy') {
			if (estimatedPrice) {
				if (isSourceChanged) {
					targetAmount = math.round(
						sourceAmount / estimatedPrice,
						decimalPoint
					);
				} else {
					sourceAmount = math.round(
						targetAmount * estimatedPrice,
						decimalPoint
					);
				}
			}
			priceValues = {
				...priceValues,
				sourceAmount,
				targetAmount,
				estimatedPrice,
			};
		} else {
			if (estimatedPrice) {
				if (isSourceChanged) {
					targetAmount = math.round(
						sourceAmount * estimatedPrice,
						decimalPoint
					);
				} else {
					sourceAmount = math.round(
						targetAmount / estimatedPrice,
						decimalPoint
					);
				}
			}
			priceValues = {
				...priceValues,
				sourceAmount,
				targetAmount,
				estimatedPrice,
			};
		}
	} else if (
		!priceEssentials.size &&
		(priceEssentials.sourceAmount !== undefined ||
			priceEssentials.targetAmount !== undefined)
	) {
		priceValues = {
			...priceValues,
			sourceAmount: 0,
			targetAmount: 0,
		};
	}

	dispatch({
		type: 'SET_PRICE_ESSENTIALS',
		payload: {
			...priceEssentials,
			side,
			isSourceChanged,
			...priceValues,
		},
	});
};

export function setOrderbook(orderbook) {
	return {
		type: 'SET_QUICK_TRADE_ORDERBOOK',
		payload: orderbook, // set only for btc at the moment
	};
}

export function setOrderbooks(orderbooks) {
	return {
		type: 'SET_QUICK_TRADE_ORDERBOOKS_DATA',
		payload: orderbooks,
	};
}

export const changeSymbol = (symbol) => ({
	type: 'CHANGE_QUICK_TRADE_SYMBOL',
	payload: {
		symbol,
	},
});

export const setOrderMsg = () => ({
	type: 'SET_SNACK_NOTIFICATION',
	payload: {
		content: STRINGS['CANCEL_SUCCESS_TEXT'],
	},
});

import {
	SET_PRICES_AND_ASSET,
	SET_ALL_COINS,
	SET_ALL_PAIRS,
	SET_EXCHANGE,
} from 'actions/assetActions';

const INITIAL_STATE = {
	oraclePrices: {},
	totalAsset: 0,
	chartData: [],
	allCoins: [],
	allPairs: [],
	exchange: {},
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SET_PRICES_AND_ASSET:
			return { ...state, ...payload };

		case SET_ALL_COINS:
			return { ...state, ...payload };

		case SET_ALL_PAIRS:
			return { ...state, ...payload };

		case SET_EXCHANGE:
			return { ...state, ...payload };

		default:
			return state;
	}
};

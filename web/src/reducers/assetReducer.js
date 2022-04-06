import {
	SET_PRICES_AND_ASSET_SUCCESS,
	SET_ALL_COINS,
	SET_ALL_PAIRS,
	SET_EXCHANGE,
	SET_PRICES_AND_ASSET_PENDING,
	SET_PRICES_AND_ASSET_FAILURE,
} from 'actions/assetActions';

const INITIAL_STATE = {
	oraclePrices: {},
	totalAsset: 0,
	chartData: [],
	allCoins: [],
	allPairs: [],
	exchange: {},
	dataFetched: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SET_PRICES_AND_ASSET_PENDING:
			return { ...state, dataFetched: true };
		case SET_PRICES_AND_ASSET_SUCCESS:
			return { ...state, ...payload, dataFetched: true };
		case SET_PRICES_AND_ASSET_FAILURE:
			return { ...state, dataFetched: false };
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

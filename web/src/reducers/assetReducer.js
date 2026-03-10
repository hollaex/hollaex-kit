import {
	SET_PRICES_AND_ASSET_SUCCESS,
	SET_ALL_COINS,
	SET_ALL_PAIRS,
	SET_EXCHANGE,
	SET_PRICES_AND_ASSET_PENDING,
	SET_PRICES_AND_ASSET_FAILURE,
	SET_DASH_TOKEN,
	SET_SOCKET_PRICES,
} from 'actions/assetActions';

const INITIAL_STATE = {
	oraclePrices: {},
	wsPriceData: {},
	totalAsset: 0,
	usdtToDisplayRate: 1,
	chartData: [],
	allCoins: [],
	allPairs: [],
	exchange: {},
	dashToken: '',
	isFetching: true,
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SET_PRICES_AND_ASSET_PENDING:
			return { ...state, isFetching: true };
		case SET_PRICES_AND_ASSET_SUCCESS:
			return { ...state, ...payload, isFetching: false };
		case SET_PRICES_AND_ASSET_FAILURE:
			return { ...state, isFetching: false };
		case SET_ALL_COINS:
			return { ...state, ...payload };

		case SET_ALL_PAIRS:
			return { ...state, ...payload };

		case SET_EXCHANGE:
			return { ...state, ...payload };

		case SET_DASH_TOKEN:
			return { ...state, ...payload };

		case SET_SOCKET_PRICES:
			return {
				...state,
				wsPriceData: {
					...state.wsPriceData,
					...payload.wsPriceData,
				},
			};

		default:
			return state;
	}
};

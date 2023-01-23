import {
	SET_PRICES_AND_ASSET_SUCCESS,
	SET_ALL_COINS,
	SET_ALL_PAIRS,
	SET_EXCHANGE,
	SET_PRICES_AND_ASSET_PENDING,
	SET_PRICES_AND_ASSET_FAILURE,
	SET_DASH_TOKEN,
} from 'actions/assetActions';

const INITIAL_STATE = {
	oraclePrices: {},
	totalAsset: 0,
	chartData: [],
	allCoins: [],
	allPairs: [],
	exchange: {},
	dashToken:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjgwLCJlbWFpbCI6InRlY2grbmV0d29ya0BiaXRob2xsYS5jb20ifSwic2NvcGVzIjpbInVzZXIiLCJvcGVyYXRvciJdLCJpcCI6IjYxLjEuMTU0LjIyMCIsImlzcyI6ImJpdGhvbGxhLmNvbSIsImlhdCI6MTY3MjczNDYyNCwiZXhwIjoxNjcyODIxMDI0fQ.kG1nAbi8c5j7yx2IKefh-5VaosLfRjlHfgtlf9iZGCU',
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

		default:
			return state;
	}
};

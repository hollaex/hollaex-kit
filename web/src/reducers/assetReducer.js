import { SET_PRICES_AND_ASSET } from 'actions/assetActions';

const INITIAL_STATE = {
	oraclePrices: {},
	totalAsset: 0,
	chartData: [],
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SET_PRICES_AND_ASSET:
			return { ...state, ...payload };

		default:
			return state;
	}
};

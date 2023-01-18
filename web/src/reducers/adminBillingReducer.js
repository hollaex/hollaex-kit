import {
	SET_SELECTED_TYPE,
	SET_SELECTED_EXCHANGE_ITEM,
	SET_TYPE,
	SET_SELECTED_CRYPTO,
} from 'actions/adminBillingActions';

const INITIAL_STATE = {
	selectedExchangeItem: '',
	selectedType: '',
	type: 'item',
	selectedCrypto: 'XHT',
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SET_SELECTED_TYPE:
			return { ...state, selectedType: payload };
		case SET_SELECTED_EXCHANGE_ITEM:
			return { ...state, selectedExchangeItem: payload };
		case SET_TYPE:
			return { ...state, type: payload };
		case SET_SELECTED_CRYPTO:
			return { ...state, type: payload };
		default:
			return state;
	}
};

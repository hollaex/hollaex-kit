import {
	SET_SELECTED_TYPE,
	SET_SELECTED_PAYMENT,
	SET_EXCHANGE_PLAN_TYPE,
	SET_SELECTED_CRYPTO,
	SET_CRYPTO_PAYMENT_TYPE,
} from 'actions/adminBillingActions';

const INITIAL_STATE = {
	selectedPayment: '',
	selectedType: 'crypto',
	exchangePlanType: 'item',
	selectedCrypto: 'XHT',
	cryptoPaymentType: '',
	isAutomatedKYC: false,
};

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SET_SELECTED_TYPE:
			return { ...state, selectedType: payload };
		case SET_SELECTED_PAYMENT:
			return { ...state, selectedPayment: payload };
		case SET_EXCHANGE_PLAN_TYPE:
			return { ...state, exchangePlanType: payload };
		case SET_SELECTED_CRYPTO:
			return { ...state, selectedCrypto: payload };
		case SET_CRYPTO_PAYMENT_TYPE:
			return { ...state, cryptoPaymentType: payload };
		default:
			return state;
	}
};

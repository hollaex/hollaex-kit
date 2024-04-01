import {
	SET_SELECTED_TYPE,
	SET_SELECTED_PAYMENT,
	SET_EXCHANGE_PLAN_TYPE,
	SET_SELECTED_CRYPTO,
	SET_TRANSFER_CRYPTO_PAYMENT,
	SET_FIAT_SUBMITTED,
	SET_PAYMENT_ADDRESS_DETAILS,
	SET_DASH_EXCHANGE,
	SET_EXCHANGE_CARD_KEY,
	SET_CLOUD_PLAN_DETAILS,
} from 'actions/adminBillingActions';

const INITIAL_STATE = {
	selectedPayment: '',
	selectedType: 'diy',
	exchangePlanType: 'item',
	selectedCrypto: { coin: 'XHT', symbol: 'xht' },
	transferCryptoPayment: false,
	fiatSubmission: false,
	paymentAddressDetails: {
		address: '',
		amount: 0,
		currency: '',
	},
	dashExchange: {},
	exchangeCardKey: 'diy',
	cloudPlanDetails: true,
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
		case SET_TRANSFER_CRYPTO_PAYMENT:
			return { ...state, transferCryptoPayment: payload };
		case SET_FIAT_SUBMITTED:
			return { ...state, fiatSubmission: payload };
		case SET_PAYMENT_ADDRESS_DETAILS:
			return { ...state, paymentAddressDetails: payload };
		case SET_EXCHANGE_CARD_KEY:
			return { ...state, exchangeCardKey: payload };
		case SET_CLOUD_PLAN_DETAILS: {
			return { ...state, cloudPlanDetails: payload };
		}
		case SET_DASH_EXCHANGE: {
			return { ...state, dashExchange: payload };
		}
		default:
			return state;
	}
};

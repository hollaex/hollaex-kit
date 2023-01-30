import {
	SET_SELECTED_TYPE,
	SET_SELECTED_PAYMENT,
	SET_EXCHANGE_PLAN_TYPE,
	SET_SELECTED_CRYPTO,
	SET_CRYPTO_PAYMENT_TYPE,
	SET_TRANSFER_CRYPTO_PAYMENT,
	SET_FIAT_SUBMITTED,
	SET_PAYMENT_ADDRESS_DETAILS,
	SET_EXCHANGE,
	SET_EXCHANGE_CARD_KEY,
} from 'actions/adminBillingActions';

const INITIAL_STATE = {
	selectedPayment: 'cryptoCurrency',
	selectedType: 'crypto',
	exchangePlanType: 'item',
	selectedCrypto: { coin: 'XHT', symbol: 'xht' },
	cryptoPaymentType: '',
	isAutomatedKYC: false,
	transferCryptoPayment: false,
	fiatSubmission: false,
	paymentAddressDetails: {
		address: '',
		amount: 0,
		currency: '',
	},
	exchange: {},
	exchangeCardKey: 'diy',
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
		case SET_TRANSFER_CRYPTO_PAYMENT:
			return { ...state, transferCryptoPayment: payload };
		case SET_FIAT_SUBMITTED:
			return { ...state, fiatSubmission: payload };
		case SET_PAYMENT_ADDRESS_DETAILS:
			return { ...state, paymentAddressDetails: payload };
		case SET_EXCHANGE:
			return { ...state, exchange: payload };
		case SET_EXCHANGE_CARD_KEY:
			return { ...state, exchangeCardKey: payload };
		default:
			return state;
	}
};

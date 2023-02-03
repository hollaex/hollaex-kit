export const SET_SELECTED_PAYMENT = 'SET_SELECTED_PAYMENT';
export const SET_EXCHANGE_PLAN_TYPE = 'SET_EXCHANGE_PLAN_TYPE';
export const SET_SELECTED_TYPE = 'SET_SELECTED_TYPE';
export const SET_SELECTED_CRYPTO = 'SET_SELECTED_CRYPTO';
export const SET_CRYPTO_PAYMENT_TYPE = 'SET_CRYPTO_PAYMENT_TYPE';
export const SET_TRANSFER_CRYPTO_PAYMENT = 'SET_TRANSFER_CRYPTO_PAYMENT';
export const SET_FIAT_SUBMITTED = 'SET_FIAT_SUBMITTED';
export const SET_PAYMENT_ADDRESS_DETAILS = 'SET_PAYMENT_ADDRESS_DETAILS';
export const SET_EXCHANGE = 'SET_EXCHANGE';
export const SET_DASH_EXCHANGE = 'SET_DASH_EXCHANGE';
export const SET_EXCHANGE_CARD_KEY = 'SET_EXCHANGE_CARD_KEY';
export const SET_CLOUD_PLAN_DETAILS = ' SET_CLOUD_PLAN_DETAILS';

export const setSelectedPayment = (data = '') => ({
	type: SET_SELECTED_PAYMENT,
	payload: data,
});

export const setSelectedType = (data = '') => ({
	type: SET_SELECTED_TYPE,
	payload: data,
});

export const setExchangePlanType = (data = '') => ({
	type: SET_EXCHANGE_PLAN_TYPE,
	payload: data,
});

export const setSelectedCrypto = (data = '') => ({
	type: SET_SELECTED_CRYPTO,
	payload: data,
});

export const setCryptoPaymentType = (data = '') => ({
	type: SET_CRYPTO_PAYMENT_TYPE,
	payload: data,
});

export const setTransferCryptoPayment = (data = '') => ({
	type: SET_TRANSFER_CRYPTO_PAYMENT,
	payload: data,
});

export const setFiatSubmission = (data = '') => ({
	type: SET_FIAT_SUBMITTED,
	payload: data,
});

export const setPaymentAddressDetails = (data = {}) => ({
	type: SET_PAYMENT_ADDRESS_DETAILS,
	payload: data,
});

export const setDashExchange = (data = {}) => ({
	type: SET_DASH_EXCHANGE,
	payload: data,
});

export const setExchangeCardKey = (data = '') => ({
	type: SET_EXCHANGE_CARD_KEY,
	payload: data,
});

export const setCloudPlanDetails = (data = true) => ({
	type: SET_CLOUD_PLAN_DETAILS,
	payload: data,
});

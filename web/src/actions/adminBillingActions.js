export const SET_SELECTED_PAYMENT = 'SET_SELECTED_PAYMENT';
export const SET_TYPE = 'SET_TYPE';
export const SET_SELECTED_TYPE = 'SET_SELECTED_TYPE';
export const SET_SELECTED_CRYPTO = 'SET_SELECTED_CRYPTO';
export const SET_CRYPTO_PAYMENT_TYPE = 'SET_CRYPTO_PAYMENT_TYPE';

export const setSelectedPayment = (data = '') => ({
	type: SET_SELECTED_PAYMENT,
	payload: data,
});

export const setSelectedType = (data = '') => ({
	type: SET_SELECTED_TYPE,
	payload: data,
});

export const setType = (data = '') => ({ type: SET_TYPE, payload: data });

export const setSelectedCrypto = (data = '') => ({
	type: SET_SELECTED_CRYPTO,
	payload: data,
});

export const setCryptoPaymentType = (data = '') => ({
	type: SET_CRYPTO_PAYMENT_TYPE,
	payload: data,
});

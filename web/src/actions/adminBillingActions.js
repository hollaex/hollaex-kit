export const SET_SELECTED_EXCHANGE_ITEM = 'SET_SELECTED_EXCHANGE_ITEM';
export const SET_TYPE = 'SET_TYPE';
export const SET_SELECTED_TYPE = 'SET_SELECTED_TYPE';
export const SET_SELECTED_CRYPTO = 'SET_SELECTED_CRYPTO';

export const setSelectedExchangeItem = (data = '') => ({
	type: SET_SELECTED_EXCHANGE_ITEM,
	payload: data,
});

export const setSelectedType = (data = '') => ({
	type: SET_SELECTED_TYPE,
	payload: data,
});

export const setType = (data = '') => ({ type: SET_TYPE, payload: data });

export const setSelectedCrypto = (data = '') => {
	console.log('data', data);
	return { type: SET_SELECTED_CRYPTO, payload: data };
};

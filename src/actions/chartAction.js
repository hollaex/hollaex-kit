import axios from 'axios';

export const getChartConfig = () => {
	return axios({
		url: '/udf/config',
		method: 'GET'
	});
};

export const getChartSymbol = (symbol) => {
	return axios({
		url: `/udf/symbols?symbol=${symbol}`,
		method: 'GET'
	});
};

export const getChartHistory = (symbol, resolution, from, to, firstDataRequest) => {
	return axios({
		url: `/chart?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
		method: 'GET'
	});
};
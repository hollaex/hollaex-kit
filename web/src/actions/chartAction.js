import axios from 'axios';
import { APP_TITLE } from '../config/constants';

export const getChartConfig = () => {
	// return axios({
	// 	url: '/udf/config',
	// 	method: 'GET'
	// });
	const config = {
		supported_resolutions: ['60', '1D'],
		supports_group_request: false,
		supports_marks: false,
		supports_search: true,
		supports_timescale_marks: false
	};
	return new Promise((resolve) => {
		resolve(config);
	})
};

export const getChartSymbol = (symbol, tickSize) => {
	const pricescale = Math.round(1/tickSize)
	// return axios({
	// 	url: `/udf/symbols?symbol=${symbol}`,
	// 	method: 'GET'
	// });
	return new Promise((resolve) => {
		resolve({
			name: `${APP_TITLE.toUpperCase()}:${symbol.toUpperCase()}`,
			ticker: symbol,
			exchange: APP_TITLE.toUpperCase(),
			has_intraday: true,
			has_daily: true,
			has_weekly_and_monthly: true,
			session: '24x7',
			regular_session: '24x7',
			pricescale,
			volume_precision: 4,
			has_empty_bars: true
		});
	})
};

export const getChartHistory = (symbol, resolution, from, to, firstDataRequest) => {
	return axios({
		url: `/chart?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
		method: 'GET'
	});
};
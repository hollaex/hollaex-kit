import axios from 'axios';
import math from 'mathjs';
import moment from 'moment';
import { getDecimals } from '../utils/utils';

export const getChartConfig = () => {
	return axios({
		url: '/udf/config',
		method: 'GET'
	})
		.then((res) => {
			return res.data;
		});
	// const config = {
	// 	supported_resolutions: ['60', '240', '1D'],
	// 	supports_group_request: false,
	// 	supports_marks: false,
	// 	supports_search: true,
	// 	supports_timescale_marks: false,
	// };
	// return new Promise((resolve) => {
	// 	resolve(config);
	// });
};

export const getChartSymbol = (symbol, tickSize, api_name = '') => {
	let pricescale = math.round(1 / tickSize);
	if (/[^0-1]/g.test(pricescale)) {
		let count = getDecimals(tickSize);
		pricescale = math.pow(10, count);
	}
	// return axios({
	// 	url: `/udf/symbols?symbol=${symbol}`,
	// 	method: 'GET'
	// });
	return new Promise((resolve) => {
		resolve({
			name: `${symbol.toUpperCase()}`,
			ticker: symbol,
			exchange: api_name.toUpperCase(),
			has_intraday: true,
			has_daily: true,
			has_weekly_and_monthly: true,
			session: '24x7',
			regular_session: '24x7',
			pricescale,
			minmov: 1,
			volume_precision: 4,
			has_empty_bars: true,
		});
	});
};

export const getChartHistory = (
	symbol,
	resolution,
	from,
	to,
	firstDataRequest
) => {
	return axios({
		url: `/chart?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`,
		method: 'GET',
	});
};

export const getSparklines = async () => {
	const from = moment().subtract('1', 'days').format('X');
	const to = moment().format('X');

	const { data = {} } = await axios({
		url: `/charts?resolution=H&from=${from}&to=${to}`,
		method: 'GET',
	});

	const chartData = {};
	Object.entries(data).forEach(([pairKey, pairData = []]) => {
		chartData[pairKey] = {};
		chartData[pairKey]['close'] = pairData.map(({ close }) => close);
		chartData[pairKey]['open'] = (pairData[0] && pairData[0]['open']) || 0;
	});

	return chartData;
};

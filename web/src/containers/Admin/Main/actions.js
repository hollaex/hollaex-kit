import { requestAuthenticated } from '../../../utils';
import moment from 'moment';

export const getMonthlyTradingVolume = (pair) => {
	const from = moment().subtract('1', 'month').format('X');
	const to = moment().format('X');
	return requestAuthenticated(
		`/chart?symbol=${pair}&resolution=D&from=${from}&to=${to}`
	);
};
export const getNumOfUsers = () => requestAuthenticated('/admin/stats');

export const requestFees = () => requestAuthenticated('/admin/pairs');

import Cookies from 'universal-cookie';
import math from 'mathjs';
import numbro from 'numbro';
import moment from 'moment-timezone';
// import jwtDecode from 'jwt-decode';
// import { getToken, setToken, removeToken } from './token';
import {
	// TOKEN_KEY,
	// TOKEN_MAX_AGE,
	// TOKEN_EMAIL,
	TIME_ZONE,
} from '../config/constants';

const cookies = new Cookies();

export const getEmail = () => cookies.get('token::email');

export { default as request, requestAuthenticated } from './request';

export const formatDate = (date) => {
	return moment(date).tz(TIME_ZONE).format('YYYY/MM/DD HH:mm');
};

export const getFormat = (min = 0, fullFormat) => {
	if (fullFormat) {
		return { digit: 8, format: '0,0.[00000000]' };
	} else if (min % 1) {
		let point = min.toString().split('.')[1];
		let res = point
			.split('')
			.map((val) => 0)
			.join('');
		return { digit: point.length, format: `0,0.[${res}]` };
	} else {
		return { digit: 4, format: `0,0.[0000]` };
	}
};

export const formatCurrency = (amount = 0, min = 0, fullFormat = false) => {
	let formatObj = getFormat(min, fullFormat);
	return numbro(roundNumber(amount, formatObj.digit)).format(formatObj.format);
};

export const roundNumber = (number = 0, decimals = 4) => {
	if (number === 0) {
		return 0;
	} else if (decimals > 0) {
		const multipliedNumber = math.multiply(
			math.fraction(number),
			math.pow(10, decimals)
		);
		const dividedNumber = math.divide(
			math.floor(multipliedNumber),
			math.pow(10, decimals)
		);
		return math.number(dividedNumber);
	} else {
		return math.floor(number);
	}
};

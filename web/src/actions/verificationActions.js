import axios from 'axios';
import querystring from 'query-string';
import { WS_URL } from '../config/constants';

const VERIFICATION_ENDPOINTS = {
	VERIFY_SMS_CODE: `${WS_URL}/plugins/sms/verify`,
	VERIFY_BANK: `${WS_URL}/plugins/bank/user`,
	GET_USER: '/user'
};

export const getUserData = () => axios.get(VERIFICATION_ENDPOINTS.GET_USER);

export const requestSmsCode = (phoneNumber = '') => {
	const qs = querystring.stringify({ phone: phoneNumber });
	return axios({
		url: `${VERIFICATION_ENDPOINTS.VERIFY_SMS_CODE}?${qs}`,
		method: 'GET'
	});
};

export const verifySmsCode = ({ code = '', phone = '' }) => {
	const body = { code, phone };
	return axios({
		data: body,
		url: VERIFICATION_ENDPOINTS.VERIFY_SMS_CODE,
		method: 'POST'
	});
};

export const verifyBankData = (values) => {
	const body = {
		bank_name: values.bank_name,
		account_number: values.account_number,
	};
	return axios({
		data: body,
		url: VERIFICATION_ENDPOINTS.VERIFY_BANK,
		method: 'POST'
	});
};

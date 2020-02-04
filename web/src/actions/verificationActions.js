import axios from 'axios';
import querystring from 'query-string';

const VERIFICATION_ENDPOINTS = {
	VERIFY_SMS_CODE: '/plugins/sms/verify',
	VERIFY_BANK: '/plugins/bank/user',
	GET_USER: '/user'
};

export const getUserData = () => axios.get(VERIFICATION_ENDPOINTS.GET_USER);

export const requestSmsCode = (phoneNumber = '') => {
	const qs = querystring.stringify({ phone: phoneNumber });
	return axios.get(`${VERIFICATION_ENDPOINTS.VERIFY_SMS_CODE}?${qs}`);
};

export const verifySmsCode = ({ code = '', phone = '' }) => {
	const body = { code, phone };
	return axios.post(VERIFICATION_ENDPOINTS.VERIFY_SMS_CODE, body);
};

export const verifyBankData = (values) => {
	const body = {
		bank_name: values.bank_name,
		account_number: values.account_number,
	};
	return axios.post(VERIFICATION_ENDPOINTS.VERIFY_BANK, body);
};

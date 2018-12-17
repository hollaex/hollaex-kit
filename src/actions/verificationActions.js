import axios from 'axios';
import querystring from 'query-string';

const VERIFICATION_ENDPOINTS = {
	VERIFY_SMS_CODE: '/user/verify/sms',
	VERIFY_BANK: '/user/bank',
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
		card_number: values.card_number,
		bank_name: values.bank_name,
		account_number: values.account_number,
		shaba_number: values.shaba_number
	};
	return axios.post(VERIFICATION_ENDPOINTS.VERIFY_BANK, body);
};

import axios from 'axios';
import querystring from 'query-string';

const ENDPOINTS = {
	QUICK_TRADE: '/quick-trade',
	EXECUTE: '/order/execute',
};

export const getQuickTrade = (values) =>
	axios.get(`${ENDPOINTS.QUICK_TRADE}?${querystring.stringify(values)}`);

export const executeQuickTrade = (token) =>
	axios.post(ENDPOINTS.EXECUTE, { token });

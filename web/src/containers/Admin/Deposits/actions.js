import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';
import axios from 'axios';

export const requestDeposits = (query = { type: 'deposit' }) => {
	const { type, currency, ...rest } = query;
	let formProps = { ...rest };
	if (currency) {
		formProps.currency = currency;
	}
	const queryValues = Object.keys(formProps).length
		? querystring.stringify(formProps)
		: '';
	let path = `/admin/deposits?${queryValues}`;
	if (type === 'withdrawal') {
		path = `/admin/withdrawals?${queryValues}`;
	}
	return requestAuthenticated(path);
};

export const requestDepositDownload = (query = { type: 'deposit' }) => {
	const { type, currency, ...rest } = query;
	let formProps = { ...rest };
	if (currency) {
		formProps.currency = currency;
	}
	const queryValues = Object.keys(formProps).length
		? querystring.stringify(formProps)
		: '';
	let path = `/admin/deposits?${queryValues}`;
	if (type === 'withdrawal') {
		path = `/admin/withdrawals?${queryValues}`;
	}
	return axios({
		method: 'GET',
		url: path,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			type === 'deposit'
				? link.setAttribute('download', 'deposit.csv')
				: link.setAttribute('download', 'withdrawal.csv');
			document.body.appendChild(link);
			link.click();
		})
		.catch((error) => {
			console.log('errorss', error);
		});
};

export const requestdate = () => {
	const path = `/admin/deposits?start_date=[2018-06-01T01:42:43.233Z]&end_date=[2018-07-01T01:42:43.233Z]`;
	return requestAuthenticated(path);
};

export const completeDeposits = (id, status) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ status }),
	};
	return requestAuthenticated(
		`/admin/deposit/verify?transaction_id=${id}`,
		options
	);
};

export const dismissDeposit = (id, dismissed) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ dismissed }),
	};
	return requestAuthenticated(
		`/admin/deposit/dismiss?transaction_id=${id}`,
		options
	);
};

export const requestBurn = (data) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ ...data }),
	};
	return requestAuthenticated(
		`/admin/burn`,
		options
	);
};

export const requestMint = (data) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ ...data }),
	};
	return requestAuthenticated(
		`/admin/mint`,
		options
	);
};

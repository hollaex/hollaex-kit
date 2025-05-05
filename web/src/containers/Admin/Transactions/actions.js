import querystring from 'query-string';
import axios from 'axios';
import moment from 'moment';

import { requestAuthenticated } from '../../../utils';

export const requestDeposits = (query) => {
	const { type, ...rest } = query;
	let formProps = { ...rest };
	const queryValues = Object.keys(formProps).length
		? querystring.stringify(formProps)
		: '';
	let path = `/admin/deposits?${queryValues}`;
	if (type === 'withdrawal') {
		path = `/admin/withdrawals?${queryValues}`;
	}
	return requestAuthenticated(path);
};

export const requestDepositsDownload = (query) => {
	const { type, ...rest } = query;
	let formProps = { ...rest };
	const queryValues = Object.keys(formProps).length
		? querystring.stringify(formProps)
		: '';
	let path = `/admin/deposits/csv?${queryValues}`;
	if (type === 'withdrawal') {
		path = `/admin/withdrawals/csv?${queryValues}`;
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
				? link.setAttribute(
						'download',
						`deposit_${moment().format('YYYY-MM-DD')}.csv`
				  )
				: link.setAttribute(
						'download',
						`withdrawal_${moment().format('YYYY-MM-DD')}.csv`
				  );
			document.body.appendChild(link);
			link.click();
		})
		.catch((error) => {
			console.log('errors', error);
		});
};

export const completeDeposits = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/deposit/verify?transaction_id=${values.transaction_id}`,
		options
	);
};

export const dismissDeposit = (transaction_id, dismissed) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ dismissed }),
	};
	return requestAuthenticated(
		`/admin/deposit/dismiss?transaction_id=${transaction_id}`,
		options
	);
};

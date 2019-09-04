import { request } from '../../../utils';

export const performLogin = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
		headers: {
			'Content-Type': 'application/json'
			// 'cache-control': 'no-cache',
		}
	};

	return request('/login', options);
};

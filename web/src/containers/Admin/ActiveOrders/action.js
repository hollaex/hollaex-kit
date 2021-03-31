import { requestAuthenticated } from '../../../utils';

const handleError = (err) => err.data;

export const requestActiveOrders = (values = {}) => {
	const { user_id, symbol = '', side, page = 1, limit = 50 } = values;
	let query = `page=${page}&limit=${limit}`;
	if (user_id) query = `${query}&user_id=${user_id}`;
	if (symbol) query = `${query}&symbol=${symbol}`;
	if (side) query = `${query}&side=${side}`;
	return requestAuthenticated(`/admin/orders?${query}`)
		.catch(handleError)
		.then((data) => {
			return {
				...data,
				page,
				isRemaining: data.count > page * limit,
			};
		});
};

export const requestCancelOrders = (orderId, userId) => {
	return requestAuthenticated(
		`/admin/order?user_id=${userId}&order_id=${orderId}`,
		undefined,
		undefined,
		undefined,
		'DELETE'
	)
		.catch(handleError)
		.then((data) => {
			return data;
		});
};

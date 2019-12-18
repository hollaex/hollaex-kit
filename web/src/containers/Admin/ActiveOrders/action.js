import { requestAuthenticated } from '../../../utils';
 
const handleError = (err) => err.data;

export const requestActiveOrders = (values = {}) => {
	const { side, page = 1, limit = 50 } = values;
	let query = `page=${page}&limit=${limit}`;
	if (side) {
		query = `${query}&side=${side}`
	}
	return requestAuthenticated(`/admin/orders?${query}`)
		.catch(handleError)
		.then((data) => {
			return {
				...data,
				page,
				isRemaining: data.count > page * limit
			};
		});
};
import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

const handleError = (err) => err.data;

export const requestOrders = (user_id, page = 0, limit = 50) => {
	const query = querystring.stringify({
		user_id,
		page,
		limit
	});
	return requestAuthenticated(`/admin/orders/?${query}`)
		.catch(handleError)
		.then((data) => {
			return {
				...data,
				page,
				isRemaining: data.count > page * limit
			};
		});
};
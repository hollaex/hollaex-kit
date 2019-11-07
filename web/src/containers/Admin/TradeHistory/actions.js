import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

const handleError = (err) => err.data;

export const requestTrades = (id, page = 0, limit = 50) => {
	const query = querystring.stringify({
		user_id: id,
		page,
		limit
	});
	return requestAuthenticated(`/admin/trades?${query}`)
		.catch(handleError)
		.then((data) => {
			return {
				...data,
				page,
				isRemaining: data.count > page * limit
			};
		});
}

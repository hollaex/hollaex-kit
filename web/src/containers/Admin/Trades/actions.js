import querystring from 'query-string';

import { requestAuthenticated } from '../../../utils';

export const requestTrades = (id) => {
	const query = querystring.stringify({
		user_id: id,
	});
	return requestAuthenticated(`/admin/trades?${query}`);
};

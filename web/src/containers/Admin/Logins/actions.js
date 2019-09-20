import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

const handleError = (err) => err.data;

export const requestUserLogins = (id) => {
	const query = querystring.stringify({
		user_id: id
	});
	return requestAuthenticated(`/admin/logins?${query}`)
		.catch(handleError)
		.then((data) => {
			return data;
		});
};

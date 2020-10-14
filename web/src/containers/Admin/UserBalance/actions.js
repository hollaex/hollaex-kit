import { requestAuthenticated } from '../../../utils';

const handleError = (err) => err.data;

export const requestUserBalance = (id) =>
	requestAuthenticated(`/admin/user/balance?user_id=${id}`)
		.catch(handleError)
		.then((data) => {
			return data;
		});

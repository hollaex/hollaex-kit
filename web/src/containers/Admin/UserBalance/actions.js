import { requestAuthenticated } from '../../../utils';

const handleError = (err) => err.data;

export const requestUserBalance = (id) =>
	requestAuthenticated(`/admin/user/${id}/balance`)
		.catch(handleError)
		.then((data) => {
			return data;
		});

import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

export const getTransactions = (values) =>
	requestAuthenticated(
		`/admin/bank/transactions?${querystring.stringify(values)}`
	);

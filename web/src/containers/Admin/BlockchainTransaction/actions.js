import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

export const checkTransaction = (currency, transaction_id, address) =>
	requestAuthenticated(
		`/admin/checkTransaction/${currency}/${transaction_id}?${querystring.stringify(
			{ address }
		)}`
	);

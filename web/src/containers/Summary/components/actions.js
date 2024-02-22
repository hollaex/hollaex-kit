import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

export const fetchReferralHistory = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/referral/history?${queryValues}`);
};

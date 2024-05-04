import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

export const fetchReferralHistory = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/referral/history?${queryValues}`);
};

export const fetchUnrealizedFeeEarnings = () => {
	return requestAuthenticated(`/user/referral/unrealized`);
};

export const fetchReferralCodes = () => {
	return requestAuthenticated(`/user/referral/code`);
};

export const generateReferralCode = () => {
	return requestAuthenticated(`/user/referral/generate`);
};

export const postSettleFees = () => {
	const options = {
		method: 'POST',
	};
	return requestAuthenticated(`/user/referral/unrealized`, options);
};

export const postReferralCode = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/user/referral/code`, options);
};

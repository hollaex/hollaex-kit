'use strict';

const {
	generateHashSync,
	generateAffiliationCode
} = require('../utils/security');

const generateUserObject = ({
	id,
	email,
	password,
	network_id,
	is_admin,
	is_supervisor,
	is_support,
	is_kyc,
	is_communicator,
	...rest
}) => {
	const now = new Date();

	return {
		id,
		email,
		password: generateHashSync(password),
		network_id,
		full_name: '',
		gender: false,
		nationality: '',
		phone_number: '',
		activated: true,
		is_admin: is_admin || false,
		is_supervisor: is_supervisor || false,
		is_support: is_support || false,
		is_kyc: is_kyc || false,
		is_communicator: is_communicator || false,
		username: email.toLowerCase().substr(0, email.indexOf('@')),
		affiliation_code: generateAffiliationCode(),
		created_at: now,
		updated_at: now,
		...rest
	};
};

const generateOptionsObject = ({ email }) => ({ email });

module.exports = {
	generateUserObject,
	generateOptionsObject
};
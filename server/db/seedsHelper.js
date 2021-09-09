'use strict';

const {
	generateHashSync,
	generateAffiliationCode
} = require('../utils/security');

const { DEFAULT_ORDER_RISK_PERCENTAGE } = require('../constants');

const ID_DATA_DEFAULT = {
	status: 0,
	type: '',
	number: '',
	issued_date: '',
	expiration_date: '',
	note: ''
};

const SETTINGS_DATA_DEFAULT = {
	notification: {
		popup_order_confirmation: true,
		popup_order_completed: true,
		popup_order_partially_filled: true
	},
	interface: {
		order_book_levels: 10,
		theme: process.env.DEFAULT_THEME || 'white'
	},
	language: process.env.DEFAULT_LANGUAGE || 'en',
	audio: {
		order_completed: true,
		order_partially_completed: true,
		public_trade: false
	},
	risk: {
		order_portfolio_percentage: DEFAULT_ORDER_RISK_PERCENTAGE
	},
	chat: {
		set_username: false
	}
};

const BANK_DATA_DEFAULT = [];

const ADDRESS_DATA_DEFAULT = {
	country: '',
	address: '',
	city: '',
	postal_code: ''
};

const generateUserObject = (
	email,
	password,
	network_id,
	is_admin,
	is_supervisor,
	is_support,
	is_kyc,
	is_communicator,
	opts = { }
) => {
	const now = new Date();

	return {
		email: email.toLowerCase().trim(),
		password: generateHashSync(password),
		network_id: parseInt(network_id),
		full_name: '',
		gender: false,
		email_verified: true,
		verification_level: 1,
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
		settings: JSON.stringify(SETTINGS_DATA_DEFAULT),
		bank_account: JSON.stringify(BANK_DATA_DEFAULT),
		id_data: JSON.stringify(ID_DATA_DEFAULT),
		address: JSON.stringify(ADDRESS_DATA_DEFAULT),
		...opts
	};
};

const generateOptionsObject = ({ email }) => ({ email });

module.exports = {
	generateUserObject,
	generateOptionsObject
};
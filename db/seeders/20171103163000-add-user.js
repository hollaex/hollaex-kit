'use strict';

let {
	ACCOUNTS
} = require('../../constants');
const { generateUserObject } = require('../seedsHelper');
const { uniqBy, remove } = require('lodash');

ACCOUNTS = remove(ACCOUNTS, (account) => {
	return !!account.email;
});
ACCOUNTS = uniqBy(ACCOUNTS, 'email');

const data = ACCOUNTS.map(generateUserObject);

const TABLE = 'Users';

module.exports = {
	up: (queryInterface) => {
		return queryInterface
			.bulkInsert(TABLE, data, {});
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};

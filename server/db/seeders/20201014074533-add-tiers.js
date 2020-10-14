'use strict';

const TABLE = 'Tiers';
const tiers = [
	{
		id: 1,
		name: 'basic',
		description: 'basic tier',
		deposit_limit: -1,
		withdrawal_limit: -1,
		fees: {}
	},
	{
		id: 2,
		name: 'vip',
		description: 'vip tier',
		deposit_limit: -1,
		withdrawal_limit: -1,
		fees: {}
	}
];

module.exports = {
	up: (queryInterface) => queryInterface.bulkInsert(TABLE, tiers, {}),
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};

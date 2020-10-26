'use strict';

const TABLE = 'Tiers';
const tiers = [
	{
		id: 1,
		name: 'basic',
		description: 'basic tier',
		icon: '',
		deposit_limit: 0,
		withdrawal_limit: 0,
		fees: JSON.stringify({
			maker: {
				default: 0.2
			},
			taker: {
				default: 0.2
			}
		})
	},
	{
		id: 2,
		name: 'vip',
		description: 'vip tier',
		deposit_limit: 0,
		icon: '',
		withdrawal_limit: 0,
		fees: JSON.stringify({
			maker: {
				default: 0
			},
			taker: {
				default: 0
			}
		})
	}
];

module.exports = {
	up: (queryInterface) => queryInterface.bulkInsert(TABLE, tiers, {}),
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};

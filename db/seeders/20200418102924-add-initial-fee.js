'use strict';

const TABLE = 'Fees';

const data = [{
	user_id: 1,
	transaction_id: 'init',
	amount: 0,
	currency: 'init'
}];

module.exports = {
	up: (queryInterface) => {
		return queryInterface
			.bulkInsert(TABLE, data, {});
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};

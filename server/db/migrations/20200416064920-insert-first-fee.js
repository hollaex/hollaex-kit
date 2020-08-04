'use strict';

const TABLE = 'Fees';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.query(
			`
			INSERT INTO "${TABLE}" (user_id, transaction_id, amount, currency)
			Select 1, 'init', 0, 'init' Where exists (SELECT * FROM "Users")
			;`
		);
	},
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
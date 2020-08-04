'use strict';

const TABLE = 'Coins';
const COLUMN1 = 'deposit_limits';
const COLUMN2 = 'withdrawal_limits';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN1, {
				type: Sequelize.JSONB,
				allowNull: false,
				defaultValue: {}
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN2, {
					type: Sequelize.JSONB,
					allowNull: false,
					defaultValue: {}
				});
			});
	},
	down: (queryInterface) => {
		return queryInterface
			.removeColumn(TABLE, COLUMN1)
			.then(() => queryInterface.removeColumn(TABLE, COLUMN2));
	}
};
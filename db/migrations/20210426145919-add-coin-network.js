'use strict';

const TABLE = 'Coins';
const COLUMN1 = 'network';
const COLUMN2 = 'withdrawal_fees';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			TABLE,
			COLUMN1,
			{
				type: Sequelize.STRING,
				allowNull: true,
			})
			.then(() => {
				return queryInterface.addColumn(
					TABLE,
					COLUMN2,
					{
						type: Sequelize.JSONB,
						allowNull: true,
					});
			});
	},
	down: (queryInterface) => {
		return queryInterface.removeColumn(TABLE, COLUMN1)
			.then(() => {
				return queryInterface.removeColumn(TABLE, COLUMN2);
			});
	},
};

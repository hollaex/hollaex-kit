'use strict';

const TABLE = 'Users';
const COLUMN1 = 'affiliation_rate';
const COLUMN2 = 'discount';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			TABLE,
			COLUMN1,
			{
				type: Sequelize.DOUBLE,
				defaultValue: 0,
			})
			.then(() => {
				return queryInterface.addColumn(
					TABLE,
					COLUMN2,
					{
						type: Sequelize.DOUBLE,
						defaultValue: 0,
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

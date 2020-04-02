'use strict';

const TABLE = 'Deposits';
const COLUMN1 = 'processing';
const COLUMN2 = 'waiting';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN1, {
				type: Sequelize.DOUBLE,
				allowNull: true
			})
			.then(() => {
				return queryInterface.addColumn(TABLE, COLUMN2, {
					type: Sequelize.DOUBLE,
					allowNull: true
				});
			});
	},
	down: (queryInterface) => {
		return queryInterface.removeColumn(TABLE, COLUMN1)
			.then(() => queryInterface.removeColumn(TABLE, COLUMN2));
	}
};
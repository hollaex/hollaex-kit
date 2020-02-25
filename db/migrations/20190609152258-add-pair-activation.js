'use strict';

const TABLE = 'Pairs';
const COLUMN = 'active';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			});
	},
	down: (queryInterface) => {
		return queryInterface.removeColumn(TABLE, COLUMN);
	}
};
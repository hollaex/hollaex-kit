'use strict';
const TABLE = 'Users';
const COLUMN = 'discount';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.DOUBLE,
				defaultValue: 0
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
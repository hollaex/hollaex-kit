'use strict';
const TABLE = 'Plugins';
const COLUMN = 'type';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.STRING
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
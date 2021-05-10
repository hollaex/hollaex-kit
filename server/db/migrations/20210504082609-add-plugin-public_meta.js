'use strict';
const TABLE = 'Plugins';
const COLUMN = 'public_meta';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface
			.addColumn(TABLE, COLUMN, {
				type: Sequelize.JSONB,
				defaultValue: {}
			}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
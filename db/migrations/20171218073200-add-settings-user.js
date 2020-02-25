'use strict';

const TABLE = 'Users';
const COLUMN = 'settings';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.JSONB,
			defaultValue: {
				language: 'en'
			}
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
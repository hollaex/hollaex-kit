'use strict';

const TABLE = 'Deposits';
const COLUMN = 'rejected';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
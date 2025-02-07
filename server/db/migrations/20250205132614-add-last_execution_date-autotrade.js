'use strict';

const TABLE = 'AutoTradeConfigs';
const COLUMN = 'last_execution_date';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.DATE,
			allowNull: true
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
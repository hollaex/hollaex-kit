'use strict';

const TABLE = 'Trades';
const COLUMN = 'symbol';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			defaultValue: 'btc',
			allowNull: false
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
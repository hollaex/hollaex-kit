'use strict';

const TABLE = 'P2pDeals';
const COLUMN = 'dynamic_pair';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			allowNull: true
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
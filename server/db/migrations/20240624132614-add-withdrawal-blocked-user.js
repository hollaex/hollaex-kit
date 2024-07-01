'use strict';

const TABLE = 'Users';
const COLUMN = 'withdrawal_blocked';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.DATE,
			allowNull: true
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
'use strict';

const TABLE = 'P2pTransactions';
const COLUMN = 'transaction_status';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.ENUM('active', 'cancelled', 'complete', 'appealed', 'expired', 'closed'),
			allowNull: false,
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.ENUM('active', 'cancelled', 'complete', 'appealed', 'expired'),
			allowNull: false,
		})
};
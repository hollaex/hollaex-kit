'use strict';

const TABLE = 'Deposits';
const COLUMN = 'updated_at';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('NOW()')
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
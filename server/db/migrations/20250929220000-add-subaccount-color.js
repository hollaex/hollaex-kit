'use strict';

const TABLE = 'Subaccounts';
const COLUMN = 'color';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: '#000000'
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};



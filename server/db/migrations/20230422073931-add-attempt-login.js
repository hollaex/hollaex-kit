'use strict';

const TABLE = 'Logins';
const COLUMN = 'attempt';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};

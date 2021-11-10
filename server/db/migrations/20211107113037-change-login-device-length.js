'use strict';

const TABLE = 'Logins';
const COLUMN = 'device';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.STRING(1000),
			allowNull: true
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			allowNull: false
		})
};
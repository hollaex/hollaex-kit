'use strict';

const TABLE = 'Plugins';
const COLUMN = 'script';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.TEXT,
			allowNull: true
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.TEXT,
			allowNull: false
		})
};
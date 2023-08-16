'use strict';

const TABLE = 'Brokers';
const COLUMN = 'symbol';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			allowNull: false,
			unique: false,
		})
};
'use strict';

const TABLE = 'Brokers';
const COLUMN = 'spread';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.DOUBLE,
			defaultValue: 0,
			allowNull: true
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: true
		})
};
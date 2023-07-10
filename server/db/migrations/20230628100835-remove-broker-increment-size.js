'use strict';

const TABLE = 'Brokers';
const COLUMN = 'increment_size';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN),
	down: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.DOUBLE,
			allowNull: false
		})
};
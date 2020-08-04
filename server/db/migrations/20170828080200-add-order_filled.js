'use strict';

const TABLE = 'Orders';
const COLUMN = 'filled';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.DOUBLE,
			defaultValue: 0
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};

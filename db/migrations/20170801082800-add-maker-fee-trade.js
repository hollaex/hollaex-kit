'use strict';

const TABLE = 'Trades';
const COLUMN = 'maker_fee';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.FLOAT,
			defaultValue: 0
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};

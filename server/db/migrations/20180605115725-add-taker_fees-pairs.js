'use strict';

const TABLE = 'Pairs';
const COLUMN = 'taker_fees';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			allowNull: false,
			type: Sequelize.JSONB,
			defaultValue: { '1': 0.5, '2': 0.3, '3': 0.2, '4': 0.2, '5': 0, '6': 0 }
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};

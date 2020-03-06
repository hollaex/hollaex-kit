'use strict';

const TABLE = 'Pairs';
const COLUMN = 'maker_fees';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			allowNull: false,
			type: Sequelize.JSONB,
			defaultValue: {
				'1': 0.25,
				'2': 0.2,
				'3': 0.15,
				'4': 0.05,
				'5': 0,
				'6': 0
			}
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};

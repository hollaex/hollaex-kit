'use strict';

const TABLE = 'Tiers';
const COLUMN = 'native_currency_limit';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
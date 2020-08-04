'use strict';

const TABLE = 'Users';
const COLUMN = 'custom_fee';

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn(
		TABLE,
		COLUMN,
		{
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		}
	),
	down: (queryInterface) => queryInterface.removeColumn(TABLE, COLUMN),
};

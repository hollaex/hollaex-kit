'use strict';

const TABLE = 'Stakes';
const COLUMN = 'is_automatic';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}),
	down: (queryInterface) => queryInterface.removeColumn(TABLE, COLUMN)
};

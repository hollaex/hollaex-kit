'use strict';

const TABLE = 'Affiliations';
const COLUMN = 'earning_rate';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.DOUBLE,
			allowNull: false
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
'use strict';

const TABLE = 'Stakers';
const COLUMN = 'nav';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.DOUBLE,
			allowNull: true
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};


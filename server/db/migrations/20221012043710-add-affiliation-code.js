'use strict';

const TABLE = 'Affiliations';
const COLUMN = 'code';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.STRING,
			allowNull: true
		}),
	down: (queryInterface) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
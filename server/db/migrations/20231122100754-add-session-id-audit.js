'use strict';

const TABLE = 'Audits';
const COLUMN = 'session_id';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.INTEGER,
			allowNull: true
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
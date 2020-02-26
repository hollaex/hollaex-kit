'use strict';

const TABLE = 'Users';
const COLUMN = 'updated_at';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: Sequelize.literal('NOW()')
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.DATE,
			allowNull: false
		})
};
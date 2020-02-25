'use strict';

const TABLE = 'Orders';
const COLUMN = 'size';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.DOUBLE,
			defaultValue: 0,
			allowNull: false
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.changeColumn(TABLE, COLUMN, {
			type: Sequelize.BIGINT,
			defaultValue: 0,
			allowNull: false
		})
};
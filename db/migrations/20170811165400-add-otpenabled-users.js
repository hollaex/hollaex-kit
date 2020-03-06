'use strict';

const TABLE = 'Users';
const COLUMN = 'otp_enabled';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}),
	down: (queryInterface, Sequelize) =>
		queryInterface.removeColumn(TABLE, COLUMN)
};
'use strict';

const TABLE = 'Users';
const OLD_COLUMN = 'is_tech';
const NEW_COLUMN = 'is_communicator';

module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.renameColumn(TABLE, OLD_COLUMN, NEW_COLUMN),
	down: (queryInterface, Sequelize) =>
		queryInterface.renameColumn(TABLE, NEW_COLUMN, OLD_COLUMN)
};
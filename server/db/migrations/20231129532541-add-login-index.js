'use strict';

const TABLE = 'Logins';
const COLUMN = 'user_id';

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addIndex(TABLE, [COLUMN]),
	down: (queryInterface, Sequelize) => queryInterface.removeIndex(TABLE, COLUMN)
};
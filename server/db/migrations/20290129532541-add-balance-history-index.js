'use strict';

const TABLE = 'BalanceHistories';
const COLUMN = 'user_id';

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addIndex(TABLE, [COLUMN]),
	down: (queryInterface, Sequelize) => queryInterface.removeIndex(TABLE, COLUMN)
};
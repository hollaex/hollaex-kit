'use strict';

const TABLE = 'BalanceHistories';
const COLUMN = 'user_id';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		try {
			await queryInterface.addIndex(TABLE, [COLUMN]);
		} catch (error) {
			return error;
		}
	},
	down: async (queryInterface, Sequelize) => {
		try {
			await queryInterface.removeIndex(TABLE, COLUMN);
		} catch (error) {
			return error;
		}
	}
};

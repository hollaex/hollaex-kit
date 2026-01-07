'use strict';

const TABLE = 'Users';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(TABLE, 'is_subaccount', {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn(TABLE, 'is_subaccount');
	}
};
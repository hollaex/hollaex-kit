'use strict';

const TABLE = 'Subaccounts';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(TABLE, 'label', {
			type: Sequelize.STRING,
			allowNull: true
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn(TABLE, 'label');
	}
};
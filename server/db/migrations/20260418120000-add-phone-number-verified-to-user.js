'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Users', 'phone_number_verified', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		});
	},

	down: async (queryInterface) => {
		await queryInterface.removeColumn('Users', 'phone_number_verified');
	}
};

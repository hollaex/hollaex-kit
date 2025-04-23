'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Roles', 'color', {
			type: Sequelize.STRING,
			allowNull: true
		});
		await queryInterface.addColumn('Roles', 'restrictions', {
			type: Sequelize.JSONB,
			allowNull: true
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('Users', 'color');
		await queryInterface.removeColumn('Users', 'restrictions');
	}
};

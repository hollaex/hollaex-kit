'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Sessions', 'meta', {
			type: Sequelize.JSONB,
			allowNull: true
		});
	},
	down: async (queryInterface) => {
		await queryInterface.removeColumn('Sessions', 'meta');
	}
};



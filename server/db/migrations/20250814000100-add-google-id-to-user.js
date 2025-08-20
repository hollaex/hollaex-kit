'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Users', 'google_id', {
			type: Sequelize.STRING,
			allowNull: true,
			unique: true
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('Users', 'google_id');
	}
};



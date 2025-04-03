'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('Users', 'role_id', {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'Roles',
				key: 'id'
			},
			onDelete: 'CASCADE'
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('Users', 'role_id');
	}
};

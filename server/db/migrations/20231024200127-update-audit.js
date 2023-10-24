'use strict';

const TABLE = 'Audits';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(TABLE, 'subject', {
			type: Sequelize.STRING,
			allowNull: false
		})
		await queryInterface.addColumn(TABLE, 'user_id', {
			type: Sequelize.INTEGER,
			onDelete: 'CASCADE',
			allowNull: true,
			references: {
				model: 'Users',
				key: 'id',
			},
		})
		console.log("D")
		await queryInterface.removeColumn(TABLE, 'admin_id')
		await queryInterface.removeColumn(TABLE, 'event')
		
	},
	down: (queryInterface, Sequelize) =>
	new Promise((resolve) => {
		resolve();
	})
};
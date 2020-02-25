'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Status',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
					allowNull: true
				},
				activated: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				initialized: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				blocked: {
					type: Sequelize.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				activation_code: {
					type: Sequelize.STRING,
					allowNull: true
				},
				created_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('NOW()')
				},
				updated_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('NOW()')
				}
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface) => queryInterface.dropTable('Status')
};
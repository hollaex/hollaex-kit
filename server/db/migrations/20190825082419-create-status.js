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
				constants: {
					type: Sequelize.JSONB,
					defaultValue: {}
				},
				secrets: {
					type: Sequelize.JSONB,
					defaultValue: {}
				},
				kit: {
					type: Sequelize.JSONB,
					defaultValue: {}
				},
				api_key: {
					type: Sequelize.STRING,
					allowNull: true
				},
				api_secret: {
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
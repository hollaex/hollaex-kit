'use strict';

const TABLE_NAME = 'Roles';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			TABLE_NAME,
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				role_name: {
					type: Sequelize.STRING,
					unique: true,
					allowNull: false,
				},
				description: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				color: {
					type: Sequelize.STRING,
					allowNull: true
				},
				permissions: {
					type: Sequelize.ARRAY(Sequelize.STRING),
					allowNull: false,
					defaultValue: []
				},
				configs: {
					type: Sequelize.ARRAY(Sequelize.STRING),
					allowNull: false,
					defaultValue: []
				},
				restrictions: {
					type: Sequelize.JSONB,
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
	down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};

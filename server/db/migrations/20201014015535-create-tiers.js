'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Tiers',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				description: {
					type: Sequelize.STRING,
					allowNull: false
				},
				deposit_limit: {
					type: Sequelize.DOUBLE,
					defaultValue: 0
				},
				withdrawal_limit: {
					type: Sequelize.DOUBLE,
					defaultValue: 0
				},
				fees: {
					type: Sequelize.JSONB,
					defaultValue: {}
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
				},

			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface) => queryInterface.dropTable('Tiers')
};
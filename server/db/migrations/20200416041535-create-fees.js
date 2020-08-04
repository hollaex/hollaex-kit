'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Fees',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				user_id: {
					type: Sequelize.INTEGER,
					onDelete: 'CASCADE',
					allowNull: false,
					references: {
						model: 'Users',
						key: 'id'
					}
				},
				transaction_id: {
					type: Sequelize.STRING,
					allowNull: false
				},
				amount: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				currency: {
					type: Sequelize.STRING,
					allowNull: false
				},
				timestamp: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('NOW()')
				}
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface) => queryInterface.dropTable('Fees')
};
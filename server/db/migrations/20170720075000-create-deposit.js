'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Deposits',
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
				address: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				transaction_id: {
					type: Sequelize.STRING,
					allowNull: false
				},
				status: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				amount: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				type: {
					type: Sequelize.STRING,
					allowNull: false
				},
				currency: {
					type: Sequelize.STRING,
					allowNull: false
				},
				created_at: {
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Deposits')
};
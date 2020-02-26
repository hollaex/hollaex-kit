'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Orders',
			{
				id: {
					allowNull: false,
					unique: true,
					primaryKey: true,
					type: Sequelize.UUID
				},
				created_by: {
					type: Sequelize.INTEGER,
					onDelete: 'CASCADE',
					allowNull: false,
					references: {
						model: 'Users',
						key: 'id'
					}
				},
				side: {
					type: Sequelize.ENUM('buy', 'sell'),
					allowNull: false
				},
				type: {
					type: Sequelize.ENUM('market', 'limit'),
					allowNull: false
				},
				size: {
					type: Sequelize.BIGINT,
					allowNull: false
				},
				price: {
					type: Sequelize.INTEGER,
					allowNull: false
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Orders')
};

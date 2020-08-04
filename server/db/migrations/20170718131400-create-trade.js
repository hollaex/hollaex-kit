'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Trades',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				maker_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'Users',
						key: 'id'
					}
				},
				taker_id: {
					type: Sequelize.INTEGER,
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
				size: {
					type: Sequelize.BIGINT,
					allowNull: false
				},
				price: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				timestamp: {
					defaultValue: Sequelize.literal('NOW()'),
					allowNull: false,
					type: Sequelize.DATE
				}
			},
			{
				timestamps: false,
				underscored: true
			}
		);
	},
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Trades')
};
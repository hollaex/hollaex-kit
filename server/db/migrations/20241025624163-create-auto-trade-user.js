'use strict';

const TABLE_NAME = 'AutoTradeConfigs';

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
				user_id: {
					type: Sequelize.INTEGER,
					onDelete: 'CASCADE',
					allowNull: false,
					references: {
						model: 'Users',
						key: 'id'
					}
				},
				spend_coin: {
					type: Sequelize.STRING,
					allowNull: false
				},
				buy_coin: {
					type: Sequelize.STRING,
					allowNull: false
				},
				spend_amount: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				frequency: {
					type: Sequelize.ENUM('daily', 'weekly', 'monthly'),
					allowNull: false
				},
				week_days: {
					type: Sequelize.ARRAY(Sequelize.INTEGER),
					allowNull: true
				},
				day_of_month: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				trade_hour: {
					type: Sequelize.INTEGER, 
					allowNull: false,
					defaultValue: 0
				},
				description: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				active: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: true
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

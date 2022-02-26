'use strict';

const TABLE = 'Brokers';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			TABLE,
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				symbol: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				buy_price: {
					type: Sequelize.DOUBLE,
					allowNull: false,
				},
				sell_price: {
					type: Sequelize.DOUBLE,
					allowNull: false,
				},
				paused: {
					type: Sequelize.BOOLEAN,
					allowNull: false
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
				min_size: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				max_size: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				increment_size: {
					type: Sequelize.DOUBLE,
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
	down: (queryInterface) => queryInterface.dropTable(TABLE)
};

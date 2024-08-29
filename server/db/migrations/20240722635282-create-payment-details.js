'use strict';

const TABLE_NAME = 'PaymentDetails';

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
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				label: {
					type: Sequelize.STRING,
					allowNull: true
				},
				details: {
					type: Sequelize.JSONB,
					allowNull: false,
				},
				is_p2p: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				is_fiat_control: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				status: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0
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

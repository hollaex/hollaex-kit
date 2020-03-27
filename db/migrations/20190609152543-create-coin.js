'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Coins',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				fullname: {
					type: Sequelize.STRING,
					allowNull: false
				},
				symbol: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				active: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				allow_deposit: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false,
				},
				allow_withdrawal: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false,
				},
				withdrawal_fee: {
					type: Sequelize.DOUBLE,
					defaultValue: 0,
					allowNull: false
				},
				min: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				max: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				increment_unit: {
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
	down: (queryInterface) => queryInterface.dropTable('Coins')
};
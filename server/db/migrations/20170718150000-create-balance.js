'use strict';

const { DataTypes } = require('sequelize');
const { BALANCE_KEYS } = require('../../constants');

const balances = {};
BALANCE_KEYS.forEach(balance => {
	balances[balance] = {
		type: DataTypes.DOUBLE,
		allowNull: false,
		defaultValue: 0
	};
});

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Balances',
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
					unique: true,
					references: {
						model: 'Users',
						key: 'id'
					}
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Balances')
};

'use strict';

const { CURRENCIES } = require('../../constants');
const { DataTypes } = require('sequelize');
const TABLE = 'Limits';

const items = {};
CURRENCIES.forEach(currency => {
	items[`${currency}_deposit_daily`] = {
		allowNull: false,
		type: DataTypes.DOUBLE,
		defaultValue: 0
	};
	items[`${currency}_withdraw_daily`] = {
		allowNull: false,
		type: DataTypes.DOUBLE,
		defaultValue: 0
	};
});


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
				verification_level: {
					allowNull: false,
					type: Sequelize.INTEGER
				},
				... items,
				taker_fee: {
					allowNull: false,
					type: Sequelize.DOUBLE,
					defaultValue: 0
				},
				maker_fee: {
					allowNull: false,
					type: Sequelize.DOUBLE,
					defaultValue: 0
				},
				created_at: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('NOW()'),
					allowNull: false
				},
				updated_at: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('NOW()'),
					allowNull: false
				}
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface, Sequelize) => queryInterface.dropTable(TABLE)
};
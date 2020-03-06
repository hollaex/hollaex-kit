'use strict';

module.exports = function(sequelize, DataTypes) {
	const Coin = sequelize.define(
		'Coin',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			fullname: {
				type: DataTypes.STRING,
				allowNull: false
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false
			},
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			allow_deposit: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			allow_withdrawal: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			withdrawal_fee: {
				type: DataTypes.DOUBLE,
				defaultValue: 0,
				allowNull: false
			},
			min: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			max: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			increment_unit: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			deposit_limits: {
				type: DataTypes.JSONB,
				allowNull: false,
				defaultValue: {}
			},
			withdrawal_limits: {
				type: DataTypes.JSONB,
				allowNull: false,
				defaultValue: {}
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('NOW()')
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('NOW()')
			}
		},
		{
			timestamps: true,
			underscored: true
		}
	);
	return Coin;
};

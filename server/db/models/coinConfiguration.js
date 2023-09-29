'use strict';

module.exports = function (sequelize, DataTypes) {
	const CoinConfiguration = sequelize.define(
		'CoinConfiguration',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			symbol: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			fullname: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			logo: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			increment_unit: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
			withdrawal_fee: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
			withdrawal_fees: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
			deposit_fees: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
			withdrawal_limit: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
			deposit_limit: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
			mounthly_withdrawal_limit: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            }
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'CoinConfigurations'
		}
	);
    
	return CoinConfiguration;
};

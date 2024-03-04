'use strict';

module.exports = function (sequelize, DataTypes) {
    const P2PAdminConfig = sequelize.define(
        'p2pAdminConfig',
        {
            id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
            enable: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            bank_payment_methods: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            starting_merchant_tier: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            starting_user_tier: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            digital_currencies: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
            },
            fiat_currencies: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
            },
            side: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            operator_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            merchant_fee: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            buyer_fee: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            underscored: true,
            tableName: 'p2pAdminConfigs',
        }
    );

    return P2PAdminConfig;
};
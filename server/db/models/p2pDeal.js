'use strict';

module.exports = function (sequelize, DataTypes) {
    const Deal = sequelize.define(
        'p2pDeal',
        {
            id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
            merchant_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            side: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price_type: {
                type: DataTypes.ENUM('static', 'dynamic'),
                allowNull: false,
            },
            buying_asset: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            spending_asset: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            exchange_rate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            spread: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
            total_order_amount: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            min_order_value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            max_order_value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            terms: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            auto_response: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            payment_methods: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'p2pDeals',
        }
    );

    return Deal;
};

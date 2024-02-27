'use strict';

module.exports = function (sequelize, DataTypes) {
    const Transaction = sequelize.define(
        'P2pTransaction',
        {
            id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
            transaction_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            deal_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Deals',
					key: 'id'
				}
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
            buyer_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            locked_asset_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount_digital_currency: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount_fiat: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payment_method_used: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            buyer_status: {
                type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'appeal'),
                allowNull: false,
            },
            merchant_status: {
                type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'appeal'),
                allowNull: false,
            },
            cancellation_reason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            transaction_expired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            merchant_release_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            transaction_duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            transaction_status: {
                type: DataTypes.ENUM('active', 'cancelled', 'complete'),
                allowNull: false,
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'P2pTransactions',
        }
    );

    return Transaction;
};

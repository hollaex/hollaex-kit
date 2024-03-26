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
					model: 'p2pDeals',
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
            user_id: {
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
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            amount_fiat: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            payment_method_used: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            user_status: {
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
            settled_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            transaction_duration: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            transaction_status: {
                type: DataTypes.ENUM('active', 'cancelled', 'complete', 'appealed', 'expired'),
                allowNull: false,
            },
            messages: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'P2pTransactions',
        }
    );

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            as: 'merchant',
            foreignKey: 'merchant_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });

        Transaction.belongsTo(models.P2pDeal, {
            as: 'deal',
            foreignKey: 'deal_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
	};

    return Transaction;
};

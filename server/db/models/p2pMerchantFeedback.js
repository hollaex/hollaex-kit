'use strict';

module.exports = function (sequelize, DataTypes) {
    const MerchantsFeedback = sequelize.define(
        'P2pMerchantsFeedback',
        {
            transaction_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'p2pTransactions',
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
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'P2pMerchantsFeedback',
        }
    );

    MerchantsFeedback.associate = (models) => {
        MerchantsFeedback.belongsTo(models.User, {
            as: 'merchant',
            foreignKey: 'merchant_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
        MerchantsFeedback.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
        MerchantsFeedback.belongsTo(models.P2pTransaction, {
            as: 'transaction',
            foreignKey: 'transaction_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
	};

    return MerchantsFeedback;
};

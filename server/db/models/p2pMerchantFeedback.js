'use strict';

module.exports = function (sequelize, DataTypes) {
    const MerchantsFeedback = sequelize.define(
        'p2pMerchantsFeedback',
        {
            merchant_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            transaction_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            underscored: true,
            tableName: 'p2pMerchantsFeedback',
        }
    );

    return MerchantsFeedback;
};

'use strict';

module.exports = function (sequelize, DataTypes) {
    const MerchantsFeedback = sequelize.define(
        'p2pMerchantsFeedback',
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
            timestamps: false,
            underscored: true,
            tableName: 'p2pMerchantsFeedback',
        }
    );

    return MerchantsFeedback;
};

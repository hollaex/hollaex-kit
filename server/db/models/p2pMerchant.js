'use strict';

module.exports = function (sequelize, DataTypes) {
    const Merchant = sequelize.define(
        'P2pMerchant',
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            blocked_users: {
                type: DataTypes.ARRAY(DataTypes.INTEGER),
                allowNull: true,
            },
            // ADD OTHER STUFF
        },
        {
            timestamps: false,
            underscored: true,
            tableName: 'P2pMerchants',
        }
    );

    return Merchant;
};

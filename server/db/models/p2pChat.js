'use strict';

module.exports = function (sequelize, DataTypes) {
    const Chat = sequelize.define(
        'p2pChat',
        {
            id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
            transaction_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'P2pTransactions',
					key: 'id'
				}
			},
			sender_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            underscored: true,
            tableName: 'p2pChats',
        }
    );

    return Chat;
};

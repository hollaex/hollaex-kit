'use strict';

module.exports = function (sequelize, DataTypes) {
    const Dispute = sequelize.define(
        'P2pDispute',
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
            initiator_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            defendant_id: {
                type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            resolution: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            timestamps: false,
            underscored: true,
            tableName: 'P2pDisputes',
        }
    );

    return Dispute;
};

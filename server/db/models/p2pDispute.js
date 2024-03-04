'use strict';

module.exports = function (sequelize, DataTypes) {
    const Dispute = sequelize.define(
        'P2PDispute',
        {
            transaction_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'P2pTransactions',
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
            reason: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            resolution: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
            },
            participant_ids: {
                type: DataTypes.ARRAY(DataTypes.INTEGER),
                allowNull: true,
            },
            chat_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            underscored: true,
            tableName: 'P2PDisputes',
        }
    );

    return Dispute;
};

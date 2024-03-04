'use strict';

const TABLE = 'p2pTransactions';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            transaction_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            deal_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Deals',
					key: 'id'
				}
			},
            merchant_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            buyer_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            locked_asset_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            amount_digital_currency: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            amount_fiat: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            payment_method_used: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            buyer_status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'appeal'),
                allowNull: false,
            },
            merchant_status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'appeal'),
                allowNull: false,
            },
            cancellation_reason: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            transaction_expired: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            merchant_release_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            transaction_duration: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            transaction_status: {
                type: Sequelize.ENUM('active', 'cancelled', 'complete'),
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()'),
            },
        });
    },
    down: (queryInterface) => queryInterface.dropTable(TABLE),
};

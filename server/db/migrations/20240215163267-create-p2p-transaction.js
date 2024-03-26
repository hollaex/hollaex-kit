'use strict';

const TABLE = 'P2pTransactions';

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
					model: 'P2pDeals',
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
            user_id: {
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
            price: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            payment_method_used: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            user_status: {
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
            settled_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            transaction_duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            transaction_status: {
                type: Sequelize.ENUM('active', 'cancelled', 'complete', 'appealed', 'expired'),
                allowNull: false,
            },
            messages: {
                type: Sequelize.JSONB,
                allowNull: false,
            },
            created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()'),
			},
        },
        {
			timestamps: true,
			underscored: true
		});
    },
    down: (queryInterface) => queryInterface.dropTable(TABLE),
};

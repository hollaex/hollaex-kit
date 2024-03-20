'use strict';

const TABLE = 'P2pDeals';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE, {
            id: {
               allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            side: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            price_type: {
                type: Sequelize.ENUM('static', 'dynamic'),
                allowNull: false,
            },
            buying_asset: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            spending_asset: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            exchange_rate: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            margin: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            total_order_amount: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            min_order_value: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            max_order_value: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            terms: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            auto_response: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            payment_methods: {
                type: Sequelize.JSONB,
                allowNull: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
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
		}
        );
    },
    down: (queryInterface) => queryInterface.dropTable(TABLE),
};

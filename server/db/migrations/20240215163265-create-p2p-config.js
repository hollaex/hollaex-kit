'use strict';

const TABLE = 'P2PAdminConfigs';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE, {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
            enable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            bank_payment_methods: {
                type: Sequelize.JSONB,
                allowNull: false,
            },
            starting_merchant_tier: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            starting_user_tier: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            digital_currencies: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: false,
            },
            fiat_currencies: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: false,
            },
            side: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            operator_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            merchant_fee: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            buyer_fee: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			}
        });
    },
    down: (queryInterface) => queryInterface.dropTable(TABLE),
};

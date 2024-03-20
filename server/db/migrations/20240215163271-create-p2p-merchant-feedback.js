'use strict';

const TABLE = 'P2pMerchantsFeedback';

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
            user_id: {
                type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
            },
            transaction_id: {
                type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'p2pTransactions',
					key: 'id'
				}
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            comment: {
                type: Sequelize.STRING,
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

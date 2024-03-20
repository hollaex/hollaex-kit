'use strict';

const TABLE = 'P2pDisputes';

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
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'p2pTransactions',
					key: 'id'
				}
			},
            initiator_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            defendant_id: {
                type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            resolution: {
                type: Sequelize.TEXT,
                allowNull: true,
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

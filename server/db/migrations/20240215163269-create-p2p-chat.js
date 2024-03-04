'use strict';

const TABLE = 'P2PChats';

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
					model: 'P2PTransactions',
					key: 'id'
				}
            },
            sender_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            message: {
                type: Sequelize.STRING,
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

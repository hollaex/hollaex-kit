'use strict';

const TABLE = 'P2pMerchants';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            blocked_users: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true,
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
        },
        {
			timestamps: true,
			underscored: true
		}
        );
    },
    down: (queryInterface) => queryInterface.dropTable(TABLE),
};

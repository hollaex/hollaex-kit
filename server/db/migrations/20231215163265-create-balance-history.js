'use strict';

const TABLE_NAME = 'BalanceHistories';

module.exports = {
	up: (queryInterface, Sequelize) => {
	return queryInterface.createTable(TABLE_NAME, {
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
		balance: {
			type: Sequelize.JSONB,
			allowNull: false,
		},
		total: {
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
	},
	{
		timestamps: true,
		underscored: true
	});
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};
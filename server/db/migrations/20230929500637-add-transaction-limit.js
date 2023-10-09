'use strict';

const TABLE = 'TransactionLimits';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			TABLE,
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				tier: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				amount: {
					type: Sequelize.DOUBLE,
					allowNull: false,
				},
				currency: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				limit_currency: {
            	    type: Sequelize.STRING,
            	    allowNull: false,
            	},
				type: {
            	    type: Sequelize.ENUM('withdrawal', 'deposit'),
            	    allowNull: false,
            	},
				period: {
            	    type: Sequelize.ENUM('24h', '1mo'),
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
			}
		);
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE)
};

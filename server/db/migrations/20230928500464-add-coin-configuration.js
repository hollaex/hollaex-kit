'use strict';

const TABLE = 'CoinConfigurations';

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
				symbol: {
					type: Sequelize.STRING,
					unique: true,
					allowNull: false,
				},
				fullname: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				logo: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				increment_unit: {
            	    type: Sequelize.DOUBLE,
            	    allowNull: false,
            	},
				withdrawal_fee: {
            	    type: Sequelize.DOUBLE,
            	    allowNull: false,
            	},
				withdrawal_fees: {
            	    type: Sequelize.JSONB,
            	    allowNull: true,
            	},
				deposit_fees: {
            	    type: Sequelize.JSONB,
            	    allowNull: true,
            	},
				withdrawal_limit: {
            	    type: Sequelize.DOUBLE,
            	    allowNull: true,
            	},
				deposit_limit: {
            	    type: Sequelize.DOUBLE,
            	    allowNull: true,
            	},
				mounthly_withdrawal_limit: {
            	    type: Sequelize.DOUBLE,
            	    allowNull: true,
            	},
            	active: {
            	    type: Sequelize.BOOLEAN,
            	    defaultValue: true,
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

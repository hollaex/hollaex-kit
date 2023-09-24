'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Stakes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
			},
			currency: {
				type: Sequelize.STRING,
				allowNull: false
			},
			reward_currency: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			account_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			apy: {
				type: Sequelize.DOUBLE,
				allowNull: false
			},
			duration: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			slashing: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			slashing_principle_percentage: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			slashing_earning_percentage: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			slashing_reward: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			early_unstake: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			min_amount: {
				type: Sequelize.DOUBLE,
				allowNull: false
			},
			max_amount: {
				type: Sequelize.DOUBLE,
				allowNull: false
			},
			status: {
				type: Sequelize.ENUM('uninitialized', 'active', 'paused', 'terminated'),
				allowNull: false,
				defaultValue: 'uninitialized',
			},
			onboarding: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			disclaimer: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			paused_date: {
				allowNull: true,
				type: Sequelize.DATE,
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
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Stakes');
	},
};

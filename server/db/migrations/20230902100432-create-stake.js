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
				allowNull: true,
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
				allowNull: true,
			},
			duration: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			slashing: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			slashing_percentage: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			slashing_reward: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			early_unstake: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			min_amount: {
				type: Sequelize.DOUBLE,
				allowNull: true,
			},
			max_amount: {
				type: Sequelize.DOUBLE,
				allowNull: true,
			},
			status: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			onboarding: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			},
			disclaimer: {
				type: Sequelize.STRING,
				allowNull: true,
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

'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Stakers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
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
			stake_id: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Stakes',
					key: 'id',
				},
			},
			amount: {
				type: Sequelize.DOUBLE,
				allowNull: false,
			},
			currency: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			reward: {
				type: Sequelize.DOUBLE,
				allowNull: false,
				defaultValue: 0
			},
			slashed: {
				type: Sequelize.DOUBLE,
				allowNull: false,
				defaultValue: 0
			},
			status: {
				type: Sequelize.ENUM('staking', 'unstaking', 'closed'),
				allowNull: false
			},
			closing: {
				type: Sequelize.DATE,
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
		await queryInterface.dropTable('Stakers');
	},
};

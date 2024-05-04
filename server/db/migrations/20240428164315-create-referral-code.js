'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('ReferralCodes', {
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
			code: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true
			},
			earning_rate: {
				type: Sequelize.DOUBLE,
				allowNull: false
			},
			discount: {
				type: Sequelize.DOUBLE,
				allowNull: false,
				defaultValue: 0
			},
			referral_count: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
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
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('ReferralCodes');
	},
};
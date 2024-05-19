'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('ReferralHistories', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			referer: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			referee: {
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
				allowNull: true,
			},
			coin: {
				type: Sequelize.STRING,
				allowNull: false
			},
			accumulated_fees: {
				type: Sequelize.DOUBLE,
				allowNull: false
			},
			status: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			last_settled: {
				type: Sequelize.DATE,
				allowNull: false
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
		await queryInterface.dropTable('ReferralHistories');
	},
};
'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Referralhistories', {
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
			coin: {
				type: Sequelize.STRING,
				allowNull: false
			},
			accumulated_fees: {
				type: Sequelize.DOUBLE,
				allowNull: false
			},
			timestamp: {
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
		await queryInterface.dropTable('Referralhistories');
	},
};
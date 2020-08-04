'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'VerificationImages',
			{
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
				front: {
					type: Sequelize.STRING,
					allowNull: false
				},
				back: {
					type: Sequelize.STRING,
					allowNull: false
				},
				proof_of_residency: {
					type: Sequelize.STRING,
					allowNull: false
				},
				updated_at: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: Sequelize.literal('NOW()')
				},
				created_at: {
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
	down: (queryInterface, Sequelize) =>
		queryInterface.dropTable('VerificationImages')
};
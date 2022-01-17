'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			'Users',
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				email: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				},
				first_name: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				last_name: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				gender: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				nationality: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				dob: {
					type: Sequelize.DATE
				},
				address: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				phone_number: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				id_type: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				id_number: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				bank_name: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				crypto_wallet: {
					type: Sequelize.JSONB,
					defaultValue: {}
				},
				bank_account_number: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				verification_level: {
					type: Sequelize.INTEGER,
					defaultValue: 0
				},
				note: {
					type: Sequelize.STRING,
					defaultValue: ''
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
				},
				is_admin: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				is_supervisor: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				is_support: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				is_kyc: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				is_tech: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				}
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
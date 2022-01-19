'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Audits', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			admin_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			event: {
				type: Sequelize.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.JSONB,
				defaultValue: {}
			},
			ip: {
				type: Sequelize.STRING,
				allowNull: false
			},
			domain: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: ''
			},
			timestamp: {
				defaultValue: Sequelize.literal('NOW()'),
				allowNull: false,
				type: Sequelize.DATE
			}
		}, {
			timestamps: false,
			underscored: true
		});
	},
	down: (queryInterface) => queryInterface.dropTable('Audits')
};

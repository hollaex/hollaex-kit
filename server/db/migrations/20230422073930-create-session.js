'use strict';
const { ROLES } = require('../../constants');
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Sessions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			token: {
				type: Sequelize.STRING(1000),
				allowNull: false
			},
			login_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Logins',
					key: 'id'
				}
			},
			status: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			last_seen: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()')
			},
			expiry_date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ROLES.USER
            },
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()')
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('NOW()')
			}
		}, {
			underscored: true
		});
	},
	down: (queryInterface) => queryInterface.dropTable('Sessions')
};

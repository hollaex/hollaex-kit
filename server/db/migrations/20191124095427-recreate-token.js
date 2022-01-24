'use strict';

const { ROLES, TOKEN_TYPES } = require('../../constants');
const TABLE_NAME = 'Tokens';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.dropTable(TABLE_NAME).then(
			() => {
				return queryInterface.createTable(TABLE_NAME, {
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
					name: {
						type: Sequelize.STRING
					},
					key: {
						type: Sequelize.STRING,
						allowNull: false
					},
					secret: {
						type: Sequelize.STRING,
						allowNull: false
					},
					expiry: {
						type: Sequelize.DATE,
						allowNull: false,
						defaultValue: Sequelize.NOW
					},
					role: {
						type: Sequelize.STRING,
						allowNull: false,
						defaultValue: ROLES.USER
					},
					type: {
						type: Sequelize.STRING,
						allowNull: false,
						defaultValue: TOKEN_TYPES.HMAC
					},
					active: {
						type: Sequelize.BOOLEAN,
						defaultValue: true
					},
					revoked: {
						type: Sequelize.BOOLEAN,
						defaultValue: false
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
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface, Sequelize) => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};
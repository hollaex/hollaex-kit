'use strict';

const TABLE = 'Logins';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			TABLE,
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
				ip: {
					type: Sequelize.STRING,
					allowNull: false
				},
				device: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: ''
				},
				domain: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: ''
				},
				origin: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: ''
				},
				referer: {
					type: Sequelize.STRING,
					allowNull: true,
					defaultValue: ''
				},
				timestamp: {
					type: Sequelize.DATE,
					allowNull: false,
					defaultValue: Sequelize.literal('NOW()')
				}
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface, Sequelize) => queryInterface.dropTable(TABLE)
};

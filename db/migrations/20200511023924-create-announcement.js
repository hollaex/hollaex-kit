'use strict';

const TABLE = 'Announcements';

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
				created_by: {
					type: Sequelize.INTEGER,
					onDelete: 'CASCADE',
					allowNull: false,
					references: {
						model: 'Users',
						key: 'id'
					}
				},
				title: {
					type: Sequelize.STRING,
					allowNull: false
				},
				message: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				type: {
					type: Sequelize.STRING,
					allowNull: false,
					defaultValue: 'info'
				}
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE)
};
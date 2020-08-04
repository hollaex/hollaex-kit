'use strict';

const TABLE = 'OtpCodes';

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
				secret: {
					type: Sequelize.STRING,
					allowNull: false
				},
				used: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
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
	down: (queryInterface, Sequelize) => queryInterface.dropTable(TABLE)
};
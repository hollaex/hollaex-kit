'use strict';

const TABLE_NAME = 'Plugins';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(
			TABLE_NAME,
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				version: {
					type: Sequelize.INTEGER,
					defaultValue: 1
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				description: {
					type: Sequelize.STRING,
				},
				author: {
					type: Sequelize.STRING,
				},
				url: {
					type: Sequelize.STRING,
				},
				logo: {
					type: Sequelize.STRING,
				},
				script: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				enabled: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: true
				},
				prescript: {
					type: Sequelize.JSONB,
					defaultValue: {
						install: [],
						run: null
					}
				},
				postscript: {
					type: Sequelize.JSONB,
					defaultValue: {
						run: null
					}
				},
				meta: {
					type: Sequelize.JSONB,
					defaultValue: {}
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
			},
			{
				timestamps: true,
				underscored: true
			}
		);
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};
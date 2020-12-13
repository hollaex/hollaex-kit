'use strict';

const TABLE_NAME = 'Plugins';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable(TABLE_NAME, {
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
			enabled: {
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			author: {
				type: Sequelize.STRING
			},
			bio: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			},
			documentation: {
				type: Sequelize.STRING
			},
			logo: {
				type: Sequelize.STRING
			},
			icon: {
				type: Sequelize.STRING
			},
			url: {
				type: Sequelize.STRING
			},
			meta: {
				type: Sequelize.JSONB,
				defaultValue: {}
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
			script: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			admin_view: {
				type: Sequelize.TEXT
			},
			web_view: {
				type: Sequelize.TEXT
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
		});
	},
	down: (queryInterface) => queryInterface.dropTable(TABLE_NAME)
};
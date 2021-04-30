'use strict';
module.exports = (sequelize, DataTypes) => {
	const Plugin = sequelize.define('Plugin', {
		version: {
			type: DataTypes.INTEGER,
			defaultValue:1
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		author: {
			type: DataTypes.STRING
		},
		bio: {
			type: DataTypes.STRING
		},
		description: {
			type: DataTypes.STRING
		},
		documentation: {
			type: DataTypes.STRING
		},
		logo: {
			type: DataTypes.STRING
		},
		icon: {
			type: DataTypes.STRING
		},
		url: {
			type: DataTypes.STRING
		},
		meta: {
			type: DataTypes.JSONB,
			defaultValue: {}
		},
		prescript: {
			type: DataTypes.JSONB,
			defaultValue: {
				install: [],
				run: null
			}
		},
		postscript: {
			type: DataTypes.JSONB,
			defaultValue: {
				run: null
			}
		},
		script: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		admin_view: {
			type: DataTypes.TEXT
		},
		web_view: {
			type: DataTypes.JSONB,
			defaultValue: []
		}
	}, {
		timestamps: true,
		underscored: true
	});

	return Plugin;
};
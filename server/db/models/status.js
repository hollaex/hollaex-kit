'use strict';

module.exports = function(sequelize, DataTypes) {
	const Status = sequelize.define(
		'Status',
		{
			activated: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			initialized: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			blocked: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			activation_code: {
				type: DataTypes.STRING,
				allowNull: true
			},
			secrets: {
				type: DataTypes.JSONB,
				defaultValue: {}
			},
			kit: {
				type: DataTypes.JSONB,
				defaultValue: {}
			},
			api_key: {
				type: DataTypes.STRING,
				allowNull: true
			},
			api_secret: {
				type: DataTypes.STRING,
				allowNull: true
			},
			kit_version: {
				type: DataTypes.STRING,
				allowNull: true
			},
			email: {
				type: DataTypes.JSONB,
				defaultValue: {}
			},
			constants: {
				type: DataTypes.JSONB,
				defaultValue: {}
			}
		},
		{
			underscored: true
		}
	);

	return Status;
};

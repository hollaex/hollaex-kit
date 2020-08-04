'use strict';

module.exports = function(sequelize, DataTypes) {
	const Status = sequelize.define(
		'Status',
		{
			name: {
				type: DataTypes.STRING,
				allowNull: true
			},
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
			url: {
				type: DataTypes.STRING,
				allowNull: true
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

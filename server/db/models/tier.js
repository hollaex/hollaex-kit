'use strict';

module.exports = function(sequelize, DataTypes) {
	const Tier = sequelize.define(
		'Tier',
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false
			},
			deposit_limit: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			},
			withdrawal_limit: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			},
			fees: {
				type: DataTypes.JSONB,
				defaultValue: {}
			}
		},
		{
			underscored: true
		}
	);

	return Tier;
};

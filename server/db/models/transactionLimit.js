'use strict';

module.exports = function (sequelize, DataTypes) {

	const TransactionLimit = sequelize.define(
		'TransactionLimit',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			tier: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			amount: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			monthly_amount: {
				type: DataTypes.DOUBLE,
				allowNull: true
			},
			currency: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			limit_currency: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM('withdrawal', 'deposit'),
				allowNull: false,
			}
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'TransactionLimits'
		}
	);
    
	return TransactionLimit;
};

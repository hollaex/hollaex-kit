'use strict';

module.exports = function (sequelize, DataTypes) {
	const QuickTrade = sequelize.define(
		'QuickTrade',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
                type: DataTypes.STRING,
                allowNull: true,
              },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
              }
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'QuickTrades'
		}
	);
    
	return QuickTrade;
};

'use strict';

module.exports = function (sequelize, DataTypes) {

	const BalanceHistory = sequelize.define(
		'BalanceHistory',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
            balance: {
				type: DataTypes.JSONB,
				allowNull: false,
			},
            total: {
                type: DataTypes.DOUBLE,
				allowNull: false,
            }
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'BalanceHistories'
		}
	);
    
	return BalanceHistory;
};

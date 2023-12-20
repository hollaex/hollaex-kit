'use strict';

module.exports = function (sequelize, DataTypes) {

	const DeviceToken = sequelize.define(
		'DeviceToken',
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
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			device: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'DeviceTokens'
		}
	);
    
	DeviceToken.associate = (models) => {
		DeviceToken.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return DeviceToken;
};

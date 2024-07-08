'use strict';

module.exports = function (sequelize, DataTypes) {
	const UserAddressBook = sequelize.define(
		'UserAddressBook',
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
			addresses: {
				type: DataTypes.ARRAY(DataTypes.JSONB),
				allowNull: false,
			}
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'UserAddressBooks'
		}
	);
    
	return UserAddressBook;
};
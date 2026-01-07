'use strict';
module.exports = function (sequelize, DataTypes) {
	const Subaccount = sequelize.define(
		'Subaccount',
		{
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			label: {
				type: DataTypes.STRING,
				allowNull: false
			},
			color: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '#000000'
			}
		},
		{
			underscored: true,
			tableName: 'Subaccounts'
		}
	);

	Subaccount.associate = (models) => {
		Subaccount.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'sub_id',
			targetKey: 'id',
			as: 'sub'
		});
		Subaccount.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'master_id',
			targetKey: 'id',
			as: 'master'
		});
	};

	return Subaccount;
};

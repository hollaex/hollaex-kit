'use strict';
module.exports = function (sequelize, DataTypes) {
	const Subaccount = sequelize.define(
		'Sharedaccount',
		{
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			label: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{
			underscored: true,
			tableName: 'Sharedaccounts'
		}
	);

	Subaccount.associate = (models) => {
		Subaccount.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'shared_id',
			targetKey: 'id',
			as: 'shared'
		});
		Subaccount.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'main_id',
			targetKey: 'id',
			as: 'main'
		});
	};

	return Subaccount;
};

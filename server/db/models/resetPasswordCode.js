'use strict';

module.exports = function(sequelize, DataTypes) {
	const ResetPasswordCode = sequelize.define(
		'ResetPasswordCode',
		{
			code: {
				type: DataTypes.UUID,
				allowNull: false
			},
			used: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			underscored: true
		}
	);

	ResetPasswordCode.associate = (models) => {
		ResetPasswordCode.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return ResetPasswordCode;
};

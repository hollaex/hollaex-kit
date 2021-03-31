'use strict';
module.exports = function(sequelize, DataTypes) {
	const OtpCode = sequelize.define(
		'OtpCode',
		{
			secret: {
				type: DataTypes.STRING,
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

	OtpCode.associate = (models) => {
		OtpCode.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return OtpCode;
};

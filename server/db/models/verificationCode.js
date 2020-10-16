'use strict';
module.exports = function(sequelize, DataTypes) {
	const VerificationCode = sequelize.define(
		'VerificationCode',
		{
			code: {
				type: DataTypes.UUID,
				allowNull: false
			},
			verified: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		},
		{
			underscored: true
		}
	);

	VerificationCode.associate = (models) => {
		VerificationCode.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return VerificationCode;
};

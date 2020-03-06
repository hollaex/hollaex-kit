'use strict';
module.exports = function(sequelize, DataTypes) {
	const VerificationImage = sequelize.define(
		'VerificationImage',
		{
			front: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ''
			},
			back: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ''
			},
			proof_of_residency: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ''
			}
		},
		{
			underscored: true
		}
	);

	VerificationImage.associate = (models) => {
		VerificationImage.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return VerificationImage;
};

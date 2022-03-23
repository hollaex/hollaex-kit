'use strict';
module.exports = function(sequelize, DataTypes) {
	const Login = sequelize.define(
		'Login',
		{
			ip: {
				type: DataTypes.STRING,
				allowNull: false
			},
			device: {
				type: DataTypes.STRING(1000),
				allowNull: true,
				defaultValue: ''
			},
			domain: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ''
			},
			origin: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ''
			},
			referer: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ''
			},
			timestamp: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			}
		},
		{
			timestamps: false,
			underscored: true
		}
	);

	Login.associate = (models) => {
		Login.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return Login;
};

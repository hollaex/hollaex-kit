'use strict';
module.exports = function (sequelize, DataTypes) {
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
			attempt: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			country: {
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
			timestamps: true,
			underscored: true,
			tableName: 'Logins'
		}
	);

	Login.associate = (models) => {
		Login.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
		Login.hasOne(models.Session);
	};

	return Login;
};

'use strict';

module.exports = function (sequelize, DataTypes) {
	const Passkey = sequelize.define(
		'Passkey',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			credential_id: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			public_key: {
				type: DataTypes.BLOB,
				allowNull: false
			},
			webauthn_user_id: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			counter: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			device_type: {
				type: DataTypes.STRING(32),
				allowNull: true
			},
			backed_up: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			transports: {
				type: DataTypes.JSONB,
				allowNull: true,
				defaultValue: []
			}
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Passkeys'
		}
	);

	Passkey.associate = (models) => {
		Passkey.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id'
		});
	};

	return Passkey;
};

'use strict';

const { ROLES, TOKEN_TYPES } = require('../../constants');

module.exports = function(sequelize, DataTypes) {
	const Token = sequelize.define('Token', {
		key: {
			type: DataTypes.STRING,
			allowNull: false
		},
		secret: {
			type: DataTypes.STRING,
			allowNull: false
		},
		expiry: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ROLES.USER
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: TOKEN_TYPES.HMAC
		},
		name: {
			type: DataTypes.STRING
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		revoked: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		can_read: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		can_trade: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		can_withdraw: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		whitelisted_ips: {
			type: DataTypes.JSONB,
			defaultValue: []
		},
		whitelisting_enabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {
		timestamps: true,
		underscored: true
	});

	Token.associate = (models) => {
		Token.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'user_id',
			targetKey: 'id',
			as: 'user'
		});
	};

	return Token;
};

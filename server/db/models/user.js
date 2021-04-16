'use strict';
const { DEFAULT_ORDER_RISK_PERCENTAGE } = require('../../constants');
const {
	generateHash,
	generateAffiliationCode
} = require('../../utils/security');

const ID_DATA_DEFAULT = {
	status: 0,
	type: '',
	number: '',
	issued_date: '',
	expiration_date: '',
	note: ''
};

const SETTINGS_DATA_DEFAULT = {
	notification: {
		popup_order_confirmation: true,
		popup_order_completed: true,
		popup_order_partially_filled: true
	},
	interface: {
		order_book_levels: 10,
		theme: process.env.DEFAULT_THEME || 'white'
	},
	language: process.env.DEFAULT_LANGUAGE || 'en',
	audio: {
		order_completed: true,
		order_partially_completed: true,
		public_trade: false
	},
	risk: {
		order_portfolio_percentage: DEFAULT_ORDER_RISK_PERCENTAGE
	},
	chat: {
		set_username: false
	}
};

const BANK_DATA_DEFAULT = [];

exports.BANK_DATA_DEFAULT = BANK_DATA_DEFAULT;
exports.ID_DATA_DEFAULT = ID_DATA_DEFAULT;

module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define(
		'User',
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: ''
			},
			full_name: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			gender: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			nationality: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			dob: {
				type: DataTypes.DATE
			},
			phone_number: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			address: {
				type: DataTypes.JSONB,
				defaultValue: {
					country: '',
					address: '',
					city: '',
					postal_code: ''
				}
			},
			id_data: {
				type: DataTypes.JSONB,
				defaultValue: ID_DATA_DEFAULT
			},
			bank_account: {
				type: DataTypes.JSONB,
				defaultValue: BANK_DATA_DEFAULT
			},
			crypto_wallet: {
				type: DataTypes.JSONB,
				defaultValue: {}
			},
			verification_level: {
				type: DataTypes.INTEGER,
				defaultValue: 1
			},
			email_verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			otp_enabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			activated: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			},
			note: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			username: {
				type: DataTypes.STRING,
				defaultValue: ''
			},
			affiliation_code: {
				type: DataTypes.STRING,
				defaultValue: '',
				unique: true
			},
			settings: {
				type: DataTypes.JSONB,
				defaultValue: SETTINGS_DATA_DEFAULT
			},
			flagged: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			is_admin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			is_supervisor: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			is_support: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			is_kyc: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			is_communicator: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			affiliation_rate: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			},
			network_id: {
				type: DataTypes.INTEGER
			},
			discount: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			}
		},
		{
			underscored: true
		}
	);

	User.beforeCreate((user) => {
		user.email = user.email.toLowerCase();
		user.username = user.email.substr(0, user.email.indexOf('@'));
		user.affiliation_code = generateAffiliationCode();
		return generateHash(user.password).then((hash) => {
			user.password = hash;
		});
	});

	User.beforeUpdate((user, options) => {
		if (user.email) {
			user.email = user.email.toLowerCase();
		}
		if (user._changed.password)
			return generateHash(user.password).then((hash) => {
				user.password = hash;
			});
	});

	User.associate = (models) => {
		User.hasMany(models.Token);
		User.hasMany(models.VerificationCode);
		// User.hasMany(models.VerificationImage);
		User.hasMany(models.VerificationImage, {
			foreignKey: 'user_id',
			as: 'images'
		});
		User.hasMany(models.OtpCode);
		User.hasMany(models.Login);
		User.hasMany(models.Affiliation, {
			foreignKey: 'user_id'
		});
		User.hasMany(models.Affiliation, {
			foreignKey: 'referer_id'
		});
	};

	return User;
};

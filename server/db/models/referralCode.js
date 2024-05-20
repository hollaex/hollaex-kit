'use strict';


module.exports = function (sequelize, DataTypes) {
	const ReferralCode = sequelize.define('ReferralCode', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		user_id: {
			type: DataTypes.INTEGER,
			onDelete: 'CASCADE',
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		earning_rate: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		discount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
            defaultValue: 0
		},
		referral_count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	}, {
		timestamps: true,
		underscored: true,
		tableName: 'ReferralCodes'
	});

	ReferralCode.associate = (models) => {
		
	};

	return ReferralCode;
};
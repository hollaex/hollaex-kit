'use strict';


module.exports = function (sequelize, DataTypes) {
	const ReferralHistory = sequelize.define('ReferralHistory', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		referer: {
			type: DataTypes.INTEGER,
			onDelete: 'CASCADE',
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		referee: {
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
			allowNull: true,
		},
		coin: {
			type: DataTypes.STRING,
			allowNull: false
		},
		accumulated_fees: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		last_settled: {
			type: DataTypes.DATE,
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		timestamps: true,
		underscored: true,
		tableName: 'ReferralHistories'
	});

	ReferralHistory.associate = (models) => {
		
	};

	return ReferralHistory;
};
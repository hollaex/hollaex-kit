'use strict';

module.exports = function (sequelize, DataTypes) {
	const PaymentDetail = sequelize.define(
		'PaymentDetail',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
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
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			label: {
				type: DataTypes.STRING,
				allowNull: true
			},
			details: {
				type: DataTypes.JSONB,
				allowNull: false
			},
			is_p2p: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			is_fiat_control: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			}
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'PaymentDetails'
		}
	);

	return PaymentDetail;
};

'use strict';

const { CURRENCIES } = require('../../constants');

module.exports = function(sequelize, DataTypes) {
	const Fee = sequelize.define(
		'Fee',
		{
			transaction_id: {
				type: DataTypes.STRING,
				allowNull: false
			},
			amount: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			currency: {
				type: DataTypes.ENUM(...CURRENCIES),
				allowNull: false
			}
		},
		{
			underscored: true
		}
	);

	Fee.associate = (models) => {
		Fee.belongsTo(models.User, {
			foreignKey: 'user_id'
		});
	};

	return Fee;
};

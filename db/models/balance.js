'use strict';
const { BALANCE_KEYS } = require('../../constants');
const { generateBalanceFields } = require('../../utils');

module.exports = function(sequelize, DataTypes) {
	const Balance = sequelize.define(
		'Balance',
		generateBalanceFields(DataTypes, BALANCE_KEYS),
		{
			underscored: true
		}
	);

	Balance.associate = (models) => {
		Balance.belongsTo(models.User, {
			foreignKey: 'user_id'
		});
	};

	return Balance;
};

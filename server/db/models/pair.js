'use strict';

module.exports = function(sequelize, DataTypes) {
	const Pair = sequelize.define(
		'Pair',
		{
			name: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			pair_base: {
				type: DataTypes.STRING,
				allowNull: false
			},
			pair_2: {
				type: DataTypes.STRING,
				allowNull: false
			},
			taker_fees: {
				type: DataTypes.JSONB,
				allowNull: false,
				defaultValue: {}
			},
			maker_fees: {
				type: DataTypes.JSONB,
				allowNull: false,
				defaultValue: {}
			},
			min_size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			max_size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			min_price: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			max_price: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			increment_size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			increment_price: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			}
		},
		{
			underscored: true
		}
	);

	Pair.associate = (models) => {};

	return Pair;
};

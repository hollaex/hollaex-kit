'use strict';
module.exports = function(sequelize, DataTypes) {
	const Trade = sequelize.define(
		'Trade',
		{
			side: {
				type: DataTypes.ENUM('buy', 'sell'),
				allowNull: false
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false
			},
			size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			price: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			maker_fee: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			taker_fee: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			timestamp: {
				defaultValue: DataTypes.NOW,
				allowNull: false,
				type: DataTypes.DATE
			},
			quick: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			timestamps: false,
			underscored: true
		}
	);

	Trade.associate = (models) => {
		Trade.belongsTo(models.User, {
			foreignKey: 'maker_id'
		});
		Trade.belongsTo(models.User, {
			foreignKey: 'taker_id'
		});
	};

	return Trade;
};

'use strict';
module.exports = function(sequelize, DataTypes) {
	const Order = sequelize.define(
		'Order',
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				unique: true,
				primaryKey: true
			},
			side: {
				type: DataTypes.ENUM('buy', 'sell'),
				allowNull: false
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false
			},
			type: {
				type: DataTypes.ENUM('market', 'limit'),
				allowNull: false
			},
			size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			filled: {
				type: DataTypes.DOUBLE,
				defaultValue: 0
			},
			price: {
				type: DataTypes.DOUBLE,
				allowNull: false
			}
		},
		{
			underscored: true
		}
	);

	Order.associate = (models) => {
		Order.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'created_by',
			targetKey: 'id'
		});
	};

	return Order;
};

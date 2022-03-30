'use strict';

module.exports = function (sequelize, DataTypes) {
	const Broker = sequelize.define(
		'Broker',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			buy_price: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			sell_price: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			paused: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
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
			min_size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			max_size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			increment_size: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			type: {
				type: DataTypes.ENUM('manual', 'dynamic'),
				defaultValue: 'manual',
				allowNull: false
			},
			exchange_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			exchange_api_key: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			exchange_api_secret: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: true,
			underscored: true
		}
	);

	Broker.associate = (models) => {
		Broker.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
	};

	return Broker;
};

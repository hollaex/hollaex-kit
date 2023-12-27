'use strict';


module.exports = function (sequelize, DataTypes) {
	const Referralhistory = sequelize.define('Referralhistory', {
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
		coin: {
			type: DataTypes.STRING,
			allowNull: false
		},
		accumulated_fees: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false
		},
	}, {
		timestamps: true,
		underscored: true,
		tableName: 'Referralhistories'
	});

	Referralhistory.associate = (models) => {
		
	};

	return Referralhistory;
};

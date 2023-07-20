'use strict';
const { ROLES } = require('../../constants');

module.exports = function (sequelize, DataTypes) {
	const Session = sequelize.define(
		'Session',
		{
            token: {
				type: DataTypes.STRING(1000),
				allowNull: false
			},
            login_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Logins',
					key: 'id'
				}
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
            last_seen: {
                type: DataTypes.DATE,
				allowNull: false,
                defaultValue: DataTypes.NOW
            },
			expiry_date: {
				type: DataTypes.DATE,
				allowNull: false
			},
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ROLES.USER
            }
		},
		{
			underscored: true,
			tableName: 'Sessions'
		}
	);
    Session.associate = (models) => {
		Session.belongsTo(models.Login, {
			as: 'login',
			foreignKey: 'login_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
	};
	return Session;
};

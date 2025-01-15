'use strict';

module.exports = function (sequelize, DataTypes) {
	const Announcement = sequelize.define('Announcement', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		created_by: {
			type: DataTypes.INTEGER,
			onDelete: 'CASCADE',
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'info'
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: null
		},
		is_navbar: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		is_popup: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		is_dropdown: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		}
	}, {
		timestamps: true,
		underscored: true,
		tableName: 'Announcements'
	});

	Announcement.associate = (models) => {
		Announcement.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'created_by',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
	};

	return Announcement;
};

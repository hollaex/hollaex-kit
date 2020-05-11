module.exports = function(sequelize, DataTypes) {
	const Announcement = sequelize.define(
		'Announcement',
		{
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
			}
		},
		{
			timestamps: true,
			underscored: true
		}
	);
	return Announcement;
};

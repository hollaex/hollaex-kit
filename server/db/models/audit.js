const DESCRIPTION = {
	note: ''
};

module.exports = function (sequelize, DataTypes) {
	const Audit = sequelize.define(
		'Audit',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			subject: {
				type: DataTypes.STRING,
				allowNull: false
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			description: {
				type: DataTypes.JSONB,
				defaultValue: DESCRIPTION
			},
			timestamp: {
				defaultValue: DataTypes.NOW,
				allowNull: false,
				type: DataTypes.DATE
			}
		},
		{
			timestamps: false,
			underscored: true,
			tableName: 'Audits'
		}
	);
	return Audit;
};

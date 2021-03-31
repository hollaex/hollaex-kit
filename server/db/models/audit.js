const DESCRIPTION = {
	note: ''
};

module.exports = function(sequelize, DataTypes) {
	const Audit = sequelize.define(
		'Audit',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			admin_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			event: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.JSONB,
				defaultValue: DESCRIPTION
			},
			ip: {
				type: DataTypes.STRING,
				allowNull: false
			},
			domain: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ''
			},
			timestamp: {
				defaultValue: DataTypes.NOW,
				allowNull: false,
				type: DataTypes.DATE
			}
		},
		{
			timestamps: false,
			underscored: true
		}
	);
	return Audit;
};

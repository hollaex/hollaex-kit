module.exports = function(sequelize, DataTypes) {
	const Affiliation = sequelize.define(
		'Affiliation',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
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
			referer_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('NOW()')
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: sequelize.literal('NOW()')
			}
		},
		{
			timestamps: true,
			underscored: true
		}
	);
	return Affiliation;
};

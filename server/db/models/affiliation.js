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
			}
		},
		{
			timestamps: true,
			underscored: true
		}
	);

	Affiliation.associate = (models) => {
		Affiliation.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
		Affiliation.belongsTo(models.User, {
			as: 'referer',
			foreignKey: 'referer_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
	};

	return Affiliation;
};

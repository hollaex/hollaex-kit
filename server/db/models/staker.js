module.exports = function (sequelize, DataTypes) {
	const Staker = sequelize.define(
		'Staker',
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
			stake_id: {
				type: DataTypes.INTEGER,
                onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Stakes',
					key: 'id'
				}
			},
			amount: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			currency: {
				type: DataTypes.STRING,
				allowNull: true
			},
			reward: {
				type: DataTypes.DOUBLE,
				allowNull: true
			},
			slashed: {
				type: DataTypes.DOUBLE,
				allowNull: true
			},
			status: {
				type: DataTypes.STRING,
				allowNull: true
			},
			closing: {
				type: DataTypes.DATE,
				allowNull: true
			}
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Stakers'
		}
	);

    Staker.associate = (models) => {
		Staker.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});

        Staker.belongsTo(models.Stake, {
			as: 'stake',
			foreignKey: 'stake_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
	};

	return Staker;
};

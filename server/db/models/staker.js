module.exports = function (sequelize, DataTypes) {
	const Staker = sequelize.define(
		'Staker',
		{
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
				allowNull: false
			},
			reward: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				defaultValue: 0
			},
			slashed: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				defaultValue: 0
			},
			status: {
				type: DataTypes.ENUM('staking', 'unstaking', 'closed', 'active'),
				allowNull: false
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

module.exports = function (sequelize, DataTypes) {
	const Stake = sequelize.define(
		'Stake',
		{
			name: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
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
			currency: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			account_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			apy: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			duration: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			slashing: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			slashing_principle_percentage: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			slashing_earning_percentage: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			slashing_reward: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			early_unstake: {
				type: DataTypes.BOOLEAN,
				allowNull: false
			},
			min_amount: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			max_amount: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			status: {
				type: DataTypes.ENUM('uninitialized', 'active', 'paused', 'terminated'),
				allowNull: false,
				defaultValue: 'uninitialized',
			},
			onboarding: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			disclaimer: {
				type: DataTypes.STRING,
				allowNull: true
			}
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Stakes' 
		}
	);

    Stake.associate = (models) => {
		Stake.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'user_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});

        Stake.belongsTo(models.User, {
			as: 'account',
			foreignKey: 'account_id',
			targetKey: 'id',
			onDelete: 'CASCADE'
		});
	};

	return Stake;
};

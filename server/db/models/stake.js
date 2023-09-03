module.exports = function (sequelize, DataTypes) {
	const Stake = sequelize.define(
		'Stake',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			name: {
				type: DataTypes.STRING,
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
				allowNull: true
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
				allowNull: true
			},
			duration: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			slashing: {
				type: DataTypes.BOOLEAN,
				allowNull: true
			},
			slashing_percentage: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			slashing_reward: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			early_unstake: {
				type: DataTypes.BOOLEAN,
				allowNull: true
			},
			min_amount: {
				type: DataTypes.DOUBLE,
				allowNull: true
			},
			max_amount: {
				type: DataTypes.DOUBLE,
				allowNull: true
			},
			status: {
				type: DataTypes.STRING,
				allowNull: true
			},
			onboarding: {
				type: DataTypes.BOOLEAN,
				allowNull: true
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

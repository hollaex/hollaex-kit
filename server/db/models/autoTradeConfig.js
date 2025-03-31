module.exports = function (sequelize, DataTypes) {
    const AutoTradeConfig = sequelize.define(
        'AutoTradeConfig',
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
            spend_coin: {
                type: DataTypes.STRING,
                allowNull: false
            },
            buy_coin: {
                type: DataTypes.STRING,
                allowNull: false
            },
            spend_amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            frequency: {
                type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
                allowNull: false
            },
            week_days: {
                type: DataTypes.ARRAY(DataTypes.INTEGER), // 0-6
                allowNull: true
            },
            day_of_month: {
                type: DataTypes.INTEGER, // 1-31
                allowNull: true
            },
            trade_hour: {
                type: DataTypes.INTEGER, // 0-23
                allowNull: false,
                defaultValue: 0
            },
            last_execution_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'AutoTradeConfigs'
        }
    );
    AutoTradeConfig.associate = (models) => {
        AutoTradeConfig.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
    };
    return AutoTradeConfig;
};
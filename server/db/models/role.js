module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role_tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        }
    }, {
        tableName: 'roles',
        timestamps: true
    });

    Role.associate = (models) => {
        Role.hasMany(models.User, {
            foreignKey: 'role_id',
            as: 'users'
        });
    };

    return Role;
};
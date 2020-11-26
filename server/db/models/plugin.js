module.exports = function(sequelize, DataTypes) {
	const Plugin = sequelize.define(
		'Plugin',
		{
			version: {
				type: DataTypes.INTEGER,
				defaultValue: 1
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.STRING,
			},
			author: {
				type: DataTypes.STRING,
			},
			url: {
				type: DataTypes.STRING,
			},
			logo: {
				type: DataTypes.STRING,
			},
			script: {
				type: DataTypes.TEXT,
				allowNull: false
			},
				
		},
		{
			timestamps: true,
			underscored: true
		}
	);

	return Plugin;
};

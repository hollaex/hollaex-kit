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
				allowNull: false,
				unique: true
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
			enabled: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			prescript: {
				type: DataTypes.JSONB,
				defaultValue: {
					install: [],
					run: null
				}
			},
			postscript: {
				type: DataTypes.JSONB,
				defaultValue: {
					run: null
				}
			},
			meta: {
				type: DataTypes.JSONB,
				defaultValue: {}
			},
		},
		{
			timestamps: true,
			underscored: true
		}
	);

	return Plugin;
};

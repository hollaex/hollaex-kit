import {
	Association,
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
} from 'sequelize';

export class Plugin extends Model<InferAttributes<Plugin>, InferCreationAttributes<Plugin>> {
	declare id: CreationOptional<number>;
	declare version: number;
	declare name: string;
	declare enabled: boolean;
	declare author: string;
	declare bio: string;
	declare description: string;
	declare documentation: string;
	declare logo: string;
	declare icon: string;
	declare url: string;
	declare meta: Record<string, any>;
	declare public_meta: Record<string, any>;
	declare prescript: {
		install: any[];
		run: null | any;
	};
	declare postscript: {
		run: null | any;
	};
	declare script: string | null;
	declare admin_view: string;
	declare web_view: any[];
	declare type: string;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare static associations: {

	};
}

export default function (sequelize: Sequelize) {
	Plugin.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			version: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			enabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			author: {
				type: DataTypes.STRING,
			},
			bio: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.TEXT,
			},
			documentation: {
				type: DataTypes.STRING,
			},
			logo: {
				type: DataTypes.STRING,
			},
			icon: {
				type: DataTypes.STRING,
			},
			url: {
				type: DataTypes.STRING,
			},
			meta: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			public_meta: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			prescript: {
				type: DataTypes.JSONB,
				defaultValue: {
					install: [],
					run: null,
				},
			},
			postscript: {
				type: DataTypes.JSONB,
				defaultValue: {
					run: null,
				},
			},
			script: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			admin_view: {
				type: DataTypes.TEXT,
			},
			web_view: {
				type: DataTypes.JSONB,
				defaultValue: [],
			},
			type: {
				type: DataTypes.STRING,
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Plugins',
			sequelize,
		}
	);


	return Plugin;
}

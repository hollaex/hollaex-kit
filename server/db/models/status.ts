import {
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
	CreationOptional
} from 'sequelize';

export class Status extends Model<InferAttributes<Status>, InferCreationAttributes<Status>> {
	declare id: CreationOptional<number>;
	declare activated: boolean;
	declare initialized: boolean;
	declare blocked: boolean;
	declare activation_code: string | null;
	declare secrets: Record<string, any>;
	declare kit: Record<string, any>;
	declare api_key: string | null;
	declare api_secret: string | null;
	declare kit_version: string | null;
	declare email: Record<string, any>;
	declare constants: Record<string, any>;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;
}

export default function (sequelize: Sequelize) {
	Status.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			activated: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			initialized: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			blocked: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			activation_code: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			secrets: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			kit: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			api_key: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			api_secret: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			kit_version: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			constants: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			underscored: true,
			tableName: 'Statuses',
			sequelize,
		}
	);

	return Status;
}

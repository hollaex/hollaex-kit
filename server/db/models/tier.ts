import {
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from 'sequelize';

export class Tier extends Model<InferAttributes<Tier>, InferCreationAttributes<Tier>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare icon: string;
	declare description: string;
	declare deposit_limit: number;
	declare withdrawal_limit: number;
	declare fees: Record<string, any>;
	declare note: string;
	declare native_currency_limit: boolean;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;
}

export default function (sequelize: Sequelize) {
	Tier.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			icon: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			deposit_limit: {
				type: DataTypes.DOUBLE,
				defaultValue: 0,
			},
			withdrawal_limit: {
				type: DataTypes.DOUBLE,
				defaultValue: 0,
			},
			fees: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			note: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			native_currency_limit: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			underscored: true,
			tableName: 'Tiers',
			sequelize,
		}
	);

	return Tier;
}

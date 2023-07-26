import {
	Association,
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey,
} from 'sequelize';
import { User } from './user';

export class Broker extends Model<InferAttributes<Broker>, InferCreationAttributes<Broker>> {
	declare id: CreationOptional<number>;
	declare symbol: string;
	declare buy_price: number;
	declare sell_price: number;
	declare paused: boolean;
	declare user_id: ForeignKey<User['id']>;
	declare min_size: number;
	declare max_size: number;
	declare type: 'manual' | 'dynamic';
	declare quote_expiry_time: number | null;
	declare spread: number | null;
	declare rebalancing_symbol: string | null;
	declare refresh_interval: number | null;
	declare account: any | null;
	declare formula: string | null;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare user?: NonAttribute<User>;

	declare static associations: {
		user: Association<Broker, User>;
	};
}

export default function (sequelize: Sequelize) {
	Broker.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			buy_price: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				defaultValue: 0,
			},
			sell_price: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				defaultValue: 0,
			},
			paused: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
			},
			min_size: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			max_size: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM('manual', 'dynamic'),
				defaultValue: 'manual',
				allowNull: false,
			},
			quote_expiry_time: {
				type: DataTypes.INTEGER,
				defaultValue: 30,
				allowNull: true,
			},
			spread: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: true,
			},
			rebalancing_symbol: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			refresh_interval: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: true,
			},
			account: {
				type: DataTypes.JSONB,
				allowNull: true,
			},
			formula: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Brokers',
			sequelize,
		}
	);


	return Broker;
}

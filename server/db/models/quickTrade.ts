import {
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from 'sequelize';

export class QuickTrade extends Model<InferAttributes<QuickTrade>, InferCreationAttributes<QuickTrade>> {
	declare id: CreationOptional<number>;
	declare symbol: string;
	declare type: string | null;
	declare active: boolean;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;
}

export default function (sequelize: Sequelize) {
	QuickTrade.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			symbol: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'QuickTrades',
			sequelize,
		}
	);


	return QuickTrade;
}

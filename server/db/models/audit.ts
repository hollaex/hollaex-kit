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

const DESCRIPTION = {
	note: ''
};

export class Audit extends Model<InferAttributes<Audit>, InferCreationAttributes<Audit>> {
	declare id: CreationOptional<number>;
	declare admin_id: ForeignKey<User['id']>;
	declare event: string;
	declare description: typeof DESCRIPTION;
	declare ip: string;
	declare domain: string | null;
	declare timestamp: Date;
	declare admin?: NonAttribute<User>;

	declare static associations: {
		admin: Association<Audit, User>;
	};
}

export default function (sequelize: Sequelize) {
	Audit.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			admin_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
			},
			event: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.JSONB,
				defaultValue: DESCRIPTION,
			},
			ip: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			domain: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
			},
			timestamp: {
				defaultValue: DataTypes.NOW,
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{
			timestamps: false,
			underscored: true,
			tableName: 'Audits',
			sequelize,
		}
	);


	return Audit;
}

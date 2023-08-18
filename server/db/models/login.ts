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
import { Session } from './session';

export class Login extends Model<InferAttributes<Login>, InferCreationAttributes<Login>> {
	declare id: CreationOptional<number>;
	declare ip: string;
	declare device: string | null;
	declare domain: string | null;
	declare origin: string | null;
	declare referer: string | null;
	declare attempt: number;
	declare status: boolean;
	declare country: string | null;
	declare timestamp: Date;
	declare user_id: ForeignKey<User['id']>;

	declare user?: NonAttribute<User>;

	declare static associations: {
		user: Association<Login, User>;
		session: Association<Login, Session>;
	};
}

export default function (sequelize: Sequelize) {
	Login.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			ip: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			device: {
				type: new DataTypes.STRING(1000),
				allowNull: true,
				defaultValue: '',
			},
			domain: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
			},
			origin: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
			},
			referer: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
			},
			attempt: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
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
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			country: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
			},
			timestamp: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Logins',
			sequelize,
		}
	);



	return Login;
}

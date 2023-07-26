import {
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	NonAttribute,
	Association,
} from 'sequelize';
import { ROLES } from '../../constants';
import { Login } from './login';

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
	declare id: CreationOptional<number>;
	declare token: string;
	declare login_id: ForeignKey<Login['id']>;
	declare status: boolean;
	declare last_seen: Date;
	declare expiry_date: Date;
	declare role: string;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare login?: NonAttribute<Login>;

	declare static associations: {
		login: Association<Session, Login>;
	};
}

export default function (sequelize: Sequelize) {
	Session.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			token: {
				type: new DataTypes.STRING(1000),
				allowNull: false,
			},
			login_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Logins',
					key: 'id',
				},
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			last_seen: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			expiry_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ROLES.USER,
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			underscored: true,
			tableName: 'Sessions',
			sequelize,
		}
	);

	Session.belongsTo(Login, {
		as: 'login',
		foreignKey: 'login_id',
		targetKey: 'id',
		onDelete: 'CASCADE',
	});

	return Session;
}

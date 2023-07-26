import {
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey,
	Association,
} from 'sequelize';
import { ROLES, TOKEN_TYPES } from '../../constants';
import { User } from './user';
import { Affiliation } from './affiliation';

export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
	declare id: CreationOptional<number>;
	declare key: string;
	declare secret: string;
	declare expiry: Date;
	declare role: string;
	declare type: string;
	declare name: string | null;
	declare active: boolean;
	declare revoked: boolean;
	declare can_read: boolean;
	declare can_trade: boolean;
	declare can_withdraw: boolean;
	declare whitelisted_ips: string[];
	declare whitelisting_enabled: boolean;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare user_id: ForeignKey<User['id']>;
	declare user?: NonAttribute<User>;

	declare static associations: {
		user: Association<Affiliation, User>;
	};
}

export default function (sequelize: Sequelize) {
	Token.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			key: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			secret: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			expiry: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ROLES.USER,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: TOKEN_TYPES.HMAC,
			},
			name: {
				type: DataTypes.STRING,
			},
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			revoked: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			can_read: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			can_trade: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			can_withdraw: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			whitelisted_ips: {
				type: DataTypes.JSONB,
				defaultValue: [],
			},
			whitelisting_enabled: {
				type: DataTypes.BOOLEAN,
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
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Tokens',
			sequelize,
		}
	);

	Token.belongsTo(User, {
		onDelete: 'CASCADE',
		foreignKey: 'user_id',
		targetKey: 'id',
		as: 'user',
	});

	return Token;
}

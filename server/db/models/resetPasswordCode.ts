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
import { User } from './user';

export class ResetPasswordCode extends Model<InferAttributes<ResetPasswordCode>, InferCreationAttributes<ResetPasswordCode>> {
	declare id: CreationOptional<number>;
	declare code: string;
	declare used: boolean;
	declare user_id: ForeignKey<User['id']>;
	declare user?: NonAttribute<User>;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare static associations: {
		user: Association<ResetPasswordCode, User>;
	};
}

export default function (sequelize: Sequelize) {
	ResetPasswordCode.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			code: {
				type: DataTypes.UUID,
				allowNull: false,
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
			used: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			underscored: true,
			tableName: 'ResetPasswordCodes',
			sequelize,
		}
	);



	return ResetPasswordCode;
}

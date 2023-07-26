import {
	DataTypes,
	Model,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
	NonAttribute,
} from 'sequelize';
import { User } from './user';

export class VerificationCode extends Model<InferAttributes<VerificationCode>, InferCreationAttributes<VerificationCode>> {
	declare id: CreationOptional<number>;
	declare code: string;
	declare verified: boolean;
	declare user_id: ForeignKey<User['id']>;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare user?: NonAttribute<User>;

}

export default function (sequelize: Sequelize) {
	VerificationCode.init(
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
			verified: {
				type: DataTypes.BOOLEAN,
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
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			underscored: true,
			tableName: 'VerificationCodes',
			sequelize,
		}
	);


	// Add any associations here if needed

	return VerificationCode;
}

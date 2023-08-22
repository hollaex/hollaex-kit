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

export class OtpCode extends Model<InferAttributes<OtpCode>, InferCreationAttributes<OtpCode>> {
	declare id: CreationOptional<number>;
	declare secret: string;
	declare used: boolean;

	declare user?: NonAttribute<User>;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare static associations: {
		user: Association<OtpCode, User>;
	};
}

export default function (sequelize: Sequelize) {
	OtpCode.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			secret: {
				type: DataTypes.STRING,
				allowNull: false,
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
			tableName: 'OtpCodes',
			sequelize,
		}
	);



	return OtpCode;
}

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

export class VerificationImage extends Model<InferAttributes<VerificationImage>, InferCreationAttributes<VerificationImage>> {
	declare id: CreationOptional<number>;
	declare front: string;
	declare back: string | null;
	declare proof_of_residency: string | null;
	declare user_id: ForeignKey<User['id']>;
	declare user?: NonAttribute<User>;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;
}

export default function (sequelize: Sequelize) {
	VerificationImage.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			front: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			back: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
			},
			proof_of_residency: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: '',
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
			tableName: 'VerificationImages',
			sequelize,
		}
	);



	return VerificationImage;
}

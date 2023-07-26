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

export class Affiliation extends Model<InferAttributes<Affiliation>, InferCreationAttributes<Affiliation>> {
	declare id: CreationOptional<number>;
	declare user_id: ForeignKey<User['id']>;
	declare referer_id: ForeignKey<User['id']>;
	declare code: string | null;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;
	declare user?: NonAttribute<User>;
	declare referer?: NonAttribute<User>;

	declare static associations: {
		user: Association<Affiliation, User>;
		referer: Association<Affiliation, User>;
	};
}

export default function (sequelize: Sequelize) {
	Affiliation.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
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
			referer_id: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
				},
			},
			code: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			timestamps: true,
			underscored: true,
			tableName: 'Affiliations',
			sequelize,
		}
	);

	Affiliation.belongsTo(User, {
		as: 'user',
		foreignKey: 'user_id',
		targetKey: 'id',
		onDelete: 'CASCADE',
	});

	Affiliation.belongsTo(User, {
		as: 'referer',
		foreignKey: 'referer_id',
		targetKey: 'id',
		onDelete: 'CASCADE',
	});

	return Affiliation;
}

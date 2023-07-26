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

import { generateHash, generateAffiliationCode } from '../../utils/security';
import { DEFAULT_ORDER_RISK_PERCENTAGE } from '../../constants';
import { Token } from './token';
import { VerificationCode } from './verificationCode';
import { Broker } from './broker';
import { VerificationImage } from './verificationImage';
import { OtpCode } from './otpCode';
import { Login } from './login';
import { Affiliation } from './affiliation';

interface IDData {
	status: number;
	type: string;
	number: string;
	issued_date: string;
	expiration_date: string;
	note: string;
}

interface SettingsData {
	notification: {
		popup_order_confirmation: boolean;
		popup_order_completed: boolean;
		popup_order_partially_filled: boolean;
	};
	interface: {
		order_book_levels: number;
		theme: string;
	};
	language: string;
	audio: {
		order_completed: boolean;
		order_partially_completed: boolean;
		public_trade: boolean;
	};
	risk: {
		order_portfolio_percentage: number;
	};
	chat: {
		set_username: boolean;
	};
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare email: string;
	declare password: string;
	declare full_name?: string;
	declare gender?: boolean;
	declare nationality?: string;
	declare dob?: Date;
	declare phone_number?: string;
	declare address?: {
		country: string;
		address: string;
		city: string;
		postal_code: string;
	};
	declare id_data?: IDData;
	declare bank_account?: any[];
	declare crypto_wallet?: Record<string, any>;
	declare verification_level?: number;
	declare email_verified?: boolean;
	declare otp_enabled?: boolean;
	declare activated?: boolean;
	declare note?: string;
	declare username?: string;
	declare affiliation_code?: string;
	declare settings?: SettingsData;
	declare flagged?: boolean;
	declare is_admin?: boolean;
	declare is_supervisor?: boolean;
	declare is_support?: boolean;
	declare is_kyc?: boolean;
	declare is_communicator?: boolean;
	declare affiliation_rate?: number;
	declare network_id?: number;
	declare discount?: number;
	declare meta?: Record<string, any>;
	declare created_at: CreationOptional<Date>;
	declare updated_at: CreationOptional<Date>;

	declare static associations: {
		Token: Association<User, any>;
		VerificationCode: Association<User, any>;
		Broker: Association<User, any>;
		VerificationImage: Association<User, any>;
		OtpCode: Association<User, any>;
		Login: Association<User, any>;
		Affiliation: Association<User, any>;
	};
}

const ID_DATA_DEFAULT: IDData = {
	status: 0,
	type: '',
	number: '',
	issued_date: '',
	expiration_date: '',
	note: '',
};

const SETTINGS_DATA_DEFAULT: SettingsData = {
	notification: {
		popup_order_confirmation: true,
		popup_order_completed: true,
		popup_order_partially_filled: true,
	},
	interface: {
		order_book_levels: 10,
		theme: process.env.DEFAULT_THEME || 'white',
	},
	language: process.env.DEFAULT_LANGUAGE || 'en',
	audio: {
		order_completed: true,
		order_partially_completed: true,
		public_trade: false,
	},
	risk: {
		order_portfolio_percentage: DEFAULT_ORDER_RISK_PERCENTAGE,
	},
	chat: {
		set_username: false,
	},
};

const BANK_DATA_DEFAULT: any[] = [];

export { ID_DATA_DEFAULT, BANK_DATA_DEFAULT };

export default (sequelize: Sequelize) => {
	User.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			full_name: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			gender: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			nationality: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			dob: {
				type: DataTypes.DATE,
			},
			phone_number: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			address: {
				type: DataTypes.JSONB,
				defaultValue: {
					country: '',
					address: '',
					city: '',
					postal_code: '',
				},
			},
			id_data: {
				type: DataTypes.JSONB,
				defaultValue: ID_DATA_DEFAULT,
			},
			bank_account: {
				type: DataTypes.JSONB,
				defaultValue: BANK_DATA_DEFAULT,
			},
			crypto_wallet: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			verification_level: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
			},
			email_verified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			otp_enabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			activated: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			note: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			username: {
				type: DataTypes.STRING,
				defaultValue: '',
			},
			affiliation_code: {
				type: DataTypes.STRING,
				defaultValue: '',
				unique: true,
			},
			settings: {
				type: DataTypes.JSONB,
				defaultValue: SETTINGS_DATA_DEFAULT,
			},
			flagged: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			is_admin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			is_supervisor: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			is_support: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			is_kyc: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			is_communicator: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			affiliation_rate: {
				type: DataTypes.DOUBLE,
				defaultValue: 0,
			},
			network_id: {
				type: DataTypes.INTEGER,
			},
			discount: {
				type: DataTypes.DOUBLE,
				defaultValue: 0,
			},
			meta: {
				type: DataTypes.JSONB,
				defaultValue: {},
			},
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			underscored: true,
			tableName: 'Users',
			sequelize,
		}
	);

	User.beforeCreate((user) => {
		user.email = user.email.toLowerCase();
		user.username = user.email.substr(0, user.email.indexOf('@'));
		user.affiliation_code = generateAffiliationCode();
		return generateHash(user.password).then((hash) => {
			user.password = hash;
		});
	});

	User.beforeUpdate((user, options) => {
		if (user.email) {
			user.email = user.email.toLowerCase();
		}
		const updatedFields = user.changed();
		if (Array.isArray(updatedFields) && updatedFields.includes('password'))
			return generateHash(user.password).then((hash) => {
				user.password = hash;
			});
	});



	return User;
};

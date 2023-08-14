'use strict';

import { Affiliation } from "./affiliation";
import { Audit } from "./audit";
import { Login } from "./login";
import { OtpCode } from "./otpCode";
import { ResetPasswordCode } from "./resetPasswordCode";
import { Token } from "./token";
import { User } from "./user";
import { VerificationCode } from "./verificationCode";
import { VerificationImage } from "./verificationImage";
import { Status } from "./status";
import { Tier } from "./tier";
import { Plugin } from "./plugin";
import { Broker } from "./broker";
import { Session } from "./session";
import { QuickTrade } from "./quickTrade";


const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/db.js')[env];
const path = require('path');

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
);

const db: any = {};
let model;


model = require(path.join(__dirname, './affiliation')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './audit')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './login')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './otpCode')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './resetPasswordCode')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './token')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './user')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './verificationCode')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './verificationImage')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './status')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './tier')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './plugin')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './broker')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './session')).default(sequelize);
db[model.name] = model;
model = require(path.join(__dirname, './quickTrade')).default(sequelize);
db[model.name] = model;


User.hasMany(Token);
User.hasMany(VerificationCode);
User.hasMany(Broker);
User.hasMany(VerificationImage, {
	foreignKey: 'user_id',
	as: 'images',
});
User.hasMany(OtpCode);
User.hasMany(Login);
User.hasMany(Affiliation, {
	foreignKey: 'user_id',
});
User.hasMany(Affiliation, {
	foreignKey: 'referer_id',
});


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

Audit.belongsTo(User, {
	as: 'admin',
	foreignKey: 'admin_id',
	targetKey: 'id',
});

Login.belongsTo(User, {
	onDelete: 'CASCADE',
	foreignKey: 'user_id',
	targetKey: 'id',
});

Login.hasOne(Session);

OtpCode.belongsTo(User, {
	onDelete: 'CASCADE',
	foreignKey: 'user_id',
	targetKey: 'id',
});

ResetPasswordCode.belongsTo(User, {
	onDelete: 'CASCADE',
	foreignKey: 'user_id',
	targetKey: 'id',
});


Broker.belongsTo(User, {
	as: 'user',
	foreignKey: 'user_id',
	targetKey: 'id',
	onDelete: 'CASCADE',
});

Session.belongsTo(Login, {
	as: 'login',
	foreignKey: 'login_id',
	targetKey: 'id',
	onDelete: 'CASCADE',
});


Token.belongsTo(User, {
	onDelete: 'CASCADE',
	foreignKey: 'user_id',
	targetKey: 'id',
	as: 'user',
});

VerificationCode.belongsTo(User, {
	onDelete: 'CASCADE',
	foreignKey: 'user_id',
	targetKey: 'id',
});

VerificationImage.belongsTo(User, {
	onDelete: 'CASCADE',
	foreignKey: 'user_id',
	targetKey: 'id',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


export {
	Affiliation,
	Audit,
	Login,
	OtpCode,
	ResetPasswordCode,
	Token,
	User,
	VerificationCode,
	VerificationImage,
	Status,
	Tier,
	Plugin,
	Broker,
	Session,
	QuickTrade,
	sequelize,
	Sequelize
}

export default db;

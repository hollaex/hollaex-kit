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

Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
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
	QuickTrade
}

export default db;

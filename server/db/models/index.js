'use strict';


var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/db.js')[env];
const path = require('path');

var sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
);

var db = {};
var model;

model = require(path.join(__dirname, './affiliation'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './audit'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './login'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './otpCode'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './resetPasswordCode'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './token'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './user'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './verificationCode'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './verificationImage'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './status'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './tier'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './plugin'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './broker'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
model = require(path.join(__dirname, './session'))(sequelize, Sequelize.DataTypes);
db[model.name] = model;

Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

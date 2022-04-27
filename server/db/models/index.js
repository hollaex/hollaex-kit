'use strict';


var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/db.js')[env];
const fs = require('fs');
const path = require('path');

var sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
);

var db = {};
fs.readdirSync(__dirname).forEach((file) => {
	if (path.extname(file) === '.js' && file !== 'index.js') {
		const filePath = path.join(__dirname, file);
		const r = require(filePath);
		if (r) {
			const model = require(path.join(filePath))(sequelize, Sequelize.DataTypes);
			db[model.name] = model;
		}
	} });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

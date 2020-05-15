'use strict';

const Model = (table) => require('./model').getModel(table);
const { convertSequelizeCountAndRows } = require('./helpers');

const findOne = (table, query = {}) => {
	return Model(table).findOne(query);
};

const findAll = (table, query = {}) => {
	return Model(table).findAll(query);
};

const findAndCountAll = (table, query = {}) => {
	return Model(table).findAndCountAll(query);
};

const findAndCountAllWithRows = (table, query = {}) => {
	return Model(table).findAndCountAll(query).then(convertSequelizeCountAndRows);
};

module.exports = {
	findOne,
	findAll,
	findAndCountAll,
	findAndCountAllWithRows
};

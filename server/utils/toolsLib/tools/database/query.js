'use strict';

const Model = (table) => require('./model').getModel(table);
const { convertSequelizeCountAndRows } = require('./helpers');

/**
 * Returns Promise with Sequelize findOne query result.
 * @param {string} table - Table name of model.
 * @param {object} query - Sequelize query object.
 * @returns {Promise} Promise with result of query.
 */
const findOne = (table, query = {}, model) => {
	if (model) {
		return model.findOne(query);
	} else {
		return Model(table).findOne(query);
	}
};

/**
 * Returns Promise with Sequelize findAll query result.
 * @param {string} table - Table name of model.
 * @param {object} query - Sequelize query object.
 * @returns {Promise} Promise with result of query.
 */
const findAll = (table, query = {}, model) => {
	if (model) {
		return model.findAll(query);
	} else {
		return Model(table).findAll(query);
	}
};

/**
 * Returns Promise with Sequelize findAndCountAll query result.
 * @param {string} table - Table name of model.
 * @param {object} query - Sequelize query object.
 * @returns {Promise} Promise with result of query.
 */
const findAndCountAll = (table, query = {}, model) => {
	if (model) {
		return model.findAndCountAll(query);
	} else {
		return Model(table).findAndCountAll(query);
	}
};

/**
 * Returns Promise with Sequelize findAndCountAll query result in count/data format.
 * @param {string} table - Table name of model.
 * @param {object} query - Sequelize query object.
 * @returns {Promise} Promise with result of query in count/data format.
 */
const findAndCountAllWithRows = (table, query = {}, model) => {
	if (model) {
		return model.findAndCountAll(query).then(convertSequelizeCountAndRows);
	} else {
		return Model(table).findAndCountAll(query).then(convertSequelizeCountAndRows);
	}
};

module.exports = {
	findOne,
	findAll,
	findAndCountAll,
	findAndCountAllWithRows
};

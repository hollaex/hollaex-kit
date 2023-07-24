'use strict';
import { getModel } from './model';
import { convertSequelizeCountAndRows } from './helpers';

export const Model = (table) => getModel(table);

/**
 * Returns Promise with Sequelize findOne query result.
 * @param {string} table - Table name of model.
 * @param {object} query - Sequelize query object.
 * @returns {Promise} Promise with result of query.
 */
export const findOne = (table, query = {}, model = null) => {
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
export const findAll = (table, query = {}, model = null) => {
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
export const findAndCountAll = (table, query = {}, model = null) => {
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
export const findAndCountAllWithRows = (table, query = {}, model = null) => {
	if (model) {
		return model.findAndCountAll(query).then(convertSequelizeCountAndRows);
	} else {
		return Model(table).findAndCountAll(query).then(convertSequelizeCountAndRows);
	}
};
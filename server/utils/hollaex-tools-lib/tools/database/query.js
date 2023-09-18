'use strict';

const Model = (table) => require('./model').getModel(table);
const { convertSequelizeCountAndRows } = require('./helpers');
const { SERVER_PATH } = require('../../constants');
const { PROVIDE_TABLE_NAME } = require(`${SERVER_PATH}/messages`);
const { sequelize } = require(`${SERVER_PATH}/db/models`);
const pluralize = require('pluralize');
const { Op } = require('sequelize');
const moment = require('moment');
const QueryStream = require('pg-query-stream');
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

 const fetchAllRecords = async (table, query, opts = null) => {
	if (table.length === 0) {
		throw new Error(PROVIDE_TABLE_NAME);
	}

	const modelName = pluralize(table
		.split(' ')
		.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
		.join(''));

	['created_at', 'timestamp'].forEach(timeframe => {
		if (query?.where?.[timeframe]) {
			query.where[timeframe] = {
				[Op.gte]: moment(query.where[timeframe][Op.gte]).toISOString(),
				[Op.lte]: moment(query.where[timeframe][Op.lte]).toISOString(),
			}
		}
	})

	const sql = sequelize.dialect.queryGenerator.selectQuery(modelName, {
		where: query.where,
		attributes: query.attributes,
		order: query.order,
	});

	const client = await sequelize.connectionManager.getConnection({ type: 'SELECT' });
	const streamQuery = new QueryStream(sql);

	return new Promise((resolve, reject) => {
		let result = {
			count: 0,
			data: []
		};

		const stream = client.query(streamQuery);

		stream
			.on('data', (data) => {
				result.data.push(data);
			})
			.on('end', () => {
				sequelize.connectionManager.releaseConnection(client);
				result.count = result.data.length;
				resolve(result);
			})
			.on('error', (err) => {
				stream.destroy();
				sequelize.connectionManager.releaseConnection(client);
				reject(err);
			});
	});
}

module.exports = {
	findOne,
	findAll,
	findAndCountAll,
	findAndCountAllWithRows,
	fetchAllRecords
};

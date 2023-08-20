'use strict';
import { getModel } from './model';
import { convertSequelizeCountAndRows } from './helpers';
import QueryStream from 'pg-query-stream';
import { sequelize } from '../../../../db/models';
import { PROVIDE_TABLE_NAME } from '../../../../messages';
import pluralize from 'pluralize';
import { Op } from 'sequelize';
const moment = require('moment');

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

export const fetchAllRecords = async (table: string = '', query, opts = null) => {
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

	console.log(sql)

	const client = await sequelize.connectionManager.getConnection({ type: 'SELECT' });
	const streamQuery: QueryStream = new QueryStream(sql);

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


export default {
	Model,
	findOne,
	findAll,
	findAndCountAll,
	findAndCountAllWithRows,
	fetchAllRecords
}
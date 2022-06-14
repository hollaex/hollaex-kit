'use strict';

const moment = require('moment');

/**
 * Returns object for sequelize pagination query. Default is { limit: 50, offset: 1 }
 * @param {number} limit - Limit of values in page. Max: 50.
 * @param {number} page - Page to retrieve. Default: 1.
 * @returns {object} Sequelize pagination object with keys limit, offset.
 */
const paginationQuery = (limit = 50, page = 1) => {
	let _limit = 50;
	let _page = 1;
	if (limit) {
		if (limit > 50) {
			_limit = 50;
		} else if (limit <= 0) {
			_limit = 1;
		} else {
			_limit = limit;
		}
	}

	if (page && page >= 0) {
		_page = page;
	}
	return {
		limit: _limit,
		offset: _limit * (_page - 1)
	};
};

/**
 * Returns object for sequelize timeframe query. Default is {} (no filter for timeframe).
 * @param {string} startDate - Start date to filter by in timestamp format (ISO 8601).
 * @param {string} endDate - End date to filter by in timestamp format (ISO 8601).
 * @returns {object} Sequelize timeframe object.
 */
const timeframeQuery = (startDate = 0, endDate = moment().valueOf()) => {
	let timestamp = {
		$gte: startDate,
		$lte: endDate
	};
	return timestamp;
};

/**
 * Returns array for sequelize ordering query. Default is [id, desc] (By desceding id values).
 * @param {string} orderBy - Table column (value) to order query by.
 * @param {string} order - Order to put query. Can be desc (descending) or asc (ascending).
 * @returns {array} Sequelize ordering array.
 */
const orderingQuery = (orderBy = 'id', order = 'desc') => {
	return [orderBy, order === 'asc' || order === 'desc' ? order : 'desc'];
};

/**
 * Format sequelize findAndCountAll query data to count/data format.
 * @param {object} data - Original data from sequelize findAndCountAll query.
 * @returns {object} Formatted query result with count and data.
 */
const convertSequelizeCountAndRows = (data) => {
	return {
		count: data.count,
		data: data.rows.map((row) => {
			const item = Object.assign({}, row.dataValues);
			// delete item.id;
			return item;
		})
	};
};

module.exports = {
	paginationQuery,
	timeframeQuery,
	orderingQuery,
	convertSequelizeCountAndRows
};

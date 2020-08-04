'use strict';

const { logger } = require('../../config/logger');
const { getPairs } = require('../../init');

/*
  Funtion that calculate the pagination values from the parameters.
  Takes 2 parameter:

  Parameter 1(object): swagger parameter - limit object
  Parameter 2(object): swagger parameter - page object

  Retuns an object, with limit and offset properties
 */
const getPagination = (limit = { value: 50 }, page = { value: 1 }) => {
	let _limit = 50;
	let _page = 1;
	logger.debug('helpers/general/getPagination', _limit, _page);
	if (limit.value) {
		if (limit.value > 50) {
			_limit = 50;
		} else if (limit.value <= 0) {
			_limit = 1;
		} else {
			_limit = limit.value;
		}
	}

	if (page.value && page.value >= 0) {
		_page = page.value;
	}
	logger.debug('helpers/general/getPagination', _limit, _page);
	return {
		limit: _limit,
		offset: _limit * (_page - 1)
	};
};

/*
  Funtion that converts the sequelize findAndCountAll result to the common api response.
  Takes 1 parameter:

  Parameter 1(object): result of findAndCountAll

  Retuns an object, with count and data properties
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

const getTimeframe = (start_date = { value: undefined }, end_date = { value: undefined }) => {
	logger.debug(
		'helpers/general/getTimeframe',
		'stat_date: ',
		start_date.value,
		'end_date: ',
		end_date.value
	);
	let timestamp = {};
	if (start_date.value) timestamp['$gte'] = start_date.value;
	if (end_date.value) timestamp['$lte'] = end_date.value;
	if (Object.entries(timestamp).length === 0) return undefined;
	return timestamp;
};

const checkPair = (symbol) => {
	return !!getPairs()[symbol];
};

module.exports = {
	getPagination,
	convertSequelizeCountAndRows,
	getTimeframe,
	checkPair
};

'use strict';

const { SERVER_PATH } = require('../../constants');
const models = require(`${SERVER_PATH}/db/models`);
const { PROVIDE_TABLE_NAME } = require(`${SERVER_PATH}/messages`);

/**
 * Get sequelize model of table.
 * @param {string} table - Table name of model.
 * @returns {object} Sequelize model.
 */
const getModel = (table = '') => {
	if (table.length === 0) {
		throw new Error(PROVIDE_TABLE_NAME);
	}

	if (table !== 'sequelize') {
		table = table
			.split(' ')
			.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
			.join('');
	}

	return models[table];
};

const create = (table, query = {}) => {
	return getModel(table).create(query);
};

module.exports = {
	getModel,
	create
};

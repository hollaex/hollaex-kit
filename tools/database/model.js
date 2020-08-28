'use strict';

const { SERVER_PATH } = require('../../constant');

/**
 * Get sequelize model of table.
 * @param {string} table - Table name of model.
 * @returns {object} Sequelize model.
 */
const getModel = (table = '') => {
	if (table.length === 0) {
		throw new Error('Please give a table name');
	}

	table.toLowerCase();
	table[0].toUpperCase();
	const model = require(`${SERVER_PATH}/db/models`)[table];
	return model;
};

module.exports = {
	getModel
};

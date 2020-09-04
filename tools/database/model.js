'use strict';

const { SERVER_PATH } = require('../../constants');

/**
 * Get sequelize model of table.
 * @param {string} table - Table name of model.
 * @returns {object} Sequelize model.
 */
const getModel = (table = '') => {
	if (table.length === 0) {
		throw new Error('Please give a table name');
	}

	if (table !== 'sequelize') {
		table = table
			.split(' ')
			.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
			.join('');
	}

	const model = require(`${SERVER_PATH}/db/models`)[table];
	return model;
};

module.exports = {
	getModel
};

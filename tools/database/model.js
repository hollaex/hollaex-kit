'use strict';

const { SERVER_PATH } = require('../../constants');
const { each } = require('lodash');

/**
 * Get sequelize model of table.
 * @param {string} table - Table name of model.
 * @returns {object} Sequelize model.
 */
const getModel = (table = '') => {
	if (table.length === 0) {
		throw new Error('Please give a table name');
	}

	const words = table.split(' ');

	each(words, (word => {
		word.toLowerCase();
		word[0].toUpperCase();
	}));

	table = words.join('');
	const model = require(`${SERVER_PATH}/db/models`)[table];
	return model;
};

module.exports = {
	getModel
};

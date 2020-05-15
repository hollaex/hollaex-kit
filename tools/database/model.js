'use strict';

const path = require('path');
const DB_MODELS_PATH = path.resolve(__dirname, './db/models');

const getModel = (table = '') => {
	if (table.length === 0) {
		throw new Error('Please give a table name');
	}

	table.toLowerCase();
	table[0].toUpperCase();
	const model = require(DB_MODELS_PATH)[table];
	return model;
};

module.exports = {
	getModel
};

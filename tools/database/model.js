'use strict';

const { SERVER_PATH } = require('../../constants');
const models = require(`${SERVER_PATH}/db/models`);
const { PROVIDE_TABLE_NAME } = require(`${SERVER_PATH}/messages`);
const { capitalize, camelCase } = require('lodash');

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

const create = (table, query = {}, options = {}) => {
	return getModel(table).create(query, options);
};

const destroy = (table, query = {}, options = {}) => {
	return getModel(table).destroy(query, options);
};

const update = (table, query = {}, options = {}) => {
	return getModel(table).update(query, options);
};

const createModel = (
	name,
	properties = {},
	options = {
		timestamps: true,
		underscored: true
	}
) => {
	const result =  models.sequelize.import(name, (sequelize, DataTypes) => {{
		const modelProperties = {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			}
		};

		for (let prop in properties) {
			if (!properties[prop].type) {
				throw new Error('Type not given for property ' + prop);
			}
			properties[prop].type = DataTypes[properties[prop].type.toUpperCase()];
			modelProperties[prop] = properties[prop];
		}
		const model = models.sequelize.define(
			name.split(' ').map((word) => `${capitalize(word)}`).join(''),
			modelProperties,
			{
				timestamps: true,
				underscored: true,
				...options
			}
		);
		return model;
	}});

	return result;
};

const associateModel = (model, association, associatedModel, options = {}) => {
	model.associate = (models) => {
		model[camelCase(association)](models[associatedModel.split(' ').map((word) => `${capitalize(word)}`).join('')], options);
	};

	model.associate(models);
};

module.exports = {
	createModel,
	associateModel,
	getModel,
	create,
	destroy,
	update
};

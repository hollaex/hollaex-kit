'use strict';

const Influx = require('influx');
const config = require('../config/influx');

const schema = [{
	measurement: 'trades',
	fields: {
		id: Influx.FieldType.INTEGER,
		price: Influx.FieldType.FLOAT,
		size: Influx.FieldType.FLOAT,
		side: Influx.FieldType.STRING,
		maker_id: Influx.FieldType.INTEGER,
		taker_id: Influx.FieldType.INTEGER,
		maker_fee: Influx.FieldType.FLOAT,
		taker_fee: Influx.FieldType.FLOAT
	},
	tags: ['symbol']
}];

const client = new Influx.InfluxDB({
	...config,
	schema
});

module.exports = client;

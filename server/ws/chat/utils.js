'use strict';
const redis = require('../../db/redis').duplicate();

const storeData = (key = '', data = []) => {
	return redis.setAsync(key, JSON.stringify(data));
};

const restoreData = (key = '') => {
	return redis.getAsync(key).then((data) => {
		if (!data) {
			if(key === 'WS:BANS') return {};
			return [];
		}
		data = JSON.parse(data);
		return data;
	});
};

module.exports = {
	storeData,
	restoreData
};

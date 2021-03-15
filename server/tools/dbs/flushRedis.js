'use strict';

const redis = require('../../db/redis');

redis.flushall((err, succeeded) => {
	if (err) {
		console.error('Error', err);
		process.exit(1);
	} else {
		console.log('Whole Redis is flushed successfully.', succeeded);
		process.exit(0);
	}
});

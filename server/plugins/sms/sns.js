'use strict';

const aws = require('aws-sdk');
const { GET_SECRETS } = require('../../constants');

const credentials = () => {
	return {
		accessKeyId: GET_SECRETS().plugins.sns.key,
		secretAccessKey: GET_SECRETS().plugins.sns.secret,
		region: GET_SECRETS().plugins.sns.region
	};
};

const sns = () => {
	aws.config.update(credentials());
	return new aws.SNS();
};

module.exports = sns;

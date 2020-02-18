'use strict';

const aws = require('aws-sdk');
const SNS_ACCESSKEYID = process.env.SNS_ACCESSKEYID || '';
const SNS_SECRETACCESSKEY = process.env.SNS_SECRETACCESSKEY || '';
const SNS_REGION = process.env.SNS_REGION || '';

const credentials = {
	accessKeyId: SNS_ACCESSKEYID,
	secretAccessKey: SNS_SECRETACCESSKEY,
	region: SNS_REGION
};

const sns = () => {
	aws.config.update(credentials);
	return new aws.SNS();
};

module.exports = sns;

'use strict';

const aws = require('aws-sdk');
const {
	SNS_ACCESSKEYID,
	SNS_SECRETACCESSKEY,
	SNS_REGION
} = require('../../constants');

const credentials = {
	accessKeyId: SNS_ACCESSKEYID,
	secretAccessKey: SNS_SECRETACCESSKEY,
	region: SNS_REGION
};

const sns = (bucketName) => {
	aws.config.update(credentials);
	return new aws.SNS();
};

module.exports = sns;

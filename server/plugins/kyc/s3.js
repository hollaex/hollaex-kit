'use strict';

const aws = require('aws-sdk');
const { GET_KIT_SECRETS } = require('../../constants');

const generateBuckets = (bucketsString = '') => {
	const bucketsSplit = bucketsString
		.split(',')
		.map((bucketString) => bucketString.split(':'));
	const buckets = {};

	bucketsSplit.forEach(([bucketName, bucketRegion]) => {
		buckets[bucketName] = {
			region: bucketRegion,
			signatureVersion: 'v4'
		};
	});

	return buckets;
};

const credentials = () => {
	return {
		write: {
			accessKeyId: GET_KIT_SECRETS().plugins.s3.key.write,
			secretAccessKey: GET_KIT_SECRETS().plugins.s3.secret.write
		},
		read: {
			accessKeyId: GET_KIT_SECRETS().plugins.s3.key.read,
			secretAccessKey: GET_KIT_SECRETS().plugins.s3.secret.read
		},
		buckets: generateBuckets(GET_KIT_SECRETS().plugins.s3.id_docs_bucket)
	}
};

const write = (bucketName) => {
	aws.config.update(credentials().write);
	return new aws.S3(credentials().buckets[bucketName]);
};

const read = (bucketName) => {
	aws.config.update(credentials().read);
	return new aws.S3(credentials().buckets[bucketName]);
};

module.exports = {
	write,
	read
};

'use strict';

const aws = require('aws-sdk');
const {
	ID_DOCS_BUCKET,
	S3_WRITE_ACCESSKEYID,
	S3_WRITE_SECRETACCESSKEY,
	S3_READ_ACCESSKEYID,
	S3_READ_SECRETACCESSKEY
} = require('../../constants');

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

const credentials = {
	write: {
		accessKeyId: S3_WRITE_ACCESSKEYID,
		secretAccessKey: S3_WRITE_SECRETACCESSKEY
	},
	read: {
		accessKeyId: S3_READ_ACCESSKEYID,
		secretAccessKey: S3_READ_SECRETACCESSKEY
	},
	buckets: generateBuckets(ID_DOCS_BUCKET)
};

const write = (bucketName) => {
	aws.config.update(credentials.write);
	return new aws.s3(credentials.buckets[bucketName]);
};

const read = (bucketName) => {
	aws.config.update(credentials.read);
	return new aws.s3(credentials.buckets[bucketName]);
}

module.exports = {
	write,
	read
};

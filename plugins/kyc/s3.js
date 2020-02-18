'use strict';

const aws = require('aws-sdk');
const ID_DOCS_BUCKET = process.env.ID_DOCS_BUCKET || '';
const S3_WRITE_ACCESSKEYID = process.env.S3_WRITE_ACCESSKEYID || '';
const S3_WRITE_SECRETACCESSKEY = process.env.S3_WRITE_SECRETACCESSKEY || '';
const S3_READ_ACCESSKEYID = process.env.S3_READ_ACCESSKEYID || '';
const S3_READ_SECRETACCESSKEY = process.env.S3_READ_SECRETACCESSKEY || '';


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
	return new aws.S3(credentials.buckets[bucketName]);
};

const read = (bucketName) => {
	aws.config.update(credentials.read);
	return new aws.S3(credentials.buckets[bucketName]);
};

module.exports = {
	write,
	read
};

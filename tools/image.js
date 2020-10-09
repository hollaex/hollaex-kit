'use strict';

const { reject } = require('bluebird');
const { SERVER_PATH } = require('../constants');
const { getKitConfig, getNetworkKeySecret } = require('./common');
const rp = require('request-promise');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { HOLLAEX_NETWORK_URL } = require(`${SERVER_PATH}/constants`);

const storeImageOnNetwork = async (image, name) => {
	if (image.mimetype.indexOf('image/') !== 0) {
		return reject(new Error('Invalid file type'));
	}

	const { apiKey } = await getNetworkKeySecret();
	const exchangeId = getNodeLib().exchange_id;
	const exchangeName = getKitConfig().info.name;

	const options = {
		method: 'POST',
		uri: `${HOLLAEX_NETWORK_URL}/exchange/icon`,
		formData: {
			exchange_id: exchangeId,
			exchange_name: exchangeName,
			file_name: name,
			file: {
				value: image.buffer,
				options: {
					filename: image.originalname
				}
			}
		},
		headers: {
			'api-key': apiKey,
			'Content-Type': 'multipart/form-data'
		}
	};

	return rp(options)
		.then(JSON.parse);
};

module.exports = {
	storeImageOnNetwork
};

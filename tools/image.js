'use strict';

const fs = require('fs');
const { reject } = require('bluebird');
const { SERVER_PATH } = require('../constants');

const storeImage = (image, name) => {
	if (image.mimetype.indexOf('image/') !== 0) {
		return reject(new Error('Invalid file type'));
	}

	if (name.indexOf(' ') !== -1 || name.indexOf('.') !== -1) {
		return reject(new Error('Invalid image name'));
	}

	const imagePath = `${SERVER_PATH}/images/${name}-${image.originalname}`;

	return fs.writeFileSync(imagePath, image.buffer)
		.then((data) => {
			console.log(data)
		})
};

module.exports = {
	storeImage
};

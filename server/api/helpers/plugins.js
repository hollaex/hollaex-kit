'use strict';

const crypto = require('crypto');
const toolsLib = require('hollaex-tools-lib');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const signFreshdesk = (user) => {
	const name = user.full_name || 'user';
	const email = user.email;
	const timestamp = Math.floor(new Date().getTime() / 1000);
	const signature = crypto
		.createHmac('MD5', toolsLib.getKitSecrets().plugins.freshdesk.auth)
		.update(name + toolsLib.getKitSecrets().plugins.freshdesk.auth + email + timestamp)
		.digest('hex');
	const url = `${toolsLib.getKitSecrets().plugins.freshdesk.host}/login/sso?name=${name}&email=${email}&timestamp=${timestamp}&hash=${signature}`;
	return url;
};

const signZendesk = (user) => {
	const name = user.username || 'user';
	const email = user.email;
	const timestamp = moment().unix();

	const token = jwt.sign(
		{
			email,
			name,
			iat: timestamp,
			jti: uuid(),
			external_id: user.id
		},
		toolsLib.getKitSecrets().plugins.zendesk.key
	);

	const url = `${toolsLib.getKitSecrets().plugins.zendesk.host}/access/jwt?jwt=${token}`;
	return url;
};

module.exports = {
	signFreshdesk,
	signZendesk
};

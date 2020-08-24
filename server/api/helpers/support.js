'use strict';

const rp = require('request-promise');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const moment = require('moment');

const { loggerFreshdesk } = require('../../config/logger');
const { getSecrets } = require('../../init');

const generateTicketData = ({
	email = '',
	subject = '',
	description = '',
	category = ''
}) => ({
	name: `${subject} ${category}`,
	email,
	subject,
	description,
	status: 2,
	priority: 1
});

const createTicket = (data = {}) => {
	loggerFreshdesk.info('helpers/freshdesk/createTicket data', data);
	const FRESHDESK_ENDPOINT = `https://${getSecrets().plugins.freshdesk.host}`;
	const PATH_TICKET = '/api/v2/tickets';

	const auth = 'Basic ' + new Buffer.from(getSecrets().plugins.freshdesk.key + ':' + 'X').toString('base64');

	const freshdeskData = generateTicketData(data);
	// ticket with attachment
	if (data.attachment) {
		loggerFreshdesk.verbose(
			'helpers/freshdesk/createTicket/attachment',
			data.attachment
		);
		data.attachment.fieldname = 'attachments[]';
		loggerFreshdesk.verbose(
			'helpers/freshdesk/createTicket withAttachment',
			data
		);
		const options = {
			method: 'POST',
			headers: {
				Authorization: auth,
				'Content-Type': 'multipart/form-data'
			},
			formData: {
				email: JSON.stringify(freshdeskData.email),
				subject: JSON.stringify(freshdeskData.subject),
				description: JSON.stringify(freshdeskData.description),
				status: JSON.stringify(freshdeskData.status),
				priority: JSON.stringify(freshdeskData.priority),
				'attachments[]': JSON.stringify(data.attachment)
			},
			uri: `${FRESHDESK_ENDPOINT}${PATH_TICKET}`
		};
		return rp(options);
	} else {
		loggerFreshdesk.verbose(
			'helpers/freshdesk/createTicket freshdeskData',
			freshdeskData
		);
		const options = {
			method: 'POST',
			headers: {
				Authorization: auth,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(freshdeskData),
			uri: `${FRESHDESK_ENDPOINT}${PATH_TICKET}`
		};
		return rp(options);
	}
};

const signFreshdesk = (user) => {
	const name = user.full_name || 'user';
	const email = user.email;
	const timestamp = Math.floor(new Date().getTime() / 1000);
	const signature = crypto
		.createHmac('MD5', getSecrets().plugins.freshdesk.auth)
		.update(name + getSecrets().plugins.freshdesk.auth + email + timestamp)
		.digest('hex');
	const url = `${getSecrets().plugins.freshdesk.host}/login/sso?name=${name}&email=${email}&timestamp=${timestamp}&hash=${signature}`;
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
		getSecrets().plugins.zendesk.key
	);

	const url = `${getSecrets().plugins.zendesk.host}/access/jwt?jwt=${token}`;
	return url;
};

module.exports = {
	createTicket,
	signFreshdesk,
	signZendesk
};

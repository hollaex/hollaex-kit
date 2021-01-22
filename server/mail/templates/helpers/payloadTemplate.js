'use strict';

const payloadTemplate = (from, to, messageContent) => {
	const data = {
		from,
		to: to.ToAddresses,
		subject: messageContent.subject,
		html: messageContent.html,
		text: messageContent.text
	};

	if (to.BccAddresses) {
		data.bcc = to.BccAddresses;
	}

	return data;
};

module.exports = payloadTemplate;

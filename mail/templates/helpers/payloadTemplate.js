'use strict';

const payloadTemplate = (from, to, messageContent) => {
	return {
		Source: from,
		Destination: to,
		Message: {
			Subject: {
				Data: messageContent.subject
			},
			Body: {
				Html: {
					Data: messageContent.html
				},
				Text: {
					Data: messageContent.text
				}
			}
		}
	};
};

module.exports = payloadTemplate;

'use strict';
const TABLE = 'Status';

const languages = {
	'en':  require('../../mail/strings/en.json').en.OTP_ENABLED,
	'ar':  require('../../mail/strings/ar.json').ar.OTP_ENABLED,
	'de':  require('../../mail/strings/de.json').de.OTP_ENABLED,
	'es':  require('../../mail/strings/es.json').es.OTP_ENABLED,
	'fa':  require('../../mail/strings/fa.json').fa.OTP_ENABLED,
	'fr':  require('../../mail/strings/fr.json').fr.OTP_ENABLED,
	'id':  require('../../mail/strings/id.json').id.OTP_ENABLED,
	'ja':  require('../../mail/strings/ja.json').ja.OTP_ENABLED,
	'ko':  require('../../mail/strings/ko.json').ko.OTP_ENABLED,
	'pt':  require('../../mail/strings/pt.json').pt.OTP_ENABLED,
	'vi':  require('../../mail/strings/vi.json').vi.OTP_ENABLED,
	'zh':  require('../../mail/strings/zh.json').zh.OTP_ENABLED,
};
const models = require('../models');


module.exports = {
	async up(queryInterface) {

		const statusModel = models[TABLE];
		const status = await statusModel.findOne({});

		if(!status?.email) return;
		const emailTemplates = {
			...status.email,
		};

		let hasTemplate = true;
		for (const [language, emailTemplate] of Object.entries(languages)) {
	
			if (status.email && status.email[language] && !status.email[language].hasOwnProperty('OTP_ENABLED')) {
				hasTemplate = false;
				emailTemplates[language] = {
					...status.email[language],
					OTP_ENABLED: emailTemplate
				};
			}
		}

		if (!hasTemplate) {
			await statusModel.update(
				{ email: emailTemplates },
				{ where: { id: status.id } }
			);
		}
		
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

'use strict';
const TABLE = 'Status';

const languages = {
	'en':  require('../../mail/strings/en.json').en.OTP_DISABLED,
	'ar':  require('../../mail/strings/ar.json').ar.OTP_DISABLED,
	'de':  require('../../mail/strings/de.json').de.OTP_DISABLED,
	'es':  require('../../mail/strings/es.json').es.OTP_DISABLED,
	'fa':  require('../../mail/strings/fa.json').fa.OTP_DISABLED,
	'fr':  require('../../mail/strings/fr.json').fr.OTP_DISABLED,
	'id':  require('../../mail/strings/id.json').id.OTP_DISABLED,
	'ja':  require('../../mail/strings/ja.json').ja.OTP_DISABLED,
	'ko':  require('../../mail/strings/ko.json').ko.OTP_DISABLED,
	'pt':  require('../../mail/strings/pt.json').pt.OTP_DISABLED,
	'vi':  require('../../mail/strings/vi.json').vi.OTP_DISABLED,
	'zh':  require('../../mail/strings/zh.json').zh.OTP_DISABLED,
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
	
			if (status.email && status.email[language] && !status.email[language].hasOwnProperty('OTP_DISABLED')) {
				hasTemplate = false;
				emailTemplates[language] = {
					...status.email[language],
					OTP_DISABLED: emailTemplate
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

'use strict';
const TABLE = 'Status';

const languages = {
	'en':  require('../../mail/strings/en.json').en.LOCKED_ACCOUNT,
	'ar':  require('../../mail/strings/ar.json').ar.LOCKED_ACCOUNT,
	'de':  require('../../mail/strings/de.json').de.LOCKED_ACCOUNT,
	'es':  require('../../mail/strings/es.json').es.LOCKED_ACCOUNT,
	'fa':  require('../../mail/strings/fa.json').fa.LOCKED_ACCOUNT,
	'fr':  require('../../mail/strings/fr.json').fr.LOCKED_ACCOUNT,
	'id':  require('../../mail/strings/id.json').id.LOCKED_ACCOUNT,
	'ja':  require('../../mail/strings/ja.json').ja.LOCKED_ACCOUNT,
	'ko':  require('../../mail/strings/ko.json').ko.LOCKED_ACCOUNT,
	'pt':  require('../../mail/strings/pt.json').pt.LOCKED_ACCOUNT,
	'vi':  require('../../mail/strings/vi.json').vi.LOCKED_ACCOUNT,
	'zh':  require('../../mail/strings/zh.json').zh.LOCKED_ACCOUNT,
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
	
			if (status.email && status.email[language] && !status.email[language].hasOwnProperty('LOCKED_ACCOUNT')) {
				hasTemplate = false;
				emailTemplates[language] = {
					...status.email[language],
					LOCKED_ACCOUNT: emailTemplate
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

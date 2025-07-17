'use strict';
const TABLE = 'Status';

const templetes = [
	'SUSPICIOUS_LOGIN',
]

const languages = {
	'SUSPICIOUS_LOGIN': {
		'en': require('../../mail/strings/en.json').en.SUSPICIOUS_LOGIN,

		'ar': require('../../mail/strings/ar.json').ar.SUSPICIOUS_LOGIN,
		'de': require('../../mail/strings/de.json').de.SUSPICIOUS_LOGIN,
		'es': require('../../mail/strings/es.json').es.SUSPICIOUS_LOGIN,
		'fa': require('../../mail/strings/fa.json').fa.SUSPICIOUS_LOGIN,
		'fr': require('../../mail/strings/fr.json').fr.SUSPICIOUS_LOGIN,
		'id': require('../../mail/strings/id.json').id.SUSPICIOUS_LOGIN,
		'ja': require('../../mail/strings/ja.json').ja.SUSPICIOUS_LOGIN,
		'ko': require('../../mail/strings/ko.json').ko.SUSPICIOUS_LOGIN,
		'pt': require('../../mail/strings/pt.json').pt.SUSPICIOUS_LOGIN,
		'vi': require('../../mail/strings/vi.json').vi.SUSPICIOUS_LOGIN,
		'zh': require('../../mail/strings/zh.json').zh.SUSPICIOUS_LOGIN,
	},

};

const models = require('../models');


module.exports = {
	async up(queryInterface) {

		for (const templete of templetes) {
			const statusModel = models[TABLE];
			const status = await statusModel.findOne({});

			if (!status?.email) return;
			const emailTemplates = {
				...status.email,
			};

			let hasTemplate = true;
			for (const [language, emailTemplate] of Object.entries(languages[templete])) {
				if (status.email && status.email[language] && !status.email[language].hasOwnProperty(templete)) {
					hasTemplate = false;
					emailTemplates[language] = {
						...status.email[language],
						[templete]: emailTemplate
					};

				}
			}

			if (!hasTemplate) {
				await statusModel.update(
					{ email: emailTemplates },
					{ where: { id: status.id } }
				);
			}
		}
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

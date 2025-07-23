'use strict';
const TABLE = 'Status';

const templetes = [
	'SUSPICIOUS_LOGIN_CODE',
]

const languages = {
	'SUSPICIOUS_LOGIN_CODE': {
		'en': require('../../mail/strings/en.json').en.SUSPICIOUS_LOGIN_CODE,

		'ar': require('../../mail/strings/ar.json').ar.SUSPICIOUS_LOGIN_CODE,
		'de': require('../../mail/strings/de.json').de.SUSPICIOUS_LOGIN_CODE,
		'es': require('../../mail/strings/es.json').es.SUSPICIOUS_LOGIN_CODE,
		'fa': require('../../mail/strings/fa.json').fa.SUSPICIOUS_LOGIN_CODE,
		'fr': require('../../mail/strings/fr.json').fr.SUSPICIOUS_LOGIN_CODE,
		'id': require('../../mail/strings/id.json').id.SUSPICIOUS_LOGIN_CODE,
		'tr': require('../../mail/strings/tr.json').tr.SUSPICIOUS_LOGIN_CODE,
		'ur': require('../../mail/strings/ur.json').ur.SUSPICIOUS_LOGIN_CODE,
		'mn': require('../../mail/strings/mn.json').mn.SUSPICIOUS_LOGIN_CODE,
		'ja': require('../../mail/strings/ja.json').ja.SUSPICIOUS_LOGIN_CODE,
		'ko': require('../../mail/strings/ko.json').ko.SUSPICIOUS_LOGIN_CODE,
		'pt': require('../../mail/strings/pt.json').pt.SUSPICIOUS_LOGIN_CODE,
		'vi': require('../../mail/strings/vi.json').vi.SUSPICIOUS_LOGIN_CODE,
		'zh': require('../../mail/strings/zh.json').zh.SUSPICIOUS_LOGIN_CODE,
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

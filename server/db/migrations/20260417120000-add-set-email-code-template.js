'use strict';
const TABLE = 'Status';

const languages = {
	SET_EMAIL_CODE: {
		'en': require('../../mail/strings/en.json').en.SET_EMAIL_CODE,
		'ar': require('../../mail/strings/ar.json').ar.SET_EMAIL_CODE,
		'de': require('../../mail/strings/de.json').de.SET_EMAIL_CODE,
		'es': require('../../mail/strings/es.json').es.SET_EMAIL_CODE,
		'fa': require('../../mail/strings/fa.json').fa.SET_EMAIL_CODE,
		'fr': require('../../mail/strings/fr.json').fr.SET_EMAIL_CODE,
		'id': require('../../mail/strings/id.json').id.SET_EMAIL_CODE,
		'tr': require('../../mail/strings/tr.json').tr.SET_EMAIL_CODE,
		'ur': require('../../mail/strings/ur.json').ur.SET_EMAIL_CODE,
		'mn': require('../../mail/strings/mn.json').mn.SET_EMAIL_CODE,
		'ja': require('../../mail/strings/ja.json').ja.SET_EMAIL_CODE,
		'ko': require('../../mail/strings/ko.json').ko.SET_EMAIL_CODE,
		'pt': require('../../mail/strings/pt.json').pt.SET_EMAIL_CODE,
		'vi': require('../../mail/strings/vi.json').vi.SET_EMAIL_CODE,
		'zh': require('../../mail/strings/zh.json').zh.SET_EMAIL_CODE,
	},
};

const models = require('../models');

module.exports = {
	async up(_queryInterface) {
		const templete = 'SET_EMAIL_CODE';
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
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

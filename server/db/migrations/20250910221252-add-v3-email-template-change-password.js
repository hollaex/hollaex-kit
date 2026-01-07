'use strict';
const TABLE = 'Status';

const templetes = [
	'CHANGE_PASSWORD_CODE',
];

const languages = {
	'CHANGE_PASSWORD_CODE': {
		'en': require('../../mail/strings/en.json').en.CHANGE_PASSWORD_CODE,
		'ar': require('../../mail/strings/ar.json').ar.CHANGE_PASSWORD_CODE,
		'de': require('../../mail/strings/de.json').de.CHANGE_PASSWORD_CODE,
		'es': require('../../mail/strings/es.json').es.CHANGE_PASSWORD_CODE,
		'fa': require('../../mail/strings/fa.json').fa.CHANGE_PASSWORD_CODE,
		'fr': require('../../mail/strings/fr.json').fr.CHANGE_PASSWORD_CODE,
		'id': require('../../mail/strings/id.json').id.CHANGE_PASSWORD_CODE,
		'tr': require('../../mail/strings/tr.json').tr.CHANGE_PASSWORD_CODE,
		'ur': require('../../mail/strings/ur.json').ur.CHANGE_PASSWORD_CODE,
		'mn': require('../../mail/strings/mn.json').mn.CHANGE_PASSWORD_CODE,
		'ja': require('../../mail/strings/ja.json').ja.CHANGE_PASSWORD_CODE,
		'ko': require('../../mail/strings/ko.json').ko.CHANGE_PASSWORD_CODE,
		'pt': require('../../mail/strings/pt.json').pt.CHANGE_PASSWORD_CODE,
		'vi': require('../../mail/strings/vi.json').vi.CHANGE_PASSWORD_CODE,
		'zh': require('../../mail/strings/zh.json').zh.CHANGE_PASSWORD_CODE,
	}
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

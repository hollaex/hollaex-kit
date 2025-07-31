'use strict';
const TABLE = 'Status';

const templetes = [
	'WITHDRAWAL_REQUEST_CODE',
	'RESET_PASSWORD_CODE',
	'SIGNUP_CODE',
]

const languages = {
	'WITHDRAWAL_REQUEST_CODE': {
		'en': require('../../mail/strings/en.json').en.WITHDRAWAL_REQUEST_CODE,
		'ar': require('../../mail/strings/ar.json').ar.WITHDRAWAL_REQUEST_CODE,
		'de': require('../../mail/strings/de.json').de.WITHDRAWAL_REQUEST_CODE,
		'es': require('../../mail/strings/es.json').es.WITHDRAWAL_REQUEST_CODE,
		'fa': require('../../mail/strings/fa.json').fa.WITHDRAWAL_REQUEST_CODE,
		'fr': require('../../mail/strings/fr.json').fr.WITHDRAWAL_REQUEST_CODE,
		'id': require('../../mail/strings/id.json').id.WITHDRAWAL_REQUEST_CODE,
		'tr': require('../../mail/strings/tr.json').tr.WITHDRAWAL_REQUEST_CODE,
		'ur': require('../../mail/strings/ur.json').ur.WITHDRAWAL_REQUEST_CODE,
		'mn': require('../../mail/strings/mn.json').mn.WITHDRAWAL_REQUEST_CODE,
		'ja': require('../../mail/strings/ja.json').ja.WITHDRAWAL_REQUEST_CODE,
		'ko': require('../../mail/strings/ko.json').ko.WITHDRAWAL_REQUEST_CODE,
		'pt': require('../../mail/strings/pt.json').pt.WITHDRAWAL_REQUEST_CODE,
		'vi': require('../../mail/strings/vi.json').vi.WITHDRAWAL_REQUEST_CODE,
		'zh': require('../../mail/strings/zh.json').zh.WITHDRAWAL_REQUEST_CODE,
	},

	'RESET_PASSWORD_CODE': {
		'en': require('../../mail/strings/en.json').en.RESET_PASSWORD_CODE,
		'ar': require('../../mail/strings/ar.json').ar.RESET_PASSWORD_CODE,
		'de': require('../../mail/strings/de.json').de.RESET_PASSWORD_CODE,
		'es': require('../../mail/strings/es.json').es.RESET_PASSWORD_CODE,
		'fa': require('../../mail/strings/fa.json').fa.RESET_PASSWORD_CODE,
		'fr': require('../../mail/strings/fr.json').fr.RESET_PASSWORD_CODE,
		'id': require('../../mail/strings/id.json').id.RESET_PASSWORD_CODE,
		'tr': require('../../mail/strings/tr.json').tr.RESET_PASSWORD_CODE,
		'ur': require('../../mail/strings/ur.json').ur.RESET_PASSWORD_CODE,
		'mn': require('../../mail/strings/mn.json').mn.RESET_PASSWORD_CODE,
		'ja': require('../../mail/strings/ja.json').ja.RESET_PASSWORD_CODE,
		'ko': require('../../mail/strings/ko.json').ko.RESET_PASSWORD_CODE,
		'pt': require('../../mail/strings/pt.json').pt.RESET_PASSWORD_CODE,
		'vi': require('../../mail/strings/vi.json').vi.RESET_PASSWORD_CODE,
		'zh': require('../../mail/strings/zh.json').zh.RESET_PASSWORD_CODE,
	},

	'SIGNUP_CODE': {
		'en': require('../../mail/strings/en.json').en.SIGNUP_CODE,
		'ar': require('../../mail/strings/ar.json').ar.SIGNUP_CODE,
		'de': require('../../mail/strings/de.json').de.SIGNUP_CODE,
		'es': require('../../mail/strings/es.json').es.SIGNUP_CODE,
		'fa': require('../../mail/strings/fa.json').fa.SIGNUP_CODE,
		'fr': require('../../mail/strings/fr.json').fr.SIGNUP_CODE,
		'id': require('../../mail/strings/id.json').id.SIGNUP_CODE,
		'tr': require('../../mail/strings/tr.json').tr.SIGNUP_CODE,
		'ur': require('../../mail/strings/ur.json').ur.SIGNUP_CODE,
		'mn': require('../../mail/strings/mn.json').mn.SIGNUP_CODE,
		'ja': require('../../mail/strings/ja.json').ja.SIGNUP_CODE,
		'ko': require('../../mail/strings/ko.json').ko.SIGNUP_CODE,
		'pt': require('../../mail/strings/pt.json').pt.SIGNUP_CODE,
		'vi': require('../../mail/strings/vi.json').vi.SIGNUP_CODE,
		'zh': require('../../mail/strings/zh.json').zh.SIGNUP_CODE,
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

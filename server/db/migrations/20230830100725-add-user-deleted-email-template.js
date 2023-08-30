'use strict';
const TABLE = 'Status';

const languages = {
		'en':  require('../../mail/strings/en.json').en.USER_DELETED,
		'ar':  require('../../mail/strings/ar.json').ar.USER_DELETED,
		'de':  require('../../mail/strings/de.json').de.USER_DELETED,
		'es':  require('../../mail/strings/es.json').es.USER_DELETED,
		'fa':  require('../../mail/strings/fa.json').fa.USER_DELETED,
		'fr':  require('../../mail/strings/fr.json').fr.USER_DELETED,
		'id':  require('../../mail/strings/id.json').id.USER_DELETED,
		'ja':  require('../../mail/strings/ja.json').ja.USER_DELETED,
		'ko':  require('../../mail/strings/ko.json').ko.USER_DELETED,
		'pt':  require('../../mail/strings/pt.json').pt.USER_DELETED,
		'vi':  require('../../mail/strings/vi.json').vi.USER_DELETED,
		'zh':  require('../../mail/strings/zh.json').zh.USER_DELETED,
}
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
	
			if (status.email && !status.email[language].hasOwnProperty('USER_DELETED')) {
				hasTemplate = false;
				emailTemplates[language] = {
					...status.email[language],
					USER_DELETED: emailTemplate
				}
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

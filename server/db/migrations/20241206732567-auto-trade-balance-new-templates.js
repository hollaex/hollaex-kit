'use strict';
const TABLE = 'Status';

const templetes = [
	'AUTO_TRADE_REMINDER',
	'AUTO_TRADE_FILLED'
]

const languages = {
	'AUTO_TRADE_REMINDER': {
		'en':  require('../../mail/strings/en.json').en.AUTO_TRADE_REMINDER,
		'ar':  require('../../mail/strings/ar.json').ar.AUTO_TRADE_REMINDER,
		'de':  require('../../mail/strings/de.json').de.AUTO_TRADE_REMINDER,
		'es':  require('../../mail/strings/es.json').es.AUTO_TRADE_REMINDER,
		'fa':  require('../../mail/strings/fa.json').fa.AUTO_TRADE_REMINDER,
		'fr':  require('../../mail/strings/fr.json').fr.AUTO_TRADE_REMINDER,
		'id':  require('../../mail/strings/id.json').id.AUTO_TRADE_REMINDER,
		'ja':  require('../../mail/strings/ja.json').ja.AUTO_TRADE_REMINDER,
		'ko':  require('../../mail/strings/ko.json').ko.AUTO_TRADE_REMINDER,
		'pt':  require('../../mail/strings/pt.json').pt.AUTO_TRADE_REMINDER,
		'vi':  require('../../mail/strings/vi.json').vi.AUTO_TRADE_REMINDER,
		'zh':  require('../../mail/strings/zh.json').zh.AUTO_TRADE_REMINDER,
	},
	'AUTO_TRADE_FILLED': {
		'en':  require('../../mail/strings/en.json').en.AUTO_TRADE_FILLED,
		'ar':  require('../../mail/strings/ar.json').ar.AUTO_TRADE_FILLED,
		'de':  require('../../mail/strings/de.json').de.AUTO_TRADE_FILLED,
		'es':  require('../../mail/strings/es.json').es.AUTO_TRADE_FILLED,
		'fa':  require('../../mail/strings/fa.json').fa.AUTO_TRADE_FILLED,
		'fr':  require('../../mail/strings/fr.json').fr.AUTO_TRADE_FILLED,
		'id':  require('../../mail/strings/id.json').id.AUTO_TRADE_FILLED,
		'ja':  require('../../mail/strings/ja.json').ja.AUTO_TRADE_FILLED,
		'ko':  require('../../mail/strings/ko.json').ko.AUTO_TRADE_FILLED,
		'pt':  require('../../mail/strings/pt.json').pt.AUTO_TRADE_FILLED,
		'vi':  require('../../mail/strings/vi.json').vi.AUTO_TRADE_FILLED,
		'zh':  require('../../mail/strings/zh.json').zh.AUTO_TRADE_FILLED,
	},
};

const models = require('../models');


module.exports = {
	async up(queryInterface) {

		for (const templete of templetes) {
			const statusModel = models[TABLE];
			const status = await statusModel.findOne({});
	
			if(!status?.email) return;
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

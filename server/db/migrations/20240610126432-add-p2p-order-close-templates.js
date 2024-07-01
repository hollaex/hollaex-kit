'use strict';
const TABLE = 'Status';

const templetes = [
	'P2P_ORDER_CLOSED'
]

const languages = {
	'P2P_ORDER_CLOSED': {
		'en':  require('../../mail/strings/en.json').en.P2P_ORDER_CLOSED,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_ORDER_CLOSED,
		'de':  require('../../mail/strings/de.json').de.P2P_ORDER_CLOSED,
		'es':  require('../../mail/strings/es.json').es.P2P_ORDER_CLOSED,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_ORDER_CLOSED,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_ORDER_CLOSED,
		'id':  require('../../mail/strings/id.json').id.P2P_ORDER_CLOSED,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_ORDER_CLOSED,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_ORDER_CLOSED,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_ORDER_CLOSED,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_ORDER_CLOSED,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_ORDER_CLOSED,
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

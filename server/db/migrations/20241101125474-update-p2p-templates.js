'use strict';
const TABLE = 'Status';

const templetes = [
	'P2P_BUYER_PAID_ORDER'
]

const languages = {
	'P2P_BUYER_PAID_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_BUYER_PAID_ORDER,
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
		
				if (status.email && status.email[language]) {
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

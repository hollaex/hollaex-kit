'use strict';
const TABLE = 'Statuses';

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
}


module.exports = {
	async up(queryInterface, Sequelize) {

		const statusData = await queryInterface.rawSelect(TABLE, { plain: false }, ['id']);

		if(!statusData || statusData?.length === 0) return;
		const status = statusData[0];

		if(!status?.email) return;

		const emailTemplates = {
			...status.email,
		};

		let hasTemplate = true;
		for (const [language, emailTemplate] of Object.entries(languages)) {
	
			if (status.email && !status.email[language].hasOwnProperty('LOCKED_ACCOUNT')) {
				hasTemplate = false;
				emailTemplates[language] = {
					...status.email[language],
					LOCKED_ACCOUNT: emailTemplate
				}
			}
		}

		if (!hasTemplate) {
			await queryInterface.bulkUpdate(
				TABLE, 
				{ email: emailTemplates },
				{}, 
				{},
				{ email: { type: new Sequelize.JSON() } }
			);
		}
		
	},

	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

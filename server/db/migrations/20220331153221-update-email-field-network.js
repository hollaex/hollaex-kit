'use strict';


const TABLE = 'Statuses';
const COLUMN = 'email';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn(TABLE, COLUMN);
		await queryInterface.addColumn(TABLE, COLUMN, {
			type: Sequelize.JSONB,
			defaultValue: {
				'en': require('../../mail/strings/en.json').en,
				'ar': require('../../mail/strings/ar.json').ar,
				'de': require('../../mail/strings/de.json').de,
				'es': require('../../mail/strings/es.json').es,
				'fa': require('../../mail/strings/fa.json').fa,
				'fr': require('../../mail/strings/fr.json').fr,
				'id': require('../../mail/strings/id.json').id,
				'ja': require('../../mail/strings/ja.json').ja,
				'ko': require('../../mail/strings/ko.json').ko,
				'pt': require('../../mail/strings/pt.json').pt,
				'vi': require('../../mail/strings/vi.json').vi,
				'zh': require('../../mail/strings/zh.json').zh
			}
		});
	},
	down: () => {
		return new Promise((resolve) => {
			resolve();
		});
	}
};

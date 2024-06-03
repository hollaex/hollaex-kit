'use strict';
const TABLE = 'Status';

const templetes = [
	'P2P_MERCHANT_IN_PROGRESS',
	'P2P_BUYER_PAID_ORDER',
	'P2P_ORDER_EXPIRED',
	'P2P_BUYER_CANCELLED_ORDER',
	'P2P_BUYER_APPEALED_ORDER',
	'P2P_VENDOR_CONFIRMED_ORDER',
	'P2P_VENDOR_CANCELLED_ORDER',
	'P2P_VENDOR_APPEALED_ORDER'
]

const languages = {
	'P2P_MERCHANT_IN_PROGRESS': {
		'en':  require('../../mail/strings/en.json').en.P2P_MERCHANT_IN_PROGRESS,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_MERCHANT_IN_PROGRESS,
		'de':  require('../../mail/strings/de.json').de.P2P_MERCHANT_IN_PROGRESS,
		'es':  require('../../mail/strings/es.json').es.P2P_MERCHANT_IN_PROGRESS,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_MERCHANT_IN_PROGRESS,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_MERCHANT_IN_PROGRESS,
		'id':  require('../../mail/strings/id.json').id.P2P_MERCHANT_IN_PROGRESS,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_MERCHANT_IN_PROGRESS,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_MERCHANT_IN_PROGRESS,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_MERCHANT_IN_PROGRESS,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_MERCHANT_IN_PROGRESS,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_MERCHANT_IN_PROGRESS,
	},
	'P2P_BUYER_PAID_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_BUYER_PAID_ORDER,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_BUYER_PAID_ORDER,
		'de':  require('../../mail/strings/de.json').de.P2P_BUYER_PAID_ORDER,
		'es':  require('../../mail/strings/es.json').es.P2P_BUYER_PAID_ORDER,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_BUYER_PAID_ORDER,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_BUYER_PAID_ORDER,
		'id':  require('../../mail/strings/id.json').id.P2P_BUYER_PAID_ORDER,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_BUYER_PAID_ORDER,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_BUYER_PAID_ORDER,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_BUYER_PAID_ORDER,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_BUYER_PAID_ORDER,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_BUYER_PAID_ORDER,
	},
	'P2P_ORDER_EXPIRED': {
		'en':  require('../../mail/strings/en.json').en.P2P_ORDER_EXPIRED,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_ORDER_EXPIRED,
		'de':  require('../../mail/strings/de.json').de.P2P_ORDER_EXPIRED,
		'es':  require('../../mail/strings/es.json').es.P2P_ORDER_EXPIRED,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_ORDER_EXPIRED,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_ORDER_EXPIRED,
		'id':  require('../../mail/strings/id.json').id.P2P_ORDER_EXPIRED,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_ORDER_EXPIRED,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_ORDER_EXPIRED,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_ORDER_EXPIRED,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_ORDER_EXPIRED,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_ORDER_EXPIRED,
	},
	'P2P_BUYER_CANCELLED_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_BUYER_CANCELLED_ORDER,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_BUYER_CANCELLED_ORDER,
		'de':  require('../../mail/strings/de.json').de.P2P_BUYER_CANCELLED_ORDER,
		'es':  require('../../mail/strings/es.json').es.P2P_BUYER_CANCELLED_ORDER,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_BUYER_CANCELLED_ORDER,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_BUYER_CANCELLED_ORDER,
		'id':  require('../../mail/strings/id.json').id.P2P_BUYER_CANCELLED_ORDER,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_BUYER_CANCELLED_ORDER,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_BUYER_CANCELLED_ORDER,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_BUYER_CANCELLED_ORDER,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_BUYER_CANCELLED_ORDER,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_BUYER_CANCELLED_ORDER,
	},
	'P2P_BUYER_APPEALED_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_BUYER_APPEALED_ORDER,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_BUYER_APPEALED_ORDER,
		'de':  require('../../mail/strings/de.json').de.P2P_BUYER_APPEALED_ORDER,
		'es':  require('../../mail/strings/es.json').es.P2P_BUYER_APPEALED_ORDER,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_BUYER_APPEALED_ORDER,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_BUYER_APPEALED_ORDER,
		'id':  require('../../mail/strings/id.json').id.P2P_BUYER_APPEALED_ORDER,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_BUYER_APPEALED_ORDER,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_BUYER_APPEALED_ORDER,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_BUYER_APPEALED_ORDER,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_BUYER_APPEALED_ORDER,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_BUYER_APPEALED_ORDER,
	},
	'P2P_VENDOR_CONFIRMED_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_VENDOR_CONFIRMED_ORDER,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_VENDOR_CONFIRMED_ORDER,
		'de':  require('../../mail/strings/de.json').de.P2P_VENDOR_CONFIRMED_ORDER,
		'es':  require('../../mail/strings/es.json').es.P2P_VENDOR_CONFIRMED_ORDER,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_VENDOR_CONFIRMED_ORDER,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_VENDOR_CONFIRMED_ORDER,
		'id':  require('../../mail/strings/id.json').id.P2P_VENDOR_CONFIRMED_ORDER,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_VENDOR_CONFIRMED_ORDER,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_VENDOR_CONFIRMED_ORDER,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_VENDOR_CONFIRMED_ORDER,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_VENDOR_CONFIRMED_ORDER,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_VENDOR_CONFIRMED_ORDER,
	},
	'P2P_VENDOR_CANCELLED_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_VENDOR_CANCELLED_ORDER,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_VENDOR_CANCELLED_ORDER,
		'de':  require('../../mail/strings/de.json').de.P2P_VENDOR_CANCELLED_ORDER,
		'es':  require('../../mail/strings/es.json').es.P2P_VENDOR_CANCELLED_ORDER,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_VENDOR_CANCELLED_ORDER,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_VENDOR_CANCELLED_ORDER,
		'id':  require('../../mail/strings/id.json').id.P2P_VENDOR_CANCELLED_ORDER,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_VENDOR_CANCELLED_ORDER,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_VENDOR_CANCELLED_ORDER,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_VENDOR_CANCELLED_ORDER,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_VENDOR_CANCELLED_ORDER,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_VENDOR_CANCELLED_ORDER,
	},
	'P2P_VENDOR_APPEALED_ORDER': {
		'en':  require('../../mail/strings/en.json').en.P2P_VENDOR_APPEALED_ORDER,
		'ar':  require('../../mail/strings/ar.json').ar.P2P_VENDOR_APPEALED_ORDER,
		'de':  require('../../mail/strings/de.json').de.P2P_VENDOR_APPEALED_ORDER,
		'es':  require('../../mail/strings/es.json').es.P2P_VENDOR_APPEALED_ORDER,
		'fa':  require('../../mail/strings/fa.json').fa.P2P_VENDOR_APPEALED_ORDER,
		'fr':  require('../../mail/strings/fr.json').fr.P2P_VENDOR_APPEALED_ORDER,
		'id':  require('../../mail/strings/id.json').id.P2P_VENDOR_APPEALED_ORDER,
		'ja':  require('../../mail/strings/ja.json').ja.P2P_VENDOR_APPEALED_ORDER,
		'ko':  require('../../mail/strings/ko.json').ko.P2P_VENDOR_APPEALED_ORDER,
		'pt':  require('../../mail/strings/pt.json').pt.P2P_VENDOR_APPEALED_ORDER,
		'vi':  require('../../mail/strings/vi.json').vi.P2P_VENDOR_APPEALED_ORDER,
		'zh':  require('../../mail/strings/zh.json').zh.P2P_VENDOR_APPEALED_ORDER,
	}
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

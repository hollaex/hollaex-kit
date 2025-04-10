'use strict';

const models = require('../models');

const roles = {
	"is_admin": [
		"/admin/exchange:get",
		"/admin/exchange:put",
		"/admin/tier:post",
		"/admin/tier:put",
		"/admin/check-transaction:get",
		"/admin/send-email-test:post",
		"/admin/fees:get",
		"/admin/fees/settle:get",
		"/admin/complete-setup:get",
		"/admin/network-credentials:put",
		"/admin/kit:get",
		"/admin/kit:put",
		"/admin/email:get",
		"/admin/email:put",
		"/admin/email/types:get",
		"/admin/operators:get",
		"/admin/kit/user-meta:post",
		"/admin/kit/user-meta:put",
		"/admin/kit/user-meta:delete",
		"/admin/operator/invite:get",
		"/admin/upload:post",
		"/admin/pair:post",
		"/admin/pair:put",
		"/admin/pairs:get",
		"/admin/pairs/network:get",
		"/admin/pair/fees:put",
		"/admin/coin:post",
		"/admin/coin:put",
		"/admin/coins:get",
		"/admin/coins/network:get",
		"/admin/users:get",
		"/admin/user:post",
		"/admin/user:put",
		"/admin/user:delete",
		"/admin/user/role:put",
		"/admin/user/meta:put",
		"/admin/user/discount:put",
		"/admin/user/note:put",
		"/admin/user/balance:get",
		"/admin/user/bank:post",
		"/admin/user/restore:post",
		"/admin/user/email:put",
		"/admin/bank/verify:post",
		"/admin/bank/revoke:post",
		"/admin/logins:get",
		"/admin/audits:get",
		"/admin/user/balance-history:get",
		"/admin/orders:get",
		"/admin/order:post",
		"/admin/order:delete",
		"/admin/trades:get",
		"/admin/user/activate:post",
		"/admin/balance:get",
		"/admin/upgrade-user:post",
		"/admin/verify-email:post",
		"/admin/deactivate-otp:post",
		"/admin/flag-user:post",
		"/admin/deposits:get",
		"/admin/withdrawals:get",
		"/admin/transfer:post",
		"/admin/mint:post",
		"/admin/mint:put",
		"/admin/burn:post",
		"/admin/burn:put",
		"/admin/dash-token:get",
		"/admin/user/affiliation:get",
		"/admin/user/referer:get",
		"/admin/user/wallet:get",
		"/admin/user/wallet:post",
		"/admin/send-email:post",
		"/admin/send-email/raw:post",
		"/admin/user/disable-withdrawal:post",
		"/admin/user/sessions:get",
		"/admin/user/revoke-session:post",
		"/admin/user/trading-volume:get",
		"/admin/user/referral/code:get",
		"/admin/user/referral/code:post",
		"/admin/quicktrade/config:put",
		"/admin/transaction/limit:put",
		"/admin/transaction/limit:get",
		"/admin/transaction/limit:delete",
		"/admin/balances:get",
		"/admin/stakes:get",
		"/admin/stake:post",
		"/admin/stake:put",
		"/admin/stake:delete",
		"/admin/stake/slash-estimate:get",
		"/admin/stakers:get",
		"/admin/stake/analytics:get",
		"/admin/p2p/dispute:get",
		"/admin/p2p/dispute:put",
		"/admin/trade:post",
		"/admin/withdrawal:post",
		"/admin/user/payment-details:get",
		"/admin/user/payment-details:post",
		"/admin/user/payment-details:put",
		"/admin/user/payment-details:delete",
		"/admin/announcements:get",
		"/admin/announcements:post",
		"/admin/announcements:put",
		"/admin/announcements:delete",
		"/admin/roles:get",
		"/admin/roles:post",
		"/admin/roles:put",
		"/admin/roles:delete",
		"/admin/endpoints:get",
		"/admin/signup:post"
	],
	"is_supervisor": [
		"/admin/exchange:get",
		"/admin/kit:get",
		"/admin/kit/user-meta:put",
		"/admin/users:get",
		"/admin/user:put",
		"/admin/user/meta:put",
		"/admin/user/discount:put",
		"/admin/user/note:put",
		"/admin/user/balance:get",
		"/admin/user/bank:post",
		"/admin/bank/verify:post",
		"/admin/bank/revoke:post",
		"/admin/logins:get",
		"/admin/orders:get",
		"/admin/order:delete",
		"/admin/trades:get",
		"/admin/user/activate:post",
		"/admin/upgrade-user:post",
		"/admin/verify-email:post",
		"/admin/deactivate-otp:post",
		"/admin/flag-user:post",
		"/admin/deposits:get",
		"/admin/withdrawals:get",
		"/admin/user/affiliation:get",
		"/admin/user/referer:get",
		"/admin/user/wallet:post",
		"/admin/user/sessions:get",
		"/admin/user/revoke-session:post",
		"/admin/user/referral/code:get",
		"/admin/user/referral/code:post"
	],
	"is_support": [
		"/admin/exchange:get",
		"/admin/kit:get",
		"/admin/users:get",
		"/admin/user/note:put",
		"/admin/logins:get",
		"/admin/orders:get",
		"/admin/trades:get",
		"/admin/user/activate:post",
		"/admin/flag-user:post",
		"/admin/deposits:get",
		"/admin/withdrawals:get",
		"/admin/user/affiliation:get",
		"/admin/user/referer:get",
		"/admin/user/wallet:post"
	],
	"is_kyc": [
		"/admin/exchange:get",
		"/admin/kit:get",
		"/admin/users:get",
		"/admin/user:put",
		"/admin/user/note:put",
		"/admin/user/bank:post",
		"/admin/bank/verify:post",
		"/admin/bank/revoke:post",
		"/admin/logins:get",
		"/admin/orders:get",
		"/admin/trades:get",
		"/admin/user/activate:post",
		"/admin/upgrade-user:post",
		"/admin/verify-email:post",
		"/admin/flag-user:post",
		"/admin/deposits:get",
		"/admin/withdrawals:get",
		"/admin/user/affiliation:get",
		"/admin/user/referer:get",
		"/admin/user/wallet:post"
	],
	"is_communicator": [
		"/admin/exchange:get",
		"/admin/kit:get",
		"/admin/kit:put",
		"/admin/upload:post"
	]
}

const configRoles = {
	"is_admin": [
		'captcha',
		'api_name',
		'description',
		'color',
		'title',
		'links',
		'defaults',
		'native_currency',
		'logo_image',
		'valid_languages',
		'new_user_is_activated',
		'interface',
		'icons',
		'strings',
		'meta',
		'features',
		'setup_completed',
		'email_verification_required',
		'injected_values',
		'injected_html',
		'user_meta',
		'black_list_countries',
		'onramp',
		'offramp',
		'user_payments',
		'dust',
		'coin_customizations',
		'fiat_fees',
		'balance_history_config',
		'transaction_limits',
		'p2p_config',
		'referral_history_config',
		'chain_trade_config',
		'selectable_native_currencies',
		'auto_trade_config',
		'apps',
		'timezone',
		'allowed_domains',
		'admin_whitelist',
		'emails',
		'security',
		'smtp',
	]
}

const communicatorRoles = [
	'captcha',
	'api_name',
	'description',
	'color',
	'title',
	'links',
	'defaults',
	'native_currency',
	'logo_image',
	'valid_languages',
	'new_user_is_activated',
	'interface',
	'icons',
	'strings',
	'meta',
	'features',
	'setup_completed',
	'email_verification_required',
	'injected_values',
	'injected_html',
	'user_meta',
	'black_list_countries',
	'onramp',
	'offramp',
	'user_payments',
	'dust',
	'coin_customizations',
	'fiat_fees',
	'balance_history_config',
	'transaction_limits',
	'p2p_config',
	'referral_history_config',
	'chain_trade_config',
	'selectable_native_currencies',
	'auto_trade_config',
	'apps',
	'timezone'
];

module.exports = {
	async up(queryInterface) {
		const userModel = models['User'];
		const roleModel = models['Role'];

		// Create roles first
		const createdRoles = {};

		for (const [roleFlag, permissions] of Object.entries(roles)) {
			const roleName = roleFlag.replace('is_', '').charAt(0).toUpperCase() +
				roleFlag.replace('is_', '').slice(1);

			const [role] = await roleModel.findOrCreate({
				where: { role_name: roleName },
				defaults: {
					role_name: roleName,
					description: `${roleName} role with specific permissions`,
					permissions: permissions,
					...(roleFlag === "is_admin" && { configs: configRoles.is_admin }),
					...(roleFlag === "is_communicator" && { configs: communicatorRoles })
				}
			});

			createdRoles[roleFlag] = role.role_name;
		}

		// Fetch users with their current role 
		const users = await userModel.findAll({
			where: {
				[models.Sequelize.Op.or]: [
					{ is_admin: true },
					{ is_supervisor: true },
					{ is_support: true },
					{ is_kyc: true },
					{ is_communicator: true },
				]
			},
			attributes: ['id', 'is_admin', 'is_supervisor', 'is_support', 'is_kyc', 'is_communicator']
		});

		// Assign roles to users 
		for (const user of users) {
			let roleName = null;

			if (user.is_admin) {
				roleName = createdRoles['is_admin'];
			} else if (user.is_supervisor) {
				roleName = createdRoles['is_supervisor'];
			} else if (user.is_support) {
				roleName = createdRoles['is_support'];
			} else if (user.is_kyc) {
				roleName = createdRoles['is_kyc'];
			} else if (user.is_communicator) {
				roleName = createdRoles['is_communicator'];
			}

			if (roleName) {
				await userModel.update(
					{ role: roleName },
					{ where: { id: user.id } }
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

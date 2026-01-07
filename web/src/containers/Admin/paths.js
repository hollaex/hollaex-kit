import { APP_TITLE } from 'config/constants';

export const ADMIN_PATHS = [
	{
		path: '/admin',
		// component: Main,
		label: APP_TITLE.toUpperCase(),
		routeKey: 'main',
	},
	{
		path: '/admin/general',
		// component: User,
		label: 'General',
		routeKey: 'general',
	},
	{
		path: '/admin/user',
		// component: User,
		label: 'Users',
		routeKey: 'user',
	},
	{
		path: '/admin/financials',
		label: 'Assets',
		routeKey: 'financials',
	},
	{
		path: '/admin/trade',
		label: 'Markets',
		routeKey: 'trade',
	},
	{
		path: '/admin/fiat',
		label: 'Fiat controls',
		routeKey: 'trade',
	},
	{
		path: '/admin/stakes',
		label: 'Stakes',
		routeKey: 'stake',
	},
	{
		path: '/admin/sessions',
		label: 'Sessions',
		routeKey: 'session',
	},
	{
		path: '/admin/plugins',
		// component: BlockchainTransaction,
		label: 'Plugins',
		routeKey: 'plugins',
	},
	{
		path: '/admin/tiers',
		// component: BlockchainTransaction,
		label: 'Tiers',
		routeKey: 'tiers',
	},
	{
		path: '/admin/audits',
		label: 'Admin Logs',
		routeKey: 'audits',
	},
	{
		path: '/admin/roles',
		// component: BlockchainTransaction,
		label: 'Roles',
		routeKey: 'roles',
	},
	// {
	//  path: '/admin/hosting',
	//  label: 'Hosting',
	//  routeKey: 'hosting',
	// },
	// {
	//  path: '/admin/billing',
	//  label: 'Billing',
	//  routeKey: 'billing',
	// },
	{
		path: '/admin/chat',
		label: 'Chat',
		routeKey: 'chat',
	},
	{
		path: '/admin/billing',
		label: 'Billing',
		routeKey: 'billing',
	},
	// {
	//  path: '/admin/collateral',
	//  label: 'Collateral',
	//  routeKey: 'collateral',
	// },
	// {
	//  path: '/admin/wallets',
	//  // component: Wallets,
	//  label: 'Wallets',
	//  hideIfSupport: true,
	//  hideIfSupervisor: true,
	//  hideIfKYC: true,
	//  routeKey: 'wallets'
	// },
	// {
	//  path: '/admin/fees',
	//  label: 'Fees',
	//  routeKey: 'fees'
	// },
	// {
	//  path: '/admin/transfer',
	//  label: 'Transfer',
	//  routeKey: 'transfer'
	// },
	// {
	//  path: '/admin/deposits',
	//  // component: Deposits,
	//  label: 'Deposits',
	//  hideIfSupport: true,
	//  hideIfKYC: true,
	//  hideIfSupervisor: false,
	//  pathProps: {
	//      type: 'deposit',
	//      showFilters: true
	//  },
	//  routeKey: 'deposit'
	// },
	// {
	//  path: '/admin/withdrawals',
	//  // component: Deposits,
	//  label: 'Withdrawals',
	//  pathProps: {
	//      type: 'withdrawal',
	//      showFilters: true
	//  },
	//  hideIfSupport: true,
	//  hideIfKYC: true,
	//  hideIfSupervisor: false,
	//  routeKey: 'withdrawal'
	// },
	// {
	//  path: '/admin/activeorders',
	//  label: 'Active Orders',
	//  hideIfSupport: true,
	//  hideIfKYC: true,
	//  hideIfSupervisor: true,
	//  routeKey: 'orders'
	// },
	// {
	//  path: '/admin/pair',
	//  // component: UserFees,
	//  label: 'Trading Pairs',
	//  hideIfSupport: true,
	//  hideIfKYC: true,
	//  hideIfSupervisor: true,
	//  routeKey: 'pair'
	// },
	// {
	//  path: '/admin/coin',
	//  // component: Limits,
	//  label: 'Coins',
	//  hideIfSupport: true,
	//  hideIfKYC: true,
	//  hideIfSupervisor: true,
	//  routeKey: 'coin'
	// },
	// {
	//  path: '/admin/chat',
	//  // component: Chat,
	//  label: 'Chat',
	//  hideIfSupport: false,
	//  hideIfKYC: true,
	//  hideIfSupervisor: false,
	//  routeKey: 'Chat'
	// },
	// {
	//  path: '/admin/blockchain',
	//  // component: BlockchainTransaction,
	//  label: 'Vault',
	//  routeKey: 'blockChain'
	// },
	// {
	//  path: '/admin/broker',
	//  label: 'Broker',
	//  routeKey: 'broker'
	// },
	// {
	//  path: '/admin/settings',
	//  // component: BlockchainTransaction,
	//  label: 'Settings',
	//  routeKey: 'settings'
	// },
	{
		path: '/admin/plugins/store',
		label: 'store',
		routeKey: 'store',
	},
];

export const SUPERVISOR_PATH = [
	{
		path: '/admin/fiat',
		label: 'Fiat controls',
		routeKey: 'trade',
	},
	{
		path: '/admin/financials',
		label: 'Assets',
		routeKey: 'financials',
	},
	{
		path: '/admin/sessions',
		label: 'Sessions',
		routeKey: 'session',
	},
];

export const PATHS = [
	{
		path: '/admin',
		// component: Main,
		label: APP_TITLE.toUpperCase(),
		routeKey: 'main',
	},
	{
		path: '/admin/user',
		// component: User,
		label: 'Users',
		routeKey: 'user',
	},
	{
		path: '/admin/chat',
		label: 'Chat',
		routeKey: 'chat',
	},
];

export const pathToPermissionMap = {
	'/admin/general': [
		'/admin/exchange:',
		'/admin/check-transaction:',
		'/admin/send-email-test:',
		'/admin/complete-setup:',
		'/admin/network-credentials:',
		'/admin/email:',
		'/admin/email/types:',
		'/admin/operators:',
		'/admin/operator/invite:',
		'/admin/upload:',
		'/admin/endpoints:',
		'/admin/signup:',
	],
	'/admin/user': [
		'/admin/users:',
		'/admin/user:',
		'/admin/user/role:',
		'/admin/user/meta:',
		'/admin/user/discount:',
		'/admin/user/note:',
		'/admin/user/balance:',
		'/admin/user/bank:',
		'/admin/user/restore:',
		'/admin/user/email:',
		'/admin/user/activate:',
		'/admin/user/affiliation:',
		'/admin/user/referer:',
		'/admin/user/wallet:',
		'/admin/user/disable-withdrawal:',
		'/admin/user/sessions:',
		'/admin/user/revoke-session:',
		'/admin/user/trading-volume:',
		'/admin/user/referral/code:',
		'/admin/user/payment-details:',
		'/admin/user/balance-history:',
		'/admin/flag-user:',
		'/admin/upgrade-user:',
		'/admin/verify-email:',
		'/admin/deactivate-otp:',
	],
	'/admin/financials': [
		'/admin/coin:',
		'/admin/coins:',
		'/admin/coins/network:',
		'/admin/balance:',
		'/admin/balances:',
		'/admin/dash-token:',
		'/admin/mint:',
		'/admin/burn:',
		'/admin/transfer:',
		'/admin/user/wallet:',
		'/admin/orders:get',
		'/admin/trades:get',
		'/admin/deposits:get',
		'/admin/withdrawals:get',
		'/admin/fees:get',
		'/admin/transfer:post',
		'/admin/transaction/limit:get',
		'/admin/kit:get',
		'admin/balance:get',
		'/admin/user/wallet:get',
		'/admin/balances:get',
	],
	'/admin/trade': [
		'/admin/trade:',
		'/admin/pair:',
		'/admin/pairs:',
		'/admin/pairs/network:',
		'/admin/pair/fees:',
		'/admin/quicktrade/config:',
		'/admin/transaction/limit:',
		'/admin/orders:',
		'/admin/order:',
		'/admin/trades:',
		'/admin/pairs/network:get',
		'/admin/orders:get',
		'/admin/broker:get',
		'/admin/p2p/dispute:get',
		'/admin/exchange:put',
	],
	'/admin/fiat': [
		'/admin/bank:',
		'/admin/fiat:',
		'/admin/bank/verify:',
		'/admin/bank/revoke:',
		'/admin/deposits:',
		'/admin/withdrawals:',
		'/admin/exchange:',
	],
	'/admin/stakes': [
		'/admin/stake:',
		'/admin/stakes:',
		'/admin/stake/slash-estimate:',
		'/admin/stakers:',
		'/admin/stake/analytics:',
	],
	'/admin/sessions': ['/admin/logins:', '/admin/user/sessions:'],
	'/admin/plugins': ['/admin/kit:', '/admin/plugins:'],
	'/admin/plugins/store': ['/admin/kit:', '/admin/plugins:'],
	'/admin/tiers': ['/admin/tier:'],
	'/admin/audits': ['/admin/audits:'],
	'/admin/roles': ['/admin/role:', '/admin/role/assign:'],
	'/admin/chat': ['/admin/send-email:', '/admin/send-email/raw:'],
};

export const ADMIN_TABS_PERMISSIONS = {
	'/admin/general': {
		0: 'api_name defaults',
		1: 'description',
		2: 'security',
		3: 'features',
		4: 'new_user_is_activated',
		5: 'emails',
		6: 'defaults',
		7: 'links',
		8: 'apps',
	},
	'/admin/financials': {
		0: '/admin/balance:get',
		1: '/admin/kit:get',
		2: '/admin/transaction/limit:get',
		3: '/admin/balance:get',
		4: '/admin/user/wallet:get',
		5: '/admin/balances:get',
		6: '/admin/orders:get',
		7: '/admin/trades:get',
		8: '/admin/deposits:get',
		9: '/admin/withdrawals:get',
		10: '/admin/fees:get',
		11: '/admin/transfer:post',
		12: '/admin/transfer:post',
	},
	'/admin/trade': {
		0: '/admin/pairs/network:get',
		1: '/admin/orders:get',
		2: '/admin/broker:get',
		3: '/admin/p2p/dispute:get',
		4: '/admin/exchange:put',
	},
};

export const canAccessPath = (path, userPermissions = []) => {
	const requiredPrefixes = pathToPermissionMap[path] || [`${path}:`];
	return requiredPrefixes?.some((prefix) =>
		userPermissions?.some((p) => typeof p === 'string' && p?.startsWith(prefix))
	);
};

export const getVisibleTabKeys = (routePath, userPermissions = []) => {
	const rules = ADMIN_TABS_PERMISSIONS[routePath] || {};
	return Object.keys(rules)?.filter((key) => {
		const perm = rules[key];
		return userPermissions?.includes(perm);
	});
};

export const getFirstEnabledTabKey = (routePath, userPermissions = []) => {
	const keys = getVisibleTabKeys(routePath, userPermissions);
	return keys?.length ? keys[0] : undefined;
};

export const checkTabAvailable = (
	tabIndex,
	routePath,
	userPermissions = []
) => {
	return userPermissions?.includes(ADMIN_TABS_PERMISSIONS[routePath][tabIndex]);
};

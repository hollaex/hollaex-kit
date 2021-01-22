import { APP_TITLE } from '../../config/constants';

export const PATHS = [
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
		label: 'Financials',
		routeKey: 'financials',
	},
	{
		path: '/admin/trade',
		label: 'Trading',
		routeKey: 'trade',
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
		path: '/admin/roles',
		// component: BlockchainTransaction,
		label: 'Roles',
		routeKey: 'roles',
	},
	{
		path: '/admin/hosting',
		label: 'Hosting',
		routeKey: 'hosting',
	},
	{
		path: '/admin/apikeys',
		label: 'API Keys',
		routeKey: 'apikeys',
	},
	{
		path: '/admin/billing',
		label: 'Billing',
		routeKey: 'billing',
	},
	{
		path: '/admin/chat',
		label: 'Chat',
		routeKey: 'chat',
	},
	{
		path: '/admin/collateral',
		label: 'Collateral',
		routeKey: 'collateral',
	},
	// {
	// 	path: '/admin/wallets',
	// 	// component: Wallets,
	// 	label: 'Wallets',
	// 	hideIfSupport: true,
	// 	hideIfSupervisor: true,
	// 	hideIfKYC: true,
	// 	routeKey: 'wallets'
	// },
	// {
	// 	path: '/admin/fees',
	// 	label: 'Fees',
	// 	routeKey: 'fees'
	// },
	// {
	// 	path: '/admin/transfer',
	// 	label: 'Transfer',
	// 	routeKey: 'transfer'
	// },
	// {
	// 	path: '/admin/deposits',
	// 	// component: Deposits,
	// 	label: 'Deposits',
	// 	hideIfSupport: true,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: false,
	// 	pathProps: {
	// 		type: 'deposit',
	// 		showFilters: true
	// 	},
	// 	routeKey: 'deposit'
	// },
	// {
	// 	path: '/admin/withdrawals',
	// 	// component: Deposits,
	// 	label: 'Withdrawals',
	// 	pathProps: {
	// 		type: 'withdrawal',
	// 		showFilters: true
	// 	},
	// 	hideIfSupport: true,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: false,
	// 	routeKey: 'withdrawal'
	// },
	// {
	// 	path: '/admin/activeorders',
	// 	label: 'Active Orders',
	// 	hideIfSupport: true,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: true,
	// 	routeKey: 'orders'
	// },
	// {
	// 	path: '/admin/pair',
	// 	// component: UserFees,
	// 	label: 'Trading Pairs',
	// 	hideIfSupport: true,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: true,
	// 	routeKey: 'pair'
	// },
	// {
	// 	path: '/admin/coin',
	// 	// component: Limits,
	// 	label: 'Coins',
	// 	hideIfSupport: true,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: true,
	// 	routeKey: 'coin'
	// },
	// {
	// 	path: '/admin/chat',
	// 	// component: Chat,
	// 	label: 'Chat',
	// 	hideIfSupport: false,
	// 	hideIfKYC: true,
	// 	hideIfSupervisor: false,
	// 	routeKey: 'Chat'
	// },
	// {
	// 	path: '/admin/blockchain',
	// 	// component: BlockchainTransaction,
	// 	label: 'Vault',
	// 	routeKey: 'blockChain'
	// },
	// {
	// 	path: '/admin/broker',
	// 	label: 'Broker',
	// 	routeKey: 'broker'
	// },
	// {
	// 	path: '/admin/settings',
	// 	// component: BlockchainTransaction,
	// 	label: 'Settings',
	// 	routeKey: 'settings'
	// },
];


import { APP_TITLE } from '../../config/constants';

export const PATHS = [
	{
		path: '/admin',
		// component: Main,
		label: APP_TITLE.toUpperCase(),
		routeKey: 'main'
	},
	{
		path: '/admin/user',
		// component: User,
		label: 'User',
		routeKey: 'user'
	},
	{
		path: '/admin/wallets',
		// component: Wallets,
		label: 'Wallets',
		hideIfSupport: true,
		hideIfSupervisor: true,
		hideIfKYC: true,
		routeKey: 'wallets'
	},
	{
		path: '/admin/deposits',
		// component: Deposits,
		label: 'Deposits',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: false,
		pathProps: {
			type: 'deposit',
			showFilters: true
		},
		routeKey: 'deposit'
	},
	{
		path: '/admin/withdrawals',
		// component: Deposits,
		label: 'Withdrawals',
		pathProps: {
			type: 'withdrawal',
			showFilters: true
		},
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: false,
		routeKey: 'withdrawal'
	},
	{
		path: '/admin/fees',
		// component: UserFees,
		label: 'Trading Pairs',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'fees'
	},
	{
		path: '/admin/limits',
		// component: Limits,
		label: 'Coins',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'limits'
	},
	{
		path: '/admin/chat',
		// component: Chat,
		label: 'Chat',
		hideIfSupport: false,
		hideIfKYC: true,
		hideIfSupervisor: false,
		routeKey: 'Chat'
	},
	{
		path: '/admin/blockchain',
		// component: BlockchainTransaction,
		label: 'Vault',
		routeKey: 'blockChain'
	},
];

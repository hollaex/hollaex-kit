// import {
// 	Chat,
// 	User,
// 	Main,
// 	Limits,
// 	DepositsPage as Deposits,
// 	BlockchainTransaction,
// 	UserFees,
// 	Wallets,
// } from './';

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
		label: 'USER',
		routeKey: 'user'
	},
	{
		path: '/admin/wallets',
		// component: Wallets,
		label: 'WALLETS',
		hideIfSupport: true,
		hideIfSupervisor: true,
		hideIfKYC: true,
		routeKey: 'wallets'
	},
	{
		path: '/admin/withdrawals',
		// component: Deposits,
		label: 'WITHDRAWALS',
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
		path: '/admin/deposits',
		// component: Deposits,
		label: 'DEPOSITS',
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
		path: '/admin/blockchain',
		// component: BlockchainTransaction,
		label: 'CHECK BLOCKCHAIN TX',
		routeKey: 'blockChain'
	},
	{
		path: '/admin/fees',
		// component: UserFees,
		label: 'USER FEES',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'fees'
	},
	{
		path: '/admin/limits',
		// component: Limits,
		label: 'LIMITS',
		hideIfSupport: true,
		hideIfKYC: true,
		hideIfSupervisor: true,
		routeKey: 'limits'
	},
	{
		path: '/admin/chat',
		// component: Chat,
		label: 'CHAT',
		hideIfSupport: false,
		hideIfKYC: true,
		hideIfSupervisor: false,
		routeKey: 'Chat'
	}
];

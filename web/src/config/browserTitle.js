import { createSelector } from 'reselect';
import { capitalize } from 'lodash';

import STRINGS from './localizedStrings';
import { formatToFixed } from 'utils/currency';
import { marketPriceSelector } from 'containers/Trade/utils';

const getConstants = (state) => state.app.constants;
const getWithdrawCurrency = (state) =>
	state.app.withdrawFields.withdrawCurrency;
const getDepositCurrency = (state) => state.app.depositFields.depositCurrency;
const getPair = (state) => state.app.pair;
const getPairs = (state) => state.app.pairs;
const getLastPrice = (state) => marketPriceSelector(state);
const getSelectedAnnouncement = (state) => state.app.selectedAnnouncement;
const isActiveSelectedAnnouncement = (state) =>
	state.app.isActiveSelectedAnnouncement;
const getRemoteRoutes = (state) => state.app.remoteRoutes;

const makeTitle = (label, apiName) => `${label} | ${apiName}`;

export const browserTitleSelector = createSelector(
	[
		getConstants,
		getWithdrawCurrency,
		getDepositCurrency,
		getPair,
		getPairs,
		getLastPrice,
		getSelectedAnnouncement,
		isActiveSelectedAnnouncement,
		getRemoteRoutes,
	],
	(
		constants = {},
		withdrawCurrency,
		depositCurrency,
		pair = '',
		pairs = {},
		lastPrice,
		selectedAnnouncement,
		isActiveSelectedAnnouncement,
		getRemoteRoutes
	) => {
		const { increment_price } = pairs[pair] || {};
		const price = formatToFixed(lastPrice, increment_price);
		const [pairBase = '', pair_2 = ''] = pair?.split('-');

		const apiName = constants?.api_name || '';
		const getRoute = getRemoteRoutes?.map((data) => {
			return {
				path: data?.path,
				label: STRINGS[data?.string_id],
			};
		});

		const titleList = [
			{
				path: '/summary',
				activePath: ['/account'],
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_ACCOUNT_OVERVIEW'],
			},
			{ path: '/wallet', label: STRINGS['BROWSER_TAB_TITLE.TITLE_WALLET'] },
			{
				path: '/wallet/history',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_WALLET_PERFORMANCE'],
				query: '?performance',
			},
			{
				path: '/wallet/history',
				label: STRINGS['PROFIT_LOSS.BALANCE_HISTORY'],
				query: '?balance-history',
			},
			{
				path: withdrawCurrency
					? `/wallet/${withdrawCurrency}/withdraw`
					: '/wallet/withdraw',
				label: `${STRINGS['WITHDRAW_PAGE.WITHDRAW']} ${
					withdrawCurrency ? withdrawCurrency?.toUpperCase() : ''
				}`,
			},
			{
				path: depositCurrency
					? `/wallet/${depositCurrency}/deposit`
					: '/wallet/deposit',
				label: `${STRINGS['ACCORDIAN.DEPOSIT_LABEL']} ${
					depositCurrency ? depositCurrency?.toUpperCase() : ''
				}`,
			},
			{
				path: '/markets',
				activePath: ['/trade'],
				label: STRINGS['SUMMARY.MARKETS'],
			},
			{
				path: `/trade/${pair}`,
				label: `${price} | ${pair?.toUpperCase()}`,
			},
			{
				path: `/quick-trade/${pair}`,
				label: `${STRINGS['CONVERT']} ${pairBase?.toUpperCase()} ${STRINGS[
					'TO'
				]?.toLowerCase()} ${pair_2?.toUpperCase()}`,
			},
			{ path: '/prices', label: STRINGS['BROWSER_TAB_TITLE.TITLE_PRICE'] },
			{
				path: '/wallet/address-book',
				label: STRINGS['ADDRESS_BOOK.ADDRESS_BOOK_LABEL'],
			},
			{
				path: '/wallet/volume',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_VOLUME'],
			},
			{ path: '/auto-trader', label: STRINGS['AUTO_TRADER.AUTO_TRADER_TITLE'] },
			{
				path: '/referral',
				label: STRINGS['REFERRAL_LINK.REFERRAL_EARNINGS'],
				query: '?summary',
			},
			{
				path: '/referral',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_REFERRAL_EARNINGS_HISTORY'],
				query: '?history',
			},
			{
				path: '/announcement',
				label:
					selectedAnnouncement && isActiveSelectedAnnouncement
						? `${capitalize(selectedAnnouncement?.type)} ${
								STRINGS['TRADE_TAB_POSTS']
						  }`
						: STRINGS['TRADE_TAB_POSTS'],
			},
			{ path: '/details', activePath: ['/more'], label: STRINGS['SEARCH_TXT'] },
			{ path: '/stake', label: STRINGS['STAKE.CEFI_STAKING'], query: '?cefi' },
			{ path: '/stake', label: STRINGS['STAKE.DEFI_STAKING'], query: '?defi' },
			{
				path: '/transactions',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_TRADE_HISTORY'],
				query: 'trades',
			},
			{
				path: '/transactions',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_ORDER_HISTORY'],
				query: 'orders',
			},
			{
				path: '/transactions',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_DEPOSIT_HISTORY'],
				query: 'deposits',
			},
			{
				path: '/transactions',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_WITHDRAWAL_HISTORY'],
				query: 'withdrawals',
			},
			{
				path: '/settings',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_NOTIFICATION'],
				query: '?signals',
			},
			{
				path: '/settings',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_LANGUAGE'],
				query: '?language',
			},
			{
				path: '/settings',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_AUDIO_CUE'],
				query: '?audioCue',
			},
			{
				path: '/settings',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_INTERFACE'],
				query: '?interface',
			},
			{
				path: '/settings',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_ACCOUNT'],
				query: '?account',
			},
			{
				path: '/verification',
				label: STRINGS['SUMMARY.EMAIL_VERIFICATION'],
				query: '?email',
			},
			{
				path: '/verification',
				label: STRINGS['USER_VERIFICATION.PHONE_VERIFICATION'],
				query: '?phone',
			},
			{
				path: '/verification',
				label: STRINGS['USER_VERIFICATION.IDENTITY_VERIFICATION'],
				query: '?identity',
			},
			{
				path: '/verification',
				label: STRINGS['USER_VERIFICATION.PAYMENT_VERIFICATION'],
				query: '?payment-accounts',
			},
			{
				path: '/security',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_2FA_SECURITY'],
				query: '?2fa',
			},
			{
				path: '/security',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_PASSWORD_SECURITY'],
				query: '?password',
			},
			{
				path: '/security',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_API_KEYS_SECURITY'],
				query: '?apiKeys',
			},
			{
				path: '/security',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_SESSIONS_SECURITY'],
				query: '?sessions',
			},
			{
				path: '/security',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_LOGIN_HISTORY_SECURITY'],
				query: '?login-history',
			},
			{
				path: '/fees-and-limits',
				label: STRINGS['FEES_AND_LIMITS.TABS.TRADING_FEES.TITLE'],
				query: '?trading-fees',
			},
			{
				path: '/fees-and-limits',
				label: STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_FEES.TITLE'],
				query: '?withdrawal-fees',
			},
			{
				path: '/fees-and-limits',
				label: STRINGS['FEES_AND_LIMITS.TABS.WITHDRAWAL_LIMITS.TITLE'],
				query: '?withdrawal-limits',
			},
			{ path: '/p2p', label: STRINGS['BROWSER_TAB_TITLE.TITLE_P2P'] },
			{
				path: '/p2p/orders',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_P2P_ORDERS'],
			},
			{
				path: '/p2p/profile',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_P2P_PROFILE'],
			},
			{
				path: '/p2p/post-deal',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_POST_DEAL'],
			},
			{
				path: '/p2p/mydeals',
				label: STRINGS['BROWSER_TAB_TITLE.TITLE_MY_DEALS'],
			},
			...getRoute,
		].map((item) => ({
			...item,
			browserTitle: makeTitle(item?.label, apiName),
		}));

		return titleList;
	}
);

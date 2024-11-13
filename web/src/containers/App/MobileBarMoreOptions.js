import React, { useCallback, useEffect, useState } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import icons from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import Dialog from 'components/Dialog/MobileDialog';
import withConfig from 'components/ConfigProvider/withConfig';
import HelpfulResourcesForm from 'containers/HelpfulResourcesForm';
import { Coin, EditWrapper, Image, SearchBox } from 'components';
import {
	setLimitTab,
	setSecurityTab,
	setSettingsTab,
	setStake,
	setVerificationTab,
} from 'actions/appActions';
import { getLogins } from 'actions/userAction';
import { requestAuthenticated } from 'utils';
import { ConnectionPopup, ReconnectPopup } from 'components/AppBar/Utils';
import { removeToken } from 'utils/token';
import { MarketsSelector } from 'containers/Trade/utils';

const INITIAL_LOGINS_STATE = {
	count: 0,
	data: [],
};

const MobileBarMoreOptions = ({
	setVerificationTab,
	setSecurityTab,
	setLimitTab,
	setSelectedStake,
	features,
	setSettingsTab,
	coins,
	pinnedAsset,
	getMarkets,
	quickTrade,
}) => {
	const [search, setSearch] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDisplayPopup, setIsDisplayPopup] = useState({
		isDisplayConnection: false,
		isDisplayReconnect: false,
	});
	const [loginDetail, setLoginDetail] = useState(INITIAL_LOGINS_STATE);
	const [hasResponseData, setHasResponseData] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [pingDetails, setPingDetails] = useState({
		isDisplayPingText: true,
		pingValue: null,
		isDisplayPing: false,
	});

	const fieldHasCoinIcon = [
		'SUMMARY.DEPOSIT',
		'TRADE_TAB_TRADE',
		'CONVERT',
		'ASSET_TXT',
		'WITHDRAW_PAGE.WITHDRAW',
	];
	const searchByName = Object.entries(
		coins
	)?.map(([_, { symbol, fullname, type }]) =>
		type !== 'fiat' ? { symbol, fullname } : {}
	);

	const getSymbol = searchByName
		?.filter((data) => {
			return (
				search?.length > 1 &&
				(data?.fullname?.toLowerCase()?.startsWith(search?.toLowerCase()) ||
					data?.symbol?.toLowerCase()?.startsWith(search?.toLowerCase()))
			);
		})
		?.sort((a, b) => {
			const indexA = pinnedAsset?.indexOf(a?.symbol?.toLowerCase());
			const indexB = pinnedAsset?.indexOf(b?.symbol?.toLowerCase());

			if (indexA === -1 && indexB === -1) return 0;
			if (indexA === -1) return 1;
			if (indexB === -1) return -1;
			return indexA - indexB;
		});

	const getAsset =
		getSymbol?.length >= 1
			? getSymbol[0]?.symbol
			: search?.length > 1 && search;
	const isValidCoin = coins[getAsset]?.symbol;

	const assetDetails = Object.entries(
		coins
	)?.flatMap(([_, { symbol, fullname, type }]) =>
		type !== 'fiat' ? [symbol, fullname] : []
	);

	const getPairs = getMarkets?.filter((market) => {
		return market?.key?.split('-')?.includes(getAsset);
	});

	const getQuickTradePair = quickTrade?.filter((quicktrade) => {
		return quicktrade?.symbol?.split('-')?.includes(getAsset);
	});

	useEffect(() => {
		setSecurityTab(null);
		setLimitTab(null);
		setVerificationTab(null);
		const fetchData = async () => {
			try {
				await requestLogins();
				await fetchHealthData();
			} catch (error) {
				setHasResponseData(false);
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		//eslint-disable-next-line
	}, []);

	const requestLogins = useCallback((page = 1) => {
		getLogins({ page })
			.then(({ data: { count, data } }) => {
				setLoginDetail((prevLogins) => ({
					count,
					data: prevLogins.data.concat(data),
				}));
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const fetchHealthData = async () => {
		setIsLoading(true);
		const startTime = Date.now();
		try {
			await requestAuthenticated('/health');
			setHasResponseData(true);
			const duration = Date.now() - startTime;
			setPingDetails((prev) => ({
				...prev,
				pingValue: duration,
			}));
		} catch (error) {
			setHasResponseData(false);
			console.error('Error fetching health data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const hotFunctionOptions = [
		{
			icon_id: 'DEPOSIT_OPTION_ICON',
			iconText: 'SUMMARY.DEPOSIT',
			path: isValidCoin ? `/wallet/${getAsset}/deposit` : '/wallet/deposit',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ADD_FUNDS'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.TOP_UP'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.LOAD'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.CREDIT'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.FUND_ACCOUNT'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BTC'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USTD'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ETH'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USD'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.XHT'],
				STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.TRANSFER'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.MONEY'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.FUNDING'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.RECHARGE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.REFILL'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.CASH_IN'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ADD_MONEY'],
				...assetDetails,
			],
		},
		{
			icon_id: 'TRADE_OPTION_ICON',
			iconText: 'TRADE_TAB_TRADE',
			path:
				isValidCoin && getPairs?.length >= 1
					? `/trade/${getPairs[0]?.key}`
					: '/trade',
			isDisplay: features?.pro_trade,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.EXCHANGE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.SWAP'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BUY_SELL'],
				STRINGS['TYPES.MARKET'],
				STRINGS['DEVELOPERS_TOKEN.TRADING_ACCESS'],
				STRINGS['PRO_TRADE'],
				STRINGS['P2P.ORDER'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ETH'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USD'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.XHT'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BTC'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USTD'],
				...getPairs?.flatMap((item) => [
					...item?.key?.split('-'),
					item?.fullname,
				]),
			],
		},
		{
			icon_id: 'CONVERT_OPTION_ICON',
			iconText: 'CONVERT',
			path:
				getQuickTradePair?.length >= 1
					? `/quick-trade/${getQuickTradePair[0]?.symbol}`
					: '/quick-trade',
			isDisplay: features?.quick_trade,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.EXCHANGE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.SWAP'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.TRADE'],
				STRINGS['QUICK_TRADE_COMPONENT.CHANGE_TEXT'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.CONVERT_CURRENCY'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BUY_SELL'],
				STRINGS['QUICK_TRADE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ORDER'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ETH'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USD'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.XHT'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BTC'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USTD'],
				...getQuickTradePair?.flatMap((item) => {
					const [firstPair] = item?.symbol?.split('-');
					return [firstPair, item?.fullname];
				}),
			],
		},
		{
			icon_id: 'REFERRAL_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.REFERRALS',
			path: '/referral',
			isDisplay: features?.referral_history_config,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.INVITE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.REFER'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.REWARDS'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BONUS'],
				STRINGS['STAKE.EARN'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.AFFILIATION'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.AFFILIATE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.PASSIVE_INCOME'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.REVENUE'],
			],
		},
	];

	const otherFunctionOptions = [
		{
			icon_id: 'API_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.API',
			path: '/security?apiKeys',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.INTEGRATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PROGRAMMATIC_ACCESS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.DEVELOPER'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.AUTOMATED_TRADING'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BOT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ALGO'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ALGORITHM'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SECURITY'],
			],
		},
		{
			icon_id: 'BUY_CRYPTO_OPTION',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.BUY_CRYPTO',
			path: '/buy-crypto',
			isDisplay: true,
			searchContent: [
				STRINGS['MARKET_OPTIONS.CARD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CRYPTO'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BUY_SELL'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.FIAT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.DOLLAR'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PURCHASE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.XHT'],
				STRINGS['P2P.ORDER'],
				STRINGS['CURRENCY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BUY_COIN'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BUY_TOKEN'],
			],
		},
		{
			icon_id: 'DEFI_STAKE_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.DEFI_STAKE',
			path: '/stake',
			isDisplay: features?.stake_page,
			searchContent: [
				STRINGS['STAKE.EARN'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.PASSIVE_INCOME'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.YIELD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.INTEREST'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.XHT'],
				STRINGS['CURRENCY_WALLET.STAKING'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.REVENUE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BONUS'],
			],
		},
		{
			icon_id: 'CEFI_STAKE_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.CEFI_STAKE',
			path: '/stake',
			isDisplay: features?.cefi_stake,
			searchContent: [
				STRINGS['STAKE.EARN'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.PASSIVE_INCOME'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.YIELD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.INTEREST'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.REVENUE'],
				STRINGS['CURRENCY_WALLET.STAKING'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CENTRALIZED_STAKING'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BONUS'],
			],
		},
		{
			icon_id: 'PROFIT_LOSS_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.PROFIT_LOSS',
			path: '/wallet/history',
			isDisplay: true,
			searchContent: [
				STRINGS['REFERRAL_LINK.EARNING'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PERFORMANCE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.GAINS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LOSSES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PORTFOLIO_PROFIT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PNL'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LOSS'],
			],
		},
		{
			icon_id: 'FEES_OPTION_ICON',
			iconText: 'FEES',
			path: '/fees-and-limits',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CHARGES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.COSTS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.COMMISSION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TRADING_FEES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TRANSACTION_FEES'],
			],
		},
		{
			icon_id: 'LIMITS_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.LIMITS',
			path: '/fees-and-limits',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.RESTRICTIONS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BOUNDARIES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CAPS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MAXIMUM'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.WITHDRAWAL_LIMITS'],
				STRINGS['CALCULATE_MAX'],
			],
		},
		{
			icon_id: 'WALLET_OPTION_ICON',
			iconText: 'ACCOUNTS.TAB_WALLET',
			path: '/wallet',
			isDisplay: true,
			searchContent: [
				STRINGS['ACCOUNT_TEXT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.STORAGE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.FUNDS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BALANCE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.MONEY'],
				STRINGS['FIAT.UNVERIFIED.DEPOSIT'],
				STRINGS['WITHDRAW_PAGE.WITHDRAW'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CRYPTO_WALLET'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MY'],
			],
		},
		{
			icon_id: 'LANGUAGE_OPTION_ICON',
			iconText: 'USER_SETTINGS.TITLE_LANGUAGE',
			path: '/settings?language',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ENGLISH'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LOCALIZATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TRANSLATE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LANGUAGE_SETTINGS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MULTILINGUAL'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LANGUAGE_PREFERENCE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TEXT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.WORD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SETTINGS'],
			],
		},
		{
			icon_id: 'P2P_OPTION_ICON',
			iconText: 'P2P.TAB_P2P',
			path: '/p2p',
			isDisplay: features?.p2p,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PEER_TO_PEER'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.DIRECT_TRADE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.USER_TO_USER'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BUY_SELL'],
				STRINGS['DEVELOPERS_TOKEN.TRADING_ACCESS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PRIVATE_TRADE'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.EXCHANGE'],
			],
		},
		{
			icon_id: 'HISTORY_OPTION_ICON',
			iconText: 'ACCOUNTS.TAB_HISTORY',
			path: '/transactions',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TRANSACTIONS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ACTIVITY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.RECORD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LOG'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TRANSACTION_HISTORY'],
			],
		},
		{
			icon_id: 'VOLUME_OPTION_ICON',
			iconText: 'CHART_TEXTS.v',
			path: 'wallet/volume',
			isDisplay: true,
			searchContent: [
				STRINGS['SUMMARY.TRADING_VOLUME'],
				STRINGS['ACTIVITY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TRADING_ACTIVITY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LIQUIDITY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MARKET_VOLUME'],
			],
		},
		{
			icon_id: 'ASSET_OPTION_ICON',
			iconText: 'ASSET_TXT',
			path: isValidCoin ? `/prices/coin/${getAsset}` : '/prices',
			isDisplay: true,
			searchContent: [
				STRINGS['COINS'],
				STRINGS['WALLET_ASSETS_SEARCH_TXT'],
				STRINGS['ASSETS'],
				STRINGS['CURRENCY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CRYPTO'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.ETH'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.BTC'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.USTD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MARKETS'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.MONEY'],
				...assetDetails,
			],
		},
		{
			icon_id: 'OPTION_2FA_ICON',
			iconText: 'ACCOUNT_SECURITY.OTP.TITLE',
			path: '/security?2fa',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.TWO_FACTOR_AUTHENTICATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MFA'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.AUTHENTICATOR'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.OTP'],
				STRINGS['ACCOUNTS.TAB_SECURITY'],
				STRINGS['ACCOUNTS.TAB_VERIFICATION'],
			],
		},
		{
			icon_id: 'PASSWORD_OPTION_ICON',
			iconText: 'ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE',
			path: '/security?password',
			isDisplay: true,
			searchContent: [
				STRINGS['ACCOUNTS.TAB_SECURITY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CREDENTIALS'],
				STRINGS['LOGIN_TEXT'],
				STRINGS['DEVELOPERS_TOKEN.ACCESS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PASSWORD_RESET'],
				STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.BUTTON'],
			],
		},
		{
			icon_id: 'LOGIN_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.LOGINS',
			path: '/security',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SECURITY'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SIGN_INS'],
				STRINGS['DEVELOPERS_TOKEN.ACCESS'],
				STRINGS['LOGINS_HISTORY.TAB'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ACCOUNT_ACCESS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SESSION_HISTORY'],
			],
		},
		{
			icon_id: 'SESSION_OPTION_ICON',
			iconText: 'SESSIONS.TAB',
			path: '/security',
			isDisplay: true,
			searchContent: [
				STRINGS['SESSIONS.CONTENT.TITLE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LOGGED_IN'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SESSION_MANAGEMENT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CURRENT_SESSIONS'],
				STRINGS['LOGOUT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SECURITY'],
			],
		},
		{
			icon_id: 'BANK_OPTION_ICON',
			iconText: 'USER_VERIFICATION.TITLE_BANK',
			path: '/verification',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BANKING_DETAILS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BANK_ACCOUNT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.FINANCIAL_INSTITUTION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.BANK_INFO'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.WITHDRAWAL_ACCOUNT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.FUND'],
				STRINGS['WALLET_BUTTON_BASE_DEPOSIT'],
				STRINGS['WALLET_BUTTON_BASE_WITHDRAW'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.KYC'],
				STRINGS['ACCOUNTS.TAB_VERIFICATION'],
			],
		},
		{
			icon_id: 'AUDIO_OPTION_ICON',
			iconText: 'MORE_OPTIONS_LABEL.ICONS.AUDIO',
			path: '/settings?audioCue',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SOUND'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.AUDIO_SETTINGS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ALERTS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.NOTIFICATIONS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.AUDIO_ALERTS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SETTINGS'],
			],
		},
		{
			icon_id: 'ADDRESS_OPTION_ICON',
			iconText: 'ADDRESS_BOOK.ADDRESSES',
			path: '/wallet/address-book',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.WITHDRAWAL_ADDRESSES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CRYPTO_ADDRESSES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.WALLET_ADDRESSES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SAVED_ADDRESSES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ADDRESS_BOOK'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.WHITE_LISTED'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MY'],
			],
		},
		{
			icon_id: 'INTERFACE_OPTION_ICON',
			iconText: 'USER_SETTINGS.TITLE_INTERFACE',
			path: '/settings?interface',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.UI'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.USER_INTERFACE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LAYOUT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.DESIGN'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.DASHBOARD'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.COLOR_THEME'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ORDER_BOOK'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.DARK'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LIGHT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SETTINGS'],
			],
		},
		{
			icon_id: 'NOTIFICATION_OPTION_ICON',
			iconText: 'USER_SETTINGS.TITLE_NOTIFICATION',
			path: '/settings?signals',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ALERT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.UPDATES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.REMINDERS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.NOTIFICATIONS'],
				STRINGS['TRADE_TAB_POSTS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SETTINGS'],
			],
		},
		{
			icon_id: 'HISTORY_OPTION_ICON',
			iconText: 'USER_SETTINGS.TITLE_CHAT',
			path: '/settings?account',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MESSAGE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.LIVE_CHAT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SETTINGS'],
			],
		},
		{
			icon_id: 'HELP_OPTION_ICON',
			iconText: 'LOGIN.HELP',
			path: '/more',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SUPPORT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CONTACT_LOWER'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.EMAIL_LOWER'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.RESOURCE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.GUIDES'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.FAQ'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CUSTOMER_SERVICE'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ASSISTANCE'],
				STRINGS['REFER_DOCS_LINK'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.API_LOWER'],
			],
		},
		{
			icon_id: 'WITHDRAW_OPTION_ICON',
			iconText: 'WITHDRAW_PAGE.WITHDRAW',
			path: isValidCoin ? `/wallet/${getAsset}/withdraw` : '/wallet/withdraw',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PAYOUT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CASH_OUT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.REMOVE_FUNDS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.OUT'],
				STRINGS['SUMMARY.WITHDRAWAL'],
				STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.TRANSFER'],
				...assetDetails,
			],
		},
		{
			icon_id: 'IDENTITY_OPTION_ICON',
			iconText: 'USER_VERIFICATION.TITLE_IDENTITY',
			path: '/verification?identity',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.PERSONAL_INFO'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.IDENTITY_CHECK'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.ID'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.KYC_CAPS'],
				STRINGS['ACCOUNTS.TAB_VERIFICATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MY'],
			],
		},
		{
			icon_id: 'PHONE_OPTION_ICON',
			iconText:
				'USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION.TITLE_PHONE',
			path: '/verification?phone',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CONTACT'],
				STRINGS['USER_VERIFICATION.TITLE_MOBILE'],
				STRINGS['USER_VERIFICATION.PHONE_VERIFICATION'],
				STRINGS[
					'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.PHONE_NUMBER_LABEL'
				],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.SMS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.KYC'],
				STRINGS['ACCOUNTS.TAB_VERIFICATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MY'],
			],
		},
		{
			icon_id: 'EMAIL_OPTION_ICON',
			iconText: 'USER_VERIFICATION.TITLE_EMAIL',
			path: '/verification?email',
			isDisplay: true,
			searchContent: [
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.CONTACT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.EMAIL_ADDRESS'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MAIL'],
				STRINGS['SUMMARY.EMAIL_VERIFICATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.EMAIL_CONTACT'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.KYC'],
				STRINGS['ACCOUNTS.TAB_VERIFICATION'],
				STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.MY'],
			],
		},
		{
			icon_id: 'REVOKE_SESSION',
			iconText: 'ACCOUNTS.TAB_SIGNOUT',
			path: `/`,
			isDisplay: true,
			searchContent: [STRINGS['LOGOUT']],
		},
	];

	const onHandleRoute = (text, path) => {
		browserHistory.push(path);
		const actions = {
			'MORE_OPTIONS_LABEL.ICONS.CEFI_STAKE': () => setSelectedStake('cefi'),
			'MORE_OPTIONS_LABEL.ICONS.DEFI_STAKE': () => setSelectedStake('defi'),
			'ACCOUNTS.TAB_SIGNOUT': () => removeToken(),
			FEES: () => setLimitTab(0),
			'MORE_OPTIONS_LABEL.ICONS.LIMITS': () => setLimitTab(2),
			'ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE': () => setSecurityTab(1),
			'MORE_OPTIONS_LABEL.ICONS.API': () => setSecurityTab(2),
			'MORE_OPTIONS_LABEL.ICONS.LOGINS': () => setSecurityTab(4),
			'SESSIONS.TAB': () => setSecurityTab(3),
			'USER_VERIFICATION.TITLE_BANK': () => setVerificationTab(3),
			'LOGIN.HELP': () => setIsDialogOpen(true),
			'MORE_OPTIONS_LABEL.ICONS.AUDIO': () => setSettingsTab(3),
			'USER_SETTINGS.TITLE_LANGUAGE': () => setSettingsTab(2),
			'USER_SETTINGS.TITLE_INTERFACE': () => setSettingsTab(1),
			'USER_SETTINGS.TITLE_NOTIFICATION': () => setSettingsTab(0),
			'USER_SETTINGS.TITLE_CHAT': () => setSettingsTab(4),
		};

		const action = actions[text];
		if (action) action();
	};

	const onHandleSearch = (e) => {
		setSearch(e.target.value);
	};

	const filterOptions = (options) => {
		return options?.filter((option) => {
			const iconTextMatch = (STRINGS[option?.iconText] || '')
				?.toLowerCase()
				.includes(search?.toLowerCase());
			const searchContentMatch = option?.searchContent?.some((content) =>
				content?.toLowerCase()?.includes(search?.toLowerCase())
			);
			return iconTextMatch || searchContentMatch;
		});
	};

	const renderOptions = (filteredOption, title) => {
		return (
			<div className="hot-options-container">
				<span className="hot-function-title">{title?.toUpperCase()}</span>
				{filteredOption.length > 0 ? (
					<div className="options-field">
						{filteredOption?.map(
							(data, inx) =>
								data.isDisplay && (
									<div
										key={inx}
										className="icon-field"
										onClick={() => onHandleRoute(data?.iconText, data?.path)}
									>
										{fieldHasCoinIcon?.includes(data?.iconText) ? (
											<div className={isValidCoin ? 'image-wrapper' : ''}>
												<Image
													iconId={data?.icon_id}
													icon={icons[data?.icon_id]}
													wrapperClassName="icon-logo"
												/>
												<span className="assets-icon">
													<Coin type="CS5" iconId={coins[getAsset]?.icon_id} />
												</span>
											</div>
										) : (
											<Image
												iconId={data?.icon_id}
												icon={icons[data?.icon_id]}
												wrapperClassName="icon-logo"
											/>
										)}
										<div className="option-title">
											<EditWrapper stringId={data?.iconText}>
												{STRINGS[data?.iconText]}
											</EditWrapper>
										</div>
									</div>
								)
						)}
					</div>
				) : (
					<div className="text-align-center my-5">
						<EditWrapper>
							<span className="secondary-text">
								{STRINGS['MORE_OPTIONS_LABEL.NO_RESULT_DESC_1']}
							</span>
						</EditWrapper>
						<EditWrapper>
							<span className="secondary-text">
								{STRINGS['MORE_OPTIONS_LABEL.NO_RESULT_DESC_2']}
							</span>
						</EditWrapper>
					</div>
				)}
			</div>
		);
	};

	const filteredHotFunctionOptions = filterOptions(hotFunctionOptions);
	const filteredOtherFunctionOptions = filterOptions(otherFunctionOptions);

	const renderHelpDialog = () => {
		return (
			<Dialog
				isOpen={isDialogOpen}
				onCloseDialog={() => setIsDialogOpen(false)}
			>
				<HelpfulResourcesForm
					onSubmitSuccess={() => setIsDialogOpen(false)}
					onClose={() => setIsDialogOpen(false)}
				/>
			</Dialog>
		);
	};

	const onHandleConnection = () => {
		if (hasResponseData) {
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayConnection: true,
			}));
			fetchHealthData();
		} else {
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayReconnect: true,
			}));
		}
	};

	const onHandleClose = (value) => {
		if (value === 'connection') {
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayConnection: false,
			}));
		} else {
			setIsDisplayPopup((prev) => ({
				...prev,
				isDisplayReconnect: false,
			}));
		}
		setPingDetails((prev) => ({
			...prev,
			isDisplayPing: false,
			isDisplayPingText: true,
		}));
	};

	return (
		<div className="footer-bar-more-options-container">
			{isDialogOpen && renderHelpDialog()}
			<SearchBox
				placeHolder={STRINGS['MORE_OPTIONS_LABEL.MORE_OPTION_SEARCH_TXT']}
				handleSearch={(e) => onHandleSearch(e)}
			/>
			<div className="options-container">
				{renderOptions(
					filteredHotFunctionOptions,
					STRINGS['MORE_OPTIONS_LABEL.HOT_FUNCTION.HOT_FUNCTION_LABEL']
				)}
				{renderOptions(
					filteredOtherFunctionOptions,
					STRINGS['MORE_OPTIONS_LABEL.OTHER_FUNCTIONS.OTHER_FUNCTIONS_LABEL']
				)}
			</div>
			<div className="bottom-bar-button">
				<span className="d-flex w-100 justify-content-end">
					<span
						className={
							hasResponseData
								? 'custom-connection-circle mt-2 mr-2'
								: 'custom-connection-error-circle custom-connection-circle mt-2 mr-2'
						}
					></span>
					<EditWrapper>
						<span
							className="fs-16 blue-link text pointer text-decoration-underline"
							onClick={() => onHandleConnection()}
						>
							{`(${STRINGS['CONNECTIONS.CONNECTION_LABEL']})`}
						</span>
					</EditWrapper>
				</span>
			</div>
			{isDisplayPopup?.isDisplayConnection && (
				<ConnectionPopup
					isDisplayPopup={isDisplayPopup}
					setIsDisplayPopup={setIsDisplayPopup}
					pingDetails={pingDetails}
					setPingDetails={setPingDetails}
					onHandleClose={onHandleClose}
					isLoading={isLoading}
					hasResponseData={hasResponseData}
					loginDetail={loginDetail}
					fetchHealthData={fetchHealthData}
				/>
			)}
			{isDisplayPopup?.isDisplayReconnect && (
				<ReconnectPopup
					isDisplayPopup={isDisplayPopup}
					setIsDisplayPopup={setIsDisplayPopup}
					setPingDetails={setPingDetails}
					onHandleClose={onHandleClose}
					fetchHealthData={fetchHealthData}
				/>
			)}
		</div>
	);
};

const mapStateToProps = (store) => ({
	features: store.app.features,
	coins: store.app.coins,
	pinnedAsset: store.app.pinned_assets,
	getMarkets: MarketsSelector(store),
	quickTrade: store.app.quicktrade,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedStake: bindActionCreators(setStake, dispatch),
	setLimitTab: bindActionCreators(setLimitTab, dispatch),
	setSecurityTab: bindActionCreators(setSecurityTab, dispatch),
	setVerificationTab: bindActionCreators(setVerificationTab, dispatch),
	setSettingsTab: bindActionCreators(setSettingsTab, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(MobileBarMoreOptions));

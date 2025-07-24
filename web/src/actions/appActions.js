import { setLanguage as storeLanguageInBrowser } from '../utils/string';
import { hasTheme } from 'utils/theme';
import { DEFAULT_LANGUAGE, LANGUAGE_KEY, PLUGIN_URL } from 'config/constants';
import axios from 'axios';
import querystring from 'query-string';
import store from 'store';

export const SET_IS_READY = 'SET_IS_READY';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';
export const CLOSE_ALL_NOTIFICATION = 'CLOSE_ALL_NOTIFICATION';
export const SET_SNACK_NOTIFICATION = 'SET_SNACK_NOTIFICATION';
export const CLOSE_SNACK_NOTIFICATION = 'CLOSE_SNACK_NOTIFICATION';
export const SET_SNACK_DIALOG = 'SET_SNACK_DIALOG';
export const CLOSE_SNACK_DIALOG = 'CLOSE_SNACK_DIALOG';
export const NOTIFICATIONS = {
	ORDERS: 'NOTIFICATIONS_ORDERS',
	TRADES: 'NOTIFICATIONS_TRADES',
	DEPOSIT: 'NOTIFICATIONS_DEPOSIT',
	WITHDRAWAL: 'NOTIFICATIONS_WITHDRAWAL',
	ERROR: 'NOTIFICATIONS_ERROR',
	LOGOUT: 'NOTIFICATIONS_LOGOUT',
	VERIFICATION: 'NOTIFICATIONS_VERIFICATION',
	CONTACT_FORM: 'NOTIFICATIONS_CONTACT_FORM',
	HELPFUL_RESOURCES_FORM: 'HELPFUL_RESOURCES_FORM',
	NEW_ORDER: 'NOTIFICATIONS_NEW_ORDER',
	GENERATE_API_KEY: 'NOTIFICATIONS_GENERATE_API_KEY',
	CREATED_API_KEY: 'NOTIFICATIONS_CREATED_API_KEY',
	GENERATE_ADDRESS: 'NOTIFICATIONS_GENERATE_ADDRESS',
	WITHDRAWAL_EMAIL_CONFIRMATION: 'WITHDRAWAL_EMAIL_CONFIRMATION',
	INVITE_FRIENDS: 'INVITE_FRIENDS',
	STAKE_TOKEN: 'STAKE_TOKEN',
	DEPOSIT_INFO: 'DEPOSIT_INFO',
	XHT_SUCCESS_ACCESS: 'XHT_SUCCESS_ACCESS',
	UNDEFINED_ERROR: 'UNDEFINED_ERROR',
	STAKE: 'STAKE',
	EARLY_UNSTAKE: 'EARLY_UNSTAKE',
	UNSTAKE: 'UNSTAKE',
	MOVE_XHT: 'MOVE_XHT',
	METAMASK_ERROR: 'METAMASK_ERROR',
	CONFIGURE_APPS: 'CONFIGURE_APPS',
};
export const CONTACT_FORM = 'CONTACT_FORM';
export const HELPFUL_RESOURCES_FORM = 'HELPFUL_RESOURCES_FORM';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const SET_ANNOUNCEMENT = 'SET_ANNOUNCEMENT';
export const SET_APP_ANNOUNCEMENT = 'SET_APP_ANNOUNCEMENT';
export const SET_UNREAD = 'SET_UNREAD';
export const SET_PAIRS = 'SET_PAIRS';
export const CHANGE_PAIR = 'CHANGE_PAIR';
export const SET_ACTIVE_ORDERS_MARKET = 'SET_ACTIVE_ORDERS_MARKET';
export const SET_RECENT_TRADES_MARKETS = 'SET_RECENT_TRADES_MARKETS';
export const SET_TICKERS = 'SET_TICKERS';
export const SET_TICKER_FROM_TRADE = 'SET_TICKER_FROM_TRADE';
export const CHANGE_THEME = 'CHANGE_THEME';
export const SET_ORDER_LIMITS = 'SET_ORDER_LIMITS';
export const FEES_STRUCTURE_AND_LIMITS = 'FEES_STRUCTURE_AND_LIMITS';
export const MARKET_SELECTOR = 'MARKET_SELECTOR';
export const CONNECT_VIA_DESKTOP = 'CONNECT_VIA_DESKTOP';
export const RISK_PORTFOLIO_ORDER_WARING = 'RISK_PORTFOLIO_ORDER_WARING';
export const RISKY_ORDER = 'RISKY_ORDER';
export const LOGOUT_CONFORMATION = 'LOGOUT_CONFORMATION';
export const SET_CURRENCIES = 'SET_CURRENCIES';
export const OVERWRITE_CURRENCY_NAMES = 'OVERWRITE_CURRENCY_NAMES';
export const SET_USER_PAYMENTS = 'SET_USER_PAYMENTS';
export const SET_ONRAMP = 'SET_ONRAMP';
export const SET_OFFRAMP = 'SET_OFFRAMP';
export const SET_BROKER = 'SET_BROKER';
export const SET_QUICKTRADE = 'SET_QUICKTRADE';
export const SET_TRANSACTION_LIMITS = 'SET_TRANSACTION_LIMITS';
export const SET_CONFIG = 'SET_CONFIG';
export const SET_PLUGINS = 'SET_PLUGINS';
export const SET_EXPLORE_PLUGINS = 'SET_EXPLORE_PLUGINS';
export const SELECTED_PLUGIN = 'SELECTED_PLUGIN';
export const SET_INFO = 'SET_INFO';
export const SET_PLUGINS_REQUEST = 'SET_PLUGINS_REQUEST';
export const SET_PLUGINS_SUCCESS = 'SET_PLUGINS_SUCCESS';
export const SET_PLUGINS_FAILURE = 'SET_PLUGINS_FAILURE';
export const SET_CONFIG_LEVEL = 'SET_CONFIG_LEVEL';
export const ADD_TO_FAVOURITES = 'ADD_TO_FAVOURITES';
export const REMOVE_FROM_FAVOURITES = 'REMOVE_FROM_FAVOURITES';
export const CHANGE_HOME_PAGE_SETTING = 'CHANGE_HOME_PAGE_SETTING';
export const SET_WEB_VIEWS = 'SET_WEB_VIEWS';
export const SET_HELPDESK_INFO = 'SET_HELP_INFO';
export const SET_INJECTED_VALUES = 'SET_INJECTED_VALUES';
export const SET_INJECTED_HTML = 'SET_INJECTED_HTML';
export const SET_CONTRACTS = 'SET_CONTRACTS';
export const SET_ALL_CONTRACTS = 'SET_ALL_CONTRACTS';
export const SET_TRADE_TAB = 'SET_TRADE_TAB';
export const SET_SORT_MODE = 'SET_SORT_MODE';
export const SET_WALLET_SORT_MODE = 'SET_WALLET_SORT_MODE';
export const SET_DIGITAL_ASSETS_SORT_MODE = 'SET_DIGITAL_ASSETS_SORT_MODE';
export const TOGGLE_WALLET_SORT = 'TOGGLE_WALLET_SORT';
export const TOGGLE_SORT = 'TOGGLE_SORT';
export const TOGGLE_DIGITAL_ASSETS_SORT = 'TOGGLE_DIGITAL_ASSETS_SORT';
export const SET_ADMIN_SORT = 'SET_ADMIN_SORT';
export const SET_ADMIN_WALLET_SORT = 'SET_ADMIN_WALLET_SORT';
export const SET_ADMIN_DIGITAL_ASSETS_SORT = 'SET_ADMIN_DIGITAL_ASSETS_SORT';
export const SET_SELECTED_ACCOUNT = 'SET_SELECTED_ACCOUNT';
export const SET_SELECTED_STEP = 'SET_SELECTED_STEP';
export const SET_WITHDRAW_CURRENCY = 'SET_WITHDRAW_CURRENCY';
export const SET_WITHDRAW_NETWORK = 'SET_WITHDRAW_NETWORK';
export const SET_WITHDRAW_NETWORK_OPTIONS = 'SET_WITHDRAW_NETWORK_OPTIONS';
export const SET_WITHDRAW_ADDRESS = 'SET_WITHDRAW_ADDRESS';
export const SET_WITHDRAW_AMOUNT = 'SET_WITHDRAW_AMOUNT';
export const SET_WITHDRAW_FEE = 'SET_WITHDRAW_FEE';
export const SET_DEPOSIT_AND_WITHDRAW = 'SET_DEPOSIT_AND_WITHDRAW';
export const SET_VALID_ADDRESS = 'SET_VALID_ADDRESS';
export const SET_DEPOSIT_CURRENCY = 'SET_DEPOSIT_CURRENCY';
export const SET_DEPOSIT_NETWORK = 'SET_DEPOSIT_NETWORK';
export const SET_DEPOSIT_NETWORK_OPTIONS = 'SET_DEPOSIT_OPTIONS';
export const SET_SELECTED_METHOD = 'SET_SELECTED_METHOD';
export const SET_RECEIVER_EMAIL = 'SET_RECEIVER_EMAIL';
export const SET_WITHDRAW_OTIONAL_TAG = 'SET_WITHDRAW_OTIONAL_TAG';
export const SET_CHART_DATA = 'SET_CHART_DATA';
export const SET_COINS_DATA = 'SET_COINS_DATA';
export const SET_STAKE = 'SET_STAKE';
export const SET_LIMITS_TAB = 'SET_LIMITS_TAB';
export const SET_SECURITY_TAB = 'SET_SECURITY_TAB';
export const SET_VERIFICATION_TAB = 'SET_VERIFICATION_TAB';
export const SET_SETTINGS_TAB = 'SET_SETTINGS_TAB';
export const SET_ACTIVE_CHAT = 'SET_ACTIVE_CHAT';
export const SET_ACTIVE_MARKET_SELECTOR = 'SET_ACTIVE_MARKET_SELECTOR';
export const SET_TOOLS_VISIBLE = 'SET_TOOLS_VISIBLE';
export const SET_ACTIVE_PRO_TRADE = 'SET_ACTIVE_PRO_TRADE';
export const SET_ACTIVE_QUICK_TRADE = 'SET_ACTIVE_QUICK_TRADE';
export const SET_SELECTED_ANNOUNCEMENT = 'SET_SELECTED_ANNOUNCEMENT';
export const SET_ACTIVE_SELECTED_ANNOUNCEMENT =
	'SET_ACTIVE_SELECTED_ANNOUNCEMENT';
export const SET_EXCHANGE_TIMEZONE = 'SET_EXCHANGE_TIMEZONE';
export const SET_IS_ADMIN_ANNOUNCEMENT_FEATURE =
	'SET_IS_ADMIN_ANNOUNCEMENT_FEATURE';
export const SET_IS_REFRESH_ASSETS = 'SET_IS_REFRESH_ASSETS';
export const SET_MARKET_REFRESH = 'SET_MARKET_REFRESH';
export const SET_ERROR = 'SET_ERROR';
export const SET_ERROR_COUNT = 'SET_ERROR_COUNT';
export const SET_SIGNUP_EMAIL = 'SET_SIGNUP_EMAIL';
export const SET_EMAIL_DETAIL = 'SET_EMAIL_DETAIL';
export const SET_IS_ACTIVE_FAV_QUICK_TRADE = 'SET_IS_ACTIVE_FAV_QUICK_TRADE';
export const SET_ROLES = 'SET_ROLES';
export const SET_EDIT_MODE = 'SET_EDIT_MODE';
export const SET_TRANSACTION_PAIR = 'SET_TRANSACTION_PAIR';

export const SORT = {
	VOL: 'volume',
	CHANGE: 'change',
};

export const WALLET_SORT = {
	AMOUNT: 'amount',
};

export const DIGITAL_ASSETS_SORT = {
	CHANGE: 'change',
	CHANGESEVENDAY: 'changeSevenDay',
};

export const SORT_EXP = {
	VOL: 'most actively traded first',
	CHANGE: 'biggest gainers first',
};

export const WALLET_SORT_EXP = {
	AMOUNT: 'asset with the most amount',
};

export const DIGITAL_ASSETS_SORT_EXP = {
	CHANGE: 'biggest gainers first',
};

export const setSortModeAmount = () => ({
	type: SET_WALLET_SORT_MODE,
	payload: WALLET_SORT.AMOUNT,
});

export const setSortModeVolume = () => ({
	type: SET_SORT_MODE,
	payload: SORT.VOL,
});

export const setSortModeChange = () => ({
	type: SET_SORT_MODE,
	payload: SORT.CHANGE,
});

export const setAdminSortData = ({ pinned_markets, default_sort }) => ({
	type: SET_ADMIN_SORT,
	payload: {
		pinned_markets,
		default_sort,
	},
});

export const toggleSort = () => ({
	type: TOGGLE_SORT,
});

export const toggleWalletSort = () => ({
	type: TOGGLE_WALLET_SORT,
});

export const setAdminWalletSortData = ({
	pinned_assets,
	default_wallet_sort,
}) => ({
	type: SET_ADMIN_WALLET_SORT,
	payload: {
		pinned_assets,
		default_wallet_sort,
	},
});

export const setDigitalAssetsSortModeChange = () => ({
	type: SET_DIGITAL_ASSETS_SORT_MODE,
	payload: DIGITAL_ASSETS_SORT.CHANGE,
});

export const toggleDigitalAssetsSort = () => ({
	type: TOGGLE_DIGITAL_ASSETS_SORT,
	payload: DIGITAL_ASSETS_SORT.CHANGE,
});

export const toggleSortSevenDay = () => ({
	type: SET_DIGITAL_ASSETS_SORT_MODE,
	payload: DIGITAL_ASSETS_SORT.CHANGESEVENDAY,
});

export const setAdminDigitalAssetsSortData = ({
	pinned_assets,
	default_digital_assets_sort,
}) => ({
	type: SET_ADMIN_DIGITAL_ASSETS_SORT,
	payload: {
		pinned_assets,
		default_digital_assets_sort,
	},
});

export const USER_TYPES = {
	USER_TYPE_NORMAL: 'normal',
	USER_TYPE_ADMIN: 'admin',
	USER_TYPE_HAP: 'hap',
};

export const MESSAGE_TYPES = {
	MESSAGE_TYPE_NORMAL: 'normal',
	MESSAGE_TYPE_REPLY: 'reply',
	MESSAGE_TYPE_ANNOUNCEMENT: 'announcement',
	MESSAGE_TYPE_IMAGE: 'image',
};

export const setIsReady = (isReady = true) => ({
	type: SET_IS_READY,
	payload: isReady,
});

export const setNotification = (type = '', data = {}, show = true) => ({
	type: SET_NOTIFICATION,
	payload: {
		type,
		data,
		show,
		timestamp: Date.now(),
	},
});

export const closeNotification = () => ({
	type: CLOSE_NOTIFICATION,
	payload: {},
});

export const closeAllNotification = () => ({
	type: CLOSE_ALL_NOTIFICATION,
	payload: {},
});

export const setSnackNotification = (data = {}) => ({
	type: SET_SNACK_NOTIFICATION,
	payload: data,
});

export const closeSnackNotification = () => ({
	type: CLOSE_SNACK_NOTIFICATION,
	payload: {},
});

export const setSnackDialog = (data = {}) => ({
	type: SET_SNACK_DIALOG,
	payload: data,
});

export const closeSnackDialog = (id) => ({
	type: CLOSE_SNACK_DIALOG,
	payload: { dialogId: id },
});

export const openHelpdesk = () => {
	const {
		app: {
			helpdeskInfo: { has_helpdesk, helpdesk_endpoint },
			constants: { links: { helpdesk } = {} },
		},
	} = store.getState();

	if (window) {
		if (has_helpdesk) {
			axios
				.get(`${PLUGIN_URL}${helpdesk_endpoint}`)
				.then(({ data: { url } }) => {
					window.open(url, '_blank');
					return setNotification(CONTACT_FORM, { helpdesk }, false);
				})
				.catch(() => {
					if (helpdesk) {
						window.open(helpdesk, '_blank');
					}
				});
		} else if (helpdesk) {
			window.open(helpdesk, '_blank');
		}
	}

	return setNotification(CONTACT_FORM, { helpdesk }, false);
};

export const openContactForm = () => {
	return openHelpfulResourcesForm();
};

export const setSelectedStep = (selectedStep) => {
	return { type: SET_SELECTED_STEP, payload: { selectedStep } };
};

export const openHelpfulResourcesForm = (data = {}) =>
	setNotification(HELPFUL_RESOURCES_FORM, data, true);

export const setLanguage = (value = DEFAULT_LANGUAGE) => {
	const language = storeLanguageInBrowser(value);
	return {
		type: CHANGE_LANGUAGE,
		payload: {
			language,
		},
	};
};

export const sendSupportMail = (values = {}) => {
	const formData = new FormData();
	if (values.attachment instanceof Array) {
		values.attachment.forEach((data, key) => {
			formData.append(`attachment_${key}`, data);
		});
	}

	Object.keys(values).forEach((data, key) => {
		if (data !== 'attachment') {
			formData.append(data, values[data]);
		}
	});

	return axios({
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
		url: '/support',
		method: 'POST',
	});
};

export const setAnnouncements = (announcements) => ({
	type: SET_ANNOUNCEMENT,
	payload: {
		announcements,
	},
});

export const setAppAnnouncements = (announcements) => ({
	type: SET_APP_ANNOUNCEMENT,
	payload: {
		announcements,
	},
});

export const setSelectedAnnouncement = (selectedAnnouncement) => ({
	type: SET_SELECTED_ANNOUNCEMENT,
	payload: {
		selectedAnnouncement,
	},
});

export const setIsActiveSelectedAnnouncement = (
	isActiveSelectedAnnouncement
) => ({
	type: SET_ACTIVE_SELECTED_ANNOUNCEMENT,
	payload: {
		isActiveSelectedAnnouncement,
	},
});

export const setChatUnreadMessages = (chatUnreadMessages = 0) => ({
	type: SET_UNREAD,
	payload: {
		chatUnreadMessages,
	},
});

export const changeTheme = (theme = '') => ({
	type: CHANGE_THEME,
	payload: {
		theme,
	},
});

export const setPairs = (pairs) => ({
	type: SET_PAIRS,
	payload: {
		pairs,
	},
});

export const changePair = (pair) => ({
	type: CHANGE_PAIR,
	payload: {
		pair,
	},
});

export const changeSparkLineChartData = (sparkLineChartData) => ({
	type: SET_CHART_DATA,
	payload: {
		sparkLineChartData,
	},
});

export const setActiveOrdersMarket = (activeOrdersMarket) => ({
	type: SET_ACTIVE_ORDERS_MARKET,
	payload: {
		activeOrdersMarket,
	},
});

export const setRecentTradesMarket = (recentTradesMarket) => ({
	type: SET_RECENT_TRADES_MARKETS,
	payload: {
		recentTradesMarket,
	},
});

export const getTickers = () => {
	return (dispatch) => {
		axios.get('/ticker/all').then((res) => {
			dispatch({
				type: SET_TICKERS,
				payload: res.data,
			});
		});
	};
};

export const setTickers = (data) => ({
	type: SET_TICKER_FROM_TRADE,
	payload: data,
});

export const setOrderLimits = (data) => ({
	type: SET_ORDER_LIMITS,
	payload: data,
});

export const setCurrencies = (coins) => ({
	type: SET_CURRENCIES,
	payload: {
		coins,
	},
});

export const overwriteCurrencyNames = () => ({
	type: OVERWRITE_CURRENCY_NAMES,
});

export const setUserPayments = (user_payments = {}) => ({
	type: SET_USER_PAYMENTS,
	payload: {
		user_payments,
	},
});

export const setOnramp = (onramp = {}) => ({
	type: SET_ONRAMP,
	payload: {
		onramp,
	},
});

export const setOfframp = (offramp = {}) => ({
	type: SET_OFFRAMP,
	payload: {
		offramp,
	},
});

export const setBroker = (broker) => ({
	type: SET_BROKER,
	payload: {
		broker,
	},
});

export const setQuickTrade = (quicktrade) => ({
	type: SET_QUICKTRADE,
	payload: {
		quicktrade,
	},
});

export const setTransactionLimits = (transaction_limits) => ({
	type: SET_TRANSACTION_LIMITS,
	payload: {
		transaction_limits,
	},
});

export const setConfig = (constants = {}) => {
	let features = {};
	if (constants) {
		if (constants.features) {
			features = constants.features;
		}
	}
	return {
		type: SET_CONFIG,
		payload: {
			constants,
			features,
		},
	};
};

export const setPlugins = (enabledPlugins) => {
	return {
		type: SET_PLUGINS,
		payload: {
			enabledPlugins,
		},
	};
};

export const setExplorePlugins = (explorePlugins) => {
	return {
		type: SET_EXPLORE_PLUGINS,
		payload: {
			explorePlugins,
		},
	};
};

export const setSelectedPlugin = (selectedPlugin) => {
	return {
		type: SELECTED_PLUGIN,
		payload: {
			selectedPlugin,
		},
	};
};

export const setWebViews = (enabledPlugins) => {
	return {
		type: SET_WEB_VIEWS,
		payload: {
			enabledPlugins,
		},
	};
};

export const setHelpdeskInfo = (enabledPlugins) => {
	return {
		type: SET_HELPDESK_INFO,
		payload: {
			enabledPlugins,
		},
	};
};

export const setInfo = (info) => ({
	type: SET_INFO,
	payload: {
		info,
	},
});

export const openMarketSelector = (data = {}) =>
	setNotification(MARKET_SELECTOR, data, true);

export const openConnectViaDesktop = (data = {}) =>
	setNotification(CONNECT_VIA_DESKTOP, data, true);

export const openMetamaskError = (data = {}) =>
	setNotification(NOTIFICATIONS.METAMASK_ERROR, data, true);

export const openConfigureApps = (onRemove) =>
	setNotification(NOTIFICATIONS.CONFIGURE_APPS, { onRemove }, true);

export const openRiskPortfolioOrderWarning = (data = {}) =>
	setNotification(RISK_PORTFOLIO_ORDER_WARING, data, true);

export const logoutconfirm = (data = {}) =>
	setNotification(LOGOUT_CONFORMATION, data, true);

export const setSelectedAccount = (selectedAccount) => ({
	type: SET_SELECTED_ACCOUNT,
	payload: {
		selectedAccount,
	},
});

export const requestPlugins = () => axios.get(`${PLUGIN_URL}/plugins`);
export const requestInitial = () => axios.get('/kit');
export const requestConstant = () => axios.get('/constants');
export const requestAdminData = () => axios.get('/admin/kit');
export const requestPlugin = (params) =>
	axios.get(`${PLUGIN_URL}/plugins?${querystring.stringify(params)}`);

export const getExchangeInfo = () => {
	return (dispatch) => {
		axios.get('/kit').then((res) => {
			if (res && res.data) {
				dispatch(setConfig(res.data));
				if (res.data.defaults) {
					const themeColor = localStorage.getItem('theme');
					const isThemeValid = hasTheme(themeColor, res.data.color);
					const language = localStorage.getItem(LANGUAGE_KEY);
					if (res.data.defaults.theme && (!themeColor || !isThemeValid)) {
						dispatch(changeTheme(res.data.defaults.theme));
						localStorage.setItem('theme', res.data.defaults.theme);
					}
					if (!language && res.data.defaults.language) {
						dispatch(setLanguage(res.data.defaults.language));
					}
				}
				if (res.data.info) {
					dispatch({
						type: SET_INFO,
						payload: { info: { ...res.data.info } },
					});
				}
			}
		});
	};
};

// export const getAnnouncement = () => (dispatch) => {
// 	return axios
// 		.get(`${PLUGIN_URL}/plugins/announcements`)
// 		.then((res) => {
// 			if (res.data && res.data.data) {
// 				dispatch({
// 					type: SET_APP_ANNOUNCEMENT,
// 					payload: { announcements: res.data.data },
// 				});
// 			}
// 		})
// 		.catch((err) => {});
// };

export const getAnnouncement = () => (dispatch) => {
	return axios
		.get('/announcements')
		.then((res) => {
			if (res.data && res.data.data) {
				dispatch({
					type: SET_APP_ANNOUNCEMENT,
					payload: { announcements: res.data.data },
				});
			}
		})
		.catch((err) => {});
};

export const requestAvailPlugins = () => (dispatch) => {
	dispatch({ type: SET_PLUGINS_REQUEST });
	return axios
		.get(`${PLUGIN_URL}/plugins`)
		.then((res) => {
			if (res.data) {
				let available = res.data.available ? [...res.data.available] : [];
				let enabled = res.data.enabled.filter(
					(val) => !available.includes(val)
				);
				dispatch({
					type: SET_PLUGINS_SUCCESS,
					payload: [...available, ...enabled],
				});
			}
		})
		.catch((err) => {
			dispatch({ type: SET_PLUGINS_FAILURE });
		});
};

export const requestTiers = () => (dispatch) => {
	return axios
		.get('/tiers')
		.then((res) => {
			dispatch({ type: SET_CONFIG_LEVEL, payload: res.data });
		})
		.catch((err) => {});
};

export const addToFavourites = (payload) => ({
	type: ADD_TO_FAVOURITES,
	payload,
});

export const removeFromFavourites = (payload) => ({
	type: REMOVE_FROM_FAVOURITES,
	payload,
});

export const setHomePageSetting = (home_page = false) => ({
	type: CHANGE_HOME_PAGE_SETTING,
	payload: home_page,
});

export const setInjectedValues = (payload) => ({
	type: SET_INJECTED_VALUES,
	payload,
});

export const setInjectedHTML = (payload) => ({
	type: SET_INJECTED_HTML,
	payload,
});

export const setContracts = (payload) => ({
	type: SET_CONTRACTS,
	payload,
});

export const setTradeTab = (payload) => ({
	type: SET_TRADE_TAB,
	payload,
});

export const setAllContracts = (payload) => ({
	type: SET_ALL_CONTRACTS,
	payload,
});

export const getNetWorkURL = () => {
	const {
		app: {
			allContracts: { network },
		},
	} = store.getState();
	return network;
};

export const getWithdrawalMax = (currency, network) => {
	return axios.get(
		`/user/withdrawal/max?currency=${currency}&network=${network}`
	);
};

export const withdrawCurrency = (currency) => ({
	type: SET_WITHDRAW_CURRENCY,
	payload: currency,
});

export const withdrawNetwork = (network) => ({
	type: SET_WITHDRAW_NETWORK,
	payload: network,
});

export const withdrawNetworkOptions = (networkOptions) => ({
	type: SET_WITHDRAW_NETWORK_OPTIONS,
	payload: networkOptions,
});

export const withdrawAddress = (address) => ({
	type: SET_WITHDRAW_ADDRESS,
	payload: address,
});

export const withdrawAmount = (amount) => ({
	type: SET_WITHDRAW_AMOUNT,
	payload: amount,
});

export const setFee = (amount) => ({
	type: SET_WITHDRAW_FEE,
	payload: amount,
});

export const setDepositAndWithdraw = (val) => ({
	type: SET_DEPOSIT_AND_WITHDRAW,
	payload: val,
});

export const setIsValidAdress = (val) => ({
	type: SET_VALID_ADDRESS,
	payload: val,
});

export const depositCurrency = (currency) => ({
	type: SET_DEPOSIT_CURRENCY,
	payload: currency,
});

export const depositNetwork = (network) => ({
	type: SET_DEPOSIT_NETWORK,
	payload: network,
});

export const depositNetworkOptions = (networkOptions) => ({
	type: SET_DEPOSIT_NETWORK_OPTIONS,
	payload: networkOptions,
});

export const setSelectedMethod = (method) => ({
	type: SET_SELECTED_METHOD,
	payload: method,
});

export const setReceiverEmail = (email) => ({
	type: SET_RECEIVER_EMAIL,
	payload: email,
});

export const setWithdrawOptionaltag = (tag) => ({
	type: SET_WITHDRAW_OTIONAL_TAG,
	payload: tag,
});

export const setCoinsData = (coinsData) => ({
	type: SET_COINS_DATA,
	payload: coinsData,
});

export const setStake = (selectedStake) => ({
	type: SET_STAKE,
	payload: selectedStake,
});

export const setLimitTab = (selectedTab) => ({
	type: SET_LIMITS_TAB,
	payload: selectedTab,
});

export const setSecurityTab = (selectedSecurityTab) => ({
	type: SET_SECURITY_TAB,
	payload: selectedSecurityTab,
});

export const setVerificationTab = (selectedVerificationTab) => ({
	type: SET_VERIFICATION_TAB,
	payload: selectedVerificationTab,
});

export const setSettingsTab = (selectedSettingsTab) => ({
	type: SET_SETTINGS_TAB,
	payload: selectedSettingsTab,
});

export const setIsChat = (setIsChat) => ({
	type: SET_ACTIVE_CHAT,
	payload: setIsChat,
});

export const setIsMarketDropdownVisible = (setIsMarketDropdownVisible) => ({
	type: SET_ACTIVE_MARKET_SELECTOR,
	payload: setIsMarketDropdownVisible,
});

export const setIsToolsVisible = (setIsToolsVisible) => ({
	type: SET_TOOLS_VISIBLE,
	payload: setIsToolsVisible,
});

export const setIsProTrade = (setIsProTrade) => ({
	type: SET_ACTIVE_PRO_TRADE,
	payload: setIsProTrade,
});
export const setIsQuickTrade = (setIsQuickTrade) => ({
	type: SET_ACTIVE_QUICK_TRADE,
	payload: setIsQuickTrade,
});

export const setExchangeTimeZone = (exchangeTimeZone) => {
	return {
		type: SET_EXCHANGE_TIMEZONE,
		payload: {
			exchangeTimeZone,
		},
	};
};

export const setIsAdminAnnouncementFeature = (isAdminAnnouncementFeature) => {
	return {
		type: SET_IS_ADMIN_ANNOUNCEMENT_FEATURE,
		payload: {
			isAdminAnnouncementFeature,
		},
	};
};

export const setIsRefreshAssets = (isRefreshAssets) => {
	return {
		type: SET_IS_REFRESH_ASSETS,
		payload: {
			isRefreshAssets,
		},
	};
};

export const setMarketRefresh = (isMarketRefresh) => {
	return {
		type: SET_MARKET_REFRESH,
		payload: {
			isMarketRefresh,
		},
	};
};

export const setError = (errorMessage) => {
	return {
		type: SET_ERROR,
		payload: {
			errorMessage,
		},
	};
};

export const setErrorCount = (errorCount) => {
	return {
		type: SET_ERROR_COUNT,
		payload: {
			errorCount,
		},
	};
};

export const setSignupEmail = (signupEmail) => {
	return {
		type: SET_SIGNUP_EMAIL,
		payload: { signupEmail },
	};
};

export const setEmailDetail = (emailDetail) => {
	return {
		type: SET_EMAIL_DETAIL,
		payload: { emailDetail },
	};
};

export const setIsActiveFavQuickTrade = (isActiveFavQuickTrade) => {
	return {
		type: SET_IS_ACTIVE_FAV_QUICK_TRADE,
		payload: { isActiveFavQuickTrade },
	};
};

export const setRolesList = (rolesList) => {
	return {
		type: SET_ROLES,
		payload: { rolesList },
	};
};

export const setEditMode = (isOperatorEdit) => {
	return {
		type: SET_EDIT_MODE,
		payload: { isOperatorEdit },
	};
};

export const setTransactionPair = (transactionPair) => {
	return {
		type: SET_TRANSACTION_PAIR,
		payload: { transactionPair },
	};
};

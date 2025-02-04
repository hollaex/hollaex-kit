import {
	SET_NOTIFICATION,
	CLOSE_NOTIFICATION,
	CLOSE_ALL_NOTIFICATION,
	SET_SNACK_NOTIFICATION,
	CLOSE_SNACK_NOTIFICATION,
	SET_SNACK_DIALOG,
	CLOSE_SNACK_DIALOG,
	CHANGE_LANGUAGE,
	SET_ANNOUNCEMENT,
	SET_APP_ANNOUNCEMENT,
	CHANGE_THEME,
	SET_PAIRS,
	SET_TICKERS,
	SET_UNREAD,
	SET_ORDER_LIMITS,
	SET_TICKER_FROM_TRADE,
	SET_CURRENCIES,
	SET_USER_PAYMENTS,
	SET_ONRAMP,
	SET_OFFRAMP,
	SET_CONFIG,
	SET_PLUGINS,
	SET_INFO,
	SET_PLUGINS_REQUEST,
	SET_PLUGINS_SUCCESS,
	SET_PLUGINS_FAILURE,
	SET_CONFIG_LEVEL,
	ADD_TO_FAVOURITES,
	REMOVE_FROM_FAVOURITES,
	CHANGE_HOME_PAGE_SETTING,
	SET_IS_READY,
	SET_WEB_VIEWS,
	SET_HELPDESK_INFO,
	SET_INJECTED_VALUES,
	SET_INJECTED_HTML,
	SET_CONTRACTS,
	SET_ALL_CONTRACTS,
	CHANGE_PAIR,
	SET_ACTIVE_ORDERS_MARKET,
	SET_RECENT_TRADES_MARKETS,
	SET_TRADE_TAB,
	SET_BROKER,
	SET_QUICKTRADE,
	SORT,
	SET_SORT_MODE,
	TOGGLE_SORT,
	SET_ADMIN_SORT,
	WALLET_SORT,
	SET_WALLET_SORT_MODE,
	TOGGLE_WALLET_SORT,
	SET_ADMIN_WALLET_SORT,
	DIGITAL_ASSETS_SORT,
	SET_DIGITAL_ASSETS_SORT_MODE,
	TOGGLE_DIGITAL_ASSETS_SORT,
	SET_ADMIN_DIGITAL_ASSETS_SORT,
	SELECTED_PLUGIN,
	SET_EXPLORE_PLUGINS,
	OVERWRITE_CURRENCY_NAMES,
	SET_TRANSACTION_LIMITS,
	SET_SELECTED_ACCOUNT,
	SET_SELECTED_STEP,
	SET_WITHDRAW_CURRENCY,
	SET_WITHDRAW_NETWORK,
	SET_WITHDRAW_ADDRESS,
	SET_WITHDRAW_AMOUNT,
	SET_WITHDRAW_NETWORK_OPTIONS,
	SET_WITHDRAW_FEE,
	SET_DEPOSIT_AND_WITHDRAW,
	SET_VALID_ADDRESS,
	SET_DEPOSIT_NETWORK_OPTIONS,
	SET_DEPOSIT_NETWORK,
	SET_DEPOSIT_CURRENCY,
	SET_SELECTED_METHOD,
	SET_RECEIVER_EMAIL,
	SET_WITHDRAW_OTIONAL_TAG,
	SET_CHART_DATA,
	SET_COINS_DATA,
	SET_VERIFICATION_TAB,
	SET_SECURITY_TAB,
	SET_LIMITS_TAB,
	SET_STAKE,
	SET_SETTINGS_TAB,
	SET_ACTIVE_CHAT,
	SET_ACTIVE_MARKET_SELECTOR,
	SET_TOOLS_VISIBLE,
	SET_ACTIVE_PRO_TRADE,
	SET_ACTIVE_QUICK_TRADE,
	SET_SELECTED_ANNOUNCEMENT,
	SET_ACTIVE_SELECTED_ANNOUNCEMENT,
	SET_EXCHANGE_TIMEZONE,
} from 'actions/appActions';
import { THEME_DEFAULT } from 'config/constants';
import { getLanguage } from 'utils/string';
import { getTheme } from 'utils/theme';
import { unique } from 'utils/data';
import { getFavourites, setFavourites } from 'utils/favourites';
import {
	globalize,
	generateDynamicTarget,
	generateFiatWalletTarget,
} from 'utils/id';
import { mapPluginsTypeToName } from 'utils/plugin';
import {
	modifyCoinsData,
	modifyPairsData,
	modifyBrokerData,
	modifyQuickTradeData,
	overWriteCoinNames,
} from 'utils/reducer';

const EMPTY_NOTIFICATION = {
	type: '',
	message: '',
	contactFormData: {},
	helpfulResourcesFormData: {},
	timestamp: undefined,
};

const EMPTY_SNACK_NOTIFICATION = {
	showSnack: false,
	icon: '',
	useSvg: true,
	content: '',
	isDialog: false,
	dialogData: [],
	timer: 0,
};

const WITHDRAW_FIELDS = {
	withdrawCurrency: '',
	withdrawNetwork: '',
	withdrawNetworkOptions: '',
	withdrawAddress: '',
	withdrawAmount: 0,
	withdrawFee: 0,
	optionalTag: '',
};

const DEPOSIT_FIELDS = {
	depositCurrency: '',
	depositNetwork: '',
	depositNetworkOptions: '',
};

const INITIAL_STATE = {
	home_page: false,
	isReady: false,
	favourites: getFavourites() || [],
	announcements: [],
	notifications: [],
	notificationsQueue: [],
	chatUnreadMessages: 0,
	activeNotification: EMPTY_NOTIFICATION,
	snackNotification: EMPTY_SNACK_NOTIFICATION,
	theme: THEME_DEFAULT,
	language: getLanguage(),
	sparkLineChartData: {},
	pairs: {},
	pair: '',
	activeOrdersMarket: '',
	recentTradesMarket: '',
	tickers: {},
	orderLimits: {},
	coins: {},
	constants: {},
	config_level: {},
	info: { is_trial: false, active: true, status: true },
	enabledPlugins: [],
	plugins: [],
	pluginNames: {},
	selectedPlugin: {},
	explorePlugins: [],
	helpdeskInfo: {
		has_helpdesk: false,
		helpdesk_endpoint: '',
	},
	targets: [],
	webViews: {},
	remoteRoutes: [],
	availablePlugins: [],
	getPluginLoading: false,
	features: {},
	injected_values: [],
	injected_html: {},
	plugins_injected_html: {},
	contracts: {},
	allContracts: {},
	tradeTab: 0,
	broker: {},
	quicktrade: [],
	user_payments: {},
	onramp: [],
	offramp: {},
	sort: {
		mode: SORT.CHANGE,
		is_descending: true,
	},
	pinned_markets: [],
	default_sort: SORT.CHANGE,
	wallet_sort: {
		mode: WALLET_SORT.AMOUNT,
		is_descending: true,
	},
	pinned_assets: [],
	default_wallet_sort: WALLET_SORT.AMOUNT,
	digital_assets_sort: {
		mode: DIGITAL_ASSETS_SORT.CHANGE,
		is_descending: true,
	},
	default_digital_assets_sort: DIGITAL_ASSETS_SORT.CHANGE,
	selectedAccount: 1,
	selectedStep: 0,
	withdrawFields: WITHDRAW_FIELDS,
	depositFields: DEPOSIT_FIELDS,
	depositAndWithdraw: false,
	isValidAddress: '',
	selectedWithdrawMethod: 'Address',
	receiverWithdrawalEmail: null,
	coinsData: [],
	selectedStake: null,
	selectedTab: null,
	selectedSecurityTab: 0,
	selectedVerificationTab: 0,
	selectedSettingsTab: 0,
	isChat: JSON.parse(localStorage.getItem('isChat')),
	isMarketDropdownVisible: false,
	isToolsVisible: false,
	isProTrade: false,
	isQuickTrade: false,
	selectedAnnouncement: {},
	isActiveSelectedAnnouncement: false,
	exchangeTimeZone: '',
};

const reducer = (state = INITIAL_STATE, { type, payload = {} }) => {
	switch (type) {
		case SET_IS_READY:
			return {
				...state,
				isReady: payload,
			};
		case SET_PAIRS:
			return {
				...state,
				pairs: modifyPairsData(payload.pairs, { ...state.coins }),
			};
		case CHANGE_PAIR:
			return {
				...state,
				pair: payload.pair,
				activeOrdersMarket: payload.pair,
				recentTradesMarket: payload.pair,
			};
		case SET_CHART_DATA:
			return {
				...state,
				sparkLineChartData: payload.sparkLineChartData,
			};
		case SET_ACTIVE_ORDERS_MARKET:
			return {
				...state,
				activeOrdersMarket: payload.activeOrdersMarket,
			};
		case SET_RECENT_TRADES_MARKETS:
			return {
				...state,
				recentTradesMarket: payload.recentTradesMarket,
			};
		case SET_CURRENCIES:
			return {
				...state,
				coins: modifyCoinsData(payload.coins),
			};
		case OVERWRITE_CURRENCY_NAMES:
			return {
				...state,
				coins: overWriteCoinNames(state.coins),
			};
		case SET_USER_PAYMENTS:
			return {
				...state,
				user_payments: payload.user_payments,
			};
		case SET_ONRAMP:
			return {
				...state,
				onramp: payload.onramp,
			};
		case SET_OFFRAMP:
			return {
				...state,
				offramp: payload.offramp,
			};
		case SET_BROKER:
			return {
				...state,
				broker: modifyBrokerData(payload.broker, { ...state.coins }),
			};
		case SET_TRANSACTION_LIMITS:
			return {
				...state,
				transaction_limits: payload.transaction_limits,
			};
		case SET_QUICKTRADE:
			return {
				...state,
				quicktrade: modifyQuickTradeData(payload.quicktrade, {
					...state.coins,
				}),
			};
		case SET_NOTIFICATION: {
			const newNotification =
				payload.type.indexOf('NOTIFICATIONS') > -1 ? [payload] : [];
			const notifications = newNotification.concat(state.notifications);
			const notificationsQueue = [].concat(state.notificationsQueue);
			let activeNotification = { ...state.activeNotification };

			if (payload.show) {
				if (state.activeNotification.type !== '') {
					notificationsQueue.push(payload);
				} else {
					activeNotification = { ...payload };
				}
			}

			return {
				...state,
				notifications,
				activeNotification,
				contactFormData: payload.data,
				notificationsQueue,
			};
		}

		case CLOSE_NOTIFICATION: {
			const notificationsQueue = [].concat(state.notificationsQueue);
			const activeNotification =
				notificationsQueue.length > 0
					? notificationsQueue.splice(0, 1)[0]
					: EMPTY_NOTIFICATION;

			return {
				...state,
				notificationsQueue,
				activeNotification,
				contactFormData: {},
			};
		}

		case SET_SNACK_NOTIFICATION:
			return {
				...state,
				snackNotification: {
					...state.snackNotification,
					...payload,
					showSnack: true,
					icon: payload.icon ? payload.icon : '',
					useSvg: payload.useSvg ? payload.useSvg : true,
					content: payload.content ? payload.content : '',
					timer: payload.timer ? payload.timer : 0,
				},
			};

		case CLOSE_SNACK_NOTIFICATION:
			return {
				...state,
				snackNotification: EMPTY_SNACK_NOTIFICATION,
			};

		case SET_SNACK_DIALOG:
			const { isDialog, ...rest } = payload;
			let dialogData = [...state.snackNotification.dialogData];
			if (isDialog) {
				dialogData = [
					...dialogData,
					{ ...rest, id: `snack-dialog-${dialogData.length + 1}` },
				];
			}
			return {
				...state,
				snackNotification: {
					...state.snackNotification,
					isDialog,
					dialogData,
				},
			};

		case CLOSE_SNACK_DIALOG:
			const dataDialog = state.snackNotification.dialogData.filter(
				(data) => data.id !== payload.dialogId
			);
			let openDialog = dataDialog.length
				? state.snackNotification.isDialog
				: false;
			return {
				...state,
				snackNotification: {
					...state.snackNotification,
					isDialog: openDialog,
					dialogData: dataDialog,
				},
			};

		case SET_UNREAD:
			return {
				...state,
				chatUnreadMessages: payload.chatUnreadMessages,
			};

		case SET_ANNOUNCEMENT:
			const announcements = state.announcements.concat(payload.announcements);
			return {
				...state,
				announcements,
			};
		case SET_APP_ANNOUNCEMENT:
			return {
				...state,
				announcements: payload.announcements,
			};
		case SET_SELECTED_ANNOUNCEMENT:
			return {
				...state,
				selectedAnnouncement: payload.selectedAnnouncement,
			};
		case SET_ACTIVE_SELECTED_ANNOUNCEMENT:
			return {
				...state,
				isActiveSelectedAnnouncement: payload.isActiveSelectedAnnouncement,
			};
		case CLOSE_ALL_NOTIFICATION:
			return {
				...state,
				notificationsQueue: [],
				activeNotification: EMPTY_NOTIFICATION,
			};

		case CHANGE_LANGUAGE:
			return {
				...state,
				language: payload.language,
			};

		case CHANGE_THEME:
			return {
				...state,
				theme: getTheme(payload.theme),
			};
		case SET_TICKERS:
			return {
				...state,
				tickers: {
					...state.tickers,
					...payload,
				},
			};
		case SET_TICKER_FROM_TRADE:
			let tempTickers = {};
			let pairs = Object.keys(state.pairs);
			Object.keys(payload).forEach((key) => {
				if (pairs.includes(key)) {
					let temp = state.tickers[key] || {};
					let pairTrade = payload[key][0];
					let close = (
						pairTrade && pairTrade.price ? pairTrade.price : temp.close
					)
						? temp.close
						: 0;
					temp.volume += parseFloat(pairTrade?.size ?? 0);
					if (pairTrade?.side === 'buy' && pairTrade?.price > temp.high) {
						temp.high = pairTrade?.price;
					}
					if (pairTrade?.side === 'sell' && pairTrade?.price < temp.low) {
						temp.low = pairTrade?.price;
					}
					tempTickers[key] = {
						...temp,
						close,
					};
				}
			});
			return {
				...state,
				tickers: {
					...state.tickers,
					...tempTickers,
				},
			};
		case SET_ORDER_LIMITS:
			return {
				...state,
				orderLimits: payload,
			};
		case SET_CONFIG:
			return {
				...state,
				constants: payload.constants,
				features: payload.features,
			};

		case SELECTED_PLUGIN:
			return {
				...state,
				selectedPlugin: payload.selectedPlugin,
			};

		case SET_EXPLORE_PLUGINS:
			return {
				...state,
				explorePlugins: payload.explorePlugins,
			};

		case SET_PLUGINS: {
			const enabledPluginsNames = payload.enabledPlugins.map(
				({ name }) => name
			);

			//FIXME: change this once name-based logic is completely changed to type-based
			const enabledPluginTypes = mapPluginsTypeToName(
				payload.enabledPlugins.map(({ type }) => type)
			);

			const enabledPlugins = unique([
				...enabledPluginsNames,
				...enabledPluginTypes,
			]);

			const pluginNames = {};
			payload.enabledPlugins.forEach(({ type, name }) => {
				pluginNames[type ? type : name] = name;
			});

			return {
				...state,
				enabledPlugins,
				plugins: payload.enabledPlugins,
				pluginNames,
			};
		}
		case SET_HELPDESK_INFO: {
			const helpdesk = payload.enabledPlugins.find(
				({ type }) => type === 'helpdesk'
			);

			return {
				...state,
				helpdeskInfo: {
					has_helpdesk: !!helpdesk,
					helpdesk_endpoint: helpdesk && `/plugins/${helpdesk.name}`,
				},
			};
		}
		case SET_WEB_VIEWS: {
			const allWebViews = [];
			payload.enabledPlugins.forEach(({ name, web_view = [] }) => {
				if (web_view && web_view.length) {
					const named_web_views = web_view.map((viewObj) => ({
						...viewObj,
						name,
					}));
					allWebViews.push(...named_web_views);
				}
			});

			const remoteRoutes = [];
			allWebViews.forEach(({ meta, name }) => {
				if (meta && meta.is_page) {
					const { icon, string, path, ...rest } = meta;
					remoteRoutes.push({
						target: generateDynamicTarget(name, 'page', path),
						icon_id: globalize(name)(icon),
						string_id: globalize(name)(string),
						path,
						...rest,
					});
				}
			});

			const plugins_injected_html = { head: '', body: '' };
			allWebViews.forEach(({ injected_html = {} }) => {
				Object.keys(plugins_injected_html).forEach((key) => {
					if (injected_html && injected_html[key]) {
						plugins_injected_html[key] = plugins_injected_html[key].concat(
							injected_html[key]
						);
					}
				});
			});

			const CLUSTERED_WEB_VIEWS = {};
			allWebViews.forEach((plugin) => {
				const { target: staticTarget, meta, name } = plugin;
				let target;
				if (staticTarget) {
					target = staticTarget;
				} else if (meta) {
					const {
						is_page,
						is_verification_tab,
						is_wallet,
						is_ultimate_fiat,
						is_app,
						type,
						currency,
						path,
					} = meta;

					if (is_app) {
						target = generateDynamicTarget(name, 'app', type);
					} else if (is_page) {
						target = generateDynamicTarget(name, 'page', path);
					} else if (is_verification_tab && type) {
						target = generateDynamicTarget(name, 'verification', type);
					} else if (is_wallet && type && currency) {
						target = generateFiatWalletTarget(type, currency);
					} else if (is_ultimate_fiat && type) {
						target = generateDynamicTarget(name, 'ultimate_fiat', type);
					}
				}
				if (!CLUSTERED_WEB_VIEWS[target]) {
					CLUSTERED_WEB_VIEWS[target] = [plugin];
				} else {
					CLUSTERED_WEB_VIEWS[target].push(plugin);
				}
			});

			const FILTERED_CLUSTERED_WEB_VIEWS = {};
			Object.entries(CLUSTERED_WEB_VIEWS).forEach(([targetKey, viewArray]) => {
				if (viewArray.length === 1) {
					FILTERED_CLUSTERED_WEB_VIEWS[targetKey] = viewArray;
				} else {
					FILTERED_CLUSTERED_WEB_VIEWS[targetKey] = viewArray.filter(
						({ is_default }) => !is_default
					);
				}
			});

			return {
				...state,
				plugins_injected_html,
				webViews: FILTERED_CLUSTERED_WEB_VIEWS,
				targets: Object.entries(FILTERED_CLUSTERED_WEB_VIEWS).map(
					([target]) => target
				),
				remoteRoutes,
			};
		}
		case SET_INFO:
			return {
				...state,
				info: payload.info,
			};
		case SET_PLUGINS_REQUEST:
			return {
				...state,
				availablePlugins: [],
				getPluginLoading: true,
			};
		case SET_PLUGINS_SUCCESS:
			return {
				...state,
				availablePlugins: payload,
				getPluginLoading: false,
			};
		case SET_PLUGINS_FAILURE:
			return {
				...state,
				getPluginLoading: false,
			};
		case SET_CONFIG_LEVEL:
			return {
				...state,
				config_level: payload,
			};
		case ADD_TO_FAVOURITES: {
			const favourites = unique([...state.favourites, payload]);
			setFavourites(favourites);
			return {
				...state,
				favourites,
			};
		}
		case REMOVE_FROM_FAVOURITES: {
			const favourites = state.favourites.filter((pair) => pair !== payload);
			setFavourites(favourites);
			return {
				...state,
				favourites,
			};
		}
		case CHANGE_HOME_PAGE_SETTING: {
			return {
				...state,
				home_page: payload,
			};
		}
		case SET_INJECTED_VALUES: {
			return {
				...state,
				injected_values: payload,
			};
		}
		case SET_INJECTED_HTML: {
			return {
				...state,
				injected_html: payload,
			};
		}
		case SET_CONTRACTS: {
			return {
				...state,
				contracts: payload,
			};
		}
		case SET_ALL_CONTRACTS: {
			return {
				...state,
				allContracts: payload,
			};
		}
		case SET_TRADE_TAB: {
			return {
				...state,
				tradeTab: payload,
			};
		}
		case SET_SORT_MODE:
			return {
				...state,
				sort: {
					mode: payload,
					is_descending: true,
				},
			};
		case TOGGLE_SORT:
			return {
				...state,
				sort: {
					...state.sort,
					is_descending: !state.sort.is_descending,
				},
			};
		case SET_ADMIN_SORT:
			return {
				...state,
				pinned_markets: payload.pinned_markets,
				default_sort: payload.default_sort,
			};
		case SET_WALLET_SORT_MODE:
			return {
				...state,
				wallet_sort: {
					mode: payload,
					is_descending: true,
				},
			};
		case SET_DIGITAL_ASSETS_SORT_MODE:
			return {
				...state,
				digital_assets_sort: {
					mode: payload,
					is_descending: true,
				},
			};
		case TOGGLE_WALLET_SORT:
			return {
				...state,
				wallet_sort: {
					...state.wallet_sort,
					is_descending: !state.wallet_sort.is_descending,
				},
			};
		case TOGGLE_DIGITAL_ASSETS_SORT:
			return {
				...state,
				digital_assets_sort: {
					...state.digital_assets_sort,
					is_descending: !state.digital_assets_sort.is_descending,
				},
			};
		case SET_ADMIN_WALLET_SORT:
			return {
				...state,
				pinned_assets: payload.pinned_assets,
				default_wallet_sort: payload.default_wallet_sort,
			};
		case SET_ADMIN_DIGITAL_ASSETS_SORT:
			return {
				...state,
				pinned_assets: payload.pinned_assets,
				default_digital_assets_sort: payload.default_digital_assets_sort,
			};
		case SET_SELECTED_ACCOUNT:
			return {
				...state,
				selectedAccount: payload.selectedAccount,
			};
		case SET_SELECTED_STEP:
			return {
				...state,
				selectedStep: payload.selectedStep,
			};
		case SET_WITHDRAW_CURRENCY:
			return {
				...state,
				withdrawFields: { ...state.withdrawFields, withdrawCurrency: payload },
			};
		case SET_WITHDRAW_NETWORK:
			return {
				...state,
				withdrawFields: { ...state.withdrawFields, withdrawNetwork: payload },
			};
		case SET_WITHDRAW_NETWORK_OPTIONS:
			return {
				...state,
				withdrawFields: {
					...state.withdrawFields,
					withdrawNetworkOptions: payload,
				},
			};
		case SET_WITHDRAW_ADDRESS:
			return {
				...state,
				withdrawFields: { ...state.withdrawFields, withdrawAddress: payload },
			};
		case SET_WITHDRAW_AMOUNT:
			return {
				...state,
				withdrawFields: { ...state.withdrawFields, withdrawAmount: payload },
			};
		case SET_WITHDRAW_FEE:
			return {
				...state,
				withdrawFields: { ...state.withdrawFields, withdrawFee: payload },
			};
		case SET_WITHDRAW_OTIONAL_TAG:
			return {
				...state,
				withdrawFields: { ...state.withdrawFields, optionalTag: payload },
			};
		case SET_DEPOSIT_AND_WITHDRAW:
			return {
				...state,
				depositAndWithdraw: payload,
			};
		case SET_VALID_ADDRESS:
			return {
				...state,
				isValidAddress: payload.isValid,
			};
		case SET_DEPOSIT_CURRENCY:
			return {
				...state,
				depositFields: { ...state.depositFields, depositCurrency: payload },
			};
		case SET_DEPOSIT_NETWORK:
			return {
				...state,
				depositFields: { ...state.depositFields, depositNetwork: payload },
			};
		case SET_DEPOSIT_NETWORK_OPTIONS:
			return {
				...state,
				depositFields: {
					...state.depositFields,
					depositNetworkOptions: payload,
				},
			};
		case SET_SELECTED_METHOD: {
			return {
				...state,
				selectedWithdrawMethod: payload,
			};
		}
		case SET_RECEIVER_EMAIL: {
			return {
				...state,
				receiverWithdrawalEmail: payload,
			};
		}
		case SET_COINS_DATA: {
			return {
				...state,
				coinsData: payload,
			};
		}
		case SET_STAKE: {
			return {
				...state,
				selectedStake: payload,
			};
		}
		case SET_LIMITS_TAB: {
			return {
				...state,
				selectedTab: payload,
			};
		}
		case SET_SECURITY_TAB: {
			return {
				...state,
				selectedSecurityTab: payload,
			};
		}
		case SET_VERIFICATION_TAB: {
			return {
				...state,
				selectedVerificationTab: payload,
			};
		}
		case SET_SETTINGS_TAB: {
			return {
				...state,
				selectedSettingsTab: payload,
			};
		}
		case SET_ACTIVE_CHAT: {
			return {
				...state,
				isChat: payload,
			};
		}
		case SET_ACTIVE_MARKET_SELECTOR: {
			return {
				...state,
				isMarketDropdownVisible: payload,
			};
		}
		case SET_TOOLS_VISIBLE: {
			return {
				...state,
				isToolsVisible: payload,
			};
		}
		case SET_ACTIVE_PRO_TRADE: {
			return {
				...state,
				isProTrade: payload,
			};
		}
		case SET_ACTIVE_QUICK_TRADE: {
			return {
				...state,
				isQuickTrade: payload,
			};
		}
		case SET_EXCHANGE_TIMEZONE: {
			return {
				...state,
				exchangeTimeZone: payload.exchangeTimeZone,
			};
		}
		default:
			return state;
	}
};

export default reducer;

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
	CHANGE_PAIR,
	SET_ACTIVE_ORDERS_MARKET,
	SET_RECENT_TRADES_MARKETS,
	SET_TRADE_TAB,
	SET_BROKER,
} from '../actions/appActions';
import { THEME_DEFAULT } from '../config/constants';
import { getLanguage } from '../utils/string';
import { getTheme } from '../utils/theme';
import { unique } from 'utils/data';
import { getFavourites, setFavourites } from 'utils/favourites';
import {
	globalize,
	generateDynamicTarget,
	generateFiatWalletTarget,
} from 'utils/id';
import { mapPluginsTypeToName } from 'utils/plugin';
import { modifyCoinsData, modifyPairsData } from 'utils/reducer';

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
	pairs: {},
	pair: '',
	activeOrdersMarket: '',
	recentTradesMarket: '',
	tickers: {},
	orderLimits: {},
	coins: {
		bch: {
			id: 4,
			fullname: 'Bitcoin Cash',
			symbol: 'bch',
			active: true,
			allow_deposit: true,
			allow_withdrawal: true,
			withdrawal_fee: 0.0001,
			min: 0.0001,
			max: 100000,
			increment_unit: 0.001,
			deposit_limits: {},
			withdrawal_limits: {},
		},
		xrp: {
			id: 5,
			fullname: 'Ripple',
			symbol: 'xrp',
			active: true,
			allow_deposit: true,
			allow_withdrawal: true,
			withdrawal_fee: 0.0001,
			min: 0.0001,
			max: 100000,
			increment_unit: 0.001,
			deposit_limits: {},
			withdrawal_limits: {},
		},
		eur: {
			id: 1,
			fullname: 'Euro',
			symbol: 'eur',
			active: true,
			allow_deposit: true,
			allow_withdrawal: true,
			withdrawal_fee: 0.0001,
			min: 0.0001,
			max: 100000,
			increment_unit: 0.0001,
			deposit_limits: {},
			withdrawal_limits: {},
		},
		btc: {
			id: 2,
			fullname: 'Bitcoin',
			symbol: 'btc',
			active: true,
			allow_deposit: true,
			allow_withdrawal: true,
			withdrawal_fee: 0.0001,
			min: 0.0001,
			max: 100000,
			increment_unit: 0.0001,
			deposit_limits: {},
			withdrawal_limits: {},
		},
		eth: {
			id: 3,
			fullname: 'Ethereum',
			symbol: 'eth',
			active: true,
			allow_deposit: true,
			allow_withdrawal: true,
			withdrawal_fee: 0.0001,
			min: 0.0001,
			max: 100000,
			increment_unit: 0.001,
			deposit_limits: {},
			withdrawal_limits: {},
		},
	},
	constants: {},
	config_level: {},
	info: { is_trial: false, active: true, status: true },
	enabledPlugins: [],
	plugins: [],
	pluginNames: {},
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
	tradeTab: 0,
	broker: {},
	user_payments: {},
	onramp: {},
	offramp: {},
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
				broker: payload.broker,
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
					let close =
						pairTrade && pairTrade.price
							? pairTrade.price
							: temp.close
							? temp.close
							: 0;
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
					const { icon, string, ...rest } = meta;
					remoteRoutes.push({
						target: generateDynamicTarget(name, 'page'),
						icon_id: globalize(name)(icon),
						string_id: globalize(name)(string),
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
						type,
						currency,
					} = meta;
					if (is_page) {
						target = generateDynamicTarget(name, 'page');
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
		case SET_TRADE_TAB: {
			return {
				...state,
				tradeTab: payload,
			};
		}
		default:
			return state;
	}
};

export default reducer;
